//=============================================================================
// J-Status Screen Revamp v1.0
//=============================================================================
// Changelog:
//  v1.0: Developed and soft-released.
/*:
@plugindesc Alters the status screen to display all details and parameters. Click "Help..." for more details.
@author J
@help
REQUIRES: J_base
No commands are used outside of initial setup.

Make certain all elements are defined for all actors
or else the status screen may display inaccurate strength/weaknesses!
Additionally, elements were displayed based on a standard of 10x elements.
Using less or more than 10x may also cause issues.

NOTE: Resolution of 1280x720 is what this was designed at.
It will not display properly at lower resolutions, and is untested at higher.
Coincidently, yanfly.moe has a core-engine that provides resolution modification.

Also, the base IconSet.png does not have all of the icons used for this.
Feel free to modify them as you please, or download yanfly's VXace modification
of the IconSet.
 */

var Imported = Imported || {};
Imported.J_revamp_statusscreen = true;

var J = J || {};

J.Parameters = PluginManager.parameters('J_revamp_statusscreen');
J.Param = J.Param || {};
J.Icon = J.Icon || {};

if (!Imported.J_Base) {
  alert("Error: this revamp requires J_Base to function properly.");
  throw new Error("Error: this revamp requires J_Base to function properly.")
}
/*=========================================================================== |
|  Window_Status()                                                            |
|    This is an overwrite of the original Status Screen.                      |
|    Likely incompatible with other scripts that deal with this screen.       |
| ===========================================================================*/

var lh = 36;
Window_Status.prototype.refresh = function () {
    this.contents.clear();
    if (this._actor) {
		this.draw_block_header(0);
		this.drawHorzLine(lh * 5);
		this.draw_block_explife(lh * 0);
		this.drawEquipments(660, 0);
    }
};

// draws the top section for face/name/class/nickname details.
Window_Status.prototype.draw_block_header = function (y) {
    this.drawActorFace(this._actor, 12, y);
    this.drawActorName(this._actor, 6, y);
    this.drawActorLevel(this._actor, 0, lh * 4);
    this.drawActorClass(this._actor, 80, lh * 4);//y);
};

// draws the status-icons/hp-mp/experience details.
Window_Status.prototype.draw_block_explife = function (y) {
    this.drawActorHp(this._actor, 160, y + lh * 1, 180);
    this.drawActorMp(this._actor, 160, y + lh * 2, 180);
    this.drawActorIcons(this._actor, 240, y + lh * 3);
    this.drawExpInfo(370, y);
};

// Draws a horizontal line at Y coordinate.
Window_Status.prototype.drawHorzLine = function (y) {
    var lineY = y + this.lineHeight() / 2 - 1;
    this.contents.paintOpacity = 48;
    this.contents.fillRect(0, lineY, this.contentsWidth(), 2, this.lineColor());
    this.contents.paintOpacity = 255;
};
Window_Status.prototype.lineColor = function () {
    return this.normalColor();
};

// Draws the details regarding EXP and EXP2next.
Window_Status.prototype.drawExpInfo = function (x, y) {
    var lineHeight = this.lineHeight();
    var expTotal = TextManager.expTotal.format(TextManager.exp);
    var expNext = TextManager.expNext.format(TextManager.level);
    var value1 = this._actor.currentExp();
    var value2 = this._actor.nextRequiredExp();
    if (this._actor.isMaxLevel()) {
        value1 = '-------';
        value2 = '-------';
    }
    this.changeTextColor(this.systemColor());
    this.drawText(expTotal, x, y + lineHeight * 0, 270);
    this.drawText(expNext, x, y + lineHeight * 2, 270);
    this.resetTextColor();
    this.drawText(value1, x, y + lineHeight * 1, 270, 'right');
    this.drawText(value2, x, y + lineHeight * 3, 270, 'right');
};

// Draws the actual equipment currently equipped.
// Though it will draw all equipments, having more than the default
//   will likely create overlap.
Window_Status.prototype.drawEquipments = function (x, y) {
    var equips = this._actor.equips();
    var count = Math.min(equips.length, this.maxEquipmentLines());
    for (var i = 0; i < count; i++) {
        this.drawItemName(equips[i], x, y + (lh-6) * i);
    }
};

// Draws the default "profile", including face portrait and level#.
Window_Status.prototype.drawProfile = function (x, y) {
    this.drawTextEx(this._actor.profile(), x, y);
};

Window_Status.prototype.maxEquipmentLines = function () {
    return 6;
};

/*=========================================================================== |
|  Window_Param_Choice()                                                      |
|    This is the window that displays an actor's parameters and handles       |
|    the cursor for selecting a parameter.                                    |
| ===========================================================================*/

function Window_Param_Choice() {
    this.initialize.apply(this, arguments);
}

Window_Param_Choice.prototype = Object.create(Window_Selectable.prototype);
Window_Param_Choice.prototype.constructor = Window_Param_Choice;

Window_Param_Choice.prototype.initialize = function (x, y, w, h) {
    var width = w;
    var height = h;
    Window_Selectable.prototype.initialize.call(this, x, y, width, height)
    this._pendingIndex = -1;
    this.refresh();
};

Window_Param_Choice.prototype.setActor = function (actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

// Changes the column count to 3 for the B/S/X parameters.
Window_Param_Choice.prototype.maxCols = function () {
    return 3;
};

// Fixes the total item count to 30 for a 10x3 grid.
Window_Param_Choice.prototype.maxItems = function () {
    return 30;
};

// Alters the item height to be 40 instead of 48.
Window_Param_Choice.prototype.itemHeight = function () {
    return 40;
};

// Fixes the width of each column to be 350, from a formula.
Window_Param_Choice.prototype.itemWidth = function () {
    return 350;
};

// Handles the refreshing of all status items drawn in the screen.
Window_Param_Choice.prototype.refresh = function () {
    if (this.contents) {
        this.contents.clear();
        this.drawAllItems();
    }
};

// Does the actual drawing of each item throughout the selectable window.
Window_Param_Choice.prototype.drawAllItems = function () {
    var topIndex = this.topIndex();
    var actor = $gameParty.menuActor();
    for (var i = 0; i < this.maxPageItems() ; i++) {
        var index = topIndex + i;
        if (index < this.maxItems()) {
            this.drawItem(index);
        }
    }
    this.drawAllElements(actor);
};

// The recipe for how to draw each item.
// This includes drawing icons, the names, and the actual parameter itself.
// It looks this complicated because I couldn't math how to get the right
//   params to draw in the right columns.
Window_Param_Choice.prototype.drawItem = function (index) {
    var rect = this.itemRectForText(index);
    var align = 'left';
    var grid = this.convertIndex(index);
    var actor = $gameParty.menuActor();
    this.resetTextColor();
    if (index == 0 || index == 3 || index == 6 || index == 9 || index == 12 || index == 15 || index == 18 || index == 21) {
        this.drawIcon(IconManager.bParams(grid), rect.x, rect.y)
        this.drawText(TextManager.param(grid), rect.x + 36, rect.y, rect.width, align);
        this.drawText(Math.floor(actor.param(grid)), rect.x, rect.y, rect.width, 'right');
    };
    if (index == 1 || index == 4 || index == 7 || index == 10 || index == 13 || index == 16 || index == 19 || index == 22 || index == 25 || index == 28) {
        this.drawIcon(IconManager.sParams(grid), rect.x, rect.y)
        this.drawText(TextManager.sparam(grid), rect.x + 36, rect.y, rect.width, align);
        this.drawText(Math.floor((actor.sparam(grid)*100)-100), rect.x, rect.y, rect.width, 'right');
    }
    if (index == 2 || index == 5 || index == 8 || index == 11 || index == 14 || index == 17 || index == 20 || index == 23 || index == 26 || index == 29) {
        this.drawIcon(IconManager.xParams(grid), rect.x, rect.y)
        this.drawText(TextManager.xparam(grid), rect.x + 36, rect.y, rect.width, align);
        this.drawText(Math.floor(actor.xparam(grid)*100), rect.x, rect.y, rect.width, 'right');
    }
};

// Handles the drawing of elemental strengths and resistances.
// Draws both icons and numeric values based on traits; if no value is present, 100 is written default.
// Numerics are colored accordingly to strength/weakness.
Window_Param_Choice.prototype.drawAllElements = function (actor) {
    var a = actor;
    var elems = actor.traitsSet(11);
    var x = Graphics.width - 160;
    for (var i = 0; i < $dataSystem.elements.length-1; i++) {
        var y = (lh+4) * i;
        var icon = IconManager.elemIcons(i + 1);
        this.drawIcon(icon, x, y);
        var e = a.elementRate(elems[i]);
        this.changeTextColor(this.textColor(this.elemColor(e)));
        this.drawText(e * 100, x + 32, y, 100);
        this.resetTextColor();

        this.drawText("%", x + 108, y, 100);
    }
}

Window_Param_Choice.prototype.elemColor = function (rate) {
    var col = 0;
    rate *= 100;
    if (rate <= 0) { // 0% dmg
        col = 7;
    }
    else if (rate > 0 && rate <= 50) { // 1-50 % dmg
        col = 4;
    }
    else if (rate > 50 && rate <= 99) { // 51-99 % dmg
        col = 1;
    }
    else if (rate == 100) { // 100 % dmg (not modified)
        col = 0;
    }
    else if (rate > 100 && rate <= 150) { // 101-150 % dmg
        col = 14;
    }
    else if (rate > 150 && rate <= 200) { // 151-200 % dmg
        col = 2;
    }
    else if (rate > 200) { // 201+ % dmg
        col = 18;
    }
    return col;
}


// Converts the index of a grid to align with the idea of three vertical columns.
Window_Param_Choice.prototype.convertIndex = function (index) {
    var i = index;
    switch (i) {
        case 0:  return 0;  case 1:  return 0;  case 2:  return 0;
        case 3:  return 1;  case 4:  return 1;  case 5:  return 1;
        case 6:  return 2;  case 7:  return 2;  case 8:  return 2;
        case 9:  return 3;  case 10: return 3;  case 11: return 3;
        case 12: return 4;  case 13: return 4;  case 14: return 4;
        case 15: return 5;  case 16: return 5;  case 17: return 5;
        case 18: return 6;  case 19: return 6;  case 20: return 6;
        case 21: return 7;  case 22: return 7;  case 23: return 7;
        case 24: return 0;  case 25: return 8;  case 26: return 8;
        case 27: return 0;  case 28: return 9;  case 29: return 9;
    }
    // note: case 24/27 are supposed to be unreachable.
}

// Draws the box for each item of the Param_Choice window.
Window_Param_Choice.prototype.itemRectForText = function (index) {
    var rect = this.itemRect(index);
    rect.x += this.textPadding();
    rect.width -= this.textPadding() * 2;
    return rect;
};

// Draws the box... period.
Window_Param_Choice.prototype.itemRect = function (index) {
    var rect = new Rectangle();
    var maxCols = this.maxCols();
    rect.width = this.itemWidth();
    rect.height = this.itemHeight();
    rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
    rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
    return rect;
};

// Hooks into the method of processCursorMove
// to draw in the description of each stat based on real (not converted) index.
Window_Param_Choice.prototype.processCursorMove = function () {
    Window_Selectable.prototype.processCursorMove.call(this);
    this.refresh();
    var txt = TextManager.param.desc(this.index());
    this.drawText(txt, 0, 430, txt.width);
};

/*=========================================================================== |
|  Scene_Status()                                                             |
|    This is the modified Scene_Status that handles the new windows.          |
| ===========================================================================*/

function Scene_Status() {
    this.initialize.apply(this, arguments);
}

Scene_Status.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Status.prototype.constructor = Scene_Status;

Scene_Status.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
};

// New initialization of the Scene_Status to draw all windows.
Scene_Status.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createStatusWindow();
    this.createParamWindow();
    this.refreshActor();
};

// Updated to also update the Window_Param_Choice.
Scene_Status.prototype.refreshActor = function () {
    var actor = this.actor();
    this._statusWindow.setActor(actor);
    this._paramWindow.setActor(actor);
};

// Makes sure the Window_Param_Choice is activated when changing actor.
Scene_Status.prototype.onActorChange = function () {
    this.refreshActor();
    this._paramWindow.activate();
};

// Original creation of status window
Scene_Status.prototype.createStatusWindow = function () {
    this._statusWindow = new Window_Status();
    this._statusWindow.setHandler('cancel', this.popScene.bind(this));
    this._statusWindow.setHandler('pagedown', this.nextActor.bind(this));
    this._statusWindow.setHandler('pageup', this.previousActor.bind(this));
    this.addWindow(this._statusWindow);
}

// Creates the window and the handler for the new Window_Param_Choice
Scene_Status.prototype.createParamWindow = function () {
    this._paramWindow = new Window_Param_Choice(0, 200, Graphics.width, 520);
    this._paramWindow.setHandler('cancel', this.popScene.bind(this));
    this._paramWindow.setHandler('pagedown', this.nextActor.bind(this));
    this._paramWindow.setHandler('pageup', this.previousActor.bind(this));
    this.addWindow(this._paramWindow);
    this._paramWindow.refresh();
    this._paramWindow.active = true;
    this._paramWindow.select(0);
};
