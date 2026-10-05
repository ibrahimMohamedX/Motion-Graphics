param(
    [Parameter(Mandatory = $true)]
    [string]$VideoName
)

$Root = "C:\AI-Motion-Graphics"
$VideoDir = Join-Path $Root "videos\$VideoName"

if (Test-Path $VideoDir) {
    Write-Error "Video job already exists: $VideoDir"
    exit 1
}

New-Item -ItemType Directory -Force "$VideoDir\assets" | Out-Null
New-Item -ItemType Directory -Force "$VideoDir\data" | Out-Null
New-Item -ItemType Directory -Force "$VideoDir\preview" | Out-Null
New-Item -ItemType Directory -Force "$VideoDir\output" | Out-Null

@"
# $VideoName

## Assets

Place the voice-over and other source assets inside:

assets/

## Generated Data

- data/transcript.json
- data/scene-plan.json

## Output

Final rendered video:

output/
"@ | Set-Content "$VideoDir\README.md" -Encoding UTF8

Write-Host ""
Write-Host "Created video job:" -ForegroundColor Cyan
Write-Host $VideoDir
Write-Host ""
Write-Host "Put the voice-over inside:" -ForegroundColor Yellow
Write-Host "$VideoDir\assets\"
