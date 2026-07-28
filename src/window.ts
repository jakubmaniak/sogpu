import { type Pointer } from 'bun:ffi';
import { GLFWAdapter } from './glfw/adapter.js';
import { gpu } from './gpu.js';
import { SurfaceContext } from './surface.js';


const glfw = new GLFWAdapter();


export class WindowFrame {
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

    setSizeCallback(cb?: (winPtr: number, width: number, height: number) => void) {
        glfw.setWindowSizeCallback(this.ptr, cb ?? null);
    }

    isMouseButtonPressed(button: number) {
        return glfw.getMouseButton(this.ptr, button);
    }

    getMousePosition() {
        return glfw.getMousePosition(this.ptr);
    }

    setScrollCallback(cb: (winPtr: number, dx: number, dy: number) => void) {
        glfw.setScrollCallback(this.ptr, cb);
    }

    isKeyPressed(key: number) {
        return glfw.isKeyPressed(this.ptr, key);
    }

    setKeyCallback(cb: (winPtr: number, key: number, scanCode: number, action: number, mods: number) => void) {
        return glfw.setKeyCallback(this.ptr, cb);
    }

    setCharCallback(cb: (winPtr: number, codePoint: number) => void) {
        return glfw.setCharCallback(this.ptr, cb);
    }

    setCharModsCallback(cb: (winPtr: number, codePoint: number, mods: number) => void) {
        return glfw.setCharModsCallback(this.ptr, cb);
    }

    getDisplayInfo() {
        let position: ReturnType<typeof glfw.getMonitorPos> | null = null;
        let videoMode: ReturnType<typeof glfw.getMonitorVideoMode> = null;

        let monitor = glfw.getWindowMonitor(this.ptr);

        if (monitor) {
            position = glfw.getMonitorPos(monitor);
            videoMode = glfw.getMonitorVideoMode(monitor);
        }
        else {
            const winPos = this.getPosition();
            const winSize = this.getSize();
            const cx = winPos.x + winSize.width / 2;
            const cy = winPos.y + winSize.height / 2;

            const monitors = glfw.getMonitorList();

            for (const monPtr of monitors) {
                const pos = glfw.getMonitorPos(monPtr);
                const vm = glfw.getMonitorVideoMode(monPtr);
                if (!vm) continue;

                if (cx >= pos.x && cx < pos.x + vm.width && cy >= pos.y && cy < pos.y + vm.height) {
                    position = pos;
                    videoMode = vm;
                    monitor = monPtr;
                    break;
                }
            }
        }

        if (monitor && position && videoMode) {
            const scale = glfw.getMonitorContentScale(monitor);

            return {
                x: position.x,
                y: position.y,
                width: videoMode.width,
                height: videoMode.height,
                refreshRate: videoMode.refreshRate,
                pixelDepth: videoMode.redBits + videoMode.greenBits + videoMode.blueBits,
                pixelRatio: scale.x
            };
        }
    }
}