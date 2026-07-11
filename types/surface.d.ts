/// <reference types="bun-types" />
/// <reference types="@webgpu/types" />
/// <reference types="bun-webgpu" />
import { Pointer } from 'bun:ffi';
import type { GLFWAdapter } from './glfw/adapter.js';
declare type WindowHandles = {
    display: Pointer | null;
    window: Pointer | bigint;
};
export declare function createSurface(lib: any, instance: Pointer, handles: WindowHandles): Pointer | null;
export declare type SurfaceConfiguration = {
    device: GPUDevice;
    width: number;
    height: number;
    format?: 'rgba8unorm' | 'bgra8unorm' | 'rgba16float';
    usage?: number;
    alphaMode?: string;
    vsync?: boolean;
};
export declare function configureSurface(lib: any, surface: Pointer, config: SurfaceConfiguration): any;
export declare function getCurrentTexture(lib: any, surface: Pointer): bigint;
export declare function getCurrentTextureView(lib: any, texture: bigint): Pointer;
export declare function present(lib: any, surface: Pointer): any;
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
export {};
