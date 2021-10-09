
for /F %%i in ('npm root -g') do ( set globalModulePath=%%i)

set browserifyPath="browserify.cmd"
set bundleCollapserPath="%globalModulePath%/bundle-collapser/plugin"
set terserPath="terser.cmd"

set module=bind-ui

if not exist ./release md release

call %browserifyPath% -p %bundleCollapserPath% -o ./release/bundle.min.js -v ^
	-t [ %globalModulePath%/stringify --extensions [.html .css .htm ] --minify true ] ^
	-r ./test/3/cls-3.js:cls-3 ^
	-r ./%module%.js:%module%

echo on

call %terserPath% ./release/bundle.min.js -o ./release/bundle.min.js -c -m

pause
