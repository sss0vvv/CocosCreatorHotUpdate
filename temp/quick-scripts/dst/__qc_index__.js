
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/__qc_index__.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}
require('./assets/ABLobby/root/Script/LobbyConst');
require('./assets/ABLobby/root/Script/LobbyRoot');
require('./assets/ABSubGame1/root/Script/SubGame1Const');
require('./assets/ABSubGame1/root/Script/SubGame_1');
require('./assets/ABSubGame2/root/Script/SubGame_2');
require('./assets/Script/AppCom');
require('./assets/Script/AppConst');
require('./assets/Script/HelloWorld');
require('./assets/Script/ModuleMag/HotUIHelper');
require('./assets/Script/ModuleMag/Module');
require('./assets/Script/ModuleMag/ModuleCom');
require('./assets/Script/ModuleMag/ModuleConst');
require('./assets/Script/ModuleMag/ModuleManager');
require('./assets/Script/ModuleMag/UnpackageHelper');

                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();