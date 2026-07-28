import type { WindowFrame } from '../window.js';
import type { Document } from './dom/document.js';
import type { Window } from './dom/window.js';
export declare class WindowEventEmitter {
    private frame;
    private window;
    private document;
    private get canvas();
    private state;
    constructor(windowFrame: WindowFrame, domWindow: Window, document: Document);
    private tick;
    private emitPointerUpDown;
    private emitPointerMove;
    private emitMouseWheel;
    private emitKeyUpDown;
    private getKeyLocation;
}
