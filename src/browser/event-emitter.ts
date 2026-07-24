import type { WindowInstance } from '../window.js';
import type { Document } from './dom/document.js';


export class WindowEventEmitter {
    window: WindowInstance;
    document: Document;

    private state = {
        x: 0,
        y: 0,
        lmb: false,
        rmb: false
    };

    constructor(window: WindowInstance, document: Document) {
        this.window = window;
        this.document = document;

        setInterval(() => this.tick(), 16);
    }

    tick() {
        const mouse = this.window.getMousePosition();
        const lmb = this.window.isMouseButtonPressed(0);
        const rmb = this.window.isMouseButtonPressed(1);

        if (lmb != this.state.lmb) {
            this.state.lmb = lmb;
            this.emitPointerUpDown(true, lmb);
        }
        if (rmb != this.state.rmb) {
            this.state.rmb = rmb;
            this.emitPointerUpDown(false, rmb);
        }
        if (mouse.x != this.state.x || mouse.y != this.state.y) {
            this.emitPointerMove(mouse.x, mouse.y);
            this.state.x = mouse.x;
            this.state.y = mouse.y;
        }
    }

    emitPointerUpDown(left: boolean, pressed: boolean) {
        const type = pressed ? 'pointerdown' : 'pointerup';
        const { x, y } = this.state;
        const ev = {
            type,
            pointerId: 1,
            pointerType: 'mouse',
            which: left ? 1 : 3,
            button: left ? 0 : 2,
            buttons: left ? 1 : 2,
            x,
            y,
            clientX: x,
            clientY: y,
            pageX: x,
            pageY: y,
            movementX: 0,
            movementY: 0
        };
        this.document.dispatchEvent(type, ev);
        this.window.getContext().canvas?.dispatchEvent(type, ev);
    }

    emitPointerMove(x: number, y: number) {
        const ev = {
            type: 'pointermove',
            pointerId: 1,
            pointerType: 'mouse',
            which: 0,
            button: -1,
            buttons: 0,
            x,
            y,
            clientX: x,
            clientY: y,
            pageX: x,
            pageY: y,
            movementX: x - this.state.x,
            movementY: y - this.state.y
        };
        this.document.dispatchEvent('pointermove', ev);
    }
}