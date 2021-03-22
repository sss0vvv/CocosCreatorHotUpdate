window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  AppCom: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6a88bX1IYNKDLa1BfbIRaSp", "AppCom");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {}
    });
    cc._RF.pop();
  }, {} ],
  AppConst: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f2b74+9zb9H/6tjSd23XYzc", "AppConst");
    "use strict";
    var AppConst = {};
    module.exports = AppConst;
    cc._RF.pop();
  }, {} ],
  HelloWorld: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "280c3rsZJJKnZ9RqbALVwtK", "HelloWorld");
    "use strict";
    window._Gloabal = {
      Client_Version: "1.0.0"
    };
    var JS_LOG = function JS_LOG() {
      var _cc;
      for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) arg[_key] = arguments[_key];
      (_cc = cc).log.apply(_cc, [ "[HelloWorld]" ].concat(arg));
    };
    cc.Class({
      extends: cc.Component,
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
        window._G_AppCom = this._AppCom = this.getComponent("AppCom");
        var moduleMagObj = cc.instantiate(this.ModuleMagPreFab);
        moduleMagObj.parent = this.msgLayer;
        window._G_moduleMag = moduleMagObj.getComponent("ModuleManager");
        _G_moduleMag.initCom({
          useHotUpdate: true
        });
        _G_moduleMag.execUnpackage(function() {
          _G_moduleMag.reqVersionInfo(function() {
            _this.reloadLobbyRoot();
          });
        });
        _G_moduleMag.reqLoopVersionInfo();
      },
      reloadLobbyRoot: function reloadLobbyRoot() {
        var _this2 = this;
        var loadAb = [ "ABLobby" ];
        _G_moduleMag.hotUpdateMultiModule(loadAb, function() {
          _G_moduleMag.addModule("ABLobby", function(moduleObj) {
            var abObj = moduleObj.getABObj();
            abObj.load("root/Scene/LobbyRoot", cc.Prefab, function(err, prefab) {
              JS_LOG("load_lobby_prefab_:", JSON.stringify(err));
              _this2._lobbyRootNode && _this2._lobbyRootNode.destroy();
              var lobbyRoot = cc.instantiate(prefab);
              _this2._lobbyRootNode = lobbyRoot;
              _this2.moduleLayer.addChild(lobbyRoot, 100);
              lobbyRoot.getComponent("LobbyRoot").initModule();
            });
          });
        });
      },
      onKeyUp: function onKeyUp(event) {
        cc.sys.os == cc.sys.OS_WINDOWS && 9 == event.keyCode && this.hackSys_Log_Save();
      },
      hackSys_Log_Save: function hackSys_Log_Save() {
        if (!this._logArr) return;
        var totalLen = this._logArr.length;
        var reportCo = 2e3;
        var beginIdx = totalLen - reportCo;
        beginIdx = beginIdx >= 0 ? beginIdx : 0;
        var arrTemp = [];
        for (var i = beginIdx; i < totalLen; i++) arrTemp.push(this._logArr[i]);
        var retMsg = arrTemp.join("\n");
        if ("undefined" != typeof jsb) {
          var path = jsb.fileUtils.getDefaultResourceRootPath();
          path || (path = jsb.fileUtils.getWritablePath());
          jsb.fileUtils.writeStringToFile(retMsg, path + "alogRecord.txt");
        }
      },
      hackSysLog: function hackSysLog() {
        var _excludeStr;
        if (this._initHackLog) return;
        this._initHackLog = true;
        var _logArr = [];
        this._logArr = _logArr;
        var MAX_STR_LEN = 1300;
        var excludeStr = (_excludeStr = {}, _excludeStr["Can't find letter definition in texture"] = 1, 
        _excludeStr);
        var push_log = function push_log() {
          var ignore = false;
          for (var _len2 = arguments.length, arg = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) arg[_key2] = arguments[_key2];
          var logStr = arg.join(" ");
          var strLen = logStr.length;
          for (var idx = 0; idx < strLen; ) {
            var endIdx = idx + MAX_STR_LEN;
            var splitStr = logStr.slice(idx, endIdx);
            for (var excStr in excludeStr) if (0 == splitStr.indexOf(excStr, 0)) {
              ignore = true;
              break;
            }
            ignore || _logArr.push("_" + _logArr.length + "_=> " + splitStr + (endIdx < strLen ? "--\x3e" : ""));
            idx = endIdx;
          }
          return ignore;
        };
        var logDef = function logDef() {
          for (var _len3 = arguments.length, arg = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) arg[_key3] = arguments[_key3];
          var ignore = push_log.apply(void 0, arg);
          if (!ignore) {
            var _cc$_sv_log_2_Ori;
            (_cc$_sv_log_2_Ori = cc._sv_log_2_Ori).call.apply(_cc$_sv_log_2_Ori, [ cc ].concat(arg));
          }
        };
        var consoleLogDef = function consoleLogDef() {
          for (var _len4 = arguments.length, arg = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) arg[_key4] = arguments[_key4];
          var ignore = push_log.apply(void 0, arg);
          if (!ignore && cc._sv_console_2_logOri) {
            var _cc$_sv_console_2_log;
            (_cc$_sv_console_2_log = cc._sv_console_2_logOri).call.apply(_cc$_sv_console_2_log, [ console ].concat(arg));
          }
        };
        cc._sv_log_2_Ori || (cc._sv_log_2_Ori = cc.log);
        cc._sv_console_2_logOri || (cc._sv_console_2_logOri = console.log);
        cc.log = logDef;
        console.log = consoleLogDef;
      }
    });
    cc._RF.pop();
  }, {} ],
  HotUIHelper: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "94b2188y2pCvI56J6HJiCMG", "HotUIHelper");
    "use strict";
    var JS_LOG = function JS_LOG() {
      var _cc;
      for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) arg[_key] = arguments[_key];
      (_cc = cc).log.apply(_cc, [ "[HotUIHelper]" ].concat(arg));
    };
    cc.Class({
      extends: cc.Component,
      properties: {},
      initCom: function initCom() {
        if (this._isInited) return;
        this._isInited = true;
        cc.log("hot_helper_init");
      },
      hideUpdating: function hideUpdating(callback) {
        JS_LOG("hideUpdating");
        callback && callback();
      },
      onProgress: function onProgress(curMis, totalMis, finish, total) {
        JS_LOG("onProgress : curMis_" + curMis + ",totalMis_" + totalMis + ",finish_" + finish + ",total_" + total);
      },
      showUpdating: function showUpdating(curMis, totalMis) {},
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
      unpackageShow: function unpackageShow() {
        JS_LOG("unpackageShow");
      },
      unpackageUpdateProgress: function unpackageUpdateProgress(finish, total) {
        JS_LOG("unpackageUpdateProgress_:", finish, total);
      },
      unpackageFinish: function unpackageFinish() {
        JS_LOG("unpackageFinish");
      },
      checkNewVersionShow: function checkNewVersionShow() {
        JS_LOG("checkNewVersionShow");
      },
      checkNewVersionHide: function checkNewVersionHide() {
        JS_LOG("checkNewVersionHide");
      }
    });
    cc._RF.pop();
  }, {} ],
  ModuleCom: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "aede5xN1u9C0ou+QZmbwKN2", "ModuleCom");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      makeXMLHttp: function makeXMLHttp(args) {
        var timeout = args.timeout, url = args.url, callback = args.callback;
        var retInfo = {};
        var isValid = true;
        var xhr = new XMLHttpRequest();
        xhr.timeout = Math.ceil(1e3 * (timeout || 6));
        xhr.onreadystatechange = function() {
          if (4 == xhr.readyState && xhr.status >= 200 && xhr.status < 400) {
            if (!isValid) return;
            isValid = false;
            var httpDatas = JSON.parse(xhr.responseText);
            callback({
              retData: httpDatas
            });
          } else if (4 == xhr.readyState && 0 == xhr.status) {
            if (!isValid) return;
            isValid = false;
            callback({
              fail: true
            });
          } else if (4 == xhr.readyState) {
            if (!isValid) return;
            isValid = false;
            callback({
              fail: true
            });
          }
        };
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send();
        xhr.ontimeout = function() {
          if (!isValid) return;
          isValid = false;
          callback({
            isTimeout: true
          });
        };
        retInfo.abort = function() {
          isValid = false;
          xhr.abort();
        };
        return retInfo;
      },
      parallelMis: function parallelMis(callback) {
        var co = 0;
        var ret = {};
        co += 1;
        var isValid = true;
        var retArgs = {};
        var onFinish = function onFinish(args) {
          if (!isValid) return;
          co -= 1;
          args && (retArgs = Object.assign(retArgs, args));
          co <= 0 && callback && callback(retArgs);
        };
        ret.onFinish = onFinish;
        ret.addMis = function() {
          co += 1;
          return onFinish;
        };
        ret.start = function() {
          onFinish();
        };
        ret.close = function() {
          isValid = false;
        };
        return ret;
      },
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
          co += 1;
          execFunc(mis, curCo, _execMis);
        };
        _execMis();
      },
      comVersion: function comVersion(localVer, romoteVer) {
        var verSplit_local = localVer.split(".");
        var verSplit_remote = romoteVer.split(".");
        var localCo = verSplit_local.length;
        var remoteCo = verSplit_remote.length;
        var maxCo = localCo > remoteCo ? localCo : remoteCo;
        for (var i = 0; i < maxCo; i++) {
          var n_local = parseInt(verSplit_local[i], 10);
          var n_remote = parseInt(verSplit_remote[i], 10);
          if (i < localCo && i >= remoteCo) return 1;
          if (i >= localCo && i < remoteCo) return -1;
          if (n_local > n_remote) return 1;
          if (n_local < n_remote) return -1;
        }
        return 0;
      },
      createUUID: function createUUID() {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
        var uuid = [];
        for (var i = 0; i < 4; i++) uuid[i] = chars[0 | 36 * Math.random()];
        var uid = uuid.join("");
        uid = Number(Date.now()).toString(36) + uid;
        return uid;
      }
    });
    cc._RF.pop();
  }, {} ],
  ModuleConst: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "49044JecXNDAowkrlJVI34Z", "ModuleConst");
    "use strict";
    var ModuleConst = {
      hotUrl: "http://192.168.50.88:8089/dashboard/hotTest/",
      localVersionConfigKey: "_local_gameVersionData1",
      localClientVer: "__sv_loacal_client_ver",
      reqVersionImmediately: true
    };
    module.exports = ModuleConst;
    cc._RF.pop();
  }, {} ],
  ModuleManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b6217/615JErYXwd3FBXEAH", "ModuleManager");
    "use strict";
    var Module = require("Module");
    var ModuleConst = require("ModuleConst");
    var JS_LOG = function JS_LOG() {
      var _cc;
      for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) arg[_key] = arguments[_key];
      (_cc = cc).log.apply(_cc, [ "[ModuleManager]" ].concat(arg));
    };
    cc.Class({
      extends: cc.Component,
      properties: {
        asset1: {
          default: null,
          type: cc.Asset
        },
        asset2: {
          default: null,
          type: cc.Asset
        }
      },
      onLoad: function onLoad() {
        this._ModuleCom = this.getComponent("ModuleCom");
        this._unpackage = this.getComponent("UnpackageHelper");
        this._HotUIHelper = this.getComponent("HotUIHelper");
        this._nativeRootPath = "";
        if ("undefined" != typeof jsb) {
          var absPath1 = jsb.fileUtils.fullPathForFilename(this.asset1.nativeUrl).replace("//", "/");
          var absPath2 = jsb.fileUtils.fullPathForFilename(this.asset2.nativeUrl).replace("//", "/");
          var testLen = absPath1.length > absPath2.length ? absPath2.length : absPath1.length;
          for (var i = 0; i < testLen; i++) if (absPath1[i] != absPath2[i]) {
            this._nativeRootPath = absPath1.substring(0, i);
            break;
          }
          cc.log("default_path_:", jsb.fileUtils.getDefaultResourceRootPath());
          cc.log("absFile_path_2:", this._nativeRootPath);
        }
      },
      initCom: function initCom(args) {
        var useHotUpdate = args.useHotUpdate;
        this._unpackage.initCom(args);
        this._useHotUpdate = useHotUpdate;
        this._lastReq_VersionInfoTime = 0;
        this._detectNewVersionInterval = 30;
        this.modules = {};
        this._local_data_key = ModuleConst.localVersionConfigKey;
        var versionData = cc.sys.localStorage.getItem(this._local_data_key);
        versionData = versionData ? JSON.parse(versionData) : this.createDefaultVersionData();
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
          if (this._reqLoopHandler) return;
          this._reqLoopHandler = function() {
            _this.reqVersionInfo();
          };
          this.schedule(this._reqLoopHandler, this._detectNewVersionInterval);
        }
      },
      setLocalAbVersion: function setLocalAbVersion(verObj) {
        var localMap = this._local_Version;
        for (var abName in verObj) {
          var verStr = verObj[abName];
          localMap.modules[abName] || (localMap.modules[abName] = {});
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
      hotUpdateAllModule: function hotUpdateAllModule(callback, isShowHotDetectAlert) {
        var _this2 = this;
        if (!this._useHotUpdate) {
          callback && callback();
          return false;
        }
        isShowHotDetectAlert && this._HotUIHelper.checkNewVersionShow();
        return this.hotUpdateMultiModule(Object.keys(this._romoteVersion.modules), function() {
          _this2._HotUIHelper.checkNewVersionHide();
          callback();
        });
      },
      hotUpdateMultiModule: function hotUpdateMultiModule(moduleNameArr, callback) {
        var _this3 = this;
        this.isNeedReq_versionInfo() ? this.reqVersionInfo(function() {
          _this3._doHotUpdateMulti(moduleNameArr, callback);
        }) : this._doHotUpdateMulti(moduleNameArr, callback);
      },
      _doHotUpdateMulti: function _doHotUpdateMulti(moduleNameArr, callback) {
        var _this4 = this;
        if (!this._useHotUpdate) {
          callback && callback();
          return false;
        }
        if (-1 == this._ModuleCom.comVersion(_Gloabal.Client_Version, this._romoteVersion.clientMin)) {
          this._HotUIHelper.showAlertClientTooOld();
          return;
        }
        JS_LOG("moduleName_ori:", JSON.stringify(moduleNameArr));
        moduleNameArr = this.getDependModule(moduleNameArr);
        JS_LOG("moduleName_dep:", JSON.stringify(moduleNameArr));
        var need_Update = false;
        var need_Restart = false;
        var onAllModuleHotFinish = function onAllModuleHotFinish() {
          JS_LOG("hot_update_-AllHot_Finish");
          cc.sys.localStorage.setItem(_this4._local_data_key, JSON.stringify(_this4._local_Version));
          need_Restart ? setTimeout(function() {
            cc.game.restart();
          }, 100) : callback && callback();
        };
        var needUpdateNames = [];
        var preloadDir = function preloadDir() {
          _this4._ModuleCom.sequenceMis(needUpdateNames, function() {
            JS_LOG("hot_update_-allPreloadFinish");
            _this4._HotUIHelper.hideUpdating(onAllModuleHotFinish);
          }, function(curMis, idx, onExec) {
            var curMisIdx = idx + 1;
            var totalMis = needUpdateNames.length;
            var moduleObj = _this4.modules[needUpdateNames[idx]];
            moduleObj.preloadModule(function(finish, total, item) {
              _this4._HotUIHelper.onProgress(curMisIdx, totalMis, finish, total);
            }, function(items) {
              JS_LOG("hot_update_-preloadOK_:", needUpdateNames[idx]);
              onExec();
            });
          });
        };
        this._ModuleCom.sequenceMis(moduleNameArr, function() {
          if (need_Update) {
            _this4._HotUIHelper.showUpdating(1, needUpdateNames.length);
            _this4._HotUIHelper.showHotAlert(need_Restart, function() {
              preloadDir();
            });
          } else onAllModuleHotFinish();
        }, function(curMis, idx, onExec) {
          var moduleName = moduleNameArr[idx];
          var retTemp = {};
          retTemp = _this4._hotUpdateModule(moduleName, function(hot_ret) {
            var haveNewVer = hot_ret.haveNewVer, needRestart = hot_ret.needRestart;
            if (haveNewVer) {
              need_Update = true;
              needUpdateNames.push(moduleName);
            }
            needRestart && (need_Restart = true);
            onExec();
          });
        });
      },
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
        }
        if (1 == h) {
          var minfos = Object.values(ret);
          minfos.sort(function(a, b) {
            if (a.priority > b.priority) return -1;
            return 1;
          });
          ret = {};
          for (var _idx in minfos) ret[minfos[_idx].name] = 1;
        }
        return Object.keys(ret);
      },
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
          mObj.loadAB(function() {
            if (local_Ver != romoteVer) {
              _this5._local_Version.modules[moduleName].resVersion = romoteVer;
              _this5._local_Version.modules[moduleName].showVer = _this5._romoteVersion.modules[moduleName].showVer;
            }
            cb && cb();
          }, ver);
        };
        if (moduleObj) if (local_Ver == romoteVer) callback && callback(ret); else {
          ret.needRestart = true;
          loadVerFunc(moduleObj, romoteVer, function() {
            callback && callback(ret);
          });
        } else {
          moduleObj = new Module();
          loadVerFunc(moduleObj.init(moduleName), romoteVer, function() {
            _this5.modules[moduleName] = moduleObj;
            callback && callback(ret);
          });
        }
        return ret;
      },
      getBundle: function getBundle(moduleName) {
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
        moduleObj.init(moduleName, this._useHotUpdate).loadAB(function() {
          _this6.modules[moduleName] = moduleObj;
          cb && cb(moduleObj);
        });
      },
      removeModule: function removeModule(moduleName) {
        var moduleObj = this.modules[moduleName];
        if (!moduleObj) return;
        moduleObj.releaseAB();
        delete this.modules[moduleName];
      },
      isNeedReq_versionInfo: function isNeedReq_versionInfo() {
        if (ModuleConst.reqVersionImmediately) return true;
        var curTime = new Date().getTime();
        JS_LOG("is_need_req_ver_:", curTime, this._lastReq_VersionInfoTime);
        if (curTime - this._lastReq_VersionInfoTime > 1e3 * this._detectNewVersionInterval) return true;
        return false;
      },
      reqVersionInfo: function reqVersionInfo(_callback) {
        var _this7 = this;
        if (!this._useHotUpdate) {
          _callback && _callback();
          return false;
        }
        this._httpReqHandler && this._httpReqHandler.abort();
        var verUrl = ModuleConst.hotUrl + "verconfig.json?renew=" + this._ModuleCom.createUUID();
        JS_LOG("req_version_url_:", verUrl);
        this._httpReqHandler = this._ModuleCom.makeXMLHttp({
          url: verUrl,
          callback: function callback(_args) {
            var httpData = _args.retData;
            if (!httpData) return;
            _this7._httpReqHandler = null;
            _this7._romoteVersion = httpData;
            JS_LOG("onReqVersion_Info_:", JSON.stringify(httpData));
            var localMap = _this7._local_Version;
            var remoteMap = httpData;
            var needSave = false;
            for (var moduleName in remoteMap.modules) {
              localMap.modules[moduleName] || (localMap.modules[moduleName] = {});
              if (!localMap.modules[moduleName].showVer) {
                needSave = true;
                localMap.modules[moduleName].showVer = remoteMap.modules[moduleName].showVer;
              }
            }
            needSave && cc.sys.localStorage.setItem(_this7._local_data_key, JSON.stringify(_this7._local_Version));
            _this7._lastReq_VersionInfoTime = new Date().getTime();
            _callback && _callback();
          }
        });
      }
    });
    cc._RF.pop();
  }, {
    Module: "Module",
    ModuleConst: "ModuleConst"
  } ],
  Module: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8d2894O671LYIFcKbt6EeqD", "Module");
    "use strict";
    var JS_LOG = function JS_LOG() {
      var _cc;
      for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) arg[_key] = arguments[_key];
      (_cc = cc).log.apply(_cc, [ "[Module]" ].concat(arg));
    };
    var ModuleConst = require("ModuleConst");
    cc.Class({
      extends: cc.Component,
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
        var loadArg = {};
        version && (loadArg.version = version);
        var isValid = true;
        var abUrl = this._ABName;
        this._useHotUpdate && (abUrl = ModuleConst.hotUrl + "remote/" + this._ABName);
        JS_LOG("loadAB_:", this._ABName, abUrl);
        cc.assetManager.loadBundle(abUrl, loadArg, function(err, bundle) {
          if (!isValid) return;
          isValid = false;
          if (err) {
            JS_LOG("load_ab_Err_:", _this._ABName, JSON.stringify(err));
            _this.scheduleOnce(function() {
              _this.loadAB(cb, version);
            }, 3);
          } else {
            JS_LOG("loadAB_OK_:", _this._ABName);
            _this._abObj = bundle;
            cb();
          }
        });
      },
      preloadModule: function preloadModule(onProgress, onComplete) {
        var _this2 = this;
        var is_Valid = true;
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
            urll && autoAtlas.push(urll);
          }
        }
        JS_LOG("autoatlas_url_arr_:", JSON.stringify(autoAtlas));
        var extNum = autoAtlas.length;
        var finishNum = 0;
        var is_2Valid = true;
        var preloadAutoAtlas = function preloadAutoAtlas() {
          if (0 == autoAtlas.length) {
            if (!is_2Valid) return;
            is_2Valid = false;
            onComplete && onComplete();
            return;
          }
          cc.assetManager.preloadAny(autoAtlas, {
            __requestType__: "url",
            type: null,
            bundle: _this2._abObj.name
          }, function(finish, total, item) {
            if (!is_2Valid) return;
            JS_LOG("load_autoatlas_progress_:", _this2._abObj.name, finish, total);
            onProgress && onProgress(finish + finishNum, total + finishNum, item);
          }, function(error, items) {
            if (!is_2Valid) return;
            is_2Valid = false;
            if (error) {
              JS_LOG("preloadAutoAtlas_error:", JSON.stringify(error));
              _this2.scheduleOnce(function() {
                _this2.preloadModule(onProgress, onComplete);
              }, 3);
            } else onComplete && onComplete();
          });
        };
        this._abObj.preloadDir("root", function(finish, total, item) {
          if (!is_Valid) return;
          finishNum = total;
          onProgress && onProgress(finish, total + extNum, item);
        }, function(error, items) {
          if (!is_Valid) return;
          is_Valid = false;
          error ? _this2.scheduleOnce(function() {
            _this2.preloadModule(onProgress, onComplete);
          }, 3) : preloadAutoAtlas();
        });
      },
      releaseAB: function releaseAB() {
        this.unscheduleAllCallbacks();
        if (!this._abObj) return;
        JS_LOG("release_ab__");
        cc.assetManager.removeBundle(this._abObj);
        this._abObj = null;
      }
    });
    cc._RF.pop();
  }, {
    ModuleConst: "ModuleConst"
  } ],
  UnpackageHelper: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9f4ddWutyZMXK1fvn7MXuH9", "UnpackageHelper");
    "use strict";
    var ModuleConst = require("ModuleConst");
    var JS_LOG = function JS_LOG() {
      var _cc;
      for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) arg[_key] = arguments[_key];
      (_cc = cc).log.apply(_cc, [ "[UnpackageHelper]" ].concat(arg));
    };
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this._moduleMag = this.getComponent("ModuleManager");
        this._ModuleCom = this.getComponent("ModuleCom");
        this._HotUIHelper = this.getComponent("HotUIHelper");
      },
      initCom: function initCom(args) {},
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
        }
        var nativeRoot = this._moduleMag.getNativePath();
        var path_native = nativeRoot + "PKgamecaches/";
        JS_LOG("unpackage_res_:", path_native, path_cache);
        if (!jsb.fileUtils.isDirectoryExist(path_native)) {
          JS_LOG("PKgamecaches_not_exist");
          cc.sys.localStorage.setItem(ModuleConst.localClientVer, _Gloabal.Client_Version);
          onComplete();
          return;
        }
        var cacheMag = cc.assetManager.cacheManager;
        var coverCachelist = function coverCachelist() {
          var fileStr = jsb.fileUtils.getStringFromFile(path_native + "cacheList.json");
          var abVersion = {};
          var cache_d_Map = JSON.parse(fileStr);
          if (cache_d_Map) {
            var files = cache_d_Map.files;
            for (var id in files) {
              var info = files[id];
              cacheMag.cacheFile(id, info.url, info.bundle);
              if (-1 != id.indexOf("/index.")) {
                var splitRet = id.split(".");
                abVersion[info.bundle] = splitRet[splitRet.length - 2];
              }
            }
          }
          JS_LOG("abVersion__:", JSON.stringify(abVersion));
          cacheMag.writeCacheFile(function() {
            JS_LOG("writeCache_File_ok");
            _this._moduleMag.setLocalAbVersion(abVersion);
            cc.sys.localStorage.setItem(ModuleConst.localClientVer, _Gloabal.Client_Version);
            onComplete();
          });
        };
        this._HotUIHelper.unpackageShow();
        this.copyFoldTo(path_native, path_cache, function(finish, total) {
          _this._HotUIHelper.unpackageUpdateProgress(finish, total);
        }, function() {
          _this._HotUIHelper.unpackageFinish();
          coverCachelist();
        });
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
            co < 3 && console.log("get_file_list_full_:", fullpath);
            co += 1;
          }
        } else jsb.fileUtils.listFilesRecursively(dir, filelist);
      },
      copyFoldTo: function copyFoldTo(oriRoot, copyTo, onProgress, onComplate) {
        var _this2 = this;
        var eachFrameCopyNum = 5;
        if ("undefined" == typeof jsb || !jsb.fileUtils.isDirectoryExist(oriRoot)) {
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
          "/" != path.substr(path.length - 1) && realFileArr.push(path);
        }
        var totalLen = realFileArr.length;
        if (0 == totalLen) {
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
            var subPath = _path.substr(oriRoot.length);
            var fileName = _path.substr(_path.lastIndexOf("/") + 1);
            var targetPath = copyTo + subPath;
            var newFold = targetPath.substr(0, targetPath.lastIndexOf("/") + 1);
            jsb.fileUtils.isDirectoryExist(newFold) || jsb.fileUtils.createDirectory(newFold);
            var fileData = jsb.fileUtils.getDataFromFile(_path);
            var saveRet = jsb.fileUtils.writeDataToFile(fileData, targetPath);
            if (!saveRet) {
              _this2.unschedule(_schHandler);
              return;
            }
          }
          curMisIndex += eachFrameCopyNum;
          onProgress(curMisIndex <= totalLen ? curMisIndex : totalLen, totalLen);
        };
        this.schedule(_schHandler, 0);
      }
    });
    cc._RF.pop();
  }, {
    ModuleConst: "ModuleConst"
  } ]
}, {}, [ "AppCom", "AppConst", "HelloWorld", "HotUIHelper", "Module", "ModuleCom", "ModuleConst", "ModuleManager", "UnpackageHelper" ]);