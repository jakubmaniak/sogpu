import type { Document } from './document.js';


export class Node {
    static ELEMENT_NODE = 1;
    static TEXT_NODE = 3;
    static DOCUMENT_NODE = 9;


    ownerDocument: Document;
    nodeType = Node.ELEMENT_NODE;
    nodeName = '';

    private listeners = new Map<string, Set<(ev: any) => any>>();

    constructor(document: Document) {
        this.ownerDocument = document;
    }

    getRootNode() {
        return this.ownerDocument;
    }

    addEventListener(type: string, listener: any) {
        let pool = this.listeners.get(type);
        if (!pool) {
            pool = new Set();
            this.listeners.set(type, pool);
        }

        pool.add(listener);

        console.log('+', this.nodeName, type);
    }

    removeEventListener(type: string, listener: any) {
        this.listeners.get(type)?.delete(listener);

        console.log('-', this.nodeName, type, listener);
    }

    dispatchEvent(type: string, event: any) {
        event.target = this;
        this.listeners.get(type)?.forEach((cb) => cb(event));
    }

    appendChild(child: Node) {
        return child;
    }
}