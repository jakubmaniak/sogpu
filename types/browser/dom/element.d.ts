import type { Document } from './document.js';
import { Node } from './node.js';
export declare class HTMLElement extends Node {
    tagName: string;
    style: {
        display: string;
    };
    constructor(document: Document, name: string);
    get offsetWidth(): number;
    get offsetHeight(): number;
    get offsetTop(): number;
    get offsetLeft(): number;
    get clientWidth(): number;
    get clientHeight(): number;
    setPointerCapture(pointerId: number): void;
    releasePointerCapture(pointerId: number): void;
}
