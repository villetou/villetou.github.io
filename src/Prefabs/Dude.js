ConWo.Prefabs.Dude = function(game,x,y,spr) {
	Phaser.Sprite.call(this, game, x, y, spr);

	this.anchor.setTo(0.5,1.0);

	//game.add.existing(this);

	this.health = 1.0;

	this.needs = {
		bananas: 1.0,
		vodka: 1.0,
		money: 1.0,
		ent: 1.0
	}

	this.consumption = {
		bananas: 0.5,
		vodka: 0.5,
		money: 0.5,
		ent: 0.5
	}

	this.production = {
		bananas: 0.1,
		vodka: 0.1,
		money: 0.1,
		ent: 0.1
	}

	this.needGroup = game.add.group(this);
	this.needGroup.y = -200;
	this.needGroup.x = 100;

	this.needSpritePadding = 30;

	this.needSprites = {
		bananas: game.add.sprite(0,this.needSpritePadding*0,'loader-bar',null,this.needGroup),
		vodka: game.add.sprite(0,this.needSpritePadding*1,'loader-bar',null,this.needGroup),
		money: game.add.sprite(0,this.needSpritePadding*2,'loader-bar',null,this.needGroup),
		ent: game.add.sprite(0,this.needSpritePadding*3,'loader-bar',null,this.needGroup)
	}

	this.isAliveAndKicking = true;
	this.justDied = false;

	this.tweens = {};
	this.tweens.shake = game.add.tween(this).to({y: this.y-10},1000,Phaser.Easing.Cubic.Out).yoyo(true).loop().start();
}

ConWo.Prefabs.Dude.prototype = Object.create(Phaser.Sprite.prototype);
ConWo.Prefabs.Dude.prototype.constructor = ConWo.Prefabs.Dude;

ConWo.Prefabs.Dude.prototype.update = function() {
	
	if(this.isAliveAndKicking) {
		var someIsZero = false;
		for(key in this.needs) {
			this.needs[key] -= this.consumption[key]*this.game.time.elapsed/1000;
			this.needs[key] = Math.max(this.needs[key],0.0);
			this.needSprites[key].scale.set(this.needs[key],1.0);

			if(this.needs[key] <= 0.0) {
				this.health -= 0.1*this.game.time.elapsed/1000;
			}
		}
		if(this.health <= 0.0) {
			this.isAliveAndKicking = false;
			this.justDied = true;
		}
	}

	if(this.justDied) {
		this.game.add.tween(this).to({angle:-90},800,Phaser.Easing.Cubic.In).start();
		this.justDied = false;
	}
}

ConWo.Prefabs.Dude.prototype.boost = function() {
	for(key in this.needs) {
		this.needs[key] = Math.min(this.needs[key]+this.production[key], 1.0);
	}
}

ConWo.Prefabs.Dude.prototype.giveTo = function(otherDude) {
	if(this.isAliveAndKicking && otherDude.isAliveAndKicking) {
		for(key in this.needs) {
			if(this.needs[key] >= 0.2) {
				this.needs[key] = Math.max(this.needs[key]-0.2,0.0);
				otherDude.needs[key] = Math.min(otherDude.needs[key]+0.2,1.0); 
			}
		}	
	}
}