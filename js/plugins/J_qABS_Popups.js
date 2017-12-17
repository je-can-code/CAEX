Game_Actor.prototype.displayLevelUp = function(newSkills) {
  QABSManager.startPopup('QABS-LEVEL', {
    x: $gamePlayer.cx(),
    y: $gamePlayer.cy(),
    string: 'Level Up!'
  })
  QABSManager.startAnimation(QABS.levelAnimation, $gamePlayer.cx(), $gamePlayer.cy());
};

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
    if (exp > 0) {
      QABSManager.startPopup('QABS-EXP', {
        x: $gamePlayer.cx(), y: $gamePlayer.cy(),
        string: 'Exp: ' + exp
      });
    }
    this.setupLoot();
  }
  this.clearABS();
  this._respawn = Number(this.battler().enemy().meta.respawn) || -1;
  this._isDead = true;
  if (!this._dontErase) this.erase();
};

Game_Loot.prototype.collectDrops = function() {
  if (QABS.aoeLoot) {
    return this.aoeCollect();
  }
  if (this._loot) $gameParty.gainItem(this._loot, 1);
  if (this._gold) $gameParty.gainGold(this._gold);
  var string = this._gold ? String(this._gold) : this._loot.name;
  if (this._iconIndex) {
    string = '\\I[' + this._iconIndex + ']' + string;
  }
  QABSManager.startPopup('QABS-ITEM', {
    x: this.cx(), y: this.cy(),
    string: string
  });
  this.erase();
  QABSManager.removeEvent(this);
  QABSManager.removePicture(this._itemIcon);
};