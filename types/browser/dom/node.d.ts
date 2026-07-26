import type { Document } from './document.js';
import { EventTarget } from './event-target.js';
export declare class Node extends EventTarget {
    static readonly ELEMENT_NODE = 1;
    static readonly TEXT_NODE = 3;
    static readonly DOCUMENT_NODE = 9;
    ownerDocument: Document;
    nodeType: number;
    nodeName: string;
    constructor(document: Document);
    getRootNode(): Document;
    appendChild(child: Node): Node;
}
