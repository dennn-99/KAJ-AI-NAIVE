@echo off
setlocal

set "SOURCE=%~dp0xampp"
set "APP_NAME=kaj-ai"
set "HTDOCS="

if not exist "%SOURCE%\index.html" (
  echo Folder xampp tidak ditemukan.
  pause
  exit /b 1
)

for %%D in (
  "C:\xampp\htdocs"
  "D:\xampp\htdocs"
  "E:\xampp\htdocs"
  "D:\AI\Xampp File\htdocs"
  "C:\Program Files\xampp\htdocs"
  "D:\Program Files\xampp\htdocs"
  "%USERPROFILE%\xampp\htdocs"
) do (
  if exist "%%~D" (
    set "HTDOCS=%%~D"
    goto :foundHtdocs
  )
)

echo Folder htdocs XAMPP tidak ditemukan otomatis.
echo Contoh lokasi: C:\xampp\htdocs atau D:\xampp\htdocs
set /p "HTDOCS=Masukkan lokasi folder htdocs Anda: "

:foundHtdocs
if not exist "%HTDOCS%" (
  echo Folder htdocs tidak valid: %HTDOCS%
  pause
  exit /b 1
)

set "TARGET=%HTDOCS%\%APP_NAME%"
set "URL=http://localhost/%APP_NAME%/"

if not exist "%TARGET%" mkdir "%TARGET%"
xcopy "%SOURCE%\*" "%TARGET%\" /E /I /Y >nul

echo KAJ AI sudah disalin ke %TARGET%
echo Pastikan Apache XAMPP sedang berjalan.

if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
  start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" "%URL%"
) else if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
  start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" "%URL%"
) else (
  start "" "%URL%"
)

endlocal
