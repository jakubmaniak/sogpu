import { gpu, GPUBufferUsage, GPUShaderStage, GPUTextureUsage } from '../gpu.js';
import type { WindowInstance } from '../window.js';
import { Document } from './dom/document.js';
import { HTMLElement } from './dom/element.js';
import { EventTarget } from './dom/event-target.js';
import { Node } from './dom/node.js';
import { Storage } from './dom/storage.js';
import { Window } from './dom/window.js';
import { HTMLCanvasElement } from './elements/canvas-element.js';
import { HTMLImageElement } from './elements/image-element.js';
import { WindowEventEmitter } from './event-emitter.js';


declare const globalThis: any;


export function attachDOM(windowFrame: WindowInstance, fps: number) {
    globalThis.navigator = { ...navigator, gpu };

    globalThis.GPUTextureUsage = GPUTextureUsage;
    globalThis.GPUBufferUsage = GPUBufferUsage;
    globalThis.GPUShaderStage = GPUShaderStage;


    const document = new Document(windowFrame);
    const window = new Window(document, fps);

    Object.defineProperties(globalThis, {
        window: { get() { return window; }},
        document: { get() { return window.document; }},
        devicePixelRatio: { get() { return window.devicePixelRatio; }},
        innerWidth: { get() { return window.innerWidth; } },
        innerHeight: { get() { return window.innerHeight; } },
        requestAnimationFrame: { value: window.requestAnimationFrame.bind(window) },
    });

    globalThis.Document = Document;
    globalThis.Window = Window;
    globalThis.EventTarget = EventTarget;
    globalThis.Node = Node;
    globalThis.HTMLElement = HTMLElement;

    globalThis.HTMLCanvasElement = HTMLCanvasElement;
    globalThis.HTMLImageElement = HTMLImageElement;

    class Image extends HTMLImageElement {
        constructor(width?: number, height?: number) {
            super(globalThis.document);
            this.width = width ?? 0;
            this.height = height ?? 0;
        }
    }
    globalThis.Image = Image;
    globalThis.window.Image = Image;


    new WindowEventEmitter(windowFrame, document);


    globalThis.localStorage = new Storage();
    globalThis.sessionStorage = new Storage();
}