import * as fs from "fs";
const { Network } = require("synaptic");

const MODEL_PATH = "./model.json";

let net: any = null;

function clamp(v: number, min: number, max: number) {
  return Math.max(0, Math.min(1, (v - min) / (max - min)));
}

interface GameState {
  me: { x: number; y: number; weapon: number; kills: number };
  enemy: { x: number; y: number; weapon: number; trail?: { x: number; y: number }[] };
  dist: number;
  myTrapped: boolean;
  enemyTrapped: boolean;
  objects?: { x: number; y: number; scale: number; dmg: number; isEnemy?: boolean }[];
}

function stateToInput(s: GameState): number[] {
  const trail = s.enemy.trail ?? [];
  let evx = 0, evy = 0;
  if (trail.length >= 2) {
    evx = trail[trail.length - 1].x - trail[trail.length - 2].x;
    evy = trail[trail.length - 1].y - trail[trail.length - 2].y;
  }

  let nearbyDmgObjects = 0;
  for (const o of s.objects ?? []) {
    if (o.dmg > 0 && o.isEnemy) {
      const d = Math.hypot(s.me.x - o.x, s.me.y - o.y);
      if (d < o.scale + 80) nearbyDmgObjects++;
    }
  }

  return [
    clamp(s.me.x - s.enemy.x, -1000, 1000),
    clamp(s.me.y - s.enemy.y, -1000, 1000),
    clamp(s.dist, 0, 1500),
    clamp(evx, -200, 200),
    clamp(evy, -200, 200),
    clamp(s.me.weapon, 0, 10),
    clamp(s.enemy.weapon, 0, 10),
    clamp(s.me.kills, 0, 20),
    s.myTrapped ? 1 : 0,
    s.enemyTrapped ? 1 : 0,
    clamp(nearbyDmgObjects, 0, 5),
  ];
}

function heuristic(state: GameState): { x: number; y: number } {
  const { me, enemy, objects: objs = [] } = state;
  const dx = me.x - enemy.x;
  const dy = me.y - enemy.y;
  const dist = Math.hypot(dx, dy) || 1;

  let tx = me.x;
  let ty = me.y;

  if (dist < 150) {
    tx += (dx / dist) * 200;
    ty += (dy / dist) * 200;
  } else if (dist > 500) {
    tx -= (dx / dist) * 200;
    ty -= (dy / dist) * 200;
  } else {
    tx -= (dx / dist) * 80;
    ty -= (dy / dist) * 80;
  }

  for (const o of objs) {
    if (o.dmg > 0 && o.isEnemy) {
      const od = Math.hypot(me.x - o.x, me.y - o.y);
      if (od < o.scale + 80) {
        tx += (me.x - o.x) / od * 150;
        ty += (me.y - o.y) / od * 150;
      }
    }
  }

  return { x: Math.round(tx), y: Math.round(ty) };
}

function loadModel() {
  if (net) return;

  if (!fs.existsSync(MODEL_PATH)) {
    console.log("[ai] no model found, using heuristics");
    return;
  }

  net = Network.fromJSON(JSON.parse(fs.readFileSync(MODEL_PATH, "utf8")));
  console.log("[ai] model loaded");
}

export function getTargetPosition(state: GameState): { x: number; y: number } {
  loadModel();

  if (!net) return heuristic(state);

  const out = net.activate(stateToInput(state)) as number[];

  const rawDx = (out[0] - 0.5) * 600;
  const rawDy = (out[1] - 0.5) * 600;
  const confidence = out[2];

  if (confidence < 0.45) return heuristic(state);

  return {
    x: Math.round(state.me.x + rawDx),
    y: Math.round(state.me.y + rawDy),
  };
}