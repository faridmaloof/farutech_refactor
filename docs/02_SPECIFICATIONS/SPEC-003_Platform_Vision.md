# 📖 VISIÓN FUNCIONAL — PLATFORM / CONTROL PLANE MULTI-TENANT (SPEC-003)

**ID:** SPEC-003
**Versión:** 0.1 (Visión — no es especificación técnica ejecutable todavía)
**Estado:** 🟡 CAPTURADA — Pendiente de detalle técnico antes de implementación
**Prioridad:** 🔵 FUTURO (no bloquea el refactor actual del website)
**Relacionado a:** ADR-007 (Platform Scope Separation)

---

## ⚠️ Nota de Alcance

Este documento **no es una especificación lista para implementar** (a diferencia de SPEC-001/002). Es la captura formal de la visión de negocio comunicada por el Product Owner, para que no dependa de la memoria de una persona y sirva de punto de partida cuando el proyecto `platform` inicie formalmente. Antes de convertirse en tareas ejecutables, requiere: definición de stack técnico final, modelo de datos detallado, contratos de API, y revisión de seguridad/compliance (multi-tenencia implica requisitos de aislamiento que deben auditarse con cuidado).

---

## 1. Objetivo de Negocio

Permitir que Farutech ofrezca, bajo un mismo control plane (`platform.farutech.com` o dominio a definir), un ecosistema tipo "mini-cloud propio" donde:

- Clientes (Organizations) se registran e ingresan a su propio espacio.
- Dentro de su Organization, despliegan una o más Instances de Applications del catálogo (marketplace): ERP, POS para un rubro específico (ej. veterinarias), CRM a medida, u otras aplicaciones desarrolladas por Farutech para ese cliente.
- Cada Instance puede desplegarse en modo `dedicated` (infraestructura exclusiva) o `shared` (infraestructura compartida entre varias Organizations/Instances de bajo consumo), decisión que impacta el aprovisionamiento de recursos.
- Farutech administra el catálogo de Applications disponibles y el ciclo de vida de aprovisionamiento de cada Instance.

## 2. Terminología (ver también ADR-007 §Glosario)

| Término | Definición |
|---|---|
| **Organization** | Cliente de Farutech. Entidad de facturación y administración de usuarios. |
| **Instance** | Ambiente desplegado dentro de una Organization (ej. "ERP de Organización X"). |
| **Deployment Mode** | `dedicated` \| `shared` — cómo se aprovisiona la infraestructura de una Instance. |
| **Application** | Plantilla del catálogo/marketplace (ERP, POS Veterinaria, etc.) que se materializa como Instance. |
| **Control Plane / Platform Core** | El sistema que gobierna Organizations, Instances y Applications. |

## 3. Actores

| Rol | Descripción |
|---|---|
| **Platform Super Admin** (Farutech) | Administra el catálogo de Applications, aprueba/gestiona Organizations, monitorea infraestructura global. |
| **Organization Admin** (cliente) | Usuario administrador inicial de una Organization. Recibe credenciales iniciales de Farutech, **debe cambiar contraseña en primer ingreso**, y desde ahí crea nuevos usuarios de su Organization con dominios de correo autorizados/aprobados por Farutech. |
| **Organization User** (cliente) | Usuario final dentro de una Organization, con acceso según los roles que el Organization Admin le asigne, a las Instances correspondientes. |

## 4. Flujo Conceptual de Alto Nivel

```
Organization Admin ingresa a platform.farutech.com
   │
   ▼
Selecciona/crea una Organization
   │
   ▼
Dentro de la Organization, ve sus Instances existentes o crea una nueva
   │
   ▼
Selecciona una Application del marketplace (catálogo de Farutech)
   │
   ▼
Define Deployment Mode: dedicated | shared
   │
   ├─ dedicated → se aprovisionan recursos exclusivos según buenas prácticas
   │              dentro del ambiente de la Organization
   │
   └─ shared → se despliega sobre un ambiente ya compartido con otras
               Organizations/Instances de bajo consumo
   │
   ▼
Control Plane despliega backend + frontend + lo que la Application requiera
   │
   ▼
Instance queda operativa; Organization interactúa directamente con ella
```

## 5. Identificación de Instancia (Enrutamiento Multi-Tenant)

Cada request entrante a una Instance debe resolverse mediante, al menos, la combinación de:

- **Instance ID**
- **Código de Organización**
- **Dominio** (propio del cliente o subdominio asignado por Farutech)

El Control Plane valida que las credenciales presentadas correspondan efectivamente a esa Instance/Organization antes de enrutar la petición al backend correspondiente — es decir, el enrutamiento no es solo por DNS, sino que hay una capa de verificación de identidad de tenant en el propio control plane.

## 6. Consideraciones de Stack (a validar, no cerradas)

| Componente | Dirección propuesta | Razón |
|---|---|---|
| Frontend (dashboard de Platform) | React + Vite + TypeScript, reutilizando `@farutech/design-system` | Mismo lenguaje/ecosistema que el website; el Design System ya trae componentes de dashboard pensados para esto |
| Backend / Control Plane API | .NET / C# | Mayor robustez para lógica de aprovisionamiento, orquestación multi-tenant y volumen transaccional esperado, vs. las restricciones de inodes que motivaron Laravel para el website |
| Workers de aprovisionamiento/mensajería | Go | Procesos concurrentes ligeros para orquestar infraestructura, colas de aprovisionamiento y mensajería entre servicios |
| Infraestructura | Azure y/o AWS | A diferencia del website (hosting con restricción de inodes), Platform requiere infraestructura cloud elástica real |
| Contenerización | Real, de producción (no solo para pruebas locales como hoy en el website) | Cada Instance dedicada probablemente requiera aislamiento por contenedor/namespace |
| Base de datos | A definir en un ADR propio de Platform cuando el proyecto inicie | No reutiliza el PostgreSQL del website (ver ADR-007) |

## 7. Seguridad (líneas generales, sin detalle aún)

- Autenticación inicial del Organization Admin mediante credenciales entregadas por Farutech, con cambio de contraseña obligatorio en primer ingreso.
- Alta de nuevos Organization Users restringida a dominios de correo autorizados/aprobados explícitamente por el Organization Admin (evita que cualquier correo externo se autoregistre).
- Aislamiento de datos estricto por Organization/Instance — a definir si es aislamiento a nivel de esquema, base de datos o infraestructura completa según `deployment_mode`.

## 8. Fuera de Alcance de Este Documento

- Modelo de datos detallado (tablas, relaciones)
- Contratos de API
- Estrategia de aprovisionamiento de infraestructura (IaC, Terraform/Pulumi, etc.)
- Modelo de precios/billing
- Diseño del catálogo de Applications (cómo se define qué recursos necesita cada tipo de Application)

Estos puntos deben desarrollarse en specs técnicas propias (`SPEC-01X_Platform_*`) cuando el proyecto se priorice, siguiendo el mismo nivel de detalle que SPEC-001/SPEC-002.

## 9. Criterio de "Listo para Desarrollar"

Este documento se considera listo para derivar tareas ejecutables cuando:

- [ ] El Product Owner confirme el dominio final de Platform
- [ ] Se defina el modelo de datos de Organization/Instance/Application
- [ ] Se elija motor(es) de base de datos para Platform
- [ ] Se defina el mecanismo exacto de resolución de tenant (headers, subdominio, path, JWT claims, etc.)
- [ ] Se apruebe un ADR de seguridad multi-tenant (aislamiento de datos)

---

## Historial de Cambios

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 0.1 | 2026-09-05 | Captura inicial de la visión comunicada por el Product Owner | Technical Lead |

---

**© 2026 Farutech — SPEC-003 v0.1 (Visión, no ejecutable aún)**
