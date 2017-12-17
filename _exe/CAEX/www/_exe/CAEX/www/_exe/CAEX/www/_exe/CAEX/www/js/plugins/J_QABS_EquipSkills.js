/* -------------------------------------------------------------------------- */
// J_QABS_EquipSkills
// V: 1.0

/*:@plugindesc Enables skills for use via hotkeybar.
@author J

@help This plugin implements a hard-coded variant to enable skills attached to
non-weapons for the skillbar.

This needs to be placed beneath QABS itself.
This is designed to work in tandem with the rest of the QABS system.
This was written for me, but I'm uploading it incase others wanted to expand it.
*/
/* -------------------------------------------------------------------------- */

// (modified method)
var j_Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
  j_Game_System_initialize.call(this);
  this._absEquipKeys = {};
};

// (modified new method)
var j_Game_Actor_initEquips = Game_Actor.prototype.initEquips;
Game_Actor.prototype.initEquips = function(equips) {
  j_Game_Actor_initEquips.call(this, equips);
  if (this === $gameParty.leader()) {
    this.updateEquipSkills();
  }
};

// (modified method)
var j_Game_Actor_changeEquip = Game_Actor.prototype.changeEquip;
Game_Actor.prototype.changeEquip = function(slotId, item) {
  j_Game_Actor_changeEquip.call(this, slotId, item);
  this.updateEquipSkills();
};

// (new method)
Game_Actor.prototype.updateEquipSkills = function() {
  if (this !== $gameParty.leader()) return;
  var skillSet = {}; var count = 0;
  // this skillKeys bit is hard-coded, would probably be more versatile if dynamically generated.
  var skillKeys = { "#k":1, "#l":2, "#u":3, "#i":4, "#o":5, "#p":6 };
  var e = $gameParty.leader()._equips;
  e.forEach(function(value, index) {
    if (!value.object()) { return; }
    try {
      if (value.isWeapon()) {
        var sDetails = $dataWeapons[value.object().id].qmeta.skillKeys || $dataWeapons[value.object().item.id].qmeta.absSkills;
        if (!sDetails) return;
        var wSkill = QABS.stringToSkillKeyObj(sDetails);
        skillSet[skillKeys[wSkill[Object.keys(wSkill)[0]].input[0]]] = (wSkill[Object.keys(wSkill)[0]]);
      } 
      else if (value.isArmor()) {
        var sDetails = $dataArmors[value.object().id].qmeta.skillKeys || $dataArmors[value.object().id].qmeta.absSkills;
        if (!sDetails) return;
        var aSkill = QABS.stringToSkillKeyObj(sDetails);
        skillSet[skillKeys[aSkill[Object.keys(aSkill)[0]].input[0]]] = (aSkill[Object.keys(aSkill)[0]]);
      }
    } catch (error) { console.log(error); }
  }, this); // end forEach of equips.
  $gameSystem.changeABSequipSkills(skillSet);
};

// (modified method)
var j_QABS_setupBattler = Game_Player.prototype.setupBattler;
Game_Player.prototype.setupBattler = function() {
  j_QABS_setupBattler.call(this);
  $gameSystem.changeABSequipSkills({});
  this.battler().updateEquipSkills();
};

Game_System.prototype.changeABSequipSkills = function(skillSet) {
  this._absEquipKeys = skillSet;
  this.resetABSKeys();
};

// (modified new method)
Game_System.prototype.resetABSKeys = function() {
  this._absKeys = QABS.getDefaultSkillKeys();
  for (var key in this._absKeys) {
    Object.assign(
      this._absKeys[key],
      this._absClassKeys[key] || {},
      this._absWeaponKeys[key] || {},
      this._absEquipKeys[key] || {},
      this._absOverrideKeys[key] || {}
    );
  }
  this.preloadAllSkills();
  this.checkAbsMouse();
};
