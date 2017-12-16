/* -------------------------------------------------------------------------- */
// J_qABS_Popups
// V: 1.0

/*:@plugindesc A variety of tiny modifications to the popups.
@author J
@help qABSpopupHelp: I added in a bunch of modifications to the qABS popup system
      he had that adds in things like icons and font changing/coloring/etc.

> No commands are used outside of initial setup.

*/
var Imported = Imported || {};
Imported.J_qABS_Popups = true;

var J = J || {};
J.qABS_Popups = J.qABS_Popups || {};


/* -------------------------------------------------------------------------- */
//    qABS Damage Pop-up Modifications
// As suggested by the title, this adds in various little Modifications
// globally for all damage dealt and recieved such as FONT changes, ICONS
// based on damage type, and modified COLORing.
/* -------------------------------------------------------------------------- */
  J.qABS_Popups.Font =         "Roboto Mono";
  J.qABS_Popups.normalDamage = "white";
  J.qABS_Popups.normalHeal =   "lime";
  J.qABS_Popups.magicDamage =  "fuchsia";
  J.qABS_Popups.magicHeal =    "pink";
  J.qABS_Popups.criticalHit =  "orange";
  J.qABS_Popups.vocab_miss =   "Missed!";
  J.qABS_Popups.vocab_dodge =  "Dodged!";
  J.qABS_Popups.icon_physDmg = 77;
  J.qABS_Popups.icon_magiDmg = 78;
  J.qABS_Popups.icon_healing = 72;
  J.qABS_Popups.icon_crit    = 118;

// appears to be where the actual movement of the damage sprites occurs
Sprite_Character.prototype.updateDamagePopup = function() {
  this.setupDamagePopup();
  if (this._battler._damageQueue.length > 0) {
    for (var i = 0; i < this._battler._damageQueue.length; i++) {
      this._battler._damageQueue[i].x = this._battler._damageQueue[i].realX;
      this._battler._damageQueue[i].x -= $gameMap.displayX() * $gameMap.tileWidth();
      this._battler._damageQueue[i].y = this._battler._damageQueue[i].realY;
      this._battler._damageQueue[i].y -= $gameMap.displayY() * $gameMap.tileHeight();
    }
    if (!this._battler._damageQueue[0].isPlaying()) {
      this.parent.removeChild(this._battler._damageQueue[0]);
      this._battler._damageQueue[0] = null;
      this._battler._damageQueue.shift();
    }
  }
};

// All of the details regarding the visual setup of the damage sprite
Sprite_Character.prototype.setupDamagePopup = function() {
  if (!this._battler) return;
  if (!Imported.QuasiPopup) return;
  if (this._character._noPopup) return;
  if (!QuasiABS.showDmg) return;
  if (this._battler._battler._damageQueue.length > 0) {
    var time = Graphics.frameCount;
    var wait = this._battler._battler._damageQueue.length / 15;
    if (time - this._lastDamageRequest < wait) {
      // Makes it so only 1 dmg pop up per X frames
      return;
    }
    this._lastDamageRequest = time;
    var sprite = new Sprite_QuasiPopup();
    sprite.x = sprite.realX = this._character.cx();
    sprite.y = sprite.realY = this._character.cy() - this.height + 20;
    var string;
    var style = {};
    var result = this._battler._battler._damageQueue.shift();
    var iconPhys = "<icon:" + J.qABS_Popups.icon_physDmg + ">";
    var iconMagi = "<icon:" + J.qABS_Popups.icon_magiDmg + ">";
    var iconHeal = "<icon:" + J.qABS_Popups.icon_healing + ">";
    var iconCrit = "<icon:" + J.qABS_Popups.icon_crit + ">";
    style.fontFamily = J.qABS_Popups.Font;
  // attack misses or is evaded
    if (result.missed) {
      string = J.qABS_Popups.vocab_miss;
    }
    else if (result.evaded) {
      string = J.qABS_Popups.vocab_dodge;
    }
  // HP is either damaged or healed
    else if (result.hpAffected) {
      var dmg = result.hpDamage;
      if (dmg >= 0) {
        if (result.physical) { string = iconPhys + dmg; } // is physical
        else { string = iconMagi + dmg; }                 // is magical
        style.fill = J.qABS_Popups.normalDamage;
      }
      else {
        string = iconHeal + Math.abs(dmg);
        style.fill = J.qABS_Popups.normalHeal;
      }
    }
  // MP is either damaged or healed
    else if (result.mpDamage) {
      var dmg = result.mpDamage;
      if (dmg >= 0) {
        if (result.physical) { string = iconPhys + dmg; } // is physical
        else { string = iconMagi + dmg; }                 // is magical
        style.fill = J.qABS_Popups.magicDamage;
      }
      else {
        string = iconHeal + Math.abs(dmg);
        style.fill = J.qABS_Popups.magicHeal;
      }
    }

    // if an icon is included for the state
    if (!string && string != 0) return;
    string = String(string);
    var iconIndex = result.damageIcon;
    if (iconIndex) {
      string = "<icon:" + iconIndex + ">" + string;
    }

    // if attack is CRITICAL
    if (result.critical) {
      style.fill = J.qABS_Popups.criticalHit;
      //style.fontFamily = "Roboto Mono";
      style.fontSize = 40;
      style.fontWeight = "bold";
      //style.fontStyle = "italic";
    }
    settings = {};
    var fadeout = "0 120 fastFade";
    var slideup = "0 120 bounce";
    settings.transitions = [fadeout, slideup];
    settings.critical = result.critical;
    settings.charaId = this._character === $gamePlayer ? 0 : this._character.eventId();
    sprite.setup(string, style, settings);
    this._battler._damageQueue.push(sprite);
    this.parent.addChild(sprite);
    this._battler.clearDamagePopup();
    this._battler.clearResult();
  }
};

// adds more custom effects to what a damage sprite can do.
var _Sprite_QuasiPopup_jfx_processAction = Sprite_QuasiPopup.prototype.processAction;
Sprite_QuasiPopup.prototype.processAction = function(action) {
  _Sprite_QuasiPopup_jfx_processAction.call(this, action);
  switch (action[0].toLowerCase()) {
    case "bounce":
      this.bounce(action);
      break;
    case "fastfade":
      this.fastFade(action);
      break;
  }
};
    //var fx_name = "a b c d"
    // a=how long till it starts
    // b=how long it lasts, counting UP TO THIS NUMBER
    // c=the name of the transition
    // d=how far it travels.

Sprite_QuasiPopup.prototype.fastFade = function(action) {
  var duration = Number(action[1]);
  if (this.duration > duration - 10) {
    this.opacity -= 25;
  }
};

var _Sprite_QuasiPopup_jfx_initialize = Sprite_QuasiPopup.prototype.initialize;
Sprite_QuasiPopup.prototype.initialize = function() {
  _Sprite_QuasiPopup_jfx_initialize.call(this);
  this.now_y_speed = (getRndInteger(3,5)) + 2;
  this.now_x_speed = (getRndInteger(1,3)) + 1;
  this.potential_y_energy = 0;
  this.potential_x_energy = 0;
};

Sprite_QuasiPopup.prototype.bounce = function(action) {
  var duration = Number(action[1]);
  var n = (this._oy + this.now_y_speed);
  if (n <= 0) {
    this.now_y_speed *= -1
    this.now_y_speed /=  2
    this.now_x_speed /=  2
  }
  this._oy = Math.max(n, 0);
  this.potential_y_energy += 0.58;
  var speed = Math.floor(this.potential_y_energy);
  this.now_y_speed -= speed;
  this.potential_y_energy -= speed;
  this.potential_x_energy -= this.now_x_speed;
  speed = Math.floor(this.potential_x_energy);
  this._ox += speed;
  this.potential_x_energy -= speed;
};

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
