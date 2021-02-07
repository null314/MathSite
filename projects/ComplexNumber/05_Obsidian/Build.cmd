mkdir "Build\Code\"
copy ..\02_Code\Build\source.js Build\Code\source.js 
xcopy !Vault\Img Build\Img /i /y
xcopy ..\04_LatexRenderer\@Build Build\LatexRenderer /i /y

..\03_ObsidianConverter\ObsidianConverter\bin\Release\ObsidianConverter.exe !Vault\ Build\ !Vault\Working\template.html
