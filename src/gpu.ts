import { createGPUInstance } from 'bun-webgpu';
import { toArrayBuffer, type Pointer } from 'bun:ffi';
import { toExternalSource, type GPUExternalDataSource } from './external-source.js';


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

globalThis.GPUTextureUsage = GPUTextureUsage;
globalThis.GPUBufferUsage = GPUBufferUsage;
globalThis.GPUShaderStage = GPUShaderStage;


export type Extent2D = {
    width: number;
    height: number;
};

export type GPUBufferSource = Float32Array<ArrayBufferLike>
    | Uint32Array<ArrayBufferLike>
    | Uint16Array<ArrayBufferLike>;


type GPU = {
    requestAdapter(options?: GPUAdapterRequestOptions): Promise<GPUAdapter | null>;
} & ReturnType<typeof createGPUInstance>;

type GPUAdapterRequestOptions = GPURequestAdapterOptions & {
    /**
     * Used on **Windows** to select the preffered WebGPU backend.
     * Ignored on other platforms.
     * 
     * - `"dx12"` - use DirectX 12 if available; otherwise, fall back to DirectX 11, then Vulkan.
     * - `"dx11"` - use DirectX 11 if available; otherwise, Vulkan.
     * - `"vulkan"` - use Vulkan if available; otherwise, DirectX 11.
     * 
     * Default: `"vulkan"`.
    */
    preferBackend?: 'dx12' | 'dx11' | 'vulkan';
};

export const gpu: GPU = createGPUInstance();
const requestAdapterFn = gpu.requestAdapter.bind(gpu);

gpu.requestAdapter = async function(options?: GPUAdapterRequestOptions) {
    async function request(backendType: string) {
        const adapter = await requestAdapterFn({
            ...options,
            backendType,
        } satisfies GPUAdapterRequestOptions & { backendType: string } as any);

        if (adapter) wrapAdapter(adapter);
        return adapter;
    }

    if (process.platform == 'win32') {
        const preferred = options?.preferBackend ?? 'vulkan';
        const backendCandidates = {
            'dx11': ['D3D11', 'Vulkan'],
            'dx12': ['D3D12', 'D3D11', 'Vulkan'],
            'vulkan': ['Vulkan', 'D3D11']
        }[preferred] ?? ['Vulkan', 'D3D11'];

        for (const backendType of backendCandidates) {
            const adapter = await request(backendType).catch(() => null);
            if (adapter) return adapter;
        }

        return null;
    }

    return request(process.platform == 'darwin' ? 'Metal' : 'Vulkan');
};


function wrapAdapter(adapter: GPUAdapter) {
    const requestDeviceFn = adapter.requestDevice.bind(adapter);

    adapter.requestDevice = async function(desc) {
        const device = await requestDeviceFn(desc);

        if (device) wrapQueue(device);
        return device;
    };
}


function wrapQueue(device: GPUDevice) {
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

    function copyExternalImageToTexture(src: GPUCopyExternalImageSourceInfo, dst: GPUCopyExternalImageDestInfo, size: GPUExtent3DStrict): undefined {
        if (!(toExternalSource in src.source)) {
            throw new Error('copyExternalImageToTexture: Unsupported source.');
        }

        const provider = src.source as GPUExternalDataSource;
        const source = provider[toExternalSource]();

        device.queue.writeTexture(
            {
                texture: dst.texture,
                origin: dst.origin,
                mipLevel: dst.mipLevel,
                aspect: dst.aspect
            },
            source.data,
            {
                bytesPerRow: source.bytesPerRow,
                rowsPerImage: source.rowsPerImage
            },
            size
        );
    }

    queue.submit = submit.bind(queue);
    queue.copyExternalImageToTexture = copyExternalImageToTexture.bind(queue);
}



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
        const typeText = errorTypes[errType as keyof typeof errorTypes];
        let message = '[empty message]';

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