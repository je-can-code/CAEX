/* -------------------------------------------------------------------------- */
// J_Base
// V: 1.2
//
/*:@plugindesc The core plugin that basically handles setup, icons, text, etc. This should go above any other plugins of mine you use!
@author J

@param MHP-icon
@desc This is the icon ID for the MHP stat to be displayed.
@default 247
@param MMP-icon
@desc This is the icon ID for the MMP stat to be displayed.
@default 248
@param ATK-icon
@desc This is the icon ID for the ATK stat to be displayed.
@default 250
@param DEF-icon
@desc This is the icon ID for the DEF stat to be displayed.
@default 251
@param MAT-icon
@desc This is the icon ID for the MAT stat to be displayed.
@default 252
@param MDF-icon
@desc This is the icon ID for the MDF stat to be displayed.
@default 253
@param AGI-icon
@desc This is the icon ID for the AGI stat to be displayed.
@default 254
@param LUK-icon
@desc This is the icon ID for the LUK stat to be displayed.
@default 255
@param EXP-icon
@desc This is the icon ID for the EXP stat to be displayed.
@default 125
@param GOLD-icon
@desc This is the icon ID for the GOLD stat to be displayed.
@default 313
@param DROP-icon
@desc This is the icon ID for the 182 stat to be displayed.
@default 182
@param ---SPARAM---
@param TGR-text
@desc This is the text displayed for the TGR stat.
@default Targeting
@param TGR-icon
@desc This is the icon ID for the TGR stat to be displayed.
@default 14
@param GRD-text
@desc This is the text displayed for the GRD stat.
@default Guard Rate
@param GRD-icon
@desc This is the icon ID for the GRD stat to be displayed.
@default 12
@param REC-text
@desc This is the text displayed for the REC stat.
@default Recovery Rate
@param REC-icon
@desc This is the icon ID for the REC stat to be displayed.
@default 7
@param PHA-text
@desc This is the text displayed for the PHA stat.
@default Item Amp
@param PHA-icon
@desc This is the icon ID for the PHA stat to be displayed.
@default 176
@param MCR-text
@desc This is the text displayed for the MCR stat.
@default MP Reduce
@param MCR-icon
@desc This is the icon ID for the MCR stat to be displayed.
@default 79
@param TCR-text
@desc This is the text displayed for the TCR stat.
@default TP Charge
@param TCR-icon
@desc This is the icon ID for the TCR stat to be displayed.
@default 76
@param PDR-text
@desc This is the text displayed for the PDR stat.
@default PhysDMG%
@param PDR-icon
@desc This is the icon ID for the PDR stat to be displayed.
@default 51
@param MDR-text
@desc This is the text displayed for the MDR stat.
@default MagiDMG%
@param MDR-icon
@desc This is the icon ID for the MDR stat to be displayed.
@default 53
@param FDR-text
@desc This is the text displayed for the FDR stat.
@default FloorDMG%
@param FDR-icon
@desc This is the icon ID for the FDR stat to be displayed.
@default 54
@param EXR-text
@desc This is the text displayed for the EXR stat.
@default EXPboost%
@param EXR-icon
@desc This is the icon ID for the EXR stat to be displayed.
@default 249
@param ---XPARAM---
@param HIT-text
@desc This is the text displayed for the HIT stat.
@default Hit%
@param HIT-icon
@desc This is the icon ID for the HIT stat to be displayed.
@default 102
@param EVA-text
@desc This is the text displayed for the EVA stat.
@default Evade%
@param EVA-icon
@desc This is the icon ID for the EVA stat to be displayed.
@default 6
@param CRI-text
@desc This is the text displayed for the CRI stat.
@default Critical%
@param CRI-icon
@desc This is the icon ID for the CRI stat to be displayed.
@default 78
@param CEV-text
@desc This is the text displayed for the CEV stat.
@default Crit Evade
@param CEV-icon
@desc This is the icon ID for the CEV stat to be displayed.
@default 74
@param MEV-text
@desc This is the text displayed for the MCR stat.
@default M-Evade%
@param MEV-icon
@desc This is the icon ID for the MCR stat to be displayed.
@default 9
@param MRF-text
@desc This is the text displayed for the MRF stat.
@default M-Reflect%
@param MRF-icon
@desc This is the icon ID for the MRF stat to be displayed.
@default 222
@param CNT-text
@desc This is the text displayed for the CNT stat.
@default Counter%
@param CNT-icon
@desc This is the icon ID for the CNT stat to be displayed.
@default 15
@param HRG-text
@desc This is the text displayed for the HRG stat.
@default HP Regen%
@param HRG-icon
@desc This is the icon ID for the HRG stat to be displayed.
@default 84
@param MRG-text
@desc This is the text displayed for the MRG stat.
@default MP Regen%
@param MRG-icon
@desc This is the icon ID for the MRG stat to be displayed.
@default 302
@param TRG-text
@desc This is the text displayed for the TRG stat.
@default TP Regen
@param TRG-icon
@desc This is the icon ID for the TRG stat to be displayed.
@default 70
@param EL01-icon
@desc This is the icon ID for element#1 (default: Physical-Slash).
@default 123
@param EL02-icon
@desc This is the icon ID for element#2 (default: Physical-Pierce).
@default 107
@param EL03-icon
@desc This is the icon ID for element#3 (default: Physical-Blunt).
@default 110
@param EL04-icon
@desc This is the icon ID for element#4 (default: Fire).
@default 64
@param EL05-icon
@desc This is the icon ID for element#5 (default: Water).
@default 67
@param EL06-icon
@desc This is the icon ID for element#6 (default: Earth).
@default 68
@param EL07-icon
@desc This is the icon ID for element#7 (default: Air).
@default 69
@param EL08-icon
@desc This is the icon ID for element#8 (default: Holy).
@default 70
@param EL09-icon
@desc This is the icon ID for element#9 (default: Darkness).
@default 71
@param EL10-icon
@desc This is the icon ID for element#10 (default: Nonelemental).
@default 118

@help This is a plugin that handles all of the assignment for icons used in my
        "revamped" status screen and equip screen. It also adds icons into
        basically any command menu for things like "inventory" and "save game".
        Additionally, most note-reading handled throughout any plugins I write
        is/will-be handled within this too, like my J_DropItem or J_XPGPvariance.

Changelog:
  v1.2: Added in the function that uses text-to-icon function,
            also added the note-reading to this plugin.

  v1.1: Added in text-to-icon function for use with all commands.
  v1.0: Developed and soft-released.
*/

var Imported = Imported || {};
Imported.J_Base = true;

var J = J || {};

J.Parameters = PluginManager.parameters('J_Base');
J.Param = J.Param || {};
J.Icon = J.Icon || {};

// New function for handling Icons throughout this plugin.
function IconManager() {
    throw new Error('This is a static class.');
}

// Returns an iconID for use depending on the text in a command window.
// this applies to any command window in the game.
IconManager.textForIcon = function (text) {
  switch (text) {
    case TextManager.item: return 372;
    case TextManager.skill: return 78;
    case TextManager.equip: return 550;
    case TextManager.optimize: return 90;
    case TextManager.clear: return 91;
    case TextManager.status: return 84;
    case TextManager.formation: return 82;
    case TextManager.options: return 83;
    case TextManager.save: return 79;
    case TextManager.gameEnd: return 91;
    case TextManager.newGame: return 480;
    case TextManager.continue_: return 342;
    case TextManager.weapon: return 501;
    case TextManager.armor: return 548;
    case TextManager.keyItem: return 195;
    case "Allocate": return 457;
    case J.AddOns.Difficulty.getDifficultyName(0): return 497;
    case J.AddOns.Difficulty.getDifficultyName(1): return 498;
    case J.AddOns.Difficulty.getDifficultyName(2): return 501;
    default: return 0;
  }
}

// Elemental-Icon handling:
// Assigns icons based on the number from the default params.
// Elemental names are not used, icons are instead.
J.Icon.EL01_icon = Number(J.Parameters['EL01-icon']);
J.Icon.EL02_icon = Number(J.Parameters['EL02-icon']);
J.Icon.EL03_icon = Number(J.Parameters['EL03-icon']);
J.Icon.EL04_icon = Number(J.Parameters['EL04-icon']);
J.Icon.EL05_icon = Number(J.Parameters['EL05-icon']);
J.Icon.EL06_icon = Number(J.Parameters['EL06-icon']);
J.Icon.EL07_icon = Number(J.Parameters['EL07-icon']);
J.Icon.EL08_icon = Number(J.Parameters['EL08-icon']);
J.Icon.EL09_icon = Number(J.Parameters['EL09-icon']);
J.Icon.EL10_icon = Number(J.Parameters['EL10-icon']);


// B-Parameter handling:
// Assigns icons based on the number from the default params.
// B-Parameters by default are named in the database.
J.Icon.MHP_icon = Number(J.Parameters['MHP-icon']);
J.Icon.MMP_icon = Number(J.Parameters['MMP-icon']);
J.Icon.ATK_icon = Number(J.Parameters['ATK-icon']);
J.Icon.DEF_icon = Number(J.Parameters['DEF-icon']);
J.Icon.MAT_icon = Number(J.Parameters['MAT-icon']);
J.Icon.MDF_icon = Number(J.Parameters['MDF-icon']);
J.Icon.AGI_icon = Number(J.Parameters['AGI-icon']);
J.Icon.LUK_icon = Number(J.Parameters['LUK-icon']);
J.Icon.EXP_icon = Number(J.Parameters['EXP-icon']);
J.Icon.GOLD_icon = Number(J.Parameters['GOLD-icon']);
J.Icon.DROP_icon = Number(J.Parameters['DROP-icon']);

// S-Parameter handling:
// Assigns icons based on the number from the default params.
// Assigns text names based on the default params since they are not defined in the database.
J.Param.TGR_text = String(J.Parameters['TGR-text']); J.Icon.TGR_icon = Number(J.Parameters['TGR-icon']);
J.Param.GRD_text = String(J.Parameters['GRD-text']); J.Icon.GRD_icon = Number(J.Parameters['GRD-icon']);
J.Param.REC_text = String(J.Parameters['REC-text']); J.Icon.REC_icon = Number(J.Parameters['REC-icon']);
J.Param.PHA_text = String(J.Parameters['PHA-text']); J.Icon.PHA_icon = Number(J.Parameters['PHA-icon']);
J.Param.MCR_text = String(J.Parameters['MCR-text']); J.Icon.MCR_icon = Number(J.Parameters['MCR-icon']);
J.Param.TCR_text = String(J.Parameters['TCR-text']); J.Icon.TCR_icon = Number(J.Parameters['TCR-icon']);
J.Param.PDR_text = String(J.Parameters['PDR-text']); J.Icon.PDR_icon = Number(J.Parameters['PDR-icon']);
J.Param.MDR_text = String(J.Parameters['MDR-text']); J.Icon.MDR_icon = Number(J.Parameters['MDR-icon']);
J.Param.FDR_text = String(J.Parameters['FDR-text']); J.Icon.FDR_icon = Number(J.Parameters['FDR-icon']);
J.Param.EXR_text = String(J.Parameters['EXR-text']); J.Icon.EXR_icon = Number(J.Parameters['EXR-icon']);

// X-Parameter handling:
// Assigns icons based on the number from the default params.
// Assigns text names based on the default params since they are not defined in the database.
J.Param.HIT_text = String(J.Parameters['HIT-text']); J.Icon.HIT_icon = Number(J.Parameters['HIT-icon']);
J.Param.EVA_text = String(J.Parameters['EVA-text']); J.Icon.EVA_icon = Number(J.Parameters['EVA-icon']);
J.Param.CRI_text = String(J.Parameters['CRI-text']); J.Icon.CRI_icon = Number(J.Parameters['CRI-icon']);
J.Param.CEV_text = String(J.Parameters['CEV-text']); J.Icon.CEV_icon = Number(J.Parameters['CEV-icon']);
J.Param.MEV_text = String(J.Parameters['MEV-text']); J.Icon.MEV_icon = Number(J.Parameters['MEV-icon']);
J.Param.MRF_text = String(J.Parameters['MRF-text']); J.Icon.MRF_icon = Number(J.Parameters['MRF-icon']);
J.Param.CNT_text = String(J.Parameters['CNT-text']); J.Icon.CNT_icon = Number(J.Parameters['CNT-icon']);
J.Param.HRG_text = String(J.Parameters['HRG-text']); J.Icon.HRG_icon = Number(J.Parameters['HRG-icon']);
J.Param.MRG_text = String(J.Parameters['MRG-text']); J.Icon.MRG_icon = Number(J.Parameters['MRG-icon']);
J.Param.TRG_text = String(J.Parameters['TRG-text']); J.Icon.TRG_icon = Number(J.Parameters['TRG-icon']);

TextManager.param.desc = function (paramId) {
    switch (paramId) {// can be no longer than this line below, overflow is not handled.
                     // "========================================================================================="
        case 00: return "A numeric measurement of a person's life. Character will die upon depletion.";
        case 03: return "A character's mental capacity. These are typically consumed in spellcasting and the like.";
        case 06: return "Physical power. Improves physical skills/abilities and usually physical weapon attacks.";
        case 09: return "Physical endurance. The tougher you are, the less damage taken from physical attacks.";
        case 12: return "Mental prowess. Higher prowess yields more potent spells and some magical weapons.";
        case 15: return "Magical resistance. Higher resistance reduces incoming spell and ability damage.";
        case 18: return "Speed and agility. Take more actions, dodge more attacks, and act more ninja overall.";
        case 21: return "Luck is used in a wide array of things, but typically provides more loot drops.";
            //case 24: return "";
            //case 27: return "";

        case 01: return "Targeting rate is normally zero, unless you are being extra sneaky or extra provacative.";
        case 04: return "Higher guard rating will make defending exponentially more effective.";
        case 07: return "Recovery rate is a percentage multiplier against all incoming healing.";
        case 10: return "Item Amp is a percentage multiplier against the damage/healing effects of all items.";
        case 13: return "Improving the MP Reduce stat will reduce the cost of spells costing MP by a percentage.";
        case 16: return "TP Charge influences the rate at which you gain TP throughout battle.";
        case 19: return "Compared to standard physical defense, this is a percentage reduction of physical damage.";
        case 22: return "Compared to standard magical defense, this is a percentage reduction of magical damage.";
        case 25: return "A percentage damage reduction from dangerous floors and environments.";
        case 28: return "Heighting the rate at which you gain experience is the result of improving this stat.";

        case 02: return "The modified rating of accuracy, matched against the target's evasion to deliver a hit.";
        case 05: return "The modified rating of evasion, matched against the target's accuracy to receive a hit.";
        case 08: return "Critical Rate is the percentage chance that your attack will strike for critical damage.";
        case 11: return "Similar to standard evasion, this reduces the chance of being struck by a critical hit.";
        case 14: return "Provides a percentage chance that magical skills will be avoided entirely.";
        case 17: return "Provides a chance to return a magical skill to the caster while taking no damage!";
        case 20: return "Provides a chance to return a physical skill or attack to the caster!";
        case 23: return "A percentage of life will be recovered gradually at this rate.";
        case 26: return "A percentage of magic will be recovered gradually at this rate.";
        case 29: return "A percentage of technica will be recovered gradually at this rate.";
        default: return "";
    }
}

// Pulls text from the default params (user modified) for S-Parameters.
// These by default do not have a name defined in the database.
TextManager.sparam = function (sParamId) {
    switch (sParamId) {
        case 0: return J.Param.TGR_text;
        case 1: return J.Param.GRD_text;
        case 2: return J.Param.REC_text;
        case 3: return J.Param.PHA_text;
        case 4: return J.Param.MCR_text;
        case 5: return J.Param.TCR_text;
        case 6: return J.Param.PDR_text;
        case 7: return J.Param.MDR_text;
        case 8: return J.Param.FDR_text;
        case 9: return J.Param.EXR_text;
    }
};

// Pulls text from the default params (user modified) for X-Parameters.
// These by default do not have a name defined in the database.
TextManager.xparam = function (xParamId) {
    switch (xParamId) {
        case 0: return J.Param.HIT_text;
        case 1: return J.Param.EVA_text;
        case 2: return J.Param.CRI_text;
        case 3: return J.Param.CEV_text;
        case 4: return J.Param.MEV_text;
        case 5: return J.Param.MRF_text;
        case 6: return J.Param.CNT_text;
        case 7: return J.Param.HRG_text;
        case 8: return J.Param.MRG_text;
        case 9: return J.Param.TRG_text;
    }
};

// Assigns icons to elemental icons based on icon number provided in default params.
IconManager.elemIcons = function (elemID) {
    switch (elemID) {
        case 00: return 16; // black circle; element ID starts at 1, not 0!
        case 01: return J.Icon.EL01_icon;
        case 02: return J.Icon.EL02_icon;
        case 03: return J.Icon.EL03_icon;
        case 04: return J.Icon.EL04_icon;
        case 05: return J.Icon.EL05_icon;
        case 06: return J.Icon.EL06_icon;
        case 07: return J.Icon.EL07_icon;
        case 08: return J.Icon.EL08_icon;
        case 09: return J.Icon.EL09_icon;
        case 10: return J.Icon.EL10_icon;
    }
}

// Assigns icons to B-parameter ID's based on icon number provided in default params.
IconManager.bParams = function (bParamId) {
    switch (bParamId) {
        case 0: return J.Icon.MHP_icon;
        case 1: return J.Icon.MMP_icon;
        case 2: return J.Icon.ATK_icon;
        case 3: return J.Icon.DEF_icon;
        case 4: return J.Icon.MAT_icon;
        case 5: return J.Icon.MDF_icon;
        case 6: return J.Icon.AGI_icon;
        case 7: return J.Icon.LUK_icon;
        case 8: return J.Icon.EXP_icon;
        case 9: return J.Icon.GOLD_icon;
        case 10: return J.Icon.DROP_icon;
    }
}

// Assigns icons to S-parameter ID's based on icon number provided in default params.
IconManager.sParams = function (sParamId) {
    switch (sParamId) {
        case 0: return J.Icon.TGR_icon;
        case 1: return J.Icon.GRD_icon;
        case 2: return J.Icon.REC_icon;
        case 3: return J.Icon.PHA_icon;
        case 4: return J.Icon.MCR_icon;
        case 5: return J.Icon.TCR_icon;
        case 6: return J.Icon.PDR_icon;
        case 7: return J.Icon.MDR_icon;
        case 8: return J.Icon.FDR_icon;
        case 9: return J.Icon.EXR_icon;
    }
}

// Assigns icons to X-parameter ID's based on icon number provided in default params.
IconManager.xParams = function (xParamId) {
    switch (xParamId) {
        case 0: return J.Icon.HIT_icon;
        case 1: return J.Icon.EVA_icon;
        case 2: return J.Icon.CRI_icon;
        case 3: return J.Icon.CEV_icon;
        case 4: return J.Icon.MEV_icon;
        case 5: return J.Icon.MRF_icon;
        case 6: return J.Icon.CNT_icon;
        case 7: return J.Icon.HRG_icon;
        case 8: return J.Icon.MRG_icon;
        case 9: return J.Icon.TRG_icon;
    }
};

/* -------------------------------------------------------------------------- */
//    MENU ICONS (OVERWRITES)
// This method is a rewrite to add in the drawing of icons in the main
// menu of the game. it pulls icons from J_Base aka IconManager and
// assigns them to just about every command in the game.
// Note: no icon is assigned by default.
/* -------------------------------------------------------------------------- */
Window_Command.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    var align = this.itemTextAlign();
    var iconIndex = IconManager.textForIcon(this.commandName(index));
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawIcon(iconIndex, rect.x, rect.y); // NEW- adds in an icon.
    this.drawText(this.commandName(index), rect.x + 36, rect.y, rect.width, align);
};

Scene_Map.prototype.hideExtras = function() {
  if ($gameMessage.isBusy() || $gameMap.isEventRunning()) return true;
  return false;
};

/* -------------------------------------------------------------------------- */
//    NOTE READING
// Rather than blitz through the notes multiple times, I opted to put all the
// note reading into this function, so other plugins like J_XPGPvariance will
// need this to function. Since otherwise, this does basically nothing by
// itself, it shouldn't be too harmful. (right?)
/* -------------------------------------------------------------------------- */
// hooks into the database loader method.
// allows the loading of the database, and then the loading/assigning of all notes.
// this makes it happen once per game-load.
var _DataManager_jadd_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
    var _jadd_loaded = false;
    if (!_DataManager_jadd_isDatabaseLoaded.call(this))
        return false;
    if (!_jadd_loaded) {
        this.jadd_readNotes($dataEnemies);
        _jadd_loaded = true;
    }
    return true;
};

DataManager.jadd_readNotes = function(data) {
    var structure1 = /<(i|w|a):(\d+):(\d+)>/i; // for enemy extra drops
    var structure2 = /<Level: (\d+)>/i; // for enemy level
    var structure3 = /<GPmod: (\d+)>/i; // for gold variance
    for (var i = 1; i < data.length; i++) {
        var enemy = data[i]; // assigns the enemy variable by $dataEnemies[i]
        var notedata = enemy.note.split(/[\r\n]+/); // separates notes by return/newLine
        enemy.extraDrops = []; // creates new array to contain all drops
        enemy.level = 0;
        enemy.gpvar = 0;

        for (var n = 0; n < notedata.length; n++) {
            var line = notedata[n];
            if (line.match(structure1)) {
                var drop = { // mimics the DropItem object with identical properties
                    kind: 1,        // default: i for item
                    denominator: 0, // default: 0% drop chance
                    dataId: 1,      // default: ID 1
                };
                switch (String(RegExp.$1).toLowerCase()) {
                    case "i": drop.kind = 1;
                    case "w": drop.kind = 2;
                    case "a": drop.kind = 3;
                    default: drop.kind = 1;
                };
                drop.dataId = Number(RegExp.$2); // ID of drop
                drop.denominator = Number(RegExp.$3); // rate of drop
                enemy.extraDrops.push(drop); // adds drop to the enemy's extraDrop array
            }
            else if (line.match(structure2)) {
              enemy.level = Number(RegExp.$1); // assigns them a new level
            }
            else if (line.match(structure3)) { // assigns them gp drop variance amount
              enemy.gpvar = Number(RegExp.$1);
            }
        }
    }
};
