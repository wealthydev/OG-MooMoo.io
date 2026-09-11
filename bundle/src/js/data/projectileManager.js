module.exports = function (Projectile, projectiles, players, ais, objectManager, items, config, UTILS, server) {
	this.addProjectile = function (x, y, dir, range, speed, indx, owner, ignoreObj, layer) {
		let tmpData = items.projectiles[indx];
		let tmpProj;
		for (let i = 0; i < projectiles.length; ++i) {
			if (!projectiles[i].active) {
				tmpProj = projectiles[i];
				break;
			}
		}

		if (!tmpProj) {
			for (let i = projectiles.length - 1; i >= 0; --i) {
				if (!projectiles[i].active) {
					projectiles.splice(i, 1);
				}
			}

			tmpProj = new Projectile(players, ais, objectManager, items, config, UTILS, server);
			tmpProj.sid = projectiles.length;
			projectiles.push(tmpProj);
		}
		tmpProj.init(indx, x, y, dir, speed, tmpData.dmg, range, tmpData.scale, owner);
		tmpProj.ignoreObj = ignoreObj;
		tmpProj.layer = layer || tmpData.layer;
		tmpProj.src = tmpData.src;
		return tmpProj;
	};
};


/***/