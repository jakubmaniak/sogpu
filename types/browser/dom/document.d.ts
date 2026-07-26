import type { WindowFrame } from '../../window.js';
import { HTMLElement } from './element.js';
import { Node } from './node.js';
export declare class Document extends Node {
    readonly _windowFrame: WindowFrame;
    nodeType: number;
    nodeName: string;
    hidden: boolean;
    visibilityState: string;
    constructor(windowFrame: WindowFrame);
    createElement(name: string): HTMLElement;
    createElementNS(ns: string, name: string): HTMLElement;
}
