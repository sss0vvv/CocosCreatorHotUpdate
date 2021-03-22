

set curDir=%cd%
cd ..
set proRoot=%cd%
cd %curDir%

echo pro_Root_%proRoot%


set build_remote=%proRoot%/build/jsb-link/remote/
set pkCache=%proRoot%/build/jsb-link/assets/PKgamecaches/

node %curDir%\makePKgamecaches.js mac_Home %build_remote% %pkCache%


pause
