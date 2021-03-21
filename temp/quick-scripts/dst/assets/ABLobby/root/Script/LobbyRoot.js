
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