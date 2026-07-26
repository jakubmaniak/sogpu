import { dlopen, ptr, type Pointer } from 'bun:ffi';
import type { HTMLCanvasElement } from './browser/elements/canvas-element.js';
import { type GLFWAdapter } from './glfw/adapter.js';
import { gpu, GPUTextureUsage, type Extent2D } from './gpu.js';
import { getPlatformType, resolveLibPath } from './platform.js';


type WindowHandles = {
    display: Pointer | null;
    window: Pointer | bigint;
};


function createSurface(lib: any, instance: Pointer, handles: WindowHandles, config: SurfaceConfiguration): Pointer | null {
    const chain = getSurfaceChain(handles, config);

    const descriptor = new Uint8Array(24);
    const view = new DataView(descriptor.buffer);
    view.setBigUint64(0, BigInt(ptr(chain)), true);

    return lib.wgpuInstanceCreateSurface(instance, ptr(descriptor)) ?? null;
}


function getSurfaceChain(handles: WindowHandles, config: SurfaceConfiguration) {
    const { display, window } = handles;

    switch (getPlatformType()) {
        case 'win32':
            return win32Chain(window as Pointer);
        case 'wayland':
            return waylandChain(display!, window as Pointer);
        case 'x11':
            return x11Chain(display!, window as bigint);
        case 'cocoa':
            return cocoaChain(window as Pointer, config);
    }
}


const textureFormats = {
    rgba8unorm: 18,
    bgra8unorm: 23,
    // rgb10a2unorm: 26,
    rgba16float: 34
};

const surfaceSourceMetalLayer     = 0x00000004;
const surfaceSourceWindowsHWND    = 0x00000005;
const surfaceSourceXlibWindow     = 0x00000006;
const surfaceSourceWaylandSurface = 0x00000007;


function win32Chain(window: Pointer) {
    const { symbols: k32 } = dlopen('kernel32.dll', {
        GetModuleHandleW: {
            returns: 'pointer',
            args: ['pointer']
        }
    });

    const hinstancePtr = k32.GetModuleHandleW(null);
    if (!hinstancePtr) {
        throw new Error('Failed to get HINSTANCE.');
    }

    const chain = new Uint8Array(32);
    const view = new DataView(chain.buffer);
    view.setUint32(8, surfaceSourceWindowsHWND, true);
    view.setBigUint64(16, BigInt(hinstancePtr), true);
    view.setBigUint64(24, BigInt(window), true);

    return chain as Buffer;
}


function x11Chain(display: Pointer, window: bigint) {
    const chain = new Uint8Array(32);
    const view = new DataView(chain.buffer);
    view.setUint32(8, surfaceSourceXlibWindow, true);
    view.setBigUint64(16, BigInt(display), true);
    view.setBigUint64(24, BigInt(window), true);
    return chain as Buffer;
}


function waylandChain(display: Pointer, waylandSurface: Pointer) {
    const chain = new Uint8Array(32);
    const view = new DataView(chain.buffer);
    view.setUint32(8, surfaceSourceWaylandSurface, true);
    view.setBigUint64(16, BigInt(display), true);
    view.setBigUint64(24, BigInt(waylandSurface), true);
    return chain as Buffer;
}

function cocoaChain(window: Pointer, config: SurfaceConfiguration) {
    const libPath = resolveLibPath('./lib/libmetallayer.dylib');

    const { symbols: lib } = dlopen(libPath, {
        createMetalLayer: {
            returns: 'pointer',
            args: ['pointer', 'bool', 'bool', 'bool']
        },
    });

    const hdr = (config.toneMapping?.mode == 'extended');
    const displayP3 = (config.colorSpace == 'display-p3');

    const layer = lib.createMetalLayer(window, true, hdr, displayP3);
    if (!layer) {
        throw new Error('CAMetalLayer creating error');
    }

    const chain = new Uint8Array(24);
    const view = new DataView(chain.buffer);
    view.setUint32(8, surfaceSourceMetalLayer, true);
    view.setBigUint64(16, BigInt(layer), true);
    return chain as Buffer;
}


export type SurfaceConfiguration = {
    device: GPUDevice;
    size?: Extent2D;
    format?: 'rgba8unorm' | 'bgra8unorm' | 'rgba16float' | GPUTextureFormat;
    usage?: number;
    alphaMode?: 'opaque' | 'premultiplied';
    vsync?: boolean;
    toneMapping?: { mode: 'standard' | 'extended' };
    colorSpace?: 'srgb' | 'display-p3';
};

function configureSurface(lib: any, surface: Pointer, config: SurfaceConfiguration, size: Extent2D) {
    const devicePtr = config.device.ptr;

    const formatKey = config.format ?? gpu.getPreferredCanvasFormat();
    if (!(formatKey in textureFormats)) {
        throw new Error('Invalid or unknown surface format');
    }

    const format = textureFormats[formatKey as keyof typeof textureFormats];
    const usage = config.usage ?? GPUTextureUsage.RENDER_ATTACHMENT;

    // 0 - Auto, 1 - Opaque, 2 - PreMultiplied, 3 - PostMultiplied, 4 - Inherit
    const alphaMode = config.alphaMode == 'premultiplied' ? 2 : 1;

    // 1 - fifo, 2 - fifo-relaxed, 3 - immediate, 4 - mailbox
    const presentMode = (config.vsync ?? true) ? 1 : 3;


    const buffer = new Uint8Array(64);
    const view = new DataView(buffer.buffer);
    view.setBigUint64(8, BigInt(devicePtr), true);
    view.setUint32(16, format, true);
    view.setBigUint64(24, BigInt(usage), true);
    view.setUint32(32, size.width, true);
    view.setUint32(36, size.height, true);
    view.setUint32(56, alphaMode, true);
    view.setUint32(60, presentMode, true);

    return lib.wgpuSurfaceConfigure(surface, ptr(buffer)) ?? null;
}


function getCurrentTexture(lib: any, surface: Pointer): bigint {
    const buffer = Buffer.alloc(24);
    lib.wgpuSurfaceGetCurrentTexture(surface, ptr(buffer));

    const view = new DataView(buffer.buffer);
    return view.getBigUint64(8, true);
}

function getCurrentTextureView(lib: any, texture: bigint): Pointer {
    return lib.wgpuTextureCreateView(Number(texture), null);
}


export class SurfaceContext {
    private _lib: any;
    private _instancePtr: Pointer;
    private _textureCtr!: new(...args: any[]) => GPUTexture;

    private config?: SurfaceConfiguration;
    private window: Pointer;
    private surface: Pointer | null = null;
    private size?: Extent2D;
    private currentTexture: bigint | null = null;
    private currentTextureView: Pointer | null = null;

    readonly canvas?: HTMLCanvasElement;

    constructor(gpu: GPU, private glfw: GLFWAdapter, window: Pointer) {
        if (!('lib' in gpu)) {
            throw new Error('Cannot access WebGPU lib property');
        }
        this._lib = gpu.lib;

        if (!('instancePtr' in gpu)) {
            throw new Error('Cannot access WebGPU instancePtr property');
        }
        this._instancePtr = gpu.instancePtr as Pointer;

        this.window = window;
    }

    configure(config: SurfaceConfiguration) {
        const handles = this.glfw.getChainHandles(this.window);
        const size = this.glfw.getWindowSize(this.window);

        const surface = createSurface(
            this._lib,
            this._instancePtr,
            handles,
            config
        );
        if (!surface) {
            throw new Error('Cannot create surface');
        }

        this.surface = surface;
        this.size = size;

        configureSurface(this._lib, this.surface, config, size);
        this.config = { ...config };

        if (!this._textureCtr) {
            const tex = config.device.createTexture({
                size: [1, 1],
                format: 'rgba8unorm',
                usage: 1
            });
            this._textureCtr = (tex as any).__proto__.constructor;
        }
    }

    getCurrentTextureView() {
        if (!this.surface) {
            throw new Error('Surface context is not configured');
        }

        const texture = getCurrentTexture(this._lib, this.surface!);
        const pointer = getCurrentTextureView(this._lib, texture);

        this.currentTexture = texture;
        this.currentTextureView = pointer;

        return {
            __brand: 'GPUTextureView',
            ptr: pointer,
            destroy() { }
        } as GPUTextureView;
    }

    /**
     * @deprecated
     * This method exists only for compatibility.
     * 
     * Use `getCurrentTextureView()` instead for better performance and memory management.
     */
    getCurrentTexture() {
        if (!this.surface) {
            throw new Error('Surface context is not configured');
        }

        const texture = getCurrentTexture(this._lib, this.surface!);

        this.currentTexture = texture;

        const usage = this.config!.usage ?? 16;
        const format = (textureFormats as any)[this.config!.format ?? 'bgra8unorm'];

        return new this._textureCtr(
            Number(texture),
            this._lib,
            this.size!.width, this.size!.height, 1,
            format, 2, 1, 1, usage
        );
    }

    present() {
        this._lib.wgpuSurfacePresent(this.surface);

        this.currentTextureView && this._lib.wgpuTextureViewRelease(this.currentTextureView);
        this.currentTexture && this._lib.wgpuTextureRelease(Number(this.currentTexture));

        this.currentTextureView = null;
        this.currentTexture = null;
    }
}