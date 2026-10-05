param(
    [Parameter(Mandatory = $true)]
    [string]$VideoName
)

$ErrorActionPreference = "Stop"

$Root = "C:\AI-Motion-Graphics"
$VideoDir = Join-Path $Root "videos\$VideoName"

$ScenePlanPath = Join-Path $VideoDir "data\scene-plan.json"
$PropsPath = Join-Path $VideoDir "data\studio-props.json"
$OutputPath = Join-Path $VideoDir "output\final.mp4"
$ValidatorPath = Join-Path $Root "scripts\validate-scene-plan.mjs"

if (-not (Test-Path $VideoDir)) {
    Write-Error "Video job not found: $VideoDir"
    exit 1
}

if (-not (Test-Path $ScenePlanPath)) {
    Write-Error "scene-plan.json not found: $ScenePlanPath"
    exit 1
}

if (-not (Test-Path $ValidatorPath)) {
    Write-Error "Scene plan validator not found: $ValidatorPath"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Archai Motion Graphics Renderer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Video: $VideoName" -ForegroundColor White
Write-Host ""

# ----------------------------------------
# 1. VALIDATE SCENE PLAN
# ----------------------------------------

Write-Host "[1/5] Validating scene plan..." -ForegroundColor Yellow
Write-Host ""

node $ValidatorPath $ScenePlanPath

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Render stopped because scene-plan validation failed." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Scene plan validation completed." -ForegroundColor Green
Write-Host ""

# ----------------------------------------
# 2. LOAD SCENE PLAN
# ----------------------------------------

Write-Host "[2/5] Loading scene plan..." -ForegroundColor Yellow

try {
    $scenePlanJson = Get-Content $ScenePlanPath -Raw
    $scenePlan = $scenePlanJson | ConvertFrom-Json
}
catch {
    Write-Error "scene-plan.json could not be loaded."
    exit 1
}

Write-Host "Duration: $($scenePlan.durationInSeconds)s" -ForegroundColor DarkGray
Write-Host "Scenes: $($scenePlan.scenes.Count)" -ForegroundColor DarkGray
Write-Host ""

# ----------------------------------------
# 3. PREPARE REMOTION PROPS
# ----------------------------------------
# ----------------------------------------
# 3. PREPARE REMOTION JOB
# ----------------------------------------

Write-Host "[3/5] Preparing Remotion job assets..." -ForegroundColor Yellow
Write-Host ""

$PrepareJobPath = Join-Path $Root "scripts\prepare-job.mjs"

if (-not (Test-Path $PrepareJobPath)) {
    Write-Error "Job preparation script not found: $PrepareJobPath"
    exit 1
}

node $PrepareJobPath $VideoName

if ($LASTEXITCODE -ne 0) {
    Write-Error "Job preparation failed."
    exit 1
}

if (-not (Test-Path $PropsPath)) {
    Write-Error "Prepared props were not created: $PropsPath"
    exit 1
}

Write-Host ""
Write-Host "Job assets and props prepared." -ForegroundColor Green
Write-Host ""
# ----------------------------------------
# 4. RENDER
# ----------------------------------------

Write-Host "[4/5] Rendering..." -ForegroundColor Yellow
Write-Host ""

npx remotion render `
    MyComposition `
    $OutputPath `
    "--props=$PropsPath"

if ($LASTEXITCODE -ne 0) {
    Write-Error "Remotion render failed."
    exit 1
}

Write-Host ""
Write-Host "Render completed." -ForegroundColor Green
Write-Host ""

# ----------------------------------------
# 5. VALIDATE OUTPUT
# ----------------------------------------

Write-Host "[5/5] Validating output..." -ForegroundColor Yellow

if (-not (Test-Path $OutputPath)) {
    Write-Error "Output video was not created."
    exit 1
}

$probe = ffprobe `
    -v error `
    -show_entries format=duration,size `
    -of default=noprint_wrappers=1 `
    $OutputPath

Write-Host ""
Write-Host $probe
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host " VIDEO READY" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Output:" -ForegroundColor White
Write-Host $OutputPath -ForegroundColor Cyan
Write-Host ""