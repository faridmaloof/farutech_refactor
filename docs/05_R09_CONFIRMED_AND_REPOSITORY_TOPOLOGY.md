# 05 — CONFIRMACIÓN R-09 + REPOSITORY TOPOLOGY ANALYSIS + TARGET ARCHITECTURE (v1)

---

## 1. CONFIRMACIÓN DIRECTA DE R-09 (ya no es "auto-reportado en doc", es evidencia de código)

`apps/backend/database/seeders/AdminUserSeeder.php` (leído completo):

```text
admin@farutech.com   / Admin@123456   (role: admin)
editor@farutech.com  / Editor@123456  (role: editor)
viewer@farutech.com  / Viewer@123456  (role: viewer)
```

**Precisión importante:** las contraseñas sí se guardan hasheadas (`Hash::make(...)`, bcrypt) — no están en texto plano en la base de datos. Pero **eso no mitiga el riesgo real**: el valor en texto plano está en el código fuente versionado en Git, así que cualquiera con acceso al repositorio (hoy: cualquiera con acceso a `github.com/faridmaloof/website-farutech`) conoce directamente la contraseña real de un usuario `admin` con acceso completo, sin necesidad de romper ningún hash.

**R-09 queda:** `CRITICAL — CONFIRMADO EN CÓDIGO`. Remediación (a especificar formalmente en Fase de Specification, no ahora): generar estas contraseñas al momento del seed (ej. igual que ya se diseñó conceptualmente en `DEPLOY-PI-K3S.md` para las credenciales de MySQL — generar y mostrar una sola vez, nunca hardcodear).

---

## 2. REPOSITORY TOPOLOGY ANALYSIS

### 2.1 Inventario real de repos existentes (recordatorio del doc 01)

| Repo actual | Remote real | Contenido real |
|---|---|---|
| `website-farutech` | `faridmaloof/website-farutech` | Monorepo: `apps/frontend` (sitio público + admin embebido) + `apps/backend` (API) + `deployment/docker/` + `docs/` |
| `dashboard` | `faridmaloof/dashboard` | App standalone, admin genérico, no conectado al backend real — fuente de extracción para el Design System (doc 02/03) |
| `framework-automation` | `faridmaloof/framework-automation` | Framework .NET de automatización, alcance confirmado: E2E+API+Performance+Integración |

### 2.2 Candidatos nuevos derivados de las decisiones ya tomadas (docs 02-04)

```text
apps/website  (antes: apps/frontend, sin el admin embebido)  → website.farutech.com
apps/admin                                                    → admin.farutech.com
apps/intranet (alcance TBD, diferido)                         → intranet.farutech.com
apps/backend  (vuelve a Lumen)                                → api.farutech.com
packages/design-system (o repo propio — se decide en 2.4)     → paquete público
tests/framework-automation (ya existe, se mantiene)           → plantilla dotnet new (pendiente)
infrastructure (K3s multi-nodo + paridad VPS — pendiente)     → sin cambio de ubicación
```

### 2.3 Análisis por repo/app — decisión KEEP / RENAME / CREATE / SPLIT / MERGE / REMOVE

| Elemento | Evidencia | Decisión | Razón |
|---|---|---|---|
| `apps/frontend` actual (sitio público + admin embebido) | Doc 01/04: contiene `AdminDashboardPage`, `AdminLeadsPage`, etc. mezclados con páginas públicas | **SPLIT** | El admin embebido queda descontinuado (doc 03 §5); lo que sobrevive de este código es solo la parte pública → se convierte en `apps/website`, sin las páginas admin |
| `projects/dashboard` (app completa) | Doc 02: fuente de extracción, no destino final; demo-auth crítico (F-02) | **REMOVE (como app desplegable)**, pero **no se borra el repo todavía** — se usa como fuente de lectura mientras se extraen sus componentes al Design System. Se marca formalmente `DEPRECATED — SOURCE ONLY` hasta que la extracción termine | Confirmado explícitamente por el owner: "la finalidad sería quitarlo, pero antes hay que construir el design system" |
| `apps/backend` | Confirmado: vuelve a Lumen (doc 03 §1) | **KEEP**, con cambio de framework interno (Laravel→Lumen) ya especificado | — |
| Design System | Doc 02 §2, doc 04 Parte B | **CREATE** | No existe todavía como paquete independiente; hoy está disperso en 3 fuentes (dashboard, apps/frontend, admin embebido) |
| `apps/admin` (nuevo) | Doc 02 §7, doc 03 §5 | **CREATE** | No existe — ni el admin embebido de `apps/frontend` ni `dashboard` sirven tal cual como destino final, ambos quedan como fuente de componentes/pantallas, no como el producto |
| `apps/intranet` (nuevo) | Doc 03 §4 | **CREATE — DIFERIDO** | Alcance funcional aún no definido por el owner; no bloquea crear el resto |
| `framework-automation` | Doc 01/03 | **KEEP**, con trabajo pendiente confirmado (plantilla `dotnet new`, capa API) | Repo ya sano, historial coherente, sin conflictos de git |

### 2.4 ¿Monorepo (`apps/*` dentro de `website-farutech`) o repos independientes por app?

Esta es la decisión de topología más importante que falta y **requiere tu confirmación explícita** — el prompt maestro (sección 10) exige poder clonar/compilar/desplegar cada proyecto sin bajar todo el ecosistema, así que no se puede decidir "por comodidad", se decide con criterios:

| Criterio | A favor de monorepo (`website-farutech/apps/website`, `apps/admin`, `apps/intranet`) | A favor de repos separados (`farutech-website`, `farutech-admin`, `farutech-intranet`) |
|---|---|---|
| Ya existe evidencia real | El repo actual ya reorganizó a `apps/` como monorepo intencionalmente (mensaje de commit: "reorganizar proyecto en monorepo apps/ + docker") — es una decisión ya tomada antes, no hipotética | — |
| Independencia de despliegue (sección 10 del prompt maestro) | Cada app igual se despliega por separado en K3s (pods/imágenes independientes) — el monorepo no rompe esto, solo afecta el código fuente, no el runtime | Repos separados hacen la independencia más explícita/forzada, evita que un cambio en `admin` dispare CI de `website` por accidente |
| Acceso a terceros no-dev (doc 02 §8, tu visión de asignar el blog/WYSIWYG a diseño/producto) | Más difícil dar acceso granular (alguien de diseño no debería necesitar ver el código del backend) | Repos separados permiten dar acceso solo al repo que corresponde — más alineado con "asignar a terceros que no tengan conocimiento de desarrollo" |
| Overhead de mantenimiento (sección 75, NO OVERENGINEERING) | Un solo repo, un solo `git clone`, más simple para un equipo pequeño | Más repos = más CI/CD que mantener, más versionado cruzado a coordinar (aunque el Design System ya resuelve la reutilización de UI) |
| Coherencia con `intranet` diferido | Se puede agregar `apps/intranet` después sin crear un repo nuevo | Si más adelante intranet termina siendo un producto muy distinto (con su propio equipo), separarlo desde ya evita una migración posterior |

**No tomo esta decisión por ti** porque depende de un dato que no tengo: tamaño del equipo real y si terceros sin conocimiento técnico necesitarán acceso a nivel de repositorio Git (no solo a una interfaz de admin) — si el WYSIWYG del doc 02 §8 termina siendo suficiente para que diseño/producto trabaje sin tocar Git directamente, el argumento fuerte a favor de repos separados desaparece.

**Recomendación con la evidencia disponible:** mantener monorepo (`apps/website`, `apps/admin`, `apps/intranet` dentro de `website-farutech`) por ahora, consistente con la decisión de reorganización ya tomada previamente en el propio proyecto, y **revisar esta decisión más adelante** si el acceso de terceros termina requiriendo separación real a nivel de Git. Esto es reversible con relativamente bajo costo (un `git filter-repo` para separar una carpeta en su propio repo más adelante); lo que sí es más costoso es diseñar el Design System asumiendo un monorepo cuando en realidad se necesitan repos separados — por eso el Design System sí se decide ahora como pieza independiente (2.5).

### 2.5 Design System — ¿`packages/design-system` en el monorepo, o repo propio?

A diferencia de 2.4, aquí **sí hay evidencia suficiente para decidir sin ambigüedad**: el propio owner confirmó que debe:
- publicarse como paquete público en GitHub Packages,
- ser consumido por múltiples apps con lifecycle propio,
- poder ser "encargado a un equipo" para mejoras — es decir, tener dueño y ciclo de release independientes de cualquier app que lo consuma.

Esto coincide exactamente con los criterios del prompt maestro (sección 13) para que algo SÍ deba ser un paquete independiente: reusabilidad, API estable, múltiples consumidores, versionado independiente, ownership propio. Todos se cumplen.

**Decisión: repo propio, `Farutech/design-system` (o `faridmaloof/design-system`, ver nota de organización más abajo), no una carpeta dentro de `website-farutech`.** Razón adicional: si `apps/website/admin/intranet` terminan siendo monorepo, meter el Design System ahí también generaría exactamente el problema que quieres evitar — que cambiar el Design System dispare builds/CI de todo lo demás junto, y viceversa.

### 2.6 Nota pendiente: la organización `Farutech` en GitHub no existe (recordatorio del doc 01)

Todos los nombres de arriba (`Farutech/design-system`, etc.) siguen siendo **candidatos**, no confirmados, porque —como se documentó en el doc 01— los 3 repos reales viven bajo la cuenta personal `faridmaloof`, no bajo una organización `Farutech`. Antes de crear el repo del Design System hay que decidir: ¿se crea ya bajo una organización `Farutech` nueva (recomendable si la intención es "encargarlo a un equipo" — una organización permite gestionar permisos por equipo de forma mucho más limpia que una cuenta personal), o se mantiene todo bajo `faridmaloof` por ahora? **Esto no se decide en este documento**, queda como pregunta abierta para ti.

---

## 3. GAPS Y RIESGOS ACTUALIZADOS

```text
GAPS nuevos de este documento:
- ¿Monorepo apps/* o repos separados? (sección 2.4) — depende de tamaño de
  equipo y necesidad real de acceso Git granular para terceros no-dev
- ¿Se crea la organización GitHub "Farutech" ahora, o se mantiene todo bajo
  la cuenta personal faridmaloof? (sección 2.6)

RIESGOS:
- R-09 pasa de "pendiente de confirmar" a "CONFIRMADO EN CÓDIGO" (sección 1)
```

---

## 4. NEXT ACTION

```text
1. Necesito tu decisión en las 2 preguntas abiertas de este documento
   (2.4 y 2.6) para poder cerrar formalmente el Repository Topology Analysis.
2. Mientras tanto, puedo seguir avanzando SIN que esas 2 respuestas bloqueen:
   - Redactar el Master Requirements (REQ-ID formal) consolidando todo lo
     acumulado en los docs 01-05 (Contact, Newsletter+campañas, Auth,
     Design System, Deployment multi-nodo, etc.)
   - Empezar la Specification detallada del Design System (tokens, API de
     componentes, estrategia de temas dinámicos que pediste en el doc 02 §2)
     ya que esa pieza es independiente de la decisión mono/multi-repo.

¿Prefieres que continúe con el Master Requirements + Specification del
Design System mientras decides 2.4/2.6, o resuelves primero esas 2 preguntas?
```
