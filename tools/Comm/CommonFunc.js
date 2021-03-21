

// CommonFunc

const fs = require('fs')
var path = require("path"); 

let CommonFunc = {}
//----------------------------------------------------------
// 获取目录下文件夹
CommonFunc.getFolder = function (path, folders){
    var files = fs.readdirSync(path);
    files.forEach(function (itm, index) {
        var stat = fs.statSync(path + itm);
        if (stat.isDirectory()) {
            //递归读取文件 
            folders.push(itm)
        } 
    })
};

// 递归获取目录下所有文件
CommonFunc.readFileList = function(path, filesList , _subPath) {
    if (!fs.existsSync(path)) { return ; }
    
    _subPath = _subPath || ""
    var files = fs.readdirSync(path);
    files.forEach(function (itm, index) {
        var stat = fs.statSync(path + itm);
        if (stat.isDirectory()) {
            //递归读取文件
            CommonFunc.readFileList(path + itm + "/", filesList, _subPath + itm + "/")
        } else {
            if(itm[0] != "."){
                var obj = {};//定义一个对象存放文件的路径和名字
                obj.path = path;//路径
                obj.filename = itm//名字
                obj.subPath = _subPath + itm // 相对于根路径的子路径
                filesList.push(obj);
                // console.log("one_file_:", obj.path, obj.filename )
            }else {
                console.log("exclude_file_:", itm )
            }
        }
    })
}

// 拷贝文件到
CommonFunc.copyFileTo = function (pathOri, pathDst){
    // 
    let prePath = path.dirname(pathDst)
    if (!fs.existsSync(prePath)){
        CommonFunc.mkdirsSync(prePath)
    }
    // console.log("prepath_:", prePath )
    fs.copyFileSync(pathOri, pathDst)

    // const data = fs.readFileSync(fileOri);  // , 'utf-8'
    // fs.writeFileSync(fileNew, data)
}

// 递归创建目录 
CommonFunc.mkdirsSync = function (dirname) {
    if (fs.existsSync(dirname)) {
        return true;

    } else {
        // console.log("create_dir_:", dirname )
        if (CommonFunc.mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

// 删除文件夹
CommonFunc.deleteFolder = function (path) {
    var files = [];
    if(fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function(file, index) {
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                CommonFunc.deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

 


module.exports = CommonFunc;
// export const CommonFunc = CommonFunc;

