module.exports = function (players, ais, objectManager, items, config, UTILS, server) {
	// INIT:
	this.init = function (indx, x, y, dir, spd, dmg, rng, scl, owner) {
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
		this.owner = (owner || {});

		if (server) this.sentTo = {};
	};

	// UPDATE:
	let objectsHit = [];
	let tmpObj;
	this.update = function (delta) {
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
	}
	this.target_update = function (time, first) {
		if (first) this.time = time;
		this.target = this.predict(first);

		if (this.target) {
			let x = this.x3,
				y = this.y3;

			let dist = UTILS.getDistance(x, y, (this.target.x2 || this.target.x), (this.target.y2 || this.target.y));

			this.estimated = Math.max(0, this.time - time + Math.max(1, Math.ceil(Math.max(0, dist - (this.target.getScale ? this.target.getScale() : this.target.scale)) / (this.speed * (1e3 / 9)))));
			//first && console.log(`${this.owner.name} ${this.target.name} ${this.estimated} ticks, dist: ${dist.toFixed(2)}`)
		}
	}
	this.predict = function (first) {
		this.x2 = this.x;
		this.y2 = this.y;
		this.range2 = this.range;
		this.skipMov2 = first;

		if (!this.active) return
		for (let a = 0; a < this.range + this.scale; a += this.speed) {
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
					// this.active = false;
				}
			} else {
				this.skipMov2 = false;
			}

			objectsHit.length = 0;
			for (let i = 0; i < players.length + ais.length; ++i) {
				tmpObj = players[i] || ais[i - players.length];
				if (tmpObj.visible && (!this.owner.isPlayer || this.owner.sid !== tmpObj.sid) && tmpObj.sid !== this.owner.sid && !(this.owner.team && tmpObj.team == this.owner.team)) {
					if (UTILS.lineInRect(tmpObj.x2 - tmpObj.scale, tmpObj.y2 - tmpObj.scale, tmpObj.x2 + tmpObj.scale,
						tmpObj.y2 + tmpObj.scale, this.x2, this.y2, this.x2 + (tmpSpeed * Math.cos(this.dir)),
						this.y2 + (tmpSpeed * Math.sin(this.dir)))) {
						objectsHit.push(tmpObj);
					}
				}
			}

			let tmpList = objectManager.getGridArrays(this.x2, this.y2, this.scale);
			for (let x = 0; x < tmpList.length; ++x) {
				for (let y = 0; y < tmpList[x].length; ++y) {
					tmpObj = tmpList[x][y];
					tmpScale = tmpObj.getScale();
					if (tmpObj.active && !(this.owner.isItem && this.owner.owner.sid === tmpObj.owner?.sid) && !(this.ignoreObj == tmpObj.sid) && (this.layer <= tmpObj.layer) &&
						objectsHit.indexOf(tmpObj) < 0 && !tmpObj.ignoreCollision && UTILS.lineInRect(tmpObj.x - tmpScale, tmpObj.y - tmpScale, tmpObj.x + tmpScale, tmpObj.y + tmpScale,
							this.x2, this.y2, this.x2 + (tmpSpeed * Math.cos(this.dir)), this.y2 + (tmpSpeed * Math.sin(this.dir)))) {
						objectsHit.push(tmpObj);
					}
				}
			}

			// HIT OBJECTS:
			if (objectsHit.length > 0) {
				let hitObj = null;
				let shortDist = null;
				let tmpDist = null;
				for (let i = 0; i < objectsHit.length; ++i) {
					tmpDist = UTILS.getDistance(this.x2, this.y2, objectsHit[i].x, objectsHit[i].y);
					if (shortDist == null || tmpDist < shortDist) {
						shortDist = tmpDist;
						hitObj = objectsHit[i];
					}
				}
				return hitObj;
			}
		}
	}
};


/***/