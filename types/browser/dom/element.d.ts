import type { Document } from './document.js';
import { Node } from './node.js';
export declare class HTMLElement extends Node {
    tagName: string;
    className: string;
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
    setAttribute(attr: string, value: any): void;
    append(...nodes: (Node | string)[]): void;
    querySelector(query: string): null;
}
