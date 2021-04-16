mkdir Build\Img
xcopy !Img Build\Img /i /y
xcopy !CodeJs Build /i /y

"..\01_TsPacker\@Build\packer.exe" packerSettings.txt Build\source.ts
"..\00_TsCompiler\.bin\tsc" Build\source.ts

