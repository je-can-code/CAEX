/* -------------------------------------------------------------------------- */
// J_QABS_CustomAI
// V: 1.0
//
/*:@plugindesc Adds in a new AI "basic" to the QABS.
@author J

@help Enables the new "basic" AI for use with QABS.
		It isn't actually that much smarter than the original, but it deals with
		a few nuances that needed help.

	Details:
		Enemies now use use custom AI wait timers to given unique durations
		between actions. This can be setup with the following notetags:
			<aiWait:###>
		example:
			<aiWait:40>
		translates to:
			waits 40 frames (2/3 of a second) between actions.

		If no notetag is included on the enemy, they will use the default aiWait
		setup within the QABS itself.

	Additionally:
		Enemies will now attempt to hold a distance between their target while
		they await their turn. Their skill designation is still determined by
		the QABS itself, but if the enemy deems it best to use a melee skill,
		they will approach the target till in range before executing the skill.
		If an enemy is too many levels below the target, instead of just
		continuing the attack, they will run the opposite direction at an
		increased move-rate.

*/

// adds in a new "_aiMode" for tracking the state of a battler.
var j_Game_Event_customAI = Game_Event.prototype.setupBattler;
Game_Event.prototype.setupBattler = function() {
	j_Game_Event_customAI.call(this);
	if (this._battlerId > 0) {
		this._aiMode = null;
		this._balloon = null;
		this._baseMove = this._moveSpeed;
		this._canFlee = this.canFlee();
		this._skillDecided = null;
	}
};

// returns true if the aiType is created, otherwise, false.
Game_Event.prototype.validAI = function() {
	switch (this._aiType) {
		case "simple":
			return true;
		case "basic":
			return true;
		default:
			return false;
	}
};

// updated version of the "updateAI" processing function.
// this does overwrite the current, but accommodates the original.
Game_Event.prototype.updateAI = function(type) {
	switch (type) {
		case "simple":
			return this.updateAISimple();
		case "basic":
			return this.updateAIBasic();
		default: break;
	}
};

Game_Event.prototype.updateAIBasic = function() {
	var bestTarget = this.bestTarget();
	if (!bestTarget) return;
	this.basicAImode();
};

// closes the gap between the player and enemy.
Game_Event.prototype.closeDistance = function() {
	var bestTarget = this.bestTarget();
	if (this.canMove() && this.hasTarget()) {
		if (this._aiPathfind) {
			var distance = this.pixelDistanceFrom(bestTarget.cx(), bestTarget.cy());
			var minDist = 0;
			var maxDist = 60;
			if (distance > minDist && distance < maxDist) {
				this.clearPathfind();
				this.turnTowardCharacter(bestTarget);
			}	else if (distance > maxDist) {
				this.initChase(bestTarget.charaId());
			} else if (distance < minDist) {
				this.clearPathfind();
				this.moveAwayFromCharacter(bestTarget);
			}
		}
	}
};

// holds a given distance between the player and enemy.
// the current distance is between (4x own size) and (6x own size) in pixels.
Game_Event.prototype.holdDistance = function(xRange) {
	var bestTarget = this.bestTarget();
	// if a target is noticed, and the pursuer can move
	if (this.canMove() && this.hasTarget()) {
		if (this._aiPathfind) {
			var distance = this.pixelDistanceFrom(bestTarget.cx(), bestTarget.cy());
			if (xRange != null) {
				if (distance < xRange) {
					// if closer than the min distance, get away.
					this.clearPathfind();
					this.moveAwayFromCharacter(bestTarget);
					return;
				}
			} else {
				var minDist = Math.floor((this.collider('collision').width + this.collider('collision').height) / 2 * 4);
				var maxDist = Math.floor((this.collider('collision').width + this.collider('collision').height) / 2 * 6);
				if (distance > minDist && distance < maxDist) {
					// if within the min-max distances, just look at the target.
					this.clearPathfind();
					this.turnTowardCharacter(bestTarget);
				}	else if (distance > maxDist) {
					// if outside of the max distance, get closer.
					this.initChase(bestTarget.charaId());
				} else if (distance < minDist) {
					// if closer than the min distance, get away.
					this.clearPathfind();
					this.moveAwayFromCharacter(bestTarget);
				}
			}
		}
	}
};

// determines whether or not there is a target in range to engage.
// returns true if there is, false if not.
// modified version of original QABS "AISimpleInRange".
Game_Event.prototype.hasTarget = function() {
	var bestTarget = this.bestTarget();
	var targetId = bestTarget.charaId();
	if (this.isTargetInRange(bestTarget)) {
		if (!this._agroList.hasOwnProperty(targetId)) {
			this.addAgro(targetId);
			if (this._aiPathfind) {	this.clearPathfind();	}
		}
		if (this._endWait) {
			this.removeWaitListener(this._endWait);
			this._endWait = null;
		}
		return true;
	} else {
		if (!this._endWait && this.inCombat()) {
			bestTarget.removeAgro(this.charaId());
			if (this._aiPathfind) { this.clearPathfind();	}
			this._endWait = this.wait(90).then(function() {
				this._endWait = null;
				this._aiMode = null;
				this.requestBalloon(2);
				this.endCombat();
			}.bind(this));
		}
		return false;
	}
	return false;
};

// the state-based AI.
// the six states of action that enemies can be in.
// typically: ENGAGE > START > WAIT > READY > DECIDE > REPOSITION > ATTACK
// 	then restart @START, if enemy loses sight of target, restart at ENGAGE.
Game_Event.prototype.basicAImode = function() {
	if (this._aiMode == null) this._aiMode = 'ENGAGE';
	if (!this.hasTarget()) { return; };
	switch (this._aiMode) {
		case 'ENGAGE':
			this.basicAIengage();
			break;
		case 'START':
			this.basicAIstart();
			break;
		case 'WAIT':
			this.basicAIwait();
			break;
		case 'READY':
			this.basicAIready();
			break;
		case 'DECIDE':
			this.basicAIdecide();
			break;
		case 'REPOSITION':
			this.basicAIreposition();
			break;
		case 'ATTACK':
			this.basicAIattack();
			break;
		case 'FLEE':
			this.basicAIflee();
			break;
		default: break;
	}
	//console.log(this._aiMode);
};

// beings the encounter between this event and the target.
// pops an alert balloon, and moves to start mode.
Game_Event.prototype.basicAIengage = function() {
	this.requestBalloon(1);
	this._aiMode = 'START';
};

// create wait timer and clears decided skill.
// once finished, moves to wait mode.
Game_Event.prototype.basicAIstart = function() {
	this._skill = null;
	this._aiWait = this.getAIwait();
	this._aiMode = 'WAIT';
};

// counts down the aiWait timer for the enemy.
// when ready, moves to ready mode.
Game_Event.prototype.basicAIwait = function() {
	if (this._aiWait > 0) {
		this._aiWait--;
		this.holdDistance();
	}
	else {
		this._aiMode = 'READY';
	}
};

// decides whether or not the target is too strong to fight.
// if it is, flees from the target, otherwise moves to decide mode.
Game_Event.prototype.basicAIready = function() {
	var diff = $gameParty.leader().level - $dataEnemies[this._battlerId].level;
	if (diff > 9 && this._canFlee) {
		this._aiMode = 'FLEE';
		return;
	}
	this._aiMode = 'DECIDE';
};

// makes the decision here as to what skill should be used.
// then moves to reposition mode if not in range of skill.
Game_Event.prototype.basicAIdecide = function() {
	var skill = this.decideSkill(this.charaId());
	this._skillDecided = skill;
	this._aiMode = 'REPOSITION';
};

// if not in range to use decided skill, get closer, or move to attack mode.
Game_Event.prototype.basicAIreposition = function() {
	if (!this._skillDecided)
		this._aiMode = 'DECIDE';
	if (this._skillDecided == null || this._skillDecided == undefined) return;
	var targets = QABSManager.skillWillHit(this._skillDecided, this.charaId());
	if (targets.length < 1) {
		this.closeDistance();
	}
	else {
		this._aiMode = 'ATTACK';
	}
};

// execute "best action".
// reset back to wait time.
Game_Event.prototype.basicAIattack = function() {
	var skill = this._skillDecided;
	if (skill == null || skill === undefined) return;
	this.turnTowardCharacter(this.bestTarget());
	skill._target = this.bestTarget();
	this.useSkill(skill);
	this._aiMode = 'START';


	
};

// if the difference in levels between target and self is too great, flee!
Game_Event.prototype.basicAIflee = function() {
	this._moveSpeed = this._baseMove + 1;
	this.requestBalloon(6);
	this.holdDistance(400);
	this._balloon = this.wait(90).then(function() {
		this._balloon = null;
		this._aiMode = 'START';
		this._moveSpeed = this._baseMove;
		return;
	}.bind(this));
};

// picks a skill at random from the list of skills available.
Game_Event.prototype.decideSkill = function(userId) {
	var chara = QPlus.getCharacter(userId);
	if (!chara.battler()) return null;
	var targets;
	var skills = chara.usableSkills();
	if (skills.length === 0) return null;
	return skills[Math.floor(Math.random() * skills.length)];
};

// if enemy has special tag in notes, prevent fleeing.
Game_Event.prototype.canFlee = function() {
	// note data of the given enemy AND regexp structure
	var nd = this.battler().enemy().note.split(/[\r\n]+/);
	var rgx = /<noFlee>/i;
	for (var n = 0; n < nd.length; n++) { if (nd[n].match(rgx)) { return false; } }
	return true;

};

// reads the notedata of enemies on creation
// if new _aiWait was provided, overwrites with that instead.
Game_Event.prototype.getAIwait = function() {
	// note data of the given enemy AND regexp structure
	var nd = this.battler().enemy().note.split(/[\r\n]+/);
	var rgx = /<aiWait:(\d+)>/i;
	// custom _aiWait variable
	var customWait = 0;
	// iterate through all the notes to grab it.
	for (var n = 0; n < nd.length; n++) { if (nd[n].match(rgx)) { customWait = Number(RegExp.$1); } }
	if (customWait == 0)
		customWait = QABS.aiWait;
	return customWait;
};