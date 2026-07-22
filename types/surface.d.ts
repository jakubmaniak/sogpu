import { type Pointer } from 'bun:ffi';
import { type GLFWAdapter } from './glfw/adapter.js';
export type SurfaceConfiguration = {
    device: GPUDevice;
    width: number;
    height: number;
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
    private initialized;
    private _lib;
    private _instancePtr;
    private window;
    private surface;
    private currentTexture;
    private currentTextureView;
    constructor(gpu: GPU, glfw: GLFWAdapter, window: Pointer);
    configure(config: SurfaceConfiguration): void;
    private wrapDevice;
    getCurrentTextureView(): GPUTextureView;
    present(): void;
}
