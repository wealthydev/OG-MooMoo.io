async function generator() {
    let e = await fetch("https://api.moomoo.io/verify"),
        t = await e.json(),
        n = navigator.hardwareConcurrency || 8,
        a = Math.ceil(t.maxnumber / n),
        r = `self.onmessage=async function(e){let{salt:t,challenge:n,start:s,end:o}=e.data,l=new TextEncoder,r=l.encode(t),a=new Uint8Array(32);for(let g=0;g<32;g++)a[g]=parseInt(n.substr(2*g,2),16);for(let f=s;f<=o;f++){let d=new Uint8Array(r.length+f.toString().length);d.set(r),d.set(l.encode(f.toString()),r.length);let i=new Uint8Array(await crypto.subtle.digest("SHA-256",d)),u=!0;for(let c=0;c<32;c++)if(i[c]!==a[c]){u=!1;break}if(u){self.postMessage({found:!0,number:f});return}}self.postMessage({found:!1,completed:!0})};`,
        s = new Blob([r], { type: "application/javascript" }),
        o = URL.createObjectURL(s);
    return new Promise((e, r) => {
        let s = [],
            c = 0,
            l = !1,
            i = setTimeout(() => {
                l || (s.forEach((e) => e.terminate()), URL.revokeObjectURL(o), r(Error("Timeout")));
            }, 3e4);
        for (let m = 0; m < n; m++) {
            let u = new Worker(o),
                g = m * a,
                d = Math.min((m + 1) * a - 1, t.maxnumber);
            (u.onmessage = (a) => {
                a.data.found && !l
                    ? ((l = !0), clearTimeout(i), s.forEach((e) => e.terminate()), URL.revokeObjectURL(o), e(btoa(JSON.stringify({ algorithm: t.algorithm, challenge: t.challenge, number: a.data.number, salt: t.salt, signature: t.signature }))))
                    : a.data.completed && ++c === n && !l && ((l = !0), clearTimeout(i), s.forEach((e) => e.terminate()), URL.revokeObjectURL(o), e(null));
            }),
                (u.onerror = (e) => {
                    l || ((l = !0), clearTimeout(i), s.forEach((e) => e.terminate()), URL.revokeObjectURL(o), r(e));
                }),
                u.postMessage({ salt: t.salt, challenge: t.challenge, start: g, end: d }),
                s.push(u);
        }
    });
}

async function generatorForChallenge(challenge) {
    let n = navigator.hardwareConcurrency || 8,
        a = Math.ceil(challenge.maxnumber / n), r = `
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
};`, s = new Blob([r], { type: "application/javascript" }),
        o = URL.createObjectURL(s);
    return new Promise((e, r) => {
        let s = [],
            c = 0,
            l = !1,
            i = setTimeout(() => {
                l || (s.forEach((e) => e.terminate()), URL.revokeObjectURL(o), r(Error("Timeout")));
            }, 3e4);
        for (let m = 0; m < n; m++) {
            let u = new Worker(o),
                g = m * a,
                d = Math.min((m + 1) * a - 1, challenge.maxnumber);
            (u.onmessage = (a) => {
                a.data.found && !l
                    ? ((l = !0), clearTimeout(i), s.forEach((e) => e.terminate()), URL.revokeObjectURL(o), e(btoa(JSON.stringify({ algorithm: challenge.algorithm, challenge: challenge.challenge, number: a.data.number, salt: challenge.salt, signature: challenge.signature }))))
                    : a.data.completed && ++c === n && !l && ((l = !0), clearTimeout(i), s.forEach((e) => e.terminate()), URL.revokeObjectURL(o), e(null));
            }),
                (u.onerror = (e) => {
                    l || ((l = !0), clearTimeout(i), s.forEach((e) => e.terminate()), URL.revokeObjectURL(o), r(e));
                }),
                u.postMessage({ salt: challenge.salt, challenge: challenge.challenge, start: g, end: d }),
                s.push(u);
        }
    });
}

let adapter, device, shaderModule, bindGroupLayout, pipeline;
let gpuAvailable = null;

async function initGPU() {
    if (gpuAvailable !== null) return gpuAvailable;
    try {
        if (!navigator.gpu) { gpuAvailable = false; return false; }
        adapter = await navigator.gpu.requestAdapter({ powerPreference: "high-performance" });
        if (!adapter) { gpuAvailable = false; return false; }
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
                { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
                { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
                { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
                { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } }
            ]
        });
        pipeline = device.createComputePipeline({
            layout: device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] }),
            compute: { module: shaderModule, entryPoint: 'main' }
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

    for (let index = 0; index < challenges.length; index++) {
        const challenge = challenges[index];
        const encoder = new TextEncoder();
        const saltBytes = encoder.encode(challenge.salt);
        const saltSize = Math.max(Math.ceil(saltBytes.length / 4) * 4, 4);
        const saltU32 = new Uint32Array(saltSize / 4);
        for (let i = 0; i < saltBytes.length; i++) {
            const wordIdx = Math.floor(i / 4);
            const byteInWord = i % 4;
            saltU32[wordIdx] |= saltBytes[i] << ((3 - byteInWord) * 8);
        }
        const targetHash = new Uint32Array(8);
        for (let i = 0; i < 8; i++) {
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
    return Promise.all(challenges.map(challenge => generatorForChallenge(challenge)));
}

async function get_tokens(amount) {
    console.log(`getting ${amount} token${amount > 1 ? "s" : ""}`);

    const fetchPromises = [];
    for (let i = 0; i < amount; i++) {
        fetchPromises.push(fetch("https://api.moomoo.io/verify", { keepalive: true }).then(r => r.json()));
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
            const failed = tokens.some(t => t === null);
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