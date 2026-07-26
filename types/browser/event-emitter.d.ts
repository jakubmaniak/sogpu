import type { WindowFrame } from '../window.js';
import type { Document } from './dom/document.js';
export declare class WindowEventEmitter {
    windowFrame: WindowFrame;
    document: Document;
    private state;
    constructor(windowFrame: WindowFrame, document: Document);
    private tick;
    private emitPointerUpDown;
    private emitPointerMove;
}
