const mathFloor = Math.floor;
const mathABS = Math.abs;
const mathCOS = Math.cos;
const mathSIN = Math.sin;
const mathSQRT = Math.sqrt;

module.exports = function (GameObject, gameObjects, UTILS, config, players, server) {
    this.objects = gameObjects;
    this.grids = {};
    this.updateObjects = [];
    this.hitObj = [];

    const tmpS = config.mapScale / config.colGrid;
    const mapScale = config.mapScale;
    const riverMin = (mapScale >> 1) - (config.riverWidth >> 1);
    const riverMax = (mapScale >> 1) + (config.riverWidth >> 1);

    this.setObjectGrids = function (obj) {
        const objX = Math.min(mapScale, Math.max(0, obj.x));
        const objY = Math.min(mapScale, Math.max(0, obj.y));
        const scale = obj.scale;
        const minX = Math.max(0, mathFloor((objX - scale) / tmpS));
        const maxX = Math.min(config.colGrid - 1, mathFloor((objX + scale) / tmpS));
        const minY = Math.max(0, mathFloor((objY - scale) / tmpS));
        const maxY = Math.min(config.colGrid - 1, mathFloor((objY + scale) / tmpS));

        for (let x = minX; x <= maxX; ++x) {
            for (let y = minY; y <= maxY; ++y) {
                const key = x + "_" + y;
                (this.grids[key] || (this.grids[key] = [])).push(obj);
                obj.gridLocations.push(key);
            }
        }
    };

    this.removeObjGrid = function (obj) {
        const gridLocs = obj.gridLocations;
        for (let i = 0, len = gridLocs.length; i < len; ++i) {
            const grid = this.grids[gridLocs[i]];
            const idx = grid.indexOf(obj);
            if (idx >= 0) grid.splice(idx, 1);
        }
    };

    this.disableObj = function (obj) {
        obj.active = false;

        if (obj.owner && obj.pps) obj.owner.pps -= obj.pps;
        this.removeObjGrid(obj);
        const idx = this.updateObjects.indexOf(obj);
        if (idx >= 0) this.updateObjects.splice(idx, 1);
    };

    const tmpArray = [];
    this.getGridArrays = function (xPos, yPos, s) {
        const tmpX = mathFloor(xPos / tmpS);
        const tmpY = mathFloor(yPos / tmpS);
        tmpArray.length = 0;

        const grids = this.grids;
        let grid;

        if (grid = grids[tmpX + "_" + tmpY]) tmpArray.push(grid);

        const rightEdge = xPos + s >= (tmpX + 1) * tmpS;
        const leftEdge = tmpX && xPos - s <= tmpX * tmpS;
        const bottomEdge = yPos + s >= (tmpY + 1) * tmpS;
        const topEdge = tmpY && yPos - s <= tmpY * tmpS;

        if (rightEdge) {
            if (grid = grids[(tmpX + 1) + "_" + tmpY]) tmpArray.push(grid);
            if (topEdge) {
                if (grid = grids[(tmpX + 1) + "_" + (tmpY - 1)]) tmpArray.push(grid);
            } else if (bottomEdge) {
                if (grid = grids[(tmpX + 1) + "_" + (tmpY + 1)]) tmpArray.push(grid);
            }
        }
        if (leftEdge) {
            if (grid = grids[(tmpX - 1) + "_" + tmpY]) tmpArray.push(grid);
            if (topEdge) {
                if (grid = grids[(tmpX - 1) + "_" + (tmpY - 1)]) tmpArray.push(grid);
            } else if (bottomEdge) {
                if (grid = grids[(tmpX - 1) + "_" + (tmpY + 1)]) tmpArray.push(grid);
            }
        }
        if (bottomEdge && (grid = grids[tmpX + "_" + (tmpY + 1)])) tmpArray.push(grid);
        if (topEdge && (grid = grids[tmpX + "_" + (tmpY - 1)])) tmpArray.push(grid);

        return tmpArray;
    };

    this.add = function (sid, x, y, dir, s, type, data, setSID, owner, fake) {
        let tmpObj = null;
        for (let i = 0, len = gameObjects.length; i < len; ++i) {
            if (gameObjects[i].sid == sid) {
                tmpObj = gameObjects[i];
                break;
            }
        }
        if (!tmpObj) {
            for (let i = 0, len = gameObjects.length; i < len; ++i) {
                if (!gameObjects[i].active) {
                    tmpObj = gameObjects[i];
                    break;
                }
            }
        }
        if (!tmpObj) {
            tmpObj = new GameObject(sid);
            gameObjects.push(tmpObj);
        }
        if (setSID) tmpObj.sid = sid;
        tmpObj.init(x, y, dir, s, type, data, typeof owner === "number" ? { sid: owner } : owner);
        tmpObj.fake = fake;
        this.setObjectGrids(tmpObj);
        return tmpObj;
    };

    this.disableBySid = function (sid) {
        for (let i = 0, len = gameObjects.length; i < len; ++i) {
            if (gameObjects[i].sid == sid) {
                this.disableObj(gameObjects[i]);
                break;
            }
        }
    };

    this.removeAllItems = function (sid, server) {
        for (let i = 0, len = gameObjects.length; i < len; ++i) {
            const obj = gameObjects[i];
            if (obj.active && obj.owner && obj.owner.sid == sid) {
                this.disableObj(obj);
            }
        }
        if (server) server.broadcast("13", sid);
    };

    this.fetchSpawnObj = function (sid) {
        for (let i = 0, len = gameObjects.length; i < len; ++i) {
            const tmpObj = gameObjects[i];
            if (tmpObj.active && tmpObj.owner && tmpObj.owner.sid == sid && tmpObj.spawnPoint) {
                const tmpLoc = [tmpObj.x, tmpObj.y];
                this.disableObj(tmpObj);
                server.broadcast("12", tmpObj.sid);
                if (tmpObj.owner) tmpObj.owner.changeItemCount(tmpObj.group.id, -1);
                return tmpLoc;
            }
        }
        return null;
    };

    this.checkItemLocation = function (x, y, s, sM, indx, ignoreWater, skip) {
        for (let i = 0, len = this.objects.length; i < len; ++i) {
            const obj = this.objects[i];
            if (!obj.active) continue;

            const skipSid = (typeof skip === "object") ? skip.sid : skip;
            if (skip && obj.sid === skipSid) continue;

            const blockS = obj.blocker ? obj.blocker : obj.getScale(sM, obj.isItem);
            if (UTILS.getDistance(x, y, obj.x, obj.y) < (s + blockS)) return false;
        }

        if (!ignoreWater && indx != 18 && y >= riverMin && y <= riverMax) return false;
        return true;
    };

    this.addProjectile = function (x, y, dir, range, indx) {
        const tmpData = items.projectiles[indx];
        let tmpProj;
        for (let i = 0, len = projectiles.length; i < len; ++i) {
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

    this.checkCollision = function (player, other, delta) {
        delta = delta || 1;
        let tmpX = (other.x2 || other.x),
            tmpY = (other.y2 || other.y);
        const dx = player.x3 - tmpX;
        const dy = player.y3 - tmpY;
        const tmpLen = player.scale + other.scale + 2;

        if (mathABS(dx) > tmpLen && mathABS(dy) > tmpLen) return false;

        const fullLen = player.scale + (other.getScale ? other.getScale() : other.scale);
        const tmpInt = mathSQRT(dx * dx + dy * dy) - fullLen - 2;

        if (tmpInt > 0) return false;
        const isEnemy = !other.isItem || other.owner && !player.team && player.sid !== other.owner.sid || (!window.ally(player.sid) && window.ally(other.owner?.sid)) || (window.ally(player.sid) && !window.ally(other.owner?.sid));

        if (!other.ignoreCollision) {
            const tmpDir = UTILS.getDirection(player.x3, player.y3, tmpX, tmpY);

            if (other.isPlayer) {
                const adjustment = (tmpInt * -0.5);
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
                if (!other.trap || !other.hideFromEnemy || !isEnemy || player.trap === other) {
                }
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
        } else if (other.teleport) {
        }

        if (other.zIndex > player.zIndex) player.zIndex = other.zIndex;
        return true;
    };
};