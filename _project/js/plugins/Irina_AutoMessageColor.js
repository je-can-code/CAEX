/*:
 * @plugindesc <AutoMessageColor> RPG Maker MV version 1.6.2
 * @author RPG Maker Irina
 *
 * @help
 * *** Introduction ***
 * 
 * This plugin automatically causes the messages that can use text codes to
 * automatically color keywords to depict importance so you don't have to
 * manually type in \c[3]Important\c[0] every time you want to draw attention
 * to something. This helps those who want to make their keywords consistent
 * throughout their game as well as makes it easier to simply offload text into
 * RPG Maker MV without having to go through and highlight everything manually.
 *
 * Warning: This will not work in text that does not make use of text codes
 * simply because that kind of drawn text does not support color changes
 * through the \c[x] text code to begin with.
 *
 *
 *
 * *** Plugin Parameters ***
 * 
 * Text Code Highlighting
 * 
 *      Anything listed under here will have text code colors used to highlight
 * them in the game. Using the listed text codes will put color changes before
 * the text code and a color reversion after it. If you don't want certain text
 * codes to be colored, replace their number values with 'false' instead.
 *
 *      Some of these plugin parameters require certain Yanfly Engine Plugins
 * to work. If you don't have them, that's okay (but you should download them
 * because they make your game tons better). If the plugins aren't present,
 * the features wouldn't be used for those text codes anyway.
 *
 * Word Highlighting
 *
 *      You can insert lists of words into these plugin parameters to have them
 * always come up a certain color in-game (these will not show in the editor
 * message previews). You can add multiple words per color entry. The words
 * entered here are case sensitive. This means that if you put in 'Green', then
 * using 'green' will not become colored. If you want both cases to be colored,
 * then list both the lowercase and uppercase versions of the word.
 *
 *      Also, these would have to be the exact word, too. 'Greenland' would not
 * become colored because 'Greenland' is not the same as 'Green'. This plugin
 * will make a check for only exact versions of the word unless there is a
 * possessive case after the word (like Green's). In that case, only the actual
 * word and not the 's will be colored.
 *
 *
 * 
 * *** RPG Maker Version ***
 *
 *      This plugin is made for and tested on RPG Maker MV with version 1.6.2.
 * I cannot guarantee if it works on lower versions. Some of the plugin
 * parameters require the later updates of RPG Maker MV for you to be able to
 * use their entries so please update RPG Maker MV to the latest version if you
 * want the best experience in using this plugin.
 *
 *
 *
 * *** Terms of Use ***
 * 
 * 1. These plugins may be used in free or commercial games.
 * 2. 'RPG Maker Irina' must be given credit in your games.
 * 3. You are allowed to edit the code.
 * 4. Do NOT change the filename, parameters, and information of the plugin.
 * 5. You are NOT allowed to redistribute these Plugins.
 * 6. You may NOT take code for your own released Plugins.
 *
 *
 *
 * *** Help End ***
 *
 *
 *
 * @param TextCodeHighlighting
 * @text Text Code Highlighting
 *
 * @param TextCodeBase
 * @text Vanilla RPG Maker MV
 * @parent TextCodeHighlighting
 * @default ..........
 *
 * @param TCActorName
 * @text \N[x]
 * @parent TextCodeBase
 * @desc What text color to use with this. Leave this as 'false' if you don't want to use any highlighting.
 * @default 3
 *
 * @param TCPartyName
 * @text \P[x]
 * @parent TextCodeBase
 * @desc What text color to use with this. Leave this as 'false' if you don't want to use any highlighting.
 * @default 3
 *
 * @param TextCodeYepMsgCore
 * @text YEP_MessageCore
 * @parent TextCodeHighlighting
 * @default ..........
 *
 * @param TCActorClass
 * @text \AC[x]
 * @parent TextCodeYepMsgCore
 * @desc What text color to use with this. Leave this as 'false' if you don't want to use any highlighting.
 * @default 4
 *
 * @param TCActorNickname
 * @text \AN[x]
 * @parent TextCodeYepMsgCore
 * @desc What text color to use with this. Leave this as 'false' if you don't want to use any highlighting.
 * @default 4
 *
 * @param TCPartyClass
 * @text \PC[x]
 * @parent TextCodeYepMsgCore
 * @desc What text color to use with this. Leave this as 'false' if you don't want to use any highlighting.
 * @default 4
 *
 * @param TCPartyNickname
 * @text \PN[x]
 * @parent TextCodeYepMsgCore
 * @desc What text color to use with this. Leave this as 'false' if you don't want to use any highlighting.
 * @default 4
 *
 * @param TCClassName
 * @text \NC[x]
 * @parent TextCodeYepMsgCore
 * @desc What text color to use with this. Leave this as 'false' if you don't want to use any highlighting.
 * @default 5
 *
 * @param TCItemName
 * @text \NI[x]
 * @parent TextCodeYepMsgCore
 * @desc What text color to use with this. Leave this as 'false' if you don't want to use any highlighting.
 * @default 5
 *
 * @param TCWeaponName
 * @text \NW[x]
 * @parent TextCodeYepMsgCore
 * @desc What text color to use with this. Leave this as 'false' if you don't want to use any highlighting.
 * @default 5
 *
 * @param TCArmorName
 * @text \NA[x]
 * @parent TextCodeYepMsgCore
 * @desc What text color to use with this. Leave this as 'false' if you don't want to use any highlighting.
 * @default 5
 *
 * @param TCEnemyName
 * @text \NE[x]
 * @parent TextCodeYepMsgCore
 * @desc What text color to use with this. Leave this as 'false' if you don't want to use any highlighting.
 * @default 5
 *
 * @param TCSkillName
 * @text \NS[x]
 * @parent TextCodeYepMsgCore
 * @desc What text color to use with this. Leave this as 'false' if you don't want to use any highlighting.
 * @default 5
 *
 * @param TCStateName
 * @text \NT[x]
 * @parent TextCodeYepMsgCore
 * @desc What text color to use with this. Leave this as 'false' if you don't want to use any highlighting.
 * @default 5
 *
 * @param TCItemIcon
 * @text \II[x]
 * @parent TextCodeYepMsgCore
 * @desc What text color to use with this. Leave this as 'false' if you don't want to use any highlighting.
 * @default 5
 *
 * @param TCWeaponIcon
 * @text \IW[x]
 * @parent TextCodeYepMsgCore
 * @desc What text color to use with this. Leave this as 'false' if you don't want to use any highlighting.
 * @default 5
 *
 * @param TCArmorIcon
 * @text \IA[x]
 * @parent TextCodeYepMsgCore
 * @desc What text color to use with this. Leave this as 'false' if you don't want to use any highlighting.
 * @default 5
 *
 * @param TCSkillIcon
 * @text \IS[x]
 * @parent TextCodeYepMsgCore
 * @desc What text color to use with this. Leave this as 'false' if you don't want to use any highlighting.
 * @default 5
 *
 * @param TCStateIcon
 * @text \IT[x]
 * @parent TextCodeYepMsgCore
 * @desc What text color to use with this. Leave this as 'false' if you don't want to use any highlighting.
 * @default 5
 *
 * @param TextCodeYepExtMsg1
 * @text YEP_X_ExtMesPack1
 * @parent TextCodeHighlighting
 * @default ..........
 *
 * @param TCEnemyNamePack1
 * @text \EN[x]
 * @parent TextCodeYepExtMsg1
 * @desc What text color to use with this. Leave this as 'false' if you don't want to use any highlighting.
 * @default 4
 *
 * @param TCEnemyTroop
 * @text \ET[x]
 * @parent TextCodeYepExtMsg1
 * @desc What text color to use with this. Leave this as 'false' if you don't want to use any highlighting.
 * @default 4
 *
 * @param
 *
 * @param WordHighlighting
 * @text Word Highlighting
 *
 * @param TextColor1
 * @text Color 1: Blue
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor2
 * @text Color 2: Red
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor3
 * @text Color 3: Green
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor4
 * @text Color 4: Sky Blue
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor5
 * @text Color 5: Purple
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor6
 * @text Color 6: Yellow
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor7
 * @text Color 7: Gray
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor8
 * @text Color 8: Light Gray
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor9
 * @text Color 9: Dark Blue
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor10
 * @text Color 10: Dark Red
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor11
 * @text Color 11: Dark Green
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor12
 * @text Color 12: Dark Sky Blue
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor13
 * @text Color 13: Dark Purple
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor14
 * @text Color 14: Solid Yellow
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor15
 * @text Color 15: Black
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor16
 * @text Color 16: System Blue
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor17
 * @text Color 17: Crisis Yellow
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor18
 * @text Color 18: Dead Red
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor19
 * @text Color 19: Outline Black
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor20
 * @text Color 20: HP Orange 1
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor21
 * @text Color 21: HP Orange 2
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor22
 * @text Color 22: MP Blue 1
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor23
 * @text Color 23: MP Blue 2
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor24
 * @text Color 24: Param Up Green
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor25
 * @text Color 25: Param Down Red
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor26
 * @text Color 26: System Purple
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor27
 * @text Color 27: System Pink
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor28
 * @text Color 28: TP Green 1
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor29
 * @text Color 29: TP Green 2
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor30
 * @text Color 30: EXP Purple 1
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 *
 * @param TextColor31
 * @text Color 31: EXP Purple 2
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color
 * @default []
 * 
 * @param 
 *
 */
//=============================================================================

var parameters=$plugins.filter(function(e){return e.description.contains("<AutoMessageColor>")})[0].parameters;var Imported=Imported||{};Imported.Irina_AutoMessageColor={};(function(e){for(var o=1;o<=31;o++){var r="TextColor"+o;Imported.Irina_AutoMessageColor[r]=JSON.parse(e[r])}var a=["TCActorName","TCPartyName","TCActorClass","TCActorNickname","TCPartyClass","TCPartyNickname","TCClassName","TCItemName","TCWeaponName","TCArmorName","TCSkillName","TCEnemyName","TCStateName","TCItemIcon","TCWeaponIcon","TCArmorIcon","TCSkillIcon","TCStateIcon","TCEnemyNamePack1","TCEnemyTroop"];for(var o=0;o<a.length;o++){var r=a[o];Imported.Irina_AutoMessageColor[r]=Number(e[r])}})(parameters);Imported.Irina_AutoMessageColor.matchExact=function(e,o){var r=o.match(e);return r&&o===r[0]};Imported.Irina_AutoMessageColor.Window_Base_changeTextColor=Window_Base.prototype.changeTextColor;Window_Base.prototype.changeTextColor=function(e){this._previousTextColor=this._previousTextColor||[];this._previousTextColor.unshift(this.contents.textColor);Imported.Irina_AutoMessageColor.Window_Base_changeTextColor.call(this,e)};Window_Base.prototype.revertTextColor=function(){this._previousTextColor=this._previousTextColor||[];this.contents.textColor=this._previousTextColor.shift()||this.normalColor()};Imported.Irina_AutoMessageColor.Window_Base_convertEscapeCharacters=Window_Base.prototype.convertEscapeCharacters;Window_Base.prototype.convertEscapeCharacters=function(e){e=e.replace(/\\/g,"");e=e.replace(/\x1b\x1b/g,"\\\\");e=e.replace(/\x1bV\[(\d+)\]/gi,function(){return $gameVariables.value(parseInt(arguments[1]))}.bind(this));e=e.replace(/\x1bV\[(\d+)\]/gi,function(){return $gameVariables.value(parseInt(arguments[1]))}.bind(this));e=e.replace(/\\RESETCOLOR/g,"RESETCOLOR");e=this.convertAutomaticMessageColors(e);e=this.convertMvBaseTextCodes(e);e=this.convertYepMessageCoreTextCodes(e);e=this.convertYepExtMessagePack1TextCodes(e);return Imported.Irina_AutoMessageColor.Window_Base_convertEscapeCharacters.call(this,e)};Window_Base.prototype.convertAutomaticMessageColors=function(e){for(var o=1;o<=31;o++){var r="TextColor"+o;var a=Imported.Irina_AutoMessageColor[r];for(var t=0;t<a.length;t++){var s=a[t];if(s.length<=0)continue;if(s.match(/[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g)){var n=new RegExp(s,"i")}else{var n=new RegExp("\\b"+s+"\\b","g")}e=e.replace(n,"c["+o+"]"+s+"RESETCOLOR")}}return e};Window_Base.prototype.convertMvBaseTextCodes=function(e){if(!isNaN(Imported.Irina_AutoMessageColor.TCActorName)){e=e.replace(/\x1bN\[(\d+)\]/gi,function(){return"c["+Imported.Irina_AutoMessageColor.TCActorName+"]"+this.actorName(parseInt(arguments[1]))+"RESETCOLOR"}.bind(this))}if(!isNaN(Imported.Irina_AutoMessageColor.TCPartyName)){e=e.replace(/\x1bP\[(\d+)\]/gi,function(){return"c["+Imported.Irina_AutoMessageColor.TCPartyName+"]"+this.partyMemberName(parseInt(arguments[1]))+"RESETCOLOR"}.bind(this))}return e};Window_Base.prototype.convertYepMessageCoreTextCodes=function(e){if(Imported.YEP_MessageCore){if(!isNaN(Imported.Irina_AutoMessageColor.TCActorClass)){e=e.replace(/\x1bAC\[(\d+)\]/gi,function(){return"c["+Imported.Irina_AutoMessageColor.TCActorClass+"]"+this.actorClassName(parseInt(arguments[1]))+"RESETCOLOR"}.bind(this))}if(!isNaN(Imported.Irina_AutoMessageColor.TCActorNickname)){e=e.replace(/\x1bAN\[(\d+)\]/gi,function(){return"c["+Imported.Irina_AutoMessageColor.TCActorNickname+"]"+this.actorNickname(parseInt(arguments[1]))+"RESETCOLOR"}.bind(this))}if(!isNaN(Imported.Irina_AutoMessageColor.TCPartyClass)){e=e.replace(/\x1bPC\[(\d+)\]/gi,function(){return"c["+Imported.Irina_AutoMessageColor.TCPartyClass+"]"+this.partyClassName(parseInt(arguments[1]))+"RESETCOLOR"}.bind(this))}if(!isNaN(Imported.Irina_AutoMessageColor.TCPartyNickname)){e=e.replace(/\x1bPN\[(\d+)\]/gi,function(){return"c["+Imported.Irina_AutoMessageColor.TCPartyNickname+"]"+this.partyNickname(parseInt(arguments[1]))+"RESETCOLOR"}.bind(this))}if(!isNaN(Imported.Irina_AutoMessageColor.TCClassName)){e=e.replace(/\x1bNC\[(\d+)\]/gi,function(){return"c["+Imported.Irina_AutoMessageColor.TCClassName+"]"+$dataClasses[parseInt(arguments[1])].name+"RESETCOLOR"}.bind(this))}if(!isNaN(Imported.Irina_AutoMessageColor.TCItemName)){e=e.replace(/\x1bNI\[(\d+)\]/gi,function(){return"c["+Imported.Irina_AutoMessageColor.TCItemName+"]"+$dataItems[parseInt(arguments[1])].name+"RESETCOLOR"}.bind(this))}if(!isNaN(Imported.Irina_AutoMessageColor.TCWeaponName)){e=e.replace(/\x1bNW\[(\d+)\]/gi,function(){return"c["+Imported.Irina_AutoMessageColor.TCWeaponName+"]"+$dataWeapons[parseInt(arguments[1])].name+"RESETCOLOR"}.bind(this))}if(!isNaN(Imported.Irina_AutoMessageColor.TCArmorName)){e=e.replace(/\x1bNA\[(\d+)\]/gi,function(){return"c["+Imported.Irina_AutoMessageColor.TCArmorName+"]"+$dataArmors[parseInt(arguments[1])].name+"RESETCOLOR"}.bind(this))}if(!isNaN(Imported.Irina_AutoMessageColor.TCEnemyName)){e=e.replace(/\x1bNE\[(\d+)\]/gi,function(){return"c["+Imported.Irina_AutoMessageColor.TCEnemyName+"]"+$dataEnemies[parseInt(arguments[1])].name+"RESETCOLOR"}.bind(this))}if(!isNaN(Imported.Irina_AutoMessageColor.TCSkillName)){e=e.replace(/\x1bNS\[(\d+)\]/gi,function(){return"c["+Imported.Irina_AutoMessageColor.TCSkillName+"]"+$dataSkills[parseInt(arguments[1])].name+"RESETCOLOR"}.bind(this))}if(!isNaN(Imported.Irina_AutoMessageColor.TCStateName)){e=e.replace(/\x1bNT\[(\d+)\]/gi,function(){return"c["+Imported.Irina_AutoMessageColor.TCStateName+"]"+$dataStates[parseInt(arguments[1])].name+"RESETCOLOR"}.bind(this))}if(!isNaN(Imported.Irina_AutoMessageColor.TCItemIcon)){e=e.replace(/\x1bII\[(\d+)\]/gi,function(){return"c["+Imported.Irina_AutoMessageColor.TCItemIcon+"]"+this.escapeIconItem(arguments[1],$dataItems)+"RESETCOLOR"}.bind(this))}if(!isNaN(Imported.Irina_AutoMessageColor.TCWeaponIcon)){e=e.replace(/\x1bIW\[(\d+)\]/gi,function(){return"c["+Imported.Irina_AutoMessageColor.TCWeaponIcon+"]"+this.escapeIconItem(arguments[1],$dataWeapons)+"RESETCOLOR"}.bind(this))}if(!isNaN(Imported.Irina_AutoMessageColor.TCArmorIcon)){e=e.replace(/\x1bIA\[(\d+)\]/gi,function(){return"c["+Imported.Irina_AutoMessageColor.TCArmorIcon+"]"+this.escapeIconItem(arguments[1],$dataArmors)+"RESETCOLOR"}.bind(this))}if(!isNaN(Imported.Irina_AutoMessageColor.TCSkillIcon)){e=e.replace(/\x1bIS\[(\d+)\]/gi,function(){return"c["+Imported.Irina_AutoMessageColor.TCSkillIcon+"]"+this.escapeIconItem(arguments[1],$dataSkills)+"RESETCOLOR"}.bind(this))}if(!isNaN(Imported.Irina_AutoMessageColor.TCStateIcon)){e=e.replace(/\x1bIT\[(\d+)\]/gi,function(){return"c["+Imported.Irina_AutoMessageColor.TCStateIcon+"]"+this.escapeIconItem(arguments[1],$dataStates)+"RESETCOLOR"}.bind(this))}}return e};Window_Base.prototype.convertYepExtMessagePack1TextCodes=function(e){if(Imported.YEP_X_ExtMesPack1){if(!isNaN(Imported.Irina_AutoMessageColor.TCEnemyNamePack1)){e=e.replace(/\x1bEN\[(\d+)\]/gi,function(){var e=arguments[1];if(e<=0)return"";name=$dataEnemies[e].name;return"c["+Imported.Irina_AutoMessageColor.TCEnemyNamePack1+"]"+name+"RESETCOLOR"}.bind(this))}if(!isNaN(Imported.Irina_AutoMessageColor.TCEnemyTroop)){e=e.replace(/\x1bET\[(\d+)\]/gi,function(){var e=Math.max(1,arguments[1]-1);var o=$gameTroop.allMembers()[e];if(o){return"c["+Imported.Irina_AutoMessageColor.TCEnemyTroop+"]"+o.name()+"RESETCOLOR"}else{return""}}.bind(this))}}return e};Imported.Irina_AutoMessageColor.Window_Base_processEscapeCharacter=Window_Base.prototype.processEscapeCharacter;Window_Base.prototype.processEscapeCharacter=function(e,o){if(e==="RESETCOLOR")this.revertTextColor();Imported.Irina_AutoMessageColor.Window_Base_processEscapeCharacter.call(this,e,o)};