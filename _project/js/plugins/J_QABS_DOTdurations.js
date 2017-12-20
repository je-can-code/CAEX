/* -------------------------------------------------------------------------- */
// J_QABS_DOTdurations
// V: 1.0

/*:@plugindesc Extends the duration of states when re-afflicted.
@author J

@help Nothing special. Just extends the duration of states when the same state
				is reapplied, instead of refreshing it or whatever the default is.

This needs to be placed beneath QABS itself.
This is designed to work in tandem with the rest of the QABS system.
This was written for me, but I'm uploading it incase others wanted to expand it.
*/
/* -------------------------------------------------------------------------- */
// added the extended duration if afflicted multiple times.
var Alias_Game_BattlerBase_resetStateCounts = Game_BattlerBase.prototype.resetStateCounts;
Game_BattlerBase.prototype.resetStateCounts = function(stateId) {
	Alias_Game_BattlerBase_resetStateCounts.call(this, stateId);
	this._stateSteps[stateId] = $dataStates[stateId].stepsToRemove || 0;
	if (this._stateDuration[stateId])
		this._stateDuration[stateId] += $dataStates[stateId].stepsToRemove;
	else
		this._stateDuration[stateId] = this._stateSteps[stateId];
};

// modified to check "_stateDuration" and not "_stateSteps" directly.
Game_Battler.prototype.updateStateSteps = function(state) {
	if (!state.removeByWalking) return;
	if (this._stateDuration[state.id] >= 0) {
		if (this._stateDuration[state.id] % this.stepsForTurn() === 0) {
			this.onTurnEnd();
			if (this._stateDuration[state.id] === 0) this.removeState(state.id);
		}
		this._stateDuration[state.id]--;
	}
};

// now removes "_stateDuration", too.
Game_Actor.prototype.clearStates = function() {
	Game_Battler.prototype.clearStates.call(this);
	this._stateSteps = {};
	this._stateDuration = {};
};