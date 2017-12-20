
  Game_Battler.prototype.updateStateSteps = function(state) {
    if (!state.removeByWalking) return;
    if (this._stateSteps[state.id] >= 0) {
      if (this._stateSteps[state.id] % this.stepsForTurn() === 0) {
        this.onTurnEnd();
				this.result().damageIcon = $dataStates[state.id].iconIndex;
				this.result().words = ' added!';
        //this.startDamagePopup();
        if (this._stateSteps[state.id] === 0) this.removeState(state.id);
      }
      this._stateSteps[state.id]--;
    }
  };

  Sprite_Character.prototype.setupDamagePopup = function() {
    if (!Imported.QPopup || this._character._noPopup) return;
    if (this._battler._damageQueue.length > 0) {
      var string;
      var fill = '#ffffff';
      var result = this._battler._damageQueue.shift();
      var type = 'DMG';
      var dur = 0;
      if (result.missed || result.evaded) {
        string = 'Missed';
        type = 'MISSED';
      } else if (result.hpAffected) {
        var dmg = result.hpDamage;
        string = String(Math.abs(dmg));
        if (dmg >= 0) { type = 'DMG'; } 
        else { type = 'HEAL'; }
      } else if (result.mpDamage) {
        string = String(result.mpDamage);
        type = 'MP';
      }
      if (!string && string !== '0') return;
      var iconIndex = result.damageIcon;
      if (iconIndex) {
        console.log(result.words);
        string = '\\I[' + iconIndex + ']' + result.words;//string;
        dur = 60;
      }
      if (result.critical) {
        type += '-CRIT';
      }
      if (dur == 0)
        dur = 80;
      QABSManager.startPopup('QABS-' + type, {
        string: string,
        oy: this._battler._popupOY,
        bindTo: this._character.charaId(),
        duration: dur
      });
      this._battler.clearDamagePopup();
      this._battler.clearResult();
    }
  };

  var j_Game_ActionResult_clear = Game_ActionResult.prototype.clear;
  Game_ActionResult.prototype.clear = function() {
    j_Game_ActionResult_clear.call(this);
    this.words = '';
};