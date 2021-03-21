"use strict";
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