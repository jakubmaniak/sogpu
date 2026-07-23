import { ptr, type Pointer } from 'bun:ffi';
import { getPlatformType } from '../platform.js';
import glfw from './ffi.js';


// glfw 3.0+
export class GLFWAdapter {
    constructor() {
        this.init();
    }

    init() {
        if (glfw.glfwInit() != glfw.TRUE) {
            throw new Error('Failed to initialize GLFW.');
        }
    }

    release() {
        glfw.glfwTerminate();
    }

    createWindow(width: number, height: number, title: string) {
        glfw.glfwWindowHint(glfw.CLIENT_API, glfw.NO_API);
        glfw.glfwWindowHint(glfw.RESIZABLE, glfw.FALSE);
        glfw.glfwWindowHint(glfw.TRANSPARENT_FRAMEBUFFER, glfw.TRUE);
        glfw.glfwWindowHint(glfw.SRGB_CAPABLE, glfw.TRUE);

        const titleBuffer = Buffer.from(title + '\0');

        const window = glfw.glfwCreateWindow(width, height, ptr(titleBuffer), null, null);
        if (!window) {
            throw new Error('Failed to create a window.');
        }

        return window;
    }

    destroyWindow(window: Pointer) {
        glfw.glfwDestroyWindow(window);
    }

    getChainHandles(window: Pointer) {
        switch (getPlatformType()) {
            case 'win32':
                return {
                    display: null,
                    window: (glfw as any).glfwGetWin32Window(window)
                };
            case 'wayland':
                return {
                    display: (glfw as any).glfwGetWaylandDisplay(),
                    window: (glfw as any).glfwGetWaylandWindow(window)
                };
            case 'x11':
                return {
                    display: (glfw as any).glfwGetX11Display(),
                    window: (glfw as any).glfwGetX11Window(window)
                };
            case 'cocoa':
                return {
                    display: null,
                    window: (glfw as any).glfwGetCocoaWindow(window)
                };
        }
    }

    pollEvents() {
        glfw.glfwPollEvents();
    }

    shouldClose(window: Pointer) {
        return glfw.glfwWindowShouldClose(window) != 0;
    }

    setWindowTitle(window: Pointer, title: string) {
        const titleBuffer = Buffer.from(title + '\0');
        glfw.glfwSetWindowTitle(window, ptr(titleBuffer));
    }

    getWindowSize(window: Pointer) {
        const result = new Int32Array(2);
        const widthPtr = ptr(result);
        const heightPtr = ptr(result, 4);
        glfw.glfwGetWindowSize(window, widthPtr, heightPtr);
        return { width: result[0], height: result[1] };
    }

    setWindowSize(window: Pointer, width: number, height: number) {
        glfw.glfwSetWindowSize(window, width, height);
    }

    getWindowPosition(window: Pointer) {
        const result = new Int32Array(2);
        const xPtr = ptr(result);
        const yPtr = ptr(result, 4);
        glfw.glfwGetWindowPos(window, xPtr, yPtr);
        return { x: result[0], y: result[1] };
    }

    setWindowPosition(window: Pointer, x: number, y: number) {
        glfw.glfwSetWindowPos(window, x, y);
    }

    setWindowResizable(window: Pointer, resizable: boolean) {
        glfw.glfwSetWindowAttrib(window, glfw.RESIZABLE, resizable ? glfw.TRUE : glfw.FALSE);
    }

    maximizeWindow(window: Pointer) {
        glfw.glfwMaximizeWindow(window);
    }

    minimizeWindow(window: Pointer) {
        glfw.glfwIconifyWindow(window);
    }

    restoreWindow(window: Pointer) {
        glfw.glfwRestoreWindow(window);
    }

    isWindowMaximized(window: Pointer) {
        return glfw.glfwGetWindowAttrib(window, glfw.MAXIMIZED) == 1;
    }

    isWindowMinimized(window: Pointer) {
        return glfw.glfwGetWindowAttrib(window, glfw.ICONIFIED) == 1;
    }

    isWindowVisible(window: Pointer) {
        return glfw.glfwGetWindowAttrib(window, glfw.VISIBLE) == 1;
    }

    isWindowFocused(window: Pointer) {
        return glfw.glfwGetWindowAttrib(window, glfw.FOCUSED) == 1;
    }

    isWindowHovered(window: Pointer) {
        return glfw.glfwGetWindowAttrib(window, glfw.HOVERED) == 1;
    }

    private readonly mousePos = new Float64Array(2);
    private readonly mouseXPtr = ptr(this.mousePos);
    private readonly mouseYPtr = ptr(this.mousePos, 8);

    getMousePosition(window: Pointer) {
        glfw.glfwGetCursorPos(window, this.mouseXPtr, this.mouseYPtr);
        return { x: this.mousePos[0], y: this.mousePos[1] };
    }

    getMouseButton(window: Pointer, button: number) {
        return glfw.glfwGetMouseButton(window, button) == glfw.PRESS;
    }

    getKeyState(window: Pointer, key: number) {
        return glfw.glfwGetKey(window, key);
    }
}
