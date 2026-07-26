import type { WindowInstance } from '../../window.js';
import type { Document } from '../dom/document.js';
import { HTMLElement } from '../dom/element.js';
import { Canvas2D } from './canvas/canvas-2d.js';
import { CanvasWebGPU } from './canvas/canvas-webgpu.js';
import type { CanvasAdapter } from './canvas/canvas.js';


export class HTMLCanvasElement extends HTMLElement {
    private _windowFrame: WindowInstance;

    private canvas?: CanvasAdapter<any>;

    constructor(document: Document, frame: WindowInstance) {
        super(document, 'canvas');
        this._windowFrame = frame;
    }

    getContext(type: string) {
        if (type == 'webgpu') {
            this.canvas = new CanvasWebGPU(this._windowFrame);
            (this._windowFrame as any).ctx.canvas = this;
        }
        else if (type == '2d') {
            this.canvas = new Canvas2D(100, 100);
        }
        else {
            console.error(`Canvas context type '${type}' is not supported.`);
            return null;
        }

        return this.canvas?.getContext() ?? null;
    }

    get width() {
        return this.canvas?.width ?? 0;
    }

    get height() {
        return this.canvas?.height ?? 0;
    }

    set width(value: number) {
        if (this.canvas) this.canvas.width = value;
    }

    set height(value: number) {
        if (this.canvas) this.canvas.height = value;
    }

    override get offsetWidth() { return this.width; }
    override get offsetHeight() { return this.height; }
    override get clientWidth() { return this.width; }
    override get clientHeight() { return this.height; }
}