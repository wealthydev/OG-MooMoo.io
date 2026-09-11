// ANIMATED TEXT:
module.exports.AnimText = function() {

	// INIT:
	this.init = function(x, y, scale, speed, life, text, color) {
	   this.x = x;
	   this.y = y;
	   this.color = color;
	   this.scale = scale;
	   this.startScale = this.scale;
	   this.maxScale = scale * 1.5;
	   this.scaleSpeed = 0.7;
	   this.speed = speed;
	   this.life = life;
	   this.text = text;
	};
  
	// UPDATE:
	this.update = function(delta) {
	   if (this.life) {
		  this.life -= delta;
		  this.y -= this.speed * delta;
		  this.scale += this.scaleSpeed * delta;
  
		  if (this.scale >= this.maxScale) {
			  this.scale = this.maxScale;
			  this.scaleSpeed *= -1;
		  } else if (this.scale <= this.startScale) {
			  this.scale = this.startScale;
			  this.scaleSpeed = 0;
		  }
  
		  if (this.life <= 0) {
			  this.life = 0;
		  }
	   }
	};
  
	// RENDER:
	this.render = function(ctxt, xOff, yOff) {
		ctxt.font = this.scale + "px Hammersmith One";
		ctxt.lineWidth = 12;
		ctxt.lineJoin = "round";
		ctxt.strokeStyle = "#3d3f42";
		ctxt.strokeText(this.text, this.x - xOff, this.y - yOff);
		ctxt.fillStyle = this.color;
		ctxt.fillText(this.text, this.x - xOff, this.y - yOff);
	};
  
  };
  
  
  // TEXT MANAGER:
  module.exports.TextManager = function() {
  
	this.texts = [];
  
	this.damageGroups = [];
	this.groupRadius = 50; 
	this.groupLifetime = 30;  
  
	// UPDATE:
	this.update = function(delta, ctxt, xOff, yOff) {
	   ctxt.textBaseline = "middle";
	   ctxt.textAlign = "center";
  
	   var now = (typeof performance !== "undefined" ? performance.now() : Date.now());
  
	   for (var i = this.damageGroups.length - 1; i >= 0; i--) {
		  var g = this.damageGroups[i];
  
		  if (now - g.time > this.groupLifetime) {
			  this.showText(
				  g.x,
				  g.y,
				  g.scale,
				  g.speed,
				  g.life,
				  g.total,
				  g.color
			  );
  
			  this.damageGroups.splice(i, 1);
		  }
	   }
  
	   // normal text update/render
	   for (var i = 0; i < this.texts.length; ++i) {
		  if (this.texts[i].life) {
			  this.texts[i].update(delta);
			  this.texts[i].render(ctxt, xOff, yOff);
		  }
	   }
	};
  
	this.addDamage = function(x, y, dmg, scale, speed, life, color) {
	   var now = (typeof performance !== "undefined" ? performance.now() : Date.now());
  
	   var bestGroup = null;
	   var bestDist = Infinity;
  
	   for (var i = 0; i < this.damageGroups.length; i++) {
		  var g = this.damageGroups[i];
  
		  if (now - g.time > this.groupLifetime) continue;
  
		  var dx = g.x - x;
		  var dy = g.y - y;
		  var distSq = dx * dx + dy * dy;
  
		  if (distSq < this.groupRadius * this.groupRadius && distSq < bestDist) {
			  bestGroup = g;
			  bestDist = distSq;
		  }
	   }
  
	   if (!bestGroup) {
		  bestGroup = {
			  x: x,
			  y: y,
			  total: 0,
			  scale: scale,
			  speed: speed,
			  life: life,
			  color: color,
			  time: now
		  };
		  this.damageGroups.push(bestGroup);
	   }
  
	   bestGroup.total += dmg;
  
	   bestGroup.x = bestGroup.x * 0.7 + x * 0.3;
	   bestGroup.y = bestGroup.y * 0.7 + y * 0.3;
  
	   bestGroup.time = now;
	};
  
	// SHOW TEXT 
	this.showText = function(x, y, scale, speed, life, text, color) {
	   var tmpText;
  
	   for (var i = 0; i < this.texts.length; ++i) {
		  if (!this.texts[i].life) {
			  tmpText = this.texts[i];
			  break;
		  }
	   }
  
	   if (!tmpText) {
		  tmpText = new module.exports.AnimText();
		  this.texts.push(tmpText);
	   }
  
	   tmpText.init(x, y, scale, speed, life, text, color);
	};
  };