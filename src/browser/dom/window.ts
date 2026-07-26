import type { Document } from './document.js';
import { EventTarget, type EventListener } from './event-target.js';


export class Window extends EventTarget {
    readonly document: Document;
    fps: number;

    constructor(document: Document, fps: number) {
        super();
        this.document = document;
        this.fps = fps;
    }

    // override addEventListener(type: string, listener: EventListener) {
    //     super.addEventListener(type, listener);
    //     console.log('+', '#window', type);
    // }

    // override removeEventListener(type: string, listener: EventListener) {
    //     super.removeEventListener(type, listener);
    //     console.log('-', '#window', type);
    // }

    get window() { return this; }
    get self() { return this; }

    get devicePixelRatio() { return 1; }

    get innerWidth() {
        return this.document._windowFrame.getSize().width;
    }
    get innerHeight() {
        return this.document._windowFrame.getSize().height;
    }

    requestAnimationFrame(cb: (time: number) => number) {
        setTimeout(() => cb(performance.now()), 1000 / this.fps);
    }
}