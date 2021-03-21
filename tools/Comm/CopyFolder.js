

const fs = require('fs')
var path = require("path"); 

let CommonFunc = require("./CommonFunc")

// let CommonFunc = require(__dirname+"/CommonFunc")
// console.log("import_commonFunc_:", __dirname)


let retFuncs = {
    copyFolder : function( args ){
        // dirDst, dirOri : 带/尾  , $BUILD_ROOT/remote/ $HOTRESROOT/remote/
        let { dirOri, dirDst, isDelOld, isIgnoreExist } = args  

        // console.log("args:", JSON.stringify(args)) ;

        if(isDelOld){
            CommonFunc.deleteFolder(dirDst);  // 删除旧数据
        }

        // 获取文件列表
        let fileArr = []
        CommonFunc.readFileList(dirOri, fileArr) 

        // 拷贝
        for(let j in fileArr){
            let obj = fileArr[j] 
            let pathOri = obj.path + obj.filename
            let pathDst = dirDst + obj.subPath

            if (fs.existsSync(pathDst) && isIgnoreExist){
                // 跳过文件
                // console.log("ignore_file_:", pathDst )
            }else{
                CommonFunc.copyFileTo(pathOri, pathDst)
                // fs.copyFileSync(pathOri, pathDst)
                // console.log("copy_file_:", pathDst )
            } 
        }
    },

}


module.exports = retFuncs;
// export const CopyFolder = retFuncs;



// retFuncs.copyFolder({
//     dirOri : "" ,
//     dirDst : "" , 
//     // isDelOld : true ,
//     isIgnoreExist : true ,
// })

