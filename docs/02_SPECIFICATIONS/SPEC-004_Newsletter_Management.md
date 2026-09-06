# 📖 ESPECIFICACIÓN FUNCIONAL — NEWSLETTER MANAGEMENT (SPEC-004)

**ID:** SPEC-004
**Versión:** 1.0
**Estado:** ✅ APROBADA Y LISTA PARA IMPLEMENTACIÓN
**Prioridad:** 🟡 HIGH
**Relacionado a:** TASK-019, Requisito 6.2 de la definición de producto

---

## 1. OBJETIVO

Permitir al equipo de administración crear, editar, previsualizar y enviar campañas de newsletter a los suscriptores capturados desde el website, mediante una interfaz amigable (WYSIWYG o equivalente moderno) construida con componentes del Design System, sin requerir conocimientos de HTML/CSS por parte del usuario — aunque sí se permite entregar/editar el HTML final para usuarios avanzados.

## 2. ALCANCE

### ✅ Incluye
- Editor de campañas con dos modos intercambiables: **Visual (bloques)** y **HTML** (código fuente editable directamente)
- Bloques de contenido reutilizables basados en el Design System: Encabezado, Texto, Imagen, Botón/CTA, Divisor, Redes Sociales, Footer legal
- Guardado como borrador (`draft`), programación de envío (`scheduled`) y envío inmediato (`sent`)
- Preview responsivo (desktop/mobile) antes de enviar
- Envío de correo de prueba a una dirección propia antes del envío masivo
- Segmentación básica: todos los suscriptores activos, o por tag/fuente de suscripción
- Listado de campañas con estado, fecha, tasa de apertura/click (si el proveedor de envío lo soporta)
- Gestión de suscriptores: ver lista, exportar, dar de baja manualmente (soft delete / unsubscribe)

### ❌ Fuera de Alcance (v1.0)
- Automatizaciones tipo drip campaign / secuencias
- A/B testing de asuntos
- Editor de plantillas reutilizables guardadas por el usuario (se contempla como v1.1)
- Integración con proveedores externos de email marketing (Mailchimp, SendGrid Marketing) — v1.0 usa el mismo proveedor SMTP/transaccional ya configurado en el backend (`SendNewsletterJob`)

## 3. ACTORES Y ROLES

| Rol | Permisos |
|---|---|
| **Admin** | CRUD completo de campañas, envío, gestión de suscriptores |
| **Editor** | CRUD de campañas (crear/editar/programar), no puede enviar sin aprobación de Admin (configurable) |
| **Viewer** | Solo lectura de campañas y estadísticas |

## 4. MODELO DE DATOS

> Nota: `NewsletterSubscriber` y `NewsletterCampaign` ya existen como migraciones en el backend (`2024_01_01_000009` y `2024_01_01_000010`). Este modelo extiende `NewsletterCampaign` con el contenido estructurado necesario para el editor visual.

```typescript
interface NewsletterCampaign {
  id: string;
  subject: string;
  previewText?: string;          // texto de preview que muestran los clientes de correo
  contentBlocks: ContentBlock[]; // representación estructurada (modo Visual)
  htmlContent: string;           // HTML final generado o editado directamente (modo HTML)
  status: 'draft' | 'scheduled' | 'sent' | 'sending' | 'failed';
  segment: 'all' | { tag: string } | { source: string };
  scheduledAt?: Date;
  sentAt?: Date;
  stats?: {
    recipients: number;
    opens: number;
    clicks: number;
    bounces: number;
    unsubscribes: number;
  };
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ContentBlock {
  id: string;
  type: 'header' | 'text' | 'image' | 'button' | 'divider' | 'social' | 'footer';
  props: Record<string, any>; // específico por tipo (texto, src, href, alineación, colores del design system)
}
```

## 5. API CONTRACT (nuevos endpoints sobre el backend existente)

### GET /api/v1/admin/newsletter/campaigns
Listado paginado con filtro por `status`.

### GET /api/v1/admin/newsletter/campaigns/:id
Detalle completo, incluye `contentBlocks` y `htmlContent`.

### POST /api/v1/admin/newsletter/campaigns
Crea campaña en estado `draft`.

### PUT /api/v1/admin/newsletter/campaigns/:id
Actualiza contenido (bloques y/o HTML). Debe mantener sincronizados ambos modos: si se edita HTML directamente, se marca `htmlOverride: true` para no perder los cambios al volver a modo Visual.

### POST /api/v1/admin/newsletter/campaigns/:id/preview
Genera HTML final renderizado desde `contentBlocks` para preview (server-side rendering del template).

### POST /api/v1/admin/newsletter/campaigns/:id/send-test
**Body:** `{ "email": "tester@farutech.com" }` — envía un correo de prueba usando `SendNewsletterJob` en modo single-recipient.

### POST /api/v1/admin/newsletter/campaigns/:id/schedule
**Body:** `{ "scheduledAt": "2026-09-10T14:00:00Z" }`

### POST /api/v1/admin/newsletter/campaigns/:id/send
Envío inmediato masivo (encola `SendNewsletterJob` para todos los destinatarios del segmento).

### GET /api/v1/admin/newsletter/subscribers
Listado paginado + filtros (activo, fuente, tag).

### DELETE /api/v1/admin/newsletter/subscribers/:id
Baja manual (soft delete).

## 6. FRONTEND SPECIFICATION

### Componentes Requeridos

#### NewsletterCampaignsPage
Listado de campañas con estado (badge de color), acciones rápidas (editar, duplicar, eliminar si es `draft`).

#### CampaignEditor
Editor principal con dos pestañas: **Visual** y **HTML**.
- **Modo Visual:** panel lateral de bloques disponibles (drag-and-drop o "agregar bloque" por click) + canvas central con preview en vivo, todo construido con componentes existentes del Design System (`Card`, `Button`, `Select`, etc. reutilizados como building blocks del contenido de correo).
- **Modo HTML:** editor de código (ej. CodeMirror o Monaco embebido) con el HTML completo, con botón "Sincronizar con modo Visual" (best-effort) y advertencia de que la sincronización no siempre es reversible.

#### BlockPalette
Panel de bloques disponibles para arrastrar/insertar (Encabezado, Texto, Imagen, Botón, Divisor, Redes Sociales, Footer).

#### BlockEditorPanel
Panel de propiedades del bloque seleccionado (texto, color, alineación, link del botón, etc.), usando inputs del Design System.

#### PreviewModal
Preview responsivo con toggle Desktop/Mobile, y botón "Enviar prueba".

#### SendTestModal
Input de email + botón enviar, usando el endpoint `send-test`.

#### SubscribersPage
Tabla de suscriptores (reutiliza `DataTable` del Design System), con exportación a CSV y baja manual.

### Estados UI
- **Loading:** Skeleton en editor y listado
- **Saving:** Indicador de "Guardando..." con debounce en autosave del borrador
- **Error de envío:** AlertBanner con detalle y opción de reintentar

## 7. REGLAS DE NEGOCIO

### RB001 — Autosave de Borradores
Toda campaña en estado `draft` se autoguarda cada 30 segundos de inactividad y al cambiar de pestaña Visual/HTML.

### RB002 — Confirmación de Envío Masivo
El envío a más de 50 destinatarios requiere un modal de confirmación explícita mostrando el conteo final de destinatarios del segmento seleccionado.

### RB003 — Registro de Baja (Unsubscribe)
Todo correo enviado debe incluir link de baja funcional; al usarse, el suscriptor pasa a `active: false` y no debe volver a recibir campañas salvo reactivación manual.

### RB004 — Prevención de Envío Duplicado
Una campaña en estado `sent` no puede reenviarse; debe duplicarse como nueva campaña `draft` si se requiere reenviar contenido similar.

## 8. CRITERIOS DE ACEPTACIÓN

- [ ] CA001: El editor Visual permite agregar, reordenar y eliminar bloques
- [ ] CA002: El modo HTML permite editar y guardar el código directamente
- [ ] CA003: El preview responsivo refleja fielmente el HTML final
- [ ] CA004: El envío de prueba llega correctamente a la dirección indicada
- [ ] CA005: El envío masivo respeta el segmento seleccionado
- [ ] CA006: Las estadísticas de apertura/click se muestran si el proveedor las soporta (de lo contrario, se oculta la sección sin romper la UI)
- [ ] CA007: Lighthouse Performance > 90, Accessibility > 95

## 9. DEPENDENCIAS

### Internas
- Design System: `Card`, `Button`, `Select`, `Modal`, `DataTable`, componentes de layout
- `SendNewsletterJob` (backend, ya existe)
- `NewsletterSubscriber`, `NewsletterCampaign` (modelos backend, ya existen — requieren migración adicional para `contentBlocks`/`htmlContent`/`segment`)

### Externas
- Editor de código embebible (CodeMirror o Monaco) — nueva dependencia npm a evaluar en TASK-019
- Redis para colas de envío (ya existe)

## 10. RIESGOS Y MITIGACIÓN

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Sincronización Visual↔HTML pierde datos | Media | Medio | Advertencia explícita al usuario antes de sincronizar; guardar ambas versiones por separado hasta confirmación |
| Renderizado de email inconsistente entre clientes (Outlook, Gmail) | Alta | Medio | Usar tablas HTML + inline CSS en el generador de `contentBlocks → HTML` (estándar de la industria para email) |
| Envío masivo satura el worker | Media | Alto | Rate limiting en `SendNewsletterJob`, envío por lotes |

---

## 11. HISTORIAL DE CAMBIOS

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-09-05 | Creación inicial | Technical Lead |

---

**© 2026 Farutech — SPEC-004 v1.0**
