
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/__qc_index__.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}
require('./assets/ABLobby/root/Script/LobbyConst');
require('./assets/ABLobby/root/Script/LobbyRoot');
require('./assets/ABSubGame1/root/Script/SubGame1Const');
require('./assets/ABSubGame1/root/Script/SubGame_1');
require('./assets/ABSubGame2/root/Script/SubGame_2');
require('./assets/Script/AppCom');
require('./assets/Script/AppConst');
require('./assets/Script/HelloWorld');
require('./assets/Script/ModuleMag/HotUIHelper');
require('./assets/Script/ModuleMag/Module');
require('./assets/Script/ModuleMag/ModuleCom');
require('./assets/Script/ModuleMag/ModuleConst');
require('./assets/Script/ModuleMag/ModuleManager');
require('./assets/Script/ModuleMag/UnpackageHelper');

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
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/ModuleMag/ModuleManager.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'b6217/615JErYXwd3FBXEAH', 'ModuleManager');
// Script/ModuleMag/ModuleManager.js

"use strict";

// ModuleManager
var Module = require("Module");

var ModuleConst = require("ModuleConst");

var JS_LOG = function JS_LOG() {
  var _cc;

  for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
    arg[_key] = arguments[_key];
  }

  (_cc = cc).log.apply(_cc, ["[ModuleManager]"].concat(arg));
};

cc.Class({
  "extends": cc.Component,
  properties: {
    // 获取包内路径; 需要分别绑定 resources 和 Texture 下资源文件;
    asset1: {
      "default": null,
      type: cc.Asset
    },
    asset2: {
      "default": null,
      type: cc.Asset
    }
  },
  onLoad: function onLoad() {
    this._ModuleCom = this.getComponent("ModuleCom");
    this._unpackage = this.getComponent("UnpackageHelper");
    this._HotUIHelper = this.getComponent("HotUIHelper"); // jsb.fileUtils.getDefaultResourceRootPath()

    this._nativeRootPath = ""; // native ab根路径 , 以 / 结尾

    if (typeof jsb != "undefined") {
      var absPath1 = jsb.fileUtils.fullPathForFilename(this.asset1.nativeUrl).replace("//", "/");
      var absPath2 = jsb.fileUtils.fullPathForFilename(this.asset2.nativeUrl).replace("//", "/");
      var testLen = absPath1.length > absPath2.length ? absPath2.length : absPath1.length;

      for (var i = 0; i < testLen; i++) {
        if (absPath1[i] != absPath2[i]) {
          this._nativeRootPath = absPath1.substring(0, i);
          break;
        }
      }

      cc.log("default_path_:", jsb.fileUtils.getDefaultResourceRootPath());
      cc.log("absFile_path_2:", this._nativeRootPath);
    }
  },
  initCom: function initCom(args) {
    var useHotUpdate = args.useHotUpdate;

    this._unpackage.initCom(args);

    this._useHotUpdate = useHotUpdate;
    this._lastReq_VersionInfoTime = 0; //(new Date()).getTime()  // 最后一次检测版本时间

    this._detectNewVersionInterval = 30; // 自动检测版本间隔

    this.modules = {};
    this._local_data_key = ModuleConst.localVersionConfigKey; //"_local_gameVersionData1"

    var versionData = cc.sys.localStorage.getItem(this._local_data_key);

    if (!versionData) {
      versionData = this.createDefaultVersionData();
    } else {
      versionData = JSON.parse(versionData);
    }

    this._local_Version = versionData;
    this._romoteVersion = this.createDefaultVersionData();
  },
  execUnpackage: function execUnpackage(onComplate) {
    this._unpackage.execUnpackage(onComplate);
  },
  getNativePath: function getNativePath() {
    return this._nativeRootPath;
  },
  reqLoopVersionInfo: function reqLoopVersionInfo() {
    var _this = this;

    if (this._useHotUpdate) {
      if (this._reqLoopHandler) {
        return;
      }

      this._reqLoopHandler = function () {
        _this.reqVersionInfo();
      };

      this.schedule(this._reqLoopHandler, this._detectNewVersionInterval);
    }
  },
  // 更新AB版本号 , 新包安装解压资源后覆盖版本号
  setLocalAbVersion: function setLocalAbVersion(verObj) {
    var localMap = this._local_Version;

    for (var abName in verObj) {
      var verStr = verObj[abName];

      if (!localMap.modules[abName]) {
        // 运营中新增模块
        localMap.modules[abName] = {};
      }

      localMap.modules[abName].resVersion = verStr;
    }

    cc.sys.localStorage.setItem(this._local_data_key, JSON.stringify(this._local_Version));
  },
  get_LocalVersion: function get_LocalVersion() {
    return this._local_Version;
  },
  get_RomoteVersion: function get_RomoteVersion() {
    return this._romoteVersion;
  },
  createDefaultVersionData: function createDefaultVersionData() {
    var ret = {
      clientMin: "1.0.0",
      modules: {}
    };
    return ret;
  },
  // 更新所有模块
  hotUpdateAllModule: function hotUpdateAllModule(callback, isShowHotDetectAlert) {
    var _this2 = this;

    if (!this._useHotUpdate) {
      callback && callback();
      return false;
    } // 显示正在检测更新提示


    if (isShowHotDetectAlert) {
      this._HotUIHelper.checkNewVersionShow();
    }

    return this.hotUpdateMultiModule(Object.keys(this._romoteVersion.modules), function () {
      _this2._HotUIHelper.checkNewVersionHide();

      callback();
    });
  },
  // 置顶更新模块
  hotUpdateMultiModule: function hotUpdateMultiModule(moduleNameArr, callback) {
    var _this3 = this;

    if (this.isNeedReq_versionInfo()) {
      this.reqVersionInfo(function () {
        _this3._doHotUpdateMulti(moduleNameArr, callback);
      });
    } else {
      this._doHotUpdateMulti(moduleNameArr, callback);
    }
  },
  _doHotUpdateMulti: function _doHotUpdateMulti(moduleNameArr, callback) {
    var _this4 = this;

    if (!this._useHotUpdate) {
      callback && callback();
      return false;
    } // 大版本太旧


    if (-1 == this._ModuleCom.comVersion(_Gloabal.Client_Version, this._romoteVersion.clientMin)) {
      this._HotUIHelper.showAlertClientTooOld();

      return;
    }

    JS_LOG("moduleName_ori:", JSON.stringify(moduleNameArr));
    moduleNameArr = this.getDependModule(moduleNameArr);
    JS_LOG("moduleName_dep:", JSON.stringify(moduleNameArr)); // isShowHotUI 

    var need_Update = false;
    var need_Restart = false; // 所有module更新完成

    var onAllModuleHotFinish = function onAllModuleHotFinish() {
      JS_LOG("hot_update_-AllHot_Finish");
      cc.sys.localStorage.setItem(_this4._local_data_key, JSON.stringify(_this4._local_Version));

      if (need_Restart) {
        // this.scheduleOnce(()=>{ 
        //     // cc.sys.restartVM() 
        //     cc.game.restart();
        // }, 0.1)
        setTimeout(function () {
          cc.game.restart();
        }, 100);
      } else {
        callback && callback();
      }
    }; // 下载 assets bundle 资源


    var needUpdateNames = [];

    var preloadDir = function preloadDir() {
      _this4._ModuleCom.sequenceMis(needUpdateNames, function () {
        JS_LOG("hot_update_-allPreloadFinish"); // 所有任务完成

        _this4._HotUIHelper.hideUpdating(onAllModuleHotFinish);
      }, function (curMis, idx, onExec) {
        // 每个预加载任务
        var curMisIdx = idx + 1;
        var totalMis = needUpdateNames.length;
        var moduleObj = _this4.modules[needUpdateNames[idx]];
        moduleObj.preloadModule(function (finish, total, item) {
          // JS_LOG("hot_update_-onProgress_info_:", curMisIdx, finish, total, item.url )
          _this4._HotUIHelper.onProgress(curMisIdx, totalMis, finish, total);
        }, function (items) {
          JS_LOG("hot_update_-preloadOK_:", needUpdateNames[idx]);
          onExec();
        });
      });
    }; // ------------------------------------------- 顺序下载配置 


    this._ModuleCom.sequenceMis(moduleNameArr, function () {
      // 所有配置下载完成
      if (need_Update) {
        _this4._HotUIHelper.showUpdating(1, needUpdateNames.length);

        _this4._HotUIHelper.showHotAlert(need_Restart, function () {
          preloadDir();
        });
      } else {
        onAllModuleHotFinish();
      }
    }, function (curMis, idx, onExec) {
      // 每个预加载任务
      var moduleName = moduleNameArr[idx];
      var retTemp = {};
      retTemp = _this4._hotUpdateModule(moduleName, function (hot_ret) {
        var haveNewVer = hot_ret.haveNewVer,
            needRestart = hot_ret.needRestart;

        if (haveNewVer) {
          need_Update = true;
          needUpdateNames.push(moduleName);
        }

        if (needRestart) {
          need_Restart = true;
        }

        onExec();
      }); // ------------------------------------------ 
    });
  },
  // 获取依赖模块, 并排序
  getDependModule: function getDependModule(names, h) {
    h = h || 1;
    var rms = this._romoteVersion.modules;
    var ret = {};

    for (var idx in names) {
      var n_1 = names[idx];
      ret[n_1] = {
        name: n_1,
        priority: rms[n_1].priority
      };
      var depends = this.getDependModule(rms[n_1].depend || [], h + 1);

      for (var j in depends) {
        var n_2 = depends[j];
        ret[n_2] = {
          name: n_2,
          priority: rms[n_2].priority
        };
      }
    } //排序, 优先级高的先更新 


    if (h == 1) {
      var minfos = Object.values(ret);
      minfos.sort(function (a, b) {
        if (a.priority > b.priority) {
          return -1;
        }

        return 1;
      });
      ret = {};

      for (var _idx in minfos) {
        ret[minfos[_idx].name] = 1;
      }
    }

    return Object.keys(ret);
  },
  // 更新到最新版本 
  _hotUpdateModule: function _hotUpdateModule(moduleName, callback) {
    var _this5 = this;

    if (!this._useHotUpdate) {
      var _ret = {
        haveNewVer: false,
        needRestart: false
      };
      callback && callback(_ret);
      return _ret;
    }

    var local_Ver = this._local_Version.modules[moduleName].resVersion;
    var romoteVer = this._romoteVersion.modules[moduleName].resVersion;
    var moduleObj = this.modules[moduleName];
    JS_LOG("version_info_data_-local:", JSON.stringify(this._local_Version));
    JS_LOG("version_info_data_-remote:", JSON.stringify(this._romoteVersion));
    var ret = {
      haveNewVer: local_Ver != romoteVer,
      needRestart: false
    };

    var loadVerFunc = function loadVerFunc(mObj, ver, cb) {
      mObj.loadAB(function () {
        if (local_Ver != romoteVer) {
          _this5._local_Version.modules[moduleName].resVersion = romoteVer;
          _this5._local_Version.modules[moduleName].showVer = _this5._romoteVersion.modules[moduleName].showVer;
        }

        cb && cb();
      }, ver);
    };

    if (!moduleObj) {
      // 未加载过, 更新后不需要重启
      moduleObj = new Module();
      loadVerFunc(moduleObj.init(moduleName), romoteVer, function () {
        _this5.modules[moduleName] = moduleObj;
        callback && callback(ret);
      });
    } else {
      // 已加载, 若有更新则更新后重启
      if (local_Ver == romoteVer) {
        callback && callback(ret);
      } else {
        ret.needRestart = true;
        loadVerFunc(moduleObj, romoteVer, function () {
          callback && callback(ret);
        });
      }
    }

    return ret;
  },
  // ------------------------------------------------------------
  getBundle: function getBundle(moduleName) {
    // JS_LOG("ModuleMag_getbundle__:", moduleName)
    return this.modules[moduleName]._abObj;
  },
  getModule: function getModule(moduleName) {
    return this.modules[moduleName];
  },
  addModule: function addModule(moduleName, cb) {
    var _this6 = this;

    var module = this.modules[moduleName];
    JS_LOG("module_mag-addMOdule:", moduleName, module);

    if (module) {
      cb(module);
      return module;
    }

    this.removeModule(moduleName);
    JS_LOG("load_AB____:", moduleName);
    var moduleObj = new Module();
    moduleObj.init(moduleName, this._useHotUpdate).loadAB(function () {
      _this6.modules[moduleName] = moduleObj;
      cb && cb(moduleObj);
    });
  },
  removeModule: function removeModule(moduleName) {
    var moduleObj = this.modules[moduleName];

    if (!moduleObj) {
      return;
    }

    moduleObj.releaseAB();
    delete this.modules[moduleName];
  },
  //------------------------------------------------------------------->> 查询新版本
  isNeedReq_versionInfo: function isNeedReq_versionInfo() {
    if (ModuleConst.reqVersionImmediately) {
      return true;
    }

    var curTime = new Date().getTime();
    JS_LOG("is_need_req_ver_:", curTime, this._lastReq_VersionInfoTime);

    if (curTime - this._lastReq_VersionInfoTime > this._detectNewVersionInterval * 1000) {
      return true;
    }

    return false;
  },
  reqVersionInfo: function reqVersionInfo(_callback) {
    var _this7 = this;

    if (!this._useHotUpdate) {
      _callback && _callback();
      return false;
    }

    if (this._httpReqHandler) {
      this._httpReqHandler.abort();
    }

    var verUrl = ModuleConst.hotUrl + "verconfig.json" + "?renew=" + this._ModuleCom.createUUID();

    JS_LOG("req_version_url_:", verUrl);
    this._httpReqHandler = this._ModuleCom.makeXMLHttp({
      url: verUrl,
      callback: function callback(_args) {
        var httpData = _args.retData;

        if (!httpData) {
          return;
        }

        _this7._httpReqHandler = null;
        _this7._romoteVersion = httpData;
        JS_LOG("onReqVersion_Info_:", JSON.stringify(httpData));
        var localMap = _this7._local_Version;
        var remoteMap = httpData;
        var needSave = false;

        for (var moduleName in remoteMap.modules) {
          if (!localMap.modules[moduleName]) {
            // 运营中新增模块
            localMap.modules[moduleName] = {};
          }

          if (!localMap.modules[moduleName].showVer) {
            needSave = true;
            localMap.modules[moduleName].showVer = remoteMap.modules[moduleName].showVer;
          }
        }

        if (needSave) {
          cc.sys.localStorage.setItem(_this7._local_data_key, JSON.stringify(_this7._local_Version));
        }

        _this7._lastReq_VersionInfoTime = new Date().getTime();
        _callback && _callback();
      }
    });
  } //-------------------------------------------------------------------<< 查询新版本

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvTW9kdWxlTWFnL01vZHVsZU1hbmFnZXIuanMiXSwibmFtZXMiOlsiTW9kdWxlIiwicmVxdWlyZSIsIk1vZHVsZUNvbnN0IiwiSlNfTE9HIiwiYXJnIiwiY2MiLCJsb2ciLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJhc3NldDEiLCJ0eXBlIiwiQXNzZXQiLCJhc3NldDIiLCJvbkxvYWQiLCJfTW9kdWxlQ29tIiwiZ2V0Q29tcG9uZW50IiwiX3VucGFja2FnZSIsIl9Ib3RVSUhlbHBlciIsIl9uYXRpdmVSb290UGF0aCIsImpzYiIsImFic1BhdGgxIiwiZmlsZVV0aWxzIiwiZnVsbFBhdGhGb3JGaWxlbmFtZSIsIm5hdGl2ZVVybCIsInJlcGxhY2UiLCJhYnNQYXRoMiIsInRlc3RMZW4iLCJsZW5ndGgiLCJpIiwic3Vic3RyaW5nIiwiZ2V0RGVmYXVsdFJlc291cmNlUm9vdFBhdGgiLCJpbml0Q29tIiwiYXJncyIsInVzZUhvdFVwZGF0ZSIsIl91c2VIb3RVcGRhdGUiLCJfbGFzdFJlcV9WZXJzaW9uSW5mb1RpbWUiLCJfZGV0ZWN0TmV3VmVyc2lvbkludGVydmFsIiwibW9kdWxlcyIsIl9sb2NhbF9kYXRhX2tleSIsImxvY2FsVmVyc2lvbkNvbmZpZ0tleSIsInZlcnNpb25EYXRhIiwic3lzIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsImNyZWF0ZURlZmF1bHRWZXJzaW9uRGF0YSIsIkpTT04iLCJwYXJzZSIsIl9sb2NhbF9WZXJzaW9uIiwiX3JvbW90ZVZlcnNpb24iLCJleGVjVW5wYWNrYWdlIiwib25Db21wbGF0ZSIsImdldE5hdGl2ZVBhdGgiLCJyZXFMb29wVmVyc2lvbkluZm8iLCJfcmVxTG9vcEhhbmRsZXIiLCJyZXFWZXJzaW9uSW5mbyIsInNjaGVkdWxlIiwic2V0TG9jYWxBYlZlcnNpb24iLCJ2ZXJPYmoiLCJsb2NhbE1hcCIsImFiTmFtZSIsInZlclN0ciIsInJlc1ZlcnNpb24iLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwiZ2V0X0xvY2FsVmVyc2lvbiIsImdldF9Sb21vdGVWZXJzaW9uIiwicmV0IiwiY2xpZW50TWluIiwiaG90VXBkYXRlQWxsTW9kdWxlIiwiY2FsbGJhY2siLCJpc1Nob3dIb3REZXRlY3RBbGVydCIsImNoZWNrTmV3VmVyc2lvblNob3ciLCJob3RVcGRhdGVNdWx0aU1vZHVsZSIsIk9iamVjdCIsImtleXMiLCJjaGVja05ld1ZlcnNpb25IaWRlIiwibW9kdWxlTmFtZUFyciIsImlzTmVlZFJlcV92ZXJzaW9uSW5mbyIsIl9kb0hvdFVwZGF0ZU11bHRpIiwiY29tVmVyc2lvbiIsIl9HbG9hYmFsIiwiQ2xpZW50X1ZlcnNpb24iLCJzaG93QWxlcnRDbGllbnRUb29PbGQiLCJnZXREZXBlbmRNb2R1bGUiLCJuZWVkX1VwZGF0ZSIsIm5lZWRfUmVzdGFydCIsIm9uQWxsTW9kdWxlSG90RmluaXNoIiwic2V0VGltZW91dCIsImdhbWUiLCJyZXN0YXJ0IiwibmVlZFVwZGF0ZU5hbWVzIiwicHJlbG9hZERpciIsInNlcXVlbmNlTWlzIiwiaGlkZVVwZGF0aW5nIiwiY3VyTWlzIiwiaWR4Iiwib25FeGVjIiwiY3VyTWlzSWR4IiwidG90YWxNaXMiLCJtb2R1bGVPYmoiLCJwcmVsb2FkTW9kdWxlIiwiZmluaXNoIiwidG90YWwiLCJpdGVtIiwib25Qcm9ncmVzcyIsIml0ZW1zIiwic2hvd1VwZGF0aW5nIiwic2hvd0hvdEFsZXJ0IiwibW9kdWxlTmFtZSIsInJldFRlbXAiLCJfaG90VXBkYXRlTW9kdWxlIiwiaG90X3JldCIsImhhdmVOZXdWZXIiLCJuZWVkUmVzdGFydCIsInB1c2giLCJuYW1lcyIsImgiLCJybXMiLCJuXzEiLCJuYW1lIiwicHJpb3JpdHkiLCJkZXBlbmRzIiwiZGVwZW5kIiwiaiIsIm5fMiIsIm1pbmZvcyIsInZhbHVlcyIsInNvcnQiLCJhIiwiYiIsImxvY2FsX1ZlciIsInJvbW90ZVZlciIsImxvYWRWZXJGdW5jIiwibU9iaiIsInZlciIsImNiIiwibG9hZEFCIiwic2hvd1ZlciIsImluaXQiLCJnZXRCdW5kbGUiLCJfYWJPYmoiLCJnZXRNb2R1bGUiLCJhZGRNb2R1bGUiLCJtb2R1bGUiLCJyZW1vdmVNb2R1bGUiLCJyZWxlYXNlQUIiLCJyZXFWZXJzaW9uSW1tZWRpYXRlbHkiLCJjdXJUaW1lIiwiRGF0ZSIsImdldFRpbWUiLCJfaHR0cFJlcUhhbmRsZXIiLCJhYm9ydCIsInZlclVybCIsImhvdFVybCIsImNyZWF0ZVVVSUQiLCJtYWtlWE1MSHR0cCIsInVybCIsIl9hcmdzIiwiaHR0cERhdGEiLCJyZXREYXRhIiwicmVtb3RlTWFwIiwibmVlZFNhdmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7QUFDQSxJQUFJQSxNQUFNLEdBQUdDLE9BQU8sQ0FBQyxRQUFELENBQXBCOztBQUNBLElBQUlDLFdBQVcsR0FBR0QsT0FBTyxDQUFDLGFBQUQsQ0FBekI7O0FBRUEsSUFBSUUsTUFBTSxHQUFHLFNBQVRBLE1BQVMsR0FBZ0I7QUFBQTs7QUFBQSxvQ0FBSkMsR0FBSTtBQUFKQSxJQUFBQSxHQUFJO0FBQUE7O0FBQ3pCLFNBQUFDLEVBQUUsRUFBQ0MsR0FBSCxhQUFPLGlCQUFQLFNBQTRCRixHQUE1QjtBQUNILENBRkQ7O0FBSUFDLEVBQUUsQ0FBQ0UsS0FBSCxDQUFTO0FBRUwsYUFBU0YsRUFBRSxDQUFDRyxTQUZQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRTtBQUNSO0FBQ0FDLElBQUFBLE1BQU0sRUFBRTtBQUFFLGlCQUFTLElBQVg7QUFBaUJDLE1BQUFBLElBQUksRUFBRU4sRUFBRSxDQUFDTztBQUExQixLQUZBO0FBR1JDLElBQUFBLE1BQU0sRUFBRTtBQUFFLGlCQUFTLElBQVg7QUFBaUJGLE1BQUFBLElBQUksRUFBRU4sRUFBRSxDQUFDTztBQUExQjtBQUhBLEdBSFA7QUFTTEUsRUFBQUEsTUFUSyxvQkFTRztBQUNKLFNBQUtDLFVBQUwsR0FBc0IsS0FBS0MsWUFBTCxDQUFrQixXQUFsQixDQUF0QjtBQUNBLFNBQUtDLFVBQUwsR0FBc0IsS0FBS0QsWUFBTCxDQUFrQixpQkFBbEIsQ0FBdEI7QUFDQSxTQUFLRSxZQUFMLEdBQXNCLEtBQUtGLFlBQUwsQ0FBa0IsYUFBbEIsQ0FBdEIsQ0FISSxDQUtKOztBQUNBLFNBQUtHLGVBQUwsR0FBdUIsRUFBdkIsQ0FOSSxDQU13Qjs7QUFDNUIsUUFBRyxPQUFPQyxHQUFQLElBQWEsV0FBaEIsRUFBNEI7QUFDeEIsVUFBSUMsUUFBUSxHQUFHRCxHQUFHLENBQUNFLFNBQUosQ0FBY0MsbUJBQWQsQ0FBa0MsS0FBS2IsTUFBTCxDQUFZYyxTQUE5QyxFQUF5REMsT0FBekQsQ0FBaUUsSUFBakUsRUFBc0UsR0FBdEUsQ0FBZjtBQUNBLFVBQUlDLFFBQVEsR0FBR04sR0FBRyxDQUFDRSxTQUFKLENBQWNDLG1CQUFkLENBQWtDLEtBQUtWLE1BQUwsQ0FBWVcsU0FBOUMsRUFBeURDLE9BQXpELENBQWlFLElBQWpFLEVBQXNFLEdBQXRFLENBQWY7QUFDQSxVQUFJRSxPQUFPLEdBQUdOLFFBQVEsQ0FBQ08sTUFBVCxHQUFnQkYsUUFBUSxDQUFDRSxNQUF6QixHQUFpQ0YsUUFBUSxDQUFDRSxNQUExQyxHQUFtRFAsUUFBUSxDQUFDTyxNQUExRTs7QUFDQSxXQUFJLElBQUlDLENBQUMsR0FBQyxDQUFWLEVBQVlBLENBQUMsR0FBQ0YsT0FBZCxFQUFzQkUsQ0FBQyxFQUF2QixFQUEwQjtBQUN0QixZQUFHUixRQUFRLENBQUNRLENBQUQsQ0FBUixJQUFlSCxRQUFRLENBQUNHLENBQUQsQ0FBMUIsRUFBOEI7QUFDMUIsZUFBS1YsZUFBTCxHQUF1QkUsUUFBUSxDQUFDUyxTQUFULENBQW1CLENBQW5CLEVBQXNCRCxDQUF0QixDQUF2QjtBQUNBO0FBQ0g7QUFDSjs7QUFDRHhCLE1BQUFBLEVBQUUsQ0FBQ0MsR0FBSCxDQUFPLGdCQUFQLEVBQXlCYyxHQUFHLENBQUNFLFNBQUosQ0FBY1MsMEJBQWQsRUFBekI7QUFDQTFCLE1BQUFBLEVBQUUsQ0FBQ0MsR0FBSCxDQUFPLGlCQUFQLEVBQTBCLEtBQUthLGVBQS9CO0FBQ0g7QUFDSixHQTdCSTtBQStCTGEsRUFBQUEsT0EvQkssbUJBK0JHQyxJQS9CSCxFQStCUTtBQUFBLFFBQ0hDLFlBREcsR0FDY0QsSUFEZCxDQUNIQyxZQURHOztBQUVULFNBQUtqQixVQUFMLENBQWdCZSxPQUFoQixDQUF3QkMsSUFBeEI7O0FBRUEsU0FBS0UsYUFBTCxHQUFxQkQsWUFBckI7QUFDQSxTQUFLRSx3QkFBTCxHQUFnQyxDQUFoQyxDQUxTLENBS3lCOztBQUNsQyxTQUFLQyx5QkFBTCxHQUFpQyxFQUFqQyxDQU5TLENBTTRCOztBQUVyQyxTQUFLQyxPQUFMLEdBQWUsRUFBZjtBQUVBLFNBQUtDLGVBQUwsR0FBdUJyQyxXQUFXLENBQUNzQyxxQkFBbkMsQ0FWUyxDQVVnRDs7QUFDekQsUUFBSUMsV0FBVyxHQUFHcEMsRUFBRSxDQUFDcUMsR0FBSCxDQUFPQyxZQUFQLENBQW9CQyxPQUFwQixDQUE0QixLQUFLTCxlQUFqQyxDQUFsQjs7QUFDQSxRQUFHLENBQUNFLFdBQUosRUFBZ0I7QUFDWkEsTUFBQUEsV0FBVyxHQUFHLEtBQUtJLHdCQUFMLEVBQWQ7QUFDSCxLQUZELE1BRU07QUFDRkosTUFBQUEsV0FBVyxHQUFHSyxJQUFJLENBQUNDLEtBQUwsQ0FBV04sV0FBWCxDQUFkO0FBQ0g7O0FBQ0QsU0FBS08sY0FBTCxHQUFzQlAsV0FBdEI7QUFFQSxTQUFLUSxjQUFMLEdBQXNCLEtBQUtKLHdCQUFMLEVBQXRCO0FBRUgsR0FwREk7QUFzRExLLEVBQUFBLGFBdERLLHlCQXNEU0MsVUF0RFQsRUFzRG9CO0FBQ3JCLFNBQUtsQyxVQUFMLENBQWdCaUMsYUFBaEIsQ0FBOEJDLFVBQTlCO0FBQ0gsR0F4REk7QUEwRExDLEVBQUFBLGFBMURLLDJCQTBEVTtBQUNYLFdBQU8sS0FBS2pDLGVBQVo7QUFDSCxHQTVESTtBQTZETGtDLEVBQUFBLGtCQTdESyxnQ0E2RGU7QUFBQTs7QUFDaEIsUUFBRyxLQUFLbEIsYUFBUixFQUFzQjtBQUNsQixVQUFHLEtBQUttQixlQUFSLEVBQXdCO0FBQUU7QUFBUTs7QUFDbEMsV0FBS0EsZUFBTCxHQUF1QixZQUFJO0FBQ3ZCLFFBQUEsS0FBSSxDQUFDQyxjQUFMO0FBQ0gsT0FGRDs7QUFHQSxXQUFLQyxRQUFMLENBQWMsS0FBS0YsZUFBbkIsRUFBb0MsS0FBS2pCLHlCQUF6QztBQUNIO0FBQ0osR0FyRUk7QUF1RUw7QUFDQW9CLEVBQUFBLGlCQXhFSyw2QkF3RWFDLE1BeEViLEVBd0VvQjtBQUVyQixRQUFJQyxRQUFRLEdBQUcsS0FBS1gsY0FBcEI7O0FBQ0EsU0FBSSxJQUFJWSxNQUFSLElBQWtCRixNQUFsQixFQUF5QjtBQUNyQixVQUFJRyxNQUFNLEdBQUdILE1BQU0sQ0FBQ0UsTUFBRCxDQUFuQjs7QUFFQSxVQUFHLENBQUNELFFBQVEsQ0FBQ3JCLE9BQVQsQ0FBaUJzQixNQUFqQixDQUFKLEVBQTZCO0FBQUk7QUFDN0JELFFBQUFBLFFBQVEsQ0FBQ3JCLE9BQVQsQ0FBaUJzQixNQUFqQixJQUEyQixFQUEzQjtBQUNIOztBQUNERCxNQUFBQSxRQUFRLENBQUNyQixPQUFULENBQWlCc0IsTUFBakIsRUFBeUJFLFVBQXpCLEdBQXNDRCxNQUF0QztBQUNIOztBQUVEeEQsSUFBQUEsRUFBRSxDQUFDcUMsR0FBSCxDQUFPQyxZQUFQLENBQW9Cb0IsT0FBcEIsQ0FBNEIsS0FBS3hCLGVBQWpDLEVBQWtETyxJQUFJLENBQUNrQixTQUFMLENBQWUsS0FBS2hCLGNBQXBCLENBQWxEO0FBQ0gsR0FyRkk7QUF1RkxpQixFQUFBQSxnQkF2RkssOEJBdUZhO0FBQ2QsV0FBTyxLQUFLakIsY0FBWjtBQUNILEdBekZJO0FBMkZMa0IsRUFBQUEsaUJBM0ZLLCtCQTJGYztBQUNmLFdBQU8sS0FBS2pCLGNBQVo7QUFDSCxHQTdGSTtBQStGTEosRUFBQUEsd0JBL0ZLLHNDQStGcUI7QUFDdEIsUUFBSXNCLEdBQUcsR0FBRztBQUNOQyxNQUFBQSxTQUFTLEVBQUcsT0FETjtBQUVOOUIsTUFBQUEsT0FBTyxFQUFHO0FBRkosS0FBVjtBQUlBLFdBQU82QixHQUFQO0FBQ0gsR0FyR0k7QUF1R0w7QUFDQUUsRUFBQUEsa0JBeEdLLDhCQXdHY0MsUUF4R2QsRUF3R3dCQyxvQkF4R3hCLEVBd0c2QztBQUFBOztBQUM5QyxRQUFHLENBQUMsS0FBS3BDLGFBQVQsRUFBdUI7QUFDbkJtQyxNQUFBQSxRQUFRLElBQUlBLFFBQVEsRUFBcEI7QUFDQSxhQUFPLEtBQVA7QUFDSCxLQUo2QyxDQU05Qzs7O0FBQ0EsUUFBR0Msb0JBQUgsRUFBd0I7QUFDcEIsV0FBS3JELFlBQUwsQ0FBa0JzRCxtQkFBbEI7QUFDSDs7QUFFRCxXQUFPLEtBQUtDLG9CQUFMLENBQTBCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxLQUFLMUIsY0FBTCxDQUFvQlgsT0FBaEMsQ0FBMUIsRUFBb0UsWUFBSTtBQUMzRSxNQUFBLE1BQUksQ0FBQ3BCLFlBQUwsQ0FBa0IwRCxtQkFBbEI7O0FBQ0FOLE1BQUFBLFFBQVE7QUFDWCxLQUhNLENBQVA7QUFLSCxHQXhISTtBQTBITDtBQUNBRyxFQUFBQSxvQkEzSEssZ0NBMkhnQkksYUEzSGhCLEVBMkgrQlAsUUEzSC9CLEVBMkh3QztBQUFBOztBQUN6QyxRQUFHLEtBQUtRLHFCQUFMLEVBQUgsRUFBZ0M7QUFDNUIsV0FBS3ZCLGNBQUwsQ0FBb0IsWUFBSTtBQUNwQixRQUFBLE1BQUksQ0FBQ3dCLGlCQUFMLENBQXVCRixhQUF2QixFQUFzQ1AsUUFBdEM7QUFDSCxPQUZEO0FBR0gsS0FKRCxNQUlNO0FBQ0YsV0FBS1MsaUJBQUwsQ0FBdUJGLGFBQXZCLEVBQXNDUCxRQUF0QztBQUNIO0FBQ0osR0FuSUk7QUFvSUxTLEVBQUFBLGlCQXBJSyw2QkFvSWFGLGFBcEliLEVBb0k0QlAsUUFwSTVCLEVBb0lxQztBQUFBOztBQUN0QyxRQUFHLENBQUMsS0FBS25DLGFBQVQsRUFBdUI7QUFDbkJtQyxNQUFBQSxRQUFRLElBQUlBLFFBQVEsRUFBcEI7QUFDQSxhQUFPLEtBQVA7QUFDSCxLQUpxQyxDQU10Qzs7O0FBQ0EsUUFBRyxDQUFDLENBQUQsSUFBTSxLQUFLdkQsVUFBTCxDQUFnQmlFLFVBQWhCLENBQTJCQyxRQUFRLENBQUNDLGNBQXBDLEVBQW9ELEtBQUtqQyxjQUFMLENBQW9CbUIsU0FBeEUsQ0FBVCxFQUE2RjtBQUN6RixXQUFLbEQsWUFBTCxDQUFrQmlFLHFCQUFsQjs7QUFDQTtBQUNIOztBQUNEaEYsSUFBQUEsTUFBTSxDQUFDLGlCQUFELEVBQW9CMkMsSUFBSSxDQUFDa0IsU0FBTCxDQUFlYSxhQUFmLENBQXBCLENBQU47QUFDQUEsSUFBQUEsYUFBYSxHQUFHLEtBQUtPLGVBQUwsQ0FBcUJQLGFBQXJCLENBQWhCO0FBQ0ExRSxJQUFBQSxNQUFNLENBQUMsaUJBQUQsRUFBb0IyQyxJQUFJLENBQUNrQixTQUFMLENBQWVhLGFBQWYsQ0FBcEIsQ0FBTixDQWJzQyxDQWV0Qzs7QUFDQSxRQUFJUSxXQUFXLEdBQUksS0FBbkI7QUFDQSxRQUFJQyxZQUFZLEdBQUcsS0FBbkIsQ0FqQnNDLENBbUJ0Qzs7QUFDQSxRQUFJQyxvQkFBb0IsR0FBRyxTQUF2QkEsb0JBQXVCLEdBQUk7QUFDM0JwRixNQUFBQSxNQUFNLENBQUMsMkJBQUQsQ0FBTjtBQUNBRSxNQUFBQSxFQUFFLENBQUNxQyxHQUFILENBQU9DLFlBQVAsQ0FBb0JvQixPQUFwQixDQUE0QixNQUFJLENBQUN4QixlQUFqQyxFQUFrRE8sSUFBSSxDQUFDa0IsU0FBTCxDQUFlLE1BQUksQ0FBQ2hCLGNBQXBCLENBQWxEOztBQUNBLFVBQUdzQyxZQUFILEVBQWdCO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQUUsUUFBQUEsVUFBVSxDQUFDLFlBQU07QUFDYm5GLFVBQUFBLEVBQUUsQ0FBQ29GLElBQUgsQ0FBUUMsT0FBUjtBQUNILFNBRlMsRUFFUCxHQUZPLENBQVY7QUFHSCxPQVJELE1BUU07QUFDRnBCLFFBQUFBLFFBQVEsSUFBSUEsUUFBUSxFQUFwQjtBQUNIO0FBQ0osS0FkRCxDQXBCc0MsQ0FvQ3RDOzs7QUFDQSxRQUFJcUIsZUFBZSxHQUFHLEVBQXRCOztBQUNBLFFBQUlDLFVBQVUsR0FBRyxTQUFiQSxVQUFhLEdBQUk7QUFDakIsTUFBQSxNQUFJLENBQUM3RSxVQUFMLENBQWdCOEUsV0FBaEIsQ0FBNEJGLGVBQTVCLEVBQTZDLFlBQUk7QUFDN0N4RixRQUFBQSxNQUFNLENBQUMsOEJBQUQsQ0FBTixDQUQ2QyxDQUU3Qzs7QUFDQSxRQUFBLE1BQUksQ0FBQ2UsWUFBTCxDQUFrQjRFLFlBQWxCLENBQStCUCxvQkFBL0I7QUFFSCxPQUxELEVBS0csVUFBQ1EsTUFBRCxFQUFTQyxHQUFULEVBQWNDLE1BQWQsRUFBdUI7QUFDdEI7QUFDQSxZQUFJQyxTQUFTLEdBQUdGLEdBQUcsR0FBQyxDQUFwQjtBQUNBLFlBQUlHLFFBQVEsR0FBR1IsZUFBZSxDQUFDL0QsTUFBL0I7QUFDQSxZQUFJd0UsU0FBUyxHQUFHLE1BQUksQ0FBQzlELE9BQUwsQ0FBYXFELGVBQWUsQ0FBQ0ssR0FBRCxDQUE1QixDQUFoQjtBQUNBSSxRQUFBQSxTQUFTLENBQUNDLGFBQVYsQ0FBd0IsVUFBQ0MsTUFBRCxFQUFTQyxLQUFULEVBQWdCQyxJQUFoQixFQUF1QjtBQUUzQztBQUNBLFVBQUEsTUFBSSxDQUFDdEYsWUFBTCxDQUFrQnVGLFVBQWxCLENBQThCUCxTQUE5QixFQUF5Q0MsUUFBekMsRUFBbURHLE1BQW5ELEVBQTJEQyxLQUEzRDtBQUNILFNBSkQsRUFJRyxVQUFDRyxLQUFELEVBQVM7QUFFUnZHLFVBQUFBLE1BQU0sQ0FBQyx5QkFBRCxFQUE0QndGLGVBQWUsQ0FBQ0ssR0FBRCxDQUEzQyxDQUFOO0FBQ0FDLFVBQUFBLE1BQU07QUFDVCxTQVJEO0FBU0gsT0FuQkQ7QUFvQkgsS0FyQkQsQ0F0Q3NDLENBOER0Qzs7O0FBQ0EsU0FBS2xGLFVBQUwsQ0FBZ0I4RSxXQUFoQixDQUE0QmhCLGFBQTVCLEVBQTJDLFlBQUk7QUFDM0M7QUFDQSxVQUFHUSxXQUFILEVBQWU7QUFDWCxRQUFBLE1BQUksQ0FBQ25FLFlBQUwsQ0FBa0J5RixZQUFsQixDQUErQixDQUEvQixFQUFrQ2hCLGVBQWUsQ0FBQy9ELE1BQWxEOztBQUNBLFFBQUEsTUFBSSxDQUFDVixZQUFMLENBQWtCMEYsWUFBbEIsQ0FBK0J0QixZQUEvQixFQUE2QyxZQUFJO0FBQzdDTSxVQUFBQSxVQUFVO0FBQ2IsU0FGRDtBQUdILE9BTEQsTUFLTTtBQUNGTCxRQUFBQSxvQkFBb0I7QUFDdkI7QUFFSixLQVhELEVBV0csVUFBQ1EsTUFBRCxFQUFTQyxHQUFULEVBQWNDLE1BQWQsRUFBdUI7QUFDdEI7QUFDQSxVQUFJWSxVQUFVLEdBQUdoQyxhQUFhLENBQUNtQixHQUFELENBQTlCO0FBQ0EsVUFBSWMsT0FBTyxHQUFHLEVBQWQ7QUFDQUEsTUFBQUEsT0FBTyxHQUFHLE1BQUksQ0FBQ0MsZ0JBQUwsQ0FBc0JGLFVBQXRCLEVBQWtDLFVBQUNHLE9BQUQsRUFBVztBQUFBLFlBQzlDQyxVQUQ4QyxHQUNuQkQsT0FEbUIsQ0FDOUNDLFVBRDhDO0FBQUEsWUFDbENDLFdBRGtDLEdBQ25CRixPQURtQixDQUNsQ0UsV0FEa0M7O0FBRW5ELFlBQUdELFVBQUgsRUFBZTtBQUNYNUIsVUFBQUEsV0FBVyxHQUFHLElBQWQ7QUFDQU0sVUFBQUEsZUFBZSxDQUFDd0IsSUFBaEIsQ0FBcUJOLFVBQXJCO0FBQ0g7O0FBQ0QsWUFBR0ssV0FBSCxFQUFnQjtBQUFFNUIsVUFBQUEsWUFBWSxHQUFHLElBQWY7QUFBcUI7O0FBQ3ZDVyxRQUFBQSxNQUFNO0FBQ1QsT0FSUyxDQUFWLENBSnNCLENBYXRCO0FBQ0gsS0F6QkQ7QUEyQkgsR0E5Tkk7QUFnT0w7QUFDQWIsRUFBQUEsZUFqT0ssMkJBaU9XZ0MsS0FqT1gsRUFpT2tCQyxDQWpPbEIsRUFpT29CO0FBQ3JCQSxJQUFBQSxDQUFDLEdBQUdBLENBQUMsSUFBSSxDQUFUO0FBQ0EsUUFBSUMsR0FBRyxHQUFHLEtBQUtyRSxjQUFMLENBQW9CWCxPQUE5QjtBQUNBLFFBQUk2QixHQUFHLEdBQUcsRUFBVjs7QUFDQSxTQUFJLElBQUk2QixHQUFSLElBQWVvQixLQUFmLEVBQXFCO0FBQ2pCLFVBQUlHLEdBQUcsR0FBR0gsS0FBSyxDQUFDcEIsR0FBRCxDQUFmO0FBQ0E3QixNQUFBQSxHQUFHLENBQUNvRCxHQUFELENBQUgsR0FBVztBQUFFQyxRQUFBQSxJQUFJLEVBQUNELEdBQVA7QUFBWUUsUUFBQUEsUUFBUSxFQUFDSCxHQUFHLENBQUNDLEdBQUQsQ0FBSCxDQUFTRTtBQUE5QixPQUFYO0FBRUEsVUFBSUMsT0FBTyxHQUFHLEtBQUt0QyxlQUFMLENBQXFCa0MsR0FBRyxDQUFDQyxHQUFELENBQUgsQ0FBU0ksTUFBVCxJQUFtQixFQUF4QyxFQUE0Q04sQ0FBQyxHQUFDLENBQTlDLENBQWQ7O0FBQ0EsV0FBSSxJQUFJTyxDQUFSLElBQWFGLE9BQWIsRUFBcUI7QUFDakIsWUFBSUcsR0FBRyxHQUFHSCxPQUFPLENBQUNFLENBQUQsQ0FBakI7QUFDQXpELFFBQUFBLEdBQUcsQ0FBQzBELEdBQUQsQ0FBSCxHQUFXO0FBQUVMLFVBQUFBLElBQUksRUFBQ0ssR0FBUDtBQUFZSixVQUFBQSxRQUFRLEVBQUNILEdBQUcsQ0FBQ08sR0FBRCxDQUFILENBQVNKO0FBQTlCLFNBQVg7QUFDSDtBQUNKLEtBYm9CLENBY3JCOzs7QUFDQSxRQUFHSixDQUFDLElBQUUsQ0FBTixFQUFRO0FBQ0osVUFBSVMsTUFBTSxHQUFHcEQsTUFBTSxDQUFDcUQsTUFBUCxDQUFjNUQsR0FBZCxDQUFiO0FBQ0EyRCxNQUFBQSxNQUFNLENBQUNFLElBQVAsQ0FBWSxVQUFTQyxDQUFULEVBQVdDLENBQVgsRUFBYTtBQUNyQixZQUFHRCxDQUFDLENBQUNSLFFBQUYsR0FBYVMsQ0FBQyxDQUFDVCxRQUFsQixFQUEyQjtBQUFFLGlCQUFPLENBQUMsQ0FBUjtBQUFVOztBQUN2QyxlQUFPLENBQVA7QUFDSCxPQUhEO0FBSUF0RCxNQUFBQSxHQUFHLEdBQUcsRUFBTjs7QUFDQSxXQUFJLElBQUk2QixJQUFSLElBQWdCOEIsTUFBaEIsRUFBdUI7QUFDbkIzRCxRQUFBQSxHQUFHLENBQUMyRCxNQUFNLENBQUM5QixJQUFELENBQU4sQ0FBWXdCLElBQWIsQ0FBSCxHQUF3QixDQUF4QjtBQUNIO0FBQ0o7O0FBRUQsV0FBTzlDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZUixHQUFaLENBQVA7QUFDSCxHQTdQSTtBQStQTDtBQUNBNEMsRUFBQUEsZ0JBaFFLLDRCQWdRWUYsVUFoUVosRUFnUXdCdkMsUUFoUXhCLEVBZ1FpQztBQUFBOztBQUNsQyxRQUFHLENBQUMsS0FBS25DLGFBQVQsRUFBdUI7QUFDbkIsVUFBSWdDLElBQUcsR0FBRztBQUFFOEMsUUFBQUEsVUFBVSxFQUFDLEtBQWI7QUFBb0JDLFFBQUFBLFdBQVcsRUFBQztBQUFoQyxPQUFWO0FBQ0E1QyxNQUFBQSxRQUFRLElBQUlBLFFBQVEsQ0FBQ0gsSUFBRCxDQUFwQjtBQUNBLGFBQU9BLElBQVA7QUFDSDs7QUFFRCxRQUFJZ0UsU0FBUyxHQUFHLEtBQUtuRixjQUFMLENBQW9CVixPQUFwQixDQUE0QnVFLFVBQTVCLEVBQXdDL0MsVUFBeEQ7QUFDQSxRQUFJc0UsU0FBUyxHQUFHLEtBQUtuRixjQUFMLENBQW9CWCxPQUFwQixDQUE0QnVFLFVBQTVCLEVBQXdDL0MsVUFBeEQ7QUFDQSxRQUFJc0MsU0FBUyxHQUFHLEtBQUs5RCxPQUFMLENBQWF1RSxVQUFiLENBQWhCO0FBRUExRyxJQUFBQSxNQUFNLENBQUMsMkJBQUQsRUFBOEIyQyxJQUFJLENBQUNrQixTQUFMLENBQWUsS0FBS2hCLGNBQXBCLENBQTlCLENBQU47QUFDQTdDLElBQUFBLE1BQU0sQ0FBQyw0QkFBRCxFQUErQjJDLElBQUksQ0FBQ2tCLFNBQUwsQ0FBZSxLQUFLZixjQUFwQixDQUEvQixDQUFOO0FBRUEsUUFBSWtCLEdBQUcsR0FBRztBQUFFOEMsTUFBQUEsVUFBVSxFQUFHa0IsU0FBUyxJQUFJQyxTQUE1QjtBQUF3Q2xCLE1BQUFBLFdBQVcsRUFBQztBQUFwRCxLQUFWOztBQUVBLFFBQUltQixXQUFXLEdBQUcsU0FBZEEsV0FBYyxDQUFDQyxJQUFELEVBQU9DLEdBQVAsRUFBWUMsRUFBWixFQUFpQjtBQUMvQkYsTUFBQUEsSUFBSSxDQUFDRyxNQUFMLENBQVksWUFBSTtBQUNaLFlBQUdOLFNBQVMsSUFBSUMsU0FBaEIsRUFBMEI7QUFDdEIsVUFBQSxNQUFJLENBQUNwRixjQUFMLENBQW9CVixPQUFwQixDQUE0QnVFLFVBQTVCLEVBQXdDL0MsVUFBeEMsR0FBcURzRSxTQUFyRDtBQUNBLFVBQUEsTUFBSSxDQUFDcEYsY0FBTCxDQUFvQlYsT0FBcEIsQ0FBNEJ1RSxVQUE1QixFQUF3QzZCLE9BQXhDLEdBQWtELE1BQUksQ0FBQ3pGLGNBQUwsQ0FBb0JYLE9BQXBCLENBQTRCdUUsVUFBNUIsRUFBd0M2QixPQUExRjtBQUVIOztBQUNERixRQUFBQSxFQUFFLElBQUlBLEVBQUUsRUFBUjtBQUNILE9BUEQsRUFPR0QsR0FQSDtBQVFILEtBVEQ7O0FBV0EsUUFBRyxDQUFDbkMsU0FBSixFQUFjO0FBQ1Y7QUFDQUEsTUFBQUEsU0FBUyxHQUFHLElBQUlwRyxNQUFKLEVBQVo7QUFDQXFJLE1BQUFBLFdBQVcsQ0FBRWpDLFNBQVMsQ0FBQ3VDLElBQVYsQ0FBZTlCLFVBQWYsQ0FBRixFQUE4QnVCLFNBQTlCLEVBQXlDLFlBQUk7QUFDcEQsUUFBQSxNQUFJLENBQUM5RixPQUFMLENBQWF1RSxVQUFiLElBQTJCVCxTQUEzQjtBQUNBOUIsUUFBQUEsUUFBUSxJQUFJQSxRQUFRLENBQUNILEdBQUQsQ0FBcEI7QUFDSCxPQUhVLENBQVg7QUFLSCxLQVJELE1BUU07QUFDRjtBQUNBLFVBQUdnRSxTQUFTLElBQUlDLFNBQWhCLEVBQTBCO0FBQ3RCOUQsUUFBQUEsUUFBUSxJQUFJQSxRQUFRLENBQUNILEdBQUQsQ0FBcEI7QUFDSCxPQUZELE1BRU07QUFDRkEsUUFBQUEsR0FBRyxDQUFDK0MsV0FBSixHQUFrQixJQUFsQjtBQUNBbUIsUUFBQUEsV0FBVyxDQUFDakMsU0FBRCxFQUFZZ0MsU0FBWixFQUF1QixZQUFJO0FBQ2xDOUQsVUFBQUEsUUFBUSxJQUFJQSxRQUFRLENBQUNILEdBQUQsQ0FBcEI7QUFDSCxTQUZVLENBQVg7QUFHSDtBQUNKOztBQUNELFdBQU9BLEdBQVA7QUFFSCxHQWhUSTtBQWlUTDtBQUNBeUUsRUFBQUEsU0FsVEsscUJBa1RLL0IsVUFsVEwsRUFrVGdCO0FBQ2pCO0FBQ0EsV0FBTyxLQUFLdkUsT0FBTCxDQUFhdUUsVUFBYixFQUF5QmdDLE1BQWhDO0FBQ0gsR0FyVEk7QUF1VExDLEVBQUFBLFNBdlRLLHFCQXVUS2pDLFVBdlRMLEVBdVRnQjtBQUNqQixXQUFPLEtBQUt2RSxPQUFMLENBQWF1RSxVQUFiLENBQVA7QUFDSCxHQXpUSTtBQTJUTGtDLEVBQUFBLFNBM1RLLHFCQTJUS2xDLFVBM1RMLEVBMlRpQjJCLEVBM1RqQixFQTJUb0I7QUFBQTs7QUFDckIsUUFBSVEsTUFBTSxHQUFHLEtBQUsxRyxPQUFMLENBQWF1RSxVQUFiLENBQWI7QUFDQTFHLElBQUFBLE1BQU0sQ0FBQyx1QkFBRCxFQUEwQjBHLFVBQTFCLEVBQXNDbUMsTUFBdEMsQ0FBTjs7QUFDQSxRQUFHQSxNQUFILEVBQVU7QUFDTlIsTUFBQUEsRUFBRSxDQUFDUSxNQUFELENBQUY7QUFDQSxhQUFPQSxNQUFQO0FBQ0g7O0FBQ0QsU0FBS0MsWUFBTCxDQUFrQnBDLFVBQWxCO0FBRUExRyxJQUFBQSxNQUFNLENBQUMsY0FBRCxFQUFpQjBHLFVBQWpCLENBQU47QUFFQSxRQUFJVCxTQUFTLEdBQUcsSUFBSXBHLE1BQUosRUFBaEI7QUFDQW9HLElBQUFBLFNBQVMsQ0FBQ3VDLElBQVYsQ0FBZTlCLFVBQWYsRUFBMkIsS0FBSzFFLGFBQWhDLEVBQStDc0csTUFBL0MsQ0FBc0QsWUFBSTtBQUN0RCxNQUFBLE1BQUksQ0FBQ25HLE9BQUwsQ0FBYXVFLFVBQWIsSUFBMkJULFNBQTNCO0FBQ0FvQyxNQUFBQSxFQUFFLElBQUlBLEVBQUUsQ0FBQ3BDLFNBQUQsQ0FBUjtBQUNILEtBSEQ7QUFLSCxHQTVVSTtBQThVTDZDLEVBQUFBLFlBOVVLLHdCQThVUXBDLFVBOVVSLEVBOFVtQjtBQUNwQixRQUFJVCxTQUFTLEdBQUcsS0FBSzlELE9BQUwsQ0FBYXVFLFVBQWIsQ0FBaEI7O0FBQ0EsUUFBRyxDQUFDVCxTQUFKLEVBQWM7QUFBRTtBQUFROztBQUN4QkEsSUFBQUEsU0FBUyxDQUFDOEMsU0FBVjtBQUNBLFdBQU8sS0FBSzVHLE9BQUwsQ0FBYXVFLFVBQWIsQ0FBUDtBQUNILEdBblZJO0FBcVZMO0FBQ0EvQixFQUFBQSxxQkF0VkssbUNBc1ZrQjtBQUNuQixRQUFHNUUsV0FBVyxDQUFDaUoscUJBQWYsRUFBcUM7QUFDakMsYUFBTyxJQUFQO0FBQ0g7O0FBRUQsUUFBSUMsT0FBTyxHQUFJLElBQUlDLElBQUosRUFBRCxDQUFhQyxPQUFiLEVBQWQ7QUFDQW5KLElBQUFBLE1BQU0sQ0FBQyxtQkFBRCxFQUFzQmlKLE9BQXRCLEVBQWdDLEtBQUtoSCx3QkFBckMsQ0FBTjs7QUFDQSxRQUFHZ0gsT0FBTyxHQUFHLEtBQUtoSCx3QkFBZixHQUEwQyxLQUFLQyx5QkFBTCxHQUErQixJQUE1RSxFQUFpRjtBQUM3RSxhQUFPLElBQVA7QUFDSDs7QUFDRCxXQUFPLEtBQVA7QUFDSCxHQWpXSTtBQW1XTGtCLEVBQUFBLGNBbldLLDBCQW1XVWUsU0FuV1YsRUFtV21CO0FBQUE7O0FBQ3BCLFFBQUcsQ0FBQyxLQUFLbkMsYUFBVCxFQUF1QjtBQUNuQm1DLE1BQUFBLFNBQVEsSUFBSUEsU0FBUSxFQUFwQjtBQUNBLGFBQU8sS0FBUDtBQUNIOztBQUNELFFBQUcsS0FBS2lGLGVBQVIsRUFBd0I7QUFDcEIsV0FBS0EsZUFBTCxDQUFxQkMsS0FBckI7QUFDSDs7QUFDRCxRQUFJQyxNQUFNLEdBQUd2SixXQUFXLENBQUN3SixNQUFaLEdBQXFCLGdCQUFyQixHQUF3QyxTQUF4QyxHQUFvRCxLQUFLM0ksVUFBTCxDQUFnQjRJLFVBQWhCLEVBQWpFOztBQUNBeEosSUFBQUEsTUFBTSxDQUFDLG1CQUFELEVBQXNCc0osTUFBdEIsQ0FBTjtBQUVBLFNBQUtGLGVBQUwsR0FBdUIsS0FBS3hJLFVBQUwsQ0FBZ0I2SSxXQUFoQixDQUE0QjtBQUFDQyxNQUFBQSxHQUFHLEVBQUVKLE1BQU47QUFBY25GLE1BQUFBLFFBQVEsRUFBQyxrQkFBQ3dGLEtBQUQsRUFBUztBQUUvRSxZQUFJQyxRQUFRLEdBQUdELEtBQUssQ0FBQ0UsT0FBckI7O0FBQ0EsWUFBRyxDQUFDRCxRQUFKLEVBQWE7QUFDVDtBQUNIOztBQUNELFFBQUEsTUFBSSxDQUFDUixlQUFMLEdBQXVCLElBQXZCO0FBQ0EsUUFBQSxNQUFJLENBQUN0RyxjQUFMLEdBQXNCOEcsUUFBdEI7QUFFQTVKLFFBQUFBLE1BQU0sQ0FBQyxxQkFBRCxFQUF3QjJDLElBQUksQ0FBQ2tCLFNBQUwsQ0FBZStGLFFBQWYsQ0FBeEIsQ0FBTjtBQUNBLFlBQUlwRyxRQUFRLEdBQUcsTUFBSSxDQUFDWCxjQUFwQjtBQUNBLFlBQUlpSCxTQUFTLEdBQUdGLFFBQWhCO0FBQ0EsWUFBSUcsUUFBUSxHQUFHLEtBQWY7O0FBRUEsYUFBSSxJQUFJckQsVUFBUixJQUFzQm9ELFNBQVMsQ0FBQzNILE9BQWhDLEVBQXdDO0FBRXBDLGNBQUcsQ0FBQ3FCLFFBQVEsQ0FBQ3JCLE9BQVQsQ0FBaUJ1RSxVQUFqQixDQUFKLEVBQWlDO0FBQUk7QUFDakNsRCxZQUFBQSxRQUFRLENBQUNyQixPQUFULENBQWlCdUUsVUFBakIsSUFBK0IsRUFBL0I7QUFDSDs7QUFDRCxjQUFHLENBQUNsRCxRQUFRLENBQUNyQixPQUFULENBQWlCdUUsVUFBakIsRUFBNkI2QixPQUFqQyxFQUF5QztBQUNyQ3dCLFlBQUFBLFFBQVEsR0FBRyxJQUFYO0FBQ0F2RyxZQUFBQSxRQUFRLENBQUNyQixPQUFULENBQWlCdUUsVUFBakIsRUFBNkI2QixPQUE3QixHQUF3Q3VCLFNBQVMsQ0FBQzNILE9BQVYsQ0FBa0J1RSxVQUFsQixFQUE4QjZCLE9BQXRFO0FBQ0g7QUFDSjs7QUFFRCxZQUFHd0IsUUFBSCxFQUFZO0FBQ1I3SixVQUFBQSxFQUFFLENBQUNxQyxHQUFILENBQU9DLFlBQVAsQ0FBb0JvQixPQUFwQixDQUE0QixNQUFJLENBQUN4QixlQUFqQyxFQUFrRE8sSUFBSSxDQUFDa0IsU0FBTCxDQUFlLE1BQUksQ0FBQ2hCLGNBQXBCLENBQWxEO0FBQ0g7O0FBRUQsUUFBQSxNQUFJLENBQUNaLHdCQUFMLEdBQWlDLElBQUlpSCxJQUFKLEVBQUQsQ0FBYUMsT0FBYixFQUFoQztBQUNBaEYsUUFBQUEsU0FBUSxJQUFJQSxTQUFRLEVBQXBCO0FBQ0g7QUEvQmtELEtBQTVCLENBQXZCO0FBaUNILEdBL1lJLENBa1pMOztBQWxaSyxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJcblxuLy8gTW9kdWxlTWFuYWdlclxubGV0IE1vZHVsZSA9IHJlcXVpcmUoXCJNb2R1bGVcIikgXG5sZXQgTW9kdWxlQ29uc3QgPSByZXF1aXJlKFwiTW9kdWxlQ29uc3RcIilcblxubGV0IEpTX0xPRyA9IGZ1bmN0aW9uKC4uLmFyZyl7IFxuICAgIGNjLmxvZyhcIltNb2R1bGVNYW5hZ2VyXVwiLC4uLmFyZykgOyBcbn1cblxuY2MuQ2xhc3Moe1xuICAgIFxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgICBwcm9wZXJ0aWVzOiB7ICBcbiAgICAgICAgLy8g6I635Y+W5YyF5YaF6Lev5b6EOyDpnIDopoHliIbliKvnu5HlrpogcmVzb3VyY2VzIOWSjCBUZXh0dXJlIOS4i+i1hOa6kOaWh+S7tjtcbiAgICAgICAgYXNzZXQxOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IGNjLkFzc2V0IH0sIFxuICAgICAgICBhc3NldDI6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogY2MuQXNzZXQgfSxcbiAgICB9LFxuXG4gICAgb25Mb2FkKCl7XG4gICAgICAgIHRoaXMuX01vZHVsZUNvbSAgICAgPSB0aGlzLmdldENvbXBvbmVudChcIk1vZHVsZUNvbVwiKVxuICAgICAgICB0aGlzLl91bnBhY2thZ2UgICAgID0gdGhpcy5nZXRDb21wb25lbnQoXCJVbnBhY2thZ2VIZWxwZXJcIilcbiAgICAgICAgdGhpcy5fSG90VUlIZWxwZXIgICA9IHRoaXMuZ2V0Q29tcG9uZW50KFwiSG90VUlIZWxwZXJcIikgXG5cbiAgICAgICAgLy8ganNiLmZpbGVVdGlscy5nZXREZWZhdWx0UmVzb3VyY2VSb290UGF0aCgpXG4gICAgICAgIHRoaXMuX25hdGl2ZVJvb3RQYXRoID0gXCJcIiAgIC8vIG5hdGl2ZSBhYuaguei3r+W+hCAsIOS7pSAvIOe7k+WwvlxuICAgICAgICBpZih0eXBlb2YoanNiKSE9XCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgICBsZXQgYWJzUGF0aDEgPSBqc2IuZmlsZVV0aWxzLmZ1bGxQYXRoRm9yRmlsZW5hbWUodGhpcy5hc3NldDEubmF0aXZlVXJsKS5yZXBsYWNlKFwiLy9cIixcIi9cIilcbiAgICAgICAgICAgIGxldCBhYnNQYXRoMiA9IGpzYi5maWxlVXRpbHMuZnVsbFBhdGhGb3JGaWxlbmFtZSh0aGlzLmFzc2V0Mi5uYXRpdmVVcmwpLnJlcGxhY2UoXCIvL1wiLFwiL1wiKVxuICAgICAgICAgICAgbGV0IHRlc3RMZW4gPSBhYnNQYXRoMS5sZW5ndGg+YWJzUGF0aDIubGVuZ3RoPyBhYnNQYXRoMi5sZW5ndGggOiBhYnNQYXRoMS5sZW5ndGggXG4gICAgICAgICAgICBmb3IobGV0IGk9MDtpPHRlc3RMZW47aSsrKXtcbiAgICAgICAgICAgICAgICBpZihhYnNQYXRoMVtpXSAhPSBhYnNQYXRoMltpXSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25hdGl2ZVJvb3RQYXRoID0gYWJzUGF0aDEuc3Vic3RyaW5nKDAsIGkpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIGNjLmxvZyhcImRlZmF1bHRfcGF0aF86XCIsIGpzYi5maWxlVXRpbHMuZ2V0RGVmYXVsdFJlc291cmNlUm9vdFBhdGgoKSk7IFxuICAgICAgICAgICAgY2MubG9nKFwiYWJzRmlsZV9wYXRoXzI6XCIsIHRoaXMuX25hdGl2ZVJvb3RQYXRoIClcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBpbml0Q29tKGFyZ3Mpe1xuICAgICAgICBsZXQgeyB1c2VIb3RVcGRhdGUgfSA9IGFyZ3MgXG4gICAgICAgIHRoaXMuX3VucGFja2FnZS5pbml0Q29tKGFyZ3MpXG4gICAgICAgIFxuICAgICAgICB0aGlzLl91c2VIb3RVcGRhdGUgPSB1c2VIb3RVcGRhdGUgXG4gICAgICAgIHRoaXMuX2xhc3RSZXFfVmVyc2lvbkluZm9UaW1lID0gMCAvLyhuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgIC8vIOacgOWQjuS4gOasoeajgOa1i+eJiOacrOaXtumXtFxuICAgICAgICB0aGlzLl9kZXRlY3ROZXdWZXJzaW9uSW50ZXJ2YWwgPSAzMCAgLy8g6Ieq5Yqo5qOA5rWL54mI5pys6Ze06ZqUXG5cbiAgICAgICAgdGhpcy5tb2R1bGVzID0ge31cblxuICAgICAgICB0aGlzLl9sb2NhbF9kYXRhX2tleSA9IE1vZHVsZUNvbnN0LmxvY2FsVmVyc2lvbkNvbmZpZ0tleSAvL1wiX2xvY2FsX2dhbWVWZXJzaW9uRGF0YTFcIlxuICAgICAgICBsZXQgdmVyc2lvbkRhdGEgPSBjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5fbG9jYWxfZGF0YV9rZXkpXG4gICAgICAgIGlmKCF2ZXJzaW9uRGF0YSl7IFxuICAgICAgICAgICAgdmVyc2lvbkRhdGEgPSB0aGlzLmNyZWF0ZURlZmF1bHRWZXJzaW9uRGF0YSgpIFxuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICB2ZXJzaW9uRGF0YSA9IEpTT04ucGFyc2UodmVyc2lvbkRhdGEpXG4gICAgICAgIH0gXG4gICAgICAgIHRoaXMuX2xvY2FsX1ZlcnNpb24gPSB2ZXJzaW9uRGF0YVxuXG4gICAgICAgIHRoaXMuX3JvbW90ZVZlcnNpb24gPSB0aGlzLmNyZWF0ZURlZmF1bHRWZXJzaW9uRGF0YSgpXG4gICAgICAgIFxuICAgIH0sXG5cbiAgICBleGVjVW5wYWNrYWdlKG9uQ29tcGxhdGUpe1xuICAgICAgICB0aGlzLl91bnBhY2thZ2UuZXhlY1VucGFja2FnZShvbkNvbXBsYXRlKVxuICAgIH0sXG5cbiAgICBnZXROYXRpdmVQYXRoKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9uYXRpdmVSb290UGF0aFxuICAgIH0sXG4gICAgcmVxTG9vcFZlcnNpb25JbmZvKCl7XG4gICAgICAgIGlmKHRoaXMuX3VzZUhvdFVwZGF0ZSl7XG4gICAgICAgICAgICBpZih0aGlzLl9yZXFMb29wSGFuZGxlcil7IHJldHVybiB9XG4gICAgICAgICAgICB0aGlzLl9yZXFMb29wSGFuZGxlciA9ICgpPT57XG4gICAgICAgICAgICAgICAgdGhpcy5yZXFWZXJzaW9uSW5mbygpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlKHRoaXMuX3JlcUxvb3BIYW5kbGVyLCB0aGlzLl9kZXRlY3ROZXdWZXJzaW9uSW50ZXJ2YWwpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8g5pu05pawQULniYjmnKzlj7cgLCDmlrDljIXlronoo4Xop6PljovotYTmupDlkI7opobnm5bniYjmnKzlj7dcbiAgICBzZXRMb2NhbEFiVmVyc2lvbih2ZXJPYmope1xuXG4gICAgICAgIGxldCBsb2NhbE1hcCA9IHRoaXMuX2xvY2FsX1ZlcnNpb25cbiAgICAgICAgZm9yKGxldCBhYk5hbWUgaW4gdmVyT2JqKXtcbiAgICAgICAgICAgIGxldCB2ZXJTdHIgPSB2ZXJPYmpbYWJOYW1lXVxuXG4gICAgICAgICAgICBpZighbG9jYWxNYXAubW9kdWxlc1thYk5hbWVdKXsgICAvLyDov5DokKXkuK3mlrDlop7mqKHlnZdcbiAgICAgICAgICAgICAgICBsb2NhbE1hcC5tb2R1bGVzW2FiTmFtZV0gPSB7fVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbG9jYWxNYXAubW9kdWxlc1thYk5hbWVdLnJlc1ZlcnNpb24gPSB2ZXJTdHIgXG4gICAgICAgIH0gXG5cbiAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuX2xvY2FsX2RhdGFfa2V5LCBKU09OLnN0cmluZ2lmeSh0aGlzLl9sb2NhbF9WZXJzaW9uKSlcbiAgICB9LFxuXG4gICAgZ2V0X0xvY2FsVmVyc2lvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxfVmVyc2lvblxuICAgIH0sXG5cbiAgICBnZXRfUm9tb3RlVmVyc2lvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fcm9tb3RlVmVyc2lvblxuICAgIH0sXG5cbiAgICBjcmVhdGVEZWZhdWx0VmVyc2lvbkRhdGEoKXtcbiAgICAgICAgbGV0IHJldCA9IHtcbiAgICAgICAgICAgIGNsaWVudE1pbiA6IFwiMS4wLjBcIiAsIFxuICAgICAgICAgICAgbW9kdWxlcyA6IHt9XG4gICAgICAgIH0gICBcbiAgICAgICAgcmV0dXJuIHJldCBcbiAgICB9LFxuICAgIFxuICAgIC8vIOabtOaWsOaJgOacieaooeWdl1xuICAgIGhvdFVwZGF0ZUFsbE1vZHVsZShjYWxsYmFjaywgaXNTaG93SG90RGV0ZWN0QWxlcnQpe1xuICAgICAgICBpZighdGhpcy5fdXNlSG90VXBkYXRlKXtcbiAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDmmL7npLrmraPlnKjmo4DmtYvmm7TmlrDmj5DnpLpcbiAgICAgICAgaWYoaXNTaG93SG90RGV0ZWN0QWxlcnQpe1xuICAgICAgICAgICAgdGhpcy5fSG90VUlIZWxwZXIuY2hlY2tOZXdWZXJzaW9uU2hvdygpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5ob3RVcGRhdGVNdWx0aU1vZHVsZShPYmplY3Qua2V5cyh0aGlzLl9yb21vdGVWZXJzaW9uLm1vZHVsZXMpLCAoKT0+eyBcbiAgICAgICAgICAgIHRoaXMuX0hvdFVJSGVscGVyLmNoZWNrTmV3VmVyc2lvbkhpZGUoKVxuICAgICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICB9KVxuXG4gICAgfSxcblxuICAgIC8vIOe9rumhtuabtOaWsOaooeWdl1xuICAgIGhvdFVwZGF0ZU11bHRpTW9kdWxlKG1vZHVsZU5hbWVBcnIsIGNhbGxiYWNrKXtcbiAgICAgICAgaWYodGhpcy5pc05lZWRSZXFfdmVyc2lvbkluZm8oKSl7XG4gICAgICAgICAgICB0aGlzLnJlcVZlcnNpb25JbmZvKCgpPT57XG4gICAgICAgICAgICAgICAgdGhpcy5fZG9Ib3RVcGRhdGVNdWx0aShtb2R1bGVOYW1lQXJyLCBjYWxsYmFjaylcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2RvSG90VXBkYXRlTXVsdGkobW9kdWxlTmFtZUFyciwgY2FsbGJhY2spXG4gICAgICAgIH0gXG4gICAgfSxcbiAgICBfZG9Ib3RVcGRhdGVNdWx0aShtb2R1bGVOYW1lQXJyLCBjYWxsYmFjayl7XG4gICAgICAgIGlmKCF0aGlzLl91c2VIb3RVcGRhdGUpe1xuICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOWkp+eJiOacrOWkquaXp1xuICAgICAgICBpZigtMSA9PSB0aGlzLl9Nb2R1bGVDb20uY29tVmVyc2lvbihfR2xvYWJhbC5DbGllbnRfVmVyc2lvbiwgdGhpcy5fcm9tb3RlVmVyc2lvbi5jbGllbnRNaW4gKSl7XG4gICAgICAgICAgICB0aGlzLl9Ib3RVSUhlbHBlci5zaG93QWxlcnRDbGllbnRUb29PbGQoKVxuICAgICAgICAgICAgcmV0dXJuIFxuICAgICAgICB9XG4gICAgICAgIEpTX0xPRyhcIm1vZHVsZU5hbWVfb3JpOlwiLCBKU09OLnN0cmluZ2lmeShtb2R1bGVOYW1lQXJyKSApXG4gICAgICAgIG1vZHVsZU5hbWVBcnIgPSB0aGlzLmdldERlcGVuZE1vZHVsZShtb2R1bGVOYW1lQXJyKVxuICAgICAgICBKU19MT0coXCJtb2R1bGVOYW1lX2RlcDpcIiwgSlNPTi5zdHJpbmdpZnkobW9kdWxlTmFtZUFycikgKVxuXG4gICAgICAgIC8vIGlzU2hvd0hvdFVJIFxuICAgICAgICBsZXQgbmVlZF9VcGRhdGUgID0gZmFsc2UgXG4gICAgICAgIGxldCBuZWVkX1Jlc3RhcnQgPSBmYWxzZSBcblxuICAgICAgICAvLyDmiYDmnIltb2R1bGXmm7TmlrDlrozmiJBcbiAgICAgICAgbGV0IG9uQWxsTW9kdWxlSG90RmluaXNoID0gKCk9PntcbiAgICAgICAgICAgIEpTX0xPRyhcImhvdF91cGRhdGVfLUFsbEhvdF9GaW5pc2hcIilcbiAgICAgICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLl9sb2NhbF9kYXRhX2tleSwgSlNPTi5zdHJpbmdpZnkodGhpcy5fbG9jYWxfVmVyc2lvbikpXG4gICAgICAgICAgICBpZihuZWVkX1Jlc3RhcnQpe1xuICAgICAgICAgICAgICAgIC8vIHRoaXMuc2NoZWR1bGVPbmNlKCgpPT57IFxuICAgICAgICAgICAgICAgIC8vICAgICAvLyBjYy5zeXMucmVzdGFydFZNKCkgXG4gICAgICAgICAgICAgICAgLy8gICAgIGNjLmdhbWUucmVzdGFydCgpO1xuICAgICAgICAgICAgICAgIC8vIH0sIDAuMSlcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgXG4gICAgICAgICAgICAgICAgICAgIGNjLmdhbWUucmVzdGFydCgpO1xuICAgICAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOS4i+i9vSBhc3NldHMgYnVuZGxlIOi1hOa6kFxuICAgICAgICBsZXQgbmVlZFVwZGF0ZU5hbWVzID0gW11cbiAgICAgICAgbGV0IHByZWxvYWREaXIgPSAoKT0+e1xuICAgICAgICAgICAgdGhpcy5fTW9kdWxlQ29tLnNlcXVlbmNlTWlzKG5lZWRVcGRhdGVOYW1lcywgKCk9PntcbiAgICAgICAgICAgICAgICBKU19MT0coXCJob3RfdXBkYXRlXy1hbGxQcmVsb2FkRmluaXNoXCIpXG4gICAgICAgICAgICAgICAgLy8g5omA5pyJ5Lu75Yqh5a6M5oiQXG4gICAgICAgICAgICAgICAgdGhpcy5fSG90VUlIZWxwZXIuaGlkZVVwZGF0aW5nKG9uQWxsTW9kdWxlSG90RmluaXNoKVxuXG4gICAgICAgICAgICB9LCAoY3VyTWlzLCBpZHgsIG9uRXhlYyk9PnsgXG4gICAgICAgICAgICAgICAgLy8g5q+P5Liq6aKE5Yqg6L295Lu75YqhXG4gICAgICAgICAgICAgICAgbGV0IGN1ck1pc0lkeCA9IGlkeCsxXG4gICAgICAgICAgICAgICAgbGV0IHRvdGFsTWlzID0gbmVlZFVwZGF0ZU5hbWVzLmxlbmd0aFxuICAgICAgICAgICAgICAgIGxldCBtb2R1bGVPYmogPSB0aGlzLm1vZHVsZXNbbmVlZFVwZGF0ZU5hbWVzW2lkeF1dXG4gICAgICAgICAgICAgICAgbW9kdWxlT2JqLnByZWxvYWRNb2R1bGUoKGZpbmlzaCwgdG90YWwsIGl0ZW0pPT57XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gSlNfTE9HKFwiaG90X3VwZGF0ZV8tb25Qcm9ncmVzc19pbmZvXzpcIiwgY3VyTWlzSWR4LCBmaW5pc2gsIHRvdGFsLCBpdGVtLnVybCApXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX0hvdFVJSGVscGVyLm9uUHJvZ3Jlc3MoIGN1ck1pc0lkeCwgdG90YWxNaXMsIGZpbmlzaCwgdG90YWwpXG4gICAgICAgICAgICAgICAgfSwgKGl0ZW1zKT0+e1xuXG4gICAgICAgICAgICAgICAgICAgIEpTX0xPRyhcImhvdF91cGRhdGVfLXByZWxvYWRPS186XCIsIG5lZWRVcGRhdGVOYW1lc1tpZHhdIClcbiAgICAgICAgICAgICAgICAgICAgb25FeGVjKClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSDpobrluo/kuIvovb3phY3nva4gXG4gICAgICAgIHRoaXMuX01vZHVsZUNvbS5zZXF1ZW5jZU1pcyhtb2R1bGVOYW1lQXJyLCAoKT0+e1xuICAgICAgICAgICAgLy8g5omA5pyJ6YWN572u5LiL6L295a6M5oiQXG4gICAgICAgICAgICBpZihuZWVkX1VwZGF0ZSl7XG4gICAgICAgICAgICAgICAgdGhpcy5fSG90VUlIZWxwZXIuc2hvd1VwZGF0aW5nKDEsIG5lZWRVcGRhdGVOYW1lcy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgdGhpcy5fSG90VUlIZWxwZXIuc2hvd0hvdEFsZXJ0KG5lZWRfUmVzdGFydCwgKCk9PntcbiAgICAgICAgICAgICAgICAgICAgcHJlbG9hZERpcigpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICBvbkFsbE1vZHVsZUhvdEZpbmlzaCgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfSwgKGN1ck1pcywgaWR4LCBvbkV4ZWMpPT57IFxuICAgICAgICAgICAgLy8g5q+P5Liq6aKE5Yqg6L295Lu75YqhXG4gICAgICAgICAgICBsZXQgbW9kdWxlTmFtZSA9IG1vZHVsZU5hbWVBcnJbaWR4XVxuICAgICAgICAgICAgbGV0IHJldFRlbXAgPSB7fVxuICAgICAgICAgICAgcmV0VGVtcCA9IHRoaXMuX2hvdFVwZGF0ZU1vZHVsZShtb2R1bGVOYW1lLCAoaG90X3JldCk9PntcbiAgICAgICAgICAgICAgICBsZXQge2hhdmVOZXdWZXIsIG5lZWRSZXN0YXJ0fSA9IGhvdF9yZXRcbiAgICAgICAgICAgICAgICBpZihoYXZlTmV3VmVyKSB7IFxuICAgICAgICAgICAgICAgICAgICBuZWVkX1VwZGF0ZSA9IHRydWUgXG4gICAgICAgICAgICAgICAgICAgIG5lZWRVcGRhdGVOYW1lcy5wdXNoKG1vZHVsZU5hbWUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKG5lZWRSZXN0YXJ0KSB7IG5lZWRfUmVzdGFydCA9IHRydWUgfVxuICAgICAgICAgICAgICAgIG9uRXhlYygpXG4gICAgICAgICAgICB9KSBcbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcbiAgICAgICAgfSlcbiAgICAgICAgXG4gICAgfSxcblxuICAgIC8vIOiOt+WPluS+nei1luaooeWdlywg5bm25o6S5bqPXG4gICAgZ2V0RGVwZW5kTW9kdWxlKG5hbWVzLCBoKXtcbiAgICAgICAgaCA9IGggfHwgMVxuICAgICAgICBsZXQgcm1zID0gdGhpcy5fcm9tb3RlVmVyc2lvbi5tb2R1bGVzIFxuICAgICAgICBsZXQgcmV0ID0ge31cbiAgICAgICAgZm9yKGxldCBpZHggaW4gbmFtZXMpe1xuICAgICAgICAgICAgbGV0IG5fMSA9IG5hbWVzW2lkeF1cbiAgICAgICAgICAgIHJldFtuXzFdID0geyBuYW1lOm5fMSwgcHJpb3JpdHk6cm1zW25fMV0ucHJpb3JpdHl9XG5cbiAgICAgICAgICAgIGxldCBkZXBlbmRzID0gdGhpcy5nZXREZXBlbmRNb2R1bGUocm1zW25fMV0uZGVwZW5kIHx8IFtdLCBoKzEpXG4gICAgICAgICAgICBmb3IobGV0IGogaW4gZGVwZW5kcyl7XG4gICAgICAgICAgICAgICAgbGV0IG5fMiA9IGRlcGVuZHNbal1cbiAgICAgICAgICAgICAgICByZXRbbl8yXSA9IHsgbmFtZTpuXzIsIHByaW9yaXR5OnJtc1tuXzJdLnByaW9yaXR5fVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8v5o6S5bqPLCDkvJjlhYjnuqfpq5jnmoTlhYjmm7TmlrAgXG4gICAgICAgIGlmKGg9PTEpe1xuICAgICAgICAgICAgbGV0IG1pbmZvcyA9IE9iamVjdC52YWx1ZXMocmV0KVxuICAgICAgICAgICAgbWluZm9zLnNvcnQoZnVuY3Rpb24oYSxiKXsgIFxuICAgICAgICAgICAgICAgIGlmKGEucHJpb3JpdHkgPiBiLnByaW9yaXR5KXsgcmV0dXJuIC0xfVxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldCA9IHt9XG4gICAgICAgICAgICBmb3IobGV0IGlkeCBpbiAgbWluZm9zKXtcbiAgICAgICAgICAgICAgICByZXRbbWluZm9zW2lkeF0ubmFtZV0gPSAxXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMocmV0KVxuICAgIH0sXG5cbiAgICAvLyDmm7TmlrDliLDmnIDmlrDniYjmnKwgXG4gICAgX2hvdFVwZGF0ZU1vZHVsZShtb2R1bGVOYW1lLCBjYWxsYmFjayl7XG4gICAgICAgIGlmKCF0aGlzLl91c2VIb3RVcGRhdGUpe1xuICAgICAgICAgICAgbGV0IHJldCA9IHsgaGF2ZU5ld1ZlcjpmYWxzZSwgbmVlZFJlc3RhcnQ6ZmFsc2UgfTtcbiAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKHJldCk7XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGxvY2FsX1ZlciA9IHRoaXMuX2xvY2FsX1ZlcnNpb24ubW9kdWxlc1ttb2R1bGVOYW1lXS5yZXNWZXJzaW9uXG4gICAgICAgIGxldCByb21vdGVWZXIgPSB0aGlzLl9yb21vdGVWZXJzaW9uLm1vZHVsZXNbbW9kdWxlTmFtZV0ucmVzVmVyc2lvblxuICAgICAgICBsZXQgbW9kdWxlT2JqID0gdGhpcy5tb2R1bGVzW21vZHVsZU5hbWVdXG5cbiAgICAgICAgSlNfTE9HKFwidmVyc2lvbl9pbmZvX2RhdGFfLWxvY2FsOlwiLCBKU09OLnN0cmluZ2lmeSh0aGlzLl9sb2NhbF9WZXJzaW9uKSApXG4gICAgICAgIEpTX0xPRyhcInZlcnNpb25faW5mb19kYXRhXy1yZW1vdGU6XCIsIEpTT04uc3RyaW5naWZ5KHRoaXMuX3JvbW90ZVZlcnNpb24pIClcblxuICAgICAgICBsZXQgcmV0ID0geyBoYXZlTmV3VmVyOiAobG9jYWxfVmVyICE9IHJvbW90ZVZlciksIG5lZWRSZXN0YXJ0OmZhbHNlIH1cblxuICAgICAgICBsZXQgbG9hZFZlckZ1bmMgPSAobU9iaiwgdmVyLCBjYik9PntcbiAgICAgICAgICAgIG1PYmoubG9hZEFCKCgpPT57XG4gICAgICAgICAgICAgICAgaWYobG9jYWxfVmVyICE9IHJvbW90ZVZlcil7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvY2FsX1ZlcnNpb24ubW9kdWxlc1ttb2R1bGVOYW1lXS5yZXNWZXJzaW9uID0gcm9tb3RlVmVyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvY2FsX1ZlcnNpb24ubW9kdWxlc1ttb2R1bGVOYW1lXS5zaG93VmVyID0gdGhpcy5fcm9tb3RlVmVyc2lvbi5tb2R1bGVzW21vZHVsZU5hbWVdLnNob3dWZXJcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNiICYmIGNiKCk7XG4gICAgICAgICAgICB9LCB2ZXIpXG4gICAgICAgIH1cblxuICAgICAgICBpZighbW9kdWxlT2JqKXtcbiAgICAgICAgICAgIC8vIOacquWKoOi9vei/hywg5pu05paw5ZCO5LiN6ZyA6KaB6YeN5ZCvXG4gICAgICAgICAgICBtb2R1bGVPYmogPSBuZXcgTW9kdWxlKClcbiAgICAgICAgICAgIGxvYWRWZXJGdW5jKCBtb2R1bGVPYmouaW5pdChtb2R1bGVOYW1lKSwgcm9tb3RlVmVyLCAoKT0+e1xuICAgICAgICAgICAgICAgIHRoaXMubW9kdWxlc1ttb2R1bGVOYW1lXSA9IG1vZHVsZU9ialxuICAgICAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKHJldCk7XG4gICAgICAgICAgICB9KSBcblxuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAvLyDlt7LliqDovb0sIOiLpeacieabtOaWsOWImeabtOaWsOWQjumHjeWQr1xuICAgICAgICAgICAgaWYobG9jYWxfVmVyID09IHJvbW90ZVZlcil7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2socmV0KTtcbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICByZXQubmVlZFJlc3RhcnQgPSB0cnVlIFxuICAgICAgICAgICAgICAgIGxvYWRWZXJGdW5jKG1vZHVsZU9iaiwgcm9tb3RlVmVyLCAoKT0+e1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhyZXQpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldFxuXG4gICAgfSxcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRCdW5kbGUobW9kdWxlTmFtZSl7XG4gICAgICAgIC8vIEpTX0xPRyhcIk1vZHVsZU1hZ19nZXRidW5kbGVfXzpcIiwgbW9kdWxlTmFtZSlcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kdWxlc1ttb2R1bGVOYW1lXS5fYWJPYmpcbiAgICB9LFxuXG4gICAgZ2V0TW9kdWxlKG1vZHVsZU5hbWUpe1xuICAgICAgICByZXR1cm4gdGhpcy5tb2R1bGVzW21vZHVsZU5hbWVdXG4gICAgfSxcblxuICAgIGFkZE1vZHVsZShtb2R1bGVOYW1lLCBjYil7XG4gICAgICAgIGxldCBtb2R1bGUgPSB0aGlzLm1vZHVsZXNbbW9kdWxlTmFtZV1cbiAgICAgICAgSlNfTE9HKFwibW9kdWxlX21hZy1hZGRNT2R1bGU6XCIsIG1vZHVsZU5hbWUsIG1vZHVsZSApXG4gICAgICAgIGlmKG1vZHVsZSl7IFxuICAgICAgICAgICAgY2IobW9kdWxlKVxuICAgICAgICAgICAgcmV0dXJuIG1vZHVsZVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVtb3ZlTW9kdWxlKG1vZHVsZU5hbWUpXG5cbiAgICAgICAgSlNfTE9HKFwibG9hZF9BQl9fX186XCIsIG1vZHVsZU5hbWUpXG5cbiAgICAgICAgbGV0IG1vZHVsZU9iaiA9IG5ldyBNb2R1bGUoKVxuICAgICAgICBtb2R1bGVPYmouaW5pdChtb2R1bGVOYW1lLCB0aGlzLl91c2VIb3RVcGRhdGUpLmxvYWRBQigoKT0+e1xuICAgICAgICAgICAgdGhpcy5tb2R1bGVzW21vZHVsZU5hbWVdID0gbW9kdWxlT2JqXG4gICAgICAgICAgICBjYiAmJiBjYihtb2R1bGVPYmopXG4gICAgICAgIH0pXG5cbiAgICB9LFxuXG4gICAgcmVtb3ZlTW9kdWxlKG1vZHVsZU5hbWUpe1xuICAgICAgICBsZXQgbW9kdWxlT2JqID0gdGhpcy5tb2R1bGVzW21vZHVsZU5hbWVdXG4gICAgICAgIGlmKCFtb2R1bGVPYmopeyByZXR1cm4gfVxuICAgICAgICBtb2R1bGVPYmoucmVsZWFzZUFCKClcbiAgICAgICAgZGVsZXRlIHRoaXMubW9kdWxlc1ttb2R1bGVOYW1lXTtcbiAgICB9LFxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPj4g5p+l6K+i5paw54mI5pysXG4gICAgaXNOZWVkUmVxX3ZlcnNpb25JbmZvKCl7XG4gICAgICAgIGlmKE1vZHVsZUNvbnN0LnJlcVZlcnNpb25JbW1lZGlhdGVseSl7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZSBcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjdXJUaW1lID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKSAgXG4gICAgICAgIEpTX0xPRyhcImlzX25lZWRfcmVxX3Zlcl86XCIsIGN1clRpbWUgLCB0aGlzLl9sYXN0UmVxX1ZlcnNpb25JbmZvVGltZSlcbiAgICAgICAgaWYoY3VyVGltZSAtIHRoaXMuX2xhc3RSZXFfVmVyc2lvbkluZm9UaW1lID4gdGhpcy5fZGV0ZWN0TmV3VmVyc2lvbkludGVydmFsKjEwMDApeyBcbiAgICAgICAgICAgIHJldHVybiB0cnVlIFxuICAgICAgICB9IFxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9LFxuXG4gICAgcmVxVmVyc2lvbkluZm8oY2FsbGJhY2spe1xuICAgICAgICBpZighdGhpcy5fdXNlSG90VXBkYXRlKXtcbiAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5faHR0cFJlcUhhbmRsZXIpe1xuICAgICAgICAgICAgdGhpcy5faHR0cFJlcUhhbmRsZXIuYWJvcnQoKVxuICAgICAgICB9XG4gICAgICAgIGxldCB2ZXJVcmwgPSBNb2R1bGVDb25zdC5ob3RVcmwgKyBcInZlcmNvbmZpZy5qc29uXCIgKyBcIj9yZW5ldz1cIiArIHRoaXMuX01vZHVsZUNvbS5jcmVhdGVVVUlEKCkgXG4gICAgICAgIEpTX0xPRyhcInJlcV92ZXJzaW9uX3VybF86XCIsIHZlclVybClcblxuICAgICAgICB0aGlzLl9odHRwUmVxSGFuZGxlciA9IHRoaXMuX01vZHVsZUNvbS5tYWtlWE1MSHR0cCh7dXJsOiB2ZXJVcmwsIGNhbGxiYWNrOihfYXJncyk9PntcblxuICAgICAgICAgICAgbGV0IGh0dHBEYXRhID0gX2FyZ3MucmV0RGF0YVxuICAgICAgICAgICAgaWYoIWh0dHBEYXRhKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5faHR0cFJlcUhhbmRsZXIgPSBudWxsXG4gICAgICAgICAgICB0aGlzLl9yb21vdGVWZXJzaW9uID0gaHR0cERhdGFcblxuICAgICAgICAgICAgSlNfTE9HKFwib25SZXFWZXJzaW9uX0luZm9fOlwiLCBKU09OLnN0cmluZ2lmeShodHRwRGF0YSkgKVxuICAgICAgICAgICAgbGV0IGxvY2FsTWFwID0gdGhpcy5fbG9jYWxfVmVyc2lvblxuICAgICAgICAgICAgbGV0IHJlbW90ZU1hcCA9IGh0dHBEYXRhXG4gICAgICAgICAgICBsZXQgbmVlZFNhdmUgPSBmYWxzZSBcblxuICAgICAgICAgICAgZm9yKGxldCBtb2R1bGVOYW1lIGluIHJlbW90ZU1hcC5tb2R1bGVzKXsgXG5cbiAgICAgICAgICAgICAgICBpZighbG9jYWxNYXAubW9kdWxlc1ttb2R1bGVOYW1lXSl7ICAgLy8g6L+Q6JCl5Lit5paw5aKe5qih5Z2XXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsTWFwLm1vZHVsZXNbbW9kdWxlTmFtZV0gPSB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZighbG9jYWxNYXAubW9kdWxlc1ttb2R1bGVOYW1lXS5zaG93VmVyKXtcbiAgICAgICAgICAgICAgICAgICAgbmVlZFNhdmUgPSB0cnVlIFxuICAgICAgICAgICAgICAgICAgICBsb2NhbE1hcC5tb2R1bGVzW21vZHVsZU5hbWVdLnNob3dWZXIgPSAocmVtb3RlTWFwLm1vZHVsZXNbbW9kdWxlTmFtZV0uc2hvd1ZlcilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKG5lZWRTYXZlKXtcbiAgICAgICAgICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5fbG9jYWxfZGF0YV9rZXksIEpTT04uc3RyaW5naWZ5KHRoaXMuX2xvY2FsX1ZlcnNpb24pKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9sYXN0UmVxX1ZlcnNpb25JbmZvVGltZSA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKClcbiAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG4gICAgICAgIH19KSBcbiAgICAgICAgXG4gICAgfSxcbiAgICBcblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLTw8IOafpeivouaWsOeJiOacrFxuXG59KTtcbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/AppCom.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '6a88bX1IYNKDLa1BfbIRaSp', 'AppCom');
// Script/AppCom.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvQXBwQ29tLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUNBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFIUCxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG5cblxuICAgIH0sXG4gICAgXG5cblxufSk7IFxuIl19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/ModuleMag/Module.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '8d2894O671LYIFcKbt6EeqD', 'Module');
// Script/ModuleMag/Module.js

"use strict";

var JS_LOG = function JS_LOG() {
  var _cc;

  for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
    arg[_key] = arguments[_key];
  }

  (_cc = cc).log.apply(_cc, ["[Module]"].concat(arg));
};

var ModuleConst = require("ModuleConst");

cc.Class({
  "extends": cc.Component,
  properties: {},
  ctor: function ctor() {
    JS_LOG("module_ctor_");
  },
  init: function init(ABName, useHotUpdate) {
    JS_LOG("module_init");
    this._ABName = ABName;
    this._useHotUpdate = useHotUpdate;
    return this;
  },
  getABObj: function getABObj() {
    return this._abObj;
  },
  getModuleName: function getModuleName() {
    return this._ABName;
  },
  loadAB: function loadAB(cb, version) {
    var _this = this;

    // {version: 'fbc07'},
    var loadArg = {};

    if (version) {
      loadArg.version = version;
    }

    var isValid = true;
    var abUrl = this._ABName;

    if (this._useHotUpdate) {
      // 如果希望使用creator构建时填的资源服务器地址,将下面这行代码注释掉即可.
      abUrl = ModuleConst.hotUrl + "remote/" + this._ABName;
    }

    JS_LOG("loadAB_:", this._ABName, abUrl);
    cc.assetManager.loadBundle(abUrl, loadArg, function (err, bundle) {
      if (!isValid) {
        return;
      }

      ;
      isValid = false;

      if (!err) {
        JS_LOG("loadAB_OK_:", _this._ABName);
        _this._abObj = bundle;
        cb();
      } else {
        JS_LOG("load_ab_Err_:", _this._ABName, JSON.stringify(err)); // 错误重试

        _this.scheduleOnce(function () {
          _this.loadAB(cb, version);
        }, 3);
      }
    });
  },
  // 下载资源
  preloadModule: function preloadModule(onProgress, onComplete) {
    var _this2 = this;

    var is_Valid = true; //---------------------------------------------------------

    var autoAtlas = [];
    var resMap = this._abObj._config.assetInfos._map;

    for (var idx in resMap) {
      var item = resMap[idx];

      if (!item.path && item.nativeVer) {
        var urll = cc.assetManager.utils.getUrlWithUuid(item.uuid, {
          __nativeName__: ".png",
          nativeExt: cc.path.extname(".png"),
          isNative: true
        });

        if (urll) {
          autoAtlas.push(urll);
        }
      }
    }

    JS_LOG("autoatlas_url_arr_:", JSON.stringify(autoAtlas));
    var extNum = autoAtlas.length;
    var finishNum = 0;
    var is_2Valid = true;

    var preloadAutoAtlas = function preloadAutoAtlas() {
      if (autoAtlas.length == 0) {
        if (!is_2Valid) {
          return;
        }

        ;
        is_2Valid = false;
        onComplete && onComplete();
        return;
      } // RequestType.URL = 'url' 


      cc.assetManager.preloadAny(autoAtlas, {
        __requestType__: 'url',
        type: null,
        bundle: _this2._abObj.name
      }, function (finish, total, item) {
        if (!is_2Valid) {
          return;
        }

        ;
        JS_LOG("load_autoatlas_progress_:", _this2._abObj.name, finish, total);
        onProgress && onProgress(finish + finishNum, total + finishNum, item);
      }, function (error, items) {
        if (!is_2Valid) {
          return;
        }

        ;
        is_2Valid = false;

        if (!error) {
          onComplete && onComplete();
        } else {
          JS_LOG("preloadAutoAtlas_error:", JSON.stringify(error));

          _this2.scheduleOnce(function () {
            _this2.preloadModule(onProgress, onComplete);
          }, 3);
        }
      });
    }; //--------------------------------------------------------- 


    this._abObj.preloadDir("root", function (finish, total, item) {
      if (!is_Valid) {
        return;
      }

      ;
      finishNum = total;
      onProgress && onProgress(finish, total + extNum, item);
    }, function (error, items) {
      if (!is_Valid) {
        return;
      }

      ;
      is_Valid = false;

      if (!error) {
        // onComplete && onComplete(items);
        preloadAutoAtlas();
      } else {
        _this2.scheduleOnce(function () {
          _this2.preloadModule(onProgress, onComplete);
        }, 3);
      }
    });
  },
  releaseAB: function releaseAB() {
    this.unscheduleAllCallbacks();

    if (!this._abObj) {
      return;
    }

    JS_LOG("release_ab__");
    cc.assetManager.removeBundle(this._abObj);
    this._abObj = null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvTW9kdWxlTWFnL01vZHVsZS5qcyJdLCJuYW1lcyI6WyJKU19MT0ciLCJhcmciLCJjYyIsImxvZyIsIk1vZHVsZUNvbnN0IiwicmVxdWlyZSIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImN0b3IiLCJpbml0IiwiQUJOYW1lIiwidXNlSG90VXBkYXRlIiwiX0FCTmFtZSIsIl91c2VIb3RVcGRhdGUiLCJnZXRBQk9iaiIsIl9hYk9iaiIsImdldE1vZHVsZU5hbWUiLCJsb2FkQUIiLCJjYiIsInZlcnNpb24iLCJsb2FkQXJnIiwiaXNWYWxpZCIsImFiVXJsIiwiaG90VXJsIiwiYXNzZXRNYW5hZ2VyIiwibG9hZEJ1bmRsZSIsImVyciIsImJ1bmRsZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJzY2hlZHVsZU9uY2UiLCJwcmVsb2FkTW9kdWxlIiwib25Qcm9ncmVzcyIsIm9uQ29tcGxldGUiLCJpc19WYWxpZCIsImF1dG9BdGxhcyIsInJlc01hcCIsIl9jb25maWciLCJhc3NldEluZm9zIiwiX21hcCIsImlkeCIsIml0ZW0iLCJwYXRoIiwibmF0aXZlVmVyIiwidXJsbCIsInV0aWxzIiwiZ2V0VXJsV2l0aFV1aWQiLCJ1dWlkIiwiX19uYXRpdmVOYW1lX18iLCJuYXRpdmVFeHQiLCJleHRuYW1lIiwiaXNOYXRpdmUiLCJwdXNoIiwiZXh0TnVtIiwibGVuZ3RoIiwiZmluaXNoTnVtIiwiaXNfMlZhbGlkIiwicHJlbG9hZEF1dG9BdGxhcyIsInByZWxvYWRBbnkiLCJfX3JlcXVlc3RUeXBlX18iLCJ0eXBlIiwibmFtZSIsImZpbmlzaCIsInRvdGFsIiwiZXJyb3IiLCJpdGVtcyIsInByZWxvYWREaXIiLCJyZWxlYXNlQUIiLCJ1bnNjaGVkdWxlQWxsQ2FsbGJhY2tzIiwicmVtb3ZlQnVuZGxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQUlBLE1BQU0sR0FBRyxTQUFUQSxNQUFTLEdBQWdCO0FBQUE7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QUFBO0FBQ3hCcUIsTUFBQUEsU0FBUyxHQUFHUSxLQUFaO0FBQ0EvQixNQUFBQSxVQUFVLElBQUlBLFVBQVUsQ0FBQzhCLE1BQUQsRUFBU0MsS0FBSyxHQUFHVixNQUFqQixFQUF5QlosSUFBekIsQ0FBeEI7QUFDSCxLQUpELEVBSUcsVUFBQ3VCLEtBQUQsRUFBUUMsS0FBUixFQUFnQjtBQUNmLFVBQUcsQ0FBQy9CLFFBQUosRUFBYTtBQUFFO0FBQVM7O0FBQUE7QUFBRUEsTUFBQUEsUUFBUSxHQUFHLEtBQVg7O0FBQzFCLFVBQUcsQ0FBQzhCLEtBQUosRUFBVTtBQUNOO0FBQ0FQLFFBQUFBLGdCQUFnQjtBQUNuQixPQUhELE1BR007QUFDRixRQUFBLE1BQUksQ0FBQzNCLFlBQUwsQ0FBa0IsWUFBSTtBQUNsQixVQUFBLE1BQUksQ0FBQ0MsYUFBTCxDQUFtQkMsVUFBbkIsRUFBK0JDLFVBQS9CO0FBQ0gsU0FGRCxFQUVHLENBRkg7QUFHSDtBQUNKLEtBZEQ7QUFnQkgsR0EvSEk7QUFpSUxrQyxFQUFBQSxTQWpJSyx1QkFpSU07QUFDUCxTQUFLQyxzQkFBTDs7QUFDQSxRQUFHLENBQUMsS0FBS3JELE1BQVQsRUFBaUI7QUFBRTtBQUFROztBQUMzQmhCLElBQUFBLE1BQU0sQ0FBQyxjQUFELENBQU47QUFDQUUsSUFBQUEsRUFBRSxDQUFDdUIsWUFBSCxDQUFnQjZDLFlBQWhCLENBQTZCLEtBQUt0RCxNQUFsQztBQUNBLFNBQUtBLE1BQUwsR0FBYyxJQUFkO0FBQ0g7QUF2SUksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiXG5cbmxldCBKU19MT0cgPSBmdW5jdGlvbiguLi5hcmcpeyBcbiAgICBjYy5sb2coXCJbTW9kdWxlXVwiLC4uLmFyZykgOyBcbn1cbmxldCBNb2R1bGVDb25zdCA9IHJlcXVpcmUoXCJNb2R1bGVDb25zdFwiKVxuXG5jYy5DbGFzcyh7XG4gICAgXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICAgIHByb3BlcnRpZXM6IHsgXG5cbiAgICB9LFxuXG4gICAgY3Rvcigpe1xuICAgICAgICBKU19MT0coXCJtb2R1bGVfY3Rvcl9cIilcbiAgICB9LFxuICAgIGluaXQoQUJOYW1lLCB1c2VIb3RVcGRhdGUpe1xuICAgICAgICBKU19MT0coXCJtb2R1bGVfaW5pdFwiKVxuICAgICAgICBcbiAgICAgICAgdGhpcy5fQUJOYW1lID0gQUJOYW1lXG4gICAgICAgIHRoaXMuX3VzZUhvdFVwZGF0ZSA9IHVzZUhvdFVwZGF0ZVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG5cbiAgICBnZXRBQk9iaigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fYWJPYmogXG4gICAgfSxcbiAgICBnZXRNb2R1bGVOYW1lKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9BQk5hbWVcbiAgICB9LFxuXG4gICAgbG9hZEFCKGNiLCB2ZXJzaW9uKXtcbiAgICAgICAgLy8ge3ZlcnNpb246ICdmYmMwNyd9LFxuICAgICAgICBsZXQgbG9hZEFyZyA9IHt9XG4gICAgICAgIGlmKHZlcnNpb24pe1xuICAgICAgICAgICAgbG9hZEFyZy52ZXJzaW9uID0gdmVyc2lvblxuICAgICAgICB9XG4gICAgICAgIGxldCBpc1ZhbGlkID0gdHJ1ZSBcbiAgICAgICAgbGV0IGFiVXJsID0gdGhpcy5fQUJOYW1lIFxuXG4gICAgICAgIGlmKHRoaXMuX3VzZUhvdFVwZGF0ZSl7XG4gICAgICAgICAgICAvLyDlpoLmnpzluIzmnJvkvb/nlKhjcmVhdG9y5p6E5bu65pe25aGr55qE6LWE5rqQ5pyN5Yqh5Zmo5Zyw5Z2ALOWwhuS4i+mdoui/meihjOS7o+eggeazqOmHiuaOieWNs+WPry5cbiAgICAgICAgICAgIGFiVXJsID0gTW9kdWxlQ29uc3QuaG90VXJsICsgXCJyZW1vdGUvXCIgKyB0aGlzLl9BQk5hbWVcbiAgICAgICAgfVxuICAgICAgICBKU19MT0coXCJsb2FkQUJfOlwiLCB0aGlzLl9BQk5hbWUsIGFiVXJsICApXG4gICAgICAgIGNjLmFzc2V0TWFuYWdlci5sb2FkQnVuZGxlKGFiVXJsLCAgbG9hZEFyZywgKGVyciwgYnVuZGxlKT0+IHtcbiAgICAgICAgICAgIGlmKCFpc1ZhbGlkKXsgcmV0dXJuIH0gOyAgaXNWYWxpZCA9IGZhbHNlIDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYoIWVycil7XG4gICAgICAgICAgICAgICAgSlNfTE9HKFwibG9hZEFCX09LXzpcIiwgdGhpcy5fQUJOYW1lIClcbiAgICAgICAgICAgICAgICB0aGlzLl9hYk9iaiA9IGJ1bmRsZSBcblxuICAgICAgICAgICAgICAgIGNiKClcbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICBKU19MT0coXCJsb2FkX2FiX0Vycl86XCIsIHRoaXMuX0FCTmFtZSwgSlNPTi5zdHJpbmdpZnkoZXJyKSkgXG4gICAgICAgICAgICAgICAgLy8g6ZSZ6K+v6YeN6K+VXG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoKCk9PntcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkQUIoY2IsIHZlcnNpb24pXG4gICAgICAgICAgICAgICAgfSwgMylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8vIOS4i+i9vei1hOa6kFxuICAgIHByZWxvYWRNb2R1bGUob25Qcm9ncmVzcywgb25Db21wbGV0ZSl7XG4gICAgICAgIGxldCBpc19WYWxpZCA9IHRydWVcblxuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBsZXQgYXV0b0F0bGFzID0gW11cbiAgICAgICAgbGV0IHJlc01hcCA9IHRoaXMuX2FiT2JqLl9jb25maWcuYXNzZXRJbmZvcy5fbWFwXG4gICAgICAgIGZvcihsZXQgaWR4IGluIHJlc01hcCl7XG4gICAgICAgICAgICBsZXQgaXRlbSA9IHJlc01hcFtpZHhdXG4gICAgICAgICAgICBpZighaXRlbS5wYXRoICYmIGl0ZW0ubmF0aXZlVmVyKXtcbiAgICAgICAgICAgICAgICBsZXQgdXJsbCA9IGNjLmFzc2V0TWFuYWdlci51dGlscy5nZXRVcmxXaXRoVXVpZChpdGVtLnV1aWQsIHtcbiAgICAgICAgICAgICAgICAgICAgX19uYXRpdmVOYW1lX186IFwiLnBuZ1wiLFxuICAgICAgICAgICAgICAgICAgICBuYXRpdmVFeHQ6IGNjLnBhdGguZXh0bmFtZShcIi5wbmdcIiksXG4gICAgICAgICAgICAgICAgICAgIGlzTmF0aXZlOiB0cnVlXG4gICAgICAgICAgICAgICAgfSk7IFxuICAgICAgICAgICAgICAgIGlmKHVybGwpe1xuICAgICAgICAgICAgICAgICAgICBhdXRvQXRsYXMucHVzaCh1cmxsKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIEpTX0xPRyhcImF1dG9hdGxhc191cmxfYXJyXzpcIiwgSlNPTi5zdHJpbmdpZnkoYXV0b0F0bGFzKSlcbiAgICAgICAgbGV0IGV4dE51bSA9IGF1dG9BdGxhcy5sZW5ndGggXG4gICAgICAgIGxldCBmaW5pc2hOdW0gPSAwXG4gICAgICAgIGxldCBpc18yVmFsaWQgPSB0cnVlXG4gICAgICAgIGxldCBwcmVsb2FkQXV0b0F0bGFzID0gKCk9PntcbiAgICAgICAgICAgIGlmKGF1dG9BdGxhcy5sZW5ndGggPT0gMCApeyBcbiAgICAgICAgICAgICAgICBpZighaXNfMlZhbGlkKXsgcmV0dXJuOyB9OyBpc18yVmFsaWQgPSBmYWxzZSA7XG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZSAmJiBvbkNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBSZXF1ZXN0VHlwZS5VUkwgPSAndXJsJyBcbiAgICAgICAgICAgIGNjLmFzc2V0TWFuYWdlci5wcmVsb2FkQW55KGF1dG9BdGxhcywgeyBfX3JlcXVlc3RUeXBlX186ICd1cmwnLCB0eXBlOiBudWxsLCBidW5kbGU6IHRoaXMuX2FiT2JqLm5hbWUgfSwgXG4gICAgICAgICAgICAgICAgKGZpbmlzaCwgdG90YWwsIGl0ZW0pPT57XG4gICAgICAgICAgICAgICAgICAgIGlmKCFpc18yVmFsaWQpeyByZXR1cm47IH07IFxuICAgICAgICAgICAgICAgICAgICBKU19MT0coXCJsb2FkX2F1dG9hdGxhc19wcm9ncmVzc186XCIsdGhpcy5fYWJPYmoubmFtZSwgZmluaXNoLCB0b3RhbCApXG4gICAgICAgICAgICAgICAgICAgIG9uUHJvZ3Jlc3MgJiYgb25Qcm9ncmVzcyhmaW5pc2grZmluaXNoTnVtLCB0b3RhbCtmaW5pc2hOdW0sIGl0ZW0pO1xuICAgICAgICAgICAgICAgIH0sIChlcnJvciwgaXRlbXMpPT57XG4gICAgICAgICAgICAgICAgICAgIGlmKCFpc18yVmFsaWQpeyByZXR1cm47IH07IGlzXzJWYWxpZCA9IGZhbHNlIDtcbiAgICAgICAgICAgICAgICAgICAgaWYoIWVycm9yKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ29tcGxldGUgJiYgb25Db21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgSlNfTE9HKFwicHJlbG9hZEF1dG9BdGxhc19lcnJvcjpcIiwgSlNPTi5zdHJpbmdpZnkoZXJyb3IpIClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKCgpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVsb2FkTW9kdWxlKG9uUHJvZ3Jlc3MsIG9uQ29tcGxldGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gICBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXG5cbiAgICAgICAgdGhpcy5fYWJPYmoucHJlbG9hZERpcihcInJvb3RcIiwgKGZpbmlzaCwgdG90YWwsIGl0ZW0pPT57XG4gICAgICAgICAgICBpZighaXNfVmFsaWQpeyByZXR1cm47IH07XG4gICAgICAgICAgICBmaW5pc2hOdW0gPSB0b3RhbFxuICAgICAgICAgICAgb25Qcm9ncmVzcyAmJiBvblByb2dyZXNzKGZpbmlzaCwgdG90YWwgKyBleHROdW0sIGl0ZW0pO1xuICAgICAgICB9LCAoZXJyb3IsIGl0ZW1zKT0+e1xuICAgICAgICAgICAgaWYoIWlzX1ZhbGlkKXsgcmV0dXJuOyB9OyBpc19WYWxpZCA9IGZhbHNlIDtcbiAgICAgICAgICAgIGlmKCFlcnJvcil7XG4gICAgICAgICAgICAgICAgLy8gb25Db21wbGV0ZSAmJiBvbkNvbXBsZXRlKGl0ZW1zKTtcbiAgICAgICAgICAgICAgICBwcmVsb2FkQXV0b0F0bGFzKClcbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZSgoKT0+e1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZWxvYWRNb2R1bGUob25Qcm9ncmVzcywgb25Db21wbGV0ZSk7XG4gICAgICAgICAgICAgICAgfSwgMylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgIH0sXG5cbiAgICByZWxlYXNlQUIoKXtcbiAgICAgICAgdGhpcy51bnNjaGVkdWxlQWxsQ2FsbGJhY2tzKCk7XG4gICAgICAgIGlmKCF0aGlzLl9hYk9iaiApeyByZXR1cm4gfVxuICAgICAgICBKU19MT0coXCJyZWxlYXNlX2FiX19cIikgXG4gICAgICAgIGNjLmFzc2V0TWFuYWdlci5yZW1vdmVCdW5kbGUodGhpcy5fYWJPYmopO1xuICAgICAgICB0aGlzLl9hYk9iaiA9IG51bGxcbiAgICB9LFxuXG59KTtcblxuIl19
//------QC-SOURCE-SPLIT------

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
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/HelloWorld.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '280c3rsZJJKnZ9RqbALVwtK', 'HelloWorld');
// Script/HelloWorld.js

"use strict";

window._Gloabal = {
  Client_Version: "1.0.0" //客户端大版本

};

var JS_LOG = function JS_LOG() {
  var _cc;

  for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
    arg[_key] = arguments[_key];
  }

  (_cc = cc).log.apply(_cc, ["[HelloWorld]"].concat(arg));
};

cc.Class({
  "extends": cc.Component,
  properties: {
    ModuleMagPreFab: cc.Prefab,
    moduleLayer: cc.Node,
    msgLayer: cc.Node
  },
  onDestroy: function onDestroy() {
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  },
  onLoad: function onLoad() {
    var _this = this;

    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    this.hackSysLog();
    JS_LOG("jsb_writable_:", jsb.fileUtils.getWritablePath());
    window._G_AppCom = this._AppCom = this.getComponent("AppCom"); // 配置热更新地址到 ModuleConst.js
    // 初始化

    var moduleMagObj = cc.instantiate(this.ModuleMagPreFab);
    moduleMagObj.parent = this.msgLayer;
    window._G_moduleMag = moduleMagObj.getComponent("ModuleManager");

    _G_moduleMag.initCom({
      useHotUpdate: true // 是否启用热更新 

    }); //-------------------
    // 复制包内模块到可读写路径下,避免首次加载模块时从远程完整拉取


    _G_moduleMag.execUnpackage(function () {
      _G_moduleMag.reqVersionInfo(function () {
        // 获取最新版本
        _this.reloadLobbyRoot();
      });
    }); // 定时检测更新


    _G_moduleMag.reqLoopVersionInfo();
  },
  reloadLobbyRoot: function reloadLobbyRoot() {
    var _this2 = this;

    var loadAb = ["ABLobby"]; // loadAb = ["ABLobby", "ABSubGame1", "ABSubGame2"]

    _G_moduleMag.hotUpdateMultiModule(loadAb, function () {
      // 更新模块到最新版本
      _G_moduleMag.addModule("ABLobby", function (moduleObj) {
        // 加载模块
        var abObj = moduleObj.getABObj();
        abObj.load('root/Scene/LobbyRoot', cc.Prefab, function (err, prefab) {
          // 使用模块资源 
          JS_LOG("load_lobby_prefab_:", JSON.stringify(err));

          if (_this2._lobbyRootNode) {
            _this2._lobbyRootNode.destroy();
          }

          var lobbyRoot = cc.instantiate(prefab);
          _this2._lobbyRootNode = lobbyRoot;

          _this2.moduleLayer.addChild(lobbyRoot, 100);

          lobbyRoot.getComponent("LobbyRoot").initModule();
        });
      });
    });
  },
  onKeyUp: function onKeyUp(event) {
    // 9 -- TAB  
    if (cc.sys.os == cc.sys.OS_WINDOWS && event.keyCode == 9) {
      this.hackSys_Log_Save();
    }
  },
  hackSys_Log_Save: function hackSys_Log_Save() {
    if (!this._logArr) {
      return;
    }

    ;
    var totalLen = this._logArr.length;
    var reportCo = 2000;
    var beginIdx = totalLen - reportCo;
    beginIdx = beginIdx >= 0 ? beginIdx : 0;
    var arrTemp = [];

    for (var i = beginIdx; i < totalLen; i++) {
      arrTemp.push(this._logArr[i]);
    }

    var retMsg = arrTemp.join("\n");

    if (typeof jsb != "undefined") {
      var path = jsb.fileUtils.getDefaultResourceRootPath();

      if (!path) {
        path = jsb.fileUtils.getWritablePath();
      }

      jsb.fileUtils.writeStringToFile(retMsg, path + "alogRecord.txt");
    }
  },
  hackSysLog: function hackSysLog() {
    var _excludeStr;

    if (this._initHackLog) {
      return;
    }

    ;
    this._initHackLog = true;
    var _logArr = [];
    this._logArr = _logArr;
    var MAX_STR_LEN = 1300;
    var excludeStr = (_excludeStr = {}, _excludeStr["Can't find letter definition in texture"] = 1, _excludeStr);

    var push_log = function push_log() {
      var ignore = false;

      for (var _len2 = arguments.length, arg = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        arg[_key2] = arguments[_key2];
      }

      var logStr = arg.join(" ");
      var strLen = logStr.length;

      for (var idx = 0; idx < strLen;) {
        var endIdx = idx + MAX_STR_LEN;
        var splitStr = logStr.slice(idx, endIdx);

        for (var excStr in excludeStr) {
          if (splitStr.indexOf(excStr, 0) == 0) {
            ignore = true;
            break;
          }
        }

        if (!ignore) {
          _logArr.push("_" + _logArr.length + "_=> " + splitStr + (endIdx < strLen ? "-->" : ""));
        }

        idx = endIdx;
      }

      return ignore;
    };

    var logDef = function logDef() {
      for (var _len3 = arguments.length, arg = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        arg[_key3] = arguments[_key3];
      }

      var ignore = push_log.apply(void 0, arg);

      if (!ignore) {
        var _cc$_sv_log_2_Ori;

        (_cc$_sv_log_2_Ori = cc._sv_log_2_Ori).call.apply(_cc$_sv_log_2_Ori, [cc].concat(arg));
      }
    };

    var consoleLogDef = function consoleLogDef() {
      for (var _len4 = arguments.length, arg = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        arg[_key4] = arguments[_key4];
      }

      var ignore = push_log.apply(void 0, arg);

      if (!ignore) {
        if (cc._sv_console_2_logOri) {
          var _cc$_sv_console_2_log;

          (_cc$_sv_console_2_log = cc._sv_console_2_logOri).call.apply(_cc$_sv_console_2_log, [console].concat(arg));
        }
      }
    };

    if (!cc._sv_log_2_Ori) {
      cc._sv_log_2_Ori = cc.log;
    }

    if (!cc._sv_console_2_logOri) {
      cc._sv_console_2_logOri = console.log;
    }

    cc.log = logDef;
    console.log = consoleLogDef;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvSGVsbG9Xb3JsZC5qcyJdLCJuYW1lcyI6WyJ3aW5kb3ciLCJfR2xvYWJhbCIsIkNsaWVudF9WZXJzaW9uIiwiSlNfTE9HIiwiYXJnIiwiY2MiLCJsb2ciLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJNb2R1bGVNYWdQcmVGYWIiLCJQcmVmYWIiLCJtb2R1bGVMYXllciIsIk5vZGUiLCJtc2dMYXllciIsIm9uRGVzdHJveSIsInN5c3RlbUV2ZW50Iiwib2ZmIiwiU3lzdGVtRXZlbnQiLCJFdmVudFR5cGUiLCJLRVlfVVAiLCJvbktleVVwIiwib25Mb2FkIiwib24iLCJoYWNrU3lzTG9nIiwianNiIiwiZmlsZVV0aWxzIiwiZ2V0V3JpdGFibGVQYXRoIiwiX0dfQXBwQ29tIiwiX0FwcENvbSIsImdldENvbXBvbmVudCIsIm1vZHVsZU1hZ09iaiIsImluc3RhbnRpYXRlIiwicGFyZW50IiwiX0dfbW9kdWxlTWFnIiwiaW5pdENvbSIsInVzZUhvdFVwZGF0ZSIsImV4ZWNVbnBhY2thZ2UiLCJyZXFWZXJzaW9uSW5mbyIsInJlbG9hZExvYmJ5Um9vdCIsInJlcUxvb3BWZXJzaW9uSW5mbyIsImxvYWRBYiIsImhvdFVwZGF0ZU11bHRpTW9kdWxlIiwiYWRkTW9kdWxlIiwibW9kdWxlT2JqIiwiYWJPYmoiLCJnZXRBQk9iaiIsImxvYWQiLCJlcnIiLCJwcmVmYWIiLCJKU09OIiwic3RyaW5naWZ5IiwiX2xvYmJ5Um9vdE5vZGUiLCJkZXN0cm95IiwibG9iYnlSb290IiwiYWRkQ2hpbGQiLCJpbml0TW9kdWxlIiwiZXZlbnQiLCJzeXMiLCJvcyIsIk9TX1dJTkRPV1MiLCJrZXlDb2RlIiwiaGFja1N5c19Mb2dfU2F2ZSIsIl9sb2dBcnIiLCJ0b3RhbExlbiIsImxlbmd0aCIsInJlcG9ydENvIiwiYmVnaW5JZHgiLCJhcnJUZW1wIiwiaSIsInB1c2giLCJyZXRNc2ciLCJqb2luIiwicGF0aCIsImdldERlZmF1bHRSZXNvdXJjZVJvb3RQYXRoIiwid3JpdGVTdHJpbmdUb0ZpbGUiLCJfaW5pdEhhY2tMb2ciLCJNQVhfU1RSX0xFTiIsImV4Y2x1ZGVTdHIiLCJwdXNoX2xvZyIsImlnbm9yZSIsImxvZ1N0ciIsInN0ckxlbiIsImlkeCIsImVuZElkeCIsInNwbGl0U3RyIiwic2xpY2UiLCJleGNTdHIiLCJpbmRleE9mIiwibG9nRGVmIiwiX3N2X2xvZ18yX09yaSIsImNhbGwiLCJjb25zb2xlTG9nRGVmIiwiX3N2X2NvbnNvbGVfMl9sb2dPcmkiLCJjb25zb2xlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUVBQSxNQUFNLENBQUNDLFFBQVAsR0FBa0I7QUFDZEMsRUFBQUEsY0FBYyxFQUFHLE9BREgsQ0FDYTs7QUFEYixDQUFsQjs7QUFJQSxJQUFJQyxNQUFNLEdBQUcsU0FBVEEsTUFBUyxHQUFnQjtBQUFBOztBQUFBLG9DQUFKQyxHQUFJO0FBQUpBLElBQUFBLEdBQUk7QUFBQTs7QUFDekIsU0FBQUMsRUFBRSxFQUFDQyxHQUFILGFBQU8sY0FBUCxTQUF5QkYsR0FBekI7QUFDSCxDQUZEOztBQUtBQyxFQUFFLENBQUNFLEtBQUgsQ0FBUztBQUNMLGFBQVNGLEVBQUUsQ0FBQ0csU0FEUDtBQUVMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUkMsSUFBQUEsZUFBZSxFQUFHTCxFQUFFLENBQUNNLE1BRGI7QUFHUkMsSUFBQUEsV0FBVyxFQUFHUCxFQUFFLENBQUNRLElBSFQ7QUFJUkMsSUFBQUEsUUFBUSxFQUFHVCxFQUFFLENBQUNRO0FBSk4sR0FGUDtBQVVMRSxFQUFBQSxTQVZLLHVCQVVRO0FBQ1RWLElBQUFBLEVBQUUsQ0FBQ1csV0FBSCxDQUFlQyxHQUFmLENBQW1CWixFQUFFLENBQUNhLFdBQUgsQ0FBZUMsU0FBZixDQUF5QkMsTUFBNUMsRUFBb0QsS0FBS0MsT0FBekQsRUFBa0UsSUFBbEU7QUFDSCxHQVpJO0FBYUxDLEVBQUFBLE1BQU0sRUFBRSxrQkFBWTtBQUFBOztBQUVoQmpCLElBQUFBLEVBQUUsQ0FBQ1cs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LFVBQUcsQ0FBQzRFLE1BQUosRUFBVztBQUFBOztBQUNQLDZCQUFBM0UsRUFBRSxDQUFDcUYsYUFBSCxFQUFpQkMsSUFBakIsMkJBQXNCdEYsRUFBdEIsU0FBNkJELEdBQTdCO0FBQ0g7QUFDSixLQUxEOztBQU1BLFFBQUl3RixhQUFhLEdBQUcsU0FBaEJBLGFBQWdCLEdBQWdCO0FBQUEseUNBQUp4RixHQUFJO0FBQUpBLFFBQUFBLEdBQUk7QUFBQTs7QUFDaEMsVUFBSTRFLE1BQU0sR0FBR0QsUUFBUSxNQUFSLFNBQVkzRSxHQUFaLENBQWI7O0FBQ0EsVUFBRyxDQUFDNEUsTUFBSixFQUFXO0FBQ1AsWUFBRzNFLEVBQUUsQ0FBQ3dGLG9CQUFOLEVBQTRCO0FBQUE7O0FBQUUsbUNBQUF4RixFQUFFLENBQUN3RixvQkFBSCxFQUF3QkYsSUFBeEIsK0JBQTZCRyxPQUE3QixTQUF3QzFGLEdBQXhDO0FBQStDO0FBQ2hGO0FBQ0osS0FMRDs7QUFNQSxRQUFHLENBQUNDLEVBQUUsQ0FBQ3FGLGFBQVAsRUFBcUI7QUFBRXJGLE1BQUFBLEVBQUUsQ0FBQ3FGLGFBQUgsR0FBbUJyRixFQUFFLENBQUNDLEdBQXRCO0FBQTRCOztBQUNuRCxRQUFHLENBQUNELEVBQUUsQ0FBQ3dGLG9CQUFQLEVBQTRCO0FBQUV4RixNQUFBQSxFQUFFLENBQUN3RixvQkFBSCxHQUEwQkMsT0FBTyxDQUFDeEYsR0FBbEM7QUFBd0M7O0FBQ3RFRCxJQUFBQSxFQUFFLENBQUNDLEdBQUgsR0FBY21GLE1BQWQ7QUFDQUssSUFBQUEsT0FBTyxDQUFDeEYsR0FBUixHQUFjc0YsYUFBZDtBQUNIO0FBcEpJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIlxuXG53aW5kb3cuX0dsb2FiYWwgPSB7IFxuICAgIENsaWVudF9WZXJzaW9uIDogXCIxLjAuMFwiICwgLy/lrqLmiLfnq6/lpKfniYjmnKxcbn1cblxubGV0IEpTX0xPRyA9IGZ1bmN0aW9uKC4uLmFyZyl7IFxuICAgIGNjLmxvZyhcIltIZWxsb1dvcmxkXVwiLC4uLmFyZykgOyBcbn1cblxuXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LCBcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIE1vZHVsZU1hZ1ByZUZhYiA6IGNjLlByZWZhYiAsXG5cbiAgICAgICAgbW9kdWxlTGF5ZXIgOiBjYy5Ob2RlICwgXG4gICAgICAgIG1zZ0xheWVyIDogY2MuTm9kZSAsXG5cbiAgICB9LFxuXG4gICAgb25EZXN0cm95ICgpIHsgXG4gICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9mZihjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX1VQLCB0aGlzLm9uS2V5VXAsIHRoaXMpO1xuICAgIH0sXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7ICBcblxuICAgICAgICBjYy5zeXN0ZW1FdmVudC5vbihjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX1VQLCB0aGlzLm9uS2V5VXAsIHRoaXMpO1xuICAgICAgICB0aGlzLmhhY2tTeXNMb2coKVxuICAgICAgICBKU19MT0coXCJqc2Jfd3JpdGFibGVfOlwiLCBqc2IuZmlsZVV0aWxzLmdldFdyaXRhYmxlUGF0aCgpIClcblxuICAgICAgICB3aW5kb3cuX0dfQXBwQ29tID0gdGhpcy5fQXBwQ29tID0gdGhpcy5nZXRDb21wb25lbnQoXCJBcHBDb21cIilcblxuXG4gICAgICAgIC8vIOmFjee9rueDreabtOaWsOWcsOWdgOWIsCBNb2R1bGVDb25zdC5qc1xuICAgICAgICAvLyDliJ3lp4vljJZcbiAgICAgICAgbGV0IG1vZHVsZU1hZ09iaiAgICA9IGNjLmluc3RhbnRpYXRlKHRoaXMuTW9kdWxlTWFnUHJlRmFiKVxuICAgICAgICBtb2R1bGVNYWdPYmoucGFyZW50ID0gdGhpcy5tc2dMYXllciAgXG4gICAgICAgIHdpbmRvdy5fR19tb2R1bGVNYWcgPSBtb2R1bGVNYWdPYmouZ2V0Q29tcG9uZW50KFwiTW9kdWxlTWFuYWdlclwiKSAgXG4gICAgICAgIF9HX21vZHVsZU1hZy5pbml0Q29tKHtcbiAgICAgICAgICAgIHVzZUhvdFVwZGF0ZSA6IHRydWUgLCAgICAgLy8g5piv5ZCm5ZCv55So54Ot5pu05pawIFxuICAgICAgICB9KSBcbiAgICAgICAgXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8vIOWkjeWItuWMheWGheaooeWdl+WIsOWPr+ivu+WGmei3r+W+hOS4iyzpgb/lhY3pppbmrKHliqDovb3mqKHlnZfml7bku47ov5znqIvlrozmlbTmi4nlj5ZcbiAgICAgICAgX0dfbW9kdWxlTWFnLmV4ZWNVbnBhY2thZ2UoKCk9PntcblxuICAgICAgICAgICAgX0dfbW9kdWxlTWFnLnJlcVZlcnNpb25JbmZvKCgpPT57IC8vIOiOt+WPluacgOaWsOeJiOacrFxuICAgICAgICAgICAgICAgIHRoaXMucmVsb2FkTG9iYnlSb290KClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8g5a6a5pe25qOA5rWL5pu05pawXG4gICAgICAgIF9HX21vZHVsZU1hZy5yZXFMb29wVmVyc2lvbkluZm8oKSBcblxuICAgIH0sXG5cbiAgICByZWxvYWRMb2JieVJvb3QoKXtcblxuICAgICAgICBsZXQgbG9hZEFiID0gW1wiQUJMb2JieVwiXVxuICAgICAgICAvLyBsb2FkQWIgPSBbXCJBQkxvYmJ5XCIsIFwiQUJTdWJHYW1lMVwiLCBcIkFCU3ViR2FtZTJcIl1cbiAgICAgICAgX0dfbW9kdWxlTWFnLmhvdFVwZGF0ZU11bHRpTW9kdWxlKGxvYWRBYiwoKT0+eyAvLyDmm7TmlrDmqKHlnZfliLDmnIDmlrDniYjmnKxcblxuICAgICAgICAgICAgX0dfbW9kdWxlTWFnLmFkZE1vZHVsZShcIkFCTG9iYnlcIiwgKG1vZHVsZU9iaik9PnsgLy8g5Yqg6L295qih5Z2XXG5cbiAgICAgICAgICAgICAgICBsZXQgYWJPYmogPSBtb2R1bGVPYmouZ2V0QUJPYmooKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGFiT2JqLmxvYWQoJ3Jvb3QvU2NlbmUvTG9iYnlSb290JywgY2MuUHJlZmFiLCAoZXJyLCBwcmVmYWIpPT57ICAvLyDkvb/nlKjmqKHlnZfotYTmupAgXG5cbiAgICAgICAgICAgICAgICAgICAgSlNfTE9HKFwibG9hZF9sb2JieV9wcmVmYWJfOlwiLCBKU09OLnN0cmluZ2lmeShlcnIpIClcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fbG9iYnlSb290Tm9kZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2JieVJvb3ROb2RlLmRlc3Ryb3koKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxldCBsb2JieVJvb3QgPSBjYy5pbnN0YW50aWF0ZShwcmVmYWIpIFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2JieVJvb3ROb2RlID0gbG9iYnlSb290XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW9kdWxlTGF5ZXIuYWRkQ2hpbGQobG9iYnlSb290LCAxMDApXG4gICAgICAgICAgICAgICAgICAgIGxvYmJ5Um9vdC5nZXRDb21wb25lbnQoXCJMb2JieVJvb3RcIikuaW5pdE1vZHVsZSgpICAgIFxuICAgIFxuICAgICAgICAgICAgICAgIH0pIFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9LFxuXG5cblxuICAgIG9uS2V5VXAoZXZlbnQpIHsgXG4gICAgICAgIC8vIDkgLS0gVEFCICBcbiAgICAgICAgaWYoY2Muc3lzLm9zPT1jYy5zeXMuT1NfV0lORE9XUyAmJiBldmVudC5rZXlDb2RlPT05KXtcbiAgICAgICAgICAgIHRoaXMuaGFja1N5c19Mb2dfU2F2ZSgpXG4gICAgICAgIH0gXG4gICAgfSxcbiAgICBoYWNrU3lzX0xvZ19TYXZlKCl7XG4gICAgICAgIGlmKCF0aGlzLl9sb2dBcnIpeyByZXR1cm4gOyB9O1xuXG4gICAgICAgIGxldCB0b3RhbExlbiA9IHRoaXMuX2xvZ0Fyci5sZW5ndGhcbiAgICAgICAgbGV0IHJlcG9ydENvID0gMjAwMFxuICAgICAgICBsZXQgYmVnaW5JZHggPSB0b3RhbExlbi1yZXBvcnRDb1xuICAgICAgICBiZWdpbklkeCA9IGJlZ2luSWR4Pj0wP2JlZ2luSWR4OjBcbiAgICAgICAgbGV0IGFyclRlbXAgPSBbXVxuXG4gICAgICAgIGZvcihsZXQgaT1iZWdpbklkeDsgaTx0b3RhbExlbjsgaSsrKXtcbiAgICAgICAgICAgIGFyclRlbXAucHVzaCh0aGlzLl9sb2dBcnJbaV0pXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmV0TXNnID0gYXJyVGVtcC5qb2luKFwiXFxuXCIpXG4gICAgICAgIGlmKHR5cGVvZiBqc2IhPVwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgbGV0IHBhdGggPSBqc2IuZmlsZVV0aWxzLmdldERlZmF1bHRSZXNvdXJjZVJvb3RQYXRoKClcbiAgICAgICAgICAgIGlmKCFwYXRoKXtcbiAgICAgICAgICAgICAgICBwYXRoID0ganNiLmZpbGVVdGlscy5nZXRXcml0YWJsZVBhdGgoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBqc2IuZmlsZVV0aWxzLndyaXRlU3RyaW5nVG9GaWxlKHJldE1zZywgcGF0aCArIFwiYWxvZ1JlY29yZC50eHRcIilcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaGFja1N5c0xvZygpe1xuXG4gICAgICAgIGlmKHRoaXMuX2luaXRIYWNrTG9nKXsgcmV0dXJuIDsgfSA7IHRoaXMuX2luaXRIYWNrTG9nID0gdHJ1ZSA7IFxuICAgICAgICBsZXQgX2xvZ0FyciA9IFtdXG4gICAgICAgIHRoaXMuX2xvZ0FyciA9IF9sb2dBcnIgXG4gICAgICAgIGxldCBNQVhfU1RSX0xFTiA9IDEzMDAgXG4gICAgICAgIGxldCBleGNsdWRlU3RyID0geyBbXCJDYW4ndCBmaW5kIGxldHRlciBkZWZpbml0aW9uIGluIHRleHR1cmVcIl06MSB9IFxuICAgICAgICBsZXQgcHVzaF9sb2cgPSBmdW5jdGlvbiguLi5hcmcpeyAgXG4gICAgICAgICAgICBsZXQgaWdub3JlID0gZmFsc2VcbiAgICAgICAgICAgIGxldCBsb2dTdHIgPSBhcmcuam9pbihcIiBcIilcbiAgICAgICAgICAgIGxldCBzdHJMZW4gPSBsb2dTdHIubGVuZ3RoXG4gICAgICAgICAgICBmb3IobGV0IGlkeCA9IDA7aWR4PHN0ckxlbjspe1xuICAgICAgICAgICAgICAgIGxldCBlbmRJZHggPSBpZHgrTUFYX1NUUl9MRU5cblxuICAgICAgICAgICAgICAgIGxldCBzcGxpdFN0ciA9IGxvZ1N0ci5zbGljZShpZHgsIGVuZElkeClcbiAgICAgICAgICAgICAgICBmb3IobGV0IGV4Y1N0ciBpbiAgZXhjbHVkZVN0cil7XG4gICAgICAgICAgICAgICAgICAgIGlmKCBzcGxpdFN0ci5pbmRleE9mKGV4Y1N0ciwgMCkgPT0gMCApe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWdub3JlID0gdHJ1ZSBcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrIFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKCAhaWdub3JlICl7XG4gICAgICAgICAgICAgICAgICAgIF9sb2dBcnIucHVzaChcIl9cIitfbG9nQXJyLmxlbmd0aCtcIl89PiBcIisgc3BsaXRTdHIgKyhlbmRJZHg8c3RyTGVuP1wiLS0+XCI6XCJcIikpIFxuICAgICAgICAgICAgICAgIH0gXG5cbiAgICAgICAgICAgICAgICBpZHggPSBlbmRJZHhcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgICByZXR1cm4gaWdub3JlXG4gICAgICAgIH0gXG4gICAgICAgIGxldCBsb2dEZWYgPSBmdW5jdGlvbiguLi5hcmcpeyBcbiAgICAgICAgICAgIGxldCBpZ25vcmUgPSBwdXNoX2xvZyguLi5hcmcpXG4gICAgICAgICAgICBpZighaWdub3JlKXtcbiAgICAgICAgICAgICAgICBjYy5fc3ZfbG9nXzJfT3JpLmNhbGwoY2MsIC4uLmFyZylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgY29uc29sZUxvZ0RlZiA9IGZ1bmN0aW9uKC4uLmFyZyl7IFxuICAgICAgICAgICAgbGV0IGlnbm9yZSA9IHB1c2hfbG9nKC4uLmFyZykgXG4gICAgICAgICAgICBpZighaWdub3JlKXtcbiAgICAgICAgICAgICAgICBpZihjYy5fc3ZfY29uc29sZV8yX2xvZ09yaSkgeyBjYy5fc3ZfY29uc29sZV8yX2xvZ09yaS5jYWxsKGNvbnNvbGUsLi4uYXJnICkgfVxuICAgICAgICAgICAgfSBcbiAgICAgICAgfVxuICAgICAgICBpZighY2MuX3N2X2xvZ18yX09yaSl7IGNjLl9zdl9sb2dfMl9PcmkgPSBjYy5sb2cgIH1cbiAgICAgICAgaWYoIWNjLl9zdl9jb25zb2xlXzJfbG9nT3JpKXsgY2MuX3N2X2NvbnNvbGVfMl9sb2dPcmkgPSBjb25zb2xlLmxvZyAgfVxuICAgICAgICBjYy5sb2cgICAgICA9IGxvZ0RlZlxuICAgICAgICBjb25zb2xlLmxvZyA9IGNvbnNvbGVMb2dEZWZcbiAgICB9LFxuXG5cbn0pO1xuIl19
//------QC-SOURCE-SPLIT------

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
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/AppConst.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'f2b74+9zb9H/6tjSd23XYzc', 'AppConst');
// Script/AppConst.js

"use strict";

// let AppConst = require("AppConst")
var AppConst = {};
module.exports = AppConst;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvQXBwQ29uc3QuanMiXSwibmFtZXMiOlsiQXBwQ29uc3QiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUdBO0FBQ0EsSUFBSUEsUUFBUSxHQUFHLEVBQWY7QUFLQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCRixRQUFqQiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiXG5cblxuLy8gbGV0IEFwcENvbnN0ID0gcmVxdWlyZShcIkFwcENvbnN0XCIpXG5sZXQgQXBwQ29uc3QgPSB7XG5cdFxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcENvbnN0XG5cblxuIl19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/ModuleMag/UnpackageHelper.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '9f4ddWutyZMXK1fvn7MXuH9', 'UnpackageHelper');
// Script/ModuleMag/UnpackageHelper.js

"use strict";

var ModuleConst = require("ModuleConst"); // let UnpackageHelper = require("UnpackageHelper")


var JS_LOG = function JS_LOG() {
  var _cc;

  for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
    arg[_key] = arguments[_key];
  }

  (_cc = cc).log.apply(_cc, ["[UnpackageHelper]"].concat(arg));
};

cc.Class({
  "extends": cc.Component,
  properties: {},
  onLoad: function onLoad() {
    this._moduleMag = this.getComponent("ModuleManager");
    this._ModuleCom = this.getComponent("ModuleCom");
    this._HotUIHelper = this.getComponent("HotUIHelper");
  },
  initCom: function initCom(args) {// let {  } = args     
  },
  execUnpackage: function execUnpackage(onComplete) {
    var _this = this;

    if (!(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_WINDOWS)) {
      JS_LOG("ignore_unpackage");
      onComplete();
      return;
    }

    var localClientVer = cc.sys.localStorage.getItem(ModuleConst.localClientVer);
    var writablePath = jsb.fileUtils.getWritablePath();
    var path_cache = writablePath + "gamecaches/";

    if (_Gloabal.Client_Version == localClientVer && jsb.fileUtils.isFileExist(path_cache + "cacheList.json")) {
      JS_LOG("Unpackage_not_exec");
      onComplete();
      return;
    } else {
      // 第一次启动该版本
      var nativeRoot = this._moduleMag.getNativePath(); //  


      var path_native = nativeRoot + "PKgamecaches/";
      JS_LOG("unpackage_res_:", path_native, path_cache);

      if (!jsb.fileUtils.isDirectoryExist(path_native)) {
        JS_LOG("PKgamecaches_not_exist");
        cc.sys.localStorage.setItem(ModuleConst.localClientVer, _Gloabal.Client_Version);
        onComplete();
        return;
      } //-------------------------------------------------->>  替换 cacheManager 数据


      var cacheMag = cc.assetManager.cacheManager; // cacheMag.clearCache()

      var coverCachelist = function coverCachelist() {
        var fileStr = jsb.fileUtils.getStringFromFile(path_native + "cacheList.json");
        var abVersion = {};
        var cache_d_Map = JSON.parse(fileStr);

        if (cache_d_Map) {
          var files = cache_d_Map.files;

          for (var id in files) {
            var info = files[id]; // JS_LOG("call_cacheFile_:", id, info.url, info.bundle )

            cacheMag.cacheFile(id, info.url, info.bundle); // 查找版本号

            if (id.indexOf("/index.") != -1) {
              var splitRet = id.split('.');
              abVersion[info.bundle] = splitRet[splitRet.length - 2];
            }
          }
        } // 覆盖本地资源版本号 


        JS_LOG("abVersion__:", JSON.stringify(abVersion));
        cacheMag.writeCacheFile(function () {
          JS_LOG("writeCache_File_ok");

          _this._moduleMag.setLocalAbVersion(abVersion);

          cc.sys.localStorage.setItem(ModuleConst.localClientVer, _Gloabal.Client_Version);
          onComplete();
        });
      }; //--------------------------------------------------<<  替换 cacheManager 数据


      this._HotUIHelper.unpackageShow();

      this.copyFoldTo(path_native, path_cache, function (finish, total) {
        _this._HotUIHelper.unpackageUpdateProgress(finish, total); // JS_LOG("copy_file_:", finish, total)

      }, function () {
        // 完成 
        _this._HotUIHelper.unpackageFinish();

        coverCachelist();
      });
    }
  },
  getFileListFromDir: function getFileListFromDir(dir, filelist) {
    var co = 1;

    if (cc.sys.os == cc.sys.OS_ANDROID) {
      var cacheJson = jsb.fileUtils.getStringFromFile(dir + "cacheList.json");
      var cacheMap = JSON.parse(cacheJson);
      var files = cacheMap.files;

      for (var url in files) {
        var item = files[url];
        var fullpath = this._moduleMag.getNativePath() + "PKgamecaches/" + item.url;
        filelist.push(fullpath);

        if (co < 3) {
          console.log("get_file_list_full_:", fullpath);
        }

        co = co + 1;
      }
    } else {
      jsb.fileUtils.listFilesRecursively(dir, filelist);
    }
  },
  // 拷贝文件夹到 copyFoldTo("/path1/src/", "/path2/src/") 
  copyFoldTo: function copyFoldTo(oriRoot, copyTo, onProgress, onComplate) {
    var _this2 = this;

    var eachFrameCopyNum = 5; // 每帧复制文件数

    if (typeof jsb == "undefined" || !jsb.fileUtils.isDirectoryExist(oriRoot)) {
      cc.log("ori_folder_not_exist_:", oriRoot);
      onComplate();
      return;
    }

    var filelist = [];
    this.getFileListFromDir(oriRoot, filelist);
    cc.log("file_ori_arr_:", oriRoot, filelist.length);
    var realFileArr = [];

    for (var i = 0; i < filelist.length; i++) {
      var path = filelist[i];

      if (path.substr(path.length - 1) != "/") {
        realFileArr.push(path);
      }
    }

    var totalLen = realFileArr.length;

    if (totalLen == 0) {
      cc.log("totalLen_is_0:", oriRoot);
      onComplate();
      return;
    }

    var curMisIndex = 0;
    var _schHandler = "";

    _schHandler = function schHandler() {
      for (var _i = curMisIndex; _i < curMisIndex + eachFrameCopyNum; _i++) {
        if (_i >= totalLen) {
          _this2.unschedule(_schHandler);

          onComplate();
          return;
        }

        var _path = realFileArr[_i];

        var subPath = _path.substr(oriRoot.length); // 后半部分路径 import/00/00.7871f.json


        var fileName = _path.substr(_path.lastIndexOf("\/") + 1); // 文件名 00.7871f.json


        var targetPath = copyTo + subPath; // 目标完整路径

        var newFold = targetPath.substr(0, targetPath.lastIndexOf("\/") + 1); // 目标文件夹

        if (!jsb.fileUtils.isDirectoryExist(newFold)) {
          // 文件夹不存在则创建 
          jsb.fileUtils.createDirectory(newFold);
        }

        var fileData = jsb.fileUtils.getDataFromFile(_path);
        var saveRet = jsb.fileUtils.writeDataToFile(fileData, targetPath);

        if (!saveRet) {
          _this2.unschedule(_schHandler);

          return;
        }
      }

      curMisIndex = curMisIndex + eachFrameCopyNum;
      onProgress(curMisIndex <= totalLen ? curMisIndex : totalLen, totalLen);
    };

    this.schedule(_schHandler, 0);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvTW9kdWxlTWFnL1VucGFja2FnZUhlbHBlci5qcyJdLCJuYW1lcyI6WyJNb2R1bGVDb25zdCIsInJlcXVpcmUiLCJKU19MT0ciLCJhcmciLCJjYyIsImxvZyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsIm9uTG9hZCIsIl9tb2R1bGVNYWciLCJnZXRDb21wb25lbnQiLCJfTW9kdWxlQ29tIiwiX0hvdFVJSGVscGVyIiwiaW5pdENvbSIsImFyZ3MiLCJleGVjVW5wYWNrYWdlIiwib25Db21wbGV0ZSIsInN5cyIsIm9zIiwiT1NfQU5EUk9JRCIsIk9TX0lPUyIsIk9TX1dJTkRPV1MiLCJsb2NhbENsaWVudFZlciIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJ3cml0YWJsZVBhdGgiLCJqc2IiLCJmaWxlVXRpbHMiLCJnZXRXcml0YWJsZVBhdGgiLCJwYXRoX2NhY2hlIiwiX0dsb2FiYWwiLCJDbGllbnRfVmVyc2lvbiIsImlzRmlsZUV4aXN0IiwibmF0aXZlUm9vdCIsImdldE5hdGl2ZVBhdGgiLCJwYXRoX25hdGl2ZSIsImlzRGlyZWN0b3J5RXhpc3QiLCJzZXRJdGVtIiwiY2FjaGVNYWciLCJhc3NldE1hbmFnZXIiLCJjYWNoZU1hbmFnZXIiLCJjb3ZlckNhY2hlbGlzdCIsImZpbGVTdHIiLCJnZXRTdHJpbmdGcm9tRmlsZSIsImFiVmVyc2lvbiIsImNhY2hlX2RfTWFwIiwiSlNPTiIsInBhcnNlIiwiZmlsZXMiLCJpZCIsImluZm8iLCJjYWNoZUZpbGUiLCJ1cmwiLCJidW5kbGUiLCJpbmRleE9mIiwic3BsaXRSZXQiLCJzcGxpdCIsImxlbmd0aCIsInN0cmluZ2lmeSIsIndyaXRlQ2FjaGVGaWxlIiwic2V0TG9jYWxBYlZlcnNpb24iLCJ1bnBhY2thZ2VTaG93IiwiY29weUZvbGRUbyIsImZpbmlzaCIsInRvdGFsIiwidW5wYWNrYWdlVXBkYXRlUHJvZ3Jlc3MiLCJ1bnBhY2thZ2VGaW5pc2giLCJnZXRGaWxlTGlzdEZyb21EaXIiLCJkaXIiLCJmaWxlbGlzdCIsImNvIiwiY2FjaGVKc29uIiwiY2FjaGVNYXAiLCJpdGVtIiwiZnVsbHBhdGgiLCJwdXNoIiwiY29uc29sZSIsImxpc3RGaWxlc1JlY3Vyc2l2ZWx5Iiwib3JpUm9vdCIsImNvcHlUbyIsIm9uUHJvZ3Jlc3MiLCJvbkNvbXBsYXRlIiwiZWFjaEZyYW1lQ29weU51bSIsInJlYWxGaWxlQXJyIiwiaSIsInBhdGgiLCJzdWJzdHIiLCJ0b3RhbExlbiIsImN1ck1pc0luZGV4Iiwic2NoSGFuZGxlciIsInVuc2NoZWR1bGUiLCJzdWJQYXRoIiwiZmlsZU5hbWUiLCJsYXN0SW5kZXhPZiIsInRhcmdldFBhdGgiLCJuZXdGb2xkIiwiY3JlYXRlRGlyZWN0b3J5IiwiZmlsZURhdGEiLCJnZXREYXRhRnJvbUZpbGUiLCJzYXZlUmV0Iiwid3JpdGVEYXRhVG9GaWxlIiwic2NoZWR1bGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBSUEsV0FBVyxHQUFHQyxPQUFPLENBQUMsYUFBRCxDQUF6QixFQUNBOzs7QUFDQSxJQUFJQyxNQUFNLEdBQUcsU0FBVEEsTUFBUyxHQUFnQjtBQUFBOztBQUFBLG9DQUFKQyxHQUFJO0FBQUpBLElBQUFBLEdBQUk7QUFBQTs7QUFDekIsU0FBQUMsRUFBRSxFQUFDQyxHQUFILGFBQU8sbUJBQVAsU0FBOEJGLEdBQTlCO0FBQ0gsQ0FGRDs7QUFJQUMsRUFBRSxDQUFDRSxLQUFILENBQVM7QUFFTCxhQUFTRixFQUFFLENBQUNHLFNBRlA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFLEVBSFA7QUFRTEMsRUFBQUEsTUFSSyxvQkFRRztBQUNKLFNBQUtDLFVBQUwsR0FBa0IsS0FBS0MsWUFBTCxDQUFrQixlQUFsQixDQUFsQjtBQUNBLFNBQUtDLFVBQUwsR0FBa0IsS0FBS0QsWUFBTCxDQUFrQixXQUFsQixDQUFsQjtBQUNBLFNBQUtFLFlBQUwsR0FBb0IsS0FBS0YsWUFBTCxDQUFrQixhQUFsQixDQUFwQjtBQUNILEdB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QUFHTixnQkFBNUI7QUFFQUYsTUFBQUEsVUFBVSxDQUFHUSxXQUFXLElBQUVELFFBQWIsR0FBdUJDLFdBQXZCLEdBQXFDRCxRQUF4QyxFQUFtREEsUUFBbkQsQ0FBVjtBQUVILEtBakNEOztBQWtDQSxTQUFLYyxRQUFMLENBQWNaLFdBQWQsRUFBMEIsQ0FBMUI7QUFFSDtBQXJNSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJcblxubGV0IE1vZHVsZUNvbnN0ID0gcmVxdWlyZShcIk1vZHVsZUNvbnN0XCIpXG4vLyBsZXQgVW5wYWNrYWdlSGVscGVyID0gcmVxdWlyZShcIlVucGFja2FnZUhlbHBlclwiKVxubGV0IEpTX0xPRyA9IGZ1bmN0aW9uKC4uLmFyZyl7IFxuICAgIGNjLmxvZyhcIltVbnBhY2thZ2VIZWxwZXJdXCIsLi4uYXJnKSA7IFxufVxuXG5jYy5DbGFzcyh7XG4gICAgXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICAgIHByb3BlcnRpZXM6IHsgICBcblxuICAgIH0sXG5cbiAgICBcbiAgICBvbkxvYWQoKXtcbiAgICAgICAgdGhpcy5fbW9kdWxlTWFnID0gdGhpcy5nZXRDb21wb25lbnQoXCJNb2R1bGVNYW5hZ2VyXCIpXG4gICAgICAgIHRoaXMuX01vZHVsZUNvbSA9IHRoaXMuZ2V0Q29tcG9uZW50KFwiTW9kdWxlQ29tXCIpXG4gICAgICAgIHRoaXMuX0hvdFVJSGVscGVyID0gdGhpcy5nZXRDb21wb25lbnQoXCJIb3RVSUhlbHBlclwiKSBcbiAgICB9LFxuXG5cbiAgICBpbml0Q29tKGFyZ3Mpe1xuICAgICAgICAvLyBsZXQgeyAgfSA9IGFyZ3MgICAgIFxuXG4gICAgfSxcblxuICAgIGV4ZWNVbnBhY2thZ2Uob25Db21wbGV0ZSl7XG5cbiAgICAgICAgaWYgKCAhKGNjLnN5cy5vcyA9PSBjYy5zeXMuT1NfQU5EUk9JRCB8fCBjYy5zeXMub3MgPT0gY2Muc3lzLk9TX0lPUyB8fCBjYy5zeXMub3MgPT0gY2Muc3lzLk9TX1dJTkRPV1MpICkge1xuICAgICAgICAgICAgSlNfTE9HKFwiaWdub3JlX3VucGFja2FnZVwiKVxuICAgICAgICAgICAgb25Db21wbGV0ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIFxuICAgICAgICB9IFxuXG4gICAgICAgIGxldCBsb2NhbENsaWVudFZlciA9IGNjLnN5cy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShNb2R1bGVDb25zdC5sb2NhbENsaWVudFZlcilcbiAgICAgICAgbGV0IHdyaXRhYmxlUGF0aCA9IGpzYi5maWxlVXRpbHMuZ2V0V3JpdGFibGVQYXRoKCkgXG4gICAgICAgIGxldCBwYXRoX2NhY2hlICA9IHdyaXRhYmxlUGF0aCArIFwiZ2FtZWNhY2hlcy9cIiBcbiAgICAgICAgXG4gICAgICAgIGlmKCBfR2xvYWJhbC5DbGllbnRfVmVyc2lvbiA9PSBsb2NhbENsaWVudFZlciAmJiBqc2IuZmlsZVV0aWxzLmlzRmlsZUV4aXN0KHBhdGhfY2FjaGUrXCJjYWNoZUxpc3QuanNvblwiKSl7XG4gICAgICAgICAgICBKU19MT0coXCJVbnBhY2thZ2Vfbm90X2V4ZWNcIilcbiAgICAgICAgICAgIG9uQ29tcGxldGUoKVxuICAgICAgICAgICAgcmV0dXJuIDsgXG5cbiAgICAgICAgfWVsc2UgeyBcbiAgICAgICAgICAgIC8vIOesrOS4gOasoeWQr+WKqOivpeeJiOacrFxuICAgICAgICAgICAgbGV0IG5hdGl2ZVJvb3QgPSB0aGlzLl9tb2R1bGVNYWcuZ2V0TmF0aXZlUGF0aCgpIC8vICBcblxuICAgICAgICAgICAgbGV0IHBhdGhfbmF0aXZlID0gbmF0aXZlUm9vdCArIFwiUEtnYW1lY2FjaGVzL1wiXG4gICAgICAgICAgICBKU19MT0coXCJ1bnBhY2thZ2VfcmVzXzpcIiwgcGF0aF9uYXRpdmUsIHBhdGhfY2FjaGUgKVxuXG4gICAgICAgICAgICBpZighanNiLmZpbGVVdGlscy5pc0RpcmVjdG9yeUV4aXN0KHBhdGhfbmF0aXZlKSl7XG4gICAgICAgICAgICAgICAgSlNfTE9HKFwiUEtnYW1lY2FjaGVzX25vdF9leGlzdFwiKVxuICAgICAgICAgICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShNb2R1bGVDb25zdC5sb2NhbENsaWVudFZlciwgX0dsb2FiYWwuQ2xpZW50X1ZlcnNpb24gKVxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGUoKVxuICAgICAgICAgICAgICAgIHJldHVybiA7IFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLT4+ICDmm7/mjaIgY2FjaGVNYW5hZ2VyIOaVsOaNrlxuICAgICAgICAgICAgbGV0IGNhY2hlTWFnID0gY2MuYXNzZXRNYW5hZ2VyLmNhY2hlTWFuYWdlclxuICAgICAgICAgICAgLy8gY2FjaGVNYWcuY2xlYXJDYWNoZSgpXG5cbiAgICAgICAgICAgIGxldCBjb3ZlckNhY2hlbGlzdCA9ICgpPT57XG4gICAgICAgICAgICAgICAgbGV0IGZpbGVTdHIgPSBqc2IuZmlsZVV0aWxzLmdldFN0cmluZ0Zyb21GaWxlKHBhdGhfbmF0aXZlICsgXCJjYWNoZUxpc3QuanNvblwiKSAgXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbGV0IGFiVmVyc2lvbiA9IHt9IFxuXG4gICAgICAgICAgICAgICAgdmFyIGNhY2hlX2RfTWFwID0gSlNPTi5wYXJzZShmaWxlU3RyKVxuICAgICAgICAgICAgICAgIGlmKGNhY2hlX2RfTWFwKXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbGVzID0gY2FjaGVfZF9NYXAuZmlsZXNcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBpZCBpbiAgZmlsZXMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluZm8gPSBmaWxlc1tpZF1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEpTX0xPRyhcImNhbGxfY2FjaGVGaWxlXzpcIiwgaWQsIGluZm8udXJsLCBpbmZvLmJ1bmRsZSApXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZU1hZy5jYWNoZUZpbGUoaWQsIGluZm8udXJsLCBpbmZvLmJ1bmRsZSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5p+l5om+54mI5pys5Y+3XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihpZC5pbmRleE9mKFwiL2luZGV4LlwiKSAhPSAtMSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNwbGl0UmV0ID0gaWQuc3BsaXQoJy4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFiVmVyc2lvbltpbmZvLmJ1bmRsZV0gPSBzcGxpdFJldFtzcGxpdFJldC5sZW5ndGgtMl1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIOimhuebluacrOWcsOi1hOa6kOeJiOacrOWPtyBcbiAgICAgICAgICAgICAgICBKU19MT0coXCJhYlZlcnNpb25fXzpcIiwgSlNPTi5zdHJpbmdpZnkoYWJWZXJzaW9uKSApXG5cbiAgICAgICAgICAgICAgICBjYWNoZU1hZy53cml0ZUNhY2hlRmlsZSgoKT0+e1xuXG4gICAgICAgICAgICAgICAgICAgIEpTX0xPRyhcIndyaXRlQ2FjaGVfRmlsZV9va1wiKVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21vZHVsZU1hZy5zZXRMb2NhbEFiVmVyc2lvbihhYlZlcnNpb24pXG5cblxuICAgICAgICAgICAgICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oTW9kdWxlQ29uc3QubG9jYWxDbGllbnRWZXIsIF9HbG9hYmFsLkNsaWVudF9WZXJzaW9uIClcbiAgICAgICAgICAgICAgICAgICAgb25Db21wbGV0ZSgpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS08PCAg5pu/5o2iIGNhY2hlTWFuYWdlciDmlbDmja5cblxuICAgICAgICAgICAgdGhpcy5fSG90VUlIZWxwZXIudW5wYWNrYWdlU2hvdygpXG4gICAgICAgICAgICB0aGlzLmNvcHlGb2xkVG8ocGF0aF9uYXRpdmUsIHBhdGhfY2FjaGUsIChmaW5pc2gsIHRvdGFsKT0+e1xuICAgICAgICAgICAgICAgIHRoaXMuX0hvdFVJSGVscGVyLnVucGFja2FnZVVwZGF0ZVByb2dyZXNzKGZpbmlzaCwgdG90YWwpXG4gICAgICAgICAgICAgICAgLy8gSlNfTE9HKFwiY29weV9maWxlXzpcIiwgZmluaXNoLCB0b3RhbClcbiAgICAgICAgICAgIH0sKCk9PntcbiAgICAgICAgICAgICAgICAvLyDlrozmiJAgXG4gICAgICAgICAgICAgICAgdGhpcy5fSG90VUlIZWxwZXIudW5wYWNrYWdlRmluaXNoKCkgIFxuICAgICAgICAgICAgICAgIGNvdmVyQ2FjaGVsaXN0KClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuXG4gICAgfSxcblxuXG4gICAgZ2V0RmlsZUxpc3RGcm9tRGlyKGRpciwgZmlsZWxpc3Qpe1xuICAgICAgICBsZXQgY28gPSAxXG4gICAgICAgIGlmKGNjLnN5cy5vcyA9PSBjYy5zeXMuT1NfQU5EUk9JRCl7XG4gICAgICAgICAgICBsZXQgY2FjaGVKc29uID0ganNiLmZpbGVVdGlscy5nZXRTdHJpbmdGcm9tRmlsZShkaXIgKyBcImNhY2hlTGlzdC5qc29uXCIpXG4gICAgICAgICAgICBsZXQgY2FjaGVNYXAgPSBKU09OLnBhcnNlKGNhY2hlSnNvbilcbiAgICAgICAgICAgIGxldCBmaWxlcyA9IGNhY2hlTWFwLmZpbGVzXG4gICAgICAgICAgICBmb3IobGV0IHVybCBpbiBmaWxlcyl7XG4gICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSBmaWxlc1t1cmxdXG4gICAgICAgICAgICAgICAgbGV0IGZ1bGxwYXRoID0gdGhpcy5fbW9kdWxlTWFnLmdldE5hdGl2ZVBhdGgoKStcIlBLZ2FtZWNhY2hlcy9cIitpdGVtLnVybFxuICAgICAgICAgICAgICAgIGZpbGVsaXN0LnB1c2goZnVsbHBhdGgpXG4gICAgICAgICAgICAgICAgaWYoY288Myl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2V0X2ZpbGVfbGlzdF9mdWxsXzpcIiwgZnVsbHBhdGggKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjbyA9IGNvKzFcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIGpzYi5maWxlVXRpbHMubGlzdEZpbGVzUmVjdXJzaXZlbHkoZGlyLCBmaWxlbGlzdClcbiAgICAgICAgfSBcbiAgICB9LFxuXG4gICAgLy8g5ou36LSd5paH5Lu25aS55YiwIGNvcHlGb2xkVG8oXCIvcGF0aDEvc3JjL1wiLCBcIi9wYXRoMi9zcmMvXCIpIFxuICAgIGNvcHlGb2xkVG8ob3JpUm9vdCwgY29weVRvLCBvblByb2dyZXNzLCBvbkNvbXBsYXRlKXtcblxuICAgICAgICBsZXQgZWFjaEZyYW1lQ29weU51bSA9IDUgIC8vIOavj+W4p+WkjeWItuaWh+S7tuaVsFxuXG4gICAgICAgIGlmKCAodHlwZW9mKGpzYik9PVwidW5kZWZpbmVkXCIpIHx8ICFqc2IuZmlsZVV0aWxzLmlzRGlyZWN0b3J5RXhpc3Qob3JpUm9vdCkpe1xuICAgICAgICAgICAgY2MubG9nKFwib3JpX2ZvbGRlcl9ub3RfZXhpc3RfOlwiLCBvcmlSb290IClcbiAgICAgICAgICAgIG9uQ29tcGxhdGUoKTtcbiAgICAgICAgICAgIHJldHVybiBcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBmaWxlbGlzdCA9IFtdXG4gICAgICAgIHRoaXMuZ2V0RmlsZUxpc3RGcm9tRGlyKG9yaVJvb3QsIGZpbGVsaXN0KSBcblxuICAgICAgICBjYy5sb2coXCJmaWxlX29yaV9hcnJfOlwiLG9yaVJvb3QsIGZpbGVsaXN0Lmxlbmd0aCk7XG5cbiAgICAgICAgbGV0IHJlYWxGaWxlQXJyID0gW11cbiAgICAgICAgZm9yKGxldCBpPTA7aTxmaWxlbGlzdC5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgIGxldCBwYXRoID0gZmlsZWxpc3RbaV1cbiAgICAgICAgICAgIGlmKHBhdGguc3Vic3RyKCBwYXRoLmxlbmd0aC0xICkhPVwiL1wiKXtcbiAgICAgICAgICAgICAgICByZWFsRmlsZUFyci5wdXNoKHBhdGgpXG4gICAgICAgICAgICB9IFxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHRvdGFsTGVuID0gcmVhbEZpbGVBcnIubGVuZ3RoXG5cbiAgICAgICAgaWYodG90YWxMZW49PTApe1xuICAgICAgICAgICAgY2MubG9nKFwidG90YWxMZW5faXNfMDpcIiwgb3JpUm9vdCApXG4gICAgICAgICAgICBvbkNvbXBsYXRlKCk7XG4gICAgICAgICAgICByZXR1cm4gO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGN1ck1pc0luZGV4ID0gMFxuXG4gICAgICAgIGxldCBzY2hIYW5kbGVyID0gXCJcIlxuICAgICAgICBzY2hIYW5kbGVyID0gKCk9PntcblxuICAgICAgICAgICAgZm9yKGxldCBpPWN1ck1pc0luZGV4OyBpPGN1ck1pc0luZGV4K2VhY2hGcmFtZUNvcHlOdW07IGkrKyl7IFxuXG4gICAgICAgICAgICAgICAgaWYoaT49dG90YWxMZW4pe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVuc2NoZWR1bGUoc2NoSGFuZGxlcilcbiAgICAgICAgICAgICAgICAgICAgb25Db21wbGF0ZSgpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBwYXRoID0gcmVhbEZpbGVBcnJbaV0gXG4gICAgXG4gICAgICAgICAgICAgICAgbGV0IHN1YlBhdGggPSBwYXRoLnN1YnN0ciggb3JpUm9vdC5sZW5ndGggKSAgLy8g5ZCO5Y2K6YOo5YiG6Lev5b6EIGltcG9ydC8wMC8wMC43ODcxZi5qc29uXG4gICAgICAgICAgICAgICAgbGV0IGZpbGVOYW1lID0gcGF0aC5zdWJzdHIoIHBhdGgubGFzdEluZGV4T2YoXCJcXC9cIikrMSkgLy8g5paH5Lu25ZCNIDAwLjc4NzFmLmpzb25cbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0UGF0aCA9IGNvcHlUbyArIHN1YlBhdGggLy8g55uu5qCH5a6M5pW06Lev5b6EXG4gICAgICAgICAgICAgICAgbGV0IG5ld0ZvbGQgPSB0YXJnZXRQYXRoLnN1YnN0ciggMCwgdGFyZ2V0UGF0aC5sYXN0SW5kZXhPZihcIlxcL1wiKSsxICkgLy8g55uu5qCH5paH5Lu25aS5XG4gICAgXG4gICAgICAgICAgICAgICAgaWYoIWpzYi5maWxlVXRpbHMuaXNEaXJlY3RvcnlFeGlzdChuZXdGb2xkKSl7IC8vIOaWh+S7tuWkueS4jeWtmOWcqOWImeWIm+W7uiBcbiAgICAgICAgICAgICAgICAgICAganNiLmZpbGVVdGlscy5jcmVhdGVEaXJlY3RvcnkobmV3Rm9sZClcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgZmlsZURhdGEgPSBqc2IuZmlsZVV0aWxzLmdldERhdGFGcm9tRmlsZShwYXRoKTsgXG4gICAgICAgICAgICAgICAgbGV0IHNhdmVSZXQgPSBqc2IuZmlsZVV0aWxzLndyaXRlRGF0YVRvRmlsZShmaWxlRGF0YSwgdGFyZ2V0UGF0aCk7XG4gICAgICAgICAgICAgICAgaWYoIXNhdmVSZXQpe1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudW5zY2hlZHVsZShzY2hIYW5kbGVyKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gO1xuICAgICAgICAgICAgICAgIH0gIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIGN1ck1pc0luZGV4ID0gY3VyTWlzSW5kZXggKyBlYWNoRnJhbWVDb3B5TnVtXG5cbiAgICAgICAgICAgIG9uUHJvZ3Jlc3MoIChjdXJNaXNJbmRleDw9dG90YWxMZW4/IGN1ck1pc0luZGV4IDogdG90YWxMZW4pLCB0b3RhbExlbilcblxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2NoZWR1bGUoc2NoSGFuZGxlciwgMClcblxuICAgIH0sXG5cbn0pO1xuIl19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/ModuleMag/ModuleCom.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'aede5xN1u9C0ou+QZmbwKN2', 'ModuleCom');
// Script/ModuleMag/ModuleCom.js

"use strict";

// let ModuleCom = require("ModuleCom")
cc.Class({
  "extends": cc.Component,
  properties: {},
  // makeXMLHttp({url: , callback:(retInfo)=>{}})
  makeXMLHttp: function makeXMLHttp(args) {
    var timeout = args.timeout,
        url = args.url,
        callback = args.callback;
    var retInfo = {};
    var isValid = true;
    var xhr = new XMLHttpRequest();
    xhr.timeout = Math.ceil((timeout || 6) * 1000);

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
        if (!isValid) {
          return;
        }

        ;
        isValid = false;
        var httpDatas = JSON.parse(xhr.responseText);
        callback({
          retData: httpDatas
        });
      } else if (xhr.readyState == 4 && xhr.status == 0) {
        if (!isValid) {
          return;
        }

        ;
        isValid = false;
        callback({
          fail: true
        });
      } else if (xhr.readyState == 4) {
        if (!isValid) {
          return;
        }

        ;
        isValid = false;
        callback({
          fail: true
        });
      }
    };

    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send();

    xhr.ontimeout = function () {
      if (!isValid) {
        return;
      }

      ;
      isValid = false;
      callback({
        isTimeout: true
      });
    };

    retInfo.abort = function () {
      isValid = false;
      xhr.abort();
    };

    return retInfo;
  },
  //并行任务 return : {addMis: , onFinish:}  
  // let pMis = AppComFunc.parallelMis(callback); 
  // pMis.addMis();
  // pMis.start();
  // pMis.onFinish
  parallelMis: function parallelMis(callback) {
    var co = 0;
    var ret = {};
    co = co + 1;
    var isValid = true;
    var retArgs = {};

    var onFinish = function onFinish(args) {
      if (!isValid) {
        return;
      }

      co = co - 1;

      if (args) {
        retArgs = Object.assign(retArgs, args);
      }

      if (co <= 0) {
        if (callback) {
          callback(retArgs);
        }
      }
    };

    ret.onFinish = onFinish;

    ret.addMis = function () {
      co = co + 1;
      return onFinish;
    };

    ret.start = function () {
      onFinish();
    };

    ret.close = function () {
      isValid = false;
    };

    return ret;
  },
  //顺序任务 idx:0~N,  AppComFunc.sequenceMis(misArr, onAllFolderDetectFinish, (curMis, idx, onExec)=>{ })
  sequenceMis: function sequenceMis(misArr, onAllExec, execFunc) {
    cc.log("sequenceMis__enter_:");
    var co = 0;

    var _execMis;

    _execMis = function execMis() {
      if (co >= misArr.length) {
        onAllExec();
        return;
      }

      var mis = misArr[co];
      var curCo = co;
      co = co + 1;
      execFunc(mis, curCo, _execMis);
    };

    _execMis();
  },
  // comVersion(localVer, romoteVer)
  // 对比版本号, -1:本地版本比较旧, 0:相等, 1:本地版本比较新
  comVersion: function comVersion(localVer, romoteVer) {
    var verSplit_local = localVer.split('.');
    var verSplit_remote = romoteVer.split('.');
    var localCo = verSplit_local.length;
    var remoteCo = verSplit_remote.length;
    var maxCo = localCo > remoteCo ? localCo : remoteCo;

    for (var i = 0; i < maxCo; i++) {
      var n_local = parseInt(verSplit_local[i], 10);
      var n_remote = parseInt(verSplit_remote[i], 10);

      if (i < localCo && i >= remoteCo) {
        return 1;
      } else if (i >= localCo && i < remoteCo) {
        return -1;
      } else if (n_local > n_remote) {
        return 1;
      } else if (n_local < n_remote) {
        return -1;
      }
    }

    return 0;
  },
  createUUID: function createUUID() {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [];

    for (var i = 0; i < 4; i++) {
      uuid[i] = chars[0 | Math.random() * 36];
    }

    var uid = uuid.join('');
    uid = Number(Date.now()).toString(36) + uid;
    return uid;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvTW9kdWxlTWFnL01vZHVsZUNvbS5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsIm1ha2VYTUxIdHRwIiwiYXJncyIsInRpbWVvdXQiLCJ1cmwiLCJjYWxsYmFjayIsInJldEluZm8iLCJpc1ZhbGlkIiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJNYXRoIiwiY2VpbCIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsInJlYWR5U3RhdGUiLCJzdGF0dXMiLCJodHRwRGF0YXMiLCJKU09OIiwicGFyc2UiLCJyZXNwb25zZVRleHQiLCJyZXREYXRhIiwiZmFpbCIsIm9wZW4iLCJzZXRSZXF1ZXN0SGVhZGVyIiwic2VuZCIsIm9udGltZW91dCIsImlzVGltZW91dCIsImFib3J0IiwicGFyYWxsZWxNaXMiLCJjbyIsInJldCIsInJldEFyZ3MiLCJvbkZpbmlzaCIsIk9iamVjdCIsImFzc2lnbiIsImFkZE1pcyIsInN0YXJ0IiwiY2xvc2UiLCJzZXF1ZW5jZU1pcyIsIm1pc0FyciIsIm9uQWxsRXhlYyIsImV4ZWNGdW5jIiwibG9nIiwiZXhlY01pcyIsImxlbmd0aCIsIm1pcyIsImN1ckNvIiwiY29tVmVyc2lvbiIsImxvY2FsVmVyIiwicm9tb3RlVmVyIiwidmVyU3BsaXRfbG9jYWwiLCJzcGxpdCIsInZlclNwbGl0X3JlbW90ZSIsImxvY2FsQ28iLCJyZW1vdGVDbyIsIm1heENvIiwiaSIsIm5fbG9jYWwiLCJwYXJzZUludCIsIm5fcmVtb3RlIiwiY3JlYXRlVVVJRCIsImNoYXJzIiwidXVpZCIsInJhbmRvbSIsInVpZCIsImpvaW4iLCJOdW1iZXIiLCJEYXRlIiwibm93IiwidG9TdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7QUFDQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFLEVBSFA7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TyxDQUFDLENBQVI7QUFBVSxPQUF6QyxNQUNBLElBQUdHLE9BQU8sR0FBQ0UsUUFBWCxFQUFvQjtBQUFFLGVBQU8sQ0FBUDtBQUFTLE9BQS9CLE1BQ0EsSUFBR0YsT0FBTyxHQUFDRSxRQUFYLEVBQW9CO0FBQUUsZUFBTyxDQUFDLENBQVI7QUFBVTtBQUN4Qzs7QUFDRCxXQUFPLENBQVA7QUFDSCxHQXpISTtBQTBITEMsRUFBQUEsVUExSEssd0JBMEhPO0FBQ1IsUUFBSUMsS0FBSyxHQUFHLGlFQUFpRVYsS0FBakUsQ0FBdUUsRUFBdkUsQ0FBWjtBQUNBLFFBQUlXLElBQUksR0FBRyxFQUFYOztBQUNBLFNBQUssSUFBSU4sQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxDQUFwQixFQUF1QkEsQ0FBQyxFQUF4QixFQUE0QjtBQUN4Qk0sTUFBQUEsSUFBSSxDQUFDTixDQUFELENBQUosR0FBVUssS0FBSyxDQUFDLElBQUlsRCxJQUFJLENBQUNvRCxNQUFMLEtBQWMsRUFBbkIsQ0FBZjtBQUNIOztBQUNELFFBQUlDLEdBQUcsR0FBR0YsSUFBSSxDQUFDRyxJQUFMLENBQVUsRUFBVixDQUFWO0FBQ0FELElBQUFBLEdBQUcsR0FBR0UsTUFBTSxDQUFDQyxJQUFJLENBQUNDLEdBQUwsRUFBRCxDQUFOLENBQW1CQyxRQUFuQixDQUE0QixFQUE1QixJQUFrQ0wsR0FBeEM7QUFDQSxXQUFPQSxHQUFQO0FBQ0g7QUFuSUksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiXG4vLyBsZXQgTW9kdWxlQ29tID0gcmVxdWlyZShcIk1vZHVsZUNvbVwiKVxuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcblxuXG4gICAgfSxcblxuICAgIC8vIG1ha2VYTUxIdHRwKHt1cmw6ICwgY2FsbGJhY2s6KHJldEluZm8pPT57fX0pXG4gICAgbWFrZVhNTEh0dHAoYXJncyl7XG5cbiAgICAgICAgbGV0IHt0aW1lb3V0LCB1cmwsIGNhbGxiYWNrfSA9IGFyZ3NcbiAgICAgICAgbGV0IHJldEluZm8gPSB7fVxuXG4gICAgICAgIGxldCBpc1ZhbGlkID0gdHJ1ZVxuICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci50aW1lb3V0ID0gTWF0aC5jZWlsKCh0aW1lb3V0IHx8IDYpKjEwMDApO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkgeyBcbiAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PSA0ICYmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgNDAwKSkge1xuICAgICAgICAgICAgICAgIGlmKCFpc1ZhbGlkKXsgcmV0dXJuIH0gOyBpc1ZhbGlkID0gZmFsc2UgXG4gICAgICAgICAgICAgICAgdmFyIGh0dHBEYXRhcyA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7IFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHtyZXREYXRhOmh0dHBEYXRhc30pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh4aHIucmVhZHlTdGF0ZSA9PSA0ICYmIHhoci5zdGF0dXMgPT0gMCkge1xuICAgICAgICAgICAgICAgIGlmKCFpc1ZhbGlkKXsgcmV0dXJuIH0gOyBpc1ZhbGlkID0gZmFsc2UgIFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHtmYWlsOnRydWV9KVxuXG4gICAgICAgICAgICB9ZWxzZSBpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICAgICAgICAgIGlmKCFpc1ZhbGlkKXsgcmV0dXJuIH0gOyBpc1ZhbGlkID0gZmFsc2UgIFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHtmYWlsOnRydWV9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7IFxuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb247Y2hhcnNldD1VVEYtOCcpOyBcbiAgICAgICAgeGhyLnNlbmQoKTtcbiAgICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmKCFpc1ZhbGlkKXsgcmV0dXJuIH0gOyBpc1ZhbGlkID0gZmFsc2UgIFxuICAgICAgICAgICAgY2FsbGJhY2soe2lzVGltZW91dDp0cnVlfSlcbiAgICAgICAgfTsgXG4gICAgICAgIHJldEluZm8uYWJvcnQgPSAoKT0+e1xuICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlXG4gICAgICAgICAgICB4aHIuYWJvcnQoKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXRJbmZvXG4gICAgfSxcblxuICAgIC8v5bm26KGM5Lu75YqhIHJldHVybiA6IHthZGRNaXM6ICwgb25GaW5pc2g6fSAgXG4gICAgLy8gbGV0IHBNaXMgPSBBcHBDb21GdW5jLnBhcmFsbGVsTWlzKGNhbGxiYWNrKTsgXG4gICAgLy8gcE1pcy5hZGRNaXMoKTtcbiAgICAvLyBwTWlzLnN0YXJ0KCk7XG4gICAgLy8gcE1pcy5vbkZpbmlzaFxuICAgIHBhcmFsbGVsTWlzKGNhbGxiYWNrKXtcbiAgICAgICAgbGV0IGNvID0gMDtcbiAgICAgICAgbGV0IHJldCA9IHt9O1xuICAgICAgICBjbyA9IGNvKzE7XG4gICAgICAgIGxldCBpc1ZhbGlkID0gdHJ1ZVxuICAgICAgICBsZXQgcmV0QXJncyA9IHt9XG4gICAgICAgIGxldCBvbkZpbmlzaCA9IGZ1bmN0aW9uKGFyZ3Mpe1xuICAgICAgICAgICAgaWYoIWlzVmFsaWQpeyByZXR1cm4gfVxuICAgICAgICAgICAgY28gPSBjby0xO1xuICAgICAgICAgICAgaWYoYXJncyl7XG4gICAgICAgICAgICAgICAgcmV0QXJncyA9IE9iamVjdC5hc3NpZ24ocmV0QXJncywgYXJncylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKGNvPD0wKXtcbiAgICAgICAgICAgICAgICBpZihjYWxsYmFjayl7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHJldEFyZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXQub25GaW5pc2ggPSBvbkZpbmlzaDtcbiAgICAgICAgcmV0LmFkZE1pcyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBjbyA9IGNvKzE7XG4gICAgICAgICAgICByZXR1cm4gb25GaW5pc2g7XG4gICAgICAgIH1cbiAgICAgICAgcmV0LnN0YXJ0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG9uRmluaXNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0LmNsb3NlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIC8v6aG65bqP5Lu75YqhIGlkeDowfk4sICBBcHBDb21GdW5jLnNlcXVlbmNlTWlzKG1pc0Fyciwgb25BbGxGb2xkZXJEZXRlY3RGaW5pc2gsIChjdXJNaXMsIGlkeCwgb25FeGVjKT0+eyB9KVxuICAgIHNlcXVlbmNlTWlzKG1pc0Fyciwgb25BbGxFeGVjLCBleGVjRnVuYyl7XG4gICAgICAgIGNjLmxvZyhcInNlcXVlbmNlTWlzX19lbnRlcl86XCIpXG4gICAgICAgIGxldCBjbyA9IDBcbiAgICAgICAgbGV0IGV4ZWNNaXMgO1xuICAgICAgICBleGVjTWlzID0gKCk9PntcbiAgICAgICAgICAgIGlmKGNvPj1taXNBcnIubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICBvbkFsbEV4ZWMoKVxuICAgICAgICAgICAgICAgIHJldHVybiBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBtaXMgPSBtaXNBcnJbY29dXG4gICAgICAgICAgICBsZXQgY3VyQ28gPSBjb1xuICAgICAgICAgICAgY289Y28rMSBcbiAgICAgICAgICAgIGV4ZWNGdW5jKG1pcywgY3VyQ28sIGV4ZWNNaXMpXG4gICAgICAgIH0gXG4gICAgICAgIGV4ZWNNaXMoKSBcbiAgICB9LFxuXG4gICAgLy8gY29tVmVyc2lvbihsb2NhbFZlciwgcm9tb3RlVmVyKVxuICAgIC8vIOWvueavlOeJiOacrOWPtywgLTE65pys5Zyw54mI5pys5q+U6L6D5penLCAwOuebuOetiSwgMTrmnKzlnLDniYjmnKzmr5TovoPmlrBcbiAgICBjb21WZXJzaW9uKGxvY2FsVmVyLCByb21vdGVWZXIpe1xuICAgICAgICBsZXQgdmVyU3BsaXRfbG9jYWwgID0gbG9jYWxWZXIuc3BsaXQoJy4nKVxuICAgICAgICBsZXQgdmVyU3BsaXRfcmVtb3RlID0gcm9tb3RlVmVyLnNwbGl0KCcuJylcbiAgICAgICAgbGV0IGxvY2FsQ28gID0gdmVyU3BsaXRfbG9jYWwubGVuZ3RoXG4gICAgICAgIGxldCByZW1vdGVDbyA9IHZlclNwbGl0X3JlbW90ZS5sZW5ndGhcbiAgICAgICAgbGV0IG1heENvID0gbG9jYWxDbz5yZW1vdGVDbz9sb2NhbENvIDogcmVtb3RlQ29cbiAgICAgICAgXG4gICAgICAgIGZvcihsZXQgaT0wO2k8bWF4Q287aSsrKXtcbiAgICAgICAgICAgIGxldCBuX2xvY2FsID0gcGFyc2VJbnQodmVyU3BsaXRfbG9jYWxbaV0sIDEwKTsgXG4gICAgICAgICAgICBsZXQgbl9yZW1vdGUgPSBwYXJzZUludCh2ZXJTcGxpdF9yZW1vdGVbaV0sIDEwKTsgXG5cbiAgICAgICAgICAgIGlmKGk8bG9jYWxDbyAmJiBpPj1yZW1vdGVDbyl7IHJldHVybiAxIH1cbiAgICAgICAgICAgIGVsc2UgaWYoaT49bG9jYWxDbyAmJiBpPHJlbW90ZUNvKSB7IHJldHVybiAtMX0gXG4gICAgICAgICAgICBlbHNlIGlmKG5fbG9jYWw+bl9yZW1vdGUpeyByZXR1cm4gMX1cbiAgICAgICAgICAgIGVsc2UgaWYobl9sb2NhbDxuX3JlbW90ZSl7IHJldHVybiAtMX1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMFxuICAgIH0sXG4gICAgY3JlYXRlVVVJRCgpe1xuICAgICAgICB2YXIgY2hhcnMgPSAnMDEyMzQ1Njc4OUFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonLnNwbGl0KCcnKTsgXG4gICAgICAgIHZhciB1dWlkID0gW107ICBcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICAgIHV1aWRbaV0gPSBjaGFyc1swIHwgTWF0aC5yYW5kb20oKSozNl07XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHVpZCA9IHV1aWQuam9pbignJyk7XG4gICAgICAgIHVpZCA9IE51bWJlcihEYXRlLm5vdygpKS50b1N0cmluZygzNikgKyB1aWQgXG4gICAgICAgIHJldHVybiB1aWRcbiAgICB9LFxuXG5cbn0pOyBcbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/ABLobby/root/Script/LobbyRoot.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9BQkxvYmJ5L3Jvb3QvU2NyaXB0L0xvYmJ5Um9vdC5qcyJdLCJuYW1lcyI6WyJKU19MT0ciLCJhcmciLCJjYyIsImxvZyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImluaXRNb2R1bGUiLCJvbkJ0bl9sb2FkR2FtZV8xIiwicmVtb3ZlR2FtZV8xIiwibG9hZFN1YkdhbWUiLCJtb2R1bGVPYmoiLCJhYk9iaiIsImdldEFCT2JqIiwibG9hZCIsIlByZWZhYiIsImVyciIsInByZWZhYiIsIkpTT04iLCJzdHJpbmdpZnkiLCJfbm9kZSIsImluc3RhbnRpYXRlIiwibm9kZSIsImFkZENoaWxkIiwiX2dhbWUxIiwiZ2V0Q29tcG9uZW50IiwibG9iYnlSb290IiwiZGVzdHJveSIsIm9uQnRuX2xvYWRHYW1lXzIiLCJyZW1vdmVHYW1lXzIiLCJfZ2FtZTIiLCJhYk5hbWUiLCJjYWxsYmFjayIsIl9HX21vZHVsZU1hZyIsImhvdFVwZGF0ZU11bHRpTW9kdWxlIiwiYWRkTW9kdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUVBO0FBRUEsSUFBSUEsTUFBTSxHQUFHLFNBQVRBLE1BQVMsR0FBZ0I7QUFBQTs7QUFBQSxvQ0FBSkMsR0FBSTtBQUFKQSxJQUFBQSxHQUFJO0FBQUE7O0FBQ3pCLFNBQUFDLEVBQUUsRUFBQ0MsR0FBSCxhQUFPLGFBQVAsU0FBd0JGLEdBQXhCO0FBQ0gsQ0FGRDs7QUFJQUMsRUFBRSxDQUFDRSxLQUFILENBQVM7QUFDTCxhQUFTRixFQUFFLENBQUNHLFNBRFA7QUFFTEMsRUFBQUEsVUFBVSxFQUFFLEVBRlA7QUFTTEMsRUFBQUEsVUFUSyx3QkFTTztBQUNYUCxJQUFBQSxNQUFNLENBQUMsWUFBRCxDQUFOO0FBRUEsR0FaSTtBQWNMUSxFQUFBQSxnQkFkSyw4QkFjYTtBQUFBOztBQUNqQlIsSUFBQUEsTUFBTSxDQUFDLGtCQUFELENBQU47QUFDQSxTQUFLUyxZQUFMO0FBRUEsU0FBS0MsV0FBTCxDQUFpQixZQUFqQixFQUErQixVQUFDQyxTQUFELEVBQWE7QUFDM0MsVUFBSUMsS0FBSyxHQUFHRCxTQUFTLENBQUNFLFFBQVYsRUFBWjtBQUVNRCxNQUFBQSxLQUFLLENBQUNFLElBQU4sQ0FBVyxxQkFBWCxFQUFrQ1osRUFBRSxDQUFDYSxNQUFyQyxFQUE2QyxVQUFDQyxHQUFELEVBQU1DLE1BQU4sRUFBZTtBQUN4RGpCLFFBQUFBLE1BQU0sQ0FBQyxxQkFBRCxFQUF3QmtCLElBQUksQ0FBQ0MsU0FBTCxDQUFlSCxHQUFmLENBQXhCLENBQU47O0FBQ0EsWUFBSUksS0FBSyxHQUFHbEIsRUFBRSxDQUFDbUIsV0FBSCxDQUFlSixNQUFmLENBQVo7O0FBQ0EsUUFBQSxLQUFJLENBQUNLLElBQUwsQ0FBVUMsUUFBVixDQUFtQkgsS0FBbkIsRUFBMEIsR0FBMUI7O0FBQ0EsUUFBQSxLQUFJLENBQUNJLE1BQUwsR0FBY0osS0FBZDs7QUFDQUEsUUFBQUEsS0FBSyxDQUFDSyxZQUFOLENBQW1CLFdBQW5CLEVBQWdDbEIsVUFBaEMsQ0FBMkM7QUFBQ21CLFVBQUFBLFNBQVMsRUFBQztBQUFYLFNBQTNDO0FBRUgsT0FQRDtBQVFOLEtBWEQsRUFKaUIsQ0FtQmQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUgsR0F4Q0k7QUEwQ0xqQixFQUFBQSxZQTFDSywwQkEwQ1M7QUFDYixRQUFHLEtBQUtlLE1BQVIsRUFBZTtBQUNkLFdBQUtBLE1BQUwsQ0FBWUcsT0FBWjtBQUNBOztBQUNELFNBQUtILE1BQUwsR0FBYyxJQUFkO0FBQ0EsR0EvQ0k7QUFrRExJLEVBQUFBLGdCQWxESyw4QkFrRGE7QUFBQTs7QUFDakI1QixJQUFBQSxNQUFNLENBQUMsa0JBQUQsQ0FBTjtBQUNBLFNBQUs2QixZQUFMO0FBQ0EsU0FBS25CLFdBQUwsQ0FBaUIsWUFBakIsRUFBK0IsVUFBQ0MsU0FBRCxFQUFhO0FBQzNDLFVBQUlDLEtBQUssR0FBR0QsU0FBUyxDQUFDRSxRQUFWLEVBQVo7QUFFTUQsTUFBQUEsS0FBSyxDQUFDRSxJQUFOLENBQVcscUJBQVgsRUFBa0NaLEVBQUUsQ0FBQ2EsTUFBckMsRUFBNkMsVUFBQ0MsR0FBRCxFQUFNQyxNQUFOLEVBQWU7QUFDeERqQixRQUFBQSxNQUFNLENBQUMscUJBQUQsRUFBd0JrQixJQUFJLENBQUNDLFNBQUwsQ0FBZUgsR0FBZixDQUF4QixDQUFOOztBQUNBLFlBQUlJLEtBQUssR0FBR2xCLEVBQUUsQ0FBQ21CLFdBQUgsQ0FBZUosTUFBZixDQUFaOztBQUNBLFFBQUEsTUFBSSxDQUFDSyxJQUFMLENBQVVDLFFBQVYsQ0FBbUJILEtBQW5CLEVBQTBCLEdBQTFCOztBQUNBLFFBQUEsTUFBSSxDQUFDVSxNQUFMLEdBQWNWLEtBQWQ7O0FBQ0FBLFFBQUFBLEtBQUssQ0FBQ0ssWUFBTixDQUFtQixXQUFuQixFQUFnQ2xCLFVBQWhDLENBQTJDO0FBQUNtQixVQUFBQSxTQUFTLEVBQUM7QUFBWCxTQUEzQztBQUVILE9BUEQ7QUFRTixLQVhEO0FBYUEsR0FsRUk7QUFtRUxHLEVBQUFBLFlBbkVLLDBCQW1FUztBQUNiLFFBQUcsS0FBS0MsTUFBUixFQUFlO0FBQ2QsV0FBS0EsTUFBTCxDQUFZSCxPQUFaO0FBQ0E7O0FBQ0QsU0FBS0csTUFBTCxHQUFjLElBQWQ7QUFFQSxHQXpFSTtBQTRFTHBCLEVBQUFBLFdBNUVLLHVCQTRFT3FCLE1BNUVQLEVBNEVlQyxRQTVFZixFQTRFd0I7QUFDNUJDLElBQUFBLFlBQVksQ0FBQ0Msb0JBQWIsQ0FBa0MsQ0FBQ0gsTUFBRCxDQUFsQyxFQUEyQyxZQUFJO0FBRXhDRSxNQUFBQSxZQUFZLENBQUNFLFNBQWIsQ0FBdUJKLE1BQXZCLEVBQStCLFVBQUNwQixTQUFELEVBQWE7QUFDeENxQixRQUFBQSxRQUFRLENBQUNyQixTQUFELENBQVI7QUFDSCxPQUZEO0FBR0gsS0FMSjtBQU1BO0FBbkZJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIlxuXG4vLyBsZXQgTG9iYnlSb290XG5cbmxldCBKU19MT0cgPSBmdW5jdGlvbiguLi5hcmcpeyBcbiAgICBjYy5sb2coXCJbTG9iYnlSb290XVwiLC4uLmFyZykgOyBcbn1cblxuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCwgXG4gICAgcHJvcGVydGllczoge1xuXG5cblxuICAgIH0sXG5cblxuICAgIGluaXRNb2R1bGUoKXtcbiAgICBcdEpTX0xPRyhcImluaXRNb2R1bGVcIilcblxuICAgIH0sXG5cbiAgICBvbkJ0bl9sb2FkR2FtZV8xKCl7XG4gICAgXHRKU19MT0coXCJvbkJ0bl9sb2FkR2FtZV8xXCIpXG4gICAgXHR0aGlzLnJlbW92ZUdhbWVfMSgpXG5cbiAgICBcdHRoaXMubG9hZFN1YkdhbWUoXCJBQlN1YkdhbWUxXCIsIChtb2R1bGVPYmopPT57XG4gICAgXHRcdGxldCBhYk9iaiA9IG1vZHVsZU9iai5nZXRBQk9iaigpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBhYk9iai5sb2FkKCdyb290L1NjZW5lL1N1YkdhbWUxJywgY2MuUHJlZmFiLCAoZXJyLCBwcmVmYWIpPT57XG4gICAgICAgICAgICAgICAgSlNfTE9HKFwibG9hZF9nYW1lMV9wcmVmYWJfOlwiLCBKU09OLnN0cmluZ2lmeShlcnIpICkgXG4gICAgICAgICAgICAgICAgbGV0IF9ub2RlID0gY2MuaW5zdGFudGlhdGUocHJlZmFiKSBcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQoX25vZGUsIDEwMClcbiAgICAgICAgICAgICAgICB0aGlzLl9nYW1lMSA9IF9ub2RlXG4gICAgICAgICAgICAgICAgX25vZGUuZ2V0Q29tcG9uZW50KFwiU3ViR2FtZV8xXCIpLmluaXRNb2R1bGUoe2xvYmJ5Um9vdDp0aGlzfSkgICAgXG5cbiAgICAgICAgICAgIH0pIFxuICAgIFx0fSlcblxuXG5cbiAgICAgICAgLy8g5qih5Z2X5YaF5Yqg6L296Ieq6Lqr6LWE5rqQXG4gICAgICAgIC8vIGxldCBtb2R1bGUgPSBfR19tb2R1bGVNYWcuZ2V0TW9kdWxlKFwiQUJMb2JieVwiKVxuICAgICAgICAvLyBsZXQgYXNzZXRCdW5kbGUgPSBtb2R1bGUuZ2V0QUJPYmooKVxuICAgICAgICAvLyBhc3NldEJ1bmRsZS5sb2FkKCdyb290L1NjZW5lL3h4eCcsIGNjLlByZWZhYiwgKGVyciwgcHJlZmFiKT0+eyAgICBcbiAgICAgICAgLy8gICAgIC8vLi4uXG4gICAgICAgIC8vIH0pIFxuXG4gICAgfSxcblxuICAgIHJlbW92ZUdhbWVfMSgpe1xuICAgIFx0aWYodGhpcy5fZ2FtZTEpe1xuICAgIFx0XHR0aGlzLl9nYW1lMS5kZXN0cm95KClcbiAgICBcdH1cbiAgICBcdHRoaXMuX2dhbWUxID0gbnVsbFxuICAgIH0sXG5cblxuICAgIG9uQnRuX2xvYWRHYW1lXzIoKXtcbiAgICBcdEpTX0xPRyhcIm9uQnRuX2xvYWRHYW1lXzJcIilcbiAgICBcdHRoaXMucmVtb3ZlR2FtZV8yKClcbiAgICBcdHRoaXMubG9hZFN1YkdhbWUoXCJBQlN1YkdhbWUyXCIsIChtb2R1bGVPYmopPT57XG4gICAgXHRcdGxldCBhYk9iaiA9IG1vZHVsZU9iai5nZXRBQk9iaigpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBhYk9iai5sb2FkKCdyb290L1NjZW5lL1N1YkdhbWUyJywgY2MuUHJlZmFiLCAoZXJyLCBwcmVmYWIpPT57XG4gICAgICAgICAgICAgICAgSlNfTE9HKFwibG9hZF9nYW1lMl9wcmVmYWJfOlwiLCBKU09OLnN0cmluZ2lmeShlcnIpICkgXG4gICAgICAgICAgICAgICAgbGV0IF9ub2RlID0gY2MuaW5zdGFudGlhdGUocHJlZmFiKSBcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQoX25vZGUsIDEwMClcbiAgICAgICAgICAgICAgICB0aGlzLl9nYW1lMiA9IF9ub2RlXG4gICAgICAgICAgICAgICAgX25vZGUuZ2V0Q29tcG9uZW50KFwiU3ViR2FtZV8yXCIpLmluaXRNb2R1bGUoe2xvYmJ5Um9vdDp0aGlzfSkgICAgXG5cbiAgICAgICAgICAgIH0pIFxuICAgIFx0fSlcblxuICAgIH0sXG4gICAgcmVtb3ZlR2FtZV8yKCl7XG4gICAgXHRpZih0aGlzLl9nYW1lMil7XG4gICAgXHRcdHRoaXMuX2dhbWUyLmRlc3Ryb3koKVxuICAgIFx0fVxuICAgIFx0dGhpcy5fZ2FtZTIgPSBudWxsXG5cbiAgICB9LFxuXG5cbiAgICBsb2FkU3ViR2FtZShhYk5hbWUsIGNhbGxiYWNrKXsgXG4gICAgXHRfR19tb2R1bGVNYWcuaG90VXBkYXRlTXVsdGlNb2R1bGUoW2FiTmFtZV0sKCk9PntcblxuICAgICAgICAgICAgX0dfbW9kdWxlTWFnLmFkZE1vZHVsZShhYk5hbWUsIChtb2R1bGVPYmopPT57XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobW9kdWxlT2JqKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9LFxuXG59KTsiXX0=
//------QC-SOURCE-SPLIT------

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
//------QC-SOURCE-SPLIT------

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
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/ABSubGame1/root/Script/SubGame1Const.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '2b9a4CSJGBDlI69Jpbmr6iq', 'SubGame1Const');
// ABSubGame1/root/Script/SubGame1Const.js

"use strict";

// let SubGame1Const = require("SubGame1Const")
var SubGame1Const = {
  testv: "subgame1_v"
};
module.exports = SubGame1Const;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9BQlN1YkdhbWUxL3Jvb3QvU2NyaXB0L1N1YkdhbWUxQ29uc3QuanMiXSwibmFtZXMiOlsiU3ViR2FtZTFDb25zdCIsInRlc3R2IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTtBQUNBLElBQUlBLGFBQWEsR0FBRztBQUNuQkMsRUFBQUEsS0FBSyxFQUFHO0FBRFcsQ0FBcEI7QUFLQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCSCxhQUFqQiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiXG4vLyBsZXQgU3ViR2FtZTFDb25zdCA9IHJlcXVpcmUoXCJTdWJHYW1lMUNvbnN0XCIpXG5sZXQgU3ViR2FtZTFDb25zdCA9IHtcblx0dGVzdHYgOiBcInN1YmdhbWUxX3ZcIlxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gU3ViR2FtZTFDb25zdFxuIl19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/ABLobby/root/Script/LobbyConst.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '27fe1uYokJIMYFrKpxPCezS', 'LobbyConst');
// ABLobby/root/Script/LobbyConst.js

"use strict";

// let LobbyConst = require("LobbyConst")
var LobbyConst = {
  testv: "lobbytest_v"
};
module.exports = LobbyConst;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9BQkxvYmJ5L3Jvb3QvU2NyaXB0L0xvYmJ5Q29uc3QuanMiXSwibmFtZXMiOlsiTG9iYnlDb25zdCIsInRlc3R2IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTtBQUNBLElBQUlBLFVBQVUsR0FBRztBQUNoQkMsRUFBQUEsS0FBSyxFQUFHO0FBRFEsQ0FBakI7QUFLQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCSCxVQUFqQiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiXG4vLyBsZXQgTG9iYnlDb25zdCA9IHJlcXVpcmUoXCJMb2JieUNvbnN0XCIpXG5sZXQgTG9iYnlDb25zdCA9IHtcblx0dGVzdHYgOiBcImxvYmJ5dGVzdF92XCJcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IExvYmJ5Q29uc3RcbiJdfQ==
//------QC-SOURCE-SPLIT------
