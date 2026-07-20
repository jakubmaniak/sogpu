import { gpu, WindowInstance } from '../src/index.js';


const adapterRequest = gpu.requestAdapter({
    powerPreference: 'high-performance',
    backendType: process.platform == 'darwin' ? 'Metal' : 'Vulkan'
} satisfies (GPURequestAdapterOptions & { backendType: string }) as any);


const win = new WindowInstance(1280, 720, 'My GLFW Window');


const adapter = await adapterRequest;
if (!adapter) {
    throw new Error('Failed to request GPU adapter.');
}

const device = await adapter.requestDevice();

const ctx = win.getContext();
ctx.configure({ device, width: 1280, height: 720 });



function init() {
    const shader = device.createShaderModule({
        code: /*wgsl*/`
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
                return vec4<f32>(1.0, 1.0, 0.0, 1.0);
            }
        `
    });

    const pipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: { module: shader },
        fragment: {
            module: shader,
            targets: [{ format: 'bgra8unorm' }]
        },
    });

    return { pipeline };
}


const passDesc = {
    colorAttachments: [{
        view: null as unknown as GPUTextureView,
        loadOp: 'clear',
        storeOp: 'store',
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.5 }
    }] as GPURenderPassColorAttachment[]
} satisfies GPURenderPassDescriptor;


function render() {
    const encoder = device.createCommandEncoder();

    passDesc.colorAttachments[0].view = ctx.getCurrentTextureView();

    const pass = encoder.beginRenderPass(passDesc);
    pass.setPipeline(pipeline);
    pass.draw(3);
    pass.end();

    const commandBuffer = encoder.finish();
    device.queue.submit([commandBuffer]);

    ctx.present();
}


win.pollEvents();
const { pipeline } = init();

while (!win.shouldClose()) {
    win.pollEvents();
    render();
}


win.destroy();
// glfw.terminate();
device.destroy();
gpu.destroy();