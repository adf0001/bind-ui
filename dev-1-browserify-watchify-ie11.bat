
set watchifyPath="watchify.cmd"

set module=bind-ui

title watchify - %module%

if not exist ./debug md debug

for /F %%i in ('npm root -g') do ( set globalModulePath=%%i)

set babelifyPluginsForIe11= ^
	%globalModulePath%/@babel/plugin-transform-arrow-functions ^
	%globalModulePath%/@babel/plugin-transform-destructuring

%watchifyPath% -o ./debug/bundle.debug.ie11.js -v ^
	-g [ "%globalModulePath%/stringify" --extensions [.html .css .htm ] ] ^
	-g [ "%globalModulePath%/babelify" --plugins [ %babelifyPluginsForIe11% ] ] ^
	-r ./package.json:_package_json ^
	-r ./test/test-data.js:_test_data ^
	-r ./test/3/cls-3.js:cls-3 ^
	-r ./%module%.js:%module%

