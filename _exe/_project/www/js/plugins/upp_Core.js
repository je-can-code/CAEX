/*:
* @plugindesc UPP_Core plugin, place on top of other plugins.
* @author William Ramsey (TheUnproPro)
*
* @param Default Startup Scene
* @desc The scene that starts up if the out of date box shows up.
* @default Scene_Title
* @Help
* $upp.vars will get saved into the games save/load file.
* $upp.vars.map[map_id].tileX and tileY are there to
* store already-loaded map data information. This prevents
* any use of re-looping every time you enter/exit the map.
*/
$upp = {
    params: PluginManager.parameters('upp_core'),
    version: 1.01,
    vars: {
      mapData: { mapLoaded: [], icons: [] }
    },
    mapData: {
      //Function to check for tiles that have collision.
      collision: function(tilex, tiley) {
        return $gameMap.checkPassage(tilex, tiley, 0x0F);
      },
      //Function to get map ID.
      mapId: function() {
        return $gameMap._mapId;
      }
    },
    //Function for scripts to require a version.
    requireVersion: function(version) {
      if(version > $upp.version){
        $upp.launch = true;
      } else {
        $upp.launch = false;
      }
    },
    eventData: function(eventId) { return eval("$gameMap._events["+eventId+"].upp_data") },
    mapData: function(mapId) { return eval("$upp.vars.mapData["+mapId+"]") }
  };
  
  $upp.defaultScene = $upp.params['Default Startup Scene']
  
  $upp.eventAlias = Game_Event.prototype.initMembers
  Game_Event.prototype.initMembers = function() {
      $upp.eventAlias.call(this);
      this.upp_data = $upp.vars.eventData;
  };
  
  $upp.mapAlias = Game_Map.prototype.initialize
  Game_Map.prototype.initialize = function() {
    $upp.mapAlias.call(this);
    this.upp_data = $upp.vars.mapData;
  }
  
  $upp.sbAlias = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function() {
    $upp.sbAlias.call(this);
    if($upp.launch==true)
    {
      SceneManager.goto(Scene_UppCore);
    }
  };
  
  $upp.makeSaveContents = DataManager.makeSaveContents;
  DataManager.makeSaveContents = function() {
    var contents = $upp.makeSaveContents.call(this);
    contents.upp_data = $upp.vars;
    return contents;
  };
  
  $upp.extractSaveContents = DataManager.extractSaveContents
  DataManager.extractSaveContents = function(contents) {
    $upp.extractSaveContents.call(this, contents);
    $upp.vars = contents.upp_data;
  };
  
  
  
  /////////////CORE SCENE/////////////
  
  //--- Window ---//
  function Window_UppCore() { this.initialize.apply(this, arguments); }
  
  Window_UppCore.prototype = Object.create(Window_Base.prototype);
  Window_UppCore.prototype.constructor = Window_UppCore;
  
  Window_UppCore.prototype.initialize = function() {
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight;
    Window_Base.prototype.initialize.call(this, width/4, height/2-this.fittingHeight(2), width/2, this.fittingHeight(5));
    this.openness = 0;
    this.open();
    this.refresh();
  };
  
  Window_UppCore.prototype.refresh = function() {
      this.contents.clear();
      this.contents.fontSize = 18;
      this.contents.drawText("upp_core version "+ $upp.version, 0, 0, this.contents.width, 18)
      this.contents.fontSize = this.standardFontSize();
      this.contents.drawText("One or more plugins you", 0, this.lineHeight(), this.contents.width, this.lineHeight());
      this.contents.drawText("are using requires an updated", 0, this.lineHeight()*2, this.contents.width, this.lineHeight());
      this.contents.drawText("version to use. Download now?", 0, this.lineHeight()*3, this.contents.width, this.lineHeight());
  }
  
  //--- Choice Window ---//
  function Window_UppCoreChoice() {
      this.initialize.apply(this, arguments);
  }
  
  Window_UppCoreChoice.prototype = Object.create(Window_HorzCommand.prototype);
  Window_UppCoreChoice.prototype.constructor = Window_UppCoreChoice;
  
  Window_UppCoreChoice.prototype.initialize = function() {
      Window_HorzCommand.prototype.initialize.call(this, 0, 0);
      this.updatePlacement();
      this.openness = 0;
      this.opacity=0;
      this.open();
      this.selectLast();
  };
  
  Window_UppCoreChoice.prototype.maxCols = function() {
      return 2;
  };
  
  Window_UppCoreChoice._lastCommandSymbol = null;
  
  Window_UppCoreChoice.initCommandPosition = function() {
      this._lastCommandSymbol = null;
  };
  
  Window_UppCoreChoice.prototype.windowWidth = function() {
      return 240;
  };
  
  Window_UppCoreChoice.prototype.updatePlacement = function() {
      this.x = (Graphics.boxWidth/2)-this.width/7;
      this.y = Graphics.boxHeight/2+(this.fittingHeight(1)/2)
  };
  
  Window_UppCoreChoice.prototype.makeCommandList = function() {
      this.addCommand("Yes",   'Yes');
      this.addCommand("No", 'No')
  };
  
  Window_UppCoreChoice.prototype.isContinueEnabled = function() {
      return DataManager.isAnySavefileExists();
  };
  
  Window_UppCoreChoice.prototype.processOk = function() {
      Window_UppCoreChoice._lastCommandSymbol = this.currentSymbol();
      Window_Command.prototype.processOk.call(this);
  };
  
  Window_UppCoreChoice.prototype.selectLast = function() {
      if (Window_UppCoreChoice._lastCommandSymbol) {
          this.selectSymbol(Window_UppCoreChoice._lastCommandSymbol);
      } else if (this.isContinueEnabled()) {
          this.selectSymbol('continue');
      }
  };
  
  //--- Scene ---//
  function Scene_UppCore() { this.initialize.apply(this, arguments); }
  
  Scene_UppCore.prototype = Object.create(Scene_Base.prototype);
  Scene_UppCore.prototype.constructor = Scene_UppCore;
  
  Scene_UppCore.prototype.initialize = function() {
      Scene_Base.prototype.initialize.call(this);
  };
  
  Scene_UppCore.prototype.create = function() {
      Scene_Base.prototype.create.call(this);
      this.createMyWin();
  };
  Scene_UppCore.prototype.createMyWin = function()
  {
      this.win = new Window_UppCore();
      this.addChild(this.win);
      this.win2 = new Window_UppCoreChoice(0, 0);
      this.win2.setHandler('Yes',      this.doChoice.bind(this, true));
      this.win2.setHandler('No',     this.doChoice.bind(this, false));
      this.addChild(this.win2);
  }
  Scene_UppCore.prototype.doChoice = function(yn)
  {
      if(yn==true)
      {
          var current=window;
          var open=window.open("https://drive.google.com/file/d/0B0BQK1ikmkf4dFR6b2pXUzI1TzA/view?usp=sharing", "_blank");
          open.focus();
      }
      SceneManager.goto(eval($upp.defaultScene));
  }