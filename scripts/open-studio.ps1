param(
    [Parameter(Mandatory=$true)]
    [string]$VideoName
)

$ErrorActionPreference = "Stop"

$Root = "C:\AI-Motion-Graphics"

Set-Location $Root

$VideoDir = Join-Path $Root "videos\$VideoName"
$ScenePlan = Join-Path $VideoDir "data\scene-plan.json"
$Props = Join-Path $VideoDir "data\studio-props.json"

if (-not (Test-Path $VideoDir)) {
    Write-Error "Video job not found: $VideoDir"
    exit 1
}

if (-not (Test-Path $ScenePlan)) {
    Write-Error "scene-plan.json not found: $ScenePlan"
    exit 1
}

Write-Host ""
Write-Host "Preparing Video Job: $VideoName" -ForegroundColor Cyan

node ".\scripts\prepare-job.mjs" $VideoName

if ($LASTEXITCODE -ne 0) {
    Write-Error "Job preparation failed."
    exit $LASTEXITCODE
}

if (-not (Test-Path $Props)) {
    Write-Error "Studio props were not generated: $Props"
    exit 1
}

Write-Host ""
Write-Host "Opening Remotion Studio..." -ForegroundColor Cyan
Write-Host "Composition: MyComposition" -ForegroundColor DarkGray
Write-Host "Video Job: $VideoName" -ForegroundColor DarkGray
Write-Host ""

npx remotion studio --props="$Props"
