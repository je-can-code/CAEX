/* -------------------------------------------------------------------------- */
// J_Difficulty
// V: 1.1
//


/*:@plugindesc Provides difficulty options for the the player that modify enemy stats.
@author J

@help This plugin adds a new command to the main menu that represents the game's
  difficulty. "Difficulty"s are named, and act as multipliers against the
  enemies' various b/s/x parameters. It can also impact their exp/gold and
  even their drop rates.

  There are five plugin commands you can use to manipulate this plugin:

  ADD:
  JDIFF add param0 param1 param2 etc... param26

  example:
    JDIFF add 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100 100
  translates to:
    basically the normal mode down below, lol.

  No commas necessary.
  Just a space between each parameter.
  Be careful not to miss one or it could break the plugin and crash the game.

  REMOVE:
  JDIFF remove [number of difficulty or name of difficulty]

  example:
    JDIFF remove 1
  translates to:
    remove the first difficulty in the list (easy by default)
  
  example:
    JDIFF remove Normal
  translates to:
    remove the difficulty named "Normal".
    (name of difficulty IS case sensitive)
  
  CHANGE:
  JDIFF change [name of difficulty]

  example:
    JDIFF change Easy
  translates to:
    change the current difficulty mode to "Easy" mode.
    (name of difficulty IS case sensitive)

  SHOW:
  JDIFF show

  HIDE:
  JDIFF hide

  show and hide will do exactly what you think: show and hide the difficulty
  menu item.
  
  NOTE: if you decide to hide the difficulty, it does not disable the them.
    If you hide it while at "Hard", and enemies are stronger, they will just 
    stay stronger.

@param Difficulty Variable
@desc Assigns the difficulty to this variable. 0 = no assignment.
@default 10

  This plugin is standalone and has no dependencies.
  Just let me know if you plan on using it for anything serious :)
*/

var Imported = Imported || {};
Imported.J_Difficulty = true;

J.AddOns = J.AddOns || {};
J.AddOns.Difficulty =   J.AddOns.Difficulty || {};
J.AddOns.Difficulty.Modes = [];
J.AddOns.Difficulty.visibility = true;
J.AddOns.Difficulty.Parameters = PluginManager.parameters('J_HUD');
J.AddOns.Difficulty.dVariable = Number(J.AddOns.Difficulty.Parameters['Difficulty Variable']);


// creates a new Difficulty mode based on the provided parameters.
J.AddOns.Difficulty.makeDifficulty = function(namediff, exprate, goldrate, droprate, 
  maxHP, maxMP, agility, attack, defense, luck, matk, mdef,
  hitrate, evade, counter, crit, critdodge, mevade, mreflect, 
  hpregen, mpregen, target, guard, recovery, physrate, magirate) {
    var diff = {
      name: namediff,
      exp: exprate,   gold: goldrate, drop: droprate,
      mhp: maxHP,     mmp: maxMP,     agi: agility,
      atk: attack,    def: defense,   luk: luck,
      mat: matk,      mdf: mdef,
  
      hit: hitrate,   eva: evade,     cnt: counter,
      cri: crit,      cev: critdodge,
      mev: mevade,    mrf: mreflect,
      hrg: hpregen,   mrg: mpregen,   trg: target,
    // note1: PDR and MDR want to be lower.
    // note2: TGR, PHA, TCR, FDR, and EXR aren't usually used for enemies.
    // tgr: 200, mcr: 200, pha: 100, tcr: 200, exr: 200, fdr: 200,
      grd: guard,  rec: recovery,  pdr: physrate,  mdr: magirate
    };
    J.AddOns.Difficulty.Modes.push(diff);
  }
/* -------------------------------------------------------------------------- */
J.AddOns.Difficulty.makeDifficulty("Easy", 50, 25, 25, 
  50, 100, 75, 50, 75, 100, 50, 75, 
  100, 0, 50, 50, 0, 0, 50, 50, 50, 50, 
  0, 100, 100, 100);

J.AddOns.Difficulty.makeDifficulty("Normal", 100, 100, 100,
  100, 100, 100, 100, 100, 100, 100, 100,
  100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
  100, 100, 100, 100);

J.AddOns.Difficulty.makeDifficulty("Hard", 150, 200, 200,
  150, 100, 125, 150, 125, 150,
  150, 100, 150, 150, 150, 100, 150, 150, 150, 150,
  200, 150, 150, 150);

  J.AddOns.Difficulty.defaultMode = 1;    // defines the starting difficulty.
  J.AddOns.Difficulty.currentMode = J.AddOns.Difficulty.defaultMode;

// grabs the rate from the difficulty, and returns the multiplier.
J.AddOns.Difficulty.convertBparams = function(pId) {
  var d = J.AddOns.Difficulty.Modes[J.AddOns.Difficulty.currentMode];
  var m = null; // multiplier
  try {
    switch (pId) {
      case 0: m = d.mhp; break;
      case 1: m = d.mmp; break;
      case 2: m = d.atk; break;
      case 3: m = d.def; break;
      case 4: m = d.mat; break;
      case 5: m = d.mdf; break;
      case 6: m = d.agi; break;
      case 7: m = d.luk; break;
      case 8: m = d.exp; break; // not actual param, but assigned for re-use.
      case 9: m = d.gold; break; // not actual param, but assigned for re-use.
      case 10: m = d.drop; break;
    }
    return m;
  }
  finally { if (m === null) m = 100; };
};

// grabs the rate from the difficulty, and returns the multiplier.
J.AddOns.Difficulty.convertXparams = function(sId) {
  var d = J.AddOns.Difficulty.Modes[J.AddOns.Difficulty.currentMode];
  var m = null; // multiplier
  try {
    switch (sId) {
      case 0: m = d.hit; break;
      case 1: m = d.eva; break;
      case 2: m = d.cri; break;
      case 3: m = d.cev; break;
      case 4: m = d.mev; break;
      case 5: m = d.mrf; break;
      case 6: m = d.cnt; break;
      case 7: m = d.hrg; break;
      case 8: m = d.mrg; break;
      case 9: m = d.trg; break;
    }
    return m; // note: returns 100-base multiplier, not 1-base.
  }
  finally { if (m === null) m = 100; };
};

// grabs the rate from the difficulty, and returns the multiplier.
J.AddOns.Difficulty.convertSparams = function(sId) {
  var d = J.AddOns.Difficulty.Modes[J.AddOns.Difficulty.currentMode];
  var m = null; // multiplier
  try {
    switch (sId) {
      case 0: m = d.tgr; break;
      case 1: m = d.grd; break;
      case 2: m = d.rec; break;
      case 3: m = d.pha; break;
      case 4: m = d.mcr; break;
      case 5: m = d.tcr; break;
      case 6: m = d.pdr; break;
      case 7: m = d.mdr; break;
      case 8: m = d.fdr; break;
      case 9: m = d.exr; break;
    }
    return m; // note: returns 100-base multiplier, not 1-base.
  }
  finally { if (m === undefined) m = 100; };
};

// gets the name of the current difficulty.
J.AddOns.Difficulty.getDifficultyName = function(diffMode) {
  if (diffMode === undefined)
    diffMode == J.AddOns.Difficulty.currentMode;
  return J.AddOns.Difficulty.Modes[diffMode].name;
};

// sets the difficulty to a fixed difficulty.
J.AddOns.Difficulty.changeDifficulty = function(newDifficulty) {
  if (J.AddOns.Difficulty.dVariable > 0)
    $gameVariables.setValue(J.AddOns.Difficulty.dVariable, newDifficulty);
  J.AddOns.Difficulty.currentMode = newDifficulty;
};

// finds a given difficulty and returns it's array location.
// explicitly for use with the PLUGIN COMMANDS
J.AddOns.Difficulty.findDifficulty = function(diffName) {
  var modes = J.AddOns.Difficulty.Modes;
  for (var i = 0; i < modes.length; i++) {
    if (modes[i].name.toLowerCase() == diffName.toLowerCase()) return i;
  }
  return -1;
};

/* -------------------------------------------------------------------------- */
// based on difficulty, modifies and returns a parameter
// when calling enemy parameters.
/* -------------------------------------------------------------------------- */

// handles base parameters like HP/ATK/DEF/etc.
var _Game_Enemy_jdf_paramBase = Game_Enemy.prototype.paramBase;
Game_Enemy.prototype.paramBase = function(paramId) {
  var base = _Game_Enemy_jdf_paramBase.call(this, paramId);
  if (!(isNaN(J.AddOns.Difficulty.convertBparams(paramId))))
    base *= (J.AddOns.Difficulty.convertBparams(paramId) / 100);
  return base;
};

// handles s-parameters like GRD/MCR/EXR/etc.
var _Game_Enemy_jdf_sparam = Game_BattlerBase.prototype.sparam;
Game_Enemy.prototype.sparam = function(sparamId) {
  var base = _Game_Enemy_jdf_sparam.call(this, sparamId);
  if (!(isNaN(J.AddOns.Difficulty.convertSparams(sparamId))))
    base *= (J.AddOns.Difficulty.convertSparams(sparamId) / 100);
  return base;
};

// handles x-parameters like HIT/EVA/CRI/etc.
var _Game_Enemy_jdf_xparam = Game_BattlerBase.prototype.xparam;
Game_Enemy.prototype.xparam = function(xparamId) {
  var base = _Game_Enemy_jdf_xparam.call(this, xparamId);
  if (!(isNaN(J.AddOns.Difficulty.convertXparams(xparamId))))
    base *= (J.AddOns.Difficulty.convertXparams(xparamId) / 100);
  return base;
};

// based on difficulty, modifies and returns experience
var _Game_Enemy_jdf_exp = Game_Enemy.prototype.exp;
Game_Enemy.prototype.exp = function() {
  var baseExp = _Game_Enemy_jdf_exp.call(this);
  if (!(isNaN(J.AddOns.Difficulty.convertBparams(8))))
    baseExp *= (J.AddOns.Difficulty.convertBparams(8) / 100);
  return Math.round(baseExp);
};

// based on difficulty, modifies and returns Gold
var _Game_Enemy_jdf_gold = Game_Enemy.prototype.gold;
Game_Enemy.prototype.gold = function() {
  var baseGold = _Game_Enemy_jdf_gold.call(this);
  if (!(isNaN(J.AddOns.Difficulty.convertBparams(9))))
    baseGold *= (J.AddOns.Difficulty.convertBparams(9) / 100);
  return Math.round(baseGold);
};

/* -------------------------------------------------------------------------- */
// Modifications required for adding the new Difficulty functionality
// right into the main menu.
/* -------------------------------------------------------------------------- */

// adds in a new handler for Scene_Difficulty.
var _Scene_Menu_jde_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
  _Scene_Menu_jde_createCommandWindow.call(this);
  if (J.AddOns.Difficulty.visibility == true) {
    this._commandWindow.setHandler('difficulty', this.commandDifficulty.bind(this));
  }
};

// when command selected, pulls up the new scene.
Scene_Menu.prototype.commandDifficulty = function() {
  SceneManager.push(Scene_Difficulty);
};

// adds the commands into the menu
var _Menu_jdf_addDifficulties = Window_MenuCommand.prototype.makeCommandList;
Window_MenuCommand.prototype.makeCommandList = function() {
  _Menu_jdf_addDifficulties.call(this);
  if (J.AddOns.Difficulty.visibility == true) {
    this.addDifficulties();
  }
};

// the command for adding difficulties to the main menu
Window_MenuCommand.prototype.addDifficulties = function() {
    var enabled = this.areMainCommandsEnabled();
    var name = J.AddOns.Difficulty.getDifficultyName(J.AddOns.Difficulty.currentMode);
    this.insertCommand(name, 'difficulty', enabled);
};

// this is a simple new function that splices a command at a given index
// instead of just throwing it in at the end.
Window_Command.prototype.insertCommand = function(name, symbol, enabled, ext, index) {
    if (enabled === undefined) { enabled = true; }
    if (ext === undefined) { ext = null; }
    if (index === undefined) { index = this._list.length - 1; }
    var obj = { name: name, symbol: symbol, enabled: enabled, ext: ext};
    this._list.splice(index, 0, obj);
};

/* -------------------------------------------------------------------------- */
//    Scene_Difficulty [NEW!]
// This is the Scene for handling the Difficulty changing functionality
// when dealt with via menu commands in Scene_Menu.
/* -------------------------------------------------------------------------- */

function Scene_Difficulty() { this.initialize.apply(this, arguments); }
Scene_Difficulty.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Difficulty.prototype.constructor = Scene_Menu;

Scene_Difficulty.prototype.initialize = function() {
  var lastIndex = null;
    Scene_MenuBase.prototype.initialize.call(this);
};

// core creation function of the Difficulty scene.
Scene_Difficulty.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createDetailsWindow();
};

// creates the left-side window with the list of difficulties.
Scene_Difficulty.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_DifficultyChoice();
    for (var d = 0; d < J.AddOns.Difficulty.Modes.length; d++) {
      var name = J.AddOns.Difficulty.getDifficultyName(d);
      this._commandWindow.setHandler(name,  this.commandChangeDifficulty.bind(this));
    }
    this._commandWindow.setHandler('cancel',  this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

// creates the right-side window with all the details.
Scene_Difficulty.prototype.createDetailsWindow = function() {
  this._detailsWindow = new Window_DifficultyDetails();
  this._detailsWindow.refresh();
  this.addWindow(this._detailsWindow);
};

// changes the difficulty to the selected difficulty.
// automatically returns to the previous menu.
Scene_Difficulty.prototype.commandChangeDifficulty = function() {
  var index = this._commandWindow.index();
  var name = J.AddOns.Difficulty.getDifficultyName(index);
  J.AddOns.Difficulty.changeDifficulty(index);
  this.popScene();
};

// updates the contents of the right-side window accordingly to the index
// of the left-side window.
Scene_Difficulty.prototype.update = function() {
  Scene_MenuBase.prototype.update.call(this);
  if (this.lastIndex != this._commandWindow.index()) {
    this.lastIndex = this._commandWindow.index();
    this._detailsWindow.refresh(this.lastIndex);
  }
};

/* -------------------------------------------------------------------------- */
//    Window_DifficultyChoice [NEW!]
// DifficultyChoice is the window on the left that contains the array
// of all the different difficulties available to be selected from.
/* -------------------------------------------------------------------------- */

function Window_DifficultyChoice() { this.initialize.apply(this, arguments); }

Window_DifficultyChoice.prototype = Object.create(Window_Command.prototype);
Window_DifficultyChoice.prototype.constructor = Window_MenuCommand;

// creation of the difficulty selection window.
Window_DifficultyChoice.prototype.initialize = function() {
  Window_Command.prototype.initialize.call(this, 0, 0);
  this.updatePlacement();
  this.openness = 0;
  this.open();
};

// modified width of the left window.
Window_DifficultyChoice.prototype.windowWidth = function() {
  return 350;
};

// confirms the starting location of this window to be 0,0.
Window_DifficultyChoice.prototype.updatePlacement = function() {
  this.x = 0;
  this.y = 0;
};

// generates the list of difficulties available to choose from.
// list is generated based on the "name" property in the difficulty.
// note: both the displayed text and symbol are the same.
Window_DifficultyChoice.prototype.makeCommandList = function() {
  for (var d = 0; d < J.AddOns.Difficulty.Modes.length; d++) {
    var name = J.AddOns.Difficulty.getDifficultyName(d);
    if (name === undefined)
      name = "Needs to be defined in *.js file.";
    this.addCommand(name, name);  // (text, symbol)
  }
};

/* -------------------------------------------------------------------------- */
//    Window_DifficultyDetails [NEW!]
// DifficultyDetails is the larger window on the right that displays the
// changes of parameter multipliers to the player based on the current
// difficulty versus the item selected in the DifficultyChoice window.
/* -------------------------------------------------------------------------- */
function Window_DifficultyDetails() {this.initialize.apply(this, arguments); }

Window_DifficultyDetails.prototype = Object.create(Window_Base.prototype);
Window_DifficultyDetails.prototype.constructor = Window_Base;

// creation of the difficulty details window.
Window_DifficultyDetails.prototype.initialize = function() {
  var width = Graphics.boxWidth - 350;
  var height = Graphics.boxHeight;
  var x = 350;
  var y = 0;
  Window_Base.prototype.initialize.call(this, x, y, width, height);
  this.refresh();
};

// does all the drawing based on the current index in DifficultyChoice.
Window_DifficultyDetails.prototype.refresh = function(ind) {
  var lh = this.lineHeight();
  if (ind === undefined)
    ind = 0;
  this.contents.clear();
  this.drawDiffNames(ind);
  this.drawBparams(ind);
  this.drawSparams(ind);
  this.drawXparams(ind);
};

// the draw function for the difficulty names at the top.
Window_DifficultyDetails.prototype.drawDiffNames = function(ind) {
  var cName = J.AddOns.Difficulty.getDifficultyName(J.AddOns.Difficulty.currentMode);
  var nName = J.AddOns.Difficulty.getDifficultyName(ind);
  this.drawIcon(IconManager.textForIcon(cName), 0, 0);
  this.drawText(cName, 36, 0, 255);
  this.drawText(">>", 160, 0, 32)
  this.drawIcon(IconManager.textForIcon(nName), 200, 0);
  this.drawText(nName, 236, 0, 255);
};

// the draw function for each of the base parameters (hp/mp/atk/def/etc)
// these are hard-coded, probably could be optimized.
Window_DifficultyDetails.prototype.drawBparams = function(ind) {
  this.drawDiffParam('mhp', 0, 2, ind, 0);
  this.drawDiffParam('mmp', 1, 3, ind, 0);
  this.drawDiffParam('atk', 2, 4, ind, 0);
  this.drawDiffParam('def', 3, 5, ind, 0);
  this.drawDiffParam('mat', 4, 6, ind, 0);
  this.drawDiffParam('mdf', 5, 7, ind, 0);
  this.drawDiffParam('agi', 6, 8, ind, 0);
  this.drawDiffParam('luk', 7, 9, ind, 0);
  this.drawDiffParam('exp', 8, 10, ind, 0);
  this.drawDiffParam('gold', 9, 11, ind, 0);
  this.drawDiffParam('drop', 10, 12, ind, 0);
};

// the draw function for each of the secondary parameters (tgr/grd/pha/pdr/etc)
// these are hard-coded, probably could be optimized.
Window_DifficultyDetails.prototype.drawSparams = function(ind) {
  this.drawDiffParam('tgr', 0, 2, ind, 1);
  this.drawDiffParam('grd', 1, 3, ind, 1);
  this.drawDiffParam('rec', 2, 4, ind, 1);
  this.drawDiffParam('pha', 3, 5, ind, 1);
  this.drawDiffParam('mcr', 4, 6, ind, 1);
  this.drawDiffParam('tcr', 5, 7, ind, 1);
  this.drawDiffParam('pdr', 6, 8, ind, 1);
  this.drawDiffParam('mdr', 7, 9, ind, 1);
  this.drawDiffParam('fdr', 8, 10, ind, 1);
  this.drawDiffParam('exr', 9, 11, ind, 1);
};

// the draw function for each of the xtra parameters (hit/cri/mev/hrg/etc)
// these are hard-coded, probably could be optimized.
Window_DifficultyDetails.prototype.drawXparams = function(ind) {
  this.drawDiffParam('hit', 0, 2, ind, 2);
  this.drawDiffParam('eva', 1, 3, ind, 2);
  this.drawDiffParam('cri', 2, 4, ind, 2);
  this.drawDiffParam('cev', 3, 5, ind, 2);
  this.drawDiffParam('mev', 4, 6, ind, 2);
  this.drawDiffParam('mrf', 5, 7, ind, 2);
  this.drawDiffParam('cnt', 6, 8, ind, 2);
  this.drawDiffParam('hrg', 7, 9, ind, 2);
  this.drawDiffParam('mrg', 8, 10, ind, 2);
  this.drawDiffParam('trg', 9, 11, ind, 2);
};

// the draw function for drawing a parameter of any kind, and it's
// corresponding icon from J_Base aka IconManager.
Window_DifficultyDetails.prototype.drawDiffParam = function(type, pId, yMod, ind, fam) {
  var nMode = J.AddOns.Difficulty.Modes[ind]; // passed from selection window
  var cMode = J.AddOns.Difficulty.Modes[J.AddOns.Difficulty.currentMode]; // current mode
  var xMod = 0;
  switch (fam) {
    case 0:
      this.drawIcon(IconManager.bParams(pId), 0, 0 + lh*yMod);
      break;
    case 1:
      var xMod = 250;
      this.drawIcon(IconManager.sParams(pId), 0+xMod, 0 + lh*yMod);
      break;
    case 2:
      var xMod = 500;
      this.drawIcon(IconManager.xParams(pId), 0+xMod, 0 + lh*yMod);
      break;
  }
  if (cMode[type] === undefined)
    cMode[type] = 100;
  if (nMode[type] === undefined)
    nMode[type] = 100;
  this.drawText(cMode[type] + "%", 36 + xMod, 0 + lh*yMod, 80);
  this.drawText(">>", 100 + xMod, lh*yMod, 32);
  this.getColorDiff(cMode[type], nMode[type]);
  this.drawText(nMode[type] + "%", 140+xMod, 0 + lh*yMod, 255);
  this.resetTextColor();
};

// a simple method for gauging whether the stat will be easier/harder/same
// and changes the text color accordingly.
Window_DifficultyDetails.prototype.getColorDiff = function(a, b) {
  if (a > b) { // if the change makes a stat lower, green
    this.changeTextColor(this.textColor(3));
  }
  else if (b > a) { // if the change makes a stat higher, red
    this.changeTextColor(this.deathColor());
  }
  else { // if no change, then no color change either
    this.changeTextColor(this.normalColor());
  }
};

var j_diff_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
  j_diff_Game_Interpreter_pluginCommand.call(this, command, args);
  // command args[0] args[1] args[2] ...
  try {
    if (command === 'JDIFF') {
      switch (args[0].toLowerCase()) {
        case 'hide':
          J.AddOns.Difficulty.visibility = false;
          break;
        case 'show':
          J.AddOns.Difficulty.visibility = true;
          break;
        break;
        case 'add':
        case 'ADD':
        J.AddOns.Difficulty.makeDifficulty(args[1], args[2], args[3], args[4], 
          args[5], args[6], args[7], args[8], args[9], args[10], args[11], args[12],
          args[13], args[14], args[15], args[16], args[17], args[18], args[19], 
          args[20], args[21], args[22], args[23], args[24], args[25], args[26]);
          console.log("Difficulty: " + args[1] + " created.");
          break;
        case 'remove':
        case 'REMOVE':
          if (J.AddOns.Difficulty.Modes.length < 2) {
            console.warn("Cannot remove the last difficulty mode.");
            break;
          }
          if (typeof args[1] == 'number') {
            if (args[1] == 0) {
              console.warn("Don't worry about 0-indexing.")
              break;
            }
            J.AddOns.Difficulty.Modes.splice((args[1] - 1), 1);
            J.AddOns.Difficulty.changeDifficulty(0);  
          } else {
            var id = J.AddOns.Difficulty.findDifficulty(args[1]);
            if (id == -1) {
              console.warn("can't find that difficulty.");
              break;
            }
            J.AddOns.Difficulty.Modes.splice(id, 1);
            J.AddOns.Difficulty.changeDifficulty(0);
          }
          break;
        case 'change':
        case 'CHANGE':
          var id = J.AddOns.Difficulty.findDifficulty(args[1]);
          if (id == -1) {
            console.warn("can't find that difficulty.");
            break;
          }
          J.AddOns.Difficulty.changeDifficulty(id);
          console.log("Difficulty changed to: " + J.AddOns.Difficulty.getDifficultyName(id) + ".");
          break;
        default: break;
      }
    }
  } catch(e) {
    console.warn(e);
  }
};
