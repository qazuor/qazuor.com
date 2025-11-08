---
title: Introduction to WebAssembly for Web Developers
excerpt:
  Learn how WebAssembly enables near-native performance in web applications and
  how to integrate it with JavaScript.
publishDate: 2025-01-22
tags: [WebAssembly, JavaScript, Performance, C++]
readTime: 11 min read
draft: false
---

## What is WebAssembly?

WebAssembly (WASM) is a binary instruction format that runs at near-native speed
in web browsers.

## Basic C Example

```c
// add.c
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
int add(int a, int b) {
    return a + b;
}

EMSCRIPTEN_KEEPALIVE
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

EMSCRIPTEN_KEEPALIVE
double calculate_pi(int iterations) {
    double pi = 0.0;
    for (int i = 0; i < iterations; i++) {
        pi += (i % 2 == 0 ? 1.0 : -1.0) / (2 * i + 1);
    }
    return pi * 4;
}
```

Compile with Emscripten:

```bash
emcc add.c -o add.js \
  -s WASM=1 \
  -s EXPORTED_FUNCTIONS='["_add","_fibonacci","_calculate_pi"]' \
  -s EXPORTED_RUNTIME_METHODS='["cwrap"]' \
  -O3
```

## JavaScript Integration

```javascript
// Load and use WebAssembly module
async function loadWasm() {
  const Module = await import('./add.js');
  await Module.default();

  // Wrap C functions for JavaScript
  const add = Module.cwrap('add', 'number', ['number', 'number']);
  const fibonacci = Module.cwrap('fibonacci', 'number', ['number']);
  const calculatePi = Module.cwrap('calculate_pi', 'number', ['number']);

  console.log('5 + 3 =', add(5, 3));
  console.log('fibonacci(10) =', fibonacci(10));
  console.log('pi ≈', calculatePi(1000000));
}

loadWasm();
```

## Rust WebAssembly

```rust
// lib.rs
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[wasm_bindgen]
pub struct ImageProcessor {
    width: u32,
    height: u32,
    data: Vec<u8>,
}

#[wasm_bindgen]
impl ImageProcessor {
    #[wasm_bindgen(constructor)]
    pub fn new(width: u32, height: u32) -> ImageProcessor {
        ImageProcessor {
            width,
            height,
            data: vec![0; (width * height * 4) as usize],
        }
    }

    pub fn invert_colors(&mut self) {
        for i in (0..self.data.len()).step_by(4) {
            self.data[i] = 255 - self.data[i];     // R
            self.data[i + 1] = 255 - self.data[i + 1]; // G
            self.data[i + 2] = 255 - self.data[i + 2]; // B
        }
    }

    pub fn grayscale(&mut self) {
        for i in (0..self.data.len()).step_by(4) {
            let avg = (self.data[i] as u32 +
                      self.data[i + 1] as u32 +
                      self.data[i + 2] as u32) / 3;
            self.data[i] = avg as u8;
            self.data[i + 1] = avg as u8;
            self.data[i + 2] = avg as u8;
        }
    }

    pub fn get_data(&self) -> Vec<u8> {
        self.data.clone()
    }
}
```

Build with wasm-pack:

```bash
wasm-pack build --target web
```

## Using Rust WASM in JavaScript

```javascript
import init, { add, greet, ImageProcessor } from './pkg/my_wasm.js';

async function runWasm() {
  // Initialize the WASM module
  await init();

  // Basic functions
  console.log('5 + 3 =', add(5, 3));
  console.log(greet('WebAssembly'));

  // Image processing
  const processor = new ImageProcessor(800, 600);
  processor.grayscale();
  const processedData = processor.get_data();

  // Use in canvas
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(800, 600);
  imageData.data.set(processedData);
  ctx.putImageData(imageData, 0, 0);
}

runWasm();
```

## AssemblyScript Alternative

```typescript
// assembly/index.ts
export function add(a: i32, b: i32): i32 {
  return a + b;
}

export function fibonacci(n: i32): i32 {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

export class Vector2 {
  x: f64;
  y: f64;

  constructor(x: f64, y: f64) {
    this.x = x;
    this.y = y;
  }

  magnitude(): f64 {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize(): Vector2 {
    const mag = this.magnitude();
    return new Vector2(this.x / mag, this.y / mag);
  }
}

export function sortArray(arr: Int32Array): Int32Array {
  const len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}
```

## WebAssembly with React

```jsx
import { useEffect, useState } from 'react';

function WasmComponent() {
  const [wasm, setWasm] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWasm() {
      try {
        const wasmModule = await import('./pkg/my_wasm.js');
        await wasmModule.default();
        setWasm(wasmModule);
      } catch (error) {
        console.error('Failed to load WASM:', error);
      } finally {
        setLoading(false);
      }
    }

    loadWasm();
  }, []);

  const handleCalculate = () => {
    if (wasm) {
      const start = performance.now();
      const result = wasm.fibonacci(40);
      const end = performance.now();

      setResult({
        value: result,
        time: end - start,
      });
    }
  };

  if (loading) return <div>Loading WebAssembly...</div>;

  return (
    <div>
      <button onClick={handleCalculate}>Calculate Fibonacci(40)</button>
      {result && (
        <div>
          <p>Result: {result.value}</p>
          <p>Time: {result.time.toFixed(2)}ms</p>
        </div>
      )}
    </div>
  );
}

export default WasmComponent;
```

## Performance Comparison

```javascript
// JavaScript implementation
function fibonacciJS(n) {
  if (n <= 1) return n;
  return fibonacciJS(n - 1) + fibonacciJS(n - 2);
}

// Benchmark
async function benchmark() {
  const Module = await import('./pkg/my_wasm.js');
  await Module.default();

  const n = 40;

  // JavaScript
  console.time('JavaScript');
  const jsResult = fibonacciJS(n);
  console.timeEnd('JavaScript');
  console.log('JS Result:', jsResult);

  // WebAssembly
  console.time('WebAssembly');
  const wasmResult = Module.fibonacci(n);
  console.timeEnd('WebAssembly');
  console.log('WASM Result:', wasmResult);

  // Typical results:
  // JavaScript: ~1500ms
  // WebAssembly: ~400ms
  // WASM is 3-4x faster!
}

benchmark();
```

## Use Cases for WebAssembly

```javascript
// 1. Image/Video Processing
import init, { processImage } from './image-processor.js';

async function processVideo() {
  await init();

  const video = document.getElementById('video');
  const canvas = document.getElementById('output');
  const ctx = canvas.getContext('2d');

  function processFrame() {
    ctx.drawImage(video, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Process with WASM (much faster than JS)
    const processed = processImage(imageData.data, canvas.width, canvas.height);

    imageData.data.set(processed);
    ctx.putImageData(imageData, 0, 0);

    requestAnimationFrame(processFrame);
  }

  processFrame();
}

// 2. Cryptography
import { encrypt, decrypt } from './crypto-wasm.js';

async function secureCommunication() {
  const message = 'Secret data';
  const key = 'encryption-key';

  const encrypted = encrypt(message, key);
  const decrypted = decrypt(encrypted, key);

  console.log('Encrypted:', encrypted);
  console.log('Decrypted:', decrypted);
}

// 3. Physics Simulations
import { PhysicsEngine } from './physics-wasm.js';

async function runPhysicsSimulation() {
  const engine = new PhysicsEngine();

  function update() {
    engine.step(1 / 60); // 60 FPS
    const bodies = engine.getBodies();

    // Render bodies
    bodies.forEach((body) => {
      renderBody(body.x, body.y, body.rotation);
    });

    requestAnimationFrame(update);
  }

  update();
}
```

## Conclusion

WebAssembly brings near-native performance to web applications, enabling use
cases previously impossible in the browser!
