import { type Pointer } from 'bun:ffi';
import type { HTMLCanvasElement } from './browser/canvas-element.js';
import { GLFWAdapter } from './glfw/adapter.js';
import { gpu } from './gpu.js';
import { SurfaceContext } from './surface.js';


const glfw = new GLFWAdapter();


export class WindowInstance {
    readonly ptr: Pointer;
    private ctx?: SurfaceContext;

    constructor(width: number, height: number, title: string) {
        this.ptr = this.create(width, height, title);
    }

    private create(width: number, height: number, title: string) {
        return glfw.createWindow(width, height, title);
    }

    getContext() {
        if (!this.ctx) {
            this.ctx = new SurfaceContext(gpu, glfw, this.ptr);
        }
        return this.ctx;
    }

    destroy() {
        glfw.destroyWindow(this.ptr);
    }

    shouldClose() {
        return glfw.shouldClose(this.ptr);
    }

    pollEvents() {
        return glfw.pollEvents();
    }

    setTitle(title: string) {
        glfw.setWindowTitle(this.ptr, title);
    }

    getSize() {
        return glfw.getWindowSize(this.ptr);
    }

    setSize(width: number, height: number) {
        glfw.setWindowSize(this.ptr, width, height);
    }

    getPosition() {
        return glfw.getWindowPosition(this.ptr);
    }

    setPosition(x: number, y: number) {
        glfw.setWindowPosition(this.ptr, x, y);
    }

    setResizable(resizable: boolean) {
        glfw.setWindowResizable(this.ptr, resizable);
    }

    maximize() {
        glfw.maximizeWindow(this.ptr);
    }

    minimize() {
        glfw.minimizeWindow(this.ptr);
    }

    restore() {
        glfw.restoreWindow(this.ptr);
    }

    isMaximized() {
        return glfw.isWindowMaximized(this.ptr);
    }

    isMinimized() {
        return glfw.isWindowMinimized(this.ptr);
    }

    isVisible() {
        return glfw.isWindowVisible(this.ptr);
    }

    isFocused() {
        return glfw.isWindowFocused(this.ptr);
    }

    isHovered() {
        return glfw.isWindowHovered(this.ptr);
    }

    isMouseButtonPressed(button: number) {
        return glfw.getMouseButton(this.ptr, button);
    }

    getMousePosition() {
        return glfw.getMousePosition(this.ptr);
    }
}