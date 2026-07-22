import { type Pointer } from 'bun:ffi';
export declare class GLFWAdapter {
    constructor();
    init(): void;
    release(): void;
    createWindow(width: number, height: number, title: string): Pointer;
    destroyWindow(window: Pointer): void;
    getChainHandles(window: Pointer): {
        display: any;
        window: any;
    };
    pollEvents(): void;
    shouldClose(window: Pointer): boolean;
    setWindowTitle(window: Pointer, title: string): void;
    setWindowSize(window: Pointer, width: number, height: number): void;
    setWindowPosition(window: Pointer, x: number, y: number): void;
    setWindowResizable(window: Pointer, resizable: boolean): void;
    maximizeWindow(window: Pointer): void;
    minimizeWindow(window: Pointer): void;
    restoreWindow(window: Pointer): void;
    private readonly mousePos;
    private readonly mouseXPtr;
    private readonly mouseYPtr;
    getMousePosition(window: Pointer): {
        x: number;
        y: number;
    };
    getKeyState(window: Pointer, key: number): number;
}
