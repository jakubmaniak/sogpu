import { type Pointer } from 'bun:ffi';
import { GLFWAdapter } from './glfw/adapter.js';
import { gpu } from './gpu.js';
import { SurfaceContext } from './surface.js';


const glfw = new GLFWAdapter();


export class WindowInstance {
    readonly ptr: Pointer;

    constructor(width: number, height: number, title: string) {
        this.ptr = this.create(width, height, title);
    }

    private create(width: number, height: number, title: string) {
        return glfw.createWindow(width, height, title);
    }

    getContext() {
        return new SurfaceContext(gpu, glfw, this.ptr);
    }

    destroy() {
        return glfw.destroyWindow(this.ptr);
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

    setSize(width: number, height: number) {
        glfw.setWindowSize(this.ptr, width, height);
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
}