//==
// Game Time MV Version 1.1c
//==

/*:
 * @plugindesc Provides an in-game clock with date and tinting function!
 * @author Vlue
 *
 * @param Real Time
 * @desc Whether to use real (system) time or not - (default: false)
 * @default false
 *
 * @param Pause Time (Message)
 * @desc Whether to pause time while the message window is up - (default: false)
 * @default false
 *
 * @param Pause Time (Menu)
 * @desc Whether to pause time while the menu is open - (default: true)
 * @default true
 *
 * @param Pause Time (Battle)
 * @desc Whether to pause time during battle - (default: true)
 * @default true
 *
 * @param Default Clock Format
 * @desc (Map Clock) Off, Simple, Expanded, Full
 * @default Simple
 *
 * @param Default Menu Clock Format
 * @desc (Menu Clock) Off, Simple, Expanded, Full
 * @default Simple
 *
 * @param Days of the Week
 * @desc The names of the days of the week
 * @default "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"
 *
 * @param Month Names
 * @desc The names of the months
 * @default "January","February","March","April","May","June","July","August","September","October","November","December"
 *
 * @param Days in a Month
 * @desc Define the number of days in each month
 * @default 31,28,31,30,31,30,31,31,30,31,30,31
 *
 * @param Year Post
 * @desc The post name of the year period (I.E. BC, AD)
 * @default A.D.
 *
 * @param Twenty Four Hour Mode
 * @desc Whether to display time in 12 or 24 hour segments
 * @default false
 *
 * @param Clock Toggle Button
 * @desc Toggles the clock on press (All known buttons unsure)
 * @default shift
 *
 * @param Clock Window Details
 * @desc Finetune the details of the clock window
 * @default x: 576, y: 552, width: 240
 *
 * @param Menu Clock Window Details
 * @desc Finetune the details of the menu clock window
 * @default x: 0, y: 482, width: 240
 *
 * @param Blink Speed
 * @desc The speed in which those little dots blink (0 to ignore)
 * @default 120
 *
 * @param Default Timelapse
 * @desc Number of frames it takes for one second to pass, in frames
 * @default 60
 *
 * @param Use Seconds
 * @desc Whether to use seconds or not (not using causes minutes to increase every timelapse)
 * @default false
 *
 * @help Game Time MV! 1.1c
 *  Follow me on twitter: https://twitter.com/DaimoniousTails
 *   Or facebook: https://www.facebook.com/DaimoniousTailsGames/
 *   for the most recent updates!
 *  Find all of my work here: http://daimonioustails.weebly.com/
 *
 *  Notes:
 * Map notes take two tags: <time:false> and <tint:false> to prevent either time or tint from passing
 * The tinting process will be automatically stopped whenever you manually tint the screen, no need to
 *  pause it yourself. You will need to restart it though using the plugin command, when done
 *
 *  Script Calls:
 * $gameTime.getTime("time") - returns current time value (second, minute, hour, day, 
 *   dayweek, month, year)
 * $gameTime.inBetweenMin(m1,m2) - returns true if the current min is between m1 (including m1) and m2
 * $gameTime.inBetweenHour(h1,h2) - returns true if the current hour is between h1 (including h1) and h2
 *
 *  Plugin Commands:
 * GameTime pauseTint true/false	(pauses or unpauses the tint)
 * GameTime pauseTime true/false	(pauses or unpauses time)
 * GameTime set s m h d dw m y	(sets the current time to values (x to ignore)
 *  I.e. GameTime set 0 0 6 x x 2 2005 - Sets time to the 6th hour, 2 month, and 2005th 
 *    year and ignoring day and month
 * GameTime add value amount 	(increments time by the value * amount) - second, 
 *   minute, hour, day, dayweek, month, year.
 * GameTime clock format		(Changes the orientation of the clock - off, simple, expanded, full)
 * GameTime year string         (Changes the year post date string)
 * GameTime countdown varID minutes    (Sets a countdown timer in variable ID for x minutes)
 *
 *  Message Codes:
 * GTSEC    - replaces with current second
 * GTMIN	- replaces with current minute
 * GTHOUR12	- replaces with current hour
 * GTHOUR24 - replaces with current hour24
 * GTDAYN	- replaces with current day (of month)
 * GTDAYF	- replaces with current day (of week)
 * GTMONN	- replaces with current day (number)
 * GTMONF	- replaces with current day (name)
 * GTYEAR	- repalces with current year
 * GTMERI   - replaced by either AM or PM depending
 *
 *  Tint Values
 * You may edit the tint values, but you will have to open up the plugin in a text editor 
 * and edit the values in there. (They will be the first thing you see at after the comments).
 */
 
var $gameTime = null;
 
(function() {

	var tints = [ [-68,-68,0,68],
				  [-68,-68,0,68],
				  [-68,-68,0,68],
				  [-68,-68,0,68],
				  [-68,-68,0,68],
				  [-68,-68,0,68],
				  [-48,-48,0,48],
				  [-28,-28,0,28],
				  [-8,-8,0,8],
				  [0,0,0,0],
				  [0,0,0,0],
				  [0,0,0,0],
				  [0,0,0,0],
				  [5,5,5,0],
				  [10,10,10,0],
				  [15,15,15,0],
				  [10,10,10,0],
				  [34,0,0,0],
				  [68,-17,17,0],
				  [68,-34,-34,0],
				  [34,-51,-17,34],
				  [-34,-68,0,68],
				  [-68,-68,0,68],
				  [-68,-68,0,68] 
	]
	
	var parameters = PluginManager.parameters('GameTime');
	var realTime = (parameters['Real Time'] || "false").toLowerCase() == "true";
	var messageTime = (parameters['Pause Time (Message)'] || "false").toLowerCase() == "true";
	var menuTime = (parameters['Pause Time (Menu)'] || "true").toLowerCase() == "true";
	var battleTime = (parameters['Pause Time (Battle)'] || "true").toLowerCase() == "true";
	var clockFormat = (parameters['Default Clock Format'] || "simple").toLowerCase();
	var clockMenuFormat = (parameters['Default Menu Clock Format'] || "simple").toLowerCase();
	var defaultDaysWeek = '"Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"'
	var daysWeek = eval("[" + (parameters['Days of the Week'] || defaultDaysWeek) + "]");
	var defaultMonthNames = '"January","February","March","April","May","June","July","August","September","October","November","December"'
	var monthNames = eval("[" + (parameters['Month Names'] || defaultMonthNames) + "]");
	var yearPost = (parameters['Year Post'] || "A.D.");
	var hourtf = (parameters['Twenty Four Hour Mode'] || "false").toLowerCase() == "true";
	var toggleButton = (parameters['Clock Toggle Button'] || "shift").toLowerCase();
	var clockDetails = eval("( {" + (parameters['Clock Window Details'] || "x: 576, y: 552, width: 240") + "} )");
	var clockMenuDetails = eval("( {" + (parameters['Menu Clock Window Details'] || "x: 0, y: 482, width: 240") + "} )");
	var blinkSpeed = (parameters['Blink Speed'] || 120);
	var timeLapse = (parameters['Default Timelapse'] || 60);
	var daysMonth = eval("[" + (parameters['Days in a Month'] || "31,28,31,30,31,30,31,31,30,31,30,31") + "]");
	var useSeconds = (parameters['Use Seconds'] || "false").toLowerCase() == "true";
	
	TextManager.getErrorDetails = function() {
		if($gameMap) {
			return "[Map: " + $gameMap._mapId + "] [Event: " + $gameMap._interpreter._eventId + "] : \n"
		}
	}
	
	function GameTime() {
		this.initialize.apply(this, arguments);
	}
	GameTime.prototype.initialize = function() {
		this.old_time = -1;
		this.old_tint = [0,0,0,0];
		this.pauseTint = false;
		this.pauseTime = false;
		this.currentTime = new Current_Time();
	}
	GameTime.prototype.update = function() {
		if(!this.pauseTime && !this.noTimeMap()) {this.currentTime.update();}
		this.updateTint();
	}
	GameTime.prototype.getTime = function(type) {
		return this.currentTime.getTime(type);
	}
	GameTime.prototype.inBetweenMin = function(m1,m2) {
		var min = this.getTime("minute");
		return min >= m1 && min < m2;
	}
	GameTime.prototype.inBetweenHour = function(h1,h2) {
		var hour = this.getTime("hour");
		return hour >= h1 && hour < h2;
	}
	GameTime.prototype.updateTint = function() {
		if(this.pauseTint) {return;}
		if(this.noTintMap()) {
			$gameScreen.startTint([0,0,0,0],0);
			return;}
		min = this.getTime("minute");
		if(min == this.old_time) {return;}
		this.old_time = min;
		rgba = this.get_new_tint(min);
		if(rgba == this.old_tint) {return;}
		this.old_tint = rgba;
		$gameScreen.startTint(rgba,0);
	}
	GameTime.prototype.get_new_tint = function(min) {
		var hour = this.getTime("hour");
		var ctint = tints[hour];
		var ntint = null;
		if(hour + 1 != 24) {ntint = tints[hour+1];} else {ntint = tints[0];}
		var r = ctint[0] - ((ctint[0] - ntint[0]) * (min / 60));
		var g = ctint[1] - ((ctint[1] - ntint[1]) * (min / 60));
		var b = ctint[2] - ((ctint[2] - ntint[2]) * (min / 60));
		var a = ctint[3] - ((ctint[3] - ntint[3]) * (min / 60));
		return [r,g,b,a];
	}
	GameTime.prototype.setTime = function(args) {
		this.currentTime.setTime(args);
	}
	GameTime.prototype.addTime = function(args) {
		this.currentTime.addTime(args);
	}
	GameTime.prototype.noTimeMap = function() {
		if($dataMap != null) {
			return $dataMap.note.indexOf("<time:false>") >= 0;
		}
		return false;
	}
	GameTime.prototype.noTintMap = function() {
		if($dataMap != null) {
			return $dataMap.note.indexOf("<tint:false>") >= 0;
		}
		return false;
	}
	
	
	function Current_Time() {
		this.sec = 0;
		this.min = 0;
		this.hour = 0;
		this.day = 0;
		this.dayweek = 0;
		this.month = 0;
		this.year = 1;
		console.log(realTime);
	}
	Current_Time.prototype.setTime = function(args) {
		if(args[1] != "x") {this.sec = args[1];}
		if(args[2] && args[2] != "x") {this.min = Number(args[2]);}
		if(args[3] && args[3] != "x") {this.hour = Number(args[3]);}
		if(args[4] && args[4] != "x") {this.day = Number(args[4]);}
		if(args[5] && args[5] != "x") {this.dayweek = Number(args[5]);}
		if(args[6] && args[6] != "x") {this.month = Number(args[6]);}
		if(args[7] && args[7] != "x") {this.year = Number(args[7]);}
	}
	Current_Time.prototype.addTime = function(args) {
		var func = "this.add" + args[1] + "()";
		for(var i = 0;i < Number(args[2]);i++) {
			try { eval(func); } catch(err) {
				throw new Error(TextManager.getErrorDetails() + 
				  "Incorrect time value (" + args[1] + ") called for: gametime set")
			}
		}
	}
	Current_Time.prototype.update = function() {
		if(realTime) {
			var date = new Date();
			this.sec = date.getSeconds();
			this.min = date.getMinutes();
			this.hour = date.getHours();
		} else if(Graphics.frameCount % timeLapse == 0) {
			if(messageTime && $gameMessage.isBusy()) {return;}
			if(menuTime && SceneManager._scene.inMenu()) {return;}
			if(battleTime && SceneManager._scene.inBattle()) {return;}
			if(useSeconds) {this.addsec();} else {this.addmin();}
		}
	}
	Current_Time.prototype.addsec = function() {
		this.sec++;
		if(this.sec == 60) {
			this.sec = 0;
			this.addmin();
		}
	}
	Current_Time.prototype.addmin = function() {
		this.min++;
		this.countdownTimers();
		if(this.min == 60) {
			this.min = 0;
			this.addhour();
		}
	}
	Current_Time.prototype.addhour = function() {
		this.hour++;
		if(this.hour == 24) {
			this.hour = 0;
			this.addday();
		}
	}
	Current_Time.prototype.addday = function() {
		this.day++;
		this.dayweek++;
		if(this.dayweek == daysWeek.length) {this.dayweek = 0;}
		if(this.day == daysMonth[this.month]) {
			this.day = 0
			this.addmonth();
		}
	}
	Current_Time.prototype.addmonth = function() {
		this.month++;
		if(this.month == monthNames.length) {
			this.month = 0;
			this.addyear();
		}
	}
	Current_Time.prototype.addyear = function() {
		this.year++;
	}
	Current_Time.prototype.getTime = function(string) {
		if(string == "second") {return this.sec;}
		if(string == "minute") {return this.min;}
		if(string == "hour")   {return this.hour;}
		if(string == "day")	   {return this.day;}
		if(string == "dayweek"){return this.dayweek;}
		if(string == "dayyear"){return this.dayyear();}
		if(string == "month")  {return this.month;}
		if(string == "year")   {return this.year;}
		throw new Error(TextManager.getErrorDetails() + "Incorrect time value (" + string + ") called for: getTime")
	}
	Current_Time.prototype.dayyear = function() {
		var month = getTime("month");
		var day = getTime("day");
		while(month > 0) {
			day += daysMonth[month];
			month--;
		}
		return day;
	}
	Current_Time.prototype.countdownTimers = function() {
		timers = $gameParty._countdownTimers;
		for(var id in timers) {
			if(timers[id]) {
				$gameVariables.setValue(id, $gameVariables.value(id) - 1);
				if($gameVariables.value(id) <= 0) {
					$gameParty.removeTimer(id);
				}
			}
		}
	}
	
	function Window_GameTime() {
		this.initialize.apply(this);
	}
	Window_GameTime.prototype = Object.create(Window_Base.prototype);
	Window_GameTime.prototype.constructor = Window_GameTime;
	Window_GameTime.prototype.initialize = function() {
		var height = 72;
		if(this.getFormat() == "full") {height += 36;}
		var details = SceneManager._scene.inMenu() ? clockMenuDetails : clockDetails;
		Window_Base.prototype.initialize.call(this, details.x,details.y,details.width,height);
	}
	Window_GameTime.prototype.update = function() {
		Window_Base.prototype.update.call(this);
		if(Input.isTriggered(toggleButton)) {
			this.visible = !this.visible;}
		if(this.getFormat() == "off") {this.visible = false;}
		if(this.visible) {this.refresh();}
	}
	Window_GameTime.prototype.refresh = function() {
		this.contents.clear();
		var clockText = "";
		if(this.getFormat() == "simple") {clockText = this.normal_clock();}
		if(this.getFormat() == "expanded") {clockText = this.dated_clock();}
		if(this.getFormat() == "full") {
			clockText = this.full_clock();
			this.drawText(this.dated_clock(),0,36,this.contents.width,0);}
		this.drawText(clockText,0,0,this.contents.width,0);
	}
	Window_GameTime.prototype.normal_clock = function() {
		var meri = "";
		var hour = $gameTime.getTime("hour");
		var minute = $gameTime.getTime("minute");
		if(!hourtf) {
			if(hour > 11) {meri = "PM";} else {meri = "AM";}
			if(hour == 0) {hour = 12;}
			if(hour > 12) {hour -= 12;}
		}
		if(hour < 10) {hour = " " + String(hour);} else {hour = String(hour);}
		if(minute < 10) {minute = "0" + String(minute);} else {minute = String(minute);}
		return hour + this.blinky() + minute + " " + meri;
	}
	Window_GameTime.prototype.dated_clock = function() {
		var hour = $gameTime.getTime("hour");
		var minute = $gameTime.getTime("minute");
		var dayweek = daysWeek[$gameTime.getTime("dayweek")];
		var day = $gameTime.getTime("day") + 1;
		var timeString = this.normal_clock();
		if(day < 10) {day = " " + String(day);} else {day = String(day);}
		return dayweek + ", " + day + " " + timeString;
	}
	Window_GameTime.prototype.full_clock = function() {
		return monthNames[$gameTime.getTime("month")] + ", " + $gameTime.getTime("year") + " " + $gameParty.yearPost();
	}
	Window_GameTime.prototype.blinky = function() {
		if(Graphics.frameCount % blinkSpeed > (blinkSpeed / 2)) {return " ";} 
		return ":";
	}
	Window_GameTime.prototype.getFormat = function() {
		if(SceneManager._scene.inMenu()) {return clockMenuFormat;} else {return clockFormat;}
	}

	var gameTime_DataManager_createGameObjects = DataManager.createGameObjects;
	var gameTime_DataManager_makeSaveContents = DataManager.makeSaveContents;
	var gameTime_DataManager_extractSaveContents = DataManager.extractSaveContents;
	DataManager.createGameObjects = function() {
		gameTime_DataManager_createGameObjects.call(this);
		$gameTime = new GameTime();
	}
	DataManager.makeSaveContents = function () {
		var contents = gameTime_DataManager_makeSaveContents(this);
		contents.time = $gameTime;
		return contents;
	}
	DataManager.extractSaveContents = function(contents) {
		gameTime_DataManager_extractSaveContents.call(this, contents);
		if(contents.time) {	
			$gameTime = contents.time;
			var gt = new GameTime();
			var ct = new Current_Time();
			$gameTime.__proto__ = gt.__proto__;
			$gameTime.currentTime.__proto__ = ct.__proto__;
		} else {
			$gameTime = new GameTime();
		}
	}
	
	var gameTime_Scene_Base_update = Scene_Base.prototype.update;
	Scene_Base.prototype.update = function() {
		gameTime_Scene_Base_update.call(this);
		if($gameTime) { $gameTime.update(); }
	}
	
	var gameTime_Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
	var gameTime_Scene_Map_create = Scene_Map.prototype.create;
	var gameTime_Scene_Map_update = Scene_Map.prototype.update;
	Scene_Map.prototype.createAllWindows = function() {
		this._gameTimeWindow = new Window_GameTime();
		this.addWindow(this._gameTimeWindow);
		gameTime_Scene_Map_createAllWindows.call(this);
	}
	Scene_Map.prototype.create = function() {
		gameTime_Scene_Map_create.call(this);
		$gameTime.updateTint();
	}
	Scene_Map.prototype.update = function() {
		gameTime_Scene_Map_update.call(this);
		if($gameMap._updateClock) {
			this._gameTimeWindow = new Window_GameTime();
			this.addWindow(this._gameTimeWindow);
			$gameMap._updateClock = null;
		}
	}
	
	var gameTime_Scene_Menu_create = Scene_Menu.prototype.create;
	Scene_Menu.prototype.create = function() {
		gameTime_Scene_Menu_create.call(this);
		this._gameTimeWindow = new Window_GameTime();
		this.addWindow(this._gameTimeWindow);
	}
	
	Scene_Base.prototype.inMenu = function() {return false;}
	Scene_Base.prototype.inBattle = function() {return false;}
	Scene_Battle.prototype.inBattle = function() {return true;}
	Scene_MenuBase.prototype.inMenu = function() {return true;}
	
	var GameTime_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		GameTime_Game_Interpreter_pluginCommand.call(this, command, args);
		if(command.toLowerCase() === 'gametime') {
			if(args[0] === 'pauseTint') {
				$gameTime.pauseTint = args[1] == "true"; 
			}
			if(args[0] === 'pauseTime') {
				$gameTime.pauseTime = args[1] == "true";
			}
			if(args[0] === 'set') {
				$gameTime.setTime(args);
			}
			if(args[0] === 'add') {
				$gameTime.addTime(args);
			}
			if(args[0] === 'clock') {
				clockFormat = args[1];
				$gameMap._updateClock = true;
			}
			if(args[0] === 'year') {
				$gameParty._yearPost = args[1];
			}
			if(args[0] === 'countdown') {
				$gameParty.addTimer(Number(args[1]),Number(args[2]));
			}
		}
	}
	
	Game_Party.prototype.yearPost = function() {
		return this._yearPost || yearPost;
	}
	Game_Party.prototype.addTimer = function(varId, timer) {
		if(!this._countdownTimers) { this._countdownTimers = {} };
		this._countdownTimers[varId] = true;
		$gameVariables.setValue(varId, timer);
	}
	Game_Party.prototype.removeTimer = function(varId) {
		if(!this._countdownTimers) { this._countdownTimers = {} };
		this._countdownTimers[varId] = false;
	}
	
	var GameTime_Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
	Window_Base.prototype.convertEscapeCharacters = function(text) {
		text = GameTime_Window_Base_convertEscapeCharacters.call(this, text);
		text = text.replace(/\GTSEC/g, function() {
			return String($gameTime.getTime("second"));
		}.bind(this));
		text = text.replace(/\GTMIN/g, function() {
			var min = $gameTime.getTime("minute")
			min = min < 10 ? "0" + min : min;
			return String(min);
		}.bind(this));
		text = text.replace(/\GTHOUR12/g, function() {
			var hour = $gameTime.getTime("hour")
			if(hour > 12) {hour -= 12}
			if(hour == 0) {hour = 12}
			return String(hour);
		}.bind(this));
		text = text.replace(/\GTHOUR24/g, function() {
			return String($gameTime.getTime("hour"));
		}.bind(this));
		text = text.replace(/\GTDAYN/g, function() {
			return String($gameTime.getTime("day")+1);
		}.bind(this));
		text = text.replace(/\GTDAYF/g, function() {
			return daysWeek[$gameTime.getTime("dayweek")];
		}.bind(this));
		text = text.replace(/\GTMONN/g, function() {
			return String($gameTime.getTime("month")+1);
		}.bind(this));
		text = text.replace(/\GTMONF/g, function() {
			return monthNames[$gameTime.getTime("month")];
		}.bind(this));
		text = text.replace(/\GTYEAR/g, function() {
			return String($gameTime.getTime("year"));
		}.bind(this));
		text = text.replace(/\GTMERI/g, function() {
			return $gameTime.getTime("hour") > 11 ? "PM" : "AM";
		}.bind(this));
		return text;
	}
	
	var GameTime_Game_Interpreter_command223 = Game_Interpreter.prototype.command223;
	Game_Interpreter.prototype.command223 = function() {
		$gameTime.pauseTint = true;
		return GameTime_Game_Interpreter_command223.call(this);
	}
	
})();