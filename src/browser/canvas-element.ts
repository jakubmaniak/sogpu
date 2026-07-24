import type { WindowInstance } from '../window.js';
import type { Document } from './dom/document.js';
import { HTMLElement } from './dom/element.js';


export class HTMLCanvasElement extends HTMLElement {
    private window: WindowInstance;

    constructor(document: Document, window: WindowInstance) {
        super(document, 'canvas');
        this.window = window;
        (window as any).ctx.canvas = this;
    }

    getContext() {
        return this.window.getContext();
    }

    get width() {
        return this.window.getSize().width;
    }

    get height() {
        return this.window.getSize().height;
    }

    set width(value: number) {
        this.window.setSize(value, this.height);
    }

    set height(value: number) {
        this.window.setSize(this.width, value);
    }

    override get offsetWidth() { return this.width; }
    override get offsetHeight() { return this.height; }
    override get clientWidth() { return this.width; }
    override get clientHeight() { return this.height; }
}