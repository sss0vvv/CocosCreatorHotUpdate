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
  SubGame_2: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "16dbaOjhHVEBJ6LqISL1bOQ", "SubGame_2");
    "use strict";
    var JS_LOG = function JS_LOG() {
      var _cc;
      for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) arg[_key] = arguments[_key];
      (_cc = cc).log.apply(_cc, [ "[SubGame_2]" ].concat(arg));
    };
    cc.Class({
      extends: cc.Component,
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
  }, {} ]
}, {}, [ "SubGame_2" ]);