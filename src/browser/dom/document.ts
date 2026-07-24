import type { WindowInstance } from '../../window.js';
import { HTMLCanvasElement } from '../canvas-element.js';
import { HTMLElement } from './element.js';
import { Node } from './node.js';


export class Document extends Node {
    private _window: WindowInstance;

    override nodeType = 9;
    override nodeName = '#document';

    constructor(window: WindowInstance) {
        super(null!);
        this.ownerDocument = this;
        this._window = window;
    }

    createElement(name: string) {
        if (name?.toLowerCase() == 'canvas') {
            return new HTMLCanvasElement(this, this._window);
        }
        else {
            console.log('Created', name, 'element');
            return new HTMLElement(this, name);
        }
    }

    createElementNS(ns: string, name: string) {
        return this.createElement(name);
    }
}