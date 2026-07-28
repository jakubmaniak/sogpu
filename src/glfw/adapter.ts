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


export const keymap = new Map<number, string>([
    [ 32, 'Space'],
    [ 39, 'Quote'],
    [ 44, 'Comma'],
    [ 45, 'Minus'],
    [ 46, 'Period'],
    [ 47, 'Slash'],
    ...Array.from({ length: 10 }, (_, k) => [48 + k, `Digit${k}`] as const),
    [ 59, 'Semicolon'],
    [ 61, 'Equal'],
    ...Array.from({ length: 26 }, (_, k) => [65 + k, `Key${String.fromCharCode(65 + k)}`] as const),
    [ 91, 'BracketLeft'],
    [ 92, 'Backslash'],
    [ 93, 'BracketRight'],
    [ 96, 'Backquote'],
    [161, 'IntlBackslash'],
    [256, 'Escape'],
    [257, 'Enter'],
    [258, 'Tab'],
    [259, 'Backspace'],
    [260, 'Insert'],
    [261, 'Delete'],
    [262, 'ArrowRight'],
    [263, 'ArrowLeft'],
    [264, 'ArrowDown'],
    [265, 'ArrowUp'],
    [266, 'PageUp'],
    [267, 'PageDown'],
    [268, 'Home'],
    [267, 'End'],
    [280, 'CapsLock'],
    [281, 'ScrollLock'],
    [282, 'NumLock'],
    [283, 'PrintScreen'],
    ...Array.from({ length: 25 }, (_, k) => [290 + k, `F${k + 1}`] as const),
    ...Array.from({ length: 10 }, (_, k) => [320 + k, `Numpad${k}`] as const),
    [330, 'NumpadDecimal'],
    [331, 'NumpadDivide'],
    [332, 'NumpadMultiply'],
    [333, 'NumpadSubtract'],
    [334, 'NumpadAdd'],
    [335, 'NumpadEnter'],
    [340, 'ShiftLeft'],
    [341, 'ControlLeft'],
    [342, 'AltLeft'],
    [343, 'MetaLeft'],
    [344, 'ShiftRight'],
    [345, 'ControlRight'],
    [346, 'AltRight'],
    [347, 'MetaRight'],
    [348, 'ContextMenu'],
]);

export const keycodes = new Map<number, number>([
    [ 32, 32], //Space
    [ 39, 222], //Quote
    [ 44, 188], //Comma
    [ 45, 189], //Minus
    [ 46, 190], //Period
    [ 47, 191], //Slash
    ...Array.from({ length: 10 }, (_, k) => [48 + k, 48 + k] as const),
    [ 59, 186], //Semicolon
    [ 61, 187], //Equal
    ...Array.from({ length: 26 }, (_, k) => [65 + k, 65 + k] as const),
    [ 91, 219], //BracketLeft
    [ 92, 220], //Backslash
    [ 93, 221], //BracketRight
    [ 96, 192], //Backquote
    [161, 192], //IntlBackslash
    [256, 27], //Escape
    [257, 13], //Enter
    [258, 20], //Tab
    [259, 8], //Backspace
    [260, 45], //Insert
    [261, 46], //Delete
    [262, 39], //ArrowRight
    [263, 37], //ArrowLeft
    [264, 40], //ArrowDown
    [265, 38], //ArrowUp
    [266, 33], //PageUp
    [267, 34], //PageDown
    [268, 36], //Home
    [267, 35], //End
    [280, 20], //CapsLock
    [281, 145], //ScrollLock
    [282, 144], //NumLock
    [283, 44], //PrintScreen
    ...Array.from({ length: 25 }, (_, k) => [290 + k, 112 + k] as const),
    ...Array.from({ length: 10 }, (_, k) => [320 + k, 96 + k] as const),
    [330, 110], //NumpadDecimal
    [331, 111], //NumpadDivide
    [332, 106], //NumpadMultiply
    [333, 109], //NumpadSubtract
    [334, 107], //NumpadAdd
    [335, 13], //NumpadEnter
    [340, 16], //ShiftLeft
    [341, 17], //ControlLeft
    [342, 18], //AltLeft
    [343, 91], //MetaLeft
    [344, 16], //ShiftRight
    [345, 17], //ControlRight
    [346, 18], //AltRight
    [347, 93], //MetaRight
    [348, 93], //ContextMenu
]);