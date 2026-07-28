import { JSCallback, ptr, toArrayBuffer, type Pointer } from 'bun:ffi';
import { getPlatformType } from '../platform.js';
import glfw from './ffi.js';


// glfw 3.1+
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

        glfw.glfwSetInputMode(window, glfw.LOCK_KEY_MODS, glfw.TRUE);

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

    private windowSizeCallback?: JSCallback;

    setWindowSizeCallback(window: Pointer, cb: null | ((winPtr: number, width: number, height: number) => void)) {
        this.windowSizeCallback?.close();

        if (cb == null) {
            glfw.glfwSetWindowSizeCallback(window, null);
        }
        else {
            this.windowSizeCallback = new JSCallback(cb, {
                args: ['ptr', 'int', 'int'],
                returns: 'void'
            });

            if (this.windowSizeCallback.ptr) {
                glfw.glfwSetWindowSizeCallback(window, this.windowSizeCallback.ptr);
            }
        }
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

    private scrollCallback?: JSCallback;

    setScrollCallback(window: Pointer, cb: (winPtr: number, dx: number, dy: number) => void) {
        this.scrollCallback?.close();

        this.scrollCallback = new JSCallback(cb, {
            args: ['ptr', 'double', 'double'],
            returns: 'void'
        });

        if (this.scrollCallback.ptr) {
            glfw.glfwSetScrollCallback(window, this.scrollCallback.ptr);
        }
    }

    isKeyPressed(window: Pointer, key: number) {
        return glfw.glfwGetKey(window, key) == glfw.PRESS;
    }

    private keyCallback?: JSCallback;

    setKeyCallback(window: Pointer, cb: (winPtr: number, key: number, scanCode: number, action: number, mods: number) => void) {
        this.keyCallback?.close();

        this.keyCallback = new JSCallback(cb, {
            args: ['ptr', 'int', 'int', 'int', 'int'],
            returns: 'void'
        });

        if (this.keyCallback.ptr) {
            glfw.glfwSetKeyCallback(window, this.keyCallback.ptr);
        }
    }

    private charCallback?: JSCallback;

    setCharCallback(window: Pointer, cb: (winPtr: number, codePoint: number) => void) {
        this.charCallback?.close();

        this.charCallback = new JSCallback(cb, {
            args: ['ptr', 'u32'],
            returns: 'void'
        });

        if (this.charCallback.ptr) {
            glfw.glfwSetCharCallback(window, this.charCallback.ptr);
        }
    }

    private charModsCallback?: JSCallback;

    setCharModsCallback(window: Pointer, cb: (winPtr: number, codePoint: number, mods: number) => void) {
        this.charModsCallback?.close();

        this.charModsCallback = new JSCallback(cb, {
            args: ['ptr', 'u32', 'int'],
            returns: 'void'
        });

        if (this.charModsCallback.ptr) {
            glfw.glfwSetCharModsCallback(window, this.charModsCallback.ptr);
        }
    }

    getWindowMonitor(window: Pointer) {
        return glfw.glfwGetWindowMonitor(window);
    }

    getPrimaryMonitor() {
        return glfw.glfwGetPrimaryMonitor();
    }

    getMonitorList() {
        const count = new Int32Array(1);

        const array = glfw.glfwGetMonitors(ptr(count));
        const length = count[0];

        const buffer = toArrayBuffer(array!, 0, length * 8);
        const ptrs = new BigUint64Array(buffer, 0, length);

        return Array.from(ptrs)
            .map((ptr) => Number(ptr) as Pointer);
    }

    getMonitorPos(monitor: Pointer) {
        const results = new Uint32Array(4);
        glfw.glfwGetMonitorPos(
            monitor,
            ptr(results, 0),
            ptr(results, 4)
        );

        return { x: results[0], y: results[1] };
    }

    getMonitorWorkarea(monitor: Pointer) {
        const results = new Uint32Array(4);

        glfw.glfwGetMonitorWorkarea(
            monitor,
            ptr(results, 0),
            ptr(results, 4),
            ptr(results, 8),
            ptr(results, 12)
        );

        return {
            x: results[0],
            y: results[1],
            width: results[2],
            height: results[3]
        };
    }

    getMonitorContentScale(monitor: Pointer) {
        const results = new Float32Array(2);

        glfw.glfwGetMonitorContentScale(
            monitor,
            ptr(results, 0),
            ptr(results, 4)
        );

        return { x: results[0], y: results[1] };
    }

    getMonitorVideoMode(monitor: Pointer) {
        const resultPtr = glfw.glfwGetVideoMode(monitor);
        if (!resultPtr) {
            return null;
        }

        const buffer = toArrayBuffer(resultPtr, 0, 6 * 4);
        const results = new Uint32Array(buffer, 0, 6);

        return {
            width: results[0],
            height: results[1],
            redBits: results[2],
            greenBits: results[3],
            blueBits: results[4],
            refreshRate: results[5]
        };
    }
}
