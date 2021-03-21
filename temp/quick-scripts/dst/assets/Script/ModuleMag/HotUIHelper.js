
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/ModuleMag/HotUIHelper.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvTW9kdWxlTWFnL0hvdFVJSGVscGVyLmpzIl0sIm5hbWVzIjpbIkpTX0xPRyIsImFyZyIsImNjIiwibG9nIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiaW5pdENvbSIsIl9pc0luaXRlZCIsImhpZGVVcGRhdGluZyIsImNhbGxiYWNrIiwib25Qcm9ncmVzcyIsImN1ck1pcyIsInRvdGFsTWlzIiwiZmluaXNoIiwidG90YWwiLCJzaG93VXBkYXRpbmciLCJzaG93SG90QWxlcnQiLCJpc05lZWRSZXN0YXJ0Iiwic2hvd0FsZXJ0Q2xpZW50VG9vT2xkIiwib25CdG5fQ2xpZW50VG9vT2xkIiwiZ2FtZSIsImVuZCIsInVucGFja2FnZVNob3ciLCJ1bnBhY2thZ2VVcGRhdGVQcm9ncmVzcyIsInVucGFja2FnZUZpbmlzaCIsImNoZWNrTmV3VmVyc2lvblNob3ciLCJjaGVja05ld1ZlcnNpb25IaWRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUlBO0FBRUEsSUFBSUEsTUFBTSxHQUFHLFNBQVRBLE1BQVMsR0FBZ0I7QUFBQTs7QUFBQSxvQ0FBSkMsR0FBSTtBQUFKQSxJQUFBQSxHQUFJO0FBQUE7O0FBQ3pCLFNBQUFDLEVBQUUsRUFBQ0MsR0FBSCxhQUFPLGVBQVAsU0FBMEJGLEdBQTFCO0FBQ0gsQ0FGRDs7QUFHQUMsRUFBRSxDQUFDRSxLQUFILENBQVM7QUFFTCxhQUFTRixFQUFFLENBQUNHLFNBRlA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFLEVBSFA7QUFPTEMsRUFBQUEsT0FQSyxxQkFPSTtBQUNMLFFBQUcsS0FBS0MsU0FBUixFQUFrQjtBQUFFO0FBQVE7O0FBQzVCLFNBQUtBLFNBQUwsR0FBaUIsSUFBakI7QUFDQU4sSUFBQUEsRUFBRSxDQUFDQyxHQUFILENBQU8saUJBQVA7QUFFSCxHQVpJO0FBY0xNLEVBQUFBLFlBZEssd0JBY1FDLFFBZFIsRUFjaUI7QUFDbEJWLElBQUFBLE1BQU0sQ0FBQyxjQUFELENBQU47QUFDQVUsSUFBQUEsUUFBUSxJQUFJQSxRQUFRLEVBQXBCO0FBRUgsR0FsQkk7QUFvQkw7QUFDQUMsRUFBQUEsVUFyQkssc0JBcUJNQyxNQXJCTixFQXFCY0MsUUFyQmQsRUFxQndCQyxNQXJCeEIsRUFxQmdDQyxLQXJCaEMsRUFxQnNDO0FBQ3ZDO0FBQ0E7QUFDQWYsSUFBQUEsTUFBTSwwQkFBd0JZLE1BQXhCLGtCQUEyQ0MsUUFBM0MsZ0JBQThEQyxNQUE5RCxlQUE4RUMsS0FBOUUsQ0FBTjtBQUNILEdBekJJO0FBMkJMQyxFQUFBQSxZQTNCSyx3QkEyQlFKLE1BM0JSLEVBMkJnQkMsUUEzQmhCLEVBMkJ5QixDQUUxQjtBQUVILEdBL0JJO0FBaUNMSSxFQUFBQSxZQWpDSyx3QkFpQ1FDLGFBakNSLEVBaUN1QlIsUUFqQ3ZCLEVBaUNnQztBQUNqQ1YsSUFBQUEsTUFBTSxDQUFDLGNBQUQsQ0FBTjtBQUNBVSxJQUFBQSxRQUFRLElBQUlBLFFBQVEsRUFBcEI7QUFDSCxHQXBDSTtBQXNDTFMsRUFBQUEscUJBdENLLG1DQXNDa0I7QUFDbkJuQixJQUFBQSxNQUFNLENBQUMsdUJBQUQsQ0FBTjtBQUNILEdBeENJO0FBMENMb0IsRUFBQUEsa0JBMUNLLGdDQTBDZTtBQUNoQnBCLElBQUFBLE1BQU0sQ0FBQyxvQkFBRCxDQUFOO0FBQ0FFLElBQUFBLEVBQUUsQ0FBQ21CLElBQUgsQ0FBUUMsR0FBUjtBQUNILEdBN0NJO0FBZ0RMO0FBQ0FDLEVBQUFBLGFBakRLLDJCQWlEVTtBQUNYdkIsSUFBQUEsTUFBTSxDQUFDLGVBQUQsQ0FBTjtBQUNILEdBbkRJO0FBcURMd0IsRUFBQUEsdUJBckRLLG1DQXFEbUJWLE1BckRuQixFQXFEMkJDLEtBckQzQixFQXFEaUM7QUFDbENmLElBQUFBLE1BQU0sQ0FBQywyQkFBRCxFQUE4QmMsTUFBOUIsRUFBc0NDLEtBQXRDLENBQU47QUFDSCxHQXZESTtBQXdETFUsRUFBQUEsZUF4REssNkJBd0RZO0FBQ2J6QixJQUFBQSxNQUFNLENBQUMsaUJBQUQsQ0FBTjtBQUNILEdBMURJO0FBNERMO0FBRUE7QUFDQTBCLEVBQUFBLG1CQS9ESyxpQ0ErRGdCO0FBQ2pCMUIsSUFBQUEsTUFBTSxDQUFDLHFCQUFELENBQU47QUFDSCxHQWpFSTtBQWtFTDJCLEVBQUFBLG1CQWxFSyxpQ0FrRWdCO0FBQ2pCM0IsSUFBQUEsTUFBTSxDQUFDLHFCQUFELENBQU47QUFDSCxHQXBFSSxDQXFFTDs7QUFyRUssQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiXG5cblxuXG4vLyBIb3RVSUhlbHBlciAg54Ot5pu05paw55qE5LiA5Lqb55WM6Z2i5o+Q56S6XG5cbmxldCBKU19MT0cgPSBmdW5jdGlvbiguLi5hcmcpeyBcbiAgICBjYy5sb2coXCJbSG90VUlIZWxwZXJdXCIsLi4uYXJnKSA7IFxufVxuY2MuQ2xhc3Moe1xuICAgIFxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgICBwcm9wZXJ0aWVzOiB7IFxuXG4gICAgfSxcblxuICAgIGluaXRDb20oKXtcbiAgICAgICAgaWYodGhpcy5faXNJbml0ZWQpeyByZXR1cm4gfVxuICAgICAgICB0aGlzLl9pc0luaXRlZCA9IHRydWUgXG4gICAgICAgIGNjLmxvZyhcImhvdF9oZWxwZXJfaW5pdFwiKSBcblxuICAgIH0sIFxuXG4gICAgaGlkZVVwZGF0aW5nKGNhbGxiYWNrKXtcbiAgICAgICAgSlNfTE9HKFwiaGlkZVVwZGF0aW5nXCIpXG4gICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG5cbiAgICB9LFxuXG4gICAgLy8g5LiL6L296L+b5bqmXG4gICAgb25Qcm9ncmVzcyhjdXJNaXMsIHRvdGFsTWlzLCBmaW5pc2gsIHRvdGFsKXsgXG4gICAgICAgIC8vIHRoaXMubWlzTnVtLnN0cmluZyA9IGN1ck1pcyArIFwiL1wiICsgdG90YWxNaXNcbiAgICAgICAgLy8gdGhpcy51cGRhdGVfcHJvQmFyLnByb2dyZXNzID0gMS4wKmZpbmlzaC90b3RhbFxuICAgICAgICBKU19MT0coYG9uUHJvZ3Jlc3MgOiBjdXJNaXNfJHtjdXJNaXN9LHRvdGFsTWlzXyR7dG90YWxNaXN9LGZpbmlzaF8ke2ZpbmlzaH0sdG90YWxfJHt0b3RhbH1gKVxuICAgIH0sXG5cbiAgICBzaG93VXBkYXRpbmcoY3VyTWlzLCB0b3RhbE1pcyl7XG5cbiAgICAgICAgLy8gdGhpcy5ub2RlLmFjdGl2ZSA9IHRydWUgIFxuXG4gICAgfSwgXG5cbiAgICBzaG93SG90QWxlcnQoaXNOZWVkUmVzdGFydCwgY2FsbGJhY2spe1xuICAgICAgICBKU19MT0coXCJzaG93SG90QWxlcnRcIilcbiAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKTsgXG4gICAgfSwgXG5cbiAgICBzaG93QWxlcnRDbGllbnRUb29PbGQoKXsgXG4gICAgICAgIEpTX0xPRyhcInNob3dBbGVydENsaWVudFRvb09sZFwiKVxuICAgIH0sXG5cbiAgICBvbkJ0bl9DbGllbnRUb29PbGQoKXtcbiAgICAgICAgSlNfTE9HKFwib25CdG5fQ2xpZW50VG9vT2xkXCIpXG4gICAgICAgIGNjLmdhbWUuZW5kKClcbiAgICB9LFxuXG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLT4+IOino+WOi+i1hOa6kFxuICAgIHVucGFja2FnZVNob3coKXtcbiAgICAgICAgSlNfTE9HKFwidW5wYWNrYWdlU2hvd1wiKVxuICAgIH0sXG4gICAgXG4gICAgdW5wYWNrYWdlVXBkYXRlUHJvZ3Jlc3MoZmluaXNoLCB0b3RhbCl7IFxuICAgICAgICBKU19MT0coXCJ1bnBhY2thZ2VVcGRhdGVQcm9ncmVzc186XCIsIGZpbmlzaCwgdG90YWwpXG4gICAgfSxcbiAgICB1bnBhY2thZ2VGaW5pc2goKXtcbiAgICAgICAgSlNfTE9HKFwidW5wYWNrYWdlRmluaXNoXCIpXG4gICAgfSxcblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPDwg6Kej5Y6L6LWE5rqQXG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLT4+IOiOt+WPluaWsOeJiOacrOWPt+aPkOekulxuICAgIGNoZWNrTmV3VmVyc2lvblNob3coKXtcbiAgICAgICAgSlNfTE9HKFwiY2hlY2tOZXdWZXJzaW9uU2hvd1wiKVxuICAgIH0sXG4gICAgY2hlY2tOZXdWZXJzaW9uSGlkZSgpeyBcbiAgICAgICAgSlNfTE9HKFwiY2hlY2tOZXdWZXJzaW9uSGlkZVwiKVxuICAgIH0sIFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPDwg6I635Y+W5paw54mI5pys5Y+35o+Q56S6XG59KTtcblxuIl19