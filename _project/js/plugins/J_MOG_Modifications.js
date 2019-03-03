/* -------------------------------------------------------------------------- */
// J_MOG_Modifications
// V: 1.0

/*:
@plugindesc Modifies different aspects of the MOG Chrono Engine, ABS mode.
@author J

@help 
  1. attackSkillId()
      use <atk_id:number> to give touchDamage in ABS mode a unique skill ID
      instead of only using skill ID 1.

*/
/* -------------------------------------------------------------------------- */

/* 
  NEW!
  Game_Enemy.attackskillId()
    When using "touchDamage", enemies can have a different skillID than 1.
    use <atk_id:#> to adapt it. 
*/
Game_Enemy.prototype.attackSkillId = function() {
  console.log(this._enemyId);
  const ID = this._enemyId;
  var structure = /<atk_id:(\d+)>/i;
  var enemy = $dataEnemies[ID];
  var notedata = enemy.note.split(/[\r\n]+/);
  let skillID = 40;
  notedata.forEach((line) => {
    if (line.match(structure)) { 
      skillID = Number(RegExp.$1);
    }
  });
  console.log(skillID); 
  return skillID;
};

