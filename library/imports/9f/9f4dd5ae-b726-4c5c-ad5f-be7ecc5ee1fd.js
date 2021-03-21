"use strict";
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