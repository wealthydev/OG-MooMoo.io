var mathABS = Math.abs;
var mathCOS = Math.cos;
var mathSIN = Math.sin;
var mathPOW = Math.pow;
var mathSQRT = Math.sqrt;

const polearmAnim = window.polearmAnim;
module.exports = function (id, sid, config, UTILS, projectileManager,
	objectManager, players, ais, items, skins2, tails, server, scoreCallback, iconCallback) {
	this.id = id;
	this.sid = sid;
	this.tmpScore = 0;
	this.team = null;
	this.skinIndex = 0;
	this.tailIndex = 0;
	this.hitTime = 0;
	this.tails = {};
	for (var i = 0; i < tails.length; ++i) {
		if (tails[i].price <= 0)
			this.tails[tails[i].id] = 1;
	}
	this.skins = {};
	for (var i = 0; i < skins2.length; ++i) {
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

	// SPAWN:
	this.spawn = function (moofoll) {
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

	// RESET MOVE DIR:
	this.resetMoveDir = function () {
		this.moveDir = undefined;
	};

	// RESET RESOURCES:
	this.resetResources = function (moofoll) {
		for (var i = 0; i < config.resourceTypes.length; ++i) {
			this[config.resourceTypes[i]] = moofoll ? 100 : 0;
		}
	};

	// ADD ITEM:
	this.addItem = function (id) {
		var tmpItem = items.list[id];
		if (tmpItem) {
			for (var i = 0; i < this.items.length; ++i) {
				if (items.list[this.items[i]].group == tmpItem.group) {
					if (this.buildIndex == this.items[i])
						this.buildIndex = id;
					this.items[i] = id;
					return true;
				}
			}
			this.items.push(id);
			return true;
		}
		return false;
	};

	// SET USER DATA:
	this.setUserData = function (data) {
		if (data) {
			// SET INITIAL NAME:
			this.name = "unknown";

			// VALIDATE NAME:
			var name = data.name + "";
			name = name.slice(0, config.maxNameLength);
			name = name.replace(/[^\w:\(\)\/? -]+/gmi, " ");  // USE SPACE SO WE CAN CHECK PROFANITY
			name = name.replace(/[^\x00-\x7F]/g, " ");
			name = name.trim();

			this.name = name;

			// SKIN:
			this.skinColor = 0;
			if (config.skinColors[data.skin])
				this.skinColor = data.skin;
		}
	};

	// GET DATA TO SEND:
	this.getData = function () {
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

	// SET DATA:
	this.setData = function (data) {
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

	// UPDATE:
	var timerCount = 0;
	this.update = function (tmpTime, x2, y2, d2, buildIndex, weaponIndex, weaponVariant, team, isLeader, skinIndex, tailIndex, iconIndex, zIndex) {
		const delta = 1e3 / 9;

		if(tmpTime) {
		this.spike2 = 0;
		this.t1 = this.t2 === undefined ? tmpTime : this.t2;
		this.t2 = tmpTime;
		this.x1 = this.x;
		this.y1 = this.y;
		let old = {
			x: this.x2,
			y: this.y2
		}
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
			let dir = UTILS.getDirection(this.x2, this.y2, old.x, old.y)
			let speed = UTILS.getDistance(this.x2, this.y2, old.x, old.y)

			this.moveDir = speed > 5 ? dir : undefined;
		}

		this.trap = null;
		let ally = window.ally, tmpList = objectManager.getGridArrays(this.x2, this.y2, 35);

		for (let t = 0; t < tmpList.length; ++t) {
			for (let i = 0; i < tmpList[t].length; ++i) {
				tmpObj = tmpList[t][i];
				let valid = tmpObj.active && tmpObj.isItem && tmpObj.sid < 1e15 && tmpObj.owner && ((ally(this.sid) && !ally(tmpObj.owner.sid)) || (!ally(this.sid) && ally(tmpObj.owner.sid))) && tmpObj.id === 15 && UTILS.getDistance(tmpObj.x, tmpObj.y, this.x2, this.y2) <= 50;
				if (valid) this.trap = tmpObj;
			}
		}
	}

		const weapon = items.weapons[this.weaponIndex];
		let reload = this.reload[Number(this.weaponIndex > 8)];

		const mltp = (() => {
			const variants = [1, 1.1, 1.18, 1.18];
			return variants[this.weaponVariant];
		})();

		if (reload.id != weapon.id) {
			reload.id = weapon.id;
			const atkSpd = this.skinIndex === 20 ? 0.78 : 1;
			reload.max = weapon.speed ? (Math.ceil(weapon.speed * atkSpd / (1e3 / 9))) : 0;
			reload.max2 = weapon.speed * atkSpd;
			if (weapon.dmg) reload.dmg = weapon.dmg;
			reload.count = reload.max;
			reload.done = true;
			reload.rarity = this.weaponVariant;
			reload.val = mltp;
		}

		if (this.weaponVariant != reload.rarity) reload.rarity = this.weaponVariant;
		if (mltp != reload.val) reload.val = mltp;

		if (reload.count < reload.max && this.buildIndex == -1) {
			reload.count += 1;
			if (reload.count > reload.max) reload.count = reload.max;
			reload.done = reload.count === reload.max;
		}

		//reload.val = 1.18;
		this.reload[Number(this.weaponIndex > 8)] = reload;

		if (this.reload[2].count < this.reload[2].max) {
			this.reload[2].count += 1;
			if (this.reload[2].count === this.reload[2].max) this.reload[2].done = true;
		}

		// SHAME SHAME SHAME:
		if (this.shameTimer > 0) {
			this.shameTimer -= delta;
			if (this.shameTimer <= 0) {
				this.shameTimer = 0;
				this.shameCount = 0;
			}
		}

		// REGENS AND AUTO:
		this.timerCount -= 1;
		if (this.timerCount <= 0) {
			var regenAmount = (this.skin && this.skin.healthRegen ? this.skin.healthRegen : 0) + (this.tail && this.tail.healthRegen ? this.tail.healthRegen : 0);
			if (regenAmount) this.changeHealth(regenAmount, this);
			if (this.dmgOverTime.dmg) {
				this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer);
				this.dmgOverTime.time -= 1;

				if (this.dmgOverTime.time <= 0) this.dmgOverTime.dmg = 0;
			}
			if (this.healCol) this.changeHealth(this.healCol, this);

			this.timerCount = 9;
		}

		// CHECK KILL:
		if (!this.alive) return;

		// SLOWER:
		if (this.slowMult < 1) {
			this.slowMult += 0.0008 * delta;
			if (this.slowMult > 1) this.slowMult = 1;
		}

		this.noMovTimer += delta;
		if (this.xVel || this.yVel) this.noMovTimer = 0;

		let cx = "x3", cy = "y3";
		this[cx] = this.x2;
		this[cy] = this.y2;

		let spdTail = this.tailIndex ? tails.find(tail => tail.id === this.tailIndex) : {},
			spdSkin = this.skinIndex ? skins2.find(skin => skin.id === this.skinIndex) : {};

		this.tail = spdTail;
		this.skin = spdSkin;

		let spdWpn = this.weaponIndex;

		var spdMult = this.spdMult = ((this.buildIndex >= 0) ? 0.5 : 1) *
			(items.weapons[spdWpn].spdMult || 1) *
			(spdSkin ? (spdSkin.spdMult || 1) : 1) *
			(spdTail ? (spdTail.spdMult || 1) : 1) *
			(this[cy] <= config.snowBiomeTop ? ((spdSkin && spdSkin.coldM) ? 1 : config.snowSpeed) : 1) *
			this.slowMult;

		this.spdMult = spdMult;
		this.maxSpeed = spdMult * 36;

		if (!this.zIndex && this[cy] >= (config.mapScale / 2) - (config.riverWidth / 2) &&
			this[cy] <= (config.mapScale / 2) + (config.riverWidth / 2)) {
			if (spdSkin && spdSkin.watrImm) {
				spdMult *= 0.75;
				this.xVel += config.waterCurrent * 0.4 * delta;
			} else {
				spdMult *= 0.33;
				this.xVel += config.waterCurrent * delta;
			}
		}

		var xVel = (this.moveDir != undefined && this.moveDir !== null) ? Math.cos(this.moveDir) : 0;
		var yVel = (this.moveDir != undefined && this.moveDir !== null) ? Math.sin(this.moveDir) : 0;

		var length = Math.sqrt(xVel * xVel + yVel * yVel);
		if (length != 0) {
			xVel /= length;
			yVel /= length;
		}

		if (xVel) this.xVel += xVel * this.speed * spdMult * delta;
		if (yVel) this.yVel += yVel * this.speed * spdMult * delta;

		this.zIndex = 0;
		this.lockMove = this.healCol = 0;
		this.spike = 0;
		this.boost = 0;
		this.ai = 0;
		this.spikes = [];
		this.lockMove = null;

		// MOVEMENT & COLLISION
		let tmpSpeed = UTILS.getDistance(0, 0, this.xVel * delta, this.yVel * delta);
		let depth = Math.min(4, Math.max(1, Math.round(tmpSpeed / 40)));
		let tMlt = 1 / depth;
		let already = [];

		for (var i = 0; i < depth; ++i) {
			if (!this.lockMove) {
				if (this.xVel) this[cx] += (this.xVel * delta) * tMlt;
				if (this.yVel) this[cy] += (this.yVel * delta) * tMlt;
			}

			let tmpList = objectManager.getGridArrays(this[cx], this[cy], this.scale);
			for (var x = 0; x < tmpList.length; ++x) {
				for (var y = 0; y < tmpList[x].length; ++y) {
					let obj = tmpList[x][y];
					if (!obj.active || obj.sid >= 1e15 || already.includes(obj.sid)) continue;
					already.push(obj.sid);

					let d = objectManager.checkCollision(this, obj, tMlt);
				}
			}
		}

		// PLAYER COLLISIONS:
		var tmpIndx = players.indexOf(this);
		for (let i = tmpIndx + 1; i < players.length; i += 1) {
			if (players[i] != this && players[i].alive) objectManager.checkCollision(this, players[i], 1, cx, cy);
		}

		if (!this.lockMove) {
			if (this.xVel) {
				this.xVel *= Math.pow(config.playerDecel, delta);
				if (this.xVel <= 0.01 && this.xVel >= -0.01) this.xVel = 0;
			}
			if (this.yVel) {
				this.yVel *= Math.pow(config.playerDecel, delta);
				if (this.yVel <= 0.01 && this.yVel >= -0.01) this.yVel = 0;
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

		// USE WEAPON OR TOOL:
		if (this.buildIndex < 0) {
			if (this.lockMove) {
				this.xVel = 0;
				this.yVel = 0;
			}
		}
	};

	// ADD WEAPON XP:
	this.addWeaponXP = function (amnt) {
		if (!this.weaponXP[this.weaponIndex])
			this.weaponXP[this.weaponIndex] = 0;
		this.weaponXP[this.weaponIndex] += amnt;
	};

	// EARN XP:
	this.earnXP = function (amount) {
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

	// CHANGE HEALTH:
	this.changeHealth = function (amount, doer) {
	};

	// KILL:
	this.kill = function (doer) {
		if (doer && doer.alive) {
			doer.kills++;
			if (doer.skin && doer.skin.goldSteal) scoreCallback(doer, Math.round(this.points / 2));
			else scoreCallback(doer, Math.round(this.age * 100 * ((doer.skin && doer.skin.kScrM) ? doer.skin.kScrM : 1)));
			server.send(doer.id, "9", "kills", doer.kills, 1);
		}
		this.alive = false;
		server.send(this.id, "11");
		iconCallback();
	};

	// ADD RESOURCE:
	this.addResource = function (type, amount, auto) {
		if (!auto && amount > 0)
			this.addWeaponXP(amount);
		if (type == 3) {
			scoreCallback(this, amount, true);
		} else {
			this[config.resourceTypes[type]] += amount;
			server.send(this.id, "9", config.resourceTypes[type], this[config.resourceTypes[type]], 1);
		}
	};

	// CHANGE ITEM COUNT:
	this.changeItemCount = function (index, value) {
		this.itemCounts[index] = this.itemCounts[index] || 0;
		this.itemCounts[index] += value;
		server.send(this.id, "14", index, this.itemCounts[index]);
	};

	// BUILD:
	this.buildItem = function (item, angle, skip) {
		const scale = this.scale + item.scale + (item.placeOffset || 0)
			, x = this.x2 + scale * Math.cos(angle)
			, y = this.y2 + scale * Math.sin(angle);

		return objectManager.checkItemLocation(x, y, item.scale, .6, item.id, !1, skip)
	}

	this.build = function () {
		if (this.hitTime) {
			let delta = Date.now() - this.hitTime;

			this.hitTime = 0;
			if (delta < 120) {
				this.shameCount += 1;
			} else {
				this.shameCount = Math.max(0, this.shameCount - 2);
			}
		}
	}

	// HAS RESOURCES:
	this.hasRes = function (item, mult) {
		for (var i = 0; i < item.req.length;) {
			if (this[item.req[i]] < Math.round(item.req[i + 1] * (mult || 1)))
				return false;
			i += 2;
		}
		return true;
	};

	// USE RESOURCES:
	this.useRes = function (item, mult) {
		if (config.inSandbox)
			return;
		for (var i = 0; i < item.req.length;) {
			this.addResource(config.resourceTypes.indexOf(item.req[i]), -Math.round(item.req[i + 1] * (mult || 1)));
			i += 2;
		}
	};

	// CAN BUILD:
	this.canBuild = function (item) {
		if (config.inSandbox)
			return true;
		if (item.group.limit && this.itemCounts[item.group.id] >= item.group.limit)
			return false;
		return this.hasRes(item);
	};

	// GATHER:
	this.gather = function (hitBuild, weaponIndex, frame) {
		this.weaponIndex = weaponIndex;

		const reload = this.reload[Number(weaponIndex > 8)];
		reload.count = 0;
		reload.date = Date.now();
		reload.done = false;

		const weapon = items.weapons[weaponIndex];
		if (weapon) {
			const atkSpd = this.skinIndex === 20 ? 0.78 : 1;
			reload.max = weapon.speed ? (Math.ceil(weapon.speed * atkSpd / (1e3 / 9))) : 0;
			reload.max2 = weapon.speed * atkSpd;
		}

		// SHOW:
		this.noMovTimer = 0;

		// SLOW MOVEMENT:
		this.slowMult -= (items.weapons[this.weaponIndex].hitSlow || 0.3);
		if (this.slowMult < 0) this.slowMult = 0;

		// VARIANT DMG:
		let tmpVariant = config.fetchVariant(this);
		let applyPoison = tmpVariant.poison;
		let variantDmg = tmpVariant.val;

		let hitObjs = [];
		let tmpDist, tmpDir, tmpObj, hitSomething;
		let tmpList = objectManager.getGridArrays(this.x2, this.y2, items.weapons[this.weaponIndex].range);

		// CHECK IF HIT GAME OBJECT:
		/*if (hitBuild) {
			for (let t = 0; t < tmpList.length; ++t) {
				for (let i = 0; i < tmpList[t].length; ++i) {
					tmpObj = tmpList[t][i];
					if (tmpObj.active && !tmpObj.dontGather && tmpObj.visibleToPlayer(this)) {
						tmpDist = UTILS.getDistance(this.x2, this.y2, tmpObj.x, tmpObj.y) - tmpObj.scale;
						if (tmpDist <= items.weapons[this.weaponIndex].range) {
							tmpDir = UTILS.getDirection(tmpObj.x, tmpObj.y, this.x2, this.y2);
							if (UTILS.getAngleDist(tmpDir, this.d2) <= config.gatherAngle) {
								const now = performance.now();
								console.log("last wiggle", now - tmpObj.wiggleDate)
								if (now - tmpObj.wiggleDate <= 70) {
									hitObjs.push(tmpObj);
									const skin = skins2.find(c => c.id === this.skinIndex2);
									const dmg = items.weapons[this.weaponIndex].dmg * (items.weapons[this.weaponIndex].sDmg || 1) * (skin?.bDmg || 1) * reload.val;
									tmpObj.changeHealth(-dmg, this);
								}
							}
						}
					}
				}
			}
		}*/

		// CHECK IF HIT PLAYER:
		for (let i = 0; i < players.length + ais.length; ++i) {
			tmpObj = players[i] || ais[i - players.length];
			if (tmpObj != this && tmpObj.visible && !(tmpObj.team && tmpObj.team == this.team)) {
				tmpDist = UTILS.getDistance(this.x2, this.y2, tmpObj.x2, tmpObj.y2) - (tmpObj.scale * 1.8);
				if (tmpDist <= items.weapons[this.weaponIndex].range) {

					tmpDir = UTILS.getDirection(tmpObj.x2, tmpObj.y2, this.x2, this.y2);
					if (UTILS.getAngleDist(tmpDir, this.d2) <= config.gatherAngle) {

						// STEAL RESOURCES:
						let stealCount = items.weapons[this.weaponIndex].steal;
						if (stealCount && tmpObj.addResource) {
							stealCount = min((tmpObj.points || 0), stealCount);
							console.log('steal', stealCount);
							// this.addResource(3, stfealCount);
							// tmpObj.addResource(3, -stealCount);
						}

						// MELEE HIT PLAYER:
						let dmgMlt = variantDmg;
						if (tmpObj.weaponIndex != undefined && weapon.shield &&
							UTILS.getAngleDist(tmpDir + PI, tmpObj.dir) <= config.shieldAngle) {
							dmgMlt = items.weapons[tmpObj.weaponIndex].shield;
						}
						let dmgVal = weapon.dmg * (this.skin && this.skin.dmgMultO ? this.skin.dmgMultO : 1) * (this.tail && this.tail.dmgMultO ? this.tail.dmgMultO : 1);
						let tmpSpd = (0.3 * (tmpObj.weightM || 1)) + (weapon.knock || 0);
						tmpObj.xVel += tmpSpd * Math.cos(tmpDir);
						tmpObj.yVel += tmpSpd * Math.sin(tmpDir);

						if (this.skin && this.skin.healD) this.changeHealth(dmgVal * dmgMlt * this.skin.healD, this);
						if (this.tail && this.tail.healD) this.changeHealth(dmgVal * dmgMlt * this.tail.healD, this);
						if (tmpObj.skin && tmpObj.skin.dmg && dmgMlt == 1) this.changeHealth(-dmgVal * tmpObj.skin.dmg, tmpObj);
						if (tmpObj.tail && tmpObj.tail.dmg && dmgMlt == 1) this.changeHealth(-dmgVal * tmpObj.tail.dmg, tmpObj);

						if (tmpObj.dmgOverTime && this.skin && this.skin.poisonDmg && !(tmpObj.skin && tmpObj.skin.poisonRes)) {
							tmpObj.dmgOverTime.dmg = this.skin.poisonDmg;
							tmpObj.dmgOverTime.time = this.skin.poisonTime || 1;
							tmpObj.dmgOverTime.doer = this;
						}
						if (tmpObj.dmgOverTime && applyPoison && !(tmpObj.skin && tmpObj.skin.poisonRes)) {
							tmpObj.dmgOverTime.dmg = 5;
							tmpObj.dmgOverTime.time = 5;
							tmpObj.dmgOverTime.doer = this;
						}
						if (tmpObj.skin && tmpObj.skin.dmgK) {
							this.xVel -= tmpObj.skin.dmgK * Math.cos(tmpDir);
							this.yVel -= tmpObj.skin.dmgK * Math.sin(tmpDir);
							console.log("vel knockback!")
						}
						tmpObj.changeHealth(-dmgVal * dmgMlt, this, this);
					}
				}
			}
		}

		// SEND FOR ANIMATION:
		this.sendAnimation(hitSomething ? 1 : 0);
		return hitObjs;
	};

	// SEND ANIMATION:
	this.sendAnimation = function (hit) {
		for (var i = 0; i < players.length; ++i) {
			if (this.sentTo[players[i].id] && this.canSee(players[i])) {
				server.send(players[i].id, "7", this.sid, hit ? 1 : 0, this.weaponIndex);
			}
		}
	};

	// ANIMATE:
	var tmpRatio = 0;
	var animIndex = 0;
	this.animate = function (delta) {
		if (this.weaponIndex === 5 && polearmAnim) {
			this.animSpeed = items.weapons[this.weaponIndex].speed * .8
			this.targetAngle /= 1.18
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

	// GATHER ANIMATION:
	this.startAnim = function (didHit, index) {
		this.animTime = this.animSpeed = items.weapons[index].speed;
		this.targetAngle = (didHit ? -config.hitAngle : -config.hitAngle)//-Math.PI);
		tmpRatio = 0;
		animIndex = 0;
	};

	// CAN SEE:
	this.canSee = function (other) {
		if (!other) return false;
		if (other.skin && other.skin.invisTimer && other.noMovTimer
			>= other.skin.invisTimer) return false;
		var dx = mathABS(other.x - this.x) - other.scale;
		var dy = mathABS(other.y - this.y) - other.scale;
		return dx <= (config.maxScreenWidth / 2) * 1.3 && dy <= (config.maxScreenHeight / 2) * 1.3;
	};

};


/***/