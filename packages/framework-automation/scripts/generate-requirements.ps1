<#
.SYNOPSIS
  Generates Features/Tasks docs from `docs/requirements/01_epics/*.md`.

.DESCRIPTION
  - Treats Epic docs as the source of truth for Feature IDs/titles.
  - Creates/updates:
    - `docs/requirements/02_features/README.md` (master index)
    - `docs/requirements/02_features/epic-XXX/README.md` (per-epic index)
    - Feature docs: `FEAT-XXX-YYY_<slug>.md` (one per feature)
    - Task docs (6 per feature): `TASK-XXX-YYY-NNN_<slug>.md`
    - `docs/requirements/04_traceability/03_Implementation_Status.md`
    - `docs/requirements/99_Estado_Actual.md`

  By default it does NOT overwrite existing Feature/Task docs (to avoid
  clobbering manual refinements). Use `-UpdateExisting` to force overwrite.
#>

[CmdletBinding()]
param(
    [switch]$UpdateExisting
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-FileIfChanged {
    param(
        [Parameter(Mandatory)]
        [string]$Path,

        [Parameter(Mandatory)]
        [string]$Content
    )

    $dir = Split-Path -Parent $Path
    if (-not (Test-Path -LiteralPath $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }

    if (Test-Path -LiteralPath $Path) {
        $existing = Get-Content -LiteralPath $Path -Raw
        if ($existing -eq $Content) {
            return
        }
    }

    Set-Content -LiteralPath $Path -Value $Content -NoNewline -Encoding UTF8
}

function Remove-Diacritics {
    param([Parameter(Mandatory)][string]$Text)
    $normalized = $Text.Normalize([Text.NormalizationForm]::FormD)
    $sb = New-Object -TypeName Text.StringBuilder
    foreach ($ch in $normalized.ToCharArray()) {
        if ([Globalization.CharUnicodeInfo]::GetUnicodeCategory($ch) -ne [Globalization.UnicodeCategory]::NonSpacingMark) {
            [void]$sb.Append($ch)
        }
    }
    return $sb.ToString().Normalize([Text.NormalizationForm]::FormC)
}

function To-Slug {
    param(
        [Parameter(Mandatory)]
        [string]$Text,

        [int]$MaxLength = 120
    )

    $s = Remove-Diacritics -Text $Text
    $s = $s -replace '[^A-Za-z0-9]+', '_'
    $s = $s -replace '^_+|_+$', ''
    $s = $s -replace '_{2,}', '_'
    if ($s.Length -gt $MaxLength) {
        $s = $s.Substring(0, $MaxLength).TrimEnd('_')
    }
    if ([string]::IsNullOrWhiteSpace($s)) {
        return 'Untitled'
    }
    return $s
}

function Get-StableGeneratedFileName {
    param(
        [Parameter(Mandatory)][string]$Directory,
        [Parameter(Mandatory)][string]$Prefix,
        [Parameter(Mandatory)][string]$DefaultFileName
    )

    if (-not (Test-Path -LiteralPath $Directory)) {
        return $DefaultFileName
    }

    $candidates = @(Get-ChildItem -LiteralPath $Directory -File -Filter "${Prefix}_*.md" | Sort-Object Name)
    if ($candidates.Count -eq 0) {
        return $DefaultFileName
    }

    if ($candidates.Count -eq 1) {
        return $candidates[0].Name
    }

    $exact = $candidates | Where-Object { $_.Name -eq $DefaultFileName } | Select-Object -First 1
    if ($exact) {
        return $exact.Name
    }

    return $candidates[0].Name
}

function Get-FirstMatch {
    param(
        [Parameter(Mandatory)][string]$Text,
        [Parameter(Mandatory)][string]$Pattern
    )
    $m = [regex]::Match($Text, $Pattern, [Text.RegularExpressions.RegexOptions]::Multiline)
    if ($m.Success) { return $m.Groups[1].Value.Trim() }
    return $null
}

function Get-EpicProfile {
    param([Parameter(Mandatory)][string]$EpicNumber)
    switch ($EpicNumber) {
        '004' { return 'ui_web' }
        '005' { return 'api' }
        '006' { return 'reporting' }
        '007' { return 'observability' }
        '008' { return 'config_security' }
        '009' { return 'test_data' }
        '010' { return 'cicd_dx' }
        '011' { return 'mobile' }
        default { return 'core' }
    }
}

function Get-TaskTemplatesForProfile {
    param([Parameter(Mandatory)][string]$Profile)
    switch ($Profile) {
        default {
            return @(
                @{ Title = 'Diseño, contratos y configuración para {FeatureTitle}'; Hours = 4 }
                @{ Title = 'Implementación e integración (DI/lifecycle/observability) de {FeatureTitle}'; Hours = 6 }
                @{ Title = 'Tests mínimos + documentación + ejemplo de uso para {FeatureTitle}'; Hours = 4 }
            )
        }
    }
}

function Get-RoadmapPhaseForEpicNumber {
    param([Parameter(Mandatory)][string]$EpicNumber)

    switch ($EpicNumber) {
        { $_ -in @('001','002','003','004','008') } { return 'Fase 1 (Meses 1-3)' }
        { $_ -in @('005','009') } { return 'Fase 2 (Meses 4-6)' }
        { $_ -in @('006','007') } { return 'Fase 3 (Meses 7-9)' }
        '010' { return 'Fase 1–2 (Meses 1-6)' }
        '011' { return 'Fase 4 (Meses 10-12)' }
        default { return 'TBD' }
    }
}

function Get-SubtaskTemplatesForTaskIndex {
    param(
        [Parameter(Mandatory)][int]$TaskIndex,
        [Parameter(Mandatory)][string]$FeatureTitle
    )

    switch ($TaskIndex) {
        1 {
            return @(
                @{ Title = "Definir contratos e interfaces para $FeatureTitle"; Objective = "Dejar definidos contratos e interfaces estables para habilitar **$FeatureTitle**."; Steps = @('Identificar consumidores y extension points.', 'Definir interfaces/clases base y contratos.', 'Documentar contratos y decisiones.') }
                @{ Title = "Definir configuración (Options) y validaciones para $FeatureTitle"; Objective = "Definir configuración tipada y validada (si aplica) para **$FeatureTitle**."; Steps = @('Definir sección(es) de configuración.', 'Agregar validación en arranque.', 'Documentar keys y defaults.') }
                @{ Title = "Actualizar trazabilidad (spec/blueprint) para $FeatureTitle"; Objective = "Alinear trazabilidad del feature **$FeatureTitle** con las especificaciones existentes."; Steps = @('Referenciar secciones relevantes de especificación.', 'Actualizar links y matriz de trazabilidad.', 'Registrar decisiones (ADR) si aplica.') }
            )
        }
        2 {
            return @(
                @{ Title = "Implementar core de $FeatureTitle"; Objective = "Implementar el núcleo funcional de **$FeatureTitle** dentro del framework."; Steps = @('Implementar componentes principales.', 'Asegurar thread-safety y async.', 'Manejo de errores con contexto.') }
                @{ Title = "Integrar $FeatureTitle con DI y lifecycle"; Objective = "Integrar **$FeatureTitle** con DI, hooks y lifecycle del framework."; Steps = @('Registrar servicios en DI.', 'Integrar con hooks/pipelines.', 'Asegurar disposal/teardown.') }
                @{ Title = "Agregar instrumentación (logs/métricas) para $FeatureTitle"; Objective = "Hacer observable **$FeatureTitle** con logs/metrics/tracing sin acoplar a proveedores."; Steps = @('Definir eventos relevantes.', 'Emitir métricas y logs correlacionados.', 'Verificar cardinalidad y masking.') }
            )
        }
        default {
            return @(
                @{ Title = "Crear unit tests mínimos para $FeatureTitle"; Objective = "Agregar unit tests mínimos que validen el comportamiento de **$FeatureTitle**."; Steps = @('Cubrir caminos principales y errores.', 'Mocks de dependencias.', 'Ejecutar en CI.') }
                @{ Title = "Crear integración/smoke test del framework para $FeatureTitle"; Objective = "Agregar un smoke/integration test demostrando uso real de **$FeatureTitle**."; Steps = @('Crear escenario mínimo (UI/API si aplica).', 'Asegurar determinismo.', 'Publicar artefactos si aplica.') }
                @{ Title = "Documentar y crear ejemplo de uso para $FeatureTitle"; Objective = "Documentar **$FeatureTitle** y proveer un ejemplo consumible por SDETs."; Steps = @('Actualizar README/guías.', 'Agregar snippet de uso.', 'Agregar notas de troubleshooting.') }
            )
        }
    }
}

function To-Size {
    param([Parameter(Mandatory)][int]$Hours)
    if ($Hours -lt 2) { return 'XS (<2h)' }
    if ($Hours -le 4) { return 'S (2-4h)' }
    if ($Hours -le 6) { return 'M (4-6h)' }
    return 'L (6-8h)'
}

function Parse-FeaturesFromEpic {
    param(
        [Parameter(Mandatory)][string]$EpicText,
        [Parameter(Mandatory)][string]$EpicNumber
    )

    $features = New-Object System.Collections.Generic.List[object]
    $lines = $EpicText -split "`n"
    foreach ($line in $lines) {
        $trim = $line.Trim()
        if (-not ($trim -match '^\|\s*FEAT-\d{3}-\d{3}\s*\|')) {
            continue
        }

        $cells = $trim -split '\|'
        $cells = $cells | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
        if ($cells.Count -lt 2) { continue }

        $id = $cells[0]
        $title = $cells[1]

        $priority = $null
        foreach ($c in $cells) {
            if ($c -match '^(Crítica|Alta|Media|Baja)$') {
                $priority = $c
                break
            }
        }
        if (-not $priority) { $priority = 'Media' }

        $sprint = $null
        foreach ($c in $cells) {
            if ($c -match '(?i)\bSprint\s*(\d+)\b') {
                $sprint = $Matches[1]
                break
            }
        }
        if (-not $sprint) {
            foreach ($c in $cells) {
                if ($c -match '^\d{1,2}$') {
                    $sprint = $c
                    break
                }
            }
        }
        if (-not $sprint) { $sprint = 'TBD' }

        $m = [regex]::Match($id, '^FEAT-(\d{3})-(\d{3})$')
        if (-not $m.Success) { continue }

        $features.Add([pscustomobject]@{
            EpicNumber = $m.Groups[1].Value
            FeatureNumber = $m.Groups[2].Value
            FeatureId = $id
            Title = $title
            Priority = $priority
            Sprint = $sprint
        }) | Out-Null
    }

    # Deduplicate by FeatureId
    return $features | Sort-Object FeatureId -Unique
}

function New-FeatureMarkdown {
    param(
        [Parameter(Mandatory)][pscustomobject]$Epic,
        [Parameter(Mandatory)][pscustomobject]$Feature,
        [Parameter(Mandatory)][object[]]$Tasks
    )

    $totalHours = ($Tasks | Measure-Object -Property Hours -Sum).Sum
    $tasksCount = $Tasks.Count
    $phase = Get-RoadmapPhaseForEpicNumber -EpicNumber $Epic.EpicNumber

    $tasksTable = ($Tasks | ForEach-Object {
        $taskId = $_.TaskId
        $taskTitle = $_.Title
        $taskHours = $_.Hours
        $taskLink = $_.TaskLinkFromFeature
        "| $taskId | $taskTitle | ${taskHours}h | [Link]($taskLink) |"
    }) -join "`n"

    $lines = @(
        '<!-- AUTO-GENERATED: scripts/generate-requirements.ps1 -->',
        "# $($Feature.FeatureId): $($Feature.Title)",
        '',
        "**Épica Padre:** [$($Epic.EpicId): $($Epic.Title)](../../01_epics/$($Epic.FileName))",
        '',
        "> **Descripción corta:** Entregar **$($Feature.Title)** como capacidad reutilizable del framework.",
        '>',
        '> **Plantilla:** [feature_template.md](../../templates/feature_template.md)',
        '',
        '---',
        '',
        '## 📋 Información General',
        '',
        '| Campo | Valor |',
        '|-------|-------|',
        "| **ID** | $($Feature.FeatureId) |",
        "| **Épica Padre** | [$($Epic.EpicId)](../../01_epics/$($Epic.FileName)) |",
        '| **Estado** | Pendiente |',
        "| **Prioridad** | $($Feature.Priority) |",
        "| **Fase del Roadmap** | $phase |",
        "| **Sprint Asignado** | $($Feature.Sprint) |",
        "| **Tasks** | $tasksCount |",
        "| **Estimación Total (Tasks)** | ${totalHours}h |",
        '',
        '---',
        '',
        '## 🎯 Objetivo del Feature',
        '',
        "Entregar la capacidad **$($Feature.FeatureId)** (*$($Feature.Title)*) dentro de la épica **$($Epic.EpicId)**, con contratos estables, configuración tipada (si aplica) y soporte para ejecución paralela.",
        '',
        '---',
        '',
        '## 📖 Descripción Funcional (framework)',
        '',
        '### Historia de Usuario (SDET)',
        '',
        '```text',
        'COMO:   SDET / QA Automation',
        "QUIERO: $($Feature.Title)",
        'PARA:   escribir pruebas mantenibles, paralelas y observables sin acoplarme a herramientas específicas',
        '```',
        '',
        '### Criterios de Aceptación (mínimo)',
        '',
        '- [ ] Existe un contrato público (interfaces/config) para esta capacidad.',
        '- [ ] La implementación es extensible (adapters/plugins) sin romper tests existentes.',
        '- [ ] Hay ejemplos de uso y tests mínimos del framework (unit/integración según aplique).',
        '',
        '---',
        '',
        '## 🏗️ Diseño Técnico (resumen)',
        '',
        '- **Contratos/Interfaces:** TBD (definir en Task 001).',
        '- **Configuración:** TBD (Options + validación si aplica).',
        '- **Observabilidad:** emitir logs/métricas/trazas relevantes sin overhead excesivo.',
        '',
        '---',
        '',
        '## 📝 Tasks (≤8h c/u)',
        '',
        '| Task ID | Título | Estimado | Link |',
        '|---------|--------|----------|------|',
        $tasksTable,
        '',
        '---',
        '',
        '## 🧪 Plan de Pruebas (mínimo)',
        '',
        '- Unit tests del core del feature.',
        '- Smoke/integration test demostrando uso (cuando aplique) sin dependencias externas no determinísticas.',
        '',
        '---',
        '',
        '## 🔗 Trazabilidad',
        '',
        '- **Especificación:** `docs/especifications/automation_framework.md`',
        '- **Blueprint:** `docs/especifications/automation_framework_architecture_option.md`'
    )

    return ($lines -join "`n")
}

function New-TaskMarkdown {
    param(
        [Parameter(Mandatory)][pscustomobject]$Epic,
        [Parameter(Mandatory)][pscustomobject]$Feature,
        [Parameter(Mandatory)][pscustomobject]$Task,
        [Parameter(Mandatory)][string]$FeatureLinkFromTask,
        [Parameter(Mandatory)][string]$EpicLinkFromTask,
        [object[]]$Subtasks = @()
    )

    $today = (Get-Date).ToString('yyyy-MM-dd')

    $subtasksLines = @()
    if ($Subtasks.Count -gt 0) {
        $rows = ($Subtasks | ForEach-Object {
            "| $($_.SubtaskId) | $($_.Title) | [Link]($($_.SubtaskLinkFromTask)) |"
        }) -join "`n"

        $subtasksLines = @(
            '## 🧩 Subtasks',
            '',
            '| Subtask ID | Título | Link |',
            '|------------|--------|------|',
            $rows,
            '',
            '---',
            ''
        )
    } else {
        $subtasksLines = @(
            '## 🧩 Subtasks',
            '',
            '- (Pendiente) Generar subtasks para esta task.',
            '',
            '---',
            ''
        )
    }

    $lines = @(
        '<!-- AUTO-GENERATED: scripts/generate-requirements.ps1 -->',
        "# $($Task.TaskId): $($Task.Title)",
        '',
        "**Feature Padre:** [$($Feature.FeatureId): $($Feature.Title)]($FeatureLinkFromTask)",
        '',
        "**Épica:** [$($Epic.EpicId): $($Epic.Title)]($EpicLinkFromTask)",
        '',
        "> **Descripción corta:** $($Task.ShortDescription)",
        '>',
        '> **Plantilla para detalle completo:** [task_template.md](../../../templates/task_template.md)',
        '',
        '---',
        '',
        '## 📋 Información General',
        '',
        '| Campo | Valor |',
        '|-------|-------|',
        "| **ID** | $($Task.TaskId) |",
        '| **Estado** | Pendiente |',
        "| **Prioridad** | $($Feature.Priority) |",
        "| **Tamaño Estimado** | $($Task.Size) |",
        "| **Estimación Horas** | $($Task.Hours) |",
        "| **Sprint Asignado** | $($Feature.Sprint) |",
        '| **Assignee** | TBD |',
        '| **Reviewer** | TBD |',
        "| **Fecha de Creación** | $today |",
        '',
        '---',
        '',
        '## 🎯 Objetivo de la Task',
        '',
        $Task.Objective,
        '',
        '### Criterio de Éxito',
        '',
        '- La entrega compila/valida sin errores y queda lista para integración.',
        '',
        '---',
        '',
        '## ✅ Entregables Esperados',
        '',
        '- [ ] Implementación del alcance descrito en el objetivo',
        '- [ ] Tests mínimos (unit/integración) según aplique',
        '- [ ] Documentación actualizada si aplica',
        '',
        '---',
        '',
        '## ✅ Criterios de Aceptación',
        '',
        '- [ ] Se implementa el cambio previsto sin romper compilación.',
        '- [ ] Se agregan/actualizan tests relevantes (si aplica) y pasan.',
        '- [ ] Se deja trazabilidad básica (link a Feature/Epic) intacta.',
        '',
        '---',
        '',
        '## 🧪 Plan de Pruebas (mínimo)',
        '',
        '- [ ] Unit tests donde aplique',
        '- [ ] Smoke test del flujo del feature (manual o automatizado)',
        '',
        '---',
        ''
    ) + $subtasksLines + @(
        '## 🔗 Trazabilidad',
        '',
        "- **Feature:** [$($Feature.FeatureId)]($FeatureLinkFromTask)",
        '- **Especificación:** `docs/especifications/automation_framework.md`',
        '- **Blueprint:** `docs/especifications/automation_framework_architecture_option.md`'
    )

    return ($lines -join "`n")
}

function New-SubtaskMarkdown {
    param(
        [Parameter(Mandatory)][pscustomobject]$Epic,
        [Parameter(Mandatory)][pscustomobject]$Feature,
        [Parameter(Mandatory)][pscustomobject]$Task,
        [Parameter(Mandatory)][pscustomobject]$Subtask,
        [Parameter(Mandatory)][string]$TaskLinkFromSubtask,
        [Parameter(Mandatory)][string]$FeatureLinkFromSubtask,
        [Parameter(Mandatory)][string]$EpicLinkFromSubtask
    )

    $today = (Get-Date).ToString('yyyy-MM-dd')
    $steps = ($Subtask.Steps | ForEach-Object { "- $_" }) -join "`n"

    return @"
<!-- AUTO-GENERATED: scripts/generate-requirements.ps1 -->
# $($Subtask.SubtaskId): $($Subtask.Title)

**Task Padre:** [$($Task.TaskId): $($Task.Title)]($TaskLinkFromSubtask)

**Feature:** [$($Feature.FeatureId): $($Feature.Title)]($FeatureLinkFromSubtask)

**Épica:** [$($Epic.EpicId): $($Epic.Title)]($EpicLinkFromSubtask)

> **Descripción corta:** $($Subtask.ShortDescription)
>
> **Plantilla:** [subtask_template.md](../../../../templates/subtask_template.md)

---

## 📋 Información General

| Campo | Valor |
|-------|-------|
| **ID** | $($Subtask.SubtaskId) |
| **Estado** | Pendiente |
| **Prioridad** | $($Feature.Priority) |
| **Assignee** | TBD |
| **Fecha de Creación** | $today |

---

## 🎯 Objetivo de la Sub-Task

$($Subtask.Objective)

### Criterio de Éxito

- Se completa el resultado esperado y queda listo para review/integración.

---

## 📖 Instrucciones Técnicas Detalladas

### Pasos a Seguir

$steps

### Archivos a Crear/Modificar

- (TBD) Definir durante implementación.

---

## ✅ Criterios de Aceptación

- [ ] Se implementa el resultado esperado de la subtask sin romper build.
- [ ] Se mantiene compatibilidad y trazabilidad (IDs/links).
- [ ] Se actualiza documentación/tests si aplica.

---

## 🔗 Dependencias

### Bloqueantes

- (TBD)

### Relacionadas

- (TBD)

---

## 📋 Checklist de Completitud

- [ ] Implementado
- [ ] Validado local/CI (si aplica)
- [ ] Documentado (si aplica)
"@
}

function New-FeaturesMasterReadme {
    param(
        [Parameter(Mandatory)][pscustomobject[]]$Epics
    )

    $totalFeatures = ($Epics | Measure-Object -Property FeatureCount -Sum).Sum
    $totalTasks = ($Epics | Measure-Object -Property TaskCount -Sum).Sum
    $totalSubtasks = ($Epics | Measure-Object -Property SubtaskCount -Sum).Sum

    $rows = ($Epics | ForEach-Object {
        $epicId = $_.EpicId
        $epicNum = $_.EpicNumber
        $epicTitle = $_.Title
        $featureCount = $_.FeatureCount
        $taskCount = $_.TaskCount
        $subtaskCount = $_.SubtaskCount
        $epicIndex = "epic-$epicNum/README.md"
        "| $epicId | $epicTitle | $featureCount | $taskCount | $subtaskCount | [Índice]($epicIndex) |"
    }) -join "`n"

    $today = (Get-Date).ToString('yyyy-MM-dd')

    return @"
<!-- AUTO-GENERATED: scripts/generate-requirements.ps1 -->
# 📋 Maestro de Features — Framework de Automatización

> **Fuente de verdad:** ``docs/requirements/01_epics/*.md``
>
> **Última generación:** $today

---

## 📊 Resumen

| Métrica | Valor |
|--------|------:|
| Épicas | $($Epics.Count) |
| Features | $totalFeatures |
| Tasks (baseline) | $totalTasks |
| Subtasks (baseline) | $totalSubtasks |

---

## 🧭 Índices por Épica

| Épica | Título | # Features | # Tasks | # Subtasks | Link |
|------|--------|-----------:|--------:|-----------:|------|
$rows
"@
}

function New-EpicFeaturesReadme {
    param(
        [Parameter(Mandatory)][pscustomobject]$Epic,
        [Parameter(Mandatory)][pscustomobject[]]$Features,
        [Parameter(Mandatory)][hashtable]$FeatureDocById
    )

    $rows = ($Features | ForEach-Object {
        $id = $_.FeatureId
        $title = $_.Title
        $priority = $_.Priority
        $sprint = $_.Sprint
        $docFile = $FeatureDocById[$id]
        $tasksDir = "../../03_tasks/epic-$($Epic.EpicNumber)/$id/"
        "| $id | $title | $priority | $sprint | [Detalle]($docFile) · [Tasks]($tasksDir) |"
    }) -join "`n"

    $today = (Get-Date).ToString('yyyy-MM-dd')
    return @"
<!-- AUTO-GENERATED: scripts/generate-requirements.ps1 -->
# Índice de Features - $($Epic.EpicId)

**Épica:** [$($Epic.EpicId): $($Epic.Title)](../../01_epics/$($Epic.FileName))

> **Última generación:** $today

---

| Feature ID | Título | Prioridad | Sprint | Links |
|-----------|--------|----------|--------|-------|
$rows
"@
}

function New-ImplementationStatusMarkdown {
    param(
        [Parameter(Mandatory)][pscustomobject[]]$Epics
    )

    $totalFeatures = ($Epics | Measure-Object -Property FeatureCount -Sum).Sum
    $totalTasks = ($Epics | Measure-Object -Property TaskCount -Sum).Sum
    $totalSubtasks = ($Epics | Measure-Object -Property SubtaskCount -Sum).Sum
    $today = (Get-Date).ToString('yyyy-MM-dd')

    $rows = ($Epics | ForEach-Object {
        $epicId = $_.EpicId
        $epicNum = $_.EpicNumber
        $featureCount = $_.FeatureCount
        $taskCount = $_.TaskCount
        $subtaskCount = $_.SubtaskCount
        $completed = 0
        $pct = if ($taskCount -gt 0) { [math]::Round(($completed / $taskCount) * 100, 1) } else { 0 }
        "| $epicId | $featureCount | $taskCount | $subtaskCount | $completed | ${pct}% | [Índice](../02_features/epic-$epicNum/README.md) |"
    }) -join "`n"

    return @"
<!-- AUTO-GENERATED: scripts/generate-requirements.ps1 -->
# 📈 Estado de Implementación (Backlog)

> **Última generación:** $today
>
> **Nota:** Este tablero refleja el estado documental del backlog (no el código).

---

## 📊 Totales

| Métrica | Valor |
|--------|------:|
| Épicas | $($Epics.Count) |
| Features | $totalFeatures |
| Tasks (baseline) | $totalTasks |
| Subtasks (baseline) | $totalSubtasks |

---

## 📋 Progreso por Épica

| Épica | # Features | # Tasks | # Subtasks | Tasks Completadas | % | Link |
|------|-----------:|--------:|-----------:|------------------:|---:|------|
$rows
"@
}

function New-EstadoActualMarkdown {
    param(
        [Parameter(Mandatory)][int]$EpicCount,
        [Parameter(Mandatory)][int]$FeatureDocCount,
        [Parameter(Mandatory)][int]$TaskDocCount,
        [Parameter(Mandatory)][int]$SubtaskDocCount,
        [Parameter(Mandatory)][int]$EpicIndexCount
    )

    $today = (Get-Date).ToString('yyyy-MM-dd')

    return @"
<!-- AUTO-GENERATED: scripts/generate-requirements.ps1 -->
# 📊 Estado Actual de Requisitos — Framework de Automatización

> **Fecha:** $today
>
> **Fuente de verdad:** ``docs/requirements/01_epics/*.md``

---

## ✅ Estructura (resumen)

- Épicas: $EpicCount (``docs/requirements/01_epics/``)
- Índices por épica: $EpicIndexCount (``docs/requirements/02_features/epic-XXX/README.md``)
- Feature docs (detalle): $FeatureDocCount (``FEAT-XXX-YYY_<slug>.md``)
- Task docs: $TaskDocCount (``TASK-XXX-YYY-NNN_<slug>.md``)
- Subtask docs: $SubtaskDocCount (``SUBTASK-XXX-YYY-NNN-SSS_<slug>.md``)

---

## 🧭 Cómo regenerar

1. Ejecutar: ``pwsh ./scripts/generate-requirements.ps1``
2. Validar: ``pwsh ./scripts/validate-requirements.ps1``
"@
}

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$requirementsRoot = Join-Path $repoRoot 'docs/requirements'
$epicsDir = Join-Path $requirementsRoot '01_epics'
$featuresRoot = Join-Path $requirementsRoot '02_features'
$tasksRoot = Join-Path $requirementsRoot '03_tasks'
$traceabilityRoot = Join-Path $requirementsRoot '04_traceability'
$subtasksRoot = Join-Path $requirementsRoot '05_subtasks'

if (-not (Test-Path -LiteralPath $epicsDir)) {
    throw "No se encontró: $epicsDir"
}

New-Item -ItemType Directory -Force -Path $featuresRoot | Out-Null
New-Item -ItemType Directory -Force -Path $tasksRoot | Out-Null
New-Item -ItemType Directory -Force -Path $traceabilityRoot | Out-Null
New-Item -ItemType Directory -Force -Path $subtasksRoot | Out-Null

$epicFiles = Get-ChildItem -LiteralPath $epicsDir -Filter 'EPIC-???_*.md' | Sort-Object Name
if ($epicFiles.Count -eq 0) {
    throw "No se encontraron épicas en $epicsDir"
}

$epics = New-Object System.Collections.Generic.List[object]

foreach ($epicFile in $epicFiles) {
    $epicText = Get-Content -LiteralPath $epicFile.FullName -Raw

    if ($epicFile.BaseName -notmatch '^EPIC-(\d{3})_') {
        continue
    }

    $epicNumber = $Matches[1]
    $epicId = "EPIC-$epicNumber"
    $epicTitle = Get-FirstMatch -Text $epicText -Pattern '^\#\s*EPIC-\d{3}:\s*(.+)$'
    if (-not $epicTitle) { $epicTitle = $epicFile.BaseName }
    $epicDocFileName = $epicFile.Name

    $epicDirName = "epic-$epicNumber"
    $epicFeaturesDir = Join-Path $featuresRoot $epicDirName

    $features = Parse-FeaturesFromEpic -EpicText $epicText -EpicNumber $epicNumber

    # Generate features + tasks
    New-Item -ItemType Directory -Force -Path $epicFeaturesDir | Out-Null
    $profile = Get-EpicProfile -EpicNumber $epicNumber
    $taskTemplates = Get-TaskTemplatesForProfile -Profile $profile

    $featureDocById = @{}
    $epicObj = [pscustomobject]@{ EpicId = $epicId; EpicNumber = $epicNumber; Title = $epicTitle; FileName = $epicDocFileName }

    foreach ($feature in $features) {
        $featureSlug = To-Slug -Text $feature.Title
        $defaultFeatureDocFileName = "$($feature.FeatureId)_$featureSlug.md"
        $featureDocFileName = Get-StableGeneratedFileName -Directory $epicFeaturesDir -Prefix $feature.FeatureId -DefaultFileName $defaultFeatureDocFileName
        $featureDocPath = Join-Path $epicFeaturesDir $featureDocFileName

        $featureDocById[$feature.FeatureId] = $featureDocFileName

        $tasksFeatureDir = Join-Path $tasksRoot (Join-Path $epicDirName $feature.FeatureId)
        New-Item -ItemType Directory -Force -Path $tasksFeatureDir | Out-Null

        $taskObjects = @()
        for ($i = 0; $i -lt $taskTemplates.Count; $i++) {
            $seq = '{0:000}' -f ($i + 1)
            $taskId = "TASK-$epicNumber-$($feature.FeatureNumber)-$seq"
            $taskTitle = $taskTemplates[$i].Title.Replace('{FeatureTitle}', $feature.Title)
            $hours = [int]$taskTemplates[$i].Hours
            if ($hours -gt 8) {
                throw "Plantilla inválida: $taskId tiene ${hours}h (>8h)"
            }

            $taskSlug = To-Slug -Text $taskTitle
            $defaultTaskFileName = "$taskId`_$taskSlug.md"
            $taskFileName = Get-StableGeneratedFileName -Directory $tasksFeatureDir -Prefix $taskId -DefaultFileName $defaultTaskFileName
            $taskPath = Join-Path $tasksFeatureDir $taskFileName

            $taskObj = [pscustomobject]@{
                TaskId = $taskId
                Title = $taskTitle
                Hours = $hours
                Size = To-Size -Hours $hours
                ShortDescription = "Ejecutar: $taskTitle."
                Objective = "Completar la actividad **$taskTitle** para habilitar el feature **$($feature.FeatureId)**."
                TaskLinkFromFeature = "../../03_tasks/$epicDirName/$($feature.FeatureId)/$taskFileName"
                TaskLinkFromTaskFolder = $taskFileName
            }

            # Subtasks (3 por task, baseline)
            $subtaskTemplates = Get-SubtaskTemplatesForTaskIndex -TaskIndex ($i + 1) -FeatureTitle $feature.Title
            $subtasksTaskDir = Join-Path $subtasksRoot (Join-Path $epicDirName (Join-Path $feature.FeatureId $taskId))
            New-Item -ItemType Directory -Force -Path $subtasksTaskDir | Out-Null

            $subtaskObjects = @()
            for ($j = 0; $j -lt $subtaskTemplates.Count; $j++) {
                $subSeq = '{0:000}' -f ($j + 1)
                $subtaskId = "SUBTASK-$epicNumber-$($feature.FeatureNumber)-$seq-$subSeq"
                $subtaskTitle = $subtaskTemplates[$j].Title
                $subtaskObjective = $subtaskTemplates[$j].Objective
                $subtaskSteps = $subtaskTemplates[$j].Steps

                $subtaskSlug = To-Slug -Text $subtaskTitle
                $defaultSubtaskFileName = "$subtaskId`_$subtaskSlug.md"
                $subtaskFileName = Get-StableGeneratedFileName -Directory $subtasksTaskDir -Prefix $subtaskId -DefaultFileName $defaultSubtaskFileName
                $subtaskPath = Join-Path $subtasksTaskDir $subtaskFileName

                $subtaskObjects += [pscustomobject]@{
                    SubtaskId = $subtaskId
                    Title = $subtaskTitle
                    Objective = $subtaskObjective
                    Steps = $subtaskSteps
                    ShortDescription = "Completar: $subtaskTitle."
                    SubtaskLinkFromTask = "../../../05_subtasks/$epicDirName/$($feature.FeatureId)/$taskId/$subtaskFileName"
                }

                if ($UpdateExisting -or -not (Test-Path -LiteralPath $subtaskPath)) {
                    $taskLinkFromSubtask = "../../../../03_tasks/$epicDirName/$($feature.FeatureId)/$taskFileName"
                    $featureLinkFromSubtask = "../../../../02_features/$epicDirName/$featureDocFileName"
                    $epicLinkFromSubtask = "../../../../01_epics/$epicDocFileName"
                    $subtaskMarkdown = New-SubtaskMarkdown -Epic $epicObj -Feature $feature -Task $taskObj -Subtask $subtaskObjects[-1] -TaskLinkFromSubtask $taskLinkFromSubtask -FeatureLinkFromSubtask $featureLinkFromSubtask -EpicLinkFromSubtask $epicLinkFromSubtask
                    Write-FileIfChanged -Path $subtaskPath -Content $subtaskMarkdown
                }
            }

            $taskObjects += $taskObj

            if ($UpdateExisting -or -not (Test-Path -LiteralPath $taskPath)) {
                $featureLinkFromTask = "../../../02_features/$epicDirName/$featureDocFileName"
                $epicLinkFromTask = "../../../01_epics/$epicDocFileName"
                $taskMarkdown = New-TaskMarkdown -Epic $epicObj -Feature $feature -Task $taskObj -FeatureLinkFromTask $featureLinkFromTask -EpicLinkFromTask $epicLinkFromTask -Subtasks $subtaskObjects
                Write-FileIfChanged -Path $taskPath -Content $taskMarkdown
            }
        }

        # Feature detailed doc (only create if missing, unless -UpdateExisting)
        if ($UpdateExisting -or -not (Test-Path -LiteralPath $featureDocPath)) {
            $featureMarkdown = New-FeatureMarkdown -Epic $epicObj -Feature $feature -Tasks $taskObjects
            Write-FileIfChanged -Path $featureDocPath -Content $featureMarkdown
        }
    }

    # Per-epic index
    $epicIndexPath = Join-Path $epicFeaturesDir 'README.md'
    $epicIndexMarkdown = New-EpicFeaturesReadme -Epic $epicObj -Features $features -FeatureDocById $featureDocById
    Write-FileIfChanged -Path $epicIndexPath -Content $epicIndexMarkdown

    $epics.Add([pscustomobject]@{
        EpicId = $epicId
        EpicNumber = $epicNumber
        Title = $epicTitle
        FeatureCount = $features.Count
        TaskCount = $features.Count * $taskTemplates.Count
        SubtaskCount = $features.Count * $taskTemplates.Count * 3
        EpicIndexPath = "02_features/$epicDirName/README.md"
    }) | Out-Null
}

# Master Features README
$masterReadmePath = Join-Path $featuresRoot 'README.md'
Write-FileIfChanged -Path $masterReadmePath -Content (New-FeaturesMasterReadme -Epics $epics.ToArray())

# Implementation Status
$implStatusPath = Join-Path $traceabilityRoot '03_Implementation_Status.md'
Write-FileIfChanged -Path $implStatusPath -Content (New-ImplementationStatusMarkdown -Epics $epics.ToArray())

# Estado Actual (counts based on actual FS)
$epicIndexCount = (Get-ChildItem -LiteralPath $featuresRoot -Directory -Filter 'epic-*' | ForEach-Object { Test-Path -LiteralPath (Join-Path $_.FullName 'README.md') } | Where-Object { $_ }).Count
$featureDocCount = (Get-ChildItem -LiteralPath $featuresRoot -Recurse -File -Filter 'FEAT-???-???_*.md').Count
$taskDocCount = (Get-ChildItem -LiteralPath $tasksRoot -Recurse -File -Filter 'TASK-???-???-???_*.md').Count
$subtaskDocCount = (Get-ChildItem -LiteralPath $subtasksRoot -Recurse -File -Filter 'SUBTASK-???-???-???-???_*.md').Count

$estadoActualPath = Join-Path $requirementsRoot '99_Estado_Actual.md'
Write-FileIfChanged -Path $estadoActualPath -Content (New-EstadoActualMarkdown -EpicCount $epics.Count -EpicIndexCount $epicIndexCount -FeatureDocCount $featureDocCount -TaskDocCount $taskDocCount -SubtaskDocCount $subtaskDocCount)

Write-Host "OK: Generación completada. Epics=$($epics.Count) Features=$featureDocCount Tasks=$taskDocCount Subtasks=$subtaskDocCount"
