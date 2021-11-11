
set watchifyPath="watchify.cmd"

set module=bind-ui

title watchify - %module%

if not exist ./debug md debug

for /F %%i in ('npm root -g') do ( set globalModulePath=%%i)

%watchifyPath% -o ./debug/bundle.debug.js -v ^
	-g [ "%globalModulePath%/stringify" --extensions [.html .css .htm ] ] ^
	-r ./package.json:_package_json ^
	-r ./test/test-data.js:_test_data ^
	-r ./test/3/cls-3.js:cls-3 ^
	-r ./%module%.js:%module%

