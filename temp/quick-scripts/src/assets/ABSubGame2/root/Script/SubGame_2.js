"use strict";
cc._RF.push(module, '16dbaOjhHVEBJ6LqISL1bOQ', 'SubGame_2');
// ABSubGame2/root/Script/SubGame_2.js

"use strict";

var JS_LOG = function JS_LOG() {
  var _cc;

  for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
    arg[_key] = arguments[_key];
  }

  (_cc = cc).log.apply(_cc, ["[SubGame_2]"].concat(arg));
};

var LobbyConst = require("LobbyConst");

var SubGame1Const = require("SubGame1Const");

JS_LOG("game2_req_lobby_js_:", LobbyConst.testv);
JS_LOG("game2_req_game1_js_:", SubGame1Const.testv);
cc.Class({
  "extends": cc.Component,
  properties: {},
  initModule: function initModule(args) {
    JS_LOG("initModule");
    var lobbyRoot = args.lobbyRoot;
    this._lobbyRoot = lobbyRoot;
  },
  onBtn_close: function onBtn_close() {
    JS_LOG("btn_close");

    this._lobbyRoot.removeGame_2();
  }
});

cc._RF.pop();