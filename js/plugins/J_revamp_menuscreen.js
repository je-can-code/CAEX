

Scene_Map.prototype.callMenu = function() {
    SoundManager.playOk();
    SceneManager.push(Scene_Menu);
    Window_MenuCommand.initCommandPosition();
    $gameTemp.clearDestination();
    this._mapNameWindow.hide();
    this._waitCount = 2;
};
