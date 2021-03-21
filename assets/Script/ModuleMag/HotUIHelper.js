



// HotUIHelper  热更新的一些界面提示

let JS_LOG = function(...arg){ 
    cc.log("[HotUIHelper]",...arg) ; 
}
cc.Class({
    
    extends: cc.Component,
    properties: { 

    },

    initCom(){
        if(this._isInited){ return }
        this._isInited = true 
        cc.log("hot_helper_init") 

    }, 

    hideUpdating(callback){
        JS_LOG("hideUpdating")
        callback && callback();

    },

    // 下载进度
    onProgress(curMis, totalMis, finish, total){ 
        // this.misNum.string = curMis + "/" + totalMis
        // this.update_proBar.progress = 1.0*finish/total
        JS_LOG(`onProgress : curMis_${curMis},totalMis_${totalMis},finish_${finish},total_${total}`)
    },

    showUpdating(curMis, totalMis){

        // this.node.active = true  

    }, 

    showHotAlert(isNeedRestart, callback){
        JS_LOG("showHotAlert")
        callback && callback(); 
    }, 

    showAlertClientTooOld(){ 
        JS_LOG("showAlertClientTooOld")
    },

    onBtn_ClientTooOld(){
        JS_LOG("onBtn_ClientTooOld")
        cc.game.end()
    },


    //--------------------------------------------------------->> 解压资源
    unpackageShow(){
        JS_LOG("unpackageShow")
    },
    
    unpackageUpdateProgress(finish, total){ 
        JS_LOG("unpackageUpdateProgress_:", finish, total)
    },
    unpackageFinish(){
        JS_LOG("unpackageFinish")
    },

    //---------------------------------------------------------<< 解压资源

    //--------------------------------------------------------->> 获取新版本号提示
    checkNewVersionShow(){
        JS_LOG("checkNewVersionShow")
    },
    checkNewVersionHide(){ 
        JS_LOG("checkNewVersionHide")
    }, 
    //---------------------------------------------------------<< 获取新版本号提示
});

