//-----------------------------------------------------------------------------
//  Galv's Jump Ability
//-----------------------------------------------------------------------------
//  For: RPGMAKER MV
//  GALV_JumpAbility.js
//-----------------------------------------------------------------------------
//  2016-07-09 - Version 1.6 - Removed auto binding 'cancel' gamepad to jump
//  2016-02-29 - Version 1.5 - Temp fix to allow state damage to work slowly.
//  2016-02-01 - Version 1.4 - Fixed bug that denied jumping on lower event
//  2015-11-15 - Version 1.3 - fixed bug when jumping over event with no page
//                           - added 'steps' when jumping for random encounter
//  2015-11-15 - Version 1.2 - fixed bug with region blocking
//  2015-11-13 - Version 1.1 - fixed jump distance & jump off map errors
//  2015-11-13 - Version 1.0 - release
//-----------------------------------------------------------------------------
// Terms can be found at:
// galvs-scripts.com
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.Galv_JumpAbility = true;

var Galv = Galv || {};          // Galv's main object
Galv.pCmd = Galv.pCmd || {};    // Plugin Command manager
Galv.JA = Galv.JA || {};        // Galv's stuff

//-----------------------------------------------------------------------------
/*:
 * @plugindesc Allows the player to jump by pressing a button.
 * 
 * @author Galv - galvs-scripts.com
 *
 * @param Key
 * @desc See help file for available keys. This key will also act as "cancel" key
 * @default c
 *
 * @param Jump Distance
 * @desc The default jump distance in the game.
 * @default 2
 *
 * @param Blocking Regions
 * @desc Region ID's that block jumping (cannot be jumped over) separated by commas
 * @default 255,254
 *
 * @param Jump Sound
 * @desc Sound effect played when player jumps using the jump button
 * FileName,volume,pitch. (leave blank for no sound)
 * @default Jump1, 80, 150
 *
 * @help
 *   Galv's Jump Ability
 * ----------------------------------------------------------------------------
 *  JUMP KEY
 * ----------------------------------------------------------------------------
 * This plugin mostly uses default RPGMaker MV controls for the jump key
 * setup. It also allows use of other keyboard keys but whatever key you
 * choose, I advise you to test it isn't conflicting with another control.
 * ----------------------------------------------------------------------------
 * Possible keys to use for "Key" setting:
 *  tab
 *  enter                // Not recommended as key already used
 *  shift                // Not recommended as key already used
 *  ctrl
 *  alt
 *  space                // Not recommended as key already used
 *  0-9
 *  a-z                  // Q,W,Z,X are not recommended as they are used
 *  semi-colon
 *  comma
 *  period
 *  single quote
 *  pageup
 *  pagedown
 *
 * Use one of the below key codes instead for compatibility with gamepads
 *  ok       //      A
 *  cancel   //      B
 *  shift    //      X
 *  menu     //      Y
 *  pageup   //      LB
 *  pagedown //      RB
 *  up       //      D-pad up
 *  down     //      D-pad down
 *  left     //      D-pad left
 *  right    //      D-pad right

 *
 * ----------------------------------------------------------------------------
 *  EVENT COMMENT
 * ----------------------------------------------------------------------------
 * An event can be used to control where the player can and cannot jump. If
 * the very first event command of an event's page is a comment with:
 *  <blockJump>
 * Then the player cannot jump over it. Switch the event page to one without
 * this comment and then the player can jump over it.
 * ----------------------------------------------------------------------------
 *  REGIONS
 * ----------------------------------------------------------------------------
 * Region ID's can be set in the settings. The player can not jump over these
 * regions. Separate multiple region ID's with commas.
 * ----------------------------------------------------------------------------
 *  PLUGIN COMMANDS
 * ----------------------------------------------------------------------------
 *  JUMPACTION STATUS         // STATUS can be TRUE or FALSE to enable/disable
 *                            // the player's jump key.
 * Example:
 * JUMPACTION FALSE       // Disables the jump action key
 * JUMPACTION TRUE        // Enables it again
 * ----------------------------------------------------------------------------
 */



//-----------------------------------------------------------------------------
//  CODE STUFFS
//-----------------------------------------------------------------------------

(function() {

// GALV'S PLUGIN MANAGEMENT. INCLUDED IN ALL GALV PLUGINS THAT HAVE PLUGIN COMMAND CALLS, BUT ONLY RUN ONCE.
if (!Galv.aliased) {
	var Galv_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		if (Galv.pCmd[command]) {
			Galv.pCmd[command](args);
			return;
		};
		Galv_Game_Interpreter_pluginCommand.call(this, command, args);
	};
	Galv.aliased = true; // Don't keep aliasing for other Galv scripts.
};

// Direct to Plugin Object
Galv.pCmd.JUMPACTION = function(arguments) {
	Galv.JA.btnStatus(arguments[0]);
};
// END GALV'S PLUGIN MANAGEMENT

	Galv.JA.key = PluginManager.parameters('Galv_JumpAbility')["Key"].toLowerCase();
	//Galv.JA.cmdTxt = PluginManager.parameters('Galv_JumpAbility')["Option Command"];
	Galv.JA.jDist = Number(PluginManager.parameters('Galv_JumpAbility')["Jump Distance"]);
	Galv.JA.regions = function () {
		var arr = PluginManager.parameters('Galv_JumpAbility')["Blocking Regions"].split(",");
		for (i = 0;i < arr.length;i++) {
			arr[i] = Number(arr[i]);
		};
		return arr;
	}();
	
	Galv.JA.Se = function() {
		var arr = PluginManager.parameters('Galv_JumpAbility')["Jump Sound"].split(",");
		var obj = {name: arr[0],pan: 0,pitch: Number(arr[2]),volume: Number(arr[1])};
		return obj;
	}();
	
	Galv.JA.btnStatus = function(status) {
		$gameSystem.jumpBtnDisable = status === "FALSE" ? true : false;
	};


// Potential keys user can add:
var txt_ids = {
"tab":9,"enter":13,"shift":16,"ctrl":17,"alt":18,"space":32,"0":48,"1":49,"2":50,"3":51,"4":52,"5":53,"6":54,
"7":55,"8":56,"9":57,"a":65,"b":66,"c":67,"d":68,"e":69,"f":70,"g":71,"h":72,"i":73,"j":74,"k":75,"l":76,"m":77,
"n":78,"o":79,"p":80,"q":81,"r":82,"s":83,"t":84,"u":85,"v":86,"w":87,"x":88,"y":89,"z":90,"semi-colon":186,
"comma":188,"period":190,"single quote":222,
};

// Add key to 'jump' input
Input.keyMapper[txt_ids[Galv.JA.key]] = 'jump';

// Special jump trigger so the cancel command doesn't call menu and jump
Input.isJumpTriggered = function(keyName) {
	return this._latestButton === keyName && this._pressedTime === 0;
};


var Galv_Game_Player_moveByInput = Game_Player.prototype.moveByInput;
Game_Player.prototype.moveByInput = function() {
	if (this.isJumping()) return;
	if (this._priorityType == 1.5) this._priorityType = 1;
	
	if (this.canMove() && Input.isJumpTriggered('jump')) {
		if (this.isNormal && !$gameSystem.jumpBtnDisable) this.do_jump();
	};
	Galv_Game_Player_moveByInput.call(this);
};


Game_Player.prototype.do_jump = function() {
	var jdis = Galv.JA.jumpDistanceXY();
	if (jdis.y !== 0) this._priorityType = 1.5;
	AudioManager.playSe(Galv.JA.Se);
	this.jump(jdis.x, jdis.y);
	//var dis = Math.abs(jdis.x) + Math.abs(jdis.y);
	$gameParty._steps += 1; //dis;
};


Galv.JA.jumpMax = function(dir,dis) {
	var m = {x: 0, y:0};
	var x = $gamePlayer.x
	var y = $gamePlayer.y

	switch (dir) {
		case 2:
			m.y = dis;
			for (var i = 0;i < dis;i++) {if (Galv.JA.checkBlock(x, y + i + 1)) {m.y = i;break;}};
			break;
		case 4:
			m.x = dis;
			for (var i = 0;i < dis;i++) {if (Galv.JA.checkBlock(x - i - 1, y)) {m.x = i;break;}};
			break;
		case 6:
			m.x = dis;
			for (var i = 0;i < dis;i++) {if (Galv.JA.checkBlock(x + i + 1, y)) {m.x = i;break;}};
			break;
		case 8:
			m.y = dis;
			for (var i = 0;i < dis;i++) {if (Galv.JA.checkBlock(x, y - i - 1)) {m.y = i;break;}};
			break;
	};
	return m;
};


Galv.JA.checkBlock = function(x,y) {
	return Galv.JA.regions.contains($gameMap.regionId(x,y)) || Galv.JA.stopperEvent(x,y);
};


Galv.JA.stopperEvent = function(x,y) {
	var block = false;
    var events = $gameMap.eventsXy(x,y);
	
	for (var i = 0;i <= events.length;i++) {
		if (events[i] && events[i].page()) {
			if (events[i].page().list[0].code === 108 && events[i].page().list[0].parameters[0] === "<blockJump>") {
				block = true;
				break;
			};
		};
	};
	return block;
};

Galv.JA.canJump = function(x,y,d) {
	if (x < 0 || x > $gameMap.width() || y < 0 || y > $gameMap.height()) {
		return false;
	};
	if (Galv.JA.eventThere(x,y)) {
		return false;
	} else {
		return $gameMap.isPassable(x,y,d);
	};
};

Galv.JA.eventThere = function(x,y) {
	var events = $gameMap.eventsXyNt(x,y);
	var eventThere = false;
	for (var i = 0; i < events.length; i++) {
		// If event is there, not passable and not lower
		if (events[i]._priorityType === 1 && !events[i]._through) {
			// Can jump on if no event blocking. Blocking events have priority
			eventThere = true;
		} else {
			// Can not jump on
			return false;	
		};
	};
	return eventThere;
};

Galv.JA.getDistance = function() {
	// For adding distance bonus modifiers
	return Galv.JA.jDist;
};

Galv.JA.jumpDistanceXY = function() {
	var jump = {x: 0, y:0};         // x,y
	var can_jump = true;            // init true
	var dis = Galv.JA.getDistance();                    // get player jump distance
	
	var dir = $gamePlayer.direction();
	var px = $gamePlayer.x;
	var py = $gamePlayer.y;
	var maxdis = Galv.JA.jumpMax(dir,dis);   // Maximum x,y due to hard block region and events
	var realdis = 0;
	
	switch (dir) {
	case 2:  // DOWN
		for (var i = 0;i < maxdis.y;i++) {
			if (Galv.JA.canJump(px, py + maxdis.y - i,dir)) {
				realdis = maxdis.y - i;
				break;
			};
		};		
		jump.y = realdis;
		break;
	case 8:  // UP
		for (var i = 0;i < maxdis.y;i++) {
			if (Galv.JA.canJump(px, py - maxdis.y + i,dir)) {
				realdis = maxdis.y - i;
				break;
			};
		};		
		jump.y = -realdis;
		break;
	case 4:  // LEFT
		for (var i = 0;i < maxdis.x;i++) {
			if (Galv.JA.canJump(px - maxdis.x + i, py,dir)) {
				realdis = maxdis.x - i;
				break;
			};
		};		
		jump.x = -realdis;
		break;
	case 6:  // RIGHT
		for (var i = 0;i < maxdis.x;i++) {
			if (Galv.JA.canJump(px + maxdis.x - i, py,dir)) {
				realdis = maxdis.x - i;
				break;
			};
		};		
		jump.x = realdis;
		break;
	};
	return jump;
};

})();