import type { Document } from './document.js';
export declare class Node {
    static ELEMENT_NODE: number;
    static TEXT_NODE: number;
    static DOCUMENT_NODE: number;
    ownerDocument: Document;
    nodeType: number;
    nodeName: string;
    private listeners;
    constructor(document: Document);
    getRootNode(): Document;
    addEventListener(type: string, listener: any): void;
    removeEventListener(type: string, listener: any): void;
    dispatchEvent(type: string, event: any): void;
    appendChild(child: Node): Node;
}
