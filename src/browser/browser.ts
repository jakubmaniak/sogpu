import { gpu, GPUBufferUsage, GPUShaderStage, GPUTextureUsage } from '../gpu.js';
import type { WindowInstance } from '../window.js';
import { HTMLCanvasElement } from './canvas-element.js';
import { Document } from './dom/document.js';
import { HTMLElement } from './dom/element.js';
import { Node } from './dom/node.js';
import { WindowEventEmitter } from './event-emitter.js';


declare const global: any;


export function attachDOM(window: WindowInstance, fps: number) {
    global.navigator = { ...navigator, gpu };

    global.GPUTextureUsage = GPUTextureUsage;
    global.GPUBufferUsage = GPUBufferUsage;
    global.GPUShaderStage = GPUShaderStage;

    global.requestAnimationFrame = function(cb: (time: number) => number) {
        setTimeout(cb, 1000 / fps);
    };

    global.document = new Document(window);

    global.Document = Document;
    global.Node = Node;
    global.HTMLElement = HTMLElement;
    global.HTMLCanvasElement = HTMLCanvasElement;

    new WindowEventEmitter(window, global.document);
}