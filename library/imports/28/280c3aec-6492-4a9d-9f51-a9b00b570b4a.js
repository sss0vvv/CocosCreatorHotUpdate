"use strict";
cc._RF.push(module, '280c3rsZJJKnZ9RqbALVwtK', 'HelloWorld');
// Script/HelloWorld.js

"use strict";

window._Gloabal = {
  Client_Version: "1.0.0" //客户端大版本

};

var JS_LOG = function JS_LOG() {
  var _cc;

  for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
    arg[_key] = arguments[_key];
  }

  (_cc = cc).log.apply(_cc, ["[HelloWorld]"].concat(arg));
};

cc.Class({
  "extends": cc.Component,
  properties: {
    ModuleMagPreFab: cc.Prefab,
    moduleLayer: cc.Node,
    msgLayer: cc.Node
  },
  onLoad: function onLoad() {
    var _this = this;

    JS_LOG("jsb_writable_:", jsb.fileUtils.getWritablePath());
    window._G_AppCom = this._AppCom = this.getComponent("AppCom"); // 配置热更新地址到 ModuleConst.js
    // 初始化

    var moduleMagObj = cc.instantiate(this.ModuleMagPreFab);
    moduleMagObj.parent = this.msgLayer;
    window._G_moduleMag = moduleMagObj.getComponent("ModuleManager");

    _G_moduleMag.initCom({// useHotUpdate : true ,     // 是否启用热更新 
    }); //-------------------
    // 复制包内模块到可读写路径下,避免首次加载模块时从远程完整拉取


    _G_moduleMag.execUnpackage(function () {
      _G_moduleMag.reqVersionInfo(function () {
        // 获取最新版本
        _this.reloadLobbyRoot();
      });
    }); // 定时检测更新


    _G_moduleMag.reqLoopVersionInfo();
  },
  reloadLobbyRoot: function reloadLobbyRoot() {
    var _this2 = this;

    var loadAb = ["ABLobby"]; // loadAb = ["ABLobby", "ABSubGame1", "ABSubGame2"]

    _G_moduleMag.hotUpdateMultiModule(loadAb, function () {
      // 更新模块到最新版本
      _G_moduleMag.addModule("ABLobby", function (moduleObj) {
        // 加载模块
        var abObj = moduleObj.getABObj();
        abObj.load('root/Scene/LobbyRoot', cc.Prefab, function (err, prefab) {
          // 使用模块资源 
          JS_LOG("load_lobby_prefab_:", JSON.stringify(err));

          if (_this2._lobbyRootNode) {
            _this2._lobbyRootNode.destroy();
          }

          var lobbyRoot = cc.instantiate(prefab);
          _this2._lobbyRootNode = lobbyRoot;

          _this2.moduleLayer.addChild(lobbyRoot, 100);

          lobbyRoot.getComponent("LobbyRoot").initModule();
        });
      });
    });
  }
});

cc._RF.pop();