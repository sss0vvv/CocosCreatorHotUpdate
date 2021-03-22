



CocosCreator 2.4.3热更新实现方案(AssetBundle),大厅+子游戏模式快速实现
========

仓库地址
---------
https://github.com/sss0vvv/CocosCreatorHotUpdate.git

链接地址
---------
https://blog.csdn.net/zggxjxcgx/article/details/115051741


说明
--------
未修改引擎源码.

项目调试环境:  
macOS Big Sur 11.1

Cocos creator 2.4.3 

Xcode 12.3

Android Studio 4.1

NodeJs

XAMPP


实现功能:
1. 热更新基于 Asset Bundle 实现 大厅+子游戏 模式,
   低优先级模块可引用高优先级模块中资源及脚本,
   可配置模块依赖,被依赖的模块会自动更新.

2. 热更新模块可以打到包里随发布包一起发布,免去首次启动游戏就完整下载模块.

3. 多模块在同一工程下开发.

4. 支持AutoAtlas预加载.



[辅助工具](https://github.com/sss0vvv/CocosCreatorHotUpdate/tree/master/tools)
--------
需安装 NodeJs

执行 tools 下的 "构造HotRes_macos.sh" / "构造HotRes_windows.bat",将会在根目录 [hotRes](https://github.com/sss0vvv/CocosCreatorHotUpdate/tree/master/hotRes) 下生成完整的热更新资源以及版本控制文件verconfig.json.

执行 tools 下的 "构造PKgamecaches_macos.sh" / "构造PKgamecaches_windows.bat",将会在[/build/jsb-link/assets/](https://github.com/sss0vvv/CocosCreatorHotUpdate/tree/master/build/jsb-link/assets)
生成随包发布的热更模块 PKgamecaches .



快速使用
--------
1. 将 Scene/ModuleMagPreFab.prefab 以及 Script/ModuleMag 下资源拷贝到你的工程.
   修改 [ModuleConst.js](https://github.com/sss0vvv/CocosCreatorHotUpdate/blob/master/assets/Script/ModuleMag/ModuleConst.js) 里的资源下载服务器地址.

2. 在 ModuleMagPreFab.prefab 分别绑定 resources 及 Texture 中的资源(参考示例,任意图片即可).

3. 在工程根目录下配置你的版本控制文件 [verconfig.json](https://github.com/sss0vvv/CocosCreatorHotUpdate/blob/master/verconfig.json) (参考示例).

4. 在Creator属性检查器,将你的模块配置为 Bundle, 并勾选"配置为远程包", 被依赖的模块请设置更高的 "Bundle优先级".

5. Creator构建项目后,使用辅助工具构建热更资源hotRes 以及 随包发布模块PKgamecaches(修改makePKgamecaches.js 中的 hotUrl). 
	将 hotRes 下的内容完整上传到下载服务器.

6. 使用代码

let moduleMagObj    = cc.instantiate(this.ModuleMagPreFab)

moduleMagObj.parent = this.node  

window._G_moduleMag = moduleMagObj.getComponent("ModuleManager")  

_G_moduleMag.initCom({

    useHotUpdate : true ,     // 是否启用热更新 
    
}) 

//-------------------

// 复制包内模块到可读写路径下,避免首次加载模块时从远程完整拉取

_G_moduleMag.execUnpackage(()=>{

    _G_moduleMag.reqVersionInfo(()=>{  // 获取最新版本
    
        let loadAb = ["ABLobby"]
	
        // loadAb = ["ABLobby", "ABSubGame1", "ABSubGame2"]
	
        _G_moduleMag.hotUpdateMultiModule(loadAb,()=>{ // 更新模块到最新版本
	
            _G_moduleMag.addModule("ABLobby", (moduleObj)=>{ // 加载模块
	    
                let abObj = moduleObj.getABObj()
		
                abObj.load('root/Scene/LobbyRoot', cc.Prefab, (err, prefab)=>{  // 使用模块资源 
		
    				//...
				
                }) 
		
            })
	    
        })
	
    })
    
})


// 定时检测更新

// _G_moduleMag.reqLoopVersionInfo()

7.使用Xcode模拟器或者 iOS/Android 真机调试.

8.windows下测试

将 /build/jsb-link/assets/ 下的src, assets, main.js三个文件覆盖到win32Example_exe文件夹, 

执行 hot_example.exe启动游戏, 单击键盘TAB键保存Log日志到可读写路径下 alogRecord.txt .



注意事项
-------
每个模块中的资源需放在 root 文件夹下

Creator构建界面勾选 MD5 Cache.

需要跑热更新时,初始化 ModuleManager 传入 useHotUpdate(true) .  
请不要用Creator自带模拟器(资源结构不同)跑热更新,可以使用Xcode模拟器或者安卓真机调试热更新.

修改 [makePKgamecaches.js](https://github.com/sss0vvv/CocosCreatorHotUpdate/blob/master/tools/makePKgamecaches.js) 中的 hotUrl 为你的资源下载地址.

修改 [ModuleConst.js](https://github.com/sss0vvv/CocosCreatorHotUpdate/blob/master/assets/Script/ModuleMag/ModuleConst.js) 中的 hotUrl 为你的资源下载地址.

hotRes上传到资源下载服务器,需保留remote这级目录.

如果希望指定模块随包发布可手动配置 [makePKgamecaches.js](https://github.com/sss0vvv/CocosCreatorHotUpdate/blob/master/tools/makePKgamecaches.js) 中的 folders.


