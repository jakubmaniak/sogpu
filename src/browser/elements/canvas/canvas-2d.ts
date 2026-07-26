import { Canvas, createCanvas, Image, type SKRSContext2D } from '@napi-rs/canvas';
import { ImageBitmap } from '../../apis/image-bitmap.js';
import type { CanvasAdapter } from './canvas.js';


export class Canvas2D implements CanvasAdapter<SKRSContext2D> {
    ctx?: SKRSContext2D;

    private canvas: Canvas;

    constructor(width: number, height: number) {
        this.canvas = createCanvas(width, height);
    }

    getContext() {
        const ctx = this.canvas.getContext('2d');

        const drawImageFn = ctx.drawImage.bind(ctx);
        const getImageDataFn = ctx.getImageData.bind(ctx);

        (ctx as any).drawImage = function(img: any, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number) {
            if (img instanceof ImageBitmap) {
                const image = new Image(img.width, img.height);
                image.src = img._dataBuffer;
                img = image;
            }
            return drawImageFn(img, sx, sy, sw, sh, dx, dy, dw, dh);
        };

        ctx.getImageData = function(sx, sy, sw, sh, sett) {
            const colorSpace = sett?.colorSpace == 'srgb' ? 'srgb' : undefined;
            return getImageDataFn(sx, sy, sw, sh, colorSpace as any);
        };

        this.ctx = ctx;
        return ctx;
    }

    get width() {
        return this.canvas.width;
    }
    set width(value: number) {
        this.canvas.width = value;
    }

    get height() {
        return this.canvas.height;
    }
    set height(value: number) {
        this.canvas.height = value;
    }
}