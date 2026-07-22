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
        // glfw.glfwWindowHint(glfw.POSITION_X, 10);
        // glfw.glfwWindowHint(glfw.POSITION_Y, 40);
        // glfw.glfwWindowHint(glfw.FLOATING, glfw.TRUE);
        // glfw.glfwWindowHint(glfw.DECORATED, glfw.FALSE);
        // glfw.glfwWindowHint(glfw.MOUSE_PASSTHROUGH, glfw.TRUE);
        // glfw.glfwWindowHint(glfw.REFRESH_RATE, glfw.DONT_CARE);
        // glfw.glfwWindowHint(glfw.SRGB_CAPABLE, glfw.TRUE);
        // glfw.glfwWindowHint(glfw.DOUBLEBUFFER, glfw.TRUE);
        // glfw.glfwWindowHint(glfw.SAMPLES, 4);

        // const titleBuffer = new TextEncoder().encode(title + '\0');
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

    setWindowSize(window: Pointer, width: number, height: number) {
        glfw.glfwSetWindowSize(window, width, height);
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

    private readonly mousePos = new Float64Array(2);
    private readonly mouseXPtr = ptr(this.mousePos);
    private readonly mouseYPtr = ptr(this.mousePos, 8);

    getMousePosition(window: Pointer) {
        glfw.glfwGetCursorPos(window, this.mouseXPtr, this.mouseYPtr);
        return { x: this.mousePos[0], y: this.mousePos[1] };
    }

    getKeyState(window: Pointer, key: number) {
        return glfw.glfwGetKey(window, key);
    }
}
