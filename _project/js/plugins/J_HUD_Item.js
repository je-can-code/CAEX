/* -------------------------------------------------------------------------- */
// J_HUD_Item
// V: 1.1

/*:@plugindesc Shows an item in the lower right corner
@author J

@param visible
@desc The item HUD extension is shown/hidden by a Game_Switch.
@default 20
*/
/* -------------------------------------------------------------------------- */
var Imported = Imported || {};
Imported.J_HUD_Item = true;

var hudItemParams = PluginManager.parameters('J_HUD_Item');
var itemVisible = Number(hudItemParams['visible']);
var iWidth = 224;
var iHeight = 48;
var iOpacity = 1.0;

// hooks into Scene_Map.update and gets the ball rolling.
var jihud_Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	jihud_Scene_Map_update.call(this);
	this.handleItem();
};

// if the window on the map doesn't exist, make it.
// if it does exist, update it.
// if there is stuff going on, hide window.
Scene_Map.prototype.handleItem = function() {
			if (this._ItemWindow) { this._ItemWindow.update; } 
			else {
		this._ItemWindow = new Window_Item(Graphics.width - iWidth, Graphics.height - iHeight);
		this.addWindow(this._ItemWindow);
		//this._ItemWindow.opacity = iOpacity;
	};
	if (J.HUD.visibility == false || this.hideExtras() || !$gameSwitches.value(itemVisible) ) {
		this._ItemWindow.close();
		console.log("close!");
	}
	else {
		this._ItemWindow.open();
		console.log("open!");
	}
};

/* -------------------------------------------------------------------------- */
//  Window_Item [NEW]
//    Creates the main window that houses all the visual data.
/* -------------------------------------------------------------------------- */
function Window_Item() { this.initialize.apply(this, arguments); }
Window_Item.prototype = Object.create(Window_Base.prototype);
Window_Item.prototype.constructor = Window_Item;

Window_Item.prototype.initialize = function(x, y) {
	Window_Base.prototype.initialize.call(this, x, y, iWidth, iHeight);
	this._updateWait = 0;
	this.refresh();
	this.activate();
};

// handles the "when i should refresh" functionality.
Window_Item.prototype.update = function() {
	Window_Base.prototype.update.call(this);
	if (this._updateWait <= 0) {
			this.refresh();
			this._updateWait = 30;
	} else {
			this._updateWait--;
	}
};

// the updating of contents within the window.
// handled by the .update method.
Window_Item.prototype.refresh = function() {
	if (this.contents) {
			this.contents.clear();
			this.drawSerum(0, 0);
	}
};

Window_Item.prototype.drawSerum = function(x, y) {
	var serum = $dataItems[1]; // the Serum
	var sName = serum.name;
	var icon = serum.iconIndex;
	var skillId = $gameSystem.absKeys()[5].skillId || 0;
	var serumLeft = $gameParty.numItems(serum);
	var skillCost = null;
	var theMath = 0;
	if (skillId > 0) {
		skillCost = $dataSkills[skillId].useItemCost[0][1];
		theMath = Math.floor(serumLeft / skillCost);
	}
	else {
		skillCost = "";
	}
	var fullString = sName + ":" + theMath;
	this.drawIcon(icon, x,y);
	this.drawTextEx(fullString, x + 36, y);
};

Window_Item.prototype.standardPadding = function() {
	return 6;
};