import type { Document } from './document.js';
import { Node } from './node.js';


export class HTMLElement extends Node {
    tagName: string;
    className = '';
    style = { display: 'block' };

    constructor(document: Document, name: string) {
        super(document);
        this.ownerDocument = document;
        this.tagName = name.toUpperCase();
        this.nodeName = this.tagName;
    }

    get offsetWidth() { return 1 }
    get offsetHeight() { return 1; }
    get offsetTop() { return 0; }
    get offsetLeft() { return 0; }
    get clientWidth() { return 1; }
    get clientHeight() { return 1; }

    setPointerCapture(pointerId: number) { }
    releasePointerCapture(pointerId: number) { }

    setAttribute(attr: string, value: any) {
        console.warn('HTMLElement.setAttribute is not implemented');
    }

    append(...nodes: (Node | string)[]) {
        console.warn('HTMLElement.append is not implemented');
    }

    querySelector(query: string) {
        console.warn('HTMLElement.querySelector is not implemented');
        return null;
    }
}