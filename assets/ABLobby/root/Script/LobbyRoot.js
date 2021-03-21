

// let LobbyRoot

let JS_LOG = function(...arg){ 
    cc.log("[LobbyRoot]",...arg) ; 
}

cc.Class({
    extends: cc.Component, 
    properties: {



    },


    initModule(){
    	JS_LOG("initModule")

    },

    onBtn_loadGame_1(){
    	JS_LOG("onBtn_loadGame_1")
    	this.removeGame_1()

    	this.loadSubGame("ABSubGame1", (moduleObj)=>{
    		let abObj = moduleObj.getABObj()
                
            abObj.load('root/Scene/SubGame1', cc.Prefab, (err, prefab)=>{
                JS_LOG("load_game1_prefab_:", JSON.stringify(err) ) 
                let _node = cc.instantiate(prefab) 
                this.node.addChild(_node, 100)
                this._game1 = _node
                _node.getComponent("SubGame_1").initModule({lobbyRoot:this})    

            }) 
    	})



        // 模块内加载自身资源
        // let module = _G_moduleMag.getModule("ABLobby")
        // let assetBundle = module.getABObj()
        // assetBundle.load('root/Scene/xxx', cc.Prefab, (err, prefab)=>{    
        //     //...
        // }) 

    },

    removeGame_1(){
    	if(this._game1){
    		this._game1.destroy()
    	}
    	this._game1 = null
    },


    onBtn_loadGame_2(){
    	JS_LOG("onBtn_loadGame_2")
    	this.removeGame_2()
    	this.loadSubGame("ABSubGame2", (moduleObj)=>{
    		let abObj = moduleObj.getABObj()
                
            abObj.load('root/Scene/SubGame2', cc.Prefab, (err, prefab)=>{
                JS_LOG("load_game2_prefab_:", JSON.stringify(err) ) 
                let _node = cc.instantiate(prefab) 
                this.node.addChild(_node, 100)
                this._game2 = _node
                _node.getComponent("SubGame_2").initModule({lobbyRoot:this})    

            }) 
    	})

    },
    removeGame_2(){
    	if(this._game2){
    		this._game2.destroy()
    	}
    	this._game2 = null

    },


    loadSubGame(abName, callback){ 
    	_G_moduleMag.hotUpdateMultiModule([abName],()=>{

            _G_moduleMag.addModule(abName, (moduleObj)=>{
                callback(moduleObj)
            })
        })
    },

});