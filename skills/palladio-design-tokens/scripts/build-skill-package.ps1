#Requires -Version 7
# Build the distributable agent-skill package: a zip of skills/palladio-design-tokens/
# containing exactly the tracked files as of HEAD (SKILL.md, references/, scripts/).
#
#   pwsh -NoProfile -File skills/palladio-design-tokens/scripts/build-skill-package.ps1
#
# Output: skills/palladio-design-tokens/dist/palladio-agent-skill-<label>.zip
#   <label> = $env:PALLADIO_SKILL_VERSION, else `git describe --tags --always`.
#
# The skill is value-free (it points at whichever @pdiodsgn/tokens artifact the
# consumer installed), so a package from any release works. This script is the
# single source of truth for how that package is built; watt.yaml calls it.

$ErrorActionPreference = 'Stop'

$repoRoot = (git rev-parse --show-toplevel 2>$null)
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($repoRoot)) {
    throw 'not inside a git working tree'
}
Set-Location $repoRoot.Trim()

$skillPath = 'skills/palladio-design-tokens'
if (-not (Test-Path $skillPath)) { throw "missing $skillPath" }

# lint gate — refuse to package a skill that fails its own checks
node "$skillPath/scripts/check-skill.mjs"
if ($LASTEXITCODE -ne 0) { throw 'skill lint failed' }

$label = $env:PALLADIO_SKILL_VERSION
if ([string]::IsNullOrWhiteSpace($label)) {
    $label = (git describe --tags --always).Trim()
}
# keep the label filesystem-safe
$label = $label -replace '[^\w.\-]', '_'

$outDir = Join-Path $skillPath 'dist'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$out = Join-Path $outDir "palladio-agent-skill-$label.zip"
if (Test-Path $out) { Remove-Item $out -Force }

# tracked files only, from HEAD, under a stable top-level folder
git archive --format=zip --prefix='palladio-design-tokens/' -o $out "HEAD:$skillPath"
if ($LASTEXITCODE -ne 0) { throw 'git archive failed' }

$size = [math]::Round((Get-Item $out).Length / 1KB, 1)
Write-Host "built $out (${size} kB)"
