// @bun
// src/gpu.ts
import { createGPUInstance } from "bun-webgpu";
import { toArrayBuffer } from "bun:ffi";
var gpu = createGPUInstance();
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
var GPUShaderStage;
((GPUShaderStage2) => {
  GPUShaderStage2[GPUShaderStage2["VERTEX"] = 1] = "VERTEX";
  GPUShaderStage2[GPUShaderStage2["FRAGMENT"] = 2] = "FRAGMENT";
  GPUShaderStage2[GPUShaderStage2["COMPUTE"] = 4] = "COMPUTE";
})(GPUShaderStage ||= {});
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
function addGPUErrorHandler(adapter) {
  const adapterImpl = adapter;
  adapterImpl.handleUncapturedError = (devicePtr, typeInt, msgArg, sizeOrUserdata1, ud1, ud2) => {
    let message = "[empty message]";
    try {
      if (msgArg) {
        const svBuf = toArrayBuffer(msgArg, 0, 16);
        const dv = new DataView(svBuf);
        const dataPtr = dv.getBigUint64(0, true);
        const len = Number(dv.getBigUint64(8, true));
        if (dataPtr !== 0n && len > 0 && len < 1e4) {
          const strBuf = toArrayBuffer(Number(dataPtr), 0, len);
          message = new TextDecoder().decode(strBuf);
        }
      }
    } catch {}
    console.error(`[WebGPU] Error (type=${typeInt}): ${message}`);
    process.exit(1);
  };
}
// src/glfw/adapter.ts
import { ptr } from "bun:ffi";

// src/platform.ts
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

// src/glfw/ffi.ts
var {fileURLToPath } = globalThis.Bun;
import { dlopen, FFIType, suffix } from "bun:ffi";
import path from "path";
var constants = {
  FALSE: 0,
  TRUE: 1,
  DONT_CARE: -1,
  RESIZABLE: 131075,
  VISIBLE: 131076,
  DECORATED: 131077,
  FLOATING: 131079,
  TRANSPARENT_FRAMEBUFFER: 131082,
  MOUSE_PASSTHROUGH: 131085,
  POSITION_X: 131086,
  POSITION_Y: 131087,
  SAMPLES: 135181,
  SRGB_CAPABLE: 135182,
  REFRESH_RATE: 135183,
  DOUBLEBUFFER: 135184,
  CLIENT_API: 139265,
  NO_API: 0,
  RELEASE: 0,
  PRESS: 1,
  REPEAT: 2,
  KEY_UNKNOWN: -1,
  MOD_SHIFT: 1,
  MOD_CONTROL: 2,
  MOD_ALT: 4,
  MOD_SUPER: 8,
  MOD_CAPS_LOCK: 16,
  MOD_NUM_LOCK: 32
};
var platform = getPlatformType();
var platformDependent = {
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
      returns: FFIType.u32,
      args: [FFIType.pointer]
    }
  }
};
var libPath = platform == "win32" ? "./lib/glfw3.dll" : `./lib/glfw3.${process.arch}.${suffix}`;
var libFilePath = import.meta.file == "ffi.ts" ? path.resolve(libPath) : fileURLToPath(import.meta.resolve(libPath));
var { symbols: glfw } = dlopen(libFilePath, {
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
  terminate() {
    ffi_default.glfwTerminate();
  }
  createWindow(width, height, title) {
    ffi_default.glfwWindowHint(ffi_default.CLIENT_API, ffi_default.NO_API);
    ffi_default.glfwWindowHint(ffi_default.RESIZABLE, ffi_default.FALSE);
    ffi_default.glfwWindowHint(ffi_default.TRANSPARENT_FRAMEBUFFER, ffi_default.TRUE);
    const titleBuffer = Buffer.from(title + "\x00");
    const window = ffi_default.glfwCreateWindow(width, height, ptr(titleBuffer), null, null);
    if (!window) {
      throw new Error("Failed to create a window.");
    }
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
        throw new Error("Surface creation is not implemented for macOS.");
    }
  }
  pollEvents() {
    ffi_default.glfwPollEvents();
  }
  shouldClose(window) {
    return ffi_default.glfwWindowShouldClose(window) != 0;
  }
  mousePos = new Float64Array(2);
  mouseXPtr = ptr(this.mousePos);
  mouseYPtr = ptr(this.mousePos, 8);
  getMousePosition(window) {
    ffi_default.glfwGetCursorPos(window, this.mouseXPtr, this.mouseYPtr);
    return { x: this.mousePos[0], y: this.mousePos[1] };
  }
  getKeyState(window, key) {
    return ffi_default.glfwGetKey(window, key);
  }
}

// src/surface.ts
import { dlopen as dlopen2, ptr as ptr2 } from "bun:ffi";
var WGPUSType_SurfaceSourceWindowsHWND = 5;
var WGPUSType_SurfaceSourceXlibWindow = 6;
var WGPUSType_SurfaceSourceWaylandSurface = 7;
function createSurface(lib, instance, handles) {
  const chain = getSurfaceChain(handles);
  const descriptor = new Uint8Array(24);
  const view = new DataView(descriptor.buffer);
  view.setBigUint64(0, BigInt(ptr2(chain)), true);
  return lib.wgpuInstanceCreateSurface(instance, ptr2(descriptor)) ?? null;
}
function getSurfaceChain(handles) {
  const { display, window } = handles;
  switch (getPlatformType()) {
    case "win32":
      return win32Chain(window);
    case "wayland":
      return waylandChain(display, window);
    case "x11":
      return x11Chain(display, window);
    case "cocoa":
      throw new Error("Surface creation is not implemented for macOS.");
  }
}
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
  view.setUint32(8, WGPUSType_SurfaceSourceWindowsHWND, true);
  view.setBigUint64(16, BigInt(hinstancePtr), true);
  view.setBigUint64(24, BigInt(window), true);
  return chain;
}
function x11Chain(display, window) {
  const chain = new Uint8Array(32);
  const view = new DataView(chain.buffer);
  view.setUint32(8, WGPUSType_SurfaceSourceXlibWindow, true);
  view.setBigUint64(16, BigInt(display), true);
  view.setBigUint64(24, BigInt(window), true);
  return chain;
}
function waylandChain(display, waylandSurface) {
  const chain = new Uint8Array(32);
  const view = new DataView(chain.buffer);
  view.setUint32(8, WGPUSType_SurfaceSourceWaylandSurface, true);
  view.setBigUint64(16, BigInt(display), true);
  view.setBigUint64(24, BigInt(waylandSurface), true);
  return chain;
}
function configureSurface(lib, surface, config) {
  const devicePtr = config.device.ptr;
  const format = {
    rgba8unorm: 18,
    bgra8unorm: 23,
    rgba16float: 34
  }[config.format ?? "bgra8unorm"];
  if (!format) {
    throw new Error("Invalid surface format");
  }
  const usage = config.usage ?? 16;
  const alphaMode = 1;
  const presentMode = config.vsync ?? true ? 1 : 3;
  const buffer = new Uint8Array(64);
  const view = new DataView(buffer.buffer);
  view.setBigUint64(8, BigInt(devicePtr), true);
  view.setUint32(16, format, true);
  view.setBigUint64(24, BigInt(usage), true);
  view.setUint32(32, config.width, true);
  view.setUint32(36, config.height, true);
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
function present(lib, surface) {
  return lib.wgpuSurfacePresent(surface);
}

class SurfaceContext {
  glfw;
  initialized = false;
  _lib;
  _instancePtr;
  window;
  surface = null;
  currentTexture = null;
  currentTextureView = null;
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
    if (this.initialized) {
      throw new Error("Surface context is already configured");
    }
    const handles = this.glfw.getChainHandles(this.window);
    const surface = createSurface(this._lib, this._instancePtr, handles);
    if (!surface) {
      throw new Error("Cannot create surface");
    }
    this.surface = surface;
    configureSurface(this._lib, this.surface, config);
    this.wrapDevice(config.device);
    this.initialized = true;
  }
  wrapDevice(device) {
    const queue = device.queue;
    const submitFn = queue.submit.bind(queue);
    function submit(commandBuffers) {
      submitFn(commandBuffers);
      for (const cmdBuf of commandBuffers) {
        cmdBuf._destroy();
      }
    }
    queue.submit = submit.bind(queue);
  }
  getCurrentTextureView() {
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
  present() {
    this.currentTextureView && this._lib.wgpuTextureViewRelease(this.currentTextureView);
    this.currentTexture && this._lib.wgpuTextureRelease(Number(this.currentTexture));
    present(this._lib, this.surface);
  }
}

// src/window.ts
var glfw2 = new GLFWAdapter;

class WindowInstance {
  ptr;
  constructor(width, height, title) {
    this.ptr = this.create(width, height, title);
  }
  create(width, height, title) {
    return glfw2.createWindow(width, height, title);
  }
  getContext() {
    return new SurfaceContext(gpu, glfw2, this.ptr);
  }
  destroy() {
    return glfw2.destroyWindow(this.ptr);
  }
  shouldClose() {
    return glfw2.shouldClose(this.ptr);
  }
  pollEvents() {
    return glfw2.pollEvents();
  }
}
export {
  gpu,
  extendDevice,
  createMappedBuffer,
  addGPUErrorHandler,
  WindowInstance,
  GPUShaderStage,
  GPUBufferUsage
};
