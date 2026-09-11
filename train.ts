import * as fs from "fs";
const { Architect, Trainer } = require("synaptic");

const DATA_DIR = "./data";
const MODEL_PATH = "./model.json";

function clamp(v: number, min: number, max: number) {
  return Math.max(0, Math.min(1, (v - min) / (max - min)));
}

interface Frame {
  me: { x: number; y: number; weapon: number; kills: number };
  enemy: { x: number; y: number; weapon: number; trail?: { x: number; y: number }[] };
  dist: number;
  myTrapped: boolean;
  enemyTrapped: boolean;
  outcome: "win" | "loss" | null;
  objects?: { x: number; y: number; scale: number; dmg: number; isEnemy?: boolean }[];
}

function frameToInput(f: Frame): number[] {
  const trail = f.enemy.trail ?? [];
  let evx = 0, evy = 0;
  if (trail.length >= 2) {
    evx = trail[trail.length - 1].x - trail[trail.length - 2].x;
    evy = trail[trail.length - 1].y - trail[trail.length - 2].y;
  }

  let nearbyDmgObjects = 0;
  for (const o of f.objects ?? []) {
    if (o.dmg > 0 && o.isEnemy) {
      const d = Math.hypot(f.me.x - o.x, f.me.y - o.y);
      if (d < o.scale + 80) nearbyDmgObjects++;
    }
  }

  return [
    clamp(f.me.x - f.enemy.x, -1000, 1000),
    clamp(f.me.y - f.enemy.y, -1000, 1000),
    clamp(f.dist, 0, 1500),
    clamp(evx, -200, 200),
    clamp(evy, -200, 200),
    clamp(f.me.weapon, 0, 10),
    clamp(f.enemy.weapon, 0, 10),
    clamp(f.me.kills, 0, 20),
    f.myTrapped ? 1 : 0,
    f.enemyTrapped ? 1 : 0,
    clamp(nearbyDmgObjects, 0, 5),
  ];
}

function loadTrainingData(): { input: number[]; output: number[] }[] {
  const result: { input: number[]; output: number[] }[] = [];
  if (!fs.existsSync(DATA_DIR)) return result;

  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".ndjson"));
  console.log(`found ${files.length} data files`);

  for (const file of files) {
    const lines = fs.readFileSync(`${DATA_DIR}/${file}`, "utf8").split("\n");
    const frames: Frame[] = [];

    for (const line of lines) {
      if (!line.trim()) continue;
      try { frames.push(JSON.parse(line)); } catch {}
    }

    for (let i = 0; i < frames.length - 1; i++) {
      const cur = frames[i];
      const next = frames[i + 1];

      if (!cur.me || !cur.enemy || !next.me) continue;
      if (cur.outcome === null) continue;

      const dx = next.me.x - cur.me.x;
      const dy = next.me.y - cur.me.y;
      if (Math.hypot(dx, dy) < 5) continue;

      result.push({
        input: frameToInput(cur),
        output: [
          clamp(dx, -300, 300),
          clamp(dy, -300, 300),
          cur.outcome === "win" ? 1 : 0,
        ],
      });
    }
  }

  return result;
}

console.time("load data");
const data = loadTrainingData();
console.timeEnd("load data");
console.log(`total samples: ${data.length}`);

if (data.length < 20) {
  console.error("not enough training data");
  process.exit(1);
}

const net = new Architect.Perceptron(11, 24, 12, 3);
const trainer = new Trainer(net);

console.time("training");
const result = trainer.train(data, { iterations: 500, error: 0.04, log: 50 });
console.timeEnd("training");
console.log("result:", result);

fs.writeFileSync(MODEL_PATH, JSON.stringify(net.toJSON()));
console.log(`model saved to ${MODEL_PATH}`);