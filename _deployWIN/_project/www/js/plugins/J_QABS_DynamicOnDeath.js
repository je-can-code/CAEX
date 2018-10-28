/* -------------------------------------------------------------------------- */
// J_QABS_DynamicOnDeath
// V: 1.0

/*:@plugindesc Allows for assignment of javascript execution on a per-event
                basis via comments, rather than in DB.
@author J

@help This will allow you to add an OnDeath effect to a specific event,
      regardless the enemy, so you can have a specific slime do something rather
      than ALL slimes.

      Just wrap your JS code in:
      <ond> code goes here </ond>

This needs to be placed beneath QABS itself.
This is designed to work in tandem with the rest of the QABS system.
This was written for me, but I'm uploading it incase others wanted to expand it.
*/
/* -------------------------------------------------------------------------- */
var _Game_Enemy_jdynamicOndeath_setup = Game_Enemy.prototype.setup;
Game_Enemy.prototype.setup = function(enemyId, x, y) {
  _Game_Enemy_jdynamicOndeath_setup.call(this, enemyId, x, y);
  this._dynamicOndeath = '';
};

var _Game_Event_jdynamicOndeath_setupBattler = Game_Event.prototype.setupBattler;
Game_Event.prototype.setupBattler = function() {
  _Game_Event_jdynamicOndeath_setupBattler.call(this);
  var foe = /<enemy:([0-9]*?)>/i.exec(this.notes());
  if (foe) {
    var ond = /<ond>([\s\S]*)<\/ond>/i.exec(this.comments());
    if (ond != null) {
      this._dynamicOndeath = ond[1];
    }
  }
}

var _Game_Event_jdynamicOndeath_OnDeath =   Game_Event.prototype.onDeath;
Game_Event.prototype.onDeath = function() {
  if (this._dynamicOndeath) {
    try {
      eval(this._dynamicOndeath);
      
    }
    catch (err) {
      var id = this.battler()._enemyId;
      console.error('Error with `dynamicOndeath` inside enemy ' + id, err);
    }
  }
  _Game_Event_jdynamicOndeath_OnDeath.call(this);
}