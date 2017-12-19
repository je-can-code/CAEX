/* -------------------------------------------------------------------------- */
// J_ParamLimit
// V: 1.0
//

/*:@plugindesc Allows defined cap for parameters.
@author J

@param newHPmax
@desc The new cap for max HP.
@default 12

@param newMPmax
@desc The new cap for max MP.
@default 5

@param newPARAMmax
@desc The new cap for parameters.
@default 100
*/

(function() { // start plugin.
/* -------------------------------------------------------------------------- */
var pluginParams = PluginManager.parameters('J_ParamLimit');
var J = J || {}; J.ParamLimit = J.ParamLimit || {};

J.ParamLimit.newHPmax = Number(pluginParams['newHPmax']) || 999999;
J.ParamLimit.newMPmax = Number(pluginParams['newMPmax']) || 999999;
J.ParamLimit.newPARAMmax = Number(pluginParams['newPARAMmax']) || 99999;

var _DataManager_jpl_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
    var _jpl_loaded = false;
    if (!_DataManager_jpl_isDatabaseLoaded.call(this))
        return false;
    if (!_jpl_loaded) {
      this.jpl_readNotes($dataWeapons);
      this.jpl_readNotes($dataArmors);
        _jpl_loaded = true;
    }
    return true;
}

DataManager.jpl_readNotes = function(data) {
    var structure = /<(mhp|mmp|str|agi|int|pdf|mdf|luk|):(\d+)>/i;
    for (var i = 1; i < data.length; i++) {
        var obj = data[i]; // assigns the skill variable by $dataSkills[i]
        var notedata = obj.note.split(/[\r\n]+/); // separates notes by return/newLine
        obj.pl = [];
        for (var n = 0; n < notedata.length; n++) {
            var line = notedata[n];
            var f = {
                p: 0,
                l: 0,
            };
            if (line.match(structure)) {
                switch (String(RegExp.$1).toLowerCase()) {
                    case "mhp": f.p = 0; f.l = Number(RegExp.$2); break;
                    case "mmp": f.p = 1; f.l = Number(RegExp.$2); break;
                    case "str": f.p = 2; f.l = Number(RegExp.$2); break;
                    case "pdf": f.p = 3; f.l = Number(RegExp.$2); break;
                    case "int": f.p = 4; f.l = Number(RegExp.$2); break;
                    case "mdf": f.p = 5; f.l = Number(RegExp.$2); break;
                    case "agi": f.p = 6; f.l = Number(RegExp.$2); break;
                    case "luk": f.p = 7; f.l = Number(RegExp.$2); break;
                    default: f.p = 0, f.l = 0; break;
                };
            obj.pl.push(f);
            }
        }
    }
}

// rewrites to have a variable limit of parameters
Game_Actor.prototype.paramMax = function(paramId) {
  switch (paramId) {
      case 0: //maxHP
        return J.ParamLimit.newHPmax;
      break;
      case 1: //maxMP
        return J.ParamLimit.newMPmax;
      break;
      case 2: //ATK
      case 3: //DEF
      case 4: //MAT
      case 5: //MDF
      case 6: //AGI
      case 7: //LUK
        return J.ParamLimit.newPARAMmax;
      break;
      default:
        return 999;
      break;
  }
};

Game_Actor.prototype.changeEquip = function(slotId, item) {
  // if (item.note has different ParamLimit)
  // change ParamLimit
    if (this.tradeItemWithParty(item, this.equips()[slotId]) &&
            (!item || this.equipSlots()[slotId] === item.etypeId)) {
        this._equips[slotId].setObject(item);
        this.refresh();
    }
};

/* -------------------------------------------------------------------------- */
})(); // end plugin.
