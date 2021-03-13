@echo off
npm version patch && ^
cd "%cd%\projects\ng-generic-pipe" && ^
npm version patch && ^
cd "%cd%" && ^
npm run build ng-generic-pipe --prod && ^
copy /y "%cd%\README.md" "%cd%\dist\ng-generic-pipe\README.md" && ^
copy /y "%cd%\LICENSE" "%cd%\dist\ng-generic-pipe\LICENSE" && ^
cd "%cd%\dist\ng-generic-pipe" && ^
npm publish --ignore-scripts && ^
cd "%cd%"
pause