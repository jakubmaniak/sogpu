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
    getWindowSize(window: Pointer): {
        width: number;
        height: number;
    };
    setWindowSize(window: Pointer, width: number, height: number): void;
    getWindowPosition(window: Pointer): {
        x: number;
        y: number;
    };
    setWindowPosition(window: Pointer, x: number, y: number): void;
    setWindowResizable(window: Pointer, resizable: boolean): void;
    maximizeWindow(window: Pointer): void;
    minimizeWindow(window: Pointer): void;
    restoreWindow(window: Pointer): void;
    isWindowMaximized(window: Pointer): boolean;
    isWindowMinimized(window: Pointer): boolean;
    isWindowVisible(window: Pointer): boolean;
    isWindowFocused(window: Pointer): boolean;
    isWindowHovered(window: Pointer): boolean;
    private windowSizeCallback?;
    setWindowSizeCallback(window: Pointer, cb: null | ((winPtr: number, width: number, height: number) => void)): void;
    private readonly mousePos;
    private readonly mouseXPtr;
    private readonly mouseYPtr;
    getMousePosition(window: Pointer): {
        x: number;
        y: number;
    };
    getMouseButton(window: Pointer, button: number): boolean;
    private scrollCallback?;
    setScrollCallback(window: Pointer, cb: (winPtr: number, dx: number, dy: number) => void): void;
    isKeyPressed(window: Pointer, key: number): boolean;
    private keyCallback?;
    setKeyCallback(window: Pointer, cb: (winPtr: number, key: number, scanCode: number, action: number, mods: number) => void): void;
    private charCallback?;
    setCharCallback(window: Pointer, cb: (winPtr: number, codePoint: number) => void): void;
    private charModsCallback?;
    setCharModsCallback(window: Pointer, cb: (winPtr: number, codePoint: number, mods: number) => void): void;
    getWindowMonitor(window: Pointer): Pointer | null;
    getPrimaryMonitor(): Pointer | null;
    getMonitorList(): Pointer[];
    getMonitorPos(monitor: Pointer): {
        x: number;
        y: number;
    };
    getMonitorWorkarea(monitor: Pointer): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    getMonitorContentScale(monitor: Pointer): {
        x: number;
        y: number;
    };
    getMonitorVideoMode(monitor: Pointer): {
        width: number;
        height: number;
        redBits: number;
        greenBits: number;
        blueBits: number;
        refreshRate: number;
    } | null;
}
export declare const keymap: Map<number, string>;
export declare const keycodes: Map<number, number>;
