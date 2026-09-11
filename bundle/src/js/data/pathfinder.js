const WorkerCode = `
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

export class ThetaAstar {
    constructor(sz = 1600, res = 7) {
        this.sz = sz;
        this.r = res;
        this.w = Math.ceil((sz * 2) / res) + 1;
        this.mapMin = 0;
        this.mapMax = 14400;
        this.riverTop = 6700;
        this.riverBot = 7700;
        this.me = { x: 0, y: 0, sid: null, xVel: 0, yVel: 0 };
        this.spd = 500/9;
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

    setBld(b) { this.b = b || []; }
    setSpd(s) { this.spd = s || 0; }
    clear() { this.path.length = 0; }

    draw(ctx, me = this.me) {
    if (!this.path.length) return;
    const gridSize = 60;
    if (this.path.length > 0) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        const visitedTiles = new Set();
        for (let i = 0; i < this.path.length - 1; i++) {
            const wp1 = this.path[i];
            const wp2 = this.path[i + 1];
            const dx = wp2.x - wp1.x;
            const dy = wp2.y - wp1.y;
            const distance = Math.hypot(dx, dy);
            const steps = Math.max(Math.ceil(distance / (gridSize / 2)), 1);

            for (let step = 0; step <= steps; step++) {
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
    if (this.path.length < 2) return 0;
    let total = 0;
    for (let i = 1; i < this.path.length; i++) {
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
        if (!this.path) return [];
        const raw = this.path.slice().reverse();
        return this._applyMomentumSpacing(raw, playerVel);
    }

    _applyMomentumSpacing(path, playerVel) {
        if (path.length < 3) return path;
        const speed = playerVel ? Math.hypot(playerVel.x, playerVel.y) : Math.hypot(this.me.xVel, this.me.yVel);
    
        const PHI = 1.61803398875;
        const brakingDist = speed * (PHI * 10);
        const SHARP = Math.cos(Math.PI * 0.55);
        const MEDIUM = Math.cos(Math.PI * 0.35);
        const MIN_SEG = this.r * PHI; 
        const result = [path[0]];
    
        for (let i = 1; i < path.length - 1; i++) {
            const prev = path[i - 1], cur = path[i], next = path[i + 1];
            const inX = cur.x - prev.x, inY = cur.y - prev.y;
            const outX = next.x - cur.x, outY = next.y - cur.y;
            const inLen = Math.hypot(inX, inY), outLen = Math.hypot(outX, outY);
    
            if (inLen < MIN_SEG || outLen < MIN_SEG) {
                result.push(cur);
                continue;
            }
    
            const dot = (inX / inLen) * (outX / outLen) + (inY / inLen) * (outY / outLen);

            if (dot < SHARP && brakingDist > MIN_SEG) {
                const d1 = Math.min(brakingDist * PHI, inLen * 0.618);
                const d2 = Math.min(brakingDist * 0.618, inLen * 0.382);
                result.push({ x: cur.x - (inX / inLen) * d1, y: cur.y - (inY / inLen) * d1 });
                result.push({ x: cur.x - (inX / inLen) * d2, y: cur.y - (inY / inLen) * d2 });
            } else if (dot < MEDIUM && brakingDist > MIN_SEG) {
                const d = Math.min(brakingDist * 0.618, inLen * 0.5);
                result.push({ x: cur.x - (inX / inLen) * d, y: cur.y - (inY / inLen) * d });
            }
    
            result.push(cur);
        }
    
        result.push(path[path.length - 1]);
        return result;
    }

    _mkWorker() {
        const url = "data:application/javascript;base64," + btoa(WorkerCode);
        this.wk = new Worker(url);
        this.wk.onmessage = (e) => this._resolve(new Float32Array(e.data));
        this.wk.onerror = (e) => { throw e; };
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

    _clamp(v) { return Math.max(0, Math.min(this.w - 1, v)); }

    _clampWorld(x, y) {
        return {
            x: Math.max(this.mapMin, Math.min(this.mapMax, x)),
            y: Math.max(this.mapMin, Math.min(this.mapMax, y))
        };
    }

    _waitMsg() { return new Promise((res) => (this._wait = res)); }

    _resolve(data) {
        if (!this._wait) return console.error("Unexpected worker message", this);
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

        if(gridRiverTop < this.w && gridRiverBot > 0) {
            const top = Math.max(0, Math.floor(gridRiverTop));
            const bot = Math.min(this.w, Math.ceil(gridRiverBot));
            const height = bot - top;

            if(height > 0) {
                this._fillRect(0, top, this.w, height, riverCost);

                const isInRiver = !hasWaterproofSkin && this.me.y >= this.riverTop && this.me.y <= this.riverBot;
                if(isInRiver) {
                    const playerGridX = (this.me.x - base.x + this.sz) / this.r;
                    const leftWidth = Math.floor(playerGridX);
                    if(leftWidth > 0) {
                        this._fillRect(0, top, leftWidth, height, 255);
                    }
                }
            }
        }

        let playerCount = 0;
        for (let pl of this.p) {
            if (!pl?.visible || pl.sid === this.me.sid) continue;

            const x = (pl.x2 - base.x + this.sz) / this.r;
            const y = (pl.y2 - base.y + this.sz) / this.r;
            const rad = (pl.scale * 1.5 || 0) / this.r;

            if (x + rad < 0 || x - rad > this.w || y + rad < 0 || y - rad > this.w) continue;

            this._fillCircleFast(x, y, rad, 255);
            playerCount++;
        }

        let objectCount = 0;
        const CHUNK_SIZE = this.r * 50;
        const chunksChecked = new Set();

        for (let py = 0; py < this.w; py += CHUNK_SIZE) {
            for (let px = 0; px < this.w; px += CHUNK_SIZE) {
                const worldX = (px * this.r) - this.sz + base.x;
                const worldY = (py * this.r) - this.sz + base.y;

                if (this.objectManager && this.objectManager.getGridArrays) {
                    const grids = this.objectManager.getGridArrays(worldX, worldY, CHUNK_SIZE * this.r);

                    if (grids && grids.length > 0) {
                        for (let grid of grids) {
                            for (let o of grid) {
                                if (!o?.active) continue;

                                if (chunksChecked.has(o.sid)) continue;
                                chunksChecked.add(o.sid);

                                const x = (o.x - base.x + this.sz) / this.r;
                                const y = (o.y - base.y + this.sz) / this.r;

                                const maxRad = (o.scale + this.minGap + 50) / this.r;
                                if (x + maxRad < 0 || x - maxRad > this.w ||
                                    y + maxRad < 0 || y - maxRad > this.w) {
                                    continue;
                                }

                                let rad = o.type === 1 && o.y >= 12000 ? o.scale * .8 :
                                    o.type === 1 ? o.scale * .7 :
                                    o.type === 0 ? o.scale * .7 : o.scale;

                                let isEnemy = !o.owner || (o.owner?.sid !== this.me.sid && !window.ally?.(o.owner.sid));
                                let hasVelocity = false;
                                let baseVelX = 0, baseVelY = 0;

                                if (o.dmg && isEnemy) {
                                    rad += 25;
                                    hasVelocity = true;
                                } else if(o.id === 15 && !isEnemy) continue;

                                if([22, 16].includes(o.id)) rad += 25;

                                if(o.boostSpeed) {
                                    hasVelocity = true;
                                    const boostVel = (o.boostSpeed * (o.weightM || 1)) * delta;
                                    baseVelX = boostVel * Math.cos(o.dir);
                                    baseVelY = boostVel * Math.sin(o.dir);
                                }

                                let effectiveRad = rad + (this.minGap * 0.5);
                                const gridRad = effectiveRad / this.r;

                                if(hasVelocity) {
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

        const isInRiver = base.y >= (this.config.mapScale / 2) - (this.config.riverWidth / 2) &&
              base.y <= (this.config.mapScale / 2) + (this.config.riverWidth / 2);

        let riverCurrentX = 0;
        if(isInRiver) {
            if(this.me.skinData?.watrImm) {
                riverCurrentX = this.config.waterCurrent * 0.4 * delta;
            } else {
                riverCurrentX = this.config.waterCurrent * delta;
            }
        }

        if(riverCurrentX !== 0 && gridRiverTop < this.w && gridRiverBot > 0) {
            const top = Math.max(0, Math.floor(gridRiverTop));
            const bot = Math.min(this.w, Math.ceil(gridRiverBot));

            for(let py = top; py < bot; py++) {
                for(let px = 0; px < this.w; px++) {
                    const idx = (py * this.w + px) * 2;
                    if(this.velocityGrid[idx] === 0 && this.velocityGrid[idx + 1] === 0) {
                        this.velocityGrid[idx] = riverCurrentX;
                    }
                }
            }
        }

        const elapsed = performance.now() - t0;
        // console.log(`Grid build: ${elapsed.toFixed(2)}ms (${playerCount} players, ${objectCount} objects)`);
    }

    _generateNavmesh(base) {
    const t0 = performance.now();

    const cellSize = Math.max(20, Math.floor(this.w / 30));
    const gridW = Math.ceil(this.w / cellSize);
    const gridH = Math.ceil(this.w / cellSize);

    const walkable = new Uint8Array(gridW * gridH);
    for (let gy = 0; gy < gridH; gy++) {
        for (let gx = 0; gx < gridW; gx++) {
            const cx = Math.min((gx * cellSize) + Math.floor(cellSize/2), this.w - 1);
            const cy = Math.min((gy * cellSize) + Math.floor(cellSize/2), this.w - 1);
            const idx = cy * this.w + cx;
            walkable[gy * gridW + gx] = (this.costGrid[idx] !== 255) ? 1 : 0;
        }
    }

    const visited = new Uint8Array(gridW * gridH);
    const regions = [];

    for (let gy = 0; gy < gridH; gy++) {
        for (let gx = 0; gx < gridW; gx++) {
            const idx = gy * gridW + gx;
            if (visited[idx] || !walkable[idx]) continue;

            const region = this._floodFillRegionFast(gx, gy, gridW, gridH, walkable, visited, cellSize);
            if (region.cells > 4) {
                regions.push(region);
            }
        }
    }

    this.navPolygons = regions;
    this.navGraph = this._buildNavGraphFast(regions);
    this.navCellSize = cellSize;

    // console.log(`Navmesh generated: ${regions.length} regions in ${(performance.now() - t0).toFixed(2)}ms`);
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

        // Check 4 neighbors only
        const neighbors = [
            idx - 1,      // left
            idx + 1,      // right
            idx - gridW,  // up
            idx + gridW   // down
        ];

        for (let ni of neighbors) {
            if (ni < 0 || ni >= walkable.length) continue;
            const nx = ni % gridW;
            const ny = Math.floor(ni / gridW);

            if (Math.abs(nx - x) > 1 || Math.abs(ny - y) > 1) continue;
            if (visited[ni] || !walkable[ni]) continue;

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
    const graph = new Map();
    const maxDist = this.navCellSize * 3;

    for (let i = 0; i < regions.length; i++) {
        const neighbors = [];
        const r1 = regions[i];

        for (let j = i + 1; j < regions.length; j++) {
            const r2 = regions[j];

            const dx = r1.centerX - r2.centerX;
            const dy = r1.centerY - r2.centerY;

            if (Math.abs(dx) > maxDist && Math.abs(dy) > maxDist) continue;

            const touching = !(r1.maxX < r2.minX || r1.minX > r2.maxX ||
                             r1.maxY < r2.minY || r1.minY > r2.maxY);

            if (touching || (dx*dx + dy*dy) < maxDist*maxDist) {
                if (!graph.has(i)) graph.set(i, []);
                if (!graph.has(j)) graph.set(j, []);
                graph.get(i).push(j);
                graph.get(j).push(i);
            }
        }
    }

    return graph;
}

_findContainingPolygon(x, y) {
    for (let i = 0; i < this.navPolygons.length; i++) {
        const poly = this.navPolygons[i];
        if (x >= poly.minX && x <= poly.maxX &&
            y >= poly.minY && y <= poly.maxY) {
            return i;
        }
    }
    return -1;
}

_findPolygonPath(startPoly, endPoly) {
    if (startPoly === -1 || endPoly === -1) return null;
    if (startPoly === endPoly) return [startPoly];

    const open = [startPoly];
    const gScore = new Map([[startPoly, 0]]);
    const fScore = new Map([[startPoly, this._polyDist(startPoly, endPoly)]]);
    const cameFrom = new Map();

    while (open.length > 0) {
        let current = open[0];
        let minF = fScore.get(current);
        for (let i = 1; i < open.length; i++) {
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
    const b = this.navPolygons[polyB];
    const dx = a.centerX - b.centerX;
    const dy = a.centerY - b.centerY;
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

        for (let y = minY; y <= maxY; y++) {
            const rowStart = y * this.w;
            for (let x = minX; x <= maxX; x++) {
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

        for (let py = startY; py < endY; py++) {
            const rowStart = py * this.w;
            for (let px = startX; px < endX; px++) {
                this.costGrid[rowStart + px] = cost;
            }
        }
    }

    _fillCircleFast(cx, cy, radius, cost) {
        const minY = Math.max(0, Math.floor(cy - radius));
        const maxY = Math.min(this.w - 1, Math.ceil(cy + radius));
        const radSq = radius * radius;

        for (let py = minY; py <= maxY; py++) {
            const dy = py - cy;
            const dySq = dy * dy;

            if (dySq > radSq) continue;

            const dx = Math.sqrt(radSq - dySq);
            const minX = Math.max(0, Math.floor(cx - dx));
            const maxX = Math.min(this.w - 1, Math.ceil(cx + dx));

            const rowStart = py * this.w;
            for (let px = minX; px <= maxX; px++) {
                this.costGrid[rowStart + px] = cost;
            }
        }
    }

    _fillCircleWithVelocity(cx, cy, radius, cost, obj, baseVelX, baseVelY, isEnemy, delta) {
        const minY = Math.max(0, Math.floor(cy - radius));
        const maxY = Math.min(this.w - 1, Math.ceil(cy + radius));
        const radSq = radius * radius;
        const knockbackSpeed = obj.dmg && isEnemy ? 1.5 * (obj.weightM || 1) * delta : 0;

        for (let py = minY; py <= maxY; py++) {
            const dy = py - cy;
            const dySq = dy * dy;

            if (dySq > radSq) continue;

            const dx = Math.sqrt(radSq - dySq);
            const minX = Math.max(0, Math.floor(cx - dx));
            const maxX = Math.min(this.w - 1, Math.ceil(cx + dx));

            const rowStart = py * this.w;
            for (let px = minX; px <= maxX; px++) {
                this.costGrid[rowStart + px] = cost;

                const idx = (rowStart + px) * 2;

                if(obj.boostSpeed) {
                    this.velocityGrid[idx] = baseVelX;
                    this.velocityGrid[idx + 1] = baseVelY;
                } else if(knockbackSpeed > 0) {
                    const dirX = px - cx;
                    const dirY = py - cy;
                    const dirLen = Math.hypot(dirX, dirY);
                    if(dirLen > 0.01) {
                        this.velocityGrid[idx] = knockbackSpeed * (dirX / dirLen);
                        this.velocityGrid[idx + 1] = knockbackSpeed * (dirY / dirLen);
                    }
                }
            }
        }
    }

    async _calc(goals, append) {
        if (this._wait) return;

        this.g = goals.map(({ x, y }) => this._clampWorld(x, y));
        const base = append && this.path[0] ? this.path[0] : { x: this.me.x, y: this.me.y };
        const toGrid = ({ x, y }) => ({
            x: this._clamp((x - base.x + this.sz) / this.r),
            y: this._clamp((y - base.y + this.sz) / this.r),
        });

        const G = this.g.map(toGrid);

        const baseMoved = !this.lastBase || Math.hypot(base.x - this.lastBase.x, base.y - this.lastBase.y) > (this.r * 5);
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

const startPoly = this._findContainingPolygon(this.w/2, this.w/2);
const goalPolys = G.map(g => this._findContainingPolygon(g.x, g.y));

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
        for (let i = 0; i < this.costGrid.length; i++) {
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

        if (!append) { this.path.length = 0; }

        const numPoints = data.length / 2;
        for (let i = 0; i < numPoints; i++) {
            const gridX = data[i * 2], gridY = data[i * 2 + 1];
            const worldX = (gridX * this.r) - this.sz + base.x;
            const worldY = (gridY * this.r) - this.sz + base.y;

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

        if(gridRiverTop < this.w && gridRiverBot > 0) {
            const top = Math.max(0, Math.floor(gridRiverTop));
            const bot = Math.min(this.w, Math.ceil(gridRiverBot));
            const height = bot - top;

            if(height > 0) {
                this._fillRect(0, top, this.w, height, riverCost);

                const isInRiver = !hasWaterproofSkin && this.me.y >= this.riverTop && this.me.y <= this.riverBot;
                if(isInRiver) {
                    const playerGridX = (this.me.x - base.x + this.sz) / this.r;
                    const leftWidth = Math.floor(playerGridX);
                    if(leftWidth > 0) {
                        this._fillRect(0, top, leftWidth, height, 255);
                    }
                }
            }
        }

        for (let pl of this.p) {
            if (!pl?.visible || pl.sid === this.me.sid) continue;

            const x = (pl.x2 - base.x + this.sz) / this.r;
            const y = (pl.y2 - base.y + this.sz) / this.r;
            const rad = (pl.scale * 1.5 || 0) / this.r;

            if (x + rad < 0 || x - rad > this.w || y + rad < 0 || y - rad > this.w) continue;

            this._fillCircleFast(x, y, rad, 255);
        }

        for (let o of this.b) {
            if (!o?.active) continue;

            const x = (o.x - base.x + this.sz) / this.r;
            const y = (o.y - base.y + this.sz) / this.r;

            const maxRad = (o.scale + this.minGap + 50) / this.r;
            if (x + maxRad < 0 || x - maxRad > this.w ||
                y + maxRad < 0 || y - maxRad > this.w) {
                continue;
            }

            let rad = o.type === 1 && o.y >= 12000 ? o.scale * .8 :
                o.type === 1 ? o.scale * .7 :
                o.type === 0 ? o.scale * .7 : o.scale;

            let isEnemy = !o.owner || (o.owner?.sid !== this.me.sid && !window.ally?.(o.owner.sid));
            let hasVelocity = false;
            let baseVelX = 0, baseVelY = 0;

            if (o.dmg && isEnemy) {
                rad += 25;
                hasVelocity = true;
            } else if(o.id === 15 && !isEnemy) continue;

            if([22, 16].includes(o.id)) rad += 25;

            if(o.boostSpeed) {
                hasVelocity = true;
                const boostVel = (o.boostSpeed * (o.weightM || 1)) * delta;
                baseVelX = boostVel * Math.cos(o.dir);
                baseVelY = boostVel * Math.sin(o.dir);
            }

            let effectiveRad = rad + (this.minGap * 0.5);
            const gridRad = effectiveRad / this.r;

            if(hasVelocity) {
                this._fillCircleWithVelocity(x, y, gridRad, 255, o, baseVelX, baseVelY, isEnemy, delta);
            } else {
                this._fillCircleFast(x, y, gridRad, 255);
            }
        }

        const isInRiver = base.y >= (this.config.mapScale / 2) - (this.config.riverWidth / 2) &&
              base.y <= (this.config.mapScale / 2) + (this.config.riverWidth / 2);

        let riverCurrentX = 0;
        if(isInRiver) {
            if(this.me.skinData?.watrImm) {
                riverCurrentX = this.config.waterCurrent * 0.4 * delta;
            } else {
                riverCurrentX = this.config.waterCurrent * delta;
            }
        }

        if(riverCurrentX !== 0 && gridRiverTop < this.w && gridRiverBot > 0) {
            const top = Math.max(0, Math.floor(gridRiverTop));
            const bot = Math.min(this.w, Math.ceil(gridRiverBot));

            for(let py = top; py < bot; py++) {
                for(let px = 0; px < this.w; px++) {
                    const idx = (py * this.w + px) * 2;
                    if(this.velocityGrid[idx] === 0 && this.velocityGrid[idx + 1] === 0) {
                        this.velocityGrid[idx] = riverCurrentX;
                    }
                }
            }
        }
    }

    destroy() {
        try { this.wk?.terminate(); } catch {}
        this.wk = null;
    }
}