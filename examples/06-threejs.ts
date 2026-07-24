import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three/webgpu';
import { attachDOM, gpu, WindowInstance } from '../src/index.js';


const adapter = await gpu.requestAdapter();
const device = await adapter?.requestDevice();
if (!device) {
    throw new Error('No adapter/device found');
}


const window = new WindowInstance(1280, 720, 'SoGPU & Three.js');
const ctx = window.getContext();

setInterval(() => {
    window.pollEvents();
    if (window.shouldClose()) process.exit(0);
}, 16);

attachDOM(window, 60);




const renderer = new THREE.WebGPURenderer({
    device,
    context: ctx,
    // canvas: ctx.canvas as any as HTMLCanvasElement,
    antialias: true,
    samples: 4
});

const camera = new THREE.PerspectiveCamera(90, 1280/720, 0.1, 100);
camera.position.set(3, 1, 4);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101010);

const light = new THREE.DirectionalLight(0xfffffd);
scene.add(light);

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x4080ff })
);
scene.add(cube);


await renderer.init();
new OrbitControls(camera, renderer.domElement);


renderer.setAnimationLoop((time) => {
    renderer.render(scene, camera);
    ctx.present();
});