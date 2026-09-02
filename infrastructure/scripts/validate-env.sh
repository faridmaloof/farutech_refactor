#!/usr/bin/env bash
# ==============================================================================
# validate-env.sh — Valida la jerarquía Secret → `.env` → default (TASK-002)
#
# Uso:
#   ./scripts/validate-env.sh local
#   ./scripts/validate-env.sh dev|qa|staging|prod
#
# Comportamiento: mismo que validate-env.ps1 (ver comentarios ahí).
#   - Prioridad 1: variables de entorno ya definidas (simula Secrets/K3s Secret)
#   - Prioridad 2: `.env` del directorio infrastructure/
#   - Prioridad 3: default de docker-compose.yml (placeholder CHANGE_ME_OR_SET_SECRET)
#   - No-local con placeholder -> FAIL (exit 1)
#   - Local con placeholder    -> AVISO (exit 2), OK sin placeholders (exit 0)
# ==============================================================================
set -u

ENV="${1:-local}"
PLACEHOLDER="CHANGE_ME_OR_SET_SECRET"
EXIT=0

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$BASE_DIR/.env"

declare -a SECRETS=(
  MYSQL_ROOT_PASSWORD MYSQL_DATABASE MYSQL_USER MYSQL_PASSWORD
  POSTGRES_DB POSTGRES_USER POSTGRES_PASSWORD
  MONGO_INITDB_ROOT_USERNAME MONGO_INITDB_ROOT_PASSWORD
  PGADMIN_DEFAULT_EMAIL PGADMIN_DEFAULT_PASSWORD
  MONGO_EXPRESS_USER MONGO_EXPRESS_PASSWORD
)

# Claves que YA existen en el entorno del proceso antes de cargar .env
# (simulan Secrets manager / export). Se usan para distinguir ORIGEN=env vs .env.
declare -A IN_ENV=()
while IFS='=' read -r k _; do IN_ENV["$k"]=1; done < <(env)

# Cargar .env (prioridad menor que el entorno real)
if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$ENV_FILE"
fi

echo "== validate-env  (ambiente: $ENV) =="
printf '%-32s %-10s %s\n' VARIABLE ORIGEN VALOR
printf '%s\n' '----------------------------------------------------------------------'

for key in "${SECRETS[@]}"; do
  origin=default
  value="$PLACEHOLDER"

  if [[ -n "${!key:-}" ]]; then                       # hay valor en algún lado
    value="${!key}"
    if [[ -n "${IN_ENV[$key]:-}" ]]; then
      origin=env                                      # prioridad 1: Secret/entorno
    else
      origin=.env                                     # prioridad 2: archivo .env
    fi
  else
    origin=default                                          # prioridad 3: placeholder
  fi

  display="$value"
  case "$key" in
    *PASSWORD*|*SECRET*) [[ "$value" != "$PLACEHOLDER" && -n "$value" ]] && display='********';;
  esac

  printf '%-32s %-10s %s\n' "$key" "$origin" "$display"

  is_placeholder=0
  [[ -z "$value" || "$value" == "$PLACEHOLDER" || "$value" == *CHANGE_ME* ]] && is_placeholder=1

  if [[ "$ENV" != "local" ]]; then
    if [[ $is_placeholder -eq 1 ]]; then
      echo "  !!! [$key] sin valor real en ambiente no-local '$ENV' -> REQUIERE provisión (Secret/env/.env)."
      EXIT=1
    fi
  else
    if [[ $is_placeholder -eq 1 && $EXIT -lt 2 ]]; then
      echo "  ! [$key] placeholder presente en local -> solventa en .env para arranque limpio."
      EXIT=2
    fi
  fi
done

printf '%s\n' '----------------------------------------------------------------------'
case $EXIT in
  0) echo "VALIDACIÓN: PASS ($ENV) — todas las variables resueltas." ;;
  2) echo "VALIDACIÓN: AVISO (local) — placeholders presentes; arranque NO recomendado sin .env." ;;
  *) echo "VALIDACIÓN: FAIL ($ENV) — hay variables en placeholder en ambiente no-local." ;;
esac
exit $EXIT