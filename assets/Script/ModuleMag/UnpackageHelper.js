

let ModuleConst = require("ModuleConst")
// let UnpackageHelper = require("UnpackageHelper")
let JS_LOG = function(...arg){ 
    cc.log("[UnpackageHelper]",...arg) ; 
}

cc.Class({
    
    extends: cc.Component,
    properties: {   

    },

    
    onLoad(){
        this._moduleMag = this.getComponent("ModuleManager")
        this._ModuleCom = this.getComponent("ModuleCom")
        this._HotUIHelper = this.getComponent("HotUIHelper") 
    },


    initCom(args){
        // let {  } = args     

    },

    execUnpackage(onComplete){

        if ( !(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_WINDOWS) ) {
            JS_LOG("ignore_unpackage")
            onComplete();
            return 
        } 

        let localClientVer = cc.sys.localStorage.getItem(ModuleConst.localClientVer)
        let writablePath = jsb.fileUtils.getWritablePath() 
        let path_cache  = writablePath + "gamecaches/" 
        
        if( _Gloabal.Client_Version == localClientVer && jsb.fileUtils.isFileExist(path_cache+"cacheList.json")){
            JS_LOG("Unpackage_not_exec")
            onComplete()
            return ; 

        }else { 
            // 第一次启动该版本
            let nativeRoot = this._moduleMag.getNativePath() //  

            let path_native = nativeRoot + "PKgamecaches/"
            JS_LOG("unpackage_res_:", path_native, path_cache )

            if(!jsb.fileUtils.isDirectoryExist(path_native)){
                JS_LOG("PKgamecaches_not_exist")
                cc.sys.localStorage.setItem(ModuleConst.localClientVer, _Gloabal.Client_Version )
                onComplete()
                return ; 
            }
            //-------------------------------------------------->>  替换 cacheManager 数据
            let cacheMag = cc.assetManager.cacheManager
            // cacheMag.clearCache()

            let coverCachelist = ()=>{
                let fileStr = jsb.fileUtils.getStringFromFile(path_native + "cacheList.json")  
                
                let abVersion = {} 

                var cache_d_Map = JSON.parse(fileStr)
                if(cache_d_Map){
                    let files = cache_d_Map.files
                    for(let id in  files){
                        let info = files[id]
                        // JS_LOG("call_cacheFile_:", id, info.url, info.bundle )
                        cacheMag.cacheFile(id, info.url, info.bundle)

                        // 查找版本号
                        if(id.indexOf("/index.") != -1){
                            let splitRet = id.split('.')
                            abVersion[info.bundle] = splitRet[splitRet.length-2]
                        }
                    }
                }

                // 覆盖本地资源版本号 
                JS_LOG("abVersion__:", JSON.stringify(abVersion) )

                cacheMag.writeCacheFile(()=>{

                    JS_LOG("writeCache_File_ok")

                    this._moduleMag.setLocalAbVersion(abVersion)


                    cc.sys.localStorage.setItem(ModuleConst.localClientVer, _Gloabal.Client_Version )
                    onComplete()
                })
            }
            //--------------------------------------------------<<  替换 cacheManager 数据

            this._HotUIHelper.unpackageShow()
            this.copyFoldTo(path_native, path_cache, (finish, total)=>{
                this._HotUIHelper.unpackageUpdateProgress(finish, total)
                // JS_LOG("copy_file_:", finish, total)
            },()=>{
                // 完成 
                this._HotUIHelper.unpackageFinish()  
                coverCachelist()
            })
        }


    },


    getFileListFromDir(dir, filelist){
        let co = 1
        if(cc.sys.os == cc.sys.OS_ANDROID){
            let cacheJson = jsb.fileUtils.getStringFromFile(dir + "cacheList.json")
            let cacheMap = JSON.parse(cacheJson)
            let files = cacheMap.files
            for(let url in files){
                let item = files[url]
                let fullpath = this._moduleMag.getNativePath()+"PKgamecaches/"+item.url
                filelist.push(fullpath)
                if(co<3){
                    console.log("get_file_list_full_:", fullpath )
                }
                co = co+1
            } 
        }else {
            jsb.fileUtils.listFilesRecursively(dir, filelist)
        } 
    },

    // 拷贝文件夹到 copyFoldTo("/path1/src/", "/path2/src/") 
    copyFoldTo(oriRoot, copyTo, onProgress, onComplate){

        let eachFrameCopyNum = 5  // 每帧复制文件数

        if( (typeof(jsb)=="undefined") || !jsb.fileUtils.isDirectoryExist(oriRoot)){
            cc.log("ori_folder_not_exist_:", oriRoot )
            onComplate();
            return 
        }

        let filelist = []
        this.getFileListFromDir(oriRoot, filelist) 

        cc.log("file_ori_arr_:",oriRoot, filelist.length);

        let realFileArr = []
        for(let i=0;i<filelist.length;i++){
            let path = filelist[i]
            if(path.substr( path.length-1 )!="/"){
                realFileArr.push(path)
            } 
        }

        let totalLen = realFileArr.length

        if(totalLen==0){
            cc.log("totalLen_is_0:", oriRoot )
            onComplate();
            return ;
        }

        let curMisIndex = 0

        let schHandler = ""
        schHandler = ()=>{

            for(let i=curMisIndex; i<curMisIndex+eachFrameCopyNum; i++){ 

                if(i>=totalLen){
                    this.unschedule(schHandler)
                    onComplate()
                    return ;
                }
                let path = realFileArr[i] 
    
                let subPath = path.substr( oriRoot.length )  // 后半部分路径 import/00/00.7871f.json
                let fileName = path.substr( path.lastIndexOf("\/")+1) // 文件名 00.7871f.json
                let targetPath = copyTo + subPath // 目标完整路径
                let newFold = targetPath.substr( 0, targetPath.lastIndexOf("\/")+1 ) // 目标文件夹
    
                if(!jsb.fileUtils.isDirectoryExist(newFold)){ // 文件夹不存在则创建 
                    jsb.fileUtils.createDirectory(newFold)
                }

                let fileData = jsb.fileUtils.getDataFromFile(path); 
                let saveRet = jsb.fileUtils.writeDataToFile(fileData, targetPath);
                if(!saveRet){

                    this.unschedule(schHandler)
                    return ;
                }  
                
            } 
            curMisIndex = curMisIndex + eachFrameCopyNum

            onProgress( (curMisIndex<=totalLen? curMisIndex : totalLen), totalLen)

        }
        this.schedule(schHandler, 0)

    },

});
