import type { Document } from './document.js';
import { EventTarget, type EventListener } from './event-target.js';


export class Node extends EventTarget {
    static readonly ELEMENT_NODE = 1;
    static readonly TEXT_NODE = 3;
    static readonly DOCUMENT_NODE = 9;


    ownerDocument: Document;
    nodeType = Node.ELEMENT_NODE;
    nodeName = '';


    constructor(document: Document) {
        super();
        this.ownerDocument = document;
    }

    getRootNode() {
        return this.ownerDocument;
    }

    // override addEventListener(type: string, listener: EventListener) {
    //     super.addEventListener(type, listener);
    //     console.log('+', this.nodeName, type);
    // }

    // override removeEventListener(type: string, listener: EventListener) {
    //     super.removeEventListener(type, listener);
    //     console.log('-', this.nodeName, type);
    // }

    appendChild(child: Node) {
        console.warn('Node.appendChild is not implemented');
        return child;
    }
}