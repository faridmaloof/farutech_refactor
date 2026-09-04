# 📋 Plan de Desarrollo - FaruTech Platform v2.0  
**Documento oficial de alcance, validación y seguimiento**

---

## 📌 Contexto y Propósito

Este documento define el **backlog completo y actualizado** para la plataforma FaruTech, reflejando la arquitectura híbrida (React + PHP/MySQL), la estrategia de contenido en inglés, el SEO avanzado y la generación de leads mediante API.

El proyecto ha evolucionado desde un sitio estático informativo a una **plataforma de conversión profesional**, con:
- **Frontend**: React + TypeScript + Vite + Tailwind v4 (SPA estática).
- **Backend**: API RESTful en PHP (SOLID) + MySQL para leads y suscriptores.
- **SEO**: Meta dinámicos, Schema.org JSON-LD, sitemap y redirecciones 301.
- **Contenido**: 5 servicios especializados, casos de éxito integrados, páginas únicas.

**Uso de este documento**:
- Sirve como **guía de implementación** y **lista de verificación** para cada épica.
- Cada historia y tarea incluye un **indicador de estado** `[ ]` para marcar como completado.
- Al final, se incluye un **prompt de ejemplo** para solicitar la implementación de una épica específica.

---

## 🧩 Épica E1: Arquitectura y Fundamento Técnico

**Descripción**: Establecer la base del proyecto con Vite, React 18, TypeScript, Tailwind v4, i18n, prerender y build optimizado.

**Alcance**:
- Configuración de Vite + React 18 + TypeScript con tipado estricto.
- Sistema de diseño con Tailwind v4 y tokens OKLCH.
- Internacionalización ES/EN con redirección inteligente.
- Prerender estático (SSG) para todas las rutas.
- Code splitting y optimización de bundle (<500KB total, <150KB gzip).
- Eliminación de advertencias de build (chunkSizeWarningLimit).

**Criterios de Aceptación de la Épica**:
- ✅ `npm run build` se completa sin errores ni warnings críticos.
- ✅ `npm run typecheck` no muestra errores de tipos.
- ✅ El bundle de producción (JS gzip) es <150KB; CSS gzip <10KB.
- ✅ Las rutas legacy (`/capacidades/*`, `/trabajo`, `/studio`) redirigen 301 a las nuevas rutas en inglés.
- ✅ `npm audit` reporta 0 vulnerabilidades.

### HU1.1: Configuración del Proyecto con Vite + React + TypeScript
**Estado**: [ ]  
**Tareas**:
- Inicializar proyecto con `npm create vite@latest` (React + TypeScript).
- Configurar `tsconfig.json` con `strict: true`, `noUnusedLocals`, `noUnusedParameters`.
- Instalar ESLint y configurar reglas recomendadas.
- Agregar scripts: `dev`, `build`, `preview`, `typecheck`, `build:seo`.
**Criterios de Aceptación**:
- ✅ `npm run dev` levanta servidor en `localhost:5173`.
- ✅ `npm run typecheck` pasa sin errores.
- ✅ Estructura de directorios `src/` y `public/` creada.

### HU1.2: Sistema de Diseño con Tailwind CSS v4 y Tokens OKLCH
**Estado**: [ ]  
**Tareas**:
- Instalar `tailwindcss`, `@tailwindcss/vite` y configurar en `vite.config.ts`.
- Crear `src/styles.css` con `@import "tailwindcss"` y `@theme inline` para tokens.
- Definir colores de marca (primary, accent, spark, surface) en espacio OKLCH.
- Crear utilidades: `text-gradient`, `bg-mesh`, `bg-glow`, `noise`, `border-gradient`.
- Cargar fuentes Geist y Geist Mono desde Google Fonts con `preconnect`.
**Criterios de Aceptación**:
- ✅ Clases de Tailwind funcionan en componentes.
- ✅ Utilidad `text-gradient` aplica degradado.
- ✅ Archivo `styles.css` <200 líneas.
- ✅ Fuentes Geist se cargan correctamente.

### HU1.3: Internacionalización y Enrutamiento Bilingüe
**Estado**: [ ]  
**Tareas**:
- Definir tipo `L = { es: string; en: string }` en `src/i18n/index.tsx`.
- Implementar `I18nProvider` con contexto y persistencia en `localStorage`.
- Crear hook `useT()` que resuelve textos según idioma.
- Implementar `LanguageSwitcher` con botones ES/EN.
- Asegurar que las URLs en inglés sean la versión canónica (ej: `/services/software-development` vs `/es/servicios/...`).
**Criterios de Aceptación**:
- ✅ Cambio de idioma actualiza todos los textos sin recarga.
- ✅ Preferencia persiste en localStorage.
- ✅ Atributo `lang` en HTML se actualiza.
- ✅ Las URLs en español redirigen 301 a la versión en inglés.

### HU1.4: Prerender Estático para SEO (SSG)
**Estado**: [ ]  
**Tareas**:
- Crear `src/entry-server.tsx` con `renderToString` y `StaticRouter`.
- Escribir `scripts/prerender.mjs` que recorra `routeMeta` y genere HTML por ruta.
- Inyectar contenido renderizado en `<div id="root">` y reemplazar meta tags.
- Agregar comando `build:seo` en `package.json`.
**Criterios de Aceptación**:
- ✅ `npm run build:seo` genera `dist/` con HTML estático para cada ruta.
- ✅ Cada archivo contiene el contenido completo y meta tags específicos.
- ✅ El prerender maneja redirecciones 301 en el HTML (via meta refresh o server config).

### HU1.5: Build Optimizado y Code Splitting
**Estado**: [ ]  
**Tareas**:
- Configurar `vite build` con `chunkSizeWarningLimit: 600` (para enterprise).
- Implementar lazy loading en rutas de servicios (`React.lazy`).
- Usar `rollup-plugin-visualizer` para analizar tamaño.
- Eliminar dependencias no utilizadas.
**Criterios de Aceptación**:
- ✅ Build genera múltiples chunks.
- ✅ JS gzip <150KB; CSS gzip <10KB.
- ✅ No hay warnings de chunk size.
- ✅ Página de inicio carga con <50KB gzip inicial.

---

## 🧩 Épica E2: Sistema de Contenidos y Servicios

**Descripción**: Centralizar todo el contenido en estructuras de datos bilingües, con enfoque en 5 servicios especializados y casos de éxito integrados.

**Alcance**:
- 5 servicios principales con identidad visual única (color, imagen, copy).
- Landing page individual para cada servicio (no templates genéricos).
- Casos de éxito (Afilamos, Supraeventos) integrados en Home y secciones contextuales.
- Página "About Us" (fusiona Metodología y Studio).
- Eliminación de páginas genéricas ("Capacidades", "Metodología" como entidades separadas).

**Criterios de Aceptación**:
- ✅ Cada servicio tiene URL dedicada en inglés: `/services/:slug`.
- ✅ Contenido bilingüe gestionado dinámicamente.
- ✅ Cada landing page tiene estructura única (Hero, Problemas, Solución, Caso de Éxito, FAQ, CTA).
- ✅ Los casos de éxito se muestran como datos estructurados en Home y en las páginas de servicios relevantes.

### HU2.1: Definición de Servicios (5)
**Estado**: [ ]  
**Tareas**:
- Crear `src/content/services.ts` con array de 5 servicios:
  - `software-development` (color azul, ícono código)
  - `saas-platforms` (color violeta, ícono nube)
  - `enterprise-solutions` (color cian, ícono engranaje)
  - `ai-automation` (color naranja, ícono cerebro)
  - `ux-engineering` (color rosa, ícono paleta)
- Cada servicio incluye: `slug`, `name`, `short`, `fullDescription`, `problems`, `solution`, `benefits`, `faq`, `caseStudy` (referencia a caso de éxito), `image`, `accent`, `icon`.
- Todos los textos bilingües (`{ es, en }`).
**Criterios de Aceptación**:
- ✅ 5 servicios definidos, cada uno con todos los campos.
- ✅ Slugs únicos en kebab-case.
- ✅ Colores y iconos únicos por servicio.

### HU2.2: Contenido de Home (Actualizado)
**Estado**: [ ]  
**Tareas**:
- Crear `src/content/home.ts` con:
  - `hero`: título, subtítulo, CTAs, badge.
  - `trustBanner`: array de logos de clientes (Afilamos, Supraeventos, etc.).
  - `servicesPreview`: lista de los 5 servicios con descripción corta.
  - `ecosystem`: teaser del ecosistema (como antes).
  - `finalCta`: llamado final.
**Criterios de Aceptación**:
- ✅ Trust Banner muestra logos de clientes reales en carrusel.
- ✅ Servicios preview en grid de 3 columnas (responsive).
- ✅ Ecosistema con badges de estado (WIP/Dev).

### HU2.3: Página "About Us" (Fusión Metodología + Studio)
**Estado**: [ ]  
**Tareas**:
- Crear `src/content/about.ts` con:
  - Misión, visión, valores.
  - Metodología (4 pasos) simplificada.
  - Presencia geográfica (Bogotá, Cali, Remoto).
  - Equipo (fotos y roles).
**Criterios de Aceptación**:
- ✅ Página `/about-us` accesible.
- ✅ Contenido bilingüe.
- ✅ Metodología resumida en 4 pasos visuales.

### HU2.4: Casos de Éxito (Integrados)
**Estado**: [ ]  
**Tareas**:
- Crear `src/content/case-studies.ts` con casos (Afilamos, Supraeventos).
- Cada caso: `client`, `sector`, `summary`, `challenge`, `solution`, `results`, `techStack`, `testimonial`.
- Integrar casos en Home (sección "Trusted by") y en páginas de servicios correspondientes.
**Criterios de Aceptación**:
- ✅ Casos con datos reales y verificables.
- ✅ TechStack con al menos 4 tecnologías.
- ✅ Resultados medibles e impacto concreto.

### HU2.5: Páginas de Servicio (Landing Pages Individuales)
**Estado**: [ ]  
**Tareas**:
- Crear componente `ServiceLanding` que renderice una página única por servicio basada en `services.ts`.
- Estructura: Hero específico, Problemas, Solución, Beneficios, Caso de Éxito relacionado, FAQ, CTA.
- No usar un `PageBuilder` genérico; cada sección es un componente específico.
**Criterios de Aceptación**:
- ✅ Cada ruta `/services/:slug` muestra contenido único.
- ✅ El diseño refleja la identidad visual del servicio (color, iconografía).
- ✅ FAQ con Schema.org integrado.

---

## 🧩 Épica E3: Experiencia de Usuario y UI

**Descripción**: Componentes reutilizables, patrones, accesibilidad WCAG 2.2 AA y animaciones.

**Alcance**:
- Header simplificado con menú limpio (Services, About Us, Contact).
- Trust Banner con carrusel de logos.
- Footer completo con contacto, legal y redes sociales.
- Primitives: Button, Tag, Badge, Reveal.
- Patterns: ServiceCard, CaseCard, TrustBanner, Marquee.
- Accesibilidad y animaciones (Framer Motion).

**Criterios de Aceptación**:
- ✅ Navegación intuitiva y sin enlaces rotos.
- ✅ Logos de clientes visibles y de alta calidad.
- ✅ Diseño responsivo y consistente.
- ✅ Auditoría axe sin violaciones críticas.
- ✅ Animaciones respetan `prefers-reduced-motion`.

### HU3.1: Header y Navegación
**Estado**: [ ]  
**Tareas**:
- Header con logo, enlaces: Services (dropdown con 5 servicios), About Us, Contact (futuro).
- Botón "Empezar un proyecto" (abre formulario de contacto).
- Menú hamburguesa para móvil.
- LanguageSwitcher.
**Criterios de Aceptación**:
- ✅ Sticky y cambio de fondo al scroll.
- ✅ Dropdown de servicios al hover/clic.
- ✅ Menú móvil accesible.

### HU3.2: Footer
**Estado**: [ ]  
**Tareas**:
- Columnas: descripción, servicios, enlaces (About, Privacy, Terms), contacto (email, dirección).
- Enlaces a redes sociales (LinkedIn, GitHub, etc.).
- LanguageSwitcher.
**Criterios de Aceptación**:
- ✅ Visible en todas las páginas.
- ✅ Enlaces funcionales.
- ✅ Idioma persistente.

### HU3.3: Componentes Primitivos y Patrones
**Estado**: [ ]  
**Tareas**:
- `primitives.tsx`: Button (variantes por servicio), Eyebrow, SectionHeading, Tag, StatusBadge, Reveal.
- `patterns.tsx`: ServiceCard, CaseCard, TrustBanner (carrusel con logos), Marquee.
**Criterios de Aceptación**:
- ✅ Todos aceptan `className`.
- ✅ ServiceCard muestra icono, color y descripción corta.
- ✅ TrustBanner anima logos en carrusel automático.

### HU3.4: Accesibilidad WCAG 2.2 AA
**Estado**: [ ]  
**Tareas**:
- Skip link al inicio.
- ARIA labels y landmarks.
- Contraste de colores validado (≥4.5:1).
- Focus visible y orden lógico de tabulación.
- `useReducedMotion` en animaciones.
**Criterios de Aceptación**:
- ✅ Sin violaciones críticas en axe.
- ✅ Navegación por teclado completa.
- ✅ Contraste cumple WCAG AA.

### HU3.5: Animaciones y Transiciones
**Estado**: [ ]  
**Tareas**:
- Framer Motion para scroll reveal y hover.
- Transiciones con easing personalizado.
- Marquee con animación CSS (pausable).
- Efectos sutiles en tarjetas y botones.
**Criterios de Aceptación**:
- ✅ Animaciones fluidas.
- ✅ No bloquean interacción.
- ✅ Se desactivan con `prefers-reduced-motion`.

---

## 🧩 Épica E4: Páginas y Rutas (Estandarizadas en Inglés)

**Descripción**: Implementación de todas las páginas con URLs en inglés y redirecciones 301 desde URLs legacy.

**Alcance**:
- Rutas principales: `/`, `/services`, `/services/:slug`, `/about-us`, `/contact` (futuro).
- Redirecciones: `/capacidades/*` → `/services/*`, `/trabajo` → `/`, `/studio` → `/about-us`, `/metodologia` → `/about-us`.
- Páginas individuales para cada servicio.
- Páginas legales (`/privacy`, `/terms`), 404.

**Criterios de Aceptación**:
- ✅ Todas las rutas en inglés estándar.
- ✅ Redirecciones 301 funcionales.
- ✅ Cero errores 404 en rutas antiguas.
- ✅ Cada landing page de servicio es única.

### HU4.1: Página de Inicio (Home)
**Estado**: [ ]  
**Tareas**:
- `HomePage` con: Hero, Trust Banner, Services Preview, Ecosystem Teaser, Final CTA.
- Conexión de CTAs al formulario de contacto.
**Criterios de Aceptación**:
- ✅ Carga en `/`.
- ✅ Trust Banner visible con logos.
- ✅ Todos los enlaces funcionan.

### HU4.2: Hub de Servicios (Listado)
**Estado**: [ ]  
**Tareas**:
- `ServicesHubPage` en `/services` que muestra las 5 tarjetas de servicio con enlace a detalle.
**Criterios de Aceptación**:
- ✅ Grid de 5 tarjetas.
- ✅ Cada tarjeta con nombre, descripción corta, icono y color.

### HU4.3: Landing Page de Servicio
**Estado**: [ ]  
**Tareas**:
- `ServiceLandingPage` que usa `useParams` para obtener el slug.
- Renderiza contenido desde `services.ts` con estructura: Hero, Problemas, Solución, Beneficios, Caso de Éxito, FAQ, CTA.
- Integra schema FAQPage y Service.
**Criterios de Aceptación**:
- ✅ URL `/services/:slug` válida.
- ✅ Si slug no existe → 404.
- ✅ Contenido único por servicio.

### HU4.4: Página About Us
**Estado**: [ ]  
**Tareas**:
- `AboutPage` en `/about-us` con misión, metodología, equipo, presencia.
**Criterios de Aceptación**:
- ✅ Contenido claro y alineado con la marca.
- ✅ Metodología en 4 pasos visuales.

### HU4.5: Página de Contacto (futuro)
**Estado**: [ ] (Pendiente para siguiente fase)  
**Tareas**:
- Crear `/contact` con formulario completo (similar al drawer pero en página completa).
**Criterios de Aceptación**:
- ✅ Formulario funcional con API.

### HU4.6: Páginas Legales (Privacy, Terms)
**Estado**: [ ]  
**Tareas**:
- `LegalPage` con `kind="privacy"` y `kind="terms"`.
- Contenido actualizado para incluir manejo de datos vía API.
**Criterios de Aceptación**:
- ✅ Rutas `/privacy` y `/terms` funcionales.
- ✅ Política clara sobre almacenamiento de leads.

### HU4.7: Página Ecosistema
**Estado**: [ ]  
**Tareas**:
- `EcosystemPage` con items (plataforma, marketplace, portal) y badges de estado.
**Criterios de Aceptación**:
- ✅ Ruta `/ecosystem` disponible.
- ✅ Items con estado y descripción.

### HU4.8: Página 404
**Estado**: [ ]  
**Tareas**:
- `NotFoundPage` con diseño personalizado y botón a Home.
**Criterios de Aceptación**:
- ✅ Cualquier ruta no definida muestra 404.
- ✅ Redirección a Home funciona.

---

## 🧩 Épica E5: SEO Técnico Avanzado

**Descripción**: Meta datos, Schema.org, Sitemap y robots.txt optimizados.

**Alcance**:
- Hook `useSeoMeta` para manejo centralizado de meta tags.
- JSON-LD dinámico (Organization, WebSite, Service, FAQPage).
- Sitemap.xml generado con URLs en inglés y prioridades.
- Robots.txt configurado.
- Redirecciones 301 para URLs legacy.

**Criterios de Aceptación**:
- ✅ Lighthouse SEO 100/100.
- ✅ Rich Snippets validados en Google Rich Results Test.
- ✅ Sitemap sin URLs obsoletas.
- ✅ Canonicals correctos para evitar duplicado ES/EN.

### HU5.1: Meta Tags Dinámicos
**Estado**: [ ]  
**Tareas**:
- Implementar `useSeoMeta` que actualiza title, description, canonical, og:title, og:description, og:image.
- Definir `routeMeta` para cada ruta en `prerender.mjs`.
**Criterios de Aceptación**:
- ✅ Cada página tiene título y descripción únicos.
- ✅ Canonical apunta a URL correcta.
- ✅ OG tags se comparten en redes.

### HU5.2: Schema.org JSON-LD
**Estado**: [ ]  
**Tareas**:
- Agregar script JSON-LD para Organization y WebSite en `index.html`.
- Inyectar `Service` y `FAQPage` dinámicamente en landing pages de servicios.
**Criterios de Aceptación**:
- ✅ Validador de Google reconoce todos los tipos.
- ✅ Datos correctos (nombre, URL, email, etc.).

### HU5.3: Sitemap y Robots
**Estado**: [ ]  
**Tareas**:
- Crear `public/sitemap.xml` con todas las rutas (inglés).
- Crear `public/robots.txt` con Allow: / y Sitemap absoluto.
**Criterios de Aceptación**:
- ✅ Sitemap incluye todas las URLs.
- ✅ Robots apunta al sitemap.

### HU5.4: Redirecciones 301
**Estado**: [ ]  
**Tareas**:
- Configurar en el servidor (o en `_redirects` para CDN) redirecciones de:
  - `/capacidades/*` → `/services/*`
  - `/trabajo` → `/`
  - `/studio` → `/about-us`
  - `/metodologia` → `/about-us`
**Criterios de Aceptación**:
- ✅ Al acceder a URLs legacy, redirige 301 a la nueva URL.
- ✅ No hay pérdida de PageRank.

---

## 🧩 Épica E6: Lead Generation y API Híbrida

**Descripción**: Evolución del formulario de contacto a una arquitectura híbrida segura con API PHP, base de datos MySQL y lead scoring.

**Alcance**:
- API RESTful en PHP (carpeta `/api`) con principios SOLID.
- Modelos: Database (Singleton), LeadRepository, LeadService, Response.
- MySQL con schema para Leads y Suscriptores, triggers para scoring automático.
- Frontend: Componentes `ContactForm` y `Newsletter` que consumen la API vía `fetch`.
- Seguridad: Prepared statements, sanitización, CORS, .htaccess.
- Documentación de API.

**Criterios de Aceptación**:
- ✅ Formularios envían datos a API sin exponer credenciales.
- ✅ Leads se guardan en MySQL con scoring calculado.
- ✅ Newsletter funcional (al menos suscripción básica).
- ✅ Código backend sigue SOLID.
- ✅ Sin vulnerabilidades de inyección SQL ni XSS.

### HU6.1: API REST en PHP (Backend)
**Estado**: [ ]  
**Tareas**:
- Estructura de carpetas: `/api/config`, `/api/models`, `/api/services`, `/api/controllers`, `/api/routes`.
- Implementar `Database.php` (Singleton con PDO).
- `LeadRepository.php` con métodos `save`, `getById`, `updateStatus`.
- `LeadService.php` con validación, scoring (puntos por país, servicio, mensaje).
- `Response.php` para respuestas JSON estandarizadas.
- Crear `index.php` con enrutamiento (GET/POST).
**Criterios de Aceptación**:
- ✅ Endpoint `/api/leads` (POST) recibe datos y devuelve JSON.
- ✅ Endpoint `/api/subscribers` (POST) para newsletter.
- ✅ Conexión a DB con variables de entorno (.env).

### HU6.2: Base de Datos y Schema
**Estado**: [ ]  
**Tareas**:
- Crear `database/schema.sql` con tablas:
  - `leads` (id, name, email, company, service, message, status, score, created_at, ip, user_agent).
  - `subscribers` (id, email, status, created_at).
- Agregar trigger para calcular score automáticamente (basado en servicio, longitud mensaje, etc.).
**Criterios de Aceptación**:
- ✅ Tablas creadas en MySQL.
- ✅ Trigger de scoring funciona al insertar.

### HU6.3: Formulario de Contacto (Frontend)
**Estado**: [ ]  
**Tareas**:
- Crear componente `ContactForm` que reemplace el mailto.
- Campos: nombre, email, empresa (opcional), servicio (dropdown), mensaje.
- Al submit, enviar POST a `/api/leads` con `fetch`.
- Mostrar mensaje de éxito/error.
- Implementar en Drawer de contacto y en página de contacto (futuro).
**Criterios de Aceptación**:
- ✅ Formulario envía datos asíncronamente.
- ✅ Validación en cliente (campos requeridos, email válido).
- ✅ Mensaje de confirmación claro.

### HU6.4: Newsletter
**Estado**: [ ]  
**Tareas**:
- Componente `Newsletter` con campo email.
- Enviar POST a `/api/subscribers`.
- Agradecer al usuario.
**Criterios de Aceptación**:
- ✅ Suscripción guardada en DB.
- ✅ Mensaje de éxito visible.

### HU6.5: Seguridad de API
**Estado**: [ ]  
**Tareas**:
- Configurar CORS en backend.
- Sanitizar inputs (trim, strip_tags, htmlspecialchars).
- Usar prepared statements en todas las consultas.
- Proteger .env con `.htaccess` (Deny from all).
**Criterios de Aceptación**:
- ✅ No hay inyección SQL (probado con caracteres especiales).
- ✅ No hay XSS en respuestas.
- ✅ CORS permite solicitudes desde frontend.

---

## 🧩 Épica E7: Performance y Optimización

**Descripción**: Core Web Vitals, bundle size y rendimiento en dispositivos de gama baja.

**Alcance**:
- Lazy loading de imágenes y componentes.
- Conversión de imágenes a WebP.
- Configuración de chunk size limit.
- Eliminación de dependencias pesadas.

**Criterios de Aceptación**:
- ✅ Lighthouse Performance ≥90 (móvil).
- ✅ LCP <2.5s, CLS <0.1.
- ✅ Build sin warnings de chunk.
- ✅ Imágenes con dimensiones explícitas y lazy loading.

### HU7.1: Core Web Vitals
**Estado**: [ ]  
**Tareas**:
- Preconnect a Google Fonts.
- `loading="lazy"` en imágenes no críticas.
- Optimizar imágenes (convertir a WebP, reducir tamaño).
- Usar `srcset` para responsive.
**Criterios de Aceptación**:
- ✅ LCP <2.5s.
- ✅ FID <100ms.
- ✅ CLS <0.1.

### HU7.2: Bundle Size
**Estado**: [ ]  
**Tareas**:
- Revisar `package.json`, eliminar dependencias no usadas.
- Usar `tree shaking` (Vite por defecto).
- Configurar `rollup-plugin-visualizer`.
- Lazy loading en rutas de servicios.
**Criterios de Aceptación**:
- ✅ JS gzip <150KB.
- ✅ CSS gzip <10KB.
- ✅ Build sin warnings.

### HU7.3: Rendimiento en Baja Gama
**Estado**: [ ]  
**Tareas**:
- Limitar elementos animados en marquee.
- Usar `transform` y `opacity` en animaciones.
- `will-change` solo donde necesario.
**Criterios de Aceptación**:
- ✅ Framerate >30fps en dispositivos de gama baja.

---

## 🧩 Épica E8: Seguridad y Privacidad

**Descripción**: Políticas claras, seguridad en APIs y dependencias.

**Alcance**:
- Política de privacidad actualizada con manejo de datos vía API.
- Términos de uso.
- Enlaces externos seguros.
- `npm audit` y dependencias actualizadas.
- Headers de seguridad HTTP.

**Criterios de Aceptación**:
- ✅ 0 vulnerabilidades críticas en npm y PHP.
- ✅ Política de privacidad clara sobre almacenamiento de leads.
- ✅ Headers de seguridad (X-Frame-Options, X-Content-Type-Options, etc.) configurados.

### HU8.1: Política de Privacidad
**Estado**: [ ]  
**Tareas**:
- Actualizar `/privacy` para incluir:
  - Datos que se recopilan (nombre, email, etc.).
  - Cómo se almacenan en MySQL.
  - Derechos del usuario (acceso, rectificación, cancelación).
  - Sin cookies de rastreo.
**Criterios de Aceptación**:
- ✅ Página accesible desde footer.
- ✅ Lenguaje claro y comprensible.

### HU8.2: Enlaces Externos Seguros
**Estado**: [ ]  
**Tareas**:
- Asegurar que todos los enlaces con `target="_blank"` tengan `rel="noopener noreferrer"`.
**Criterios de Aceptación**:
- ✅ Verificar en todos los enlaces externos.

### HU8.3: Términos de Uso
**Estado**: [ ]  
**Tareas**:
- Actualizar `/terms` con condiciones de uso del sitio y de la API.
**Criterios de Aceptación**:
- ✅ Claro y cubre aspectos legales básicos.

### HU8.4: Seguridad de API (ya cubierta en HU6.5)
**Estado**: [ ]  
**Criterios**: los mismos de HU6.5.

---

## 🧩 Épica E9: Testing y Calidad (Pendiente)

**Descripción**: Automatización de pruebas unitarias, de integración y auditorías.

**Alcance**:
- Vitest para pruebas de componentes React.
- Pruebas de integración para API PHP.
- Lighthouse CI en pipeline.
- Auditoría de accesibilidad con axe en CI.

**Criterios de Aceptación**:
- ✅ Cobertura ≥70% en componentes críticos.
- ✅ Pruebas de API pasan en entorno de staging.
- ✅ Lighthouse CI con umbrales (Performance≥90, Accessibility≥95).
- ✅ Sin violaciones críticas de accesibilidad.

### HU9.1: Pruebas Unitarias (React)
**Estado**: [ ]  
**Tareas**:
- Configurar Vitest.
- Pruebas para `Button`, `LanguageSwitcher`, `ContactForm`.
**Criterios**: Todas pasan en CI.

### HU9.2: Pruebas de API (PHP)
**Estado**: [ ]  
**Tareas**:
- Usar PHPUnit o Pest.
- Probar endpoints `/leads` y `/subscribers`.
**Criterios**: Validaciones y respuestas correctas.

### HU9.3: Auditoría de Accesibilidad
**Estado**: [ ]  
**Tareas**:
- Integrar axe en pipeline (ej: `cypress-axe` o `playwright`).
**Criterios**: Sin violaciones críticas.

### HU9.4: Lighthouse CI
**Estado**: [ ]  
**Tareas**:
- Configurar GitHub Action para ejecutar Lighthouse en cada PR.
**Criterios**: Scores ≥ umbrales.

---

## 🧩 Épica E10: Despliegue y Operaciones (Listo para producción)

**Descripción**: Documentación y configuración para despliegue híbrido (frontend estático + backend PHP/MySQL).

**Alcance**:
- Build de frontend (dist/) para CDN.
- Carpeta `/api` y `/database` para servidor PHP/MySQL.
- Documentación en README para despliegue híbrido.
- Variables de entorno para backend (.env).
- Health check para API.

**Criterios de Aceptación**:
- ✅ Frontend estático funciona en CDN.
- ✅ API PHP operativa en servidor con MySQL.
- ✅ Conexión frontend-backend via URL configurable.
- ✅ Documentación clara para DevOps.

### HU10.1: Build de Producción
**Estado**: [ ]  
**Tareas**: Validar `npm run build` y `build:seo`.
**Criterios**: `dist/` completa y funcional.

### HU10.2: Despliegue en CDN (Frontend)
**Estado**: [ ]  
**Tareas**: Documentar despliegue en Cloudflare Pages, Vercel o Netlify.
**Criterios**: Sitio sirve correctamente con SPA fallback.

### HU10.3: Despliegue de Backend (PHP/MySQL)
**Estado**: [ ]  
**Tareas**: 
- Configurar hosting (cPanel, VPS, AWS).
- Importar schema.sql.
- Configurar `.env` con credenciales.
- Asegurar que `api/` sea accesible.
**Criterios**: API responde en `/api/leads`.

### HU10.4: Documentación de Despliegue
**Estado**: [ ]  
**Tareas**: Actualizar README con instrucciones de despliegue híbrido y variables de entorno.
**Criterios**: Cualquier desarrollador puede desplegar siguiendo la guía.

---

## 📊 Resumen de Estado (para seguimiento)

| Épica | Estado | Observaciones |
|-------|--------|---------------|
| E1 Arquitectura | [ ] | Pendiente de validación |
| E2 Contenidos | [ ] | Pendiente de implementación |
| E3 UI/UX | [ ] | Pendiente |
| E4 Rutas | [ ] | Pendiente |
| E5 SEO | [ ] | Pendiente |
| E6 API/Leads | [ ] | Pendiente |
| E7 Performance | [ ] | Pendiente |
| E8 Seguridad | [ ] | Pendiente |
| E9 Testing | [ ] | Pendiente |
| E10 Despliegue | [ ] | Pendiente |

---

## 🚀 Instrucciones para el Equipo

1. **Trabajar por épicas**: Seleccionar una épica, revisar sus HUs y tareas.
2. **Marcar tareas completadas**: Cambiar `[ ]` a `[x]` cuando se implemente y verifique.
3. **Validar siempre**:
   - Ejecutar `npm run typecheck` para verificar tipos.
   - Ejecutar `npm run build` y `npm run build:seo` para confirmar que el build funciona sin errores.
   - Probar la funcionalidad en entorno local.
4. **Actualizar este documento** con comentarios o notas.

---

## 📝 Prompt de Ejemplo para Solicitar Implementación

> **"Necesito que implementes la Épica E6 (Lead Generation y API Híbrida) teniendo en cuenta que el frontend debe consumir la API PHP con fetch, y el backend debe seguir principios SOLID con conexión a MySQL. Al finalizar, ejecuta `npm run build` y `npm run build:seo` para confirmar que todo está correcto. Marca las tareas completadas en el documento con `[x]`."**

---

## ✅ Conclusión

Este documento constituye el **plan oficial y completo** para la plataforma FaruTech v2.0, cubriendo arquitectura, contenido, UI, SEO, generación de leads, performance, seguridad, testing y despliegue.  
Cada épica, historia y tarea está detallada con criterios de aceptación claros, lo que permite un seguimiento preciso y una implementación ordenada.  

**El proyecto está listo para ser ejecutado en fases, validando cada paso con builds y pruebas.** 🚀