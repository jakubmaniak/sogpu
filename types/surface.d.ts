import { type Pointer } from 'bun:ffi';
import { type GLFWAdapter } from './glfw/adapter.js';
import { type Extent2D } from './gpu.js';
import type { HTMLCanvasElement } from './browser/canvas-element.js';
export type SurfaceConfiguration = {
    device: GPUDevice;
    size?: Extent2D;
    format?: 'rgba8unorm' | 'bgra8unorm' | 'rgba16float' | GPUTextureFormat;
    usage?: number;
    alphaMode?: 'opaque' | 'premultiplied';
    vsync?: boolean;
    toneMapping?: {
        mode: 'standard' | 'extended';
    };
    colorSpace?: 'srgb' | 'display-p3';
};
export declare class SurfaceContext {
    private glfw;
    private _lib;
    private _instancePtr;
    private _textureCtr;
    private config?;
    private window;
    private surface;
    private size?;
    private currentTexture;
    private currentTextureView;
    readonly canvas?: HTMLCanvasElement;
    constructor(gpu: GPU, glfw: GLFWAdapter, window: Pointer);
    configure(config: SurfaceConfiguration): void;
    private wrapQueueSubmit;
    getCurrentTextureView(): GPUTextureView;
    /**
     * @deprecated
     * This method exists only for compatibility.
     *
     * Use `getCurrentTextureView()` instead for better performance and memory management.
     */
    getCurrentTexture(): GPUTexture;
    present(): void;
}
