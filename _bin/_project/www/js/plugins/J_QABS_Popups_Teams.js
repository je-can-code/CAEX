/* -------------------------------------------------------------------------- */
// J_QABS_Popups_Teams
// V: 1.2
//
/*:@plugindesc Differentiates team popups.
@author J

@help Now, each team gets their own popup (of the defaults):
        -NU is appended for team 0.
        -PL is appended for team 1.
        -EN is appended for team 2.

*/

// for differentiating PLAYER vs ENEMY popups
Sprite_Character.prototype.setupDamagePopup = function() {
  if (!Imported.QPopup || this._character._noPopup) return;
  if (this._battler._damageQueue.length > 0) {
    var string;
    var fill = '#ffffff';
    var result = this._battler._damageQueue.shift();
    var type = 'DMG';
    if (result.missed || result.evaded) {
      string = 'Missed';
      type = 'MISSED';
    } else if (result.hpAffected) {
      var dmg = result.hpDamage;
      string = String(Math.abs(dmg));
      if (dmg >= 0) {
        type = 'DMG';
      } else {
        type = 'HEAL';
      }
    } else if (result.mpDamage) {
      string = String(result.mpDamage);
      type = 'MP';
    }
    if (!string && string !== '0') return;
    var iconIndex = result.damageIcon;
    if (iconIndex) {
      string = '\\I[' + iconIndex + ']' + string;
    }
    if (result.critical) {
      type += '-CRIT';
    }
    if (type.includes('DMG')) {
      switch (this._character.team()) {
        case 0: // Neutral
          type += '-NU';
          break;
        case 1: // Player's team
          type += '-PL';
          break;
        case 2: // Enemy's team
          type += '-EN';
          break;
        default: break; // 3+ requires unique handling.
      }
    }
    QABSManager.startPopup('QABS-' + type, {
      string: string,
      oy: this._battler._popupOY,
      bindTo: this._character.charaId(),
      duration: 80
    });
    this._battler.clearDamagePopup();
    this._battler.clearResult();
  }
};

// also updated to include an icon for experience on gain.
Game_Event.prototype.onDeath = function() {
  if (this._onDeath) {
    try {
      eval(this._onDeath);
    } catch (e) {
      var id = this.battler()._enemyId;
      console.error('Error with `onDeath` meta inside enemy ' + id, e);
    }
  }
  if (this._agroList[0] > 0) {
    var exp = this.battler().exp();
    $gamePlayer.battler().gainExp(exp);
    if (Imported.J_Base) {
      var xIcon = J.Icon.EXP_icon;
    }
    if (exp > 0) {
      QABSManager.startPopup('QABS-EXP', {
        x: $gamePlayer.cx(), y: $gamePlayer.cy(),
        string: '\\I[' + xIcon + ']' + exp
      });
    }
    this.setupLoot();
  }
  this.clearABS();
  this._respawn = Number(this.battler().enemy().meta.respawn) || -1;
  this._isDead = true;
  if (!this._dontErase) this.erase();
};