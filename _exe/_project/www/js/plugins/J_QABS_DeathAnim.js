/* -------------------------------------------------------------------------- */
// J_QABS_DeathAnim
// V: 1.2
//
/*:@plugindesc Adds in an animation from the database when an enemy is defeated.
@author J

@help Use <death anim:ID> to create an on-the-map animation when a given enemy
        dies. If no animation ID is specified, nothing will be played.

*/
// extension of new method
var j_Game_Event_onDeath = Game_Event.prototype.onDeath;
Game_Event.prototype.onDeath = function() {
	this.deathAnimation();
	j_Game_Event_onDeath.call(this);
};

// new method
Game_Event.prototype.deathAnimation = function() {
	if (this._aiPathfind)	this.clearPathfind();
	var deathAnimId = 0;
	var nd = this.battler().enemy().note.split(/[\r\n]+/);
	var rgx = /<death anim:(\d+)>/i;
	for (var n = 0; n < nd.length; n++) { if (nd[n].match(rgx)) { deathAnimId = Number(RegExp.$1); } }
	if (deathAnimId > 0) {
		var x = this.x;
		var y = this.y;
		if (QMovement) {
			x *= QMovement.tileSize;
			y *= QMovement.tileSize;
		}
		QABSManager.startAnimation(deathAnimId, x, y);
	} else
		return;
};