


// 将 /build/jsb-link/remote 下的资源拷贝到 /build/jsb-link/assets/PKgamecaches ,
// 以便首次启动时将资源复制到可读写路径下

// 修改 remoteRoot copyToPath  hotUrl 为你当前的配置
// 如果希望指定模块打到包里可手动配置 folders, 比如 folders=["ABLobby"]


let CommonFunc = require("./Comm/CommonFunc") 
const fs = require('fs')
var path = require("path"); 


let remoteRoot = ""  // 热更源文件路径  , 需要保留 remote 这一级
let copyToPath = "" // 复制文件到

//-------------------------------- 获取shell 参数
let urlMap = { 
    mac_Home :  "http://192.168.69.197:8089/dashboard/hotTest/",
}
let hotUrl = "http://192.168.69.197:8089/dashboard/hotTest/" 

if(typeof(process)!="undefined"){  
    hotUrl = urlMap[process.argv[2]];
    remoteRoot = process.argv[3] || remoteRoot;
    copyToPath = process.argv[4] || copyToPath; 
}

// 获取remote下所有 asset bundle 名称
let folders = []
CommonFunc.getFolder(remoteRoot,folders )   

//--------------------------------  

console.log("\nuse_hotUrl_:", hotUrl, "\n" )


//--------------------------------------------- common  

CommonFunc.deleteFolder(copyToPath);  // 删除旧数据


//每个 asset bundle 对应文件 

let cacheList = {
    version : "1.1",
    files : {}
}


let lastTime = (new Date()).getTime() - 6000000000
let co = 0

for(let idx in folders){
    let abName = folders[idx]
    let prePath = remoteRoot + abName + "/"

    let fileArr = []
    CommonFunc.readFileList(prePath, fileArr) 
    let cpTo = copyToPath + abName + "/"  // 转存路径

    CommonFunc.mkdirsSync(cpTo);

    for(let j in fileArr){
        let obj = fileArr[j]

        let pathOri = obj.path + obj.filename

        // 构造 cacheList 
        co = co+1 
        let key = pathOri.replace(remoteRoot, hotUrl+"remote/")
        let oneCache = {
            bundle : abName ,
            url : abName +"/1111" + (lastTime+co) + path.extname(obj.filename),
            lastTime : lastTime-co
        }

        cacheList.files[key] = oneCache

        fs.copyFileSync(pathOri, copyToPath + oneCache.url)
        // fs.copyFileSync(pathOri, cpTo+obj.filename)

        // console.log("create_key_:", key )
    }
}

// 保存cacheList

fs.writeFileSync(copyToPath + "cacheList.json", JSON.stringify(cacheList) )






