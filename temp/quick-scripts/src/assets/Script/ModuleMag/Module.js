"use strict";
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