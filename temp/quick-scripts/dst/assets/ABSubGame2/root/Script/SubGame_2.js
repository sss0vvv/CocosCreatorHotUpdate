
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/ABSubGame2/root/Script/SubGame_2.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9BQlN1YkdhbWUyL3Jvb3QvU2NyaXB0L1N1YkdhbWVfMi5qcyJdLCJuYW1lcyI6WyJKU19MT0ciLCJhcmciLCJjYyIsImxvZyIsIkxvYmJ5Q29uc3QiLCJyZXF1aXJlIiwiU3ViR2FtZTFDb25zdCIsInRlc3R2IiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiaW5pdE1vZHVsZSIsImFyZ3MiLCJsb2JieVJvb3QiLCJfbG9iYnlSb290Iiwib25CdG5fY2xvc2UiLCJyZW1vdmVHYW1lXzIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBSUEsTUFBTSxHQUFHLFNBQVRBLE1BQVMsR0FBZ0I7QUFBQTs7QUFBQSxvQ0FBSkMsR0FBSTtBQUFKQSxJQUFBQSxHQUFJO0FBQUE7O0FBQ3pCLFNBQUFDLEVBQUUsRUFBQ0MsR0FBSCxhQUFPLGFBQVAsU0FBd0JGLEdBQXhCO0FBQ0gsQ0FGRDs7QUFJQSxJQUFJRyxVQUFVLEdBQUdDLE9BQU8sQ0FBQyxZQUFELENBQXhCOztBQUNBLElBQUlDLGFBQWEsR0FBR0QsT0FBTyxDQUFDLGVBQUQsQ0FBM0I7O0FBQ0FMLE1BQU0sQ0FBQyxzQkFBRCxFQUF5QkksVUFBVSxDQUFDRyxLQUFwQyxDQUFOO0FBQ0FQLE1BQU0sQ0FBQyxzQkFBRCxFQUF5Qk0sYUFBYSxDQUFDQyxLQUF2QyxDQUFOO0FBRUFMLEVBQUUsQ0FBQ00sS0FBSCxDQUFTO0FBQ0wsYUFBU04sRUFBRSxDQUFDTyxTQURQO0FBRUxDLEVBQUFBLFVBQVUsRUFBRSxFQUZQO0FBTUxDLEVBQUFBLFVBTkssc0JBTU1DLElBTk4sRUFNVztBQUNmWixJQUFBQSxNQUFNLENBQUMsWUFBRCxDQUFOO0FBRGUsUUFFVGEsU0FGUyxHQUVLRCxJQUZMLENBRVRDLFNBRlM7QUFHZixTQUFLQyxVQUFMLEdBQWtCRCxTQUFsQjtBQUNBLEdBVkk7QUFXTEUsRUFBQUEsV0FYSyx5QkFXUTtBQUNaZixJQUFBQSxNQUFNLENBQUMsV0FBRCxDQUFOOztBQUNBLFNBQUtjLFVBQUwsQ0FBZ0JFLFlBQWhCO0FBRUE7QUFmSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJcbmxldCBKU19MT0cgPSBmdW5jdGlvbiguLi5hcmcpeyBcbiAgICBjYy5sb2coXCJbU3ViR2FtZV8yXVwiLC4uLmFyZykgOyBcbn1cblxubGV0IExvYmJ5Q29uc3QgPSByZXF1aXJlKFwiTG9iYnlDb25zdFwiKVxubGV0IFN1YkdhbWUxQ29uc3QgPSByZXF1aXJlKFwiU3ViR2FtZTFDb25zdFwiKVxuSlNfTE9HKFwiZ2FtZTJfcmVxX2xvYmJ5X2pzXzpcIiwgTG9iYnlDb25zdC50ZXN0dilcbkpTX0xPRyhcImdhbWUyX3JlcV9nYW1lMV9qc186XCIsIFN1YkdhbWUxQ29uc3QudGVzdHYpXG5cbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsIFxuICAgIHByb3BlcnRpZXM6IHtcblxuICAgIH0sXG5cbiAgICBpbml0TW9kdWxlKGFyZ3Mpe1xuICAgIFx0SlNfTE9HKFwiaW5pdE1vZHVsZVwiKVxuICAgIFx0bGV0IHsgbG9iYnlSb290IH0gPSBhcmdzXG4gICAgXHR0aGlzLl9sb2JieVJvb3QgPSBsb2JieVJvb3RcbiAgICB9LFxuICAgIG9uQnRuX2Nsb3NlKCl7XG4gICAgXHRKU19MT0coXCJidG5fY2xvc2VcIilcbiAgICBcdHRoaXMuX2xvYmJ5Um9vdC5yZW1vdmVHYW1lXzIoKVxuXG4gICAgfSxcblxufSk7Il19