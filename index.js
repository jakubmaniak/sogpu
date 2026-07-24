// @bun
// src/gpu.ts
import { createGPUInstance } from "bun-webgpu";
import { toArrayBuffer } from "bun:ffi";
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
var gpu = createGPUInstance();
var requestAdapterFn = gpu.requestAdapter.bind(gpu);
gpu.requestAdapter = async function(options) {
  function request(backendType) {
    return requestAdapterFn({
      ...options,
      backendType
    });
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
import { ptr } from "bun:ffi";

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
import { dlopen, FFIType, suffix } from "bun:ffi";
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
      returns: FFIType.pointer,
      args: [FFIType.pointer]
    }
  }
};
var libPath = platform == "win32" ? "./lib/glfw3.dll" : platform == "cocoa" ? "./lib/libglfw.dylib" : `./lib/glfw3.${process.arch}.${suffix}`;
var libFilePath = resolveLibPath(libPath);
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
  getKeyState(window, key) {
    return ffi_default.glfwGetKey(window, key);
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
    this.wrapQueueSubmit(config.device);
    if (!this._textureCtr) {
      const tex = config.device.createTexture({
        size: [1, 1],
        format: "rgba8unorm",
        usage: 1
      });
      this._textureCtr = tex.__proto__.constructor;
    }
  }
  wrapQueueSubmit(device) {
    if (device.queue.submit.__wrapped__)
      return;
    const queue = device.queue;
    const submitFn = queue.submit.bind(queue);
    function submit(commandBuffers) {
      submitFn(commandBuffers);
      for (const cmdBuf of commandBuffers) {
        cmdBuf._destroy();
      }
    }
    queue.submit = submit.bind(queue);
    queue.submit.__wrapped__ = true;
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

class WindowInstance {
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
  isMouseButtonPressed(button) {
    return glfw2.getMouseButton(this.ptr, button);
  }
  getMousePosition() {
    return glfw2.getMousePosition(this.ptr);
  }
}
// src/browser/dom/node.ts
class Node {
  static ELEMENT_NODE = 1;
  static TEXT_NODE = 3;
  static DOCUMENT_NODE = 9;
  ownerDocument;
  nodeType = Node.ELEMENT_NODE;
  nodeName = "";
  listeners = new Map;
  constructor(document) {
    this.ownerDocument = document;
  }
  getRootNode() {
    return this.ownerDocument;
  }
  addEventListener(type, listener) {
    let pool = this.listeners.get(type);
    if (!pool) {
      pool = new Set;
      this.listeners.set(type, pool);
    }
    pool.add(listener);
    console.log("+", this.nodeName, type);
  }
  removeEventListener(type, listener) {
    this.listeners.get(type)?.delete(listener);
    console.log("-", this.nodeName, type, listener);
  }
  dispatchEvent(type, event) {
    event.target = this;
    this.listeners.get(type)?.forEach((cb) => cb(event));
  }
  appendChild(child) {
    return child;
  }
}

// src/browser/dom/element.ts
class HTMLElement extends Node {
  tagName;
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
}

// src/browser/canvas-element.ts
class HTMLCanvasElement extends HTMLElement {
  window;
  constructor(document, window) {
    super(document, "canvas");
    this.window = window;
    window.ctx.canvas = this;
  }
  getContext() {
    return this.window.getContext();
  }
  get width() {
    return this.window.getSize().width;
  }
  get height() {
    return this.window.getSize().height;
  }
  set width(value) {
    this.window.setSize(value, this.height);
  }
  set height(value) {
    this.window.setSize(this.width, value);
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

// src/browser/dom/document.ts
class Document extends Node {
  _window;
  nodeType = 9;
  nodeName = "#document";
  constructor(window) {
    super(null);
    this.ownerDocument = this;
    this._window = window;
  }
  createElement(name) {
    if (name?.toLowerCase() == "canvas") {
      return new HTMLCanvasElement(this, this._window);
    } else {
      console.log("Created", name, "element");
      return new HTMLElement(this, name);
    }
  }
  createElementNS(ns, name) {
    return this.createElement(name);
  }
}

// src/browser/event-emitter.ts
class WindowEventEmitter {
  window;
  document;
  state = {
    x: 0,
    y: 0,
    lmb: false,
    rmb: false
  };
  constructor(window, document) {
    this.window = window;
    this.document = document;
    setInterval(() => this.tick(), 16);
  }
  tick() {
    const mouse = this.window.getMousePosition();
    const lmb = this.window.isMouseButtonPressed(0);
    const rmb = this.window.isMouseButtonPressed(1);
    if (lmb != this.state.lmb) {
      this.state.lmb = lmb;
      this.emitPointerUpDown(true, lmb);
    }
    if (rmb != this.state.rmb) {
      this.state.rmb = rmb;
      this.emitPointerUpDown(false, rmb);
    }
    if (mouse.x != this.state.x || mouse.y != this.state.y) {
      this.emitPointerMove(mouse.x, mouse.y);
      this.state.x = mouse.x;
      this.state.y = mouse.y;
    }
  }
  emitPointerUpDown(left, pressed) {
    const type = pressed ? "pointerdown" : "pointerup";
    const { x, y } = this.state;
    const ev = {
      type,
      pointerId: 1,
      pointerType: "mouse",
      which: left ? 1 : 3,
      button: left ? 0 : 2,
      buttons: left ? 1 : 2,
      x,
      y,
      clientX: x,
      clientY: y,
      pageX: x,
      pageY: y,
      movementX: 0,
      movementY: 0
    };
    this.document.dispatchEvent(type, ev);
    this.window.getContext().canvas?.dispatchEvent(type, ev);
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
    this.document.dispatchEvent("pointermove", ev);
  }
}

// src/browser/browser.ts
function attachDOM(window, fps) {
  global.navigator = { ...navigator, gpu };
  global.GPUTextureUsage = GPUTextureUsage;
  global.GPUBufferUsage = GPUBufferUsage;
  global.GPUShaderStage = GPUShaderStage;
  global.requestAnimationFrame = function(cb) {
    setTimeout(cb, 1000 / fps);
  };
  global.document = new Document(window);
  global.Document = Document;
  global.Node = Node;
  global.HTMLElement = HTMLElement;
  global.HTMLCanvasElement = HTMLCanvasElement;
  new WindowEventEmitter(window, global.document);
}
export {
  gpu,
  extendDevice,
  createMappedBuffer,
  attachDOM,
  addGPUErrorHandler,
  WindowInstance,
  GPUTextureUsage,
  GPUShaderStage,
  GPUBufferUsage
};
