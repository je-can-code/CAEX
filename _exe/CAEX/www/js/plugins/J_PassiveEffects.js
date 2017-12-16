/* -------------------------------------------------------------------------- */
// J_PassiveEffects
// V: 0.1
// non-functional.

(function() { // start plugin.
    // objectives:
    // add passives to each actor via equipment
    // check on skill learn/forget to add/remove passive effects
    // passive effects can be fixed or percent
/* -------------------------------------------------------------------------- */
var pluginParams = PluginManager.parameters('J_PassiveEffects');
var J = J || {}; J.PassiveEffects = J.PassiveEffects || {};

var _DataManager_jpe_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
    var _jpe_loaded = false;
    if (!_DataManager_jpe_isDatabaseLoaded.call(this)) 
        return false;
    if (!_jpe_loaded) {
        this.jpe_readNotes($dataSkills);
        _jpe_loaded = true;
        //alert("loaded!");
    }
    return true;
}

// hook in the method to add parameters based on skill learned?
// since all skills must be learned (and forgotten).
var _Game_Actor_jdi_learnSkill = Game_Actor.prototype.learnSkill;
Game_Actor.prototype.learnSkill = function(skillId) {
    _Game_Actor_jdi_learnSkill.call(this, skillId);
    var actor = this.actor();
    var skill = $dataSkills[skillId];
    for (var a = 0; a < skill.fx.length; a++) {
        var effect = skill.fx[a];
        switch (effect.direction) {
            case "+":
                window.console.log(effect.param + " " + effect.direction + effect.impact);
                break;
            case "-": 
                break;
            case "%":
                break;
            default:
                break;
        }
    }
};

DataManager.jpe_readNotes = function(data) {
    var structure = /<(mhp|mmp|str|agi|int|pdf|mdf|luk|):(%|\+|-)(\d+)>/i;
    for (var i = 1; i < data.length; i++) {
        var skill = data[i]; // assigns the skill variable by $dataSkills[i]
        var notedata = skill.note.split(/[\r\n]+/); // separates notes by return/newLine
        skill.fx = [];
        for (var n = 0; n < notedata.length; n++) {
            var line = notedata[n];
            var effect = {
                param: 0,
                ptype: 0,
                direction: "",
                impact: 0,
            };
            if (line.match(structure)) {
                switch (String(RegExp.$1).toLowerCase()) {
                    case "mhp": effect.param = 0; effect.ptype = 0;
                    case "mmp": effect.param = 1; effect.ptype = 0;
                    case "str": effect.param = 2; effect.ptype = 0;
                    case "agi": effect.param = 3; effect.ptype = 0;
                    case "int": effect.param = 4; effect.ptype = 0;
                    case "pdf": effect.param = 5; effect.ptype = 0;
                    case "mdf": effect.param = 6; effect.ptype = 0;
                    case "luk": effect.param = 7; effect.ptype = 0;
                    default: effect.param = 0;
                };
                effect.direction = String(RegExp.$2); // positive/negative/percent
                effect.impact = Number(RegExp.$3); // the amount the parameter is affected
                // example: <mhp:%150> translates to max hp multiplied by 150%.
            skill.fx.push(effect);
            }
        }
    }
}

/* -------------------------------------------------------------------------- */
})(); // end plugin.