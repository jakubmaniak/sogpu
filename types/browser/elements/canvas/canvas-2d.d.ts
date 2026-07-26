import { type SKRSContext2D } from '@napi-rs/canvas';
import type { CanvasAdapter } from './canvas.js';
export declare class Canvas2D implements CanvasAdapter<SKRSContext2D> {
    ctx?: SKRSContext2D;
    private canvas;
    constructor(width: number, height: number);
    getContext(): SKRSContext2D;
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
}
