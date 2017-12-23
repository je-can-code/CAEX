
Game_Enemy.prototype.isHeavy = function(id) {
  var enemy = $dataEnemies[id];
  var nd = enemy.note.split(/[\r\n]+/);
  var rgx = /<heavy>/i;
  for (var n = 0; n < nd.length; n++) { if (nd[n].match(rgx)) { return true; } }
  return false;
};