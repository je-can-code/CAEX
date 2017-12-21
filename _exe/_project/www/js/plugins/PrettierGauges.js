//=============================================================================
// PrettyGauges.js
//=============================================================================

/*:
 * @plugindesc Changes how gauges are displayed
 * @author Rocketmancer
 *
 * @param barType
 * @desc Describes the shape of the bar. Use any combination of | / . < > ( ) Ex. // (> or /|
 * @default ||
 *
 * @param outline
 * @desc Outline bars? 0: No 1: Yes
 * @default 0
 *
 * @param barHeight
 * @desc Height of gauges when they are shown.
 * @default 8
 *
 * @param outlineColor1
 * @desc First color for outline gradient in Hex
 * @default #FFFFFF
 *
 * @param outlineColor2
 * @desc Second color for outline gradient in Hex
 * @default #FFFFFF
 *
 * @param hpColor1
 * @desc First color for the HP gradient in hex. Leave blank for default.
 * @param hpColor2
 * @desc Second color for the HP gradient in hex. Leave blank for default.
 * @param mpColor1
 * @desc First color for the MP gradient in hex. Leave blank for default.
 * @param mpColor2
 * @desc Second color for the MP gradient in hex. Leave blank for default.
 * @param tpColor1
 * @desc First color for the TP gradient in hex. Leave blank for default.
 * @param tpColor2
 * @desc Second color for the TP gradient in hex. Leave blank for default.
 * @param backgroundColor1
 * @desc First color for the background gradient in hex. Leave blank for default.
 * @param backgroundColor2
 * @desc Second color for the background gradient in hex. Leave blank for default.
 *
 */


(function() {
	var parameters = PluginManager.parameters('PrettyGauges');
	var barTypeLeft = String(parameters['barType']).substring(0,1);
	var barTypeRight = String(parameters['barType']).substring(1,2)
	var outline = Number(parameters['outline'] || 0);
	var barHeight = Number(parameters['barHeight'] || 0);
	var outlineColor1 = String(parameters['outlineColor1']);
	var outlineColor2 = String(parameters['outlineColor2']);
	var backgroundColor1 = String(parameters['backgroundColor1']);
	var backgroundColor2 = String(parameters['backgroundColor2']);
	var hpColor1 = String(parameters['hpColor1']);
	var hpColor2 = String(parameters['hpColor2']);
	var mpColor1 = String(parameters['mpColor1']);
	var mpColor2 = String(parameters['mpColor2']);
	var tpColor1 = String(parameters['tpColor1']);
	var tpColor2 = String(parameters['tpColor2']);
	

	Window_Base.prototype.gaugeBackColor1 = function() {
		if (backgroundColor1.length > 0) {
			return backgroundColor1
		}
		else {
			return this.textColor(19);
		}
	};
	
	Window_Base.prototype.gaugeBackColor2 = function() {
		if (backgroundColor2.length > 0) {
			return backgroundColor2
		}
		else {
			return this.textColor(19);
		}
	};

	Window_Base.prototype.hpGaugeColor1 = function() {
		if (hpColor1.length > 0) {
			return hpColor1
		}
		else {
			return this.textColor(20);
		}
	};

	Window_Base.prototype.hpGaugeColor2 = function() {
		if (hpColor2.length > 0) {
			return hpColor2
		}
		else {
			return this.textColor(21);
		}
	};

	Window_Base.prototype.mpGaugeColor1 = function() {
		if (mpColor1.length > 0) {
			return mpColor1
		}
		else {
		return this.textColor(22);
		}
	};

	Window_Base.prototype.mpGaugeColor2 = function() {
		if (mpColor2.length > 0) {
			return mpColor2
		}
		else {
		return this.textColor(23);
		}
	};
	
	Window_Base.prototype.tpGaugeColor1 = function() {
		if (tpColor1.length > 0) {
			return tpColor1
		}
		else {
		return this.textColor(28);
		}
	};

	Window_Base.prototype.tpGaugeColor2 = function() {
		if (tpColor2.length > 0) {
			return tpColor2
		}
		else {
		return this.textColor(29);
		}
	};
	
	Bitmap.prototype.fillTrap = function(x, y, width, widthpart, height, color1, color2) {
		var context = this._context;
		var grad = context.createLinearGradient(x, y, x + width, y);
		grad.addColorStop(0, color1);
		grad.addColorStop(1, color2);
		context.save();
		context.beginPath();
		switch (barTypeLeft) {
			case "|":
				context.moveTo(x, y + height)
				context.lineTo(x, y)
			break;
			case "/":
				context.moveTo(x, y + height)
				context.lineTo(x + height, y)
			break;
			case "<":
				context.moveTo(x + height/2, y + height)
				context.lineTo(x, y + height/2)
				context.lineTo(x + height/2, y)
			break;
			case "(":
				context.moveTo(x + height, y + height);
				context.bezierCurveTo(x, y + height, x, y, x + height, y);
			break;
			case ".":
				context.moveTo(x, y + height)
			break;
		}
		switch (barTypeRight) {
			case "|":
				context.lineTo(x + width, y)
				context.lineTo(x + width, y + height)
			break;
			case "/":
				context.lineTo(x + width, y)
				context.lineTo(x + width - height, y + height)
			break;
			case ">":
				context.lineTo(x + width - height/2, y)
				context.lineTo(x + width, y + height/2)
				context.lineTo(x + width - height/2, y + height)
			break;
			case ")":
				context.lineTo(x + width - height, y);
				context.bezierCurveTo(x + width, y, x + width, y + height, x + width - height, y + height);
			break;
			case ".":
				context.lineTo(x + width, y + height)
			break;
		}
		context.clip();
		context.fillStyle = grad;
		context.fillRect(x, y, widthpart, height);
		context.restore();
		this._setDirty();
	}
	
	Bitmap.prototype.outlineTrap = function(x, y, width, height, color1, color2) {
		var context = this._context;
		var grad = context.createLinearGradient(x, y, x + width, y);
		var startCoords = [];
		grad.addColorStop(0, color1);
		grad.addColorStop(1, color2);
		context.save();
		context.beginPath();
		switch (barTypeLeft) {
			case "|":
				startCoords = [x, y + height]
				context.moveTo(x, y + height)
				context.lineTo(x, y)
			break;
			case "/":
				startCoords = [x, y + height]
				context.moveTo(x, y + height)
				context.lineTo(x + height, y)
			break;
			case "<":
				startCoords = [x + height/2, y + height]
				context.moveTo(x + height/2, y + height)
				context.lineTo(x, y + height/2)
				context.lineTo(x + height/2, y)
			break;
			case "(":
				startCoords = [x + height, y + height]
				context.moveTo(x + height, y + height);
				context.bezierCurveTo(x, y + height, x, y, x + height, y);
			break;
			case ".":
				startCoords = [x, y + height]
				context.moveTo(x, y + height)
			break;
		}
		
		switch (barTypeRight) {
			case "|":
				context.lineTo(x + width, y)
				context.lineTo(x + width, y + height)
			break;
			case "/":
				context.lineTo(x + width, y)
				context.lineTo(x + width - height, y + height)
			break;
			case ">":
				context.lineTo(x + width - height/2, y)
				context.lineTo(x + width, y + height/2)
				context.lineTo(x + width - height/2, y + height)
			break;
			case ")":
				context.lineTo(x + width - height, y);
				context.bezierCurveTo(x + width, y, x + width, y + height, x + width - height, y + height);
			break;
			case ".":
				context.lineTo(x + width, y + height)
			break;
		}
		context.lineTo(startCoords[0], startCoords[1])
		context.strokeStyle = grad;
		context.stroke();
		context.restore();
		this._setDirty();
	}
	
	Window_Base.prototype.drawGauge = function(x, y, width, rate, color1, color2) {
		var fillW = Math.floor(width * rate);
		var gaugeY = y + this.lineHeight() - 2 - barHeight;
		this.contents.fillTrap(x, gaugeY, width, width, barHeight, this.gaugeBackColor1(),  this.gaugeBackColor2());
		this.contents.fillTrap(x, gaugeY, width, fillW, barHeight, color1, color2);
		if (outline) { this.contents.outlineTrap(x, gaugeY, width, barHeight, outlineColor1, outlineColor2)}
		
		
	};
	
})();