

# 将 /build/jsb-link/remote 下的资源拷贝到 /build/jsb-link/assets/PKgamecaches ,
# 以便首次启动时将资源复制到可读写路径下

cd `dirname $0`
projectDir=$(dirname $(pwd))


build_remote=$projectDir/build/jsb-link/remote/
pkCache=$projectDir/build/jsb-link/assets/PKgamecaches/

node ./makePKgamecaches.js mac_Home $build_remote $pkCache




