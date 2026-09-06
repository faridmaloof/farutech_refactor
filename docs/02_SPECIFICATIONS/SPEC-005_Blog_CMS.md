# 📖 ESPECIFICACIÓN FUNCIONAL — BLOG CMS (SPEC-005)

**ID:** SPEC-005
**Versión:** 1.0
**Estado:** ✅ APROBADA Y LISTA PARA IMPLEMENTACIÓN
**Prioridad:** 🟡 HIGH
**Relacionado a:** TASK-020, Requisito 6.3 de la definición de producto

---

## 1. OBJETIVO

Proveer un CMS de blog para el equipo de administración, con una experiencia de edición comparable a WordPress: creación de artículos con editor de bloques/WYSIWYG usando componentes del Design System, gestión completa de SEO por artículo, control de publicación (borrador/programado/publicado), y categorización.

## 2. ALCANCE

### ✅ Incluye
- Editor de artículos con dos modos: **Visual (bloques)** y **HTML**, igual criterio que SPEC-004 para consistencia de UX entre módulos de contenido
- Bloques: Encabezado (H2/H3), Párrafo, Imagen (+ alt text obligatorio para SEO/accesibilidad), Cita, Lista, Código, Embed de video, CTA/Botón
- Gestión de SEO por artículo: meta title, meta description, slug editable, imagen Open Graph, canonical URL, `noindex` toggle, palabras clave objetivo
- Gestión de categorías y tags (`BlogCategory` ya existe en backend)
- Estados: `draft`, `scheduled`, `published`, `archived`
- Publicación programada (ya existe `PublishScheduledBlogPost` job en backend — se conecta a la UI)
- Vista previa antes de publicar (renderizado real como se vería en el website público)
- Listado con filtros (categoría, estado, autor, fecha) y búsqueda
- Autor asignado por artículo (relación con `User`)
- Historial simple de versiones (última edición, quién y cuándo — no versionado completo tipo Git)

### ❌ Fuera de Alcance (v1.0)
- Comentarios de lectores
- Versionado completo con diff entre revisiones
- Editor colaborativo en tiempo real (multi-usuario simultáneo)
- Traducción automática de artículos (el website ya maneja ES/EN vía rutas separadas; en v1.0 cada artículo se crea en un idioma y se duplica manualmente si se requiere la otra versión)

## 3. ACTORES Y ROLES

| Rol | Permisos |
|---|---|
| **Admin** | CRUD completo, publicar/despublicar cualquier artículo |
| **Editor** | CRUD de artículos propios, enviar a revisión; requiere aprobación de Admin para publicar (configurable vía setting) |
| **Viewer** | Solo lectura |

## 4. MODELO DE DATOS

> `BlogPost` y `BlogCategory` ya existen (migraciones `2024_01_01_000007/000008`, con `last_viewed_at` agregado en `2024_01_01_000014`). Este modelo extiende `BlogPost` con los campos de SEO y contenido estructurado.

```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;                    // editable, único, validado contra colisiones
  excerpt: string;
  contentBlocks: ContentBlock[];
  htmlContent: string;
  coverImage?: string;
  categoryId: string;
  tags: string[];
  authorId: string;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  publishedAt?: Date;
  scheduledAt?: Date;

  // SEO
  seo: {
    metaTitle?: string;            // fallback: title
    metaDescription?: string;      // fallback: excerpt
    canonicalUrl?: string;
    ogImage?: string;              // fallback: coverImage
    noIndex: boolean;
    focusKeyword?: string;
  };

  viewCount: number;
  lastViewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## 5. API CONTRACT

### GET /api/v1/admin/blog/posts
Listado paginado con filtros (`status`, `categoryId`, `authorId`, `search`).

### GET /api/v1/admin/blog/posts/:id
Detalle completo, incluye bloques, HTML y bloque SEO.

### POST /api/v1/admin/blog/posts
Crea artículo en `draft`.

### PUT /api/v1/admin/blog/posts/:id
Actualiza contenido y/o SEO.

### POST /api/v1/admin/blog/posts/:id/publish
Publica inmediatamente (dispara evento `BlogPostPublished`, ya existe en backend).

### POST /api/v1/admin/blog/posts/:id/schedule
**Body:** `{ "scheduledAt": "..." }` — conecta con `PublishScheduledBlogPost` job existente.

### POST /api/v1/admin/blog/posts/:id/preview
Devuelve HTML renderizado para preview server-side, fiel al template público.

### GET /api/v1/admin/blog/posts/check-slug?slug=mi-articulo
Valida disponibilidad de slug en tiempo real durante la edición.

### GET /api/v1/admin/blog/categories
CRUD estándar de categorías (ya cubierto por `BlogCategoryController` existente — verificar si expone todos los verbos necesarios para el admin).

## 6. FRONTEND SPECIFICATION

### Componentes Requeridos

#### BlogPostsPage
Listado con filtros, similar estructura a `LeadsPage` (reutilizar patrón de `DataTable` + `Filters` del Design System establecido en SPEC-001).

#### PostEditor
Editor con dos pestañas (Visual/HTML), igual patrón que `CampaignEditor` de SPEC-004 — **se recomienda extraer un componente base compartido `ContentBlockEditor` en el Design System**, consumido tanto por Newsletter como por Blog, para no duplicar la lógica de bloques dos veces (ver nota en sección 9).

#### SeoPanel
Panel lateral/pestaña con todos los campos de SEO. Debe incluir:
- Preview en vivo de cómo se verá en resultados de Google (título + descripción + URL truncados según límites reales de caracteres)
- Preview de cómo se verá el Open Graph al compartir en redes
- Indicador de "salud SEO" básico (título dentro de 50-60 caracteres, descripción dentro de 150-160, slug sin caracteres especiales, imagen OG presente) — checklist visual simple, no un algoritmo de scoring complejo tipo Yoast en v1.0

#### CategoryTagManager
CRUD simple de categorías y tags con componentes existentes del Design System.

#### PublishControls
Panel con estado actual, botones de "Guardar borrador", "Programar", "Publicar ahora", y selector de fecha/hora para programación.

### Estados UI
Mismo patrón que SPEC-001/004 (Loading, Error, Empty, Success), con `EmptyState` específico: "Aún no hay artículos, crea el primero".

## 7. REGLAS DE NEGOCIO

### RB001 — Slug Único y Estable
El slug se genera automáticamente del título al crear, pero es editable. Una vez publicado, cambiar el slug debe advertir sobre el impacto en SEO (pérdida de posicionamiento del URL anterior) y ofrecer generar una redirección 301 (marcar como tarea de infraestructura si no existe mecanismo de redirects aún).

### RB002 — Metadatos SEO con Fallback
Si `metaTitle`/`metaDescription` no se completan manualmente, se usan `title`/`excerpt` como fallback, nunca se deja vacío en el HTML final servido al público.

### RB003 — Imágenes Requieren Alt Text
No se permite publicar (aunque sí guardar borrador) un artículo con imágenes sin `alt` completado — validación bloqueante en el botón "Publicar".

### RB004 — Consistencia con Prerender del Website
Al publicarse un artículo, el pipeline de build/prerender del website (`scripts/prerender.mjs`, ver auditoría previa) debe incluir la nueva ruta del artículo para que el HTML estático generado la contenga desde el primer crawl — **este punto requiere coordinación técnica con el mecanismo de SSG actual, documentada como riesgo abierto en TASK-020**.

## 8. CRITERIOS DE ACEPTACIÓN

- [ ] CA001: Crear, editar, programar y publicar un artículo end-to-end
- [ ] CA002: El panel SEO refleja correctamente el preview de Google y Open Graph
- [ ] CA003: La validación de slug único funciona en tiempo real
- [ ] CA004: Un artículo programado se publica automáticamente a la hora indicada (verificar `PublishScheduledBlogPost`)
- [ ] CA005: El artículo publicado aparece correctamente en el website público con los metadatos SEO configurados
- [ ] CA006: Lighthouse Performance > 90, Accessibility > 95, SEO > 95

## 9. DEPENDENCIAS Y NOTA DE REUTILIZACIÓN

### Internas
- Design System: se recomienda crear `ContentBlockEditor` como componente compartido (usado por Blog y Newsletter, ver SPEC-004) en vez de implementarlo dos veces de forma independiente — **decisión a tomar en TASK-019/TASK-020 antes de empezar cualquiera de los dos**, para no duplicar esfuerzo.
- `BlogPost`, `BlogCategory`, eventos `BlogPostPublished`/`BlogPostViewed`, job `PublishScheduledBlogPost` (todos ya existen en backend)

### Externas
- Editor de código embebible (mismo que SPEC-004)

## 10. RIESGOS Y MITIGACIÓN

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Duplicar lógica de editor de bloques entre Blog y Newsletter | Alta si no se coordina | Medio (deuda técnica) | Extraer `ContentBlockEditor` compartido en Design System antes de implementar ambos módulos |
| Artículos publicados no aparecen en el sitemap/prerender a tiempo | Media | Alto (SEO) | Definir si el prerender pasa a ser dinámico (SSR real) para rutas de blog en vez de estático por build, o disparar rebuild al publicar |
| Slugs duplicados por edición concurrente | Baja | Medio | Validación server-side con constraint único además de la validación en tiempo real del frontend |

---

## 11. HISTORIAL DE CAMBIOS

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-09-05 | Creación inicial | Technical Lead |

---

**© 2026 Farutech — SPEC-005 v1.0**
