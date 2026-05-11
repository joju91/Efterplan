Add-Type -Name "Win32Functions" -Namespace "Win32" -MemberDefinition @"
[DllImport("kernel32.dll")]
public static extern uint SetThreadExecutionState(uint esFlags);
"@

$ES_CONTINUOUS      = [uint32]"0x80000000"
$ES_SYSTEM_REQUIRED = [uint32]"0x00000001"

[Win32.Win32Functions]::SetThreadExecutionState($ES_CONTINUOUS -bor $ES_SYSTEM_REQUIRED) | Out-Null

Write-Host "Sleep-läge avstängt i 70 minuter. Låt det här fönstret vara öppet." -ForegroundColor Green

Start-Sleep -Seconds (70 * 60)

[Win32.Win32Functions]::SetThreadExecutionState($ES_CONTINUOUS) | Out-Null
Write-Host "Sleep-läge återställt." -ForegroundColor Yellow
