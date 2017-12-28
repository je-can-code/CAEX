
Game_Enemy.prototype.isHeavy = function(id) {
  var enemy = $dataEnemies[id];
  var nd = enemy.note.split(/[\r\n]+/);
  var rgx = /<heavy>/i;
  for (var n = 0; n < nd.length; n++) { if (nd[n].match(rgx)) { return true; } }
  return false;
};

/*
  Skill_Sequencer.prototype.targetJump = function(action, targets) {
    var dist = Number(action[1]) || 0;
    for (var i = 0; i < targets.length; i++) {
      var dist2 = dist - dist * eval('targets[i].battler().' + QABS.mrst);
      if (dist2 <= 0) return;
      var dx = targets[i].cx() - this._character.cx();
      var dy = targets[i].cy() - this._character.cy();
      var radian = Math.atan2(dy, dx);
      radian += radian < 0 ? Math.PI * 2 : 0;
      if (action[0] === 'towards') {
        radian += Math.PI;
      } else if (action[0] === 'into' || action[0] === 'towardsSkill') {
        var dxi = this._skill.collider.center.x - targets[i].cx();
        var dyi = this._skill.collider.center.y - targets[i].cy();
        radian = Math.atan2(dyi, dxi);
        dist2 = Math.min(dist2, Math.sqrt(dxi * dxi + dyi * dyi));
      } else if (action[0] === 'awayFromSkill') {
        var dxi = targets[i].cx() - this._skill.collider.center.x;
        var dyi = targets[i].cy() - this._skill.collider.center.y;
        radian = Math.atan2(dyi, dxi);
        dist2 = Math.min(dist2, Math.sqrt(dxi * dxi + dyi * dyi));
      }
      var x1 = targets[i].px;
      var y1 = targets[i].py;
      var x2 = x1 + Math.round(dist2 * Math.cos(radian));
      var y2 = y1 + Math.round(dist2 * Math.sin(radian));
      var final = targets[i].adjustPosition(x2, y2);
      dx = final.x - x1;
      dy = final.y - y1;
      var lastDirectionFix = targets[i].isDirectionFixed();
      var prevRadian = targets[i]._radian;
      if (targets[i]._battler) { if (targets[i]._battler.isHeavy(targets[i]._battlerId)) {
          // do nothing
        } else {
          targets[i].setDirectionFix(true);
          targets[i].pixelJump(dx, dy);
          targets[i].setDirectionFix(lastDirectionFix);
          targets[i].setRadian(prevRadian);
      } }
    }
  };
*/