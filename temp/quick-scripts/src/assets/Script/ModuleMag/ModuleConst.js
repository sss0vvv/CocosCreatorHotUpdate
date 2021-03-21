"use strict";
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