import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three/webgpu';
import { attachDOM, gpu, WindowFrame } from '../src/index.js';


const adapter = await gpu.requestAdapter();
const device = await adapter?.requestDevice();
if (!device) {
    throw new Error('No GPU adapter/device found');
}


const win = new WindowFrame(1280, 720, 'SoGPU - Basic Three.js Example');
const ctx = win.getContext();

attachDOM(win, 60);


setInterval(() => {
    win.pollEvents();
    if (win.shouldClose()) process.exit(0);
}, 16);




const renderer = new THREE.WebGPURenderer({
    device,
    context: ctx,
    antialias: true,
    alpha: false
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