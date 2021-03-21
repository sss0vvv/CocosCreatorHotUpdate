
console.log("h123");


let CommonFunc = require("./Comm/CommonFunc") 
let CopyFolder = require("./Comm/CopyFolder")  
const fs = require('fs')


let jsbLinkRoot   = "/Users/svsv/Desktop/HotUpdateExample/HotUpdateExample/build/jsb-link"
let verconfigFile = "/Users/svsv/Desktop/HotUpdateExample/HotUpdateExample/verconfig.json"
let hotResRoot    = "/Users/svsv/Desktop/HotUpdateExample/HotUpdateExample/hotRes"

if(typeof(process)!="undefined"){
    jsbLinkRoot   = process.argv[2];
    verconfigFile = process.argv[3]; 
    hotResRoot    = process.argv[4]; 
} 
console.log("pathOri_1:", jsbLinkRoot )
console.log("pathOri_2:", verconfigFile )
console.log("pathOri_3:", hotResRoot )


// 从build目录拿到版本号
//"/Users/svsv/Desktop/vopro/vopro/build/jsb-default"
let remoteDir = jsbLinkRoot + '/remote'
let abNameArr = []
CommonFunc.getFolder(remoteDir+"/",abNameArr )  // 获取 asset bundle  

console.log("folders_:", JSON.stringify(abNameArr) )


//拷贝 remote 下资源到 hotRes
CopyFolder.copyFolder({
    dirOri : remoteDir+"/" ,
    dirDst : hotResRoot+"/remote/" , 
    isDelOld : true ,
    // isIgnoreExist : true ,
})


let newVerMap = {}

for(let idx in abNameArr){
	let abName = abNameArr[idx]
	let abFold = remoteDir + "/" + abName
	const files = fs.readdirSync(abFold)
	for(let i in files){
		let fileNameSplit = files[i].split('.')
		if(fileNameSplit[0] == "config"){
			newVerMap[abName] = fileNameSplit[1]
			break
		}
	} 
}

// 版本号加 1
let versionAdd = function(verStr){
	let splitArr = verStr.split(".")
	let len = splitArr.length
	if(len==0){ return ""}
	splitArr[len-1] = ""+ (parseInt(splitArr[len-1], 10)+1)
	return splitArr.join(".")
}

// 读取版本配置文件
const data = fs.readFileSync(verconfigFile, 'utf-8');
let verCfgMap = JSON.parse(data)
// 替换版本号
for(let abName in newVerMap){
	verCfgMap.modules[abName].resVersion = newVerMap[abName]
	verCfgMap.modules[abName].showVer = versionAdd(verCfgMap.modules[abName].showVer)
}
// 写入文件
fs.writeFileSync(verconfigFile,JSON.stringify(verCfgMap))



// 覆盖配置
if(true){
	fs.writeFileSync(hotResRoot+"/verconfig.json", JSON.stringify(verCfgMap))
}


console.log("version_cfg_:", JSON.stringify(newVerMap) );


// {	
// 	"clientMin":"1.0.0",
// 	"modules" : {
// 		"ABLobby": {
// 			"resVersion":"04374",
// 			"showVer":"1.0.109",
// 			"priority":6,
// 			"depend":[]
// 		},
// 		"ABSubGame1": {
// 			"resVersion":"fe970",
// 			"showVer":"1.0.109",
// 			"priority":5,
// 			"depend":["ABLobby"]
// 		},
// 		"ABSubGame2": {
// 			"resVersion":"fe970",
// 			"showVer":"1.0.109",
// 			"priority":4,
// 			"depend":["ABSubGame1"]
// 		}
// 	}
// }
