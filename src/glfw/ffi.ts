import { fileURLToPath } from 'bun';
import { dlopen, FFIType, suffix } from 'bun:ffi';
import path from 'node:path';
import { getPlatformType } from '../platform.js';


const constants = {
    FALSE: 0,
    TRUE: 1,
    DONT_CARE: -1,

    RESIZABLE: 0x00020003,
    VISIBLE: 0x00020004,
    DECORATED: 0x00020005,
    FLOATING: 0x00020007,
    TRANSPARENT_FRAMEBUFFER: 0x0002000A,
    MOUSE_PASSTHROUGH: 0x0002000D,
    POSITION_X: 0x0002000E,
    POSITION_Y: 0x0002000F,
    SAMPLES: 0x0002100D,
    SRGB_CAPABLE: 0x0002100E,
    REFRESH_RATE: 0x0002100F,
    DOUBLEBUFFER: 0x00021010,
    CLIENT_API: 0x00022001,
    NO_API: 0,

    RELEASE: 0,
    PRESS: 1,
    REPEAT: 2,
    KEY_UNKNOWN: -1,
    MOD_SHIFT: 0x0001,
    MOD_CONTROL: 0x0002,
    MOD_ALT: 0x0004,
    MOD_SUPER: 0x0008,
    MOD_CAPS_LOCK: 0x0010,
    MOD_NUM_LOCK: 0x0020,
};


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
const libFilePath = (
    import.meta.file == 'ffi.ts'
    ? path.resolve(libPath)
    : fileURLToPath(import.meta.resolve(libPath))
);


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
    glfwGetWindowSize: {
        returns: FFIType.void,
        args: [FFIType.pointer, FFIType.pointer, FFIType.pointer]
    },
    glfwSetWindowIcon: {
        returns: FFIType.void,
        args: [FFIType.pointer, FFIType.i32, FFIType.pointer]
    },
    glfwSetInputMode: {
        returns: FFIType.void,
        args: [FFIType.pointer, FFIType.i32, FFIType.i32]
    },
    glfwGetKey: {
        returns: FFIType.i32,
        args: [FFIType.pointer, FFIType.i32]
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
    ...platformDependent[platform]
} as const);


export default { ...glfw, ...constants };
