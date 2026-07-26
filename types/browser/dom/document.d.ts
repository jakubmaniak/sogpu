import type { WindowInstance } from '../../window.js';
import { HTMLElement } from './element.js';
import { Node } from './node.js';
export declare class Document extends Node {
    readonly _windowFrame: WindowInstance;
    nodeType: number;
    nodeName: string;
    hidden: boolean;
    visibilityState: string;
    constructor(windowFrame: WindowInstance);
    createElement(name: string): HTMLElement;
    createElementNS(ns: string, name: string): HTMLElement;
}
