import { addGPUErrorHandler, gpu, GPUBufferUsage, GPUShaderStage, GPUTextureUsage, WindowInstance } from '../src/index.js';


const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
if (!adapter) {
    throw new Error('Failed to request GPU adapter.');
}

addGPUErrorHandler(adapter);

const device = await adapter.requestDevice();


const win = new WindowInstance(1280, 800, 'SoGPU - Cube Example');
win.setResizable(true);


const canvasSize = win.getSize();
const canvasFormat = gpu.getPreferredCanvasFormat();

const ctx = win.getContext();
ctx.configure({
    device,
    format: canvasFormat,
    vsync: false
});



const { depthView } = initDepth();
const { vertexBuffer, indexBuffer, indexCount } = initGeometry();
const { bindGroup, bindGroupLayout, uniformBuffer } = initBindGroups();


function initGeometry() {
    // [position x 3  +  color x 3]
    const vertices = new Float32Array([
        // front
        -1, -1, 1, 1, 0, 0,
        1, -1, 1, 0, 1, 0,
        1, 1, 1, 0, 0, 1,
        -1, 1, 1, 1, 1, 0,
        // back
        -1, -1, -1, 1, 0, 1,
        1, -1, -1, 0, 1, 1,
        1, 1, -1, 1, 1, 1,
        -1, 1, -1, 0, 0, 0,
    ]);

    const indices = new Uint16Array([
        0, 1, 2, 0, 2, 3,
        1, 5, 6, 1, 6, 2,
        5, 4, 7, 5, 7, 6,
        4, 0, 3, 4, 3, 7,
        3, 2, 6, 3, 6, 7,
        4, 5, 1, 4, 1, 0
    ]);
    const indexCount = indices.length;

    const vertexBuffer = device.createBuffer({
        size: vertices.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(vertexBuffer, 0, vertices);

    const indexBuffer = device.createBuffer({
        size: indices.byteLength,
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(indexBuffer, 0, indices);

    return { vertexBuffer, indexBuffer, indexCount };
}


function initBindGroups() {
    const uniformBuffer = device.createBuffer({
        size: 64,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const bindGroupLayout = device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                buffer: { type: 'uniform' },
                visibility: GPUShaderStage.VERTEX
            }
        ]
    });

    const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
            {
                binding: 0,
                resource: { buffer: uniformBuffer }
            }
        ]
    });

    return { uniformBuffer, bindGroupLayout, bindGroup };
}


const shader = device.createShaderModule({ code: /*wgsl*/`
    struct Uniforms {
        mvp: mat4x4f
    }

    @group(0) @binding(0) var<uniform> u: Uniforms;

    struct VertexIn {
        @location(0) pos: vec3f,
        @location(1) col: vec3f
    }

    struct VertexOut {
        @builtin(position) pos: vec4f,
        @location(0) col: vec3f
    }


    @vertex
    fn vs(in: VertexIn) -> VertexOut {
        var out: VertexOut;
        out.pos = u.mvp * vec4(in.pos, 1.0);
        out.col = in.col;

        return out;
    }

    @fragment
    fn fs(in: VertexOut) -> @location(0) vec4f {
        return vec4(in.col, 1.0);
    }
` });


function initDepth() {
    const depthTexture = device.createTexture({
        size: [canvasSize.width, canvasSize.height],
        format: 'depth24plus',
        usage: GPUTextureUsage.RENDER_ATTACHMENT
    });
    const depthView = depthTexture.createView();

    return { depthTexture, depthView };
}


const pipeline = device.createRenderPipeline({
    layout: device.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayout]
    }),
    vertex: {
        module: shader,
        buffers: [{
            arrayStride: 24,
            attributes: [
                {
                    shaderLocation: 0,
                    offset: 0,
                    format: 'float32x3'
                },
                {
                    shaderLocation: 1,
                    offset: 12,
                    format: 'float32x3'
                }
            ]
        }]
    },
    fragment: {
        module: shader,
        targets: [{ format: canvasFormat }]
    },
    primitive: {
        topology: 'triangle-list',
        cullMode: 'back'
    },
    depthStencil: {
        format: 'depth24plus',
        depthWriteEnabled: true,
        depthCompare: 'less'
    }
});



function updateUniform(time: number, mouse: { x: number, y: number }) {
    const proj = perspective(
        Math.PI / 4,
        canvasSize.width / canvasSize.height,
        0.1,
        100
    );

    const view = translation(0, 0, -10);

    let model = rotationY(time * 0.001 + mouse.x * 0.001);
    model = multiply(model, rotationX(-mouse.y * 0.001));

    const vp = multiply(proj, view);
    const mvp = multiply(vp, model);

    device.queue.writeBuffer(uniformBuffer, 0, mvp);
}


function render() {
    if (win.shouldClose()) return;
    win.pollEvents();


    const time = performance.now();
    const mouse = win.getMousePosition();

    updateUniform(time, mouse);


    const encoder = device.createCommandEncoder();
    const pass = encoder.beginRenderPass({
        colorAttachments: [{
            view: ctx.getCurrentTextureView(),
            clearValue: { r: 0.1, g: 0.1, b: 0.1, a: 1 },
            loadOp: 'clear',
            storeOp: 'store'
        }],
        depthStencilAttachment: {
            view: depthView,
            depthClearValue: 1,
            depthLoadOp: 'clear',
            depthStoreOp: 'store'
        }
    });

    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.setVertexBuffer(0, vertexBuffer);
    pass.setIndexBuffer(indexBuffer, 'uint16');
    pass.drawIndexed(indexCount);
    pass.end();

    device.queue.submit([encoder.finish()]);
    ctx.present();

    setTimeout(render, 16);
}

render();






////////////////////////////////////////////////////////////////////////////////
// matrix helpers
////////////////////////////////////////////////////////////////////////////////

function perspective(fovy: number, aspect: number, near: number, far: number) {
    const f = 1 / Math.tan(fovy / 2);
    return new Float32Array([
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, far / (near - far), -1,
        0, 0, (near * far) / (near - far), 0
    ]);
}

function rotationY(a: number) {
    const c = Math.cos(a);
    const s = Math.sin(a);
    return new Float32Array([
        c, 0, -s, 0,
        0, 1, 0, 0,
        s, 0, c, 0,
        0, 0, 0, 1
    ]);
}

function rotationX(a: number) {
    const c = Math.cos(a);
    const s = Math.sin(a);
    return new Float32Array([
        1, 0,  0, 0,
        0, c,  s, 0,
        0, -s, c, 0,
        0, 0,  0, 1
    ]);
}

function translation(x: number, y: number, z: number) {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        x, y, z, 1
    ]);
}

function multiply(a: Float32Array, b: Float32Array) {
    const r = new Float32Array(16);
    for (let c = 0; c < 4; c++)
        for (let row = 0; row < 4; row++) {
            r[c * 4 + row] =
                a[row]      * b[c * 4] +
                a[row + 4]  * b[c * 4 + 1] +
                a[row + 8]  * b[c * 4 + 2] +
                a[row + 12] * b[c * 4 + 3];
        }
    return r;
}