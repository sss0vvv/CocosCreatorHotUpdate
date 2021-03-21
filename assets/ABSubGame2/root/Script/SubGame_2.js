
let JS_LOG = function(...arg){ 
    cc.log("[SubGame_2]",...arg) ; 
}

let LobbyConst = require("LobbyConst")
let SubGame1Const = require("SubGame1Const")
JS_LOG("game2_req_lobby_js_:", LobbyConst.testv)
JS_LOG("game2_req_game1_js_:", SubGame1Const.testv)

cc.Class({
    extends: cc.Component, 
    properties: {

    },

    initModule(args){
    	JS_LOG("initModule")
    	let { lobbyRoot } = args
    	this._lobbyRoot = lobbyRoot
    },
    onBtn_close(){
    	JS_LOG("btn_close")
    	this._lobbyRoot.removeGame_2()

    },

});