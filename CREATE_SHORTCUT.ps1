# PowerShell script to create a NeoFit desktop shortcut with icon
# Run this once on the client's machine: Right-click > Run with PowerShell

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$desktopPath = [Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktopPath "NeoFit Dashboard.lnk"
$targetPath = Join-Path $scriptDir "START.bat"
$iconPath = Join-Path $scriptDir "neofit.ico"

# Create shortcut
$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $targetPath
$shortcut.WorkingDirectory = $scriptDir
$shortcut.Description = "Launch NeoFit Fitness Gym Admin Dashboard"
$shortcut.WindowStyle = 1

# Set the icon using absolute path
if (Test-Path $iconPath) {
    $shortcut.IconLocation = "$iconPath,0"
    Write-Host "  [OK] Custom icon found and applied." -ForegroundColor Green
} else {
    Write-Host "  [!] neofit.ico not found, using default icon." -ForegroundColor Yellow
}

$shortcut.Save()

# Remove old shortcut from cache so Windows picks up the new icon
$cacheDir = "$env:LOCALAPPDATA\IconCache*"
Remove-Item $cacheDir -Force -ErrorAction SilentlyContinue 2>$null

Write-Host ""
Write-Host "  ============================================" -ForegroundColor Green
Write-Host "  NeoFit shortcut created on your Desktop!" -ForegroundColor Green
Write-Host "  ============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  You can now double-click 'NeoFit Dashboard'" -ForegroundColor Cyan
Write-Host "  on your Desktop to start the system." -ForegroundColor Cyan
Write-Host ""
Write-Host "  TIP: If the icon still looks blank, right-click" -ForegroundColor Yellow
Write-Host "  your Desktop > Refresh" -ForegroundColor Yellow
Write-Host ""

Read-Host "  Press Enter to close"
