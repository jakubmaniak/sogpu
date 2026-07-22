#import <Cocoa/Cocoa.h>
#import <QuartzCore/CAMetalLayer.h>
#import <Metal/Metal.h>


extern "C"
void *createMetalLayer(void *windowPtr, bool framebufferOnly, bool hdr, bool p3)
{
    @autoreleasepool {
        NSWindow *window = (__bridge NSWindow *)windowPtr;
        NSView *view = window.contentView;

        CAMetalLayer *layer = [CAMetalLayer layer];
        // layer.device = MTLCreateSystemDefaultDevice();
        layer.pixelFormat = MTLPixelFormatBGRA8Unorm;
        layer.colorspace = CGColorSpaceCreateWithName(
            p3 ? kCGColorSpaceDisplayP3 : kCGColorSpaceSRGB
        );
        layer.framebufferOnly = framebufferOnly;
        layer.contentsScale = window.backingScaleFactor;
        layer.frame = view.bounds;
        layer.drawableSize = CGSizeMake(
            view.bounds.size.width * layer.contentsScale,
            view.bounds.size.height * layer.contentsScale
        );

        if (hdr) {
            layer.wantsExtendedDynamicRangeContent = YES;
            layer.pixelFormat = MTLPixelFormatRGBA16Float;
            layer.colorspace = CGColorSpaceCreateWithName(
                p3 ? kCGColorSpaceExtendedDisplayP3 : kCGColorSpaceExtendedSRGB
            );
        }

        view.wantsLayer = YES;
        view.layer = layer;

        return (__bridge_retained void *)layer;
    }
}
