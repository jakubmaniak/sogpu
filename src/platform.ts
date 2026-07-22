import { fileURLToPath } from 'bun';
import path from 'node:path';


export function getPlatformType() {
    switch (process.platform) {
        case 'win32':
            return 'win32';
        case 'darwin':
            return 'cocoa';
        case 'linux':
            if (process.env.WAYLAND_DISPLAY || process.env.XDG_SESSION_TYPE == 'wayland') {
                return 'wayland';
            }
            return 'x11';
        default:
            throw new Error(`Unsupported platform: ${process.platform}`);
    }
}

export function resolveLibPath(libPath: string) {
    if (import.meta.file == 'platform.ts') {
        return path.resolve(libPath);
    }
    else if (import.meta.dir.startsWith('/$bunfs/') || import.meta.dir.startsWith('B:\\~BUN\\')) {
        return path.join(path.dirname(process.execPath), libPath);
    }
    else {
        return fileURLToPath(import.meta.resolve(libPath));
    }
}