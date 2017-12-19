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