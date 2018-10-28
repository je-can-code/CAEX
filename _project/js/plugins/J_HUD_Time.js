/* -------------------------------------------------------------------------- */
// J_HUD_Time
// V: 1.0

/*:@plugindesc Shows the current time in the upper right corner.
@author J

@param visible
@desc The time HUD extension is shown/hidden by a Game_Switch.
@default 102
*/
/* -------------------------------------------------------------------------- */
var Imported = Imported || {};
Imported.J_HUD_Time = true;

var hudItemParams = PluginManager.parameters('J_HUD_Time');
var itemVisible = Number(hudItemParams['visible']);
var timeWidth 	= 224;
var timeHeight 	= 48;

// hooks into Scene_Map.update and gets the ball rolling.
var JTIME_Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	this.handleTime();
	JTIME_Scene_Map_update.call(this);
};

// if the window on the map doesn't exist, make it.
// if it does exist, update it.
// if there is stuff going on, hide window.
Scene_Map.prototype.handleTime = function() {
	if (this._TimeWindow) { this._TimeWindow.update; } 
	else {
		this._TimeWindow = new Window_Time(Graphics.width-timeWidth,0);
		this.addWindow(this._TimeWindow);
		//this._TimeWindow.opacity = J.HUD.HUDopacity;
	};
	if (J.HUD.visibility == false || this.hideExtras()) {
		this._TimeWindow.close();
	}
	else {
		this._TimeWindow.open();
	}
};

/* -------------------------------------------------------------------------- */
//  Window_Time [NEW]
//    Creates the main window that houses all the visual data.
/* -------------------------------------------------------------------------- */
function Window_Time() { this.initialize.apply(this, arguments); }
Window_Time.prototype = Object.create(Window_Base.prototype);
Window_Time.prototype.constructor = Window_Time;

Window_Time.prototype.initialize = function(x, y) {
	Window_Base.prototype.initialize.call(this, x, y, timeWidth, timeHeight);
	this._updateWait = 0;
	this.refresh();
	this.activate();
};

// handles the "when i should refresh" functionality.
Window_Time.prototype.update = function() {
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
Window_Time.prototype.refresh = function() {
	if (this.contents) {
		this.contents.clear();
		this.drawTime(0, 0);
	}
};

Window_Time.prototype.drawTime = function(x, y) {
	var seconds = this.pad($gameVariables.value(21), 2);
	var minutes = this.pad($gameVariables.value(22), 2);
	var hours   = $gameVariables.value(23);
	var ampm = "";
	if (hours > 12) {	hours -= 12; ampm = "PM"
	} else { ampm = "AM";	}
	hours = this.pad(hours, 2);
	var timeString = hours + ":" + minutes + ":" + seconds + " " + ampm;
	this.drawIcon(364, x,y);
	this.drawTextEx(timeString, x + 36, y);
};

Window_Time.prototype.pad = function(number, targetLength) {
	var output = number + '';
	while (output.length < targetLength) { output = '0' + output; }
	return output;
};

Window_Time.prototype.standardPadding = function() {
	return 6;
};