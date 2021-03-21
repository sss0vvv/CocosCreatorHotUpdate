
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
  hotUrl: "http://192.168.69.197:8089/dashboard/hotTest/",
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvTW9kdWxlTWFnL01vZHVsZUNvbnN0LmpzIl0sIm5hbWVzIjpbIk1vZHVsZUNvbnN0IiwiaG90VXJsIiwibG9jYWxWZXJzaW9uQ29uZmlnS2V5IiwibG9jYWxDbGllbnRWZXIiLCJyZXFWZXJzaW9uSW1tZWRpYXRlbHkiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUdBO0FBQ0EsSUFBSUEsV0FBVyxHQUFHO0FBQ2RDLEVBQUFBLE1BQU0sRUFBRywrQ0FESztBQUM2QztBQUMzREMsRUFBQUEscUJBQXFCLEVBQUcseUJBRlY7QUFHZEMsRUFBQUEsY0FBYyxFQUFHLHdCQUhIO0FBS2Q7QUFDQTtBQUNBQyxFQUFBQSxxQkFBcUIsRUFBRztBQVBWLENBQWxCO0FBV0FDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQk4sV0FBakIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIlxuXG5cbi8vIGxldCBNb2R1bGVDb25zdCA9IHJlcXVpcmUoXCJNb2R1bGVDb25zdFwiKVxubGV0IE1vZHVsZUNvbnN0ID0ge1xuICAgIGhvdFVybCA6IFwiaHR0cDovLzE5Mi4xNjguNjkuMTk3OjgwODkvZGFzaGJvYXJkL2hvdFRlc3QvXCIgLCAvLyDng63mm7TmlrDlnLDlnYAsIOS7peaWnOadoOe7k+WwvlxuICAgIGxvY2FsVmVyc2lvbkNvbmZpZ0tleSA6IFwiX2xvY2FsX2dhbWVWZXJzaW9uRGF0YTFcIiAsIFxuICAgIGxvY2FsQ2xpZW50VmVyIDogXCJfX3N2X2xvYWNhbF9jbGllbnRfdmVyXCIsXG5cbiAgICAvLyB0cnVlOuavj+asoeiwg+eUqCBob3RVcGRhdGVNdWx0aU1vZHVsZSDpg73lhYjor7fmsYLmnIDmlrDniYjmnKzkv6Hmga8sIFxuICAgIC8vIGZhbHNlOuS9v+eUqOWumuaXtuajgOa1iyhyZXFMb29wVmVyc2lvbkluZm8p55qE57uT5p6c5Yik5pat5piv5ZCm5pyJ5pu05pawXG4gICAgcmVxVmVyc2lvbkltbWVkaWF0ZWx5IDogdHJ1ZSAsIFxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kdWxlQ29uc3QiXX0=