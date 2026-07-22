#import <Cocoa/Cocoa.h>
#import <QuartzCore/CAMetalLayer.h>
#import <Metal/Metal.h>


extern "C"
void *createMetalLayer(void *windowPtr)
{
    @autoreleasepool {
        NSWindow *window = (__bridge NSWindow *)windowPtr;
        NSView *view = window.contentView;

        CAMetalLayer *layer = [CAMetalLayer layer];
        // layer.device = MTLCreateSystemDefaultDevice();
        layer.pixelFormat = MTLPixelFormatBGRA8Unorm;
        layer.framebufferOnly = YES;
        layer.contentsScale = window.backingScaleFactor;
        layer.frame = view.bounds;
        layer.drawableSize = CGSizeMake(
            view.bounds.size.width * layer.contentsScale,
            view.bounds.size.height * layer.contentsScale
        );

        view.wantsLayer = YES;
        view.layer = layer;

        return (__bridge_retained void *)layer;
    }
}
