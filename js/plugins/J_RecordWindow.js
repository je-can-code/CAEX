/* -------------------------------------------------------------------------- */
// J_RecordWindow
// V: 1.1
//

/*:@plugindesc This plugin creates a window that acts as a log for EXP/GOLD/items acquired.
@author J

@help The window here is primarily for use with on-the-map battling.
      It acts as an alternative to the innate "popup" functionality
      of the existing qABS which to me, felt very barebones and
      kind ugly-looking.

      The main way the plugin works, is that there is a queue of
      things that the window draws. The window stalls for X frames
      (120 by default, so 2 seconds), then starts deleting things
      out of the queue, oldest first, on 1 second intervals. Whenever
      something is added to the queue, the stall timer of 120 frames
      is reset. This repeats until all items are emptied from the
      queue.

      You can add "<no record>" to an item's notebox to make it so the
      item won't show up in the record window.

      PLUGIN COMMANDS:

        JRW item_type item_id
        where item_type = i w a
        where item_id = the id of the item in the database
        example: JRW i 7
        will pop item w/ ID7 into the record window.
        
        JRW clear
        to clear the entire record window.

      This plugin has no dependencies, but was crafted to compliment
      ABS-style battle systems.
      Just use as-is.

      v1.1: Added "<no record>" functionality to block item popups.
      v1.1: Added a catch to prevent drawing negative xp/gp.
      v1.1: Added user-modifiable entries for dictating the gold/exp icons.
      v1.1: Added plugin commands for forcing an item, and clearing.

@param w_width
@desc Window width of the record box.
@default 400

@param w_height
@desc Window height of the record box.
@default 196

@param stallMod
@desc The time in frames (60 frames = 1 second, roughly) before stuff starts disappearing
@default 120

@param expIcon
@desc The icon used for experience gains. Overwritten by J_Base if that plugin is above this.
@default 87

@param goldIcon
@desc The icon used for gold pickups. Overwritten by J_Base if that plugin is above this.
@default 314
*/
var Imported = Imported || {};
Imported.J_RecordWindow = true;

var J = J || {}; J.Records = J.Records || {};

J.Records.parameters = PluginManager.parameters('J_RecordWindow');
J.Records.winWidth = Number(J.Records.parameters['w_width']) || 400; // wide enough for most things
J.Records.winHeight = Number(J.Records.parameters['w_height']) || 196; // enough for 5 lines
J.Records.stallMod = Number(J.Records.parameters['stallMod']) || 120; // 2 second stall
J.Records.expIcon = Number(J.Records.parameters['expIcon']);
J.Records.goldIcon = Number(J.Records.parameters['goldIcon']);

(function() { // start plugin.
/* -------------------------------------------------------------------------- */
// if the window on the map doesn't exist, make it.
// if it does exist, update it.
// if there is stuff going on, hide window.
Scene_Map.prototype.handleRecordBox = function() {
  var wx = Graphics.width - J.Records.winWidth;
  var hy = Graphics.height - J.Records.winHeight;
  if (this._recordWindow) {
    this._recordWindow.update;
  }
  else {
    this._recordWindow = new Window_Record(wx, hy, J.Records.winWidth, J.Records.winHeight);
    this.addWindow(this._recordWindow);
  };
  if (this.hideExtras()) {
    this._recordWindow.close();
  }
  else {
      this._recordWindow.open();
  }
};

// latches into the update of the map
// this permits continuous updating of the _recordWindow
var _Scene_Map_jrw_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
  this.handleRecordBox();
  _Scene_Map_jrw_update.call(this);
};//update

/* -------------------------------------------------------------------------- */
  // latches into the .gainExp function
  // pushes a message into _recordWindow queue for updating
  var _Game_Actor_jrw_gainExp = Game_Actor.prototype.gainExp;
  Game_Actor.prototype.gainExp = function(exp) {
    _Game_Actor_jrw_gainExp.call(this, exp);
    var scene = SceneManager._scene;
    var e = new Record_Item(exp, 1);
    if (scene.constructor == Scene_Map) {
      scene._recordWindow.addItem(e);
    }
  };

  // latches into the event command of experience gained
  // pushes a message into _recordWindow queue for updating
  var _Game_Interpreter_jrw_command315 = Game_Interpreter.prototype.command315;
  Game_Interpreter.prototype.command315 = function() {
    _Game_Interpreter_jrw_command315.call(this);
    var scene = SceneManager._scene;
    var e = new Record_Item(this._params[4], 1);
    if (scene.constructor == Scene_Map) {
      scene._recordWindow.addItem(e);
    }
    return true;
  };

  // latches into the .gainGold function
  // pushes a message into _recordWindow queue for updating
  var _Game_Party_jrw_gainGold = Game_Party.prototype.gainGold;
  Game_Party.prototype.gainGold = function(amount) {
    _Game_Party_jrw_gainGold.call(this, amount);
    var scene = SceneManager._scene;
    var g = new Record_Item(amount, 2);
    if (scene.constructor == Scene_Map) {
      scene._recordWindow.addItem(g);
    }
  };

  // latches into the .gainItem function
  // pushes a message into _recordWindow queue for updating
  // the details of what the "item" properties are were
  // gotten from the F1 help menu under the JS Library at the bottom
  var _Game_Party_jrw_gainItem = Game_Party.prototype.gainItem;
  Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
    _Game_Party_jrw_gainItem.call(this, item, amount, includeEquip);
    var scene = SceneManager._scene;
    if (amount < 1) return; // ignores lost items.
    if (item == null) return;
    // parse for note data saying "no record"
    var notedata = item.note.split(/[\r\n]+/);
    for (var n = 0; n < notedata.length; n++) { if (notedata[n].match(/<no record>/i)) { return; } }

    if (item != null) { // this check is necessary to prevent errors in Scene_Equip
      var i = new Record_Item(item.name, 0, item.iconIndex);
      if (scene.constructor == Scene_Map) {
        scene._recordWindow.addItem(i);
      }
    }
  };

/* -------------------------------------------------------------------------- */
  // the creation function:
  // mimics the setup of a window like all other windows.
  function Window_Record() { this.initialize.apply(this, arguments); };
  Window_Record.prototype = Object.create(Window_Base.prototype);
  Window_Record.prototype.constructor = Window_Record;

  // the initialization function:
  // things that need to happen only once happen here
  // like setting up variables
  Window_Record.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._list = [];
    this._stall = 120;
    this.refresh(); // refresh window contients.
    this.activate(); // *@active = true
  };

  // the update function:
  // things that need to be updated every frame happen here.
  Window_Record.prototype.update = function() {
    Window_Base.prototype.update.call(this); // *super()
    this.refresh();
    // do things once per frame here
  };

  // the refresh function:
  // things that need to be drawn to the window will happen here.
  Window_Record.prototype.refresh = function() {
    if (this.contents) {
      this.contents.clear();
      // draw things to the window here
      this.updateItems();
    }
  };

  // function for adding an item to the window
  // adds new item at end of list
  // also resets the stall time back to 3seconds
  Window_Record.prototype.addItem = function(record) {
    this._stall = 120;
    this.contentsOpacity = 255;
    this._list.push(record);
  };

  // function for deleting an item from the window
  // removes the item at 0 index.
  Window_Record.prototype.removeItem = function() {
    this.contentsOpacity = 255;
    this._list.shift();
  };

  // function for clearing out the entire list
  // only used with plugin commands.
  Window_Record.prototype.clearList = function() {
    this._list = [];
    this.refresh();
  }

  // function for updating all items in the window
  Window_Record.prototype.updateItems = function() {
    this.contents.fontSize = 18;
    var lh = this.lineHeight() - 4; // should be 36 - 4 = 32.

    if (this._list.length > 0) { // confirms the queue has contents
      var nextItem = this._list[0]; // grabs the first item in queue
      if (this._stall >= 0) { // checks the stall counter
        this._stall--;        // if it is still there, reduces stall
      }
      else {
        if (nextItem._duration <= 0) { // if stall is passed
          this.removeItem(nextItem);   // remove item with no duration
        }
        else {
        nextItem._duration--;         // reduces duration of next item
        if (nextItem._duration < 10)
          this.contentsOpacity -= 25;

        }
      }
    }

    for (var i = 0; i < this._list.length; i++) { // iterates through each item in the queue
      var modY = lh * (i);
      var item = this._list[i];
      this.drawListItem(item, 0, modY); // draws each item in the list
    }

  };

  Window_Record.prototype.drawListItem = function(i, x, y) {
    var w = J.test_bWidth - (this.standardPadding() * 2);
    var xIcon = J.Records.expIcon;
    var gIcon = J.Records.goldIcon;
    if (Imported.J_Base) {
      xIcon = J.Icon.EXP_icon;
      gIcon = J.Icon.GOLD_icon;
    }
    switch (i._type) {
      case 0: // for items
        this.drawIcon(i._iconIndex, x, y);
        this.drawText(i._name + " found.", x + 32, y, w);
      break;
      case 1: // for experience
        this.drawIcon(xIcon, x, y);
        this.drawText(i._name + " experience gained.", x + 32, y, w)
      break;
      case 2: // for gold
        this.drawIcon(gIcon, x, y);
        this.drawText(i._name +' picked up.', x + 32, y, w)
      break;
      default: break; // there shouldn't be a need default case
    }
  };
/* -------------------------------------------------------------------------- */
// type 0 = item
// type 1 = exp
// type 2 = gold
// this is a constructor for all things that end up displayed
// within the log/record window.
// icon and duration are optional, EXP / GOLD have icons predefined.
// duration is set in two places: stall and duration.
Record_Item = function(name, type, icon, duration) {
  this._name = name;
  this._type = type;
  this._iconIndex = typeof icon !== 'undefined' ? icon : 0;
  this._duration = typeof duration !== 'undefined' ? duration : 60;
};

// extra plugin command of
// JRW item_type item_id
// ex: JRW i 10
// item_type = i OR w OR a  ==  item OR weapon OR armor
// item_id = the ID in the database for that item.
var j_rw_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
  j_rw_Game_Interpreter_pluginCommand.call(this, command, args);
  // command args[0] args[1] args[2] ...
  try {
    if (command ==='JRW') {
      var scene = SceneManager._scene;
      if (scene.constructor != Scene_Map) return;
  
      var ri = { name: "", type: 0, icon: 0, duration: 60 }
      switch (args[0]) {
        case 'i':
        case 'I':
          var temp = $dataItems[args[1]];
          ri.name = temp.name;
          ri.icon = temp.iconIndex;
          ri.type = 0;
          var pluginItem = new Record_Item(ri.name, ri.type, ri.icon);
          scene._recordWindow.addItem(pluginItem);
          break;
        case 'w':
        case 'W':
          var temp = $dataWeapons[args[1]];
          ri.name = temp.name;
          ri.icon = temp.iconIndex;
          ri.type = 0;
          var pluginItem = new Record_Item(ri.name, ri.type, ri.icon);
          scene._recordWindow.addItem(pluginItem);
          break;
        case 'a':
        case 'A':
          var temp = $dataArmors[args[1]];
          ri.name = temp.name;
          ri.icon = temp.iconIndex;
          ri.type = 0;
          var pluginItem = new Record_Item(ri.name, ri.type, ri.icon);
          scene._recordWindow.addItem(pluginItem);
          break;
        case 'clear':
          scene._recordWindow.clearList();
          break;
        default: break;
      }
    }
  } catch(e) {
    console.warn(e);
  }
};
/* -------------------------------------------------------------------------- */
})(); // end plugin.
