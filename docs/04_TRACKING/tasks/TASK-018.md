# TASK-018 — Admin: Gestión de Mensajes de Contáctenos

**Fase:** FASE 15 — Cierre de Brechas Funcionales (Requisito 6.1)
**Estado:** ⬜ BACKLOG
**Prioridad:** 🟡 HIGH
**Responsable:** Frontend Lead (Admin)
**Fecha Creación:** 2026-09-05

---

## 🎯 Objetivo

Construir la interfaz de administración para visualizar y gestionar los mensajes de contacto registrados por clientes desde el formulario público del website, cerrando el requisito 6.1 (backend ya existe: `ContactController`, modelo `ContactMessage`, migración `2024_01_01_000011`).

## 📋 Estado Actual (Auditoría)

- ✅ Backend: `ContactController`, modelo, migración — ya existen
- ❌ Frontend Admin: no existe ninguna página para esto (`apps/admin/src/frontend/src/pages` solo tiene Dashboard, Leads, Login, Settings)

## 📂 Alcance

- `ContactMessagesPage`: listado paginado con filtros (leído/no leído, fecha, servicio de interés si el form lo captura)
- Marcar como leído/respondido
- Ver detalle completo del mensaje
- Acción rápida: "Convertir a Lead" (si el mensaje de contacto no generó automáticamente un Lead — verificar si `ContactController` ya crea el Lead o si es un flujo separado; documentar cuál es el caso real antes de implementar la acción)
- Notificación (badge en Sidebar) de mensajes no leídos — reutilizar componente `NotificationPanel` del Design System si ya existe

## ✅ Criterios de Aceptación

- [ ] CA001: Listado de mensajes con paginación y filtros
- [ ] CA002: Marcar como leído actualiza estado en backend y UI en tiempo real
- [ ] CA003: Badge de no leídos visible en el Sidebar del admin
- [ ] CA004: Lighthouse Performance > 90, Accessibility > 95

## 🔗 Dependencias

- Backend: verificar si `ContactController` expone todos los verbos necesarios (`GET /api/v1/admin/contact-messages`, `PATCH .../:id/read`) — si no, ampliar backend como parte de esta tarea
- Design System: `DataTable`, `Badge`, `NotificationPanel`

## 📆 Historial de Cambios

| Fecha | Estado | Cambio | Responsable |
|---|---|---|---|
| 2026-09-05 | BACKLOG | Creación tras hallazgo de auditoría (gap 6.1) | Technical Lead |
