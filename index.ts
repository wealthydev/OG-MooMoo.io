import * as dotenv from "dotenv";
import * as fs from "fs";
import OpenAI from "openai";
import { Ollama } from "ollama";
import { getTargetPosition } from "./ai";

dotenv.config();

const gpus = ["ANGLE (NVIDIA, NVIDIA GeForce RTX 5060 Ti (0x00002D04) Direct3D11 vs_5_0 ps_5_0, D3D11)"];

function isAdmin(gpu: string) {
    console.log("chat msg from", gpu, gpus.includes(gpu));
    return gpus.includes(gpu);
}

if (!process.env.GROQ_API_KEY) {
    console.error("Missing GROQ_API_KEY environment variable");
    process.exit(1);
}
if (!process.env.YOUTUBE_KEY) {
    console.error("Missing YOUTUBE_KEY environment variable");
    process.exit(1);
}

const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

const ollama = new Ollama({
    host: "https://ollama.com",
    headers: {
        Authorization: "Bearer " + process.env.OLLAMA_API_KEY,
    },
});

const ytKeys = [
    process.env.YOUTUBE_KEY,
    process.env.YOUTUBE_KEY_2
].filter(Boolean) as string[];

let currentKey = 0;

async function initYouTubeKey() {
    for (let i = 0; i < ytKeys.length; i++) {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&type=video&maxResults=1&key=${ytKeys[i]}`);
        const data = await res.json();
        const isQuotaError = data.error?.errors?.some((e: any) =>
            e.reason === "quotaExceeded" || e.reason === "dailyLimitExceeded"
        );
        if (!isQuotaError) {
            currentKey = i;
            return;
        }
    }
}

initYouTubeKey();

async function searchYouTube(query: string) {
    const searchQuery = `${query} official`;
    for (let attempt = 0; attempt < ytKeys.length; attempt++) {
        const keyIndex = (currentKey + attempt) % ytKeys.length;
        const key = ytKeys[keyIndex];
        const searchRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&videoCategoryId=10&maxResults=10&key=${key}`);
        const searchData = await searchRes.json();

        const isQuotaError = searchData.error?.errors?.some((e: any) =>
            e.reason === "quotaExceeded" || e.reason === "dailyLimitExceeded"
        );
        if (isQuotaError) continue;

        if (!searchData.items || searchData.items.length === 0) return null;

        currentKey = keyIndex;

        const blacklist = /cover|remix|reaction|tutorial|karaoke|tribute|parody|live at|instrumental/i;
        const filtered = searchData.items.filter((v: any) => !blacklist.test(v.snippet.title));
        const video = (filtered.length > 0 ? filtered : searchData.items)[0];
        const detailsRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${video.id.videoId}&key=${key}`);
        const detailsData = await detailsRes.json();
        let durationMs = 0;
        if (detailsData.items?.[0]) {
            const iso = detailsData.items[0].contentDetails.duration;
            const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
            durationMs = (
                (parseInt(match[1] || 0) * 3600) +
                (parseInt(match[2] || 0) * 60) +
                parseInt(match[3] || 0)
            ) * 1000;
        }
        return {
            videoId: video.id.videoId,
            title: video.snippet.title,
            artist: video.snippet.channelTitle,
            durationMs
        };
    }
    return null;
}

async function fetchLyrics(title: string, artist: string) {
    try {
        const cleanTitle = title.replace(/\(.*?\)|\[.*?\]/g, "").replace(/official|video|audio|lyrics|hd|hq/gi, "").trim();
        let results: any[] = [];
        const r1 = await fetch(`https://lrclib.net/api/search?artist_name=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(cleanTitle)}`);
        const d1 = await r1.json();
        if (d1?.length) results.push(...d1);
        if (!results.length) {
            const r2 = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(cleanTitle)}`);
            const d2 = await r2.json();
            if (d2?.length) results.push(...d2);
        }
        if (!results.length) return null;
        const best = results[0];
        if (!best.syncedLyrics) return null;
        const lines = best.syncedLyrics
            .split("\n")
            .map((line: string) => {
                const m = line.match(/^\[(\d+):(\d+\.\d+)\]\s*(.*)/);
                if (!m) return null;
                return {
                    time: (parseInt(m[1]) * 60 + parseFloat(m[2])) * 1000,
                    text: m[3]
                };
            })
            .filter(Boolean);
        return { synced: true, lines };
    } catch {
        return null;
    }
}

const MAX_HISTORY = 100;
const chatHistory: { name: string; text: string; ts: number; isAdmin: boolean }[] = [];

const activeMods = new Map<string, number>();
const mods = new Set<string>();
const inbox = new Map<string, any[]>();

const OFFLINE_AFTER = 30000;

setInterval(() => {
    const now = Date.now();
    for (const [name, last] of activeMods.entries()) {
        if (now - last > OFFLINE_AFTER) activeMods.delete(name);
    }
}, 5000);

setInterval(async () => {
    try {
        await fetch("https://blismacorpaichatbot.onrender.com/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "ping" })
        });
    } catch { }
}, 30000);

function json(data: any, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
}

async function handleRequest(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const method = req.method;

    if (method === "OPTIONS") {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        });
    }

    if (method === "GET" && url.pathname === "/ollama") {
        const msg = url.searchParams.get("msg");
        if (!msg) return json({ error: "Missing msg query param" }, 400);
        try {
            const response = await ollama.chat({
                model: "gpt-oss:120b",
                messages: [
                    {
                        role: "system",
                        content: `You are playing moomoo.io. Players will say things to you in the game chat. Reply to them naturally as a player would — casual, short. IMPORTANT: Your reply must NEVER exceed 30 characters. No exceptions.`
                    },
                    { role: "user", content: msg }
                ],
            });
            const reply = response.message.content.trim().slice(0, 30);
            return json({ reply });
        } catch (e) {
            console.error("[ollama] error:", e);
            return json({ error: "Ollama failed" }, 500);
        }
    }

    if (method === "GET" && url.pathname === "/chat-history") {
        return json({ messages: chatHistory });
    }

    if (method === "POST" && url.pathname === "/chat-send") {
        const body = await req.json();
        const { name, text, gpu } = body;
        if (!name || !text) return json({ ok: false });
        const msg = { name, text: text.slice(0, 120), ts: Date.now(), isAdmin: isAdmin(gpu) };
        chatHistory.push(msg);
        if (chatHistory.length > MAX_HISTORY) chatHistory.shift();
        return json({ ok: true });
    }

    if (url.pathname === "/pm-register") {
        const name = method === "GET"
            ? url.searchParams.get("name")
            : (await req.json()).name;
        if (!name) return json({ ok: false });
        mods.add(name);
        activeMods.set(name, Date.now());
        if (!inbox.has(name)) inbox.set(name, []);
        return json({ ok: true });
    }

    if (method === "GET" && url.pathname === "/pm-users") {
        return json({ users: [...activeMods.keys()] });
    }

    if (method === "POST" && url.pathname === "/pm") {
        const body = await req.json();
        const { from, to, text } = body;
        if (!from || !to || !text) return json({ ok: false });
        const targets = to === "@all"
            ? [...activeMods.keys()].filter(m => m !== from)
            : [to].filter(m => activeMods.has(m));
        targets.forEach(t => {
            if (!inbox.has(t)) inbox.set(t, []);
            inbox.get(t)!.push({ from, text });
        });
        return json({ ok: true });
    }

    if (method === "GET" && url.pathname === "/pm-fetch") {
        const name = url.searchParams.get("name");
        if (!name) return json({ messages: [] });
        activeMods.set(name, Date.now());
        const msgs = inbox.get(name) || [];
        inbox.set(name, []);
        return json({ messages: msgs });
    }

    if (method === "POST" && url.pathname === "/send") {
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "";
        if (!isAdmin(ip)) return json({ ok: false }, 403);
        const body = await req.json();
        const { to, text } = body;
        if (!to || !text) return json({ ok: false });
        const targets = to === "@all"
            ? [...activeMods.keys()]
            : [to].filter(m => activeMods.has(m));
        targets.forEach(t => {
            if (!inbox.has(t)) inbox.set(t, []);
            inbox.get(t)!.push(`ADMIN:${text}`);
        });
        return json({ ok: true });
    }

    if (method === "POST" && url.pathname === "/chat") {
        try {
            const body = await req.json();
            const userMessage = body.message;
            if (!userMessage) return json({ error: "No message" }, 400);

            if (userMessage.toLowerCase().startsWith("/play ")) {
                const song = userMessage.slice(6).trim();
                const video = await searchYouTube(song);
                if (!video) return json({ content: "Not found" });
                const lyrics = await fetchLyrics(video.title, video.artist);
                return json({
                    type: "play",
                    videoId: video.videoId,
                    title: video.title,
                    artist: video.artist,
                    lyrics,
                    content: `Now playing ${video.title}`
                });
            }

            const completion = await groq.chat.completions.create({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "system", content: "Max 60 chars. MooMoo.io text, prompts are received by users dedicated to us." },
                    { role: "user", content: userMessage }
                ]
            });

            return json({
                type: "chat",
                content: completion.choices[0].message.content
            });
        } catch {
            return json({ error: "AI failed" }, 500);
        }
    }

    if (method === "POST" && url.pathname === "/log") {
        try {
            const body = await req.json();
            const lines = body.batch.map((entry: any) => JSON.stringify(entry)).join("\n") + "\n";
            fs.appendFileSync("./data/text.ndjson", lines);
            return new Response(null, { status: 204 });
        } catch {
            return new Response("Bad Request", { status: 400 });
        }
    }

    if (method === "POST" && url.pathname === "/ai") {
        try {
            const state = await req.json();
            const target = getTargetPosition(state);
            return json(target);
        } catch (e) {
            console.error("[ai] error:", e);
            return new Response("Bad Request", { status: 400 });
        }
    }

    const baseDir = "./public";
    let filePath = baseDir + (url.pathname === "/" ? "/index.html" : url.pathname);

    if (url.pathname.startsWith("/sandbox")) {
        const subPath = url.pathname.slice(8);
        filePath = baseDir + (subPath === "" || subPath === "/" ? "/index.html" : subPath);
    }

    try {
        let file = Bun.file(filePath);
        if (!(await file.exists())) file = Bun.file(filePath + ".html");
        if (await file.exists()) return new Response(file);
        return new Response("Not Found", { status: 404 });
    } catch {
        return new Response("Internal Error", { status: 500 });
    }
}

fs.mkdirSync("./data", { recursive: true });

function logDataSize() {
    try {
        const files = fs.readdirSync("./data");
        let total = 0;
        for (const f of files) total += fs.statSync(`./data/${f}`).size;
        if (total < 1024) console.log(`Data folder: ${total} B`);
        else if (total < 1024 ** 2) console.log(`Data folder: ${(total / 1024).toFixed(2)} KB`);
        else if (total < 1024 ** 3) console.log(`Data folder: ${(total / 1024 ** 2).toFixed(2)} MB`);
        else console.log(`Data folder: ${(total / 1024 ** 3).toFixed(2)} GB`);
    } catch {
        console.log("Data folder: empty or unreadable");
    }
}

logDataSize();

Bun.serve({
    port: 3030,
    fetch: handleRequest
});

(async () => {
const response = await ollama.chat({
    model: "gpt-oss:120b",
    messages: [
        {
            role: "system",
            content: `You are playing moomoo.io. Players will say things to you in the game chat. Reply to them naturally as a player would — casual, short. IMPORTANT: Your reply must NEVER exceed 30 characters. No exceptions.`
        },
        { role: "user", content: "Hello how are you" }
    ],
});
const reply = response.message.content.trim().slice(0, 30);
return console.log(reply);
})();
console.log(`Server running: http://localhost:3030/sandbox`);