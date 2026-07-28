import { dlopen, FFIType, suffix } from 'bun:ffi';
import { getPlatformType, resolveLibPath } from '../platform.js';


const constants = {
    FALSE: 0,
    TRUE: 1,
    DONT_CARE: -1,

    FOCUSED: 0x00020001,
    ICONIFIED: 0x00020002,
    RESIZABLE: 0x00020003,
    VISIBLE: 0x00020004,
    DECORATED: 0x00020005,
    FLOATING: 0x00020007,
    MAXIMIZED: 0x00020008,
    TRANSPARENT_FRAMEBUFFER: 0x0002000A,
    HOVERED: 0x0002000B,
    MOUSE_PASSTHROUGH: 0x0002000D,
    POSITION_X: 0x0002000E,
    POSITION_Y: 0x0002000F,
    SAMPLES: 0x0002100D,
    SRGB_CAPABLE: 0x0002100E,
    REFRESH_RATE: 0x0002100F,
    DOUBLEBUFFER: 0x00021010,
    CLIENT_API: 0x00022001,
    LOCK_KEY_MODS: 0x00033004,
    NO_API: 0,

    RELEASE: 0,
    PRESS: 1,
    REPEAT: 2,
    MOUSE_BUTTON_LEFT: 0,
    MOUSE_BUTTON_RIGHT: 1,
    MOUSE_BUTTON_MIDDLE: 2,
    KEY_UNKNOWN: -1,
    MOD_SHIFT: 0x0001,
    MOD_CONTROL: 0x0002,
    MOD_ALT: 0x0004,
    MOD_SUPER: 0x0008,
    MOD_CAPS_LOCK: 0x0010,
    MOD_NUM_LOCK: 0x0020,
    KEY_SPACE: 32,
    KEY_ESCAPE: 256,
    KEY_ENTER: 257,
    KEY_LEFT_SHIFT: 340,
    KEY_LEFT_CONTROL: 341,
    KEY_LEFT_ALT: 342,
    KEY_LEFT_SUPER: 343,
    KEY_RIGHT_SHIFT: 344,
    KEY_RIGHT_CONTROL: 345,
    KEY_RIGHT_ALT: 346,
    KEY_RIGHT_SUPER: 347,
} as const;


const platform = getPlatformType();
const platformDependent = {
    win32: {
        glfwGetWin32Window: {
            returns: FFIType.pointer,
            args: [FFIType.pointer]
        }
    },
    wayland: {
        glfwGetWaylandWindow: {
            returns: FFIType.pointer,
            args: [FFIType.pointer]
        },
        glfwGetWaylandDisplay: {
            returns: FFIType.pointer,
            args: []
        }
    },
    x11: {
        glfwGetX11Window: {
            returns: FFIType.u64,
            args: [FFIType.pointer]
        },
        glfwGetX11Display: {
            returns: FFIType.pointer,
            args: []
        }
    },
    cocoa: {
        glfwGetCocoaWindow: {
            returns: FFIType.pointer,
            args: [FFIType.pointer]
        }
    }
};

const libPath = (
    platform == 'win32'
    ? './lib/glfw3.dll'
    : platform == 'cocoa'
    ? './lib/libglfw.dylib'
    : `./lib/glfw3.${process.arch}.${suffix}`
);
const libFilePath = resolveLibPath(libPath);


const { symbols: glfw } = dlopen(libFilePath, {
    glfwInit: {
        returns: FFIType.i32,
        args: []
    },
    glfwTerminate: {
        returns: FFIType.void,
        args: []
    },
    glfwWindowHint: {
        returns: FFIType.void,
        args: [FFIType.i32, FFIType.i32]
    },
    glfwCreateWindow: {
        returns: FFIType.pointer,
        args: [FFIType.i32, FFIType.i32, FFIType.cstring, FFIType.pointer, FFIType.pointer]
    },
    glfwDestroyWindow: {
        returns: FFIType.void,
        args: [FFIType.pointer]
    },
    glfwWindowShouldClose: {
        returns: FFIType.i32,
        args: [FFIType.pointer]
    },
    glfwPollEvents: {
        returns: FFIType.void,
        args: []
    },
    glfwGetWindowAttrib: {
        returns: FFIType.i32,
        args: [FFIType.pointer, FFIType.i32]
    },
    glfwSetWindowAttrib: {
        returns: FFIType.void,
        args: [FFIType.pointer, FFIType.i32, FFIType.i32]
    },
    glfwSetWindowTitle: {
        returns: FFIType.void,
        args: [FFIType.pointer, FFIType.cstring]
    },
    glfwSetWindowIcon: {
        returns: FFIType.void,
        args: [FFIType.pointer, FFIType.i32, FFIType.pointer]
    },
    glfwGetWindowSize: {
        returns: FFIType.void,
        args: [FFIType.pointer, FFIType.pointer, FFIType.pointer]
    },
    glfwSetWindowSize: {
        returns: FFIType.void,
        args: [FFIType.pointer, FFIType.i32, FFIType.i32]
    },
    glfwGetWindowPos: {
        returns: FFIType.void,
        args: [FFIType.pointer, FFIType.pointer, FFIType.pointer]
    },
    glfwSetWindowPos: {
        returns: FFIType.void,
        args: [FFIType.pointer, FFIType.i32, FFIType.i32]
    },
    glfwMaximizeWindow: {
        returns: FFIType.void,
        args: [FFIType.pointer]
    },
    glfwIconifyWindow: {
        returns: FFIType.void,
        args: [FFIType.pointer]
    },
    glfwRestoreWindow: {
        returns: FFIType.void,
        args: [FFIType.pointer]
    },
    glfwSetWindowSizeCallback: {
        returns: FFIType.void,
        args: [FFIType.pointer, FFIType.ptr]
    },
    glfwSetInputMode: {
        returns: FFIType.void,
        args: [FFIType.pointer, FFIType.i32, FFIType.i32]
    },
    glfwGetKey: {
        returns: FFIType.i32,
        args: [FFIType.pointer, FFIType.i32]
    },
    glfwSetKeyCallback: {
        returns: FFIType.void,
        args: [FFIType.pointer, FFIType.function]
    },
    glfwSetCharCallback: {
        returns: FFIType.void,
        args: [FFIType.pointer, FFIType.function]
    },
    glfwSetCharModsCallback: {
        returns: FFIType.void,
        args: [FFIType.pointer, FFIType.function]
    },
    glfwGetMouseButton: {
        returns: FFIType.i32,
        args: [FFIType.pointer, FFIType.i32]
    },
    glfwGetCursorPos: {
        returns: FFIType.void,
        args: [FFIType.pointer, FFIType.pointer, FFIType.pointer]
    },
    glfwSetCursorPos: {
        returns: FFIType.void,
        args: [FFIType.pointer, FFIType.double, FFIType.double]
    },
    glfwSetScrollCallback: {
        returns: FFIType.void,
        args: [FFIType.pointer, FFIType.function]
    },
    ...platformDependent[platform]
} as const);


export default { ...glfw, ...constants };
