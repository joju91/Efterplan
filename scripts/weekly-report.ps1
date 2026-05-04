# Efterplan — Weekly Report Generator (lokal)
# Körs av Windows Task Scheduler varje måndag kl 09:00.
# Ersätter Cowork-sandlådan som inte har GA4-credentials/nätverk.
#
# Kör manuellt:  powershell -File scripts\weekly-report.ps1

$ErrorActionPreference = 'Stop'

# Klättra upp till repo-roten oavsett varifrån scriptet körs.
$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $RepoRoot

$Today    = Get-Date -Format 'yyyy-MM-dd'
$Weekday  = (Get-Date).DayOfWeek
$OutFile  = Join-Path $RepoRoot "veckorapport-$Today.md"
$LogFile  = Join-Path $RepoRoot ".claude/weekly-report.log"

function Log($msg) {
  $ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
  "[${ts}] $msg" | Out-File -FilePath $LogFile -Append -Encoding utf8
}

Log "=== Run started ($Weekday) ==="

# ─── 1. GA4 KPIs ─────────────────────────────────────────
$ga4Output = ''
try {
  Push-Location (Join-Path $RepoRoot 'ga4-dashboard')
  $ga4Output = node scripts/weekly-kpis.js 2>&1 | Out-String
  Pop-Location
  Log "GA4: ok"
} catch {
  $ga4Output = "GA4-anrop misslyckades: $($_.Exception.Message)"
  Log "GA4: failed - $($_.Exception.Message)"
  try { Pop-Location } catch {}
}

# ─── 2. Uptime-check ─────────────────────────────────────
$uptimeRows = @()
$pages = @('/', '/sambo-arv.html', '/efterlevandepension.html', '/dodsbo-bostadsratt.html', '/vad-gora-nar-nagon-dor.html')
foreach ($p in $pages) {
  try {
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    $r = Invoke-WebRequest -Uri "https://www.efterplan.se$p" -UseBasicParsing -TimeoutSec 15 -MaximumRedirection 5
    $sw.Stop()
    $uptimeRows += [pscustomobject]@{ Path = $p; Code = $r.StatusCode; Time = "{0:N2}s" -f ($sw.Elapsed.TotalSeconds) }
  } catch {
    $code = 'ERR'
    if ($_.Exception.Response) { $code = [int]$_.Exception.Response.StatusCode }
    $uptimeRows += [pscustomobject]@{ Path = $p; Code = $code; Time = '-' }
  }
}
Log "Uptime: $($uptimeRows.Count) sidor kontrollerade"

# ─── 3. Git-aktivitet senaste 7 dagar ────────────────────
$changedFiles = @(git log --since='7 days ago' --name-only --pretty=format: 2>$null | Where-Object { $_ -ne '' } | Sort-Object -Unique)
$commits      = @(git log --since='7 days ago' --pretty=format:'%h %s' 2>$null | Where-Object { $_ })
Log "Git: $($commits.Count) commits, $($changedFiles.Count) filer"

# ─── 4. npm audit (ga4-dashboard) ────────────────────────
$auditSummary = 'okänt'
try {
  Push-Location (Join-Path $RepoRoot 'ga4-dashboard')
  $auditJson = npm audit --json 2>$null | Out-String
  Pop-Location
  if ($auditJson) {
    $audit = $auditJson | ConvertFrom-Json
    $vuln  = $audit.metadata.vulnerabilities
    $auditSummary = "$($vuln.critical) critical · $($vuln.high) high · $($vuln.moderate) moderate · $($vuln.low) low"
  }
  Log "npm audit: $auditSummary"
} catch {
  Log "npm audit failed: $($_.Exception.Message)"
  try { Pop-Location } catch {}
}

# ─── 5. Roadmap-status (räkna boxar i roadmap.md) ────────
$roadmap = Get-Content (Join-Path $RepoRoot 'roadmap.md') -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
$done = $progress = $todo = 0
if ($roadmap) {
  $done     = ([regex]::Matches($roadmap, '✔')).Count
  $progress = ([regex]::Matches($roadmap, '⧖')).Count
  $todo     = ([regex]::Matches($roadmap, '☐')).Count
}
Log "Roadmap: $done klara, $progress pågår, $todo ej startade"

# ─── 6. Bygg markdown ────────────────────────────────────
$md = @()
$md += "# Efterplan Veckorapport — $Today"
$md += ''
$md += '> Genererad lokalt av `scripts/weekly-report.ps1` (Windows Task Scheduler).'
$md += ''
$md += '---'
$md += ''
$md += '## 🔢 Nyckeltal (7 dagar — GA4)'
$md += ''
$md += '```'
$md += $ga4Output.TrimEnd()
$md += '```'
$md += ''
$md += '## 🟢 Uptime'
$md += ''
$md += '| Path | Status | Tid |'
$md += '|------|--------|-----|'
foreach ($u in $uptimeRows) { $md += "| ``$($u.Path)`` | $($u.Code) | $($u.Time) |" }
$md += ''
$md += '## 📊 Git-aktivitet'
$md += ''
$md += "- **$($commits.Count)** commits, **$($changedFiles.Count)** filer ändrade"
$md += ''
$md += '### Commits'
$md += ''
foreach ($c in $commits) { $md += "- ``$c``" }
$md += ''
$md += '## 🔧 Teknisk audit'
$md += ''
$md += "- **npm audit (ga4-dashboard):** $auditSummary"
$md += "- **Live-sajt:** $($uptimeRows[0].Code) på $($uptimeRows[0].Time)"
$md += ''
$md += '## 🗺️ Roadmap-status'
$md += ''
$md += '| Status | Antal |'
$md += '|--------|-------|'
$md += "| ✔ Klara | $done |"
$md += "| ⧖ Pågår | $progress |"
$md += "| ☐ Ej startade | $todo |"
$md += ''
$md += '---'
$md += ''
$md += "*Nästa körning: måndag $((Get-Date).AddDays(7).ToString('yyyy-MM-dd')) kl 09:00*"
$md += ''

$md -join "`n" | Out-File -FilePath $OutFile -Encoding utf8
Log "Wrote $OutFile"
Write-Host "Veckorapport skriven: $OutFile"
