
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/ABSubGame1/root/Script/SubGame_1.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9BQlN1YkdhbWUxL3Jvb3QvU2NyaXB0L1N1YkdhbWVfMS5qcyJdLCJuYW1lcyI6WyJKU19MT0ciLCJhcmciLCJjYyIsImxvZyIsIkxvYmJ5Q29uc3QiLCJyZXF1aXJlIiwidGVzdHYiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJpbml0TW9kdWxlIiwiYXJncyIsImxvYmJ5Um9vdCIsIl9sb2JieVJvb3QiLCJvbkJ0bl9jbG9zZSIsInJlbW92ZUdhbWVfMSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFJQSxNQUFNLEdBQUcsU0FBVEEsTUFBUyxHQUFnQjtBQUFBOztBQUFBLG9DQUFKQyxHQUFJO0FBQUpBLElBQUFBLEdBQUk7QUFBQTs7QUFDekIsU0FBQUMsRUFBRSxFQUFDQyxHQUFILGFBQU8sYUFBUCxTQUF3QkYsR0FBeEI7QUFDSCxDQUZEOztBQUlBLElBQUlHLFVBQVUsR0FBR0MsT0FBTyxDQUFDLFlBQUQsQ0FBeEI7O0FBQ0FMLE1BQU0sQ0FBQyxzQkFBRCxFQUF5QkksVUFBVSxDQUFDRSxLQUFwQyxDQUFOO0FBRUFKLEVBQUUsQ0FBQ0ssS0FBSCxDQUFTO0FBQ0wsYUFBU0wsRUFBRSxDQUFDTSxTQURQO0FBRUxDLEVBQUFBLFVBQVUsRUFBRSxFQUZQO0FBS0xDLEVBQUFBLFVBTEssc0JBS01DLElBTE4sRUFLVztBQUNmWCxJQUFBQSxNQUFNLENBQUMsWUFBRCxDQUFOO0FBRGUsUUFFVFksU0FGUyxHQUVLRCxJQUZMLENBRVRDLFNBRlM7QUFHZixTQUFLQyxVQUFMLEdBQWtCRCxTQUFsQjtBQUNBLEdBVEk7QUFXTEUsRUFBQUEsV0FYSyx5QkFXUTtBQUNaZCxJQUFBQSxNQUFNLENBQUMsV0FBRCxDQUFOOztBQUNBLFNBQUthLFVBQUwsQ0FBZ0JFLFlBQWhCO0FBQ0E7QUFkSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJcblxubGV0IEpTX0xPRyA9IGZ1bmN0aW9uKC4uLmFyZyl7IFxuICAgIGNjLmxvZyhcIltTdWJHYW1lXzFdXCIsLi4uYXJnKSA7IFxufVxuXG5sZXQgTG9iYnlDb25zdCA9IHJlcXVpcmUoXCJMb2JieUNvbnN0XCIpXG5KU19MT0coXCJnYW1lMV9yZXFfbG9iYnlfanNfOlwiLCBMb2JieUNvbnN0LnRlc3R2KVxuXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LCBcbiAgICBwcm9wZXJ0aWVzOiB7XG5cbiAgICB9LFxuICAgIGluaXRNb2R1bGUoYXJncyl7XG4gICAgXHRKU19MT0coXCJpbml0TW9kdWxlXCIpXG4gICAgXHRsZXQgeyBsb2JieVJvb3QgfSA9IGFyZ3NcbiAgICBcdHRoaXMuX2xvYmJ5Um9vdCA9IGxvYmJ5Um9vdFxuICAgIH0sXG5cbiAgICBvbkJ0bl9jbG9zZSgpe1xuICAgIFx0SlNfTE9HKFwiYnRuX2Nsb3NlXCIpXG4gICAgXHR0aGlzLl9sb2JieVJvb3QucmVtb3ZlR2FtZV8xKClcbiAgICB9LFxuXG59KTtcbiJdfQ==