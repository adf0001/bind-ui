
chcp 936

set watchifyPath=watchify.cmd

set module=bind-ui

title watchify - %module% - test

if not exist ./release md release

for /F %%i in ('npm root -g') do ( set globalModulePath=%%i)
echo %NODE_PATH% | findstr %globalModulePath% >nul || SET NODE_PATH=%globalModulePath%\;%NODE_PATH%

%watchifyPath% -t [ %globalModulePath%/stringify --extensions [.html .css .htm ] ] -o ./release/bundle.js -v ^
	-r ./%module%.js:%module% ^
	-r ./test/3/cls-3.js:cls-3

