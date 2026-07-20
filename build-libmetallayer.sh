#!/bin/bash

clang++ \
    -std=c++20 \
    -fobjc-arc \
    -arch arm64 \
    -arch x86_64 \
    -dynamiclib \
    src/metal-layer/metal-layer.mm \
    -o lib/libmetallayer.dylib \
    -framework Cocoa \
    -framework QuartzCore \
    -framework Metal