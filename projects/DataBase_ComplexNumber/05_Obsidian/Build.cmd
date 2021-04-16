mkdir "Build\Code\"
xcopy ..\02_Code\Build Build\Code /i /y
xcopy ..\02_Code\Build\Img Build\Img /i /y
xcopy ..\04_LatexRenderer\Build Build\LatexRenderer /i /y

..\03_ObsidianConverter\ObsidianConverter\bin\Release\ObsidianConverter.exe 01_Vault\ Build\ 01_Vault\Working\template.html
