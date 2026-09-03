# PLAN MAESTRO DE IMPLEMENTACIÓN — FaruTech Platform v3.1

**Versión:** 3.1
**Estado:** Plan maestro de implementación
**Tipo:** Engineering / Architecture / Security / QA / Deployment Plan
**Última actualización:** 2026-08-22

---

# 1. PROPÓSITO

Este documento es la **fuente de verdad operativa** para la evolución de FaruTech Platform.

Define:

* alcance funcional;
* arquitectura;
* fases;
* épicas;
* historias;
* tareas;
* criterios de aceptación;
* seguridad;
* testing;
* performance;
* observabilidad;
* infraestructura;
* deployment;
* Definition of Done.

El objetivo es transformar la plataforma en una solución:

**funcional + segura + mantenible + testeable + observable + resiliente + escalable + production-ready.**

---

# 2. REGLA DE FUENTE DE VERDAD

Este documento define **qué debe construirse**.

Los prompts de implementación definen **cómo debe ejecutarse el trabajo de cada fase**.

El código real, las pruebas y la infraestructura representan el estado real del sistema.

Por tanto:

```text
MASTER PLAN
    ↓
IMPLEMENTATION PROMPT
    ↓
CODE
    ↓
TESTS
    ↓
EVIDENCE
    ↓
VALIDATED STATE
```

Nunca debe asumirse que una tarea está terminada únicamente porque aparece marcada como `[x]`.

---

# 3. GLOBAL ENGINEERING PROTOCOL

Estas reglas son obligatorias para TODAS las fases presentes y futuras.

## 3.1 Auditoría acumulativa obligatoria

Antes de iniciar cualquier fase:

> **Auditar TODAS las fases anteriores.**

Ejemplo:

```text
Fase 3:
Auditar F0 + F1 + F2
        ↓
Corregir
        ↓
Validar
        ↓
Implementar F3
        ↓
Regresión F0 + F1 + F2 + F3
```

No basta con ejecutar los tests existentes.

La auditoría debe inspeccionar:

* requerimientos;
* código;
* arquitectura;
* frontend;
* backend;
* APIs;
* DB;
* migraciones;
* seguridad;
* dependencias;
* infraestructura;
* CI/CD;
* observabilidad;
* testing;
* documentación.

---

# 4. NO INVENTAR

El agente no debe inventar:

* requisitos;
* clientes;
* logos;
* métricas;
* casos de éxito;
* endpoints;
* permisos;
* usuarios;
* integraciones;
* credenciales;
* datos;
* funcionalidades;
* comportamiento no definido.

Si falta información:

1. verificar código existente;
2. verificar Master Plan;
3. verificar documentación;
4. identificar la ambigüedad;
5. elegir la opción técnicamente segura únicamente si puede justificarse;
6. documentar la decisión.

Nunca presentar información ficticia como real.

---

# 5. NO ELIMINAR SIN EVIDENCIA

No eliminar:

* archivos;
* componentes;
* endpoints;
* rutas;
* tablas;
* columnas;
* dependencias;
* configuraciones;
* migraciones;

simplemente porque parezcan innecesarios.

Antes debe demostrarse:

```text
No consumers
+
No references
+
No runtime usage
+
No build usage
+
No configuration dependency
+
No documentation dependency
```

y debe evaluarse el impacto.

---

# 6. MINIMAL CHANGE PRINCIPLE

Cada fase debe modificar únicamente lo necesario para cumplir su alcance.

No realizar refactorizaciones masivas no relacionadas.

Una mejora fuera del alcance solo puede implementarse si afecta:

* seguridad;
* compilación;
* integridad;
* estabilidad;
* arquitectura crítica;
* funcionamiento de la Feature actual.

El resto debe documentarse como backlog.

---

# 7. ARQUITECTURA

Aplicar:

* SOLID;
* Clean Architecture cuando sea apropiado;
* Separation of Concerns;
* Dependency Inversion;
* DRY;
* KISS;
* YAGNI;
* composición sobre herencia cuando corresponda;
* bajo acoplamiento;
* alta cohesión.

No introducir abstracciones innecesarias.

No crear capas únicamente por cumplir una moda arquitectónica.

---

# 8. SEGURIDAD

Aplicar:

* Secure by Design;
* Defense in Depth;
* Least Privilege;
* Zero Trust;
* OWASP Top 10;
* OWASP API Security Top 10;
* OWASP ASVS.

Validar cuando corresponda:

* authentication;
* authorization;
* RBAC;
* BOLA/IDOR;
* privilege escalation;
* injection;
* XSS;
* CSRF;
* SSRF;
* Path Traversal;
* Command Injection;
* Mass Assignment;
* brute force;
* rate limiting;
* payload limits;
* secrets;
* CORS;
* security headers;
* secure error handling.

Nunca confiar únicamente en controles del frontend.

---

# 9. THREAT MODELING

Para funcionalidades sensibles realizar análisis:

```text
Assets
↓
Actors
↓
Trust Boundaries
↓
Attack Surface
↓
Threats
↓
Mitigations
↓
Security Tests
```

Utilizar STRIDE cuando sea apropiado.

Especialmente para:

* autenticación;
* administración;
* CRM;
* uploads;
* exportaciones;
* newsletter;
* notificaciones;
* APIs;
* integraciones externas.

---

# 10. AUTENTICACIÓN VS AUTORIZACIÓN

Autenticación y autorización son controles independientes.

```text
Authentication
      ↓
Authorization
      ↓
Resource Authorization
      ↓
Action Authorization
```

Un usuario autenticado no implica que pueda acceder a cualquier recurso.

Todas las operaciones administrativas deben verificar autorización server-side.

---

# 11. BASE DE DATOS

Todas las modificaciones deben considerar:

* PK;
* FK;
* unique constraints;
* índices;
* integridad referencial;
* nullability;
* timestamps;
* soft delete cuando corresponda;
* concurrencia;
* consistencia;
* migraciones;
* rollback o forward-fix.

Nunca ejecutar migraciones destructivas sin evaluar impacto.

No almacenar secretos innecesariamente.

---

# 12. DEPENDENCIAS

No ejecutar indiscriminadamente:

```bash
npm audit fix
composer update
```

Primero:

1. analizar dependencias;
2. identificar vulnerabilidades;
3. determinar impacto;
4. actualizar de forma controlada;
5. ejecutar regresión;
6. documentar cambios.

Las actualizaciones mayores requieren evaluación de compatibilidad.

---

# 13. TESTING

Utilizar según corresponda:

* unit;
* integration;
* API;
* E2E;
* accessibility;
* security;
* regression;
* performance.

Coverage es un indicador, no una garantía de calidad.

No escribir tests artificiales únicamente para alcanzar un porcentaje.

---

# 14. REGRESIÓN

Después de cada fase:

```text
Current implementation
        ↓
Regression Audit
        ↓
Previous phases
        ↓
Current phase
        ↓
Integration tests
```

Una nueva fase no puede romper funcionalidades anteriores.

---

# 15. OBSERVABILIDAD

Cuando corresponda implementar:

* structured logging;
* correlation IDs;
* health checks;
* readiness checks;
* metrics;
* error tracking;
* audit logs;
* tracing.

Nunca registrar:

* passwords;
* access tokens;
* refresh tokens;
* API secrets;
* información sensible innecesaria.

---

# 16. GIT Y CONTROL DE CAMBIOS

Antes de modificar:

```bash
git status
git diff
```

Después:

```bash
git status
git diff
```

No:

* force push;
* reescribir historia;
* eliminar ramas sin autorización;
* mezclar cambios no relacionados.

Mantener cambios reversibles.

---

# 17. DEFINITION OF DONE GLOBAL

Una fase NO está terminada porque sus tareas hayan sido ejecutadas.

Está terminada únicamente cuando:

```text
Requirements
+
Implementation
+
Architecture
+
Security
+
Testing
+
Integration
+
Regression
+
Documentation
+
Evidence
```

han sido validados.

---

# 18. REPORTE OBLIGATORIO

Cada fase debe finalizar con:

```text
IMPLEMENTATION REPORT

Phase:
Status:

Previous phases audited:

Findings:
CRITICAL:
HIGH:
MEDIUM:
LOW:

Corrections performed:

Current implementation:

Files changed:

Database changes:

API changes:

Security controls:

Tests created:

Tests executed:

Regression:

Performance:

Accessibility:

Documentation:

Known risks:

Remaining backlog:

Evidence:

Final status:
COMPLETE / BLOCKED
```

---

# 19. CRITERIO DE BLOQUEO

No avanzar a la siguiente fase si existen problemas:

* CRITICAL;
* HIGH de seguridad;
* HIGH de integridad de datos;
* HIGH que comprometan funcionalidades críticas.

Los problemas MEDIUM/LOW pueden permanecer únicamente si:

* están documentados;
* no bloquean el objetivo;
* tienen riesgo aceptable;
* están registrados como backlog.

---

# 20. CONTEXTO Y ALCANCE

FaruTech evolucionará desde un sitio informativo hacia una plataforma de conversión y gestión de leads.

## Frontend

* React;
* TypeScript;
* Vite;
* Tailwind CSS;
* prerender/SSG;
* ES/EN;
* SEO técnico.

## Backend

* Laravel Lumen;
* API REST;
* Mini CRM;
* blog;
* newsletter;
* leads;
* notificaciones.

## Administración

* SPA React;
* autenticación;
* autorización;
* dashboard;
* CRM;
* blog;
* newsletter;
* configuración.

---

# 21. REGLA SOBRE INFORMACIÓN REAL

Los siguientes elementos solo pueden utilizar información real proporcionada por el proyecto:

* clientes;
* logos;
* testimonios;
* métricas;
* casos de éxito;
* estadísticas;
* nombres;
* integraciones.

No utilizar placeholders que puedan confundirse con información real.

---

# 22. FASES DEL PROYECTO

| Fase | Nombre                                    | Dependencias                            |
| ---- | ----------------------------------------- | --------------------------------------- |
| 0    | Auditoría y Corrección Inicial            | Ninguna                                 |
| 1    | Configuración del Proyecto y Base Técnica | F0                                      |
| 2    | Backend API + Mini CRM + Notificaciones   | F1                                      |
| 3    | Sistema de Contenidos y Servicios         | F1 + capacidades backend cuando aplique |
| 4    | Experiencia de Usuario y UI               | F3                                      |
| 5    | SEO Técnico Avanzado                      | F4                                      |
| 6    | Lead Generation y API Frontend            | F2                                      |
| 7    | Panel de Administración                   | F2 + F6                                 |
| 8    | Performance y Optimización                | F7                                      |
| 9    | Testing y Calidad                         | F8                                      |
| 10   | Despliegue y Operaciones                  | F9                                      |

---

# 23. FASE 0 — AUDITORÍA Y CORRECCIÓN INICIAL

## Objetivo

Establecer la baseline técnica.

### E0.1 — Estructura

* [ ] Verificar frontend en raíz.
* [ ] Verificar backend en `/api`.
* [ ] Verificar estructura Lumen.
* [ ] Crear documentación `/api`.
* [ ] Verificar posibilidad de despliegue independiente.

### E0.2 — Build

* [ ] Corregir `servicesData.ts`.
* [ ] Corregir `entry-server.tsx`.
* [ ] Corregir `main.tsx`.
* [ ] Configurar `typecheck`.
* [ ] Configurar `build`.
* [ ] Configurar `build:seo`.
* [ ] Configurar `validate`.

### E0.3 — Seguridad

* [ ] Verificar `.env`.
* [ ] Crear `.env.example`.
* [ ] Proteger secrets.
* [ ] Revisar CORS.
* [ ] Revisar headers.
* [ ] Revisar inputs.
* [ ] Revisar dependencias.

### E0.4 — Limpieza

* [ ] Identificar código huérfano.
* [ ] Demostrar dependencias sin uso.
* [ ] Eliminar únicamente elementos comprobados como obsoletos.

### Definition of Done

* Build correcto.
* Typecheck correcto.
* SEO build correcto.
* Backend disponible.
* Secrets protegidos.
* Baseline documentada.
* CRITICAL/HIGH corregidos.

---

# 24. FASE 1 — BASE TÉCNICA

## E1.1

Implementar:

* Vite;
* React;
* TypeScript strict;
* ESLint;
* estructura modular.

## E1.2

Implementar:

* Tailwind;
* design tokens;
* tipografía;
* componentes base.

## E1.3

Implementar:

* i18n ES/EN;
* persistencia;
* LanguageSwitcher;
* canonicalización.

## E1.4

Implementar:

* SSR/prerender;
* StaticRouter;
* prerender;
* metadata.

## E1.5

Implementar:

* lazy loading;
* code splitting;
* bundle analysis.

No imponer budgets arbitrarios sin baseline.

## E1.6

Validar backend:

* Composer;
* configuración;
* health;
* DB.

---

# 25. FASE 2 — BACKEND + CRM

## E2.1 — Database

Implementar:

* users;
* services;
* application_types;
* locations;
* blog_categories;
* blog_posts;
* leads;
* lead_notes;
* contact_messages;
* newsletter_subscribers;
* newsletter_campaigns;
* notification_settings;
* audit_logs.

Verificar índices, constraints y relaciones.

## E2.2 — CRM

Implementar:

* estados;
* prioridades;
* asignación;
* notas;
* historial;
* filtros;
* paginación;
* transiciones válidas.

Proteger contra BOLA/IDOR.

## E2.3 — Notifications

Implementar:

* Telegram;
* WhatsApp/Twilio;
* servicios desacoplados;
* timeout;
* retry;
* idempotencia;
* logging seguro.

## E2.4 — Blog

Implementar:

* CRUD;
* categorías;
* scheduling;
* publicación;
* estadísticas;
* jobs.

## E2.5 — Contact/Newsletter

Implementar:

* validación;
* consentimiento;
* rate limiting;
* anti-abuse;
* unsubscribe;
* duplicate handling.

## E2.6 — Authentication

Evaluar primero la estrategia.

Si JWT es apropiado, implementar:

* access token;
* refresh;
* expiración;
* revocación;
* logout;
* secure storage;
* rotation cuando corresponda.

Implementar autorización y RBAC.

---

# 26. FASE 3 — CONTENIDOS Y SERVICIOS

Implementar:

* 5 servicios;
* home;
* about;
* ServiceLanding;
* FAQ;
* casos de éxito;
* CTA.

Todos los contenidos deben ser bilingües.

No inventar información empresarial.

Validar:

* slugs;
* navegación;
* contenido;
* SEO;
* accesibilidad.

---

# 27. FASE 4 — UX/UI

Implementar:

* primitives;
* patterns;
* Header;
* Footer;
* navegación;
* menú móvil;
* LanguageSwitcher;
* ServiceCard;
* CaseCard;
* TrustBanner;
* Marquee.

Aplicar WCAG 2.2 AA.

Validar:

* teclado;
* focus;
* contraste;
* semántica;
* reduced motion.

---

# 28. FASE 5 — SEO

Implementar:

* metadata;
* canonical;
* Open Graph;
* JSON-LD;
* sitemap;
* robots;
* redirects.

Structured Data debe representar únicamente información real y visible.

No generar schema ficticio.

---

# 29. FASE 6 — LEAD GENERATION

Implementar:

* ContactForm;
* Newsletter;
* estados;
* validación;
* API integration.

Seguridad:

* server-side validation;
* rate limiting;
* anti-spam;
* payload limits;
* duplicate detection;
* consentimiento.

---

# 30. FASE 7 — ADMIN

Implementar:

* login;
* AdminLayout;
* dashboard;
* CRM;
* blog;
* newsletter;
* configuración.

Aplicar:

```text
Authentication
→ Authorization
→ Resource Authorization
→ Action Authorization
```

Registrar operaciones administrativas relevantes.

Proteger exportaciones.

Prevenir CSV Injection.

---

# 31. FASE 8 — PERFORMANCE

Utilizar:

* LCP;
* INP;
* CLS.

Objetivos Core Web Vitals:

* LCP ≤ 2.5s;
* INP ≤ 200ms;
* CLS ≤ 0.1.

También medir:

* bundle;
* JS execution;
* memory;
* API latency;
* image weight.

No sacrificar seguridad, accesibilidad o funcionalidad.

---

# 32. FASE 9 — TESTING

Implementar:

* Vitest;
* PHPUnit;
* Playwright/Cypress;
* axe;
* Lighthouse CI.

Probar:

* unit;
* integration;
* API;
* E2E;
* security;
* accessibility;
* regression.

La cobertura debe enfocarse especialmente en lógica crítica.

---

# 33. FASE 10 — DEPLOYMENT

Validar:

* frontend;
* backend;
* DB;
* secrets;
* HTTPS;
* CORS;
* headers;
* CI/CD;
* monitoring;
* logs;
* health;
* readiness;
* rollback.

Definir:

* deployment;
* migrations;
* rollback;
* incident handling;
* troubleshooting.

No declarar producción READY sin evidencia.

---

# 34. VALIDACIÓN GLOBAL ENTRE FASES

Después de cada fase:

```bash
npm run typecheck
npm run build
npm run build:seo
npm run validate
```

Backend cuando corresponda:

```bash
cd api
composer validate
php artisan test
php artisan migrate:status
```

Health:

```bash
curl -f http://localhost:8000/api/health
```

Además, ejecutar las herramientas de seguridad y testing disponibles.

---

# 35. MATRIZ DE TRAZABILIDAD

Cada requisito importante debe poder rastrearse:

```text
Requirement
    ↓
Epic
    ↓
User Story
    ↓
Task
    ↓
Implementation
    ↓
Test
    ↓
Evidence
```

No debe existir funcionalidad importante sin criterio de aceptación y prueba asociada.

---

# 36. ESTADO DE CADA FASE

Cada fase debe mantener:

```markdown
Status: NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETE

Audit:
- [ ] Previous phases audited
- [ ] Findings classified
- [ ] Findings corrected

Implementation:
- [ ] Requirements implemented

Validation:
- [ ] Build
- [ ] Tests
- [ ] Security
- [ ] Regression
- [ ] Documentation

Definition of Done:
- [ ] Complete
```

---

# 37. CRITERIOS DE PRODUCCIÓN

El sistema solo puede declararse:

**PRODUCTION READY**

cuando:

* no existen CRITICAL;
* no existen HIGH bloqueantes;
* tests críticos pasan;
* seguridad validada;
* autorización validada;
* migraciones verificadas;
* observabilidad disponible;
* rollback definido;
* frontend y backend integrados;
* performance aceptable;
* accesibilidad validada;
* SEO validado;
* documentación actualizada.

---

# 38. PRINCIPIO FINAL

El objetivo no es completar diez fases.

El objetivo es construir y mantener un sistema:

* **Correcto**
* **Seguro**
* **Mantenible**
* **Testeable**
* **Observable**
* **Resiliente**
* **Escalable**
* **Production-Ready**

Cada nueva fase debe mejorar el sistema sin degradar las anteriores.

La regla permanente es:

```text
AUDIT
↓
REMEDIATE
↓
VALIDATE
↓
DESIGN
↓
IMPLEMENT
↓
TEST
↓
SECURITY
↓
REGRESSION
↓
AUDIT AGAIN
↓
REPORT
```

Este ciclo es obligatorio para todas las fases presentes y futuras.