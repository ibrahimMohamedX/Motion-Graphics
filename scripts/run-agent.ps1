param(
    [Parameter(Mandatory = $true)]
    [string]$VideoName
)

$ErrorActionPreference = "Stop"

$Root = "C:\AI-Motion-Graphics"
$VideoDir = Join-Path $Root "videos\$VideoName"
$AssetsDir = Join-Path $VideoDir "assets"
$TranscriptPath = Join-Path $VideoDir "data\transcript.json"
$ScenePlanPath = Join-Path $VideoDir "data\scene-plan.json"
$OutputPath = Join-Path $VideoDir "output\final.mp4"

if (-not (Test-Path $VideoDir)) {
    Write-Error "Video job not found: $VideoDir"
    exit 1
}

# ----------------------------------------
# 1. FIND VOICE-OVER
# ----------------------------------------

$AudioFiles = Get-ChildItem $AssetsDir -File |
    Where-Object {
        $_.Extension.ToLower() -in @(
            ".wav",
            ".mp3",
            ".m4a",
            ".aac",
            ".ogg",
            ".flac"
        )
    }

if ($AudioFiles.Count -eq 0) {
    Write-Error "No voice-over audio found in: $AssetsDir"
    exit 1
}

if ($AudioFiles.Count -gt 1) {
    Write-Host ""
    Write-Host "Multiple audio files found:" -ForegroundColor Yellow

    foreach ($file in $AudioFiles) {
        Write-Host " - $($file.Name)"
    }

    Write-Host ""
    Write-Error "Keep exactly one voice-over file inside assets."
    exit 1
}

$AudioPath = $AudioFiles[0].FullName

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Archai AI Motion Graphics Agent" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Video Job: $VideoName"
Write-Host "Job Directory: $VideoDir"
Write-Host "Voice-over: $($AudioFiles[0].Name)"
Write-Host ""

# ----------------------------------------
# 2. TRANSCRIPTION
# ----------------------------------------

Write-Host "[1/3] Transcribing voice-over locally..." -ForegroundColor Yellow
Write-Host ""

node "$Root\scripts\transcribe.mjs" `
    $AudioPath `
    $TranscriptPath

if ($LASTEXITCODE -ne 0) {
    Write-Error "Transcription failed."
    exit 1
}

if (-not (Test-Path $TranscriptPath)) {
    Write-Error "Transcript was not created: $TranscriptPath"
    exit 1
}

Write-Host ""
Write-Host "Transcription completed." -ForegroundColor Green
Write-Host ""

# ----------------------------------------
# 3. CLAUDE AGENT
# ----------------------------------------

Write-Host "[2/3] Starting autonomous AI production agent..." -ForegroundColor Yellow
Write-Host ""

Set-Location $Root

$SystemPrompt = @"
You are the autonomous production agent for the Archai Solutions AI Motion Graphics system.

This is NOT a generic coding task.

You operate an existing reusable motion-video production engine.

ARCHITECTURE RULES:

1. A VIDEO JOB is data.
2. A REMOTION COMPOSITION is reusable infrastructure.
3. The current reusable composition is MyComposition.
4. A job named <name> ALWAYS resolves to:

   videos/<name>/

5. NEVER search the source code for a Composition named after a video job.
6. NEVER create a new Remotion Composition for a video job.
7. NEVER create a new project for a video job.
8. NEVER create a video-specific rendering architecture when the reusable engine can represent the requirement.
9. Reusable fixes belong in src/engine or reusable components.
10. Job-specific information belongs inside videos/<name>/data.

The following are the authoritative reusable systems:

- .claude/skills/motion-video-pipeline/SKILL.md
- .claude/skills/motion-design-system/SKILL.md
- src/engine/visuals/VisualGrammar.ts
- src/engine/scenes/SceneArchetype.tsx
- src/engine/scenes/SceneArchetypeRegistry.ts
- src/engine/scenes/ArchetypeSceneRenderer.tsx
- src/engine/registry/PrimitiveRegistry.tsx
- src/engine/registry/MotionRegistry.ts
- src/engine/layout/LayoutEngine.ts
- src/engine/layout/VisualStage.tsx
- src/engine/SceneComposer.tsx
- src/engine/VisualPlanRenderer.tsx
- src/Composition.tsx
- src/Root.tsx

You MUST read the relevant skills before making decisions.

TOOL POLICY:

You may directly use local CLI tools through Bash/PowerShell when needed:

- Node
- PowerShell
- FFmpeg
- FFprobe
- Whisper.cpp
- Remotion CLI

Do not create MCP wrappers merely to use these local CLI tools.

TRANSCRIPTION POLICY:

- Transcription must remain local.
- Do not use OpenAI API transcription.
- Do not use cloud transcription.
- Whisper.cpp is the transcription engine.

VISUAL SYSTEM POLICY:

The visual/design system is reusable infrastructure.

Do not redesign it for an individual video.

The primary visual hierarchy is:

Narration
→ Meaning
→ Intent
→ Scene Archetype
→ Archetype Props
→ Existing Reusable Scene Component
→ Render

The Scene Archetype system is the PRIMARY visual language of the Agent.

Available Scene Archetypes include:

- hero-question
- usage-counter
- appearance-to-utility
- fragmented-customer-journey
- unified-customer-journey
- business-insights-dashboard
- customer-retention-loop
- competition-pressure
- missed-opportunities
- digital-transformation
- custom-app-solution
- brand-cta

When an existing Archetype can communicate the narration:

USE THE ARCHETYPE.

Do NOT replace an appropriate Archetype with generic primitives merely because primitives are available.

Primitive-based Visual Plans are FALLBACK infrastructure only.

If an Archetype needs additional capability:

1. determine whether the capability is reusable
2. modify the reusable Archetype/component
3. expose it through props
4. keep the implementation reusable
5. do not create video-specific JSX

Use:

Shape → Line → Node → System → Data → Interface → Outcome

Visuals must communicate the narration semantically.

Avoid:

- generic AI imagery
- robots
- random neon
- rainbow gradients
- stock-template aesthetics
- decorative motion with no meaning
- excessive UI
- arbitrary viewport positioning
- duplicated visual architectures
- video-specific visual hacks

Arabic content must use the existing RTL-native visual approach.

Archai sells business outcomes, not technology names.

JOB RESOLUTION:

If the requested job is:

agent-real-test

then the job directory is:

videos/agent-real-test/

It is NOT:

- a Composition named agent-real-test
- a source file named agent-real-test
- a component named agent-real-test

To open a job in Remotion Studio, use:

.\scripts\open-studio.ps1 agent-real-test

Do not grep/search the repository to discover the job.

AUTONOMOUS EXECUTION:

You are expected to complete the entire production pipeline.

Do not stop after analysis.

Do not stop after creating scene-plan.json.

Do not stop after validation.

Continue until the final video exists.

If a command fails:

1. inspect the error
2. determine the root cause
3. fix the reusable system or job data appropriately
4. rerun the failed step
5. continue

Only stop when the job is complete or a genuine blocking external failure cannot be resolved locally.
"@

$Prompt = @"
Produce the complete video for this Video Job.

PROJECT ROOT:
$Root

VIDEO JOB:
$VideoName

JOB DIRECTORY:
$VideoDir

VOICE-OVER:
$AudioPath

TRANSCRIPT:
$TranscriptPath

SCENE PLAN:
$ScenePlanPath

FINAL OUTPUT:
$OutputPath

EXECUTION PLAN:

1. Read:
   .claude/skills/motion-video-pipeline/SKILL.md

2. Read:
   .claude/skills/motion-design-system/SKILL.md

3. Read the reusable engine files necessary to understand the visual system.

4. Read:
   $TranscriptPath

5. Analyze the narration semantically.

6. Create a meaningful scene structure synchronized with the actual narration.

7. Generate:
   $ScenePlanPath

8. The scene plan MUST prefer the existing Scene Archetypes.

For each scene:

Narration
→ semantic meaning
→ intent
→ appropriate Scene Archetype
→ props

Use an Archetype whenever one exists.

The visual object should normally look like:

"visual": {
  "archetype": "unified-customer-journey",
  "props": {
    "title": "...",
    "highlight": "...",
    "steps": ["...", "..."]
  }
}

Primitive-based plans are allowed only when no existing Archetype can communicate the visual meaning.

Do not invent new archetype names.

Do not create video-specific visual components.

If a reusable visual capability is missing, improve the reusable engine instead.

9. Validate:

   node scripts\validate-scene-plan.mjs "$ScenePlanPath"

10. If validation fails, fix the scene plan and validate again.

11. Prepare the job:

   node scripts\prepare-job.mjs $VideoName

12. Render:

   .\scripts\render-video.ps1 $VideoName

13. Verify:

   $OutputPath

14. Use FFprobe if necessary to verify duration and file integrity.

15. If the render fails because of a reusable engine problem, fix the reusable engine.

16. If the render fails because of incorrect job data, fix the job data.

17. Revalidate and rerender.

18. Do not stop until:

   $OutputPath

   exists and is a valid video.

IMPORTANT:

The final result must be a real rendered video.

Do not merely explain what should be done.

Do not return a plan instead of executing it.

Do not ask the user for confirmation for normal local file, code, FFmpeg, FFprobe, Node, PowerShell, or Remotion operations.

Do not create a new Composition for $VideoName.

Do not create a new project.

Do not create a new visual system.
"@

Write-Host "Launching Claude in NON-INTERACTIVE mode..." -ForegroundColor Cyan
Write-Host ""

Write-Host ""
Write-Host "========================================"
Write-Host " Claude Code Agent Started"
Write-Host "========================================"
Write-Host ""

claude `
    --print `
    --permission-mode bypassPermissions `
    --tools default `
    --output-format text `
    --append-system-prompt $SystemPrompt `
    $Prompt

$ClaudeExitCode = $LASTEXITCODE

Write-Host ""
Write-Host "========================================"
Write-Host " Claude Code Agent Finished"
Write-Host "Exit Code: $ClaudeExitCode"
Write-Host "========================================"

Write-Host ""
Write-Host "========== CLAUDE OUTPUT ==========" -ForegroundColor DarkGray
$ClaudeOutput
Write-Host "===================================" -ForegroundColor DarkGray
Write-Host ""

if ($ClaudeExitCode -ne 0) {
    Write-Error "Claude production agent exited with code $ClaudeExitCode."
    exit $ClaudeExitCode
}

# ----------------------------------------
# 4. FINAL CHECK
# ----------------------------------------

Write-Host "[3/3] Checking final output..." -ForegroundColor Yellow
Write-Host ""

if (-not (Test-Path $ScenePlanPath)) {
    Write-Error "Agent finished but scene-plan.json was not created: $ScenePlanPath"
    exit 1
}

Write-Host "Scene plan found." -ForegroundColor Green

node "$Root\scripts\validate-scene-plan.mjs" $ScenePlanPath

if ($LASTEXITCODE -ne 0) {
    Write-Error "Final scene plan validation failed."
    exit 1
}

if (-not (Test-Path $OutputPath)) {
    Write-Error "Agent finished but final video was not created: $OutputPath"
    exit 1
}

$probe = ffprobe `
    -v error `
    -show_entries format=duration,size `
    -of default=noprint_wrappers=1 `
    $OutputPath

if ($LASTEXITCODE -ne 0) {
    Write-Error "FFprobe could not validate the final video."
    exit 1
}

Write-Host ""
Write-Host $probe
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host " AGENT JOB COMPLETED" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Output:" -ForegroundColor Cyan
Write-Host $OutputPath
Write-Host ""


