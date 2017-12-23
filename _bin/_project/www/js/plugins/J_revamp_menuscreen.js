//=============================================================================
// J-Menu Screen Revamp v0.0
//=============================================================================
// Changelog:
//  v0.0: Developed and soft-released.
/*:
@plugindesc Alters the menu screen.
@author J
@help
REQUIRES: J_base
No commands are used outside of initial setup.

 */

Scene_Map.prototype.callMenu = function() {
    SoundManager.playOk();
    SceneManager.push(Scene_Menu);
    Window_MenuCommand.initCommandPosition();
    $gameTemp.clearDestination();
    this._mapNameWindow.hide();
    this._waitCount = 2;
};
