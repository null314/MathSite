mkdir Build\Img
xcopy 03_Img Build\Img /i /y
xcopy 02_CodeJs Build /i /y

"..\01_TsPacker\Build\packer.exe" packerSettings.txt Build\source.ts
"..\00_TsCompiler\.bin\tsc" Build\source.ts

