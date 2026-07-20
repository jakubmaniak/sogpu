#import <Cocoa/Cocoa.h>
#import <QuartzCore/CAMetalLayer.h>
#import <Metal/Metal.h>
#import <Foundation/Foundation.h>


extern "C"
void *createMetalLayer(void *windowPtr)
{
    @autoreleasepool {
        // NSLog(@"windowPtr = %p", windowPtr);

        NSWindow *window = (__bridge NSWindow *)windowPtr;

        // NSLog(@"window = %@", window);

        NSView *view = window.contentView;

        CAMetalLayer *layer = [CAMetalLayer layer];

        // NSLog(@"bounds = %f x %f", view.bounds.size.width, view.bounds.size.height);
        // NSLog(@"contentsScale = %f", layer.contentsScale);

        layer.device = MTLCreateSystemDefaultDevice();
        layer.pixelFormat = MTLPixelFormatBGRA8Unorm;
        layer.framebufferOnly = YES;
        layer.contentsScale = window.backingScaleFactor;
        layer.frame = view.bounds;
        layer.drawableSize =
            CGSizeMake(
                view.bounds.size.width * layer.contentsScale,
                view.bounds.size.height * layer.contentsScale
            );

        view.wantsLayer = YES;
        view.layer = layer;

        // NSLog(@"layer = %@", layer);

        return (__bridge_retained void *)layer;
    }
}
