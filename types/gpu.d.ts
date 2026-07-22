import { createGPUInstance } from 'bun-webgpu';
export declare enum GPUBufferUsage {
    MAP_READ = 1,
    MAP_WRITE = 2,
    COPY_SRC = 4,
    COPY_DST = 8,
    INDEX = 16,
    VERTEX = 32,
    UNIFORM = 64,
    STORAGE = 128,
    INDIRECT = 256,
    QUERY_RESOLVE = 512
}
export declare enum GPUTextureUsage {
    COPY_SRC = 1,
    COPY_DST = 2,
    TEXTURE_BINDING = 4,
    STORAGE_BINDING = 8,
    RENDER_ATTACHMENT = 16,
    TRANSIENT_ATTACHMENT = 32
}
export declare enum GPUShaderStage {
    VERTEX = 1,
    FRAGMENT = 2,
    COMPUTE = 4
}
export type GPUBufferSource = Float32Array<ArrayBufferLike> | Uint32Array<ArrayBufferLike> | Uint16Array<ArrayBufferLike>;
type GPU = ReturnType<typeof createGPUInstance>;
export declare const gpu: GPU;
export declare function extendDevice<T>(device: GPUDevice, props: T): GPUDevice & T;
export declare function createMappedBuffer<T extends GPUBufferSource>(device: GPUDevice, data: T, usage: number): GPUBuffer;
export declare function addGPUErrorHandler(adapter: GPUAdapter): void;
export {};
