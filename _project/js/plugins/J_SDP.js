/* -------------------------------------------------------------------------- */
// J_SDP
// V: 1.2.0
//
/*:@plugindesc Stat Distribution Panels
@author J

@help Shining Force NEO/EXA style stat distribution.

  Just let me know if you plan on using it for anything serious :)

  I designed it for use with the script command rather than a plugin command
  for adding new panels. It will let you see clearer what you're doing rather
  than just one long line:

    let panel = {
    name:"Life Boost I",
    symbol:"hp001",
    description:"Tier 01: Raises base maximum HP by 10 per rank.",
    category:0,
    flatOrPercent:"flat",
    base:100, perRank:10, rankMax:10, rankCur:0,
    growMult:1.2, growCost:50
    }
    $gameActors._data.forEach((i)=>{i.SDP_addPanel(panel);})


@param cmdName
@text Command Name
@desc Designates the name of the command in the menu screen.
@default Distribute

Changelog:
  v1.0 >> 1.1:
    - cleanup a few bugs 
    - update system for panels properly
  v1.1 >> 1.2.0
    - panels are now party-wide instead of character-specific.
*/
/* -------------------------------------------------------------------------- */
J = J || {};
J.SD = J.SD || {};
Imported = Imported || {};
Imported["JE-SDP"] = "1.2.0";
J.SD.pluginParams = PluginManager.parameters('J_SDP');
/* -------------------------------------------------------------------------- */

//#region J.SD method group
// Creates and returns a "panel" for use to upgrade with points.
// This panel is pushed into the party's panel list.
J.SD.MakePanel = (na = "default name", sy = "def", desc = "", cat = 0, fp = "flat",
                  ea = 5, max = 10, cur = 0, cmult = 1.2, cgrow = 50) => {
  let panel = {
    name: na,           // the display name of the panel
    symbol: sy,         // the unique symbol of the panel for listing
    description: desc,  // the description of the panel
    category: cat,      // some parameter like HP or critchance
    flatOrPercent: fp,  // flat/percent increase/decrease decision.
    base: base,         // the cost starts (base + (perRank * rank))
    perRank: ea,        // how much the increase/decrease is.
    rankMax: max,       // some number that defines how high it can go; 0 if infinite.
    rankCur: cur,       // always 0; increments +1 per rank up.
    growMult: cmult,
    growCost: cgrow,
  }; 
  return panel;
};

J.SD.GetCommandName = function() {
  const name = J.SD.pluginParams['cmdName'];
  return name;
};

J.SD.GetPtsIcon = function() {
  const icon = J.Icon.SDP_icon || 1;
  return icon;
};

J.SD.TranslateParam = function(p, a) {
  let obj = { name: "noparam", param: -1 };
  switch (p) {
    case 0: case 1: case 2: case 3: case 4: case 5:
    case 6: 
    case 7: 
      obj.name = TextManager.param(p);
      obj.param = a.param(p);
      break;
    case 8: case 9: case 10: case 11: case 12:
    case 13: case 14: case 15: case 16:
    case 17: 
      obj.name = TextManager.sparam(p-8);
      obj.param = a.sparam(p-8) * 100;
      break;
    case 18: case 19: case 20: case 21: case 22:
    case 23: case 24: case 25: case 26:
    case 27: 
      obj.name = TextManager.xparam(p-18);
      obj.param = a.xparam(p-18) * 100;
    case 28:
      obj.name = TextManager.jparam(p-28);
      obj.param = a.jparam(p-28);
    default: break;
  }
  return obj;
};

J.SD.Cost = function(panel) {
  let cost = 0;
  if (panel.rankCur === panel.rankMax) {
    cost = 0;
  }
  else {
    let growth = Math.floor(panel.growMult * (panel.growCost * (panel.rankCur + 1)))
    cost += panel.base + growth;
  }
  return cost;
};

J.SD.visibility = true;

J.SD.PanelCache = [];

J.SD.JSONpath = () => process.mainModule.filename.slice(0, process.mainModule.filename.lastIndexOf("/index.html"));

J.SD.DataFileName = () => `J_SDP_Data.json`;

J.SD.InitialDataLoad = async () => {
  console.log(`###############################################`);
  const path = J.SD.JSONpath();
  const filename = J.SD.DataFileName();
  let list = {};

  // add to list
  try {
    list = JSON.parse(require('fs').readFileSync(`${path}/data/${filename}`, 'utf-8'));
  } catch (err) { console.warn(`ERROR LOADING JSON:${err}`); return; };

  console.log(list);
  for (let panel in list) {
    console.log(list[panel]); // a single panel
    if (list[panel].unlocked) J.SD.PanelCache.push(list[panel]);
  }

  console.log(`###############################################`);
};

J.SD.UpdateJSON = async () => {

};


//#endregion

/* -------------------------------------------------------------------------- */
((_) => { "use strict";

  /* -------------------------------------------------------------------------- */
  //  Game_Interpreter Modifications
  //    deals with the extra pluginCommand stuff for manually doing things
  //    within the game (using the pluginCommand event command).
  /* -------------------------------------------------------------------------- */
//#region Game_Interpreter
  const _Game_Interpreter_jSDP_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_jSDP_pluginCommand.call(this, command, args);
    if (command === 'J_SDP') {
      switch (args[0].toLowerCase()) {
        case 'open':
          SceneManager.push(Scene_SDP);
          break;
        case 'add':
          try {
            $gameParty.SDP_modPoints(args[2]);
          } catch (err) { console.warn("the data provided in the plugin command didn't work."); }
          break;
        case 'show': J.SD.visibility = true; break;
        case 'hide': J.SD.visibility = false; break;
        case 'test':
          J.SD.InitialDataLoad();
          break;
        default: console.warn("you didn't use a scripted command."); break;
      }
    }
  };
//#endregion

  /* -------------------------------------------------------------------------- */
  //  Game_Party Modifications
  //    Handles the management of SD panels and points.
  /* -------------------------------------------------------------------------- */
//#region Game_Party
  // initializes the important stuff
  const _Game_Party_jSDP_initialize = Game_Party.prototype.initialize;
  Game_Party.prototype.initialize = function() {
    _Game_Party_jSDP_initialize.call(this);
    if (!this._sdpCollection || !this._sdpPts) {
      this._sdpCollection = [];
      this._sdpPts = 0;      
    }
  };
  
  // allows for modification of points, negative or positive
  Game_Party.prototype.SDP_modPoints = function(pts) {
    this._sdpPts += Number(pts);
    if (this._sdpPts < 0) this._sdpPts = 0;
  };

  // adds a new panel into the collection
  Game_Party.prototype.SDP_addPanel = function(panel) {
    this._sdpCollection.push(panel);
    this.SDP_Sort();
  };

  // sorts based on symbol
  Game_Party.prototype.SDP_Sort = function() {
    this._sdpCollection.sort((a, b) => {
      let catA = a.category;
      let catB = b.category;
      let symA = a.symbol.toLowerCase();
      let symB = b.symbol.toLowerCase();
      if (catA === catB) {
        if (symA < symB) { return -1; }
        if (symA > symB) { return 1; }
      } else {
        return catA - catB;
      }
      return 0;
    });
  }
//#endregion

  /* -------------------------------------------------------------------------- */
  //  Game_Actor Modifications
  //    Intercepts parameters and injects the bonuses from the SDP system.
  /* -------------------------------------------------------------------------- */
//#region Game_Actor
  // intercept and modify the base parameters by panel.
  const _Game_Actor_jSDP_BparamIntercept = Game_Actor.prototype.paramBase;
  Game_Actor.prototype.paramBase = function(paramId) {
    let base = _Game_Actor_jSDP_BparamIntercept.call(this, paramId);
    if (!$gameParty) return base;
    $gameParty._sdpCollection.forEach((elem) => {
      if (elem.category === paramId) {
        if (elem.flatOrPercent === 'flat')
          base += (elem.perRank * elem.rankCur);
        else {
          base += Math.floor(base * (elem.perRank * elem.rankCur) / 100);
        }
      }
    });
    return base;
  };

  // intercept and modify the secondary parameters by panel.
  const _Game_Actor_jSDP_SparamIntercept = Game_Actor.prototype.sparam;
  Game_Actor.prototype.sparam = function(sparamId) {
    if (!$gameParty) return base;
    let base = _Game_Actor_jSDP_SparamIntercept.call(this, sparamId);
    $gameParty._sdpCollection.forEach((elem) => {
      if (elem.category === (sparamId+10)) {
        if (elem.flatOrPercent === 'flat')
          base += (elem.perRank * elem.rankCur) / 100;
        else {
          base += (base * (elem.perRank * elem.rankCur)) / 100;
        }
      }
    });
    return base;
  }

  // intercept and modify the xtra parameters by panel.
  const _Game_Actor_jSDP_XparamIntercept = Game_Actor.prototype.xparam;
  Game_Actor.prototype.xparam = function(xparamId) {
    let base = _Game_Actor_jSDP_XparamIntercept.call(this, xparamId);
    if (!$gameParty) return base;
    $gameParty._sdpCollection.forEach((elem) => {
      if (elem.category === (xparamId+8+10)) {
        if (elem.flatOrPercent === 'flat') {
          base += (elem.perRank * elem.rankCur) / 100;
        } else {
          base += (base * (elem.perRank * elem.rankCur)) / 100;
        }
      }
    });
    return base;
  }
  
  // intercept and modify the j-custom parameters by panel.
  const _Game_Actor_jSDP_JparamIntercept = Game_Actor.prototype.jparam;
  Game_Actor.prototype.jparam = function(jparamId) {
    let base = _Game_Actor_jSDP_JparamIntercept.call(this, jparamId);
    if (!$gameParty) return base;
    $gameParty._sdpCollection.forEach((elem) => {
      if (elem.category === (jparamId+8+10+10)) {
        if (elem.flatOrPercent === 'flat') {
          base += (elem.perRank * elem.rankCur) / 100;
        } else {
          base += (base * (elem.perRank * elem.rankCur)) / 100;
        }
      }
    });
    return base;
  }
//#endregion

  /* -------------------------------------------------------------------------- */
  //  Game_Enemy Modifications
  //    Updates the Game_Enemy class to allow points to "drop".
  /* -------------------------------------------------------------------------- */
//#region Game_Enemy
  // defaults their points to 0 if not otherwise stated
  const _Game_Enemy_jSDP_initMembers = Game_Enemy.prototype.initMembers;
  Game_Enemy.prototype.initMembers = function() {
    _Game_Enemy_jSDP_initMembers.call(this);
    this._sdpPts = 0;
  };

  // assigns the points to the parameter
  const _Game_Enemy_jSDP_setup = Game_Enemy.prototype.setup; 
  Game_Enemy.prototype.setup = function(enemyId, x, y) {
    _Game_Enemy_jSDP_setup.call(this, enemyId, x, y);
    this._sdpPts = this.getSDPPts();
  };

  // pulls the points from the enemy's notebox
  Game_Enemy.prototype.getSDPPts = function() {
    let structure = /<sdpPts: (\d+)>/i;
    let x = 0;
    let notedata = this.enemy().note.split(/[\r\n]+/);
    for (let n = 0; n < notedata.length; n++) {
      let line = notedata[n];
      if (line.match(structure)) { x = Number(RegExp.$1); }    
    }
    return x;
  };

  // gain points via $gameParty.
  Game_Enemy.prototype.gainSDPpts = function() {
    $gameParty.SDP_modPoints(this._sdpPts);
  };

  // intercept common drop method to gain points.
  const _Game_Enemy_jSDP_MakeDropItems = Game_Enemy.prototype.makeDropItems;
  Game_Enemy.prototype.makeDropItems = function() {
    this.gainSDPpts();
    return _Game_Enemy_jSDP_MakeDropItems.call(this);
  }
//#endregion

  /* -------------------------------------------------------------------------- */
  //  Scene_Menu
  //    hooks into the Scene_Menu and adds the command for SDP.
  /* -------------------------------------------------------------------------- */
//#region Scene_Menu
  // adds in a new handler for Scene_SDP.
  const _Scene_Menu_jSDP_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
  Scene_Menu.prototype.createCommandWindow = function() {
    _Scene_Menu_jSDP_createCommandWindow.call(this);
    if (_.visibility) {
      this._commandWindow.setHandler('SDP', this.commandSDP.bind(this));
    }
  };

  // when command selected, pulls up the new scene.
  Scene_Menu.prototype.commandSDP = function() { SceneManager.push(Scene_SDP); };

  // adds the commands into the menu
  const _Scene_Menu_jSDP_AddSDP = Window_MenuCommand.prototype.makeCommandList;
  Window_MenuCommand.prototype.makeCommandList = function() {
    _Scene_Menu_jSDP_AddSDP.call(this);
    if (_.visibility) this.AddSDP();
  };

  // the command for adding SDP to the main menu
  Window_MenuCommand.prototype.AddSDP = function() {
    let enabled = this.areMainCommandsEnabled();
    let name = _.GetCommandName();
    this.insertCommand(name, 'SDP', enabled);
  };

  // this is a simple new function that splices a command at a given index
  // instead of just throwing it in at the end.
  Window_Command.prototype.insertCommand = function(name, symbol, enabled, ext, index) {
    if (enabled === undefined) { enabled = true; }
    if (ext === undefined) { ext = null; }
    if (index === undefined) { index = this._list.length - 1; }
    let obj = { name: name, symbol: symbol, enabled: enabled, ext: ext};
    this._list.splice(index, 0, obj);
  };
//#endregion

  /* -------------------------------------------------------------------------- */
  //  Scene_SDP
  //    the whole SDP scene.
  /* -------------------------------------------------------------------------- */
//#region Scene_SDP
  function Scene_SDP() { this.initialize.apply(this, arguments); }
  Scene_SDP.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_SDP.prototype.constructor = Scene_Menu;

  Scene_SDP.prototype.initialize = function() { Scene_MenuBase.prototype.initialize.call(this); };

  // core creation function of the Stat Distribution Panel scene.
  Scene_SDP.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();      // the description of the panel.
    this.createCommandWindow();   // the list of distribution panels.
    this.createPointsWindow();    // the display of points for the actor.
    this._index = this._sdpWindow.index();
    this._actor = null;
  };

  // assists in the panel tracking.
  // assists in the actor tracking.
  Scene_SDP.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    if (this._index != this._sdpWindow.index()) this.updateIndex();
    if (this._actor != this._sdpDetails.getActor()) this.updateActor();
  };

  // refreshes all the windows of the system at once.
  Scene_SDP.prototype.refreshWindows = function() {
    this._sdpWindow.refresh();
    this._sdpDetails.refresh();
    this._sdpPoints.refresh();
  };

  // tracks the index for keeping panel up to date.
  Scene_SDP.prototype.updateIndex = function() {
    this._index = this._sdpWindow.index();
    this._sdpDetails.changePanel(this._index);
  };

  // the list of distribution panels based on the character.
  Scene_SDP.prototype.createCommandWindow = function() {
    this._sdpWindow = new Window_SDP_List();
    this._sdpWindow.setHandler('ok',        this.onSDPok.bind(this));
    this._sdpWindow.setHandler('cancel',    this.popScene.bind(this));
    this.addWindow(this._sdpWindow);
  };

  // handles the details for the selected panel based on index.
  Scene_SDP.prototype.createHelpWindow = function() {
    this._sdpDetails = new Window_SDP_Details();
    this.addWindow(this._sdpDetails);
  };

  // creates the window for drawing points.
  Scene_SDP.prototype.createPointsWindow = function() {
    this._sdpPoints = new Window_SDP_Points();
    this.addWindow(this._sdpPoints);
  };
  
  // when you hit OK on an enabled panel, it executes this
  Scene_SDP.prototype.onSDPok = function() {
    // handle the OK button press.
    this._sdpWindow.activate();
    this.incrementPanel();
    this.refreshWindows();
  };

  // on OK, execute this.
  Scene_SDP.prototype.incrementPanel = function() {
    // handle the OK button press.
    let panel = $gameParty._sdpCollection[this._index];
    if (panel.rankCur < panel.rankMax) {
      $gameParty._sdpPts -= J.SD.Cost(panel);
      panel.rankCur++;
    };
    $gameParty.SDP_Sort();

  };
//#endregion

  /* -------------------------------------------------------------------------- */
  //  Window_SDP_List
  //    handles the list of all panels available for the party to rank up.
  /* -------------------------------------------------------------------------- */
//#region Window_SDP_List
  function Window_SDP_List() { this.initialize.apply(this, arguments); }
  Window_SDP_List.prototype = Object.create(Window_Command.prototype);
  Window_SDP_List.prototype.constructor = Window_MenuCommand;

  Window_SDP_List.prototype.initialize = function() {
    let x = 0;
    let y = 0;
    this._list = [];
    this._actor = null;
    this.setActor($gameParty.members()[0]);
    Window_Command.prototype.initialize.call(this, x, y);
    this.refresh();
  };

  Window_SDP_List.prototype.windowWidth = function() {
    return Graphics.boxWidth;
  };

  Window_SDP_List.prototype.numVisibleRows = function() {
    return 6;
  };

  Window_SDP_List.prototype.setActor = function(actor) {
    if (this._actor === null) this._actor = $gameParty.members()[0];
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
  };

  Window_SDP_List.prototype.refresh = function() {
    if (this.contents) this.contents.clear();
    this.clearCommandList();
    this.makeCommandList();
    this.drawAllItems();
  };

  Window_SDP_List.prototype.clearCommandList = function() {
    Window_Command.prototype.clearCommandList.call(this);
  };

  Window_SDP_List.prototype.makeCommandList = function() {
    //$gameParty._sdpCollection.forEach((SDPS) => {
    J.SD.PanelCache.forEach(SDPS => {
      let tooPoor = $gameParty._sdpPts < J.SD.Cost(SDPS);
      let tooStrong = SDPS.rankCur >= SDPS.rankMax;
      let enabled = !(tooPoor || tooStrong);
      let commandName = SDPS.name;
      this.addCommand(commandName, SDPS.symbol, enabled);
    }, this);
  };

  Window_SDP_List.prototype.drawItem = function(index) {
    let rect = this.itemRectForText(index);
    let align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
  };
//#endregion

  /* -------------------------------------------------------------------------- */
  //  Window_SDP_Points
  //    displays the SDP Points the party has available.
  /* -------------------------------------------------------------------------- */
//#region Window_SDP_Points
  function Window_SDP_Points() {this.initialize.apply(this, arguments); }

  Window_SDP_Points.prototype = Object.create(Window_Base.prototype);
  Window_SDP_Points.prototype.constructor = Window_Base;

  Window_SDP_Points.prototype.initialize = function() {
    let x = 0;
    let y = 283;
    let width = Graphics.boxWidth - x;
    let height = 78;
    this._actor = null;
    this.setActor($gameParty.members()[0]);
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
  };

  Window_SDP_Points.prototype.setActor = function(actor) {
    if (this._actor === null) this._actor = $gameParty.members()[0];
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
  };

  Window_SDP_Points.prototype.refresh = function() {
    this.contents.clear();
    this.drawSDPPoints();
  };

  Window_SDP_Points.prototype.drawSDPPoints = function() {
    let a = this._actor;
    let i = _.GetPtsIcon();
    let lh = this.lineHeight();
    this.drawIcon(i, 0, 0);
    this.drawText("Panel Pts.: ", 40, 0, 255);
    this.drawText($gameParty._sdpPts, 280, 0, 255, 'left');
  };
//#endregion

  /* -------------------------------------------------------------------------- */
  //  _Details
  //    displays the details of the Panel currently highlighted.
  /* -------------------------------------------------------------------------- */
//#region Window_SDP_Details
  function Window_SDP_Details() {this.initialize.apply(this, arguments); }

  Window_SDP_Details.prototype = Object.create(Window_Base.prototype);
  Window_SDP_Details.prototype.constructor = Window_Base;
  
  Window_SDP_Details.prototype.initialize = function() {
    let x = 0;
    let y = 360;
    let width = Graphics.boxWidth - x;
    let height = Graphics.boxHeight - y;
    this._actor = null;
    this._currentPanel = 0;
    this.setActor($gameParty.members()[0]);
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
  };

  Window_SDP_Details.prototype.setActor = function(actor) {
    if (this._actor === null) this._actor = $gameParty.members()[0];
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
  };

  Window_SDP_Details.prototype.getActor = function() {
    return this._actor;
  };

  Window_SDP_Details.prototype.refresh = function() {
    this.contents.clear();
    this.drawSDPDetails(this._currentPanel);
  };

  Window_SDP_Details.prototype.changePanel = function(nextPanel) {
    if (this._currentPanel !== nextPanel) {
      this._currentPanel = nextPanel;
      this.refresh();
    }
  };

  Window_SDP_Details.prototype.drawSDPDetails = function() {
    let lh = this.lineHeight();
    let panel = $gameParty._sdpCollection[this._currentPanel];
    
    this.detailsHeader(panel);
    this.detailsType(panel);
    this.detailsLevel(panel);
    this.detailsCost(panel);
  };

  // draws the name and description of the panel.
  Window_SDP_Details.prototype.detailsHeader = function(p) {
    this.changeTextColor(this.crisisColor());
    this.drawText(p.name, 0, lh*0, 255);
    this.resetTextColor();
    this.drawText(p.description, 20, lh*1, 512);
  };

  // draws the details about the level of the panel.
  Window_SDP_Details.prototype.detailsLevel = function(p) {
    let row = lh*5;
    let rate = p.rankCur / p.rankMax;
    this.changeTextColor(this.systemColor());
    this.drawText("Rank: ", 0, row, 255);
    this.resetTextColor();
    this.drawGaugeMod(
      30, row+lh+20, 250, 4, rate, this.tpGaugeColor1(), this.mpGaugeColor2()
      );
    this.drawText(p.rankCur, 20, row+lh, 255);
    this.drawText("/", 60, row+lh, 255);
    this.drawText(p.rankMax, 95, row+lh, 255);
  };

  // draws the details about the level of the panel.
  Window_SDP_Details.prototype.detailsCost = function(p) {
    let row = lh*5;
    this.changeTextColor(this.systemColor());
    this.drawText("Cost: ", 200, row, 255);
    this.resetTextColor();
    this.drawText(J.SD.Cost(p), 220, row+lh, 255);
  };

  // draws the details about the parameter of the panel.
  Window_SDP_Details.prototype.detailsType = function(p) {
    let row = lh*2;
    let forp = p.flatOrPercent == "flat" ? "" : "%";
    let stat = _.TranslateParam(p.category, this._actor);
    this.changeTextColor(this.systemColor());
    this.drawText("Type:", 0, row, 255);
    this.resetTextColor();
    this.drawText(stat.name, 20, row+lh, 255);
    this.drawText(stat.param, 40, row+lh*2, 255);
    this.changeTextColor(this.powerUpColor());
    this.drawText("+(" + p.perRank + forp + ")", 100, row+lh*2, 255);
    this.resetTextColor();
  };
//#endregion

})(J.SD);
