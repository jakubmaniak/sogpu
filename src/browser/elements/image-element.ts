import sharp from 'sharp';
import { toExternalSource, type GPUExternalDataSource } from '../../external-source.js';
import type { Document } from '../dom/document.js';
import { HTMLElement } from '../dom/element.js';
import type { EventListener } from '../dom/event-target.js';


function uint(n: number) {
    return Math.max(n, 0) | 0;
}


export class HTMLImageElement extends HTMLElement implements GPUExternalDataSource {
    private _src = '';
    private _width = 0;
    private _height = 0;
    private _dataBuffer = new Uint8Array(0);

    crossorigin = '';
    complete = true;
    onload: EventListener | null = null;
    onerror: EventListener | null  = null;

    constructor(document: Document) {
        super(document, 'img');
    }

    [toExternalSource]() {
        return {
            data: this._dataBuffer,
            bytesPerRow: this.width * 4,
            rowsPerImage: this.height
        };
    }

    get src() {
        return this._src;
    }

    set src(value: string) {
        this.setImageContent(value);
    }

    get width() {
        return this._width;
    }
    set width(value: number) {
        this._width = uint(value);
    }

    get height() {
        return this._height;
    }
    set height(value: number) {
        this._height = uint(value);
    }

    get naturalWidth() {
        return this._width;
    }

    get naturalHeight() {
        return this._height;
    }

    get currentSrc() {
        return this._src;
    }

    private async setImageContent(src: string) {
        this.complete = false;
        this._src = src;


        let input: string | ArrayBuffer;

        if (src.startsWith('blob:')) {
            input = await fetch(src).then((res) => res.arrayBuffer());
        }
        else {
            input = Bun.fileURLToPath(src);
        }

        sharp(input)
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true })
            .then((res) => {
                this._dataBuffer = res.data;
                this._width = res.info.width;
                this._height = res.info.height;
                this.complete = true;

                this.dispatchEvent({ type: 'load' });
                this.onload?.call(this, { type: 'load', target: this });
            })
            .catch((err) => {
                this.complete = true;

                console.error(err);

                this.dispatchEvent({ type: 'error' });
                this.onerror?.call(this, { type: 'error', target: this });
            });
    }
}