import type { WindowInstance } from '../../window.js';
import type { Document } from '../dom/document.js';
import { HTMLElement } from '../dom/element.js';
export declare class HTMLCanvasElement extends HTMLElement {
    private _windowFrame;
    constructor(document: Document, frame: WindowInstance);
    getContext(type: string): import("../../surface.js").SurfaceContext | null;
    get width(): number;
    get height(): number;
    set width(value: number);
    set height(value: number);
    get offsetWidth(): number;
    get offsetHeight(): number;
    get clientWidth(): number;
    get clientHeight(): number;
}
