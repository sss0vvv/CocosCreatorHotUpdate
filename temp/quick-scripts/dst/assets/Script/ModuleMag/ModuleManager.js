
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvTW9kdWxlTWFnL01vZHVsZU1hbmFnZXIuanMiXSwibmFtZXMiOlsiTW9kdWxlIiwicmVxdWlyZSIsIk1vZHVsZUNvbnN0IiwiSlNfTE9HIiwiYXJnIiwiY2MiLCJsb2ciLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJhc3NldDEiLCJ0eXBlIiwiQXNzZXQiLCJhc3NldDIiLCJvbkxvYWQiLCJfTW9kdWxlQ29tIiwiZ2V0Q29tcG9uZW50IiwiX3VucGFja2FnZSIsIl9Ib3RVSUhlbHBlciIsIl9uYXRpdmVSb290UGF0aCIsImpzYiIsImFic1BhdGgxIiwiZmlsZVV0aWxzIiwiZnVsbFBhdGhGb3JGaWxlbmFtZSIsIm5hdGl2ZVVybCIsInJlcGxhY2UiLCJhYnNQYXRoMiIsInRlc3RMZW4iLCJsZW5ndGgiLCJpIiwic3Vic3RyaW5nIiwiZ2V0RGVmYXVsdFJlc291cmNlUm9vdFBhdGgiLCJpbml0Q29tIiwiYXJncyIsInVzZUhvdFVwZGF0ZSIsIl91c2VIb3RVcGRhdGUiLCJfbGFzdFJlcV9WZXJzaW9uSW5mb1RpbWUiLCJfZGV0ZWN0TmV3VmVyc2lvbkludGVydmFsIiwibW9kdWxlcyIsIl9sb2NhbF9kYXRhX2tleSIsImxvY2FsVmVyc2lvbkNvbmZpZ0tleSIsInZlcnNpb25EYXRhIiwic3lzIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsImNyZWF0ZURlZmF1bHRWZXJzaW9uRGF0YSIsIkpTT04iLCJwYXJzZSIsIl9sb2NhbF9WZXJzaW9uIiwiX3JvbW90ZVZlcnNpb24iLCJleGVjVW5wYWNrYWdlIiwib25Db21wbGF0ZSIsImdldE5hdGl2ZVBhdGgiLCJyZXFMb29wVmVyc2lvbkluZm8iLCJfcmVxTG9vcEhhbmRsZXIiLCJyZXFWZXJzaW9uSW5mbyIsInNjaGVkdWxlIiwic2V0TG9jYWxBYlZlcnNpb24iLCJ2ZXJPYmoiLCJsb2NhbE1hcCIsImFiTmFtZSIsInZlclN0ciIsInJlc1ZlcnNpb24iLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwiZ2V0X0xvY2FsVmVyc2lvbiIsImdldF9Sb21vdGVWZXJzaW9uIiwicmV0IiwiY2xpZW50TWluIiwiaG90VXBkYXRlQWxsTW9kdWxlIiwiY2FsbGJhY2siLCJpc1Nob3dIb3REZXRlY3RBbGVydCIsImNoZWNrTmV3VmVyc2lvblNob3ciLCJob3RVcGRhdGVNdWx0aU1vZHVsZSIsIk9iamVjdCIsImtleXMiLCJjaGVja05ld1ZlcnNpb25IaWRlIiwibW9kdWxlTmFtZUFyciIsImlzTmVlZFJlcV92ZXJzaW9uSW5mbyIsIl9kb0hvdFVwZGF0ZU11bHRpIiwiY29tVmVyc2lvbiIsIl9HbG9hYmFsIiwiQ2xpZW50X1ZlcnNpb24iLCJzaG93QWxlcnRDbGllbnRUb29PbGQiLCJnZXREZXBlbmRNb2R1bGUiLCJuZWVkX1VwZGF0ZSIsIm5lZWRfUmVzdGFydCIsIm9uQWxsTW9kdWxlSG90RmluaXNoIiwic2V0VGltZW91dCIsImdhbWUiLCJyZXN0YXJ0IiwibmVlZFVwZGF0ZU5hbWVzIiwicHJlbG9hZERpciIsInNlcXVlbmNlTWlzIiwiaGlkZVVwZGF0aW5nIiwiY3VyTWlzIiwiaWR4Iiwib25FeGVjIiwiY3VyTWlzSWR4IiwidG90YWxNaXMiLCJtb2R1bGVPYmoiLCJwcmVsb2FkTW9kdWxlIiwiZmluaXNoIiwidG90YWwiLCJpdGVtIiwib25Qcm9ncmVzcyIsIml0ZW1zIiwic2hvd1VwZGF0aW5nIiwic2hvd0hvdEFsZXJ0IiwibW9kdWxlTmFtZSIsInJldFRlbXAiLCJfaG90VXBkYXRlTW9kdWxlIiwiaG90X3JldCIsImhhdmVOZXdWZXIiLCJuZWVkUmVzdGFydCIsInB1c2giLCJuYW1lcyIsImgiLCJybXMiLCJuXzEiLCJuYW1lIiwicHJpb3JpdHkiLCJkZXBlbmRzIiwiZGVwZW5kIiwiaiIsIm5fMiIsIm1pbmZvcyIsInZhbHVlcyIsInNvcnQiLCJhIiwiYiIsImxvY2FsX1ZlciIsInJvbW90ZVZlciIsImxvYWRWZXJGdW5jIiwibU9iaiIsInZlciIsImNiIiwibG9hZEFCIiwic2hvd1ZlciIsImluaXQiLCJnZXRCdW5kbGUiLCJfYWJPYmoiLCJnZXRNb2R1bGUiLCJhZGRNb2R1bGUiLCJtb2R1bGUiLCJyZW1vdmVNb2R1bGUiLCJyZWxlYXNlQUIiLCJyZXFWZXJzaW9uSW1tZWRpYXRlbHkiLCJjdXJUaW1lIiwiRGF0ZSIsImdldFRpbWUiLCJfaHR0cFJlcUhhbmRsZXIiLCJhYm9ydCIsInZlclVybCIsImhvdFVybCIsImNyZWF0ZVVVSUQiLCJtYWtlWE1MSHR0cCIsInVybCIsIl9hcmdzIiwiaHR0cERhdGEiLCJyZXREYXRhIiwicmVtb3RlTWFwIiwibmVlZFNhdmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7QUFDQSxJQUFJQSxNQUFNLEdBQUdDLE9BQU8sQ0FBQyxRQUFELENBQXBCOztBQUNBLElBQUlDLFdBQVcsR0FBR0QsT0FBTyxDQUFDLGFBQUQsQ0FBekI7O0FBRUEsSUFBSUUsTUFBTSxHQUFHLFNBQVRBLE1BQVMsR0FBZ0I7QUFBQTs7QUFBQSxvQ0FBSkMsR0FBSTtBQUFKQSxJQUFBQSxHQUFJO0FBQUE7O0FBQ3pCLFNBQUFDLEVBQUUsRUFBQ0MsR0FBSCxhQUFPLGlCQUFQLFNBQTRCRixHQUE1QjtBQUNILENBRkQ7O0FBSUFDLEVBQUUsQ0FBQ0UsS0FBSCxDQUFTO0FBRUwsYUFBU0YsRUFBRSxDQUFDRyxTQUZQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRTtBQUNSO0FBQ0FDLElBQUFBLE1BQU0sRUFBRTtBQUFFLGlCQUFTLElBQVg7QUFBaUJDLE1BQUFBLElBQUksRUFBRU4sRUFBRSxDQUFDTztBQUExQixLQUZBO0FBR1JDLElBQUFBLE1BQU0sRUFBRTtBQUFFLGlCQUFTLElBQVg7QUFBaUJGLE1BQUFBLElBQUksRUFBRU4sRUFBRSxDQUFDTztBQUExQjtBQUhBLEdBSFA7QUFTTEUsRUFBQUEsTUFUSyxvQkFTRztBQUNKLFNBQUtDLFVBQUwsR0FBc0IsS0FBS0MsWUFBTCxDQUFrQixXQUFsQixDQUF0QjtBQUNBLFNBQUtDLFVBQUwsR0FBc0IsS0FB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Q0FBYUMsT0FBYixFQUFoQztBQUNBaEYsUUFBQUEsU0FBUSxJQUFJQSxTQUFRLEVBQXBCO0FBQ0g7QUEvQmtELEtBQTVCLENBQXZCO0FBaUNILEdBL1lJLENBa1pMOztBQWxaSyxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJcblxuLy8gTW9kdWxlTWFuYWdlclxubGV0IE1vZHVsZSA9IHJlcXVpcmUoXCJNb2R1bGVcIikgXG5sZXQgTW9kdWxlQ29uc3QgPSByZXF1aXJlKFwiTW9kdWxlQ29uc3RcIilcblxubGV0IEpTX0xPRyA9IGZ1bmN0aW9uKC4uLmFyZyl7IFxuICAgIGNjLmxvZyhcIltNb2R1bGVNYW5hZ2VyXVwiLC4uLmFyZykgOyBcbn1cblxuY2MuQ2xhc3Moe1xuICAgIFxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgICBwcm9wZXJ0aWVzOiB7ICBcbiAgICAgICAgLy8g6I635Y+W5YyF5YaF6Lev5b6EOyDpnIDopoHliIbliKvnu5HlrpogcmVzb3VyY2VzIOWSjCBUZXh0dXJlIOS4i+i1hOa6kOaWh+S7tjtcbiAgICAgICAgYXNzZXQxOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IGNjLkFzc2V0IH0sIFxuICAgICAgICBhc3NldDI6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogY2MuQXNzZXQgfSxcbiAgICB9LFxuXG4gICAgb25Mb2FkKCl7XG4gICAgICAgIHRoaXMuX01vZHVsZUNvbSAgICAgPSB0aGlzLmdldENvbXBvbmVudChcIk1vZHVsZUNvbVwiKVxuICAgICAgICB0aGlzLl91bnBhY2thZ2UgICAgID0gdGhpcy5nZXRDb21wb25lbnQoXCJVbnBhY2thZ2VIZWxwZXJcIilcbiAgICAgICAgdGhpcy5fSG90VUlIZWxwZXIgICA9IHRoaXMuZ2V0Q29tcG9uZW50KFwiSG90VUlIZWxwZXJcIikgXG5cbiAgICAgICAgLy8ganNiLmZpbGVVdGlscy5nZXREZWZhdWx0UmVzb3VyY2VSb290UGF0aCgpXG4gICAgICAgIHRoaXMuX25hdGl2ZVJvb3RQYXRoID0gXCJcIiAgIC8vIG5hdGl2ZSBhYuaguei3r+W+hCAsIOS7pSAvIOe7k+WwvlxuICAgICAgICBpZih0eXBlb2YoanNiKSE9XCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgICBsZXQgYWJzUGF0aDEgPSBqc2IuZmlsZVV0aWxzLmZ1bGxQYXRoRm9yRmlsZW5hbWUodGhpcy5hc3NldDEubmF0aXZlVXJsKS5yZXBsYWNlKFwiLy9cIixcIi9cIilcbiAgICAgICAgICAgIGxldCBhYnNQYXRoMiA9IGpzYi5maWxlVXRpbHMuZnVsbFBhdGhGb3JGaWxlbmFtZSh0aGlzLmFzc2V0Mi5uYXRpdmVVcmwpLnJlcGxhY2UoXCIvL1wiLFwiL1wiKVxuICAgICAgICAgICAgbGV0IHRlc3RMZW4gPSBhYnNQYXRoMS5sZW5ndGg+YWJzUGF0aDIubGVuZ3RoPyBhYnNQYXRoMi5sZW5ndGggOiBhYnNQYXRoMS5sZW5ndGggXG4gICAgICAgICAgICBmb3IobGV0IGk9MDtpPHRlc3RMZW47aSsrKXtcbiAgICAgICAgICAgICAgICBpZihhYnNQYXRoMVtpXSAhPSBhYnNQYXRoMltpXSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25hdGl2ZVJvb3RQYXRoID0gYWJzUGF0aDEuc3Vic3RyaW5nKDAsIGkpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIGNjLmxvZyhcImRlZmF1bHRfcGF0aF86XCIsIGpzYi5maWxlVXRpbHMuZ2V0RGVmYXVsdFJlc291cmNlUm9vdFBhdGgoKSk7IFxuICAgICAgICAgICAgY2MubG9nKFwiYWJzRmlsZV9wYXRoXzI6XCIsIHRoaXMuX25hdGl2ZVJvb3RQYXRoIClcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBpbml0Q29tKGFyZ3Mpe1xuICAgICAgICBsZXQgeyB1c2VIb3RVcGRhdGUgfSA9IGFyZ3MgXG4gICAgICAgIHRoaXMuX3VucGFja2FnZS5pbml0Q29tKGFyZ3MpXG4gICAgICAgIFxuICAgICAgICB0aGlzLl91c2VIb3RVcGRhdGUgPSB1c2VIb3RVcGRhdGUgXG4gICAgICAgIHRoaXMuX2xhc3RSZXFfVmVyc2lvbkluZm9UaW1lID0gMCAvLyhuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgIC8vIOacgOWQjuS4gOasoeajgOa1i+eJiOacrOaXtumXtFxuICAgICAgICB0aGlzLl9kZXRlY3ROZXdWZXJzaW9uSW50ZXJ2YWwgPSAzMCAgLy8g6Ieq5Yqo5qOA5rWL54mI5pys6Ze06ZqUXG5cbiAgICAgICAgdGhpcy5tb2R1bGVzID0ge31cblxuICAgICAgICB0aGlzLl9sb2NhbF9kYXRhX2tleSA9IE1vZHVsZUNvbnN0LmxvY2FsVmVyc2lvbkNvbmZpZ0tleSAvL1wiX2xvY2FsX2dhbWVWZXJzaW9uRGF0YTFcIlxuICAgICAgICBsZXQgdmVyc2lvbkRhdGEgPSBjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5fbG9jYWxfZGF0YV9rZXkpXG4gICAgICAgIGlmKCF2ZXJzaW9uRGF0YSl7IFxuICAgICAgICAgICAgdmVyc2lvbkRhdGEgPSB0aGlzLmNyZWF0ZURlZmF1bHRWZXJzaW9uRGF0YSgpIFxuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICB2ZXJzaW9uRGF0YSA9IEpTT04ucGFyc2UodmVyc2lvbkRhdGEpXG4gICAgICAgIH0gXG4gICAgICAgIHRoaXMuX2xvY2FsX1ZlcnNpb24gPSB2ZXJzaW9uRGF0YVxuXG4gICAgICAgIHRoaXMuX3JvbW90ZVZlcnNpb24gPSB0aGlzLmNyZWF0ZURlZmF1bHRWZXJzaW9uRGF0YSgpXG4gICAgICAgIFxuICAgIH0sXG5cbiAgICBleGVjVW5wYWNrYWdlKG9uQ29tcGxhdGUpe1xuICAgICAgICB0aGlzLl91bnBhY2thZ2UuZXhlY1VucGFja2FnZShvbkNvbXBsYXRlKVxuICAgIH0sXG5cbiAgICBnZXROYXRpdmVQYXRoKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9uYXRpdmVSb290UGF0aFxuICAgIH0sXG4gICAgcmVxTG9vcFZlcnNpb25JbmZvKCl7XG4gICAgICAgIGlmKHRoaXMuX3VzZUhvdFVwZGF0ZSl7XG4gICAgICAgICAgICBpZih0aGlzLl9yZXFMb29wSGFuZGxlcil7IHJldHVybiB9XG4gICAgICAgICAgICB0aGlzLl9yZXFMb29wSGFuZGxlciA9ICgpPT57XG4gICAgICAgICAgICAgICAgdGhpcy5yZXFWZXJzaW9uSW5mbygpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlKHRoaXMuX3JlcUxvb3BIYW5kbGVyLCB0aGlzLl9kZXRlY3ROZXdWZXJzaW9uSW50ZXJ2YWwpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8g5pu05pawQULniYjmnKzlj7cgLCDmlrDljIXlronoo4Xop6PljovotYTmupDlkI7opobnm5bniYjmnKzlj7dcbiAgICBzZXRMb2NhbEFiVmVyc2lvbih2ZXJPYmope1xuXG4gICAgICAgIGxldCBsb2NhbE1hcCA9IHRoaXMuX2xvY2FsX1ZlcnNpb25cbiAgICAgICAgZm9yKGxldCBhYk5hbWUgaW4gdmVyT2JqKXtcbiAgICAgICAgICAgIGxldCB2ZXJTdHIgPSB2ZXJPYmpbYWJOYW1lXVxuXG4gICAgICAgICAgICBpZighbG9jYWxNYXAubW9kdWxlc1thYk5hbWVdKXsgICAvLyDov5DokKXkuK3mlrDlop7mqKHlnZdcbiAgICAgICAgICAgICAgICBsb2NhbE1hcC5tb2R1bGVzW2FiTmFtZV0gPSB7fVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbG9jYWxNYXAubW9kdWxlc1thYk5hbWVdLnJlc1ZlcnNpb24gPSB2ZXJTdHIgXG4gICAgICAgIH0gXG5cbiAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuX2xvY2FsX2RhdGFfa2V5LCBKU09OLnN0cmluZ2lmeSh0aGlzLl9sb2NhbF9WZXJzaW9uKSlcbiAgICB9LFxuXG4gICAgZ2V0X0xvY2FsVmVyc2lvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxfVmVyc2lvblxuICAgIH0sXG5cbiAgICBnZXRfUm9tb3RlVmVyc2lvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fcm9tb3RlVmVyc2lvblxuICAgIH0sXG5cbiAgICBjcmVhdGVEZWZhdWx0VmVyc2lvbkRhdGEoKXtcbiAgICAgICAgbGV0IHJldCA9IHtcbiAgICAgICAgICAgIGNsaWVudE1pbiA6IFwiMS4wLjBcIiAsIFxuICAgICAgICAgICAgbW9kdWxlcyA6IHt9XG4gICAgICAgIH0gICBcbiAgICAgICAgcmV0dXJuIHJldCBcbiAgICB9LFxuICAgIFxuICAgIC8vIOabtOaWsOaJgOacieaooeWdl1xuICAgIGhvdFVwZGF0ZUFsbE1vZHVsZShjYWxsYmFjaywgaXNTaG93SG90RGV0ZWN0QWxlcnQpe1xuICAgICAgICBpZighdGhpcy5fdXNlSG90VXBkYXRlKXtcbiAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDmmL7npLrmraPlnKjmo4DmtYvmm7TmlrDmj5DnpLpcbiAgICAgICAgaWYoaXNTaG93SG90RGV0ZWN0QWxlcnQpe1xuICAgICAgICAgICAgdGhpcy5fSG90VUlIZWxwZXIuY2hlY2tOZXdWZXJzaW9uU2hvdygpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5ob3RVcGRhdGVNdWx0aU1vZHVsZShPYmplY3Qua2V5cyh0aGlzLl9yb21vdGVWZXJzaW9uLm1vZHVsZXMpLCAoKT0+eyBcbiAgICAgICAgICAgIHRoaXMuX0hvdFVJSGVscGVyLmNoZWNrTmV3VmVyc2lvbkhpZGUoKVxuICAgICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICB9KVxuXG4gICAgfSxcblxuICAgIC8vIOe9rumhtuabtOaWsOaooeWdl1xuICAgIGhvdFVwZGF0ZU11bHRpTW9kdWxlKG1vZHVsZU5hbWVBcnIsIGNhbGxiYWNrKXtcbiAgICAgICAgaWYodGhpcy5pc05lZWRSZXFfdmVyc2lvbkluZm8oKSl7XG4gICAgICAgICAgICB0aGlzLnJlcVZlcnNpb25JbmZvKCgpPT57XG4gICAgICAgICAgICAgICAgdGhpcy5fZG9Ib3RVcGRhdGVNdWx0aShtb2R1bGVOYW1lQXJyLCBjYWxsYmFjaylcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2RvSG90VXBkYXRlTXVsdGkobW9kdWxlTmFtZUFyciwgY2FsbGJhY2spXG4gICAgICAgIH0gXG4gICAgfSxcbiAgICBfZG9Ib3RVcGRhdGVNdWx0aShtb2R1bGVOYW1lQXJyLCBjYWxsYmFjayl7XG4gICAgICAgIGlmKCF0aGlzLl91c2VIb3RVcGRhdGUpe1xuICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOWkp+eJiOacrOWkquaXp1xuICAgICAgICBpZigtMSA9PSB0aGlzLl9Nb2R1bGVDb20uY29tVmVyc2lvbihfR2xvYWJhbC5DbGllbnRfVmVyc2lvbiwgdGhpcy5fcm9tb3RlVmVyc2lvbi5jbGllbnRNaW4gKSl7XG4gICAgICAgICAgICB0aGlzLl9Ib3RVSUhlbHBlci5zaG93QWxlcnRDbGllbnRUb29PbGQoKVxuICAgICAgICAgICAgcmV0dXJuIFxuICAgICAgICB9XG4gICAgICAgIEpTX0xPRyhcIm1vZHVsZU5hbWVfb3JpOlwiLCBKU09OLnN0cmluZ2lmeShtb2R1bGVOYW1lQXJyKSApXG4gICAgICAgIG1vZHVsZU5hbWVBcnIgPSB0aGlzLmdldERlcGVuZE1vZHVsZShtb2R1bGVOYW1lQXJyKVxuICAgICAgICBKU19MT0coXCJtb2R1bGVOYW1lX2RlcDpcIiwgSlNPTi5zdHJpbmdpZnkobW9kdWxlTmFtZUFycikgKVxuXG4gICAgICAgIC8vIGlzU2hvd0hvdFVJIFxuICAgICAgICBsZXQgbmVlZF9VcGRhdGUgID0gZmFsc2UgXG4gICAgICAgIGxldCBuZWVkX1Jlc3RhcnQgPSBmYWxzZSBcblxuICAgICAgICAvLyDmiYDmnIltb2R1bGXmm7TmlrDlrozmiJBcbiAgICAgICAgbGV0IG9uQWxsTW9kdWxlSG90RmluaXNoID0gKCk9PntcbiAgICAgICAgICAgIEpTX0xPRyhcImhvdF91cGRhdGVfLUFsbEhvdF9GaW5pc2hcIilcbiAgICAgICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLl9sb2NhbF9kYXRhX2tleSwgSlNPTi5zdHJpbmdpZnkodGhpcy5fbG9jYWxfVmVyc2lvbikpXG4gICAgICAgICAgICBpZihuZWVkX1Jlc3RhcnQpe1xuICAgICAgICAgICAgICAgIC8vIHRoaXMuc2NoZWR1bGVPbmNlKCgpPT57IFxuICAgICAgICAgICAgICAgIC8vICAgICAvLyBjYy5zeXMucmVzdGFydFZNKCkgXG4gICAgICAgICAgICAgICAgLy8gICAgIGNjLmdhbWUucmVzdGFydCgpO1xuICAgICAgICAgICAgICAgIC8vIH0sIDAuMSlcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgXG4gICAgICAgICAgICAgICAgICAgIGNjLmdhbWUucmVzdGFydCgpO1xuICAgICAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOS4i+i9vSBhc3NldHMgYnVuZGxlIOi1hOa6kFxuICAgICAgICBsZXQgbmVlZFVwZGF0ZU5hbWVzID0gW11cbiAgICAgICAgbGV0IHByZWxvYWREaXIgPSAoKT0+e1xuICAgICAgICAgICAgdGhpcy5fTW9kdWxlQ29tLnNlcXVlbmNlTWlzKG5lZWRVcGRhdGVOYW1lcywgKCk9PntcbiAgICAgICAgICAgICAgICBKU19MT0coXCJob3RfdXBkYXRlXy1hbGxQcmVsb2FkRmluaXNoXCIpXG4gICAgICAgICAgICAgICAgLy8g5omA5pyJ5Lu75Yqh5a6M5oiQXG4gICAgICAgICAgICAgICAgdGhpcy5fSG90VUlIZWxwZXIuaGlkZVVwZGF0aW5nKG9uQWxsTW9kdWxlSG90RmluaXNoKVxuXG4gICAgICAgICAgICB9LCAoY3VyTWlzLCBpZHgsIG9uRXhlYyk9PnsgXG4gICAgICAgICAgICAgICAgLy8g5q+P5Liq6aKE5Yqg6L295Lu75YqhXG4gICAgICAgICAgICAgICAgbGV0IGN1ck1pc0lkeCA9IGlkeCsxXG4gICAgICAgICAgICAgICAgbGV0IHRvdGFsTWlzID0gbmVlZFVwZGF0ZU5hbWVzLmxlbmd0aFxuICAgICAgICAgICAgICAgIGxldCBtb2R1bGVPYmogPSB0aGlzLm1vZHVsZXNbbmVlZFVwZGF0ZU5hbWVzW2lkeF1dXG4gICAgICAgICAgICAgICAgbW9kdWxlT2JqLnByZWxvYWRNb2R1bGUoKGZpbmlzaCwgdG90YWwsIGl0ZW0pPT57XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gSlNfTE9HKFwiaG90X3VwZGF0ZV8tb25Qcm9ncmVzc19pbmZvXzpcIiwgY3VyTWlzSWR4LCBmaW5pc2gsIHRvdGFsLCBpdGVtLnVybCApXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX0hvdFVJSGVscGVyLm9uUHJvZ3Jlc3MoIGN1ck1pc0lkeCwgdG90YWxNaXMsIGZpbmlzaCwgdG90YWwpXG4gICAgICAgICAgICAgICAgfSwgKGl0ZW1zKT0+e1xuXG4gICAgICAgICAgICAgICAgICAgIEpTX0xPRyhcImhvdF91cGRhdGVfLXByZWxvYWRPS186XCIsIG5lZWRVcGRhdGVOYW1lc1tpZHhdIClcbiAgICAgICAgICAgICAgICAgICAgb25FeGVjKClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSDpobrluo/kuIvovb3phY3nva4gXG4gICAgICAgIHRoaXMuX01vZHVsZUNvbS5zZXF1ZW5jZU1pcyhtb2R1bGVOYW1lQXJyLCAoKT0+e1xuICAgICAgICAgICAgLy8g5omA5pyJ6YWN572u5LiL6L295a6M5oiQXG4gICAgICAgICAgICBpZihuZWVkX1VwZGF0ZSl7XG4gICAgICAgICAgICAgICAgdGhpcy5fSG90VUlIZWxwZXIuc2hvd1VwZGF0aW5nKDEsIG5lZWRVcGRhdGVOYW1lcy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgdGhpcy5fSG90VUlIZWxwZXIuc2hvd0hvdEFsZXJ0KG5lZWRfUmVzdGFydCwgKCk9PntcbiAgICAgICAgICAgICAgICAgICAgcHJlbG9hZERpcigpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICBvbkFsbE1vZHVsZUhvdEZpbmlzaCgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfSwgKGN1ck1pcywgaWR4LCBvbkV4ZWMpPT57IFxuICAgICAgICAgICAgLy8g5q+P5Liq6aKE5Yqg6L295Lu75YqhXG4gICAgICAgICAgICBsZXQgbW9kdWxlTmFtZSA9IG1vZHVsZU5hbWVBcnJbaWR4XVxuICAgICAgICAgICAgbGV0IHJldFRlbXAgPSB7fVxuICAgICAgICAgICAgcmV0VGVtcCA9IHRoaXMuX2hvdFVwZGF0ZU1vZHVsZShtb2R1bGVOYW1lLCAoaG90X3JldCk9PntcbiAgICAgICAgICAgICAgICBsZXQge2hhdmVOZXdWZXIsIG5lZWRSZXN0YXJ0fSA9IGhvdF9yZXRcbiAgICAgICAgICAgICAgICBpZihoYXZlTmV3VmVyKSB7IFxuICAgICAgICAgICAgICAgICAgICBuZWVkX1VwZGF0ZSA9IHRydWUgXG4gICAgICAgICAgICAgICAgICAgIG5lZWRVcGRhdGVOYW1lcy5wdXNoKG1vZHVsZU5hbWUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKG5lZWRSZXN0YXJ0KSB7IG5lZWRfUmVzdGFydCA9IHRydWUgfVxuICAgICAgICAgICAgICAgIG9uRXhlYygpXG4gICAgICAgICAgICB9KSBcbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcbiAgICAgICAgfSlcbiAgICAgICAgXG4gICAgfSxcblxuICAgIC8vIOiOt+WPluS+nei1luaooeWdlywg5bm25o6S5bqPXG4gICAgZ2V0RGVwZW5kTW9kdWxlKG5hbWVzLCBoKXtcbiAgICAgICAgaCA9IGggfHwgMVxuICAgICAgICBsZXQgcm1zID0gdGhpcy5fcm9tb3RlVmVyc2lvbi5tb2R1bGVzIFxuICAgICAgICBsZXQgcmV0ID0ge31cbiAgICAgICAgZm9yKGxldCBpZHggaW4gbmFtZXMpe1xuICAgICAgICAgICAgbGV0IG5fMSA9IG5hbWVzW2lkeF1cbiAgICAgICAgICAgIHJldFtuXzFdID0geyBuYW1lOm5fMSwgcHJpb3JpdHk6cm1zW25fMV0ucHJpb3JpdHl9XG5cbiAgICAgICAgICAgIGxldCBkZXBlbmRzID0gdGhpcy5nZXREZXBlbmRNb2R1bGUocm1zW25fMV0uZGVwZW5kIHx8IFtdLCBoKzEpXG4gICAgICAgICAgICBmb3IobGV0IGogaW4gZGVwZW5kcyl7XG4gICAgICAgICAgICAgICAgbGV0IG5fMiA9IGRlcGVuZHNbal1cbiAgICAgICAgICAgICAgICByZXRbbl8yXSA9IHsgbmFtZTpuXzIsIHByaW9yaXR5OnJtc1tuXzJdLnByaW9yaXR5fVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8v5o6S5bqPLCDkvJjlhYjnuqfpq5jnmoTlhYjmm7TmlrAgXG4gICAgICAgIGlmKGg9PTEpe1xuICAgICAgICAgICAgbGV0IG1pbmZvcyA9IE9iamVjdC52YWx1ZXMocmV0KVxuICAgICAgICAgICAgbWluZm9zLnNvcnQoZnVuY3Rpb24oYSxiKXsgIFxuICAgICAgICAgICAgICAgIGlmKGEucHJpb3JpdHkgPiBiLnByaW9yaXR5KXsgcmV0dXJuIC0xfVxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldCA9IHt9XG4gICAgICAgICAgICBmb3IobGV0IGlkeCBpbiAgbWluZm9zKXtcbiAgICAgICAgICAgICAgICByZXRbbWluZm9zW2lkeF0ubmFtZV0gPSAxXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMocmV0KVxuICAgIH0sXG5cbiAgICAvLyDmm7TmlrDliLDmnIDmlrDniYjmnKwgXG4gICAgX2hvdFVwZGF0ZU1vZHVsZShtb2R1bGVOYW1lLCBjYWxsYmFjayl7XG4gICAgICAgIGlmKCF0aGlzLl91c2VIb3RVcGRhdGUpe1xuICAgICAgICAgICAgbGV0IHJldCA9IHsgaGF2ZU5ld1ZlcjpmYWxzZSwgbmVlZFJlc3RhcnQ6ZmFsc2UgfTtcbiAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKHJldCk7XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGxvY2FsX1ZlciA9IHRoaXMuX2xvY2FsX1ZlcnNpb24ubW9kdWxlc1ttb2R1bGVOYW1lXS5yZXNWZXJzaW9uXG4gICAgICAgIGxldCByb21vdGVWZXIgPSB0aGlzLl9yb21vdGVWZXJzaW9uLm1vZHVsZXNbbW9kdWxlTmFtZV0ucmVzVmVyc2lvblxuICAgICAgICBsZXQgbW9kdWxlT2JqID0gdGhpcy5tb2R1bGVzW21vZHVsZU5hbWVdXG5cbiAgICAgICAgSlNfTE9HKFwidmVyc2lvbl9pbmZvX2RhdGFfLWxvY2FsOlwiLCBKU09OLnN0cmluZ2lmeSh0aGlzLl9sb2NhbF9WZXJzaW9uKSApXG4gICAgICAgIEpTX0xPRyhcInZlcnNpb25faW5mb19kYXRhXy1yZW1vdGU6XCIsIEpTT04uc3RyaW5naWZ5KHRoaXMuX3JvbW90ZVZlcnNpb24pIClcblxuICAgICAgICBsZXQgcmV0ID0geyBoYXZlTmV3VmVyOiAobG9jYWxfVmVyICE9IHJvbW90ZVZlciksIG5lZWRSZXN0YXJ0OmZhbHNlIH1cblxuICAgICAgICBsZXQgbG9hZFZlckZ1bmMgPSAobU9iaiwgdmVyLCBjYik9PntcbiAgICAgICAgICAgIG1PYmoubG9hZEFCKCgpPT57XG4gICAgICAgICAgICAgICAgaWYobG9jYWxfVmVyICE9IHJvbW90ZVZlcil7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvY2FsX1ZlcnNpb24ubW9kdWxlc1ttb2R1bGVOYW1lXS5yZXNWZXJzaW9uID0gcm9tb3RlVmVyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvY2FsX1ZlcnNpb24ubW9kdWxlc1ttb2R1bGVOYW1lXS5zaG93VmVyID0gdGhpcy5fcm9tb3RlVmVyc2lvbi5tb2R1bGVzW21vZHVsZU5hbWVdLnNob3dWZXJcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNiICYmIGNiKCk7XG4gICAgICAgICAgICB9LCB2ZXIpXG4gICAgICAgIH1cblxuICAgICAgICBpZighbW9kdWxlT2JqKXtcbiAgICAgICAgICAgIC8vIOacquWKoOi9vei/hywg5pu05paw5ZCO5LiN6ZyA6KaB6YeN5ZCvXG4gICAgICAgICAgICBtb2R1bGVPYmogPSBuZXcgTW9kdWxlKClcbiAgICAgICAgICAgIGxvYWRWZXJGdW5jKCBtb2R1bGVPYmouaW5pdChtb2R1bGVOYW1lKSwgcm9tb3RlVmVyLCAoKT0+e1xuICAgICAgICAgICAgICAgIHRoaXMubW9kdWxlc1ttb2R1bGVOYW1lXSA9IG1vZHVsZU9ialxuICAgICAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKHJldCk7XG4gICAgICAgICAgICB9KSBcblxuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAvLyDlt7LliqDovb0sIOiLpeacieabtOaWsOWImeabtOaWsOWQjumHjeWQr1xuICAgICAgICAgICAgaWYobG9jYWxfVmVyID09IHJvbW90ZVZlcil7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2socmV0KTtcbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICByZXQubmVlZFJlc3RhcnQgPSB0cnVlIFxuICAgICAgICAgICAgICAgIGxvYWRWZXJGdW5jKG1vZHVsZU9iaiwgcm9tb3RlVmVyLCAoKT0+e1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhyZXQpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldFxuXG4gICAgfSxcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRCdW5kbGUobW9kdWxlTmFtZSl7XG4gICAgICAgIC8vIEpTX0xPRyhcIk1vZHVsZU1hZ19nZXRidW5kbGVfXzpcIiwgbW9kdWxlTmFtZSlcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kdWxlc1ttb2R1bGVOYW1lXS5fYWJPYmpcbiAgICB9LFxuXG4gICAgZ2V0TW9kdWxlKG1vZHVsZU5hbWUpe1xuICAgICAgICByZXR1cm4gdGhpcy5tb2R1bGVzW21vZHVsZU5hbWVdXG4gICAgfSxcblxuICAgIGFkZE1vZHVsZShtb2R1bGVOYW1lLCBjYil7XG4gICAgICAgIGxldCBtb2R1bGUgPSB0aGlzLm1vZHVsZXNbbW9kdWxlTmFtZV1cbiAgICAgICAgSlNfTE9HKFwibW9kdWxlX21hZy1hZGRNT2R1bGU6XCIsIG1vZHVsZU5hbWUsIG1vZHVsZSApXG4gICAgICAgIGlmKG1vZHVsZSl7IFxuICAgICAgICAgICAgY2IobW9kdWxlKVxuICAgICAgICAgICAgcmV0dXJuIG1vZHVsZVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVtb3ZlTW9kdWxlKG1vZHVsZU5hbWUpXG5cbiAgICAgICAgSlNfTE9HKFwibG9hZF9BQl9fX186XCIsIG1vZHVsZU5hbWUpXG5cbiAgICAgICAgbGV0IG1vZHVsZU9iaiA9IG5ldyBNb2R1bGUoKVxuICAgICAgICBtb2R1bGVPYmouaW5pdChtb2R1bGVOYW1lLCB0aGlzLl91c2VIb3RVcGRhdGUpLmxvYWRBQigoKT0+e1xuICAgICAgICAgICAgdGhpcy5tb2R1bGVzW21vZHVsZU5hbWVdID0gbW9kdWxlT2JqXG4gICAgICAgICAgICBjYiAmJiBjYihtb2R1bGVPYmopXG4gICAgICAgIH0pXG5cbiAgICB9LFxuXG4gICAgcmVtb3ZlTW9kdWxlKG1vZHVsZU5hbWUpe1xuICAgICAgICBsZXQgbW9kdWxlT2JqID0gdGhpcy5tb2R1bGVzW21vZHVsZU5hbWVdXG4gICAgICAgIGlmKCFtb2R1bGVPYmopeyByZXR1cm4gfVxuICAgICAgICBtb2R1bGVPYmoucmVsZWFzZUFCKClcbiAgICAgICAgZGVsZXRlIHRoaXMubW9kdWxlc1ttb2R1bGVOYW1lXTtcbiAgICB9LFxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPj4g5p+l6K+i5paw54mI5pysXG4gICAgaXNOZWVkUmVxX3ZlcnNpb25JbmZvKCl7XG4gICAgICAgIGlmKE1vZHVsZUNvbnN0LnJlcVZlcnNpb25JbW1lZGlhdGVseSl7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZSBcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjdXJUaW1lID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKSAgXG4gICAgICAgIEpTX0xPRyhcImlzX25lZWRfcmVxX3Zlcl86XCIsIGN1clRpbWUgLCB0aGlzLl9sYXN0UmVxX1ZlcnNpb25JbmZvVGltZSlcbiAgICAgICAgaWYoY3VyVGltZSAtIHRoaXMuX2xhc3RSZXFfVmVyc2lvbkluZm9UaW1lID4gdGhpcy5fZGV0ZWN0TmV3VmVyc2lvbkludGVydmFsKjEwMDApeyBcbiAgICAgICAgICAgIHJldHVybiB0cnVlIFxuICAgICAgICB9IFxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9LFxuXG4gICAgcmVxVmVyc2lvbkluZm8oY2FsbGJhY2spe1xuICAgICAgICBpZighdGhpcy5fdXNlSG90VXBkYXRlKXtcbiAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5faHR0cFJlcUhhbmRsZXIpe1xuICAgICAgICAgICAgdGhpcy5faHR0cFJlcUhhbmRsZXIuYWJvcnQoKVxuICAgICAgICB9XG4gICAgICAgIGxldCB2ZXJVcmwgPSBNb2R1bGVDb25zdC5ob3RVcmwgKyBcInZlcmNvbmZpZy5qc29uXCIgKyBcIj9yZW5ldz1cIiArIHRoaXMuX01vZHVsZUNvbS5jcmVhdGVVVUlEKCkgXG4gICAgICAgIEpTX0xPRyhcInJlcV92ZXJzaW9uX3VybF86XCIsIHZlclVybClcblxuICAgICAgICB0aGlzLl9odHRwUmVxSGFuZGxlciA9IHRoaXMuX01vZHVsZUNvbS5tYWtlWE1MSHR0cCh7dXJsOiB2ZXJVcmwsIGNhbGxiYWNrOihfYXJncyk9PntcblxuICAgICAgICAgICAgbGV0IGh0dHBEYXRhID0gX2FyZ3MucmV0RGF0YVxuICAgICAgICAgICAgaWYoIWh0dHBEYXRhKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5faHR0cFJlcUhhbmRsZXIgPSBudWxsXG4gICAgICAgICAgICB0aGlzLl9yb21vdGVWZXJzaW9uID0gaHR0cERhdGFcblxuICAgICAgICAgICAgSlNfTE9HKFwib25SZXFWZXJzaW9uX0luZm9fOlwiLCBKU09OLnN0cmluZ2lmeShodHRwRGF0YSkgKVxuICAgICAgICAgICAgbGV0IGxvY2FsTWFwID0gdGhpcy5fbG9jYWxfVmVyc2lvblxuICAgICAgICAgICAgbGV0IHJlbW90ZU1hcCA9IGh0dHBEYXRhXG4gICAgICAgICAgICBsZXQgbmVlZFNhdmUgPSBmYWxzZSBcblxuICAgICAgICAgICAgZm9yKGxldCBtb2R1bGVOYW1lIGluIHJlbW90ZU1hcC5tb2R1bGVzKXsgXG5cbiAgICAgICAgICAgICAgICBpZighbG9jYWxNYXAubW9kdWxlc1ttb2R1bGVOYW1lXSl7ICAgLy8g6L+Q6JCl5Lit5paw5aKe5qih5Z2XXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsTWFwLm1vZHVsZXNbbW9kdWxlTmFtZV0gPSB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZighbG9jYWxNYXAubW9kdWxlc1ttb2R1bGVOYW1lXS5zaG93VmVyKXtcbiAgICAgICAgICAgICAgICAgICAgbmVlZFNhdmUgPSB0cnVlIFxuICAgICAgICAgICAgICAgICAgICBsb2NhbE1hcC5tb2R1bGVzW21vZHVsZU5hbWVdLnNob3dWZXIgPSAocmVtb3RlTWFwLm1vZHVsZXNbbW9kdWxlTmFtZV0uc2hvd1ZlcilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKG5lZWRTYXZlKXtcbiAgICAgICAgICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5fbG9jYWxfZGF0YV9rZXksIEpTT04uc3RyaW5naWZ5KHRoaXMuX2xvY2FsX1ZlcnNpb24pKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9sYXN0UmVxX1ZlcnNpb25JbmZvVGltZSA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKClcbiAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG4gICAgICAgIH19KSBcbiAgICAgICAgXG4gICAgfSxcbiAgICBcblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLTw8IOafpeivouaWsOeJiOacrFxuXG59KTtcbiJdfQ==