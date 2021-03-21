

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

    onLoad: function () {  

        JS_LOG("jsb_writable_:", jsb.fileUtils.getWritablePath() )

        window._G_AppCom = this._AppCom = this.getComponent("AppCom")


        // 配置热更新地址到 ModuleConst.js
        // 初始化
        let moduleMagObj    = cc.instantiate(this.ModuleMagPreFab)
        moduleMagObj.parent = this.msgLayer  
        window._G_moduleMag = moduleMagObj.getComponent("ModuleManager")  
        _G_moduleMag.initCom({
            // useHotUpdate : true ,     // 是否启用热更新 
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

});
