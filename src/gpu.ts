import { createGPUInstance } from 'bun-webgpu';
import { toArrayBuffer, type Pointer } from 'bun:ffi';


export enum GPUBufferUsage {
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

export enum GPUTextureUsage {
    COPY_SRC = 1,
    COPY_DST = 2,
    TEXTURE_BINDING = 4,
    STORAGE_BINDING = 8,
    RENDER_ATTACHMENT = 16,
    TRANSIENT_ATTACHMENT = 32
}

export enum GPUShaderStage {
    VERTEX = 1,
    FRAGMENT = 2,
    COMPUTE = 4
}


export type GPUBufferSource = Float32Array<ArrayBufferLike>
    | Uint32Array<ArrayBufferLike>
    | Uint16Array<ArrayBufferLike>;


type GPU = ReturnType<typeof createGPUInstance>;
export const gpu: GPU = createGPUInstance();
const requestAdapterFn = gpu.requestAdapter;

gpu.requestAdapter = function(options?: GPURequestAdapterOptions) {
    return requestAdapterFn.call(gpu, {
        ...options,
        backendType: process.platform == 'darwin' ? 'Metal' : 'Vulkan'
    } satisfies GPURequestAdapterOptions & { backendType: string } as any);
};


export function extendDevice<T>(device: GPUDevice, props: T) {
    return Object.assign(device, props);
}


export function createMappedBuffer<T extends GPUBufferSource>(device: GPUDevice, data: T, usage: number) {
    const buffer = device.createBuffer({
        size: (data.byteLength + 3) & ~3, // align to 4 bytes
        usage,
        mappedAtCreation: true,
    });

    new (data as any).constructor(buffer.getMappedRange()).set(data);

    buffer.unmap();
    return buffer;
}


const errorTypes = {
    1: 'NoError',
    2: 'Validation',
    3: 'OutOfMemory',
    4: 'Internal',
    5: 'Unknown'
};

export function addGPUErrorHandler(adapter: GPUAdapter) {
    (adapter as any).handleUncapturedError = (devicePtr: Pointer, errType: number, msgPtr: Pointer, msgSize: BigInt, ud1: any, ud2: any) => {
        let message = '[empty message]';
        let typeText = errorTypes[errType as keyof typeof errorTypes];

        if (msgPtr) {
            if (process.platform == 'win32') {
                const stringView = toArrayBuffer(msgPtr, 0, 16);
                const dv = new DataView(stringView);
                const dataPtr = dv.getBigUint64(0, true);
                const length = Number(dv.getBigUint64(8, true));

                if (dataPtr !== 0n && length > 0) {
                    const strBuf = toArrayBuffer(Number(dataPtr) as Pointer, 0, length);
                    message = new TextDecoder().decode(strBuf);
                }
            }
            else {
                const strBuf = toArrayBuffer(msgPtr, 0, Number(msgSize));
                message = new TextDecoder().decode(strBuf);
            }
        }

        console.error(`[WebGPU error] [${typeText}] ${message}`);
        process.exit(1);
    };
}