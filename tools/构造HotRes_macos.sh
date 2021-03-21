

cd `dirname $0` 

projectDir=$(dirname $(pwd))
 
# 更新版本

build_root=$projectDir/build/jsb-link
verConfigOri=$projectDir/verconfig.json
hotRes=$projectDir/hotRes


echo test_$projectDir

node ./makeHotRes.js $build_root $verConfigOri $hotRes

# sudo chmod -R 777 $downloadPath/remote  

