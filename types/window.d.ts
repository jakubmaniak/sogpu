import { type Pointer } from 'bun:ffi';
import { SurfaceContext } from './surface.js';
export declare class WindowFrame {
    readonly ptr: Pointer;
    private ctx?;
    constructor(width: number, height: number, title: string);
    private create;
    getContext(): SurfaceContext;
    destroy(): void;
    shouldClose(): boolean;
    pollEvents(): void;
    setTitle(title: string): void;
    getSize(): {
        width: number;
        height: number;
    };
    setSize(width: number, height: number): void;
    getPosition(): {
        x: number;
        y: number;
    };
    setPosition(x: number, y: number): void;
    setResizable(resizable: boolean): void;
    maximize(): void;
    minimize(): void;
    restore(): void;
    isMaximized(): boolean;
    isMinimized(): boolean;
    isVisible(): boolean;
    isFocused(): boolean;
    isHovered(): boolean;
    setSizeCallback(cb?: (winPtr: number, width: number, height: number) => void): void;
    isMouseButtonPressed(button: number): boolean;
    getMousePosition(): {
        x: number;
        y: number;
    };
    setScrollCallback(cb: (winPtr: number, dx: number, dy: number) => void): void;
    isKeyPressed(key: number): boolean;
    setKeyCallback(cb: (winPtr: number, key: number, scanCode: number, action: number, mods: number) => void): void;
    setCharCallback(cb: (winPtr: number, codePoint: number) => void): void;
    setCharModsCallback(cb: (winPtr: number, codePoint: number, mods: number) => void): void;
}
