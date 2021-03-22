
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/ModuleMag/ModuleConst.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '49044JecXNDAowkrlJVI34Z', 'ModuleConst');
// Script/ModuleMag/ModuleConst.js

"use strict";

// let ModuleConst = require("ModuleConst")
var ModuleConst = {
  hotUrl: "http://192.168.50.88:8089/dashboard/hotTest/",
  // 热更新地址, 以斜杠结尾
  localVersionConfigKey: "_local_gameVersionData1",
  localClientVer: "__sv_loacal_client_ver",
  // true:每次调用 hotUpdateMultiModule 都先请求最新版本信息, 
  // false:使用定时检测(reqLoopVersionInfo)的结果判断是否有更新
  reqVersionImmediately: true
};
module.exports = ModuleConst;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvTW9kdWxlTWFnL01vZHVsZUNvbnN0LmpzIl0sIm5hbWVzIjpbIk1vZHVsZUNvbnN0IiwiaG90VXJsIiwibG9jYWxWZXJzaW9uQ29uZmlnS2V5IiwibG9jYWxDbGllbnRWZXIiLCJyZXFWZXJzaW9uSW1tZWRpYXRlbHkiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUdBO0FBQ0EsSUFBSUEsV0FBVyxHQUFHO0FBQ2RDLEVBQUFBLE1BQU0sRUFBRyw4Q0FESztBQUM0QztBQUMxREMsRUFBQUEscUJBQXFCLEVBQUcseUJBRlY7QUFHZEMsRUFBQUEsY0FBYyxFQUFHLHdCQUhIO0FBS2Q7QUFDQTtBQUNBQyxFQUFBQSxxQkFBcUIsRUFBRztBQVBWLENBQWxCO0FBV0FDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQk4sV0FBakIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIlxuXG5cbi8vIGxldCBNb2R1bGVDb25zdCA9IHJlcXVpcmUoXCJNb2R1bGVDb25zdFwiKVxubGV0IE1vZHVsZUNvbnN0ID0ge1xuICAgIGhvdFVybCA6IFwiaHR0cDovLzE5Mi4xNjguNTAuODg6ODA4OS9kYXNoYm9hcmQvaG90VGVzdC9cIiAsIC8vIOeDreabtOaWsOWcsOWdgCwg5Lul5pac5p2g57uT5bC+XG4gICAgbG9jYWxWZXJzaW9uQ29uZmlnS2V5IDogXCJfbG9jYWxfZ2FtZVZlcnNpb25EYXRhMVwiICwgXG4gICAgbG9jYWxDbGllbnRWZXIgOiBcIl9fc3ZfbG9hY2FsX2NsaWVudF92ZXJcIixcblxuICAgIC8vIHRydWU65q+P5qyh6LCD55SoIGhvdFVwZGF0ZU11bHRpTW9kdWxlIOmDveWFiOivt+axguacgOaWsOeJiOacrOS/oeaBrywgXG4gICAgLy8gZmFsc2U65L2/55So5a6a5pe25qOA5rWLKHJlcUxvb3BWZXJzaW9uSW5mbynnmoTnu5PmnpzliKTmlq3mmK/lkKbmnInmm7TmlrBcbiAgICByZXFWZXJzaW9uSW1tZWRpYXRlbHkgOiB0cnVlICwgXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBNb2R1bGVDb25zdCJdfQ==