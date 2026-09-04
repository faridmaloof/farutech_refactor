# 27 — TASK-301 FASE 2: PANEL ADMIN (FRONTEND SPA) — EVIDENCIA

**Fecha:** 2026-08-30 · **Repo:** `Farutech/admin` · **main @ `c046faf`** · **Estado: DONE (fases 1+2)**

## WHAT

SPA React 18 + Vite + TypeScript en `Farutech/admin`, consumiendo
`@farutech/design-system` (instalado como `github:Farutech/design-system#main` —
consumidor real del paquete, cumple acceptance criteria de docs/08) y la API
del panel de TASK-301 fase 1.

- **Páginas:** Login, Contacts (lista + marcar leído), Newsletter
  (suscriptores), Blog (CRUD completo con editor modal), Settings (política
  del panel). Layout con navegación y guard de sesión.
- **Cliente API (`src/lib/api.ts`):** bearer token en `Authorization`,
  401 → redirect a `/login`, query params de paginación, 9 endpoints que
  coinciden 1:1 con las rutas del backend (verificado por grep).
- **Config:** `VITE_API_URL` (default `http://localhost:8000`), `.env.example`
  con placeholders, `vitest.config.ts` dedicado (entorno jsdom + stub
  localStorage para los tests del cliente API).

## WHY

REQ-FE-01 parte 2: el panel no puede vivir dentro de `website` (separado en
TASK-104) y debe consumir el design system para que un cambio de diseño se
aplique en un solo lugar.

## VALIDACIÓN (evidencia real, no declaraciones)

| Verificación | Resultado |
|---|---|
| `tsc --noEmit` | EXIT 0, sin errores |
| `vite build` | ✓ 801ms, bundle 184kB (59kB gzip) |
| `vitest run` | **5/5 PASS** (`api.test.ts`: token, 401, headers, query params) |
| Sweep credenciales | 0 coincidencias (`admin@123456` etc.) en src/ y .env.example |
| **E2E por contrato** (backend real en docker, 9/9) | login→token OK · sin token→401 · GET contacts/newsletter/blog/settings→200×4 · POST blog→201 · PUT→200 · DELETE→200 · PATCH mark-read→200 con `read_at` poblado |

**Correcciones aplicadas durante la validación** (el E2E encontró problemas
reales y se corrigieron antes de DONE):
1. El primer intento de E2E reportó 404 en `/admin/newsletter` — era **falso
   positivo del E2E** (URL mal escrita por mí); el frontend ya llamaba a la
   ruta correcta `/admin/newsletter/subscribers`. Verificado por grep.
2. 422 al crear contacto de prueba: el payload correcto requiere
   `service_interest` y `privacy_accepted` (no `privacy`) — corregido el
   script de prueba, la API quedó validada con su contrato real.

**Limitación honesta:** el E2E visual en navegador (Playwright) no pudo
ejecutarse — el servidor MCP del navegador no estaba disponible en la sesión.
La validación se hizo por contrato HTTP exacto de las llamadas que hace la SPA
(mismos endpoints/métodos/headers que `api.ts`), más build+typecheck+unit
tests. El smoke visual queda como pendiente menor para cuando haya sesión con
navegador disponible.

## ROLLBACK

`main` previo (`50d7a8b` bootstrap) accesible en historial; rama
`task/301-admin-panel` en remoto. El panel es aditivo — no toca website ni
backend.

## REGRESSION

- Backend: PHPUnit **20/20 OK, 93 assertions** tras los cambios.
- Sin cambios en otros repos.

## EVIDENCE

- Commits: `feat: admin panel SPA (TASK-301 fase 2)` @ `c046faf` en
  `Farutech/admin` (main, pushed, verificado).
- Nota de integración: el push inicial fue rechazado porque el remoto tenía
  los commits de CODEOWNERS; integrado con `git fetch` + `rebase` (sin
  force push).
