param(
    [Parameter(Mandatory = $true)]
    [string]$Title,

    [Parameter(Mandatory = $true)]
    [string]$Message,

    [ValidateSet('Info', 'Warning', 'Error')]
    [string]$Icon = 'Info'
)

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$toolTipIcon = [System.Windows.Forms.ToolTipIcon]::Info
$systemIcon = [System.Drawing.SystemIcons]::Information

if ($Icon -eq 'Warning') {
    $toolTipIcon = [System.Windows.Forms.ToolTipIcon]::Warning
    $systemIcon = [System.Drawing.SystemIcons]::Warning
}
elseif ($Icon -eq 'Error') {
    $toolTipIcon = [System.Windows.Forms.ToolTipIcon]::Error
    $systemIcon = [System.Drawing.SystemIcons]::Error
}

$notify = New-Object System.Windows.Forms.NotifyIcon
$notify.Icon = $systemIcon
$notify.Visible = $true
$notify.ShowBalloonTip(4000, $Title, $Message, $toolTipIcon)
Start-Sleep -Milliseconds 4500
$notify.Dispose()

exit 0
