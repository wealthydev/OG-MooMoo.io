var PI2 = Math.PI * 2;
	   module.exports = function(sid, objectManager, players, items, UTILS, config, scoreCallback, server) {
  this.sid = sid;
  this.isAI = true;
  this.nameIndex = UTILS.randInt(0, config.cowNames.length-1);
  // INIT:
  this.init = function(x, y, dir, index, data) {
	 this.x = x;
	 this.y = y;
	 this.startX = data.fixedSpawn?x:null;
	 this.startY = data.fixedSpawn?y:null;
	 this.xVel = 0;
	 this.yVel = 0;
	 this.zIndex = 0;
	 this.dir = dir;
	 this.dirPlus = 0;
	 this.index = index;
	 this.src = data.src;
	 if (data.name) this.name = data.name;
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
	let sub = (dist > config.volcanoAggressionRadius) ? 0 : (config.volcanoAggressionRadius - dist);
	return 1 + (config.volcanoAggressionPercentage * (1 - (sub / config.volcanoAggressionRadius)));
};

  // UPDATE:
  var timerCount = 0;
  this.update = function(delta = 1e3/9) {
	if (this.visible) {

		// SPAWN DELAY:
		/*if (this.spawnCounter) {
this.spawnCounter -= delta;
if (this.spawnCounter <= 0) {
this.spawnCounter = 0;
if (this.minSpawnRange || this.maxSpawnRange) {
	let tmpMin = config.mapScale * this.minSpawnRange;
	let tmpMax = config.mapScale * this.maxSpawnRange;
	this.x = UTILS.randInt(tmpMin, tmpMax);
	this.y = UTILS.randInt(tmpMin, tmpMax);
} else {
	this.x = this.startX || UTILS.randInt(0, config.mapScale);
	this.y = this.startY || UTILS.randInt(0, config.mapScale);
}
}
return;
}*/

		// REGENS AND AUTO:
		timerCount -= delta;
		if (timerCount <= 0) {
			if (this.dmgOverTime.dmg) {
				//this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer);
				this.dmgOverTime.time -= 1;
				if (this.dmgOverTime.time <= 0) this.dmgOverTime.dmg = 0;
			}
			timerCount = 1000;
		}

		this.x3 = this.x2;
		this.y3 = this.y2;

		// BEHAVIOUR:
		let charging = false;
		let slowMlt = 1;
		if (!this.zIndex && !this.lockMove && this.y2 >= (config.mapScale / 2) - (config.riverWidth / 2) &&
			this.y2 <= (config.mapScale / 2) + (config.riverWidth / 2)) {
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
					for (let i = 0; i < players.length; ++i) {
						if (players[i].alive && !(players[i].skin && players[i].skin.bullRepel)) {
							tmpDist = UTILS.getDistance(this.x2, this.y2, players[i].x2, players[i].y2);
							if (tmpDist <= this.viewRange && (!tmpPlayer || tmpDist < bestDst)) {
								bestDst = tmpDist;
								tmpPlayer = players[i];
								//window.notify(`${this.name} targeting ${tmpPlayer.name}`);
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
					this.moveCount = UTILS.randInt(4000, 10000);
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
			} if (this.hitWait) {
				tmpSpd *= 0.3;
			}
			if (this.d2 != this.targetDir) {
				this.d2 %= PI2;
				let netAngle = (this.d2 - this.targetDir + PI2) % PI2;
				let amnt = Math.min(Math.abs(netAngle - PI2), netAngle, this.turnSpeed * delta);
				let sign = (netAngle - Math.PI)>=0?1:-1;
				this.d2 += sign * amnt + PI2;
			}
			this.d2 %= PI2;
			this.xVel += (tmpSpd * delta) * Math.cos(this.dir);
			this.yVel += (tmpSpd * delta) * Math.sin(this.dir);
			this.moveCount -= delta;
			if (this.moveCount <= 0) {
				this.runFrom = null;
				this.chargeTarget = null;
				this.waitCount = this.hostile?1500:UTILS.randInt(1500, 6000);
			}
		}

		// OBJECT COLL:
		this.zIndex = 0;
		this.spikes = [];
		this.spike = 0;
		this.lockMove = false;
		let tmpList;
		let tmpSpeed = UTILS.getDistance(0, 0, this.xVel * delta, this.yVel * delta);
		let depth = Math.min(4, Math.max(1, Math.round(tmpSpeed / 40)));
		let tMlt = 1 / depth;
		const already = new Set;

		for (let i = 0; i < depth; ++i) {
			if (this.xVel) this.x3 += (this.xVel * delta) * tMlt;
			if (this.yVel) this.y3 += (this.yVel * delta) * tMlt;
			tmpList = objectManager.getGridArrays(this.x3, this.y3, this.scale);
			for (let x = 0; x < tmpList.length; ++x) {
				for (let y = 0; y < tmpList[x].length; ++y) {
					const obj = tmpList[x][y];
					if (!obj.active || already.has(obj.sid) || obj.sid > 1e15 || obj.fake) continue;

					already.add(obj.sid);

					objectManager.checkCollision(this, tmpList[x][y], tMlt);
				}
			}
		}

		// HITTING:
		let hitting = false;
		let arr = objectManager.getGridArrays(this.x3, this.y3, this.scale);

		if(arr.length && !this.noTrap) {
			for(let x in arr) for(let y in arr[x]) {
				let obj = arr[x][y];
				if(obj.active && obj.isItem && obj.id === 15 && UTILS.getDistance(obj.x, obj.y, this.x2, this.y2) <= this.scale) this.lockMove = true;
			}
		}

		// PLAYER COLLISIONS:
		if (charging || hitting) {
			let tmpObj, tmpDst, tmpDir;
			for (let i = 0; i < players.length; ++i) {
				tmpObj = players[i];
				if (tmpObj && tmpObj.visible) {
					tmpDst = UTILS.getDistance(this.x3, this.y3, tmpObj.x2, tmpObj.y2);
					if (this.hitRange) {
						if (!this.hitWait && tmpDst <= this.hitRange + tmpObj.scale) {
							if (hitting) {
								tmpDir = UTILS.getDirection(tmpObj.x2, tmpObj.y2, this.x3, this.y3);
								//tmpObj.changeHealth(-this.dmg);
								tmpObj.xVel += 0.6 * cos(tmpDir);
								tmpObj.yVel += 0.6 * sin(tmpDir);
								this.runFrom = null;
								this.chargeTarget = null;
								this.waitCount = 3000;
								this.hitWait = (!UTILS.randInt(0, 2)?600:0);
							} else this.hitWait = this.hitDelay;
						}
					} else if (tmpDst <= this.scale + tmpObj.scale + 15) { // 15 for safety margin
						//tmpObj.changeHealth(-this.dmg);
						if(!this.lockMove) {
							tmpDir = UTILS.getDirection(tmpObj.x2, tmpObj.y2, this.x3, this.y3);
							tmpObj.ai += this.dmg;
							// console.log(tmpObj.ai)
							tmpObj.xVel += 0.55 * Math.cos(tmpDir);
							tmpObj.yVel += 0.55 * Math.sin(tmpDir)
						};
					}
				}
			}
		}

		// DECEL:
		if (this.xVel) this.xVel *= Math.pow(config.playerDecel, delta);
		if (this.yVel) this.yVel *= Math.pow(config.playerDecel, delta);

		// MAP BOUNDARIES:
		let tmpScale = this.scale;
		if (this.x3 - tmpScale < 0) {
			this.x3 = tmpScale;
			this.xVel = 0;
		} else if (this.x3 + tmpScale > config.mapScale) {
			this.x3 = config.mapScale - tmpScale;
			this.xVel = 0;
		} if (this.y3 - tmpScale < 0) {
			this.y3 = tmpScale;
			this.yVel = 0;
		} else if (this.y3 + tmpScale > config.mapScale) {
			this.y3 = config.mapScale - tmpScale;
			this.yVel = 0;
		}

	}
};

  // CAN SEE:
  this.canSee = function(other) {
	 if (!other) return false;
	 if (other.skin && other.skin.invisTimer && other.noMovTimer
		>= other.skin.invisTimer) return false;
	 var dx = Math.abs(other.x - this.x) - other.scale;
	 var dy = Math.abs(other.y - this.y) - other.scale;
	 return dx <= (config.maxScreenWidth / 2) * 1.3 && dy <= (config.maxScreenHeight / 2) * 1.3;
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
			   tmpRatio -= delta / (this.animSpeed * (1-config.hitReturnRatio));
			   this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
		    }
		}
	 }
  };

  // ANIMATION:
  this.startAnim = function() {
	 this.animTime = this.animSpeed = 600;
	 this.targetAngle = Math.PI * 0.8;
	 tmpRatio = 0;
	 animIndex = 0;
  };

  // CHANGE HEALTH:
  this.changeHealth = function(val, doer, runFrom) {
	 if (this.active) {
		//this.health += val;
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
		if (val < 0 && this.hitRange && UTILS.randInt(0, 1)) this.hitWait = 500;
		if (doer && doer.canSee && doer.canSee(this) && val < 0) {
		    // server.send(doer.id, "t", Math.round(this.x), Math.round(this.y), Math.round(-val), 1);
		} if (this.health <= 0) {
		    /*if (this.spawnDelay) {
			   this.spawnCounter = this.spawnDelay;
			   this.x = -1000000;
			   this.y = -1000000;
		    } else {
			   this.x = this.startX||UTILS.randInt(0, config.mapScale);
			   this.y = this.startY||UTILS.randInt(0, config.mapScale);
		    }
		    this.health = this.maxHealth;
		    this.runFrom = null;*/
		}
	 }
  };

	   };


	   /***/