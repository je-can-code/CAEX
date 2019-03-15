/* -------------------------------------------------------------------------- */
// J_MOG_Modifications
// V: 1.0

/*:
@plugindesc Modifies different aspects of the MOG Chrono Engine, ABS mode.
@author J

@help 
  1. attackSkillId
      use <atk_id:number> to give touchDamage in ABS mode a unique skill ID
      instead of only using skill ID 1.

  2. multiple drops
      enables enemies to have multiple drops instead of one random one.

  3. instant pickups
      use <instaskill:number> to provide an action in place of picking up loot.
      example usage: health pickup.
  
  4. no decimal popups
      removes the displaying of decimal damage popups (gets obnoxious).

  5. add extra gamepad inputs
      Tracks the additional inputs of L2/3 & R2/3 & start/select.

  Previous features from VXAce:
      --Agility Move Variance [agi_move_var]
      --Death Self-Switch [death_selfsw]
    X --EXP Factor && Gold Variance [expgp_variance]
    X --Slip HP/MP Damage [hpmp_slipdmg]
      --Heal on Level-Up [heal_on_levelup]
      --No Leader Changing [no_leader_chg]
      --Clear Equipped Skills [clear_skill]
    X --Alternative touch_attack Formula [alt_touchatk]
      --Parry FX [parry_fx]
    X --Timely Active Regen [timely_regen]
      --Record Keeping [the_records]
      --Confusion State [state_confu]
      --Throw Equip Requirements [throw_reqs]
*/
/* -------------------------------------------------------------------------- */
J = J || {};
J.MOG = J.MOG || {};
Imported = Imported || {};
Imported["JE-MOG-ALTERATIONS"] = "1.0.0";
J.MOG.pluginParams = PluginManager.parameters('J_MOG_Modifications');
//#region attackSkillId - enemies can have a different skillID than 1.
/* 
  NEW!
  Game_Enemy.attackSkillId()
    When using "touchDamage", enemies can have a different skillID than 1.
    use <atk_id:#> to adapt it. 
*/
Game_Enemy.prototype.attackSkillId = function() {
  const ID = this._enemyId;
  const structure = /<atk_id:(\d+)>/i;
  const enemy = $dataEnemies[ID];
  const notedata = enemy.note.split(/[\r\n]+/);
  let skillID = 40;
  notedata.forEach((line) => {
    if (line.match(structure)) { 
      skillID = Number(RegExp.$1);
    }
  });
  return skillID;
};
//#endregion

//#region multiple drops - enemies can now drop multiple items at once.
// modified drops to be an array instead of a single item.
Game_CharacterBase.prototype.makeTreasure = (char, battler) => {
  if (Imported["JE-SDP"]) char.gainSDPpts();
  const dropList = battler.makeDropItems();
  if (dropList.length > 0) {
    char._user.treasure = [dropList,false,0,0,20];
    char._characterName = 'treasurebattlertool';
  }
  else { char._user.treasure = [null,false,0,0,0]; char._characterName = ''; }
  $gameMap._treasureEvents.push(char);
  char._user.collapse = [true,0];
};

// modified to handle an array instead of a single item.
Game_CharacterBase.prototype.getTreasure = function(event) {
  var drops = event._user.treasure[0];
	if (drops) {
    drops.forEach((item) => {
      $gameParty.gainItem(item, 1);
      if (Imported.MOG_TreasurePopup) {
        $gameSystem._trspupData.push([item,1,event.screenX(),event.screenY()]);
      };
    })
  };
  //TODO: consider parameter-izing this sound effect.
	SoundManager.playSoundMX("Item3")
	event._user.treasure = [null,false,0,0,0];
  event.erase();
};

// changes the drops to be a fixed chest icon (rather than individual).
Sprite_Character.prototype.setCharacterBitmapTreasure = function() {
  if (!this._imgIcon) { this._imgIcon = ImageManager.loadSystem("IconSet") };
  this.removeChild(this._upperBody);
  this.removeChild(this._lowerBody);
  this.bitmap = this._imgIcon;
  //TODO: consider parameter-izing this iconIndex.
  const iconIndex = 354;
  const sx = iconIndex % 16 * 32;
  const sy = Math.floor(iconIndex / 16) * 32;
  this.setFrame(sx,sy,32,32);
  this.scale.x = 0.70;
  this.scale.y = 0.70;
  this.scale.rotation = 0;
  this._character._through = true;
};
//#endregion

//#region instant pickups - loot can now trigger tool ID effects.
let j_Game_Party_gainItem = Game_Party.prototype.gainItem;
Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
  if (item == null) return;
  const structure = /<instaskill:(\d+)>/i;
  const notedata = item.note.split(/[\r\n]+/);
  notedata.forEach((line) => {
    if (line.match(structure)) {
      $gamePlayer.act(RegExp.$1);
      return;
    }
  })
  j_Game_Party_gainItem.call(this, item, amount, includeEquip);
};
//#endregion

//#region no decimal damage popups - no longer displays fractional/decimal damage popups.
let j_Sprite_Damage_createDigits = Sprite_Damage.prototype.createDigits;
Sprite_Damage.prototype.createDigits = function(baseRow, value) {
  const fixedValue = Number(value).toFixed(0);
  j_Sprite_Damage_createDigits.call(this, baseRow, fixedValue);
};
//#endregion

//#region add extra gamepad inputs
Game_System_j_addMoreGamepadInputs_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
  Game_System_j_addMoreGamepadInputs_initialize.call(this);
  J.MOG.AddExtraGamepadInputs();
};

// accounts for additional L/R buttons, and Start/Select for use in development.
J.MOG.AddExtraGamepadInputs = () => {
  Input.gamepadMapper[6] = 'L2';
  Input.gamepadMapper[7] = 'R2';
  Input.gamepadMapper[8] = 'select';
  Input.gamepadMapper[9] = 'start';
  Input.gamepadMapper[10] = 'L3';
  Input.gamepadMapper[11] = 'R3';
  Input.update();
  Input.clear();
};
//#endregion
