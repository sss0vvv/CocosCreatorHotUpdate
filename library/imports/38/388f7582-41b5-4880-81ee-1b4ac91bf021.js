"use strict";
cc._RF.push(module, '388f7WCQbVIgIHuG0rJG/Ah', 'SubGame_1');
// ABSubGame1/root/Script/SubGame_1.js

"use strict";

var JS_LOG = function JS_LOG() {
  var _cc;

  for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
    arg[_key] = arguments[_key];
  }

  (_cc = cc).log.apply(_cc, ["[SubGame_1]"].concat(arg));
};

var LobbyConst = require("LobbyConst");

JS_LOG("game1_req_lobby_js_:", LobbyConst.testv);
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

    this._lobbyRoot.removeGame_1();
  }
});

cc._RF.pop();