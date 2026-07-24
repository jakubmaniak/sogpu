import type { WindowInstance } from '../../window.js';
import { HTMLElement } from './element.js';
import { Node } from './node.js';
export declare class Document extends Node {
    private _window;
    nodeType: number;
    nodeName: string;
    constructor(window: WindowInstance);
    createElement(name: string): HTMLElement;
    createElementNS(ns: string, name: string): HTMLElement;
}
