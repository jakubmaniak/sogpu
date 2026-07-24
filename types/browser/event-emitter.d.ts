import type { WindowInstance } from '../window.js';
import type { Document } from './dom/document.js';
export declare class WindowEventEmitter {
    window: WindowInstance;
    document: Document;
    private state;
    constructor(window: WindowInstance, document: Document);
    tick(): void;
    emitPointerUpDown(left: boolean, pressed: boolean): void;
    emitPointerMove(x: number, y: number): void;
}
