import { toExternalSource, type GPUExternalDataSource } from '../../external-source.js';
export type ImageBitmapSource = GPUExternalDataSource | Blob;
export declare function createImageBitmap(image: ImageBitmapSource, opts?: any): Promise<ImageBitmap>;
export declare function createImageBitmap(image: ImageBitmapSource, sx: number, sy: number, sw: number, sh: number, opts?: any): Promise<ImageBitmap>;
export declare class ImageBitmap implements GPUExternalDataSource {
    width: number;
    height: number;
    _dataBuffer: Uint8Array<ArrayBuffer>;
    close(): void;
    [toExternalSource](): {
        data: Uint8Array<ArrayBuffer>;
        bytesPerRow: number;
        rowsPerImage: number;
    };
}
