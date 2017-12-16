//=============================================================================
// J-Equip Screen Revamp v1.0
//=============================================================================
// Changelog:
//  v1.0: WIP plugin creatin.
/*:
@plugindesc Alters the equipscreen to provide greater detail about equipped items and their impacts on characters.
@author J
@help
REQUIRES: J_base
No commands are used outside of initial setup.

NOTE: Resolution of 1280x720 is what this was designed at.
It will not display properly at lower resolutions, and is untested at higher.
Coincidently, yanfly.moe has a core-engine that provides resolution modification.

Also, the base IconSet.png does not have all of the icons used for this.
Feel free to modify them as you please, or download yanfly's VXace modification
of the IconSet.
 */
//-----------------------------------------------------------------------------
// Scene_Equip
//
// The scene class of the equipment screen.
if (!Imported.J_Base) {
  alert("Error: this revamp requires J_Base to function properly.");
  throw new Error("Error: this revamp requires J_Base to function properly.")
}

function Scene_Equip() {
    this.initialize.apply(this, arguments);
}

Scene_Equip.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Equip.prototype.constructor = Scene_Equip;

Scene_Equip.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Equip.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createStatusWindow();
    this.createCommandWindow();
    this.createSlotWindow();
    this.createItemWindow();
    this.refreshActor();
    this._helpWindow.y = SceneManager._screenHeight - this._helpWindow.height;
};

Scene_Equip.prototype.createStatusWindow = function () {
    this._statusWindow = new Window_EquipStatus(0, 0);
    this.addWindow(this._statusWindow);
};

Scene_Equip.prototype.createCommandWindow = function () {
    var wx = this._statusWindow.width;
    var wy = 0;
    var ww = Graphics.boxWidth - this._statusWindow.width;
    this._commandWindow = new Window_EquipCommand(wx, wy, ww);
    this._commandWindow.setHelpWindow(this._helpWindow);
    this._commandWindow.setHandler('equip', this.commandEquip.bind(this));
    this._commandWindow.setHandler('optimize', this.commandOptimize.bind(this));
    this._commandWindow.setHandler('clear', this.commandClear.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this._commandWindow.setHandler('pagedown', this.nextActor.bind(this));
    this._commandWindow.setHandler('pageup', this.previousActor.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Equip.prototype.createSlotWindow = function () {
    var wx = this._statusWindow.width;
    var wy = this._commandWindow.y + this._commandWindow.height;
    var ww = Graphics.boxWidth - this._statusWindow.width;
    var wh = this._statusWindow.height - this._commandWindow.height;
    this._slotWindow = new Window_EquipSlot(wx, wy, ww, wh);
    this._slotWindow.setHelpWindow(this._helpWindow);
    this._slotWindow.setStatusWindow(this._statusWindow);
    this._slotWindow.setHandler('ok', this.onSlotOk.bind(this));
    this._slotWindow.setHandler('cancel', this.onSlotCancel.bind(this));
    this.addWindow(this._slotWindow);
};

Scene_Equip.prototype.createItemWindow = function () {
    var wx = 0;
    var wy = this._statusWindow.height;
    var ww = Graphics.boxWidth;
    var wh = Graphics.boxHeight - wy - this._helpWindow.height;
    this._itemWindow = new Window_EquipItem(wx, wy, ww, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setStatusWindow(this._statusWindow);
    this._itemWindow.setHandler('ok', this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this._slotWindow.setItemWindow(this._itemWindow);
    this.addWindow(this._itemWindow);
};

Scene_Equip.prototype.refreshActor = function () {
    var actor = this.actor();
    this._statusWindow.setActor(actor);
    this._slotWindow.setActor(actor);
    this._itemWindow.setActor(actor);
};

Scene_Equip.prototype.commandEquip = function () {
    this._slotWindow.activate();
    this._slotWindow.select(0);
};

Scene_Equip.prototype.commandOptimize = function () {
    SoundManager.playEquip();
    this.actor().optimizeEquipments();
    this._statusWindow.refresh();
    this._slotWindow.refresh();
    this._commandWindow.activate();
};

Scene_Equip.prototype.commandClear = function () {
    SoundManager.playEquip();
    this.actor().clearEquipments();
    this._statusWindow.refresh();
    this._slotWindow.refresh();
    this._commandWindow.activate();
};

Scene_Equip.prototype.onSlotOk = function () {
    this._itemWindow.activate();
    this._itemWindow.select(0);
};

Scene_Equip.prototype.onSlotCancel = function () {
    this._slotWindow.deselect();
    this._commandWindow.activate();
};

Scene_Equip.prototype.onItemOk = function () {
    SoundManager.playEquip();
    this.actor().changeEquip(this._slotWindow.index(), this._itemWindow.item());
    this._slotWindow.activate();
    this._slotWindow.refresh();
    this._itemWindow.deselect();
    this._itemWindow.refresh();
    this._statusWindow.refresh();
};

Scene_Equip.prototype.onItemCancel = function () {
    this._slotWindow.activate();
    this._itemWindow.deselect();
};

Scene_Equip.prototype.onActorChange = function () {
    this.refreshActor();
    this._commandWindow.activate();
};

//==================================================================

/*=========================================================================== |
|  Window_EquipStatus()                                                            |
|    This is an overwrite of the original Status Screen.                      |
|    Likely incompatible with other scripts that deal with this screen.       |
| ===========================================================================*/

function Window_EquipStatus() {
    this.initialize.apply(this, arguments);
}

Window_EquipStatus.prototype = Object.create(Window_Base.prototype);
Window_EquipStatus.prototype.constructor = Window_EquipStatus;

Window_EquipStatus.prototype.initialize = function (x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._actor = null;
    this._tempActor = null;
    this.refresh();
};

Window_EquipStatus.prototype.windowWidth = function () {
    return 448;
};

Window_EquipStatus.prototype.windowHeight = function () {
    return this.fittingHeight(this.numVisibleRows());
};

Window_EquipStatus.prototype.numVisibleRows = function () {
    return 10;
};

Window_EquipStatus.prototype.setActor = function (actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

// draws the actual stats and whatnot for each parameter.
Window_EquipStatus.prototype.refresh = function () {
    this.contents.clear();
    if (this._actor) {
        this.drawActorName(this._actor, this.textPadding(), 0);
        for (var i = 0; i < 8; i++) {
            this.drawItem(0, (this.lineHeight()-4) * (1 + i), i, 0);
        }
		for (var j = 0; j < 10; j++) {
           this.drawItem(144, (this.lineHeight()-4) * (1 + j), j, 1);
		}
		for (var k = 0; k < 10; k++) {
           this.drawItem(288, (this.lineHeight()-4) * (1 + k), k, 2);
		}
    }
};

Window_EquipStatus.prototype.setTempActor = function (tempActor) {
    if (this._tempActor !== tempActor) {
        this._tempActor = tempActor;
        this.refresh();
    }
};

Window_EquipStatus.prototype.drawItem = function (x, y, paramId, pType) {
    this.contents.fontSize = 18;
	switch (pType) {
		case 0:
			this.drawIcon(IconManager.bParams(paramId), x, y);
			break;
		case 1:
			this.drawIcon(IconManager.sParams(paramId), x, y);
			break;
		case 2:
			this.drawIcon(IconManager.xParams(paramId), x, y);
			break;
		default:
			this.drawIcon(IconManager.bParams(paramId), x, y);
			break;
	}
	if (this._actor) {
		this.drawCurrentParam(x + 32, y, paramId, pType);
	}
	this.drawRightArrow(x + 72, y, pType);
    if (this._tempActor) {
        this.drawNewParam(x + 96, y, paramId, pType);
    }
    this.contents.fontSize = 28;
};

Window_EquipStatus.prototype.drawCurrentParam = function (x, y, paramId, pType) {
    this.resetTextColor();
	switch (pType) {
		case 0:
			this.drawText(this._actor.param(paramId), x, y, 48, 'right');
			break;
		case 1:
			this.drawText(this._actor.sparam(paramId)*100 -100, x, y, 48, 'right');
			break;
		case 2:
			this.drawText(this._actor.xparam(paramId)*100, x, y, 48, 'right');
			break;
		default:
			break;
	}
};

Window_EquipStatus.prototype.drawRightArrow = function (x, y, pType) {
    this.changeTextColor(this.systemColor());
	switch (pType) {
		case 0:
		    this.drawText('\u25B8', x, y, 32, 'center');
			break;
		case 1:
		    this.drawText('%', x, y, 32, 'center');
			break;
		case 2:
		    this.drawText('%', x, y, 32, 'center');
			break;
		default:
			break;
	}

};

Window_EquipStatus.prototype.drawNewParam = function (x, y, paramId, pType) {
	switch (pType) {
		case 0:
    var newValue = this._tempActor.param(paramId);
    var diffvalue = newValue - this._actor.param(paramId);
    this.changeTextColor(this.paramchangeTextColor(diffvalue));
    this.drawText(newValue, x, y, 48, 'left');
			break;
		case 1:
    var newValue = this._tempActor.sparam(paramId);
    var diffvalue = newValue - this._actor.sparam(paramId);
    this.changeTextColor(this.paramchangeTextColor(diffvalue));
    this.drawText(newValue*100 -100, x, y, 48, 'left');
			break;
		case 2:
    var newValue = this._tempActor.xparam(paramId);
    var diffvalue = newValue - this._actor.xparam(paramId);
    this.changeTextColor(this.paramchangeTextColor(diffvalue));
    this.drawText(newValue*100, x, y, 48, 'left');
			break;
		default:
			break;
	}
};

//-----------------------------------------------------------------------------
// Window_EquipCommand
//
// The window for selecting a command on the equipment screen.

function Window_EquipCommand() {
    this.initialize.apply(this, arguments);
}

Window_EquipCommand.prototype = Object.create(Window_HorzCommand.prototype);
Window_EquipCommand.prototype.constructor = Window_EquipCommand;

Window_EquipCommand.prototype.initialize = function (x, y, width) {
    this._windowWidth = width;
    Window_HorzCommand.prototype.initialize.call(this, x, y);
};

Window_EquipCommand.prototype.windowWidth = function () {
    return this._windowWidth;
};

Window_EquipCommand.prototype.maxCols = function () {
    return 3;
};

Window_EquipCommand.prototype.makeCommandList = function () {
    this.addCommand(TextManager.equip2, 'equip');
    this.addCommand(TextManager.optimize, 'optimize');
    this.addCommand(TextManager.clear, 'clear');
};


//-----------------------------------------------------------------------------
// Window_EquipSlot
//
// The window for selecting an equipment slot on the equipment screen.

function Window_EquipSlot() {
    this.initialize.apply(this, arguments);
}

Window_EquipSlot.prototype = Object.create(Window_Selectable.prototype);
Window_EquipSlot.prototype.constructor = Window_EquipSlot;

Window_EquipSlot.prototype.initialize = function (x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._actor = null;
    this.refresh();
};

Window_EquipSlot.prototype.setActor = function (actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

Window_EquipSlot.prototype.update = function () {
    Window_Selectable.prototype.update.call(this);
    if (this._itemWindow) {
        this._itemWindow.setSlotId(this.index());
    }
};

Window_EquipSlot.prototype.maxItems = function () {
    return this._actor ? this._actor.equipSlots().length : 0;
};

Window_EquipSlot.prototype.item = function () {
    return this._actor ? this._actor.equips()[this.index()] : null;
};

Window_EquipSlot.prototype.drawItem = function (index) {
    if (this._actor) {
        var rect = this.itemRectForText(index);
        this.changeTextColor(this.systemColor());
        this.changePaintOpacity(this.isEnabled(index));
        this.drawText(this.slotName(index), rect.x, rect.y, 138, this.lineHeight());
        this.drawItemName(this._actor.equips()[index], rect.x + 138, rect.y);
        this.changePaintOpacity(true);
    }
};

Window_EquipSlot.prototype.slotName = function (index) {
    var slots = this._actor.equipSlots();
    return this._actor ? $dataSystem.equipTypes[slots[index]] : '';
};

Window_EquipSlot.prototype.isEnabled = function (index) {
    return this._actor ? this._actor.isEquipChangeOk(index) : false;
};

Window_EquipSlot.prototype.isCurrentItemEnabled = function () {
    return this.isEnabled(this.index());
};

Window_EquipSlot.prototype.setStatusWindow = function (statusWindow) {
    this._statusWindow = statusWindow;
    this.callUpdateHelp();
};

Window_EquipSlot.prototype.setItemWindow = function (itemWindow) {
    this._itemWindow = itemWindow;
    this.update();
};

Window_EquipSlot.prototype.updateHelp = function () {
    Window_Selectable.prototype.updateHelp.call(this);
    this.setHelpWindowItem(this.item());
    if (this._statusWindow) {
        this._statusWindow.setTempActor(null);
    }
};

//-----------------------------------------------------------------------------
// Window_EquipItem
//
// The window for selecting an equipment item on the equipment screen.

function Window_EquipItem() {
    this.initialize.apply(this, arguments);
}

Window_EquipItem.prototype = Object.create(Window_ItemList.prototype);
Window_EquipItem.prototype.constructor = Window_EquipItem;

Window_EquipItem.prototype.initialize = function (x, y, width, height) {
    Window_ItemList.prototype.initialize.call(this, x, y, width, height);
    this._actor = null;
    this._slotId = 0;
};

Window_EquipItem.prototype.setActor = function (actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
        this.resetScroll();
    }
};

Window_EquipItem.prototype.setSlotId = function (slotId) {
    if (this._slotId !== slotId) {
        this._slotId = slotId;
        this.refresh();
        this.resetScroll();
    }
};

Window_EquipItem.prototype.includes = function (item) {
    if (item === null) {
        return true;
    }
    if (this._slotId < 0 || item.etypeId !== this._actor.equipSlots()[this._slotId]) {
        return false;
    }
    return this._actor.canEquip(item);
};

Window_EquipItem.prototype.isEnabled = function (item) {
    return true;
};

Window_EquipItem.prototype.selectLast = function () {
};

Window_EquipItem.prototype.setStatusWindow = function (statusWindow) {
    this._statusWindow = statusWindow;
    this.callUpdateHelp();
};

Window_EquipItem.prototype.updateHelp = function () {
    Window_ItemList.prototype.updateHelp.call(this);
    if (this._actor && this._statusWindow) {
        var actor = JsonEx.makeDeepCopy(this._actor);
        actor.forceChangeEquip(this._slotId, this.item());
        this._statusWindow.setTempActor(actor);
    }
};

Window_EquipItem.prototype.playOkSound = function () {
};
