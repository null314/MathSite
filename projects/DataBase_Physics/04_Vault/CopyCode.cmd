mkdir 01_Vault\Code
mkdir Build\Img
mkdir Build\Code

xcopy ..\02_Code\Build 01_Vault\Code /i /y
xcopy ..\02_Code\Build Build\Code /i /y
xcopy 02_Img Build\Img /i /y