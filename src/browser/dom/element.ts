import type { Document } from './document.js';
import { Node } from './node.js';


export class HTMLElement extends Node {
    tagName: string;
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
}