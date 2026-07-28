import { keymap } from '../glfw/keymap.js';
import type { WindowFrame } from '../window.js';
import type { Document } from './dom/document.js';
import type { Window } from './dom/window.js';


export class WindowEventEmitter {
    private frame: WindowFrame;
    private window: Window;
    private document: Document;

    private get canvas() {
        return this.frame.getContext().canvas;
    }

    private state = {
        x: 0,
        y: 0,
        lmb: false,
        rmb: false,
        mmb: false,
        ctrl: false,
        alt: false,
        shift: false,
        meta: false,
        pressed: { } as Record<string, boolean>,
    };

    private keyChars = getKeyCharacters();

    constructor(windowFrame: WindowFrame, domWindow: Window, document: Document) {
        this.frame = windowFrame;
        this.window = domWindow;
        this.document = document;

        setInterval(() => this.tick(), 16);

        this.frame.setSizeCallback((win, width, height) => {
            this.window.dispatchEvent({ type: 'resize' });
        });

        this.frame.setScrollCallback((win, dx, dy) => {
            this.emitMouseWheel(dx, dy);
        });

        this.frame.setKeyCallback((win, key, scanCode, action, mods) => {
            this.state.ctrl = !!(mods&2);
            this.state.alt = !!(mods&4);
            this.state.shift = !!(mods&1);
            this.state.meta = !!(mods&8);

            const km = keymap.get(key);
            if (km) {
                this.state.pressed[km.label] = !!action;
                this.emitKeyUpDown(km.label, km.code, km.location, action);
            }
        });
    }

    private tick() {
        const win = this.frame;

        const mouse = win.getMousePosition();
        const lmb = win.isMouseButtonPressed(0);
        const rmb = win.isMouseButtonPressed(1);
        const mmb = win.isMouseButtonPressed(2);

        this.state.ctrl = win.isKeyPressed(0);

        if (lmb != this.state.lmb) {
            this.state.lmb = lmb;
            this.emitPointerUpDown(0, lmb);
        }
        if (rmb != this.state.rmb) {
            this.state.rmb = rmb;
            this.emitPointerUpDown(2, rmb);
        }
        if (mmb != this.state.mmb) {
            this.state.mmb = mmb;
            this.emitPointerUpDown(1, mmb);
        }
        if (mouse.x != this.state.x || mouse.y != this.state.y) {
            this.emitPointerMove(mouse.x, mouse.y);
            this.state.x = mouse.x;
            this.state.y = mouse.y;
        }
    }

    private emitPointerUpDown(btn: number, pressed: boolean) {
        const type = pressed ? 'pointerdown' : 'pointerup';
        const { x, y } = this.state;
        const ev = {
            type,
            pointerId: 1,
            pointerType: 'mouse',
            which: btn + 1,
            button: btn,
            buttons: 1 << (btn == 1 ? 2  :  btn == 2 ? 1  :  btn),
            x,
            y,
            clientX: x,
            clientY: y,
            pageX: x,
            pageY: y,
            movementX: 0,
            movementY: 0
        };
        this.document.dispatchEvent(ev);
        this.canvas?.dispatchEvent(ev);
    }

    private emitPointerMove(x: number, y: number) {
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
        this.document.dispatchEvent(ev);
        this.canvas?.dispatchEvent(ev);
    }

    private emitMouseWheel(dx: number, dy: number) {
        const ev = {
            type: 'wheel',
            deltaMode: 0,
            deltaX: dx * -40,
            deltaY: dy * -40,
            deltaZ: 0,
            wheelDelta: dy * 1200,
            wheelDeltaX: dx * 1200,
            wheelDeltaY: dy * 1200
        };
        this.document.dispatchEvent(ev);
        this.canvas?.dispatchEvent(ev);
    }

    private emitKeyUpDown(label: string, code: number, location: number, pressed: number) {
        const type = pressed ? 'keydown' : 'keyup';
        const ev = {
            type,
            code: label,
            key: this.keyChars.get(label) ?? label,
            which: code,
            keyCode: code,
            ctrlKey: this.state.ctrl,
            altKey: this.state.alt,
            shiftKey: this.state.shift,
            metaKey: this.state.meta,
            location,
            repeat: (pressed == 2),
        };
        this.window.dispatchEvent(ev);
        this.document.dispatchEvent(ev);
        this.canvas?.dispatchEvent(ev);
    }
}


function getKeyCharacters() {
    return new Map<string, string>([
        ['ControlLeft', 'Control'],
        ['ControlRight', 'Control'],
        ['AltLeft', 'Alt'],
        ['AltRight', 'Alt'],
        ['ShiftLeft', 'Shift'],
        ['ShiftRight', 'Shift'],
        ['MetaLeft', 'Meta'],
        ['MetaRight', 'Meta'],
        ...Array.from(
            { length: 10 },
            (_, i) => [`Digit${i}`, String(i)] as const
        ),
        ...Array.from(
            { length: 26 },
            (_, i) => [`Key${String.fromCharCode(65 + i)}`, String.fromCharCode(97 + i)] as const
        ),
        ['Space', ' '],
        ['Quote', '\''],
        ['Comma', ','],
        ['Minus', '-'],
        ['Period', '.'],
        ['Slash', '/'],
        ['Semicolon', ';'],
        ['Equal', '='],
        ['BracketLeft', '['],
        ['BracketRight', ']'],
        ['Backslash', '\\'],
    ]);
}