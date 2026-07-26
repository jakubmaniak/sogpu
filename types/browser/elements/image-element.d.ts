import { toExternalSource, type GPUExternalDataSource } from '../../external-source.js';
import type { Document } from '../dom/document.js';
import { HTMLElement } from '../dom/element.js';
import type { EventListener } from '../dom/event-target.js';
export declare class HTMLImageElement extends HTMLElement implements GPUExternalDataSource {
    private _src;
    private _width;
    private _height;
    private _dataBuffer;
    crossorigin: string;
    complete: boolean;
    onload: EventListener | null;
    onerror: EventListener | null;
    constructor(document: Document);
    [toExternalSource](): {
        data: Uint8Array<ArrayBuffer>;
        bytesPerRow: number;
        rowsPerImage: number;
    };
    get src(): string;
    set src(value: string);
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
    get naturalWidth(): number;
    get naturalHeight(): number;
    get currentSrc(): string;
    private setImageContent;
}
