@echo off
cd /d D:\Yudde-Demo
echo [%date% %time%] Attempting git push...
git push https://rosious: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@github.com/Rosious/Yudde-s-Fansy-World.git master 2>&1
if %ERRORLEVEL% == 0 (
    echo [SUCCESS] Pushed to GitHub!
) else (
    echo [FAIL] Push failed - check network
)
