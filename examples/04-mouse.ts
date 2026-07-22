import { addGPUErrorHandler, createMappedBuffer, extendDevice, gpu, GPUBufferUsage, GPUShaderStage, WindowInstance, type GPUBufferSource } from '../src/index.js';


const adapterRequest = gpu.requestAdapter({ powerPreference: 'high-performance' });

const win = new WindowInstance(1280, 720, 'SoGPU  \u2013  Mouse Example');
win.setResizable(true);

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
const preferredFormat = gpu.getPreferredCanvasFormat();
ctx.configure({ device, width: 1280, height: 720, format: preferredFormat });


function init() {
    const uniformData = new Float32Array([0, 0, 0, 1, 1, 1]);
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
                mouseX: f32,
                mouseY: f32,
                mousePressed: f32,
                windowWidth: f32,
                windowHeight: f32,
                windowAspect: f32
            }

            @group(0) @binding(0) var<uniform> u: Uniforms;

            @vertex
            fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> @builtin(position) vec4<f32> {
                let pos = array<vec2<f32>, 6>(
                    vec2f(-1.0,  1.0),
                    vec2f(-1.0, -1.0),
                    vec2f( 1.0, -1.0),
                    vec2f(-1.0,  1.0),
                    vec2f( 1.0, -1.0),
                    vec2f( 1.0,  1.0)
                );
                let offset = vec2<f32>(
                    1.0 - u.mouseX / u.windowWidth - 0.5,
                    u.mouseY / u.windowHeight - 0.5 
                ) * 2.0;
                return vec4<f32>(pos[vertexIndex] * 0.05 * vec2f(1.0, u.windowAspect) - offset, 0.0, 1.0);
            }

            @fragment
            fn fs_main() -> @location(0) vec4<f32> {
                return vec4<f32>(1.0, 1.0, 1.0 - u.mousePressed, 1.0);
            }
        `
    });

    const pipeline = device.createRenderPipeline({
        layout: device.createPipelineLayout({ bindGroupLayouts: [ubl] }),
        vertex: { module: shader },
        fragment: {
            module: shader,
            targets: [{ format: preferredFormat }]
        },
    });

    return { pipeline, uniformBuffer, ubg };
}


const passDesc = {
    colorAttachments: [{
        view: null as unknown as GPUTextureView,
        loadOp: 'clear',
        storeOp: 'store',
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 }
    }] as GPURenderPassColorAttachment[]
} satisfies GPURenderPassDescriptor;
let lastWindowSize = win.getSize();


function render() {
    updateUniforms();

    const encoder = device.createCommandEncoder();

    passDesc.colorAttachments[0].view = ctx.getCurrentTextureView();

    const pass = encoder.beginRenderPass(passDesc);
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, ubg);
    pass.draw(6);
    pass.end();

    const commandBuffer = encoder.finish();
    device.queue.submit([commandBuffer]);

    ctx.present();
}

function updateUniforms() {
    const mousePos = win.getMousePosition();
    const windowSize = win.getSize();

    device.queue.writeBuffer(uniformBuffer, 0, new Float32Array([
        mousePos.x, mousePos.y,
        win.isMouseButtonPressed(0) ? 1.0 : 0.0,
        windowSize.width, windowSize.height,
        windowSize.width / windowSize.height
    ]));
}


win.pollEvents();
const { pipeline, uniformBuffer, ubg } = init();

while (!win.shouldClose()) {
    win.pollEvents();
    render();
}


win.destroy();
device.destroy();
gpu.destroy();