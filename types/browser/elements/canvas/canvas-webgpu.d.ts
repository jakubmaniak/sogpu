import type { SurfaceContext } from '../../../surface.js';
import type { WindowInstance } from '../../../window.js';
import type { CanvasAdapter } from './canvas.js';
export declare class CanvasWebGPU implements CanvasAdapter<SurfaceContext> {
    private _windowFrame;
    ctx?: SurfaceContext;
    constructor(frame: WindowInstance);
    getContext(): SurfaceContext;
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
}
