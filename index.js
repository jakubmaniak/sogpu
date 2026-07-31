// @bun
// src/gpu.ts
import { createGPUInstance } from "bun-webgpu";
import { FFIType, JSCallback, toArrayBuffer } from "bun:ffi";

// src/external-source.ts
var toExternalSource = Symbol("toExternalSource");

// src/gpu.ts
var GPUBufferUsage;
((GPUBufferUsage2) => {
  GPUBufferUsage2[GPUBufferUsage2["MAP_READ"] = 1] = "MAP_READ";
  GPUBufferUsage2[GPUBufferUsage2["MAP_WRITE"] = 2] = "MAP_WRITE";
  GPUBufferUsage2[GPUBufferUsage2["COPY_SRC"] = 4] = "COPY_SRC";
  GPUBufferUsage2[GPUBufferUsage2["COPY_DST"] = 8] = "COPY_DST";
  GPUBufferUsage2[GPUBufferUsage2["INDEX"] = 16] = "INDEX";
  GPUBufferUsage2[GPUBufferUsage2["VERTEX"] = 32] = "VERTEX";
  GPUBufferUsage2[GPUBufferUsage2["UNIFORM"] = 64] = "UNIFORM";
  GPUBufferUsage2[GPUBufferUsage2["STORAGE"] = 128] = "STORAGE";
  GPUBufferUsage2[GPUBufferUsage2["INDIRECT"] = 256] = "INDIRECT";
  GPUBufferUsage2[GPUBufferUsage2["QUERY_RESOLVE"] = 512] = "QUERY_RESOLVE";
})(GPUBufferUsage ||= {});
var GPUTextureUsage;
((GPUTextureUsage2) => {
  GPUTextureUsage2[GPUTextureUsage2["COPY_SRC"] = 1] = "COPY_SRC";
  GPUTextureUsage2[GPUTextureUsage2["COPY_DST"] = 2] = "COPY_DST";
  GPUTextureUsage2[GPUTextureUsage2["TEXTURE_BINDING"] = 4] = "TEXTURE_BINDING";
  GPUTextureUsage2[GPUTextureUsage2["STORAGE_BINDING"] = 8] = "STORAGE_BINDING";
  GPUTextureUsage2[GPUTextureUsage2["RENDER_ATTACHMENT"] = 16] = "RENDER_ATTACHMENT";
  GPUTextureUsage2[GPUTextureUsage2["TRANSIENT_ATTACHMENT"] = 32] = "TRANSIENT_ATTACHMENT";
})(GPUTextureUsage ||= {});
var GPUShaderStage;
((GPUShaderStage2) => {
  GPUShaderStage2[GPUShaderStage2["VERTEX"] = 1] = "VERTEX";
  GPUShaderStage2[GPUShaderStage2["FRAGMENT"] = 2] = "FRAGMENT";
  GPUShaderStage2[GPUShaderStage2["COMPUTE"] = 4] = "COMPUTE";
})(GPUShaderStage ||= {});
globalThis.GPUTextureUsage = GPUTextureUsage;
globalThis.GPUBufferUsage = GPUBufferUsage;
globalThis.GPUShaderStage = GPUShaderStage;
var gpu = createGPUInstance();
var requestAdapterFn = gpu.requestAdapter.bind(gpu);
gpu.requestAdapter = async function(options) {
  async function request(backendType) {
    const adapter = await requestAdapterFn({
      ...options,
      backendType
    });
    if (adapter)
      wrapAdapter(adapter);
    return adapter;
  }
  if (process.platform == "win32") {
    const preferred = options?.preferBackend ?? "vulkan";
    const backendCandidates = {
      dx11: ["D3D11", "Vulkan"],
      dx12: ["D3D12", "D3D11", "Vulkan"],
      vulkan: ["Vulkan", "D3D11"]
    }[preferred] ?? ["Vulkan", "D3D11"];
    for (const backendType of backendCandidates) {
      const adapter = await request(backendType).catch(() => null);
      if (adapter)
        return adapter;
    }
    return null;
  }
  return request(process.platform == "darwin" ? "Metal" : "Vulkan");
};
function wrapAdapter(adapter) {
  const requestDeviceFn = adapter.requestDevice.bind(adapter);
  adapter.requestDevice = async function(desc) {
    const device = await requestDeviceFn(desc);
    if (device)
      wrapDevice(device);
    return device;
  };
}
function wrapDevice(device) {
  const queue = device.queue;
  const submitFn = queue.submit.bind(queue);
  function submit(commandBuffers) {
    submitFn(commandBuffers);
    for (const cmdBuf of commandBuffers) {
      cmdBuf._destroy();
    }
  }
  function copyExternalImageToTexture(src, dst, size) {
    if (!(toExternalSource in src.source)) {
      throw new Error("copyExternalImageToTexture: Unsupported source.");
    }
    const provider = src.source;
    const source = provider[toExternalSource]();
    device.queue.writeTexture({
      texture: dst.texture,
      origin: dst.origin,
      mipLevel: dst.mipLevel,
      aspect: dst.aspect
    }, source.data, {
      bytesPerRow: source.bytesPerRow,
      rowsPerImage: source.rowsPerImage
    }, size);
  }
  queue.submit = submit.bind(queue);
  queue.copyExternalImageToTexture = copyExternalImageToTexture.bind(queue);
  if (process.platform == "win32") {
    let popErrorScopeCallback = function(status, errorType, messagePtr, messageSize, userdata1, userdata2) {
      this.instanceTicker.unregister();
    };
    device._popErrorScopeCallback = new JSCallback(popErrorScopeCallback.bind(device), {
      args: [FFIType.u32, FFIType.u32, FFIType.pointer, FFIType.u64, FFIType.pointer, FFIType.pointer]
    });
  }
}
function extendDevice(device, props) {
  return Object.assign(device, props);
}
function createMappedBuffer(device, data, usage) {
  const buffer = device.createBuffer({
    size: data.byteLength + 3 & ~3,
    usage,
    mappedAtCreation: true
  });
  new data.constructor(buffer.getMappedRange()).set(data);
  buffer.unmap();
  return buffer;
}
var errorTypes = {
  1: "NoError",
  2: "Validation",
  3: "OutOfMemory",
  4: "Internal",
  5: "Unknown"
};
function addGPUErrorHandler(adapter) {
  adapter.handleUncapturedError = (devicePtr, errType, msgPtr, msgSize, ud1, ud2) => {
    const typeText = errorTypes[errType];
    let message = "[empty message]";
    if (msgPtr) {
      if (process.platform == "win32") {
        const stringView = toArrayBuffer(msgPtr, 0, 16);
        const dv = new DataView(stringView);
        const dataPtr = dv.getBigUint64(0, true);
        const length = Number(dv.getBigUint64(8, true));
        if (dataPtr !== 0n && length > 0) {
          const strBuf = toArrayBuffer(Number(dataPtr), 0, length);
          message = new TextDecoder().decode(strBuf);
        }
      } else {
        const strBuf = toArrayBuffer(msgPtr, 0, Number(msgSize));
        message = new TextDecoder().decode(strBuf);
      }
    }
    console.error(`[WebGPU error] [${typeText}] ${message}`);
    process.exit(1);
  };
}
// src/glfw/adapter.ts
import { JSCallback as JSCallback2, ptr, toArrayBuffer as toArrayBuffer2 } from "bun:ffi";

// src/platform.ts
var {fileURLToPath } = globalThis.Bun;
import path from "path";
function getPlatformType() {
  switch (process.platform) {
    case "win32":
      return "win32";
    case "darwin":
      return "cocoa";
    case "linux":
      if (process.env.WAYLAND_DISPLAY || process.env.XDG_SESSION_TYPE == "wayland") {
        return "wayland";
      }
      return "x11";
    default:
      throw new Error(`Unsupported platform: ${process.platform}`);
  }
}
function resolveLibPath(libPath) {
  if (import.meta.file == "platform.ts") {
    return path.resolve(libPath);
  } else if (import.meta.dir.startsWith("/$bunfs/") || import.meta.dir.startsWith("B:\\~BUN\\")) {
    return path.join(path.dirname(process.execPath), libPath);
  } else {
    return fileURLToPath(import.meta.resolve(libPath));
  }
}

// src/glfw/ffi.ts
import { dlopen, FFIType as FFIType2, suffix } from "bun:ffi";
var constants = {
  FALSE: 0,
  TRUE: 1,
  DONT_CARE: -1,
  FOCUSED: 131073,
  ICONIFIED: 131074,
  RESIZABLE: 131075,
  VISIBLE: 131076,
  DECORATED: 131077,
  FLOATING: 131079,
  MAXIMIZED: 131080,
  TRANSPARENT_FRAMEBUFFER: 131082,
  HOVERED: 131083,
  MOUSE_PASSTHROUGH: 131085,
  POSITION_X: 131086,
  POSITION_Y: 131087,
  SAMPLES: 135181,
  SRGB_CAPABLE: 135182,
  REFRESH_RATE: 135183,
  DOUBLEBUFFER: 135184,
  CLIENT_API: 139265,
  LOCK_KEY_MODS: 208900,
  NO_API: 0,
  RELEASE: 0,
  PRESS: 1,
  REPEAT: 2,
  MOUSE_BUTTON_LEFT: 0,
  MOUSE_BUTTON_RIGHT: 1,
  MOUSE_BUTTON_MIDDLE: 2,
  KEY_UNKNOWN: -1,
  MOD_SHIFT: 1,
  MOD_CONTROL: 2,
  MOD_ALT: 4,
  MOD_SUPER: 8,
  MOD_CAPS_LOCK: 16,
  MOD_NUM_LOCK: 32,
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
  KEY_RIGHT_SUPER: 347
};
var platform = getPlatformType();
var platformDependent = {
  win32: {
    glfwGetWin32Window: {
      returns: FFIType2.pointer,
      args: [FFIType2.pointer]
    }
  },
  wayland: {
    glfwGetWaylandWindow: {
      returns: FFIType2.pointer,
      args: [FFIType2.pointer]
    },
    glfwGetWaylandDisplay: {
      returns: FFIType2.pointer,
      args: []
    }
  },
  x11: {
    glfwGetX11Window: {
      returns: FFIType2.u64,
      args: [FFIType2.pointer]
    },
    glfwGetX11Display: {
      returns: FFIType2.pointer,
      args: []
    }
  },
  cocoa: {
    glfwGetCocoaWindow: {
      returns: FFIType2.pointer,
      args: [FFIType2.pointer]
    }
  }
};
var libPath = platform == "win32" ? "./lib/glfw3.dll" : platform == "cocoa" ? "./lib/libglfw.dylib" : `./lib/glfw3.${process.arch}.${suffix}`;
var libFilePath = resolveLibPath(libPath);
var { symbols: glfw } = dlopen(libFilePath, {
  glfwInit: {
    returns: FFIType2.i32,
    args: []
  },
  glfwTerminate: {
    returns: FFIType2.void,
    args: []
  },
  glfwWindowHint: {
    returns: FFIType2.void,
    args: [FFIType2.i32, FFIType2.i32]
  },
  glfwCreateWindow: {
    returns: FFIType2.pointer,
    args: [FFIType2.i32, FFIType2.i32, FFIType2.cstring, FFIType2.pointer, FFIType2.pointer]
  },
  glfwDestroyWindow: {
    returns: FFIType2.void,
    args: [FFIType2.pointer]
  },
  glfwWindowShouldClose: {
    returns: FFIType2.i32,
    args: [FFIType2.pointer]
  },
  glfwPollEvents: {
    returns: FFIType2.void,
    args: []
  },
  glfwGetWindowAttrib: {
    returns: FFIType2.i32,
    args: [FFIType2.pointer, FFIType2.i32]
  },
  glfwSetWindowAttrib: {
    returns: FFIType2.void,
    args: [FFIType2.pointer, FFIType2.i32, FFIType2.i32]
  },
  glfwSetWindowTitle: {
    returns: FFIType2.void,
    args: [FFIType2.pointer, FFIType2.cstring]
  },
  glfwSetWindowIcon: {
    returns: FFIType2.void,
    args: [FFIType2.pointer, FFIType2.i32, FFIType2.pointer]
  },
  glfwGetWindowSize: {
    returns: FFIType2.void,
    args: [FFIType2.pointer, FFIType2.pointer, FFIType2.pointer]
  },
  glfwSetWindowSize: {
    returns: FFIType2.void,
    args: [FFIType2.pointer, FFIType2.i32, FFIType2.i32]
  },
  glfwGetWindowPos: {
    returns: FFIType2.void,
    args: [FFIType2.pointer, FFIType2.pointer, FFIType2.pointer]
  },
  glfwSetWindowPos: {
    returns: FFIType2.void,
    args: [FFIType2.pointer, FFIType2.i32, FFIType2.i32]
  },
  glfwMaximizeWindow: {
    returns: FFIType2.void,
    args: [FFIType2.pointer]
  },
  glfwIconifyWindow: {
    returns: FFIType2.void,
    args: [FFIType2.pointer]
  },
  glfwRestoreWindow: {
    returns: FFIType2.void,
    args: [FFIType2.pointer]
  },
  glfwSetWindowSizeCallback: {
    returns: FFIType2.void,
    args: [FFIType2.pointer, FFIType2.ptr]
  },
  glfwSetInputMode: {
    returns: FFIType2.void,
    args: [FFIType2.pointer, FFIType2.i32, FFIType2.i32]
  },
  glfwGetKey: {
    returns: FFIType2.i32,
    args: [FFIType2.pointer, FFIType2.i32]
  },
  glfwSetKeyCallback: {
    returns: FFIType2.void,
    args: [FFIType2.pointer, FFIType2.function]
  },
  glfwSetCharCallback: {
    returns: FFIType2.void,
    args: [FFIType2.pointer, FFIType2.function]
  },
  glfwSetCharModsCallback: {
    returns: FFIType2.void,
    args: [FFIType2.pointer, FFIType2.function]
  },
  glfwGetMouseButton: {
    returns: FFIType2.i32,
    args: [FFIType2.pointer, FFIType2.i32]
  },
  glfwGetCursorPos: {
    returns: FFIType2.void,
    args: [FFIType2.pointer, FFIType2.pointer, FFIType2.pointer]
  },
  glfwSetCursorPos: {
    returns: FFIType2.void,
    args: [FFIType2.pointer, FFIType2.double, FFIType2.double]
  },
  glfwSetScrollCallback: {
    returns: FFIType2.void,
    args: [FFIType2.pointer, FFIType2.function]
  },
  glfwGetPrimaryMonitor: {
    returns: FFIType2.pointer
  },
  glfwGetMonitors: {
    returns: FFIType2.pointer,
    args: [FFIType2.pointer]
  },
  glfwGetWindowMonitor: {
    returns: FFIType2.pointer,
    args: [FFIType2.pointer]
  },
  glfwGetMonitorPos: {
    returns: FFIType2.void,
    args: [FFIType2.pointer, FFIType2.pointer, FFIType2.pointer]
  },
  glfwGetMonitorWorkarea: {
    returns: FFIType2.void,
    args: [FFIType2.pointer, FFIType2.pointer, FFIType2.pointer, FFIType2.pointer, FFIType2.pointer]
  },
  glfwGetMonitorContentScale: {
    returns: FFIType2.void,
    args: [FFIType2.pointer, FFIType2.pointer, FFIType2.pointer]
  },
  glfwGetVideoMode: {
    returns: FFIType2.pointer,
    args: [FFIType2.pointer]
  },
  ...platformDependent[platform]
});
var ffi_default = { ...glfw, ...constants };

// src/glfw/adapter.ts
class GLFWAdapter {
  constructor() {
    this.init();
  }
  init() {
    if (ffi_default.glfwInit() != ffi_default.TRUE) {
      throw new Error("Failed to initialize GLFW.");
    }
  }
  release() {
    ffi_default.glfwTerminate();
  }
  createWindow(width, height, title) {
    ffi_default.glfwWindowHint(ffi_default.CLIENT_API, ffi_default.NO_API);
    ffi_default.glfwWindowHint(ffi_default.RESIZABLE, ffi_default.FALSE);
    ffi_default.glfwWindowHint(ffi_default.TRANSPARENT_FRAMEBUFFER, ffi_default.TRUE);
    ffi_default.glfwWindowHint(ffi_default.SRGB_CAPABLE, ffi_default.TRUE);
    const titleBuffer = Buffer.from(title + "\x00");
    const window = ffi_default.glfwCreateWindow(width, height, ptr(titleBuffer), null, null);
    if (!window) {
      throw new Error("Failed to create a window.");
    }
    ffi_default.glfwSetInputMode(window, ffi_default.LOCK_KEY_MODS, ffi_default.TRUE);
    return window;
  }
  destroyWindow(window) {
    ffi_default.glfwDestroyWindow(window);
  }
  getChainHandles(window) {
    switch (getPlatformType()) {
      case "win32":
        return {
          display: null,
          window: ffi_default.glfwGetWin32Window(window)
        };
      case "wayland":
        return {
          display: ffi_default.glfwGetWaylandDisplay(),
          window: ffi_default.glfwGetWaylandWindow(window)
        };
      case "x11":
        return {
          display: ffi_default.glfwGetX11Display(),
          window: ffi_default.glfwGetX11Window(window)
        };
      case "cocoa":
        return {
          display: null,
          window: ffi_default.glfwGetCocoaWindow(window)
        };
    }
  }
  pollEvents() {
    ffi_default.glfwPollEvents();
  }
  shouldClose(window) {
    return ffi_default.glfwWindowShouldClose(window) != 0;
  }
  setWindowTitle(window, title) {
    const titleBuffer = Buffer.from(title + "\x00");
    ffi_default.glfwSetWindowTitle(window, ptr(titleBuffer));
  }
  getWindowSize(window) {
    const result = new Int32Array(2);
    const widthPtr = ptr(result);
    const heightPtr = ptr(result, 4);
    ffi_default.glfwGetWindowSize(window, widthPtr, heightPtr);
    return { width: result[0], height: result[1] };
  }
  setWindowSize(window, width, height) {
    ffi_default.glfwSetWindowSize(window, width, height);
  }
  getWindowPosition(window) {
    const result = new Int32Array(2);
    const xPtr = ptr(result);
    const yPtr = ptr(result, 4);
    ffi_default.glfwGetWindowPos(window, xPtr, yPtr);
    return { x: result[0], y: result[1] };
  }
  setWindowPosition(window, x, y) {
    ffi_default.glfwSetWindowPos(window, x, y);
  }
  setWindowResizable(window, resizable) {
    ffi_default.glfwSetWindowAttrib(window, ffi_default.RESIZABLE, resizable ? ffi_default.TRUE : ffi_default.FALSE);
  }
  maximizeWindow(window) {
    ffi_default.glfwMaximizeWindow(window);
  }
  minimizeWindow(window) {
    ffi_default.glfwIconifyWindow(window);
  }
  restoreWindow(window) {
    ffi_default.glfwRestoreWindow(window);
  }
  isWindowMaximized(window) {
    return ffi_default.glfwGetWindowAttrib(window, ffi_default.MAXIMIZED) == 1;
  }
  isWindowMinimized(window) {
    return ffi_default.glfwGetWindowAttrib(window, ffi_default.ICONIFIED) == 1;
  }
  isWindowVisible(window) {
    return ffi_default.glfwGetWindowAttrib(window, ffi_default.VISIBLE) == 1;
  }
  isWindowFocused(window) {
    return ffi_default.glfwGetWindowAttrib(window, ffi_default.FOCUSED) == 1;
  }
  isWindowHovered(window) {
    return ffi_default.glfwGetWindowAttrib(window, ffi_default.HOVERED) == 1;
  }
  windowSizeCallback;
  setWindowSizeCallback(window, cb) {
    this.windowSizeCallback?.close();
    if (cb == null) {
      ffi_default.glfwSetWindowSizeCallback(window, null);
    } else {
      this.windowSizeCallback = new JSCallback2(cb, {
        args: ["ptr", "int", "int"],
        returns: "void"
      });
      if (this.windowSizeCallback.ptr) {
        ffi_default.glfwSetWindowSizeCallback(window, this.windowSizeCallback.ptr);
      }
    }
  }
  mousePos = new Float64Array(2);
  mouseXPtr = ptr(this.mousePos);
  mouseYPtr = ptr(this.mousePos, 8);
  getMousePosition(window) {
    ffi_default.glfwGetCursorPos(window, this.mouseXPtr, this.mouseYPtr);
    return { x: this.mousePos[0], y: this.mousePos[1] };
  }
  getMouseButton(window, button) {
    return ffi_default.glfwGetMouseButton(window, button) == ffi_default.PRESS;
  }
  scrollCallback;
  setScrollCallback(window, cb) {
    this.scrollCallback?.close();
    this.scrollCallback = new JSCallback2(cb, {
      args: ["ptr", "double", "double"],
      returns: "void"
    });
    if (this.scrollCallback.ptr) {
      ffi_default.glfwSetScrollCallback(window, this.scrollCallback.ptr);
    }
  }
  isKeyPressed(window, key) {
    return ffi_default.glfwGetKey(window, key) == ffi_default.PRESS;
  }
  keyCallback;
  setKeyCallback(window, cb) {
    this.keyCallback?.close();
    this.keyCallback = new JSCallback2(cb, {
      args: ["ptr", "int", "int", "int", "int"],
      returns: "void"
    });
    if (this.keyCallback.ptr) {
      ffi_default.glfwSetKeyCallback(window, this.keyCallback.ptr);
    }
  }
  charCallback;
  setCharCallback(window, cb) {
    this.charCallback?.close();
    this.charCallback = new JSCallback2(cb, {
      args: ["ptr", "u32"],
      returns: "void"
    });
    if (this.charCallback.ptr) {
      ffi_default.glfwSetCharCallback(window, this.charCallback.ptr);
    }
  }
  charModsCallback;
  setCharModsCallback(window, cb) {
    this.charModsCallback?.close();
    this.charModsCallback = new JSCallback2(cb, {
      args: ["ptr", "u32", "int"],
      returns: "void"
    });
    if (this.charModsCallback.ptr) {
      ffi_default.glfwSetCharModsCallback(window, this.charModsCallback.ptr);
    }
  }
  getWindowMonitor(window) {
    return ffi_default.glfwGetWindowMonitor(window);
  }
  getPrimaryMonitor() {
    return ffi_default.glfwGetPrimaryMonitor();
  }
  getMonitorList() {
    const count = new Int32Array(1);
    const array = ffi_default.glfwGetMonitors(ptr(count));
    const length = count[0];
    const buffer = toArrayBuffer2(array, 0, length * 8);
    const ptrs = new BigUint64Array(buffer, 0, length);
    return Array.from(ptrs).map((ptr2) => Number(ptr2));
  }
  getMonitorPos(monitor) {
    const results = new Uint32Array(4);
    ffi_default.glfwGetMonitorPos(monitor, ptr(results, 0), ptr(results, 4));
    return { x: results[0], y: results[1] };
  }
  getMonitorWorkarea(monitor) {
    const results = new Uint32Array(4);
    ffi_default.glfwGetMonitorWorkarea(monitor, ptr(results, 0), ptr(results, 4), ptr(results, 8), ptr(results, 12));
    return {
      x: results[0],
      y: results[1],
      width: results[2],
      height: results[3]
    };
  }
  getMonitorContentScale(monitor) {
    const results = new Float32Array(2);
    ffi_default.glfwGetMonitorContentScale(monitor, ptr(results, 0), ptr(results, 4));
    return { x: results[0], y: results[1] };
  }
  getMonitorVideoMode(monitor) {
    const resultPtr = ffi_default.glfwGetVideoMode(monitor);
    if (!resultPtr) {
      return null;
    }
    const buffer = toArrayBuffer2(resultPtr, 0, 6 * 4);
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

// src/surface.ts
import { dlopen as dlopen2, ptr as ptr2 } from "bun:ffi";
function createSurface(lib, instance, handles, config) {
  const chain = getSurfaceChain(handles, config);
  const descriptor = new Uint8Array(24);
  const view = new DataView(descriptor.buffer);
  view.setBigUint64(0, BigInt(ptr2(chain)), true);
  return lib.wgpuInstanceCreateSurface(instance, ptr2(descriptor)) ?? null;
}
function getSurfaceChain(handles, config) {
  const { display, window } = handles;
  switch (getPlatformType()) {
    case "win32":
      return win32Chain(window);
    case "wayland":
      return waylandChain(display, window);
    case "x11":
      return x11Chain(display, window);
    case "cocoa":
      return cocoaChain(window, config);
  }
}
var textureFormats = {
  rgba8unorm: 18,
  bgra8unorm: 23,
  rgba16float: 34
};
var surfaceSourceMetalLayer = 4;
var surfaceSourceWindowsHWND = 5;
var surfaceSourceXlibWindow = 6;
var surfaceSourceWaylandSurface = 7;
function win32Chain(window) {
  const { symbols: k32 } = dlopen2("kernel32.dll", {
    GetModuleHandleW: {
      returns: "pointer",
      args: ["pointer"]
    }
  });
  const hinstancePtr = k32.GetModuleHandleW(null);
  if (!hinstancePtr) {
    throw new Error("Failed to get HINSTANCE.");
  }
  const chain = new Uint8Array(32);
  const view = new DataView(chain.buffer);
  view.setUint32(8, surfaceSourceWindowsHWND, true);
  view.setBigUint64(16, BigInt(hinstancePtr), true);
  view.setBigUint64(24, BigInt(window), true);
  return chain;
}
function x11Chain(display, window) {
  const chain = new Uint8Array(32);
  const view = new DataView(chain.buffer);
  view.setUint32(8, surfaceSourceXlibWindow, true);
  view.setBigUint64(16, BigInt(display), true);
  view.setBigUint64(24, BigInt(window), true);
  return chain;
}
function waylandChain(display, waylandSurface) {
  const chain = new Uint8Array(32);
  const view = new DataView(chain.buffer);
  view.setUint32(8, surfaceSourceWaylandSurface, true);
  view.setBigUint64(16, BigInt(display), true);
  view.setBigUint64(24, BigInt(waylandSurface), true);
  return chain;
}
function cocoaChain(window, config) {
  const libPath2 = resolveLibPath("./lib/libmetallayer.dylib");
  const { symbols: lib } = dlopen2(libPath2, {
    createMetalLayer: {
      returns: "pointer",
      args: ["pointer", "bool", "bool", "bool"]
    }
  });
  const hdr = config.toneMapping?.mode == "extended";
  const displayP3 = config.colorSpace == "display-p3";
  const layer = lib.createMetalLayer(window, true, hdr, displayP3);
  if (!layer) {
    throw new Error("CAMetalLayer creating error");
  }
  const chain = new Uint8Array(24);
  const view = new DataView(chain.buffer);
  view.setUint32(8, surfaceSourceMetalLayer, true);
  view.setBigUint64(16, BigInt(layer), true);
  return chain;
}
function configureSurface(lib, surface, config, size) {
  const devicePtr = config.device.ptr;
  const formatKey = config.format ?? gpu.getPreferredCanvasFormat();
  if (!(formatKey in textureFormats)) {
    throw new Error("Invalid or unknown surface format");
  }
  const format = textureFormats[formatKey];
  const usage = config.usage ?? 16 /* RENDER_ATTACHMENT */;
  const alphaMode = config.alphaMode == "premultiplied" ? 2 : 1;
  const presentMode = config.vsync ?? true ? 1 : 3;
  const buffer = new Uint8Array(64);
  const view = new DataView(buffer.buffer);
  view.setBigUint64(8, BigInt(devicePtr), true);
  view.setUint32(16, format, true);
  view.setBigUint64(24, BigInt(usage), true);
  view.setUint32(32, size.width, true);
  view.setUint32(36, size.height, true);
  view.setUint32(56, alphaMode, true);
  view.setUint32(60, presentMode, true);
  return lib.wgpuSurfaceConfigure(surface, ptr2(buffer)) ?? null;
}
function getCurrentTexture(lib, surface) {
  const buffer = Buffer.alloc(24);
  lib.wgpuSurfaceGetCurrentTexture(surface, ptr2(buffer));
  const view = new DataView(buffer.buffer);
  return view.getBigUint64(8, true);
}
function getCurrentTextureView(lib, texture) {
  return lib.wgpuTextureCreateView(Number(texture), null);
}

class SurfaceContext {
  glfw;
  _lib;
  _instancePtr;
  _textureCtr;
  config;
  window;
  surface = null;
  size;
  currentTexture = null;
  currentTextureView = null;
  canvas;
  constructor(gpu2, glfw2, window) {
    this.glfw = glfw2;
    if (!("lib" in gpu2)) {
      throw new Error("Cannot access WebGPU lib property");
    }
    this._lib = gpu2.lib;
    if (!("instancePtr" in gpu2)) {
      throw new Error("Cannot access WebGPU instancePtr property");
    }
    this._instancePtr = gpu2.instancePtr;
    this.window = window;
  }
  configure(config) {
    const handles = this.glfw.getChainHandles(this.window);
    const size = this.glfw.getWindowSize(this.window);
    const surface = createSurface(this._lib, this._instancePtr, handles, config);
    if (!surface) {
      throw new Error("Cannot create surface");
    }
    this.surface = surface;
    this.size = size;
    configureSurface(this._lib, this.surface, config, size);
    this.config = { ...config };
    if (!this._textureCtr) {
      const tex = config.device.createTexture({
        size: [1, 1],
        format: "rgba8unorm",
        usage: 1
      });
      this._textureCtr = tex.__proto__.constructor;
    }
  }
  getCurrentTextureView() {
    if (!this.surface) {
      throw new Error("Surface context is not configured");
    }
    const texture = getCurrentTexture(this._lib, this.surface);
    const pointer = getCurrentTextureView(this._lib, texture);
    this.currentTexture = texture;
    this.currentTextureView = pointer;
    return {
      __brand: "GPUTextureView",
      ptr: pointer,
      destroy() {}
    };
  }
  getCurrentTexture() {
    if (!this.surface) {
      throw new Error("Surface context is not configured");
    }
    const texture = getCurrentTexture(this._lib, this.surface);
    this.currentTexture = texture;
    const usage = this.config.usage ?? 16;
    const format = textureFormats[this.config.format ?? "bgra8unorm"];
    return new this._textureCtr(Number(texture), this._lib, this.size.width, this.size.height, 1, format, 2, 1, 1, usage);
  }
  present() {
    this._lib.wgpuSurfacePresent(this.surface);
    this.currentTextureView && this._lib.wgpuTextureViewRelease(this.currentTextureView);
    this.currentTexture && this._lib.wgpuTextureRelease(Number(this.currentTexture));
    this.currentTextureView = null;
    this.currentTexture = null;
  }
}

// src/window.ts
var glfw2 = new GLFWAdapter;

class WindowFrame {
  ptr;
  ctx;
  constructor(width, height, title) {
    this.ptr = this.create(width, height, title);
  }
  create(width, height, title) {
    return glfw2.createWindow(width, height, title);
  }
  getContext() {
    if (!this.ctx) {
      this.ctx = new SurfaceContext(gpu, glfw2, this.ptr);
    }
    return this.ctx;
  }
  destroy() {
    glfw2.destroyWindow(this.ptr);
  }
  shouldClose() {
    return glfw2.shouldClose(this.ptr);
  }
  pollEvents() {
    return glfw2.pollEvents();
  }
  setTitle(title) {
    glfw2.setWindowTitle(this.ptr, title);
  }
  getSize() {
    return glfw2.getWindowSize(this.ptr);
  }
  setSize(width, height) {
    glfw2.setWindowSize(this.ptr, width, height);
  }
  getPosition() {
    return glfw2.getWindowPosition(this.ptr);
  }
  setPosition(x, y) {
    glfw2.setWindowPosition(this.ptr, x, y);
  }
  setResizable(resizable) {
    glfw2.setWindowResizable(this.ptr, resizable);
  }
  maximize() {
    glfw2.maximizeWindow(this.ptr);
  }
  minimize() {
    glfw2.minimizeWindow(this.ptr);
  }
  restore() {
    glfw2.restoreWindow(this.ptr);
  }
  isMaximized() {
    return glfw2.isWindowMaximized(this.ptr);
  }
  isMinimized() {
    return glfw2.isWindowMinimized(this.ptr);
  }
  isVisible() {
    return glfw2.isWindowVisible(this.ptr);
  }
  isFocused() {
    return glfw2.isWindowFocused(this.ptr);
  }
  isHovered() {
    return glfw2.isWindowHovered(this.ptr);
  }
  setSizeCallback(cb) {
    glfw2.setWindowSizeCallback(this.ptr, cb ?? null);
  }
  isMouseButtonPressed(button) {
    return glfw2.getMouseButton(this.ptr, button);
  }
  getMousePosition() {
    return glfw2.getMousePosition(this.ptr);
  }
  setScrollCallback(cb) {
    glfw2.setScrollCallback(this.ptr, cb);
  }
  isKeyPressed(key) {
    return glfw2.isKeyPressed(this.ptr, key);
  }
  setKeyCallback(cb) {
    return glfw2.setKeyCallback(this.ptr, cb);
  }
  setCharCallback(cb) {
    return glfw2.setCharCallback(this.ptr, cb);
  }
  setCharModsCallback(cb) {
    return glfw2.setCharModsCallback(this.ptr, cb);
  }
  getDisplayInfo() {
    let position = null;
    let videoMode = null;
    let monitor = glfw2.getWindowMonitor(this.ptr);
    if (monitor) {
      position = glfw2.getMonitorPos(monitor);
      videoMode = glfw2.getMonitorVideoMode(monitor);
    } else {
      const winPos = this.getPosition();
      const winSize = this.getSize();
      const cx = winPos.x + winSize.width / 2;
      const cy = winPos.y + winSize.height / 2;
      const monitors = glfw2.getMonitorList();
      for (const monPtr of monitors) {
        const pos = glfw2.getMonitorPos(monPtr);
        const vm = glfw2.getMonitorVideoMode(monPtr);
        if (!vm)
          continue;
        if (cx >= pos.x && cx < pos.x + vm.width && cy >= pos.y && cy < pos.y + vm.height) {
          position = pos;
          videoMode = vm;
          monitor = monPtr;
          break;
        }
      }
    }
    if (monitor && position && videoMode) {
      const scale = glfw2.getMonitorContentScale(monitor);
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
// src/browser/browser.ts
import { DOMParser } from "@xmldom/xmldom";

// src/browser/apis/storage.ts
class Storage {
  length = 0;
  getItem(key) {
    return this[key] ?? null;
  }
  setItem(key, value) {
    if (!(key in this)) {
      this.length++;
    }
    this[key] = String(value);
  }
  removeItem(key) {
    this[key] = undefined;
  }
  key(index) {
    return Object.keys(this)[index] ?? null;
  }
  clear() {
    const owned = ["length", "getItem", "setItem", "removeItem", "key", "clear"];
    for (const key of Object.keys(this)) {
      if (owned.includes(key))
        continue;
      this[key] = undefined;
    }
  }
}

// src/browser/dom/event-target.ts
class EventTarget {
  _listeners = new Map;
  addEventListener(type, listener) {
    let pool = this._listeners.get(type);
    if (!pool) {
      pool = new Set;
      this._listeners.set(type, pool);
    }
    pool.add(listener);
  }
  removeEventListener(type, listener) {
    this._listeners.get(type)?.delete(listener);
  }
  dispatchEvent(event) {
    event.target ??= this;
    event.currentTarget = this;
    event.eventPhase = 0;
    event.timeStamp = performance.now();
    event.preventDefault = function() {};
    this._listeners.get(event.type)?.forEach((cb) => cb.call(this, event));
    return true;
  }
}

// src/browser/dom/node.ts
class Node extends EventTarget {
  static ELEMENT_NODE = 1;
  static TEXT_NODE = 3;
  static DOCUMENT_NODE = 9;
  ownerDocument;
  nodeType = Node.ELEMENT_NODE;
  nodeName = "";
  constructor(document) {
    super();
    this.ownerDocument = document;
  }
  getRootNode() {
    return this.ownerDocument;
  }
  appendChild(child) {
    console.warn("Node.appendChild is not implemented");
    return child;
  }
}

// src/browser/dom/element.ts
class HTMLElement extends Node {
  tagName;
  className = "";
  style = { display: "block" };
  constructor(document, name) {
    super(document);
    this.ownerDocument = document;
    this.tagName = name.toUpperCase();
    this.nodeName = this.tagName;
  }
  get offsetWidth() {
    return 1;
  }
  get offsetHeight() {
    return 1;
  }
  get offsetTop() {
    return 0;
  }
  get offsetLeft() {
    return 0;
  }
  get clientWidth() {
    return 1;
  }
  get clientHeight() {
    return 1;
  }
  setPointerCapture(pointerId) {}
  releasePointerCapture(pointerId) {}
  setAttribute(attr, value) {
    console.warn("HTMLElement.setAttribute is not implemented");
  }
  append(...nodes) {
    console.warn("HTMLElement.append is not implemented");
  }
  querySelector(query) {
    console.warn("HTMLElement.querySelector is not implemented");
    return null;
  }
}

// src/browser/elements/canvas-element.ts
class HTMLCanvasElement extends HTMLElement {
  _windowFrame;
  constructor(document, frame) {
    super(document, "canvas");
    this._windowFrame = frame;
    frame.ctx.canvas = this;
  }
  getContext(type) {
    if (type == "webgpu") {
      return this._windowFrame.getContext();
    }
    console.error(`Canvas context type '${type}' is not supported.`);
    return null;
  }
  get width() {
    return this._windowFrame.getSize().width;
  }
  get height() {
    return this._windowFrame.getSize().height;
  }
  set width(value) {
    this._windowFrame.setSize(value, this.height);
  }
  set height(value) {
    this._windowFrame.setSize(this.width, value);
  }
  get offsetWidth() {
    return this.width;
  }
  get offsetHeight() {
    return this.height;
  }
  get clientWidth() {
    return this.width;
  }
  get clientHeight() {
    return this.height;
  }
}

// src/browser/elements/image-element.ts
import sharp from "sharp";
function uint(n) {
  return Math.max(n, 0) | 0;
}

class HTMLImageElement extends HTMLElement {
  _src = "";
  _width = 0;
  _height = 0;
  _dataBuffer = new Uint8Array(0);
  crossorigin = "";
  complete = true;
  onload = null;
  onerror = null;
  constructor(document) {
    super(document, "img");
  }
  [toExternalSource]() {
    return {
      data: this._dataBuffer,
      bytesPerRow: this.width * 4,
      rowsPerImage: this.height
    };
  }
  get src() {
    return this._src;
  }
  set src(value) {
    this.setImageContent(value);
  }
  get width() {
    return this._width;
  }
  set width(value) {
    this._width = uint(value);
  }
  get height() {
    return this._height;
  }
  set height(value) {
    this._height = uint(value);
  }
  get naturalWidth() {
    return this._width;
  }
  get naturalHeight() {
    return this._height;
  }
  get currentSrc() {
    return this._src;
  }
  async setImageContent(src) {
    this.complete = false;
    this._src = src;
    let input;
    if (src.startsWith("blob:")) {
      input = await fetch(src).then((res) => res.arrayBuffer());
    } else {
      input = Bun.fileURLToPath(src);
    }
    sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true }).then((res) => {
      this._dataBuffer = res.data;
      this._width = res.info.width;
      this._height = res.info.height;
      this.complete = true;
      this.dispatchEvent({ type: "load" });
      this.onload?.call(this, { type: "load", target: this });
    }).catch((err) => {
      this.complete = true;
      console.error(err);
      this.dispatchEvent({ type: "error" });
      this.onerror?.call(this, { type: "error", target: this });
    });
  }
}

// src/browser/dom/document.ts
class Document extends Node {
  _windowFrame;
  nodeType = 9;
  nodeName = "#document";
  hidden = false;
  visibilityState = "visible";
  constructor(windowFrame) {
    super(null);
    this.ownerDocument = this;
    this._windowFrame = windowFrame;
  }
  createElement(name) {
    const tagName = name.toLowerCase();
    switch (tagName) {
      case "canvas":
        return new HTMLCanvasElement(this, this._windowFrame);
      case "img":
        return new HTMLImageElement(this);
      default:
        console.warn("Created fake", name, "element");
        return new HTMLElement(this, name);
    }
  }
  createElementNS(ns, name) {
    return this.createElement(name);
  }
}

// src/browser/dom/progress-event.ts
class ProgressEvent extends Event {
  lengthComputable;
  loaded;
  total;
  constructor(type, initDict) {
    super(type, initDict);
    this.lengthComputable = initDict.lengthComputable ?? false;
    this.loaded = initDict.loaded ?? 0;
    this.total = initDict.total ?? 0;
  }
}

// src/browser/dom/window.ts
class Window extends EventTarget {
  document;
  fps;
  constructor(document, fps) {
    super();
    this.document = document;
    this.fps = fps;
  }
  get window() {
    return this;
  }
  get self() {
    return this;
  }
  get devicePixelRatio() {
    return 1;
  }
  get innerWidth() {
    return this.document._windowFrame.getSize().width;
  }
  get innerHeight() {
    return this.document._windowFrame.getSize().height;
  }
  requestAnimationFrame(cb) {
    setTimeout(() => cb(performance.now()), 1000 / this.fps);
  }
}

// src/glfw/keymap.ts
var keymap = new Map([
  key(32, "Space"),
  key(39, "Quote", 222),
  key(44, "Comma", 188),
  key(45, "Minus", 189),
  key(46, "Period", 190),
  key(47, "Slash", 191),
  ...repeat(10, (i) => key(48 + i, `Digit${i}`)),
  key(59, "Semicolon", 186),
  key(61, "Equal", 187),
  ...repeat(26, (i) => key(65 + i, `Key${String.fromCharCode(65 + i)}`)),
  key(91, "BracketLeft", 219),
  key(92, "Backslash", 220),
  key(93, "BracketRight", 221),
  key(96, "Backquote", 192),
  key(161, "IntlBackslash", 192),
  key(256, "Escape", 27),
  key(257, "Enter", 13),
  key(258, "Tab", 20),
  key(259, "Backspace", 8),
  key(260, "Insert", 45),
  key(261, "Delete", 46),
  key(262, "ArrowRight", 39),
  key(263, "ArrowLeft", 37),
  key(264, "ArrowDown", 40),
  key(265, "ArrowUp", 38),
  key(266, "PageUp", 33),
  key(267, "PageDown", 34),
  key(268, "Home", 36),
  key(269, "End", 35),
  key(280, "CapsLock", 20),
  key(281, "ScrollLock", 145),
  key(282, "NumLock", 144),
  key(283, "PrintScreen", 44),
  ...repeat(25, (i) => key(290 + i, `F${i}`, 112 + i)),
  ...repeat(10, (i) => key(320 + i, `Numpad${i}`, 96 + i, 3)),
  key(330, "NumpadDecimal", 110, 3),
  key(331, "NumpadDivide", 111, 3),
  key(332, "NumpadMultiply", 106, 3),
  key(333, "NumpadSubtract", 109, 3),
  key(334, "NumpadAdd", 107, 3),
  key(335, "NumpadEnter", 13, 3),
  key(340, "ShiftLeft", 16, 1),
  key(341, "ControlLeft", 17, 1),
  key(342, "AltLeft", 18, 1),
  key(343, "MetaLeft", 91, 1),
  key(344, "ShiftRight", 16, 2),
  key(345, "ControlRight", 17, 2),
  key(346, "AltRight", 18, 2),
  key(347, "MetaRight", 93, 2),
  key(348, "ContextMenu", 93)
]);
function key(id, label, code = id, location = 0) {
  return [
    id,
    { label, code, location }
  ];
}
function repeat(length, producer) {
  return Array.from({ length }, (_, i) => producer(i));
}

// src/browser/event-emitter.ts
class WindowEventEmitter {
  frame;
  window;
  document;
  get canvas() {
    return this.frame.getContext().canvas;
  }
  state = {
    x: 0,
    y: 0,
    lmb: false,
    rmb: false,
    mmb: false,
    ctrl: false,
    alt: false,
    shift: false,
    meta: false,
    pressed: {}
  };
  keyChars = getKeyCharacters();
  constructor(windowFrame, domWindow, document) {
    this.frame = windowFrame;
    this.window = domWindow;
    this.document = document;
    setInterval(() => this.tick(), 16);
    this.frame.setSizeCallback((win, width, height) => {
      this.window.dispatchEvent({ type: "resize" });
    });
    this.frame.setScrollCallback((win, dx, dy) => {
      this.emitMouseWheel(dx, dy);
    });
    this.frame.setKeyCallback((win, key2, scanCode, action, mods) => {
      this.state.ctrl = !!(mods & 2);
      this.state.alt = !!(mods & 4);
      this.state.shift = !!(mods & 1);
      this.state.meta = !!(mods & 8);
      const km = keymap.get(key2);
      if (km) {
        this.state.pressed[km.label] = !!action;
        this.emitKeyUpDown(km.label, km.code, km.location, action);
      }
    });
  }
  tick() {
    const win = this.frame;
    const mouse = win.getMousePosition();
    const lmb = win.isMouseButtonPressed(0);
    const rmb = win.isMouseButtonPressed(1);
    const mmb = win.isMouseButtonPressed(2);
    this.state.ctrl = win.isKeyPressed(0);
    if (lmb != this.state.lmb) {
      this.state.lmb = lmb;
      this.emitPointerUpDown(0, lmb);
    }
    if (rmb != this.state.rmb) {
      this.state.rmb = rmb;
      this.emitPointerUpDown(2, rmb);
    }
    if (mmb != this.state.mmb) {
      this.state.mmb = mmb;
      this.emitPointerUpDown(1, mmb);
    }
    if (mouse.x != this.state.x || mouse.y != this.state.y) {
      this.emitPointerMove(mouse.x, mouse.y);
      this.state.x = mouse.x;
      this.state.y = mouse.y;
    }
  }
  emitPointerUpDown(btn, pressed) {
    const type = pressed ? "pointerdown" : "pointerup";
    const { x, y } = this.state;
    const ev = {
      type,
      pointerId: 1,
      pointerType: "mouse",
      which: btn + 1,
      button: btn,
      buttons: 1 << (btn == 1 ? 2 : btn == 2 ? 1 : btn),
      x,
      y,
      clientX: x,
      clientY: y,
      pageX: x,
      pageY: y,
      movementX: 0,
      movementY: 0
    };
    this.document.dispatchEvent(ev);
    this.canvas?.dispatchEvent(ev);
  }
  emitPointerMove(x, y) {
    const ev = {
      type: "pointermove",
      pointerId: 1,
      pointerType: "mouse",
      which: 0,
      button: -1,
      buttons: 0,
      x,
      y,
      clientX: x,
      clientY: y,
      pageX: x,
      pageY: y,
      movementX: x - this.state.x,
      movementY: y - this.state.y
    };
    this.document.dispatchEvent(ev);
    this.canvas?.dispatchEvent(ev);
  }
  emitMouseWheel(dx, dy) {
    const ev = {
      type: "wheel",
      deltaMode: 0,
      deltaX: dx * -40,
      deltaY: dy * -40,
      deltaZ: 0,
      wheelDelta: dy * 1200,
      wheelDeltaX: dx * 1200,
      wheelDeltaY: dy * 1200
    };
    this.document.dispatchEvent(ev);
    this.canvas?.dispatchEvent(ev);
  }
  emitKeyUpDown(label, code, location, pressed) {
    const type = pressed ? "keydown" : "keyup";
    const ev = {
      type,
      code: label,
      key: this.keyChars.get(label) ?? label,
      which: code,
      keyCode: code,
      ctrlKey: this.state.ctrl,
      altKey: this.state.alt,
      shiftKey: this.state.shift,
      metaKey: this.state.meta,
      location,
      repeat: pressed == 2
    };
    this.window.dispatchEvent(ev);
    this.document.dispatchEvent(ev);
    this.canvas?.dispatchEvent(ev);
  }
}
function getKeyCharacters() {
  return new Map([
    ["ControlLeft", "Control"],
    ["ControlRight", "Control"],
    ["AltLeft", "Alt"],
    ["AltRight", "Alt"],
    ["ShiftLeft", "Shift"],
    ["ShiftRight", "Shift"],
    ["MetaLeft", "Meta"],
    ["MetaRight", "Meta"],
    ...Array.from({ length: 10 }, (_, i) => [`Digit${i}`, String(i)]),
    ...Array.from({ length: 26 }, (_, i) => [`Key${String.fromCharCode(65 + i)}`, String.fromCharCode(97 + i)]),
    ["Space", " "],
    ["Quote", "'"],
    ["Comma", ","],
    ["Minus", "-"],
    ["Period", "."],
    ["Slash", "/"],
    ["Semicolon", ";"],
    ["Equal", "="],
    ["BracketLeft", "["],
    ["BracketRight", "]"],
    ["Backslash", "\\"]
  ]);
}

// src/browser/browser.ts
function attachDOM(windowFrame, fps) {
  globalThis.navigator = { ...navigator, gpu };
  const document = new Document(windowFrame);
  const window = new Window(document, fps);
  Object.defineProperties(globalThis, {
    window: { get() {
      return window;
    } },
    document: { get() {
      return window.document;
    } },
    devicePixelRatio: { get() {
      return window.devicePixelRatio;
    } },
    innerWidth: { get() {
      return window.innerWidth;
    } },
    innerHeight: { get() {
      return window.innerHeight;
    } },
    requestAnimationFrame: { value: window.requestAnimationFrame.bind(window) }
  });
  globalThis.Document = Document;
  globalThis.Window = Window;
  globalThis.EventTarget = EventTarget;
  globalThis.Node = Node;
  globalThis.HTMLElement = HTMLElement;
  globalThis.HTMLCanvasElement = HTMLCanvasElement;
  globalThis.HTMLImageElement = HTMLImageElement;

  class Image extends HTMLImageElement {
    constructor(width, height) {
      super(globalThis.document);
      this.width = width ?? 0;
      this.height = height ?? 0;
    }
  }
  globalThis.Image = Image;
  globalThis.window.Image = Image;
  globalThis.ProgressEvent = ProgressEvent;
  globalThis.DOMParser = DOMParser;
  globalThis.window.URL = URL;
  new WindowEventEmitter(windowFrame, window, document);
  globalThis.localStorage = new Storage;
  globalThis.sessionStorage = new Storage;
}
export {
  gpu,
  extendDevice,
  createMappedBuffer,
  attachDOM,
  addGPUErrorHandler,
  WindowFrame,
  GPUTextureUsage,
  GPUShaderStage,
  GPUBufferUsage
};
