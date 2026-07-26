import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import * as THREE from 'three/webgpu';
import { attachDOM, gpu, WindowFrame } from '../src/index.js';
import { Window } from '../types/browser/dom/window.js';


const adapter = await gpu.requestAdapter();
const device = await adapter?.requestDevice();
if (!device) {
    throw new Error('No GPU adapter/device found');
}


const win = new WindowFrame(1280, 720, 'SoGPU - Three.js glTF & HDRI Example');
win.setResizable(true);
const context = win.getContext();

setInterval(() => {
    win.pollEvents();
    if (win.shouldClose()) process.exit(0);
}, 16);



declare const window: Window;
attachDOM(win, 60);



const rootDirUrl = import.meta.resolve('./');
THREE.DefaultLoadingManager
    .setURLModifier((url) => new URL(url, rootDirUrl).href);




// Based on: https://threejs.org/examples/#webgpu_loader_gltf_iridescence


let renderer: THREE.WebGPURenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    controls: OrbitControls;

init().catch(function (err) {
    console.error(err);
});

async function init() {
    renderer = new THREE.WebGPURenderer({ device, context, antialias: true });
    renderer.setAnimationLoop(render);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x101010);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.05, 20);
    camera.position.set(0.35, 0.05, 0.35);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = -0.5;
    controls.target.set(0, 0.2, 0);
    controls.update();

    const hdrLoader = new HDRLoader().setPath('textures/equirectangular/');
    const gltfLoader = new GLTFLoader().setPath('models/gltf/');

    const [texture, gltf] = await Promise.all([
        hdrLoader.loadAsync('venice_sunset_1k.hdr'),
        gltfLoader.loadAsync('IridescenceLamp.glb'),
    ]);

    // environment

    texture.mapping = THREE.EquirectangularReflectionMapping;

    scene.background = texture;
    scene.environment = texture;

    // model

    scene.add(gltf.scene);

    render();

    window.addEventListener('resize', onWindowResize);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();
}


function render() {
    controls.update();
    renderer.render(scene, camera);

    context.present();
}