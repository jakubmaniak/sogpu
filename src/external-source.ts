export const toExternalSource = Symbol('toExternalSource');


export interface GPUExternalData {
    data: Uint8Array;
    bytesPerRow: number;
    rowsPerImage: number;
}

export interface GPUExternalDataSource {
    [toExternalSource](): GPUExternalData;
}