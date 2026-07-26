import type { WindowFrame } from '../../window.js';
import { HTMLCanvasElement } from '../elements/canvas-element.js';
import { HTMLImageElement } from '../elements/image-element.js';
import { HTMLElement } from './element.js';
import { Node } from './node.js';


export class Document extends Node {
    readonly _windowFrame: WindowFrame;

    override nodeType = 9;
    override nodeName = '#document';

    hidden = false;
    visibilityState = 'visible';

    constructor(windowFrame: WindowFrame) {
        super(null!);
        this.ownerDocument = this;
        this._windowFrame = windowFrame;
    }

    createElement(name: string) {
        const tagName = name.toLowerCase();
        switch (tagName) {
            case 'canvas':
                return new HTMLCanvasElement(this, this._windowFrame);
            case 'img':
                return new HTMLImageElement(this);
            default:
                console.warn('Created fake', name, 'element');
                return new HTMLElement(this, name);
        }
    }

    createElementNS(ns: string, name: string) {
        return this.createElement(name);
    }
}