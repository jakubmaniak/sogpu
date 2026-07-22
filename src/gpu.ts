import { createGPUInstance } from 'bun-webgpu';
import { toArrayBuffer } from 'bun:ffi';


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


export function addGPUErrorHandler(adapter: GPUAdapter) {
    (adapter as any).handleUncapturedError = (devicePtr: any, typeInt: any, msgArg: any, sizeOrUserdata1: any, ud1: any, ud2: any) => {
        let message = '[empty message]';
        try {
            if (msgArg) {
                if (process.platform == 'win32') {
                    const svBuf = toArrayBuffer(msgArg, 0, 16);
                    const dv = new DataView(svBuf);
                    const dataPtr = dv.getBigUint64(0, true);
                    const len = Number(dv.getBigUint64(8, true));
                    if (dataPtr !== 0n && len > 0 && len < 10000) {
                        const strBuf = toArrayBuffer(Number(dataPtr) as any, 0, len);
                        message = new TextDecoder().decode(strBuf);
                    }
                }
                else {
                    const strBuf = toArrayBuffer(msgArg, 0, 1024);
                    const bytes = new Uint8Array(strBuf);
                    const nulPos = bytes.indexOf(0);
                    const end = nulPos == -1 ? bytes.length : nulPos;
                    message = new TextDecoder().decode(bytes.subarray(0, end));
                }
            }
        }
        catch { }
        console.error(`[WebGPU] Error (type=${typeInt}): ${message}`);
        process.exit(1);
    };
}