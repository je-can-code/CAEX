/* -------------------------------------------------------------------------- */
// J_XPGPvariance
// V: 1.1

/*:@plugindesc Provides notetag-defined levels to give multipliers against XP/GP.
@author J

@help This plugin will do nothing without some setup, but in order to gain the
        bonus XP, you'll have to assign levels to enemies with notetags:
            <level: xx>
        Then, this plugin will math out the difference between the two, and
        use a very straight-forward table to determine the multiplier to be
        used for giving experience to the player.
        NOTE: this is based on the leader of the party.

        In order for bonus GP to work, use notetags:
                    <gpMod: yy>
        Which will result in a bonus between -yy and +yy of the gold that the
        enemy would give you.

        
        Requires: J_Base (reads the notetags)

        v1.1: fixed issue where level differences greater than 10, or less than
          -10 were not being handled.
*/
var Imported = Imported || {};
Imported.J_XPGPvariance = true;

J.AddOns = J.AddOns || {};
J.AddOns.XPGPvariance =   J.AddOns.XPGPvariance || {};

/* -------------------------------------------------------------------------- */
//    XP / GOLD VARIANCE [NEW!]
// This does two things:
//   1. Creates a variance of X amount in obtained Gold from enemies.
//   2. Enables EXP multipliers based on actor vs enemy levels.
/* -------------------------------------------------------------------------- */
// the function for fetching a random number +/- number
// between the given amount. Used in adding Gold variance to drops.
J.AddOns.XPGPvariance.getGPvar = function(e) {
  var bonus = 0;
  if (Imported.J_Base) {
    var g = e.gpvar;
    var r1 = Math.floor((Math.random() * g) + 1);
    var r2 = Math.floor((Math.random() * g) + 1);
    bonus = ((r1 + r2) - g);
  }
  return bonus;
};

// the main function for getting an experience multiplier based on
// actor and enemy level difference.
J.AddOns.XPGPvariance.doSexp = function(a, e) { // a = actor, e = enemy
  var multiplier = 1.0
  if (!Imported.J_Base) {
    console.warn("You need J_Base to make this work!");
    return multiplier;
  }
  if (e.level == 0) {} // if enemy level isn't set just return normal XP.
  else {
    multiplier = J.AddOns.XPGPvariance.getMult(a, e);
  }
  return multiplier;
};

// The switch that handles level difference and multipliers.
// Edit here if you want to change the multipliers.
J.AddOns.XPGPvariance.getMult = function(a, e) { // a = actor, e = enemy
  var compared = e.level - a.level;
  var diff = compared;
  switch (compared) {
    case diff>9: return 5.0; // 10 or more levels lower than the enemy.
    case 9: return 4.0;
    case 8: return 3.0;
    case 7: return 2.5;
    case 6: return 2.0;
    case 5: return 1.75; // five levels below the enemy.
    case 4: return 1.5;
    case 3: return 1.3;
    case 2: return 1.2;
    case 1: return 1.1;
    case 0: return 1.0; // same level as the enemy.
    case -1: return 0.9;
    case -2: return 0.8;
    case -3: return 0.7;
    case -4: return 0.6;
    case -5: return 0.5; // five levels higher than the enemy.
    case -6: return 0.4;
    case -7: return 0.3;
    case -8: return 0.2;
    case -9: return 0.1;
    case (diff<-9): return 0.05; // 10 or more levels higher than the enemy.
    default: return 1.0; // if no notetag is set, use only base experience.
  }
}

// based on difference, modifies and returns experience
var _Game_Enemy_jxpgp_exp = Game_Enemy.prototype.exp;
Game_Enemy.prototype.exp = function() {
  var baseExp = _Game_Enemy_jxpgp_exp.call(this);
  baseExp *= J.AddOns.XPGPvariance.doSexp($gameParty.leader(), this.enemy());
  return Math.round(baseExp);
};

// based on difference, modifies and returns Gold
// also factors in the gp variance, if it exists.
var _Game_Enemy_jxpgp_gold = Game_Enemy.prototype.gold;
Game_Enemy.prototype.gold = function() {
  var baseGold = _Game_Enemy_jxpgp_gold.call(this);
  if (Imported.J_Base) baseGold += J.AddOns.XPGPvariance.getGPvar(this.enemy());
  return Math.round(baseGold);
};
/* -------------------------------------------------------------------------- */