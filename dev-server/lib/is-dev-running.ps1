$listening = Get-NetTCPConnection -LocalPort 4321 -State Listen -ErrorAction SilentlyContinue
if ($listening) { exit 0 }
exit 1
