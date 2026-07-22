import { type Pointer } from 'bun:ffi';
import { SurfaceContext } from './surface.js';
export declare class WindowInstance {
    readonly ptr: Pointer;
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
    isMouseButtonPressed(button: number): boolean;
    getMousePosition(): {
        x: number;
        y: number;
    };
}
