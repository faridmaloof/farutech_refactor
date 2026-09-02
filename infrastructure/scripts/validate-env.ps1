# ==============================================================================
# validate-env.ps1 — Valida la jerarquía Secret → `.env` → default (TASK-002)
#
# Uso:
#   ./scripts/validate-env.ps1 -Env local
#   ./scripts/validate-env.ps1 -Env dev|qa|staging|prod
#
# Comportamiento:
#   - Lee variables fuente más prioritarias: variables de entorno YA definidas
#     (simula Secrets manager), luego el `.env` del directorio infraestructura.
#     Si ninguna está definida, asume el valor del default en `docker-compose.yml`
#     (que hoy es el placeholder CHANGE_ME_OR_SET_SECRET).
#   - Imprime una tabla con el ORIGEN de cada variable (Secret/env | .env | default).
#   - Para ambientes NO-locales, FALLA si alguna variable sensible termina
#     siendo un placeholder (`CHANGE_ME_OR_SET_SECRET`).
#   - Para LOCAL, permite placeholders (devuelve 1 si hay placeholders para
#     AVISAR, pero no detiene) — consistente con "fallback documentado a .env".
#
# Exit codes:
#   0  = OK (todas las variables resueltas)
#   1  = error (no-local con placeholder, o variable ausente sin default)
#   2  = AVISO en local (placeholders presentes, arranque NO recomendado)
# ==============================================================================

param(
    [ValidateSet('local','dev','qa','staging','prod')]
    [string]$Env = 'local'
)

$exitCode = 0
$base = Join-Path $PSScriptRoot '..'
$settingsFile = Join-Path $base '.env'
$composeFile = Join-Path $base 'docker-compose.yml'

# Variables sensibles a validar (todas DEBEN resolverse sin placeholder en no-local)
$secrets = @(
    'MYSQL_ROOT_PASSWORD',
    'MYSQL_DATABASE',
    'MYSQL_USER',
    'MYSQL_PASSWORD',
    'POSTGRES_DB',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'MONGO_INITDB_ROOT_USERNAME',
    'MONGO_INITDB_ROOT_PASSWORD',
    'PGADMIN_DEFAULT_EMAIL',
    'PGADMIN_DEFAULT_PASSWORD',
    'MONGO_EXPRESS_USER',
    'MONGO_EXPRESS_PASSWORD'
)

# --- Cargar .env a hashtable (si existe) --------------------------------------
$envVars = @{}
if (Test-Path $settingsFile) {
    Get-Content $settingsFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith('#')) {
            $idx = $line.IndexOf('=')
            if ($idx -gt 0) {
                $envVars[$line.Substring(0, $idx).Trim()] = $line.Substring($idx + 1).Trim()
            }
        }
    }
}

$placeholder = 'CHANGE_ME_OR_SET_SECRET'

Write-Host "== validate-env  (ambiente: $Env) =="
Write-Host ("{0,-32} {1,-10} {2}" -f 'VARIABLE', 'ORIGEN', 'VALOR', '')
Write-Host ('-' * 70)

foreach ($key in $secrets) {
    # 1. Prioritdad 1: Variables de entorno del proceso (Secrets Manager / shell)
    $origin = 'env'
    $value = [Environment]::GetEnvironmentVariable($key)
    if ([string]::IsNullOrEmpty($value)) {
        # 2. Prioridad 2: .env
        if ($envVars.ContainsKey($key)) {
            $origin = '.env'
            $value = $envVars[$key]
        } else {
            # 3. Prioridad 3: default en docker-compose.yml (placeholder)
            $origin = 'default'
            $value = $placeholder
        }
    }

    $display = $value
    if ($key -like '*PASSWORD*' -or $key -like '*_SECRET*') {
        # no exponer valores reales en el log cuando vengan de env o .env
        if ($value -ne $placeholder -and $value) { $display = '********' }
    }

    Write-Host ('{0,-35} {1,-6} {2}' -f $key, $origin, $display)

    # Resolución para no-local: si termina en placeholder → FALLA
    $isPlaceholder = [string]::IsNullOrEmpty($value) -or $value -eq $placeholder -or $value.Contains('CHANGE_ME')

    if ($Env -ne 'local') {
        if ($isPlaceholder -or [string]::IsNullOrEmpty($value)) {
            Write-Host ("  !!! [$key] sin valor real en ambiente no-local '$Env' -> REQUIERE provisión (Secret/env/.env)." -f $key) -ForegroundColor Red
            $exitCode = 1
        }
    } else {
        if ($isPlaceholder) {
            Write-Host ("  ! [$key] placeholder presente en local -> solventa en `.env` para arranque limpio." ) -ForegroundColor Yellow
            if ($exitCode -lt 2) { $exitCode = 2 }
        }
    }
}

Write-Host ('-' * 70)
if ($exitCode -eq 0) {
    Write-Host "VALIDACIÓN: PASS ($Env) — todas las variables resueltas." -ForegroundColor Green
} elseif ($exitCode -eq 2) {
    Write-Host "VALIDACIÓN: AVISO (local) — placeholders presentes; arranque NO recomendado sin .env." -ForegroundColor Yellow
} else {
    Write-Host "VALIDACIÓN: FAIL ($Env) — hay variables en placeholder en ambiente no-local." -ForegroundColor Red
}

exit $exitCode