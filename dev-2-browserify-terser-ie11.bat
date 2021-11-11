
for /F %%i in ('npm root -g') do ( set globalModulePath=%%i)

set browserifyPath="browserify.cmd"
set bundleCollapserPath="%globalModulePath%/bundle-collapser/plugin"
set terserPath="terser.cmd"

set module=bind-ui

if not exist ./debug md debug

set babelifyPluginsForIe11= ^
	%globalModulePath%/@babel/plugin-transform-arrow-functions ^
	%globalModulePath%/@babel/plugin-transform-destructuring

call %browserifyPath% -p %bundleCollapserPath% -o ./debug/bundle.release.ie11.js -v ^
	-g [ %globalModulePath%/browserify-stringify-minimize-css-content --minimizeExtensions [ .css ] ] ^
	-g [ %globalModulePath%/stringify --extensions [.html .css .htm ] --minify true ] ^
	-g [ "%globalModulePath%/babelify" --plugins [ %babelifyPluginsForIe11% ] ] ^
	-r ./test/3/cls-3.js:cls-3 ^
	-r ./%module%.js:%module%

echo on

call %terserPath% ./debug/bundle.release.ie11.js -o ./debug/bundle.release.ie11.js -c -m

pause
