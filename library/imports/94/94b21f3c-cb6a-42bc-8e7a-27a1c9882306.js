"use strict";
cc._RF.push(module, '94b2188y2pCvI56J6HJiCMG', 'HotUIHelper');
// Script/ModuleMag/HotUIHelper.js

"use strict";

// HotUIHelper  热更新的一些界面提示
var JS_LOG = function JS_LOG() {
  var _cc;

  for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
    arg[_key] = arguments[_key];
  }

  (_cc = cc).log.apply(_cc, ["[HotUIHelper]"].concat(arg));
};

cc.Class({
  "extends": cc.Component,
  properties: {},
  initCom: function initCom() {
    if (this._isInited) {
      return;
    }

    this._isInited = true;
    cc.log("hot_helper_init");
  },
  hideUpdating: function hideUpdating(callback) {
    JS_LOG("hideUpdating");
    callback && callback();
  },
  // 下载进度
  onProgress: function onProgress(curMis, totalMis, finish, total) {
    // this.misNum.string = curMis + "/" + totalMis
    // this.update_proBar.progress = 1.0*finish/total
    JS_LOG("onProgress : curMis_" + curMis + ",totalMis_" + totalMis + ",finish_" + finish + ",total_" + total);
  },
  showUpdating: function showUpdating(curMis, totalMis) {// this.node.active = true  
  },
  showHotAlert: function showHotAlert(isNeedRestart, callback) {
    JS_LOG("showHotAlert");
    callback && callback();
  },
  showAlertClientTooOld: function showAlertClientTooOld() {
    JS_LOG("showAlertClientTooOld");
  },
  onBtn_ClientTooOld: function onBtn_ClientTooOld() {
    JS_LOG("onBtn_ClientTooOld");
    cc.game.end();
  },
  //--------------------------------------------------------->> 解压资源
  unpackageShow: function unpackageShow() {
    JS_LOG("unpackageShow");
  },
  unpackageUpdateProgress: function unpackageUpdateProgress(finish, total) {
    JS_LOG("unpackageUpdateProgress_:", finish, total);
  },
  unpackageFinish: function unpackageFinish() {
    JS_LOG("unpackageFinish");
  },
  //---------------------------------------------------------<< 解压资源
  //--------------------------------------------------------->> 获取新版本号提示
  checkNewVersionShow: function checkNewVersionShow() {
    JS_LOG("checkNewVersionShow");
  },
  checkNewVersionHide: function checkNewVersionHide() {
    JS_LOG("checkNewVersionHide");
  } //---------------------------------------------------------<< 获取新版本号提示

});

cc._RF.pop();