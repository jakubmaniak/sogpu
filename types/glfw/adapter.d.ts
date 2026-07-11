/// <reference types="bun-types" />
import { Pointer } from 'bun:ffi';
export declare class GLFWAdapter {
    constructor();
    init(): void;
    terminate(): void;
    createWindow(width: number, height: number, title: string): any;
    destroyWindow(window: Pointer): void;
    getChainHandles(window: Pointer): {
        display: any;
        window: any;
    };
    pollEvents(): void;
    shouldClose(window: Pointer): boolean;
    private readonly mousePos;
    private readonly mouseXPtr;
    private readonly mouseYPtr;
    getMousePosition(window: Pointer): {
        x: number;
        y: number;
    };
    getKeyState(window: Pointer, key: number): any;
}
