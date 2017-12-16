/* -------------------------------------------------------------------------- */
// J_DropItem
// V: 1.0
//

/*:@plugindesc Modifies the database drop functionality to be a percent instead of 1/N,
                And accommodates the "Extra Drops" notetags.
@author J

@help The plugin makes it so that the number you enter into the database is now the
        percentage chance of the item dropping instead of 1/N chance, where N is the
        number you entered in the database.

        Additionally, to accommodate the possibility of decimals, you can change the
        setting so that it reflects off of either 100 or 1000 point scale. 100 scale
        is as you know it: enter 54, and it will be 54% chance of drop. 1000 point
        means that if you enter 54, it will be 5.4% chance of drop, 547 will instead
        be 54.7% chance of drop. Default will be 100, but you can change it to 1000
        if you want.

        Also, alongside giving the option for greater precision of drops, this plugin
        will allow the developer to use notetags to define enemy drops beyond the 3
        available slots the editor permits by using this notetag format:
                <x:y:z>
        x = i or w or a, which translates to item/weapon/armor.
        y = id, the id from the database.
        z = drop rate, in percent.

          100-dropScale example:
                <i:7:95>
          which translates to:
            an item, with an id of 7, will drop 95% of the time.

          1000-dropScale example:
                <w:22:738>
          which translates to:
            a weapon, with the id of 22, will drop 73.8% of the time.

        Suggested: 
          J_Base (adding itemdrops via notetags doesn't work without)
        Works with: 
          J_Difficulty (modifies droprate per difficulty)

@param dropScale
@desc 100 or 1000 depending on if you don't or do need decimal chance drop rates.
@default 100

*/
var Imported = Imported || {};
Imported.J_DropItems = true;

J.AddOns = J.AddOns || {};
J.AddOns.DropItems = J.AddOns.DropItems || {};
J.AddOns.DropItems.pluginParams = PluginManager.parameters('J_AddOns');
J.AddOns.DropItems.dropScale = Number(J.AddOns.DropItems.pluginParams['dropScale']) || 100;

// OVERWRITES [Game_Enemy.makeDropItems]
// Also to incorporate percentage drop, and additional notetag drops.
Game_Enemy.prototype.makeDropItems = function() {
    var dropList = this.enemy().dropItems;
    // if J_Base plugin is in use, then it'll add in the extra notetag drops, too.
    if (Imported.J_Base) { dropList = this.enemy().dropItems.concat(this.enemy().extraDrops); }
    var itemsFound = [];
    for (var i = 0; i < dropList.length; i++) {
      var di = dropList[i];
      var dropRate = di.denominator;
      if (Imported.J_Difficulty) { dropRate = di.denominator * (J.AddOns.Difficulty.convertBparams(10) / 100); }
      if (di.kind > 0) {
        var rand = Math.random() * J.AddOns.DropItems.dropScale;
        if (rand < dropRate) {
          itemsFound.push(this.itemObject(di.kind, di.dataId));
        }
      }
    }
    return itemsFound;
};
