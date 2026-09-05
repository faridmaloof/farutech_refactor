<#
.SYNOPSIS
  Validates generated requirements documentation.

.DESCRIPTION
  Checks:
  - Expected counts derived from epics (features/tasks/subtasks)
  - Internal markdown links resolve to existing files/directories (no URLs)
  - Fails with non-zero exit code on validation errors
#>

[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Fail($Message) {
    Write-Error $Message
    exit 1
}

function Get-RepoRoot {
    return Resolve-Path (Join-Path $PSScriptRoot '..')
}

function Get-MarkdownFiles($Root) {
    return Get-ChildItem -LiteralPath $Root -Recurse -File -Filter '*.md'
}

function Remove-CodeFences {
    param([Parameter(Mandatory)][string]$Text)

    $lines = $Text -split "`n"
    $out = New-Object System.Collections.Generic.List[string]
    $inFence = $false
    foreach ($line in $lines) {
        if ($line -match '^\s*```') {
            $inFence = -not $inFence
            continue
        }
        if (-not $inFence) {
            $out.Add($line) | Out-Null
        }
    }
    return ($out -join "`n")
}

function Resolve-LinkTarget {
    param(
        [Parameter(Mandatory)][string]$BaseDir,
        [Parameter(Mandatory)][string]$Target
    )

    $t = $Target.Trim()
    if ([string]::IsNullOrWhiteSpace($t)) { return $null }
    if ($t -match '^[a-zA-Z]+://') { return $null }  # URL
    if ($t.StartsWith('#')) { return $null }          # anchor only
    if ($t.StartsWith('mailto:')) { return $null }

    # Strip anchors: path#section
    $pathPart = $t.Split('#')[0]
    if ([string]::IsNullOrWhiteSpace($pathPart)) { return $null }

    # Treat `/docs/...` as repo-root relative
    if ($pathPart.StartsWith('/')) {
        $repoRoot = Get-RepoRoot
        $pathPart = $pathPart.TrimStart('/')
        return [IO.Path]::GetFullPath((Join-Path $repoRoot $pathPart))
    }

    return [IO.Path]::GetFullPath((Join-Path $BaseDir $pathPart))
}

$repoRoot = Get-RepoRoot
$requirementsRoot = Join-Path $repoRoot 'docs/requirements'
$epicsRoot = Join-Path $requirementsRoot '01_epics'
$featuresRoot = Join-Path $requirementsRoot '02_features'
$tasksRoot = Join-Path $requirementsRoot '03_tasks'
$subtasksRoot = Join-Path $requirementsRoot '05_subtasks'

if (-not (Test-Path -LiteralPath $requirementsRoot)) { Fail "No existe: $requirementsRoot" }
if (-not (Test-Path -LiteralPath $epicsRoot)) { Fail "No existe: $epicsRoot" }
if (-not (Test-Path -LiteralPath $featuresRoot)) { Fail "No existe: $featuresRoot" }
if (-not (Test-Path -LiteralPath $tasksRoot)) { Fail "No existe: $tasksRoot" }
if (-not (Test-Path -LiteralPath $subtasksRoot)) { Fail "No existe: $subtasksRoot" }

# Expected counts derived from epics (source of truth)
$epicFiles = Get-ChildItem -LiteralPath $epicsRoot -File -Filter 'EPIC-???_*.md'
$expectedEpicCount = $epicFiles.Count
if ($expectedEpicCount -lt 1) { Fail "No se encontraron épicas en $epicsRoot." }

$expectedFeatureCount = 0
foreach ($f in $epicFiles) {
    $text = Get-Content -LiteralPath $f.FullName -Raw
    $scriptMatches = [regex]::Matches($text, 'FEAT-\d{3}-\d{3}') | ForEach-Object { $_.Value } | Sort-Object -Unique
    $expectedFeatureCount += $scriptMatches.Count
}
$expectedTaskCount = $expectedFeatureCount * 3
$expectedSubtaskCount = $expectedTaskCount * 3

# Counts
$epicIndexCount = (Get-ChildItem -LiteralPath $featuresRoot -Directory -Filter 'epic-*' | ForEach-Object { Test-Path -LiteralPath (Join-Path $_.FullName 'README.md') } | Where-Object { $_ }).Count
if ($epicIndexCount -ne $expectedEpicCount) {
    Fail "Se esperaban $expectedEpicCount índices por épica en 02_features (encontrados: $epicIndexCount)."
}

$featureDocCount = (Get-ChildItem -LiteralPath $featuresRoot -Recurse -File -Filter 'FEAT-???-???_*.md').Count
if ($featureDocCount -ne $expectedFeatureCount) {
    Fail "Se esperaban $expectedFeatureCount feature docs (FEAT-XXX-YYY_<slug>.md). Encontrados: $featureDocCount."
}

$taskDocCount = (Get-ChildItem -LiteralPath $tasksRoot -Recurse -File -Filter 'TASK-???-???-???_*.md').Count
if ($taskDocCount -ne $expectedTaskCount) {
    Fail "Se esperaban $expectedTaskCount task docs (TASK-XXX-YYY-NNN_<slug>.md). Encontrados: $taskDocCount."
}

$subtaskDocCount = (Get-ChildItem -LiteralPath $subtasksRoot -Recurse -File -Filter 'SUBTASK-???-???-???-???_*.md').Count
if ($subtaskDocCount -ne $expectedSubtaskCount) {
    Fail "Se esperaban $expectedSubtaskCount subtask docs (SUBTASK-XXX-YYY-NNN-SSS_<slug>.md). Encontrados: $subtaskDocCount."
}

# Link validation
$mdFiles = Get-MarkdownFiles -Root $requirementsRoot | Where-Object {
    $_.FullName -notmatch [regex]::Escape([IO.Path]::Combine('docs', 'requirements', 'templates') + [IO.Path]::DirectorySeparatorChar)
}
$missing = New-Object System.Collections.Generic.List[string]

$linkRegex = [regex]'\[[^\]]+\]\(([^)]+)\)'

foreach ($f in $mdFiles) {
    $raw = Get-Content -LiteralPath $f.FullName -Raw
    $text = Remove-CodeFences -Text $raw

    $baseDir = Split-Path -Parent $f.FullName
    $scriptMatches = $linkRegex.Matches($text)
    foreach ($m in $scriptMatches) {
        $target = $m.Groups[1].Value
        $resolved = Resolve-LinkTarget -BaseDir $baseDir -Target $target
        if (-not $resolved) { continue }

        if ($target.Trim().EndsWith('/')) {
            if (-not (Test-Path -LiteralPath $resolved -PathType Container)) {
                $missing.Add("$($f.FullName): link a directorio no existe -> $target") | Out-Null
            }
            continue
        }

        if (-not (Test-Path -LiteralPath $resolved)) {
            $missing.Add("$($f.FullName): link no existe -> $target") | Out-Null
        }
    }
}

if ($missing.Count -gt 0) {
    $sample = $missing | Select-Object -First 40
    Write-Host "Links rotos (muestra):"
    $sample | ForEach-Object { Write-Host " - $_" }
    Fail "Validación fallida: $($missing.Count) links rotos."
}

Write-Host "OK: Validación completada. Epics=$expectedEpicCount Features=$expectedFeatureCount Tasks=$expectedTaskCount Subtasks=$expectedSubtaskCount Links=OK"
