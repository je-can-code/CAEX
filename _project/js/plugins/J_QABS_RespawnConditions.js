/* -------------------------------------------------------------------------- */
// J_QABS_RespawnConditions
// V: 1.0

/*:@plugindesc Sets a switch or variable conditional to respawning enemies.
@author J

@help This plugin allows for the ability to stop respawning if a conditional is
  met either with a switch or variable amount. This can be a switch ON or OFF, 
  or the variable can be MORE/LESS/EQUAL to a fixed amount.

  In order to utilize this, use:
    <rev: TYPE : ID : t/f/amount (optional):vCONDITION)>

  example:
    <rev:swi:14:false>
  translates to:
    if switchID 14 is false, the monster won't respawn.

  example:
    <rev:swi:199:true>
  translates to:
    if switchID 199 is true, the monster won't respawn.

  example:
    <rev:var:17:10:more>
  translates to:
    if variableID 17 is more than 10, the monster won't respawn.

  example:
    <rev:var:5:66:equal>
  translates to:
    if variableID 5 is equal to 66, the monster won't respawn.

  example:
    <rev:var:32:96:less>
  translates to:
    if variableID 32 is less than 96, the monster won't respawn.

This needs to be placed beneath QABS itself.
This is designed to work in tandem with the rest of the QABS system.
This was written for me, but I'm uploading it incase others wanted to expand it.
*/
/* -------------------------------------------------------------------------- */

// hooks into the updateRespawn() method, and stop it if the conditions are met.
var j_Game_Event_updateRespawn = Game_Event.prototype.updateRespawn;
Game_Event.prototype.updateRespawn = function() {
  // if true, then stop respawning
  // if false, continue respawning
    var respawnFulfilled = this.canRespawn();
    if (respawnFulfilled) { this.erase(); } // erase enemy if fulfilled.
    else {
      j_Game_Event_updateRespawn.call(this);
    }    
  };

// the new method that checks the notes for the conditionals, and see if they are met.
Game_Event.prototype.canRespawn = function() {
	var notedata = this.battler().enemy().note.split(/[\r\n]+/);
	var structure = /<rev:(swi|var):(\d+):(true|false|\d+)?(:more|:less|:equal)?>/i;
  for (var n = 0; n < notedata.length; n++) {
    if (notedata[n].match(structure)) {
      switch (RegExp.$1) {
        case "swi":
          var thisSwitch = $gameSwitches.value(RegExp.$2);
          switch (RegExp.$3) {
            case "true":
              if (thisSwitch) return true;
              else return false;
            case "false":
              if (!thisSwitch) return true;
              else return false;
            default:
              return false;
          }
        case "var":
          var thisVariable = $gameVariables.value(RegExp.$2);
          switch (RegExp.$4) {
            case ":more":
              if (thisVariable > RegExp.$3) return true;
              else return false;
            case ":less":
              if (thisVariable < RegExp.$3) return true;
              else return false;
            case ":equal":
              if (thisVariable == RegExp.$3) return true;
              else return false;
            default:
              return false;
          }
        default: return false;
      }//swi-var switch()
    }//onMatch
    else { // if they don't have the respawn conditions, business as usual.
      return false;
    }
  }//lines of notes
}