
set watchifyPath="watchify.cmd"

set module=bind-ui

title watchify - %module%

if not exist ./release md release

for /F %%i in ('npm root -g') do ( set globalModulePath=%%i)

%watchifyPath% -o ./release/bundle.js -v ^
	-t [ "%globalModulePath%/stringify" --extensions [.html .css .htm ] ] ^
	-r ./test/3/cls-3.js:cls-3 ^
	-r ./%module%.js:%module%

