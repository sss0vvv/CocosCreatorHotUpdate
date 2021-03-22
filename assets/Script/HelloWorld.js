

window._Gloabal = { 
    Client_Version : "1.0.0" , //客户端大版本
}

let JS_LOG = function(...arg){ 
    cc.log("[HelloWorld]",...arg) ; 
}


cc.Class({
    extends: cc.Component, 
    properties: {
        ModuleMagPreFab : cc.Prefab ,

        moduleLayer : cc.Node , 
        msgLayer : cc.Node ,

    },

    onDestroy () { 
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },
    onLoad: function () {  

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.hackSysLog()
        JS_LOG("jsb_writable_:", jsb.fileUtils.getWritablePath() )

        window._G_AppCom = this._AppCom = this.getComponent("AppCom")


        // 配置热更新地址到 ModuleConst.js
        // 初始化
        let moduleMagObj    = cc.instantiate(this.ModuleMagPreFab)
        moduleMagObj.parent = this.msgLayer  
        window._G_moduleMag = moduleMagObj.getComponent("ModuleManager")  
        _G_moduleMag.initCom({
            useHotUpdate : true ,     // 是否启用热更新 
        }) 
        
        //-------------------

        // 复制包内模块到可读写路径下,避免首次加载模块时从远程完整拉取
        _G_moduleMag.execUnpackage(()=>{

            _G_moduleMag.reqVersionInfo(()=>{ // 获取最新版本
                this.reloadLobbyRoot()
            })
        })

        // 定时检测更新
        _G_moduleMag.reqLoopVersionInfo() 

    },

    reloadLobbyRoot(){

        let loadAb = ["ABLobby"]
        // loadAb = ["ABLobby", "ABSubGame1", "ABSubGame2"]
        _G_moduleMag.hotUpdateMultiModule(loadAb,()=>{ // 更新模块到最新版本

            _G_moduleMag.addModule("ABLobby", (moduleObj)=>{ // 加载模块

                let abObj = moduleObj.getABObj()
                
                abObj.load('root/Scene/LobbyRoot', cc.Prefab, (err, prefab)=>{  // 使用模块资源 

                    JS_LOG("load_lobby_prefab_:", JSON.stringify(err) )
                    if(this._lobbyRootNode){
                        this._lobbyRootNode.destroy()
                    }
                    let lobbyRoot = cc.instantiate(prefab) 
                    this._lobbyRootNode = lobbyRoot
                    this.moduleLayer.addChild(lobbyRoot, 100)
                    lobbyRoot.getComponent("LobbyRoot").initModule()    
    
                }) 
            })
        })
    },



    onKeyUp(event) { 
        // 9 -- TAB  
        if(cc.sys.os==cc.sys.OS_WINDOWS && event.keyCode==9){
            this.hackSys_Log_Save()
        } 
    },
    hackSys_Log_Save(){
        if(!this._logArr){ return ; };

        let totalLen = this._logArr.length
        let reportCo = 2000
        let beginIdx = totalLen-reportCo
        beginIdx = beginIdx>=0?beginIdx:0
        let arrTemp = []

        for(let i=beginIdx; i<totalLen; i++){
            arrTemp.push(this._logArr[i])
        }

        let retMsg = arrTemp.join("\n")
        if(typeof jsb!="undefined"){
            let path = ""
            // path = jsb.fileUtils.getDefaultResourceRootPath()
            // if(!path){
                path = jsb.fileUtils.getWritablePath()
            // }

            jsb.fileUtils.writeStringToFile(retMsg, path + "alogRecord.txt")
        }
    },
    hackSysLog(){

        if(this._initHackLog){ return ; } ; this._initHackLog = true ; 
        let _logArr = []
        this._logArr = _logArr 
        let MAX_STR_LEN = 1300 
        let excludeStr = { ["Can't find letter definition in texture"]:1 } 
        let push_log = function(...arg){  
            let ignore = false
            let logStr = arg.join(" ")
            let strLen = logStr.length
            for(let idx = 0;idx<strLen;){
                let endIdx = idx+MAX_STR_LEN

                let splitStr = logStr.slice(idx, endIdx)
                for(let excStr in  excludeStr){
                    if( splitStr.indexOf(excStr, 0) == 0 ){
                        ignore = true 
                        break 
                    }
                }
                if( !ignore ){
                    _logArr.push("_"+_logArr.length+"_=> "+ splitStr +(endIdx<strLen?"-->":"")) 
                } 

                idx = endIdx
            } 
            return ignore
        } 
        let logDef = function(...arg){ 
            let ignore = push_log(...arg)
            if(!ignore){
                cc._sv_log_2_Ori.call(cc, ...arg)
            }
        }
        let consoleLogDef = function(...arg){ 
            let ignore = push_log(...arg) 
            if(!ignore){
                if(cc._sv_console_2_logOri) { cc._sv_console_2_logOri.call(console,...arg ) }
            } 
        }
        if(!cc._sv_log_2_Ori){ cc._sv_log_2_Ori = cc.log  }
        if(!cc._sv_console_2_logOri){ cc._sv_console_2_logOri = console.log  }
        cc.log      = logDef
        console.log = consoleLogDef
    },


});
