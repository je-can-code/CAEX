//=============================================================================
// Map Making system
// Jay_MiniMapMaker.js
// Version 1.0.2
//=============================================================================

var Imported = Imported || {};
Imported.Jay_MiniMapMaker = true;

var Jay = Jay || {};
Jay.MiniMapMaker = Jay.MiniMapMaker || {};

//=============================================================================
 /*:
 * @plugindesc Makes mimimaps, perfect for putting in the corner of the screen.
 *
 * @author Jason R. Godding
 *
 * @param Water Color
 * @desc The color used for water tiles.
 * @default #888888
 *
 * @param Walkable Color
 * @desc The color used for walkable tiles.
 * @default #FFFFFF
 *
 * @param Cliff Color
 * @desc The color used for tiles along cliffs.
 * @default #CCCCCC
 * 
 * @param Unwalkable Color
 * @desc The color used for unwalkable, but non-water, tiles.
 * @default #AAAAAA
 *
 * @param Damage Color
 * @desc The color used for damage tiles.
 * @default #DDDDDD
 *
 * @param Default Scale
 * @desc The scale to use when one isn't defined and autoscale is turned off. One tile becomes this many pixels high and wide.
 * @default 1
 *
 * @param Auto Scale
 * @desc Set to "true" to make the map automatically pick the scale when one isn't defined.
 * @default false
 *
 * @param Max Size
 * @desc If no scale is defined and Auto Scale is true, this is the size maps will try to scale to.
 * @default 100
 *
 * @help Just put "MakeMap" in a Plugin Command to make an image of the current map.
 * Use "MakeMap #", with a number in place of "#", to change the scale to that number.
 * For example, "MakeMap 2" would have each tile be represented two pixels wide and two pixels high.
 * Great for putting in corners of screens and whatnot.
 *
 * ====================================
 *
 * Version 1.0.2 - Added scaling options and a color for damage tiles.
 *
 * Version 1.0.1 - Fixed an issue that would cause certain horizontal-only tiles
 * to be marked as "unwalkable" instead of the more correct "cliff".
 *
 * This plugin is free for non-commercial and commercial use, but please credit
 * Jason R. Godding if you use it. Thank you.
 * 
 */

Jay.Parameters = Jay.Parameters || {};
Jay.Parameters.MiniMapMaker = PluginManager.parameters('Jay_MiniMapMaker');

Jay.Param = Jay.Param || {};
Jay.Param.WaterColor = String(Jay.Parameters.MiniMapMaker['Water Color']);
Jay.Param.WalkableColor = String(Jay.Parameters.MiniMapMaker['Walkable Color']);
Jay.Param.CliffColor = String(Jay.Parameters.MiniMapMaker['Cliff Color']);
Jay.Param.UnwalkableColor = String(Jay.Parameters.MiniMapMaker['Unwalkable Color']);
Jay.Param.DamageColor = String(Jay.Parameters.MiniMapMaker['Damage Color']);
Jay.Param.DefaultMapScale = Number(Jay.Parameters.MiniMapMaker['Default Scale']);
Jay.Param.AutoScale = String(Jay.Parameters.MiniMapMaker['Auto Scale']) === 'true';
Jay.Param.MaxSize = Number(Jay.Parameters.MiniMapMaker['Max Size']);

Jay.MiniMapMaker.pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	if (command === 'MakeMap') {
        this.makeMap(args);
        console.log("map made");
	}
	Jay.MiniMapMaker.pluginCommand.call(this, command, args);
}

Game_Interpreter.prototype.makeMap = function(args) {
	var width = $gameMap.width();
	var height = $gameMap.height();
	var scale;
	if (args.length > 0) {
		scale = Number(args[0]);
	}
	else if (Jay.Param.AutoScale) {
		var size = Math.max(width, height);
		if (size > Jay.Param.MaxSize) {
			scale = 1;
		}
		else {
			scale = Math.floor(Jay.Param.MaxSize / size);
		}
	}
	else {
		scale = Jay.Param.DefaultMapScale;
	}
	var map = new Bitmap(width * scale, height * scale);
	for(var x = 0; x < width; x++) {
		for(var y = 0; y < height; y++) {
			var isWalkable = $gameMap.isPassable(x, y, 2) && $gameMap.isPassable(x, y, 4) && 
				$gameMap.isPassable(x, y, 6) && $gameMap.isPassable(x, y, 8);
			var isCliff = !isWalkable && ($gameMap.isPassable(x, y, 2) || $gameMap.isPassable(x, y, 4) || 
				$gameMap.isPassable(x, y, 6) || $gameMap.isPassable(x, y, 8));
			var isDamage = (isWalkable || isCliff) && $gameMap.isDamageFloor(x, y);
			var isWater = $gameMap.isShipPassable(x, y);
			if (isDamage) {
				map.fillRect(x * scale, y * scale, scale, scale, Jay.Param.DamageColor);
			}
			else if (isCliff) {
				map.fillRect(x * scale, y * scale, scale, scale, Jay.Param.CliffColor);
			}
			else if (isWalkable) {
				map.fillRect(x * scale, y * scale, scale, scale, Jay.Param.WalkableColor);
			}
			else if (isWater) {
				map.fillRect(x * scale, y * scale, scale, scale, Jay.Param.WaterColor);
			}
			else {
				map.fillRect(x * scale, y * scale, scale, scale, Jay.Param.UnwalkableColor);
			}
		}
	}
	var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '/img/pictures');
	if (path.match(/^\/([A-Z]\:)/)) {
		path = path.slice(1);
	}
	path = decodeURIComponent(path);
	var fs = require('fs');
	fs.mkdir(path, function(){
		var fileName = path + '/Map_' + $gameMap.mapId() + '.png';
		var image = map.canvas.toDataURL();
		var base64Data = image.replace(/^data:image\/png;base64,/, "");

        	fs.writeFile(fileName, base64Data, 'base64', function(error){
			if (error !== undefined && error !== null) {
				console.error('An error occurred while saving the screenshot', error); 
			}
		});
	});
}