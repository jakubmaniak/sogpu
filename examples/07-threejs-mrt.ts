import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js';
import { diffuseColor, emissive, Fn, mix, mrt, normalView, output, packNormalToRGB, pass, screenUV, step } from 'three/tsl';
import * as THREE from 'three/webgpu';
import type { Window } from '../src/browser/dom/window.js';
import { attachDOM, gpu, WindowInstance } from '../src/index.js';


const rootDirUrl = import.meta.resolve('./');

THREE.DefaultLoadingManager
    .setURLModifier((url) => new URL(url, rootDirUrl).href);



const adapter = await gpu.requestAdapter();
const device = await adapter?.requestDevice();
if (!device) {
    throw new Error('No GPU adapter/device found');
}



const win = new WindowInstance(1280, 720, 'SoGPU & Three.js');
win.setResizable(true);
const context = win.getContext();

setInterval(() => {
    win.pollEvents();
    if (win.shouldClose()) process.exit(0);
}, 16);

attachDOM(win, 60);
declare const window: Window;



let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGPURenderer;
let renderPipeline: THREE.RenderPipeline;

init();

function init() {

    // const container = document.createElement( 'div' );
    // document.body.appendChild( container );

    // scene

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
    camera.position.set( - 1.8, 0.6, 2.7 );

    scene = new THREE.Scene();

    new UltraHDRLoader()
        .setPath( 'textures/equirectangular/' )
        .load( 'royal_esplanade_2k.hdr.jpg', function ( texture ) {

            texture.mapping = THREE.EquirectangularReflectionMapping;

            scene.background = texture;
            scene.environment = texture;

            // model

            const loader = new GLTFLoader().setPath( 'models/gltf/DamagedHelmet/glTF/' );
            loader.load( 'DamagedHelmet.gltf', function ( gltf ) {

                scene.add( gltf.scene );

            } );

        } );

    // renderer

    renderer = new THREE.WebGPURenderer( { device, context, antialias: true, requiredLimits: { maxColorAttachments: 5 } } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( render );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.inspector = new Inspector();
    // container.appendChild( renderer.domElement );

    // post processing

    const scenePass = pass( scene, camera, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter } );
    scenePass.setMRT( mrt( {
        output: output,
        normal: packNormalToRGB( normalView ),
        diffuse: diffuseColor,
        emissive: emissive
    } ) );

    // optimize textures

    const normalTexture = scenePass.getTexture( 'normal' );
    const diffuseTexture = scenePass.getTexture( 'diffuse' );
    const emissiveTexture = scenePass.getTexture( 'emissive' );

    normalTexture.type = diffuseTexture.type = emissiveTexture.type = THREE.UnsignedByteType;

    // post processing - mrt

    renderPipeline = new THREE.RenderPipeline( renderer );
    renderPipeline.outputColorTransform = false;
    renderPipeline.outputNode = Fn( () => {

        const output = scenePass.getTextureNode( 'output' ); // output name is optional here
        const normal = scenePass.getTextureNode( 'normal' );
        const diffuse = scenePass.getTextureNode( 'diffuse' );
        const emissive = scenePass.getTextureNode( 'emissive' );

        const out = mix( output.renderOutput(), output, step( 0.2, screenUV.x ) );
        const nor = mix( out, normal, step( 0.4, screenUV.x ) );
        const emi = mix( nor, emissive, step( 0.6, screenUV.x ) );
        const dif = mix( emi, diffuse, step( 0.8, screenUV.x ) );

        return dif;

    } )();

    // controls

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.target.set( 0, 0, - 0.2 );
    controls.update();

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function render() {

    renderPipeline.render();
    context.present();

}