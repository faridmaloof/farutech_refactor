# TASK-025 — Decisión y Ejecución: Independencia Real de Páginas de Servicio

**Fase:** FASE 15 — Cierre de Brechas Funcionales
**Estado:** ⬜ BACKLOG
**Prioridad:** 🟡 HIGH
**Responsable:** Product Owner (decisión) + Frontend Lead (Website) (ejecución)
**Fecha Creación:** 2026-09-05
**Relacionado:** Requisito 1 de la definición de producto

---

## 🎯 Objetivo

Cerrar la brecha identificada en auditoría: el requisito de producto pide páginas de servicio **"totalmente independientes, nada desde template, ni mucho menos"**, pero hoy todas las páginas de servicio (`AIAutomationPage`, `SaaSPlatformsPage`, etc.) envuelven un componente compartido `ServiceScaffold.tsx` que renderiza secciones estructuralmente idénticas (Problemas/Enfoque/Casos de Uso/CTA) alimentadas desde `servicesData.ts`.

## ⚠️ Decisión de Producto Requerida (bloqueante, no técnica)

Esta tarea **no se estima ni se reparte a desarrollo** hasta que el Product Owner elija una de estas dos alternativas:

### Alternativa A — Aceptar el patrón actual como trade-off documentado
Se documenta explícitamente en un ADR (`ADR-008_service_pages_shared_scaffold.md`, a crear si se elige esta opción) que el patrón "hero único + secciones comunes" es una decisión consciente de mantenibilidad, y se **re-redacta el requisito 1** con el Product Owner para reflejar la intención real ("cada servicio debe tener contenido y propuesta de valor únicos, no necesariamente cero reutilización de estructura visual").

### Alternativa B — Ejecutar la independencia total pedida literalmente
Se elimina `ServiceScaffold.tsx` y `servicesData.ts` como fuente centralizada; cada página de servicio se reescribe como un archivo 100% autocontenido (JSX, copy y estructura propios, sin componente padre compartido más allá de elementos genéricos de layout como Header/Footer). Esto implica:
- Reescribir las 5 páginas de servicio existentes (`AIAutomationPage`, `EnterpriseSolutionsPage`, `ModernizationPage`, `SaaSPlatformsPage`, `SoftwareDevelopmentPage`, `UXEngineeringPage`)
- Aceptar el costo de mantenimiento futuro: cambios de estilo/estructura globales requerirán editar cada archivo individualmente
- Actualizar `ServiceLandingPage.tsx` (el router de servicios) si su lógica de selección dependía de la estructura común

## ✅ Criterios de Aceptación (aplican según la alternativa elegida)

- [ ] CA001: Existe una decisión documentada y firmada por el Product Owner (Alternativa A o B)
- [ ] CA002 (si A): `ADR-008` creado y el requisito 1 re-redactado con lenguaje preciso
- [ ] CA003 (si B): las 6 páginas de servicio no comparten ningún componente de contenido entre sí (solo layout genérico de sitio)
- [ ] CA004 (si B): `npm run build` compila sin errores tras la eliminación de `ServiceScaffold`/`servicesData`

## 📆 Historial de Cambios

| Fecha | Estado | Cambio | Responsable |
|---|---|---|---|
| 2026-09-05 | BACKLOG | Creación tras hallazgo de auditoría (gap requisito 1) | Technical Lead |
