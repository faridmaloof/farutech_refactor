# 06 — TOPOLOGÍA FINAL DE REPOSITORIOS (multi-repo, privados, org Farutech) + REVISIÓN DE IMPACTO

---

## 1. VERIFICACIÓN REAL DE LA ORGANIZACIÓN (no solo tomada de tu palabra)

Se consultó `api.github.com/orgs/farutech` directamente (acceso público, sin autenticación):

```text
login: Farutech
id: 301939457
created_at: 2026-07-10T01:45:44Z
public_repos: 8
```

**VERIFIED FACT:** la organización existe, fue creada el 2026-07-10.

**GAP importante y no menor:** la organización **ya tiene 8 repositorios públicos**. No se pudo obtener el listado de nombres — el entorno sandbox donde corro sigue con el rate-limit de GitHub agotado (IP compartida, no autenticada) incluso después de esperar. Esto es justo lo que mencionas querer resolver ("eliminar esto de los públicos que se muestran"), así que **antes de crear nada nuevo hay que inventariar esos 8 repos reales** — podrían ser pruebas viejas, forks accidentales, o restos de otra sesión de trabajo. Recomendación práctica: la próxima vez que uses Claude Code (con `gh` autenticado en tu máquina) o entres tú mismo a `github.com/orgs/Farutech/repositories`, cópiame o pídeme leer esa lista para poder cerrar este GAP con evidencia real, en vez de asumir qué son.

---

## 2. TOPOLOGÍA FINAL DE REPOSITORIOS (confirmada, actualiza y cierra las 2 preguntas abiertas del doc 05)

Con tu confirmación ("cada solución va a ser responsabilidad de un equipo... no es necesario descargar toda la aplicación solo para modificar un texto en el sitio web"), la sección 2.4 del doc 05 queda **cerrada a favor de repos independientes**, no monorepo. Justificación con criterio, no solo preferencia: el criterio decisivo que faltaba en el doc 05 era "necesidad real de acceso Git granular por equipo/responsabilidad" — ya lo confirmaste explícitamente, así que el argumento de monorepo (que dependía de asumir equipo pequeño y acceso compartido) deja de aplicar.

### Repositorios finales (todos privados, bajo `github.com/Farutech`):

| Repositorio | Contenido | Origen |
|---|---|---|
| `Farutech/website` | Frontend público (`website.farutech.com`) — sin el admin embebido | Split de `apps/frontend` actual (queda solo la parte pública) |
| `Farutech/admin` | Panel admin (`admin.farutech.com`) — construido desde cero apoyado en el Design System, absorbiendo pantallas útiles de `dashboard` y del admin embebido actual | Nuevo, con componentes/pantallas extraídas de 2 fuentes (doc 03 §5, doc 04 Parte B) |
| `Farutech/intranet` | Intranet (`intranet.farutech.com`) — alcance funcional aún diferido (doc 03 §4) | Nuevo, se crea cuando el alcance esté definido; no bloquea el resto |
| `Farutech/backend` (o `Farutech/api`, a definir nombre exacto) | API Lumen (`api.farutech.com`) | Extracción de `apps/backend` actual (con el cambio Laravel→Lumen ya especificado en doc 03 §1) |
| `Farutech/design-system` | Paquete publicable (GitHub Packages **público**, aunque el repo fuente sea privado — nota en sección 4) | Nuevo, extrae de `dashboard` + `apps/frontend` (doc 04 Parte B) |
| `Farutech/infrastructure` | Manifiestos K3s (multi-nodo Dev + paridad VPS), scripts de despliegue (basados en el patrón `00-30` ya diseñado en `DEPLOY-PI-K3S.md`, doc 04 Parte A) | Nuevo, consolidando lo disperso hoy entre `infrastructure/` (workspace) y `deployment/docker/` (dentro de `apps/web`) |
| `Farutech/framework-automation` | Framework .NET de pruebas (E2E/API/Performance/Integración) | Ya existe como repo independiente bajo `faridmaloof` — **se transfiere** a la org (no se recrea) |
| `Farutech/dashboard` | **Se retira, no se migra como app.** Ver sección 3.3 | — |

**Nota sobre nombres:** dejé nombres de trabajo (`website`, `admin`, `intranet`, `backend`, `design-system`, `infrastructure`, `framework-automation`). Si quieres otra convención (ej. prefijo `farutech-` en cada uno, o `web-` / `svc-` por tipo), lo ajusto — no es una decisión que cambie nada estructural, solo lo dejo explícito para que lo confirmes o lo cambies.

---

## 3. PLAN DE MIGRACIÓN (ESPECIFICADO, NO EJECUTADO — el prompt maestro prohíbe crear/mover/eliminar repos sin pasar antes por Specification+Plan formal, sección 68)

### 3.1 `website-farutech` (personal, monorepo) → se divide en `Farutech/website` + `Farutech/backend`

No es un simple "mover archivos" si quieres conservar el historial de commits real (recomendado — hay contexto valioso ahí, como descubrimos en los docs 01/04 leyendo el propio `git log`). La forma correcta es:

```text
1. git filter-repo (o git subtree split) sobre apps/frontend  → nuevo repo Farutech/website
2. git filter-repo (o git subtree split) sobre apps/backend    → nuevo repo Farutech/backend
   (aplicando en el mismo paso el cambio de framework Laravel→Lumen ya especificado)
3. Verificar que cada historial resultante solo contiene commits relevantes a esa carpeta
4. Crear los repos en github.com/Farutech como PRIVADOS desde el inicio
5. Push del historial filtrado a cada repo nuevo
6. Solo después de confirmar que los repos nuevos están completos y funcionando:
   retirar visibilidad del repo viejo (archivar `faridmaloof/website-farutech`,
   no borrarlo de inmediato — archivar preserva el historial por si hace falta
   consultarlo después, sin que siga apareciendo como repo activo/público)
```

### 3.2 `framework-automation` (personal) → `Farutech/framework-automation`

Este caso es más simple: no hay que dividir nada (ya es un repo dedicado y sano, doc 01 sección 4.3). Es una **transferencia de ownership** directa vía la función nativa de GitHub ("Transfer repository"), cambiando de paso la visibilidad a privado. Se conserva 100% del historial sin ninguna manipulación adicional.

### 3.3 `dashboard` (personal) → NO se migra como app

Consistente con lo ya decidido (doc 02 §2, doc 05 §2.3): no se transfiere como aplicación desplegable. Se mantiene accesible **solo como fuente de lectura** mientras dura la extracción de componentes hacia `Farutech/design-system` (亦 doc 04 Parte B, ya se hizo el inventario completo). Una vez extraído todo lo útil, este repo personal se archiva igual que el anterior. No hace falta transferirlo a la org porque no tendrá vida propia del otro lado.

### 3.4 Repos completamente nuevos (sin origen a migrar)

`Farutech/admin`, `Farutech/intranet`, `Farutech/design-system`, `Farutech/infrastructure` se crean directamente vacíos en la org, privados desde el día uno — no hay repo previo que transferir.

---

## 4. IMPLICACIÓN TÉCNICA IMPORTANTE — Design System público, pero el repo fuente es privado

Pediste explícitamente (doc 02 §2) que el paquete se publique **público en GitHub Packages, sin exigir credenciales**. Esto es compatible con que el repositorio fuente sea privado (como pides ahora para todo) — GitHub Packages permite publicar un paquete con visibilidad pública de forma independiente de la visibilidad del repo que lo contiene. No hay contradicción, solo hay que configurarlo explícitamente así al publicar (no es el comportamiento por defecto, que hereda la visibilidad del repo) — se deja especificado aquí para no perderlo en la fase de implementación real del Design System.

---

## 5. REVISIÓN DE IMPACTO SOBRE LOS DOCUMENTOS 01-05 (pediste explícitamente que revisara esto)

| Doc | ¿Impacta? | Detalle |
|---|---|---|
| 01 (Audit) | No cambia lo verificado, solo su interpretación | La sección "GITHUB" del doc 01 decía que no había organización `Farutech` real — **eso ya cambió**, ahora existe y está verificada (sección 1 de este documento). El resto de hallazgos de código (F-01 a F-08, R-01 a R-09) siguen vigentes sin cambios |
| 02 | Sin cambios | Las decisiones de Design System, infra/secrets, K3s 3-ambientes, frontend 3-apps siguen igual |
| 03 | Sin cambios | Backend=Lumen, Scalar, Newsletter-campañas, Intranet diferido — nada de esto depende de dónde viven los repos |
| 04 | **Impacta el diseño de CI/CD** | Los 3 documentos de despliegue auditados (`CI-CD-K3S-PI.md`, `DEPLOY-PI-K3S.md`) asumían un **Gitea local** corriendo en la Pi como servidor Git, precisamente porque en ese momento no había una organización real en GitHub donde alojar el código. **Ahora que sí existe `github.com/Farutech`**, vale la pena replantear en la fase de Specification si conviene seguir necesitando Gitea local, o si es mejor usar **GitHub Actions con un runner self-hosted en la Raspberry Pi** (misma idea de "build nativo ARM en la Pi" que ya tenían, pero disparado desde GitHub directamente en vez de necesitar un servidor Git paralelo). No lo decido aquí — es una re-evaluación pendiente, se registra como GAP nuevo |
| 05 | **Se cierra formalmente** | Las 2 preguntas abiertas del doc 05 (2.4 monorepo/multi-repo, 2.6 organización) quedan **ambas resueltas** en este documento: multi-repo confirmado, organización confirmada y verificada |

---

## 6. GAPS NUEVOS

```text
- Inventariar los 8 repos públicos que YA existen en github.com/Farutech
  (no se pudo listar por rate-limit del sandbox — pendiente de que tú los
  compartas o los revise Claude Code con gh autenticado)
- Re-evaluar si Gitea local sigue siendo necesario para CI/CD ahora que hay
  organización real en GitHub, o si GitHub Actions + runner self-hosted en
  la Pi es más simple (menos piezas que mantener, alineado con "lo más
  dummy posible")
- Confirmar convención de nombres final de los repos (sección 2, nota al pie)
```

---

## 7. NEXT ACTION

```text
Con la topología de repos ya cerrada, y sin que el GAP de los 8 repos
públicos bloquee seguir (es investigación adicional, no una decisión
pendiente), continúo con lo que ya habías aprobado seguir:

  07: MASTER REQUIREMENTS — consolidando todo lo acumulado en 01-06
      (Contact, Newsletter+campañas, Auth/Lumen, Design System, Deployment
      multi-nodo + repos independientes, etc.) con REQ-ID formal.

  08: SPECIFICATION del Design System (tokens, API de componentes, temas
      dinámicos) — es la pieza de mayor apalancamiento porque de ella
      dependen admin, intranet y el website.

Sigo con ambos ahora.
```
