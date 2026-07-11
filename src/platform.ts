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