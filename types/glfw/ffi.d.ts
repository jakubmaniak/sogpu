declare const _default: {
    FALSE: 0;
    TRUE: 1;
    DONT_CARE: -1;
    FOCUSED: 131073;
    ICONIFIED: 131074;
    RESIZABLE: 131075;
    VISIBLE: 131076;
    DECORATED: 131077;
    FLOATING: 131079;
    MAXIMIZED: 131080;
    TRANSPARENT_FRAMEBUFFER: 131082;
    HOVERED: 131083;
    MOUSE_PASSTHROUGH: 131085;
    POSITION_X: 131086;
    POSITION_Y: 131087;
    SAMPLES: 135181;
    SRGB_CAPABLE: 135182;
    REFRESH_RATE: 135183;
    DOUBLEBUFFER: 135184;
    CLIENT_API: 139265;
    LOCK_KEY_MODS: 208900;
    NO_API: 0;
    RELEASE: 0;
    PRESS: 1;
    REPEAT: 2;
    MOUSE_BUTTON_LEFT: 0;
    MOUSE_BUTTON_RIGHT: 1;
    MOUSE_BUTTON_MIDDLE: 2;
    KEY_UNKNOWN: -1;
    MOD_SHIFT: 1;
    MOD_CONTROL: 2;
    MOD_ALT: 4;
    MOD_SUPER: 8;
    MOD_CAPS_LOCK: 16;
    MOD_NUM_LOCK: 32;
    KEY_SPACE: 32;
    KEY_ESCAPE: 256;
    KEY_ENTER: 257;
    KEY_LEFT_SHIFT: 340;
    KEY_LEFT_CONTROL: 341;
    KEY_LEFT_ALT: 342;
    KEY_LEFT_SUPER: 343;
    KEY_RIGHT_SHIFT: 344;
    KEY_RIGHT_CONTROL: 345;
    KEY_RIGHT_ALT: 346;
    KEY_RIGHT_SUPER: 347;
    glfwGetWin32Window: {
        (...args: unknown[]): unknown;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwInit: {
        (): number;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwTerminate: {
        (): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwWindowHint: {
        (args_0: number, args_1: number): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwCreateWindow: {
        (args_0: number, args_1: number, args_2: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_3: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_4: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): import("bun:ffi").Pointer | null;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwDestroyWindow: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwWindowShouldClose: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): number;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwPollEvents: {
        (): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwGetWindowAttrib: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number): number;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetWindowAttrib: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number, args_2: number): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetWindowTitle: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetWindowIcon: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number, args_2: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwGetWindowSize: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_2: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetWindowSize: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number, args_2: number): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwGetWindowPos: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_2: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetWindowPos: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number, args_2: number): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwMaximizeWindow: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwIconifyWindow: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwRestoreWindow: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetWindowSizeCallback: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetInputMode: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number, args_2: number): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwGetKey: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number): number;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetKeyCallback: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").JSCallback | import("bun:ffi").Pointer): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetCharCallback: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").JSCallback | import("bun:ffi").Pointer): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetCharModsCallback: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").JSCallback | import("bun:ffi").Pointer): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwGetMouseButton: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number): number;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwGetCursorPos: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_2: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetCursorPos: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number, args_2: number): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetScrollCallback: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").JSCallback | import("bun:ffi").Pointer): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
} | {
    FALSE: 0;
    TRUE: 1;
    DONT_CARE: -1;
    FOCUSED: 131073;
    ICONIFIED: 131074;
    RESIZABLE: 131075;
    VISIBLE: 131076;
    DECORATED: 131077;
    FLOATING: 131079;
    MAXIMIZED: 131080;
    TRANSPARENT_FRAMEBUFFER: 131082;
    HOVERED: 131083;
    MOUSE_PASSTHROUGH: 131085;
    POSITION_X: 131086;
    POSITION_Y: 131087;
    SAMPLES: 135181;
    SRGB_CAPABLE: 135182;
    REFRESH_RATE: 135183;
    DOUBLEBUFFER: 135184;
    CLIENT_API: 139265;
    LOCK_KEY_MODS: 208900;
    NO_API: 0;
    RELEASE: 0;
    PRESS: 1;
    REPEAT: 2;
    MOUSE_BUTTON_LEFT: 0;
    MOUSE_BUTTON_RIGHT: 1;
    MOUSE_BUTTON_MIDDLE: 2;
    KEY_UNKNOWN: -1;
    MOD_SHIFT: 1;
    MOD_CONTROL: 2;
    MOD_ALT: 4;
    MOD_SUPER: 8;
    MOD_CAPS_LOCK: 16;
    MOD_NUM_LOCK: 32;
    KEY_SPACE: 32;
    KEY_ESCAPE: 256;
    KEY_ENTER: 257;
    KEY_LEFT_SHIFT: 340;
    KEY_LEFT_CONTROL: 341;
    KEY_LEFT_ALT: 342;
    KEY_LEFT_SUPER: 343;
    KEY_RIGHT_SHIFT: 344;
    KEY_RIGHT_CONTROL: 345;
    KEY_RIGHT_ALT: 346;
    KEY_RIGHT_SUPER: 347;
    glfwGetWaylandWindow: {
        (...args: unknown[]): unknown;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwGetWaylandDisplay: {
        (...args: never[]): unknown;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwInit: {
        (): number;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwTerminate: {
        (): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwWindowHint: {
        (args_0: number, args_1: number): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwCreateWindow: {
        (args_0: number, args_1: number, args_2: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_3: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_4: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): import("bun:ffi").Pointer | null;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwDestroyWindow: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwWindowShouldClose: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): number;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwPollEvents: {
        (): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwGetWindowAttrib: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number): number;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetWindowAttrib: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number, args_2: number): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetWindowTitle: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetWindowIcon: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number, args_2: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwGetWindowSize: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_2: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetWindowSize: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number, args_2: number): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwGetWindowPos: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_2: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetWindowPos: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number, args_2: number): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwMaximizeWindow: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwIconifyWindow: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwRestoreWindow: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetWindowSizeCallback: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetInputMode: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number, args_2: number): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwGetKey: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number): number;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetKeyCallback: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").JSCallback | import("bun:ffi").Pointer): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetCharCallback: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").JSCallback | import("bun:ffi").Pointer): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetCharModsCallback: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").JSCallback | import("bun:ffi").Pointer): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwGetMouseButton: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number): number;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwGetCursorPos: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_2: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetCursorPos: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number, args_2: number): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetScrollCallback: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").JSCallback | import("bun:ffi").Pointer): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
} | {
    FALSE: 0;
    TRUE: 1;
    DONT_CARE: -1;
    FOCUSED: 131073;
    ICONIFIED: 131074;
    RESIZABLE: 131075;
    VISIBLE: 131076;
    DECORATED: 131077;
    FLOATING: 131079;
    MAXIMIZED: 131080;
    TRANSPARENT_FRAMEBUFFER: 131082;
    HOVERED: 131083;
    MOUSE_PASSTHROUGH: 131085;
    POSITION_X: 131086;
    POSITION_Y: 131087;
    SAMPLES: 135181;
    SRGB_CAPABLE: 135182;
    REFRESH_RATE: 135183;
    DOUBLEBUFFER: 135184;
    CLIENT_API: 139265;
    LOCK_KEY_MODS: 208900;
    NO_API: 0;
    RELEASE: 0;
    PRESS: 1;
    REPEAT: 2;
    MOUSE_BUTTON_LEFT: 0;
    MOUSE_BUTTON_RIGHT: 1;
    MOUSE_BUTTON_MIDDLE: 2;
    KEY_UNKNOWN: -1;
    MOD_SHIFT: 1;
    MOD_CONTROL: 2;
    MOD_ALT: 4;
    MOD_SUPER: 8;
    MOD_CAPS_LOCK: 16;
    MOD_NUM_LOCK: 32;
    KEY_SPACE: 32;
    KEY_ESCAPE: 256;
    KEY_ENTER: 257;
    KEY_LEFT_SHIFT: 340;
    KEY_LEFT_CONTROL: 341;
    KEY_LEFT_ALT: 342;
    KEY_LEFT_SUPER: 343;
    KEY_RIGHT_SHIFT: 344;
    KEY_RIGHT_CONTROL: 345;
    KEY_RIGHT_ALT: 346;
    KEY_RIGHT_SUPER: 347;
    glfwGetX11Window: {
        (...args: unknown[]): unknown;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwGetX11Display: {
        (...args: never[]): unknown;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwInit: {
        (): number;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwTerminate: {
        (): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwWindowHint: {
        (args_0: number, args_1: number): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwCreateWindow: {
        (args_0: number, args_1: number, args_2: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_3: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_4: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): import("bun:ffi").Pointer | null;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwDestroyWindow: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwWindowShouldClose: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): number;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwPollEvents: {
        (): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwGetWindowAttrib: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number): number;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetWindowAttrib: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number, args_2: number): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetWindowTitle: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetWindowIcon: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number, args_2: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwGetWindowSize: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_2: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetWindowSize: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number, args_2: number): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwGetWindowPos: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_2: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetWindowPos: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number, args_2: number): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwMaximizeWindow: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwIconifyWindow: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwRestoreWindow: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetWindowSizeCallback: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetInputMode: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number, args_2: number): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwGetKey: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number): number;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetKeyCallback: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").JSCallback | import("bun:ffi").Pointer): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetCharCallback: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").JSCallback | import("bun:ffi").Pointer): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetCharModsCallback: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").JSCallback | import("bun:ffi").Pointer): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwGetMouseButton: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number): number;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwGetCursorPos: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_2: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetCursorPos: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number, args_2: number): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetScrollCallback: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").JSCallback | import("bun:ffi").Pointer): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
} | {
    FALSE: 0;
    TRUE: 1;
    DONT_CARE: -1;
    FOCUSED: 131073;
    ICONIFIED: 131074;
    RESIZABLE: 131075;
    VISIBLE: 131076;
    DECORATED: 131077;
    FLOATING: 131079;
    MAXIMIZED: 131080;
    TRANSPARENT_FRAMEBUFFER: 131082;
    HOVERED: 131083;
    MOUSE_PASSTHROUGH: 131085;
    POSITION_X: 131086;
    POSITION_Y: 131087;
    SAMPLES: 135181;
    SRGB_CAPABLE: 135182;
    REFRESH_RATE: 135183;
    DOUBLEBUFFER: 135184;
    CLIENT_API: 139265;
    LOCK_KEY_MODS: 208900;
    NO_API: 0;
    RELEASE: 0;
    PRESS: 1;
    REPEAT: 2;
    MOUSE_BUTTON_LEFT: 0;
    MOUSE_BUTTON_RIGHT: 1;
    MOUSE_BUTTON_MIDDLE: 2;
    KEY_UNKNOWN: -1;
    MOD_SHIFT: 1;
    MOD_CONTROL: 2;
    MOD_ALT: 4;
    MOD_SUPER: 8;
    MOD_CAPS_LOCK: 16;
    MOD_NUM_LOCK: 32;
    KEY_SPACE: 32;
    KEY_ESCAPE: 256;
    KEY_ENTER: 257;
    KEY_LEFT_SHIFT: 340;
    KEY_LEFT_CONTROL: 341;
    KEY_LEFT_ALT: 342;
    KEY_LEFT_SUPER: 343;
    KEY_RIGHT_SHIFT: 344;
    KEY_RIGHT_CONTROL: 345;
    KEY_RIGHT_ALT: 346;
    KEY_RIGHT_SUPER: 347;
    glfwGetCocoaWindow: {
        (...args: unknown[]): unknown;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwInit: {
        (): number;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwTerminate: {
        (): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwWindowHint: {
        (args_0: number, args_1: number): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwCreateWindow: {
        (args_0: number, args_1: number, args_2: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_3: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_4: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): import("bun:ffi").Pointer | null;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwDestroyWindow: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwWindowShouldClose: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): number;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwPollEvents: {
        (): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwGetWindowAttrib: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number): number;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetWindowAttrib: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number, args_2: number): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetWindowTitle: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetWindowIcon: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number, args_2: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwGetWindowSize: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_2: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetWindowSize: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number, args_2: number): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwGetWindowPos: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_2: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetWindowPos: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number, args_2: number): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwMaximizeWindow: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwIconifyWindow: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwRestoreWindow: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetWindowSizeCallback: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetInputMode: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number, args_2: number): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwGetKey: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number): number;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetKeyCallback: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").JSCallback | import("bun:ffi").Pointer): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetCharCallback: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").JSCallback | import("bun:ffi").Pointer): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetCharModsCallback: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").JSCallback | import("bun:ffi").Pointer): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwGetMouseButton: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number): number;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwGetCursorPos: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_2: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetCursorPos: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: number, args_2: number): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
    glfwSetScrollCallback: {
        (args_0: import("bun:ffi").CString | NodeJS.TypedArray<ArrayBufferLike> | import("bun:ffi").Pointer | null, args_1: import("bun:ffi").JSCallback | import("bun:ffi").Pointer): undefined;
        __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
    };
};
export default _default;
