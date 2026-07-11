import { addGPUErrorHandler, createMappedBuffer, extendDevice, gpu, GPUBufferUsage, GPUShaderStage, WindowInstance, type GPUBufferSource } from '../src/index.js';


const adapterRequest = gpu.requestAdapter({
    powerPreference: 'high-performance',
    backendType: 'Vulkan'
} satisfies (GPURequestAdapterOptions & { backendType: string }) as any);


const win = new WindowInstance(1280, 720, 'My GLFW Window');


const adapter = await adapterRequest;
if (!adapter) {
    throw new Error('Failed to request GPU adapter.');
}

const device = extendDevice(await adapter.requestDevice(), {
    createMappedBuffer(this: GPUDevice, data: GPUBufferSource, usage: number) {
        return createMappedBuffer(this, data, usage);
    }
});


addGPUErrorHandler(adapter);

const ctx = win.getContext();
ctx.configure({ device, width: 1280, height: 720 });


function init() {
    const uniformData = new Float32Array([performance.now() / 1000]);
    const uniformBuffer = device.createMappedBuffer(uniformData, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);

    const ubl = device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                buffer: { type: 'uniform' }
            },
        ]
    });

    const ubg = device.createBindGroup({
        layout: ubl,
        entries: [
            {
                binding: 0,
                resource: { buffer: uniformBuffer }
            }
        ]
    });

    const shader = device.createShaderModule({
        code: /*wgsl*/`
            struct Uniforms {
                time: f32
            }

            @group(0) @binding(0) var<uniform> u: Uniforms;

            @vertex
            fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> @builtin(position) vec4<f32> {
                var pos = array<vec2<f32>, 3>(
                    vec2<f32>(0.0, 0.5),
                    vec2<f32>(-0.5, -0.5),
                    vec2<f32>(0.5, -0.5)
                );
                return vec4<f32>(pos[vertexIndex], 0.0, 1.0);
            }

            @fragment
            fn fs_main() -> @location(0) vec4<f32> {
                return vec4<f32>(1.0, abs(sin(u.time)), 0.0, 1.0);
            }
        `
    });

    const pipeline = device.createRenderPipeline({
        layout: device.createPipelineLayout({ bindGroupLayouts: [ubl] }),
        vertex: { module: shader },
        fragment: {
            module: shader,
            targets: [{ format: 'bgra8unorm' }]
        },
    });

    return { pipeline, uniformBuffer, ubg };
}


const passDesc = {
    colorAttachments: [{
        view: null as unknown as GPUTextureView,
        loadOp: 'clear',
        storeOp: 'discard',
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.5 }
    }] as GPURenderPassColorAttachment[]
} satisfies GPURenderPassDescriptor;


function render() {
    device.queue.writeBuffer(uniformBuffer, 0, new Float32Array([performance.now() / 1000]));

    const encoder = device.createCommandEncoder();

    passDesc.colorAttachments[0].view = ctx.getCurrentTextureView();

    const pass = encoder.beginRenderPass(passDesc);
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, ubg);
    pass.draw(3);
    pass.end();

    const commandBuffer = encoder.finish();
    device.queue.submit([commandBuffer]);

    ctx.present();
}


win.pollEvents();
const { pipeline, uniformBuffer, ubg } = init();

while (!win.shouldClose()) {
    win.pollEvents();
    render();
}


win.destroy();
// glfw.terminate();
device.destroy();
gpu.destroy();