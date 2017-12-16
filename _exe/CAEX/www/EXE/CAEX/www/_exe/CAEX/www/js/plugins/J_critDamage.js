/* -------------------------------------------------------------------------- */
// J_critDamage
// V: 1.0
//
/*:@plugindesc Creates new paramters: CDM/CDR for crit damage manipulation.
@author Jpoop
@help This plugin uses newly created parameters for allies and enemies to
        calculate crit damage multipliers/reductions.

        Use:
        <cdm:+/-x>
        <cdr:+/-x>

        for crit damage multiplier(cdm) or crit damage reduction(cdr).

        Example:
        <cdm:+175>
        <cdr:+25>

        Notes can be placed in many places.
        Base parameter: actor/enemy page.
        bonus parameter (adds with others): class, equipment, states

        if no base is defined, base will default to 1.5.
        bonuses will add together.
        use whole numbers like 150 for 1.5x, or 75 for 0.75x.
*/
/* -------------------------------------------------------------------------- */
// Base Formula for critical hits.
// Gauges attacker's crit damage boost vs target's crit damage reduction
Game_Action.prototype.applyCritical = function(damage) {
  var attacker = this.subject();
  if (attacker.cdm > 0)
    var critDamageRatio = attacker.cdm;
  else
    var critDamageRatio = 1.5;
  return damage * critDamageRatio;
};

var _Game_Action_jCritDmg_mdv = Game_Action.prototype.makeDamageValue;
Game_Action.prototype.makeDamageValue = function(target, critical) {
   var originalDmg = _Game_Action_jCritDmg_mdv.call(this, target, critical);
   if (critical) {
     var modDmg = originalDmg * (1 - target.cdr);
   }
   return Math.round(originalDmg);
};


/* -------------------------------------------------------------------------- */
// The core for defining new parameters and how they are handled.
//   0 = CDM aka Crit Damage Modifier
//   1 = CDR aka Crit Damage Reduction
Object.defineProperties(Game_BattlerBase.prototype, {
    cdm: { get: function() { return this.jparam(0); }, configurable: true },
    cdr: { get: function() { return this.jparam(1); }, configurable: true },
});

/* -------------------------------------------------------------------------- */
// The baseline for new parameters.
Game_BattlerBase.prototype.jparam = function(paramId) {
  switch (paramId) {
    case 0: // cdm: crit damage modifier
      return 50; // base of 50% damage boost for landing critical hits.
    case 1: // cdr: crit damage reduction
      return 0; // base of 0% damage reduction vs critical hits.
    default: return 0; // just in case.
  }
};

/* -------------------------------------------------------------------------- */
// Provides a RegEx structure for provided parameter IDs.
Game_Battler.prototype.jParamGetStructure = function(paramId) {
  switch (paramId) {
    case 0: var structure = /<cdm:(\-?\+?)(\d+)>/i; break;
    case 1: var structure = /<cdr:(\-?\+?)(\d+)>/i; break;
    default: var structure = ""; break;
  }
  return structure;
};

/* -------------------------------------------------------------------------- */
// Gets the base from actors/enemies if they have a different baseline.
// Reads the notes off of actors/enemies and replaces baseline with that.
Game_Battler.prototype.jParamBase = function(battler, paramId) {
  var total = 0;
  var structure = "";
  switch (paramId) {
    case 0:
      total = Game_BattlerBase.prototype.jparam.call(this, 0);
      structure = /<cdm:(\d+)>/i;
      break;
    case 1:
      total = Game_BattlerBase.prototype.jparam.call(this, 1);
      structure = /<cdr:(\d+)>/i;
      break;
    default: break;
  }
  var item = battler;
  var notedata = item.note.split(/[\r\n]+/);
  for (var n = 0; n < notedata.length; n++) {
    var line = notedata[n];
    if (line.match(structure)) { total = Number(RegExp.$1); }
  }
  return total;
};

/* -------------------------------------------------------------------------- */
// Specific handling for an Actor's new parameters.
// Fetches the baseline, then adds up the bonuses and returns the total.
// For actors, it is base + (equips + class + states).
Game_Actor.prototype.jparam = function(paramId) {
  var total = 0;
  var base = Game_Battler.prototype.jParamBase.call(this, this.actor(), paramId);
  var bonus = 0;
  bonus += this.jParamFromClass(paramId);
  bonus += this.jParamFromEquips(paramId);
  bonus += this.jParamFromState(paramId);
  total = (base + bonus) / 100; // divide by 100 to get decimal multiplier.
  return total;
};

/* -------------------------------------------------------------------------- */
// Reads the notes of each piece of equipment an actor is wearing
// and gives back the details based on the parameter in question.
Game_Actor.prototype.jParamFromEquips = function(paramId) {
  var total = 0;
  var structure = this.jParamGetStructure(paramId);
  for (var n = 0; n < this.equips().length; n++) {
    if (this.equips()[n] === null) continue;
    var eid = this.equips()[n].id;
    if (DataManager.isWeapon(this.equips()[n])) { var item = $dataWeapons[eid]; }
    else { var item = $dataArmors[eid]; }
    var notedata = item.note.split(/[\r\n]+/);
    for (var o = 0; o < notedata.length; o++) {
      var line = notedata[o];
      if (line.match(structure)) {
        total += parseInt((RegExp.$1)+(RegExp.$2));
      }
    }
  }//equips
  return total;
};

/* -------------------------------------------------------------------------- */
// Reads the notes of the actor's class
// and gives back the details based on the parameter in question.
Game_Actor.prototype.jParamFromClass = function(paramId) {
  var total = 0;
  var structure = this.jParamGetStructure(paramId);
  var item = this.currentClass();
  var notedata = item.note.split(/[\r\n]+/);
  for (var n = 0; n < notedata.length; n++) {
    var line = notedata[n];
    if (line.match(structure)) {
      total = parseInt((RegExp.$1)+(RegExp.$2));
    }
  }
  return total;
};

/* -------------------------------------------------------------------------- */
// Reads the notes of the actor/enemy 's current list of states
// and gives back the details based on the parameter in question.
Game_Battler.prototype.jParamFromState = function(paramId) {
  var total = 0;
  var structure = this.jParamGetStructure(paramId);
  var statesList = this.states();
  for (var i = 0; i < statesList.length; i++) {
    var item = statesList[i];
    var notedata = item.note.split(/[\r\n]+/);
    for (var n = 0; n < notedata.length; n++) {
      var line = notedata[n];
      if (line.match(structure)) {
        total += parseInt((RegExp.$1)+(RegExp.$2));
      }
    }
  }
  return total;
};

/* -------------------------------------------------------------------------- */
// Specific handling for an Enemy's new parameters.
// Fetches the baseline, then adds up the bonuses and returns the total.
// For enemies, it is base + (states).
Game_Enemy.prototype.jparam = function(paramId) {
  var total = 0;
  var base = Game_Battler.prototype.jParamBase.call(this, this.enemy(), paramId);
  var bonus = Game_Battler.prototype.jParamFromState.call(this, paramId);
  total = (base + bonus) / 100; // divide by 100 to get decimal multiplier.
  return total;
};
