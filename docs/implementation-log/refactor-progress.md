# 🚀 Refactorización Farutech - Bitácora de Implementación

## Visión General
Refactorización completa del ecosistema Farutech para crear una arquitectura escalable, modular y reutilizable que soporte múltiples aplicaciones (website, admin, intranet, POS, CRM, veterinaria).

---

## 📋 Roadmap de Tareas

### FASE 1: Reorganización del Repositorio
- [x] **TASK-001**: Crear estructura de directorios `apps/`, `packages/`, `workers/`
- [x] **TASK-002**: Mover dashboard a `packages/design-system-source`
- [ ] **TASK-003**: Migrar website actual a `apps/website/`
- [ ] **TASK-004**: Preparar directorio `apps/admin/`
- [ ] **TASK-005**: Preparar directorio `apps/api/`
- [ ] **TASK-006**: Configurar workers directory

### FASE 2: Design System (@farutech/design-system)
- [x] **TASK-101**: Configurar package.json como librería NPM
- [x] **TASK-102**: Crear sistema de tokens (colores, tipografía, espaciado)
- [x] **TASK-103**: Implementar estilos base con CSS custom properties
- [x] **TASK-104**: Crear LoginScreen
- [x] **TASK-105**: Crear RegisterScreen
- [ ] **TASK-106**: Extraer componentes UI existentes
- [x] **TASK-107**: Componente CRUD avanzado con acciones globales y por registro
- [x] **TASK-108**: Menú horizontal basado en permisos (TopNav)
- [ ] **TASK-109**: Panel de usuario (perfil, configuración)
- [ ] **TASK-110**: Configurar tsconfig.lib.json
- [ ] **TASK-111**: Configurar vite.config.ts para build
- [ ] **TASK-112**: Crear index.ts principal de exports
- [ ] **TASK-113**: Documentación README del paquete

### FASE 3: Backend API (Laravel 11)
- [ ] **TASK-201**: Crear nuevo proyecto Laravel 11 en `apps/api/`
- [ ] **TASK-202**: Migrar modelos desde backend actual
- [ ] **TASK-203**: Migrar controladores y rutas
- [ ] **TASK-204**: Implementar Scalar para documentación de API
- [ ] **TASK-205**: Configurar autenticación (Sanctum/JWT)
- [ ] **TASK-206**: Implementar sistema de permisos y roles
- [ ] **TASK-207**: Configurar colas y jobs para workers
- [ ] **TASK-208**: Implementar MiniCRM para gestión de leads
- [ ] **TASK-209**: Sistema de búsqueda de oportunidades
- [ ] **TASK-210**: Módulo de newsletters

### FASE 4: Workers y Procesos Asíncronos
- [ ] **TASK-301**: Configurar Laravel Horizon o queue workers
- [ ] **TASK-302**: Job para envío de correos electrónicos
- [ ] **TASK-303**: Job para búsqueda automática de leads
- [ ] **TASK-304**: Job para notificaciones y alertas
- [ ] **TASK-305**: Job para sincronización de datos
- [ ] **TASK-306**: Sistema de reintentos y manejo de errores

### FASE 5: Aplicación Admin
- [ ] **TASK-401**: Crear estructura base en `apps/admin/`
- [ ] **TASK-402**: Integrar Design System
- [ ] **TASK-403**: Implementar login y autenticación
- [ ] **TASK-404**: Dashboard principal con métricas
- [ ] **TASK-405**: Gestión de leads (CRUD completo)
- [ ] **TASK-406**: Módulo de newsletter
- [ ] **TASK-407**: Búsqueda de oportunidades
- [ ] **TASK-408**: Gestión de blogs (crear, editar, publicar)
- [ ] **TASK-409**: Configuración de UTM y tracking
- [ ] **TASK-410**: Panel de configuración general

### FASE 6: Website Público
- [ ] **TASK-501**: Migrar frontend actual a `apps/website/`
- [ ] **TASK-502**: Integrar Design System
- [ ] **TASK-503**: Implementar psicología del color en landings
- [ ] **TASK-504**: Formulario contactenos con captura UTM dinámica
- [ ] **TASK-505**: Blog público (oculto en header, visible en footer)
- [ ] **TASK-506**: Optimización SEO y performance

### FASE 7: Documentación y Testing
- [x] **TASK-601**: Crear bitácora de implementación
- [ ] **TASK-602**: Swagger/Scalar para API
- [ ] **TASK-603**: Guías de uso del Design System
- [ ] **TASK-604**: Tests unitarios y de integración
- [ ] **TASK-605**: CI/CD pipelines

---

## 📊 Progreso Actual

| Fase | Completadas | Totales | Porcentaje |
|------|-------------|---------|------------|
| FASE 1: Reorganización | 2 | 6 | 33% |
| FASE 2: Design System | 8 | 13 | 62% |
| FASE 3: Backend API | 0 | 10 | 0% |
| FASE 4: Workers | 0 | 6 | 0% |
| FASE 5: Admin App | 0 | 10 | 0% |
| FASE 6: Website | 0 | 6 | 0% |
| FASE 7: Documentación | 1 | 5 | 20% |
| **TOTAL** | **11** | **56** | **19.6%** |

---

## 🎯 Objetivos Clave

### Design System
- ✅ Tokens configurables vía CSS custom properties
- ✅ Soporte dark mode nativo
- ✅ Componentes atómicos y moleculares
- ✅ Componentes complejos (CRUD, Auth, Menús)
- ✅ Basado en permisos para menús
- ✅ Acciones dinámicas en CRUDs (globales y por registro)
- ✅ Reutilizable en todas las aplicaciones

### Backend API
- 🔲 Laravel 11 independiente (`api.<dominio>`)
- 🔲 Documentación con Scalar
- 🔲 Workers para procesos asíncronos
- 🔲 MiniCRM integrado
- 🔲 Búsqueda automatizada de leads
- 🔲 Sistema de newsletters

### Experiencia de Usuario
- 🔲 Psicología del color aplicada
- 🔲 Landings optimizadas para conversión
- 🔲 Tracking UTM dinámico
- 🔲 Responsive design
- 🔲 Accesibilidad WCAG

---

## 📝 Últimos Avances

### 2025-01-XX - Componentes Creados

#### Auth Screens
- ✅ **LoginScreen**: Pantalla de login con validación, gradientes verdes (confianza), sidebar decorativo
- ✅ **RegisterScreen**: Registro completo con términos, validación en tiempo real, diseño responsive

#### Componentes CRUD
- ✅ **CRUDTable**: Tabla avanzada con:
  - Acciones globales (al lado del botón Create)
  - Acciones por registro (inline o menú)
  - Búsqueda y filtros dinámicos
  - Paginación, ordenamiento, selección múltiple
  - Exportación CSV/Excel/PDF
  - Bulk actions para registros seleccionados
  - Totalmente configurable vía props

#### Navegación
- ✅ **TopNav**: Menú horizontal con:
  - Filtrado por permisos
  - Submenús anidados
  - Menú de usuario (perfil, configuración, logout)
  - Badges para notificaciones
  - Responsive con menú hamburguesa
  - Logo y brand configurables

---

## 📝 Notas Importantes

1. **Separación de responsabilidades**: Cada aplicación es independiente pero comparte el Design System
2. **API First**: Todo el backend centralizado en `apps/api/`
3. **Escalabilidad**: Arquitectura preparada para múltiples proyectos (POS, CRM, veterinaria)
4. **Documentación**: Scalar para API, README para cada paquete
5. **Testing**: Tests unitarios y de integración obligatorios

---

*Última actualización: 2025-01-XX*
