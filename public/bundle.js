var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
function __accessProp(key) {
  return this[key];
}
var __toESMCache_node;
var __toESMCache_esm;
var __toESM = (mod, isNodeMode, target) => {
  var canCache = mod != null && typeof mod === "object";
  if (canCache) {
    var cache = isNodeMode ? __toESMCache_node ??= new WeakMap : __toESMCache_esm ??= new WeakMap;
    var cached = cache.get(mod);
    if (cached)
      return cached;
  }
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: __accessProp.bind(mod, key),
        enumerable: true
      });
  if (canCache)
    cache.set(mod, to);
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// bundle/src/js/data/token.js
var require_token = __commonJS((exports, module) => {
  async function generatorForChallenge(challenge) {
    let n = navigator.hardwareConcurrency || 8, a = Math.ceil(challenge.maxnumber / n), r = `
function sha256(data) {
    const K = new Uint32Array([
        0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
        0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
        0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
        0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
        0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
        0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
        0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
        0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
    ]);
    var h0=0x6a09e667,h1=0xbb67ae85,h2=0x3c6ef372,h3=0xa54ff53a,h4=0x510e527f,h5=0x9b05688c,h6=0x1f83d9ab,h7=0x5be0cd19;
    var len=data.length,bitLen=len*8;
    var padded=new Uint8Array(((len+9+63)&~63));
    padded.set(data);
    padded[len]=0x80;
    var dv=new DataView(padded.buffer);
    dv.setUint32(padded.length-4,bitLen,false);
    var w=new Uint32Array(64);
    for(var off=0;off<padded.length;off+=64){
        for(var i=0;i<16;i++) w[i]=dv.getUint32(off+i*4,false);
        for(var i=16;i<64;i++){
            var s0=((w[i-15]>>>7)|(w[i-15]<<25))^((w[i-15]>>>18)|(w[i-15]<<14))^(w[i-15]>>>3);
            var s1=((w[i-2]>>>17)|(w[i-2]<<15))^((w[i-2]>>>19)|(w[i-2]<<13))^(w[i-2]>>>10);
            w[i]=(w[i-16]+s0+w[i-7]+s1)|0;
        }
        var a=h0,b=h1,c=h2,d=h3,e=h4,f=h5,g=h6,h=h7;
        for(var i=0;i<64;i++){
            var S1=((e>>>6)|(e<<26))^((e>>>11)|(e<<21))^((e>>>25)|(e<<7));
            var ch=(e&f)^((~e)&g);
            var t1=(h+S1+ch+K[i]+w[i])|0;
            var S0=((a>>>2)|(a<<30))^((a>>>13)|(a<<19))^((a>>>22)|(a<<10));
            var maj=(a&b)^(a&c)^(b&c);
            var t2=(S0+maj)|0;
            h=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0;
        }
        h0=(h0+a)|0;h1=(h1+b)|0;h2=(h2+c)|0;h3=(h3+d)|0;h4=(h4+e)|0;h5=(h5+f)|0;h6=(h6+g)|0;h7=(h7+h)|0;
    }
    var out=new Uint8Array(32);
    var ov=new DataView(out.buffer);
    ov.setUint32(0,h0,false);ov.setUint32(4,h1,false);ov.setUint32(8,h2,false);ov.setUint32(12,h3,false);
    ov.setUint32(16,h4,false);ov.setUint32(20,h5,false);ov.setUint32(24,h6,false);ov.setUint32(28,h7,false);
    return out;
}
self.onmessage=function(e){
    var t=e.data.salt,n=e.data.challenge,s=e.data.start,o=e.data.end;
    var l=new TextEncoder,r=l.encode(t),a=new Uint8Array(32);
    for(var g=0;g<32;g++)a[g]=parseInt(n.substr(2*g,2),16);
    for(var f=s;f<=o;f++){
        var d=new Uint8Array(r.length+f.toString().length);
        d.set(r);d.set(l.encode(f.toString()),r.length);
        var i=sha256(d),u=true;
        for(var c=0;c<32;c++)if(i[c]!==a[c]){u=false;break}
        if(u){self.postMessage({found:true,number:f});return}
    }
    self.postMessage({found:false,completed:true});
};`, s = new Blob([r], { type: "application/javascript" }), o = URL.createObjectURL(s);
    return new Promise((e, r2) => {
      let s2 = [], c = 0, l = false, i = setTimeout(() => {
        l || (s2.forEach((e2) => e2.terminate()), URL.revokeObjectURL(o), r2(Error("Timeout")));
      }, 30000);
      for (let m = 0;m < n; m++) {
        let u = new Worker(o), g = m * a, d = Math.min((m + 1) * a - 1, challenge.maxnumber);
        u.onmessage = (a2) => {
          a2.data.found && !l ? (l = true, clearTimeout(i), s2.forEach((e2) => e2.terminate()), URL.revokeObjectURL(o), e(btoa(JSON.stringify({ algorithm: challenge.algorithm, challenge: challenge.challenge, number: a2.data.number, salt: challenge.salt, signature: challenge.signature })))) : a2.data.completed && ++c === n && !l && (l = true, clearTimeout(i), s2.forEach((e2) => e2.terminate()), URL.revokeObjectURL(o), e(null));
        }, u.onerror = (e2) => {
          l || (l = true, clearTimeout(i), s2.forEach((e3) => e3.terminate()), URL.revokeObjectURL(o), r2(e2));
        }, u.postMessage({ salt: challenge.salt, challenge: challenge.challenge, start: g, end: d }), s2.push(u);
      }
    });
  }
  var adapter;
  var device;
  var shaderModule;
  var bindGroupLayout;
  var pipeline;
  var gpuAvailable = null;
  async function initGPU() {
    if (gpuAvailable !== null)
      return gpuAvailable;
    try {
      if (!navigator.gpu) {
        gpuAvailable = false;
        return false;
      }
      adapter = await navigator.gpu.requestAdapter({ powerPreference: "high-performance" });
      if (!adapter) {
        gpuAvailable = false;
        return false;
      }
      device = await adapter.requestDevice();
      const shader = `
            @group(0) @binding(0) var<storage, read> salt_data: array<u32>;
            @group(0) @binding(1) var<storage, read> target_hash: array<u32>;
            @group(0) @binding(2) var<storage, read_write> result: array<atomic<u32>>;
            @group(0) @binding(3) var<storage, read> config: array<u32>;

            const K: array<u32, 64> = array<u32, 64>(
                0x428a2f98u, 0x71374491u, 0xb5c0fbcfu, 0xe9b5dba5u,
                0x3956c25bu, 0x59f111f1u, 0x923f82a4u, 0xab1c5ed5u,
                0xd807aa98u, 0x12835b01u, 0x243185beu, 0x550c7dc3u,
                0x72be5d74u, 0x80deb1feu, 0x9bdc06a7u, 0xc19bf174u,
                0xe49b69c1u, 0xefbe4786u, 0x0fc19dc6u, 0x240ca1ccu,
                0x2de92c6fu, 0x4a7484aau, 0x5cb0a9dcu, 0x76f988dau,
                0x983e5152u, 0xa831c66du, 0xb00327c8u, 0xbf597fc7u,
                0xc6e00bf3u, 0xd5a79147u, 0x06ca6351u, 0x14292967u,
                0x27b70a85u, 0x2e1b2138u, 0x4d2c6dfcu, 0x53380d13u,
                0x650a7354u, 0x766a0abbu, 0x81c2c92eu, 0x92722c85u,
                0xa2bfe8a1u, 0xa81a664bu, 0xc24b8b70u, 0xc76c51a3u,
                0xd192e819u, 0xd6990624u, 0xf40e3585u, 0x106aa070u,
                0x19a4c116u, 0x1e376c08u, 0x2748774cu, 0x34b0bcb5u,
                0x391c0cb3u, 0x4ed8aa4au, 0x5b9cca4fu, 0x682e6ff3u,
                0x748f82eeu, 0x78a5636fu, 0x84c87814u, 0x8cc70208u,
                0x90befffau, 0xa4506cebu, 0xbef9a3f7u, 0xc67178f2u
            );

            @compute @workgroup_size(256)
            fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
                let number = global_id.x;
                if (number >= config[0]) { return; }
                if (atomicLoad(&result[0]) == 1u) { return; }
                let salt_len = config[1];
                var w: array<u32, 64>;
                let salt_words = (salt_len + 3u) >> 2u;
                for (var i = 0u; i < salt_words; i++) { w[i] = salt_data[i]; }
                var num = number;
                var digits: array<u32, 10>;
                var digit_count = 0u;
                if (num == 0u) { digits[0] = 48u; digit_count = 1u; } else {
                    while (num > 0u) { digits[digit_count] = (num % 10u) + 48u; num /= 10u; digit_count++; }
                }
                var byte_pos = salt_len;
                for (var i = 0u; i < digit_count; i++) {
                    let digit = digits[digit_count - 1u - i];
                    let word_idx = byte_pos >> 2u;
                    let byte_idx = byte_pos & 3u;
                    let shift = (3u - byte_idx) << 3u;
                    w[word_idx] = (w[word_idx] & ~(0xFFu << shift)) | (digit << shift);
                    byte_pos++;
                }
                let msg_len = byte_pos;
                let word_idx = byte_pos >> 2u;
                let byte_idx = byte_pos & 3u;
                let shift = (3u - byte_idx) << 3u;
                w[word_idx] = (w[word_idx] & ~(0xFFu << shift)) | (0x80u << shift);
                for (var i = word_idx + 1u; i < 14u; i++) { w[i] = 0u; }
                w[14] = 0u;
                w[15] = msg_len << 3u;
                for (var i = 16u; i < 64u; i++) {
                    let w15 = w[i - 15u]; let w2 = w[i - 2u];
                    let s0 = ((w15 >> 7u) | (w15 << 25u)) ^ ((w15 >> 18u) | (w15 << 14u)) ^ (w15 >> 3u);
                    let s1 = ((w2 >> 17u) | (w2 << 15u)) ^ ((w2 >> 19u) | (w2 << 13u)) ^ (w2 >> 10u);
                    w[i] = w[i - 16u] + s0 + w[i - 7u] + s1;
                }
                var a = 0x6a09e667u; var b = 0xbb67ae85u; var c = 0x3c6ef372u; var d = 0xa54ff53au;
                var e = 0x510e527fu; var f = 0x9b05688cu; var g = 0x1f83d9abu; var h = 0x5be0cd19u;
                for (var i = 0u; i < 64u; i++) {
                    let S1 = ((e >> 6u) | (e << 26u)) ^ ((e >> 11u) | (e << 21u)) ^ ((e >> 25u) | (e << 7u));
                    let ch = (e & f) ^ ((~e) & g);
                    let temp1 = h + S1 + ch + K[i] + w[i];
                    let S0 = ((a >> 2u) | (a << 30u)) ^ ((a >> 13u) | (a << 19u)) ^ ((a >> 22u) | (a << 10u));
                    let maj = (a & b) ^ (a & c) ^ (b & c);
                    let temp2 = S0 + maj;
                    h = g; g = f; f = e; e = d + temp1; d = c; c = b; b = a; a = temp1 + temp2;
                }
                a += 0x6a09e667u; b += 0xbb67ae85u;
                if (a != target_hash[0] || b != target_hash[1]) { return; }
                c += 0x3c6ef372u; d += 0xa54ff53au; e += 0x510e527fu; f += 0x9b05688cu; g += 0x1f83d9abu; h += 0x5be0cd19u;
                if (c == target_hash[2] && d == target_hash[3] && e == target_hash[4] && f == target_hash[5] && g == target_hash[6] && h == target_hash[7]) {
                    atomicStore(&result[0], 1u);
                    atomicStore(&result[1], number);
                }
            }
        `;
      shaderModule = device.createShaderModule({ code: shader });
      bindGroupLayout = device.createBindGroupLayout({
        entries: [
          { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } },
          { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } },
          { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: "storage" } },
          { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } }
        ]
      });
      pipeline = device.createComputePipeline({
        layout: device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] }),
        compute: { module: shaderModule, entryPoint: "main" }
      });
      gpuAvailable = true;
      return true;
    } catch (e) {
      gpuAvailable = false;
      return false;
    }
  }
  async function solveWithGPU(challenges) {
    const commandEncoders = [];
    const gpuReadBuffers = [];
    const bufferSets = [];
    for (let index = 0;index < challenges.length; index++) {
      const challenge = challenges[index];
      const encoder = new TextEncoder;
      const saltBytes = encoder.encode(challenge.salt);
      const saltSize = Math.max(Math.ceil(saltBytes.length / 4) * 4, 4);
      const saltU32 = new Uint32Array(saltSize / 4);
      for (let i = 0;i < saltBytes.length; i++) {
        const wordIdx = Math.floor(i / 4);
        const byteInWord = i % 4;
        saltU32[wordIdx] |= saltBytes[i] << (3 - byteInWord) * 8;
      }
      const targetHash = new Uint32Array(8);
      for (let i = 0;i < 8; i++) {
        targetHash[i] = parseInt(challenge.challenge.substr(i * 8, 8), 16);
      }
      const saltBuffer = device.createBuffer({ size: saltSize, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST });
      device.queue.writeBuffer(saltBuffer, 0, saltU32);
      const targetBuffer = device.createBuffer({ size: 32, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST });
      device.queue.writeBuffer(targetBuffer, 0, targetHash);
      const configData = new Uint32Array([challenge.maxnumber, saltBytes.length]);
      const configBuffer = device.createBuffer({ size: 8, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST });
      device.queue.writeBuffer(configBuffer, 0, configData);
      const resultData = new Uint32Array([0, 0]);
      const resultBuffer = device.createBuffer({ size: 8, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST });
      device.queue.writeBuffer(resultBuffer, 0, resultData);
      const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
          { binding: 0, resource: { buffer: saltBuffer } },
          { binding: 1, resource: { buffer: targetBuffer } },
          { binding: 2, resource: { buffer: resultBuffer } },
          { binding: 3, resource: { buffer: configBuffer } }
        ]
      });
      const commandEncoder = device.createCommandEncoder();
      const passEncoder = commandEncoder.beginComputePass();
      passEncoder.setPipeline(pipeline);
      passEncoder.setBindGroup(0, bindGroup);
      passEncoder.dispatchWorkgroups(Math.ceil(challenge.maxnumber / 256));
      passEncoder.end();
      const gpuReadBuffer = device.createBuffer({ size: 8, usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ });
      commandEncoder.copyBufferToBuffer(resultBuffer, 0, gpuReadBuffer, 0, 8);
      commandEncoders.push(commandEncoder.finish());
      gpuReadBuffers.push(gpuReadBuffer);
      bufferSets.push({ saltBuffer, targetBuffer, configBuffer, resultBuffer });
    }
    device.queue.submit(commandEncoders);
    return Promise.all(gpuReadBuffers.map(async (gpuReadBuffer, index) => {
      await gpuReadBuffer.mapAsync(GPUMapMode.READ);
      const result = new Uint32Array(gpuReadBuffer.getMappedRange().slice(0));
      gpuReadBuffer.unmap();
      const { saltBuffer, targetBuffer, configBuffer, resultBuffer } = bufferSets[index];
      saltBuffer.destroy();
      targetBuffer.destroy();
      configBuffer.destroy();
      resultBuffer.destroy();
      gpuReadBuffer.destroy();
      if (result[0] === 1) {
        const challenge = challenges[index];
        return btoa(JSON.stringify({
          algorithm: challenge.algorithm,
          challenge: challenge.challenge,
          number: result[1],
          salt: challenge.salt,
          signature: challenge.signature
        }));
      }
      return null;
    }));
  }
  async function solveWithCPU(challenges) {
    return Promise.all(challenges.map((challenge) => generatorForChallenge(challenge)));
  }
  async function get_tokens(amount) {
    console.log(`getting ${amount} token${amount > 1 ? "s" : ""}`);
    const fetchPromises = [];
    for (let i = 0;i < amount; i++) {
      fetchPromises.push(fetch("https://api.moomoo.io/verify", { keepalive: true }).then((r) => r.json()));
    }
    let startTime = performance.now();
    const challenges = await Promise.all(fetchPromises);
    console.log(`${(performance.now() - startTime).toFixed(2)}ms to fetch`);
    startTime = performance.now();
    const hasGPU = await initGPU();
    let tokens;
    if (hasGPU) {
      try {
        tokens = await solveWithGPU(challenges);
        const failed = tokens.some((t) => t === null);
        if (failed) {
          console.log("GPU solve had failures, falling back to CPU");
          tokens = await solveWithCPU(challenges);
        }
      } catch (err) {
        console.log("GPU error, falling back to CPU:", err.message);
        gpuAvailable = false;
        tokens = await solveWithCPU(challenges);
      }
    } else {
      console.log("WebGPU not available, using CPU fallback");
      tokens = await solveWithCPU(challenges);
    }
    console.log(`${(performance.now() - startTime).toFixed(2)}ms to solve`);
    return tokens;
  }
  module.exports = get_tokens;
});

// node_modules/msgpack-lite/lib/buffer-global.js
var require_buffer_global = __commonJS((exports, module) => {
  module.exports = c(typeof Buffer !== "undefined" && Buffer) || c(exports.Buffer) || c(typeof window !== "undefined" && window.Buffer) || exports.Buffer;
  function c(B) {
    return B && B.isBuffer && B;
  }
});

// node_modules/isarray/index.js
var require_isarray = __commonJS((exports, module) => {
  var toString = {}.toString;
  module.exports = Array.isArray || function(arr) {
    return toString.call(arr) == "[object Array]";
  };
});

// node_modules/msgpack-lite/lib/bufferish-array.js
var require_bufferish_array = __commonJS((exports, module) => {
  var Bufferish = require_bufferish();
  var exports = module.exports = alloc(0);
  exports.alloc = alloc;
  exports.concat = Bufferish.concat;
  exports.from = from;
  function alloc(size) {
    return new Array(size);
  }
  function from(value) {
    if (!Bufferish.isBuffer(value) && Bufferish.isView(value)) {
      value = Bufferish.Uint8Array.from(value);
    } else if (Bufferish.isArrayBuffer(value)) {
      value = new Uint8Array(value);
    } else if (typeof value === "string") {
      return Bufferish.from.call(exports, value);
    } else if (typeof value === "number") {
      throw new TypeError('"value" argument must not be a number');
    }
    return Array.prototype.slice.call(value);
  }
});

// node_modules/msgpack-lite/lib/bufferish-buffer.js
var require_bufferish_buffer = __commonJS((exports, module) => {
  var Bufferish = require_bufferish();
  var Buffer2 = Bufferish.global;
  var exports = module.exports = Bufferish.hasBuffer ? alloc(0) : [];
  exports.alloc = Bufferish.hasBuffer && Buffer2.alloc || alloc;
  exports.concat = Bufferish.concat;
  exports.from = from;
  function alloc(size) {
    return new Buffer2(size);
  }
  function from(value) {
    if (!Bufferish.isBuffer(value) && Bufferish.isView(value)) {
      value = Bufferish.Uint8Array.from(value);
    } else if (Bufferish.isArrayBuffer(value)) {
      value = new Uint8Array(value);
    } else if (typeof value === "string") {
      return Bufferish.from.call(exports, value);
    } else if (typeof value === "number") {
      throw new TypeError('"value" argument must not be a number');
    }
    if (Buffer2.from && Buffer2.from.length !== 1) {
      return Buffer2.from(value);
    } else {
      return new Buffer2(value);
    }
  }
});

// node_modules/msgpack-lite/lib/bufferish-uint8array.js
var require_bufferish_uint8array = __commonJS((exports, module) => {
  var Bufferish = require_bufferish();
  var exports = module.exports = Bufferish.hasArrayBuffer ? alloc(0) : [];
  exports.alloc = alloc;
  exports.concat = Bufferish.concat;
  exports.from = from;
  function alloc(size) {
    return new Uint8Array(size);
  }
  function from(value) {
    if (Bufferish.isView(value)) {
      var byteOffset = value.byteOffset;
      var byteLength = value.byteLength;
      value = value.buffer;
      if (value.byteLength !== byteLength) {
        if (value.slice) {
          value = value.slice(byteOffset, byteOffset + byteLength);
        } else {
          value = new Uint8Array(value);
          if (value.byteLength !== byteLength) {
            value = Array.prototype.slice.call(value, byteOffset, byteOffset + byteLength);
          }
        }
      }
    } else if (typeof value === "string") {
      return Bufferish.from.call(exports, value);
    } else if (typeof value === "number") {
      throw new TypeError('"value" argument must not be a number');
    }
    return new Uint8Array(value);
  }
});

// node_modules/msgpack-lite/lib/buffer-lite.js
var require_buffer_lite = __commonJS((exports) => {
  exports.copy = copy;
  exports.toString = toString;
  exports.write = write;
  function write(string, offset) {
    var buffer = this;
    var index = offset || (offset |= 0);
    var length = string.length;
    var chr = 0;
    var i = 0;
    while (i < length) {
      chr = string.charCodeAt(i++);
      if (chr < 128) {
        buffer[index++] = chr;
      } else if (chr < 2048) {
        buffer[index++] = 192 | chr >>> 6;
        buffer[index++] = 128 | chr & 63;
      } else if (chr < 55296 || chr > 57343) {
        buffer[index++] = 224 | chr >>> 12;
        buffer[index++] = 128 | chr >>> 6 & 63;
        buffer[index++] = 128 | chr & 63;
      } else {
        chr = (chr - 55296 << 10 | string.charCodeAt(i++) - 56320) + 65536;
        buffer[index++] = 240 | chr >>> 18;
        buffer[index++] = 128 | chr >>> 12 & 63;
        buffer[index++] = 128 | chr >>> 6 & 63;
        buffer[index++] = 128 | chr & 63;
      }
    }
    return index - offset;
  }
  function toString(encoding, start, end) {
    var buffer = this;
    var index = start | 0;
    if (!end)
      end = buffer.length;
    var string = "";
    var chr = 0;
    while (index < end) {
      chr = buffer[index++];
      if (chr < 128) {
        string += String.fromCharCode(chr);
        continue;
      }
      if ((chr & 224) === 192) {
        chr = (chr & 31) << 6 | buffer[index++] & 63;
      } else if ((chr & 240) === 224) {
        chr = (chr & 15) << 12 | (buffer[index++] & 63) << 6 | buffer[index++] & 63;
      } else if ((chr & 248) === 240) {
        chr = (chr & 7) << 18 | (buffer[index++] & 63) << 12 | (buffer[index++] & 63) << 6 | buffer[index++] & 63;
      }
      if (chr >= 65536) {
        chr -= 65536;
        string += String.fromCharCode((chr >>> 10) + 55296, (chr & 1023) + 56320);
      } else {
        string += String.fromCharCode(chr);
      }
    }
    return string;
  }
  function copy(target, targetStart, start, end) {
    var i;
    if (!start)
      start = 0;
    if (!end && end !== 0)
      end = this.length;
    if (!targetStart)
      targetStart = 0;
    var len = end - start;
    if (target === this && start < targetStart && targetStart < end) {
      for (i = len - 1;i >= 0; i--) {
        target[i + targetStart] = this[i + start];
      }
    } else {
      for (i = 0;i < len; i++) {
        target[i + targetStart] = this[i + start];
      }
    }
    return len;
  }
});

// node_modules/msgpack-lite/lib/bufferish-proto.js
var require_bufferish_proto = __commonJS((exports) => {
  var BufferLite = require_buffer_lite();
  exports.copy = copy;
  exports.slice = slice;
  exports.toString = toString;
  exports.write = gen("write");
  var Bufferish = require_bufferish();
  var Buffer2 = Bufferish.global;
  var isBufferShim = Bufferish.hasBuffer && "TYPED_ARRAY_SUPPORT" in Buffer2;
  var brokenTypedArray = isBufferShim && !Buffer2.TYPED_ARRAY_SUPPORT;
  function copy(target, targetStart, start, end) {
    var thisIsBuffer = Bufferish.isBuffer(this);
    var targetIsBuffer = Bufferish.isBuffer(target);
    if (thisIsBuffer && targetIsBuffer) {
      return this.copy(target, targetStart, start, end);
    } else if (!brokenTypedArray && !thisIsBuffer && !targetIsBuffer && Bufferish.isView(this) && Bufferish.isView(target)) {
      var buffer = start || end != null ? slice.call(this, start, end) : this;
      target.set(buffer, targetStart);
      return buffer.length;
    } else {
      return BufferLite.copy.call(this, target, targetStart, start, end);
    }
  }
  function slice(start, end) {
    var f = this.slice || !brokenTypedArray && this.subarray;
    if (f)
      return f.call(this, start, end);
    var target = Bufferish.alloc.call(this, end - start);
    copy.call(this, target, 0, start, end);
    return target;
  }
  function toString(encoding, start, end) {
    var f = !isBufferShim && Bufferish.isBuffer(this) ? this.toString : BufferLite.toString;
    return f.apply(this, arguments);
  }
  function gen(method) {
    return wrap;
    function wrap() {
      var f = this[method] || BufferLite[method];
      return f.apply(this, arguments);
    }
  }
});

// node_modules/msgpack-lite/lib/bufferish.js
var require_bufferish = __commonJS((exports) => {
  var Buffer2 = exports.global = require_buffer_global();
  var hasBuffer = exports.hasBuffer = Buffer2 && !!Buffer2.isBuffer;
  var hasArrayBuffer = exports.hasArrayBuffer = typeof ArrayBuffer !== "undefined";
  var isArray = exports.isArray = require_isarray();
  exports.isArrayBuffer = hasArrayBuffer ? isArrayBuffer : _false;
  var isBuffer = exports.isBuffer = hasBuffer ? Buffer2.isBuffer : _false;
  var isView = exports.isView = hasArrayBuffer ? ArrayBuffer.isView || _is("ArrayBuffer", "buffer") : _false;
  exports.alloc = alloc;
  exports.concat = concat;
  exports.from = from;
  var BufferArray = exports.Array = require_bufferish_array();
  var BufferBuffer = exports.Buffer = require_bufferish_buffer();
  var BufferUint8Array = exports.Uint8Array = require_bufferish_uint8array();
  var BufferProto = exports.prototype = require_bufferish_proto();
  function from(value) {
    if (typeof value === "string") {
      return fromString.call(this, value);
    } else {
      return auto(this).from(value);
    }
  }
  function alloc(size) {
    return auto(this).alloc(size);
  }
  function concat(list, length) {
    if (!length) {
      length = 0;
      Array.prototype.forEach.call(list, dryrun);
    }
    var ref = this !== exports && this || list[0];
    var result = alloc.call(ref, length);
    var offset = 0;
    Array.prototype.forEach.call(list, append);
    return result;
    function dryrun(buffer) {
      length += buffer.length;
    }
    function append(buffer) {
      offset += BufferProto.copy.call(buffer, result, offset);
    }
  }
  var _isArrayBuffer = _is("ArrayBuffer");
  function isArrayBuffer(value) {
    return value instanceof ArrayBuffer || _isArrayBuffer(value);
  }
  function fromString(value) {
    var expected = value.length * 3;
    var that = alloc.call(this, expected);
    var actual = BufferProto.write.call(that, value);
    if (expected !== actual) {
      that = BufferProto.slice.call(that, 0, actual);
    }
    return that;
  }
  function auto(that) {
    return isBuffer(that) ? BufferBuffer : isView(that) ? BufferUint8Array : isArray(that) ? BufferArray : hasBuffer ? BufferBuffer : hasArrayBuffer ? BufferUint8Array : BufferArray;
  }
  function _false() {
    return false;
  }
  function _is(name, key) {
    name = "[object " + name + "]";
    return function(value) {
      return value != null && {}.toString.call(key ? value[key] : value) === name;
    };
  }
});

// node_modules/msgpack-lite/lib/ext-buffer.js
var require_ext_buffer = __commonJS((exports) => {
  exports.ExtBuffer = ExtBuffer;
  var Bufferish = require_bufferish();
  function ExtBuffer(buffer, type) {
    if (!(this instanceof ExtBuffer))
      return new ExtBuffer(buffer, type);
    this.buffer = Bufferish.from(buffer);
    this.type = type;
  }
});

// node_modules/msgpack-lite/lib/ext-packer.js
var require_ext_packer = __commonJS((exports) => {
  exports.setExtPackers = setExtPackers;
  var Bufferish = require_bufferish();
  var Buffer2 = Bufferish.global;
  var packTypedArray = Bufferish.Uint8Array.from;
  var _encode;
  var ERROR_COLUMNS = { name: 1, message: 1, stack: 1, columnNumber: 1, fileName: 1, lineNumber: 1 };
  function setExtPackers(codec) {
    codec.addExtPacker(14, Error, [packError, encode]);
    codec.addExtPacker(1, EvalError, [packError, encode]);
    codec.addExtPacker(2, RangeError, [packError, encode]);
    codec.addExtPacker(3, ReferenceError, [packError, encode]);
    codec.addExtPacker(4, SyntaxError, [packError, encode]);
    codec.addExtPacker(5, TypeError, [packError, encode]);
    codec.addExtPacker(6, URIError, [packError, encode]);
    codec.addExtPacker(10, RegExp, [packRegExp, encode]);
    codec.addExtPacker(11, Boolean, [packValueOf, encode]);
    codec.addExtPacker(12, String, [packValueOf, encode]);
    codec.addExtPacker(13, Date, [Number, encode]);
    codec.addExtPacker(15, Number, [packValueOf, encode]);
    if (typeof Uint8Array !== "undefined") {
      codec.addExtPacker(17, Int8Array, packTypedArray);
      codec.addExtPacker(18, Uint8Array, packTypedArray);
      codec.addExtPacker(19, Int16Array, packTypedArray);
      codec.addExtPacker(20, Uint16Array, packTypedArray);
      codec.addExtPacker(21, Int32Array, packTypedArray);
      codec.addExtPacker(22, Uint32Array, packTypedArray);
      codec.addExtPacker(23, Float32Array, packTypedArray);
      if (typeof Float64Array !== "undefined") {
        codec.addExtPacker(24, Float64Array, packTypedArray);
      }
      if (typeof Uint8ClampedArray !== "undefined") {
        codec.addExtPacker(25, Uint8ClampedArray, packTypedArray);
      }
      codec.addExtPacker(26, ArrayBuffer, packTypedArray);
      codec.addExtPacker(29, DataView, packTypedArray);
    }
    if (Bufferish.hasBuffer) {
      codec.addExtPacker(27, Buffer2, Bufferish.from);
    }
  }
  function encode(input) {
    if (!_encode)
      _encode = require_encode().encode;
    return _encode(input);
  }
  function packValueOf(value) {
    return value.valueOf();
  }
  function packRegExp(value) {
    value = RegExp.prototype.toString.call(value).split("/");
    value.shift();
    var out = [value.pop()];
    out.unshift(value.join("/"));
    return out;
  }
  function packError(value) {
    var out = {};
    for (var key in ERROR_COLUMNS) {
      out[key] = value[key];
    }
    return out;
  }
});

// node_modules/int64-buffer/int64-buffer.js
var require_int64_buffer = __commonJS((exports) => {
  var Uint64BE;
  var Int64BE;
  var Uint64LE;
  var Int64LE;
  (function(exports2) {
    var UNDEFINED = "undefined";
    var BUFFER = UNDEFINED !== typeof Buffer && Buffer;
    var UINT8ARRAY = UNDEFINED !== typeof Uint8Array && Uint8Array;
    var ARRAYBUFFER = UNDEFINED !== typeof ArrayBuffer && ArrayBuffer;
    var ZERO = [0, 0, 0, 0, 0, 0, 0, 0];
    var isArray = Array.isArray || _isArray;
    var BIT32 = 4294967296;
    var BIT24 = 16777216;
    var storage;
    Uint64BE = factory("Uint64BE", true, true);
    Int64BE = factory("Int64BE", true, false);
    Uint64LE = factory("Uint64LE", false, true);
    Int64LE = factory("Int64LE", false, false);
    function factory(name, bigendian, unsigned) {
      var posH = bigendian ? 0 : 4;
      var posL = bigendian ? 4 : 0;
      var pos0 = bigendian ? 0 : 3;
      var pos1 = bigendian ? 1 : 2;
      var pos2 = bigendian ? 2 : 1;
      var pos3 = bigendian ? 3 : 0;
      var fromPositive = bigendian ? fromPositiveBE : fromPositiveLE;
      var fromNegative = bigendian ? fromNegativeBE : fromNegativeLE;
      var proto = Int64.prototype;
      var isName = "is" + name;
      var _isInt64 = "_" + isName;
      proto.buffer = undefined;
      proto.offset = 0;
      proto[_isInt64] = true;
      proto.toNumber = toNumber;
      proto.toString = toString;
      proto.toJSON = toNumber;
      proto.toArray = toArray;
      if (BUFFER)
        proto.toBuffer = toBuffer;
      if (UINT8ARRAY)
        proto.toArrayBuffer = toArrayBuffer;
      Int64[isName] = isInt64;
      exports2[name] = Int64;
      return Int64;
      function Int64(buffer, offset, value, raddix) {
        if (!(this instanceof Int64))
          return new Int64(buffer, offset, value, raddix);
        return init(this, buffer, offset, value, raddix);
      }
      function isInt64(b2) {
        return !!(b2 && b2[_isInt64]);
      }
      function init(that, buffer, offset, value, raddix) {
        if (UINT8ARRAY && ARRAYBUFFER) {
          if (buffer instanceof ARRAYBUFFER)
            buffer = new UINT8ARRAY(buffer);
          if (value instanceof ARRAYBUFFER)
            value = new UINT8ARRAY(value);
        }
        if (!buffer && !offset && !value && !storage) {
          that.buffer = newArray(ZERO, 0);
          return;
        }
        if (!isValidBuffer(buffer, offset)) {
          var _storage = storage || Array;
          raddix = offset;
          value = buffer;
          offset = 0;
          buffer = new _storage(8);
        }
        that.buffer = buffer;
        that.offset = offset |= 0;
        if (UNDEFINED === typeof value)
          return;
        if (typeof value === "string") {
          fromString(buffer, offset, value, raddix || 10);
        } else if (isValidBuffer(value, raddix)) {
          fromArray(buffer, offset, value, raddix);
        } else if (typeof raddix === "number") {
          writeInt32(buffer, offset + posH, value);
          writeInt32(buffer, offset + posL, raddix);
        } else if (value > 0) {
          fromPositive(buffer, offset, value);
        } else if (value < 0) {
          fromNegative(buffer, offset, value);
        } else {
          fromArray(buffer, offset, ZERO, 0);
        }
      }
      function fromString(buffer, offset, str, raddix) {
        var pos = 0;
        var len = str.length;
        var high = 0;
        var low = 0;
        if (str[0] === "-")
          pos++;
        var sign = pos;
        while (pos < len) {
          var chr = parseInt(str[pos++], raddix);
          if (!(chr >= 0))
            break;
          low = low * raddix + chr;
          high = high * raddix + Math.floor(low / BIT32);
          low %= BIT32;
        }
        if (sign) {
          high = ~high;
          if (low) {
            low = BIT32 - low;
          } else {
            high++;
          }
        }
        writeInt32(buffer, offset + posH, high);
        writeInt32(buffer, offset + posL, low);
      }
      function toNumber() {
        var buffer = this.buffer;
        var offset = this.offset;
        var high = readInt32(buffer, offset + posH);
        var low = readInt32(buffer, offset + posL);
        if (!unsigned)
          high |= 0;
        return high ? high * BIT32 + low : low;
      }
      function toString(radix) {
        var buffer = this.buffer;
        var offset = this.offset;
        var high = readInt32(buffer, offset + posH);
        var low = readInt32(buffer, offset + posL);
        var str = "";
        var sign = !unsigned && high & 2147483648;
        if (sign) {
          high = ~high;
          low = BIT32 - low;
        }
        radix = radix || 10;
        while (true) {
          var mod = high % radix * BIT32 + low;
          high = Math.floor(high / radix);
          low = Math.floor(mod / radix);
          str = (mod % radix).toString(radix) + str;
          if (!high && !low)
            break;
        }
        if (sign) {
          str = "-" + str;
        }
        return str;
      }
      function writeInt32(buffer, offset, value) {
        buffer[offset + pos3] = value & 255;
        value = value >> 8;
        buffer[offset + pos2] = value & 255;
        value = value >> 8;
        buffer[offset + pos1] = value & 255;
        value = value >> 8;
        buffer[offset + pos0] = value & 255;
      }
      function readInt32(buffer, offset) {
        return buffer[offset + pos0] * BIT24 + (buffer[offset + pos1] << 16) + (buffer[offset + pos2] << 8) + buffer[offset + pos3];
      }
    }
    function toArray(raw) {
      var buffer = this.buffer;
      var offset = this.offset;
      storage = null;
      if (raw !== false && offset === 0 && buffer.length === 8 && isArray(buffer))
        return buffer;
      return newArray(buffer, offset);
    }
    function toBuffer(raw) {
      var buffer = this.buffer;
      var offset = this.offset;
      storage = BUFFER;
      if (raw !== false && offset === 0 && buffer.length === 8 && Buffer.isBuffer(buffer))
        return buffer;
      var dest = new BUFFER(8);
      fromArray(dest, 0, buffer, offset);
      return dest;
    }
    function toArrayBuffer(raw) {
      var buffer = this.buffer;
      var offset = this.offset;
      var arrbuf = buffer.buffer;
      storage = UINT8ARRAY;
      if (raw !== false && offset === 0 && arrbuf instanceof ARRAYBUFFER && arrbuf.byteLength === 8)
        return arrbuf;
      var dest = new UINT8ARRAY(8);
      fromArray(dest, 0, buffer, offset);
      return dest.buffer;
    }
    function isValidBuffer(buffer, offset) {
      var len = buffer && buffer.length;
      offset |= 0;
      return len && offset + 8 <= len && typeof buffer[offset] !== "string";
    }
    function fromArray(destbuf, destoff, srcbuf, srcoff) {
      destoff |= 0;
      srcoff |= 0;
      for (var i = 0;i < 8; i++) {
        destbuf[destoff++] = srcbuf[srcoff++] & 255;
      }
    }
    function newArray(buffer, offset) {
      return Array.prototype.slice.call(buffer, offset, offset + 8);
    }
    function fromPositiveBE(buffer, offset, value) {
      var pos = offset + 8;
      while (pos > offset) {
        buffer[--pos] = value & 255;
        value /= 256;
      }
    }
    function fromNegativeBE(buffer, offset, value) {
      var pos = offset + 8;
      value++;
      while (pos > offset) {
        buffer[--pos] = -value & 255 ^ 255;
        value /= 256;
      }
    }
    function fromPositiveLE(buffer, offset, value) {
      var end = offset + 8;
      while (offset < end) {
        buffer[offset++] = value & 255;
        value /= 256;
      }
    }
    function fromNegativeLE(buffer, offset, value) {
      var end = offset + 8;
      value++;
      while (offset < end) {
        buffer[offset++] = -value & 255 ^ 255;
        value /= 256;
      }
    }
    function _isArray(val) {
      return !!val && Object.prototype.toString.call(val) == "[object Array]";
    }
  })(typeof exports === "object" && typeof exports.nodeName !== "string" ? exports : exports || {});
});

// node_modules/ieee754/index.js
var require_ieee754 = __commonJS((exports) => {
  /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
  exports.read = function(buffer, offset, isLE, mLen, nBytes) {
    var e, m;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var nBits = -7;
    var i = isLE ? nBytes - 1 : 0;
    var d = isLE ? -1 : 1;
    var s = buffer[offset + i];
    i += d;
    e = s & (1 << -nBits) - 1;
    s >>= -nBits;
    nBits += eLen;
    for (;nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}
    m = e & (1 << -nBits) - 1;
    e >>= -nBits;
    nBits += mLen;
    for (;nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}
    if (e === 0) {
      e = 1 - eBias;
    } else if (e === eMax) {
      return m ? NaN : (s ? -1 : 1) * Infinity;
    } else {
      m = m + Math.pow(2, mLen);
      e = e - eBias;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
  };
  exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
    var e, m, c;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
    var i = isLE ? 0 : nBytes - 1;
    var d = isLE ? 1 : -1;
    var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
    value = Math.abs(value);
    if (isNaN(value) || value === Infinity) {
      m = isNaN(value) ? 1 : 0;
      e = eMax;
    } else {
      e = Math.floor(Math.log(value) / Math.LN2);
      if (value * (c = Math.pow(2, -e)) < 1) {
        e--;
        c *= 2;
      }
      if (e + eBias >= 1) {
        value += rt / c;
      } else {
        value += rt * Math.pow(2, 1 - eBias);
      }
      if (value * c >= 2) {
        e++;
        c /= 2;
      }
      if (e + eBias >= eMax) {
        m = 0;
        e = eMax;
      } else if (e + eBias >= 1) {
        m = (value * c - 1) * Math.pow(2, mLen);
        e = e + eBias;
      } else {
        m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
        e = 0;
      }
    }
    for (;mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {}
    e = e << mLen | m;
    eLen += mLen;
    for (;eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {}
    buffer[offset + i - d] |= s * 128;
  };
});

// node_modules/msgpack-lite/lib/write-uint8.js
var require_write_uint8 = __commonJS((exports) => {
  var constant = exports.uint8 = new Array(256);
  for (i = 0;i <= 255; i++) {
    constant[i] = write0(i);
  }
  var i;
  function write0(type) {
    return function(encoder) {
      var offset = encoder.reserve(1);
      encoder.buffer[offset] = type;
    };
  }
});

// node_modules/msgpack-lite/lib/write-token.js
var require_write_token = __commonJS((exports) => {
  var ieee754 = require_ieee754();
  var Int64Buffer = require_int64_buffer();
  var Uint64BE = Int64Buffer.Uint64BE;
  var Int64BE = Int64Buffer.Int64BE;
  var uint8 = require_write_uint8().uint8;
  var Bufferish = require_bufferish();
  var Buffer2 = Bufferish.global;
  var IS_BUFFER_SHIM = Bufferish.hasBuffer && "TYPED_ARRAY_SUPPORT" in Buffer2;
  var NO_TYPED_ARRAY = IS_BUFFER_SHIM && !Buffer2.TYPED_ARRAY_SUPPORT;
  var Buffer_prototype = Bufferish.hasBuffer && Buffer2.prototype || {};
  exports.getWriteToken = getWriteToken;
  function getWriteToken(options) {
    if (options && options.uint8array) {
      return init_uint8array();
    } else if (NO_TYPED_ARRAY || Bufferish.hasBuffer && options && options.safe) {
      return init_safe();
    } else {
      return init_token();
    }
  }
  function init_uint8array() {
    var token = init_token();
    token[202] = writeN(202, 4, writeFloatBE);
    token[203] = writeN(203, 8, writeDoubleBE);
    return token;
  }
  function init_token() {
    var token = uint8.slice();
    token[196] = write1(196);
    token[197] = write2(197);
    token[198] = write4(198);
    token[199] = write1(199);
    token[200] = write2(200);
    token[201] = write4(201);
    token[202] = writeN(202, 4, Buffer_prototype.writeFloatBE || writeFloatBE, true);
    token[203] = writeN(203, 8, Buffer_prototype.writeDoubleBE || writeDoubleBE, true);
    token[204] = write1(204);
    token[205] = write2(205);
    token[206] = write4(206);
    token[207] = writeN(207, 8, writeUInt64BE);
    token[208] = write1(208);
    token[209] = write2(209);
    token[210] = write4(210);
    token[211] = writeN(211, 8, writeInt64BE);
    token[217] = write1(217);
    token[218] = write2(218);
    token[219] = write4(219);
    token[220] = write2(220);
    token[221] = write4(221);
    token[222] = write2(222);
    token[223] = write4(223);
    return token;
  }
  function init_safe() {
    var token = uint8.slice();
    token[196] = writeN(196, 1, Buffer2.prototype.writeUInt8);
    token[197] = writeN(197, 2, Buffer2.prototype.writeUInt16BE);
    token[198] = writeN(198, 4, Buffer2.prototype.writeUInt32BE);
    token[199] = writeN(199, 1, Buffer2.prototype.writeUInt8);
    token[200] = writeN(200, 2, Buffer2.prototype.writeUInt16BE);
    token[201] = writeN(201, 4, Buffer2.prototype.writeUInt32BE);
    token[202] = writeN(202, 4, Buffer2.prototype.writeFloatBE);
    token[203] = writeN(203, 8, Buffer2.prototype.writeDoubleBE);
    token[204] = writeN(204, 1, Buffer2.prototype.writeUInt8);
    token[205] = writeN(205, 2, Buffer2.prototype.writeUInt16BE);
    token[206] = writeN(206, 4, Buffer2.prototype.writeUInt32BE);
    token[207] = writeN(207, 8, writeUInt64BE);
    token[208] = writeN(208, 1, Buffer2.prototype.writeInt8);
    token[209] = writeN(209, 2, Buffer2.prototype.writeInt16BE);
    token[210] = writeN(210, 4, Buffer2.prototype.writeInt32BE);
    token[211] = writeN(211, 8, writeInt64BE);
    token[217] = writeN(217, 1, Buffer2.prototype.writeUInt8);
    token[218] = writeN(218, 2, Buffer2.prototype.writeUInt16BE);
    token[219] = writeN(219, 4, Buffer2.prototype.writeUInt32BE);
    token[220] = writeN(220, 2, Buffer2.prototype.writeUInt16BE);
    token[221] = writeN(221, 4, Buffer2.prototype.writeUInt32BE);
    token[222] = writeN(222, 2, Buffer2.prototype.writeUInt16BE);
    token[223] = writeN(223, 4, Buffer2.prototype.writeUInt32BE);
    return token;
  }
  function write1(type) {
    return function(encoder, value) {
      var offset = encoder.reserve(2);
      var buffer = encoder.buffer;
      buffer[offset++] = type;
      buffer[offset] = value;
    };
  }
  function write2(type) {
    return function(encoder, value) {
      var offset = encoder.reserve(3);
      var buffer = encoder.buffer;
      buffer[offset++] = type;
      buffer[offset++] = value >>> 8;
      buffer[offset] = value;
    };
  }
  function write4(type) {
    return function(encoder, value) {
      var offset = encoder.reserve(5);
      var buffer = encoder.buffer;
      buffer[offset++] = type;
      buffer[offset++] = value >>> 24;
      buffer[offset++] = value >>> 16;
      buffer[offset++] = value >>> 8;
      buffer[offset] = value;
    };
  }
  function writeN(type, len, method, noAssert) {
    return function(encoder, value) {
      var offset = encoder.reserve(len + 1);
      encoder.buffer[offset++] = type;
      method.call(encoder.buffer, value, offset, noAssert);
    };
  }
  function writeUInt64BE(value, offset) {
    new Uint64BE(this, offset, value);
  }
  function writeInt64BE(value, offset) {
    new Int64BE(this, offset, value);
  }
  function writeFloatBE(value, offset) {
    ieee754.write(this, value, offset, false, 23, 4);
  }
  function writeDoubleBE(value, offset) {
    ieee754.write(this, value, offset, false, 52, 8);
  }
});

// node_modules/msgpack-lite/lib/write-type.js
var require_write_type = __commonJS((exports) => {
  var IS_ARRAY = require_isarray();
  var Int64Buffer = require_int64_buffer();
  var Uint64BE = Int64Buffer.Uint64BE;
  var Int64BE = Int64Buffer.Int64BE;
  var Bufferish = require_bufferish();
  var BufferProto = require_bufferish_proto();
  var WriteToken = require_write_token();
  var uint8 = require_write_uint8().uint8;
  var ExtBuffer = require_ext_buffer().ExtBuffer;
  var HAS_UINT8ARRAY = typeof Uint8Array !== "undefined";
  var HAS_MAP = typeof Map !== "undefined";
  var extmap = [];
  extmap[1] = 212;
  extmap[2] = 213;
  extmap[4] = 214;
  extmap[8] = 215;
  extmap[16] = 216;
  exports.getWriteType = getWriteType;
  function getWriteType(options) {
    var token = WriteToken.getWriteToken(options);
    var useraw = options && options.useraw;
    var binarraybuffer = HAS_UINT8ARRAY && options && options.binarraybuffer;
    var isBuffer = binarraybuffer ? Bufferish.isArrayBuffer : Bufferish.isBuffer;
    var bin = binarraybuffer ? bin_arraybuffer : bin_buffer;
    var usemap = HAS_MAP && options && options.usemap;
    var map = usemap ? map_to_map : obj_to_map;
    var writeType = {
      boolean: bool,
      function: nil,
      number,
      object: useraw ? object_raw : object,
      string: _string(useraw ? raw_head_size : str_head_size),
      symbol: nil,
      undefined: nil
    };
    return writeType;
    function bool(encoder, value) {
      var type = value ? 195 : 194;
      token[type](encoder, value);
    }
    function number(encoder, value) {
      var ivalue = value | 0;
      var type;
      if (value !== ivalue) {
        type = 203;
        token[type](encoder, value);
        return;
      } else if (-32 <= ivalue && ivalue <= 127) {
        type = ivalue & 255;
      } else if (0 <= ivalue) {
        type = ivalue <= 255 ? 204 : ivalue <= 65535 ? 205 : 206;
      } else {
        type = -128 <= ivalue ? 208 : -32768 <= ivalue ? 209 : 210;
      }
      token[type](encoder, ivalue);
    }
    function uint64(encoder, value) {
      var type = 207;
      token[type](encoder, value.toArray());
    }
    function int64(encoder, value) {
      var type = 211;
      token[type](encoder, value.toArray());
    }
    function str_head_size(length) {
      return length < 32 ? 1 : length <= 255 ? 2 : length <= 65535 ? 3 : 5;
    }
    function raw_head_size(length) {
      return length < 32 ? 1 : length <= 65535 ? 3 : 5;
    }
    function _string(head_size) {
      return string;
      function string(encoder, value) {
        var length = value.length;
        var maxsize = 5 + length * 3;
        encoder.offset = encoder.reserve(maxsize);
        var buffer = encoder.buffer;
        var expected = head_size(length);
        var start = encoder.offset + expected;
        length = BufferProto.write.call(buffer, value, start);
        var actual = head_size(length);
        if (expected !== actual) {
          var targetStart = start + actual - expected;
          var end = start + length;
          BufferProto.copy.call(buffer, buffer, targetStart, start, end);
        }
        var type = actual === 1 ? 160 + length : actual <= 3 ? 215 + actual : 219;
        token[type](encoder, length);
        encoder.offset += length;
      }
    }
    function object(encoder, value) {
      if (value === null)
        return nil(encoder, value);
      if (isBuffer(value))
        return bin(encoder, value);
      if (IS_ARRAY(value))
        return array(encoder, value);
      if (Uint64BE.isUint64BE(value))
        return uint64(encoder, value);
      if (Int64BE.isInt64BE(value))
        return int64(encoder, value);
      var packer = encoder.codec.getExtPacker(value);
      if (packer)
        value = packer(value);
      if (value instanceof ExtBuffer)
        return ext(encoder, value);
      map(encoder, value);
    }
    function object_raw(encoder, value) {
      if (isBuffer(value))
        return raw(encoder, value);
      object(encoder, value);
    }
    function nil(encoder, value) {
      var type = 192;
      token[type](encoder, value);
    }
    function array(encoder, value) {
      var length = value.length;
      var type = length < 16 ? 144 + length : length <= 65535 ? 220 : 221;
      token[type](encoder, length);
      var encode = encoder.codec.encode;
      for (var i = 0;i < length; i++) {
        encode(encoder, value[i]);
      }
    }
    function bin_buffer(encoder, value) {
      var length = value.length;
      var type = length < 255 ? 196 : length <= 65535 ? 197 : 198;
      token[type](encoder, length);
      encoder.send(value);
    }
    function bin_arraybuffer(encoder, value) {
      bin_buffer(encoder, new Uint8Array(value));
    }
    function ext(encoder, value) {
      var buffer = value.buffer;
      var length = buffer.length;
      var type = extmap[length] || (length < 255 ? 199 : length <= 65535 ? 200 : 201);
      token[type](encoder, length);
      uint8[value.type](encoder);
      encoder.send(buffer);
    }
    function obj_to_map(encoder, value) {
      var keys = Object.keys(value);
      var length = keys.length;
      var type = length < 16 ? 128 + length : length <= 65535 ? 222 : 223;
      token[type](encoder, length);
      var encode = encoder.codec.encode;
      keys.forEach(function(key) {
        encode(encoder, key);
        encode(encoder, value[key]);
      });
    }
    function map_to_map(encoder, value) {
      if (!(value instanceof Map))
        return obj_to_map(encoder, value);
      var length = value.size;
      var type = length < 16 ? 128 + length : length <= 65535 ? 222 : 223;
      token[type](encoder, length);
      var encode = encoder.codec.encode;
      value.forEach(function(val, key, m) {
        encode(encoder, key);
        encode(encoder, val);
      });
    }
    function raw(encoder, value) {
      var length = value.length;
      var type = length < 32 ? 160 + length : length <= 65535 ? 218 : 219;
      token[type](encoder, length);
      encoder.send(value);
    }
  }
});

// node_modules/msgpack-lite/lib/codec-base.js
var require_codec_base = __commonJS((exports) => {
  var IS_ARRAY = require_isarray();
  exports.createCodec = createCodec;
  exports.install = install;
  exports.filter = filter;
  var Bufferish = require_bufferish();
  function Codec(options) {
    if (!(this instanceof Codec))
      return new Codec(options);
    this.options = options;
    this.init();
  }
  Codec.prototype.init = function() {
    var options = this.options;
    if (options && options.uint8array) {
      this.bufferish = Bufferish.Uint8Array;
    }
    return this;
  };
  function install(props) {
    for (var key in props) {
      Codec.prototype[key] = add(Codec.prototype[key], props[key]);
    }
  }
  function add(a, b2) {
    return a && b2 ? ab : a || b2;
    function ab() {
      a.apply(this, arguments);
      return b2.apply(this, arguments);
    }
  }
  function join(filters) {
    filters = filters.slice();
    return function(value) {
      return filters.reduce(iterator, value);
    };
    function iterator(value, filter2) {
      return filter2(value);
    }
  }
  function filter(filter2) {
    return IS_ARRAY(filter2) ? join(filter2) : filter2;
  }
  function createCodec(options) {
    return new Codec(options);
  }
  exports.preset = createCodec({ preset: true });
});

// node_modules/msgpack-lite/lib/write-core.js
var require_write_core = __commonJS((exports) => {
  var ExtBuffer = require_ext_buffer().ExtBuffer;
  var ExtPacker = require_ext_packer();
  var WriteType = require_write_type();
  var CodecBase = require_codec_base();
  CodecBase.install({
    addExtPacker,
    getExtPacker,
    init
  });
  exports.preset = init.call(CodecBase.preset);
  function getEncoder(options) {
    var writeType = WriteType.getWriteType(options);
    return encode;
    function encode(encoder, value) {
      var func = writeType[typeof value];
      if (!func)
        throw new Error('Unsupported type "' + typeof value + '": ' + value);
      func(encoder, value);
    }
  }
  function init() {
    var options = this.options;
    this.encode = getEncoder(options);
    if (options && options.preset) {
      ExtPacker.setExtPackers(this);
    }
    return this;
  }
  function addExtPacker(etype, Class, packer) {
    packer = CodecBase.filter(packer);
    var name = Class.name;
    if (name && name !== "Object") {
      var packers = this.extPackers || (this.extPackers = {});
      packers[name] = extPacker;
    } else {
      var list = this.extEncoderList || (this.extEncoderList = []);
      list.unshift([Class, extPacker]);
    }
    function extPacker(value) {
      if (packer)
        value = packer(value);
      return new ExtBuffer(value, etype);
    }
  }
  function getExtPacker(value) {
    var packers = this.extPackers || (this.extPackers = {});
    var c = value.constructor;
    var e = c && c.name && packers[c.name];
    if (e)
      return e;
    var list = this.extEncoderList || (this.extEncoderList = []);
    var len = list.length;
    for (var i = 0;i < len; i++) {
      var pair = list[i];
      if (c === pair[0])
        return pair[1];
    }
  }
});

// node_modules/msgpack-lite/lib/flex-buffer.js
var require_flex_buffer = __commonJS((exports) => {
  exports.FlexDecoder = FlexDecoder;
  exports.FlexEncoder = FlexEncoder;
  var Bufferish = require_bufferish();
  var MIN_BUFFER_SIZE = 2048;
  var MAX_BUFFER_SIZE = 65536;
  var BUFFER_SHORTAGE = "BUFFER_SHORTAGE";
  function FlexDecoder() {
    if (!(this instanceof FlexDecoder))
      return new FlexDecoder;
  }
  function FlexEncoder() {
    if (!(this instanceof FlexEncoder))
      return new FlexEncoder;
  }
  FlexDecoder.mixin = mixinFactory(getDecoderMethods());
  FlexDecoder.mixin(FlexDecoder.prototype);
  FlexEncoder.mixin = mixinFactory(getEncoderMethods());
  FlexEncoder.mixin(FlexEncoder.prototype);
  function getDecoderMethods() {
    return {
      bufferish: Bufferish,
      write: write2,
      fetch: fetch2,
      flush,
      push,
      pull,
      read,
      reserve,
      offset: 0
    };
    function write2(chunk) {
      var prev = this.offset ? Bufferish.prototype.slice.call(this.buffer, this.offset) : this.buffer;
      this.buffer = prev ? chunk ? this.bufferish.concat([prev, chunk]) : prev : chunk;
      this.offset = 0;
    }
    function flush() {
      while (this.offset < this.buffer.length) {
        var start = this.offset;
        var value;
        try {
          value = this.fetch();
        } catch (e) {
          if (e && e.message != BUFFER_SHORTAGE)
            throw e;
          this.offset = start;
          break;
        }
        this.push(value);
      }
    }
    function reserve(length) {
      var start = this.offset;
      var end = start + length;
      if (end > this.buffer.length)
        throw new Error(BUFFER_SHORTAGE);
      this.offset = end;
      return start;
    }
  }
  function getEncoderMethods() {
    return {
      bufferish: Bufferish,
      write,
      fetch: fetch3,
      flush,
      push,
      pull: pull2,
      read,
      reserve,
      send,
      maxBufferSize: MAX_BUFFER_SIZE,
      minBufferSize: MIN_BUFFER_SIZE,
      offset: 0,
      start: 0
    };
    function fetch3() {
      var start = this.start;
      if (start < this.offset) {
        var end = this.start = this.offset;
        return Bufferish.prototype.slice.call(this.buffer, start, end);
      }
    }
    function flush() {
      while (this.start < this.offset) {
        var value = this.fetch();
        if (value)
          this.push(value);
      }
    }
    function pull2() {
      var buffers = this.buffers || (this.buffers = []);
      var chunk = buffers.length > 1 ? this.bufferish.concat(buffers) : buffers[0];
      buffers.length = 0;
      return chunk;
    }
    function reserve(length) {
      var req = length | 0;
      if (this.buffer) {
        var size = this.buffer.length;
        var start = this.offset | 0;
        var end = start + req;
        if (end < size) {
          this.offset = end;
          return start;
        }
        this.flush();
        length = Math.max(length, Math.min(size * 2, this.maxBufferSize));
      }
      length = Math.max(length, this.minBufferSize);
      this.buffer = this.bufferish.alloc(length);
      this.start = 0;
      this.offset = req;
      return 0;
    }
    function send(buffer) {
      var length = buffer.length;
      if (length > this.minBufferSize) {
        this.flush();
        this.push(buffer);
      } else {
        var offset = this.reserve(length);
        Bufferish.prototype.copy.call(buffer, this.buffer, offset);
      }
    }
  }
  function write() {
    throw new Error("method not implemented: write()");
  }
  function fetch2() {
    throw new Error("method not implemented: fetch()");
  }
  function read() {
    var length = this.buffers && this.buffers.length;
    if (!length)
      return this.fetch();
    this.flush();
    return this.pull();
  }
  function push(chunk) {
    var buffers = this.buffers || (this.buffers = []);
    buffers.push(chunk);
  }
  function pull() {
    var buffers = this.buffers || (this.buffers = []);
    return buffers.shift();
  }
  function mixinFactory(source) {
    return mixin;
    function mixin(target) {
      for (var key in source) {
        target[key] = source[key];
      }
      return target;
    }
  }
});

// node_modules/msgpack-lite/lib/encode-buffer.js
var require_encode_buffer = __commonJS((exports) => {
  exports.EncodeBuffer = EncodeBuffer;
  var preset = require_write_core().preset;
  var FlexEncoder = require_flex_buffer().FlexEncoder;
  FlexEncoder.mixin(EncodeBuffer.prototype);
  function EncodeBuffer(options) {
    if (!(this instanceof EncodeBuffer))
      return new EncodeBuffer(options);
    if (options) {
      this.options = options;
      if (options.codec) {
        var codec = this.codec = options.codec;
        if (codec.bufferish)
          this.bufferish = codec.bufferish;
      }
    }
  }
  EncodeBuffer.prototype.codec = preset;
  EncodeBuffer.prototype.write = function(input) {
    this.codec.encode(this, input);
  };
});

// node_modules/msgpack-lite/lib/encode.js
var require_encode = __commonJS((exports) => {
  exports.encode = encode;
  var EncodeBuffer = require_encode_buffer().EncodeBuffer;
  function encode(input, options) {
    var encoder = new EncodeBuffer(options);
    encoder.write(input);
    return encoder.read();
  }
});

// node_modules/msgpack-lite/lib/ext-unpacker.js
var require_ext_unpacker = __commonJS((exports) => {
  exports.setExtUnpackers = setExtUnpackers;
  var Bufferish = require_bufferish();
  var Buffer2 = Bufferish.global;
  var _decode;
  var ERROR_COLUMNS = { name: 1, message: 1, stack: 1, columnNumber: 1, fileName: 1, lineNumber: 1 };
  function setExtUnpackers(codec) {
    codec.addExtUnpacker(14, [decode, unpackError(Error)]);
    codec.addExtUnpacker(1, [decode, unpackError(EvalError)]);
    codec.addExtUnpacker(2, [decode, unpackError(RangeError)]);
    codec.addExtUnpacker(3, [decode, unpackError(ReferenceError)]);
    codec.addExtUnpacker(4, [decode, unpackError(SyntaxError)]);
    codec.addExtUnpacker(5, [decode, unpackError(TypeError)]);
    codec.addExtUnpacker(6, [decode, unpackError(URIError)]);
    codec.addExtUnpacker(10, [decode, unpackRegExp]);
    codec.addExtUnpacker(11, [decode, unpackClass(Boolean)]);
    codec.addExtUnpacker(12, [decode, unpackClass(String)]);
    codec.addExtUnpacker(13, [decode, unpackClass(Date)]);
    codec.addExtUnpacker(15, [decode, unpackClass(Number)]);
    if (typeof Uint8Array !== "undefined") {
      codec.addExtUnpacker(17, unpackClass(Int8Array));
      codec.addExtUnpacker(18, unpackClass(Uint8Array));
      codec.addExtUnpacker(19, [unpackArrayBuffer, unpackClass(Int16Array)]);
      codec.addExtUnpacker(20, [unpackArrayBuffer, unpackClass(Uint16Array)]);
      codec.addExtUnpacker(21, [unpackArrayBuffer, unpackClass(Int32Array)]);
      codec.addExtUnpacker(22, [unpackArrayBuffer, unpackClass(Uint32Array)]);
      codec.addExtUnpacker(23, [unpackArrayBuffer, unpackClass(Float32Array)]);
      if (typeof Float64Array !== "undefined") {
        codec.addExtUnpacker(24, [unpackArrayBuffer, unpackClass(Float64Array)]);
      }
      if (typeof Uint8ClampedArray !== "undefined") {
        codec.addExtUnpacker(25, unpackClass(Uint8ClampedArray));
      }
      codec.addExtUnpacker(26, unpackArrayBuffer);
      codec.addExtUnpacker(29, [unpackArrayBuffer, unpackClass(DataView)]);
    }
    if (Bufferish.hasBuffer) {
      codec.addExtUnpacker(27, unpackClass(Buffer2));
    }
  }
  function decode(input) {
    if (!_decode)
      _decode = require_decode().decode;
    return _decode(input);
  }
  function unpackRegExp(value) {
    return RegExp.apply(null, value);
  }
  function unpackError(Class) {
    return function(value) {
      var out = new Class;
      for (var key in ERROR_COLUMNS) {
        out[key] = value[key];
      }
      return out;
    };
  }
  function unpackClass(Class) {
    return function(value) {
      return new Class(value);
    };
  }
  function unpackArrayBuffer(value) {
    return new Uint8Array(value).buffer;
  }
});

// node_modules/msgpack-lite/lib/read-format.js
var require_read_format = __commonJS((exports) => {
  var ieee754 = require_ieee754();
  var Int64Buffer = require_int64_buffer();
  var Uint64BE = Int64Buffer.Uint64BE;
  var Int64BE = Int64Buffer.Int64BE;
  exports.getReadFormat = getReadFormat;
  exports.readUint8 = uint8;
  var Bufferish = require_bufferish();
  var BufferProto = require_bufferish_proto();
  var HAS_MAP = typeof Map !== "undefined";
  var NO_ASSERT = true;
  function getReadFormat(options) {
    var binarraybuffer = Bufferish.hasArrayBuffer && options && options.binarraybuffer;
    var int64 = options && options.int64;
    var usemap = HAS_MAP && options && options.usemap;
    var readFormat = {
      map: usemap ? map_to_map : map_to_obj,
      array,
      str,
      bin: binarraybuffer ? bin_arraybuffer : bin_buffer,
      ext,
      uint8,
      uint16,
      uint32,
      uint64: read(8, int64 ? readUInt64BE_int64 : readUInt64BE),
      int8,
      int16,
      int32,
      int64: read(8, int64 ? readInt64BE_int64 : readInt64BE),
      float32: read(4, readFloatBE),
      float64: read(8, readDoubleBE)
    };
    return readFormat;
  }
  function map_to_obj(decoder, len) {
    var value = {};
    var i;
    var k = new Array(len);
    var v = new Array(len);
    var decode = decoder.codec.decode;
    for (i = 0;i < len; i++) {
      k[i] = decode(decoder);
      v[i] = decode(decoder);
    }
    for (i = 0;i < len; i++) {
      value[k[i]] = v[i];
    }
    return value;
  }
  function map_to_map(decoder, len) {
    var value = new Map;
    var i;
    var k = new Array(len);
    var v = new Array(len);
    var decode = decoder.codec.decode;
    for (i = 0;i < len; i++) {
      k[i] = decode(decoder);
      v[i] = decode(decoder);
    }
    for (i = 0;i < len; i++) {
      value.set(k[i], v[i]);
    }
    return value;
  }
  function array(decoder, len) {
    var value = new Array(len);
    var decode = decoder.codec.decode;
    for (var i = 0;i < len; i++) {
      value[i] = decode(decoder);
    }
    return value;
  }
  function str(decoder, len) {
    var start = decoder.reserve(len);
    var end = start + len;
    return BufferProto.toString.call(decoder.buffer, "utf-8", start, end);
  }
  function bin_buffer(decoder, len) {
    var start = decoder.reserve(len);
    var end = start + len;
    var buf = BufferProto.slice.call(decoder.buffer, start, end);
    return Bufferish.from(buf);
  }
  function bin_arraybuffer(decoder, len) {
    var start = decoder.reserve(len);
    var end = start + len;
    var buf = BufferProto.slice.call(decoder.buffer, start, end);
    return Bufferish.Uint8Array.from(buf).buffer;
  }
  function ext(decoder, len) {
    var start = decoder.reserve(len + 1);
    var type = decoder.buffer[start++];
    var end = start + len;
    var unpack = decoder.codec.getExtUnpacker(type);
    if (!unpack)
      throw new Error("Invalid ext type: " + (type ? "0x" + type.toString(16) : type));
    var buf = BufferProto.slice.call(decoder.buffer, start, end);
    return unpack(buf);
  }
  function uint8(decoder) {
    var start = decoder.reserve(1);
    return decoder.buffer[start];
  }
  function int8(decoder) {
    var start = decoder.reserve(1);
    var value = decoder.buffer[start];
    return value & 128 ? value - 256 : value;
  }
  function uint16(decoder) {
    var start = decoder.reserve(2);
    var buffer = decoder.buffer;
    return buffer[start++] << 8 | buffer[start];
  }
  function int16(decoder) {
    var start = decoder.reserve(2);
    var buffer = decoder.buffer;
    var value = buffer[start++] << 8 | buffer[start];
    return value & 32768 ? value - 65536 : value;
  }
  function uint32(decoder) {
    var start = decoder.reserve(4);
    var buffer = decoder.buffer;
    return buffer[start++] * 16777216 + (buffer[start++] << 16) + (buffer[start++] << 8) + buffer[start];
  }
  function int32(decoder) {
    var start = decoder.reserve(4);
    var buffer = decoder.buffer;
    return buffer[start++] << 24 | buffer[start++] << 16 | buffer[start++] << 8 | buffer[start];
  }
  function read(len, method) {
    return function(decoder) {
      var start = decoder.reserve(len);
      return method.call(decoder.buffer, start, NO_ASSERT);
    };
  }
  function readUInt64BE(start) {
    return new Uint64BE(this, start).toNumber();
  }
  function readInt64BE(start) {
    return new Int64BE(this, start).toNumber();
  }
  function readUInt64BE_int64(start) {
    return new Uint64BE(this, start);
  }
  function readInt64BE_int64(start) {
    return new Int64BE(this, start);
  }
  function readFloatBE(start) {
    return ieee754.read(this, start, false, 23, 4);
  }
  function readDoubleBE(start) {
    return ieee754.read(this, start, false, 52, 8);
  }
});

// node_modules/msgpack-lite/lib/read-token.js
var require_read_token = __commonJS((exports) => {
  var ReadFormat = require_read_format();
  exports.getReadToken = getReadToken;
  function getReadToken(options) {
    var format = ReadFormat.getReadFormat(options);
    if (options && options.useraw) {
      return init_useraw(format);
    } else {
      return init_token(format);
    }
  }
  function init_token(format) {
    var i;
    var token = new Array(256);
    for (i = 0;i <= 127; i++) {
      token[i] = constant(i);
    }
    for (i = 128;i <= 143; i++) {
      token[i] = fix(i - 128, format.map);
    }
    for (i = 144;i <= 159; i++) {
      token[i] = fix(i - 144, format.array);
    }
    for (i = 160;i <= 191; i++) {
      token[i] = fix(i - 160, format.str);
    }
    token[192] = constant(null);
    token[193] = null;
    token[194] = constant(false);
    token[195] = constant(true);
    token[196] = flex(format.uint8, format.bin);
    token[197] = flex(format.uint16, format.bin);
    token[198] = flex(format.uint32, format.bin);
    token[199] = flex(format.uint8, format.ext);
    token[200] = flex(format.uint16, format.ext);
    token[201] = flex(format.uint32, format.ext);
    token[202] = format.float32;
    token[203] = format.float64;
    token[204] = format.uint8;
    token[205] = format.uint16;
    token[206] = format.uint32;
    token[207] = format.uint64;
    token[208] = format.int8;
    token[209] = format.int16;
    token[210] = format.int32;
    token[211] = format.int64;
    token[212] = fix(1, format.ext);
    token[213] = fix(2, format.ext);
    token[214] = fix(4, format.ext);
    token[215] = fix(8, format.ext);
    token[216] = fix(16, format.ext);
    token[217] = flex(format.uint8, format.str);
    token[218] = flex(format.uint16, format.str);
    token[219] = flex(format.uint32, format.str);
    token[220] = flex(format.uint16, format.array);
    token[221] = flex(format.uint32, format.array);
    token[222] = flex(format.uint16, format.map);
    token[223] = flex(format.uint32, format.map);
    for (i = 224;i <= 255; i++) {
      token[i] = constant(i - 256);
    }
    return token;
  }
  function init_useraw(format) {
    var i;
    var token = init_token(format).slice();
    token[217] = token[196];
    token[218] = token[197];
    token[219] = token[198];
    for (i = 160;i <= 191; i++) {
      token[i] = fix(i - 160, format.bin);
    }
    return token;
  }
  function constant(value) {
    return function() {
      return value;
    };
  }
  function flex(lenFunc, decodeFunc) {
    return function(decoder) {
      var len = lenFunc(decoder);
      return decodeFunc(decoder, len);
    };
  }
  function fix(len, method) {
    return function(decoder) {
      return method(decoder, len);
    };
  }
});

// node_modules/msgpack-lite/lib/read-core.js
var require_read_core = __commonJS((exports) => {
  var ExtBuffer = require_ext_buffer().ExtBuffer;
  var ExtUnpacker = require_ext_unpacker();
  var readUint8 = require_read_format().readUint8;
  var ReadToken = require_read_token();
  var CodecBase = require_codec_base();
  CodecBase.install({
    addExtUnpacker,
    getExtUnpacker,
    init
  });
  exports.preset = init.call(CodecBase.preset);
  function getDecoder(options) {
    var readToken = ReadToken.getReadToken(options);
    return decode;
    function decode(decoder) {
      var type = readUint8(decoder);
      var func = readToken[type];
      if (!func)
        throw new Error("Invalid type: " + (type ? "0x" + type.toString(16) : type));
      return func(decoder);
    }
  }
  function init() {
    var options = this.options;
    this.decode = getDecoder(options);
    if (options && options.preset) {
      ExtUnpacker.setExtUnpackers(this);
    }
    return this;
  }
  function addExtUnpacker(etype, unpacker) {
    var unpackers = this.extUnpackers || (this.extUnpackers = []);
    unpackers[etype] = CodecBase.filter(unpacker);
  }
  function getExtUnpacker(type) {
    var unpackers = this.extUnpackers || (this.extUnpackers = []);
    return unpackers[type] || extUnpacker;
    function extUnpacker(buffer) {
      return new ExtBuffer(buffer, type);
    }
  }
});

// node_modules/msgpack-lite/lib/decode-buffer.js
var require_decode_buffer = __commonJS((exports) => {
  exports.DecodeBuffer = DecodeBuffer;
  var preset = require_read_core().preset;
  var FlexDecoder = require_flex_buffer().FlexDecoder;
  FlexDecoder.mixin(DecodeBuffer.prototype);
  function DecodeBuffer(options) {
    if (!(this instanceof DecodeBuffer))
      return new DecodeBuffer(options);
    if (options) {
      this.options = options;
      if (options.codec) {
        var codec = this.codec = options.codec;
        if (codec.bufferish)
          this.bufferish = codec.bufferish;
      }
    }
  }
  DecodeBuffer.prototype.codec = preset;
  DecodeBuffer.prototype.fetch = function() {
    return this.codec.decode(this);
  };
});

// node_modules/msgpack-lite/lib/decode.js
var require_decode = __commonJS((exports) => {
  exports.decode = decode;
  var DecodeBuffer = require_decode_buffer().DecodeBuffer;
  function decode(input, options) {
    var decoder = new DecodeBuffer(options);
    decoder.write(input);
    return decoder.read();
  }
});

// node_modules/event-lite/event-lite.js
var require_event_lite = __commonJS((exports, module) => {
  function EventLite() {
    if (!(this instanceof EventLite))
      return new EventLite;
  }
  (function(EventLite2) {
    if (typeof module !== "undefined")
      module.exports = EventLite2;
    var LISTENERS = "listeners";
    var methods = {
      on,
      once,
      off,
      emit
    };
    mixin(EventLite2.prototype);
    EventLite2.mixin = mixin;
    function mixin(target) {
      for (var key in methods) {
        target[key] = methods[key];
      }
      return target;
    }
    function on(type, func) {
      getListeners(this, type).push(func);
      return this;
    }
    function once(type, func) {
      var that = this;
      wrap.originalListener = func;
      getListeners(that, type).push(wrap);
      return that;
      function wrap() {
        off.call(that, type, wrap);
        func.apply(this, arguments);
      }
    }
    function off(type, func) {
      var that = this;
      var listners;
      if (!arguments.length) {
        delete that[LISTENERS];
      } else if (!func) {
        listners = that[LISTENERS];
        if (listners) {
          delete listners[type];
          if (!Object.keys(listners).length)
            return off.call(that);
        }
      } else {
        listners = getListeners(that, type, true);
        if (listners) {
          listners = listners.filter(ne);
          if (!listners.length)
            return off.call(that, type);
          that[LISTENERS][type] = listners;
        }
      }
      return that;
      function ne(test) {
        return test !== func && test.originalListener !== func;
      }
    }
    function emit(type, value) {
      var that = this;
      var listeners = getListeners(that, type, true);
      if (!listeners)
        return false;
      var arglen = arguments.length;
      if (arglen === 1) {
        listeners.forEach(zeroarg);
      } else if (arglen === 2) {
        listeners.forEach(onearg);
      } else {
        var args = Array.prototype.slice.call(arguments, 1);
        listeners.forEach(moreargs);
      }
      return !!listeners.length;
      function zeroarg(func) {
        func.call(that);
      }
      function onearg(func) {
        func.call(that, value);
      }
      function moreargs(func) {
        func.apply(that, args);
      }
    }
    function getListeners(that, type, readonly) {
      if (readonly && !that[LISTENERS])
        return;
      var listeners = that[LISTENERS] || (that[LISTENERS] = {});
      return listeners[type] || (listeners[type] = []);
    }
  })(EventLite);
});

// node_modules/msgpack-lite/lib/encoder.js
var require_encoder = __commonJS((exports) => {
  exports.Encoder = Encoder;
  var EventLite = require_event_lite();
  var EncodeBuffer = require_encode_buffer().EncodeBuffer;
  function Encoder(options) {
    if (!(this instanceof Encoder))
      return new Encoder(options);
    EncodeBuffer.call(this, options);
  }
  Encoder.prototype = new EncodeBuffer;
  EventLite.mixin(Encoder.prototype);
  Encoder.prototype.encode = function(chunk) {
    this.write(chunk);
    this.emit("data", this.read());
  };
  Encoder.prototype.end = function(chunk) {
    if (arguments.length)
      this.encode(chunk);
    this.flush();
    this.emit("end");
  };
});

// node_modules/msgpack-lite/lib/decoder.js
var require_decoder = __commonJS((exports) => {
  exports.Decoder = Decoder;
  var EventLite = require_event_lite();
  var DecodeBuffer = require_decode_buffer().DecodeBuffer;
  function Decoder(options) {
    if (!(this instanceof Decoder))
      return new Decoder(options);
    DecodeBuffer.call(this, options);
  }
  Decoder.prototype = new DecodeBuffer;
  EventLite.mixin(Decoder.prototype);
  Decoder.prototype.decode = function(chunk) {
    if (arguments.length)
      this.write(chunk);
    this.flush();
  };
  Decoder.prototype.push = function(chunk) {
    this.emit("data", chunk);
  };
  Decoder.prototype.end = function(chunk) {
    this.decode(chunk);
    this.emit("end");
  };
});

// node_modules/msgpack-lite/lib/ext.js
var require_ext = __commonJS((exports) => {
  require_read_core();
  require_write_core();
  exports.createCodec = require_codec_base().createCodec;
});

// node_modules/msgpack-lite/lib/codec.js
var require_codec = __commonJS((exports) => {
  require_read_core();
  require_write_core();
  exports.codec = {
    preset: require_codec_base().preset
  };
});

// node_modules/msgpack-lite/lib/browser.js
var require_browser = __commonJS((exports) => {
  exports.encode = require_encode().encode;
  exports.decode = require_decode().decode;
  exports.Encoder = require_encoder().Encoder;
  exports.Decoder = require_decoder().Decoder;
  exports.createCodec = require_ext().createCodec;
  exports.codec = require_codec().codec;
});

// bundle/src/js/libs/utils.js
var require_utils = __commonJS((exports, module) => {
  var mathABS = Math.abs;
  var mathSQRT = Math.sqrt;
  var mathABS = Math.abs;
  var mathATAN2 = Math.atan2;
  var mathPI = Math.PI;
  exports.randInt = function(min2, max) {
    return Math.floor(Math.random() * (max - min2 + 1)) + min2;
  };
  exports.randFloat = function(min2, max) {
    return Math.random() * (max - min2 + 1) + min2;
  };
  exports.lerp = function(value1, value2, amount) {
    return value1 + (value2 - value1) * amount;
  };
  exports.decel = function(val, cel) {
    if (val > 0)
      val = Math.max(0, val - cel);
    else if (val < 0)
      val = Math.min(0, val + cel);
    return val;
  };
  exports.getDistance = function(x1, y1, x2, y2) {
    return mathSQRT((x2 -= x1) * x2 + (y2 -= y1) * y2);
  };
  exports.getDirection = function(x1, y1, x2, y2) {
    return mathATAN2(y1 - y2, x1 - x2);
  };
  exports.dist = function(obj1, obj2, useAlt) {
    const x1 = useAlt && obj1.x3 !== undefined ? obj1.x3 : obj1.x2 !== undefined ? obj1.x2 : obj1.x;
    const y1 = useAlt && obj1.y3 !== undefined ? obj1.y3 : obj1.y2 !== undefined ? obj1.y2 : obj1.y;
    const x2 = useAlt && obj2.x3 !== undefined ? obj2.x3 : obj2.x2 !== undefined ? obj2.x2 : obj2.x;
    const y2 = useAlt && obj2.y3 !== undefined ? obj2.y3 : obj2.y2 !== undefined ? obj2.y2 : obj2.y;
    return mathSQRT((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  };
  exports.dir = function(obj1, obj2, useAlt) {
    const x1 = useAlt && obj1.x3 !== undefined ? obj1.x3 : obj1.x2 !== undefined ? obj1.x2 : obj1.x;
    const y1 = useAlt && obj1.y3 !== undefined ? obj1.y3 : obj1.y2 !== undefined ? obj1.y2 : obj1.y;
    const x2 = useAlt && obj2.x3 !== undefined ? obj2.x3 : obj2.x2 !== undefined ? obj2.x2 : obj2.x;
    const y2 = useAlt && obj2.y3 !== undefined ? obj2.y3 : obj2.y2 !== undefined ? obj2.y2 : obj2.y;
    return mathATAN2(y2 - y1, x2 - x1);
  };
  exports.getAngleDist = function(a, b2) {
    var p2 = mathABS(b2 - a) % (mathPI * 2);
    return p2 > mathPI ? mathPI * 2 - p2 : p2;
  };
  exports.isNumber = function(n) {
    return typeof n == "number" && !isNaN(n) && isFinite(n);
  };
  exports.isString = function(s) {
    return s && typeof s == "string";
  };
  exports.kFormat = function(num) {
    return num > 999 ? (num / 1000).toFixed(1) + "k" : num;
  };
  exports.capitalizeFirst = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  exports.fixTo = function(n, v) {
    return parseFloat(n.toFixed(v));
  };
  exports.sortByPoints = function(a, b2) {
    return parseFloat(b2.points) - parseFloat(a.points);
  };
  exports.lineInRect = function(recX, recY, recX2, recY2, x1, y1, x2, y2) {
    var minX = x1;
    var maxX = x2;
    if (x1 > x2) {
      minX = x2;
      maxX = x1;
    }
    if (maxX > recX2)
      maxX = recX2;
    if (minX < recX)
      minX = recX;
    if (minX > maxX)
      return false;
    var minY = y1;
    var maxY = y2;
    var dx = x2 - x1;
    if (Math.abs(dx) > 0.0000001) {
      var a = (y2 - y1) / dx;
      var b2 = y1 - a * x1;
      minY = a * minX + b2;
      maxY = a * maxX + b2;
    }
    if (minY > maxY) {
      var tmp = maxY;
      maxY = minY;
      minY = tmp;
    }
    if (maxY > recY2)
      maxY = recY2;
    if (minY < recY)
      minY = recY;
    if (minY > maxY)
      return false;
    return true;
  };
  exports.containsPoint = function(element, x, y) {
    var bounds = element.getBoundingClientRect();
    var left = bounds.left + window.scrollX;
    var top = bounds.top + window.scrollY;
    var width = bounds.width;
    var height = bounds.height;
    var insideHorizontal = x > left && x < left + width;
    var insideVertical = y > top && y < top + height;
    return insideHorizontal && insideVertical;
  };
  exports.mousifyTouchEvent = function(event) {
    var touch = event.changedTouches[0];
    event.screenX = touch.screenX;
    event.screenY = touch.screenY;
    event.clientX = touch.clientX;
    event.clientY = touch.clientY;
    event.pageX = touch.pageX;
    event.pageY = touch.pageY;
  };
  exports.hookTouchEvents = function(element, skipPrevent) {
    if (!element)
      return;
    var preventDefault = !skipPrevent;
    var isHovering = false;
    var passive = false;
    element.addEventListener("touchstart", exports.checkTrusted(touchStart), passive);
    element.addEventListener("touchmove", exports.checkTrusted(touchMove), passive);
    element.addEventListener("touchend", exports.checkTrusted(touchEnd), passive);
    element.addEventListener("touchcancel", exports.checkTrusted(touchEnd), passive);
    element.addEventListener("touchleave", exports.checkTrusted(touchEnd), passive);
    function touchStart(e) {
      exports.mousifyTouchEvent(e);
      window.setUsingTouch(true);
      if (preventDefault) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (element.onmouseover)
        element.onmouseover(e);
      isHovering = true;
    }
    function touchMove(e) {
      exports.mousifyTouchEvent(e);
      window.setUsingTouch(true);
      if (preventDefault) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (exports.containsPoint(element, e.pageX, e.pageY)) {
        if (!isHovering) {
          if (element.onmouseover)
            element.onmouseover(e);
          isHovering = true;
        }
      } else {
        if (isHovering) {
          if (element.onmouseout)
            element.onmouseout(e);
          isHovering = false;
        }
      }
    }
    function touchEnd(e) {
      exports.mousifyTouchEvent(e);
      window.setUsingTouch(true);
      if (preventDefault) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (isHovering) {
        if (element.onclick)
          element.onclick(e);
        if (element.onmouseout)
          element.onmouseout(e);
        isHovering = false;
      }
    }
  };
  exports.removeAllChildren = function(element) {
    while (element.hasChildNodes()) {
      element.removeChild(element.lastChild);
    }
  };
  exports.generateElement = function(config) {
    var element = document.createElement(config.tag || "div");
    function bind(configValue, elementValue) {
      if (config[configValue])
        element[elementValue] = config[configValue];
    }
    bind("text", "textContent");
    bind("html", "innerHTML");
    bind("class", "className");
    for (var key in config) {
      switch (key) {
        case "tag":
        case "text":
        case "html":
        case "class":
        case "style":
        case "hookTouch":
        case "parent":
        case "children":
          continue;
        default:
          break;
      }
      element[key] = config[key];
    }
    if (element.onclick)
      element.onclick = exports.checkTrusted(element.onclick);
    if (element.onmouseover)
      element.onmouseover = exports.checkTrusted(element.onmouseover);
    if (element.onmouseout)
      element.onmouseout = exports.checkTrusted(element.onmouseout);
    if (config.style) {
      element.style.cssText = config.style;
    }
    if (config.hookTouch) {
      exports.hookTouchEvents(element);
    }
    if (config.parent) {
      config.parent.appendChild(element);
    }
    if (config.children) {
      for (var i = 0;i < config.children.length; i++) {
        element.appendChild(config.children[i]);
      }
    }
    return element;
  };
  exports.eventIsTrusted = function(ev) {
    if (ev && typeof ev.isTrusted == "boolean") {
      return ev.isTrusted;
    } else {
      return true;
    }
  };
  exports.checkTrusted = function(callback) {
    return function(ev) {
      if (ev && ev instanceof Event && exports.eventIsTrusted(ev)) {
        callback(ev);
      } else {}
    };
  };
  exports.randomString = function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0;i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };
  exports.countInArray = function(array, val) {
    var count = 0;
    for (var i = 0;i < array.length; i++) {
      if (array[i] === val)
        count++;
    }
    return count;
  };
});

// bundle/src/js/libs/animText.js
var require_animText = __commonJS((exports, module) => {
  exports.AnimText = function() {
    this.init = function(x, y, scale, speed, life, text, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.scale = scale;
      this.startScale = this.scale;
      this.maxScale = scale * 1.5;
      this.scaleSpeed = 0.7;
      this.speed = speed;
      this.life = life;
      this.text = text;
    };
    this.update = function(delta) {
      if (this.life) {
        this.life -= delta;
        this.y -= this.speed * delta;
        this.scale += this.scaleSpeed * delta;
        if (this.scale >= this.maxScale) {
          this.scale = this.maxScale;
          this.scaleSpeed *= -1;
        } else if (this.scale <= this.startScale) {
          this.scale = this.startScale;
          this.scaleSpeed = 0;
        }
        if (this.life <= 0) {
          this.life = 0;
        }
      }
    };
    this.render = function(ctxt, xOff, yOff) {
      ctxt.font = this.scale + "px Hammersmith One";
      ctxt.lineWidth = 12;
      ctxt.lineJoin = "round";
      ctxt.strokeStyle = "#3d3f42";
      ctxt.strokeText(this.text, this.x - xOff, this.y - yOff);
      ctxt.fillStyle = this.color;
      ctxt.fillText(this.text, this.x - xOff, this.y - yOff);
    };
  };
  exports.TextManager = function() {
    this.texts = [];
    this.damageGroups = [];
    this.groupRadius = 50;
    this.groupLifetime = 30;
    this.update = function(delta, ctxt, xOff, yOff) {
      ctxt.textBaseline = "middle";
      ctxt.textAlign = "center";
      var now = typeof performance !== "undefined" ? performance.now() : Date.now();
      for (var i = this.damageGroups.length - 1;i >= 0; i--) {
        var g = this.damageGroups[i];
        if (now - g.time > this.groupLifetime) {
          this.showText(g.x, g.y, g.scale, g.speed, g.life, g.total, g.color);
          this.damageGroups.splice(i, 1);
        }
      }
      for (var i = 0;i < this.texts.length; ++i) {
        if (this.texts[i].life) {
          this.texts[i].update(delta);
          this.texts[i].render(ctxt, xOff, yOff);
        }
      }
    };
    this.addDamage = function(x, y, dmg, scale, speed, life, color) {
      var now = typeof performance !== "undefined" ? performance.now() : Date.now();
      var bestGroup = null;
      var bestDist = Infinity;
      for (var i = 0;i < this.damageGroups.length; i++) {
        var g = this.damageGroups[i];
        if (now - g.time > this.groupLifetime)
          continue;
        var dx = g.x - x;
        var dy = g.y - y;
        var distSq = dx * dx + dy * dy;
        if (distSq < this.groupRadius * this.groupRadius && distSq < bestDist) {
          bestGroup = g;
          bestDist = distSq;
        }
      }
      if (!bestGroup) {
        bestGroup = {
          x,
          y,
          total: 0,
          scale,
          speed,
          life,
          color,
          time: now
        };
        this.damageGroups.push(bestGroup);
      }
      bestGroup.total += dmg;
      bestGroup.x = bestGroup.x * 0.7 + x * 0.3;
      bestGroup.y = bestGroup.y * 0.7 + y * 0.3;
      bestGroup.time = now;
    };
    this.showText = function(x, y, scale, speed, life, text, color) {
      var tmpText;
      for (var i = 0;i < this.texts.length; ++i) {
        if (!this.texts[i].life) {
          tmpText = this.texts[i];
          break;
        }
      }
      if (!tmpText) {
        tmpText = new exports.AnimText;
        this.texts.push(tmpText);
      }
      tmpText.init(x, y, scale, speed, life, text, color);
    };
  };
});

// bundle/src/js/data/gameObject.js
var require_gameObject = __commonJS((exports, module) => {
  module.exports = function(sid) {
    this.sid = sid;
    this.init = function(x, y, dir, scale, type, data, owner) {
      data = data || {};
      this.sentTo = {};
      this.gridLocations = [];
      this.active = true;
      this.doUpdate = data.doUpdate;
      this.x = x;
      this.y = y;
      this.dir = dir;
      this.xWiggle = 0;
      this.yWiggle = 0;
      this.scale = scale;
      this.type = type;
      this.id = data.id;
      this.owner = owner;
      this.name = data.name;
      this.isItem = this.id != null;
      this.group = data.group;
      this.health = data.health;
      this.maxHealth = this.health;
      this.layer = 2;
      if (this.group != null) {
        this.layer = this.group.layer;
      } else if (this.type == 0) {
        this.layer = 3;
      } else if (this.type == 2) {
        this.layer = 0;
      } else if (this.type == 4) {
        this.layer = -1;
      }
      this.colDiv = data.colDiv || 1;
      this.blocker = data.blocker;
      this.ignoreCollision = data.ignoreCollision;
      this.dontGather = data.dontGather;
      this.hideFromEnemy = data.hideFromEnemy;
      this.friction = data.friction;
      this.projDmg = data.projDmg;
      this.dmg = this.type === 1 && this.y >= 14400 - 2400 ? 35 : data.dmg;
      this.pDmg = data.pDmg;
      this.pps = data.pps;
      this.zIndex = data.zIndex || 0;
      this.turnSpeed = data.turnSpeed;
      this.req = data.req;
      this.trap = data.trap;
      this.healCol = data.healCol;
      this.teleport = data.teleport;
      this.boostSpeed = data.boostSpeed;
      this.projectile = data.projectile;
      this.shootRange = data.shootRange;
      this.shootRate = data.shootRate;
      this.shootCount = this.shootRate;
      this.spawnPoint = data.spawnPoint;
      let keys = Object.keys(this);
      for (let key of keys)
        if (this[key] === undefined)
          delete this[key];
    };
    this.changeHealth = function(amount, doer) {
      this.health += amount;
      return this.health <= 0;
    };
    this.getScale = function(sM, ig) {
      sM = sM || 1;
      return this.scale * (this.isItem || this.type == 2 || this.type == 3 || this.type == 4 ? 1 : 0.6 * sM) * (ig ? 1 : this.colDiv);
    };
    this.visibleToPlayer = function(player) {
      return true;
    };
    this.update = function(delta) {
      if (this.active) {
        if (this.xWiggle) {
          this.xWiggle *= Math.pow(0.99, delta);
        }
        if (this.yWiggle) {
          this.yWiggle *= Math.pow(0.99, delta);
        }
        if (this.turnSpeed) {
          this.dir += this.turnSpeed * delta;
        }
      }
    };
  };
});

// bundle/src/js/data/items.js
var require_items = __commonJS((exports, module) => {
  exports.groups = [{
    id: 0,
    name: "food",
    layer: 0
  }, {
    id: 1,
    name: "walls",
    place: true,
    limit: 30,
    layer: 0
  }, {
    id: 2,
    name: "spikes",
    place: true,
    limit: 15,
    layer: 0
  }, {
    id: 3,
    name: "mill",
    place: true,
    limit: 7,
    layer: 1
  }, {
    id: 4,
    name: "mine",
    place: true,
    limit: 1,
    layer: 0
  }, {
    id: 5,
    name: "trap",
    place: true,
    limit: 6,
    layer: -1
  }, {
    id: 6,
    name: "booster",
    place: true,
    limit: 12,
    layer: -1
  }, {
    id: 7,
    name: "turret",
    place: true,
    limit: 2,
    layer: 1
  }, {
    id: 8,
    name: "watchtower",
    place: true,
    limit: 12,
    layer: 1
  }, {
    id: 9,
    name: "buff",
    place: true,
    limit: 4,
    layer: -1
  }, {
    id: 10,
    name: "spawn",
    place: true,
    limit: 1,
    layer: -1
  }, {
    id: 11,
    name: "sapling",
    place: true,
    limit: 2,
    layer: 0
  }, {
    id: 12,
    name: "blocker",
    place: true,
    limit: 3,
    layer: -1
  }, {
    id: 13,
    name: "teleporter",
    place: true,
    limit: 2,
    layer: -1
  }];
  exports.projectiles = [{
    name: "hunting bow",
    indx: 0,
    layer: 0,
    src: "arrow_1",
    dmg: 25,
    speed: 1.6,
    scale: 103,
    range: 1000,
    tick: [35, 212.78, 390.56, 568.33, 746.11]
  }, {
    name: "turret hat",
    indx: 1,
    layer: 1,
    speed: 1.5,
    range: 700,
    dmg: 25,
    scale: 20,
    tick: [35, 201.67, 368.33, 535, 700]
  }, {
    name: "crossbow",
    indx: 0,
    layer: 0,
    src: "arrow_1",
    dmg: 35,
    speed: 2.5,
    scale: 103,
    range: 1200,
    tick: [35, 312.78, 590.56, 868.33, 1146.11]
  }, {
    name: "repeater crossbow",
    indx: 0,
    layer: 0,
    src: "arrow_1",
    dmg: 30,
    speed: 2,
    scale: 103,
    range: 1200,
    tick: [35, 257.22, 479.44, 701.67, 923.89]
  }, {
    indx: 1,
    layer: 1,
    dmg: 16,
    scale: 20
  }, {
    name: "musket",
    indx: 0,
    layer: 0,
    src: "bullet_1",
    dmg: 50,
    speed: 3.6,
    scale: 160,
    range: 1400,
    tick: [35, 435, 835, 1235, 1400]
  }];
  for (let projectile of exports.projectiles) {
    const step = projectile.speed * (1000 / 9);
    projectile.range = projectile.range + step;
  }
  exports.weapons = [{
    id: 0,
    type: 0,
    name: "tool hammer",
    desc: "tool for gathering all resources",
    src: "hammer_1",
    length: 140,
    width: 140,
    xOff: -3,
    yOff: 18,
    dmg: 25,
    range: 65,
    gather: 1,
    speed: 300
  }, {
    id: 1,
    type: 0,
    age: 2,
    name: "hand axe",
    desc: "gathers resources at a higher rate",
    src: "axe_1",
    length: 140,
    width: 140,
    xOff: 3,
    yOff: 24,
    dmg: 30,
    spdMult: 1,
    range: 70,
    gather: 2,
    speed: 400
  }, {
    id: 2,
    type: 0,
    age: 8,
    pre: 1,
    name: "great axe",
    desc: "deal more damage and gather more resources",
    src: "great_axe_1",
    length: 140,
    width: 140,
    xOff: -8,
    yOff: 25,
    dmg: 35,
    spdMult: 1,
    range: 75,
    gather: 4,
    speed: 400
  }, {
    id: 3,
    type: 0,
    age: 2,
    name: "short sword",
    desc: "increased attack power but slower move speed",
    src: "sword_1",
    iPad: 1.3,
    length: 130,
    width: 210,
    xOff: -8,
    yOff: 46,
    dmg: 35,
    spdMult: 0.85,
    range: 110,
    gather: 1,
    speed: 300
  }, {
    id: 4,
    type: 0,
    age: 8,
    pre: 3,
    name: "katana",
    desc: "greater range and damage",
    src: "samurai_1",
    iPad: 1.3,
    length: 130,
    width: 210,
    xOff: -8,
    yOff: 59,
    dmg: 40,
    spdMult: 0.8,
    range: 118,
    gather: 1,
    speed: 300
  }, {
    id: 5,
    type: 0,
    age: 2,
    name: "polearm",
    desc: "long range melee weapon",
    src: "spear_1",
    iPad: 1.3,
    length: 130,
    width: 210,
    xOff: -8,
    yOff: 53,
    dmg: 45,
    knock: 0.2,
    spdMult: 0.82,
    range: 142,
    gather: 1,
    speed: 700
  }, {
    id: 6,
    type: 0,
    age: 2,
    name: "bat",
    desc: "fast long range melee weapon",
    src: "bat_1",
    iPad: 1.3,
    length: 110,
    width: 180,
    xOff: -8,
    yOff: 53,
    dmg: 20,
    knock: 0.7,
    range: 110,
    gather: 1,
    speed: 300
  }, {
    id: 7,
    type: 0,
    age: 2,
    name: "daggers",
    desc: "really fast short range weapon",
    src: "dagger_1",
    iPad: 0.8,
    length: 110,
    width: 110,
    xOff: 18,
    yOff: 0,
    dmg: 20,
    knock: 0.1,
    range: 65,
    gather: 1,
    hitSlow: 0.1,
    spdMult: 1.13,
    speed: 100
  }, {
    id: 8,
    type: 0,
    age: 2,
    name: "stick",
    desc: "great for gathering but very weak",
    src: "stick_1",
    length: 140,
    width: 140,
    xOff: 3,
    yOff: 24,
    dmg: 1,
    spdMult: 1,
    range: 70,
    gather: 7,
    speed: 400
  }, {
    id: 9,
    type: 1,
    age: 6,
    name: "hunting bow",
    desc: "bow used for ranged combat and hunting",
    src: "bow_1",
    req: ["wood", 4],
    length: 120,
    width: 120,
    xOff: -6,
    yOff: 0,
    projectile: 0,
    spdMult: 0.75,
    speed: 600
  }, {
    id: 10,
    type: 1,
    age: 6,
    name: "great hammer",
    desc: "hammer used for destroying structures",
    src: "great_hammer_1",
    length: 140,
    width: 140,
    xOff: -9,
    yOff: 25,
    dmg: 10,
    spdMult: 0.88,
    range: 75,
    sDmg: 7.5,
    gather: 1,
    speed: 400
  }, {
    id: 11,
    type: 1,
    age: 6,
    name: "wooden shield",
    desc: "blocks projectiles and reduces melee damage",
    src: "shield_1",
    length: 120,
    width: 120,
    shield: 0.2,
    xOff: 6,
    yOff: 0,
    spdMult: 0.7
  }, {
    id: 12,
    type: 1,
    age: 8,
    pre: 9,
    name: "crossbow",
    desc: "deals more damage and has greater range",
    src: "crossbow_1",
    req: ["wood", 5],
    aboveHand: true,
    armS: 0.75,
    length: 120,
    width: 120,
    xOff: -4,
    yOff: 0,
    projectile: 2,
    spdMult: 0.7,
    speed: 700
  }, {
    id: 13,
    type: 1,
    age: 9,
    pre: 12,
    name: "repeater crossbow",
    desc: "high firerate crossbow with reduced damage",
    src: "crossbow_2",
    req: ["wood", 10],
    aboveHand: true,
    armS: 0.75,
    length: 120,
    width: 120,
    xOff: -4,
    yOff: 0,
    projectile: 3,
    spdMult: 0.7,
    speed: 230
  }, {
    id: 14,
    type: 1,
    age: 6,
    name: "mc grabby",
    desc: "steals resources from enemies",
    src: "grab_1",
    length: 130,
    width: 210,
    xOff: -8,
    yOff: 53,
    dmg: 0,
    steal: 250,
    knock: 0.2,
    spdMult: 1.05,
    range: 125,
    gather: 0,
    speed: 700
  }, {
    id: 15,
    type: 1,
    age: 9,
    pre: 12,
    name: "musket",
    desc: "slow firerate but high damage and range",
    src: "musket_1",
    req: ["stone", 10],
    aboveHand: true,
    rec: 0.35,
    armS: 0.6,
    hndS: 0.3,
    hndD: 1.6,
    length: 205,
    width: 205,
    xOff: 25,
    yOff: 0,
    projectile: 5,
    hideProjectile: true,
    spdMult: 0.6,
    speed: 1500
  }];
  exports.list = [{
    group: exports.groups[0],
    name: "apple",
    desc: "restores 20 health when consumed",
    req: ["food", 10],
    consume: function(doer) {
      return doer.changeHealth(20, doer);
    },
    scale: 22,
    holdOffset: 15
  }, {
    age: 3,
    group: exports.groups[0],
    name: "cookie",
    desc: "restores 40 health when consumed",
    req: ["food", 15],
    consume: function(doer) {
      return doer.changeHealth(40, doer);
    },
    scale: 27,
    holdOffset: 15
  }, {
    age: 7,
    group: exports.groups[0],
    name: "cheese",
    desc: "restores 30 health and another 50 over 5 seconds",
    req: ["food", 25],
    consume: function(doer) {
      if (doer.changeHealth(30, doer) || doer.health < 100) {
        doer.dmgOverTime.dmg = -10;
        doer.dmgOverTime.doer = doer;
        doer.dmgOverTime.time = 5;
        return true;
      }
      return false;
    },
    scale: 27,
    holdOffset: 15
  }, {
    group: exports.groups[1],
    name: "wood wall",
    desc: "provides protection for your village",
    req: ["wood", 10],
    projDmg: true,
    health: 380,
    scale: 50,
    holdOffset: 20,
    placeOffset: -5
  }, {
    age: 3,
    group: exports.groups[1],
    name: "stone wall",
    desc: "provides improved protection for your village",
    req: ["stone", 25],
    health: 900,
    scale: 50,
    holdOffset: 20,
    placeOffset: -5
  }, {
    age: 7,
    pre: 1,
    group: exports.groups[1],
    name: "castle wall",
    desc: "provides powerful protection for your village",
    req: ["stone", 35],
    health: 1500,
    scale: 52,
    holdOffset: 20,
    placeOffset: -5
  }, {
    group: exports.groups[2],
    name: "spikes",
    desc: "damages enemies when they touch them",
    req: ["wood", 20, "stone", 5],
    health: 400,
    dmg: 20,
    scale: 49,
    spritePadding: -23,
    holdOffset: 8,
    placeOffset: -5
  }, {
    age: 5,
    group: exports.groups[2],
    name: "greater spikes",
    desc: "damages enemies when they touch them",
    req: ["wood", 30, "stone", 10],
    health: 500,
    dmg: 35,
    scale: 52,
    spritePadding: -23,
    holdOffset: 8,
    placeOffset: -5
  }, {
    age: 9,
    group: exports.groups[2],
    name: "poison spikes",
    desc: "poisons enemies when they touch them",
    req: ["wood", 35, "stone", 15],
    health: 600,
    dmg: 30,
    pDmg: 5,
    scale: 52,
    spritePadding: -23,
    holdOffset: 8,
    placeOffset: -5
  }, {
    age: 9,
    group: exports.groups[2],
    name: "spinning spikes",
    desc: "damages enemies when they touch them",
    req: ["wood", 30, "stone", 20],
    health: 500,
    dmg: 45,
    turnSpeed: 0.003,
    scale: 52,
    spritePadding: -23,
    holdOffset: 8,
    placeOffset: -5
  }, {
    group: exports.groups[3],
    name: "windmill",
    desc: "generates gold over time",
    req: ["wood", 50, "stone", 10],
    health: 400,
    pps: 1,
    turnSpeed: 0.0016,
    spritePadding: 25,
    iconLineMult: 12,
    scale: 45,
    holdOffset: 20,
    placeOffset: 5
  }, {
    age: 5,
    group: exports.groups[3],
    name: "faster windmill",
    desc: "generates more gold over time",
    req: ["wood", 60, "stone", 20],
    health: 500,
    pps: 1.5,
    turnSpeed: 0.0025,
    spritePadding: 25,
    iconLineMult: 12,
    scale: 47,
    holdOffset: 20,
    placeOffset: 5
  }, {
    age: 8,
    group: exports.groups[3],
    name: "power mill",
    desc: "generates more gold over time",
    req: ["wood", 100, "stone", 50],
    health: 800,
    pps: 2,
    turnSpeed: 0.005,
    spritePadding: 25,
    iconLineMult: 12,
    scale: 47,
    holdOffset: 20,
    placeOffset: 5
  }, {
    age: 5,
    group: exports.groups[4],
    type: 2,
    name: "mine",
    desc: "allows you to mine stone",
    req: ["wood", 20, "stone", 100],
    iconLineMult: 12,
    scale: 65,
    holdOffset: 20,
    placeOffset: 0
  }, {
    age: 5,
    group: exports.groups[11],
    type: 0,
    name: "sapling",
    desc: "allows you to farm wood",
    req: ["wood", 150],
    iconLineMult: 12,
    colDiv: 0.5,
    scale: 110,
    holdOffset: 50,
    placeOffset: -15
  }, {
    age: 4,
    group: exports.groups[5],
    name: "pit trap",
    desc: "pit that traps enemies if they walk over it",
    req: ["wood", 30, "stone", 30],
    trap: true,
    ignoreCollision: true,
    hideFromEnemy: true,
    health: 500,
    colDiv: 0.2,
    scale: 50,
    holdOffset: 20,
    placeOffset: -5
  }, {
    age: 4,
    group: exports.groups[6],
    name: "boost pad",
    desc: "provides boost when stepped on",
    req: ["stone", 20, "wood", 5],
    ignoreCollision: true,
    boostSpeed: 1.5,
    health: 150,
    colDiv: 0.7,
    scale: 45,
    holdOffset: 20,
    placeOffset: -5
  }, {
    age: 7,
    group: exports.groups[7],
    doUpdate: true,
    name: "turret",
    desc: "defensive structure that shoots at enemies",
    req: ["wood", 200, "stone", 150],
    health: 800,
    projectile: 1,
    shootRange: 700,
    shootRate: 2200,
    scale: 43,
    holdOffset: 20,
    placeOffset: -5
  }, {
    age: 7,
    group: exports.groups[8],
    name: "platform",
    desc: "platform to shoot over walls and cross over water",
    req: ["wood", 20],
    ignoreCollision: true,
    zIndex: 1,
    health: 300,
    scale: 43,
    holdOffset: 20,
    placeOffset: -5
  }, {
    age: 7,
    group: exports.groups[9],
    name: "healing pad",
    desc: "standing on it will slowly heal you",
    req: ["wood", 30, "food", 10],
    ignoreCollision: true,
    healCol: 15,
    health: 400,
    colDiv: 0.7,
    scale: 45,
    holdOffset: 20,
    placeOffset: -5
  }, {
    age: 9,
    group: exports.groups[10],
    name: "spawn pad",
    desc: "you will spawn here when you die but it will dissapear",
    req: ["wood", 100, "stone", 100],
    health: 400,
    ignoreCollision: true,
    spawnPoint: true,
    scale: 45,
    holdOffset: 20,
    placeOffset: -5
  }, {
    age: 7,
    group: exports.groups[12],
    name: "blocker",
    desc: "blocks building in radius",
    req: ["wood", 30, "stone", 25],
    ignoreCollision: true,
    blocker: 300,
    health: 400,
    colDiv: 0.7,
    scale: 45,
    holdOffset: 20,
    placeOffset: -5
  }, {
    age: 7,
    group: exports.groups[13],
    name: "teleporter",
    desc: "teleports you to a random point on the map",
    req: ["wood", 60, "stone", 60],
    ignoreCollision: true,
    teleport: true,
    health: 200,
    colDiv: 0.7,
    scale: 45,
    holdOffset: 20,
    placeOffset: -5
  }];
  function gap(item) {
    const safetyMargin = 0.0000000001;
    const threshold = item.scale * 2 + safetyMargin;
    const distance = 35 + item.scale + (item.placeOffset || 0);
    const angleGap = 2 * Math.asin(threshold / (2 * distance));
    return angleGap;
  }
  for (i = 0;i < exports.list.length; ++i) {
    if (exports.list[i].scale)
      exports.list[i].gap = gap(exports.list[i]);
    exports.list[i].id = i;
    if (exports.list[i].pre)
      exports.list[i].pre = i - exports.list[i].pre;
  }
  var i;
});

// bundle/src/js/data/objectManager.js
var require_objectManager = __commonJS((exports, module) => {
  var mathFloor = Math.floor;
  var mathABS = Math.abs;
  var mathCOS = Math.cos;
  var mathSIN = Math.sin;
  var mathSQRT = Math.sqrt;
  module.exports = function(GameObject, gameObjects, UTILS, config, players, server) {
    this.objects = gameObjects;
    this.grids = {};
    this.updateObjects = [];
    this.hitObj = [];
    const tmpS = config.mapScale / config.colGrid;
    const mapScale2 = config.mapScale;
    const riverMin = (mapScale2 >> 1) - (config.riverWidth >> 1);
    const riverMax = (mapScale2 >> 1) + (config.riverWidth >> 1);
    this.setObjectGrids = function(obj) {
      const objX = Math.min(mapScale2, Math.max(0, obj.x));
      const objY = Math.min(mapScale2, Math.max(0, obj.y));
      const scale = obj.scale;
      const minX = Math.max(0, mathFloor((objX - scale) / tmpS));
      const maxX = Math.min(config.colGrid - 1, mathFloor((objX + scale) / tmpS));
      const minY = Math.max(0, mathFloor((objY - scale) / tmpS));
      const maxY = Math.min(config.colGrid - 1, mathFloor((objY + scale) / tmpS));
      for (let x = minX;x <= maxX; ++x) {
        for (let y = minY;y <= maxY; ++y) {
          const key = x + "_" + y;
          (this.grids[key] || (this.grids[key] = [])).push(obj);
          obj.gridLocations.push(key);
        }
      }
    };
    this.removeObjGrid = function(obj) {
      const gridLocs = obj.gridLocations;
      for (let i = 0, len = gridLocs.length;i < len; ++i) {
        const grid = this.grids[gridLocs[i]];
        const idx = grid.indexOf(obj);
        if (idx >= 0)
          grid.splice(idx, 1);
      }
    };
    this.disableObj = function(obj) {
      obj.active = false;
      if (obj.owner && obj.pps)
        obj.owner.pps -= obj.pps;
      this.removeObjGrid(obj);
      const idx = this.updateObjects.indexOf(obj);
      if (idx >= 0)
        this.updateObjects.splice(idx, 1);
    };
    const tmpArray = [];
    this.getGridArrays = function(xPos, yPos, s) {
      const tmpX = mathFloor(xPos / tmpS);
      const tmpY = mathFloor(yPos / tmpS);
      tmpArray.length = 0;
      const grids = this.grids;
      let grid;
      if (grid = grids[tmpX + "_" + tmpY])
        tmpArray.push(grid);
      const rightEdge = xPos + s >= (tmpX + 1) * tmpS;
      const leftEdge = tmpX && xPos - s <= tmpX * tmpS;
      const bottomEdge = yPos + s >= (tmpY + 1) * tmpS;
      const topEdge = tmpY && yPos - s <= tmpY * tmpS;
      if (rightEdge) {
        if (grid = grids[tmpX + 1 + "_" + tmpY])
          tmpArray.push(grid);
        if (topEdge) {
          if (grid = grids[tmpX + 1 + "_" + (tmpY - 1)])
            tmpArray.push(grid);
        } else if (bottomEdge) {
          if (grid = grids[tmpX + 1 + "_" + (tmpY + 1)])
            tmpArray.push(grid);
        }
      }
      if (leftEdge) {
        if (grid = grids[tmpX - 1 + "_" + tmpY])
          tmpArray.push(grid);
        if (topEdge) {
          if (grid = grids[tmpX - 1 + "_" + (tmpY - 1)])
            tmpArray.push(grid);
        } else if (bottomEdge) {
          if (grid = grids[tmpX - 1 + "_" + (tmpY + 1)])
            tmpArray.push(grid);
        }
      }
      if (bottomEdge && (grid = grids[tmpX + "_" + (tmpY + 1)]))
        tmpArray.push(grid);
      if (topEdge && (grid = grids[tmpX + "_" + (tmpY - 1)]))
        tmpArray.push(grid);
      return tmpArray;
    };
    this.add = function(sid, x, y, dir, s, type, data, setSID, owner, fake) {
      let tmpObj2 = null;
      for (let i = 0, len = gameObjects.length;i < len; ++i) {
        if (gameObjects[i].sid == sid) {
          tmpObj2 = gameObjects[i];
          break;
        }
      }
      if (!tmpObj2) {
        for (let i = 0, len = gameObjects.length;i < len; ++i) {
          if (!gameObjects[i].active) {
            tmpObj2 = gameObjects[i];
            break;
          }
        }
      }
      if (!tmpObj2) {
        tmpObj2 = new GameObject(sid);
        gameObjects.push(tmpObj2);
      }
      if (setSID)
        tmpObj2.sid = sid;
      tmpObj2.init(x, y, dir, s, type, data, typeof owner === "number" ? { sid: owner } : owner);
      tmpObj2.fake = fake;
      this.setObjectGrids(tmpObj2);
      return tmpObj2;
    };
    this.disableBySid = function(sid) {
      for (let i = 0, len = gameObjects.length;i < len; ++i) {
        if (gameObjects[i].sid == sid) {
          this.disableObj(gameObjects[i]);
          break;
        }
      }
    };
    this.removeAllItems = function(sid, server2) {
      for (let i = 0, len = gameObjects.length;i < len; ++i) {
        const obj = gameObjects[i];
        if (obj.active && obj.owner && obj.owner.sid == sid) {
          this.disableObj(obj);
        }
      }
      if (server2)
        server2.broadcast("13", sid);
    };
    this.fetchSpawnObj = function(sid) {
      for (let i = 0, len = gameObjects.length;i < len; ++i) {
        const tmpObj2 = gameObjects[i];
        if (tmpObj2.active && tmpObj2.owner && tmpObj2.owner.sid == sid && tmpObj2.spawnPoint) {
          const tmpLoc = [tmpObj2.x, tmpObj2.y];
          this.disableObj(tmpObj2);
          server.broadcast("12", tmpObj2.sid);
          if (tmpObj2.owner)
            tmpObj2.owner.changeItemCount(tmpObj2.group.id, -1);
          return tmpLoc;
        }
      }
      return null;
    };
    this.checkItemLocation = function(x, y, s, sM, indx, ignoreWater, skip) {
      for (let i = 0, len = this.objects.length;i < len; ++i) {
        const obj = this.objects[i];
        if (!obj.active)
          continue;
        const skipSid = typeof skip === "object" ? skip.sid : skip;
        if (skip && obj.sid === skipSid)
          continue;
        const blockS = obj.blocker ? obj.blocker : obj.getScale(sM, obj.isItem);
        if (UTILS.getDistance(x, y, obj.x, obj.y) < s + blockS)
          return false;
      }
      if (!ignoreWater && indx != 18 && y >= riverMin && y <= riverMax)
        return false;
      return true;
    };
    this.addProjectile = function(x, y, dir, range, indx) {
      const tmpData = items.projectiles[indx];
      let tmpProj;
      for (let i = 0, len = projectiles.length;i < len; ++i) {
        if (!projectiles[i].active) {
          tmpProj = projectiles[i];
          break;
        }
      }
      if (!tmpProj) {
        tmpProj = new Projectile(players, UTILS);
        projectiles.push(tmpProj);
      }
      tmpProj.init(indx, x, y, dir, tmpData.speed, range, tmpData.scale);
    };
    this.checkCollision = function(player, other, delta) {
      delta = delta || 1;
      let tmpX = other.x2 || other.x, tmpY = other.y2 || other.y;
      const dx = player.x3 - tmpX;
      const dy = player.y3 - tmpY;
      const tmpLen = player.scale + other.scale + 2;
      if (mathABS(dx) > tmpLen && mathABS(dy) > tmpLen)
        return false;
      const fullLen = player.scale + (other.getScale ? other.getScale() : other.scale);
      const tmpInt = mathSQRT(dx * dx + dy * dy) - fullLen - 2;
      if (tmpInt > 0)
        return false;
      const isEnemy = !other.isItem || other.owner && !player.team && player.sid !== other.owner.sid || !window.ally(player.sid) && window.ally(other.owner?.sid) || window.ally(player.sid) && !window.ally(other.owner?.sid);
      if (!other.ignoreCollision) {
        const tmpDir = UTILS.getDirection(player.x3, player.y3, tmpX, tmpY);
        if (other.isPlayer) {
          const adjustment = tmpInt * -0.5;
          const cosDir = mathCOS(tmpDir);
          const sinDir = mathSIN(tmpDir);
          player.x3 += adjustment * cosDir;
          player.y3 += adjustment * sinDir;
          tmpX -= adjustment * cosDir;
          tmpY -= adjustment * sinDir;
        } else {
          const cosDir = mathCOS(tmpDir);
          const sinDir = mathSIN(tmpDir);
          player.x3 = tmpX + fullLen * cosDir;
          player.y3 = tmpY + fullLen * sinDir;
          player.xVel *= 0.75;
          player.yVel *= 0.75;
        }
        if (other.dmg && isEnemy) {
          if (!other.trap || player.trap === other) {
            player.changeHealth(-other.dmg, other.owner, other);
            const tmpSpd = 1.5 * (other.weightM || 1);
            if (other.pDmg && !(player.skin && player.skin.poisonRes)) {
              player.dmgOverTime.dmg = other.pDmg;
              player.dmgOverTime.time = 5;
              player.dmgOverTime.doer = other.owner;
            }
            player.spike += other.dmg;
            player.spikes.push(other);
          }
        }
        if (player.colDmg && other.health) {
          if (!other.trap || !other.hideFromEnemy || !isEnemy || player.trap === other) {}
        }
      } else if (other.trap && !player.noTrap && isEnemy) {
        player.trap = other;
        other.hideFromEnemy = false;
      } else if (other.boostSpeed) {
        const boost = delta * other.boostSpeed * (other.weightM || 1);
        player.xVel += boost * mathCOS(other.dir);
        player.yVel += boost * mathSIN(other.dir);
      } else if (other.healCol) {
        player.healCol = other.healCol;
      } else if (other.teleport) {}
      if (other.zIndex > player.zIndex)
        player.zIndex = other.zIndex;
      return true;
    };
  };
});

// bundle/src/js/data/player.js
var require_player = __commonJS((exports, module) => {
  var mathABS = Math.abs;
  var polearmAnim = window.polearmAnim;
  module.exports = function(id, sid, config, UTILS, projectileManager, objectManager, players, ais, items2, skins2, tails, server, scoreCallback, iconCallback) {
    this.id = id;
    this.sid = sid;
    this.tmpScore = 0;
    this.team = null;
    this.skinIndex = 0;
    this.tailIndex = 0;
    this.hitTime = 0;
    this.tails = {};
    for (var i = 0;i < tails.length; ++i) {
      if (tails[i].price <= 0)
        this.tails[tails[i].id] = 1;
    }
    this.skins = {};
    for (var i = 0;i < skins2.length; ++i) {
      if (skins2[i].price <= 0)
        this.skins[skins2[i].id] = 1;
    }
    this.points = 0;
    this.dt = 0;
    this.hidden = false;
    this.itemCounts = {};
    this.isPlayer = true;
    this.pps = 0;
    this.moveDir = undefined;
    this.skinRot = 0;
    this.lastPing = 0;
    this.iconIndex = 0;
    this.skinColor = 0;
    this.spawn = function(moofoll) {
      this.active = true;
      this.alive = true;
      this.lockMove = false;
      this.lockDir = false;
      this.minimapCounter = 0;
      this.chatCountdown = 0;
      this.shameCount = 0;
      this.shameTimer = 0;
      this.sentTo = {};
      this.gathering = 0;
      this.autoGather = 0;
      this.animTime = 0;
      this.animSpeed = 0;
      this.mouseState = 0;
      this.buildIndex = -1;
      this.weaponIndex = 0;
      this.dmgOverTime = {};
      this.noMovTimer = 0;
      this.maxXP = 300;
      this.XP = 0;
      this.age = 1;
      this.kills = 0;
      this.upgrAge = 2;
      this.upgradePoints = 0;
      this.x = 0;
      this.y = 0;
      this.zIndex = 0;
      this.xVel = 0;
      this.yVel = 0;
      this.slowMult = 1;
      this.dir = 0;
      this.dirPlus = 0;
      this.targetDir = 0;
      this.targetAngle = 0;
      this.maxHealth = 100;
      this.health = this.maxHealth;
      this.scale = config.playerScale;
      this.speed = config.playerSpeed;
      this.resetMoveDir();
      this.resetResources(moofoll);
      this.items = [0, 3, 6, 10];
      this.weapons = [0];
      this.shootCount = 0;
      this.weaponXP = [];
      this.reload = [{ count: Math.ceil(300 / 111), date: 0, max: Math.ceil(300 / 111), max2: 300, done: true, id: 5, val: 0 }, { count: Math.ceil(1500 / 111), date: 0, max: Math.ceil(1500 / 111), max2: 1500, done: true, id: 15, val: 0 }, { count: 23, date: 0, max: 23, done: true, max2: 2500 }];
    };
    this.resetMoveDir = function() {
      this.moveDir = undefined;
    };
    this.resetResources = function(moofoll) {
      for (var i2 = 0;i2 < config.resourceTypes.length; ++i2) {
        this[config.resourceTypes[i2]] = moofoll ? 100 : 0;
      }
    };
    this.addItem = function(id2) {
      var tmpItem = items2.list[id2];
      if (tmpItem) {
        for (var i2 = 0;i2 < this.items.length; ++i2) {
          if (items2.list[this.items[i2]].group == tmpItem.group) {
            if (this.buildIndex == this.items[i2])
              this.buildIndex = id2;
            this.items[i2] = id2;
            return true;
          }
        }
        this.items.push(id2);
        return true;
      }
      return false;
    };
    this.setUserData = function(data) {
      if (data) {
        this.name = "unknown";
        var name = data.name + "";
        name = name.slice(0, config.maxNameLength);
        name = name.replace(/[^\w:\(\)\/? -]+/gmi, " ");
        name = name.replace(/[^\x00-\x7F]/g, " ");
        name = name.trim();
        this.name = name;
        this.skinColor = 0;
        if (config.skinColors[data.skin])
          this.skinColor = data.skin;
      }
    };
    this.getData = function() {
      return [
        this.id,
        this.sid,
        this.name,
        UTILS.fixTo(this.x, 2),
        UTILS.fixTo(this.y, 2),
        UTILS.fixTo(this.dir, 3),
        this.health,
        this.maxHealth,
        this.scale,
        this.skinColor
      ];
    };
    this.setData = function(data) {
      this.id = data[0];
      this.sid = data[1];
      this.name = data[2];
      this.x = data[3];
      this.y = data[4];
      this.dir = data[5];
      this.health = data[6];
      this.maxHealth = data[7];
      this.scale = data[8];
      this.skinColor = data[9];
    };
    var timerCount = 0;
    this.update = function(tmpTime, x2, y2, d2, buildIndex, weaponIndex, weaponVariant, team, isLeader, skinIndex, tailIndex, iconIndex, zIndex) {
      const delta = 1000 / 9;
      if (tmpTime) {
        this.spike2 = 0;
        this.t1 = this.t2 === undefined ? tmpTime : this.t2;
        this.t2 = tmpTime;
        this.x1 = this.x;
        this.y1 = this.y;
        let old = {
          x: this.x2,
          y: this.y2
        };
        this.x2 = x2;
        this.y2 = y2;
        this.d1 = this.d2 === undefined ? d2 : this.d2;
        this.d2 = d2;
        this.dt = 0;
        this.buildIndex = buildIndex;
        this.weaponIndex = weaponIndex;
        this.weaponVariant = weaponVariant;
        this.team = team;
        this.isLeader = isLeader;
        this.skinIndex = skinIndex;
        this.skinIndex2 = skinIndex;
        this.tailIndex = tailIndex;
        this.iconIndex = iconIndex;
        this.zIndex = zIndex;
        this.visible = true;
        this.fresh = false;
        if (!this.isMe) {
          let dir = UTILS.getDirection(this.x2, this.y2, old.x, old.y);
          let speed = UTILS.getDistance(this.x2, this.y2, old.x, old.y);
          this.moveDir = speed > 5 ? dir : undefined;
        }
        this.trap = null;
        let ally = window.ally, tmpList = objectManager.getGridArrays(this.x2, this.y2, 35);
        for (let t = 0;t < tmpList.length; ++t) {
          for (let i3 = 0;i3 < tmpList[t].length; ++i3) {
            tmpObj = tmpList[t][i3];
            let valid = tmpObj.active && tmpObj.isItem && tmpObj.sid < 1000000000000000 && tmpObj.owner && (ally(this.sid) && !ally(tmpObj.owner.sid) || !ally(this.sid) && ally(tmpObj.owner.sid)) && tmpObj.id === 15 && UTILS.getDistance(tmpObj.x, tmpObj.y, this.x2, this.y2) <= 50;
            if (valid)
              this.trap = tmpObj;
          }
        }
      }
      const weapon = items2.weapons[this.weaponIndex];
      let reload = this.reload[Number(this.weaponIndex > 8)];
      const mltp = (() => {
        const variants = [1, 1.1, 1.18, 1.18];
        return variants[this.weaponVariant];
      })();
      if (reload.id != weapon.id) {
        reload.id = weapon.id;
        const atkSpd = this.skinIndex === 20 ? 0.78 : 1;
        reload.max = weapon.speed ? Math.ceil(weapon.speed * atkSpd / (1000 / 9)) : 0;
        reload.max2 = weapon.speed * atkSpd;
        if (weapon.dmg)
          reload.dmg = weapon.dmg;
        reload.count = reload.max;
        reload.done = true;
        reload.rarity = this.weaponVariant;
        reload.val = mltp;
      }
      if (this.weaponVariant != reload.rarity)
        reload.rarity = this.weaponVariant;
      if (mltp != reload.val)
        reload.val = mltp;
      if (reload.count < reload.max && this.buildIndex == -1) {
        reload.count += 1;
        if (reload.count > reload.max)
          reload.count = reload.max;
        reload.done = reload.count === reload.max;
      }
      this.reload[Number(this.weaponIndex > 8)] = reload;
      if (this.reload[2].count < this.reload[2].max) {
        this.reload[2].count += 1;
        if (this.reload[2].count === this.reload[2].max)
          this.reload[2].done = true;
      }
      if (this.shameTimer > 0) {
        this.shameTimer -= delta;
        if (this.shameTimer <= 0) {
          this.shameTimer = 0;
          this.shameCount = 0;
        }
      }
      this.timerCount -= 1;
      if (this.timerCount <= 0) {
        var regenAmount = (this.skin && this.skin.healthRegen ? this.skin.healthRegen : 0) + (this.tail && this.tail.healthRegen ? this.tail.healthRegen : 0);
        if (regenAmount)
          this.changeHealth(regenAmount, this);
        if (this.dmgOverTime.dmg) {
          this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer);
          this.dmgOverTime.time -= 1;
          if (this.dmgOverTime.time <= 0)
            this.dmgOverTime.dmg = 0;
        }
        if (this.healCol)
          this.changeHealth(this.healCol, this);
        this.timerCount = 9;
      }
      if (!this.alive)
        return;
      if (this.slowMult < 1) {
        this.slowMult += 0.0008 * delta;
        if (this.slowMult > 1)
          this.slowMult = 1;
      }
      this.noMovTimer += delta;
      if (this.xVel || this.yVel)
        this.noMovTimer = 0;
      let cx = "x3", cy = "y3";
      this[cx] = this.x2;
      this[cy] = this.y2;
      let spdTail = this.tailIndex ? tails.find((tail) => tail.id === this.tailIndex) : {}, spdSkin = this.skinIndex ? skins2.find((skin) => skin.id === this.skinIndex) : {};
      this.tail = spdTail;
      this.skin = spdSkin;
      let spdWpn = this.weaponIndex;
      var spdMult = this.spdMult = (this.buildIndex >= 0 ? 0.5 : 1) * (items2.weapons[spdWpn].spdMult || 1) * (spdSkin ? spdSkin.spdMult || 1 : 1) * (spdTail ? spdTail.spdMult || 1 : 1) * (this[cy] <= config.snowBiomeTop ? spdSkin && spdSkin.coldM ? 1 : config.snowSpeed : 1) * this.slowMult;
      this.spdMult = spdMult;
      this.maxSpeed = spdMult * 36;
      if (!this.zIndex && this[cy] >= config.mapScale / 2 - config.riverWidth / 2 && this[cy] <= config.mapScale / 2 + config.riverWidth / 2) {
        if (spdSkin && spdSkin.watrImm) {
          spdMult *= 0.75;
          this.xVel += config.waterCurrent * 0.4 * delta;
        } else {
          spdMult *= 0.33;
          this.xVel += config.waterCurrent * delta;
        }
      }
      var xVel = this.moveDir != null && this.moveDir !== null ? Math.cos(this.moveDir) : 0;
      var yVel = this.moveDir != null && this.moveDir !== null ? Math.sin(this.moveDir) : 0;
      var length = Math.sqrt(xVel * xVel + yVel * yVel);
      if (length != 0) {
        xVel /= length;
        yVel /= length;
      }
      if (xVel)
        this.xVel += xVel * this.speed * spdMult * delta;
      if (yVel)
        this.yVel += yVel * this.speed * spdMult * delta;
      this.zIndex = 0;
      this.lockMove = this.healCol = 0;
      this.spike = 0;
      this.boost = 0;
      this.ai = 0;
      this.spikes = [];
      this.lockMove = null;
      let tmpSpeed = UTILS.getDistance(0, 0, this.xVel * delta, this.yVel * delta);
      let depth = Math.min(4, Math.max(1, Math.round(tmpSpeed / 40)));
      let tMlt = 1 / depth;
      let already = [];
      for (var i2 = 0;i2 < depth; ++i2) {
        if (!this.lockMove) {
          if (this.xVel)
            this[cx] += this.xVel * delta * tMlt;
          if (this.yVel)
            this[cy] += this.yVel * delta * tMlt;
        }
        let tmpList = objectManager.getGridArrays(this[cx], this[cy], this.scale);
        for (var x = 0;x < tmpList.length; ++x) {
          for (var y = 0;y < tmpList[x].length; ++y) {
            let obj = tmpList[x][y];
            if (!obj.active || obj.sid >= 1000000000000000 || already.includes(obj.sid))
              continue;
            already.push(obj.sid);
            let d = objectManager.checkCollision(this, obj, tMlt);
          }
        }
      }
      var tmpIndx = players.indexOf(this);
      for (let i3 = tmpIndx + 1;i3 < players.length; i3 += 1) {
        if (players[i3] != this && players[i3].alive)
          objectManager.checkCollision(this, players[i3], 1, cx, cy);
      }
      if (!this.lockMove) {
        if (this.xVel) {
          this.xVel *= Math.pow(config.playerDecel, delta);
          if (this.xVel <= 0.01 && this.xVel >= -0.01)
            this.xVel = 0;
        }
        if (this.yVel) {
          this.yVel *= Math.pow(config.playerDecel, delta);
          if (this.yVel <= 0.01 && this.yVel >= -0.01)
            this.yVel = 0;
        }
      }
      if (this[cx] - this.scale < 0) {
        this[cx] = this.scale;
      } else if (this[cx] + this.scale > config.mapScale) {
        this[cx] = config.mapScale - this.scale;
      }
      if (this[cy] - this.scale < 0) {
        this[cy] = this.scale;
      } else if (this[cy] + this.scale > config.mapScale) {
        this[cy] = config.mapScale - this.scale;
      }
      if (this.buildIndex < 0) {
        if (this.lockMove) {
          this.xVel = 0;
          this.yVel = 0;
        }
      }
    };
    this.addWeaponXP = function(amnt) {
      if (!this.weaponXP[this.weaponIndex])
        this.weaponXP[this.weaponIndex] = 0;
      this.weaponXP[this.weaponIndex] += amnt;
    };
    this.earnXP = function(amount) {
      if (this.age < config.maxAge) {
        this.XP += amount;
        if (this.XP >= this.maxXP) {
          if (this.age < config.maxAge) {
            this.age++;
            this.XP = 0;
            this.maxXP *= 1.2;
          } else {
            this.XP = this.maxXP;
          }
          this.upgradePoints++;
          server.send(this.id, "16", this.upgradePoints, this.upgrAge);
          server.send(this.id, "15", this.XP, UTILS.fixTo(this.maxXP, 1), this.age);
        } else {
          server.send(this.id, "15", this.XP);
        }
      }
    };
    this.changeHealth = function(amount, doer) {};
    this.kill = function(doer) {
      if (doer && doer.alive) {
        doer.kills++;
        if (doer.skin && doer.skin.goldSteal)
          scoreCallback(doer, Math.round(this.points / 2));
        else
          scoreCallback(doer, Math.round(this.age * 100 * (doer.skin && doer.skin.kScrM ? doer.skin.kScrM : 1)));
        server.send(doer.id, "9", "kills", doer.kills, 1);
      }
      this.alive = false;
      server.send(this.id, "11");
      iconCallback();
    };
    this.addResource = function(type, amount, auto) {
      if (!auto && amount > 0)
        this.addWeaponXP(amount);
      if (type == 3) {
        scoreCallback(this, amount, true);
      } else {
        this[config.resourceTypes[type]] += amount;
        server.send(this.id, "9", config.resourceTypes[type], this[config.resourceTypes[type]], 1);
      }
    };
    this.changeItemCount = function(index, value) {
      this.itemCounts[index] = this.itemCounts[index] || 0;
      this.itemCounts[index] += value;
      server.send(this.id, "14", index, this.itemCounts[index]);
    };
    this.buildItem = function(item, angle, skip) {
      const scale = this.scale + item.scale + (item.placeOffset || 0), x = this.x2 + scale * Math.cos(angle), y = this.y2 + scale * Math.sin(angle);
      return objectManager.checkItemLocation(x, y, item.scale, 0.6, item.id, false, skip);
    };
    this.build = function() {
      if (this.hitTime) {
        let delta = Date.now() - this.hitTime;
        this.hitTime = 0;
        if (delta < 120) {
          this.shameCount += 1;
        } else {
          this.shameCount = Math.max(0, this.shameCount - 2);
        }
      }
    };
    this.hasRes = function(item, mult) {
      for (var i2 = 0;i2 < item.req.length; ) {
        if (this[item.req[i2]] < Math.round(item.req[i2 + 1] * (mult || 1)))
          return false;
        i2 += 2;
      }
      return true;
    };
    this.useRes = function(item, mult) {
      if (config.inSandbox)
        return;
      for (var i2 = 0;i2 < item.req.length; ) {
        this.addResource(config.resourceTypes.indexOf(item.req[i2]), -Math.round(item.req[i2 + 1] * (mult || 1)));
        i2 += 2;
      }
    };
    this.canBuild = function(item) {
      if (config.inSandbox)
        return true;
      if (item.group.limit && this.itemCounts[item.group.id] >= item.group.limit)
        return false;
      return this.hasRes(item);
    };
    this.gather = function(hitBuild, weaponIndex, frame) {
      this.weaponIndex = weaponIndex;
      const reload = this.reload[Number(weaponIndex > 8)];
      reload.count = 0;
      reload.date = Date.now();
      reload.done = false;
      const weapon = items2.weapons[weaponIndex];
      if (weapon) {
        const atkSpd = this.skinIndex === 20 ? 0.78 : 1;
        reload.max = weapon.speed ? Math.ceil(weapon.speed * atkSpd / (1000 / 9)) : 0;
        reload.max2 = weapon.speed * atkSpd;
      }
      this.noMovTimer = 0;
      this.slowMult -= items2.weapons[this.weaponIndex].hitSlow || 0.3;
      if (this.slowMult < 0)
        this.slowMult = 0;
      let tmpVariant = config.fetchVariant(this);
      let applyPoison = tmpVariant.poison;
      let variantDmg = tmpVariant.val;
      let hitObjs = [];
      let tmpDist, tmpDir, tmpObj2, hitSomething;
      let tmpList = objectManager.getGridArrays(this.x2, this.y2, items2.weapons[this.weaponIndex].range);
      for (let i2 = 0;i2 < players.length + ais.length; ++i2) {
        tmpObj2 = players[i2] || ais[i2 - players.length];
        if (tmpObj2 != this && tmpObj2.visible && !(tmpObj2.team && tmpObj2.team == this.team)) {
          tmpDist = UTILS.getDistance(this.x2, this.y2, tmpObj2.x2, tmpObj2.y2) - tmpObj2.scale * 1.8;
          if (tmpDist <= items2.weapons[this.weaponIndex].range) {
            tmpDir = UTILS.getDirection(tmpObj2.x2, tmpObj2.y2, this.x2, this.y2);
            if (UTILS.getAngleDist(tmpDir, this.d2) <= config.gatherAngle) {
              let stealCount = items2.weapons[this.weaponIndex].steal;
              if (stealCount && tmpObj2.addResource) {
                stealCount = min(tmpObj2.points || 0, stealCount);
                console.log("steal", stealCount);
              }
              let dmgMlt = variantDmg;
              if (tmpObj2.weaponIndex != null && weapon.shield && UTILS.getAngleDist(tmpDir + PI, tmpObj2.dir) <= config.shieldAngle) {
                dmgMlt = items2.weapons[tmpObj2.weaponIndex].shield;
              }
              let dmgVal = weapon.dmg * (this.skin && this.skin.dmgMultO ? this.skin.dmgMultO : 1) * (this.tail && this.tail.dmgMultO ? this.tail.dmgMultO : 1);
              let tmpSpd = 0.3 * (tmpObj2.weightM || 1) + (weapon.knock || 0);
              tmpObj2.xVel += tmpSpd * Math.cos(tmpDir);
              tmpObj2.yVel += tmpSpd * Math.sin(tmpDir);
              if (this.skin && this.skin.healD)
                this.changeHealth(dmgVal * dmgMlt * this.skin.healD, this);
              if (this.tail && this.tail.healD)
                this.changeHealth(dmgVal * dmgMlt * this.tail.healD, this);
              if (tmpObj2.skin && tmpObj2.skin.dmg && dmgMlt == 1)
                this.changeHealth(-dmgVal * tmpObj2.skin.dmg, tmpObj2);
              if (tmpObj2.tail && tmpObj2.tail.dmg && dmgMlt == 1)
                this.changeHealth(-dmgVal * tmpObj2.tail.dmg, tmpObj2);
              if (tmpObj2.dmgOverTime && this.skin && this.skin.poisonDmg && !(tmpObj2.skin && tmpObj2.skin.poisonRes)) {
                tmpObj2.dmgOverTime.dmg = this.skin.poisonDmg;
                tmpObj2.dmgOverTime.time = this.skin.poisonTime || 1;
                tmpObj2.dmgOverTime.doer = this;
              }
              if (tmpObj2.dmgOverTime && applyPoison && !(tmpObj2.skin && tmpObj2.skin.poisonRes)) {
                tmpObj2.dmgOverTime.dmg = 5;
                tmpObj2.dmgOverTime.time = 5;
                tmpObj2.dmgOverTime.doer = this;
              }
              if (tmpObj2.skin && tmpObj2.skin.dmgK) {
                this.xVel -= tmpObj2.skin.dmgK * Math.cos(tmpDir);
                this.yVel -= tmpObj2.skin.dmgK * Math.sin(tmpDir);
                console.log("vel knockback!");
              }
              tmpObj2.changeHealth(-dmgVal * dmgMlt, this, this);
            }
          }
        }
      }
      this.sendAnimation(hitSomething ? 1 : 0);
      return hitObjs;
    };
    this.sendAnimation = function(hit) {
      for (var i2 = 0;i2 < players.length; ++i2) {
        if (this.sentTo[players[i2].id] && this.canSee(players[i2])) {
          server.send(players[i2].id, "7", this.sid, hit ? 1 : 0, this.weaponIndex);
        }
      }
    };
    var tmpRatio = 0;
    var animIndex = 0;
    this.animate = function(delta) {
      if (this.weaponIndex === 5 && polearmAnim) {
        this.animSpeed = items2.weapons[this.weaponIndex].speed * 0.8;
        this.targetAngle /= 1.18;
      }
      if (this.animTime > 0) {
        this.animTime -= delta;
        if (this.animTime <= 0) {
          this.animTime = 0;
          this.dirPlus = 0;
          tmpRatio = 0;
          animIndex = 0;
        } else {
          if (animIndex == 0) {
            tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
            this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
            if (tmpRatio >= 1) {
              tmpRatio = 1;
              animIndex = 1;
            }
          } else {
            tmpRatio -= delta / (this.animSpeed * (1 - config.hitReturnRatio));
            this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
          }
        }
      }
    };
    this.startAnim = function(didHit, index) {
      this.animTime = this.animSpeed = items2.weapons[index].speed;
      this.targetAngle = didHit ? -config.hitAngle : -config.hitAngle;
      tmpRatio = 0;
      animIndex = 0;
    };
    this.canSee = function(other) {
      if (!other)
        return false;
      if (other.skin && other.skin.invisTimer && other.noMovTimer >= other.skin.invisTimer)
        return false;
      var dx = mathABS(other.x - this.x) - other.scale;
      var dy = mathABS(other.y - this.y) - other.scale;
      return dx <= config.maxScreenWidth / 2 * 1.3 && dy <= config.maxScreenHeight / 2 * 1.3;
    };
  };
});

// bundle/src/js/data/store.js
var require_store = __commonJS((exports, module) => {
  exports.skins = [{
    id: 45,
    name: "Shame!",
    dontSell: true,
    price: 0,
    scale: 120,
    desc: "hacks are for losers"
  }, {
    id: 51,
    name: "Moo Cap",
    price: 0,
    scale: 120,
    desc: "coolest mooer around"
  }, {
    id: 50,
    name: "Apple Cap",
    price: 0,
    scale: 120,
    desc: "apple farms remembers"
  }, {
    id: 28,
    name: "Moo Head",
    price: 0,
    scale: 120,
    desc: "no effect"
  }, {
    id: 29,
    name: "Pig Head",
    price: 0,
    scale: 120,
    desc: "no effect"
  }, {
    id: 30,
    name: "Fluff Head",
    price: 0,
    scale: 120,
    desc: "no effect"
  }, {
    id: 36,
    name: "Pandou Head",
    price: 0,
    scale: 120,
    desc: "no effect"
  }, {
    id: 37,
    name: "Bear Head",
    price: 0,
    scale: 120,
    desc: "no effect"
  }, {
    id: 38,
    name: "Monkey Head",
    price: 0,
    scale: 120,
    desc: "no effect"
  }, {
    id: 44,
    name: "Polar Head",
    price: 0,
    scale: 120,
    desc: "no effect"
  }, {
    id: 35,
    name: "Fez Hat",
    price: 0,
    scale: 120,
    desc: "no effect"
  }, {
    id: 42,
    name: "Enigma Hat",
    price: 0,
    scale: 120,
    desc: "join the enigma army"
  }, {
    id: 43,
    name: "Blitz Hat",
    price: 0,
    scale: 120,
    desc: "hey everybody i'm blitz"
  }, {
    id: 49,
    name: "Bob XIII Hat",
    price: 0,
    scale: 120,
    desc: "like and subscribe"
  }, {
    id: 57,
    name: "Pumpkin",
    price: 50,
    scale: 120,
    desc: "Spooooky"
  }, {
    id: 8,
    name: "Bummle Hat",
    price: 100,
    scale: 120,
    desc: "no effect"
  }, {
    id: 2,
    name: "Straw Hat",
    price: 500,
    scale: 120,
    desc: "no effect"
  }, {
    id: 15,
    name: "Winter Cap",
    price: 600,
    scale: 120,
    desc: "allows you to move at normal speed in snow",
    coldM: 1
  }, {
    id: 5,
    name: "Cowboy Hat",
    price: 1000,
    scale: 120,
    desc: "no effect"
  }, {
    id: 4,
    name: "Ranger Hat",
    price: 2000,
    scale: 120,
    desc: "no effect"
  }, {
    id: 18,
    name: "Explorer Hat",
    price: 2000,
    scale: 120,
    desc: "no effect"
  }, {
    id: 31,
    name: "Flipper Hat",
    price: 2500,
    scale: 120,
    desc: "have more control while in water",
    watrImm: true
  }, {
    id: 1,
    name: "Marksman Cap",
    price: 3000,
    scale: 120,
    desc: "increases arrow speed and range",
    aMlt: 1.3
  }, {
    id: 10,
    name: "Bush Gear",
    price: 3000,
    scale: 160,
    desc: "allows you to disguise yourself as a bush"
  }, {
    id: 48,
    name: "Halo",
    price: 3000,
    scale: 120,
    desc: "no effect"
  }, {
    id: 6,
    name: "Soldier Helmet",
    price: 4000,
    scale: 120,
    desc: "reduces damage taken but slows movement",
    spdMult: 0.94,
    dmgMult: 0.75
  }, {
    id: 23,
    name: "Anti Venom Gear",
    price: 4000,
    scale: 120,
    desc: "makes you immune to poison",
    poisonRes: 1
  }, {
    id: 13,
    name: "Medic Gear",
    price: 5000,
    scale: 110,
    desc: "slowly regenerates health over time",
    healthRegen: 3
  }, {
    id: 9,
    name: "Miners Helmet",
    price: 5000,
    scale: 120,
    desc: "earn 1 extra gold per resource",
    extraGold: 1
  }, {
    id: 32,
    name: "Musketeer Hat",
    price: 5000,
    scale: 120,
    desc: "reduces cost of projectiles",
    projCost: 0.5
  }, {
    id: 7,
    name: "Bull Helmet",
    price: 6000,
    scale: 120,
    desc: "increases damage done but drains health",
    healthRegen: -5,
    dmgMultO: 1.5,
    spdMult: 0.96
  }, {
    id: 22,
    name: "Emp Helmet",
    price: 6000,
    scale: 120,
    desc: "turrets won't attack but you move slower",
    antiTurret: 1,
    spdMult: 0.7
  }, {
    id: 12,
    name: "Booster Hat",
    price: 6000,
    scale: 120,
    desc: "increases your movement speed",
    spdMult: 1.16
  }, {
    id: 26,
    name: "Barbarian Armor",
    price: 8000,
    scale: 120,
    desc: "knocks back enemies that attack you",
    dmgK: 0.6
  }, {
    id: 21,
    name: "Plague Mask",
    price: 1e4,
    scale: 120,
    desc: "melee attacks deal poison damage",
    poisonDmg: 5,
    poisonTime: 6
  }, {
    id: 46,
    name: "Bull Mask",
    price: 1e4,
    scale: 120,
    desc: "bulls won't target you unless you attack them",
    bullRepel: 1
  }, {
    id: 14,
    name: "Windmill Hat",
    topSprite: true,
    price: 1e4,
    scale: 120,
    desc: "generates points while worn",
    pps: 1.5
  }, {
    id: 11,
    name: "Spike Gear",
    topSprite: true,
    price: 1e4,
    scale: 120,
    desc: "deal damage to players that damage you",
    dmg: 0.45
  }, {
    id: 53,
    name: "Turret Gear",
    topSprite: true,
    price: 1e4,
    scale: 120,
    desc: "you become a walking turret",
    turret: {
      proj: 1,
      range: 700,
      rate: 2500
    },
    spdMult: 0.7
  }, {
    id: 20,
    name: "Samurai Armor",
    price: 12000,
    scale: 120,
    desc: "increased attack speed and fire rate",
    atkSpd: 0.78
  }, {
    id: 58,
    name: "Dark Knight",
    price: 12000,
    scale: 120,
    desc: "restores health when you deal damage",
    healD: 0.4
  }, {
    id: 27,
    name: "Scavenger Gear",
    price: 15000,
    scale: 120,
    desc: "earn double points for each kill",
    kScrM: 2
  }, {
    id: 40,
    name: "Tank Gear",
    price: 15000,
    scale: 120,
    desc: "increased damage to buildings but slower movement",
    spdMult: 0.3,
    bDmg: 3.3
  }, {
    id: 52,
    name: "Thief Gear",
    price: 15000,
    scale: 120,
    desc: "steal half of a players gold when you kill them",
    goldSteal: 0.5
  }, {
    id: 55,
    name: "Bloodthirster",
    price: 20000,
    scale: 120,
    desc: "Restore Health when dealing damage. And increased damage",
    healD: 0.25,
    dmgMultO: 1.2
  }, {
    id: 56,
    name: "Assassin Gear",
    price: 20000,
    scale: 120,
    desc: "Go invisible when not moving. Can't eat. Increased speed",
    noEat: true,
    spdMult: 1.1,
    invisTimer: 1000
  }];
  exports.tails = [{
    id: 12,
    name: "Snowball",
    price: 1000,
    scale: 105,
    xOff: 18,
    desc: "no effect"
  }, {
    id: 9,
    name: "Tree Cape",
    price: 1000,
    scale: 90,
    desc: "no effect"
  }, {
    id: 10,
    name: "Stone Cape",
    price: 1000,
    scale: 90,
    desc: "no effect"
  }, {
    id: 3,
    name: "Cookie Cape",
    price: 1500,
    scale: 90,
    desc: "no effect"
  }, {
    id: 8,
    name: "Cow Cape",
    price: 2000,
    scale: 90,
    desc: "no effect"
  }, {
    id: 11,
    name: "Monkey Tail",
    price: 2000,
    scale: 97,
    xOff: 25,
    desc: "Super speed but reduced damage",
    spdMult: 1.35,
    dmgMultO: 0.2
  }, {
    id: 17,
    name: "Apple Basket",
    price: 3000,
    scale: 80,
    xOff: 12,
    desc: "slowly regenerates health over time",
    healthRegen: 1
  }, {
    id: 6,
    name: "Winter Cape",
    price: 3000,
    scale: 90,
    desc: "no effect"
  }, {
    id: 4,
    name: "Skull Cape",
    price: 4000,
    scale: 90,
    desc: "no effect"
  }, {
    id: 5,
    name: "Dash Cape",
    price: 5000,
    scale: 90,
    desc: "no effect"
  }, {
    id: 2,
    name: "Dragon Cape",
    price: 6000,
    scale: 90,
    desc: "no effect"
  }, {
    id: 1,
    name: "Super Cape",
    price: 8000,
    scale: 90,
    desc: "no effect"
  }, {
    id: 7,
    name: "Troll Cape",
    price: 8000,
    scale: 90,
    desc: "no effect"
  }, {
    id: 14,
    name: "Thorns",
    price: 1e4,
    scale: 115,
    xOff: 20,
    desc: "no effect"
  }, {
    id: 15,
    name: "Blockades",
    price: 1e4,
    scale: 95,
    xOff: 15,
    desc: "no effect"
  }, {
    id: 20,
    name: "Devils Tail",
    price: 1e4,
    scale: 95,
    xOff: 20,
    desc: "no effect"
  }, {
    id: 16,
    name: "Sawblade",
    price: 12000,
    scale: 90,
    spin: true,
    xOff: 0,
    desc: "deal damage to players that damage you",
    dmg: 0.15
  }, {
    id: 13,
    name: "Angel Wings",
    price: 15000,
    scale: 138,
    xOff: 22,
    desc: "slowly regenerates health over time",
    healthRegen: 3
  }, {
    id: 19,
    name: "Shadow Wings",
    price: 15000,
    scale: 138,
    xOff: 22,
    desc: "increased movement speed",
    spdMult: 1.1
  }, {
    id: 18,
    name: "Blood Wings",
    price: 20000,
    scale: 178,
    xOff: 26,
    desc: "restores health when you deal damage",
    healD: 0.2
  }, {
    id: 21,
    name: "Corrupt X Wings",
    price: 20000,
    scale: 178,
    xOff: 26,
    desc: "deal damage to players that damage you",
    dmg: 0.25
  }];
});

// bundle/src/js/data/projectile.js
var require_projectile = __commonJS((exports, module) => {
  module.exports = function(players, ais, objectManager, items2, config, UTILS, server) {
    this.init = function(indx, x, y, dir, spd, dmg, rng, scl, owner) {
      this.active = true;
      this.indx = indx;
      this.x = x;
      this.y = y;
      this.x3 = x;
      this.y3 = y;
      this.dir = dir;
      this.skipMov = true;
      this.speed = spd;
      this.dmg = dmg;
      this.scale = scl;
      this.range = rng;
      this.owner = owner || {};
      if (server)
        this.sentTo = {};
    };
    let objectsHit = [];
    let tmpObj2;
    this.update = function(delta) {
      if (this.active) {
        let tmpSpeed = this.speed * delta;
        if (!this.skipMov) {
          this.x += tmpSpeed * Math.cos(this.dir);
          this.y += tmpSpeed * Math.sin(this.dir);
          this.range -= tmpSpeed;
          if (this.range <= 0) {
            this.x += this.range * Math.cos(this.dir);
            this.y += this.range * Math.sin(this.dir);
            this.active = false;
          }
        } else {
          this.skipMov = false;
        }
      }
    };
    this.target_update = function(time, first) {
      if (first)
        this.time = time;
      this.target = this.predict(first);
      if (this.target) {
        let x = this.x3, y = this.y3;
        let dist = UTILS.getDistance(x, y, this.target.x2 || this.target.x, this.target.y2 || this.target.y);
        this.estimated = Math.max(0, this.time - time + Math.max(1, Math.ceil(Math.max(0, dist - (this.target.getScale ? this.target.getScale() : this.target.scale)) / (this.speed * (1000 / 9)))));
      }
    };
    this.predict = function(first) {
      this.x2 = this.x;
      this.y2 = this.y;
      this.range2 = this.range;
      this.skipMov2 = first;
      if (!this.active)
        return;
      for (let a = 0;a < this.range + this.scale; a += this.speed) {
        let tmpSpeed = this.speed;
        let tmpScale;
        if (!this.skipMov2) {
          this.x2 += tmpSpeed * Math.cos(this.dir);
          this.y2 += tmpSpeed * Math.sin(this.dir);
          this.range2 -= tmpSpeed;
          if (this.range2 <= 0) {
            this.x2 += this.range2 * Math.cos(this.dir);
            this.y2 += this.range2 * Math.sin(this.dir);
            tmpSpeed = 1;
            this.range2 = 0;
          }
        } else {
          this.skipMov2 = false;
        }
        objectsHit.length = 0;
        for (let i = 0;i < players.length + ais.length; ++i) {
          tmpObj2 = players[i] || ais[i - players.length];
          if (tmpObj2.visible && (!this.owner.isPlayer || this.owner.sid !== tmpObj2.sid) && tmpObj2.sid !== this.owner.sid && !(this.owner.team && tmpObj2.team == this.owner.team)) {
            if (UTILS.lineInRect(tmpObj2.x2 - tmpObj2.scale, tmpObj2.y2 - tmpObj2.scale, tmpObj2.x2 + tmpObj2.scale, tmpObj2.y2 + tmpObj2.scale, this.x2, this.y2, this.x2 + tmpSpeed * Math.cos(this.dir), this.y2 + tmpSpeed * Math.sin(this.dir))) {
              objectsHit.push(tmpObj2);
            }
          }
        }
        let tmpList = objectManager.getGridArrays(this.x2, this.y2, this.scale);
        for (let x = 0;x < tmpList.length; ++x) {
          for (let y = 0;y < tmpList[x].length; ++y) {
            tmpObj2 = tmpList[x][y];
            tmpScale = tmpObj2.getScale();
            if (tmpObj2.active && !(this.owner.isItem && this.owner.owner.sid === tmpObj2.owner?.sid) && !(this.ignoreObj == tmpObj2.sid) && this.layer <= tmpObj2.layer && objectsHit.indexOf(tmpObj2) < 0 && !tmpObj2.ignoreCollision && UTILS.lineInRect(tmpObj2.x - tmpScale, tmpObj2.y - tmpScale, tmpObj2.x + tmpScale, tmpObj2.y + tmpScale, this.x2, this.y2, this.x2 + tmpSpeed * Math.cos(this.dir), this.y2 + tmpSpeed * Math.sin(this.dir))) {
              objectsHit.push(tmpObj2);
            }
          }
        }
        if (objectsHit.length > 0) {
          let hitObj = null;
          let shortDist = null;
          let tmpDist = null;
          for (let i = 0;i < objectsHit.length; ++i) {
            tmpDist = UTILS.getDistance(this.x2, this.y2, objectsHit[i].x, objectsHit[i].y);
            if (shortDist == null || tmpDist < shortDist) {
              shortDist = tmpDist;
              hitObj = objectsHit[i];
            }
          }
          return hitObj;
        }
      }
    };
  };
});

// bundle/src/js/data/projectileManager.js
var require_projectileManager = __commonJS((exports, module) => {
  module.exports = function(Projectile2, projectiles2, players, ais, objectManager, items2, config, UTILS, server) {
    this.addProjectile = function(x, y, dir, range, speed, indx, owner, ignoreObj, layer) {
      let tmpData = items2.projectiles[indx];
      let tmpProj;
      for (let i = 0;i < projectiles2.length; ++i) {
        if (!projectiles2[i].active) {
          tmpProj = projectiles2[i];
          break;
        }
      }
      if (!tmpProj) {
        for (let i = projectiles2.length - 1;i >= 0; --i) {
          if (!projectiles2[i].active) {
            projectiles2.splice(i, 1);
          }
        }
        tmpProj = new Projectile2(players, ais, objectManager, items2, config, UTILS, server);
        tmpProj.sid = projectiles2.length;
        projectiles2.push(tmpProj);
      }
      tmpProj.init(indx, x, y, dir, speed, tmpData.dmg, range, tmpData.scale, owner);
      tmpProj.ignoreObj = ignoreObj;
      tmpProj.layer = layer || tmpData.layer;
      tmpProj.src = tmpData.src;
      return tmpProj;
    };
  };
});

// bundle/src/js/data/aiManager.js
var require_aiManager = __commonJS((exports, module) => {
  module.exports = function(ais, AI, players, items2, objectManager, config, UTILS, scoreCallback, server) {
    this.aiTypes = [{
      id: 0,
      src: "cow_1",
      killScore: 150,
      health: 500,
      weightM: 0.8,
      speed: 0.00095,
      turnSpeed: 0.001,
      scale: 72,
      drop: ["food", 50]
    }, {
      id: 1,
      src: "pig_1",
      killScore: 200,
      health: 800,
      weightM: 0.6,
      speed: 0.00085,
      turnSpeed: 0.001,
      scale: 72,
      drop: ["food", 80]
    }, {
      id: 2,
      name: "Bull",
      src: "bull_2",
      hostile: true,
      dmg: 20,
      killScore: 1000,
      health: 1800,
      weightM: 0.5,
      speed: 0.00094,
      turnSpeed: 0.00074,
      scale: 78,
      viewRange: 800,
      chargePlayer: true,
      drop: ["food", 100]
    }, {
      id: 3,
      name: "Bully",
      src: "bull_1",
      hostile: true,
      dmg: 20,
      killScore: 2000,
      health: 2800,
      weightM: 0.45,
      speed: 0.001,
      turnSpeed: 0.0008,
      scale: 90,
      viewRange: 900,
      chargePlayer: true,
      drop: ["food", 400]
    }, {
      id: 4,
      name: "Wolf",
      src: "wolf_1",
      hostile: true,
      dmg: 8,
      killScore: 500,
      health: 300,
      weightM: 0.45,
      speed: 0.001,
      turnSpeed: 0.002,
      scale: 84,
      viewRange: 800,
      chargePlayer: true,
      drop: ["food", 200]
    }, {
      id: 5,
      name: "Quack",
      src: "chicken_1",
      dmg: 8,
      killScore: 2000,
      noTrap: true,
      health: 300,
      weightM: 0.2,
      speed: 0.0018,
      turnSpeed: 0.006,
      scale: 70,
      drop: ["food", 100]
    }, {
      id: 6,
      name: "MOOSTAFA",
      nameScale: 50,
      src: "enemy",
      hostile: true,
      dontRun: true,
      fixedSpawn: true,
      spawnDelay: 60000,
      noTrap: true,
      colDmg: 100,
      dmg: 40,
      killScore: 8000,
      health: 18000,
      weightM: 0.4,
      speed: 0.0007,
      turnSpeed: 0.01,
      scale: 80,
      spriteMlt: 1.8,
      leapForce: 0.9,
      viewRange: 1000,
      hitRange: 210,
      hitDelay: 1000,
      chargePlayer: true,
      drop: ["food", 100]
    }, {
      id: 7,
      name: "Treasure",
      hostile: true,
      nameScale: 35,
      src: "crate_1",
      fixedSpawn: true,
      spawnDelay: 120000,
      colDmg: 200,
      killScore: 5000,
      health: 20000,
      weightM: 0.1,
      speed: 0,
      turnSpeed: 0,
      scale: 70,
      spriteMlt: 1
    }, {
      id: 8,
      name: "MOOFIE",
      src: "wolf_2",
      hostile: true,
      fixedSpawn: true,
      dontRun: true,
      hitScare: 4,
      spawnDelay: 30000,
      noTrap: true,
      nameScale: 35,
      dmg: 10,
      colDmg: 100,
      killScore: 3000,
      health: 7000,
      weightM: 0.45,
      speed: 0.0015,
      turnSpeed: 0.002,
      scale: 90,
      viewRange: 800,
      chargePlayer: true,
      drop: ["food", 1000]
    }, {
      id: 9,
      name: "MOOFIE",
      src: "wolf_2",
      hostile: true,
      fixedSpawn: true,
      dontRun: true,
      hitScare: 50,
      spawnDelay: 60000,
      noTrap: true,
      nameScale: 35,
      dmg: 12,
      colDmg: 100,
      killScore: 3000,
      health: 9000,
      weightM: 0.45,
      speed: 0.0015,
      turnSpeed: 0.0025,
      scale: 94,
      viewRange: 1440,
      chargePlayer: true,
      drop: ["food", 3000],
      minSpawnRange: 0.85,
      maxSpawnRange: 0.9
    }, {
      id: 10,
      name: "Wolf",
      src: "wolf_1",
      hostile: true,
      fixedSpawn: true,
      dontRun: true,
      hitScare: 50,
      spawnDelay: 30000,
      dmg: 10,
      killScore: 700,
      health: 500,
      weightM: 0.45,
      speed: 0.00115,
      turnSpeed: 0.0025,
      scale: 88,
      viewRange: 1440,
      chargePlayer: true,
      drop: ["food", 400],
      minSpawnRange: 0.85,
      maxSpawnRange: 0.9
    }, {
      id: 11,
      name: "Bully",
      src: "bull_1",
      hostile: true,
      fixedSpawn: true,
      dontRun: true,
      hitScare: 50,
      dmg: 20,
      killScore: 5000,
      health: 5000,
      spawnDelay: 1e5,
      weightM: 0.45,
      speed: 0.00115,
      turnSpeed: 0.0025,
      scale: 94,
      viewRange: 1440,
      chargePlayer: true,
      drop: ["food", 800],
      minSpawnRange: 0.85,
      maxSpawnRange: 0.9
    }];
    this.spawn = function(x, y, dir, index) {
      var tmpObj2;
      for (var i = 0;i < ais.length; ++i) {
        if (!ais[i].active) {
          tmpObj2 = ais[i];
          break;
        }
      }
      if (!tmpObj2) {
        tmpObj2 = new AI(ais.length, objectManager, players, items2, UTILS, config, scoreCallback, server);
        ais.push(tmpObj2);
      }
      tmpObj2.init(x, y, dir, index, this.aiTypes[index]);
      return tmpObj2;
    };
  };
});

// bundle/src/js/data/ai.js
var require_ai = __commonJS((exports, module) => {
  var PI2 = Math.PI * 2;
  module.exports = function(sid, objectManager, players, items2, UTILS, config, scoreCallback, server) {
    this.sid = sid;
    this.isAI = true;
    this.nameIndex = UTILS.randInt(0, config.cowNames.length - 1);
    this.init = function(x, y, dir, index, data) {
      this.x = x;
      this.y = y;
      this.startX = data.fixedSpawn ? x : null;
      this.startY = data.fixedSpawn ? y : null;
      this.xVel = 0;
      this.yVel = 0;
      this.zIndex = 0;
      this.dir = dir;
      this.dirPlus = 0;
      this.index = index;
      this.src = data.src;
      if (data.name)
        this.name = data.name;
      this.weightM = data.weightM;
      this.speed = data.speed;
      this.killScore = data.killScore;
      this.turnSpeed = data.turnSpeed;
      this.scale = data.scale;
      this.maxHealth = data.health;
      this.leapForce = data.leapForce;
      this.health = this.maxHealth;
      this.chargePlayer = data.chargePlayer;
      this.viewRange = data.viewRange;
      this.drop = data.drop;
      this.dmg = data.dmg;
      this.hostile = data.hostile;
      this.dontRun = data.dontRun;
      this.hitRange = data.hitRange;
      this.hitDelay = data.hitDelay;
      this.hitScare = data.hitScare;
      this.spriteMlt = data.spriteMlt;
      this.nameScale = data.nameScale;
      this.colDmg = data.colDmg;
      this.noTrap = data.noTrap;
      this.spawnDelay = data.spawnDelay;
      this.hitWait = 0;
      this.waitCount = 1000;
      this.moveCount = 0;
      this.targetDir = 0;
      this.active = true;
      this.alive = true;
      this.runFrom = null;
      this.chargeTarget = null;
      this.dmgOverTime = {};
    };
    this.getVolcanoAggression = function() {
      let dist = UTILS.getDistance(this.x, this.y, config.volcanoLocationX, config.volcanoLocationY);
      let sub = dist > config.volcanoAggressionRadius ? 0 : config.volcanoAggressionRadius - dist;
      return 1 + config.volcanoAggressionPercentage * (1 - sub / config.volcanoAggressionRadius);
    };
    var timerCount = 0;
    this.update = function(delta = 1000 / 9) {
      if (this.visible) {
        timerCount -= delta;
        if (timerCount <= 0) {
          if (this.dmgOverTime.dmg) {
            this.dmgOverTime.time -= 1;
            if (this.dmgOverTime.time <= 0)
              this.dmgOverTime.dmg = 0;
          }
          timerCount = 1000;
        }
        this.x3 = this.x2;
        this.y3 = this.y2;
        let charging = false;
        let slowMlt = 1;
        if (!this.zIndex && !this.lockMove && this.y2 >= config.mapScale / 2 - config.riverWidth / 2 && this.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
          slowMlt = 0.33;
          this.xVel += config.waterCurrent * delta;
        }
        if (this.lockMove) {
          this.xVel = 0;
          this.yVel = 0;
        } else if (this.waitCount > 0) {
          this.waitCount -= delta;
          if (this.waitCount <= 0) {
            if (this.chargePlayer) {
              let tmpPlayer, bestDst, tmpDist;
              for (let i = 0;i < players.length; ++i) {
                if (players[i].alive && !(players[i].skin && players[i].skin.bullRepel)) {
                  tmpDist = UTILS.getDistance(this.x2, this.y2, players[i].x2, players[i].y2);
                  if (tmpDist <= this.viewRange && (!tmpPlayer || tmpDist < bestDst)) {
                    bestDst = tmpDist;
                    tmpPlayer = players[i];
                  }
                }
              }
              if (tmpPlayer) {
                this.chargeTarget = tmpPlayer;
                this.moveCount = UTILS.randInt(8000, 12000);
              } else {
                this.moveCount = UTILS.randInt(1000, 2000);
                this.targetDir = UTILS.randFloat(-Math.PI, Math.PI);
              }
            } else {
              this.moveCount = UTILS.randInt(4000, 1e4);
              this.targetDir = UTILS.randFloat(-Math.PI, Math.PI);
            }
          }
        } else if (this.moveCount > 0) {
          let tmpSpd = this.speed * slowMlt * this.getVolcanoAggression();
          if (this.runFrom && this.runFrom.active && !(this.runFrom.isPlayer && !this.runFrom.alive)) {
            this.targetDir = UTILS.getDirection(this.x, this.y, this.runFrom.x, this.runFrom.y);
            tmpSpd *= 1.42;
          } else if (this.chargeTarget && this.chargeTarget.alive) {
            this.targetDir = UTILS.getDirection(this.chargeTarget.x, this.chargeTarget.y, this.x, this.y);
            tmpSpd *= 1.75;
            charging = true;
          }
          if (this.hitWait) {
            tmpSpd *= 0.3;
          }
          if (this.d2 != this.targetDir) {
            this.d2 %= PI2;
            let netAngle = (this.d2 - this.targetDir + PI2) % PI2;
            let amnt = Math.min(Math.abs(netAngle - PI2), netAngle, this.turnSpeed * delta);
            let sign = netAngle - Math.PI >= 0 ? 1 : -1;
            this.d2 += sign * amnt + PI2;
          }
          this.d2 %= PI2;
          this.xVel += tmpSpd * delta * Math.cos(this.dir);
          this.yVel += tmpSpd * delta * Math.sin(this.dir);
          this.moveCount -= delta;
          if (this.moveCount <= 0) {
            this.runFrom = null;
            this.chargeTarget = null;
            this.waitCount = this.hostile ? 1500 : UTILS.randInt(1500, 6000);
          }
        }
        this.zIndex = 0;
        this.spikes = [];
        this.spike = 0;
        this.lockMove = false;
        let tmpList;
        let tmpSpeed = UTILS.getDistance(0, 0, this.xVel * delta, this.yVel * delta);
        let depth = Math.min(4, Math.max(1, Math.round(tmpSpeed / 40)));
        let tMlt = 1 / depth;
        const already = new Set;
        for (let i = 0;i < depth; ++i) {
          if (this.xVel)
            this.x3 += this.xVel * delta * tMlt;
          if (this.yVel)
            this.y3 += this.yVel * delta * tMlt;
          tmpList = objectManager.getGridArrays(this.x3, this.y3, this.scale);
          for (let x = 0;x < tmpList.length; ++x) {
            for (let y = 0;y < tmpList[x].length; ++y) {
              const obj = tmpList[x][y];
              if (!obj.active || already.has(obj.sid) || obj.sid > 1000000000000000 || obj.fake)
                continue;
              already.add(obj.sid);
              objectManager.checkCollision(this, tmpList[x][y], tMlt);
            }
          }
        }
        let hitting = false;
        let arr = objectManager.getGridArrays(this.x3, this.y3, this.scale);
        if (arr.length && !this.noTrap) {
          for (let x in arr)
            for (let y in arr[x]) {
              let obj = arr[x][y];
              if (obj.active && obj.isItem && obj.id === 15 && UTILS.getDistance(obj.x, obj.y, this.x2, this.y2) <= this.scale)
                this.lockMove = true;
            }
        }
        if (charging || hitting) {
          let tmpObj2, tmpDst, tmpDir;
          for (let i = 0;i < players.length; ++i) {
            tmpObj2 = players[i];
            if (tmpObj2 && tmpObj2.visible) {
              tmpDst = UTILS.getDistance(this.x3, this.y3, tmpObj2.x2, tmpObj2.y2);
              if (this.hitRange) {
                if (!this.hitWait && tmpDst <= this.hitRange + tmpObj2.scale) {
                  if (hitting) {
                    tmpDir = UTILS.getDirection(tmpObj2.x2, tmpObj2.y2, this.x3, this.y3);
                    tmpObj2.xVel += 0.6 * cos(tmpDir);
                    tmpObj2.yVel += 0.6 * sin(tmpDir);
                    this.runFrom = null;
                    this.chargeTarget = null;
                    this.waitCount = 3000;
                    this.hitWait = !UTILS.randInt(0, 2) ? 600 : 0;
                  } else
                    this.hitWait = this.hitDelay;
                }
              } else if (tmpDst <= this.scale + tmpObj2.scale + 15) {
                if (!this.lockMove) {
                  tmpDir = UTILS.getDirection(tmpObj2.x2, tmpObj2.y2, this.x3, this.y3);
                  tmpObj2.ai += this.dmg;
                  tmpObj2.xVel += 0.55 * Math.cos(tmpDir);
                  tmpObj2.yVel += 0.55 * Math.sin(tmpDir);
                }
              }
            }
          }
        }
        if (this.xVel)
          this.xVel *= Math.pow(config.playerDecel, delta);
        if (this.yVel)
          this.yVel *= Math.pow(config.playerDecel, delta);
        let tmpScale = this.scale;
        if (this.x3 - tmpScale < 0) {
          this.x3 = tmpScale;
          this.xVel = 0;
        } else if (this.x3 + tmpScale > config.mapScale) {
          this.x3 = config.mapScale - tmpScale;
          this.xVel = 0;
        }
        if (this.y3 - tmpScale < 0) {
          this.y3 = tmpScale;
          this.yVel = 0;
        } else if (this.y3 + tmpScale > config.mapScale) {
          this.y3 = config.mapScale - tmpScale;
          this.yVel = 0;
        }
      }
    };
    this.canSee = function(other) {
      if (!other)
        return false;
      if (other.skin && other.skin.invisTimer && other.noMovTimer >= other.skin.invisTimer)
        return false;
      var dx = Math.abs(other.x - this.x) - other.scale;
      var dy = Math.abs(other.y - this.y) - other.scale;
      return dx <= config.maxScreenWidth / 2 * 1.3 && dy <= config.maxScreenHeight / 2 * 1.3;
    };
    var tmpRatio = 0;
    var animIndex = 0;
    this.animate = function(delta) {
      if (this.animTime > 0) {
        this.animTime -= delta;
        if (this.animTime <= 0) {
          this.animTime = 0;
          this.dirPlus = 0;
          tmpRatio = 0;
          animIndex = 0;
        } else {
          if (animIndex == 0) {
            tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
            this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
            if (tmpRatio >= 1) {
              tmpRatio = 1;
              animIndex = 1;
            }
          } else {
            tmpRatio -= delta / (this.animSpeed * (1 - config.hitReturnRatio));
            this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
          }
        }
      }
    };
    this.startAnim = function() {
      this.animTime = this.animSpeed = 600;
      this.targetAngle = Math.PI * 0.8;
      tmpRatio = 0;
      animIndex = 0;
    };
    this.changeHealth = function(val, doer, runFrom) {
      if (this.active) {
        if (runFrom) {
          if (this.hitScare && !UTILS.randInt(0, this.hitScare)) {
            this.runFrom = runFrom;
            this.waitCount = 0;
            this.moveCount = 2000;
          } else if (this.hostile && this.chargePlayer && runFrom.isPlayer) {
            this.chargeTarget = runFrom;
            this.waitCount = 0;
            this.moveCount = 8000;
          } else if (!this.dontRun) {
            this.runFrom = runFrom;
            this.waitCount = 0;
            this.moveCount = 2000;
          }
        }
        if (val < 0 && this.hitRange && UTILS.randInt(0, 1))
          this.hitWait = 500;
        if (doer && doer.canSee && doer.canSee(this) && val < 0) {}
        if (this.health <= 0) {}
      }
    };
  };
});

// bundle/src/js/app.js
var import_token = __toESM(require_token(), 1);

// bundle/src/js/libs/io-client.js
var import_msgpack_lite = __toESM(require_browser(), 1);

// bundle/src/js/data/packets.js
var itemData = [
  ["id", "A"],
  ["d", "B"],
  ["1", "C"],
  ["2", "D"],
  ["4", "E"],
  ["33", "a"],
  ["5", "G"],
  ["6", "H"],
  ["a", "I"],
  ["aa", "J"],
  ["7", "K"],
  ["8", "L"],
  ["sp", "M"],
  ["9", "N"],
  ["h", "O"],
  ["11", "P"],
  ["12", "Q"],
  ["13", "R"],
  ["14", "S"],
  ["15", "T"],
  ["16", "U"],
  ["17", "V"],
  ["18", "X"],
  ["19", "Y"],
  ["20", "Z"],
  ["ac", "g"],
  ["ad", "1"],
  ["an", "2"],
  ["st", "3"],
  ["sa", "4"],
  ["us", "5"],
  ["ch", "6"],
  ["mm", "7"],
  ["t", "8"],
  ["p", "9"],
  ["pp", "0"]
];
var packetData = [
  ["sp", `M`],
  ["2", "D"],
  ["c", "F"],
  ["7", "K"],
  ["ch", "6"],
  ["6", "H"],
  ["13c", "c"],
  ["5", "z"],
  ["33", "9"],
  ["pp", "0"],
  ["8", "L"],
  ["9", "N"],
  ["10", "b"],
  ["11", "P"],
  ["12", "Q"],
  ["14", "P"],
  ["rmd", "e"]
];

// bundle/src/js/libs/io-client.js
var moveDirs = [undefined, 0, 0.79, 1.57, 2.36, 3.14, -2.36, -1.57, -0.79];
var packets = [['["0",[]]', [146, 161, 48, 144]], ['["M",[{"name":"","moofoll":true,"skin":0}]]', [146, 161, 77, 145, 131, 164, 110, 97, 109, 101, 160, 167, 109, 111, 111, 102, 111, 108, 108, 195, 164, 115, 107, 105, 110, 0]], ['["9",[3.14]]', [146, 161, 57, 145, 203, 64, 9, 30, 184, 81, 235, 133, 31]], ['["z",[10,null]]', [146, 161, 122, 146, 10, 192]], ['["F",[true,-0.0015926535897929917]]', [146, 161, 70, 146, 195, 203, 191, 90, 24, 18, 197, 63, 200, 0]], ['["F",[true,1.114221426347385]]', [146, 161, 70, 146, 195, 203, 63, 241, 211, 217, 216, 170, 161, 194]], ['["F",[true,-1.117406733526971]]', [146, 161, 70, 146, 195, 203, 191, 241, 224, 229, 226, 13, 65, 166]], ['["F",[false]]', [146, 161, 70, 145, 194]], ['["9",[-2.36]]', [146, 161, 57, 145, 203, 192, 2, 225, 71, 174, 20, 122, 225]], ['["F",[true,-5.5015926535897925]]', [146, 161, 70, 146, 195, 203, 192, 22, 1, 161, 129, 44, 83, 252]], ['["F",[true,-4.3857785736526145]]', [146, 161, 70, 146, 195, 203, 192, 17, 139, 9, 137, 213, 87, 143]], ['["F",[true,-6.617406733526971]]', [146, 161, 70, 146, 195, 203, 192, 26, 120, 57, 120, 131, 80, 105]], ['["9",[2.36]]', [146, 161, 57, 145, 203, 64, 2, 225, 71, 174, 20, 122, 225]], ['["F",[true,-0.7815926535897932]]', [146, 161, 70, 146, 195, 203, 191, 233, 2, 206, 152, 190, 200, 220]], ['["F",[true,-1.8974067335269713]]', [146, 161, 70, 146, 195, 203, 191, 254, 91, 199, 41, 187, 86, 34]], ['["9",[1.57]]', [146, 161, 57, 145, 203, 63, 249, 30, 184, 81, 235, 133, 31]], ['["F",[true,-1.571592653589793]]', [146, 161, 70, 146, 195, 203, 191, 249, 37, 62, 86, 156, 213, 17]], ['["F",[true,-0.455778573652615]]', [146, 161, 70, 146, 195, 203, 191, 221, 43, 121, 229, 3, 141, 116]], ['["F",[true,-2.687406733526971]]', [146, 161, 70, 146, 195, 203, 192, 5, 127, 207, 25, 252, 99, 98]], ['["9",[0.79]]', [146, 161, 57, 145, 203, 63, 233, 71, 174, 20, 122, 225, 72]], ['["F",[true,-2.351592653589793]]', [146, 161, 70, 146, 195, 203, 192, 2, 208, 15, 207, 37, 116, 198]], ['["F",[true,-3.467406733526971]]', [146, 161, 70, 146, 195, 203, 192, 11, 189, 63, 189, 211, 109, 160]], ['["9",[0]]', [146, 161, 57, 145, 0]], ['["F",[true,-3.141592653589793]]', [146, 161, 70, 146, 195, 203, 192, 9, 33, 251, 84, 68, 45, 24]], ['["F",[true,-2.025778573652615]]', [146, 161, 70, 146, 195, 203, 192, 0, 52, 203, 101, 150, 52, 62]], ['["F",[true,-4.257406733526971]]', [146, 161, 70, 146, 195, 203, 192, 17, 7, 149, 161, 121, 18, 249]], ['["z",[0,null]]', [146, 161, 122, 146, 0, 192]], ['["F",[true,0]]', [146, 161, 70, 146, 195, 0]], ['["K",[1]]', [146, 161, 75, 145, 1]], ['["K",[0]]', [146, 161, 75, 145, 0]], ['["H",[7]]', [146, 161, 72, 145, 7]], ['["z",[7,true]]', [146, 161, 122, 146, 7, 195]], ['["F",[true,-1.235778573652615]]', [146, 161, 70, 146, 195, 203, 191, 243, 197, 191, 192, 238, 247, 216]], ['["F",[true,0.33422142634738483]]', [146, 161, 70, 146, 195, 203, 63, 213, 99, 226, 67, 242, 53, 24]], ['["9",[-1.57]]', [146, 161, 57, 145, 203, 191, 249, 30, 184, 81, 235, 133, 31]], ['["9",[-0.79]]', [146, 161, 57, 145, 203, 191, 233, 71, 174, 20, 122, 225, 72]], ['["F",[true,-3.931592653589793]]', [146, 161, 70, 146, 195, 203, 192, 15, 115, 230, 217, 98, 229, 106]], ['["F",[true,-2.815778573652615]]', [146, 161, 70, 146, 195, 203, 192, 6, 134, 182, 234, 180, 236, 144]], ['["F",[true,-5.047406733526971]]', [146, 161, 70, 146, 195, 203, 192, 20, 48, 139, 100, 8, 111, 34]], ['["c",[1,11,1]]', [146, 161, 99, 147, 1, 11, 1]], ['["c",[0,11,1]]', [146, 161, 99, 147, 0, 11, 1]], ['["H",[17]]', [146, 161, 72, 145, 17]], ['["H",[31]]', [146, 161, 72, 145, 31]], ['["z",[15,null]]', [146, 161, 122, 146, 15, 192]], ['["F",[true,-1.64]]', [146, 161, 70, 146, 195, 203, 191, 250, 61, 112, 163, 215, 10, 61]], ['["H",[27]]', [146, 161, 72, 145, 27]], ['["z",[11,null]]', [146, 161, 122, 146, 11, 192]], ['["F",[true,-0.4301721243169718]]', [146, 161, 70, 146, 195, 203, 191, 219, 135, 240, 169, 101, 231, 68]], ['["H",[10]]', [146, 161, 72, 145, 10]], ['["z",[3,null]]', [146, 161, 122, 146, 3, 192]], ['["z",[6,null]]', [146, 161, 122, 146, 6, 192]], ['["F",[true,1.1398278756830282]]', [146, 161, 70, 146, 195, 203, 63, 242, 60, 188, 39, 146, 11, 78]], ['["F",[true,0.359827875683028]]', [146, 161, 70, 146, 195, 203, 63, 215, 7, 107, 127, 143, 219, 72]], ['["z",[10,true]]', [146, 161, 122, 146, 10, 195]], ['["z",[1,null]]', [146, 161, 122, 146, 1, 192]], ['["H",[38]]', [146, 161, 72, 145, 38]], ['["H",[28]]', [146, 161, 72, 145, 28]], ['["z",[12,null]]', [146, 161, 122, 146, 12, 192]], ['["F",[true,-4.360172124316971]]', [146, 161, 70, 146, 195, 203, 192, 17, 112, 208, 246, 27, 125, 44]], ['["H",[25]]', [146, 161, 72, 145, 25]], ['["z",[9,null]]', [146, 161, 122, 146, 9, 192]], ['["F",[true,-1.08]]', [146, 161, 70, 146, 195, 203, 191, 241, 71, 174, 20, 122, 225, 72]], ['["F",[true,-5.073013182862614]]', [146, 161, 70, 146, 195, 203, 192, 20, 74, 195, 247, 194, 73, 133]], ['["F",[true,-0.72]]', [146, 161, 70, 146, 195, 203, 191, 231, 10, 61, 112, 163, 215, 10]], ['["F",[true,-0.71]]', [146, 161, 70, 146, 195, 203, 191, 230, 184, 81, 235, 133, 30, 184]], ['["F",[true,-1.2101721243169719]]', [146, 161, 70, 146, 195, 203, 191, 243, 92, 221, 114, 7, 142, 76]], ['["F",[true,-3.4930131828626143]]', [146, 161, 70, 146, 195, 203, 192, 11, 241, 176, 229, 71, 34, 102]], ['["F",[true,-2.000172124316972]]', [146, 161, 70, 146, 195, 203, 192, 0, 0, 90, 62, 34, 127, 120]], ['["F",[true,-4.711592653589793]]', [146, 161, 70, 146, 195, 203, 192, 18, 216, 171, 190, 156, 247, 212]], ['["F",[true,-3.570172124316972]]', [146, 161, 70, 146, 195, 203, 192, 12, 143, 182, 103, 24, 66, 8]], ['["F",[true,-5.853013182862615]]', [146, 161, 70, 146, 195, 203, 192, 23, 105, 124, 73, 173, 206, 164]], ['["F",[true,-6.643013182862614]]', [146, 161, 70, 146, 195, 203, 192, 26, 146, 114, 12, 61, 42, 204]], ['["F",[true,-1.1430131828626142]]', [146, 161, 70, 146, 195, 203, 191, 242, 73, 200, 48, 244, 171, 50]], ['["F",[true,-2.97]]', [146, 161, 70, 146, 195, 203, 192, 7, 194, 143, 92, 40, 245, 195]], ['["F",[true,-3.03]]', [146, 161, 70, 146, 195, 203, 192, 8, 61, 112, 163, 215, 10, 61]], ['["F",[true,-1.9230131828626145]]', [146, 161, 70, 146, 195, 203, 191, 254, 196, 169, 120, 162, 191, 174]], ['["F",[true,-4.283013182862614]]', [146, 161, 70, 146, 195, 203, 192, 17, 33, 206, 53, 50, 237, 92]], ['["c",[1,40,0]]', [146, 161, 99, 147, 1, 40, 0]], ['["c",[1,6,0]]', [146, 161, 99, 147, 1, 6, 0]], ['["c",[1,57,0]]', [146, 161, 99, 147, 1, 57, 0]], ['["c",[1,15,0]]', [146, 161, 99, 147, 1, 15, 0]], ['["e",[]]', [146, 161, 101, 144]], ['["c",[0,0,1]]', [146, 161, 99, 147, 0, 0, 1]], ['["c",[1,12,0]]', [146, 161, 99, 147, 1, 12, 0]], ['["c",[0,12,0]]', [146, 161, 99, 147, 0, 12, 0]], ['["c",[1,31,0]]', [146, 161, 99, 147, 1, 31, 0]], ['["c",[1,53,0]]', [146, 161, 99, 147, 1, 53, 0]], ['["c",[1,7,0]]', [146, 161, 99, 147, 1, 7, 0]], ['["c",[0,7,0]]', [146, 161, 99, 147, 0, 7, 0]], ['["c",[0,40,0]]', [146, 161, 99, 147, 0, 40, 0]], ['["c",[0,6,0]]', [146, 161, 99, 147, 0, 6, 0]], ['["c",[1,21,0]]', [146, 161, 99, 147, 1, 21, 0]], ['["c",[0,0,0]]', [146, 161, 99, 147, 0, 0, 0]], ['["c",[1,26,0]]', [146, 161, 99, 147, 1, 26, 0]], ['["z",[22,null]]', [146, 161, 122, 146, 22, 192]], ['["F",[true,-0.31]]', [146, 161, 70, 146, 195, 203, 191, 211, 215, 10, 61, 112, 163, 215]], ['["F",[true,0.8]]', [146, 161, 70, 146, 195, 203, 63, 233, 153, 153, 153, 153, 153, 154]], ['["F",[true,0.82]]', [146, 161, 70, 146, 195, 203, 63, 234, 61, 112, 163, 215, 10, 61]], ['["F",[true,0.9]]', [146, 161, 70, 146, 195, 203, 63, 236, 204, 204, 204, 204, 204, 205]], ['["F",[true,1]]', [146, 161, 70, 146, 195, 1]], ['["F",[true,2.1]]', [146, 161, 70, 146, 195, 203, 64, 0, 204, 204, 204, 204, 204, 205]], ['["F",[true,2.11]]', [146, 161, 70, 146, 195, 203, 64, 0, 225, 71, 174, 20, 122, 225]], ['["c",[1,19,1]]', [146, 161, 99, 147, 1, 19, 1]], ['["c",[0,31,0]]', [146, 161, 99, 147, 0, 31, 0]], ['["c",[1,13,1]]', [146, 161, 99, 147, 1, 13, 1]], ['["9",[null]]', [146, 161, 57, 145, 192]], ['["F",[true,-3.5957785736526153]]', [146, 161, 70, 146, 195, 203, 192, 12, 196, 39, 142, 139, 246, 206]], ['["F",[true,-5.8274067335269715]]', [146, 161, 70, 146, 195, 203, 192, 23, 79, 67, 181, 243, 244, 65]], ['["F",[true,-2.713013182862614]]', [146, 161, 70, 146, 195, 203, 192, 5, 180, 64, 65, 112, 24, 40]], ['["F",[true,-2.790172124316972]]', [146, 161, 70, 146, 195, 203, 192, 6, 82, 69, 195, 65, 55, 202]], ['["F",[true,-1.27]]', [146, 161, 70, 146, 195, 203, 191, 244, 81, 235, 133, 30, 184, 82]], ['["F",[true,0.32619719971186334]]', [146, 161, 70, 146, 195, 203, 63, 212, 224, 106, 56, 51, 202, 124]], ['["F",[true,2.85]]', [146, 161, 70, 146, 195, 203, 64, 6, 204, 204, 204, 204, 204, 205]], ['["F",[true,-1.05]]', [146, 161, 70, 146, 195, 203, 191, 240, 204, 204, 204, 204, 204, 205]], ['["F",[true,-2.49]]', [146, 161, 70, 146, 195, 203, 192, 3, 235, 133, 30, 184, 81, 236]], ['["F",[true,-2.7]]', [146, 161, 70, 146, 195, 203, 192, 5, 153, 153, 153, 153, 153, 154]], ['["F",[true,0.5044412918686716]]', [146, 161, 70, 146, 195, 203, 63, 224, 36, 98, 16, 106, 126, 114]], ['["F",[true,-0.6093263851770893]]', [146, 161, 70, 146, 195, 203, 191, 227, 127, 154, 12, 29, 157, 173]], ['["F",[true,-0.8544704955615343]]', [146, 161, 70, 146, 195, 203, 191, 235, 87, 210, 130, 58, 173, 178]], ['["F",[true,-0.7235448477355768]]', [146, 161, 70, 146, 195, 203, 191, 231, 39, 71, 134, 70, 213, 212]], ['["F",[true,-0.9314316794980295]]', [146, 161, 70, 146, 195, 203, 191, 237, 206, 73, 207, 60, 224, 98]], ['["F",[true,0.20005437784130398]]', [146, 161, 70, 146, 195, 203, 63, 201, 155, 97, 193, 32, 0, 232]], ['["F",[true,-0.857997617127943]]', [146, 161, 70, 146, 195, 203, 191, 235, 116, 183, 107, 51, 136, 195]], ['["F",[true,-0.88]]', [146, 161, 70, 146, 195, 203, 191, 236, 40, 245, 194, 143, 92, 41]], ['["F",[true,-0.73]]', [146, 161, 70, 146, 195, 203, 191, 231, 92, 40, 245, 194, 143, 92]], ['["F",[true,-0.47]]', [146, 161, 70, 146, 195, 203, 191, 222, 20, 122, 225, 71, 174, 20]], ['["F",[true,0.33]]', [146, 161, 70, 146, 195, 203, 63, 213, 30, 184, 81, 235, 133, 31]], ['["F",[true,1.5537374805692379]]', [146, 161, 70, 146, 195, 203, 63, 248, 220, 27, 213, 25, 212, 57]], ['["F",[true,3.5746076624589085]]', [146, 161, 70, 146, 195, 203, 64, 12, 152, 203, 230, 242, 86, 14]], ['["F",[true,2.66669804445068]]', [146, 161, 70, 146, 195, 203, 64, 5, 85, 101, 200, 201, 200, 88]], ['["F",[true,3.141592653589793]]', [146, 161, 70, 146, 195, 203, 64, 9, 33, 251, 84, 68, 45, 24]], ['["F",[true,2.4440190523413485]]', [146, 161, 70, 146, 195, 203, 64, 3, 141, 89, 220, 100, 219, 37]], ['["F",[true,2.114823073437291]]', [146, 161, 70, 146, 195, 203, 64, 0, 235, 40, 92, 9, 234, 59]], ['["F",[true,1.2669797312410964]]', [146, 161, 70, 146, 195, 203, 63, 244, 69, 140, 137, 230, 1, 141]], ['["H",[5]]', [146, 161, 72, 145, 5]], ['["H",[23]]', [146, 161, 72, 145, 23]], ['["c",[0,19,1]]', [146, 161, 99, 147, 0, 19, 1]], ['["F",[true,1.48]]', [146, 161, 70, 146, 195, 203, 63, 247, 174, 20, 122, 225, 71, 174]], ['["F",[true,-0.5]]', [146, 161, 70, 146, 195, 203, 191, 224, 0, 0, 0, 0, 0, 0]], ['["F",[true,-0.84]]', [146, 161, 70, 146, 195, 203, 191, 234, 225, 71, 174, 20, 122, 225]], ['["c",[1,18,1]]', [146, 161, 99, 147, 1, 18, 1]], ['["F",[true,-1.8]]', [146, 161, 70, 146, 195, 203, 191, 252, 204, 204, 204, 204, 204, 205]], ['["6",["break the trap"]]', [146, 161, 54, 145, 174, 98, 114, 101, 97, 107, 32, 116, 104, 101, 32, 116, 114, 97, 112]], ['["F",[true,-0.93]]', [146, 161, 70, 146, 195, 203, 191, 237, 194, 143, 92, 40, 245, 195]], ['["F",[true,-0.79]]', [146, 161, 70, 146, 195, 203, 191, 233, 71, 174, 20, 122, 225, 72]], ['["F",[true,-1.2566370614359172]]', [146, 161, 70, 146, 195, 203, 191, 244, 27, 47, 118, 156, 240, 224]], ['["F",[true,-1.5177817583356568]]', [146, 161, 70, 146, 195, 203, 191, 248, 72, 213, 134, 104, 69, 184]], ['["z",[5,true]]', [146, 161, 122, 146, 5, 195]], ['["F",[true,-2.4886185294742433]]', [146, 161, 70, 146, 195, 203, 192, 3, 232, 176, 212, 226, 125, 237]]];
packets = new Map(packets.map(([key, arr]) => [key, new Uint8Array(arr)]));
console.log("Packet cache:", packets);
var { isPrivate, isProxy } = window;
isPrivate && console.log("Loading to private server!");
var io_client_default = {
  socket: null,
  connected: false,
  socketId: -1,
  pps: [],
  full: 0,
  connect: function(address, callback, events) {
    if (this.socket)
      return;
    const _this = this;
    try {
      let socketError2 = false;
      this.socket = new WebSocket(address);
      this.socket.binaryType = "arraybuffer";
      this.socket.onmessage = function(message) {
        const data = isPrivate || isProxy ? message.data : new Uint8Array(message.data);
        const parsed = isPrivate || isProxy ? JSON.parse(data) : import_msgpack_lite.default.decode(data);
        const type = isPrivate ? parsed[0] : isProxy && parsed.type === "packet" ? itemData.find((pair) => pair[1] === parsed.data[0])?.[0] : itemData.find((pair) => pair[1] === parsed[0])?.[0] || parsed[0];
        const eventData = isProxy && parsed.type === "packet" ? parsed.data[1] : parsed[1];
        if (isProxy && parsed.type !== "packet") {
          if (parsed.type === "ping") {
            _this.ping = parsed.value;
          } else if (parsed.type === "pong") {
            _this.full = Date.now() - _this.fullSent;
          } else
            console.log(parsed);
        }
        if (type === "io-init") {
          _this.socketId = eventData[0];
        } else if (events[type]) {
          events[type].apply(undefined, eventData);
        }
      };
      this.socket.onopen = function() {
        _this.connected = true;
        console.log("ws open");
        callback();
      };
      this.socket.onclose = function(e) {
        _this.close();
        console.log("ws close", e.code);
        callback("disconnected");
      };
      this.socket.onerror = function(e) {
        console.log("ws error");
        if (!socketError2) {
          socketError2 = true;
          _this.close();
          callback(e);
        }
      };
    } catch (e) {
      if (!socketError) {
        socketError = true;
        _this.close();
        callback(e);
      }
    }
  },
  send: function(type) {
    if (this.socket && this.socket.readyState === 1) {
      for (let packet of this.pps) {
        if (Date.now() - packet >= 1000)
          this.pps.shift();
      }
      if (this.pps.length >= 115)
        return console.log("PACKET LIMIT");
      this.pps.push(Date.now());
      let shouldCache = false;
      let isMov = false;
      if (type !== "2") {
        if (type === "33") {
          isMov = true;
          if (moveDirs.includes(arguments[1]))
            shouldCache = true;
        } else {
          shouldCache = true;
        }
      }
      console.log("sent", ...arguments);
      if (window.DEBUG)
        console.trace();
      const packetType = packetData.find((pair) => pair[0] === type)[1];
      const data = Array.prototype.slice.call(arguments, 1);
      if (isProxy) {
        this.socket.send(JSON.stringify({ type: "send", data: [packetType, ...data] }));
        return true;
      }
      const cacheKey = shouldCache ? JSON.stringify([packetType, data]) : null;
      window.packets = packets;
      let binary;
      if (isPrivate) {
        binary = JSON.stringify([type, data]);
      } else if (cacheKey && packets.has(cacheKey)) {
        binary = new Uint8Array(packets.get(cacheKey));
      } else {
        binary = import_msgpack_lite.default.encode([packetType, data]);
        if (cacheKey)
          packets.set(cacheKey, binary);
      }
      isMov && console.log(...arguments, Array.from(binary));
      this.socket.send(binary);
      return true;
    }
  },
  close: function() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.connected = false;
    }
  }
};

// bundle/src/js/app.js
var import_utils = __toESM(require_utils(), 1);
var import_animText = __toESM(require_animText(), 1);

// bundle/src/js/config.js
var { isPrivate: isPrivate2 } = window;
var maxScreenWidth = 1920;
var maxScreenHeight = 1080;
var serverUpdateRate = 9;
var maxPlayers = 50;
var maxPlayersHard = 50;
var collisionDepth = 6;
var minimapRate = 3000;
var colGrid = 10;
var clientSendRate = 5;
var healthBarWidth = 50;
var healthBarPad = 4.5;
var iconPadding = 15;
var iconPad = 0.9;
var deathFadeout = 3000;
var crownIconScale = 60;
var crownPad = 35;
var chatCountdown = 3000;
var chatCooldown = 500;
var inSandbox = location.href.includes("sandbox");
var maxAge = 100;
var gatherAngle = Math.PI / 2.6;
var gatherWiggle = 10;
var hitReturnRatio = 0.25;
var hitAngle = Math.PI / 3;
var playerScale = 35;
var playerSpeed = 0.0016;
var playerDecel = 0.993;
var nameY = 34;
var skinColors = [
  "#bf8f54",
  "#cbb091",
  "#896c4b",
  "#fadadc",
  "#ececec",
  "#c37373",
  "#4c4c4c",
  "#ecaff7",
  "#738cc3",
  "#8bc373"
];
var animalCount = 7;
var aiTurnRandom = 0.06;
var cowNames = [
  "Sid",
  "Steph",
  "Bmoe",
  "Romn",
  "Jononthecool",
  "Fiona",
  "Vince",
  "Nathan",
  "Nick",
  "Flappy",
  "Ronald",
  "Otis",
  "Pepe",
  "Mc Donald",
  "Theo",
  "Fabz",
  "Oliver",
  "Jeff",
  "Jimmy",
  "Helena",
  "Reaper",
  "Ben",
  "Alan",
  "Naomi",
  "XYZ",
  "Clever",
  "Jeremy",
  "Mike",
  "Destined",
  "Stallion",
  "Allison",
  "Meaty",
  "Sophia",
  "Vaja",
  "Joey",
  "Pendy",
  "Murdoch",
  "Theo",
  "Jared",
  "July",
  "Sonia",
  "Mel",
  "Dexter",
  "Quinn",
  "Milky"
];
var shieldAngle = Math.PI / 3;
var weaponVariants = [{
  id: 0,
  src: "",
  xp: 0,
  val: 1
}, {
  id: 1,
  src: "_g",
  xp: 3000,
  val: 1.1
}, {
  id: 2,
  src: "_d",
  xp: 7000,
  val: 1.18
}, {
  id: 3,
  src: "_r",
  poison: true,
  xp: 12000,
  val: 1.18
}, {
  id: 4,
  src: "_r",
  poison: true,
  xp: 12000,
  val: 1.18
}];
var fetchVariant = function(player) {
  var tmpXP = player.weaponXP[player.weaponIndex] || 0;
  for (var i = weaponVariants.length - 1;i >= 0; --i) {
    if (tmpXP >= weaponVariants[i].xp)
      return weaponVariants[i];
  }
};
var resourceTypes = ["wood", "food", "stone", "points"];
var areaCount = 7;
var treesPerArea = 9;
var bushesPerArea = 3;
var totalRocks = 32;
var goldOres = 7;
var riverWidth = isPrivate2 ? 0 : 724;
var riverPadding = 114;
var waterCurrent = 0.0011;
var waveSpeed = 0.0001;
var waveMax = 1.3;
var treeScales = [150, 160, 165, 175];
var bushScales = [80, 85, 95];
var rockScales = [80, 85, 90];
var snowBiomeTop = isPrivate2 ? 0 : 2400;
var snowSpeed = 0.75;
var maxNameLength = 15;
var mapScale = isPrivate2 ? 1440 * 2 : 14400;
var mapPingScale = 40;
var mapPingTime = 2200;
var volcanoScale = 320;
var innerVolcanoScale = 100;
var volcanoAnimalStrength = 2;
var volcanoAnimationDuration = 3200;
var volcanoAggressionRadius = isPrivate2 ? 0 : 1440;
var volcanoAggressionPercentage = 0.2;
var volcanoDamagePerSecond = -1;
var volcanoLocationX = mapScale - volcanoScale - 120;
var volcanoLocationY = mapScale - volcanoScale - 120;
var config_default = {
  maxScreenWidth,
  maxScreenHeight,
  serverUpdateRate,
  maxPlayers,
  maxPlayersHard,
  collisionDepth,
  minimapRate,
  colGrid,
  clientSendRate,
  healthBarWidth,
  healthBarPad,
  iconPadding,
  iconPad,
  deathFadeout,
  crownIconScale,
  crownPad,
  chatCountdown,
  chatCooldown,
  inSandbox,
  maxAge,
  gatherAngle,
  gatherWiggle,
  hitReturnRatio,
  hitAngle,
  playerScale,
  playerSpeed,
  playerDecel,
  nameY,
  skinColors,
  animalCount,
  aiTurnRandom,
  cowNames,
  shieldAngle,
  weaponVariants,
  fetchVariant,
  resourceTypes,
  areaCount,
  treesPerArea,
  bushesPerArea,
  totalRocks,
  goldOres,
  riverWidth,
  riverPadding,
  waterCurrent,
  waveSpeed,
  waveMax,
  treeScales,
  bushScales,
  rockScales,
  snowBiomeTop,
  snowSpeed,
  maxNameLength,
  mapScale,
  mapPingScale,
  mapPingTime,
  volcanoScale,
  innerVolcanoScale,
  volcanoAnimalStrength,
  volcanoAnimationDuration,
  volcanoAggressionRadius,
  volcanoAggressionPercentage,
  volcanoDamagePerSecond,
  volcanoLocationX,
  volcanoLocationY
};

// bundle/src/js/app.js
var import_gameObject = __toESM(require_gameObject(), 1);
var import_items = __toESM(require_items(), 1);
var import_objectManager = __toESM(require_objectManager(), 1);
var import_player = __toESM(require_player(), 1);
var import_store = __toESM(require_store(), 1);
var import_projectile = __toESM(require_projectile(), 1);
var import_projectileManager = __toESM(require_projectileManager(), 1);
var import_aiManager = __toESM(require_aiManager(), 1);
var import_ai = __toESM(require_ai(), 1);

// bundle/src/js/data/gap.js
var WorkerCode = `
const { sqrt, atan2, cos, sin, abs, pow, PI } = Math;

const config = { playerSpeed: 0.0016, playerDecel: 0.993 };

function dist(x1,y1,x2,y2){return sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))}
function dir(x1,y1,x2,y2){return atan2(y1-y2,x1-x2)}

function collision(p,o){
    let dx=p.x-o.x,dy=p.y-o.y,r=p.scale+o.scale;
    if(abs(dx)<=r||abs(dy)<=r){
        let d=sqrt(dx*dx+dy*dy)-r;
        if(d<=0){
            let a=dir(p.x,p.y,o.x,o.y);
            p.x=o.x+r*cos(a);
            p.y=o.y+r*sin(a);
            p.xVel*=0.75;
            p.yVel*=0.75;
            return true;
        }
    }
    return false;
}

function update(p,objects,delta,spdMult){
    let vx=cos(p.moveDir||0),vy=sin(p.moveDir||0);
    let l=sqrt(vx*vx+vy*vy)||1;
    p.xVel+=vx/l*config.playerSpeed*spdMult*delta;
    p.yVel+=vy/l*config.playerSpeed*spdMult*delta;

    let depth=Math.min(4,Math.max(1,Math.round(dist(0,0,p.xVel*delta,p.yVel*delta)/40)));
    let t=1/depth;

    for(let i=0;i<depth;i++){
        p.x+=p.xVel*delta*t;
        p.y+=p.yVel*delta*t;
        for(let o of objects) collision(p,o);
    }

    p.xVel*=pow(config.playerDecel,delta);
    p.yVel*=pow(config.playerDecel,delta);
}

function cross(gap,angle,spdMult){
    const DELTA=1000/9;

    let p={x:500,y:500,xVel:0,yVel:0,scale:35,moveDir:PI+angle};
    let bx=500-(gap+45*2);

    let objs=[
        {x:bx,y:500-gap/2-45,scale:45},
        {x:bx,y:500+gap/2+45,scale:45}
    ];

    for(let i=0;i<10;i++) update(p,objs,DELTA,spdMult);

    let min=objs[0].y+45,max=objs[1].y-45;

    return p.x<bx-45-5 && p.y>=min-35 && p.y<=max+35;
}

onmessage=e=>{
    let { spdMult } = e.data;

    for(let gap=0;gap<=80;gap+=0.1){
        for(let a=-PI/4;a<=PI/4;a+=0.005){
            if(cross(gap,a,spdMult)){
                postMessage(gap);
                return;
            }
        }
    }
    postMessage(70);
};
`;
var url = "data:application/javascript;base64," + btoa(WorkerCode);
var wk = new Worker(url);
function getGap(spdMult) {
  return new Promise((res) => {
    wk.onmessage = (e) => res(e.data);
    wk.postMessage({ spdMult });
  });
}

// bundle/src/js/data/pathfinder.js
var WorkerCode2 = `
const NEIGHBOR_X = [-1, 0, 1, 1, 1, 0, -1, -1];
const NEIGHBOR_Y = [-1, -1, -1, 0, 1, 1, 1, 0];
const DIAGONAL_COST = 1.41421356237;
const TRAVERSAL_COST = 1;
const SQRT2_MINUS_1 = 0.41421356237;

function snapToFree(index, costs, w, h) {
    if (costs[index] !== 255) {
        const x = index % w, y = (index / w) | 0;
        for (let d = 0; d < 8; d++) {
            const nx = x + NEIGHBOR_X[d], ny = y + NEIGHBOR_Y[d];
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                if (costs[ny * w + nx] !== 255) return index;
            }
        }
    }

    const visited = new Uint8Array(w * h);
    const queue = [index];
    visited[index] = 1;
    let head = 0;

    while (head < queue.length) {
        const cur = queue[head++];
        const cx = cur % w, cy = (cur / w) | 0;

        for (let d = 0; d < 8; d++) {
            const nx = cx + NEIGHBOR_X[d], ny = cy + NEIGHBOR_Y[d];
            if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
            const ni = ny * w + nx;
            if (visited[ni]) continue;
            visited[ni] = 1;

            if (costs[ni] !== 255) {
                for (let d2 = 0; d2 < 8; d2++) {
                    const nnx = nx + NEIGHBOR_X[d2], nny = ny + NEIGHBOR_Y[d2];
                    if (nnx >= 0 && nnx < w && nny >= 0 && nny < h) {
                        if (costs[nny * w + nnx] !== 255) {
                            return ni;
                        }
                    }
                }
            }

            queue.push(ni);
        }
    }

    return index;
}

function lineOfSight(x0, y0, x1, y1, costs, w, h) {
    let dx = x1 - x0;
    let dy = y1 - y0;

    let sx = dx > 0 ? 1 : -1;
    let sy = dy > 0 ? 1 : -1;

    dx = dx > 0 ? dx : -dx;
    dy = dy > 0 ? dy : -dy;

    let err = dx - dy;

    let x = x0;
    let y = y0;

    let idx = y * w + x;
    let stepX = sx;
    let stepY = sy * w;

    while (true) {
        if (costs[idx] === 255) return false;
        if (x === x1 && y === y1) return true;

        let e2 = err << 1;

        if (e2 > -dy) {
            err -= dy;
            x += sx;
            idx += stepX;
        }
        if (e2 < dx) {
            err += dx;
            y += sy;
            idx += stepY;
        }
    }
}

function getCost(x0, y0, x1, y1, costs, w, h) {
    let dx = x1 - x0;
    let dy = y1 - y0;

    let sx = dx > 0 ? 1 : -1;
    let sy = dy > 0 ? 1 : -1;

    dx = dx > 0 ? dx : -dx;
    dy = dy > 0 ? dy : -dy;

    let err = dx - dy;

    let x = x0;
    let y = y0;

    let idx = y * w + x;
    let stepX = sx;
    let stepY = sy * w;

    let totalCost = 0;
    let steps = 0;

    while (true) {
        let cellCost = costs[idx];
        if (cellCost === 255) return Infinity;

        if (cellCost > 0) {
            totalCost += cellCost;
            steps++;
        }

        if (x === x1 && y === y1) break;

        let e2 = err << 1;

        if (e2 > -dy) {
            err -= dy;
            x += sx;
            idx += stepX;
        }
        if (e2 < dx) {
            err += dx;
            y += sy;
            idx += stepY;
        }
    }

    let dx2 = x1 - x0;
    let dy2 = y1 - y0;
    let dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);

    if (steps === 0) return dist;

    let avgCost = totalCost / steps;
    return dist * (1 + avgCost / 50);
}

self.onmessage = (msg) => {
    let costs, velocities, w, h, totalCells;
    let endpointIndices = new Uint32Array(10);
    let endpointCount = 0;

    if (msg.data.costs) {
        costs = new Uint8Array(msg.data.costs);
        velocities = new Float32Array(msg.data.velocities);
        w = msg.data.width;
        h = msg.data.height;
        totalCells = w * h;

        if (msg.data.endpoints && msg.data.endpoints.length > 0) {
            for (let i = 0; i < Math.min(msg.data.endpoints.length, 10); i++) {
                endpointIndices[endpointCount++] = msg.data.endpoints[i];
            }
        }
    } else {
        let bitmap = msg.data.bitmap;
        velocities = msg.data.velocities;
        w = bitmap.width;
        h = bitmap.height;
        totalCells = w * h;

        let canvas = new OffscreenCanvas(w, h);
        let ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(bitmap, 0, 0);
        ctx.clearRect(Math.floor(w/2), Math.floor(h/2), 1, 1);

        let imageData = ctx.getImageData(0, 0, w, h);
        let data = imageData.data;
        bitmap.close();

        costs = new Uint8Array(totalCells);
        for(let i = 0; i < totalCells; i++){
            costs[i] = data[i << 2];
            if(data[(i << 2) + 2] && endpointCount < 10) {
                endpointIndices[endpointCount++] = i;
            }
        }
    }

    let gScores = new Float32Array(totalCells).fill(Infinity);
    let hScores = new Float32Array(totalCells).fill(Infinity);
    let parents = new Int32Array(totalCells).fill(-1);
    let closed = new Uint8Array(totalCells);
    let inOpen = new Uint8Array(totalCells);

    let centerIndex = ((h >> 1) * w + (w >> 1)) | 0;
    if(endpointCount === 0) {
        endpointIndices[0] = centerIndex;
        endpointCount = 1;
    }

    centerIndex = snapToFree(centerIndex, costs, w, h);
    for (let i = 0; i < endpointCount; i++) {
        endpointIndices[i] = snapToFree(endpointIndices[i], costs, w, h);
    }

    let openHeap = new Int32Array(totalCells);
    let heapSize = 0;
    gScores[centerIndex] = 0;

    let startX = centerIndex % w, startY = (centerIndex / w) | 0;

    let ei = endpointIndices[0], ex = ei % w, ey = (ei / w) | 0;
    let dx = Math.abs(startX - ex), dy = Math.abs(startY - ey);
    let minH = (dx > dy) ? dx + SQRT2_MINUS_1 * dy : dy + SQRT2_MINUS_1 * dx;
    hScores[centerIndex] = minH;
    openHeap[heapSize++] = centerIndex;
    inOpen[centerIndex] = 1;

    let currentIndex = -1, iterations = 0;

    while(heapSize > 0 && iterations++ < totalCells){
    currentIndex = openHeap[0];
    closed[currentIndex] = 1;
    inOpen[currentIndex] = 0;
    openHeap[0] = openHeap[--heapSize];

    if (iterations > 50000) {
        // Searched too many cells, use best path found so far
        let lowestF = Infinity, bestIndex = currentIndex;
        for(let i = 0; i < totalCells; i++) {
            if(closed[i]) {
                let f = gScores[i] + hScores[i];
                if(f < lowestF) {
                    lowestF = f;
                    bestIndex = i;
                }
            }
        }
        currentIndex = bestIndex;
        break;
    }

        if(heapSize > 0){
            let idx = 0;
            while(true){
                let left = (idx << 1) + 1, right = left + 1, smallest = idx;
                let smallestF = gScores[openHeap[idx]] + hScores[openHeap[idx]];
                if(left < heapSize && gScores[openHeap[left]] + hScores[openHeap[left]] < smallestF)
                    { smallest = left; smallestF = gScores[openHeap[left]] + hScores[openHeap[left]]; }
                if(right < heapSize && gScores[openHeap[right]] + hScores[openHeap[right]] < smallestF)
                    smallest = right;
                if(smallest === idx) break;
                [openHeap[idx], openHeap[smallest]] = [openHeap[smallest], openHeap[idx]];
                idx = smallest;
            }
        }

        let reachedGoal = false;
        for(let i = 0; i < endpointCount; i++)
            if(currentIndex === endpointIndices[i]) { reachedGoal = true; break; }
        if(reachedGoal) break;

        let currentX = currentIndex % w, currentY = (currentIndex / w) | 0;
        let currentG = gScores[currentIndex], currentParent = parents[currentIndex];

        for(let i = 0; i < 8; i++){
            let nx = currentX + NEIGHBOR_X[i], ny = currentY + NEIGHBOR_Y[i];
            if(nx < 0 || nx >= w || ny < 0 || ny >= h) continue;

            let neighborIndex = ny * w + nx;
            if(closed[neighborIndex] || costs[neighborIndex] === 255) continue;

            let tentativeG, newParent;

            if(currentParent !== -1) {
                let parentX = currentParent % w, parentY = (currentParent / w) | 0;
                if(lineOfSight(parentX, parentY, nx, ny, costs, w, h)) {
                    tentativeG = gScores[currentParent] + getCost(parentX, parentY, nx, ny, costs, w, h);
                    newParent = currentParent;
                } else {
                    let isDiagonal = (i & 1) === 0;
                    let baseCost = isDiagonal ? DIAGONAL_COST : TRAVERSAL_COST;
                    let costMultiplier = costs[neighborIndex] > 0 ? 1 + (costs[neighborIndex] / 50) : 1;
                    tentativeG = currentG + baseCost * costMultiplier;
                    newParent = currentIndex;
                }
            } else {
                let isDiagonal = (i & 1) === 0;
                let baseCost = isDiagonal ? DIAGONAL_COST : TRAVERSAL_COST;
                let costMultiplier = costs[neighborIndex] > 0 ? 1 + (costs[neighborIndex] / 50) : 1;
                tentativeG = currentG + baseCost * costMultiplier;
                newParent = currentIndex;
            }

            let velIdx = neighborIndex * 2;
            let cellVelX = velocities[velIdx], cellVelY = velocities[velIdx + 1];

            if(cellVelX !== 0 || cellVelY !== 0) {
                let dirX = nx - currentX, dirY = ny - currentY;
                let dirLen = Math.hypot(dirX, dirY);
                if(dirLen > 0) { dirX /= dirLen; dirY /= dirLen; }

                let velDot = cellVelX * dirX + cellVelY * dirY;
                let velMag = Math.hypot(cellVelX, cellVelY);

                if(velDot > 0.2 && velMag > 0.1) {
                    let speedBonus = velMag * velDot;
                    let reduction = Math.min(speedBonus * 100, tentativeG * 0.999);
                    tentativeG = Math.max(0.00001, tentativeG - reduction);
                } else if(velDot < -0.3) {
                    tentativeG = tentativeG * 10;
                }
            }

            if(tentativeG < gScores[neighborIndex]){
                parents[neighborIndex] = newParent;
                gScores[neighborIndex] = tentativeG;

                minH = Infinity;
                for(let j = 0; j < endpointCount; j++){
                    let ei = endpointIndices[j], ex = ei % w, ey = (ei / w) | 0;
                    let dx = Math.abs(nx - ex), dy = Math.abs(ny - ey);
                    let h = (dx > dy) ? dx + SQRT2_MINUS_1 * dy : dy + SQRT2_MINUS_1 * dx;
                    if(h < minH) minH = h;
                }
                hScores[neighborIndex] = minH;

                if(!inOpen[neighborIndex]){
                    let pos = heapSize++;
                    openHeap[pos] = neighborIndex;
                    inOpen[neighborIndex] = 1;
                    let nf = tentativeG + minH;
                    while(pos > 0){
                        let parent = ((pos - 1) >> 1);
                        if(nf >= gScores[openHeap[parent]] + hScores[openHeap[parent]]) break;
                        [openHeap[pos], openHeap[parent]] = [openHeap[parent], neighborIndex];
                        pos = parent;
                    }
                }
            }
        }
    }

    if(currentIndex === -1 || hScores[currentIndex] > 0){
    let lowestH = Infinity, lowestIndex = centerIndex;

    for(let i = 0; i < totalCells; i++) {
        if(closed[i] && hScores[i] < lowestH) {
            lowestH = hScores[i];
            lowestIndex = i;
        }
    }

    const bestX = lowestIndex % w, bestY = (lowestIndex / w) | 0;
    const startX = centerIndex % w, startY = (centerIndex / w) | 0;
    const distFromStart = Math.hypot(bestX - startX, bestY - startY);

    currentIndex = distFromStart > 2 ? lowestIndex : centerIndex;
}

    let pathIndices = [];
    while(currentIndex !== -1){ pathIndices.push(currentIndex); currentIndex = parents[currentIndex]; }
    pathIndices.reverse();

    const FIB = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
    let smoothPath = [];
    if (pathIndices.length > 0) {
        let i = 0;
        while (i < pathIndices.length) {
            smoothPath.push(pathIndices[i]);
            if (i === pathIndices.length - 1) break;

            let furthestVisible = i + 1;
            let fibIdx = 0;

            // Jump ahead in Fibonacci steps to find the furthest visible node
            while (fibIdx < FIB.length) {
                let nextTarget = i + FIB[fibIdx];
                if (nextTarget >= pathIndices.length) break;

                let x0 = pathIndices[i] % w, y0 = (pathIndices[i] / w) | 0;
                let x1 = pathIndices[nextTarget] % w, y1 = (pathIndices[nextTarget] / w) | 0;

                // If visible, keep the target and try an even bigger Fibonacci jump
                if (lineOfSight(x0, y0, x1, y1, costs, w, h)) {
                    furthestVisible = nextTarget;
                    fibIdx++; 
                } else {
                    break; // Hit a wall, stop expanding
                }
            }
            i = furthestVisible;
        }
    }

    let pathCoords = new Float32Array(smoothPath.length * 2);
    for(let i = 0; i < smoothPath.length; i++) {
        pathCoords[i * 2] = smoothPath[i] % w;
        pathCoords[i * 2 + 1] = (smoothPath[i] / w) | 0;
    }

    self.postMessage(pathCoords.buffer, [pathCoords.buffer]);
};
`;

class ThetaAstar {
  constructor(sz = 1600, res = 7) {
    this.sz = sz;
    this.r = res;
    this.w = Math.ceil(sz * 2 / res) + 1;
    this.mapMin = 0;
    this.mapMax = 14400;
    this.riverTop = 6700;
    this.riverBot = 7700;
    this.me = { x: 0, y: 0, sid: null, xVel: 0, yVel: 0 };
    this.spd = 500 / 9;
    this.p = [];
    this.b = [];
    this.path = [];
    this._wait = null;
    this.config = {
      mapScale: 14400,
      riverWidth: 1000,
      snowBiomeTop: 2400,
      snowSpeed: 0.8,
      waterCurrent: 0.0011,
      playerDecel: 0.993
    };
    this.costGrid = null;
    this.velocityGrid = null;
    this.lastBase = null;
    this.lastBuildCount = 0;
    this.lastPlayerCount = 0;
    this.objectManager = null;
    this._mkWorker();
    this._mkOffscreen();
    this._mkDebugCanvas();
  }
  setObjectManager(objManager) {
    this.objectManager = objManager;
  }
  setMe(pl, pls) {
    this.me.x = pl.x2;
    this.me.y = pl.y2;
    this.me.sid = pl.sid;
    this.me.skin = pl.skinIndex;
    this.me.skinData = pl.skin;
    this.me.tail = pl.tail;
    this.me.team = pl.team;
    this.me.baseScale = pl.scale || 35;
    this.me.xVel = pl.xVel || 0;
    this.me.yVel = pl.yVel || 0;
    this.me.weaponIndex = pl.weaponIndex || 0;
    this.me.buildIndex = pl.buildIndex || -1;
    this.me.spdMult = pl.spdMult;
    let maxSpeed = (pl.maxSpeed || 35) * (pl.spdMult || 1);
    this.spd = maxSpeed;
    this.effectiveScale = (this.minGap || 29) * 0.5;
    this.p = pls || [];
  }
  setBld(b2) {
    this.b = b2 || [];
  }
  setSpd(s) {
    this.spd = s || 0;
  }
  clear() {
    this.path.length = 0;
  }
  draw(ctx, me = this.me) {
    if (!this.path.length)
      return;
    const gridSize = 60;
    if (this.path.length > 0) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      const visitedTiles = new Set;
      for (let i = 0;i < this.path.length - 1; i++) {
        const wp1 = this.path[i];
        const wp2 = this.path[i + 1];
        const dx = wp2.x - wp1.x;
        const dy = wp2.y - wp1.y;
        const distance = Math.hypot(dx, dy);
        const steps = Math.max(Math.ceil(distance / (gridSize / 2)), 1);
        for (let step = 0;step <= steps; step++) {
          const t = step / steps;
          const x = wp1.x + t * dx;
          const y = wp1.y + t * dy;
          const gridX = Math.floor(x / gridSize) * gridSize;
          const gridY = Math.floor(y / gridSize) * gridSize;
          const tileKey = `${gridX},${gridY}`;
          if (!visitedTiles.has(tileKey)) {
            visitedTiles.add(tileKey);
            ctx.fillRect(gridX, gridY, gridSize, gridSize);
          }
        }
      }
      const lastPoint = this.path[this.path.length - 1];
      const lastGridX = Math.floor(lastPoint.x / gridSize) * gridSize;
      const lastGridY = Math.floor(lastPoint.y / gridSize) * gridSize;
      const lastTileKey = `${lastGridX},${lastGridY}`;
      if (!visitedTiles.has(lastTileKey)) {
        ctx.fillRect(lastGridX, lastGridY, gridSize, gridSize);
      }
    }
    ctx.globalAlpha = 1;
  }
  pathLength() {
    if (this.path.length < 2)
      return 0;
    let total = 0;
    for (let i = 1;i < this.path.length; i++) {
      const dx = this.path[i].x - this.path[i - 1].x;
      const dy = this.path[i].y - this.path[i - 1].y;
      total += Math.hypot(dx, dy);
    }
    return total;
  }
  async find(pos, min_gap, playerVel) {
    this.minGap = min_gap;
    const goals = Array.isArray(pos) ? pos : [pos];
    await this._calc(goals, false);
    if (!this.path)
      return [];
    const raw = this.path.slice().reverse();
    return this._applyMomentumSpacing(raw, playerVel);
  }
  _applyMomentumSpacing(path, playerVel) {
    if (path.length < 3)
      return path;
    const speed = playerVel ? Math.hypot(playerVel.x, playerVel.y) : Math.hypot(this.me.xVel, this.me.yVel);
    const PHI = 1.61803398875;
    const brakingDist = speed * (PHI * 10);
    const SHARP = Math.cos(Math.PI * 0.55);
    const MEDIUM = Math.cos(Math.PI * 0.35);
    const MIN_SEG = this.r * PHI;
    const result = [path[0]];
    for (let i = 1;i < path.length - 1; i++) {
      const prev = path[i - 1], cur = path[i], next = path[i + 1];
      const inX = cur.x - prev.x, inY = cur.y - prev.y;
      const outX = next.x - cur.x, outY = next.y - cur.y;
      const inLen = Math.hypot(inX, inY), outLen = Math.hypot(outX, outY);
      if (inLen < MIN_SEG || outLen < MIN_SEG) {
        result.push(cur);
        continue;
      }
      const dot = inX / inLen * (outX / outLen) + inY / inLen * (outY / outLen);
      if (dot < SHARP && brakingDist > MIN_SEG) {
        const d1 = Math.min(brakingDist * PHI, inLen * 0.618);
        const d2 = Math.min(brakingDist * 0.618, inLen * 0.382);
        result.push({ x: cur.x - inX / inLen * d1, y: cur.y - inY / inLen * d1 });
        result.push({ x: cur.x - inX / inLen * d2, y: cur.y - inY / inLen * d2 });
      } else if (dot < MEDIUM && brakingDist > MIN_SEG) {
        const d = Math.min(brakingDist * 0.618, inLen * 0.5);
        result.push({ x: cur.x - inX / inLen * d, y: cur.y - inY / inLen * d });
      }
      result.push(cur);
    }
    result.push(path[path.length - 1]);
    return result;
  }
  _mkWorker() {
    const url2 = "data:application/javascript;base64," + btoa(WorkerCode2);
    this.wk = new Worker(url2);
    this.wk.onmessage = (e) => this._resolve(new Float32Array(e.data));
    this.wk.onerror = (e) => {
      throw e;
    };
  }
  _mkOffscreen() {
    this.c = new OffscreenCanvas(this.w, this.w);
    this.cx = this.c.getContext("2d", { alpha: false, willReadFrequently: false });
    this.cx.imageSmoothingEnabled = false;
  }
  _mkDebugCanvas() {
    const el = document.createElement("canvas");
    el.id = "canvasMap";
    el.width = this.w;
    el.height = this.w;
    el.style.cssText = "position:absolute; left:50%; top:60px; margin-left:-100px; pointer-events:none; border-style:solid; z-index:-1;";
    document.body.append(el);
    this.dbg = el.getContext("2d");
    this.dbg.imageSmoothingEnabled = false;
  }
  _clamp(v) {
    return Math.max(0, Math.min(this.w - 1, v));
  }
  _clampWorld(x, y) {
    return {
      x: Math.max(this.mapMin, Math.min(this.mapMax, x)),
      y: Math.max(this.mapMin, Math.min(this.mapMax, y))
    };
  }
  _waitMsg() {
    return new Promise((res) => this._wait = res);
  }
  _resolve(data) {
    if (!this._wait)
      return console.error("Unexpected worker message", this);
    const res = this._wait;
    this._wait = null;
    res(data);
  }
  _clearOffscreen() {
    this.c.width = this.w;
    this.c.height = this.w;
    this.cx = this.c.getContext("2d", { alpha: false, willReadFrequently: false });
    this.cx.imageSmoothingEnabled = false;
  }
  _buildCostGridSpatial(base) {
    const t0 = performance.now();
    const totalCells = this.w * this.w;
    if (!this.costGrid || this.costGrid.length !== totalCells) {
      this.costGrid = new Uint8Array(totalCells);
      this.velocityGrid = new Float32Array(totalCells * 2);
    } else {
      this.costGrid.fill(0);
      this.velocityGrid.fill(0);
    }
    const delta = 1000 / 9;
    const gridLeft = (this.mapMin - base.x + this.sz) / this.r;
    const gridRight = (this.mapMax - base.x + this.sz) / this.r;
    const gridTop = (this.mapMin - base.y + this.sz) / this.r;
    const gridBottom = (this.mapMax - base.y + this.sz) / this.r;
    const borderThickness = 20;
    this._fillRect(Math.max(0, gridLeft - borderThickness), 0, borderThickness, this.w, 255);
    this._fillRect(Math.min(this.w - borderThickness, gridRight), 0, borderThickness, this.w, 255);
    this._fillRect(0, Math.max(0, gridTop - borderThickness), this.w, borderThickness, 255);
    this._fillRect(0, Math.min(this.w - borderThickness, gridBottom), this.w, borderThickness, 255);
    const hasWaterproofSkin = this.me.skin === 31;
    const riverCost = hasWaterproofSkin ? 30 : 200;
    const gridRiverTop = (this.riverTop - base.y + this.sz) / this.r;
    const gridRiverBot = (this.riverBot - base.y + this.sz) / this.r;
    if (gridRiverTop < this.w && gridRiverBot > 0) {
      const top = Math.max(0, Math.floor(gridRiverTop));
      const bot = Math.min(this.w, Math.ceil(gridRiverBot));
      const height = bot - top;
      if (height > 0) {
        this._fillRect(0, top, this.w, height, riverCost);
        const isInRiver2 = !hasWaterproofSkin && this.me.y >= this.riverTop && this.me.y <= this.riverBot;
        if (isInRiver2) {
          const playerGridX = (this.me.x - base.x + this.sz) / this.r;
          const leftWidth = Math.floor(playerGridX);
          if (leftWidth > 0) {
            this._fillRect(0, top, leftWidth, height, 255);
          }
        }
      }
    }
    let playerCount = 0;
    for (let pl of this.p) {
      if (!pl?.visible || pl.sid === this.me.sid)
        continue;
      const x = (pl.x2 - base.x + this.sz) / this.r;
      const y = (pl.y2 - base.y + this.sz) / this.r;
      const rad = (pl.scale * 1.5 || 0) / this.r;
      if (x + rad < 0 || x - rad > this.w || y + rad < 0 || y - rad > this.w)
        continue;
      this._fillCircleFast(x, y, rad, 255);
      playerCount++;
    }
    let objectCount = 0;
    const CHUNK_SIZE = this.r * 50;
    const chunksChecked = new Set;
    for (let py = 0;py < this.w; py += CHUNK_SIZE) {
      for (let px = 0;px < this.w; px += CHUNK_SIZE) {
        const worldX = px * this.r - this.sz + base.x;
        const worldY = py * this.r - this.sz + base.y;
        if (this.objectManager && this.objectManager.getGridArrays) {
          const grids = this.objectManager.getGridArrays(worldX, worldY, CHUNK_SIZE * this.r);
          if (grids && grids.length > 0) {
            for (let grid of grids) {
              for (let o of grid) {
                if (!o?.active)
                  continue;
                if (chunksChecked.has(o.sid))
                  continue;
                chunksChecked.add(o.sid);
                const x = (o.x - base.x + this.sz) / this.r;
                const y = (o.y - base.y + this.sz) / this.r;
                const maxRad = (o.scale + this.minGap + 50) / this.r;
                if (x + maxRad < 0 || x - maxRad > this.w || y + maxRad < 0 || y - maxRad > this.w) {
                  continue;
                }
                let rad = o.type === 1 && o.y >= 12000 ? o.scale * 0.8 : o.type === 1 ? o.scale * 0.7 : o.type === 0 ? o.scale * 0.7 : o.scale;
                let isEnemy = !o.owner || o.owner?.sid !== this.me.sid && !window.ally?.(o.owner.sid);
                let hasVelocity = false;
                let baseVelX = 0, baseVelY = 0;
                if (o.dmg && isEnemy) {
                  rad += 25;
                  hasVelocity = true;
                } else if (o.id === 15 && !isEnemy)
                  continue;
                if ([22, 16].includes(o.id))
                  rad += 25;
                if (o.boostSpeed) {
                  hasVelocity = true;
                  const boostVel = o.boostSpeed * (o.weightM || 1) * delta;
                  baseVelX = boostVel * Math.cos(o.dir);
                  baseVelY = boostVel * Math.sin(o.dir);
                }
                let effectiveRad = rad + this.minGap * 0.5;
                const gridRad = effectiveRad / this.r;
                if (hasVelocity) {
                  this._fillCircleWithVelocity(x, y, gridRad, 255, o, baseVelX, baseVelY, isEnemy, delta);
                } else {
                  this._fillCircleFast(x, y, gridRad, 255);
                }
                objectCount++;
              }
            }
          }
        }
      }
    }
    const isInRiver = base.y >= this.config.mapScale / 2 - this.config.riverWidth / 2 && base.y <= this.config.mapScale / 2 + this.config.riverWidth / 2;
    let riverCurrentX = 0;
    if (isInRiver) {
      if (this.me.skinData?.watrImm) {
        riverCurrentX = this.config.waterCurrent * 0.4 * delta;
      } else {
        riverCurrentX = this.config.waterCurrent * delta;
      }
    }
    if (riverCurrentX !== 0 && gridRiverTop < this.w && gridRiverBot > 0) {
      const top = Math.max(0, Math.floor(gridRiverTop));
      const bot = Math.min(this.w, Math.ceil(gridRiverBot));
      for (let py = top;py < bot; py++) {
        for (let px = 0;px < this.w; px++) {
          const idx = (py * this.w + px) * 2;
          if (this.velocityGrid[idx] === 0 && this.velocityGrid[idx + 1] === 0) {
            this.velocityGrid[idx] = riverCurrentX;
          }
        }
      }
    }
    const elapsed = performance.now() - t0;
  }
  _generateNavmesh(base) {
    const t0 = performance.now();
    const cellSize = Math.max(20, Math.floor(this.w / 30));
    const gridW = Math.ceil(this.w / cellSize);
    const gridH = Math.ceil(this.w / cellSize);
    const walkable = new Uint8Array(gridW * gridH);
    for (let gy = 0;gy < gridH; gy++) {
      for (let gx = 0;gx < gridW; gx++) {
        const cx = Math.min(gx * cellSize + Math.floor(cellSize / 2), this.w - 1);
        const cy = Math.min(gy * cellSize + Math.floor(cellSize / 2), this.w - 1);
        const idx = cy * this.w + cx;
        walkable[gy * gridW + gx] = this.costGrid[idx] !== 255 ? 1 : 0;
      }
    }
    const visited = new Uint8Array(gridW * gridH);
    const regions = [];
    for (let gy = 0;gy < gridH; gy++) {
      for (let gx = 0;gx < gridW; gx++) {
        const idx = gy * gridW + gx;
        if (visited[idx] || !walkable[idx])
          continue;
        const region = this._floodFillRegionFast(gx, gy, gridW, gridH, walkable, visited, cellSize);
        if (region.cells > 4) {
          regions.push(region);
        }
      }
    }
    this.navPolygons = regions;
    this.navGraph = this._buildNavGraphFast(regions);
    this.navCellSize = cellSize;
  }
  _floodFillRegionFast(startX, startY, gridW, gridH, walkable, visited, cellSize) {
    const region = {
      cells: 0,
      minX: startX,
      maxX: startX,
      minY: startY,
      maxY: startY
    };
    const queue = [startX + startY * gridW];
    visited[startX + startY * gridW] = 1;
    while (queue.length > 0) {
      const idx = queue.pop();
      const x = idx % gridW;
      const y = Math.floor(idx / gridW);
      region.cells++;
      region.minX = Math.min(region.minX, x);
      region.maxX = Math.max(region.maxX, x);
      region.minY = Math.min(region.minY, y);
      region.maxY = Math.max(region.maxY, y);
      const neighbors = [
        idx - 1,
        idx + 1,
        idx - gridW,
        idx + gridW
      ];
      for (let ni of neighbors) {
        if (ni < 0 || ni >= walkable.length)
          continue;
        const nx = ni % gridW;
        const ny = Math.floor(ni / gridW);
        if (Math.abs(nx - x) > 1 || Math.abs(ny - y) > 1)
          continue;
        if (visited[ni] || !walkable[ni])
          continue;
        visited[ni] = 1;
        queue.push(ni);
      }
    }
    region.minX *= cellSize;
    region.maxX = (region.maxX + 1) * cellSize;
    region.minY *= cellSize;
    region.maxY = (region.maxY + 1) * cellSize;
    region.centerX = (region.minX + region.maxX) / 2;
    region.centerY = (region.minY + region.maxY) / 2;
    return region;
  }
  _buildNavGraphFast(regions) {
    const graph = new Map;
    const maxDist = this.navCellSize * 3;
    for (let i = 0;i < regions.length; i++) {
      const neighbors = [];
      const r1 = regions[i];
      for (let j = i + 1;j < regions.length; j++) {
        const r2 = regions[j];
        const dx = r1.centerX - r2.centerX;
        const dy = r1.centerY - r2.centerY;
        if (Math.abs(dx) > maxDist && Math.abs(dy) > maxDist)
          continue;
        const touching = !(r1.maxX < r2.minX || r1.minX > r2.maxX || r1.maxY < r2.minY || r1.minY > r2.maxY);
        if (touching || dx * dx + dy * dy < maxDist * maxDist) {
          if (!graph.has(i))
            graph.set(i, []);
          if (!graph.has(j))
            graph.set(j, []);
          graph.get(i).push(j);
          graph.get(j).push(i);
        }
      }
    }
    return graph;
  }
  _findContainingPolygon(x, y) {
    for (let i = 0;i < this.navPolygons.length; i++) {
      const poly = this.navPolygons[i];
      if (x >= poly.minX && x <= poly.maxX && y >= poly.minY && y <= poly.maxY) {
        return i;
      }
    }
    return -1;
  }
  _findPolygonPath(startPoly, endPoly) {
    if (startPoly === -1 || endPoly === -1)
      return null;
    if (startPoly === endPoly)
      return [startPoly];
    const open = [startPoly];
    const gScore = new Map([[startPoly, 0]]);
    const fScore = new Map([[startPoly, this._polyDist(startPoly, endPoly)]]);
    const cameFrom = new Map;
    while (open.length > 0) {
      let current = open[0];
      let minF = fScore.get(current);
      for (let i = 1;i < open.length; i++) {
        const f = fScore.get(open[i]);
        if (f < minF) {
          minF = f;
          current = open[i];
        }
      }
      if (current === endPoly) {
        const path = [current];
        while (cameFrom.has(current)) {
          current = cameFrom.get(current);
          path.unshift(current);
        }
        return path;
      }
      open.splice(open.indexOf(current), 1);
      const neighbors = this.navGraph.get(current) || [];
      for (let neighbor of neighbors) {
        const tentativeG = gScore.get(current) + this._polyDist(current, neighbor);
        if (!gScore.has(neighbor) || tentativeG < gScore.get(neighbor)) {
          cameFrom.set(neighbor, current);
          gScore.set(neighbor, tentativeG);
          fScore.set(neighbor, tentativeG + this._polyDist(neighbor, endPoly));
          if (!open.includes(neighbor)) {
            open.push(neighbor);
          }
        }
      }
    }
    return null;
  }
  _polyDist(polyA, polyB) {
    const a = this.navPolygons[polyA];
    const b2 = this.navPolygons[polyB];
    const dx = a.centerX - b2.centerX;
    const dy = a.centerY - b2.centerY;
    return Math.sqrt(dx * dx + dy * dy);
  }
  _createRestrictedGrid(polyPath) {
    const restricted = new Uint8Array(this.costGrid.length);
    restricted.fill(255);
    const expand = Math.floor(this.navCellSize * 0.2);
    for (let polyIdx of polyPath) {
      const poly = this.navPolygons[polyIdx];
      const minX = Math.max(0, Math.floor(poly.minX) - expand);
      const maxX = Math.min(this.w - 1, Math.ceil(poly.maxX) + expand);
      const minY = Math.max(0, Math.floor(poly.minY) - expand);
      const maxY = Math.min(this.w - 1, Math.ceil(poly.maxY) + expand);
      for (let y = minY;y <= maxY; y++) {
        const rowStart = y * this.w;
        for (let x = minX;x <= maxX; x++) {
          restricted[rowStart + x] = this.costGrid[rowStart + x];
        }
      }
    }
    return restricted;
  }
  _fillRect(x, y, w, h, cost) {
    const startX = Math.max(0, Math.floor(x));
    const startY = Math.max(0, Math.floor(y));
    const endX = Math.min(this.w, Math.ceil(x + w));
    const endY = Math.min(this.w, Math.ceil(y + h));
    for (let py = startY;py < endY; py++) {
      const rowStart = py * this.w;
      for (let px = startX;px < endX; px++) {
        this.costGrid[rowStart + px] = cost;
      }
    }
  }
  _fillCircleFast(cx, cy, radius, cost) {
    const minY = Math.max(0, Math.floor(cy - radius));
    const maxY = Math.min(this.w - 1, Math.ceil(cy + radius));
    const radSq = radius * radius;
    for (let py = minY;py <= maxY; py++) {
      const dy = py - cy;
      const dySq = dy * dy;
      if (dySq > radSq)
        continue;
      const dx = Math.sqrt(radSq - dySq);
      const minX = Math.max(0, Math.floor(cx - dx));
      const maxX = Math.min(this.w - 1, Math.ceil(cx + dx));
      const rowStart = py * this.w;
      for (let px = minX;px <= maxX; px++) {
        this.costGrid[rowStart + px] = cost;
      }
    }
  }
  _fillCircleWithVelocity(cx, cy, radius, cost, obj, baseVelX, baseVelY, isEnemy, delta) {
    const minY = Math.max(0, Math.floor(cy - radius));
    const maxY = Math.min(this.w - 1, Math.ceil(cy + radius));
    const radSq = radius * radius;
    const knockbackSpeed = obj.dmg && isEnemy ? 1.5 * (obj.weightM || 1) * delta : 0;
    for (let py = minY;py <= maxY; py++) {
      const dy = py - cy;
      const dySq = dy * dy;
      if (dySq > radSq)
        continue;
      const dx = Math.sqrt(radSq - dySq);
      const minX = Math.max(0, Math.floor(cx - dx));
      const maxX = Math.min(this.w - 1, Math.ceil(cx + dx));
      const rowStart = py * this.w;
      for (let px = minX;px <= maxX; px++) {
        this.costGrid[rowStart + px] = cost;
        const idx = (rowStart + px) * 2;
        if (obj.boostSpeed) {
          this.velocityGrid[idx] = baseVelX;
          this.velocityGrid[idx + 1] = baseVelY;
        } else if (knockbackSpeed > 0) {
          const dirX = px - cx;
          const dirY = py - cy;
          const dirLen = Math.hypot(dirX, dirY);
          if (dirLen > 0.01) {
            this.velocityGrid[idx] = knockbackSpeed * (dirX / dirLen);
            this.velocityGrid[idx + 1] = knockbackSpeed * (dirY / dirLen);
          }
        }
      }
    }
  }
  async _calc(goals, append) {
    if (this._wait)
      return;
    this.g = goals.map(({ x, y }) => this._clampWorld(x, y));
    const base = append && this.path[0] ? this.path[0] : { x: this.me.x, y: this.me.y };
    const toGrid = ({ x, y }) => ({
      x: this._clamp((x - base.x + this.sz) / this.r),
      y: this._clamp((y - base.y + this.sz) / this.r)
    });
    const G = this.g.map(toGrid);
    const baseMoved = !this.lastBase || Math.hypot(base.x - this.lastBase.x, base.y - this.lastBase.y) > this.r * 5;
    const buildingsChanged = this.lastBuildCount !== this.b.length;
    const playersChanged = this.lastPlayerCount !== this.p.length;
    if (baseMoved || buildingsChanged || playersChanged || !this.costGrid) {
      if (this.objectManager && this.objectManager.getGridArrays) {
        this._buildCostGridSpatial(base);
      } else {
        console.warn("ObjectManager not set, using fallback method");
        this._buildCostGridFallback(base);
      }
      this.lastBase = { ...base };
      this.lastBuildCount = this.b.length;
      this.lastPlayerCount = this.p.length;
      this.navPolygons = null;
    }
    const costsCopy = new Uint8Array(this.costGrid);
    const velocitiesCopy = new Float32Array(this.velocityGrid);
    const endpointIndices = [];
    for (let g of G) {
      const gx = Math.round(g.x);
      const gy = Math.round(g.y);
      const idx = gy * this.w + gx;
      endpointIndices.push(idx);
    }
    if (!this.navPolygons) {
      this._generateNavmesh(base);
    }
    const startPoly = this._findContainingPolygon(this.w / 2, this.w / 2);
    const goalPolys = G.map((g) => this._findContainingPolygon(g.x, g.y));
    const polyPath = this._findPolygonPath(startPoly, goalPolys[0]);
    if (polyPath && polyPath.length > 0) {
      const restrictedCosts = this._createRestrictedGrid(polyPath);
      this.wk.postMessage({
        costs: restrictedCosts,
        velocities: velocitiesCopy,
        width: this.w,
        height: this.w,
        endpoints: endpointIndices
      }, [restrictedCosts.buffer, velocitiesCopy.buffer]);
    } else {
      this.wk.postMessage({
        costs: costsCopy,
        velocities: velocitiesCopy,
        width: this.w,
        height: this.w,
        endpoints: endpointIndices
      }, [costsCopy.buffer, velocitiesCopy.buffer]);
    }
    this._clearOffscreen();
    this.dbg.clearRect(0, 0, this.w, this.w);
    const imageData = new ImageData(this.w, this.w);
    for (let i = 0;i < this.costGrid.length; i++) {
      imageData.data[i * 4] = this.costGrid[i];
      imageData.data[i * 4 + 1] = 0;
      imageData.data[i * 4 + 2] = 0;
      imageData.data[i * 4 + 3] = 255;
    }
    this.dbg.putImageData(imageData, 0, 0);
    this.dbg.fillStyle = "#00f";
    for (let g of G) {
      this.dbg.fillRect(Math.round(g.x), Math.round(g.y), 1, 1);
    }
    const data = await this._waitMsg();
    if (!append) {
      this.path.length = 0;
    }
    const numPoints = data.length / 2;
    for (let i = 0;i < numPoints; i++) {
      const gridX = data[i * 2], gridY = data[i * 2 + 1];
      const worldX = gridX * this.r - this.sz + base.x;
      const worldY = gridY * this.r - this.sz + base.y;
      this.path.unshift({ x: worldX, y: worldY });
      this.dbg.fillRect(gridX, gridY, 1, 1);
    }
  }
  _buildCostGridFallback(base) {
    const t0 = performance.now();
    const totalCells = this.w * this.w;
    if (!this.costGrid || this.costGrid.length !== totalCells) {
      this.costGrid = new Uint8Array(totalCells);
      this.velocityGrid = new Float32Array(totalCells * 2);
    } else {
      this.costGrid.fill(0);
      this.velocityGrid.fill(0);
    }
    const delta = 1000 / 9;
    const gridLeft = (this.mapMin - base.x + this.sz) / this.r;
    const gridRight = (this.mapMax - base.x + this.sz) / this.r;
    const gridTop = (this.mapMin - base.y + this.sz) / this.r;
    const gridBottom = (this.mapMax - base.y + this.sz) / this.r;
    const borderThickness = 20;
    this._fillRect(Math.max(0, gridLeft - borderThickness), 0, borderThickness, this.w, 255);
    this._fillRect(Math.min(this.w - borderThickness, gridRight), 0, borderThickness, this.w, 255);
    this._fillRect(0, Math.max(0, gridTop - borderThickness), this.w, borderThickness, 255);
    this._fillRect(0, Math.min(this.w - borderThickness, gridBottom), this.w, borderThickness, 255);
    const hasWaterproofSkin = this.me.skin === 31;
    const riverCost = hasWaterproofSkin ? 30 : 200;
    const gridRiverTop = (this.riverTop - base.y + this.sz) / this.r;
    const gridRiverBot = (this.riverBot - base.y + this.sz) / this.r;
    if (gridRiverTop < this.w && gridRiverBot > 0) {
      const top = Math.max(0, Math.floor(gridRiverTop));
      const bot = Math.min(this.w, Math.ceil(gridRiverBot));
      const height = bot - top;
      if (height > 0) {
        this._fillRect(0, top, this.w, height, riverCost);
        const isInRiver2 = !hasWaterproofSkin && this.me.y >= this.riverTop && this.me.y <= this.riverBot;
        if (isInRiver2) {
          const playerGridX = (this.me.x - base.x + this.sz) / this.r;
          const leftWidth = Math.floor(playerGridX);
          if (leftWidth > 0) {
            this._fillRect(0, top, leftWidth, height, 255);
          }
        }
      }
    }
    for (let pl of this.p) {
      if (!pl?.visible || pl.sid === this.me.sid)
        continue;
      const x = (pl.x2 - base.x + this.sz) / this.r;
      const y = (pl.y2 - base.y + this.sz) / this.r;
      const rad = (pl.scale * 1.5 || 0) / this.r;
      if (x + rad < 0 || x - rad > this.w || y + rad < 0 || y - rad > this.w)
        continue;
      this._fillCircleFast(x, y, rad, 255);
    }
    for (let o of this.b) {
      if (!o?.active)
        continue;
      const x = (o.x - base.x + this.sz) / this.r;
      const y = (o.y - base.y + this.sz) / this.r;
      const maxRad = (o.scale + this.minGap + 50) / this.r;
      if (x + maxRad < 0 || x - maxRad > this.w || y + maxRad < 0 || y - maxRad > this.w) {
        continue;
      }
      let rad = o.type === 1 && o.y >= 12000 ? o.scale * 0.8 : o.type === 1 ? o.scale * 0.7 : o.type === 0 ? o.scale * 0.7 : o.scale;
      let isEnemy = !o.owner || o.owner?.sid !== this.me.sid && !window.ally?.(o.owner.sid);
      let hasVelocity = false;
      let baseVelX = 0, baseVelY = 0;
      if (o.dmg && isEnemy) {
        rad += 25;
        hasVelocity = true;
      } else if (o.id === 15 && !isEnemy)
        continue;
      if ([22, 16].includes(o.id))
        rad += 25;
      if (o.boostSpeed) {
        hasVelocity = true;
        const boostVel = o.boostSpeed * (o.weightM || 1) * delta;
        baseVelX = boostVel * Math.cos(o.dir);
        baseVelY = boostVel * Math.sin(o.dir);
      }
      let effectiveRad = rad + this.minGap * 0.5;
      const gridRad = effectiveRad / this.r;
      if (hasVelocity) {
        this._fillCircleWithVelocity(x, y, gridRad, 255, o, baseVelX, baseVelY, isEnemy, delta);
      } else {
        this._fillCircleFast(x, y, gridRad, 255);
      }
    }
    const isInRiver = base.y >= this.config.mapScale / 2 - this.config.riverWidth / 2 && base.y <= this.config.mapScale / 2 + this.config.riverWidth / 2;
    let riverCurrentX = 0;
    if (isInRiver) {
      if (this.me.skinData?.watrImm) {
        riverCurrentX = this.config.waterCurrent * 0.4 * delta;
      } else {
        riverCurrentX = this.config.waterCurrent * delta;
      }
    }
    if (riverCurrentX !== 0 && gridRiverTop < this.w && gridRiverBot > 0) {
      const top = Math.max(0, Math.floor(gridRiverTop));
      const bot = Math.min(this.w, Math.ceil(gridRiverBot));
      for (let py = top;py < bot; py++) {
        for (let px = 0;px < this.w; px++) {
          const idx = (py * this.w + px) * 2;
          if (this.velocityGrid[idx] === 0 && this.velocityGrid[idx + 1] === 0) {
            this.velocityGrid[idx] = riverCurrentX;
          }
        }
      }
    }
  }
  destroy() {
    try {
      this.wk?.terminate();
    } catch {}
    this.wk = null;
  }
}

// bundle/src/js/data/key.js
async function getKey(name) {
  let result = { name };
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl)
    return "WebGL not supported";
  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
  if (debugInfo) {
    result.agent = navigator.userAgent;
    result.gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    return result;
  } else {
    return "Debug info extension not available";
  }
}

// bundle/src/js/app.js
var movie = false;
var isProd = location.hostname !== "127.0.0.1" && !location.hostname.startsWith("192.168.");
var { isPrivate: isPrivate3, isProxy: isProxy2 } = window;
window.polearmAnim = false;
var particles = true;
var trail = true;
var dagAnim = 0.6;
var resAnim = true;
var polearmAnim = window.polearmAnim;
var isPm;
var pmSent;
var pmMessage;
var lastPm;
var pmMode;
var autoGrind = false;
var userData = {};
(async () => {
  userData = await getKey();
})();
if (dagAnim)
  Object.assign(import_items.default.weapons[7], { width: 70, yOff: 5, xOff: 30 });
var textManager = new import_animText.default.TextManager;
var bestServer;
var connected = false;
var startedConnecting = false;
async function connectSocketIfReady() {
  if (!didLoad || !bestServer)
    return;
  startedConnecting = true;
  if (isProd) {
    const tokens = await import_token.default(1);
    connectSocket(tokens[0]);
  } else {
    connectSocket(null);
  }
}
function connectSocket(token) {
  const protocol = isProd ? "wss" : "ws", ip = `${bestServer.key}.${bestServer.region}`;
  let wsAddress = `wss://${ip}.moomoo.io/`;
  if (token)
    wsAddress += `?token=alt:${token}`;
  if (isPrivate3)
    wsAddress = "ws://local" + "host:8080/?token=alt:done";
  if (isProxy2)
    wsAddress = window.proxyAddress || "ws://local" + "host:25601/";
  io_client_default.connect(wsAddress, function(error) {
    if (isProxy2)
      io_client_default.socket.send(JSON.stringify({
        type: "connect",
        ip,
        token
      }));
    pingSocket();
    setInterval(() => pingSocket(), 2500);
    if (isProxy2) {
      let fullPing = function() {
        io_client_default.socket.send(JSON.stringify({
          type: "ping"
        }));
        io_client_default.fullSent = Date.now();
      };
      fullPing();
      setInterval(fullPing, 2500);
    }
    if (error) {
      disconnect(error);
    } else {
      connected = true;
      startGame();
    }
  }, {
    id: setInitData,
    d: disconnect,
    "1": setupGame,
    "2": addPlayer,
    "4": removePlayer,
    "33": updatePlayers,
    "5": updateLeaderboard,
    "6": loadGameObject,
    a: loadAI,
    aa: animateAI,
    "7": gatherAnimation,
    "8": wiggleGameObject,
    sp: shootTurret,
    "9": updatePlayerValue,
    h: updateHealth,
    "11": killPlayer,
    "12": killObject,
    "13": killObjects,
    "14": updateItemCounts,
    "15": updateAge,
    "16": updateUpgrades,
    "17": updateItems,
    "18": addProjectile,
    "19": remProjectile,
    "20": serverShutdownNotice,
    ac: addAlliance,
    ad: deleteAlliance,
    an: allianceNotification,
    st: setPlayerTeam,
    sa: setAlliancePlayers,
    us: updateStoreItems,
    ch: receiveChat,
    mm: updateMinimap,
    t: showText,
    p: pingMap,
    pp: pingSocketResponse
  });
}
function socketReady() {
  return io_client_default.connected;
}
var serverBrowser = document.getElementById("serverBrowser");
var mathPI = Math.PI;
var mathPI2 = mathPI * 2;
Math.lerpAngle = function(value1, value2, amount) {
  const difference = Math.abs(value2 - value1);
  if (difference > mathPI) {
    if (value1 > value2) {
      value2 += mathPI2;
    } else {
      value1 += mathPI2;
    }
  }
  let value = value2 + (value1 - value2) * amount;
  if (value >= 0 && value <= mathPI2) {
    return value;
  }
  return value % mathPI2;
};
CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
  if (w < 2 * r)
    r = w / 2;
  if (h < 2 * r)
    r = h / 2;
  if (r < 0)
    r = 0;
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
  return this;
};
var canStore = typeof Storage !== "undefined";
function saveVal(name, val) {
  if (canStore) {
    localStorage.setItem(name, val);
  }
}
function getSavedVal(name) {
  if (canStore) {
    return localStorage.getItem(name);
  }
  return null;
}
var useNativeResolution;
var showStatistics;
var pixelDensity = 1;
var delta;
var now;
var lastSent;
var lastUpdate = Date.now();
var keys;
var attackState;
var ais = [];
var players = [];
var alliances = [];
var gameObjects = [];
var projectiles2 = [];
var objectManager = new import_objectManager.default(import_gameObject.default, gameObjects, import_utils.default, config_default);
var projectileManager = new import_projectileManager.default(import_projectile.default, projectiles2, players, ais, objectManager, import_items.default, config_default, import_utils.default);
var aiManager = new import_aiManager.default(ais, import_ai.default, players, import_items.default, objectManager, config_default, import_utils.default);
var player;
var playerSID;
var tmpObj2;
var waterMult = 1;
var waterPlus = 0;
var mouseX = 0;
var mouseY = 0;
var advisorKills = 0;
var advisorDeaths = 0;
var advisorLastKills = 0;
var advisorLastOutcome = null;
var controllingTouch = {
  id: -1,
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0
};
var attackingTouch = {
  id: -1,
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0
};
var camX;
var camY;
var tmpDir;
var skinColor = 0;
var maxScreenWidth2 = config_default.maxScreenWidth;
var maxScreenHeight2 = config_default.maxScreenHeight;
var screenWidth;
var screenHeight;
var inGame = false;
var adContainer = document.getElementById("ad-container");
var mainMenu = document.getElementById("mainMenu");
var enterGameButton = document.getElementById("enterGame");
var promoImageButton = document.getElementById("promoImg");
var partyButton = document.getElementById("partyButton");
var joinPartyButton = document.getElementById("joinPartyButton");
var settingsButton = document.getElementById("settingsButton");
var allianceButton = document.getElementById("allianceButton");
var storeButton = document.getElementById("storeButton");
var chatButton = document.getElementById("chatButton");
var gameCanvas = document.getElementById("gameCanvas");
var mainContext = gameCanvas.getContext("2d");
var nativeResolutionCheckbox = document.getElementById("nativeResolution");
var showStatisticsCheckbox = document.getElementById("showStatistics");
var statsDisplay = document.getElementById("statistics");
var shutdownDisplay = document.getElementById("shutdownDisplay");
var menuCardHolder = document.getElementById("menuCardHolder");
var guideCard = document.getElementById("guideCard");
var loadingText = document.getElementById("loadingText");
var gameUI = document.getElementById("gameUI");
var actionBar = document.getElementById("actionBar");
var scoreDisplay = document.getElementById("scoreDisplay");
var foodDisplay = document.getElementById("foodDisplay");
var woodDisplay = document.getElementById("woodDisplay");
var stoneDisplay = document.getElementById("stoneDisplay");
var killCounter = document.getElementById("killCounter");
var leaderboardData = document.getElementById("leaderboardData");
var nameInput = document.getElementById("nameInput");
var itemInfoHolder = document.getElementById("itemInfoHolder");
var ageText = document.getElementById("ageText");
var ageBarBody = document.getElementById("ageBarBody");
var ageBarPot = document.getElementById("ageBarPotential");
var upgradeHolder = document.getElementById("upgradeHolder");
var upgradeCounter = document.getElementById("upgradeCounter");
var allianceMenu = document.getElementById("allianceMenu");
var allianceHolder = document.getElementById("allianceHolder");
var allianceManager = document.getElementById("allianceManager");
var mapDisplay = document.getElementById("mapDisplay");
var diedText = document.getElementById("diedText");
var skinColorHolder = document.getElementById("skinColorHolder");
var mapContext = mapDisplay.getContext("2d");
mapDisplay.width = 300;
mapDisplay.height = 300;
var storeMenu = document.getElementById("storeMenu");
var storeHolder = document.getElementById("storeHolder");
var noticationDisplay = document.getElementById("noticationDisplay");
var skins = import_store.default.skins;
var isWealthy = navigator.userAgent === "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36";
skins.unshift(isWealthy ? {
  id: 0,
  name: "Wealthy Hat",
  price: 0,
  scale: 120,
  desc: "Wealthy is youtuber and developer, all at the same time!"
} : {
  id: -1,
  name: "Blisma Hat",
  price: 0,
  scale: 120,
  desc: "Blisma is youtuber and developer, all at the same time!"
});
var tails = import_store.default.tails;
var outlineColor = "#525252";
var darkOutlineColor = "#3d3f42";
var outlineWidth = 5.5;
function setInitData(data) {
  alliances = data.teams;
}
var featuredYoutuber = document.getElementById("featuredYoutube");
var youtuberList = [
  { name: "Blisma", link: "https://www.youtube.com/@blisma" },
  { name: "Wealthy", link: "https://www.youtube.com/@wealthyDev" }
];
var tmpYoutuber = youtuberList[import_utils.default.randInt(0, youtuberList.length - 1)];
featuredYoutuber.innerHTML = `<a target='_blank' class='ytLink' href='${tmpYoutuber.link}'><i class='material-icons' style='vertical-align: top;'>&#xE064;</i> ${tmpYoutuber.name}</a>`;
var settingsBtn = Object.assign(document.createElement("div"), {
  id: "settingsBtn",
  className: "menuButton",
  innerHTML: "<span>Settings</span>"
});
Object.assign(settingsBtn.style, {
  backgroundColor: "#9f7ce5",
  marginTop: "10px",
  cursor: "pointer",
  transition: "background-color 0.2s"
});
settingsBtn.addEventListener("mouseenter", () => {
  settingsBtn.style.backgroundColor = "#8a63d4";
});
settingsBtn.addEventListener("mouseleave", () => {
  settingsBtn.style.backgroundColor = "#9f7ce5";
});
var tabData = {
  Display: [
    { id: "showStatistics", label: "Show Statistics", desc: "Displays ping, FPS, and other debug info on screen." },
    { id: "daggerAnimation", label: "Dagger Animation", desc: "Enables smooth dagger stabbing animations." },
    { id: "polearmAnimation", label: "Polearm Animation", desc: "Enables smooth polearm stabbing animations." },
    { id: "particleEffects", label: "Particle Effects", desc: "Enables blood particle animations." }
  ],
  Game: [
    { id: "autoAttack", label: "Auto Attack", desc: "Automatically attacks nearby enemies." },
    { id: "autoHeal", label: "Auto Heal", desc: "Automatically consumes food when damaged." },
    { id: "showPingMap", label: "Show Ping on Map", desc: "Displays ping markers on the minimap." },
    { id: "chatEnabled", label: "Enable Chat", desc: "Allows sending and receiving chat messages." }
  ],
  Controls: [
    { id: "invertMouse", label: "Invert Mouse", desc: "Inverts the mouse Y axis direction." },
    { id: "touchControls", label: "Touch Controls", desc: "Enables on-screen touch joysticks for mobile." },
    { id: "vibration", label: "Vibration", desc: "Enables controller vibration on supported devices." }
  ]
};
var styleEl = document.createElement("style");
styleEl.textContent = `
#settingsModal {
    font-family: "Hammersmith One", sans-serif;
}
#settingsModal .tabBar {
    display: flex;
    gap: 4px;
    margin-bottom: 12px;
}
#settingsModal .tabBtn {
    flex: 1;
    padding: 8px 0;
    text-align: center;
    font-family: "Hammersmith One", sans-serif;
    font-size: 16px;
    color: #fff;
    background-color: #4a4a4a;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.15s;
    -webkit-user-select: none;
    user-select: none;
}
#settingsModal .tabBtn:hover {
    background-color: #5a5a5a;
}
#settingsModal .tabBtn.active {
    background-color: #9f7ce5;
}
#settingsModal .tabContent {
    height: 220px;
    overflow-y: auto;
}
#settingsModal .settingRow {
    display: flex;
    align-items: center;
    padding: 8px 6px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.1s;
    -webkit-user-select: none;
    user-select: none;
    position: relative;
}
#settingsModal .settingRow:hover {
    background-color: rgba(0,0,0,0.06);
}
#settingsModal .settingLabel {
    font-family: "Hammersmith One", sans-serif;
    font-size: 16px;
    color: #000;
    margin-left: 10px;
}
#settingsModal .toggle {
    position: relative;
    width: 40px;
    height: 22px;
    flex-shrink: 0;
}
#settingsModal .toggle .track {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #cc5151;
    border-radius: 11px;
    transition: background-color 0.2s;
}
#settingsModal .toggle.on .track {
    background-color: #8ecc51;
}
#settingsModal .toggle .thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 18px;
    height: 18px;
    background-color: #fff;
    border-radius: 50%;
    transition: left 0.2s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}
#settingsModal .toggle.on .thumb {
    left: 20px;
}
#settingsTooltip {
    position: fixed;
    z-index: 100;
    padding: 8px 12px;
    border-radius: 4px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
    max-width: 220px;
}
#settingsTooltip.visible {
    opacity: 1;
}
#settingsTooltip .tooltipText {
    font-family: "Hammersmith One", sans-serif;
    font-size: 18px;
    color: #a8a8a8;
    margin: 0;
}
`;
document.head.appendChild(styleEl);
var tooltip = Object.assign(document.createElement("div"), { id: "settingsTooltip", className: "menuCard" });
var tooltipText = Object.assign(document.createElement("div"), { className: "tooltipText" });
tooltip.appendChild(tooltipText);
document.body.appendChild(tooltip);
var settingsState = {};
function buildTab(modal, tabName) {
  let content = modal.querySelector(".tabContent");
  if (content)
    content.remove();
  content = Object.assign(document.createElement("div"), { className: "tabContent" });
  tabData[tabName].forEach((s) => {
    if (!(s.id in settingsState))
      settingsState[s.id] = false;
    const row = Object.assign(document.createElement("div"), { className: "settingRow" });
    const toggle = Object.assign(document.createElement("div"), {
      className: "toggle" + (settingsState[s.id] ? " on" : "")
    });
    toggle.appendChild(Object.assign(document.createElement("div"), { className: "track" }));
    toggle.appendChild(Object.assign(document.createElement("div"), { className: "thumb" }));
    const label = Object.assign(document.createElement("span"), {
      className: "settingLabel",
      textContent: s.label
    });
    row.addEventListener("click", () => {
      settingsState[s.id] = !settingsState[s.id];
      toggle.classList.toggle("on", settingsState[s.id]);
    });
    row.addEventListener("mouseenter", (e) => {
      if (!s.desc)
        return;
      tooltipText.textContent = s.desc;
      tooltip.classList.add("visible");
    });
    row.addEventListener("mousemove", (e) => {
      tooltip.style.left = e.clientX + 12 + "px";
      tooltip.style.top = e.clientY + 12 + "px";
    });
    row.addEventListener("mouseleave", () => {
      tooltip.classList.remove("visible");
    });
    row.appendChild(toggle);
    row.appendChild(label);
    content.appendChild(row);
  });
  modal.appendChild(content);
}
function openSettings() {
  if (document.getElementById("settingsModal")) {
    closeSettings();
    return;
  }
  const overlay = Object.assign(document.createElement("div"), { id: "settingsOverlay" });
  Object.assign(overlay.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    zIndex: "9",
    backgroundColor: "rgba(0,0,0,0.3)"
  });
  const modal = Object.assign(document.createElement("div"), {
    className: "menuCard",
    id: "settingsModal"
  });
  Object.assign(modal.style, {
    position: "fixed",
    display: "block",
    zIndex: "10",
    top: "calc(50% + 20px)",
    left: "50%",
    transform: "translate(-50%, -50%)",
    margin: "0",
    minWidth: "280px"
  });
  const tabBar = Object.assign(document.createElement("div"), { className: "tabBar" });
  const tabNames = Object.keys(tabData);
  const tabButtons = [];
  tabNames.forEach((name, i) => {
    const btn = Object.assign(document.createElement("div"), {
      className: "tabBtn" + (i === 0 ? " active" : ""),
      textContent: name
    });
    btn.addEventListener("click", () => {
      tabButtons.forEach((b2) => b2.classList.remove("active"));
      btn.classList.add("active");
      buildTab(modal, name);
    });
    tabButtons.push(btn);
    tabBar.appendChild(btn);
  });
  modal.appendChild(tabBar);
  buildTab(modal, tabNames[0]);
  overlay.addEventListener("click", () => {
    closeSettings();
  });
  document.body.appendChild(overlay);
  document.body.appendChild(modal);
}
function closeSettings() {
  const modal = document.getElementById("settingsModal");
  const overlay = document.getElementById("settingsOverlay");
  if (modal)
    modal.remove();
  if (overlay)
    overlay.remove();
  tooltip.classList.remove("visible");
}
settingsBtn.addEventListener("click", openSettings);
enterGameButton.parentNode.insertBefore(settingsBtn, enterGameButton.nextSibling);
var chatMenu = document.createElement("div");
Object.assign(chatMenu.style, {
  position: "fixed",
  top: "300px",
  left: "20px",
  color: "#fff",
  fontSize: "18px",
  padding: "14px",
  paddingTop: "10px",
  paddingBottom: "10px",
  width: "340px",
  height: "300px",
  backgroundColor: "rgba(0,0,0,0.25)",
  borderRadius: "4px",
  zIndex: "9999",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  pointerEvents: "all"
});
var scrollbarHideStyle = document.createElement("style");
scrollbarHideStyle.textContent = `.chat-messages::-webkit-scrollbar { display: none; }`;
document.head.appendChild(scrollbarHideStyle);
var messagesEl = document.createElement("div");
messagesEl.classList.add("chat-messages");
Object.assign(messagesEl.style, {
  height: "220px",
  overflowY: "scroll",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  marginBottom: "10px",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
  pointerEvents: "all"
});
messagesEl.addEventListener("wheel", function(e) {
  e.stopPropagation();
  messagesEl.scrollBy({ top: e.deltaY * 0.5, behavior: "smooth" });
}, { passive: true });
function addMessage(prefix, name, text, isAdmin) {
  const row = document.createElement("div");
  Object.assign(row.style, {
    fontSize: "16px",
    lineHeight: "1.3",
    wordBreak: "break-word",
    paddingRight: "90px"
  });
  if (prefix) {
    const prefixEl = document.createElement("span");
    prefixEl.textContent = prefix + " ";
    prefixEl.style.color = "#8ecc51";
    row.appendChild(prefixEl);
  }
  const nameEl = document.createElement("span");
  nameEl.textContent = name + ": ";
  nameEl.style.color = isAdmin ? "#d3a5f9" : "#fff";
  row.appendChild(nameEl);
  const textEl = document.createElement("span");
  textEl.textContent = text;
  textEl.style.color = "#fff";
  row.appendChild(textEl);
  messagesEl.appendChild(row);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}
var bottomRow = document.createElement("div");
Object.assign(bottomRow.style, {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  position: "relative"
});
var input = document.createElement("input");
input.type = "text";
input.placeholder = "message";
Object.assign(input.style, {
  pointerEvents: "all",
  fontSize: "24px",
  color: "#fff",
  width: "80%",
  padding: "5px",
  backgroundColor: "rgba(0,0,0,0.25)",
  borderRadius: "4px",
  outline: "none",
  border: "0",
  boxShadow: "none",
  flex: "1"
});
var sendBtn = document.createElement("div");
sendBtn.innerText = "send";
Object.assign(sendBtn.style, {
  pointerEvents: "all",
  cursor: "pointer",
  fontSize: "24px",
  color: "#fff",
  padding: "5px 10px",
  backgroundColor: "rgba(0,0,0,0.25)",
  borderRadius: "4px",
  textAlign: "center",
  whiteSpace: "nowrap"
});
var onlineEl = document.createElement("div");
onlineEl.textContent = "Online: 0";
Object.assign(onlineEl.style, {
  position: "absolute",
  top: "7px",
  right: "10px",
  fontSize: "17px",
  color: "white",
  whiteSpace: "nowrap",
  pointerEvents: "none",
  backgroundColor: "rgba(0,0,0,0.25)",
  borderRadius: "4px",
  padding: "2px 6px"
});
async function sendMessage() {
  const text = input.value.trim();
  if (!text)
    return;
  const name = nameInput?.value?.trim() || "unknown";
  input.value = "";
  console.log(userData);
  await fetch("http://localhost:3030/chat-send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, text, gpu: userData.gpu })
  }).catch(() => {});
}
sendBtn.onclick = sendMessage;
var lastTs = 0;
async function loadHistory() {
  try {
    const res = await fetch("http://localhost:3030/chat-history");
    const data = await res.json();
    for (var i = 0;i < data.messages.length; i++) {
      const msg = data.messages[i];
      addMessage(null, msg.name, msg.text, msg.isAdmin);
      if (msg.ts > lastTs)
        lastTs = msg.ts;
    }
  } catch {}
}
async function pollMessages() {
  try {
    const res = await fetch("http://localhost:3030/chat-history");
    const data = await res.json();
    for (var i = 0;i < data.messages.length; i++) {
      const msg = data.messages[i];
      if (msg.ts > lastTs) {
        addMessage(null, msg.name, msg.text, msg.isAdmin);
        lastTs = msg.ts;
      }
    }
  } catch {}
}
async function updateOnlineCount() {
  try {
    const res = await fetch("http://localhost:3030/pm-users");
    const data = await res.json();
    onlineEl.textContent = `Online: ${Math.max(1, data.users.length)}`;
  } catch {}
}
loadHistory();
setInterval(pollMessages, 1000);
updateOnlineCount();
setInterval(updateOnlineCount, 5000);
bottomRow.appendChild(input);
bottomRow.appendChild(sendBtn);
chatMenu.appendChild(messagesEl);
chatMenu.appendChild(bottomRow);
chatMenu.appendChild(onlineEl);
gameUI.appendChild(chatMenu);
var inWindow = true;
var didLoad = false;
window.onblur = function() {
  inWindow = false;
};
window.onfocus = function() {
  inWindow = true;
  if (player && player.alive) {
    resetMoveDir();
  }
};
window.onload = function() {
  didLoad = true;
};
gameCanvas.oncontextmenu = function() {
  return false;
};
function disconnect(reason) {
  connected = false;
  io_client_default.close();
  showLoadingText(reason);
}
function showLoadingText(text) {
  mainMenu.style.display = "block";
  gameUI.style.display = "none";
  diedText.style.display = "none";
  loadingText.style.display = "block";
  loadingText.innerHTML = `${text}<a href='javascript:window.location.href=window.location.href' class='ytLink'>reload</a>`;
}
function bindEvents() {
  enterGameButton.onclick = import_utils.default.checkTrusted(function() {
    enterGame();
  });
  import_utils.default.hookTouchEvents(enterGameButton);
  promoImageButton.onclick = import_utils.default.checkTrusted(function() {
    openLink("https://discord.gg/rhEybn5");
  });
  import_utils.default.hookTouchEvents(promoImageButton);
  import_utils.default.hookTouchEvents(settingsButton);
  allianceButton.onclick = import_utils.default.checkTrusted(function() {
    toggleAllianceMenu();
  });
  import_utils.default.hookTouchEvents(allianceButton);
  storeButton.onclick = import_utils.default.checkTrusted(function() {
    toggleStoreMenu();
  });
  import_utils.default.hookTouchEvents(storeButton);
  chatButton.onclick = import_utils.default.checkTrusted(function() {
    chatMenu.style.display = chatMenu.style.display === "none" ? "flex" : "none";
  });
  import_utils.default.hookTouchEvents(chatButton);
  mapDisplay.onclick = import_utils.default.checkTrusted(function() {
    sendMapPing();
  });
  import_utils.default.hookTouchEvents(mapDisplay);
}
var maxPing = 500;
var serverData;
var usedServer;
function setupServerStatus() {
  const parent = window.location.href.split("/")[3];
  let url2 = config_default.inSandbox ? "https://api-sandbox.moomoo.io" : "https://api.moomoo.io";
  fetch(`${url2}/servers?v=1.26`).then((res) => res.json()).then((parsed) => {
    serverData = parsed;
    setTimeout(() => updateServerList(true), maxPing);
  }).catch((event) => {
    serverData = parent === "sandbox" ? [{ region: "frankfurt", name: "NH", key: "sgs-wctwk-r2p27", playerCapacity: 40, playerCount: 6, sandbox: "true", version: "1.26" }, { region: "frankfurt", name: "YV", key: "sgs-wctwk-8vgfz", playerCapacity: 40, playerCount: 0, sandbox: "true", version: "1.26" }, { region: "frankfurt", name: "GM", key: "sgs-wctwk-p2dmw", playerCapacity: 40, playerCount: 3, sandbox: "true", version: "1.26" }, { region: "london", name: "XT", key: "sgs-p4wck-xvztn", playerCapacity: 40, playerCount: 0, sandbox: "true", version: "1.26" }, { region: "london", name: "SE", key: "sgs-p4wck-jcz79", playerCapacity: 40, playerCount: 7, sandbox: "true", version: "1.26" }, { region: "siliconvalley", name: "EM", key: "sgs-k87kv-qfv72", playerCapacity: 40, playerCount: 0, sandbox: "true", version: "1.26" }, { region: "siliconvalley", name: "TT", key: "sgs-k87kv-r75m8", playerCapacity: 40, playerCount: 2, sandbox: "true", version: "1.26" }, { region: "siliconvalley", name: "PF", key: "sgs-k87kv-knnmp", playerCapacity: 40, playerCount: 1, sandbox: "true", version: "1.26" }, { region: "miami", name: "TH", key: "sgs-jzrcj-jv4hq", playerCapacity: 40, playerCount: 0, sandbox: "true", version: "1.26" }, { region: "miami", name: "EU", key: "sgs-jzrcj-5f2t5", playerCapacity: 40, playerCount: 4, sandbox: "true", version: "1.26" }, { region: "miami", name: "HP", key: "sgs-jzrcj-rgpgk", playerCapacity: 40, playerCount: 4, sandbox: "true", version: "1.26" }, { region: "miami", name: "UU", key: "sgs-jzrcj-4wgdh", playerCapacity: 40, playerCount: 12, sandbox: "true", version: "1.26" }, { region: "sydney", name: "DE", key: "sgs-v7b7h-997js", playerCapacity: 40, playerCount: 1, sandbox: "true", version: "1.26" }, { region: "sydney", name: "MH", key: "sgs-v7b7h-gx49b", playerCapacity: 40, playerCount: 0, sandbox: "true", version: "1.26" }, { region: "sydney", name: "CM", key: "sgs-v7b7h-lstk9", playerCapacity: 40, playerCount: 1, sandbox: "true", version: "1.26" }, { region: "sydney", name: "GZ", key: "sgs-v7b7h-9gstv", playerCapacity: 40, playerCount: 2, sandbox: "true", version: "1.26" }, { region: "singapore", name: "TE", key: "sgs-b67mn-gltcw", playerCapacity: 40, playerCount: 1, sandbox: "true", version: "1.26" }, { region: "singapore", name: "BD", key: "sgs-b67mn-q2dr8", playerCapacity: 40, playerCount: 0, sandbox: "true", version: "1.26" }, { region: "singapore", name: "GX", key: "sgs-b67mn-j2tmp", playerCapacity: 40, playerCount: 14, sandbox: "true", version: "1.26" }] : [{ region: "frankfurt", name: "ZM", key: "gs-fk2zr-57cwx", playerCapacity: 40, playerCount: 3, version: "1.26" }, { region: "frankfurt", name: "SF", key: "gs-fk2zr-wsjd8", playerCapacity: 40, playerCount: 40, version: "1.26" }, { region: "frankfurt", name: "ZD", key: "gs-fk2zr-5bmv7", playerCapacity: 40, playerCount: 21, version: "1.26" }, { region: "frankfurt", name: "FF", key: "gs-fk2zr-q4h6l", playerCapacity: 40, playerCount: 7, version: "1.26" }, { region: "frankfurt", name: "YF", key: "gs-fk2zr-r8m8c", playerCapacity: 40, playerCount: 2, version: "1.26" }, { region: "london", name: "PZ", key: "gs-kw5wg-zsc4g", playerCapacity: 40, playerCount: 34, version: "1.26" }, { region: "london", name: "DK", key: "gs-kw5wg-vxhc5", playerCapacity: 40, playerCount: 3, version: "1.26" }, { region: "london", name: "DS", key: "gs-kw5wg-jmcgd", playerCapacity: 40, playerCount: 4, version: "1.26" }, { region: "siliconvalley", name: "RN", key: "gs-jjbnj-rngzc", playerCapacity: 40, playerCount: 16, version: "1.26" }, { region: "siliconvalley", name: "XV", key: "gs-jjbnj-td5lq", playerCapacity: 40, playerCount: 1, version: "1.26" }, { region: "siliconvalley", name: "KD", key: "gs-jjbnj-58qsq", playerCapacity: 40, playerCount: 1, version: "1.26" }, { region: "miami", name: "EN", key: "gs-5v8rd-h7kv6", playerCapacity: 40, playerCount: 1, version: "1.26" }, { region: "miami", name: "YS", key: "gs-5v8rd-lz7cg", playerCapacity: 40, playerCount: 1, version: "1.26" }, { region: "miami", name: "AE", key: "gs-5v8rd-2qvhd", playerCapacity: 40, playerCount: 7, version: "1.26" }, { region: "miami", name: "VH", key: "gs-5v8rd-fkx2v", playerCapacity: 40, playerCount: 0, version: "1.26" }, { region: "miami", name: "VD", key: "gs-5v8rd-s88b8", playerCapacity: 40, playerCount: 2, version: "1.26" }, { region: "sydney", name: "KF", key: "gs-cbscp-smtbl", playerCapacity: 40, playerCount: 13, version: "1.26" }, { region: "singapore", name: "PD", key: "gs-dfs6q-lzwsz", playerCapacity: 40, playerCount: 2, version: "1.26" }, { region: "singapore", name: "PD", key: "gs-dfs6q-fptgm", playerCapacity: 40, playerCount: 17, version: "1.26" }, { region: "singapore", name: "BU", key: "gs-dfs6q-9r4dr", playerCapacity: 40, playerCount: 5, version: "1.26" }];
    setTimeout(() => updateServerList(true), maxPing);
  });
}
var pickServer = (servers, region, name) => {
  let result;
  const available = servers.filter((server) => server.playerCount < config_default.maxPlayers);
  if (region && name) {
    result = servers.find((server) => server.region === region && server.name === name);
    if (!available.includes(result))
      return disconnect(`${region}:${name} is full.`);
    return result;
  }
  if (!available.length)
    return null;
  let bestPingServers = available.filter((server) => !usedServer || server.key !== usedServer);
  let myRegion = localStorage.getItem("region");
  if (myRegion)
    bestPingServers = bestPingServers.filter((c) => c.region === myRegion), console.log(`chose ${myRegion}`);
  if (!bestPingServers.length)
    return null;
  result = bestPingServers.reduce((bestServer2, currentServer) => {
    return bestServer2.playerCount > currentServer.playerCount ? bestServer2 : currentServer;
  });
  return result;
};
var listOpen;
function updateServerList(html) {
  if (!html)
    return setupServerStatus();
  let parts = [], url2 = window.location.href;
  if (url2.includes("?server="))
    parts = url2.split("server=")[1].split(":");
  if (!startedConnecting && !connected) {
    bestServer = pickServer(serverData, ...parts);
    localStorage.setItem("region", bestServer.region);
  }
  if (!startedConnecting)
    connectSocketIfReady(bestServer);
  if (listOpen)
    return;
  let tmpHTML = `<select id="serverSelector">`;
  let overallTotal = 0;
  let regionCounter = 0;
  let lastRegion;
  for (let index in serverData) {
    let server = serverData[index];
    let regionName = server.region;
    if (regionName !== lastRegion) {
      let totalPlayers = 0;
      serverData.forEach((server_) => {
        if (server_.region === server.region)
          totalPlayers += server_.playerCount;
      });
      overallTotal += totalPlayers;
      if (lastRegion)
        tmpHTML += `<option disabled></option>`;
      tmpHTML += "<option disabled>" + regionName + " - " + totalPlayers + " players</option>";
    }
    let isSelected = bestServer && bestServer.region === server.region && bestServer.key === server.key ? "selected" : "";
    let serverID = server.region + ":" + server.key + ":" + server.name;
    let serverLabel = `${regionName} ${server.name} [${server.playerCount}/${config_default.maxPlayers}]`;
    tmpHTML += `<option value=${serverID} ${isSelected}>${serverLabel}</option>`;
    if (lastRegion !== regionName) {
      lastRegion = regionName;
      regionCounter++;
    }
  }
  tmpHTML += "<option disabled></option><option disabled>All Servers - " + overallTotal + " players</option></select>";
  serverBrowser.innerHTML = tmpHTML;
  let altServerText;
  let altServerURL;
  if (location.href.includes("sandbox")) {
    altServerText = "Back to MooMoo";
    altServerURL = location.href.replace("sandbox", "");
  } else {
    altServerText = "Try the sandbox";
    altServerURL = `http://${location.host}/sandbox`;
  }
  if (document.getElementById("altServer"))
    document.getElementById("altServer").innerHTML = "<a href='" + altServerURL + "'>" + altServerText + "<i class='material-icons' style='font-size:10px;vertical-align:middle'>arrow_forward_ios</i></a>";
  let selector = document.getElementById("serverBrowser");
  const events = [{
    name: "change",
    start: function(event) {
      if (event.target.id !== "serverSelector")
        return;
      let part = event.target.value.split(":");
      event.target.blur();
      io_client_default.close();
      console.log(part[0], part[2]);
      window.location = `?server=${part[0]}:${part[2]}`;
    }
  }, {
    name: "blur",
    start: function(event) {
      if (event.target.id !== "serverSelector")
        return;
      listOpen = false;
    }
  }, {
    name: "focus",
    start: function(event) {
      if (event.target.id !== "serverSelector")
        return;
      listOpen = true;
    }
  }, {
    name: "keyup",
    start: function(event) {
      if (event.target.id !== "serverSelector")
        return;
      listOpen = true;
    }
  }];
  for (let event of events) {
    document.getElementById("serverBrowser").addEventListener(event.name, function(e) {
      event.start.call(this, e);
    });
  }
}
updateServerList();
setInterval(updateServerList, 1e4);
var preContentContainer = document.getElementById("pre-content-container");
var cpmAd = null;
var cpmApi = null;
var preAdInterval = 1000 * 60 * 5;
function showPreAd() {
  if (!window.cpmstarAPI || !cpmApi) {
    console.log("Failed to load video ad API", !!window.cpmstarAPI, !!cpmApi);
    enterGame();
    return;
  }
  cpmAd = new cpmApi.game.RewardedVideoView("rewardedvideo");
  cpmAd.addEventListener("ad_closed", function(e) {
    console.log("Video ad closed");
    finishPreAd();
  });
  cpmAd.addEventListener("loaded", function(e) {
    console.log("Video ad loaded");
    cpmAd.show();
  });
  cpmAd.addEventListener("load_failed", function(e) {
    console.log("Video ad load failed", e);
    finishPreAd();
  });
  cpmAd.load();
  preContentContainer.style.display = "block";
}
window.showPreAd = showPreAd;
function finishPreAd() {
  preContentContainer.style.display = "none";
  enterGame();
}
var allianceNotifications = [];
var alliancePlayers = [];
function allianceNotification(sid, name) {
  allianceNotifications.push({ sid, name });
  updateNotifications();
}
function updateNotifications() {
  if (allianceNotifications[0]) {
    const tmpN = allianceNotifications[0];
    import_utils.default.removeAllChildren(noticationDisplay);
    noticationDisplay.style.display = "block";
    import_utils.default.generateElement({
      class: "notificationText",
      text: tmpN.name,
      parent: noticationDisplay
    });
    import_utils.default.generateElement({
      class: "notifButton",
      html: "<i class='material-icons' style='font-size:28px;color:#cc5151;'>&#xE14C;</i>",
      parent: noticationDisplay,
      onclick: function() {
        aJoinReq(0);
      },
      hookTouch: true
    });
    import_utils.default.generateElement({
      class: "notifButton",
      html: "<i class='material-icons' style='font-size:28px;color:#8ecc51;'>&#xE876;</i>",
      parent: noticationDisplay,
      onclick: function() {
        aJoinReq(1);
      },
      hookTouch: true
    });
  } else {
    noticationDisplay.style.display = "none";
  }
}
function addAlliance(data) {
  alliances.push(data);
  if (allianceMenu.style.display === "block") {
    showAllianceMenu();
  }
}
function setPlayerTeam(team, isOwner) {
  if (player) {
    player.team = team;
    player.isOwner = isOwner;
    if (allianceMenu.style.display === "block") {
      showAllianceMenu();
    }
  }
}
function setAlliancePlayers(data) {
  alliancePlayers = data;
  if (allianceMenu.style.display === "block") {
    showAllianceMenu();
  }
}
function deleteAlliance(sid) {
  alliances = alliances.filter((a) => a.sid !== sid);
  if (allianceMenu.style.display === "block") {
    showAllianceMenu();
  }
}
function toggleAllianceMenu() {
  resetMoveDir();
  if (allianceMenu.style.display !== "block") {
    showAllianceMenu();
  } else {
    allianceMenu.style.display = "none";
  }
}
function showAllianceMenu() {
  if (player && player.alive) {
    closeChat();
    storeMenu.style.display = "none";
    allianceMenu.style.display = "block";
    import_utils.default.removeAllChildren(allianceHolder);
    if (player.team) {
      for (let i = 0;i < alliancePlayers.length; i += 2) {
        (function(i2) {
          const tmp = import_utils.default.generateElement({
            class: "allianceItem",
            style: `color:${alliancePlayers[i2] == player.sid ? "#fff" : "rgba(255,255,255,0.6)"}`,
            text: alliancePlayers[i2 + 1],
            parent: allianceHolder
          });
          if (player.isOwner && alliancePlayers[i2] != player.sid) {
            import_utils.default.generateElement({
              class: "joinAlBtn",
              text: "Kick",
              onclick: function() {
                kickFromClan(alliancePlayers[i2]);
              },
              hookTouch: true,
              parent: tmp
            });
          }
        })(i);
      }
    } else {
      if (alliances.length) {
        for (let i = 0;i < alliances.length; ++i) {
          (function(i2) {
            const tmp = import_utils.default.generateElement({
              class: "allianceItem",
              style: `color:${alliances[i2].sid == player.team ? "#fff" : "rgba(255,255,255,0.6)"}`,
              text: alliances[i2].sid,
              parent: allianceHolder
            });
            import_utils.default.generateElement({
              class: "joinAlBtn",
              text: "Join",
              onclick: function() {
                sendJoin(i2);
              },
              hookTouch: true,
              parent: tmp
            });
          })(i);
        }
      } else {
        import_utils.default.generateElement({
          class: "allianceItem",
          text: "No Tribes Yet",
          parent: allianceHolder
        });
      }
    }
    import_utils.default.removeAllChildren(allianceManager);
    if (player.team) {
      import_utils.default.generateElement({
        class: "allianceButtonM",
        style: "width: 360px",
        text: player.isOwner ? "Delete Tribe" : "Leave Tribe",
        onclick: function() {
          leaveAlliance();
        },
        hookTouch: true,
        parent: allianceManager
      });
    } else {
      import_utils.default.generateElement({
        tag: "input",
        type: "text",
        id: "allianceInput",
        maxLength: 7,
        placeholder: "unique name",
        ontouchstart: function(ev) {
          ev.preventDefault();
          const newValue = prompt("unique name", ev.currentTarget.value);
          ev.currentTarget.value = newValue.slice(0, 7);
        },
        parent: allianceManager
      });
      import_utils.default.generateElement({
        tag: "div",
        class: "allianceButtonM",
        style: "width: 140px;",
        text: "Create",
        onclick: function() {
          createAlliance();
        },
        hookTouch: true,
        parent: allianceManager
      });
    }
  }
}
function aJoinReq(join) {
  io_client_default.send("11", allianceNotifications[0].sid, join);
  allianceNotifications.splice(0, 1);
  updateNotifications();
}
function kickFromClan(sid) {
  io_client_default.send("12", sid);
}
function sendJoin(index) {
  io_client_default.send("10", alliances[index].sid);
}
function createAlliance() {
  io_client_default.send("8", document.getElementById("allianceInput").value);
}
function leaveAlliance() {
  allianceNotifications = [];
  updateNotifications();
  io_client_default.send("9");
}
function ally(sid) {
  if (player && sid === player.sid)
    return true;
  if (!alliancePlayers.length || !player.team)
    return false;
  for (let index = 0;index < alliancePlayers.length; index += 2) {
    const _sid = alliancePlayers[index];
    if (sid == _sid)
      return true;
  }
  return false;
}
window.ally = ally;
function advisorFlushDeath() {
  if (!player || !enemy)
    return;
  navigator.sendBeacon("/log", JSON.stringify({
    ts: Date.now(),
    me: { x: Math.round(player.x2), y: Math.round(player.y2), weapon: player.weaponIndex, kills: player.kills },
    enemy: { x: Math.round(enemy.x2), y: Math.round(enemy.y2), weapon: enemy.weaponIndex, trail: advisorEnemyTrail },
    objects: objects.filter((o) => o.active).map((o) => ({ id: o.id, x: Math.round(o.x), y: Math.round(o.y), scale: o.scale, dmg: o.dmg || 0, owner: o.owner?.sid })),
    dist: Math.round(import_utils.default.getDistance(player.x2, player.y2, enemy.x2, enemy.y2)),
    myTrapped: !!player.trap,
    enemyTrapped: !!enemy.trap,
    outcome: "loss"
  }));
}
var advisorLastSnapshot = {
  px: 0,
  py: 0,
  ex: 0,
  ey: 0,
  objCount: 0,
  myTrapped: false,
  enemyTrapped: false,
  kills: 0,
  ts: Date.now()
};
var aiTarget = null;
var aiPending = false;
async function queryAI(state) {
  if (aiPending)
    return;
  aiPending = true;
  try {
    const res = await fetch("/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state)
    });
    aiTarget = await res.json();
  } catch {} finally {
    aiPending = false;
  }
}
function tickAI() {
  return;
  const state = drawAdvisor(true);
  if (!state)
    return;
  queryAI(state);
  if (aiTarget) {
    circles.push({ x: aiTarget.x, y: aiTarget.y, colour: "red" });
  }
}
setInterval(() => {
  player && enemy && tickAI();
}, 1000);
var advisorEnemyTrail = [];
var advisorLastEnemy = null;
function drawAdvisor(data) {
  if (enemy)
    advisorLastEnemy = enemy;
  if (!player || !player.visible)
    return;
  if (!enemy && player.kills <= advisorLastKills)
    return;
  const killedThisTick = player.kills > advisorLastKills;
  if (player.kills > advisorLastKills) {
    advisorKills += player.kills - advisorLastKills;
    advisorLastOutcome = "win";
    setTimeout(() => {
      advisorLastOutcome = null;
    }, 3000);
  }
  advisorLastKills = player.kills;
  const activeEnemy = enemy || advisorLastEnemy;
  if (!activeEnemy)
    return;
  const nearObjects = objects.filter((o) => o.active);
  const myTrapped = !!player.trap;
  const enemyTrapped = !!activeEnemy.trap;
  const dist = Math.round(import_utils.default.getDistance(player.x2, player.y2, activeEnemy.x2, activeEnemy.y2));
  const now2 = Date.now();
  const lastTrail = advisorEnemyTrail[advisorEnemyTrail.length - 1];
  if (!lastTrail || Math.hypot(activeEnemy.x2 - lastTrail.x, activeEnemy.y2 - lastTrail.y) > 20) {
    advisorEnemyTrail.push({ x: Math.round(activeEnemy.x2), y: Math.round(activeEnemy.y2), ts: now2 });
    if (advisorEnemyTrail.length > 20)
      advisorEnemyTrail.shift();
  }
  const changed = killedThisTick || now2 - advisorLastSnapshot.ts > 1000;
  if (changed || data) {
    advisorLastSnapshot = {
      px: player.x2,
      py: player.y2,
      ex: activeEnemy.x2,
      ey: activeEnemy.y2,
      objCount: nearObjects.length,
      myTrapped,
      enemyTrapped,
      kills: player.kills,
      ts: now2
    };
    let obj = {
      ts: now2,
      me: { x: Math.round(player.x2), y: Math.round(player.y2), weapon: player.weaponIndex, kills: player.kills },
      enemy: { x: Math.round(activeEnemy.x2), y: Math.round(activeEnemy.y2), weapon: activeEnemy.weaponIndex, trail: advisorEnemyTrail },
      objects: nearObjects.map((o) => ({ id: o.id, x: Math.round(o.x), y: Math.round(o.y), scale: o.scale, dmg: o.dmg || 0, isEnemy: !o.isItem || !ally(o.owner?.sid) })),
      dist,
      myTrapped,
      enemyTrapped,
      outcome: advisorLastOutcome
    };
    if (data)
      return obj;
    navigator.sendBeacon("/log", JSON.stringify({ batch: [obj] }));
  }
}
var lastDeath;
var minimapData;
var mapMarker;
var mapPings = [];
var tmpPing;
function MapPing() {
  this.init = function(x, y) {
    this.scale = 0;
    this.x = x;
    this.y = y;
    this.active = true;
  };
  this.update = function(ctxt, delta2) {
    if (this.active) {
      this.scale += 0.05 * delta2;
      if (this.scale >= config_default.mapPingScale) {
        this.active = false;
      } else {
        ctxt.globalAlpha = 1 - Math.max(0, this.scale / config_default.mapPingScale);
        ctxt.beginPath();
        ctxt.arc(this.x / config_default.mapScale * mapDisplay.width, this.y / config_default.mapScale * mapDisplay.width, this.scale, 0, 2 * Math.PI);
        ctxt.stroke();
      }
    }
  };
}
function pingMap(x, y) {
  for (let i = 0;i < mapPings.length; ++i) {
    if (!mapPings[i].active) {
      tmpPing = mapPings[i];
      break;
    }
  }
  if (!tmpPing) {
    tmpPing = new MapPing;
    mapPings.push(tmpPing);
  }
  tmpPing.init(x, y);
}
function updateMapMarker() {
  if (!mapMarker) {
    mapMarker = {};
  }
  mapMarker.x = player.x;
  mapMarker.y = player.y;
}
function updateMinimap(data) {
  minimapData = data;
}
function renderMinimap(delta2) {
  if (player && player.alive) {
    mapContext.clearRect(0, 0, mapDisplay.width, mapDisplay.height);
    mapContext.strokeStyle = "#fff";
    mapContext.lineWidth = 4;
    for (let i = 0;i < mapPings.length; ++i) {
      tmpPing = mapPings[i];
      tmpPing.update(mapContext, delta2);
    }
    mapContext.globalAlpha = 1;
    mapContext.fillStyle = "#fff";
    renderCircle(player.x / config_default.mapScale * mapDisplay.width, player.y / config_default.mapScale * mapDisplay.height, 7, mapContext, true);
    mapContext.fillStyle = "rgba(255,255,255,0.35)";
    if (player.team && minimapData) {
      for (let i = 0;i < minimapData.length; ) {
        renderCircle(minimapData[i] / config_default.mapScale * mapDisplay.width, minimapData[i + 1] / config_default.mapScale * mapDisplay.height, 7, mapContext, true);
        i += 2;
      }
    }
    if (lastDeath) {
      mapContext.fillStyle = "#fc5553";
      mapContext.font = "34px Hammersmith One";
      mapContext.textBaseline = "middle";
      mapContext.textAlign = "center";
      mapContext.fillText("x", lastDeath.x / config_default.mapScale * mapDisplay.width, lastDeath.y / config_default.mapScale * mapDisplay.height);
    }
    if (mapMarker) {
      mapContext.fillStyle = "#fff";
      mapContext.font = "34px Hammersmith One";
      mapContext.textBaseline = "middle";
      mapContext.textAlign = "center";
      mapContext.fillText("x", mapMarker.x / config_default.mapScale * mapDisplay.width, mapMarker.y / config_default.mapScale * mapDisplay.height);
    }
  }
}
var currentStoreIndex = 0;
function changeStoreIndex(index) {
  if (currentStoreIndex != index) {
    currentStoreIndex = index;
    generateStoreList();
  }
}
function toggleStoreMenu() {
  if (storeMenu.style.display !== "block") {
    storeMenu.style.display = "block";
    allianceMenu.style.display = "none";
    closeChat();
    generateStoreList();
  } else {
    storeMenu.style.display = "none";
  }
}
function updateStoreItems(type, id, index) {
  if (index) {
    if (!type) {
      player.tails[id] = 1;
    } else {
      player.tailIndex = id;
    }
  } else {
    if (!type) {
      player.skins[id] = 1;
    } else {
      player.skinIndex = id;
    }
  }
  if (storeMenu.style.display === "block") {
    generateStoreList();
  }
}
function generateStoreList() {
  if (player) {
    import_utils.default.removeAllChildren(storeHolder);
    const index = currentStoreIndex;
    const tmpArray = index ? tails : skins;
    for (let i = 0;i < tmpArray.length; ++i) {
      if (!tmpArray[i].dontSell) {
        (function(i2) {
          const tmp = import_utils.default.generateElement({
            id: `storeDisplay${i2}`,
            class: "storeItem",
            parent: storeHolder
          });
          import_utils.default.hookTouchEvents(tmp, true);
          import_utils.default.generateElement({
            tag: "img",
            class: "hatPreview",
            src: `../img/${index ? "tails/access_" : "skins/hat_"}${tmpArray[i2].id}${tmpArray[i2].topSprite ? "_p" : ""}.png`,
            parent: tmp
          });
          import_utils.default.generateElement({
            tag: "span",
            text: tmpArray[i2].name,
            parent: tmp
          });
          if ([0, -1].includes(tmpArray[i2].id))
            return;
          if (index ? !player.tails[tmpArray[i2].id] : !player.skins[tmpArray[i2].id]) {
            import_utils.default.generateElement({
              class: "joinAlBtn",
              style: "margin-top: 5px",
              text: "Buy",
              onclick: function() {
                storeBuy(tmpArray[i2].id, index);
              },
              hookTouch: true,
              parent: tmp
            });
            import_utils.default.generateElement({
              tag: "span",
              class: "itemPrice",
              text: tmpArray[i2].price,
              parent: tmp
            });
          } else if ((index ? player.tailIndex : player.skinIndex) == tmpArray[i2].id) {
            import_utils.default.generateElement({
              class: "joinAlBtn",
              style: "margin-top: 5px",
              text: "Unequip",
              onclick: function() {
                storeEquip(0, index);
              },
              hookTouch: true,
              parent: tmp
            });
          } else {
            import_utils.default.generateElement({
              class: "joinAlBtn",
              style: "margin-top: 5px",
              text: "Equip",
              onclick: function() {
                storeEquip(tmpArray[i2].id, index);
              },
              hookTouch: true,
              parent: tmp
            });
          }
        })(i);
      }
    }
  }
}
function storeEquip(id, index) {
  io_client_default.send("13c", 0, id, index);
}
function storeBuy(id, index) {
  io_client_default.send("13c", 1, id, index);
}
function hideAllWindows() {
  storeMenu.style.display = "none";
  allianceMenu.style.display = "none";
  closeChat();
}
function prepareUI() {
  const savedNativeValue = getSavedVal("native_resolution");
  if (!savedNativeValue) {
    setUseNativeResolution(typeof cordova !== "undefined");
  } else {
    setUseNativeResolution(savedNativeValue === "true");
  }
  showStatistics = getSavedVal("show_statistics") === "true";
  if (statsDisplay)
    statsDisplay.hidden = !showStatistics;
  setInterval(function() {
    if (window.cordova) {
      document.getElementById("downloadButtonContainer").classList.add("cordova");
      document.getElementById("mobileDownloadButtonContainer").classList.add("cordova");
    }
  }, 1000);
  updateSkinColorPicker();
  import_utils.default.removeAllChildren(actionBar);
  import_utils.default.removeAllChildren(actionBar);
  const totalItems = import_items.default.weapons.length + import_items.default.list.length;
  for (let i = 0;i < totalItems; ++i) {
    const itemElement = import_utils.default.generateElement({
      id: "actionBarItem" + i,
      class: "actionBarItem",
      style: "display:none; position:relative; vertical-align:top;",
      parent: actionBar
    });
    if (i >= 19 && i < 39) {
      const item = import_items.default.list[i - 16];
      if (item && item.group !== undefined) {
        const group = item.group;
        const span = document.createElement("span");
        span.classList.add("itemCounter");
        span.setAttribute("data-id", group.id + "");
        const count = player?.itemCounts[group.id] || 0;
        const limit = group.limit;
        span.textContent = limit ? `${count}` : count;
        itemElement.appendChild(span);
      }
    }
  }
  for (let i = 0;i < import_items.default.list.length + import_items.default.weapons.length; ++i) {
    (function(i2) {
      const tmpCanvas = document.createElement("canvas");
      tmpCanvas.width = tmpCanvas.height = 66;
      const tmpContext = tmpCanvas.getContext("2d");
      tmpContext.translate(tmpCanvas.width / 2, tmpCanvas.height / 2);
      tmpContext.imageSmoothingEnabled = false;
      tmpContext.webkitImageSmoothingEnabled = false;
      tmpContext.mozImageSmoothingEnabled = false;
      if (import_items.default.weapons[i2]) {
        tmpContext.rotate(Math.PI / 4 + Math.PI);
        const tmpSprite = new Image;
        toolSprites[import_items.default.weapons[i2].src] = tmpSprite;
        tmpSprite.onload = function() {
          this.isLoaded = true;
          const tmpPad = 1 / (this.height / this.width);
          const tmpMlt = import_items.default.weapons[i2].iPad || 1;
          tmpContext.drawImage(this, -(tmpCanvas.width * tmpMlt * config_default.iconPad * tmpPad) / 2, -(tmpCanvas.height * tmpMlt * config_default.iconPad) / 2, tmpCanvas.width * tmpMlt * tmpPad * config_default.iconPad, tmpCanvas.height * tmpMlt * config_default.iconPad);
          tmpContext.fillStyle = "rgba(0, 0, 70, 0.1)";
          tmpContext.globalCompositeOperation = "source-atop";
          tmpContext.fillRect(-tmpCanvas.width / 2, -tmpCanvas.height / 2, tmpCanvas.width, tmpCanvas.height);
          document.getElementById(`actionBarItem${i2}`).style.backgroundImage = `url(${tmpCanvas.toDataURL()})`;
        };
        tmpSprite.src = `.././img/weapons/${import_items.default.weapons[i2].src}.png`;
        const tmpUnit = document.getElementById(`actionBarItem${i2}`);
        tmpUnit.onclick = import_utils.default.checkTrusted(function() {
          selectToBuild(i2, true);
        });
        import_utils.default.hookTouchEvents(tmpUnit);
      } else {
        const tmpSprite = getItemSprite(import_items.default.list[i2 - import_items.default.weapons.length], true);
        const tmpScale = Math.min(tmpCanvas.width - config_default.iconPadding, tmpSprite.width);
        tmpContext.globalAlpha = 1;
        tmpContext.drawImage(tmpSprite, -tmpScale / 2, -tmpScale / 2, tmpScale, tmpScale);
        tmpContext.fillStyle = "rgba(0, 0, 70, 0.1)";
        tmpContext.globalCompositeOperation = "source-atop";
        tmpContext.fillRect(-tmpScale / 2, -tmpScale / 2, tmpScale, tmpScale);
        document.getElementById(`actionBarItem${i2}`).style.backgroundImage = `url(${tmpCanvas.toDataURL()})`;
        const tmpUnit = document.getElementById(`actionBarItem${i2}`);
        tmpUnit.onclick = import_utils.default.checkTrusted(function() {
          selectToBuild(i2 - import_items.default.weapons.length);
        });
        import_utils.default.hookTouchEvents(tmpUnit);
      }
    })(i);
  }
  nameInput.ontouchstart = import_utils.default.checkTrusted(function(e) {
    e.preventDefault();
    const newValue = prompt("enter name", e.currentTarget.value);
    e.currentTarget.value = newValue.slice(0, 15);
  });
  nativeResolutionCheckbox.checked = useNativeResolution;
  nativeResolutionCheckbox.onchange = import_utils.default.checkTrusted(function(e) {
    setUseNativeResolution(e.target.checked);
  });
  showStatisticsCheckbox.checked = showStatistics;
  showStatisticsCheckbox.onchange = import_utils.default.checkTrusted(function(e) {
    showStatistics = showStatisticsCheckbox.checked;
    if (statsDisplay)
      statsDisplay.hidden = !showStatistics;
    saveVal("show_statistics", showStatistics ? "true" : "false");
  });
}
function updateItems(data, wpn) {
  if (data) {
    if (wpn) {
      player.weapons = data;
    } else {
      player.items = data;
    }
  }
  for (let i = 0;i < import_items.default.list.length; ++i) {
    const tmpI = import_items.default.weapons.length + i;
    document.getElementById(`actionBarItem${tmpI}`).style.display = player.items.indexOf(import_items.default.list[i].id) >= 0 ? "inline-block" : "none";
  }
  for (let i = 0;i < import_items.default.weapons.length; ++i) {
    document.getElementById(`actionBarItem${i}`).style.display = player.weapons[import_items.default.weapons[i].type] == import_items.default.weapons[i].id ? "inline-block" : "none";
  }
}
function setUseNativeResolution(useNative) {
  useNativeResolution = useNative;
  pixelDensity = useNative ? window.devicePixelRatio || 1 : 1;
  nativeResolutionCheckbox.checked = useNative;
  saveVal("native_resolution", useNative.toString());
  resize();
}
function updateGuide() {
  if (usingTouch) {
    guideCard.classList.add("touch");
  } else {
    guideCard.classList.remove("touch");
  }
}
function updateSkinColorPicker() {
  let tmpHTML = "";
  for (let i = 0;i < config_default.skinColors.length; ++i) {
    if (i == skinColor) {
      tmpHTML += `<div class='skinColorItem activeSkin' style='background-color:${config_default.skinColors[i]}' onclick='selectSkinColor(${i})'></div>`;
    } else {
      tmpHTML += `<div class='skinColorItem' style='background-color:${config_default.skinColors[i]}' onclick='selectSkinColor(${i})'></div>`;
    }
  }
  skinColorHolder.innerHTML = tmpHTML;
}
function selectSkinColor(index) {
  skinColor = index;
  updateSkinColorPicker();
}
var chatBox = document.getElementById("chatBox");
var chatHolder = document.getElementById("chatHolder");
function toggleChat() {
  if (!usingTouch) {
    if (chatHolder.style.display === "block") {
      if (chatBox.value) {
        sendChat(chatBox.value);
      }
      closeChat();
    } else {
      storeMenu.style.display = "none";
      allianceMenu.style.display = "none";
      chatHolder.style.display = "block";
      chatBox.focus();
      resetMoveDir();
    }
  } else {
    setTimeout(function() {
      const chatMessage = prompt("chat message");
      if (chatMessage) {
        sendChat(chatMessage);
      }
    }, 1);
  }
  chatBox.value = "";
}
var pmTarget = null;
function openPMUI(list) {
  let old = document.getElementById("pmui");
  if (old)
    old.remove();
  let div = document.createElement("div");
  div.id = "pmui";
  Object.assign(div.style, {
    position: "absolute",
    left: "50%",
    bottom: "200px",
    transform: "translateX(-50%)",
    zIndex: "999999",
    fontFamily: "sans-serif",
    textAlign: "center"
  });
  list.forEach((name) => {
    let item = document.createElement("div");
    item.innerHTML = `<span style="color:#a855f7">${name}</span> <span style="color:#fff">PM</span>`;
    Object.assign(item.style, {
      cursor: "pointer",
      margin: "4px 0",
      fontSize: "22px",
      transition: "0.2s"
    });
    item.onmouseenter = () => item.style.opacity = "0.7";
    item.onmouseleave = () => item.style.opacity = "1";
    item.onclick = () => window.pickPM(name);
    div.appendChild(item);
  });
  let all = document.createElement("div");
  all.innerHTML = `<span style="color:#a855f7">@all</span> <span style="color:#fff">PM</span>`;
  Object.assign(all.style, {
    cursor: "pointer",
    marginTop: "6px",
    fontSize: "22px"
  });
  all.onclick = () => window.pickPM("@all");
  div.appendChild(all);
  document.body.appendChild(div);
}
window.pickPM = function(t) {
  pmSent = pmTarget = t;
  fetch("https://localhost:3030/pm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from: player.name, to: t, text: pmMessage })
  });
  document.getElementById("pmui")?.remove();
  toggleChat();
};
function openMenu2() {
  fetch("https://localhost:3030/pm-users").then((r) => r.json()).then((data) => {
    const list = Array.isArray(data) ? data : data.users || data.mods || [];
    openPMUI(list);
  }).catch(() => toggleChat());
}
function sendChat(msg) {
  if (msg.startsWith("/send")) {
    openMenu2();
    isPm = true;
    pmMode = "admin";
    return;
  } else if (isPm && pmSent) {
    pmMessage = msg;
    let endpoint = pmMode === "admin" ? "https://localhost:3030/send" : "https://localhost:3030/pm";
    let body = pmMode === "admin" ? { to: pmSent, text: pmMessage } : { from: player.name, to: pmSent, text: pmMessage };
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    lastPm = pmSent;
    isPm = false;
    pmSent = false;
    pmMessage = null;
    pmMode = null;
    return;
  }
  io_client_default.send("ch", msg.slice(0, 30));
}
function closeChat() {
  chatBox.value = "";
  chatHolder.style.display = "none";
}
var isPlaying = false;
function splitMessage(text, maxLen = 30) {
  const words = text.split(" ");
  const parts = [];
  let current = "";
  for (const word of words) {
    if ((current + (current ? " " : "") + word).length <= maxLen) {
      current += (current ? " " : "") + word;
    } else {
      if (current)
        parts.push(current);
      if (word.length > maxLen) {
        let w = word;
        while (w.length > maxLen) {
          parts.push(w.substring(0, maxLen));
          w = w.substring(maxLen);
        }
        current = w;
      } else {
        current = word;
      }
    }
  }
  if (current)
    parts.push(current);
  return parts;
}
function toAscii(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x00-\x7F]/g, "?");
}
function handlePlay(data) {
  isPlaying = true;
  sendChat(data.content);
  const existingPlayer = document.getElementById("yt-player");
  if (existingPlayer)
    existingPlayer.remove();
  const div = document.createElement("div");
  div.id = "yt-player";
  document.body.appendChild(div);
  div.style = "position:fixed;bottom:10px;right:10px;border:none;border-radius:8px;z-index:9999;width:280px;height:158px;";
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
  let sentLines = new Set;
  let ytPlayer;
  let pollInterval;
  window.onYouTubeIframeAPIReady = function() {
    ytPlayer = new YT.Player("yt-player", {
      width: 280,
      height: 158,
      videoId: data.videoId,
      playerVars: { autoplay: 1 },
      events: {
        onReady: (e) => e.target.playVideo(),
        onStateChange: (e) => {
          if (e.data === 0) {
            clearInterval(pollInterval);
            isPlaying = false;
            sentLines.clear();
          }
        }
      }
    });
    if (data.lyrics?.synced) {
      pollInterval = setInterval(() => {
        if (!ytPlayer || typeof ytPlayer.getCurrentTime !== "function")
          return;
        const currentMs = ytPlayer.getCurrentTime() * 1000;
        data.lyrics.lines.forEach((line, i) => {
          if (!line.text.trim())
            return;
          if (sentLines.has(i))
            return;
          if (currentMs >= line.time) {
            sentLines.add(i);
            const parts = splitMessage(line.text, 30);
            parts.forEach((part, pi) => {
              setTimeout(() => sendChat(toAscii(part)), pi * 800);
            });
          }
        });
      }, 300);
    }
  };
  if (window.YT && window.YT.Player) {
    window.onYouTubeIframeAPIReady();
  }
}
var ollama = 0;
function chatOllama(msg) {
  fetch(`https://localhost:3030/ollama?msg=${msg}`).then((c) => c.json()).then((c) => {
    io_client_default.send("ch", c.reply.toLowerCase().replaceAll("moh", "NO"));
  });
}
function receiveChat(sid, message) {
  const tmpPlayer = findPlayerBySID(sid);
  if (tmpPlayer) {
    tmpPlayer.chatMessage = message;
    tmpPlayer.chatCountdown = config_default.chatCountdown;
    const myPlayer = tmpPlayer === player;
    if (myPlayer) {
      if (message === "/ollama") {
        ollama = !ollama;
        tmpPlayer.chatMessage = `Ollama: ${ollama ? "ON" : "OFF"}`;
      } else if (message.startsWith("/ask ")) {
        setTimeout(() => {
          chatOllama(message.split("/ask ")[1]);
        }, 1500);
      } else if (message.startsWith("/play ")) {
        fetch("https://localhost:3030/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message })
        }).then((res) => res.json()).then((data) => {
          if (data.type === "play")
            handlePlay(data);
        }).catch((err) => console.error("Play request failed:", err));
      }
      return;
    } else {
      if (ollama && message.length > 2)
        chatOllama(message);
      addMessage(`[game]`, tmpPlayer.name || "unknown", message);
    }
  }
}
window.addEventListener("resize", import_utils.default.checkTrusted(resize));
function resize() {
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  const scaleFillNative = Math.max(screenWidth / maxScreenWidth2, screenHeight / maxScreenHeight2) * pixelDensity;
  gameCanvas.width = screenWidth * pixelDensity;
  gameCanvas.height = screenHeight * pixelDensity;
  gameCanvas.style.width = `${screenWidth}px`;
  gameCanvas.style.height = `${screenHeight}px`;
  mainContext.setTransform(scaleFillNative, 0, 0, scaleFillNative, (screenWidth * pixelDensity - maxScreenWidth2 * scaleFillNative) / 2, (screenHeight * pixelDensity - maxScreenHeight2 * scaleFillNative) / 2);
}
resize();
var usingTouch;
setUsingTouch(false);
function setUsingTouch(using) {
  usingTouch = using;
  updateGuide();
}
window.setUsingTouch = setUsingTouch;
gameCanvas.addEventListener("touchmove", import_utils.default.checkTrusted(touchMove), false);
function touchMove(ev) {
  ev.preventDefault();
  ev.stopPropagation();
  setUsingTouch(true);
  for (let i = 0;i < ev.changedTouches.length; i++) {
    const t = ev.changedTouches[i];
    if (t.identifier == controllingTouch.id) {
      controllingTouch.currentX = t.pageX;
      controllingTouch.currentY = t.pageY;
      sendMoveDir();
    } else if (t.identifier == attackingTouch.id) {
      attackingTouch.currentX = t.pageX;
      attackingTouch.currentY = t.pageY;
      attackState = 1;
    }
  }
}
gameCanvas.addEventListener("touchstart", import_utils.default.checkTrusted(touchStart), false);
function touchStart(ev) {
  ev.preventDefault();
  ev.stopPropagation();
  setUsingTouch(true);
  for (let i = 0;i < ev.changedTouches.length; i++) {
    const t = ev.changedTouches[i];
    if (t.pageX < document.body.scrollWidth / 2 && controllingTouch.id == -1) {
      controllingTouch.id = t.identifier;
      controllingTouch.startX = controllingTouch.currentX = t.pageX;
      controllingTouch.startY = controllingTouch.currentY = t.pageY;
      sendMoveDir();
    } else if (t.pageX > document.body.scrollWidth / 2 && attackingTouch.id == -1) {
      attackingTouch.id = t.identifier;
      attackingTouch.startX = attackingTouch.currentX = t.pageX;
      attackingTouch.startY = attackingTouch.currentY = t.pageY;
      if (player.buildIndex < 0) {
        attackState = 1;
        attack();
      }
    }
  }
}
gameCanvas.addEventListener("touchend", import_utils.default.checkTrusted(touchEnd), false);
gameCanvas.addEventListener("touchcancel", import_utils.default.checkTrusted(touchEnd), false);
gameCanvas.addEventListener("touchleave", import_utils.default.checkTrusted(touchEnd), false);
function touchEnd(ev) {
  ev.preventDefault();
  ev.stopPropagation();
  setUsingTouch(true);
  for (let i = 0;i < ev.changedTouches.length; i++) {
    const t = ev.changedTouches[i];
    if (t.identifier == controllingTouch.id) {
      controllingTouch.id = -1;
      sendMoveDir();
    } else if (t.identifier == attackingTouch.id) {
      attackingTouch.id = -1;
      if (player.buildIndex >= 0) {
        attackState = 1;
        attack();
      }
      attackState = 0;
      attack();
    }
  }
}
gameCanvas.addEventListener("mousemove", gameInput, false);
function gameInput(e) {
  e.preventDefault();
  e.stopPropagation();
  setUsingTouch(false);
  mouseX = e.clientX;
  mouseY = e.clientY;
}
var clicks = {
  left: false,
  right: false
};
gameCanvas.addEventListener("mousedown", mouseDown, false);
function mouseDown(e) {
  setUsingTouch(false);
  e.button === 0 && (clicks.left = true);
  e.button === 2 && (clicks.right = true);
  if (!player.autoGather) {
    sendAutoGather();
  }
}
gameCanvas.addEventListener("mouseup", mouseUp, false);
function mouseUp(e) {
  setUsingTouch(false);
  e.button === 0 && (clicks.left = false);
  e.button === 2 && (clicks.right = false);
  if (player.autoGather) {
    sendAutoGather();
  }
}
function getMoveDir() {
  let dx = 0;
  let dy = 0;
  if (controllingTouch.id != -1) {
    dx += controllingTouch.currentX - controllingTouch.startX;
    dy += controllingTouch.currentY - controllingTouch.startY;
  } else {
    for (const key in moveKeys) {
      const tmpDir2 = moveKeys[key];
      dx += !!keys[key] * tmpDir2[0];
      dy += !!keys[key] * tmpDir2[1];
    }
  }
  return dx == 0 && dy == 0 ? undefined : import_utils.default.fixTo(Math.atan2(dy, dx), 2);
}
var lastDir;
function getAttackDir() {
  if (!player) {
    return 0;
  }
  if (attackingTouch.id != -1) {
    lastDir = Math.atan2(attackingTouch.currentY - attackingTouch.startY, attackingTouch.currentX - attackingTouch.startX);
  } else if (!player.lockDir && !usingTouch) {
    lastDir = Math.atan2(mouseY - screenHeight / 2, mouseX - screenWidth / 2);
  }
  return import_utils.default.fixTo(lastDir || 0, 2);
}
keys = {};
var moveKeys = {
  87: [0, -1],
  38: [0, -1],
  83: [0, 1],
  40: [0, 1],
  65: [-1, 0],
  37: [-1, 0],
  68: [1, 0],
  39: [1, 0]
};
function resetMoveDir() {
  keys = {};
  io_client_default.send("rmd");
}
function keysActive() {
  return allianceMenu.style.display != "block" && chatHolder.style.display != "block" && document.activeElement !== input;
}
function keyDown(event) {
  const keyNum = event.which || event.keyCode || 0;
  if (keyNum == 13)
    sendMessage();
  if (keyNum == 27) {
    hideAllWindows();
    input.blur();
    if (player && player.alive && inGame) {
      if (mainMenu.style.display === "block") {
        mainMenu.style.display = "none";
        menuCardHolder.style.display = "none";
        loadingText.style.display = "none";
        diedText.style.display = "none";
        closeSettings();
        gameUI.style.display = "block";
      } else {
        mainMenu.style.display = "block";
        menuCardHolder.style.display = "block";
        gameUI.style.display = "none";
      }
    }
  } else if (document.activeElement === input) {
    if (keyNum == 13) {
      event.stopPropagation();
    }
    return;
  } else if (player && player.alive && keysActive()) {
    if (!keys[keyNum]) {
      keys[keyNum] = 1;
      if (keyNum == 69) {
        sendAutoGather();
      } else if (keyNum == 76) {
        autoGrind = !autoGrind;
        if (!autoGrind && player.autoGather)
          sendAutoGather();
      } else if (keyNum == 67) {
        updateMapMarker();
      } else if (keyNum == 88) {
        sendLockDir();
      } else if (player.weapons[keyNum - 49] != null) {
        selectToBuild(player.weapons[keyNum - 49], true);
      } else if (player.items[keyNum - 49 - player.weapons.length] != null) {
        selectToBuild(player.items[keyNum - 49 - player.weapons.length]);
      } else if (keyNum == 81) {
        selectToBuild(player.items[0]);
      } else if (keyNum == 82) {
        sendMapPing();
        delay(instakill, 1);
      } else if (moveKeys[keyNum]) {
        sendMoveDir(true);
      } else if (keyNum == 32) {
        attackState = 1;
        console.log("yo");
        attack();
      } else if (keyNum == 77) {
        let limit = config_default.inSandbox ? 299 : import_items.default.groups[3].limit, pass = !player.itemCounts[3] || limit > player.itemCounts[3];
        if (!autoWindmills && !pass)
          return;
        autoWindmills = !autoWindmills;
      } else if (keyNum == 79) {
        autoTP = !autoTP;
      }
    }
  }
  Placer.update();
}
function instakill() {
  if (!player.weapons[1])
    return;
  active = aimbot = true;
  state.weapon = player.weapons[0];
  state.skin = 7;
  !player.autoGather && sendAutoGather();
  delay(() => {
    state.skin = 53;
    state.weapon = player.weapons[1];
    delay(() => {
      player.autoGather && sendAutoGather();
      active = aimbot = false;
    }, 1);
  }, 1);
}
window.addEventListener("keydown", import_utils.default.checkTrusted(keyDown));
function keyUp(event) {
  const keyNum = event.which || event.keyCode || 0;
  if (document.activeElement === input) {
    if (keyNum == 13)
      sendMessage();
    return;
  }
  if (player && player.alive) {
    if (keyNum == 13) {
      toggleChat();
    } else if (keysActive()) {
      if (keys[keyNum]) {
        keys[keyNum] = 0;
        if (moveKeys[keyNum]) {
          sendMoveDir(0, false, true);
        } else if (keyNum == 32) {
          attackState = 0;
          attack();
        }
      }
    }
  }
}
window.addEventListener("keyup", import_utils.default.checkTrusted(keyUp));
function attack() {
  if (player && player.alive) {
    io_client_default.send("c", attackState, player.buildIndex >= 0 ? getAttackDir() : null);
    if (attackState)
      look();
  }
}
var lastMoveDir = undefined;
function sendMoveDir(newMoveDir, byPathfinder, byMov) {
  if (!byPathfinder)
    newMoveDir = getMoveDir();
  move(newMoveDir, byMov);
  if (!byPathfinder) {
    followingPath = false;
    Pathfinder.path = [];
  }
}
function sendLockDir() {
  player.lockDir = player.lockDir ? 0 : 1;
  io_client_default.send("7", 0);
}
function sendMapPing() {
  io_client_default.send("14", 1);
}
function sendAutoGather() {
  let sent = io_client_default.send("7", 1);
  if (sent)
    player.autoGather = !player.autoGather;
  if (player.autoGather) {
    let reload = player.reload[Number(player.weaponIndex > 8)];
    if (reload.done)
      look();
  }
}
function selectToBuild(index, wpn) {
  io_client_default.send("5", index, wpn);
}
function enterGame() {
  let name = nameInput.value;
  saveVal("moo_name", name);
  if (!inGame && socketReady()) {
    enterGameButton.classList.add("disabled");
    inGame = true;
    showLoadingText("Loading...");
    autoWindmills = false;
    if (player) {
      player.timerCount = 0;
      player.leak = undefined;
    }
    closeSettings();
    io_client_default.send("sp", {
      name,
      moofoll: true,
      skin: skinColor
    });
    firstSetup && (async () => {})();
  }
}
var firstSetup = true;
function setupGame(yourSID) {
  loadingText.style.display = "none";
  menuCardHolder.style.display = "block";
  mainMenu.style.display = "none";
  keys = {};
  playerSID = yourSID;
  attackState = 0;
  inGame = true;
  if (firstSetup) {
    firstSetup = false;
    gameObjects.length = 0;
  }
}
function showText(x, y, value, type) {
  textManager.addDamage(x, y, Math.abs(value), 50, 0.18, 500, value >= 0 ? "#fff" : "#8ecc51");
}
var deathTextScale = 99999;
function killPlayer() {
  advisorDeaths++;
  advisorLastOutcome = "loss";
  setTimeout(() => {
    advisorLastOutcome = false;
  }, 3000);
  advisorFlushDeath();
  advisorLastKills = 0;
  advisorEnemyTrail = [];
  inGame = false;
  console.log("death");
  try {
    factorem.refreshAds([2], true);
  } catch (e) {}
  gameUI.style.display = "none";
  hideAllWindows();
  lastDeath = {
    x: player.x,
    y: player.y
  };
  enterGameButton.classList.remove("disabled");
  loadingText.style.display = "none";
  diedText.style.display = "block";
  diedText.style.fontSize = "0px";
  deathTextScale = 0;
  setTimeout(function() {
    menuCardHolder.style.display = "block";
    mainMenu.style.display = "block";
    diedText.style.display = "none";
  }, config_default.deathFadeout);
  updateServerList();
}
function killObjects(sid) {
  if (player)
    objectManager.removeAllItems(sid);
}
function killObject(sid) {
  let b2 = findObjectBySid(sid);
  console.log(Date.now() - lastTick);
  if (b2) {
    let tween = Math.round(performance.now() - b2.tween);
    if (tween < tickRate * 2)
      console.log(`build broke, preplaced ${tween} ms ago`);
    let placed, angle = lastAngle;
    if (enemy && import_utils.default.getDistance(b2.x, b2.y, player.x3, player.y3) >= player.scale + b2.scale + 75) {
      if (!b2.tween || performance.now() - b2.tween > 500) {
        b2.tween = performance.now();
      }
      let angle2 = import_utils.default.dir(player, b2), buildId = player.items[lastAids && performance.now() - lastAids <= 500 && enemy && enemy.trap?.sid === b2.sid ? 2 : player.items[5] && keys[72] ? 5 : !trap && player.items[4] === 15 && (keys[70] || b2.id === 15) ? 4 : 2], item = import_items.default.list[buildId];
      if (enemy && enemy.trap && b2.sid === enemy.trap.sid) {
        let score = 0, best;
        let lastBuild;
        item = import_items.default.list[player.items[2]];
        let angle3 = import_utils.default.dir(player, enemy);
        const fibCount = 21;
        for (let i = 0;i < fibCount; i++) {
          const offset = i === 0 ? 0 : GOLDEN_ANGLE * i;
          const dirs = i === 0 ? [angle3] : [angle3 + offset, angle3 - offset];
          for (let dir of dirs) {
            const canBuild = player.buildItem(item, dir, b2);
            const scale = 35 + item.scale + (item.placeOffset || 0);
            let build2 = {
              x: player.x2 + Math.cos(dir) * scale,
              y: player.y2 + Math.sin(dir) * scale,
              dmg: item.dmg,
              dir,
              isItem: true,
              owner: { sid: player.sid },
              sid: Math.round(1000000000000000 + Math.random() * 4000)
            };
            let dist = import_utils.default.getDistance(build2.x, build2.y, enemy.x3, enemy.y3);
            if (canBuild && dist <= item.scale + player.scale) {
              phantom.push(build2);
              lastBuild = objectManager.add(build2.sid, build2.x, build2.y, build2.dir, item.scale, 1, item, true, player.sid, true);
              let tmpScore = kbScore(lastBuild, enemy);
              objectManager.disableBySid(lastBuild);
              if (score < tmpScore) {
                score = tmpScore;
                best = build2;
              }
            }
          }
        }
        if (!placed && score > 40) {
          placed = true;
          build(player.items[2], best.dir, 1, 1);
          console.log("best score:", score);
        } else {
          const fibCount2 = 13;
          for (let i = 0;i < fibCount2; i++) {
            const offset = i === 0 ? 0 : GOLDEN_ANGLE * i;
            const dirs = i === 0 ? [angle3] : [angle3 + offset, angle3 - offset];
            for (let dir of dirs) {
              let canBuild = player.buildItem(item, dir, b2);
              const scale = 35 + item.scale + (item.placeOffset || 0);
              let build2 = {
                x: player.x2 + Math.cos(dir) * scale,
                y: player.y2 + Math.sin(dir) * scale,
                sid: Math.round(1000000000000000 + Math.random() * 500)
              };
              let dist = import_utils.default.dist(build2, b2);
              if (!placed && canBuild && dist < b2.scale + item.scale) {
                placed = true;
                build(buildId, dir, 1, 1);
                break;
              }
            }
            if (placed)
              break;
          }
        }
      } else {
        const fibCount = 13;
        for (let i = 0;i < fibCount; i++) {
          const offset = i === 0 ? 0 : GOLDEN_ANGLE * i;
          const dirs = i === 0 ? [angle2] : [angle2 + offset, angle2 - offset];
          for (let dir of dirs) {
            let canBuild = player.buildItem(item, dir, b2);
            const scale = 35 + item.scale + (item.placeOffset || 0);
            let build2 = {
              x: player.x2 + Math.cos(dir) * scale,
              y: player.y2 + Math.sin(dir) * scale,
              sid: Math.round(1000000000000000 + Math.random() * 500)
            };
            let dist = import_utils.default.dist(build2, b2);
            if (!placed && canBuild && dist < b2.scale + item.scale) {
              placed = true;
              build(buildId, dir, 1, 1);
              break;
            }
          }
          if (placed)
            break;
        }
      }
    }
    if (placed) {
      io_client_default.send("5", state.weapon || autoReload(true), true);
      io_client_default.send("c", false, lastAngle);
      built = false;
      lastAngle = 0;
      look(angle);
    }
  }
  objectManager.disableBySid(sid);
}
var tempRes = { wood: 0, stone: 0, food: 0, points: 0, kills: 0 };
var SmoothResource = (e) => {
  if (e >= 1000) {
    return (e / 1000).toFixed(2) + "k";
  } else {
    return e.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }
};
function updateStatusDisplay() {
  if (!player)
    return;
  if (isPrivate3)
    player.points = 1e7;
  tempRes.wood += (player.wood - tempRes.wood) / 15;
  tempRes.stone += (player.stone - tempRes.stone) / 15;
  tempRes.points += (player.points - tempRes.points) / 15;
  tempRes.food += (player.food - tempRes.food) / 15;
  scoreDisplay.innerText = SmoothResource(Math.round(tempRes.points));
  foodDisplay.innerText = SmoothResource(Math.round(tempRes.food));
  woodDisplay.innerText = SmoothResource(Math.round(tempRes.wood));
  stoneDisplay.innerText = SmoothResource(Math.round(tempRes.stone));
  killCounter.innerText = player.kills;
}
setInterval(updateStatusDisplay, 10);
var iconSprites = {};
var icons = ["crown", "skull"];
function loadIcons() {
  for (let i = 0;i < icons.length; ++i) {
    const tmpSprite = new Image;
    tmpSprite.onload = function() {
      this.isLoaded = true;
    };
    tmpSprite.src = `.././img/icons/${icons[i]}.png`;
    iconSprites[icons[i]] = tmpSprite;
  }
}
var tmpList = [];
function updateUpgrades(points, age) {
  player.upgradePoints = points;
  player.upgrAge = age;
  if (points > 0) {
    tmpList.length = 0;
    import_utils.default.removeAllChildren(upgradeHolder);
    for (let i = 0;i < import_items.default.weapons.length; ++i) {
      if (import_items.default.weapons[i].age == age && (import_items.default.weapons[i].pre == undefined || player.weapons.indexOf(import_items.default.weapons[i].pre) >= 0)) {
        const e = import_utils.default.generateElement({
          id: `upgradeItem${i}`,
          class: "actionBarItem",
          parent: upgradeHolder
        });
        e.style.backgroundImage = document.getElementById(`actionBarItem${i}`).style.backgroundImage;
        tmpList.push(i);
      }
    }
    for (let i = 0;i < import_items.default.list.length; ++i) {
      if (import_items.default.list[i].age == age && (import_items.default.list[i].pre == undefined || player.items.indexOf(import_items.default.list[i].pre) >= 0)) {
        const tmpI = import_items.default.weapons.length + i;
        const e = import_utils.default.generateElement({
          id: `upgradeItem${tmpI}`,
          class: "actionBarItem",
          parent: upgradeHolder
        });
        e.style.backgroundImage = document.getElementById(`actionBarItem${tmpI}`).style.backgroundImage;
        tmpList.push(tmpI);
      }
    }
    for (let i = 0;i < tmpList.length; i++) {
      (function(i2) {
        const tmpItem = document.getElementById(`upgradeItem${i2}`);
        tmpItem.onclick = import_utils.default.checkTrusted(function() {
          io_client_default.send("6", i2);
        });
        import_utils.default.hookTouchEvents(tmpItem);
      })(tmpList[i]);
    }
    if (tmpList.length) {
      upgradeHolder.style.display = "block";
      upgradeCounter.style.display = "block";
      upgradeCounter.innerHTML = `SELECT ITEMS (${points})`;
    } else {
      upgradeHolder.style.display = "none";
      upgradeCounter.style.display = "none";
    }
  } else {
    upgradeHolder.style.display = "none";
    upgradeCounter.style.display = "none";
  }
}
function updateAge(xp, mxp, age) {
  if (xp != null)
    player.XP = xp;
  if (mxp != null)
    player.maxXP = mxp;
  if (age != null)
    player.age = age;
  if (age == config_default.maxAge) {} else {
    ageText.innerHTML = `AGE ${player.age}`;
  }
}
function updateLeaderboard(data) {
  import_utils.default.removeAllChildren(leaderboardData);
  let tmpC = 1;
  for (let i = 0;i < data.length; i += 3) {
    (function(i2) {
      import_utils.default.generateElement({
        class: "leaderHolder",
        parent: leaderboardData,
        children: [
          import_utils.default.generateElement({
            class: "leaderboardItem",
            style: `color:${data[i2] == playerSID ? "#fff" : "rgba(255,255,255,0.6)"}`,
            text: `${tmpC}. ${data[i2 + 1] != "" ? data[i2 + 1] : "unknown"}`
          }),
          import_utils.default.generateElement({
            class: "leaderScore",
            text: import_utils.default.kFormat(data[i2 + 2]) || "0"
          })
        ]
      });
    })(i);
    tmpC++;
  }
}
if (movie) {
  const overlay = document.createElement("div");
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.pointerEvents = "none";
  overlay.style.background = "repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 3px, transparent 3px, transparent 25px)";
  overlay.style.zIndex = "999";
  gameCanvas.parentElement.appendChild(overlay);
}
document.multis2 = 0.3;
var Particles = [];

class Particle {
  constructor(x, y, dir, color, small) {
    this.x = x;
    this.y = y;
    this.dir = dir - Math.PI / 3 + Math.random() * Math.PI * 0.75;
    this.scale = small ? 7 : 17;
    this.speed = 2;
    this.updated = Date.now();
    this.active = true;
    this.maxScale = this.scale;
    this.color = color;
  }
  update(xOffset, yOffset, ctx = mainContext) {
    const now2 = Date.now();
    const dt = (now2 - this.updated) / (1000 / 60);
    this.scale -= document.multis2 * dt;
    if (this.scale <= 0.1) {
      const id = Particles.indexOf(this);
      if (id > -1)
        Particles.splice(id, 1);
      return;
    }
    this.speed = this.scale / 4;
    this.x += Math.cos(this.dir) * this.speed * dt;
    this.y += Math.sin(this.dir) * this.speed * dt;
    this.updated = now2;
    ctx.save();
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 5;
    ctx.globalAlpha = this.scale / this.maxScale;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x - xOffset, this.y - yOffset, this.scale, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }
}
var xOffset;
var yOffset;
function updateGame() {
  if (player) {
    if (!lastSent || now - lastSent >= 1000 / config_default.clientSendRate) {
      lastSent = now;
    }
  }
  if (deathTextScale < 120) {
    deathTextScale += 0.1 * delta;
    diedText.style.fontSize = `${Math.min(Math.round(deathTextScale), 120)}px`;
  }
  if (player) {
    const tmpDist = import_utils.default.getDistance(camX, camY, player.x, player.y);
    const tmpDir2 = import_utils.default.getDirection(player.x, player.y, camX, camY);
    const camSpd = Math.min(tmpDist * 0.01 * delta, tmpDist);
    if (tmpDist > 0.05) {
      camX += camSpd * Math.cos(tmpDir2);
      camY += camSpd * Math.sin(tmpDir2);
    } else {
      camX = player.x;
      camY = player.y;
    }
  } else {
    camX = config_default.mapScale / 2;
    camY = config_default.mapScale / 2;
  }
  const lastTime = now - 1000 / config_default.serverUpdateRate;
  for (let i = 0;i < players.length + ais.length; ++i) {
    tmpObj2 = players[i] || ais[i - players.length];
    if (tmpObj2 && tmpObj2.visible) {
      if (tmpObj2.forcePos) {
        tmpObj2.x = tmpObj2.x2;
        tmpObj2.y = tmpObj2.y2;
        tmpObj2.dir = tmpObj2.d2;
      } else {
        const total = tmpObj2.t2 - tmpObj2.t1;
        const fraction = lastTime - tmpObj2.t1;
        const ratio = fraction / total;
        const rate = 200;
        tmpObj2.dt += delta;
        const tmpRate = Math.min(1.7, tmpObj2.dt / rate);
        let tmpDiff = tmpObj2.x2 - tmpObj2.x1;
        tmpObj2.x = tmpObj2.x1 + tmpDiff * tmpRate;
        tmpDiff = tmpObj2.y2 - tmpObj2.y1;
        tmpObj2.y = tmpObj2.y1 + tmpDiff * tmpRate;
        tmpObj2.dir = Math.lerpAngle(tmpObj2.d2, tmpObj2.d1, Math.min(1.2, ratio));
      }
    }
  }
  xOffset = camX - maxScreenWidth2 / 2;
  yOffset = camY - maxScreenHeight2 / 2;
  if (config_default.snowBiomeTop - yOffset <= 0 && config_default.mapScale - config_default.snowBiomeTop - yOffset >= maxScreenHeight2) {
    mainContext.fillStyle = "#b6db66";
    mainContext.fillRect(0, 0, maxScreenWidth2, maxScreenHeight2);
  } else if (config_default.mapScale - config_default.snowBiomeTop - yOffset <= 0) {
    mainContext.fillStyle = "#dbc666";
    mainContext.fillRect(0, 0, maxScreenWidth2, maxScreenHeight2);
  } else if (config_default.snowBiomeTop - yOffset >= maxScreenHeight2) {
    mainContext.fillStyle = "#fff";
    mainContext.fillRect(0, 0, maxScreenWidth2, maxScreenHeight2);
  } else if (config_default.snowBiomeTop - yOffset >= 0) {
    mainContext.fillStyle = "#fff";
    mainContext.fillRect(0, 0, maxScreenWidth2, config_default.snowBiomeTop - yOffset);
    mainContext.fillStyle = "#b6db66";
    mainContext.fillRect(0, config_default.snowBiomeTop - yOffset, maxScreenWidth2, maxScreenHeight2 - (config_default.snowBiomeTop - yOffset));
  } else {
    mainContext.fillStyle = "#b6db66";
    mainContext.fillRect(0, 0, maxScreenWidth2, config_default.mapScale - config_default.snowBiomeTop - yOffset);
    mainContext.fillStyle = "#dbc666";
    mainContext.fillRect(0, config_default.mapScale - config_default.snowBiomeTop - yOffset, maxScreenWidth2, maxScreenHeight2 - (config_default.mapScale - config_default.snowBiomeTop - yOffset));
  }
  if (!firstSetup) {
    waterMult += waterPlus * config_default.waveSpeed * delta;
    if (waterMult >= config_default.waveMax) {
      waterMult = config_default.waveMax;
      waterPlus = -1;
    } else if (waterMult <= 1) {
      waterMult = waterPlus = 1;
    }
    mainContext.globalAlpha = 1;
    mainContext.fillStyle = "#dbc666";
    renderWaterBodies(xOffset, yOffset, mainContext, config_default.riverPadding);
    mainContext.fillStyle = "#91b2db";
    renderWaterBodies(xOffset, yOffset, mainContext, (waterMult - 1) * 250);
  }
  const gridSize = 60;
  mainContext.lineWidth = 4;
  mainContext.strokeStyle = "#000";
  if (!movie) {
    mainContext.globalAlpha = 0.06;
    mainContext.beginPath();
    for (let x = -camX % gridSize;x < maxScreenWidth2; x += gridSize) {
      mainContext.moveTo(x, 0);
      mainContext.lineTo(x, maxScreenHeight2);
    }
    for (let y = -camY % gridSize;y < maxScreenHeight2; y += gridSize) {
      mainContext.moveTo(0, y);
      mainContext.lineTo(maxScreenWidth2, y);
    }
  }
  mainContext.stroke();
  mainContext.globalAlpha = 1;
  mainContext.strokeStyle = outlineColor;
  renderGameObjects(-1, xOffset, yOffset);
  mainContext.globalAlpha = 1;
  mainContext.lineWidth = outlineWidth;
  renderProjectiles(0, xOffset, yOffset);
  renderPlayers(xOffset, yOffset, 0);
  mainContext.globalAlpha = 1;
  for (let i = 0;i < ais.length; ++i) {
    tmpObj2 = ais[i];
    if (tmpObj2.active && tmpObj2.visible) {
      tmpObj2.animate(delta);
      mainContext.save();
      mainContext.translate(tmpObj2.x - xOffset, tmpObj2.y - yOffset);
      mainContext.rotate(tmpObj2.dir + tmpObj2.dirPlus - Math.PI / 2);
      renderAI(tmpObj2, mainContext);
      mainContext.restore();
    } else {
      if (tmpObj2.aiTrail)
        tmpObj2.aiTrail = [];
    }
  }
  const Length = Particles.length;
  for (let id = 0;id < Length; id++)
    Particles[id] && Particles[id].update(xOffset, yOffset);
  renderGameObjects(0, xOffset, yOffset);
  renderProjectiles(1, xOffset, yOffset);
  renderGameObjects(1, xOffset, yOffset);
  renderPlayers(xOffset, yOffset, 1);
  renderGameObjects(2, xOffset, yOffset);
  renderGameObjects(3, xOffset, yOffset);
  mainContext.fillStyle = "#000";
  mainContext.globalAlpha = 0.09;
  if (xOffset <= 0) {
    mainContext.fillRect(0, 0, -xOffset, maxScreenHeight2);
  }
  if (config_default.mapScale - xOffset <= maxScreenWidth2) {
    const tmpY = Math.max(0, -yOffset);
    mainContext.fillRect(config_default.mapScale - xOffset, tmpY, maxScreenWidth2 - (config_default.mapScale - xOffset), maxScreenHeight2 - tmpY);
  }
  if (yOffset <= 0) {
    mainContext.fillRect(-xOffset, 0, maxScreenWidth2 + xOffset, -yOffset);
  }
  if (config_default.mapScale - yOffset <= maxScreenHeight2) {
    const tmpX = Math.max(0, -xOffset);
    let tmpMin = 0;
    if (config_default.mapScale - xOffset <= maxScreenWidth2)
      tmpMin = maxScreenWidth2 - (config_default.mapScale - xOffset);
    mainContext.fillRect(tmpX, config_default.mapScale - yOffset, maxScreenWidth2 - tmpX - tmpMin, maxScreenHeight2 - (config_default.mapScale - yOffset));
  }
  if (path?.length) {
    mainContext.save();
    mainContext.translate(-xOffset, -yOffset);
    Pathfinder.draw(mainContext, player);
    mainContext.restore();
  }
  if (circles.length || arrows.length || lines.length) {
    mainContext.save();
    mainContext.globalAlpha = 1;
    mainContext.lineWidth = 3;
    for (let arrow of arrows) {
      if (!arrow.colour)
        arrow.colour = "#6e00ff";
      mainContext.fillStyle = arrow.colour;
      mainContext.strokeStyle = arrow.colour;
      const fromX = arrow.fromX - xOffset;
      const fromY = arrow.fromY - yOffset;
      const toX = arrow.toX - xOffset;
      const toY = arrow.toY - yOffset;
      mainContext.beginPath();
      mainContext.moveTo(fromX, fromY);
      mainContext.lineTo(toX, toY);
      mainContext.stroke();
      const headLength = arrow.headLength || 15;
      const angle = Math.atan2(toY - fromY, toX - fromX);
      mainContext.beginPath();
      mainContext.moveTo(toX, toY);
      mainContext.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
      mainContext.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
      mainContext.closePath();
      mainContext.globalAlpha = 0.3;
      mainContext.fill();
      mainContext.globalAlpha = 1;
      mainContext.stroke();
    }
    for (let circle of circles) {
      if (!circle.colour)
        circle.colour = "#6e00ff";
      mainContext.fillStyle = circle.colour;
      mainContext.strokeStyle = circle.colour;
      mainContext.beginPath();
      mainContext.arc(circle.x - xOffset, circle.y - yOffset, circle.scale || 35, 0, Math.PI * 2);
      mainContext.globalAlpha = 0.3;
      mainContext.fill();
      mainContext.globalAlpha = 1;
      mainContext.stroke();
    }
    for (let line of lines) {
      if (!line.colour)
        line.colour = "#6e00ff";
      mainContext.strokeStyle = line.colour;
      mainContext.lineWidth = line.width || 3;
      mainContext.beginPath();
      mainContext.moveTo(line.x1 - xOffset, line.y1 - yOffset);
      mainContext.lineTo(line.x2 - xOffset, line.y2 - yOffset);
      mainContext.globalAlpha = 0.6;
      mainContext.stroke();
      mainContext.globalAlpha = 1;
    }
    mainContext.restore();
  }
  mainContext.globalAlpha = 1;
  mainContext.fillStyle = movie ? `rgba(0, 0, 0, 0.15)` : `rgba(0, 0, 70, 0.3)`;
  mainContext.fillRect(0, 0, maxScreenWidth2, maxScreenHeight2);
  buildHealth();
  buildIndicator();
  mainContext.strokeStyle = darkOutlineColor;
  for (let i = 0;i < players.length + ais.length; ++i) {
    tmpObj2 = players[i] || ais[i - players.length];
    if (tmpObj2.visible) {
      if (tmpObj2.skinIndex != 10 || tmpObj2 == player || tmpObj2.team && tmpObj2.team == player.team) {
        const tmpText = (tmpObj2.team ? `[${tmpObj2.team}] ` : "") + (tmpObj2.name || "");
        if (tmpText != "") {
          mainContext.font = `${tmpObj2.nameScale || 30}px Hammersmith One`;
          mainContext.fillStyle = "#fff";
          mainContext.textBaseline = "middle";
          mainContext.textAlign = "center";
          mainContext.lineWidth = tmpObj2.nameScale ? 11 : 8;
          mainContext.lineJoin = "round";
          mainContext.strokeText(tmpText, tmpObj2.x - xOffset, tmpObj2.y - yOffset - tmpObj2.scale - config_default.nameY);
          mainContext.fillText(tmpText, tmpObj2.x - xOffset, tmpObj2.y - yOffset - tmpObj2.scale - config_default.nameY);
          if (tmpObj2.isLeader && iconSprites["crown"].isLoaded) {
            const tmpS = config_default.crownIconScale;
            const tmpX = tmpObj2.x - xOffset - tmpS / 2 - mainContext.measureText(tmpText).width / 2 - config_default.crownPad;
            mainContext.drawImage(iconSprites["crown"], tmpX, tmpObj2.y - yOffset - tmpObj2.scale - config_default.nameY - tmpS / 2 - 5, tmpS, tmpS);
          }
          if (tmpObj2.iconIndex == 1 && iconSprites["skull"].isLoaded) {
            const tmpS = config_default.crownIconScale;
            const tmpX = tmpObj2.x - xOffset - tmpS / 2 + mainContext.measureText(tmpText).width / 2 + config_default.crownPad;
            mainContext.drawImage(iconSprites["skull"], tmpX, tmpObj2.y - yOffset - tmpObj2.scale - config_default.nameY - tmpS / 2 - 5, tmpS, tmpS);
          }
        }
        if (!window._healthLerp)
          window._healthLerp = new WeakMap;
        let myPlayer = tmpObj2.isPlayer && player.sid === tmpObj2.sid;
        if (tmpObj2.health > 0) {
          if (tmpObj2.isPlayer) {
            let tmpWidth = config_default.healthBarWidth;
            if (!tmpObj2.reload[2].done) {
              mainContext.fillStyle = darkOutlineColor;
              mainContext.roundRect(tmpObj2.x - xOffset - config_default.healthBarWidth - config_default.healthBarPad, tmpObj2.y - yOffset + tmpObj2.scale + config_default.nameY - 12, config_default.healthBarWidth * 2 + config_default.healthBarPad * 2, 17, 8);
              mainContext.fill();
              if (!tmpObj2.reload[2].visual)
                tmpObj2.reload[2].visual = 0;
              let reload2Target = Math.min(1, tmpObj2.reload[2].count / tmpObj2.reload[2].max);
              if (reload2Target > tmpObj2.reload[2].visual) {
                tmpObj2.reload[2].visual += (reload2Target - tmpObj2.reload[2].visual) * 0.1;
              } else {
                tmpObj2.reload[2].visual = reload2Target;
              }
              mainContext.fillStyle = "#CCCC51";
              mainContext.roundRect(tmpObj2.x - xOffset - config_default.healthBarWidth, tmpObj2.y - yOffset + tmpObj2.scale + config_default.nameY + config_default.healthBarPad - 12, config_default.healthBarWidth * 2 * tmpObj2.reload[2].visual, 17 - config_default.healthBarPad * 2, 7);
              mainContext.fill();
            }
            let spacing = 7;
            if (!myPlayer) {
              mainContext.fillStyle = darkOutlineColor;
              mainContext.roundRect(tmpObj2.x - xOffset - config_default.healthBarWidth - config_default.healthBarPad, tmpObj2.y - yOffset + tmpObj2.scale - 12 + config_default.nameY, config_default.healthBarWidth * 2 + config_default.healthBarPad * 2, 17, 8);
              mainContext.fill();
            }
            let fullWidth = config_default.healthBarWidth * 2;
            let barStartX = tmpObj2.x - xOffset - config_default.healthBarWidth;
            let barY = tmpObj2.y - yOffset + tmpObj2.scale + config_default.nameY - 12 + config_default.healthBarPad;
            let barHeight = 17 - config_default.healthBarPad * 2;
            const colours = ["#e19c30", "#CCCC51"];
            if (!tmpObj2.reload[0].visual)
              tmpObj2.reload[0].visual = 0;
            let reload0Target = Math.min(1, tmpObj2.reload[0].count / tmpObj2.reload[0].max);
            if (reload0Target > tmpObj2.reload[0].visual) {
              tmpObj2.reload[0].visual += (reload0Target - tmpObj2.reload[0].visual) * 0.1;
            } else {
              tmpObj2.reload[0].visual = reload0Target;
            }
            if (!myPlayer) {
              let colour0 = tmpObj2.reload[1].done && tmpObj2.reload[0].done ? colours[0] : colours[1];
              mainContext.fillStyle = colour0;
              mainContext.roundRect(barStartX, barY, (fullWidth * 0.5 - spacing / 2) * tmpObj2.reload[0].visual, barHeight, 7);
              mainContext.fill();
            }
            if (!tmpObj2.reload[1].visual)
              tmpObj2.reload[1].visual = 0;
            let reload1Target = Math.min(1, tmpObj2.reload[1].count / tmpObj2.reload[1].max);
            if (reload1Target > tmpObj2.reload[1].visual) {
              tmpObj2.reload[1].visual += (reload1Target - tmpObj2.reload[1].visual) * 0.1;
            } else {
              tmpObj2.reload[1].visual = reload1Target;
            }
            if (!myPlayer) {
              let colour1 = tmpObj2.reload[1].done && tmpObj2.reload[0].done ? colours[0] : colours[1];
              mainContext.fillStyle = colour1;
              mainContext.roundRect(barStartX + fullWidth * 0.5 + spacing / 2, barY, (fullWidth * 0.5 - spacing / 2) * tmpObj2.reload[1].visual, barHeight, 7);
              mainContext.fill();
            }
            if (myPlayer) {
              const bar0 = document.getElementById("reloadBar0");
              const bar1 = document.getElementById("reloadBar1");
              if (bar0 && bar1) {
                const colours2 = ["#e19c30", "#CCCC51"];
                let isDone = tmpObj2.reload[1].done && tmpObj2.reload[0].done;
                let colour = isDone ? colours2[0] : colours2[1];
                bar0.style.width = tmpObj2.reload[0].visual * 100 + "%";
                bar1.style.width = tmpObj2.reload[1].visual * 100 + "%";
                bar0.style.backgroundColor = colour;
                bar1.style.backgroundColor = colour;
              }
            }
          }
          if (myPlayer) {
            const healthRatio = player.health / player.maxHealth;
            const potDmgRatio = Math.min(damage, 100) / 100;
            if (ageBarBody && ageBarPot) {
              let fullHealthPercent = healthRatio * 100;
              ageBarBody.style.width = fullHealthPercent + "%";
              ageBarBody.style.left = "0px";
              let damagePercent = potDmgRatio * 100;
              ageBarPot.style.width = Math.min(damagePercent, fullHealthPercent) + "%";
              let startPoint = fullHealthPercent - damagePercent;
              ageBarPot.style.left = Math.max(0, startPoint) + "%";
            }
          } else {
            const isFriendly = tmpObj2 == player || tmpObj2.team && tmpObj2.team == player.team;
            const lerpSpeed = 0.12;
            const prev = _healthLerp.get(tmpObj2) ?? tmpObj2.health;
            const lerpedHealth = prev + (tmpObj2.health - prev) * lerpSpeed;
            _healthLerp.set(tmpObj2, lerpedHealth);
            const healthRatio = lerpedHealth / tmpObj2.maxHealth;
            const healthBarW = config_default.healthBarWidth * 2 * healthRatio;
            const barX = tmpObj2.x - xOffset - config_default.healthBarWidth;
            const barY = tmpObj2.y - yOffset + tmpObj2.scale + config_default.nameY + config_default.healthBarPad;
            const barH = 17 - config_default.healthBarPad * 2;
            mainContext.fillStyle = darkOutlineColor;
            mainContext.roundRect(tmpObj2.x - xOffset - config_default.healthBarWidth - config_default.healthBarPad, tmpObj2.y - yOffset + tmpObj2.scale + config_default.nameY, config_default.healthBarWidth * 2 + config_default.healthBarPad * 2, 17, 8);
            mainContext.fill();
            mainContext.fillStyle = isFriendly ? "#8ecc51" : "#cc5151";
            mainContext.roundRect(barX, barY, healthBarW, barH, 7);
            mainContext.fill();
          }
        }
      }
    }
  }
  textManager.update(delta, mainContext, xOffset, yOffset);
  for (let i = 0;i < players.length; ++i) {
    tmpObj2 = players[i];
    if (tmpObj2.visible && tmpObj2.chatCountdown > 0) {
      tmpObj2.chatCountdown -= delta;
      if (tmpObj2.chatCountdown <= 0) {
        tmpObj2.chatCountdown = 0;
      }
      mainContext.font = "32px Hammersmith One";
      const tmpSize = mainContext.measureText(tmpObj2.chatMessage);
      mainContext.textBaseline = "middle";
      mainContext.textAlign = "center";
      const tmpX = tmpObj2.x - xOffset;
      const tmpY = tmpObj2.y - tmpObj2.scale - yOffset - 90;
      const tmpH = 47;
      const tmpW = tmpSize.width + 17;
      mainContext.fillStyle = "rgba(0,0,0,0.2)";
      mainContext.roundRect(tmpX - tmpW / 2, tmpY - tmpH / 2, tmpW, tmpH, 6);
      mainContext.fill();
      mainContext.fillStyle = "#fff";
      mainContext.fillText(tmpObj2.chatMessage, tmpX, tmpY);
    }
  }
  renderMinimap(delta);
  drawAdvisor();
  if (controllingTouch.id !== -1) {
    renderControl(controllingTouch.startX, controllingTouch.startY, controllingTouch.currentX, controllingTouch.currentY);
  }
  if (attackingTouch.id !== -1) {
    renderControl(attackingTouch.startX, attackingTouch.startY, attackingTouch.currentX, attackingTouch.currentY);
  }
}
function renderControl(startX, startY, currentX, currentY) {
  mainContext.save();
  mainContext.setTransform(1, 0, 0, 1, 0, 0);
  mainContext.scale(pixelDensity, pixelDensity);
  let controlRadius = 50;
  mainContext.beginPath();
  mainContext.arc(startX, startY, controlRadius, 0, Math.PI * 2, false);
  mainContext.closePath();
  mainContext.fillStyle = "rgba(255, 255, 255, 0.3)";
  mainContext.fill();
  controlRadius = 50;
  let offsetX = currentX - startX;
  let offsetY = currentY - startY;
  const mag = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
  const divisor = mag > controlRadius ? mag / controlRadius : 1;
  offsetX /= divisor;
  offsetY /= divisor;
  mainContext.beginPath();
  mainContext.arc(startX + offsetX, startY + offsetY, controlRadius * 0.5, 0, Math.PI * 2, false);
  mainContext.closePath();
  mainContext.fillStyle = "white";
  mainContext.fill();
  mainContext.restore();
}
function renderProjectiles(layer, xOffset2, yOffset2) {
  for (let i = 0;i < projectiles2.length; ++i) {
    tmpObj2 = projectiles2[i];
    if (tmpObj2.active && tmpObj2.layer == layer) {
      tmpObj2.update(delta);
      if (tmpObj2.active && isOnScreen(tmpObj2.x - xOffset2, tmpObj2.y - yOffset2, tmpObj2.scale)) {
        mainContext.save();
        mainContext.translate(tmpObj2.x - xOffset2, tmpObj2.y - yOffset2);
        mainContext.rotate(tmpObj2.dir);
        renderProjectile(0, 0, tmpObj2, mainContext, 1);
        mainContext.restore();
      }
    }
  }
}
var projectileSprites = {};
function renderProjectile(x, y, obj, ctxt) {
  if (obj.src) {
    const tmpSrc = import_items.default.projectiles[obj.indx].src;
    let tmpSprite = projectileSprites[tmpSrc];
    if (!tmpSprite) {
      tmpSprite = new Image;
      tmpSprite.onload = function() {
        this.isLoaded = true;
      };
      tmpSprite.src = `.././img/weapons/${tmpSrc}.png`;
      projectileSprites[tmpSrc] = tmpSprite;
    }
    if (tmpSprite.isLoaded) {
      ctxt.drawImage(tmpSprite, x - obj.scale / 2, y - obj.scale / 2, obj.scale, obj.scale);
    }
  } else if (obj.indx == 1) {
    ctxt.fillStyle = "#939393";
    renderCircle(x, y, obj.scale, ctxt);
  }
}
function renderWaterBodies(xOffset2, yOffset2, ctxt, padding) {
  const tmpW = config_default.riverWidth + padding;
  const tmpY = config_default.mapScale / 2 - yOffset2 - tmpW / 2;
  if (tmpY < maxScreenHeight2 && tmpY + tmpW > 0) {
    ctxt.fillRect(0, tmpY, maxScreenWidth2, tmpW);
  }
}
function buildIndicator() {
  mainContext.save();
  for (let i = 0;i < objects.length; ++i) {
    tmpObj2 = objects[i];
    let tmpX = tmpObj2.x + tmpObj2.xWiggle - xOffset, tmpY = tmpObj2.y + tmpObj2.yWiggle - yOffset;
    if (!isOnScreen(tmpX, tmpY, tmpObj2.scale + (tmpObj2.blocker || 0)) || !tmpObj2.isItem || tmpObj2.sid >= 1000000000000000 || !tmpObj2.health || !tmpObj2.active || ![6, 7, 8, 9, 15].includes(tmpObj2.id) || ally(tmpObj2.owner.sid))
      continue;
    mainContext.fillStyle = "#cc5151";
    mainContext.beginPath();
    mainContext.arc(tmpX, tmpY, tmpObj2.scale, 0, Math.PI * 2);
    mainContext.globalAlpha = 0.25;
    mainContext.fill();
  }
  mainContext.restore();
}
function buildHealth() {
  for (let i = 0;i < objects.length; ++i) {
    tmpObj2 = objects[i];
    let tmpX = tmpObj2.x + tmpObj2.xWiggle - xOffset, tmpY = tmpObj2.y + tmpObj2.yWiggle - yOffset;
    if (!isOnScreen(tmpX, tmpY, tmpObj2.scale + (tmpObj2.blocker || 0)) || !tmpObj2.isItem || tmpObj2.sid >= 1000000000000000 || !tmpObj2.health || tmpObj2.health <= 0 || !tmpObj2.active || tmpObj2.health === tmpObj2.maxHealth)
      continue;
    if (tmpObj2.health2 === undefined)
      tmpObj2.health2 = tmpObj2.health;
    tmpObj2.health2 += (tmpObj2.health - tmpObj2.health2) * 0.15;
    tmpObj2.health2 = Math.min(tmpObj2.health2, tmpObj2.maxHealth);
    let tmpWidth = config_default.healthBarWidth;
    mainContext.fillStyle = darkOutlineColor;
    mainContext.roundRect(tmpX - config_default.healthBarWidth / 2 - config_default.healthBarPad, tmpY + tmpObj2.scale / 2 + config_default.nameY, config_default.healthBarWidth + config_default.healthBarPad * 2, 17, 8);
    mainContext.fill();
    const sid = tmpObj2.owner?.sid;
    mainContext.fillStyle = ally(sid) ? "#8ecc51" : "#cc5151";
    mainContext.roundRect(tmpX - config_default.healthBarWidth / 2, tmpY + tmpObj2.scale / 2 + config_default.nameY + config_default.healthBarPad, config_default.healthBarWidth * (tmpObj2.health2 / tmpObj2.maxHealth), 17 - config_default.healthBarPad * 2, 7);
    mainContext.fill();
  }
}
function renderGameObjects(layer, xOffset2, yOffset2) {
  let tmpSprite, tmpX, tmpY, real;
  let now2 = performance.now();
  for (let i = 0;i < objects.length; ++i) {
    let tmpObj3 = objects[i];
    if (!tmpObj3.active)
      continue;
    tmpX = tmpObj3.x + tmpObj3.xWiggle - xOffset2;
    tmpY = tmpObj3.y + tmpObj3.yWiggle - yOffset2;
    if (layer == 0) {
      tmpObj3.update(delta);
    }
    if (tmpObj3.layer == layer && isOnScreen(tmpX, tmpY, tmpObj3.scale + (tmpObj3.blocker || 0))) {
      real = tmpObj3.sid < 1000000000000000;
      let baseAlpha = tmpObj3.trap ? 0.6 : 1;
      if (!real)
        baseAlpha -= 0.4;
      if (real && tmpObj3.tween) {
        let fadeDuration = 500;
        let elapsed = now2 - tmpObj3.tween;
        if (elapsed < fadeDuration) {
          let multiplier = Math.sin(elapsed / fadeDuration * Math.PI);
          mainContext.globalAlpha = baseAlpha - 0.4 * multiplier;
        } else {
          mainContext.globalAlpha = baseAlpha;
        }
      } else {
        mainContext.globalAlpha = baseAlpha;
      }
      if (tmpObj3.isItem) {
        tmpSprite = getItemSprite(tmpObj3);
        mainContext.save();
        mainContext.translate(tmpX, tmpY);
        mainContext.rotate(tmpObj3.dir);
        mainContext.scale(1.1, 1.1);
        let { globalAlpha } = mainContext;
        mainContext.globalAlpha -= 0.4;
        mainContext.drawImage(tmpSprite, -tmpSprite.width / 2, -tmpSprite.height / 2);
        mainContext.scale(1 / 1.1, 1 / 1.1);
        mainContext.globalAlpha = globalAlpha;
        mainContext.drawImage(tmpSprite, -(tmpSprite.width / 2), -(tmpSprite.height / 2));
        if (tmpObj3.blocker && real) {
          mainContext.strokeStyle = "#db6e6e";
          let originalAlpha = mainContext.globalAlpha;
          mainContext.globalAlpha = 0.3;
          mainContext.lineWidth = 6;
          renderCircle(0, 0, tmpObj3.blocker, mainContext, false, true);
          mainContext.globalAlpha = originalAlpha;
        }
        mainContext.restore();
        if ([6, 7, 8, 9].includes(tmpObj3.id) && !ally(tmpObj3.owner.sid)) {
          renderFade(mainContext, tmpX, tmpY, tmpObj3);
        }
      } else {
        tmpSprite = getResSprite(tmpObj3);
        mainContext.save();
        mainContext.translate(tmpX, tmpY);
        mainContext.rotate(tmpObj3.dir);
        mainContext.scale(1.05, 1.05);
        mainContext.globalAlpha = 0.5;
        mainContext.drawImage(tmpSprite, -tmpSprite.width / 2, -tmpSprite.height / 2);
        mainContext.scale(1 / 1.05, 1 / 1.05);
        mainContext.globalAlpha = 1;
        mainContext.drawImage(tmpSprite, -(tmpSprite.width / 2), -(tmpSprite.height / 2));
        mainContext.restore();
      }
    }
  }
}
function wiggleGameObject(dir, sid) {
  tmpObj2 = findObjectBySid(sid);
  if (tmpObj2) {
    tmpObj2.xWiggle += config_default.gatherWiggle * Math.cos(dir);
    tmpObj2.yWiggle += config_default.gatherWiggle * Math.sin(dir);
    tmpObj2.wiggleDate = performance.now();
    if (tmpObj2.active && tmpObj2.isItem && tmpObj2.sid < 1000000000000000 && tmpObj2.health > 0) {
      if (objectManager.hitObj.indexOf(tmpObj2) === -1) {
        objectManager.hitObj.push(tmpObj2);
      }
    }
  }
}
function gatherAnimation(sid, didHit, index) {
  tmpObj2 = findPlayerBySID(sid);
  if (!tmpObj2)
    return;
  if (tmpObj2.daggerHand === undefined) {
    tmpObj2.daggerHand = 0;
  }
  if (dagAnim && tmpObj2.weaponIndex === 7) {
    tmpObj2.daggerHand = tmpObj2.daggerHand === 0 ? 1 : 0;
  }
  tmpObj2.startAnim(didHit, index);
  tmpObj2.gatherIndex = index;
  tmpObj2.gathering = 1;
  if (didHit) {
    const tmpObjects = objectManager.hitObj;
    objectManager.hitObj = [];
    delay(() => {
      tmpObj2 = findPlayerBySID(sid);
      if (!tmpObj2)
        return;
      console.log("variant: " + config_default.weaponVariants[tmpObj2.weaponVariant].val, "hat: " + tmpObj2.skinIndex2);
      let val = import_items.default.weapons[index].dmg * config_default.weaponVariants[tmpObj2.weaponVariant].val * (import_items.default.weapons[index].sDmg || 1) * (tmpObj2.skinIndex2 == 40 ? 3.3 : 1);
      tmpObjects.forEach((healthy) => {
        healthy.health -= val;
      });
    }, 1);
  }
  queue.push({ function: gatherAction, data: [tmpObj2, didHit, index] });
}
function gatherAction(tmpPlayer, didHit, index) {
  let hitObjs = tmpPlayer.gather(didHit, index);
  if (resAnim && tmpPlayer === player)
    for (let tmpObj3 of hitObjs) {
      if (!tmpObj3.isItem) {
        if (tmpObj3.type === 0) {
          spawnParticles(tmpObj3.x, tmpObj3.y, "img/resources/wood_ico.png", "woodDisplay");
        } else if (tmpObj3.type === 1) {
          spawnParticles(tmpObj3.x, tmpObj3.y, "img/resources/food_ico.png", "foodDisplay");
        } else if (tmpObj3.type === 2) {
          spawnParticles(tmpObj3.x, tmpObj3.y, "img/resources/stone_ico.png", "stoneDisplay");
        }
      }
    }
}
function renderPlayers(xOffset2, yOffset2, zIndex) {
  mainContext.globalAlpha = 1;
  for (let i = 0;i < players.length; ++i) {
    tmpObj2 = players[i];
    if (tmpObj2.zIndex == zIndex) {
      tmpObj2.animate(delta);
      if (tmpObj2.visible) {
        tmpObj2.skinRot += 0.002 * delta;
        tmpDir = (tmpObj2 == player ? getAttackDir() : tmpObj2.dir) + (!dagAnim || tmpObj2.weaponIndex !== 7 ? tmpObj2.dirPlus : 0);
        if (trail) {
          if (!tmpObj2.playerTrail)
            tmpObj2.playerTrail = [];
          if (!tmpObj2.trailTimer)
            tmpObj2.trailTimer = 0;
          tmpObj2.trailTimer += delta;
          if (tmpObj2.trailTimer >= 16) {
            tmpObj2.playerTrail.push({
              x: tmpObj2.x,
              y: tmpObj2.y,
              dir: tmpDir,
              alpha: 1
            });
            tmpObj2.trailTimer = 0;
            if (tmpObj2.playerTrail.length > 4)
              tmpObj2.playerTrail.shift();
          }
          for (let j = 0;j < tmpObj2.playerTrail.length; j++) {
            const t = tmpObj2.playerTrail[j];
            t.alpha -= 0.015 * delta;
            if (t.alpha > 0) {
              mainContext.save();
              mainContext.globalAlpha = t.alpha * 0.4;
              mainContext.translate(t.x - xOffset2, t.y - yOffset2);
              mainContext.rotate(t.dir);
              renderPlayer(tmpObj2, mainContext);
              mainContext.restore();
            }
          }
        }
        mainContext.save();
        mainContext.translate(tmpObj2.x - xOffset2, tmpObj2.y - yOffset2);
        mainContext.rotate(tmpDir);
        renderPlayer(tmpObj2, mainContext);
        mainContext.restore();
      }
    }
  }
}
function renderPlayer(obj, ctxt) {
  ctxt = ctxt || mainContext;
  ctxt.lineWidth = outlineWidth;
  ctxt.lineJoin = "miter";
  const isDualDagger = dagAnim && obj.weaponIndex === 7 && obj.buildIndex < 0;
  const isPolearm = polearmAnim && obj.buildIndex < 0 && obj.weaponIndex === 5;
  let handAngle = Math.PI / 4 * (import_items.default.weapons[obj.weaponIndex].armS || 1);
  let oHandAngle = obj.buildIndex < 0 ? import_items.default.weapons[obj.weaponIndex].hndS || 1 : 1;
  let oHandDist = obj.buildIndex < 0 ? import_items.default.weapons[obj.weaponIndex].hndD || 1 : 1;
  const handDistMult = isDualDagger ? 1.3 : 1;
  let thrust = 0;
  let handClump = 0;
  if (isPolearm) {
    handAngle -= 0.2;
    oHandAngle += 0.9;
    oHandDist += 0.3;
    const reload = obj.reload;
    if (reload && !reload[0].done) {
      const multiplier = Math.min(1, (Date.now() - reload[0].date) / reload[0].max2);
      const ease = Math.pow(Math.sin(multiplier * Math.PI), 0.8);
      thrust = ease * 25;
      handClump = ease * 10;
    }
  }
  if (obj.tailIndex > 0) {
    renderTail(obj.tailIndex, ctxt, obj);
  }
  if (obj.buildIndex < 0 && !import_items.default.weapons[obj.weaponIndex].aboveHand) {
    if (isDualDagger) {
      const weaponData = import_items.default.weapons[obj.weaponIndex];
      const angleOffset = Math.PI / 12;
      const isGathering = obj.animTime > 0;
      const adjustedAnimTime = Math.max(0, obj.animSpeed - obj.animTime * dagAnim);
      const animProgress = isGathering ? 1 - adjustedAnimTime / obj.animSpeed : 0;
      const isLeftHand = obj.daggerHand === 0;
      let stabProgress = 0;
      if (animProgress > 0) {
        if (animProgress < 0.5) {
          stabProgress = animProgress * 2;
        } else {
          const returnProgress = (animProgress - 0.5) * 2;
          if (returnProgress < 0.7) {
            stabProgress = 1 - returnProgress / 0.7 * 1.15;
          } else {
            const smoothReturn = (returnProgress - 0.7) / 0.3;
            stabProgress = -0.15 + 0.15 * (1 - smoothReturn);
          }
        }
      }
      const stabDistance = 45;
      const leftStabProgress = isLeftHand ? stabProgress : 0;
      const rightStabProgress = !isLeftHand ? stabProgress : 0;
      const leftHandX = obj.scale * handDistMult * Math.cos(handAngle) + Math.cos(-angleOffset) * stabDistance * leftStabProgress;
      const leftHandY = obj.scale * handDistMult * Math.sin(handAngle) + Math.sin(-angleOffset) * stabDistance * leftStabProgress;
      const rightHandX = obj.scale * oHandDist * handDistMult * Math.cos(-handAngle * oHandAngle) + Math.cos(angleOffset) * stabDistance * rightStabProgress;
      const rightHandY = obj.scale * oHandDist * handDistMult * Math.sin(-handAngle * oHandAngle) + Math.sin(angleOffset) * stabDistance * rightStabProgress;
      ctxt.save();
      ctxt.translate(leftHandX, leftHandY);
      ctxt.rotate(-angleOffset - leftStabProgress * Math.PI / 8);
      renderTool(weaponData, "dagger_2", 0, 0, ctxt);
      ctxt.restore();
      ctxt.save();
      ctxt.translate(rightHandX, rightHandY);
      ctxt.rotate(angleOffset + rightStabProgress * Math.PI / 8);
      renderTool(weaponData, "dagger_2", 0, 0, ctxt);
      ctxt.restore();
    } else {
      renderTool(import_items.default.weapons[obj.weaponIndex], config_default.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt, obj);
      if (import_items.default.weapons[obj.weaponIndex].projectile != null && !import_items.default.weapons[obj.weaponIndex].hideProjectile) {
        renderProjectile(obj.scale, 0, import_items.default.projectiles[import_items.default.weapons[obj.weaponIndex].projectile], mainContext);
      }
    }
  }
  ctxt.fillStyle = config_default.skinColors[obj.skinColor];
  if (isPolearm)
    ctxt.rotate(Math.PI * 0.4375);
  if (isDualDagger) {
    const angleOffset = Math.PI / 12;
    const isGathering = obj.animTime > 0;
    const adjustedAnimTime = Math.max(0, obj.animSpeed - obj.animTime * dagAnim);
    const animProgress = isGathering ? 1 - adjustedAnimTime / obj.animSpeed : 0;
    const isLeftHand = obj.daggerHand === 0;
    let stabProgress = 0;
    if (animProgress > 0) {
      if (animProgress < 0.5) {
        stabProgress = animProgress * 2;
      } else {
        const returnProgress = (animProgress - 0.5) * 2;
        if (returnProgress < 0.7) {
          stabProgress = 1 - returnProgress / 0.7 * 1.15;
        } else {
          const smoothReturn = (returnProgress - 0.7) / 0.3;
          stabProgress = -0.15 + 0.15 * (1 - smoothReturn);
        }
      }
    }
    const stabDistance = 45;
    const leftStabProgress = isLeftHand ? stabProgress : 0;
    const rightStabProgress = !isLeftHand ? stabProgress : 0;
    renderCircle(obj.scale * handDistMult * Math.cos(handAngle) + Math.cos(-angleOffset) * stabDistance * leftStabProgress, obj.scale * handDistMult * Math.sin(handAngle) + Math.sin(-angleOffset) * stabDistance * leftStabProgress, 14);
    renderCircle(obj.scale * oHandDist * handDistMult * Math.cos(-handAngle * oHandAngle) + Math.cos(angleOffset) * stabDistance * rightStabProgress, obj.scale * oHandDist * handDistMult * Math.sin(-handAngle * oHandAngle) + Math.sin(angleOffset) * stabDistance * rightStabProgress, 14);
  } else if (isPolearm) {
    const reload = obj.reload;
    renderCircle(obj.scale * Math.cos(handAngle) - handClump, obj.scale * Math.sin(handAngle) - thrust, 14, ctxt);
    if (reload && !reload[0].done) {
      renderCircle(obj.scale * oHandDist * Math.cos(-handAngle * oHandAngle), obj.scale * oHandDist * Math.sin(-handAngle * oHandAngle) - thrust * 0.8, 14, ctxt);
    } else {
      renderCircle(obj.scale * oHandDist * Math.cos(-handAngle * oHandAngle), obj.scale * oHandDist * Math.sin(-handAngle * oHandAngle), 14, ctxt);
    }
  } else {
    renderCircle(obj.scale * handDistMult * Math.cos(handAngle), obj.scale * handDistMult * Math.sin(handAngle), 14);
    renderCircle(obj.scale * oHandDist * handDistMult * Math.cos(-handAngle * oHandAngle), obj.scale * oHandDist * handDistMult * Math.sin(-handAngle * oHandAngle), 14);
  }
  if (isPolearm)
    ctxt.rotate(-Math.PI * 0.4375);
  if (obj.buildIndex < 0 && import_items.default.weapons[obj.weaponIndex].aboveHand) {
    if (isDualDagger) {
      const weaponData = import_items.default.weapons[obj.weaponIndex];
      const angleOffset = Math.PI / 12;
      const isGathering = obj.animTime > 0;
      const adjustedAnimTime = Math.max(0, obj.animSpeed - obj.animTime * dagAnim);
      const animProgress = isGathering ? 1 - adjustedAnimTime / obj.animSpeed : 0;
      const isLeftHand = obj.daggerHand === 0;
      let stabProgress = 0;
      if (animProgress > 0) {
        if (animProgress < 0.5) {
          stabProgress = animProgress * 2;
        } else {
          const returnProgress = (animProgress - 0.5) * 2;
          if (returnProgress < 0.7) {
            stabProgress = 1 - returnProgress / 0.7 * 1.15;
          } else {
            const smoothReturn = (returnProgress - 0.7) / 0.3;
            stabProgress = -0.15 + 0.15 * (1 - smoothReturn);
          }
        }
      }
      const stabDistance = 45;
      const leftStabProgress = isLeftHand ? stabProgress : 0;
      const rightStabProgress = !isLeftHand ? stabProgress : 0;
      const leftHandX = obj.scale * handDistMult * Math.cos(handAngle) + Math.cos(-angleOffset) * stabDistance * leftStabProgress;
      const leftHandY = obj.scale * handDistMult * Math.sin(handAngle) + Math.sin(-angleOffset) * stabDistance * leftStabProgress;
      const rightHandX = obj.scale * oHandDist * handDistMult * Math.cos(-handAngle * oHandAngle) + Math.cos(angleOffset) * stabDistance * rightStabProgress;
      const rightHandY = obj.scale * oHandDist * handDistMult * Math.sin(-handAngle * oHandAngle) + Math.sin(angleOffset) * stabDistance * rightStabProgress;
      ctxt.save();
      ctxt.translate(leftHandX, leftHandY);
      ctxt.rotate(-angleOffset - leftStabProgress * Math.PI / 8);
      renderTool(weaponData, "dagger_2", 0, 0, ctxt);
      ctxt.restore();
      ctxt.save();
      ctxt.translate(rightHandX, rightHandY);
      ctxt.rotate(angleOffset + rightStabProgress * Math.PI / 8);
      renderTool(weaponData, "dagger_2", 0, 0, ctxt);
      ctxt.restore();
    } else {
      renderTool(import_items.default.weapons[obj.weaponIndex], config_default.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt, obj);
      if (import_items.default.weapons[obj.weaponIndex].projectile != null && !import_items.default.weapons[obj.weaponIndex].hideProjectile) {
        renderProjectile(obj.scale, 0, import_items.default.projectiles[import_items.default.weapons[obj.weaponIndex].projectile], mainContext);
      }
    }
  }
  if (obj.buildIndex >= 0) {
    const tmpSprite = getItemSprite(import_items.default.list[obj.buildIndex]);
    ctxt.drawImage(tmpSprite, obj.scale - import_items.default.list[obj.buildIndex].holdOffset, -tmpSprite.width / 2);
  }
  renderCircle(0, 0, obj.scale, ctxt);
  if (obj.skinIndex > -1) {
    ctxt.rotate(Math.PI / 2);
    renderSkin(!obj.skinIndex ? isWealthy ? 0 : -1 : obj.skinIndex, ctxt, null, obj);
  }
}
var skinSprites = {};
var skinPointers = {};
var tmpSkin;
function renderSkin(index, ctxt, parentSkin, owner) {
  tmpSkin = skinSprites[index];
  if (!tmpSkin) {
    const tmpImage = new Image;
    tmpImage.onload = function() {
      this.isLoaded = true;
      this.onload = null;
    };
    tmpImage.src = `.././img/skins/hat_${index}.png`;
    skinSprites[index] = tmpImage;
    tmpSkin = tmpImage;
  }
  let tmpObj3 = parentSkin || skinPointers[index];
  if (!tmpObj3) {
    for (let i = 0;i < skins.length; ++i) {
      if (skins[i].id == index) {
        tmpObj3 = skins[i];
        break;
      }
    }
    skinPointers[index] = tmpObj3;
  }
  if (tmpSkin.isLoaded) {
    ctxt.drawImage(tmpSkin, -tmpObj3.scale / 2, -tmpObj3.scale / 2, tmpObj3.scale, tmpObj3.scale);
  }
  if (!parentSkin && tmpObj3?.topSprite) {
    ctxt.save();
    ctxt.rotate(owner.skinRot);
    renderSkin(`${index}_top`, ctxt, tmpObj3, owner);
    ctxt.restore();
  }
}
var accessSprites = {};
var accessPointers = {};
function renderTail(index, ctxt, owner) {
  tmpSkin = accessSprites[index];
  if (!tmpSkin) {
    const tmpImage = new Image;
    tmpImage.onload = function() {
      this.isLoaded = true;
      this.onload = null;
    };
    tmpImage.src = `.././img/tails/access_${index}.png`;
    accessSprites[index] = tmpImage;
    tmpSkin = tmpImage;
  }
  let tmpObj3 = accessPointers[index];
  if (!tmpObj3) {
    for (let i = 0;i < tails.length; ++i) {
      if (tails[i].id == index) {
        tmpObj3 = tails[i];
        break;
      }
    }
    accessPointers[index] = tmpObj3;
  }
  if (tmpSkin.isLoaded) {
    ctxt.save();
    ctxt.translate(-20 - (tmpObj3.xOff || 0), 0);
    if (tmpObj3.spin) {
      ctxt.rotate(owner.skinRot);
    }
    ctxt.drawImage(tmpSkin, -(tmpObj3.scale / 2), -(tmpObj3.scale / 2), tmpObj3.scale, tmpObj3.scale);
    ctxt.restore();
  }
}
var toolSprites = {};
function renderTool(obj, variant, x, y, ctxt, player2) {
  const tmpSrc = dagAnim && variant === "dagger_2" ? variant : obj.src + (variant || "");
  let tmpSprite = toolSprites[tmpSrc];
  if (!tmpSprite) {
    tmpSprite = new Image;
    tmpSprite.onload = function() {
      this.isLoaded = true;
    };
    tmpSprite.src = `.././img/weapons/${tmpSrc}.png`;
    toolSprites[tmpSrc] = tmpSprite;
  }
  if (tmpSprite.isLoaded) {
    const isPolearm = polearmAnim && player2 && player2.buildIndex < 0 && player2.weaponIndex === 5;
    ctxt.save();
    if (isPolearm) {
      const reload = player2.reload;
      let thrust = 0;
      let sidewaysShift = 0;
      let rotationShift = 0;
      if (reload && !reload[0].done) {
        const multiplier = Math.min(1, (Date.now() - reload[0].date) / reload[0].max2);
        const ease = Math.pow(Math.sin(multiplier * Math.PI), 0.8);
        thrust = ease * 50;
        sidewaysShift = ease * 35;
        rotationShift = ease * 0.2;
      }
      ctxt.translate(player2.scale - 20 + thrust - obj.length / 2, 215 - sidewaysShift - obj.width / 2);
      ctxt.rotate(Math.PI * -0.5625 + rotationShift);
    } else {
      ctxt.translate(x + obj.xOff - obj.length / 2, y + obj.yOff - obj.width / 2);
    }
    ctxt.drawImage(tmpSprite, 0, 0, obj.length, obj.width);
    ctxt.restore();
  }
}
var gameObjectSprites = new Map;
var drawById_ = [];
function initGameObjectDispatch() {
  drawById_[0] = function(tmpContext, obj, biomeID) {
    let tmpScale;
    for (let i = 0;i < 2; ++i) {
      tmpScale = obj.scale * (!i ? 1 : 0.5);
      renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7);
      tmpContext.fillStyle = !biomeID ? !i ? "#9ebf57" : "#b4db62" : !i ? "#e3f1f4" : "#fff";
      tmpContext.fill();
      if (!i)
        tmpContext.stroke();
    }
  };
  drawById_[1] = function(tmpContext, obj, biomeID) {
    if (biomeID == 2) {
      tmpContext.fillStyle = "#606060";
      renderStar(tmpContext, 6, obj.scale * 0.3, obj.scale * 0.71);
      tmpContext.fill();
      tmpContext.stroke();
      tmpContext.fillStyle = "#89a54c";
      renderCircle(0, 0, obj.scale * 0.55, tmpContext);
      tmpContext.fillStyle = "#a5c65b";
      renderCircle(0, 0, obj.scale * 0.3, tmpContext, true);
    } else {
      renderBlob(tmpContext, 6, obj.scale, obj.scale * 0.7);
      tmpContext.fillStyle = biomeID ? "#e3f1f4" : "#89a54c";
      tmpContext.fill();
      tmpContext.stroke();
      tmpContext.fillStyle = biomeID ? "#6a64af" : "#c15555";
      let tmpRange;
      let berries = 4;
      let rotVal = mathPI2 / berries;
      for (let i = 0;i < berries; ++i) {
        tmpRange = import_utils.default.randInt(obj.scale / 3.5, obj.scale / 2.3);
        renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i), import_utils.default.randInt(10, 12), tmpContext);
      }
    }
  };
  drawById_[2] = function(tmpContext, obj, biomeID) {
    tmpContext.fillStyle = biomeID == 2 ? "#938d77" : "#939393";
    renderStar(tmpContext, 3, obj.scale, obj.scale);
    tmpContext.fill();
    tmpContext.stroke();
    tmpContext.fillStyle = biomeID == 2 ? "#b2ab90" : "#bcbcbc";
    renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
    tmpContext.fill();
  };
  drawById_[3] = function(tmpContext, obj, biomeID) {
    tmpContext.fillStyle = "#e0c655";
    renderStar(tmpContext, 3, obj.scale, obj.scale);
    tmpContext.fill();
    tmpContext.stroke();
    tmpContext.fillStyle = "#ebdca3";
    renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
    tmpContext.fill();
  };
}
initGameObjectDispatch();
function getResSprite(obj) {
  if (obj.type == 4)
    return document.createElement("canvas");
  let biomeID = obj.y >= config_default.mapScale - config_default.snowBiomeTop ? 2 : obj.y <= config_default.snowBiomeTop ? 1 : 0;
  let tmpIndex = obj.type + "_" + obj.scale + "_" + biomeID;
  let tmpSprite = gameObjectSprites.get(tmpIndex);
  if (!tmpSprite) {
    let tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = tmpCanvas.height = obj.scale * 2.1 + outlineWidth;
    let tmpContext = tmpCanvas.getContext("2d");
    tmpContext.translate(tmpCanvas.width / 2, tmpCanvas.height / 2);
    tmpContext.rotate(import_utils.default.randFloat(0, Math.PI));
    tmpContext.strokeStyle = outlineColor;
    tmpContext.lineWidth = outlineWidth;
    let fn = drawById_[obj.type];
    if (fn)
      fn(tmpContext, obj, biomeID);
    tmpSprite = tmpCanvas;
    gameObjectSprites.set(tmpIndex, tmpSprite);
  }
  return tmpSprite;
}
var spriteCache = new Map;
var drawById = [];
function mulberry32(seed) {
  return function() {
    let t = seed += 1831565813;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function randInt(rng, a, b2) {
  return a + Math.floor(rng() * (b2 - a + 1));
}
function spriteKey(obj, asIcon) {
  const pad = import_items.default.list[obj.id].spritePadding || 0;
  return `${obj.id}|${asIcon ? 1 : 0}|${obj.scale}|${outlineWidth}|${pad}`;
}
function initItemSpriteDispatch() {
  for (let i = 0;i < import_items.default.list.length; i++) {
    const it = import_items.default.list[i];
    if (!it)
      continue;
    const id = it.id != null ? it.id : i;
    switch (it.name) {
      case "apple":
        drawById[id] = function(ctx, obj) {
          ctx.fillStyle = "#c15555";
          renderCircle(0, 0, obj.scale, ctx);
          ctx.globalAlpha = 1;
          ctx.fillStyle = "#89a54c";
          const leafDir = -(Math.PI / 2);
          renderLeaf(obj.scale * Math.cos(leafDir), obj.scale * Math.sin(leafDir), 25, leafDir + Math.PI / 2, ctx);
        };
        break;
      case "cookie":
        drawById[id] = function(ctx, obj) {
          const rng = mulberry32(obj.id * 1000003 ^ (obj.scale * 1000 | 0));
          ctx.fillStyle = "#cca861";
          renderCircle(0, 0, obj.scale, ctx);
          ctx.fillStyle = "#937c4b";
          const chips = 4;
          const rotVal = Math.PI * 2 / chips;
          for (let k = 0;k < chips; ++k) {
            const tmpRange = randInt(rng, obj.scale / 2.5, obj.scale / 1.7);
            renderCircle(tmpRange * Math.cos(rotVal * k), tmpRange * Math.sin(rotVal * k), randInt(rng, 4, 5), ctx, true);
          }
        };
        break;
      case "cheese":
        drawById[id] = function(ctx, obj) {
          const rng = mulberry32(obj.id * 1000003 ^ (obj.scale * 1000 | 0));
          ctx.fillStyle = "#f4f3ac";
          renderCircle(0, 0, obj.scale, ctx);
          ctx.fillStyle = "#c3c28b";
          const chips = 4;
          const rotVal = Math.PI * 2 / chips;
          for (let k = 0;k < chips; ++k) {
            const tmpRange = randInt(rng, obj.scale / 2.5, obj.scale / 1.7);
            renderCircle(tmpRange * Math.cos(rotVal * k), tmpRange * Math.sin(rotVal * k), randInt(rng, 4, 5), ctx, true);
          }
        };
        break;
      case "wood wall":
      case "stone wall":
      case "castle wall":
        drawById[id] = function(ctx, obj) {
          ctx.fillStyle = obj.name === "castle wall" ? "#83898e" : obj.name === "wood wall" ? "#a5974c" : "#939393";
          const sides = obj.name === "castle wall" ? 4 : 3;
          renderStar(ctx, sides, obj.scale * 1.1, obj.scale * 1.1);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = obj.name === "castle wall" ? "#9da4aa" : obj.name === "wood wall" ? "#c9b758" : "#bcbcbc";
          renderStar(ctx, sides, obj.scale * 0.65, obj.scale * 0.65);
          ctx.fill();
        };
        break;
      case "spikes":
      case "greater spikes":
      case "poison spikes":
      case "spinning spikes":
        drawById[id] = function(ctx, obj) {
          ctx.fillStyle = obj.name === "poison spikes" ? "#7b935d" : "#939393";
          const tmpScale = obj.scale * 0.6;
          renderStar(ctx, obj.name === "spikes" ? 5 : 6, obj.scale, tmpScale);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "#a5974c";
          renderCircle(0, 0, tmpScale, ctx);
          ctx.fillStyle = "#c9b758";
          renderCircle(0, 0, tmpScale / 2, ctx, true);
        };
        break;
      case "windmill":
      case "faster windmill":
      case "power mill":
        drawById[id] = function(ctx, obj) {
          ctx.fillStyle = "#a5974c";
          renderCircle(0, 0, obj.scale, ctx);
          ctx.fillStyle = "#c9b758";
          renderRectCircle(0, 0, obj.scale * 1.2, 29, 4, ctx);
          ctx.fillStyle = "#a5974c";
          renderCircle(0, 0, obj.scale * 0.5, ctx);
        };
        break;
      case "mine":
        drawById[id] = function(ctx, obj) {
          ctx.fillStyle = "#939393";
          renderStar(ctx, 3, obj.scale, obj.scale);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "#bcbcbc";
          renderStar(ctx, 3, obj.scale * 0.55, obj.scale * 0.65);
          ctx.fill();
        };
        break;
      case "sapling":
        drawById[id] = function(ctx, obj) {
          for (let k = 0;k < 2; ++k) {
            const tmpScale = obj.scale * (!k ? 1 : 0.5);
            renderStar(ctx, 7, tmpScale, tmpScale * 0.7);
            ctx.fillStyle = !k ? "#9ebf57" : "#b4db62";
            ctx.fill();
            if (!k)
              ctx.stroke();
          }
        };
        break;
      case "pit trap":
        drawById[id] = function(ctx, obj) {
          ctx.fillStyle = "#a5974c";
          renderStar(ctx, 3, obj.scale * 1.1, obj.scale * 1.1);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = outlineColor;
          renderStar(ctx, 3, obj.scale * 0.65, obj.scale * 0.65);
          ctx.fill();
        };
        break;
      case "boost pad":
        drawById[id] = function(ctx, obj) {
          ctx.fillStyle = "#7e7f82";
          renderRect(0, 0, obj.scale * 2, obj.scale * 2, ctx);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "#dbd97d";
          renderTriangle(obj.scale * 1, ctx);
        };
        break;
      case "turret":
        drawById[id] = function(ctx, obj) {
          ctx.fillStyle = "#a5974c";
          renderCircle(0, 0, obj.scale, ctx);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "#939393";
          const tmpLen = 50;
          renderRect(0, -tmpLen / 2, obj.scale * 0.9, tmpLen, ctx);
          renderCircle(0, 0, obj.scale * 0.6, ctx);
          ctx.fill();
          ctx.stroke();
        };
        break;
      case "platform":
        drawById[id] = function(ctx, obj) {
          ctx.fillStyle = "#cebd5f";
          const tmpCount = 4;
          const tmpS = obj.scale * 2;
          const tmpW = tmpS / tmpCount;
          let tmpX = -(obj.scale / 2);
          for (let k = 0;k < tmpCount; ++k) {
            renderRect(tmpX - tmpW / 2, 0, tmpW, obj.scale * 2, ctx);
            ctx.fill();
            ctx.stroke();
            tmpX += tmpS / tmpCount;
          }
        };
        break;
      case "healing pad":
        drawById[id] = function(ctx, obj) {
          ctx.fillStyle = "#7e7f82";
          renderRect(0, 0, obj.scale * 2, obj.scale * 2, ctx);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "#db6e6e";
          renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, ctx, true);
        };
        break;
      case "spawn pad":
        drawById[id] = function(ctx, obj) {
          ctx.fillStyle = "#7e7f82";
          renderRect(0, 0, obj.scale * 2, obj.scale * 2, ctx);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "#71aad6";
          renderCircle(0, 0, obj.scale * 0.6, ctx);
        };
        break;
      case "blocker":
        drawById[id] = function(ctx, obj) {
          ctx.fillStyle = "#7e7f82";
          renderCircle(0, 0, obj.scale, ctx);
          ctx.fill();
          ctx.stroke();
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = "#db6e6e";
          renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, ctx, true);
        };
        break;
      case "teleporter":
        drawById[id] = function(ctx, obj) {
          ctx.fillStyle = "#7e7f82";
          renderCircle(0, 0, obj.scale, ctx);
          ctx.fill();
          ctx.stroke();
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = "#d76edb";
          renderCircle(0, 0, obj.scale * 0.5, ctx, true);
        };
        break;
      default:
        drawById[id] = null;
        break;
    }
  }
}
initItemSpriteDispatch();
function getItemSprite(obj, asIcon) {
  const key = spriteKey(obj, asIcon);
  const cached = spriteCache.get(key);
  if (cached)
    return cached;
  const pad = import_items.default.list[obj.id].spritePadding || 0;
  const size = obj.scale * 2.5 + outlineWidth + pad;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { alpha: true });
  const half = size * 0.5;
  ctx.translate(half, half);
  if (!asIcon)
    ctx.rotate(Math.PI / 2);
  ctx.strokeStyle = outlineColor;
  ctx.lineWidth = outlineWidth * (asIcon ? size / 81 : 1);
  const fn = drawById[obj.id];
  if (fn)
    fn(ctx, obj);
  spriteCache.set(key, canvas);
  return canvas;
}
function renderFade(ctxt, x, y, obj) {
  let spikeAmount = obj.id === 6 ? 5 : 6;
  let oneShape = Math.PI / spikeAmount, spikeCut = Math.PI / 30, radiusMltp = 1.3;
  ctxt.globalAlpha = 0.3;
  ctxt.strokeStyle = darkOutlineColor;
  ctxt.lineWidth = 7;
  for (let index = 0;index < spikeAmount; index += 1) {
    let start = obj.dir - oneShape / 2, end = obj.dir + oneShape / 2;
    ctxt.beginPath();
    ctxt.arc(x, y, obj.getScale() * radiusMltp, start + index * (oneShape * 2) + spikeCut, end + index * oneShape * 2 - spikeCut);
    ctxt.stroke();
    ctxt.closePath();
  }
  ctxt.restore();
}
function renderLeaf(x, y, l, r, ctxt) {
  const endX = x + l * Math.cos(r);
  const endY = y + l * Math.sin(r);
  const width = l * 0.4;
  ctxt.moveTo(x, y);
  ctxt.beginPath();
  ctxt.quadraticCurveTo((x + endX) / 2 + width * Math.cos(r + Math.PI / 2), (y + endY) / 2 + width * Math.sin(r + Math.PI / 2), endX, endY);
  ctxt.quadraticCurveTo((x + endX) / 2 - width * Math.cos(r + Math.PI / 2), (y + endY) / 2 - width * Math.sin(r + Math.PI / 2), x, y);
  ctxt.closePath();
  ctxt.fill();
  ctxt.stroke();
}
function renderCircle(x, y, scale, tmpContext, dontStroke, dontFill) {
  tmpContext = tmpContext || mainContext;
  tmpContext.beginPath();
  tmpContext.arc(x, y, scale, 0, 2 * Math.PI);
  if (!dontFill)
    tmpContext.fill();
  if (!dontStroke)
    tmpContext.stroke();
}
function renderStar(ctxt, spikes, outer, inner) {
  let rot = Math.PI / 2 * 3;
  let x, y;
  const step = Math.PI / spikes;
  ctxt.beginPath();
  ctxt.moveTo(0, -outer);
  for (let i = 0;i < spikes; i++) {
    x = Math.cos(rot) * outer;
    y = Math.sin(rot) * outer;
    ctxt.lineTo(x, y);
    rot += step;
    x = Math.cos(rot) * inner;
    y = Math.sin(rot) * inner;
    ctxt.lineTo(x, y);
    rot += step;
  }
  ctxt.lineTo(0, -outer);
  ctxt.closePath();
}
function renderRect(x, y, w, h, ctxt, stroke) {
  ctxt.fillRect(x - w / 2, y - h / 2, w, h);
  if (!stroke) {
    ctxt.strokeRect(x - w / 2, y - h / 2, w, h);
  }
}
function renderRectCircle(x, y, s, sw, seg, ctxt, stroke) {
  ctxt.save();
  ctxt.translate(x, y);
  seg = Math.ceil(seg / 2);
  for (let i = 0;i < seg; i++) {
    renderRect(0, 0, s * 2, sw, ctxt, stroke);
    ctxt.rotate(Math.PI / seg);
  }
  ctxt.restore();
}
function renderBlob(ctxt, spikes, outer, inner) {
  let rot = Math.PI / 2 * 3;
  const step = Math.PI / spikes;
  let tmpOuter;
  ctxt.beginPath();
  ctxt.moveTo(0, -inner);
  for (let i = 0;i < spikes; i++) {
    tmpOuter = import_utils.default.randInt(outer + 0.9, outer * 1.2);
    ctxt.quadraticCurveTo(Math.cos(rot + step) * tmpOuter, Math.sin(rot + step) * tmpOuter, Math.cos(rot + step * 2) * inner, Math.sin(rot + step * 2) * inner);
    rot += step * 2;
  }
  ctxt.lineTo(0, -inner);
  ctxt.closePath();
}
function renderTriangle(s, ctx) {
  ctx = ctx || mainContext;
  const h = s * (Math.sqrt(3) / 2);
  ctx.beginPath();
  ctx.moveTo(0, -h / 2);
  ctx.lineTo(-s / 2, h / 2);
  ctx.lineTo(s / 2, h / 2);
  ctx.lineTo(0, -h / 2);
  ctx.fill();
  ctx.closePath();
}
function prepareMenuBackground() {
  const tmpMid = config_default.mapScale / 2;
  objectManager.add(0, tmpMid, tmpMid + 200, 0, config_default.treeScales[3], 0);
  objectManager.add(1, tmpMid, tmpMid - 480, 0, config_default.treeScales[3], 0);
  objectManager.add(2, tmpMid + 300, tmpMid + 450, 0, config_default.treeScales[3], 0);
  objectManager.add(3, tmpMid - 950, tmpMid - 130, 0, config_default.treeScales[2], 0);
  objectManager.add(4, tmpMid - 750, tmpMid - 400, 0, config_default.treeScales[3], 0);
  objectManager.add(5, tmpMid - 700, tmpMid + 400, 0, config_default.treeScales[2], 0);
  objectManager.add(6, tmpMid + 800, tmpMid - 200, 0, config_default.treeScales[3], 0);
  objectManager.add(7, tmpMid - 260, tmpMid + 340, 0, config_default.bushScales[3], 1);
  objectManager.add(8, tmpMid + 760, tmpMid + 310, 0, config_default.bushScales[3], 1);
  objectManager.add(9, tmpMid - 800, tmpMid + 100, 0, config_default.bushScales[3], 1);
  objectManager.add(10, tmpMid - 800, tmpMid + 300, 0, import_items.default.list[4].scale, import_items.default.list[4].id, import_items.default.list[10]);
  objectManager.add(11, tmpMid + 650, tmpMid - 390, 0, import_items.default.list[4].scale, import_items.default.list[4].id, import_items.default.list[10]);
  objectManager.add(12, tmpMid - 400, tmpMid - 450, 0, config_default.rockScales[2], 2);
  objects = gameObjects;
}
var updatePromise = null;
var updateReolve = null;
function resetPromise() {
  updatePromise = new Promise((resolve) => {
    updateReolve = resolve;
  });
}
resetPromise();
function loadGameObject(data) {
  let boosts = [];
  for (let i = 0;i < data.length; i += 8) {
    let obj = objectManager.add(data[i], data[i + 1], data[i + 2], data[i + 3], data[i + 4], data[i + 5], import_items.default.list[data[i + 6]], true, data[i + 7] >= 0 ? { sid: data[i + 7] } : null);
    if (obj.isItem) {
      if (obj.id === 16 && (!player.team || !ally(obj.owner.sid)))
        boosts.push(obj);
    }
    if (obj && path && path.length > 1) {
      const clearance = (obj.getScale() || 0) + 35;
      for (let i2 = 0;i2 < path.length - 1; i2++) {
        const wp1 = path[i2];
        const wp2 = path[i2 + 1];
        const dx = wp2.x - wp1.x;
        const dy = wp2.y - wp1.y;
        const segmentLengthSq = dx * dx + dy * dy;
        if (segmentLengthSq === 0) {
          const dist2 = Math.hypot(obj.x - wp1.x, obj.y - wp1.y);
          if (dist2 < clearance) {
            console.log(`Path blocked by ${obj.name} near waypoint, dist: ${dist2}`);
            Rebuild = true;
            break;
          }
          continue;
        }
        const t = Math.max(0, Math.min(1, ((obj.x - wp1.x) * dx + (obj.y - wp1.y) * dy) / segmentLengthSq));
        const closestX = wp1.x + t * dx;
        const closestY = wp1.y + t * dy;
        const dist = Math.hypot(obj.x - closestX, obj.y - closestY);
        if (dist < clearance) {
          console.log(`Path blocked by ${obj.name} on segment ${i2}->${i2 + 1}`);
          Rebuild = true;
          break;
        }
      }
    }
  }
  if (updateReolve) {
    updateReolve();
    resetPromise();
  }
  for (let boost of boosts) {
    let target = findPlayerBySID(boost.owner.sid);
    if (!target || ally(target.sid))
      continue;
    let dir = target.moveDir;
    if (dir === undefined || dir === null)
      dir = target.d2;
    let dist = Math.hypot(target.y2 - boost.y, target.x2 - boost.x), dist2 = Math.hypot(target.y2 - player.y2, target.x2 - player.x2), angle = import_utils.default.getDirection(player.x2, player.y2, target.x2, target.y2), diff = import_utils.default.getAngleDist(angle, dir);
    if (dist <= 150 && diff <= Math.PI / 2.2 && dist2 <= 400) {
      if (player.items[5] === 21) {
        build(21, dir);
      } else {
        build(player.items[2], dir);
        build(player.items[2], dir + Math.PI / 2);
        build(player.items[2], dir - Math.PI / 2);
      }
    }
  }
}
var PARTICLE_COUNT = 5;
function getHudRect(id) {
  const el = document.getElementById(id);
  if (!el)
    return null;
  return el.getBoundingClientRect();
}
function spawnParticles(worldX, worldY, iconSrc, hudId) {
  const hudRect = getHudRect(hudId);
  if (!hudRect)
    return;
  const targetX = hudRect.left + hudRect.width / 2;
  const targetY = hudRect.top + hudRect.height / 2;
  const scale = Math.max(window.innerWidth / config_default.maxScreenWidth, window.innerHeight / config_default.maxScreenHeight);
  for (let i = 0;i < PARTICLE_COUNT; i++) {
    const angle0 = Math.random() * Math.PI * 2;
    const radius = Math.random() * 30;
    const screenX = (worldX - xOffset) * scale + (window.innerWidth - config_default.maxScreenWidth * scale) / 2 + Math.cos(angle0) * radius;
    const screenY = (worldY - yOffset) * scale + (window.innerHeight - config_default.maxScreenHeight * scale) / 2 + Math.sin(angle0) * radius;
    const el = document.createElement("img");
    el.src = iconSrc;
    Object.assign(el.style, {
      position: "fixed",
      left: screenX + "px",
      top: screenY + "px",
      width: "24px",
      height: "24px",
      pointerEvents: "none",
      zIndex: "9999",
      transform: "translate(-50%, -50%)",
      opacity: "1",
      imageRendering: "pixelated"
    });
    document.body.appendChild(el);
    const angle = Math.PI * 2 * i / PARTICLE_COUNT + (Math.random() - 0.5) * 0.8;
    const spread = 120 + Math.random() * 120;
    const midX = screenX + Math.cos(angle) * spread;
    const midY = screenY + Math.sin(angle) * spread - 20;
    const delay = i * 40;
    const duration = 420 + Math.random() * 120;
    const startTime = performance.now() + delay;
    (function animate(el2, startX, startY, mx, my, tx, ty, dur, t0) {
      function frame(now2) {
        if (now2 < t0) {
          requestAnimationFrame(frame);
          return;
        }
        const t = Math.min(1, (now2 - t0) / dur);
        const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const inv = 1 - e;
        const x = inv * inv * startX + 2 * inv * e * mx + e * e * tx;
        const y = inv * inv * startY + 2 * inv * e * my + e * e * ty;
        const s = 0.4 + Math.sin(t * Math.PI) * 1.5;
        const opacity = t > 0.75 ? 1 - (t - 0.75) / 0.25 : 1;
        el2.style.left = x + "px";
        el2.style.top = y + "px";
        el2.style.opacity = opacity;
        el2.style.transform = `translate(-50%, -50%) scale(${s.toFixed(3)})`;
        t < 1 ? requestAnimationFrame(frame) : el2.remove();
      }
      requestAnimationFrame(frame);
    })(el, screenX, screenY, midX, midY, targetX, targetY, duration, startTime);
  }
}
function shootTurret(sid, dir) {
  tmpObj2 = findObjectBySid(sid);
  if (tmpObj2) {
    tmpObj2.dir = dir;
    tmpObj2.xWiggle += config_default.gatherWiggle * Math.cos(dir + Math.PI);
    tmpObj2.yWiggle += config_default.gatherWiggle * Math.sin(dir + Math.PI);
  }
}
var addProjectile_ = (x, y, dir, range, speed, indx, layer, sid) => {
  const isTurret = range == 700 && speed == 1.5;
  let owner = null;
  for (let soldier of players) {
    if (soldier.visible) {
      const dist = Math.round(Math.hypot(soldier.y2 - y, soldier.x2 - x));
      if ([0, 1, 69, 70, 71, 72].includes(dist)) {
        if (soldier.reload) {
          let idx = isTurret ? 2 : 1;
          soldier.reload[idx].count = 0;
          soldier.reload[idx].done = false;
          soldier.reload[idx].date = Date.now();
          if (idx === 1) {
            soldier.weaponIndex = soldier.reload[1].id;
            const weapon = import_items.default.weapons[soldier.weaponIndex];
            const atkSpd = soldier.skinIndex === 20 ? 0.78 : 1;
            soldier.reload[1].max = weapon.speed ? Math.ceil(weapon.speed * atkSpd / (1000 / 9)) : 0;
            soldier.reload[1].max2 = weapon.speed * atkSpd;
            if (weapon?.rec) {
              soldier.x3 -= import_items.default.weapons[soldier.weaponIndex].rec * Math.cos(soldier.d2) * 111;
              soldier.y3 -= import_items.default.weapons[soldier.weaponIndex].rec * Math.sin(soldier.d2) * 111;
            }
          }
        }
        owner = soldier;
        break;
      }
    }
  }
  if (!owner && isTurret)
    owner = objects?.find((c) => Math.hypot(c.y - y, c.x - x) <= 10);
  let proj = projectileManager.addProjectile(x, y, dir, range, speed, indx, owner, null, layer);
  proj.sid = sid;
  proj.target_update(time, true);
};
function addProjectile(x, y, dir, range, speed, indx, layer, sid) {
  queue.push({ function: addProjectile_, data: [x, y, dir, range, speed, indx, layer, sid] });
}
function remProjectile_(sid, range) {
  for (let i = 0;i < projectiles2.length; ++i) {
    if (projectiles2[i].sid == sid) {
      projectiles2[i].range = range;
    }
  }
}
function remProjectile(sid, range) {
  queue.push({ function: remProjectile_, data: [sid, range] });
}
function animateAI(sid) {
  tmpObj2 = findAIBySID(sid);
  if (tmpObj2)
    tmpObj2.startAnim();
}
function loadAI(data) {
  queue.push({ function: loadAI_, data: [data] });
}
function loadAI_(data) {
  for (let i = 0;i < ais.length; ++i) {
    ais[i].forcePos = !ais[i].visible;
    ais[i].visible = false;
  }
  if (data) {
    const tmpTime = Date.now();
    for (let i = 0;i < data.length; ) {
      tmpObj2 = findAIBySID(data[i]);
      if (tmpObj2) {
        tmpObj2.index = data[i + 1];
        tmpObj2.t1 = tmpObj2.t2 === undefined ? tmpTime : tmpObj2.t2;
        tmpObj2.t2 = tmpTime;
        tmpObj2.x1 = tmpObj2.x;
        tmpObj2.y1 = tmpObj2.y;
        tmpObj2.x2 = data[i + 2];
        tmpObj2.y2 = data[i + 3];
        tmpObj2.d1 = tmpObj2.d2 === undefined ? data[i + 4] : tmpObj2.d2;
        tmpObj2.d2 = data[i + 4];
        if (particles && data[i + 5] < tmpObj2.health) {
          for (let dir = 0;dir < Math.PI * 2; dir += Math.PI / 4)
            Particles.push(new Particle(tmpObj2.x, tmpObj2.y, dir, "#cc5151"));
        }
        tmpObj2.health = data[i + 5];
        tmpObj2.dt = 0;
        tmpObj2.visible = true;
        tmpObj2.update();
      } else {
        tmpObj2 = aiManager.spawn(data[i + 2], data[i + 3], data[i + 4], data[i + 1]);
        tmpObj2.x2 = tmpObj2.x;
        tmpObj2.y2 = tmpObj2.y;
        tmpObj2.d2 = tmpObj2.dir;
        tmpObj2.health = data[i + 5];
        if (!aiManager.aiTypes[data[i + 1]].name)
          tmpObj2.name = config_default.cowNames[data[i + 6]];
        tmpObj2.forcePos = true;
        tmpObj2.sid = data[i];
        tmpObj2.visible = true;
      }
      i += 7;
    }
  }
}
var aiSprites = {};
function renderAI(obj, ctxt) {
  const tmpIndx = obj.index;
  let tmpSprite = aiSprites[tmpIndx];
  if (!tmpSprite) {
    const tmpImg = new Image;
    tmpImg.onload = function() {
      this.isLoaded = true;
      this.onload = null;
    };
    tmpImg.src = `.././img/animals/${obj.src}.png`;
    tmpSprite = tmpImg;
    aiSprites[tmpIndx] = tmpSprite;
  }
  if (tmpSprite.isLoaded) {
    const tmpScale = obj.scale * 1.2 * (obj.spriteMlt || 1);
    ctxt.globalAlpha = 0.5;
    mainContext.scale(1.05, 1.05);
    ctxt.drawImage(tmpSprite, -tmpScale, -tmpScale, tmpScale * 2, tmpScale * 2);
    ctxt.globalAlpha = 1;
    mainContext.scale(1 / 1.05, 1 / 1.05);
    ctxt.drawImage(tmpSprite, -tmpScale, -tmpScale, tmpScale * 2, tmpScale * 2);
  }
}
function isOnScreen(x, y, s) {
  return x + s >= 0 && x - s <= maxScreenWidth2 && y + s >= 0 && y - s <= maxScreenHeight2;
}
function addPlayer(data, isYou) {
  let tmpPlayer = findPlayerByID(data[0]);
  if (!tmpPlayer) {
    tmpPlayer = new import_player.default(data[0], data[1], config_default, import_utils.default, projectileManager, objectManager, players, ais, import_items.default, skins, tails);
    players.push(tmpPlayer);
  }
  tmpPlayer.spawn(isYou ? 1 : null);
  tmpPlayer.visible = false;
  tmpPlayer.x2 = undefined;
  tmpPlayer.y2 = undefined;
  tmpPlayer.setData(data);
  if (isYou) {
    player = tmpPlayer;
    player.isMe = true;
    camX = player.x;
    camY = player.y;
    updateItems();
    updateStatusDisplay();
    updateAge();
    updateUpgrades(0);
    gameUI.style.display = "block";
  }
}
function removePlayer(id) {
  players = players.filter((p2) => p2.id !== id);
}
function updateItemCounts(groupId, value) {
  if (player) {
    player.itemCounts[groupId] = value;
    const spans = [...document.querySelectorAll(`.itemCounter[data-id="${groupId}"]`)];
    for (let span of spans) {
      const item = import_items.default.list.find((i) => i.group && i.group.id === groupId);
      const limit = item && item.group ? item.group.limit : null;
      span.textContent = limit ? `${value}` : value;
    }
  }
}
function updatePlayerValue(index, value, updateView) {
  if (player) {
    player[index] = value;
    if (updateView) {
      updateStatusDisplay();
    }
  }
}
function updateHealth(sid, value) {
  tmpObj2 = findPlayerBySID(sid);
  if (tmpObj2) {
    if (tmpObj2.health > value) {
      if (particles)
        for (let dir = 0;dir < Math.PI * 2; dir += Math.PI / 4)
          Particles.push(new Particle(tmpObj2.x, tmpObj2.y, dir, "#cc5151"));
      tmpObj2.hitTime = Date.now();
      const leak = (() => {
        let skin = skins.find((hat) => hat.id === tmpObj2.skinIndex), tail = tails.find((accessory) => accessory.id === tmpObj2.tailIndex), regen = (skin && skin.healthRegen ? skin.healthRegen : 0) + (tail && tail.healthRegen ? tail.healthRegen : 0), dmgOverTime = tmpObj2.dmgOverTime && tmpObj2.dmgOverTime.dmg ? -tmpObj2.dmgOverTime.dmg : 0;
        let x = config_default.mapScale - config_default.volcanoScale - 120, y = config_default.mapScale - config_default.volcanoScale - 120, dist = import_utils.default.getDistance(x, y, tmpObj2.x2, tmpObj2.y2);
        if (dist < config_default.volcanoAggressionRadius)
          regen -= 1;
        return regen + dmgOverTime;
      })();
      if (leak && leak + tmpObj2.health === value)
        tmpObj2.leak = tmpObj2.timerCount;
    } else {
      tmpObj2.build();
    }
    tmpObj2.health = value;
  }
}
var lastAngle;
var angleSafety = Math.PI / 180 / 4;
function look(dir) {
  if (dir === undefined)
    dir = getAttackDir();
  if (Math.abs(lastAngle - dir) < angleSafety)
    return;
  io_client_default.send("2", dir);
  lastAngle = dir;
}
var built;
var maxBuilds;
var phantom = [];
function build(id, angle = getAttackDir(), repeat = 1, skip) {
  if (!player.visible)
    return;
  let group = import_items.default.list[id]?.group.id;
  if (group === undefined)
    return;
  let limit = config_default.inSandbox ? group === 3 ? 299 : 99 : import_items.default.groups[group].limit;
  if (limit <= player.itemCounts[group]) {
    if (group === 3 && autoWindmills) {
      autoWindmills = false;
    }
    return;
  }
  let passed;
  let isFood = passed = id <= 2;
  if (!isFood) {
    let item = import_items.default.list[id];
    let canBuild = passed = skip || player.buildItem(item, angle);
    if (canBuild) {
      const scale = 35 + item.scale + (item.placeOffset || 0);
      let build2 = {
        x: player.x2 + Math.cos(angle) * scale,
        y: player.y2 + Math.sin(angle) * scale,
        id,
        sid: Math.round(1000000000000000 + Math.random() * 50000)
      };
      phantom.push(build2);
      objectManager.add(build2.sid, build2.x, build2.y, angle, item.scale, 1, item, true, player.sid, true);
    }
  }
  if (passed) {
    maxBuilds -= 1;
    if (!isFood && maxBuilds < 0)
      return;
    built = true;
    while (repeat > 0) {
      repeat -= 1;
      io_client_default.send("5", id, null);
      io_client_default.send("c", true, angle);
      lastAngle = angle;
    }
  }
}
var autoStore = [[11, 1], [40, 0], [6, 0], [57, 0], [15, 0], [12, 0], [31, 0], [53, 0], [7, 0], [21, 0], [26, 0], [19, 1], [13, 1], [18, 1]];
function equip(id, id2 = 0) {
  const shop = Number(id === "shop");
  if (shop) {
    const sorted = enemy && enemy.length ? [[11, 1], [6, 0], ...autoStore.filter((c) => !(c[0] === 6 && !c[1]))] : autoStore;
    const cloth = sorted.find((cloth2) => !player[cloth2[1] ? "tails" : "skins"][cloth2[0]]);
    if (!cloth)
      return null;
    [id, id2] = cloth;
    let list = id2 ? tails : skins, item = list.find((c) => c.id == id), buy = item?.price && item?.price <= player.points;
    if (!buy)
      return;
  }
  !shop && updateStoreItems(1, id, id2);
  io_client_default.send("13c", shop, id, id2);
  return true;
}
function potDmg() {
  if (!player?.visible)
    return;
  let dmg = (!isNaN(player.spike) ? player.spike : 0) + player.ai * 2, spiked = 0;
  for (let e of enemies) {
    let dist = import_utils.default.getDistance(player.x2, player.y2, e.x2, e.y2);
    let weapon = import_items.default.weapons[e.reload[0].id], primary = (e.reload[0].done ? weapon.dmg : 0) * e.reload[0].val;
    const turret = e.reload[2].done ? (() => {
      let item = import_items.default.projectiles[1];
      if (dist > item.tick[1])
        return 0;
      return 25;
    })() : 0;
    const too_far = dist > 90 + import_items.default.weapons[e.reload[0].id]?.range;
    if (too_far) {
      primary = 0;
    } else if (e.reload[0].id === 0)
      primary += 45 * 1.5;
    let projectile;
    const secondary = e.reload[1].done ? (() => {
      weapon = import_items.default.weapons[e.reload[1].id];
      if (weapon.projectile) {
        if (!e.reload[0].id)
          return 0;
        projectile = true;
        const item = import_items.default.projectiles[weapon.projectile];
        if (item?.dmg) {
          dist = import_utils.default.getDistance(player.x2, player.y2, e.x2, e.y2);
          if (dist > item.tick[1])
            return 0;
          return item.dmg;
        } else
          return 0;
      } else if (weapon.dmg && dist <= weapon.range + 90) {
        return weapon.dmg * e.reload[1].val;
      }
      return 0;
    })() : 0;
    const options = [];
    if (primary) {
      if (e.spike2) {
        if (turret)
          options.push({ value: e.spike2 + primary + turret, label: "spike + primary + turret" });
        options.push({ value: e.spike2 + primary * 1.5, label: "spike + primary * 1.5" });
      }
      if (turret)
        options.push({ value: primary + turret, label: "primary + turret" });
      options.push({ value: primary * 1.5, label: "primary * 1.5" });
    }
    if (secondary) {
      if (!projectile) {
        if (turret)
          options.push({ value: secondary + turret, label: "secondary + turret" });
        options.push({ value: secondary * 1.5, label: "secondary * 1.5" });
        if (e.spike2) {
          if (turret)
            options.push({ value: e.spike2 + secondary + turret, label: "spike + secondary + turret" });
          options.push({ value: e.spike2 + secondary * 1.5, label: "spike + secondary * 1.5" });
        }
      } else {
        if (turret)
          options.push({ value: secondary + turret, label: "secondary + turret" });
        options.push({ value: secondary, label: "secondary" });
      }
    }
    if (turret) {
      if (e.spike2)
        options.push({ value: e.spike2 + turret, label: "spike + turret" });
      options.push({ value: turret, label: "turret" });
    }
    if (player.buildIndex === -1 && [player.weapons[0], player.weapons[1]].includes(player.weaponIndex) && player.reload[+(player.weaponIndex !== player.weapons[0])].done && import_utils.default.getDistance(player.x2, player.y2, e.x2, e.y2) <= import_items.default.weapons[player.weaponIndex].range + player.scale * 1.8) {
      if (e.skinIndex === 11 || e.tailIndex === 21) {
        options.push({ value: import_items.default.weapons[player.weaponIndex].dmg * 0.45 + import_items.default.weapons[player.weaponIndex].dmg * 0.25, label: "cx wings + spikegear" });
      } else if (e.skinIndex === 7) {
        options.push({ value: import_items.default.weapons[player.weaponIndex].dmg * 0.25, label: "cx wings" });
      } else {
        options.push({ value: import_items.default.weapons[player.weaponIndex].dmg * 0.45, label: "spike gear" });
      }
    }
    const option = options.reduce((max, opt) => opt.value > max.value ? opt : max, { value: 0, label: "none" });
    option.value && console.log(`dmg: ${Number(option.value.toFixed(2))}, ${option.label}`);
    dmg += option.value;
  }
  if (enemy) {
    let obj = import_items.default.weapons[enemy.reload[0].id], dist = import_utils.default.getDistance(player.x3, player.y3, enemy.x3, enemy.y3);
    if (obj.range && obj.range + 90 > dist) {
      let tmpDir2 = import_utils.default.dir(enemy, player);
      let impact = 0.3 + (obj.knock || 0);
      let knockback = impact * (111 * 2.3);
      let x4 = player.x3 + Math.cos(tmpDir2) * knockback, y4 = player.y3 + Math.sin(tmpDir2) * knockback;
      let spike = objects.find((c) => {
        if (!c.active || c.sid >= 1000000000000000 || !c.dmg || c.isItem && ally(c.owner.sid))
          return false;
        let hitboxPadding = c.scale + 35;
        let recX = c.x - hitboxPadding;
        let recY = c.y - hitboxPadding;
        let recX2 = c.x + hitboxPadding;
        let recY2 = c.y + hitboxPadding;
        return import_utils.default.lineInRect(recX, recY, recX2, recY2, player.x3, player.y3, x4, y4);
      });
      if (spike && !player.trap) {
        dmg += spike.dmg;
        let angle = Math.atan2(y4 - spike.y, x4 - spike.x);
        let blue_circle = {
          x: spike.x + Math.cos(angle) * (spike.getScale() + 35),
          y: spike.y + Math.sin(angle) * (spike.getScale() + 35),
          colour: "blue"
        };
        circles.push(blue_circle);
        spiked = true;
      }
    }
  }
  for (let bullet of projectiles2) {
    if (bullet.active && bullet.estimated === 2 && bullet.target?.isPlayer && bullet.target.sid === player.sid)
      dmg += bullet.dmg;
  }
  if (kbResult)
    dmg += kbResult;
  if (player.skinIndex === 6)
    dmg *= 0.75;
  if (player.skinIndex === 7)
    dmg += 5;
  if (dmg >= 100 && !active || spiked)
    equip(6, 0);
  if (spiked)
    player.hitTime = 0;
  return dmg;
}
var active;
var lastAids;
function aids() {
  if (active || !enemy || !enemy.trap || player.weapons[1] !== 10 || ![4, 5].includes(player.weapons[0]) || !player.reload[1].done || !player.reload[0].done)
    return;
  let hammer = import_items.default.weapons[10], tmpDist = import_utils.default.getDistance(player.x3, player.y3, enemy.trap.x, enemy.trap.y) - enemy.trap.scale;
  if (tmpDist > hammer.range)
    return;
  let useTurret = player.skins[53] && player.reload[2].done && enemy.trap.health <= hammer.dmg * hammer.sDmg * player.reload[1].val;
  let willBreak = useTurret || enemy.trap.health <= hammer.dmg * hammer.sDmg * player.reload[1].val * 3.3;
  lastAids = performance.now();
  if (!willBreak)
    return;
  console.log(`aids using ${useTurret ? "turret gear" : "tank gear"}`);
  active = true;
  aimbot = true;
  state.weapon = player.weapons[1];
  state.skin = useTurret ? 53 : 40;
  !player.autoGather && sendAutoGather();
  delay(() => {
    !player.autoGather && sendAutoGather();
    state.weapon = player.weapons[0];
    state.skin = 7;
  }, 1);
  delay(() => {
    active = false;
    aimbot = false;
    player.autoGather && sendAutoGather();
  }, 2);
}
async function Preplace() {
  if (!enemy || autoGrind)
    return;
  let dist = import_utils.default.getDistance(player.x2, player.y2, enemy.x2, enemy.y2);
  if (dist > 400)
    return;
  let storage = [];
  for (b of objects) {
    if (!b.active || !b.isItem || b.sid >= 1000000000000000)
      continue;
    let canDeal = 0;
    for (p of players) {
      if (!p.visible)
        continue;
      let primary = p.reload[0], secondary = p.reload[1];
      let dist2 = import_utils.default.getDistance(b.x, b.y, p.x3, p.y3);
      const damages = [
        primary.done && dist2 <= import_items.default.weapons[primary.id].range + b.scale ? import_items.default.weapons[primary.id].dmg * primary.val * 3.3 : 0,
        secondary.done && dist2 <= import_items.default.weapons[secondary.id].range + b.scale ? import_items.default.weapons[secondary.id].dmg * (secondary.id === 10 ? 7.5 : 1) * secondary.val * 3.3 : 0
      ];
      let main = Math.max(damages[0], damages[1]);
      if (main) {
        let isLooking = Math.abs(import_utils.default.dir(p, b) - p.d2) <= Math.PI / 2.6;
        if (main)
          canDeal += main;
      }
    }
    if (canDeal && canDeal >= b.health)
      storage.push(b);
  }
  if (storage.length) {
    let placed;
    try {
      let angle = lastAngle;
      for (let b2 of storage) {
        if (import_utils.default.getDistance(b2.x, b2.y, player.x3, player.y3) >= player.scale + b2.scale + 100)
          continue;
        if (!b2.tween || performance.now() - b2.tween > 500) {
          b2.tween = performance.now();
        }
        let angle2 = import_utils.default.dir(player, b2), buildId = player.items[lastAids && performance.now() - lastAids <= 500 && enemy && enemy.trap?.sid === b2.sid ? 2 : player.items[5] && keys[72] ? 5 : !trap && player.items[4] === 15 && (keys[70] || b2.id === 15) ? 4 : 2], item = import_items.default.list[buildId];
        if (enemy && enemy.trap && b2.sid === enemy.trap.sid) {
          let score = 0, best;
          let lastBuild;
          item = import_items.default.list[player.items[2]];
          let angle3 = import_utils.default.dir(player, enemy);
          const fibCount = 21;
          for (let i = 0;i < fibCount; i++) {
            const offset = i === 0 ? 0 : GOLDEN_ANGLE * i;
            const dirs = i === 0 ? [angle3] : [angle3 + offset, angle3 - offset];
            for (let dir of dirs) {
              let canBuild = player.buildItem(item, dir, b2);
              const scale = 35 + item.scale + (item.placeOffset || 0);
              let build2 = {
                x: player.x3 + Math.cos(dir) * scale,
                y: player.y3 + Math.sin(dir) * scale,
                sid: Math.round(1000000000000000 + Math.random() * 500)
              };
              let dist2 = import_utils.default.dist(build2, b2);
              if (!placed && canBuild && dist2 < b2.scale + item.scale) {
                placed = dir;
                build(buildId, dir, 1, 1);
                break;
              }
            }
            if (placed)
              break;
          }
        } else {
          const fibCount = 13;
          for (let i = 0;i < fibCount; i++) {
            const offset = i === 0 ? 0 : GOLDEN_ANGLE * i;
            const dirs = i === 0 ? [angle2] : [angle2 + offset, angle2 - offset];
            for (let dir of dirs) {
              let canBuild = player.buildItem(item, dir, b2);
              const scale = 35 + item.scale + (item.placeOffset || 0);
              let build2 = {
                x: player.x3 + Math.cos(dir) * scale,
                y: player.y3 + Math.sin(dir) * scale,
                sid: Math.round(1000000000000000 + Math.random() * 500)
              };
              let dist2 = import_utils.default.dist(build2, b2);
              if (!placed && canBuild && dist2 < b2.scale + item.scale) {
                placed = dir;
                build(buildId, dir, 1, 1);
                break;
              }
            }
            if (placed)
              break;
          }
        }
      }
      storage = [];
      if (built) {
        io_client_default.send("5", state.weapon || autoReload(true), true);
        io_client_default.send("c", false, lastAngle);
        built = false;
        lastAngle = 0;
        look(angle);
      }
    } catch (e) {
      console.error(e.message);
    }
  }
}
var aggressive;
function antiSpike() {
  if (player.spike) {
    state.skin = 6;
    return;
  }
  if (!enemy)
    return;
  aggressive = [];
  let disableTrap = player.trap && Boolean(player.trap.active);
  let dmg = 0;
  for (let enemy of enemies) {
    if (import_utils.default.getDistance(enemy.x3, enemy.y3, player.x3, player.y3) > 350)
      continue;
    let score = 0, best;
    let lastBuild, item = import_items.default.list[9];
    let angle = import_utils.default.dir(enemy, player);
    const fibCount = 52;
    for (let i = 0;i < fibCount; i++) {
      const offset = i === 0 ? 0 : GOLDEN_ANGLE * i;
      const dirs = i === 0 ? [angle] : [angle + offset, angle - offset];
      for (let dir of dirs) {
        const canBuild = enemy.buildItem(item, dir, disableTrap ? player.trap : true);
        const scale = 35 + item.scale + (item.placeOffset || 0);
        let build2 = {
          x: enemy.x2 + Math.cos(dir) * scale,
          y: enemy.y2 + Math.sin(dir) * scale,
          dmg: item.dmg,
          dir,
          isItem: true,
          owner: { sid: enemy.sid },
          sid: Math.round(1000000000000000 + Math.random() * 5000)
        };
        let dist = import_utils.default.getDistance(build2.x, build2.y, player.x3, player.y3);
        if (canBuild && dist <= item.scale + player.scale) {
          lastBuild = objectManager.add(build2.sid, build2.x, build2.y, build2.dir, item.scale, 1, item, true, enemy.sid, true);
          let tmpScore = kbScore(lastBuild, player);
          objectManager.disableBySid(lastBuild.sid);
          if (score < tmpScore) {
            score = tmpScore;
            best = build2;
          }
        }
      }
    }
    if (score > 0) {
      enemy.spike2 = score < 70 ? Math.max(item.dmg * 2, item.dmg * (score / 20)) : item.dmg * 2;
      aggressive.push({ x: best.x, y: best.y, scale: item.scale });
      console.log("can get spiked, score:", score);
    }
  }
}
function autoHeal() {
  let dmg = 100 - player.health, shamed = player.skinIndex === 45;
  if (shamed) {
    player.shameCount = 8;
  } else if (player.shameCount === 8)
    player.shameCount = 0;
  if (!dmg || shamed)
    return;
  const leak = (() => {
    let skin = skins.find((hat) => hat.id === player.skinIndex), tail = tails.find((accessory) => accessory.id === player.tailIndex), regen = (skin && skin.healthRegen ? skin.healthRegen : 0) + (tail && tail.healthRegen ? tail.healthRegen : 0), dmgOverTime = player.dmgOverTime && player.dmgOverTime.dmg ? -player.dmgOverTime.dmg : 0;
    let x = config_default.mapScale - config_default.volcanoScale - 120, y = config_default.mapScale - config_default.volcanoScale - 120, dist = import_utils.default.getDistance(x, y, player.x2, player.y2);
    if (dist < config_default.volcanoAggressionRadius)
      regen -= 1;
    return regen + dmgOverTime;
  })();
  function consume() {
    let amount = dmg / (player.items[0] === 0 ? 20 : 40);
    let item = import_items.default.list[player.items[0]];
    if (item.req[1] > player[item.req[0]] && !config_default.inSandbox)
      return;
    build(player.items[0], 0, amount);
  }
  let ready = keys[81] || Date.now() - player.hitTime >= 1000 / 9 || player.shameCount < (!trap || !player.spike ? 7 : 8) && player.health < damage;
  if (dmg > leak && ready)
    consume();
}
var breakWeapon;
function autoBreak(build2, weapon, best_angle) {
  let hammer = player.weapons[1] && player.weapons[1] === 10, dmg = {
    primary: import_items.default.weapons[player.weapons[0]].dmg * player.reload[0].val * (import_items.default.weapons[player.weapons[0]].sDmg || 1) * (player.skins[40] ? 3.3 : 1),
    secondary: hammer ? import_items.default.weapons[player.weapons[1]].dmg * player.reload[1].val * (import_items.default.weapons[player.weapons[1]].sDmg || 1) * (player.skins[40] ? 3.3 : 1) : 0
  };
  const fast = !player.weapons[1] || player.reload[0].max - player.reload[0].count < player.reload[1].max - player.reload[1].count ? 0 : 1, ready = player.reload[hammer ? 1 : 0].done, same = build2.health <= dmg.primary && build2.health <= dmg.secondary, could = hammer && player.reload[0].done && !ready && build2.health <= dmg.primary, break_weapon = Number(!same ? could ? 0 : Number(player.weapons[hammer ? 1 : 0] >= 9) : fast);
  if (weapon)
    return import_items.default.weapons[break_weapon];
  let angle_found, build_angle = best_angle || import_utils.default.dir(player, build2);
  for (let enemy of enemies) {
    if (!angle_found && enemy && !best_angle) {
      const dist = import_utils.default.getDistance(enemy.x3, enemy.y3, player.x3, player.y3);
      if (dist <= import_items.default.weapons[break_weapon].range + 70 && (ready || could)) {
        const mid = build_angle + (build_angle - import_utils.default.dir(player, enemy) / 2);
        const possible = Math.abs(build_angle - mid) < Math.PI / 2.6 && Math.PI / 2.6 > Math.abs(import_utils.default.dir(player, enemy) - mid);
        if (possible)
          build_angle = mid, angle_found = true;
      }
    }
  }
  weapon = player.weapons[break_weapon];
  state.weapon = breakWeapon = weapon;
  if (ready || could) {
    dmg = import_items.default.weapons[weapon].dmg * player.reload[Number(break_weapon > 8)].val * (import_items.default.weapons[weapon].sDmg || 1);
    state.skin = dmg >= build2.health ? 6 : 40;
    dmg >= build2.health && console.log("used soldier instead of tank");
    state.angle = build_angle;
    if (!player.autoGather)
      sendAutoGather();
  } else if (!ready) {
    let tillReady = player.reload[hammer ? 1 : 0].max - player.reload[hammer ? 1 : 0].count;
    let wilBreak = build2.health <= (player.weapons[break_weapon] < 9 ? dmg.primary : dmg.secondary);
    if (player.skins[53] && wilBreak && tillReady === 1 && player.reload[2].done && enemy && import_utils.default.getDistance(enemy.x2, enemy.y2, player.x2, player.y2) <= 300)
      state.skin = 53;
  }
}
function move(ang, mov, end) {
  if (lastMoveDir !== ang) {
    io_client_default.send("33", ang);
    player.moveDir = ang;
    lastMoveDir = ang;
  }
  !end && safeWalk(ang);
}
var spike;
function breakSpike() {
  let obj = objects.find((c) => {
    let weapon = autoBreak(c, true);
    let in_range = import_utils.default.getDistance(c.x, c.y, player.x3, player.y3) <= c.scale + weapon.range;
    return c.active && c.isItem && c.owner && c.sid < 1000000000000000 && !ally(c.owner.sid) && [6, 7, 8, 9].includes(c.id) && in_range;
  });
  if (obj) {
    spike = obj;
    if (!spike)
      return;
    autoBreak(spike);
    if (player.trap && player.spike)
      state.skin = 6;
  } else if (spike) {
    if (player.autoGather)
      sendAutoGather();
    state.skin = 6;
  }
  spike = obj;
}
var safetyMargin = 15;
function safeWalk(mov) {
  if (player.trap || keys[16])
    return;
  const dir = mov !== undefined ? mov : player.moveDir;
  const skinIndex = player.skinIndex;
  const tailIndex = player.tailIndex;
  const weaponIndex = player.weaponIndex;
  const makeFrames = (d0, extra = 2) => [
    [d0, skinIndex, tailIndex, weaponIndex],
    ...Array(extra).fill([undefined, skinIndex, tailIndex, weaponIndex])
  ];
  const findSpike = (positions) => {
    for (let i = 0;i < positions.length; i++) {
      if (positions[i].spike)
        return positions[i].spike;
    }
    return null;
  };
  const spike2 = findSpike(simulate(makeFrames(dir, 5), player, safetyMargin));
  if (!spike2) {
    move(dir, 1, 1);
    return;
  }
  const altPositions = simulate(makeFrames(lastMoveDir, 5), player, safetyMargin);
  const stillHit = altPositions.some((c) => c.spike?.sid === spike2.sid);
  if (!stillHit) {
    move(lastMoveDir, 1, 1);
    return;
  }
  let best = null;
  for (let i = Math.PI / 60;i <= Math.PI; i += Math.PI / 60) {
    for (const sign of [1, -1]) {
      const candidate = lastMoveDir + sign * i;
      const positions = simulate(makeFrames(candidate, 5), player, safetyMargin);
      const safe = !positions.some((c) => c.spike?.sid === spike2.sid);
      if (safe) {
        best = candidate;
        break;
      }
    }
    if (best !== null)
      break;
  }
  if (best !== null) {
    move(best, 1, 1);
    delay(() => {
      move(null, 1, 1);
    }, 1);
  }
}
var breakTrap = () => {
  let obj = player.trap;
  if (obj) {
    let weapon = autoBreak(obj, true), spike2 = objects.find((c) => {
      let inRange2 = import_utils.default.getDistance(c.x, c.y, player.x2, player.y2) <= c.getScale() + weapon.range + 35;
      return c.active && c.isItem && c.owner && c.sid < 1000000000000000 && !ally(c.owner.sid) && [6, 7, 8, 9].includes(c.id) && inRange2 && import_utils.default.getDistance(c.x, c.y, obj.x, obj.y) <= 50 + c.getScale() + 35 / 2.5;
    });
    let target = obj;
    if (spike2 && enemy) {
      const enemyToSpike = import_utils.default.getDistance(enemy.x2, enemy.y2, spike2.x, spike2.y);
      const enemyToTrap = import_utils.default.getDistance(enemy.x2, enemy.y2, obj.x, obj.y);
      target = enemyToSpike < enemyToTrap ? obj : spike2;
    }
    let isDagger = player.weapons[0] === 7, inRange = enemy && import_utils.default.dist(player, enemy, 1) <= enemy.scale * 1.8, antiPush = isDagger && inRange && spike2;
    if (antiPush) {
      if (!player.autoGather)
        sendAutoGather();
      state.angle = import_utils.default.dir(player, enemy);
      state.weapon = player.weapons[0];
    } else
      autoBreak(target);
    if (player.spike)
      state.skin = 6;
  } else if (trap) {
    if (player.autoGather)
      sendAutoGather();
    state.skin = 6;
  }
  trap = obj;
  return Boolean(obj);
};
var autoWindmills = false;
var lastWindmill = 0;
function windmills() {
  const back = lastMoveDir - Math.PI, item = import_items.default.list[player.items[3]], gap = item.gap, built2 = [player.buildItem(item, back), player.buildItem(item, back + gap), player.buildItem(item, back - gap)], left = built2[0] && built2[1], right = built2[0] && built2[2];
  if ([null, undefined].includes(lastMoveDir) || time - lastWindmill < 2 || built2.includes(false) && !left && !right)
    return;
  console.log(`Windmill gap: ${gap}`);
  lastWindmill = time;
  built2[0] && build(player.items[3], back, 1, 1, 1);
  left && build(player.items[3], back + gap, 1, 1, 1);
  right && build(player.items[3], back - gap, 1, 1, 1);
}

class Macro {
  constructor(food, spike2, mill, trap, tele, spawn) {
    this.food = food;
    this.spike = spike2;
    this.mill = mill;
    this.trap = trap;
    this.tele = tele;
    this.spawn = spawn;
  }
  update() {
    keys[this.food] && build(player.items[0]);
    keys[this.spike] && build(player.items[2]);
    keys[this.mill] && build(player.items[3]);
    keys[this.trap] && build(player.items[4]);
    keys[this.tele] && build(player.items[5]);
    keys[this.spawn] && build(player.items[6]);
  }
}
var Placer = new Macro(81, 86, 78, 70, 72, 75);
var trap;
var enemies;
var enemy;
function autoSoldier() {
  if (!enemy)
    return;
  let caught;
  let length = projectiles2.length;
  for (let index = 0;index < length; index += 1) {
    let bullet = projectiles2[index];
    if (bullet.active && bullet.target?.isPlayer && bullet.target?.sid === player.sid) {
      if (bullet.estimated <= 2)
        caught = bullet;
    }
  }
  if (caught) {
    const dist = import_utils.default.getDistance(caught.x, caught.y, player.x2, player.y2);
    const estimated = Math.max(0, caught.time - time + Math.max(1, Math.ceil(Math.max(0, dist - 35) / (caught.speed * (1000 / 9)))));
    console.log(`projectile/soldier, ${estimated} ticks away, dist: ${dist.toFixed(2)}`);
    state.skin = 6;
  }
}
function autoEquip() {
  const biome = {
    water: player.y2 >= config_default.mapScale / 2 - config_default.riverWidth / 2 && player.y2 <= config_default.mapScale / 2 + config_default.riverWidth / 2 && !trap,
    snow: player.y3 <= config_default.snowBiomeTop
  };
  state.tail = 19;
  if (biome.water) {
    state.skin = 31;
  } else if (biome.snow) {
    state.skin = 15;
  } else
    state.skin = 12;
  if (!biome.water && !enemy && player.skinIndex === 45) {
    state.skin = 13;
    state.tail = 13;
  }
  if (enemy && !biome.water) {
    const range = 70 + import_items.default.weapons[enemy.reload[0].id].range, dist = import_utils.default.getDistance(enemy.x3, enemy.y3, player.x3, player.y3), close = dist <= range;
    const knockback = 67;
    let angle = import_utils.default.dir(player, enemy);
    let pos = {
      x: enemy.x3 + Math.cos(angle) * knockback,
      y: enemy.y3 + Math.sin(angle) * knockback
    };
    let spike2 = objects.find((c) => c.active && c.sid < 1000000000000000 && c.dmg && (!c.isItem || ally(c.owner.sid)) && import_utils.default.getDistance(c.x, c.y, pos.x, pos.y) <= c.scale + 35);
    if (close && enemy.reload[0].done)
      state.skin = !spike2 || damage >= 100 || enemy.trap ? 6 : 26;
    if (dist > 400) {
      !clicks.left && (state.tail = 11);
    } else
      state.tail = player.tails[19] ? 19 : 0;
  } else if (!clicks.left)
    state.tail = 11;
  if (clicks.left) {
    if (state.tail === 11) {
      io_client_default.send("13c", 0, 0, 1);
      state.tail = 19;
    } else
      state.skin = 7;
    let wpn = player.weapons[0];
    state.weapon = wpn;
  } else if (clicks.right) {
    state.skin = 40;
    let wpn = player.weapons[1] === 10 ? 10 : player.weapons[0];
    state.weapon = wpn;
  }
  if (player.skinIndex !== 45 && player.health === 100 && player.shameCount > 0 && player.skins[7]) {
    let leak = player.leak === undefined || player.leak % 9 === player.timerCount % 9;
    if (leak) {
      state.skin = 7;
      delay(() => {
        state.tail = 21;
        if (player.health !== 95)
          player.leak = undefined;
      }, 1);
    }
  }
}
function autoReload(data) {
  if ((player.trap || spike) && data)
    return breakWeapon;
  if (active || clicks.left || clicks.right || player.autoGather)
    return player.weaponIndex;
  if (!player.reload[0].done) {
    if (data)
      return player.weapons[0];
    state.weapon = player.weapons[0];
    return;
  } else if (!player.reload[1].done) {
    if (data)
      return player.weapons[1];
    state.weapon = player.weapons[1];
    return;
  }
  let primary = import_items.default.weapons[player.weapons[0]], secondary = import_items.default.weapons[player.weapons[1]], type = !secondary || primary.spdMult > secondary?.spdMult ? 0 : 1;
  if (data)
    return player.weapons[type];
  state.weapon = player.weapons[type];
}
var time = 0;
var delays = {};
var delay = (action, tick) => {
  if (tick < 1)
    return action();
  if (delays[time + tick]) {
    delays[time + tick].push(action);
  } else {
    delays[time + tick] = [action];
  }
};
var Rebuild = true;
var followingPath;
var minGap;
var Pathfinder = new ThetaAstar(1800, 4);
setInterval(() => {
  if (Rebuild) {
    Rebuild = false;
    Pathfinder.setBld(objects);
    Pathfinder.setObjectManager(objectManager);
    Pathfinder.lastBase = null;
    Pathfinder.costGrid = null;
    console.log("Pathfinder rebuilt");
  }
}, 1000);
var path = [];
var pathIndex = 0;
var endpoint;
var oldGap = 0;
var oldSpd;
async function findPath(target) {
  endpoint = target;
  let start = performance.now();
  if (oldSpd === player.spdMult) {
    minGap = oldGap;
  } else {
    oldSpd = player.spdMult;
    minGap = oldGap = await getGap(player.spdMult);
    console.log(`Min gap: ${minGap}`);
  }
  const fullPath = await Pathfinder.find(target, minGap, { x: player.xVel, y: player.yVel });
  path = fullPath;
  console.log(`path generation took ${Number(performance.now() - start).toFixed(2)} ms, size:`, path.length);
  if (path && path.length) {
    pathIndex = 0;
  }
}
async function followPath() {
  if (!followingPath)
    return;
  if (Rebuild || player.ai) {
    Rebuild = false;
    await findPath(endpoint);
  }
  if (!path || !path.length) {
    path = null;
    followingPath = false;
    sendMoveDir(null, true);
    return;
  }
  const currentX = player.x2;
  const currentY = player.y2;
  while (pathIndex < path.length - 1) {
    const waypoint = path[pathIndex];
    const nextWaypoint = path[pathIndex + 1];
    const toWaypoint_x = waypoint.x - currentX;
    const toWaypoint_y = waypoint.y - currentY;
    const distToWaypoint = Math.hypot(toWaypoint_x, toWaypoint_y);
    const toNext_x = nextWaypoint.x - currentX;
    const toNext_y = nextWaypoint.y - currentY;
    const distToNext = Math.hypot(toNext_x, toNext_y);
    if (distToNext < distToWaypoint) {
      pathIndex++;
      continue;
    }
    const waypointDir_x = nextWaypoint.x - waypoint.x;
    const waypointDir_y = nextWaypoint.y - waypoint.y;
    const waypointDist = Math.hypot(waypointDir_x, waypointDir_y);
    if (waypointDist > 0) {
      const normDir_x = waypointDir_x / waypointDist;
      const normDir_y = waypointDir_y / waypointDist;
      const dot = toWaypoint_x * normDir_x + toWaypoint_y * normDir_y;
      if (dot < 0) {
        pathIndex++;
        continue;
      }
    }
    if (distToWaypoint < 35) {
      pathIndex++;
      continue;
    }
    break;
  }
  if (pathIndex >= path.length) {
    path = null;
    followingPath = false;
    sendMoveDir(null, true);
    return;
  }
  const targetWaypoint = path[pathIndex];
  const dx = targetWaypoint.x - currentX;
  const dy = targetWaypoint.y - currentY;
  const distToTarget = Math.hypot(dx, dy);
  if (pathIndex === path.length - 1 && distToTarget < player.maxSpeed) {
    let dist = import_utils.default.getDistance(endpoint.x, endpoint.y, currentX, currentY);
    if (dist < 100) {
      path = null;
      followingPath = false;
      sendMoveDir(null, true);
    } else
      findPath(endpoint);
    return;
  }
  const angle = Math.atan2(dy, dx);
  sendMoveDir(angle, true);
}
var GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
function autoPlace() {
  if (!enemy)
    return;
  const fibCount = 21;
  for (let enemy2 of enemies) {
    if (import_utils.default.getDistance(enemy2.x3, enemy2.y3, player.x3, player.y3) > 350)
      break;
    let score = 0, best;
    let lastBuild, item = import_items.default.list[player.items[2]];
    let angle = import_utils.default.dir(player, enemy2);
    for (let i = 0;i < fibCount; i++) {
      const offset = i === 0 ? 0 : GOLDEN_ANGLE * i;
      const dirs = i === 0 ? [angle] : [angle + offset, angle - offset];
      for (let dir of dirs) {
        const canBuild = player.buildItem(item, dir, true);
        const scale = 35 + item.scale + (item.placeOffset || 0);
        let build2 = {
          x: player.x2 + Math.cos(dir) * scale,
          y: player.y2 + Math.sin(dir) * scale,
          dmg: item.dmg,
          dir,
          isItem: true,
          owner: { sid: player.sid },
          sid: Math.round(1000000000000000 + Math.random() * 5000)
        };
        let dist = import_utils.default.getDistance(build2.x, build2.y, enemy2.x3, enemy2.y3);
        if (canBuild && dist <= item.scale + player.scale) {
          lastBuild = objectManager.add(build2.sid, build2.x, build2.y, build2.dir, item.scale, 1, item, true, player.sid, true);
          let tmpScore = kbScore(lastBuild, enemy2);
          objectManager.disableBySid(lastBuild.sid);
          if (score < tmpScore) {
            score = tmpScore;
            best = build2;
          }
        }
      }
    }
    if (score > 40) {
      build(player.items[2], best.dir);
      console.log("best score:", score);
    }
  }
  if (import_utils.default.getDistance(enemy.x3, enemy.y3, player.x3, player.y3) > 350 || isPrivate3)
    return;
  let tmpArray = objects.filter((c) => c.id === 15 && import_utils.default.dist(c, player) <= 400 && ally(c.owner.sid));
  for (let trap2 of tmpArray) {
    let hasSpike = false;
    for (let index = 0;index < objects.length; index++) {
      const b2 = objects[index];
      if (!b2.fake && (!b2.isItem || b2.active) && b2.dmg && (!b2.isItem || ally(b2.owner.sid)) && Math.hypot(b2.x - trap2.x, b2.y - trap2.y) <= trap2.getScale() + b2.getScale() + 70) {
        hasSpike = true;
        break;
      }
    }
    if (hasSpike)
      continue;
    const item = import_items.default.list[player.items[2]];
    if (!item)
      continue;
    const scale = 35 + item.scale + (item.placeOffset || 0);
    const angle = import_utils.default.dir(player, trap2);
    const trapScale = trap2.getScale();
    const maxDist = trapScale + item.scale + 70;
    let placed = false;
    for (let i = 0;i < 8 && !placed; i++) {
      const offset = i === 0 ? 0 : GOLDEN_ANGLE * i;
      const dirs = i === 0 ? [angle] : [angle + offset, angle - offset];
      for (let dir of dirs) {
        const bx = player.x2 + Math.cos(dir) * scale;
        const by = player.y2 + Math.sin(dir) * scale;
        if (Math.hypot(bx - trap2.x, by - trap2.y) > maxDist)
          continue;
        if (!player.buildItem(item, dir, true))
          continue;
        build(player.items[2], dir, 1, 1);
        placed = true;
        break;
      }
    }
  }
  for (let point of aggressive) {
    let buildId = player.items[lastAids && performance.now() - lastAids <= 500 ? 2 : player.items[5] && keys[72] ? 5 : !trap && player.items[4] === 15 ? 4 : 2], item = import_items.default.list[buildId];
    let angle = import_utils.default.dir(player, point);
    for (let i = 0;i < fibCount; i++) {
      const offset = i === 0 ? 0 : GOLDEN_ANGLE * i;
      const dirs = i === 0 ? [angle] : [angle + offset, angle - offset];
      for (let dir of dirs) {
        const canBuild = player.buildItem(item, dir, true);
        const scale = 35 + item.scale + (item.placeOffset || 0);
        tmpObj2 = {
          x: player.x2 + Math.cos(dir) * scale,
          y: player.y2 + Math.sin(dir) * scale,
          dmg: item.dmg,
          dir,
          isItem: true,
          owner: { sid: player.sid },
          sid: Math.round(1000000000000000 + Math.random() * 5000)
        };
        let dist = import_utils.default.dist(tmpObj2, point);
        if (canBuild && dist <= item.scale + point.scale) {
          build(buildId, dir);
          console.log("blocked aggressive point");
        }
      }
    }
  }
  if (!active && !player.trap && player.items[4] === 15 && import_items.default.list[player.items[4]]) {
    let start = import_utils.default.dir(player, enemy), gap = import_items.default.list[player.items[4]].gap;
    for (let i = -gap / 2;i < gap * 3.5; i += gap) {
      build(player.items[4], start + i);
    }
  }
}
function kbScore(obj, p2 = player) {
  let score = 0, spikes = [];
  let res = simulateKB([[p2.moveDir, p2.skinIndex, p2.tailIndex, p2.weaponIndex]], obj, p2);
  let last = res[res.length - 1], prev = res[0];
  spikes = last.spikes;
  let trap2, spike2;
  for (let pos of res) {
    if (pos.spike) {
      score += 20;
      spike2 = pos.spike;
    }
    if (pos.trap && !trap2) {
      score += 70;
      trap2 = pos.trap;
    }
    prev = pos;
  }
  let rest = res[res.length - 1];
  return score;
}
function simulateKB(arr, testSpike, obj = player) {
  const delta2 = 1000 / 9;
  let x = obj.x3 || obj.x2 || obj.x, y = obj.y3 || obj.y2 || obj.y;
  let xVel = obj.xVel || 0, yVel = obj.yVel || 0;
  let slowMult = obj.slowMult || 1;
  let spikes = [];
  let baseBuildList = testSpike ? [testSpike, ...objects] : objects;
  let builds = objects;
  if (testSpike && builds.indexOf(testSpike) === -1)
    builds.unshift(testSpike);
  function update(moveDir, skinIndex, tailIndex, weaponIndex) {
    let trap2, spike2;
    const skin = skins.find((c) => c.id === skinIndex);
    const tail = tails.find((c) => c.id === tailIndex);
    let spdMult = (obj.buildIndex >= 0 ? 0.5 : 1) * (import_items.default.weapons[weaponIndex].spdMult || 1) * (skin ? skin.spdMult || 1 : 1) * (tail ? tail.spdMult || 1 : 1) * (y <= config_default.snowBiomeTop ? skin && skin.coldM ? 1 : config_default.snowSpeed : 1) * slowMult;
    if (y >= config_default.mapScale / 2 - config_default.riverWidth / 2 && y <= config_default.mapScale / 2 + config_default.riverWidth / 2) {
      if (skin && skin.watrImm) {
        spdMult *= 0.75;
        xVel += config_default.waterCurrent * 0.4 * delta2;
      } else {
        spdMult *= 0.33;
        xVel += config_default.waterCurrent * delta2;
      }
    }
    var xVel2 = moveDir != null ? Math.cos(moveDir) : 0;
    var yVel2 = moveDir != null ? Math.sin(moveDir) : 0;
    var length = Math.sqrt(xVel2 * xVel2 + yVel2 * yVel2);
    if (length != 0) {
      xVel2 /= length;
      yVel2 /= length;
    }
    if (xVel2)
      xVel += xVel2 * config_default.playerSpeed * spdMult * delta2;
    if (yVel2)
      yVel += yVel2 * config_default.playerSpeed * spdMult * delta2;
    let totalDist = Math.hypot(xVel * delta2, yVel * delta2);
    let depth = Math.min(4, Math.max(1, Math.round(totalDist / 40)));
    let stepMlt = 1 / depth;
    for (let i = 0;i < depth; i++) {
      x += xVel * delta2 * stepMlt;
      y += yVel * delta2 * stepMlt;
      for (let other of builds) {
        let colX = other.x2 || other.x;
        let colY = other.y2 || other.y;
        let dx = x - colX;
        let dy = y - colY;
        const tmpLen = obj.scale + other.scale;
        if (!other.active || Math.abs(dx) > tmpLen && Math.abs(dy) > tmpLen)
          continue;
        const fullLen = obj.scale + (other.getScale ? other.getScale() : other.scale);
        const tmpInt = Math.sqrt(dx * dx + dy * dy) - fullLen;
        if (tmpInt > 0)
          continue;
        const tmpDir2 = import_utils.default.getDirection(x, y, colX, colY);
        const isEnemy = !other.isItem || other.owner && !obj.team && obj.sid !== other.owner.sid || !ally(other.sid) && ally(other.owner?.sid) || ally(other.sid) && !ally(other.owner?.sid);
        const adjustment = tmpInt * -0.5;
        const cosDir = Math.cos(tmpDir2);
        const sinDir = Math.sin(tmpDir2);
        if (!other.ignoreCollision) {
          x += adjustment * cosDir;
          y += adjustment * sinDir;
          colX -= adjustment * cosDir;
          colY -= adjustment * sinDir;
          xVel *= 0.75;
          yVel *= 0.75;
        }
        if (other.dmg && isEnemy) {
          let exit = spikes.find((s) => s.sid === other.sid);
          if (exit) {
            if (i > exit.depth) {
              exit.x = other.x;
              exit.y = other.y;
              exit.depth = i;
              exit.hasTrap = trap2;
              exit.hasSpike = spike2;
            }
          } else {
            var tmpSpd = 1.5 * (other.weightM || 1);
            xVel += tmpSpd * Math.cos(tmpDir2);
            yVel += tmpSpd * Math.sin(tmpDir2);
            spike2 = { x: other.x, y: other.y, dmg: other.dmg, sid: other.sid, hasTrap: trap2, depth: i };
            spikes.push(spike2);
          }
        } else if (other.trap && isEnemy) {
          trap2 = { x: other.x, y: other.y, trap: true, hasSpike: spike2 };
          spikes.push(trap2);
        }
      }
    }
    if (xVel) {
      xVel *= Math.pow(config_default.playerDecel, delta2);
      if (xVel <= 0.01 && xVel >= -0.01)
        xVel = 0;
    }
    if (yVel) {
      yVel *= Math.pow(config_default.playerDecel, delta2);
      if (yVel <= 0.01 && yVel >= -0.01)
        yVel = 0;
    }
    x = Math.max(obj.scale, Math.min(config_default.mapScale - obj.scale, x));
    y = Math.max(obj.scale, Math.min(config_default.mapScale - obj.scale, y));
    return { x, y, xVel, yVel, trap: trap2, spike: spike2, spikes };
  }
  const res = [];
  for (let data of arr) {
    for (let tick = 0;tick < 7; tick += 1)
      res.push(update(...data));
  }
  return res;
}
function velTick() {
  if (!enemy || active || player.weapons[1] !== 10 || player.weapons[0] !== 5 || player.reload[0].val !== 1.18 || !player.reload[0].done || !player.reload[2].done)
    return null;
  let res = simulate([[enemy.moveDir, enemy.skinIndex, enemy.tailIndex, enemy.weaponIndex], [enemy.moveDir, enemy.skinIndex, enemy.tailIndex, enemy.weaponIndex], [enemy.moveDir, enemy.skinIndex, enemy.tailIndex, enemy.weaponIndex]], enemy);
  let primary = import_items.default.weapons[5], angle = import_utils.default.dir(player, enemy), ang, pass, ds;
  outerLoop:
    for (let i = -Math.PI / 2;i < Math.PI / 2; i += Math.PI / 16) {
      for (let hat in player.skins) {
        hat = Number(hat);
        if (![53, 0].includes(hat)) {
          let arr = simulate([[angle + i, player.skinIndex, player.tailIndex, 10], [angle, 53, player.tailIndex, 10], [angle, 7, player.tailIndex, 5]], player);
          let hat_dist = import_utils.default.dist(res[0], arr[0]), turret_dist = import_utils.default.dist(res[1], arr[1]), bull_dist = import_utils.default.dist(res[2], arr[2]);
          if (hat_dist < 320 && turret_dist > 203 && bull_dist <= primary.range + 35 * 1.3) {
            ds = arr[2];
            pass = hat;
            ang = angle + i;
            break outerLoop;
          }
        }
      }
    }
  if (!pass)
    return;
  console.log("one frame", import_utils.default.dist(enemy, player), state.skin);
  active = true;
  aimbot = true;
  state.skin = pass;
  state.weapon = player.weapons[1];
  move(ang);
  delay(() => {
    state.skin = 53;
    state.weapon = player.weapons[1];
    if (enemy)
      angle = import_utils.default.dir(player, enemy);
    move(angle);
    delay(() => {
      state.skin = 7;
      ds && console.log(import_utils.default.dist(ds, player));
      state.weapon = player.weapons[0];
      if (enemy)
        angle = import_utils.default.dir(player, enemy);
      move(angle);
      if (!player.autoGather)
        sendAutoGather();
      delay(() => {
        ds && console.log(import_utils.default.dist(ds, player));
        move(null);
        state.skin = 12;
        active = false;
        aimbot = false;
        if (player.autoGather)
          sendAutoGather();
      }, 1);
    }, 1);
  }, 1);
}
function simulate(arr, obj = player, safetyMargin2 = 0) {
  const delta2 = 1000 / 9;
  let x = obj.x2 || obj.x, y = obj.y2 || obj.y;
  let xVel = obj.xVel || 0, yVel = obj.yVel || 0;
  let slowMult = obj.slowMult || 1;
  let spikes = [];
  let builds = objects.filter((c) => !c.fake);
  function update(moveDir, skinIndex, tailIndex, weaponIndex) {
    let trap2, spike2;
    const skin = skins.find((c) => c.id === skinIndex);
    const tail = tails.find((c) => c.id === tailIndex);
    let spdMult = (obj.buildIndex >= 0 ? 0.5 : 1) * (import_items.default.weapons[weaponIndex].spdMult || 1) * (skin ? skin.spdMult || 1 : 1) * (tail ? tail.spdMult || 1 : 1) * (y <= config_default.snowBiomeTop ? skin && skin.coldM ? 1 : config_default.snowSpeed : 1) * slowMult;
    if (y >= config_default.mapScale / 2 - config_default.riverWidth / 2 && y <= config_default.mapScale / 2 + config_default.riverWidth / 2) {
      if (skin && skin.watrImm) {
        spdMult *= 0.75;
        xVel += config_default.waterCurrent * 0.4 * delta2;
      } else {
        spdMult *= 0.33;
        xVel += config_default.waterCurrent * delta2;
      }
    }
    var xVel2 = moveDir != null ? Math.cos(moveDir) : 0;
    var yVel2 = moveDir != null ? Math.sin(moveDir) : 0;
    var length = Math.sqrt(xVel2 * xVel2 + yVel2 * yVel2);
    if (length != 0) {
      xVel2 /= length;
      yVel2 /= length;
    }
    if (xVel2)
      xVel += xVel2 * config_default.playerSpeed * spdMult * delta2;
    if (yVel2)
      yVel += yVel2 * config_default.playerSpeed * spdMult * delta2;
    let totalDist = Math.hypot(xVel * delta2, yVel * delta2);
    let depth = Math.min(4, Math.max(1, Math.round(totalDist / 40)));
    let stepMlt = 1 / depth;
    for (let i = 0;i < depth; i++) {
      x += xVel * delta2 * stepMlt;
      y += yVel * delta2 * stepMlt;
      for (let other of builds) {
        let colX = other.x2 || other.x;
        let colY = other.y2 || other.y;
        let dx = x - colX;
        let dy = y - colY;
        const tmpLen = obj.scale + other.scale;
        if (!other.active || Math.abs(dx) > tmpLen && Math.abs(dy) > tmpLen)
          continue;
        const fullLen = obj.scale + (other.getScale ? other.getScale() : other.scale);
        const tmpInt = Math.sqrt(dx * dx + dy * dy) - fullLen;
        if (tmpInt > safetyMargin2)
          continue;
        const tmpDir2 = import_utils.default.getDirection(x, y, colX, colY);
        const isEnemy = !other.isItem || other.owner && !obj.team && obj.sid !== other.owner.sid || !window.ally(obj.sid) && window.ally(other.owner?.sid) || window.ally(obj.sid) && !window.ally(other.owner?.sid);
        const adjustment = tmpInt * -0.5;
        const cosDir = Math.cos(tmpDir2);
        const sinDir = Math.sin(tmpDir2);
        if (!other.ignoreCollision) {
          x = colX + fullLen * Math.cos(tmpDir2);
          y = colY + fullLen * Math.sin(tmpDir2);
          xVel *= 0.75;
          yVel *= 0.75;
        }
        if (other.dmg && isEnemy) {
          let exit = spikes.find((s) => s.sid === other.sid);
          if (exit) {
            if (i > exit.depth) {
              exit.x = other.x;
              exit.y = other.y;
              exit.depth = i;
              exit.hasTrap = trap2;
              exit.hasSpike = spike2;
            }
          } else {
            var tmpSpd = 1.5 * (other.weightM || 1);
            xVel += tmpSpd * Math.cos(tmpDir2);
            yVel += tmpSpd * Math.sin(tmpDir2);
            spike2 = { x: other.x, y: other.y, dmg: other.dmg, scale: other.getScale(), sid: other.sid, hasTrap: trap2, depth: i };
            spikes.push(spike2);
          }
        } else if (other.trap && isEnemy) {
          trap2 = { x: other.x, y: other.y, trap: true, scale: 50, hasSpike: spike2 };
          spikes.push(trap2);
        }
      }
    }
    if (xVel) {
      xVel *= Math.pow(config_default.playerDecel, delta2);
      if (xVel <= 0.01 && xVel >= -0.01)
        xVel = 0;
    }
    if (yVel) {
      yVel *= Math.pow(config_default.playerDecel, delta2);
      if (yVel <= 0.01 && yVel >= -0.01)
        yVel = 0;
    }
    x = Math.max(obj.scale, Math.min(config_default.mapScale - obj.scale, x));
    y = Math.max(obj.scale, Math.min(config_default.mapScale - obj.scale, y));
    return { x, y, xVel, yVel, trap: trap2, spike: spike2, spikes };
  }
  const res = [];
  for (let data of arr) {
    res.push(update(...data));
  }
  return res;
}
var aimbot;
function sync() {
  let weapon = player.weapons[0];
  if (weapon === undefined || active)
    return;
  let obj = import_items.default.weapons[weapon];
  let primary = obj.dmg * (player.reload[0]?.val || 1);
  for (let e of enemies) {
    let dmg = 0;
    let health = 100;
    if (e.spike)
      dmg += e.spike;
    let bullet_hit;
    for (let bullet of projectiles2) {
      if (bullet.estimated === 2 && bullet.target && bullet.target.sid === e.sid && (bullet.owner.isItem && ally(bullet.owner.owner.sid) || ally(bullet.owner.sid))) {
        dmg += bullet.dmg;
        bullet_hit = true;
      }
    }
    let dist = import_utils.default.getDistance(e.x3, e.y3, player.x3, player.y3);
    if (bullet_hit)
      console.log("bullet lands on enemy", dist, dist <= obj.range + 35 * 1.8);
    if (player.reload[0].done && dist <= obj.range + 70) {
      let dealt = primary * 1.5 > primary + (player.reload[2].done ? 25 : 1) ? primary * 1.5 : primary + (player.reload[2].done ? 25 : 1);
      dmg += dealt;
      if (e.dmgOverTime.dmg)
        dmg -= e.dmgOverTime.dmg;
      let tmpDir2 = import_utils.default.getDirection(e.x2, e.y2, player.x2, player.y2);
      let impact = 0.3 + (obj.knock || 0);
      impact *= Number(player.weapons[1] === 10) + 1;
      let knockback = impact * (111 * 1.4), x4 = e.x3 + Math.cos(tmpDir2) * knockback, y4 = e.y3 + Math.sin(tmpDir2) * knockback;
      let spike2 = objects.find((c) => c.active && c.sid < 1000000000000000 && c.dmg && (!c.isItem || ally(c.owner.sid)) && import_utils.default.getDistance(c.x, c.y, x4, y4) <= c.scale + 35);
      if (spike2 && !e.trap) {
        dmg += spike2.dmg;
        let angle = Math.atan2(y4 - spike2.y, x4 - spike2.x);
        let purple_circle = {
          x: spike2.x + Math.cos(angle) * (spike2.getScale() + 35),
          y: spike2.y + Math.sin(angle) * (spike2.getScale() + 35)
        };
        circles.push(purple_circle);
      }
      if (health - dmg <= 0) {
        active = true;
        state.skin = primary * 1.5 > primary + (player.reload[2].done ? 25 : 1) ? 7 : 53;
        aimbot = true;
        state.weapon = player.weapons[0];
        let weapon2 = player.weaponIndex;
        if (!player.autoGather)
          sendAutoGather();
        console.log("sync!");
        delay(() => {
          active = false;
          aimbot = false;
          state.weapon = weapon2;
          if (player.autoGather)
            sendAutoGather();
        }, 1);
      }
    }
  }
}
var lastTP = 0;
function finder() {
  if (!autoTP || enemy || !player.items[5] || time - lastTP < 3) {
    if (enemy && lastTP) {
      lastTP = 0;
      move(undefined);
    }
    return;
  }
  lastTP = time;
  const item = import_items.default.list[player.items[5]], angle = getAttackDir();
  outLoop:
    for (let i = Math.PI;i > 0; i -= Math.PI / 40) {
      let dirs = i === 0 ? [angle] : [angle + i, angle - i];
      for (let dir of dirs) {
        const canBuild = player.buildItem(item, dir, true);
        const scale = 35 + item.scale + (item.placeOffset || 0);
        if (canBuild) {
          build(player.items[5], dir);
          move(dir);
          break outLoop;
        }
      }
    }
}
function grinder() {
  if (!autoGrind)
    return;
  let idx = player.reload[0].rarity >= 2 ? 1 : 0, id = player.weapons[idx];
  if ([9, 11, 12, 13, 14, 15].includes(id) || id === 10 && player.reload[1].rarity > 0)
    return;
  state.weapon = id;
  let turrets = objects.filter((c) => c.isItem && ["turret", "teleporter"] && import_utils.default.getDistance(c.x, c.y, player.x2, player.y2) <= import_items.default.weapons[id].range + c.getScale());
  const halfSweep = Math.PI / 5.2;
  let events = [];
  for (let turret of turrets) {
    let angle = Math.atan2(turret.y - player.y2, turret.x - player.x2);
    events.push({ angle: angle - halfSweep, type: 1 });
    events.push({ angle: angle + halfSweep, type: -1 });
  }
  events.sort((a, b2) => a.angle - b2.angle || b2.type - a.type);
  let maxHits = 0, bestAngle = player.angle, currentHits = 0;
  for (let event of events) {
    currentHits += event.type;
    if (currentHits > maxHits) {
      maxHits = currentHits;
      bestAngle = event.angle;
    }
  }
  build(player.items[5], getAttackDir() + Math.PI / 4);
  build(player.items[5], getAttackDir() - Math.PI / 4);
  if (player.reload[idx].done) {
    state.angle = bestAngle;
    state.skin = 40;
    if (!player.autoGather)
      sendAutoGather();
  }
}
var inPush = false;
var pushPos;
var pushAngle;
var pushOffset;
var Pushing;
document.pushAmount = 7;
document.pushSpot = 35;
var autoPush = () => {
  const whenStop = () => {
    if (Pushing)
      move(null);
    Pushing = false;
  };
  let wasInPush = inPush;
  inPush = false;
  if (!enemy)
    return whenStop();
  let Length;
  const trap2 = enemy.trap;
  if (!trap2)
    return whenStop();
  const spikes = (() => {
    Length = objects.length;
    let temp = [];
    for (let index = 0;index < Length; index += 1) {
      const build2 = objects[index];
      const isSpike = (!build2.isItem || build2.active) && !build2.fake && import_utils.default.dist(build2, trap2) <= trap2.getScale() + build2.getScale() + 70 && build2.dmg && (!build2.isItem || build2.owner.sid < 0 || ally(build2.owner.sid));
      if (isSpike)
        temp.push(build2);
    }
    Length = temp.length;
    if (!Length)
      return false;
    if (Length > 1) {
      temp = temp.sort((obj, obj2) => {
        const distance2 = [import_utils.default.dist(trap2, obj), import_utils.default.dist(trap2, obj2)];
        return distance2[0] - distance2[1];
      });
    }
    return temp;
  })();
  if (!spikes.length)
    return whenStop();
  inPush = true;
  let spike2 = (() => {
    if (spikes.length > 1) {
      const dist = import_utils.default.dist(spikes[0], spikes[1]) / 2;
      const minDist = 35 * 1.5 + spikes[0].getScale() * 2;
      if (dist * 2 > minDist)
        return spikes[0];
      const angle2 = import_utils.default.dir(spikes[0], spikes[1]);
      return {
        x: spikes[0].x + Math.cos(angle2) * dist,
        y: spikes[0].y + Math.sin(angle2) * dist,
        double: true
      };
    } else
      return spikes[0];
  })();
  const enemyDist = import_utils.default.dist(spike2, enemy);
  let angle = import_utils.default.dir(spike2, enemy);
  let distance = enemyDist + 80;
  pushPos = {
    x: spike2.x + distance * Math.cos(angle),
    y: spike2.y + distance * Math.sin(angle)
  };
  angle = import_utils.default.dir(player, pushPos);
  const trapAngle = import_utils.default.dir(player, trap2);
  const spikeAngle = import_utils.default.dir(player, spike2);
  const pushSide = trapAngle > spikeAngle ? "right" : "left";
  pushOffset = Math.abs(import_utils.default.dir(player, spike2) - import_utils.default.dir(player, trap2));
  pushAngle = import_utils.default.dir(player, enemy);
  const offsetSize = Math.min(0, (enemyDist - (spike2.double ? 40 : spike2.getScale()) - 35) / 50);
  const offset = pushOffset * (document.pushAmount * offsetSize);
  switch (pushSide) {
    case "right":
      pushAngle -= offset;
      break;
    case "left":
      pushAngle += offset;
      break;
  }
  console.log("push offset:", Number(offset.toFixed(2)));
  const distToPush = import_utils.default.dist(pushPos, player);
  inPush = distToPush < document.pushSpot;
  if (!wasInPush && inPush)
    console.log("pushing!");
  const Angles = [angle, pushAngle];
  angle = Angles[Number(inPush)];
  if (inPush) {
    move(angle, true);
  } else {
    if (!followingPath) {
      findPath(pushPos, true).then(() => {
        if (path && path.length) {
          let length = Pathfinder.pathLength();
          if (length < 350)
            followingPath = true;
        }
      });
    }
  }
  Pushing = true;
};
function Kalman() {
  const DT = 1000 / 9;
  const history = new WeakMap;
  function getState(target) {
    if (!history.has(target)) {
      history.set(target, {
        x: target.x2,
        y: target.y2,
        vx: 0,
        vy: 0,
        P: [
          100,
          0,
          0,
          0,
          0,
          100,
          0,
          0,
          0,
          0,
          100,
          0,
          0,
          0,
          0,
          100
        ],
        lastX: target.x2,
        lastY: target.y2,
        tick: 0
      });
    }
    return history.get(target);
  }
  const Q_POS = 0.1;
  const Q_VEL = 8;
  const R_POS = 2;
  function predictStep(s, steps) {
    for (let i = 0;i < steps; i++) {
      s.x += s.vx;
      s.y += s.vy;
      s.vx *= config_default.playerDecel ** DT;
      s.vy *= config_default.playerDecel ** DT;
    }
    let P = s.P;
    P[0] += steps * (P[5] + Q_POS);
    P[5] += steps * Q_VEL;
    P[10] += steps * (P[15] + Q_POS);
    P[15] += steps * Q_VEL;
  }
  function correct(s, mx, my) {
    let P = s.P;
    let sx = P[0] + R_POS;
    let kx = P[0] / sx;
    let kvx = P[5] / sx;
    let ix = mx - s.x;
    s.x += kx * ix;
    s.vx += kvx * ix;
    P[0] *= 1 - kx;
    P[5] -= kvx * P[0];
    let sy = P[10] + R_POS;
    let ky = P[10] / sy;
    let kvy = P[15] / sy;
    let iy = my - s.y;
    s.y += ky * iy;
    s.vy += kvy * iy;
    P[10] *= 1 - ky;
    P[15] -= kvy * P[10];
  }
  function clampToMap(s) {
    s.x = Math.max(35, Math.min(config_default.mapScale - 35, s.x));
    s.y = Math.max(35, Math.min(config_default.mapScale - 35, s.y));
  }
  function checkRiver(s) {
    let riverTop = config_default.mapScale / 2 - config_default.riverWidth / 2;
    let riverBot = config_default.mapScale / 2 + config_default.riverWidth / 2;
    if (s.y >= riverTop && s.y <= riverBot) {
      s.vx += config_default.waterCurrent * DT;
    }
  }
  function update(target) {
    let s = getState(target);
    s.tick++;
    predictStep(s, 1);
    correct(s, target.x2, target.y2);
    checkRiver(s);
    clampToMap(s);
    s.lastX = target.x2;
    s.lastY = target.y2;
    return s;
  }
  function predictFuture(s, ticks) {
    let px = s.x;
    let py = s.y;
    let pvx = s.vx;
    let pvy = s.vy;
    let decel = config_default.playerDecel ** DT;
    for (let i = 0;i < ticks; i++) {
      px += pvx;
      py += pvy;
      pvx *= decel;
      pvy *= decel;
      let riverTop = config_default.mapScale / 2 - config_default.riverWidth / 2;
      let riverBot = config_default.mapScale / 2 + config_default.riverWidth / 2;
      if (py >= riverTop && py <= riverBot) {
        pvx += config_default.waterCurrent * DT;
      }
      px = Math.max(35, Math.min(config_default.mapScale - 35, px));
      py = Math.max(35, Math.min(config_default.mapScale - 35, py));
    }
    return { x: px, y: py, vx: pvx, vy: pvy };
  }
  function leadShot(target, projectile) {
    let s = update(target);
    let speed = projectile.speed * (DT / 1);
    let range = projectile.range;
    let bestAngle = null;
    let bestPos = null;
    for (let ticks = 1;ticks < 40; ticks++) {
      let future = predictFuture(s, ticks);
      let dx = future.x - player.x2;
      let dy = future.y - player.y2;
      let dist = Math.hypot(dx, dy);
      let travelDist = speed * ticks;
      if (Math.abs(dist - travelDist) < 35 + 20) {
        if (travelDist > range)
          break;
        bestAngle = Math.atan2(dy, dx);
        bestPos = future;
        break;
      }
      if (travelDist > dist + 50)
        break;
    }
    if (bestAngle !== null && bestPos) {
      lines.push({
        x1: player.x2,
        y1: player.y2,
        x2: bestPos.x,
        y2: bestPos.y,
        colour: "#ff3333",
        width: 2
      });
      circles.push({
        x: bestPos.x,
        y: bestPos.y,
        scale: 20,
        colour: "#ff3333"
      });
    }
    return bestAngle;
  }
  function reset(target) {
    history.delete(target);
  }
  return { update, leadShot, predictFuture, getState, reset };
}
var kalman = Kalman();
var autoTP;
var kbResult;
var damage;
var state;
var queue = [];
var arrows = [];
var lines = [];
var circles = [];
function update() {
  state = {
    skin: 0,
    tail: 0
  };
  let length = projectiles2.length;
  for (let index = 0;index < length; index += 1) {
    projectiles2[index].active && projectiles2[index].target_update(time);
  }
  length = queue.length;
  for (let index = 0;index < length; index++)
    queue[index].function(...queue[index].data);
  queue = [];
  Pathfinder.setMe(player, players);
  if (phantom.length > 0) {
    for (let build2 of phantom) {
      objectManager.disableBySid(build2.sid);
    }
    phantom = [];
  }
  maxBuilds = 5;
  if (player.spikes)
    for (let b2 of player.spikes) {
      if (!b2.tween || performance.now() - b2.tween > 500) {
        b2.tween = performance.now();
      }
    }
  circles = [];
  arrows = [];
  lines = [];
  Placer.update();
  autoWindmills && windmills();
  !active && autoEquip();
  if ([clicks.left, clicks.right, autoGrind].includes(true) && !player.autoGather)
    sendAutoGather();
  antiSpike();
  let worked = breakTrap();
  if (!worked)
    breakSpike();
  autoSoldier();
  autoPlace();
  finder();
  !spike && !player.trap && autoReload();
  autoPush();
  grinder();
  if (delays[time]) {
    const list = delays[time];
    length = list.length;
    for (let i = 0;i < length; i += 1)
      list[i]();
    delete delays[time];
  }
  velTick();
  sync();
  aids();
  if (enemy && keys[80] && [9, 12, 13, 15].includes(player.weapons[1]) && player.reload[1].done) {
    let weapon = import_items.default.weapons[player.reload[1].id];
    let angle = kalman.leadShot(enemy, import_items.default.projectiles[weapon.projectile]);
    console.log("Kalman angle: ", angle);
    if (!player.autoGather)
      sendAutoGather();
    active = true;
    state.angle = angle;
    state.weapon = player.weapons[1];
    delay(() => {
      active = false;
      if (player.autoGather)
        sendAutoGather();
    }, 1);
  }
  if (state.weapon !== undefined) {
    if (built || player.weaponIndex !== state.weapon || player.buildIndex > -1 || built)
      io_client_default.send("5", state.weapon, true);
  }
  if (built) {
    io_client_default.send("c", false);
    built = false;
    lastAngle = 0;
  }
  worked = false;
  if (!player.skins[state.skin])
    state.skin = 0;
  state.skin = player.skins[state.skin] ? state.skin : 0;
  if (player.skinIndex !== state.skin)
    worked = equip(state.skin, 0);
  state.tail = player.tails[state.tail] ? state.tail : 0;
  !worked && player.tailIndex !== state.tail && equip(state.tail, 1);
  damage = potDmg();
  autoHeal();
  worked = false;
  let reload = player.reload[Number(player.weaponIndex > 8)];
  if (!aimbot && !active && !trap && !spike && (reload.id === 11 || reload.done && (attackState || player.autoGather))) {
    worked = true;
    look();
  }
  if (aimbot && enemy) {
    look(import_utils.default.dir(player, enemy));
  } else if (state.angle && spike || state.angle && trap || !worked && state.angle)
    look(state.angle);
  equip("shop");
  followPath();
  showPing();
}
var lastTick;
var objects = [];
var tickRate = 1000 / config_default.serverUpdateRate;
var BUFFER = 10;
async function updatePlayers(data) {
  let delay2 = tickRate - pingTime - BUFFER;
  if (isPrivate3)
    delay2 += 8;
  while (delay2 < 0)
    delay2 += tickRate;
  setTimeout(() => {
    Preplace();
  }, delay2);
  await Promise.race([
    updatePromise,
    new Promise((resolve) => setTimeout(resolve, 20))
  ]);
  lastTick = Date.now();
  time += 1;
  const tmpTime = Date.now();
  enemies = [];
  enemy = null;
  let tpmDist;
  for (let i = 0;i < players.length; ++i) {
    players[i].forcePos = !players[i].visible;
    players[i].visible = false;
  }
  for (let i = 0;i < data.length; ) {
    tmpObj2 = findPlayerBySID(data[i]);
    if (tmpObj2) {
      tmpObj2.update(tmpTime, data[++i], data[++i], data[++i], data[++i], data[++i], data[++i], data[++i], data[++i], data[++i], data[++i], data[++i], data[++i]);
      const isEnemy = player.sid !== tmpObj2.sid && (!player.team || player.team !== tmpObj2.team);
      if (isEnemy) {
        const currentDist = import_utils.default.dist(tmpObj2, player);
        if (!tpmDist || tpmDist > currentDist) {
          enemies.push(tmpObj2);
          enemy = tmpObj2;
          tpmDist = currentDist;
        }
        kalman.update(tmpObj2);
      }
    } else {
      i += 12;
    }
    ++i;
  }
  for (let i = 0;i < players.length; ++i) {
    if (players[i].forcePos && !players[i].visible && !players[i].fresh && players[i].sid !== player.sid) {
      players[i].spawn();
      players[i].fresh = true;
    }
  }
  if (player) {
    objectManager.objects = objects = gameObjects.filter((obj) => {
      let dist = import_utils.default.getDistance(player.x2, player.y2, obj.x, obj.y);
      return (!obj.id || !obj.fake || obj.id < 1000000000000000) && (!obj.isItem || obj.active) && dist <= 1500;
    }).sort((obj, obj2) => {
      const d1 = import_utils.default.getDistance(player.x2, player.y2, obj.x, obj.y);
      const d2 = import_utils.default.getDistance(player.x2, player.y2, obj2.x, obj2.y);
      return d1 - d2;
    });
    safeWalk();
    update();
  }
}
function findPlayerByID(id) {
  for (let i = 0;i < players.length; ++i) {
    if (players[i].id == id) {
      return players[i];
    }
  }
  return null;
}
function findPlayerBySID(sid) {
  for (let i = 0;i < players.length; ++i) {
    if (players[i].sid == sid) {
      return players[i];
    }
  }
  return null;
}
function findAIBySID(sid) {
  for (let i = 0;i < ais.length; ++i) {
    if (ais[i].sid == sid) {
      return ais[i];
    }
  }
  return null;
}
function findObjectBySid(sid) {
  for (let i = 0;i < gameObjects.length; ++i) {
    if (gameObjects[i].sid == sid) {
      return gameObjects[i];
    }
  }
  return null;
}
function showPing() {
  let dmg = Number(damage?.toFixed(2));
  let text = !isProxy2 ? `Ping: ${pingTime} ms` : `Proxy: ${io_client_default.ping || 0} ms`;
  document.getElementById("statistics").innerText = `${text}
FPS: ${FPS}
PPS: ${io_client_default.pps.length}
DMG: ${dmg}
Shame: ${player.shameCount}`;
}
var lastPing = -1;
var pingTime = -1;
function pingSocketResponse() {
  pingTime = Date.now() - lastPing;
}
function pingSocket() {
  lastPing = Date.now();
  io_client_default.send("pp");
}
function serverShutdownNotice(countdown) {
  if (countdown < 0)
    return;
  const minutes = Math.floor(countdown / 60);
  let seconds = countdown % 60;
  seconds = `0${seconds}`.slice(-2);
  shutdownDisplay.innerText = `Server restarting in ${minutes}:${seconds}`;
  shutdownDisplay.hidden = false;
}
window.requestAnimFrame = function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
}();
var FPS = 0;
var fpsTween = performance.now();
var frames = 0;
function doUpdate() {
  now = Date.now();
  delta = now - lastUpdate;
  lastUpdate = now;
  frames += 1;
  if (now - fpsTween >= 1000) {
    FPS = frames;
    frames = 0;
    fpsTween = now;
  }
  updateGame();
  requestAnimFrame(doUpdate);
}
function startGame() {
  bindEvents();
  loadIcons();
  loadingText.style.display = "none";
  menuCardHolder.style.display = "block";
  nameInput.value = getSavedVal("moo_name") || "";
  prepareUI();
}
prepareMenuBackground();
doUpdate();
function openLink(link) {
  window.open(link, "_blank");
}
window.openLink = openLink;
window.aJoinReq = aJoinReq;
window.kickFromClan = kickFromClan;
window.sendJoin = sendJoin;
window.leaveAlliance = leaveAlliance;
window.createAlliance = createAlliance;
window.storeBuy = storeBuy;
window.storeEquip = storeEquip;
window.selectSkinColor = selectSkinColor;
window.changeStoreIndex = changeStoreIndex;
window.config = config_default;
