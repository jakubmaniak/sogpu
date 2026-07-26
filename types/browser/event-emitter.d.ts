import type { WindowInstance } from '../window.js';
import type { Document } from './dom/document.js';
export declare class WindowEventEmitter {
    windowFrame: WindowInstance;
    document: Document;
    private state;
    constructor(windowFrame: WindowInstance, document: Document);
    private tick;
    private emitPointerUpDown;
    private emitPointerMove;
}
