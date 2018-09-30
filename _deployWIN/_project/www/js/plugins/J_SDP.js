/* -------------------------------------------------------------------------- */
// J_SDP
// V: 1.1
//
/*:@plugindesc Stat Distribution Panels
@author J

@help Shining Force NEO/EXA style stat distribution.

  Just let me know if you plan on using it for anything serious :)

@param cmdName
@text Command Name
@desc Designates the name of the command in the menu screen.
@default Distribute
*/
/* -------------------------------------------------------------------------- */

J = J || {};
J.SD = J.SD || {};

Imported = Imported || {};
Imported["JE Stat Distribution Panels"] = "0.1.0";

/* -------------------------------------------------------------------------- */

// Creates and returns a "panel" for use to upgrade with points.
// This panel is pushed into a given player's panel list.
J.SD.MakePanel = (na = "default name", sy = "def", desc = "", cat = 0, fp = "flat",
                  ea = 5, max = 10, cur = 0, cmult = 1.2, cgrow = 50) => {
  let panel = {
    name: na,           // the display name of the panel
    symbol: sy,         // the unique symbol of the panel for listing
    description: desc,  // the description of the panel
    category: cat,      // some parameter like HP or critchance
    flatOrPercent: fp,  // flat/percent increase/decrease decision.
    perRank: ea,        // how much the increase/decrease is.
    rankMax: max,       // some number that defines how high it can go; 0 if infinite.
    rankCur: cur,       // always 0; increments +1 per rank up.
    cost: function() { // the cost formula, based on rankCur.
      if (this.rankCur === this.rankMax) return 0;
      return Math.floor(cmult * (cgrow * (this.rankCur + 1)));
    },
  }; 
  return panel;
};

J.SD.GetCommandName = function() {
  //var p = PluginManager.parameters('J_SDP');
  //return p['cmdName'];
  let name = "P A N E L S";
  return name;
};

J.SD.GetPtsIcon = function() {

  let icon = 100;
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
    default: break;
  }
  return obj;
};

J.SD.visibility = true;

/* -------------------------------------------------------------------------- */
(function(_) { "use strict"; console.log("Beginning setup of SDP.");
  // initializes the SDP process.
  var _Game_Actor_sdp_Init = Game_Actor.prototype.initMembers
  Game_Actor.prototype.initMembers = function() {
    _Game_Actor_sdp_Init.call(this, this);
    this.initSDP();
  };

  // handles initiation of panel collections.
  // TEST: added panels for test purposes.
  Game_Actor.prototype.initSDP = function() {
    this._sdpCollection = [];   // the collection of panels will be in here.
    this._sdpPts = 0;           // how many points you have to be distributed across your panels.
    
    // test panels
    this.SDP_addPanel(_.MakePanel()); // default panel
    this.SDP_addPanel(_.MakePanel(
      "Power I", "pwr01", "a panel full of power",  2, "flat", 7, 20, 20, 1.3, 20
      ));
    this.SDP_addPanel(_.MakePanel(
      "EXP+ IV", "exp04", "sum xperienced boi", 17, "perc", 5, 10, 7, 3.6, 50
      ));
    this.SDP_addPanel(_.MakePanel(
      "HRG+ II", "hrg02", "improves health regen i guess", 25, "flat", 1,  5, 0, 2.1, 30
      ));
  };
  
  // add/subtract distribution points.
  Game_Actor.prototype.SDP_modPoints = function(pts) {
    // add the points, negative or positive, to the current amount.
    this._sdpPts += pts;
    // make sure points are never lower than zero by this function.
    if (this._sdpPts < 0) this._sdpPts = 0;
  };

  // add panel to an actor of a type
  Game_Actor.prototype.SDP_addPanel = function(panel) {
    this._sdpCollection.push(panel);
  };

  // intercept and modify the base parameters by panel.
  var _Game_Actor_sdp_BparamIntercept = Game_Actor.prototype.paramBase;
  Game_Actor.prototype.paramBase = function(paramId) {
    let base = _Game_Actor_sdp_BparamIntercept.call(this, paramId);
    this._sdpCollection.forEach((elem) => {
      if (elem.category === paramId) {
        if (elem.flatOrPercent === 'flat')
          base += (elem.perRank * elem.rankCur);
        else {
          base += Math.floor(base * (elem.perRank * elem.rankCur));
        }
      }
    });
    return base;
  };

  // intercept and modify the secondary parameters by panel.
  var _Game_Actor_sdp_SparamIntercept = Game_Actor.prototype.sparam;
  Game_Actor.prototype.sparam = function(sparamId) {
    let base = _Game_Actor_sdp_SparamIntercept.call(this, sparamId);
    this._sdpCollection.forEach((elem) => {
      if (elem.category === sparamId) {
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
  var _Game_Actor_sdp_XparamIntercept = Game_Actor.prototype.xparam;
  Game_Actor.prototype.xparam = function(xparamId) {
    let base = _Game_Actor_sdp_XparamIntercept.call(this, xparamId);
    this._sdpCollection.forEach((elem) => {
      if (elem.category === xparamId) {
        if (elem.flatOrPercent === 'flat')
          base += (elem.perRank * elem.rankCur) / 100;
        else {
          base += (base * (elem.perRank * elem.rankCur)) / 100;
        }
      }
    });
    return base;
  }

  /* -------------------------------------------------------------------------- */

  // adds in a new handler for Scene_SDP.
  var _Scene_Menu_sdp_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
  Scene_Menu.prototype.createCommandWindow = function() {
    _Scene_Menu_sdp_createCommandWindow.call(this);
    if (_.visibility) {
      this._commandWindow.setHandler('SDP', this.commandSDP.bind(this));
    }
  };

  // when command selected, pulls up the new scene.
  Scene_Menu.prototype.commandSDP = function() { SceneManager.push(Scene_SDP); };

  // adds the commands into the menu
  var _Scene_Menu_sdp_AddSDP = Window_MenuCommand.prototype.makeCommandList;
  Window_MenuCommand.prototype.makeCommandList = function() {
    _Scene_Menu_sdp_AddSDP.call(this);
    if (_.visibility) this.AddSDP();
  };

  // the command for adding SDP to the main menu
  Window_MenuCommand.prototype.AddSDP = function() {
    var enabled = this.areMainCommandsEnabled();
    var name = _.GetCommandName();
    this.insertCommand(name, 'SDP', enabled);
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

  function Scene_SDP() { this.initialize.apply(this, arguments); }
  Scene_SDP.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_SDP.prototype.constructor = Scene_Menu;

  Scene_SDP.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
  };

  // core creation function of the Stat Distribution Panel scene.
  Scene_SDP.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();      // the description of the panel.
    this.createCommandWindow();   // the list of distribution panels.
    this.createPointsWindow();    // the display of points for the actor.
    this._index = this._sdpWindow.index();
  };

  // assists in the panel tracking.
  Scene_SDP.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    if (this._index != this._sdpWindow.index())
      this.updateIndex();
  };

  // tracks the index for keeping panel up to date.
  Scene_SDP.prototype.updateIndex = function() {
    this._index = this._sdpWindow.index();
    this._sdpDetails.changePanel(this._index);
    console.log(this._index);
  };

  // the list of distribution panels based on the character.
  Scene_SDP.prototype.createCommandWindow = function() {
    this._sdpWindow = new Window_SDP_List();
    this._sdpWindow.setHandler('ok',        this.onSDPok.bind(this));
    this._sdpWindow.setHandler('cancel',    this.popScene.bind(this));
    this._sdpWindow.setHandler('increment', this.tryInc.bind(this));
    this._sdpWindow.setHandler('decrement', this.tryDec.bind(this));
    this.addWindow(this._sdpWindow);
  };

  // handles the details for the selected panel based on index.
  Scene_SDP.prototype.createHelpWindow = function() {
    this._sdpDetails = new Window_SDP_Details();
    this.addWindow(this._sdpDetails);
  };

  Scene_SDP.prototype.createPointsWindow = function() {
    this._sdpPoints = new Window_SDP_Points();
    this.addWindow(this._sdpPoints);
  };

  Scene_SDP.prototype.tryInc = function() {
    // handle the OK button press.
  };

  Scene_SDP.prototype.tryDec = function() {
    // handle the OK button press.
  };
  
  Scene_SDP.prototype.onSDPok = function() {
    // handle the OK button press.
  };

  Scene_SDP.prototype.onActorChange = function() {
    // handle L - R input to swap actors.
    // update all windows.
  };

  /* -------------------------------------------------------------------------- */
  // handle window generation here.

  function Window_SDP_List() { this.initialize.apply(this, arguments); }
  Window_SDP_List.prototype = Object.create(Window_Command.prototype);
  Window_SDP_List.prototype.constructor = Window_MenuCommand;

  Window_SDP_List.prototype.initialize = function() {
    let x = 0;
    let y = 0;
    this._list = [];
    this._listMod = [];
    this._tempCost = [];
    this._actor = null;
    this.setActor($gameParty.members()[0]);
    this.refresh();
    Window_Command.prototype.initialize.call(this, x, y);
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
    console.log("refreshing!");
    this.clearCommandList();
    this.makeCommandList();
    this.drawAllItems();
  };

  Window_SDP_List.prototype.clearCommandList = function() {
    Window_Command.prototype.clearCommandList.call(this);
  };

  Window_SDP_List.prototype.makeCommandList = function() {
    this._actor._sdpCollection.forEach((SDPS) => {
      let tooPoor = this._actor._sdpPts < SDPS.cost();
      let tooStrong = SDPS.rankCur >= SDPS.rankMax;
      let enabled = !(tooPoor || tooStrong);
      this.addCommand(SDPS.name, SDPS.symbol, enabled);
    }, this);
  };

  Window_SDP_List.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    var align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
  };

  Window_SDP_List.prototype.modifyActive = function() {
    return this._listMod.length > 0;
  }

  Window_SDP_List.prototype.allocateIncrement = function() {
    // ? (cost - temp cost) - this level cost > 0 ?
    // push to temp cost array
    // increment temp level
  };

  Window_SDP_List.prototype.allocateDecrement = function() {
    // ? temp list length > 0 ?
    // pop temp cost array
    // decrement temp level
  };

  Window_SDP_List.prototype.confirmChanges = function() {
    // _listMod = _list
    // reduce points
    // empty temp variables
  };
  
  /* -------------------------------------------------------------------------- */
  function Window_SDP_Points() {this.initialize.apply(this, arguments); }

  Window_SDP_Points.prototype = Object.create(Window_Base.prototype);
  Window_SDP_Points.prototype.constructor = Window_Base;

  Window_SDP_Points.prototype.initialize = function() {
    var x = 0;
    var y = 260;
    var width = Graphics.boxWidth - x;
    var height = 100;
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
    this.drawText(a._sdpPts, 60, lh*1, 255);
  };

  /* -------------------------------------------------------------------------- */
  function Window_SDP_Details() {this.initialize.apply(this, arguments); }

  Window_SDP_Details.prototype = Object.create(Window_Base.prototype);
  Window_SDP_Details.prototype.constructor = Window_Base;
  
  Window_SDP_Details.prototype.initialize = function() {
    var x = 0;
    var y = 360;
    var width = Graphics.boxWidth - x;
    var height = Graphics.boxHeight - y;
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
    let panel = this._actor._sdpCollection[this._currentPanel];
    
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
    this.drawText(p.cost(), 220, row+lh, 255);
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
  

})(J.SD);
