/* -------------------------------------------------------------------------- */
// J_StatDistribution
// V: 1.0
//
/*:@plugindesc Enables stat distribution by points earned.
@author J

@help WIP.

*/

var Imported = Imported || {};
Imported.J_StatDistribution = true;

J = J || {};
J.SD =   J.SD || {};
J.SD.Modes = [];

J.SD.makeSDparam = function(nameParam, exprate, goldrate, droprate, 
  maxHP, maxMP, agility, attack, defense, luck, matk, mdef,
  hitrate, evade, counter, crit, critdodge, mevade, mreflect, 
  hpregen, mpregen, target, guard, recovery, physrate, magirate) {

	var newParam = {
		name: nameParam || "", 	limit: 0, 	cost: 0,
		
		exp: exprate || 0,   gold: goldrate || 0, drop: droprate || 0,
		mhp: maxHP || 0,     mmp: maxMP || 0,     agi: agility || 0,
		atk: attack || 0,    def: defense || 0,   luk: luck || 0,
		mat: matk || 0,      mdf: mdef || 0,

		hit: hitrate || 0,   eva: evade || 0,     cnt: counter || 0,
		cri: crit || 0,      cev: critdodge || 0,
		mev: mevade || 0,    mrf: mreflect || 0,
		hrg: hpregen || 0,   mrg: mpregen || 0,   trg: target || 0,
		grd: guard || 0,  rec: recovery || 0,  pdr: physrate || 0,  mdr: magirate || 0
	};
	return newParam;
};

J.SD.PARAMS = [mhp, mmp, atk, def, mat, mdf, agi, luk, hit, eva, cri,
hit, eva, cri, cev, mev, mrf, cnt, hrg, mrg, trg,
grd, rec, pha, mcr, tcr, pdr, mdr, fdr, exr];

// make empty structured object for use
J.SD.getStructure = function(type) {
	var gainInfo = {
		key: "",
		name: "",
		limit: 0,
		cost: 0,
		cost_rev: 0,
		params: {}
	}
	var paramInfo = {
		value: 0,
		value_rev: 0,
	}
	var distInfo = {
		count: 0,
		hp: 0,
		mp: 0,
	}
	switch (type) {
		case "gain": return gainInfo;
		case "param": return paramInfo;
		case "dist": return distInfo;
		default: break;
	}
	return gainInfo;
};

// creates a list of parameters for a given actor/class.
J.SD.createParamDistribution = function(target) {
	var result = [];
	target.forEach(function(v) {
		var info = J.SD.getStructure("gain");
		info.key = v.key;
		info.name = v.name;
		info.limit = v.limit;
		info.cost = v.cost[0];
		info.cost_rev = v.cost[1] == null ? 0 : v.cost[1];
		info.params = {};

		J.SD.PARAMS.forEach(function(param) {
			if (v.hasOwnProperty(param)) {
				var pInfo = J.SD.getStructure("param");
				pInfo.value = v[param][0];
				pInfo.value_rev = v[param][1];
				info.params[param] = pInfo;
			}
		})
		result.push(info);
	})
	return result;
};

J.SD.createPersonalParamStructs = function(target) {
	var result = [];
	target.forEach(function(list) {
		if (list == null) return;
		var newList = J.SD.createParamDistribution(target);
		result.push(newList);
	})
};

J.SD.mergeTwoLists = function(l1, l2) {
	var result = JSON.parse(JSON.stringify(l1));
	l2.forEach(function(info2) {
		var overwrite = false;
		l1.forEach(function(info1, i) {
			if (info1.key == info2.key) {
				result[i] = info2;
		 		overwrite = true;
				break;
			}
		})
		if (!overwrite) result.push(info2);
	})
	return result;
};