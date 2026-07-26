import sharp from 'sharp';
import { toExternalSource, type GPUExternalDataSource } from '../../external-source.js';
import type { HTMLImageElement } from '../elements/image-element.js';


export type ImageBitmapSource = GPUExternalDataSource | Blob;


export function createImageBitmap(image: ImageBitmapSource, opts?: any): Promise<ImageBitmap>;
export function createImageBitmap(image: ImageBitmapSource, sx: number, sy: number, sw: number, sh: number, opts?: any): Promise<ImageBitmap>;
export async function createImageBitmap(image: ImageBitmapSource, ...args: any[]) {
    const bitmap = new ImageBitmap();

    if (image instanceof Blob) {
        const img = image.image();
        await img.metadata();

        const res = await sharp(await img.buffer())
            .ensureAlpha()
            .raw()
            .toUint8Array();

        bitmap._dataBuffer = res.data as Uint8Array<ArrayBuffer>;
        bitmap.width = img.width;
        bitmap.height = img.height;
    }
    else {
        const src = image[toExternalSource]();

        bitmap._dataBuffer = new Uint8Array(src.data);
        bitmap.width = src.bytesPerRow / 4;
        bitmap.height = src.rowsPerImage;
    }

    return bitmap;
}


export class ImageBitmap implements GPUExternalDataSource {
    width = 0;
    height = 0;

    _dataBuffer = new Uint8Array();

    close() {
        this._dataBuffer = new Uint8Array();
        this.width = 0;
        this.height = 0;
    }

    [toExternalSource]() {
        return {
            data: this._dataBuffer,
            bytesPerRow: this.width * 4,
            rowsPerImage: this.height
        };
    }
}