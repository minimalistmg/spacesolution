$connections = @(
    Get-NetTCPConnection -LocalPort 4321 -State Listen -ErrorAction SilentlyContinue
)

if (-not $connections) {
    exit 1
}

$pids = $connections.OwningProcess | Sort-Object -Unique
foreach ($procId in $pids) {
    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
    cmd.exe /c "taskkill /F /T /PID $procId" 2>$null | Out-Null
}

Start-Sleep -Milliseconds 500
exit 0
