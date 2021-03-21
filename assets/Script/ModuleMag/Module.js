

let JS_LOG = function(...arg){ 
    cc.log("[Module]",...arg) ; 
}
let ModuleConst = require("ModuleConst")

cc.Class({
    
    extends: cc.Component,
    properties: { 

    },

    ctor(){
        JS_LOG("module_ctor_")
    },
    init(ABName, useHotUpdate){
        JS_LOG("module_init")
        
        this._ABName = ABName
        this._useHotUpdate = useHotUpdate
        return this
    },

    getABObj(){
        return this._abObj 
    },
    getModuleName(){
        return this._ABName
    },

    loadAB(cb, version){
        // {version: 'fbc07'},
        let loadArg = {}
        if(version){
            loadArg.version = version
        }
        let isValid = true 
        let abUrl = this._ABName 

        if(this._useHotUpdate){
            // 如果希望使用creator构建时填的资源服务器地址,将下面这行代码注释掉即可.
            abUrl = ModuleConst.hotUrl + "remote/" + this._ABName
        }
        JS_LOG("loadAB_:", this._ABName, abUrl  )
        cc.assetManager.loadBundle(abUrl,  loadArg, (err, bundle)=> {
            if(!isValid){ return } ;  isValid = false ;
            
            if(!err){
                JS_LOG("loadAB_OK_:", this._ABName )
                this._abObj = bundle 

                cb()
            }else {
                JS_LOG("load_ab_Err_:", this._ABName, JSON.stringify(err)) 
                // 错误重试
                this.scheduleOnce(()=>{
                    this.loadAB(cb, version)
                }, 3)
            }
        });
    },

    // 下载资源
    preloadModule(onProgress, onComplete){
        let is_Valid = true

        //---------------------------------------------------------
        let autoAtlas = []
        let resMap = this._abObj._config.assetInfos._map
        for(let idx in resMap){
            let item = resMap[idx]
            if(!item.path && item.nativeVer){
                let urll = cc.assetManager.utils.getUrlWithUuid(item.uuid, {
                    __nativeName__: ".png",
                    nativeExt: cc.path.extname(".png"),
                    isNative: true
                }); 
                if(urll){
                    autoAtlas.push(urll)
                }
            }
        }

        JS_LOG("autoatlas_url_arr_:", JSON.stringify(autoAtlas))
        let extNum = autoAtlas.length 
        let finishNum = 0
        let is_2Valid = true
        let preloadAutoAtlas = ()=>{
            if(autoAtlas.length == 0 ){ 
                if(!is_2Valid){ return; }; is_2Valid = false ;
                onComplete && onComplete();
                return 
            }

            // RequestType.URL = 'url' 
            cc.assetManager.preloadAny(autoAtlas, { __requestType__: 'url', type: null, bundle: this._abObj.name }, 
                (finish, total, item)=>{
                    if(!is_2Valid){ return; }; 
                    JS_LOG("load_autoatlas_progress_:",this._abObj.name, finish, total )
                    onProgress && onProgress(finish+finishNum, total+finishNum, item);
                }, (error, items)=>{
                    if(!is_2Valid){ return; }; is_2Valid = false ;
                    if(!error){
                        onComplete && onComplete();
                    }else { 
                        JS_LOG("preloadAutoAtlas_error:", JSON.stringify(error) )
                        this.scheduleOnce(()=>{
                            this.preloadModule(onProgress, onComplete);
                        }, 3)
                    }
                }   
            );
                
        }
        //--------------------------------------------------------- 

        this._abObj.preloadDir("root", (finish, total, item)=>{
            if(!is_Valid){ return; };
            finishNum = total
            onProgress && onProgress(finish, total + extNum, item);
        }, (error, items)=>{
            if(!is_Valid){ return; }; is_Valid = false ;
            if(!error){
                // onComplete && onComplete(items);
                preloadAutoAtlas()
            }else {
                this.scheduleOnce(()=>{
                    this.preloadModule(onProgress, onComplete);
                }, 3)
            }
        })

    },

    releaseAB(){
        this.unscheduleAllCallbacks();
        if(!this._abObj ){ return }
        JS_LOG("release_ab__") 
        cc.assetManager.removeBundle(this._abObj);
        this._abObj = null
    },

});

