/* -------------------------------------------------------------------------- */
// J_QABS_CollectAndUse
// V: 1.0

/*:@plugindesc Automatically uses a skill on item-pickup.
@author J

@help This plugin allows for the use of skill on item pickup. The idea behind it
        was to give the effect of picking up a consumable and using it, akin to
        Zelda and picking up a heart.

		To use this, just add the appropriate notetag into the item box:
			<instaskill:SKILL_ID>
    
    Example:
			<instaskill:10>
		Translates to:
			On picking up this item, the skill with ID of 10 will be cast.

		Note: I didn't test this extensively. I made it to cast a healing spell on
			pickup, and that worked, so that is where I stopped. I don't know the
			effects on picking up skills that deal damage or anything else.

This needs to be placed beneath QABS itself.
This is designed to work in tandem with the rest of the QABS system.
This was written for me, but I'm uploading it incase others wanted to expand it.
*/
/* -------------------------------------------------------------------------- */
var j_Game_Party_gainItem = Game_Party.prototype.gainItem;
Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
  if (item == null) return;
  var structure = /<instaskill:(\d+)>/i;
  var notedata = item.note.split(/[\r\n]+/);
  for (var n = 0; n < notedata.length; n++) {
    var line = notedata[n];
    if (line.match(structure)) {
      $gamePlayer.forceSkill(RegExp.$1);
      return;
    } 
  }
  j_Game_Party_gainItem.call(this, item, amount, includeEquip);
};

