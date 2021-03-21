
// let ModuleCom = require("ModuleCom")
cc.Class({
    extends: cc.Component,

    properties: {


    },

    // makeXMLHttp({url: , callback:(retInfo)=>{}})
    makeXMLHttp(args){

        let {timeout, url, callback} = args
        let retInfo = {}

        let isValid = true
        let xhr = new XMLHttpRequest();
        xhr.timeout = Math.ceil((timeout || 6)*1000);
        xhr.onreadystatechange = function () { 
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                if(!isValid){ return } ; isValid = false 
                var httpDatas = JSON.parse(xhr.responseText); 
                callback({retData:httpDatas})
            }
            else if (xhr.readyState == 4 && xhr.status == 0) {
                if(!isValid){ return } ; isValid = false  
                callback({fail:true})

            }else if (xhr.readyState == 4) {
                if(!isValid){ return } ; isValid = false  
                callback({fail:true})
            }
        };
        
        xhr.open('GET', url, true); 
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8'); 
        xhr.send();
        xhr.ontimeout = function () {
            if(!isValid){ return } ; isValid = false  
            callback({isTimeout:true})
        }; 
        retInfo.abort = ()=>{
            isValid = false
            xhr.abort()
        }
        return retInfo
    },

    //并行任务 return : {addMis: , onFinish:}  
    // let pMis = AppComFunc.parallelMis(callback); 
    // pMis.addMis();
    // pMis.start();
    // pMis.onFinish
    parallelMis(callback){
        let co = 0;
        let ret = {};
        co = co+1;
        let isValid = true
        let retArgs = {}
        let onFinish = function(args){
            if(!isValid){ return }
            co = co-1;
            if(args){
                retArgs = Object.assign(retArgs, args)
            }
            if(co<=0){
                if(callback){
                    callback(retArgs);
                }
            }
        }
        ret.onFinish = onFinish;
        ret.addMis = function(){
            co = co+1;
            return onFinish;
        }
        ret.start = function(){
            onFinish();
        }
        ret.close = function(){
            isValid = false
        }
        return ret;
    },

    //顺序任务 idx:0~N,  AppComFunc.sequenceMis(misArr, onAllFolderDetectFinish, (curMis, idx, onExec)=>{ })
    sequenceMis(misArr, onAllExec, execFunc){
        cc.log("sequenceMis__enter_:")
        let co = 0
        let execMis ;
        execMis = ()=>{
            if(co>=misArr.length){
                onAllExec()
                return 
            }
            let mis = misArr[co]
            let curCo = co
            co=co+1 
            execFunc(mis, curCo, execMis)
        } 
        execMis() 
    },

    // comVersion(localVer, romoteVer)
    // 对比版本号, -1:本地版本比较旧, 0:相等, 1:本地版本比较新
    comVersion(localVer, romoteVer){
        let verSplit_local  = localVer.split('.')
        let verSplit_remote = romoteVer.split('.')
        let localCo  = verSplit_local.length
        let remoteCo = verSplit_remote.length
        let maxCo = localCo>remoteCo?localCo : remoteCo
        
        for(let i=0;i<maxCo;i++){
            let n_local = parseInt(verSplit_local[i], 10); 
            let n_remote = parseInt(verSplit_remote[i], 10); 

            if(i<localCo && i>=remoteCo){ return 1 }
            else if(i>=localCo && i<remoteCo) { return -1} 
            else if(n_local>n_remote){ return 1}
            else if(n_local<n_remote){ return -1}
        }
        return 0
    },
    createUUID(){
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''); 
        var uuid = [];  
        for (let i = 0; i < 4; i++) {
            uuid[i] = chars[0 | Math.random()*36];
        }
        let uid = uuid.join('');
        uid = Number(Date.now()).toString(36) + uid 
        return uid
    },


}); 
