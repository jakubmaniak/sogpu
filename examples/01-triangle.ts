// import { gpu, WindowInstance } from 'sogpu';
import { gpu, WindowInstance } from '../src/index.js';


const adapter = await gpu.requestAdapter();
if (!adapter) {
    throw new Error('Failed to request GPU adapter.');
}

const device = await adapter.requestDevice();

const win = new WindowInstance(1280, 720, 'SoGPU - Triangle Example');

const ctx = win.getContext();
const preferredFormat = gpu.getPreferredCanvasFormat();
ctx.configure({ device, width: 1280, height: 720, format: preferredFormat });


function init() {
    const shader = device.createShaderModule({
        code: /*wgsl*/`
            @vertex
            fn vs(@builtin(vertex_index) vertexIndex: u32) -> @builtin(position) vec4f {
                let pos = array<vec2f, 3>(
                    vec2f(0.0, 0.5),
                    vec2f(-0.5, -0.5),
                    vec2f(0.5, -0.5)
                );
                return vec4f(pos[vertexIndex], 0.0, 1.0);
            }

            @fragment
            fn fs() -> @location(0) vec4f {
                return vec4f(1.0, 1.0, 0.0, 1.0);
            }
        `
    });

    const pipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: { module: shader },
        fragment: {
            module: shader,
            targets: [{ format: preferredFormat }]
        },
    });

    return { pipeline };
}


const passDesc = {
    colorAttachments: [{
        view: null as unknown as GPUTextureView,
        loadOp: 'clear',
        storeOp: 'store',
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 }
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
device.destroy();
gpu.destroy();