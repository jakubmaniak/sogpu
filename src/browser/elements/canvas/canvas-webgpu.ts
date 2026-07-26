import type { SurfaceContext } from '../../../surface.js';
import type { WindowInstance } from '../../../window.js';
import type { CanvasAdapter } from './canvas.js';


export class CanvasWebGPU implements CanvasAdapter<SurfaceContext> {
    private _windowFrame: WindowInstance;
    ctx?: SurfaceContext;

    constructor(frame: WindowInstance) {
        this._windowFrame = frame;
    }

    getContext() {
        this.ctx = this._windowFrame.getContext();
        return this.ctx;
    }

    get width() {
        return this._windowFrame.getSize().width;
    }
    set width(value: number) {
        this._windowFrame.setSize(value, this.height);
    }

    get height() {
        return this._windowFrame.getSize().height;
    }
    set height(value: number) {
        this._windowFrame.setSize(this.width, value);
    }
}