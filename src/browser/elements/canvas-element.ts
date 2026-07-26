import type { WindowFrame } from '../../window.js';
import type { Document } from '../dom/document.js';
import { HTMLElement } from '../dom/element.js';


export class HTMLCanvasElement extends HTMLElement {
    private _windowFrame: WindowFrame;

    constructor(document: Document, frame: WindowFrame) {
        super(document, 'canvas');
        this._windowFrame = frame;
        (frame as any).ctx.canvas = this;
    }

    getContext(type: string) {
        if (type == 'webgpu') {
            return this._windowFrame.getContext();
        }

        console.error(`Canvas context type '${type}' is not supported.`);
        return null;
    }

    get width() {
        return this._windowFrame.getSize().width;
    }

    get height() {
        return this._windowFrame.getSize().height;
    }

    set width(value: number) {
        this._windowFrame.setSize(value, this.height);
    }

    set height(value: number) {
        this._windowFrame.setSize(this.width, value);
    }

    override get offsetWidth() { return this.width; }
    override get offsetHeight() { return this.height; }
    override get clientWidth() { return this.width; }
    override get clientHeight() { return this.height; }
}