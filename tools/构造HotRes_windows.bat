

set curDir=%cd%
cd ..
set proRoot=%cd%
cd %curDir%

echo pro_Root_%proRoot%

node %curDir%/makeHotRes.js %proRoot%/build/jsb-link %proRoot%/verconfig.json %proRoot%/hotRes


pause

::set currPath=%~dp0