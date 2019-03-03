/* -------------------------------------------------------------------------- */
// J_MapTime
// V: 1.1

/*:@plugindesc Provides functionality for HRG/MRG/TRG while on the map.
@author J

@param useTPregen
@text Use the TP-Stamina system.
@desc Enable/Disable the TP-stamina-like system
@type boolean
@default true

@param useTPforDash
@text Require (and expend) TP to dash.
@desc Enable/Disable to control dashing with TP availability.
@type boolean
@default true

@param flatHealing
@text Flat(true) or Percent(false) healing per HRG/MRG/TRG.
@desc HRG/MRG/TRG are naturally %-based, but this can be flat healing, instead.
@type boolean
@default true

@help This plugin adds the functionality of HP/MP/TP regeneration on the map.
  Ideally, this system would be used in conjunction with an ABS of sorts,
  as it was originally designed to hold hands with qABS, but it does work all
  by itself, too.

MATH BREAKDOWN: actor's HRG = 50(%).
  formula per tick = ((actor.hrg * 100) / 2) / 5;
 ((0.5 * 100) / 2) / 5
 (50 / 2)  / 5
 25 / 5
 5 per tick (1 tick = 30 frames = 0.5 seconds)

In short, the actor will regenerate 1/10 of whatever his HRG/MRG is, per tick.
I opted into making it flatHP instead of %maxHP since % would be pretty op.

NOTE: TRG's regeneration is updated 10x faster (1 tick = 3 frames = 0.05s)
  Currently, it is being used as "stamina".
  Try making a skill cost like, 15 TP or something and use it as a basic
  attack limiter to prevent the player from swinging excessively.
  If you don't like it, you can just turn it off, too.
*/
/* -------------------------------------------------------------------------- */
var Imported = Imported || {};
Imported.J_MapTime = true;

var J = J || {};
J.mapTime = J.mapTime || {};
J.mapTime.Parameters = PluginManager.parameters('J_MapTime');
J.mapTime.useTPregen = String(J.mapTime.Parameters['useTPregen']).toLowerCase() == 'true';
J.mapTime.useTPforDash = String(J.mapTime.Parameters['useTPforDash']).toLowerCase() == 'true';
J.mapTime.flatHealing = String(J.mapTime.Parameters['flatHealing']).toLowerCase() == 'true';

(function() { // start plugin.
/* -------------------------------------------------------------------------- */
//  Game_Map Modifications
//    Handles all the extra variables and adds functionality for the xRG stuff.
/* -------------------------------------------------------------------------- */

  // adds in timing variables for monitoring when to tick the regenerations.
  const _Game_Map_jRegen_initialize = Game_Map.prototype.initialize;
  Game_Map.prototype.initialize = function() {
    _Game_Map_jRegen_initialize.call(this);
    this._timingHPMP = 0;
    this._timingTP = 0;
  };

  // processes the function that provides HRG/MRG/TRG on the map.
  const _Game_Map_jRegen_update = Game_Map.prototype.update;
  Game_Map.prototype.update = function(sceneActive) {
      _Game_Map_jRegen_update.call(this, sceneActive);
      this.regenOnMap();
      this.handleStates();
  };

  // handles the countdown of time for a state.
  Game_Map.prototype.handleStates = function() {
    // for each member of the party
    // for each state
    // reduce _stateSteps by 1
    if ($gameParty.exists()) {
      $gameParty.members().forEach((actor) => {
        actor._states.forEach((state) => {
          let stateTimeLeft = actor._stateSteps[state];
          if (stateTimeLeft <= 0) actor.eraseState(state);
          else actor._stateSteps[state]--;
        })
      })
    }
  };

  //#region TODO: alter .canMove() by state notetags.
  /*
  //==============================
  // * This doesn't work.
  //   supposed to stop people from doing things if they have a state with <stun> in it.
  //==============================
  const _Game_CharacterBase_j_canMove = Game_CharacterBase.prototype.canMove;
  Game_CharacterBase.prototype.canMove = function() {
    // check original method first
    if (!(_Game_CharacterBase_j_canMove.call(this))) { return false; } 

    // then check states
    else if (this.checkStatesForLocked()) { return false; } 

    // if all is good, just return OK.
    else return true;
  };

  Game_CharacterBase.prototype.checkStatesForLocked = function() {
    if (this.battler() === null) return false;
    const structure = /<stun>/i;
    const battler = this.battler();
    if (battler.states().length > 0) {
      battler.states().forEach((state) => {
        let noteData = state.note.split(/[\r\n]+/);
        noteData.forEach((line) => { if (line.match(structure)) { 
          return true;
        }})
      })
    }

    // if no states include the tag in the notes, then it's OK.
    return false;
  }
  */
 //#endregion

  // Checks if party exists, then performs the onMapFX once per 30 frames.
  // Effects are divided into HP+MP, and TP, so that TP can regenerate at
  //   a faster rate for purpose of being like "stamina".
  Game_Map.prototype.regenOnMap = function() {
    let actor = null;
    if ($gameParty != null) { actor = $gameParty.leader(); }
    if (actor) {
      if (this._timingHPMP <= 0) {
        this.doHPMPregen(actor);
        this._timingHPMP = 30;
      }
      else { this._timingHPMP--; }

      if (J.mapTime.useTPregen) {
        if (this._timingTP <= 0) {
          this.doTPregen(actor);
          this._timingTP = 3;
        }
        else { 
          this._timingTP--;
        }
      }
    }
  };

  // Here, HP/MP regeneration is handled based on HRG/MRG.
  // It is significantly slower than TP Regeneration.
  // if "poisoned" state is inflicted, natural regen stops.
  Game_Map.prototype.doHPMPregen = function(actor) {
    var hRegen, mRegen = 0;
    var details = this.isPoisoned(actor);
    if (J.mapTime.flatHealing) {
      hRegen = ((actor.hrg * 100) / 2) / 5;
      mRegen = ((actor.mrg * 100) / 2) / 5;  
    } else {
      if (details && details[0] == "HP") {
        hRegen = (details[1] * 100 / 2 / 5);
      } else {
        hRegen = ((actor.hrg * actor.mhp) / 2) / 5;
      }
      if (details && details[0] == "MP") {
        mRegen = ((details[1] * 100) / 2) / 5;
      } else {
        mRegen = ((actor.mrg * actor.mmp) / 2) / 5;
      }
      if (details && details[0] == "BOTH") {
        hRegen = ((details[1] * 100) / 2) / 5;
        mRegen = ((details[1] * 100) / 2) / 5;
      }
    }
    actor.gainHp(hRegen);
    if (hRegen < 0) actor.startDamagePopup();
    actor.gainMp(mRegen);
    if (mRegen < 0) actor.startDamagePopup();
  };

  // reads notes and determines if the actor is poisoned based on state.
  Game_Map.prototype.isPoisoned = function(actor) {
    var structure = /<poison:(HP|MP|BOTH)>/i;
    var aStates = actor.states();
    var details = [];
    if (aStates.length <= 0) return false;
    for (var i = 0; i < aStates.length; i++) {
      var notedata = aStates[i].note.split(/[\r\n]+/);
      for (var n = 0; n < notedata.length; n++) {
        var line = notedata[n];
        if (line.match(structure)) {
          details = [RegExp.$1, aStates[i].traits[0].value];
          return details;
        }
      }
    }
    return false;
  };

  // this rapidly regenerates the player's TP.
  // and also deplete TP while dashing.
  Game_Map.prototype.doTPregen = function(actor) {
    var mod = 0;
    var tpRegen = (((actor.trg + 0.1) * 100) / 10);
    if (J.mapTime.useTPforDash) {
      mod = Game_Player.prototype.isDashButtonPressed() ? -0.5 : tpRegen;
    }
    actor.gainTp(mod);
  };

  // do nothing and disable MV regeneration
  Game_Battler.prototype.regenerateAll = function() { };

  // this forces the player to be unable to run while out of TP.
  // note: hopefully this is okay since only actor's can dash (?).
  var _Game_CharacterBase_jqmt_realMoveSpeed = Game_CharacterBase.prototype.realMoveSpeed;
  Game_CharacterBase.prototype.realMoveSpeed = function() {
    let actor = null;
    if (J.mapTime.useTPforDash === "true") {
      if ($gameParty.exists()) { actor = $gameParty.leader(); }
      return this._moveSpeed + ((this.isDashing() && actor.tp > 0) ? 1 : 0);
    }
    else { return _Game_CharacterBase_jqmt_realMoveSpeed.call(this); }
  };
/* -------------------------------------------------------------------------- */
//  Window_Base Modification
//    Because floats are innately messy, this is cleans them up visually.
/* -------------------------------------------------------------------------- */

  // this fixes the issue of drawing excessively long decimal numbers
  // in places like the menu that draw gauges for HP/MP.
  var _Window_Base_jqmt_drawCurrentAndMax = Window_Base.prototype.drawCurrentAndMax;
  Window_Base.prototype.drawCurrentAndMax = function(current, max, x, y, width, color1, color2) {
    current = current.toFixed(0);
    _Window_Base_jqmt_drawCurrentAndMax.call(this, current, max, x, y, width, color1, color2);
  };
/* -------------------------------------------------------------------------- */
})(); // end plugin.
