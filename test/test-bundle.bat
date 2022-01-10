rem tool from tpsvr @ npm

chcp 65001

set nodeModulesPath=D:\公共项目分类\module\tpsvr/node_modules
set watchifyPath=%nodeModulesPath%/.bin/watchify

title watchify - bind-ui

if not exist ./bundle md bundle

set dest=./bundle/test-bundle.js

"%watchifyPath%" ^
	-o %dest% ^
	-v ^
	-g [ "%nodeModulesPath%/stringify" --extensions [.html .css .htm ] ] ^
	-r ../package.json:_package_json ^
	-r ./test-data.js:_test_data ^
	-r ./3/cls-3.js:cls-3 ^
	-r "../bind-ui.js:bind-ui"
