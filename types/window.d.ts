/// <reference types="bun-types" />
import { Pointer } from 'bun:ffi';
import { SurfaceContext } from './surface.js';
export declare class WindowInstance {
    readonly ptr: Pointer;
    constructor(width: number, height: number, title: string);
    private create;
    getContext(): SurfaceContext;
    destroy(): void;
    shouldClose(): boolean;
    pollEvents(): void;
}
