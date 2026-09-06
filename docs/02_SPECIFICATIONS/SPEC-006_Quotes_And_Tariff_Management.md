# 📖 ESPECIFICACIÓN FUNCIONAL — QUOTES & TARIFF MANAGEMENT / "MINIPOS" (SPEC-006)

**ID:** SPEC-006
**Versión:** 1.0
**Estado:** ✅ APROBADA Y LISTA PARA IMPLEMENTACIÓN
**Prioridad:** 🔴 CRÍTICO (gap identificado en auditoría — sin esta pieza, el requisito 6.5 no se cumple)
**Relacionado a:** TASK-022, SPEC-001 (Lead Management), Requisito 6.5 de la definición de producto

---

## 1. OBJETIVO

Extender el mini CRM (SPEC-001) con la capacidad de generar, enviar y hacer seguimiento de **cotizaciones** a Leads, respaldadas por un **catálogo de tarifas/servicios controlado** (control tarifario), de modo que el equipo comercial pueda pasar de "lead calificado" a "negocio cotizado" sin salir de la plataforma.

> Hallazgo de auditoría: al momento de este documento, no existe ningún modelo, migración, controller ni mención de cotizaciones o tarifas en ningún punto del código o la documentación previa. Esta spec parte de cero.

## 2. ALCANCE

### ✅ Incluye
- Catálogo de tarifas (`TariffItem`): servicios/paquetes ofrecidos por Farutech, con precio base, unidad (fijo, por hora, mensual/recurrente), moneda y estado (activo/inactivo)
- Historial de versiones de tarifa (control de cuándo cambió un precio, quién lo cambió) — control tarifario auditable
- Generación de cotizaciones (`Quote`) asociadas a un `Lead`, compuestas de una o más líneas tomadas del catálogo de tarifas, con posibilidad de ajuste manual de precio/descuento por línea (con motivo obligatorio si se aplica descuento)
- Envío de la cotización directamente desde la plataforma (email con PDF adjunto y/o link a vista pública de la cotización)
- Estados de cotización con seguimiento: `draft`, `sent`, `viewed`, `accepted`, `rejected`, `expired`
- Vista pública de cotización (link único, sin necesidad de login) donde el cliente puede ver el detalle y marcar aceptación/rechazo
- Panel de seguimiento de negocios: todas las cotizaciones de un Lead, con línea de tiempo de estados
- Numeración consecutiva de cotizaciones (folio único, requerido para trazabilidad comercial)

### ❌ Fuera de Alcance (v1.0)
- Facturación electrónica / integración con DIAN u otro ente fiscal
- Firma electrónica avanzada (se usa un botón de aceptación simple con registro de IP/timestamp, no firma criptográfica)
- Cotizaciones multi-moneda con conversión automática en tiempo real (se define moneda fija por cotización)
- Aprobaciones jerárquicas (ej. descuentos grandes requieren aprobación de un manager) — se documenta como v1.1

## 3. ACTORES Y ROLES

| Rol | Permisos |
|---|---|
| **Admin** | CRUD completo de tarifas y cotizaciones, ve todo el pipeline |
| **Sales Manager** | CRUD de cotizaciones de su equipo, edición de tarifas (sin eliminar histórico) |
| **Sales Rep** | Crea/envía cotizaciones sobre sus propios Leads, no administra el catálogo de tarifas |
| **Viewer** | Solo lectura |

## 4. MODELO DE DATOS

```typescript
interface TariffItem {
  id: string;
  name: string;
  description?: string;
  category: string;              // ej. "Desarrollo", "Consultoría", "Soporte", "SaaS"
  unit: 'fixed' | 'hourly' | 'monthly' | 'yearly';
  basePrice: number;
  currency: string;              // ISO 4217, ej. "COP", "USD"
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TariffItemVersion {   // control tarifario / historial de cambios de precio
  id: string;
  tariffItemId: string;
  previousPrice: number;
  newPrice: number;
  changedBy: string;             // userId
  reason?: string;
  changedAt: Date;
}

interface Quote {
  id: string;
  folio: string;                 // consecutivo único, ej. "COT-2026-0042"
  leadId: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  currency: string;
  lines: QuoteLine[];
  subtotal: number;
  discountTotal: number;
  total: number;
  validUntil: Date;
  notes?: string;
  publicToken: string;           // token único para la vista pública, sin login
  sentAt?: Date;
  viewedAt?: Date;
  respondedAt?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface QuoteLine {
  id: string;
  tariffItemId?: string;         // null si es línea manual/ad-hoc
  description: string;
  quantity: number;
  unitPrice: number;             // puede diferir del basePrice del TariffItem (ajuste manual)
  discountPercent?: number;
  discountReason?: string;       // obligatorio si discountPercent > 0
  lineTotal: number;
}
```

## 5. API CONTRACT

### Catálogo de Tarifas

- `GET /api/v1/admin/tariffs` — listado con filtro por categoría/estado
- `POST /api/v1/admin/tariffs` — crea item
- `PUT /api/v1/admin/tariffs/:id` — actualiza precio (crea automáticamente un `TariffItemVersion` con el precio anterior)
- `GET /api/v1/admin/tariffs/:id/history` — historial de versiones de precio
- `DELETE /api/v1/admin/tariffs/:id` — soft delete (`active: false`, no elimina histórico usado en cotizaciones ya emitidas)

### Cotizaciones

- `GET /api/v1/admin/quotes?leadId=&status=` — listado con filtros
- `GET /api/v1/admin/quotes/:id` — detalle completo
- `POST /api/v1/admin/quotes` — crea cotización en `draft`, asociada a un `leadId`
- `PUT /api/v1/admin/quotes/:id` — edita líneas mientras esté en `draft`
- `POST /api/v1/admin/quotes/:id/send` — envía por email (genera PDF, adjunta y/o incluye link público), pasa a `sent`
- `GET /api/v1/public/quotes/:publicToken` — **endpoint público, sin autenticación**, vista de solo lectura para el cliente; al primer acceso marca `viewedAt` y pasa a `viewed`
- `POST /api/v1/public/quotes/:publicToken/respond` — **Body:** `{ "decision": "accepted" | "rejected", "comment"?: string }` — endpoint público que registra la decisión del cliente
- `GET /api/v1/admin/quotes/:id/pdf` — descarga el PDF generado

## 6. FRONTEND SPECIFICATION

### Componentes Requeridos (Admin)

#### TariffsPage
`DataTable` (Design System) con catálogo de tarifas, filtro por categoría, acción "Ver historial de precio" por fila.

#### TariffFormModal
Alta/edición de un `TariffItem`. Al cambiar el precio, exige (o al menos permite) un campo "motivo del cambio" para alimentar `TariffItemVersion`.

#### QuotesPage
Listado de cotizaciones con filtros por estado y por Lead, badges de estado con color (`draft` gris, `sent` azul, `viewed` amarillo, `accepted` verde, `rejected` rojo, `expired` gris oscuro).

#### QuoteBuilder
Constructor de cotización: selector de líneas desde el catálogo de tarifas (autocompletar), opción de línea manual, cálculo automático de subtotal/descuento/total en vivo, selector de vigencia (`validUntil`).

#### QuoteTimelinePanel
Dentro del detalle de un Lead (extiende el `LeadDetailModal` de SPEC-001 con una pestaña adicional "Cotizaciones"): línea de tiempo de todas las cotizaciones de ese Lead con su estado actual.

#### SendQuoteModal
Confirmación de envío, con preview del PDF/email antes de disparar el envío real.

### Componentes Requeridos (Vista Pública)

#### PublicQuoteView
Página pública (sin layout de admin, sin necesidad de login) accesible vía `publicToken`, mostrando el detalle de la cotización con identidad visual de marca (reutiliza tokens del Design System, no componentes de admin), y botones "Aceptar" / "Rechazar" con confirmación.

## 7. REGLAS DE NEGOCIO

### RB001 — Control Tarifario Auditable
Todo cambio de precio en un `TariffItem` genera obligatoriamente un registro en `TariffItemVersion`. No se permite editar el precio de un item sin dejar rastro.

### RB002 — Inmutabilidad de Cotizaciones Enviadas
Una cotización en estado distinto de `draft` no puede editarse; si se requiere modificar, debe crearse una nueva versión/cotización (relacionada a la misma, para mantener trazabilidad del Lead).

### RB003 — Expiración Automática
Una cotización cuya `validUntil` ya pasó y sigue en `sent`/`viewed` pasa automáticamente a `expired` (job programado diario).

### RB004 — Folio Consecutivo sin Huecos
El folio se genera de forma atómica (transacción DB) para evitar duplicados o saltos bajo concurrencia.

### RB005 — Vista Pública sin Autenticación pero con Token No Adivinable
`publicToken` debe ser un identificador criptográficamente aleatorio (no incremental, no basado en el `id` de la cotización) para evitar enumeración.

### RB006 — Notificación de Respuesta del Cliente
Cuando el cliente acepta o rechaza desde la vista pública, se notifica automáticamente (email y/o WhatsApp si el canal ya está integrado, ver SPEC-001) al `createdBy` de la cotización y al Sales Manager asignado al Lead.

## 8. CRITERIOS DE ACEPTACIÓN

- [ ] CA001: Crear un item de tarifa y ver su reflejo inmediato en el buscador del `QuoteBuilder`
- [ ] CA002: Editar el precio de un item genera una entrada en el historial con el precio anterior
- [ ] CA003: Construir una cotización con líneas del catálogo + una línea manual, con descuento y motivo
- [ ] CA004: Enviar la cotización genera un PDF descargable y un link público funcional
- [ ] CA005: El cliente puede ver la cotización pública sin login y aceptarla/rechazarla
- [ ] CA006: El estado de la cotización se actualiza correctamente en cada paso (draft→sent→viewed→accepted/rejected)
- [ ] CA007: Una cotización vencida cambia automáticamente a `expired`
- [ ] CA008: Lighthouse Performance > 90 tanto en la vista admin como en la vista pública

## 9. DEPENDENCIAS

### Internas
- SPEC-001 (Lead Management) — la cotización cuelga de un `Lead` existente
- Design System: `DataTable`, `Modal`, `Select`, `Button`, tokens de marca para la vista pública
- Generación de PDF en backend (nueva dependencia — evaluar librería PHP, ej. `dompdf` o `snappy`/wkhtmltopdf, en TASK-022)
- Envío de email (ya existe infraestructura de mail del backend)

### Externas
- Ninguna integración de pasarela de pago en v1.0 (fuera de alcance); si se requiere cobro en línea, se documenta como v1.1

## 10. RIESGOS Y MITIGACIÓN

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Generación de PDF con estilos inconsistentes respecto al Design System | Media | Bajo | Usar un template HTML propio para PDF, validado visualmente antes de release |
| Token público filtrado/compartido indebidamente | Baja | Medio | Token no adivinable + posibilidad de invalidar/regenerar token desde admin si se detecta filtración |
| Descuentos aplicados sin control | Media | Alto (negocio) | Motivo obligatorio + reporte de auditoría de descuentos por usuario (consumir `audit_logs` ya existente en PostgreSQL, ADR-004) |

---

## 11. HISTORIAL DE CAMBIOS

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-09-05 | Creación inicial — cubre el gap identificado en auditoría (requisito 6.5) | Technical Lead |

---

**© 2026 Farutech — SPEC-006 v1.0**
