"use strict";
cc._RF.push(module, 'db61cI7621CF4KaPW1dwhIj', 'LobbyRoot');
// ABLobby/root/Script/LobbyRoot.js

"use strict";

// let LobbyRoot
var JS_LOG = function JS_LOG() {
  var _cc;

  for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
    arg[_key] = arguments[_key];
  }

  (_cc = cc).log.apply(_cc, ["[LobbyRoot]"].concat(arg));
};

cc.Class({
  "extends": cc.Component,
  properties: {},
  initModule: function initModule() {
    JS_LOG("initModule");
  },
  onBtn_loadGame_1: function onBtn_loadGame_1() {
    var _this = this;

    JS_LOG("onBtn_loadGame_1");
    this.removeGame_1();
    this.loadSubGame("ABSubGame1", function (moduleObj) {
      var abObj = moduleObj.getABObj();
      abObj.load('root/Scene/SubGame1', cc.Prefab, function (err, prefab) {
        JS_LOG("load_game1_prefab_:", JSON.stringify(err));

        var _node = cc.instantiate(prefab);

        _this.node.addChild(_node, 100);

        _this._game1 = _node;

        _node.getComponent("SubGame_1").initModule({
          lobbyRoot: _this
        });
      });
    }); // 模块内加载自身资源
    // let module = _G_moduleMag.getModule("ABLobby")
    // let assetBundle = module.getABObj()
    // assetBundle.load('root/Scene/xxx', cc.Prefab, (err, prefab)=>{    
    //     //...
    // }) 
  },
  removeGame_1: function removeGame_1() {
    if (this._game1) {
      this._game1.destroy();
    }

    this._game1 = null;
  },
  onBtn_loadGame_2: function onBtn_loadGame_2() {
    var _this2 = this;

    JS_LOG("onBtn_loadGame_2");
    this.removeGame_2();
    this.loadSubGame("ABSubGame2", function (moduleObj) {
      var abObj = moduleObj.getABObj();
      abObj.load('root/Scene/SubGame2', cc.Prefab, function (err, prefab) {
        JS_LOG("load_game2_prefab_:", JSON.stringify(err));

        var _node = cc.instantiate(prefab);

        _this2.node.addChild(_node, 100);

        _this2._game2 = _node;

        _node.getComponent("SubGame_2").initModule({
          lobbyRoot: _this2
        });
      });
    });
  },
  removeGame_2: function removeGame_2() {
    if (this._game2) {
      this._game2.destroy();
    }

    this._game2 = null;
  },
  loadSubGame: function loadSubGame(abName, callback) {
    _G_moduleMag.hotUpdateMultiModule([abName], function () {
      _G_moduleMag.addModule(abName, function (moduleObj) {
        callback(moduleObj);
      });
    });
  }
});

cc._RF.pop();