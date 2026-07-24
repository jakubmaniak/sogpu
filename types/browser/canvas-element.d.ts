import type { WindowInstance } from '../window.js';
import type { Document } from './dom/document.js';
import { HTMLElement } from './dom/element.js';
export declare class HTMLCanvasElement extends HTMLElement {
    private window;
    constructor(document: Document, window: WindowInstance);
    getContext(): import("../surface.js").SurfaceContext;
    get width(): number;
    get height(): number;
    set width(value: number);
    set height(value: number);
    get offsetWidth(): number;
    get offsetHeight(): number;
    get clientWidth(): number;
    get clientHeight(): number;
}
