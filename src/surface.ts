import { fileURLToPath } from 'bun';
import { dlopen, ptr, type Pointer } from 'bun:ffi';
import path from 'node:path';
import { type GLFWAdapter } from './glfw/adapter.js';
import { getPlatformType } from './platform.js';


const WGPUSType_SurfaceSourceMetalLayer     = 0x00000004;
const WGPUSType_SurfaceSourceWindowsHWND    = 0x00000005;
const WGPUSType_SurfaceSourceXlibWindow     = 0x00000006;
const WGPUSType_SurfaceSourceWaylandSurface = 0x00000007;

type WindowHandles = {
    display: Pointer | null;
    window: Pointer | bigint;
};


function createSurface(lib: any, instance: Pointer, handles: WindowHandles): Pointer | null {
    const chain = getSurfaceChain(handles);

    const descriptor = new Uint8Array(24);
    const view = new DataView(descriptor.buffer);
    view.setBigUint64(0, BigInt(ptr(chain)), true);

    return lib.wgpuInstanceCreateSurface(instance, ptr(descriptor)) ?? null;
}


function getSurfaceChain(handles: WindowHandles) {
    const { display, window } = handles;

    switch (getPlatformType()) {
        case 'win32':
            return win32Chain(window as Pointer);
        case 'wayland':
            return waylandChain(display!, window as Pointer);
        case 'x11':
            return x11Chain(display!, window as bigint);
        case 'cocoa':
            return cocoaChain(window as Pointer);
    }
}


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
    view.setUint32(8, WGPUSType_SurfaceSourceWindowsHWND, true);
    view.setBigUint64(16, BigInt(hinstancePtr), true);
    view.setBigUint64(24, BigInt(window), true);

    return chain as Buffer;
}


function x11Chain(display: Pointer, window: bigint) {
    const chain = new Uint8Array(32);
    const view = new DataView(chain.buffer);
    view.setUint32(8, WGPUSType_SurfaceSourceXlibWindow, true);
    view.setBigUint64(16, BigInt(display), true);
    view.setBigUint64(24, BigInt(window), true);
    return chain as Buffer;
}


function waylandChain(display: Pointer, waylandSurface: Pointer) {
    const chain = new Uint8Array(32);
    const view = new DataView(chain.buffer);
    view.setUint32(8, WGPUSType_SurfaceSourceWaylandSurface, true);
    view.setBigUint64(16, BigInt(display), true);
    view.setBigUint64(24, BigInt(waylandSurface), true);
    return chain as Buffer;
}

function cocoaChain(window: Pointer) {
    const libPath = './lib/libmetallayer.dylib';
    const resolvedPath = import.meta.file == 'surface.ts'
        ? path.resolve(libPath)
        : fileURLToPath(import.meta.resolve(libPath));

    const { symbols: lib } = dlopen(resolvedPath, {
        createMetalLayer: {
            returns: 'pointer',
            args: ['pointer']
        },
    });

    const layer = lib.createMetalLayer(window);
    if (!layer) {
        throw new Error('CAMetalLayer creating error');
    }

    const chain = new Uint8Array(24);
    const view = new DataView(chain.buffer);
    view.setUint32(8, WGPUSType_SurfaceSourceMetalLayer, true);
    view.setBigUint64(16, BigInt(layer), true);
    return chain as Buffer;
}


export type SurfaceConfiguration = {
    device: GPUDevice;
    width: number;
    height: number;
    format?: 'rgba8unorm' | 'bgra8unorm' | 'rgba16float';
    usage?: number;
    alphaMode?: string;
    vsync?: boolean;
};

function configureSurface(lib: any, surface: Pointer, config: SurfaceConfiguration) {
    const devicePtr = config.device.ptr;

    const format = {
        rgba8unorm: 18,
        bgra8unorm: 23,
        rgba16float: 34,
        //rgba32float: 35,
    }[config.format ?? 'bgra8unorm'];

    if (!format) {
        throw new Error('Invalid surface format');
    }

    // 16 - RenderAttachment, 1 - CopySrc, 2 - CopyDst, 4 - TextureBinding, 8 - StorageBinding
    const usage = config.usage ?? 16;
    // 0 - Auto, 1 - Opaque, 2 - PreMultiplied, 3 - PostMultiplied, 4 - Inherit
    const alphaMode = 1;
    // 1 - fifo, 2 - fifo-relaxed, 3 - immediate, 4 - mailbox
    const presentMode = (config.vsync ?? true) ? 1 : 3;

    // const buffer = Buffer.alloc(64, 0);
    // const buffer = new Uint32Array(16);
    const buffer = new Uint8Array(64);
    const view = new DataView(buffer.buffer);
    view.setBigUint64(8, BigInt(devicePtr), true);
    view.setUint32(16, format, true);
    view.setBigUint64(24, BigInt(usage), true); // usage
    view.setUint32(32, config.width, true);
    view.setUint32(36, config.height, true);
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
    private initialized = false;
    private _lib: any;
    private _instancePtr: any;
    private window: Pointer;
    private surface: Pointer | null = null;
    private currentTexture: bigint | null = null;
    private currentTextureView: Pointer | null = null;


    constructor(gpu: GPU, private glfw: GLFWAdapter, window: Pointer) {
        if (!('lib' in gpu)) {
            throw new Error('Cannot access WebGPU lib property');
        }
        this._lib = gpu.lib;

        if (!('instancePtr' in gpu)) {
            throw new Error('Cannot access WebGPU instancePtr property');
        }
        this._instancePtr = gpu.instancePtr;

        this.window = window;
    }

    configure(config: SurfaceConfiguration) {
        if (this.initialized) {
            throw new Error('Surface context is already configured');
        }

        const handles = this.glfw.getChainHandles(this.window);
        const surface = createSurface(this._lib, this._instancePtr, handles);

        if (!surface) {
            throw new Error('Cannot create surface');
        }
        this.surface = surface;

        configureSurface(this._lib, this.surface, config);

        this.wrapDevice(config.device);
        this.initialized = true;
    }

    private wrapDevice(device: GPUDevice) {
        const queue = device.queue;
        const submitFn = queue.submit.bind(queue);

        function submit(commandBuffers: Iterable<GPUCommandBuffer>): undefined {
            submitFn(commandBuffers);

            // prevents memory leak
            // a command buffer is not reusable anyway
            // https://gpuweb.github.io/gpuweb/#dom-gpuqueue-submit
            for (const cmdBuf of commandBuffers) {
                cmdBuf._destroy();
            }
        }

        queue.submit = submit.bind(queue);
    }

    // getCurrentTexture() {
        // return getCurrentTexture(this._lib, this.surface!);
    // }

    // getCurrentTexture(): GPUTexture {
    //     const view = this.getCurrentTextureView();
    //     return {
    //         __brand: 'GPUTexture',
    //         ptr: Number(this.currentTexture!) as Pointer,
    //         destroy() { },
    //         createView: () => view,
    //     } as GPUTexture;
    // }

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

    present() {
        this._lib.wgpuSurfacePresent(this.surface);

        this.currentTextureView && this._lib.wgpuTextureViewRelease(this.currentTextureView);
        this.currentTexture && this._lib.wgpuTextureRelease(Number(this.currentTexture));

        this.currentTextureView = null;
        this.currentTexture = null;
    }
}