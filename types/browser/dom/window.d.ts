import type { Document } from './document.js';
import { EventTarget } from './event-target.js';
export declare class Window extends EventTarget {
    readonly document: Document;
    fps: number;
    constructor(document: Document, fps: number);
    get window(): this;
    get self(): this;
    get devicePixelRatio(): number;
    get innerWidth(): number;
    get innerHeight(): number;
    requestAnimationFrame(cb: (time: number) => number): void;
    createImageBitmap(...args: any[]): Promise<import("../apis/image-bitmap.js").ImageBitmap>;
}
