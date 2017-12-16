/* -------------------------------------------------------------------------- */
// J_Elementalistics
// V: 1.0
//

/*:@plugindesc Grants elemental affinity bonuses for calculating damage. See Help.
@author J

@help More specifically, this plugin grants actors a new "stat" of sorts that
        acts as an amplifier for elemental damage. It hooks into the
        "Game_Action.prototype.calcElementRate" function, and multiplies the
        result by said elemental amplifier based on category:
        actor/class/equip/state of notetags.

        Structure of notetag:
        <eATK:eID:amp>

        where
        eID = the ID of the element you want to affect.
        amp = percent bonus of the above element, this can be negative.

        example:
        <eATK:1:200>

        translates to:
        Element ID of 1 (slash element) gains +200% bonus damage for all skills.

        By default, if you set nothing, all elements get "100" granted to each
        element in the base(actor) category, and "0" granted to each element in
        all of the bonus(class/equip/state) categories.

        This stacks additively with other notetags across other categories.
        example math:
        if you have <eATK:1:50> in a class,
        <eATK:1:-10> on an weapon,
        <eATK:1:25> on an armor,
        and <eATK:1:100> on an afflicted state,
        the result is:
        100(base) + 50(class) - 10(wpn) + 25(arm) + 100(state) = 275.
        Using any skill that shares the element ID of 1 will deal 275% base
        damage against the target.

        Note: Enemies do not use or benefit from this feature.
*/
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
var J = J || {}; J.Elementalistic = J.Elementalistic || {};

/* -------------------------------------------------------------------------- */
// a simple function that returns an array full of 0's,
// one for each element in the database.
J.Elementalistic.initElements = function() {
  var arr = {};
  for (var e = 0; e < $dataSystem.elements.length; e++) { arr[e] = 0; }
  return arr;
};
(function() { // start plugin.
/* -------------------------------------------------------------------------- */
// Called on actor creation.
// This sets up the two arrays used for handling elemental amplification.
// The first is used for an actor's base elements, second for all the bonuses.
var _Game_Actor_jElem_setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actorId) {
    _Game_Actor_jElem_setup.call(this, actorId);
    this._elemAmpBase = this.getActorElements(actorId);
    this._elemAmpPlus = {};
};

/* -------------------------------------------------------------------------- */
// The baseline setup for an actor's elemental affinities.
// Bonuses stack ontop of these baselines.
// If no baseline is designated for a given element, it defaults to 100(1.0x).
Game_Actor.prototype.getActorElements = function(id) {
  var structure = /<eATK:(\d+):(\d+)>/i;
  var actor = $dataActors[id];
  var notedata = actor.note.split(/[\r\n]+/);
  var eATK = {};
  for (var e = 0; e < $dataSystem.elements.length; e++) { eATK[e] = 100; }
  for (var n = 0; n < notedata.length; n++) {
    var line = notedata[n];
    if (line.match(structure)) {
      eATK[Number(RegExp.$1)] = Number(RegExp.$2);
    }
  }
  return eATK;
};

/* -------------------------------------------------------------------------- */
// Bonuses part 1: Equipment.
// Skims all notes of each of the actor's equipment, adding to the bonus array.
Game_Actor.prototype.getEquipElements = function() {
  var eATK_equips = J.Elementalistic.initElements();
  var structure = /<eATK:(\d+):(\-?\+?)(\d+)>/i;
  for (var n = 0; n < this.equips().length; n++) {
    if (this.equips()[n] === null)
      continue;
    var eid = this.equips()[n].id;
    if (DataManager.isWeapon(this.equips()[n])) {var item = $dataWeapons[eid];}
    else { var item = $dataArmors[eid];}
    var notedata = item.note.split(/[\r\n]+/);
    for (var o = 0; o < notedata.length; o++) {
      var line = notedata[o];
      if (line.match(structure)) {
        eATK_equips[Number(RegExp.$1)] += parseInt((RegExp.$2)+(RegExp.$3));
      }
    }
  }
  return eATK_equips;
};

/* -------------------------------------------------------------------------- */
// Bonuses part 2: Classes.
// Skims the note of the actor's class, adding to the bonus array.
Game_Actor.prototype.getClassElements = function() {
  var eATK_classes = J.Elementalistic.initElements();
  var structure = /<eATK:(\d+):(\-?\+?)(\d+)>/i;
  var item = this.currentClass();
  var notedata = item.note.split(/[\r\n]+/);
  for (var n = 0; n < notedata.length; n++) {
    var line = notedata[n];
    if (line.match(structure)) {
      eATK_classes[Number(RegExp.$1)] = parseInt((RegExp.$2)+(RegExp.$3));
    }
  }
  return eATK_classes;
};

/* -------------------------------------------------------------------------- */
// Bonuses part 3: States.
// Skims all notes of the actor's active states, adding to the bonus array.
Game_Actor.prototype.getStateElements = function() {
  var eATK_states = J.Elementalistic.initElements();
  var structure = /<eATK:(\d+):(\-?\+?)(\d+)>/i;
  var statesList = this.states();
  for (var i = 0; i < statesList.length; i++) {
    var item = statesList[i];
    var notedata = item.note.split(/[\r\n]+/);
    for (var n = 0; n < notedata.length; n++) {
      var line = notedata[n];
      if (line.match(structure)) {
        eATK_states[Number(RegExp.$1)] = parseInt((RegExp.$2)+(RegExp.$3));
      }
    }
  }
  return eATK_states;
};

/* -------------------------------------------------------------------------- */
// This is where extra notes like equipment/classes/etc is read.
Game_Actor.prototype.getElementPlus = function() {
  this._elemAmpPlus = {};
  var eqEle = this.getEquipElements();
  var clEle = this.getClassElements();
  var stEle = this.getStateElements();
  for (var i = 0; i < $dataSystem.elements.length; i++) {
    var temp = 0;
    temp += eqEle[i]; // equip element bonuses
    temp += clEle[i]; // class element bonuses
    temp += stEle[i]; // state element bonuses
    this._elemAmpPlus[i] = temp;
  }
}

/* -------------------------------------------------------------------------- */
// Here is where the actor's elemental affinity bonuses are calculated.
// This location was chosen as lowest common denominator.
var _Game_Actor_jelem_refresh = Game_Actor.prototype.refresh;
Game_Actor.prototype.refresh = function() {
  _Game_Actor_jelem_refresh.call(this);
  this.getElementPlus();
};

/* -------------------------------------------------------------------------- */
// This is the method that performs the multiplication to determine the amp.
// Either one of two things happen here:
// 1.) "normal attack" is selected, where it will look at the actor who is
//      using the skill, and average all of their attack elemental amps.
// 2.) the skill has an element, so it will take the user's elemental amp
//      for that element based on all the sources, and return the amp.
// NOTE: this always returns 1.0 amp for enemies.
Game_Action.prototype.elementAmpRate = function(user, se) {
  var result = 1;
  if (user._enemyId > 0) // if the user is an enemy, return 1.0 amp.
    return result;
  if (se === -1) { // if "normal attack" element selected:
    var userElements = user.attackElements();
    var total = 0;
    for (var i = 0; i < userElements.length; i++) {
      total += user._elemAmpBase[userElements[i]];
      total += user._elemAmpPlus[userElements[i]];
    }
    result = (total / userElements.length) / 100;
  }
  else { // if designated skill has a designated element:
    result = (user._elemAmpBase[se] + user._elemAmpPlus[se]) / 100;
  }
  console.log(user._elemAmpBase[se] + " base");
  console.log(user._elemAmpPlus[se] + " plus");
  return result;
};

/* -------------------------------------------------------------------------- */
// This modifies the existing elemental calculation to accommodate
// my new changes of "amplification".
var _Game_Action_jElem_calcElementRate = Game_Action.prototype.calcElementRate;
Game_Action.prototype.calcElementRate = function(target) {
  var amp = this.elementAmpRate(this.subject(), this.item().damage.elementId);
  return (_Game_Action_jElem_calcElementRate.call(this, target) * amp);
};
/* -------------------------------------------------------------------------- */
})(); // end plugin.
