/* -------------------------------------------------------------------------- */
// J_HUD
// V: 1.0

/*:@plugindesc Stemmed from Mr. Wriggles' SimpleHUD, but added more things.
@author J (+ mr wiggles)

@param HUD_width
@desc width of HUD
@default 420

@param HUD_height
@desc height of HUD
@default 128

@param HUD_opacity
@desc The visibility (0 being invis, 255 being solid) of the HUD.
@default 255

@help This is a generic HUD plugin. It accomplishes the goal of displaying
      things like HP/MP/TP while on the map.
    The following plugin commands are available:
     'show' = show HUD; Example 'J_HUD hide'
     'hide' = hide HUD; Example 'J_HUD show'
*/
/* -------------------------------------------------------------------------- */
var Imported = Imported || {};
Imported.J_HUD = true;

var J = J || {};
J.HUD = J.HUD || {};
J.HUD.Parameters = PluginManager.parameters('J_HUD');
J.HUD.width = Number(J.HUD.Parameters['HUD_width']);
J.HUD.height = Number(J.HUD.Parameters['HUD_height']);
J.HUD.HUDopacity = Number(J.HUD.Parameters['HUD_opacity']);
J.HUD.visibility = true;

(function() { // start plugin.
/* -------------------------------------------------------------------------- */
//  Game_Interpreter Modifications
//    deals with the extra pluginCommand stuff for manually doing things
//    within the game (using the pluginCommand event command).
/* -------------------------------------------------------------------------- */
  var _Game_Interpreter_jHUD_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_jHUD_pluginCommand.call(this, command, args);
    if (command === 'J_HUD') {
      switch (args[0]) {
        case 'hide':
          J.HUD.visibility = false;
          break;
        case 'show':
          J.HUD.visibility = true;
          break;
      }
    }
  };
/* -------------------------------------------------------------------------- */
//  Scene_Map Modifications
//    Handles the update process of the HUD.
//    If not created creates. If created, updates.
/* -------------------------------------------------------------------------- */

  // hooks into Scene_Map.update and gets the ball rolling.
  var _Scene_Map_jHUD_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function() {
    this.handleHUD();
    _Scene_Map_jHUD_update.call(this);
  };

  // if the window on the map doesn't exist, make it.
  // if it does exist, update it.
  // if there is stuff going on, hide window.
  Scene_Map.prototype.handleHUD = function() {
    if (this._HUDWindow) {
      this._HUDWindow.update;
    } else {
      this._HUDWindow = new Window_HUD(0,0);
      this.addWindow(this._HUDWindow);
      this._HUDWindow.opacity = J.HUD.HUDopacity;
    };
    if (J.HUD.visibility == false || this.hideExtras()) {
      this._HUDWindow.close();
    }
    else {
        this._HUDWindow.open();
    }
  };
/* -------------------------------------------------------------------------- */
//  Window_HUD [NEW]
//    Creates the main window that houses all the visual data.
/* -------------------------------------------------------------------------- */
  function Window_HUD() { this.initialize.apply(this, arguments); }
  Window_HUD.prototype = Object.create(Window_Base.prototype);
  Window_HUD.prototype.constructor = Window_HUD;

  // the initialization of the window.
  // effectively, what happens when first called.
  Window_HUD.prototype.initialize = function(x, y) {
    Window_Base.prototype.initialize.call(this, x, y,
      J.HUD.width, J.HUD.height);
      this._updateWait = 0;
      this.refresh();
      this.activate();
    };

    // handles the "when i should refresh" functionality.
    Window_HUD.prototype.update = function() {
      Window_Base.prototype.update.call(this);
      if (this._updateWait <= 0) {
        this.refresh();
        this._updateWait = 3;
      } else {
        this._updateWait--;
      }
    };

    // the updating of contents within the window.
    // handled by the .update method.
    Window_HUD.prototype.refresh = function() {
      if (this.contents) {
        if ($gameParty != null) {
          var actor = $gameParty.leader();
        }
        var lineHeight = this.lineHeight();
        this.contents.clear();
        if (actor) {
          this.drawHUDstatus(actor, 0, 0, 300);
        }
      }
    };

    // does all the heavy lifting.
    // all things drawn here.
    Window_Base.prototype.drawHUDstatus = function(actor, x, y, width) {
      this.contents.fontSize = 18;
      var lh = 18;
      var x2 = x + 120; var x3 = 264;
      var barWidth = 200;

      // colors for bars.
      var hpc1 = this.hpGaugeColor1(); var hpc2 = this.hpGaugeColor2();
      var mpc1 = this.mpGaugeColor1(); var mpc2 = this.mpGaugeColor2();
      var tpc1 = this.tpGaugeColor1(); var tpc2 = this.tpGaugeColor2();

      // draws name and face
      this.drawFace(actor.faceName(), actor.faceIndex(), x, y, 100, 64);
      this.drawActorName(actor, x2, y);

      // draws hp and gauge
      this.drawGaugeMod(x2, y + 6 +  lh * 1, barWidth, 8, actor.hpRate(), hpc1, hpc2);
      this.drawText(actor.hp.toFixed(0), x3, y + lh * 1, 100, 'left');

      // draws mp and gauge
      this.drawGaugeMod(x2, y + 6 + lh * 2, barWidth, 8, actor.mpRate(), mpc1, mpc2);
      this.drawText(actor.mp.toFixed(0), x3, y + lh * 2, 100, 'left');

      // draws tp and gauge
      this.drawGaugeMod(x2, y + 10 + lh * 3, barWidth, 4, actor.tpRate(), tpc1, tpc2);
      this.drawText(actor.tp.toFixed(0), x3, y + lh * 3, 100, 'left');

      // draws exp and gauge
      this.drawEXPgauge(actor, x + 10, y + 10 + lh * 3, barWidth);
      this.drawText(actor.nextRequiredExp(), x, y + 10 + lh * 3, 44);
      this.drawActorLevel(actor, x2 + 128, y);

      // draws icons for status buff/debuffs
      this.drawActorIcons(actor, x + 298, y);
    };

    Window_Base.prototype.drawActorIcons = function(actor, x, y, width) {
      width = width || 144;
      var states = actor.states();
      var icons = actor.stateIcons().slice(0, Math.floor(width / Window_Base._iconWidth));
      for (var i = 0; i < icons.length; i++) {
        this.drawIcon(icons[i], x + Window_Base._iconWidth * i, y + 2);
        var oldSize = this.contentsHeight.fontSize;
        this.contents.fontSize = 12;
        var timer = Number(actor._stateDuration[states[i].id] / 60).toFixed(1);
        this.drawText(timer, x + Window_Base._iconWidth * i, y + 2)
        this.contents.fontSize = oldSize;
      }
    };

    // custom method for drawing a gauge for the leader's EXP.
    Window_Base.prototype.drawEXPgauge = function(actor, x, y, width) {
      width = width || 186;
      var color1 = this.textColor(24);
      var color2 = this.textColor(25);
      var xp4next = actor.nextLevelExp() - actor.currentLevelExp();
      var cExp = actor.currentExp() - actor.currentLevelExp();
      var expRate = cExp / xp4next;
      this.drawGaugeMod(x, y+10, width, 6, expRate, color1, color2);
    };

    // a custom variant of the drawGauge function.
    // allows for also drawing the height of the gauge.
    Window_Base.prototype.drawGaugeMod = function(x, y, width, height, rate, color1, color2) {
      var fillW = Math.floor(width * rate);
      var gaugeY = y + height;
      this.contents.fillRect(x-2, gaugeY-2, width+4, height+4, this.gaugeBackColor());
      this.contents.fillRect(x, gaugeY, width, height, this.gaugeBackColor());
      this.contents.gradientFillRect(x, gaugeY, fillW, height, color1, color2);
    };
/* -------------------------------------------------------------------------- */
})(); // end plugin.
