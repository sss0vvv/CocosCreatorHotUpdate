
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
  onLoad: function onLoad() {
    var _this = this;

    JS_LOG("jsb_writable_:", jsb.fileUtils.getWritablePath());
    window._G_AppCom = this._AppCom = this.getComponent("AppCom"); // 配置热更新地址到 ModuleConst.js
    // 初始化

    var moduleMagObj = cc.instantiate(this.ModuleMagPreFab);
    moduleMagObj.parent = this.msgLayer;
    window._G_moduleMag = moduleMagObj.getComponent("ModuleManager");

    _G_moduleMag.initCom({// useHotUpdate : true ,     // 是否启用热更新 
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvSGVsbG9Xb3JsZC5qcyJdLCJuYW1lcyI6WyJ3aW5kb3ciLCJfR2xvYWJhbCIsIkNsaWVudF9WZXJzaW9uIiwiSlNfTE9HIiwiYXJnIiwiY2MiLCJsb2ciLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJNb2R1bGVNYWdQcmVGYWIiLCJQcmVmYWIiLCJtb2R1bGVMYXllciIsIk5vZGUiLCJtc2dMYXllciIsIm9uTG9hZCIsImpzYiIsImZpbGVVdGlscyIsImdldFdyaXRhYmxlUGF0aCIsIl9HX0FwcENvbSIsIl9BcHBDb20iLCJnZXRDb21wb25lbnQiLCJtb2R1bGVNYWdPYmoiLCJpbnN0YW50aWF0ZSIsInBhcmVudCIsIl9HX21vZHVsZU1hZyIsImluaXRDb20iLCJleGVjVW5wYWNrYWdlIiwicmVxVmVyc2lvbkluZm8iLCJyZWxvYWRMb2JieVJvb3QiLCJyZXFMb29wVmVyc2lvbkluZm8iLCJsb2FkQWIiLCJob3RVcGRhdGVNdWx0aU1vZHVsZSIsImFkZE1vZHVsZSIsIm1vZHVsZU9iaiIsImFiT2JqIiwiZ2V0QUJPYmoiLCJsb2FkIiwiZXJyIiwicHJlZmFiIiwiSlNPTiIsInN0cmluZ2lmeSIsIl9sb2JieVJvb3ROb2RlIiwiZGVzdHJveSIsImxvYmJ5Um9vdCIsImFkZENoaWxkIiwiaW5pdE1vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQUEsTUFBTSxDQUFDQyxRQUFQLEdBQWtCO0FBQ2RDLEVBQUFBLGNBQWMsRUFBRyxPQURILENBQ2E7O0FBRGIsQ0FBbEI7O0FBSUEsSUFBSUMsTUFBTSxHQUFHLFNBQVRBLE1BQVMsR0FBZ0I7QUFBQTs7QUFBQSxvQ0FBSkMsR0FBSTtBQUFKQSxJQUFBQSxHQUFJO0FBQUE7O0FBQ3pCLFNBQUFDLEVBQUUsRUFBQ0MsR0FBSCxhQUFPLGNBQVAsU0FBeUJGLEdBQXpCO0FBQ0gsQ0FGRDs7QUFLQUMsRUFBRSxDQUFDRSxLQUFILENBQVM7QUFDTCxhQUFTRixFQUFFLENBQUNHLFNBRFA7QUFFTEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JDLElBQUFBLGVBQWUsRUFBR0wsRUFBRSxDQUFDTSxNQURiO0FBR1JDLElBQUFBLFdBQVcsRUFBR1AsRUFBRSxDQUFDUSxJQUhUO0FBSVJDLElBQUFBLFFBQVEsRUFBR1QsRUFBRSxDQUFDUTtBQUpOLEdBRlA7QUFVTEUsRUFBQUEsTUFBTSxFQUFFLGtCQUFZO0FBQUE7O0FBRWhCWixJQUFBQSxNQUFNLENBQUMsZ0JBQUQsRUFBbUJhLEdBQUcsQ0FBQ0MsU0FBSixDQUFjQyxlQUFkLEVBQW5CLENBQU47QUFFQWxCLElBQUFBLE1BQU0sQ0FBQ21CLFNBQVAsR0FBbUIsS0FBS0MsT0FBTCxHQUFlLEtBQUtDLFlBQUwsQ0FBa0IsUUFBbEIsQ0FBbEMsQ0FKZ0IsQ0FPaEI7QUFDQTs7QUFDQSxRQUFJQyxZQUFZLEdBQU1qQixFQUFFLENBQUNrQixXQUFILENBQWUsS0FBS2IsZUFBcEIsQ0FBdEI7QUFDQVksSUFBQUEsWUFBWSxDQUFDRSxNQUFiLEdBQXNCLEtBQUtWLFFBQTNCO0FBQ0FkLElBQUFBLE1BQU0sQ0FBQ3lCLFlBQVAsR0FBc0JILFlBQVksQ0FBQ0QsWUFBYixDQUEwQixlQUExQixDQUF0Qjs7QUFDQUksSUFBQUEsWUFBWSxDQUFDQyxPQUFiLENBQXFCLENBQ2pCO0FBRGlCLEtBQXJCLEVBWmdCLENBZ0JoQjtBQUVBOzs7QUFDQUQsSUFBQUEsWUFBWSxDQUFDRSxhQUFiLENBQTJCLFlBQUk7QUFFM0JGLE1BQUFBLFlBQVksQ0FBQ0csY0FBYixDQUE0QixZQUFJO0FBQUU7QUFDOUIsUUFBQSxLQUFJLENBQUNDLGVBQUw7QUFDSCxPQUZEO0FBR0gsS0FMRCxFQW5CZ0IsQ0EwQmhCOzs7QUFDQUosSUFBQUEsWUFBWSxDQUFDSyxrQkFBYjtBQUVILEdBdkNJO0FBeUNMRCxFQUFBQSxlQXpDSyw2QkF5Q1k7QUFBQTs7QUFFYixRQUFJRSxNQUFNLEdBQUcsQ0FBQyxTQUFELENBQWIsQ0FGYSxDQUdiOztBQUNBTixJQUFBQSxZQUFZLENBQUNPLG9CQUFiLENBQWtDRCxNQUFsQyxFQUF5QyxZQUFJO0FBQUU7QUFFM0NOLE1BQUFBLFlBQVksQ0FBQ1EsU0FBYixDQUF1QixTQUF2QixFQUFrQyxVQUFDQyxTQUFELEVBQWE7QUFBRTtBQUU3QyxZQUFJQyxLQUFLLEdBQUdELFNBQVMsQ0FBQ0UsUUFBVixFQUFaO0FBRUFELFFBQUFBLEtBQUssQ0FBQ0UsSUFBTixDQUFXLHNCQUFYLEVBQW1DaEMsRUFBRSxDQUFDTSxNQUF0QyxFQUE4QyxVQUFDMkIsR0FBRCxFQUFNQyxNQUFOLEVBQWU7QUFBRztBQUU1RHBDLFVBQUFBLE1BQU0sQ0FBQyxxQkFBRCxFQUF3QnFDLElBQUksQ0FBQ0MsU0FBTCxDQUFlSCxHQUFmLENBQXhCLENBQU47O0FBQ0EsY0FBRyxNQUFJLENBQUNJLGNBQVIsRUFBdUI7QUFDbkIsWUFBQSxNQUFJLENBQUNBLGNBQUwsQ0FBb0JDLE9BQXBCO0FBQ0g7O0FBQ0QsY0FBSUMsU0FBUyxHQUFHdkMsRUFBRSxDQUFDa0IsV0FBSCxDQUFlZ0IsTUFBZixDQUFoQjtBQUNBLFVBQUEsTUFBSSxDQUFDRyxjQUFMLEdBQXNCRSxTQUF0Qjs7QUFDQSxVQUFBLE1BQUksQ0FBQ2hDLFdBQUwsQ0FBaUJpQyxRQUFqQixDQUEwQkQsU0FBMUIsRUFBcUMsR0FBckM7O0FBQ0FBLFVBQUFBLFNBQVMsQ0FBQ3ZCLFlBQVYsQ0FBdUIsV0FBdkIsRUFBb0N5QixVQUFwQztBQUVILFNBWEQ7QUFZSCxPQWhCRDtBQWlCSCxLQW5CRDtBQW9CSDtBQWpFSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJcblxud2luZG93Ll9HbG9hYmFsID0geyBcbiAgICBDbGllbnRfVmVyc2lvbiA6IFwiMS4wLjBcIiAsIC8v5a6i5oi356uv5aSn54mI5pysXG59XG5cbmxldCBKU19MT0cgPSBmdW5jdGlvbiguLi5hcmcpeyBcbiAgICBjYy5sb2coXCJbSGVsbG9Xb3JsZF1cIiwuLi5hcmcpIDsgXG59XG5cblxuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCwgXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBNb2R1bGVNYWdQcmVGYWIgOiBjYy5QcmVmYWIgLFxuXG4gICAgICAgIG1vZHVsZUxheWVyIDogY2MuTm9kZSAsIFxuICAgICAgICBtc2dMYXllciA6IGNjLk5vZGUgLFxuXG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkgeyAgXG5cbiAgICAgICAgSlNfTE9HKFwianNiX3dyaXRhYmxlXzpcIiwganNiLmZpbGVVdGlscy5nZXRXcml0YWJsZVBhdGgoKSApXG5cbiAgICAgICAgd2luZG93Ll9HX0FwcENvbSA9IHRoaXMuX0FwcENvbSA9IHRoaXMuZ2V0Q29tcG9uZW50KFwiQXBwQ29tXCIpXG5cblxuICAgICAgICAvLyDphY3nva7ng63mm7TmlrDlnLDlnYDliLAgTW9kdWxlQ29uc3QuanNcbiAgICAgICAgLy8g5Yid5aeL5YyWXG4gICAgICAgIGxldCBtb2R1bGVNYWdPYmogICAgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLk1vZHVsZU1hZ1ByZUZhYilcbiAgICAgICAgbW9kdWxlTWFnT2JqLnBhcmVudCA9IHRoaXMubXNnTGF5ZXIgIFxuICAgICAgICB3aW5kb3cuX0dfbW9kdWxlTWFnID0gbW9kdWxlTWFnT2JqLmdldENvbXBvbmVudChcIk1vZHVsZU1hbmFnZXJcIikgIFxuICAgICAgICBfR19tb2R1bGVNYWcuaW5pdENvbSh7XG4gICAgICAgICAgICAvLyB1c2VIb3RVcGRhdGUgOiB0cnVlICwgICAgIC8vIOaYr+WQpuWQr+eUqOeDreabtOaWsCBcbiAgICAgICAgfSkgXG4gICAgICAgIFxuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvLyDlpI3liLbljIXlhoXmqKHlnZfliLDlj6/or7vlhpnot6/lvoTkuIss6YG/5YWN6aaW5qyh5Yqg6L295qih5Z2X5pe25LuO6L+c56iL5a6M5pW05ouJ5Y+WXG4gICAgICAgIF9HX21vZHVsZU1hZy5leGVjVW5wYWNrYWdlKCgpPT57XG5cbiAgICAgICAgICAgIF9HX21vZHVsZU1hZy5yZXFWZXJzaW9uSW5mbygoKT0+eyAvLyDojrflj5bmnIDmlrDniYjmnKxcbiAgICAgICAgICAgICAgICB0aGlzLnJlbG9hZExvYmJ5Um9vdCgpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIOWumuaXtuajgOa1i+abtOaWsFxuICAgICAgICBfR19tb2R1bGVNYWcucmVxTG9vcFZlcnNpb25JbmZvKCkgXG5cbiAgICB9LFxuXG4gICAgcmVsb2FkTG9iYnlSb290KCl7XG5cbiAgICAgICAgbGV0IGxvYWRBYiA9IFtcIkFCTG9iYnlcIl1cbiAgICAgICAgLy8gbG9hZEFiID0gW1wiQUJMb2JieVwiLCBcIkFCU3ViR2FtZTFcIiwgXCJBQlN1YkdhbWUyXCJdXG4gICAgICAgIF9HX21vZHVsZU1hZy5ob3RVcGRhdGVNdWx0aU1vZHVsZShsb2FkQWIsKCk9PnsgLy8g5pu05paw5qih5Z2X5Yiw5pyA5paw54mI5pysXG5cbiAgICAgICAgICAgIF9HX21vZHVsZU1hZy5hZGRNb2R1bGUoXCJBQkxvYmJ5XCIsIChtb2R1bGVPYmopPT57IC8vIOWKoOi9veaooeWdl1xuXG4gICAgICAgICAgICAgICAgbGV0IGFiT2JqID0gbW9kdWxlT2JqLmdldEFCT2JqKClcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBhYk9iai5sb2FkKCdyb290L1NjZW5lL0xvYmJ5Um9vdCcsIGNjLlByZWZhYiwgKGVyciwgcHJlZmFiKT0+eyAgLy8g5L2/55So5qih5Z2X6LWE5rqQIFxuXG4gICAgICAgICAgICAgICAgICAgIEpTX0xPRyhcImxvYWRfbG9iYnlfcHJlZmFiXzpcIiwgSlNPTi5zdHJpbmdpZnkoZXJyKSApXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2xvYmJ5Um9vdE5vZGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9iYnlSb290Tm9kZS5kZXN0cm95KClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgbG9iYnlSb290ID0gY2MuaW5zdGFudGlhdGUocHJlZmFiKSBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9iYnlSb290Tm9kZSA9IGxvYmJ5Um9vdFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZHVsZUxheWVyLmFkZENoaWxkKGxvYmJ5Um9vdCwgMTAwKVxuICAgICAgICAgICAgICAgICAgICBsb2JieVJvb3QuZ2V0Q29tcG9uZW50KFwiTG9iYnlSb290XCIpLmluaXRNb2R1bGUoKSAgICBcbiAgICBcbiAgICAgICAgICAgICAgICB9KSBcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfSxcblxufSk7XG4iXX0=