"use strict";
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