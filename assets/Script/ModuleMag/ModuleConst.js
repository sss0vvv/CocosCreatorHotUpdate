


// let ModuleConst = require("ModuleConst")
let ModuleConst = {
    hotUrl : "http://192.168.50.88:8089/dashboard/hotTest/" , // 热更新地址, 以斜杠结尾
    localVersionConfigKey : "_local_gameVersionData1" , 
    localClientVer : "__sv_loacal_client_ver",

    // true:每次调用 hotUpdateMultiModule 都先请求最新版本信息, 
    // false:使用定时检测(reqLoopVersionInfo)的结果判断是否有更新
    reqVersionImmediately : true , 
}


module.exports = ModuleConst