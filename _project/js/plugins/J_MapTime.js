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

@param useFlatHealing
@text Flat(true) or Percent(false) healing per HRG/MRG/TRG.
@desc HRG/MRG/TRG are naturally %-based, but this can be flat healing, instead.
@type boolean
@default true

@param interval_for_HP_MP
@text How many times per second should the healing happen?
@desc This is purely for how many times, and not how much.
@type number
@default 5

@param interval_for_TP
@text How many times per second should the TP regen happen?
@desc This is purely for how many times, and should be high if using as stamina.
@type number
@default 20

@param reducer_for_HP_MP
@text HP/MP math reduction.
@desc How many seconds need to pass before HP/MP has regenerated equal to HRG/MRG.
@type number
@default 5

@help This plugin adds the functionality of HP/MP/TP regeneration on the map.
  Ideally, this system would be used in conjunction with an ABS of sorts,
  as it was originally designed to hold hands with qABS, but it does work all
  by itself, too.
*/
/* -------------------------------------------------------------------------- */
var Imported = Imported || {};
Imported.J_MapTime = true;

var J = J || {};
J.mapTime = J.mapTime || {};
J.mapTime.Parameters = PluginManager.parameters('J_MapTime');
J.mapTime.useTPregen = String(J.mapTime.Parameters['useTPregen']).toLowerCase() == 'true';
J.mapTime.useTPforDash = String(J.mapTime.Parameters['useTPforDash']).toLowerCase() == 'true';
J.mapTime.useFlatHealing = String(J.mapTime.Parameters['useFlatHealing']).toLowerCase() == 'true';

J.mapTime.INTERVAL_HPMP = Number(J.mapTime.Parameters['interval_for_HP_MP']);
J.mapTime.INTERVAL_TP = Number(J.mapTime.Parameters['interval_for_TP']);
J.mapTime.REDUCER = Number(J.mapTime.Parameters['reducer_for_HP_MP']);

J.mapTime.timer_hpmp = 0; // internal timer for tracking HP/MP ticks.
J.mapTime.timer_tp = 0; // internal timer for tracking TP ticks.

// returns the result of math generating an interval for map stat ticks.
J.mapTime.HPMP_Interval = () =>  Math.round(60 / J.mapTime.INTERVAL_HPMP);
J.mapTime.HPMP_Factor = () => (1 / J.mapTime.INTERVAL_HPMP) / J.mapTime.REDUCER;
J.mapTime.TP_Interval = () =>  Math.round(60 / J.mapTime.INTERVAL_TP);
J.mapTime.TP_Factor = () => 1 / J.mapTime.INTERVAL_TP;

// tick methods that pass time and/or regenerate hp/mp/tp
J.mapTime.HPMP_Tick = () => {
  if (J.mapTime.timer_hpmp === 0) {
    J.mapTime.timer_hpmp = J.mapTime.HPMP_Interval();
    return true;
  } 
  else {
    J.mapTime.timer_hpmp--;
    return false;
  }
};

J.mapTime.TP_Tick = () => {
  if (J.mapTime.timer_tp === 0) {
    J.mapTime.timer_tp = J.mapTime.TP_Interval();
    return true;
  } 
  else {
    J.mapTime.timer_tp--;
    return false;
  }
};

// Regenerate HP/MP while not poisoned.
J.mapTime.doHPMPregen = target => {
  let hRegen, mRegen = 0;
  const details = J.mapTime.isPoisoned(target);
  const rate = J.mapTime.HPMP_Factor();
  if (J.mapTime.useFlatHealing) {
    hRegen = (target.hrg * 100);
    mRegen = (target.mrg * 100);  
  } else {
    if ((details && details[0] == "HP")) {
      hRegen = (details[1] * target.mhp);
    } else {
      hRegen = (target.hrg * target.mhp);
    }
    if (details && details[0] == "MP") {
      mRegen = (details[1] * target.mmp);
    } else {
      mRegen = (target.mrg * target.mmp);
    }
    if (details && details[0] == "BOTH") {
      hRegen = (details[1] * target.mhp);
      mRegen = (details[1] * target.mmp);
    }
  }
  hRegen *= rate; mRegen *= rate;
  target.gainHp(hRegen); if (hRegen < 0) target.startDamagePopup();
  target.gainMp(mRegen); if (mRegen < 0) target.startDamagePopup();
};

// Regenerate TP, but depletes while dashing.
J.mapTime.doTPregen = actor => {
  let mod = 0;
  //var tpRegen = (((actor.trg + 0.1) * 100) / 10);
  const tpRegen = (actor.trg + 0.1) * J.mapTime.TP_Factor();
  if (J.mapTime.useTPforDash) {
    mod = Game_Player.prototype.isDashButtonPressed() ? -0.3 : tpRegen;
  }
  actor.gainTp(mod);
};

// reads notes and determines if the actor is poisoned based on state.
J.mapTime.isPoisoned = target => {
  var structure = /<poison:(HP|MP|BOTH)>/i;
  var aStates = target.states();
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

((_) => { // start plugin.
/* -------------------------------------------------------------------------- */
//  Game_Map Modifications
//    Handles all the extra variables and adds functionality for the xRG stuff.
/* -------------------------------------------------------------------------- */

  // processes the function that provides HRG/MRG/TRG on the map.
  let _Game_Map_jmt_update = Game_Map.prototype.update;
  Game_Map.prototype.update = function(sceneActive) {
    _Game_Map_jmt_update.call(this, sceneActive);
    this.regenOnMap();
    this.handleStates();
    //this.testInputs();
  };

//#region input handling?
  Game_Map.prototype.testInputs = () => {
    let btn = Input.getPressedGamepadButton();
    if (btn !== undefined) console.log(Input.getPressedGamepadButton());
  }

  Input.getPressedGamepadButton = function() {
    if (navigator.getGamepads) {
      var gamepads = navigator.getGamepads();
      if (gamepads) {
        for (var i = 0; i < gamepads.length; i++) {
          var gamepad = gamepads[i];
          if (gamepad && gamepad.connected) {
            let ID = this.gamepadButtonId(gamepad);
            return this.getButton(ID);
          }
        }
      }
    }
    return -1;
  };
  
  Input.gamepadButtonId = function(gamepad) {
    var buttons = gamepad.buttons;
    for (var i = 0; i < buttons.length; i++) {
      if (buttons[i].pressed) return i;
    }
    return -1;
  };

  Input.getButton = function(ID) {
    return Input.gamepadMapper[ID];
  }
//#endregion

  // handles the countdown of time for a state.
  Game_Map.prototype.handleStates = function() {
    if ($gameParty.exists())    this.handleAllyStates();
    if ($gameMap.hasEnemies())  this.handleEnemyStates();
  };

  // iterates over and counts down states for allies.
  Game_Map.prototype.handleAllyStates = () => {
    $gameParty.members().forEach((actor) => {
      let ally = actor;
      ally._states.forEach((state) => {
        let stateTimeLeft = ally._stateSteps[state];
        if (stateTimeLeft <= 0) ally.eraseState(state);
        else ally._stateSteps[state]--;
      });
    });
  };

  // iterates over and counts down states for enemies.
  Game_Map.prototype.handleEnemyStates = () => {
    $gameMap.allEnemiesOnMap().forEach((e) => {
      let enemy = e._user.battler;
      enemy._states.forEach((state) => {
        let stateTimeLeft = enemy._stateSteps[state];
        if (stateTimeLeft <= 0) enemy.eraseState(state);
        else enemy._stateSteps[state]--;
      });
    });
  };

  // returns boolean based on whether or not the current map has any alive enemies on it.
  Game_Map.prototype.hasEnemies = () => $gameMap.allEnemiesOnMap().length > 0;

  // adds in these three methods because natively, Game_Enemy class doesn't have them.
  Game_Enemy.prototype.clearStates = function() {
    Game_Battler.prototype.clearStates.call(this);
    this._stateSteps = {};
  };

  Game_Enemy.prototype.eraseState = function(stateId) {
    Game_Battler.prototype.eraseState.call(this, stateId);
    delete this._stateSteps[stateId];
  };

  Game_Enemy.prototype.resetStateCounts = function(stateId) {
    Game_Battler.prototype.resetStateCounts.call(this, stateId);
    this._stateSteps[stateId] = $dataStates[stateId].stepsToRemove;
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

  // If party exists, execute regen for HP/MP/TP.
  Game_Map.prototype.regenOnMap = function() {
    let actor = null;
    if ($gameParty != null) { actor = $gameParty.leader(); }
    if (actor) {
      if (_.HPMP_Tick()) {
        this.handleAllyRegen(actor);
        this.handleEnemyRegen();
      }
      if (_.useTPregen && _.TP_Tick()) { _.doTPregen(actor); }
    }
  };

  // handles leader regeneration on the map.
  Game_Map.prototype.handleAllyRegen = actor => {
    _.doHPMPregen(actor);
  }

  // handles all enemy regeneration on the map, if they exist.
  Game_Map.prototype.handleEnemyRegen = () => {
    if ($gameMap.hasEnemies()) {
      $gameMap.allEnemiesOnMap().forEach((e) => {
        let enemy = e.battler();
        _.doHPMPregen(enemy);
        if (enemy.isDead()) {
          e.setDeadEnemy(e, e.battler());
        }
      });
    };
  }

  // do nothing and disable MV regeneration
  Game_Battler.prototype.regenerateAll = function() { };

  // this forces the player to be unable to run while out of TP.
  // note: hopefully this is okay since only actor's can dash (?).
  const _Game_CharacterBase_jmt_realMoveSpeed = Game_CharacterBase.prototype.realMoveSpeed;
  Game_CharacterBase.prototype.realMoveSpeed = function() {
    let actor = null;
    if (_.useTPforDash === "true") {
      if ($gameParty.exists()) { actor = $gameParty.leader(); }
      return this._moveSpeed + ((this.isDashing() && actor.tp > 0) ? 1 : 0);
    }
    else { return _Game_CharacterBase_jmt_realMoveSpeed.call(this); }
  };
/* -------------------------------------------------------------------------- */
//  Window_Base Modification
//    Because floats are innately messy, this is cleans them up visually.
/* -------------------------------------------------------------------------- */

  // this fixes the issue of drawing excessively long decimal numbers
  // in places like the menu that draw gauges for HP/MP.
  const _Window_Base_jqmt_drawCurrentAndMax = Window_Base.prototype.drawCurrentAndMax;
  Window_Base.prototype.drawCurrentAndMax = function(current, max, x, y, width, color1, color2) {
    current = current.toFixed(0);
    _Window_Base_jqmt_drawCurrentAndMax.call(this, current, max, x, y, width, color1, color2);
  };
/* -------------------------------------------------------------------------- */
})(J.mapTime); // end plugin.
