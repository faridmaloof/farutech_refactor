# ADR-001 — Admin Routing Strategy

**Fecha:** 2024-09-03  
**Estado:** ✅ DECIDIDO  
**Responsable:** Technical Lead

---

## Contexto

El Admin Panel necesita una estrategia de routing clara para su acceso en producción y desarrollo. Actualmente existen páginas admin embebidas dentro del Website (`apps/website/src/frontend/src/pages/Admin*.tsx`), lo cual genera confusión arquitectónica y problemas de seguridad.

## Problema

¿Cómo debe accederse al Admin Panel?

- ¿Subdominio independiente (`admin.farutech.local`)?
- ¿Path dentro del dominio principal (`farutech.local/admin`)?
- ¿Path dentro de www (`www.farutech.local/admin`)?

La decisión impacta: configuración de gateway, CORS, cookies, SSL, deployment, aislamiento de seguridad, sesiones y mantenimiento.

## Alternativas Consideradas

### Alternativa A: Subdominio Independiente (`admin.farutech.local`)

**Ventajas:**
- ✅ Aislamiento completo de seguridad (cookies, sesiones, CSP)
- ✅ Deployment independiente (puede escalar/fallar sin afectar website público)
- ✅ Certificados SSL separados (mejor gestión de secretos)
- ✅ CORS más claro y explícito
- ✅ Mejor separación de responsabilidades en código
- ✅ Permite diferentes stacks tecnológicos si fuera necesario
- ✅ Cookies aisladas por dominio (no se comparten con website público)

**Desventajas:**
- ❌ Requiere configuración DNS adicional
- ❌ Certificados SSL adicionales (aunque wildcard lo resuelve)
- ❌ Configuración de gateway más compleja
- ❌ Los usuarios deben recordar otro dominio

**Impacto Técnico:**
- HAProxy: routing por host `admin.farutech.local` → container admin
- Backend API: CORS debe permitir `admin.farutech.local`
- Cookies: `domain=admin.farutech.local` (no compartidas)
- Sessions: Almacenamiento separado posible
- Build: Pipeline independiente

### Alternativa B: Path en Dominio Principal (`farutech.local/admin`)

**Ventajas:**
- ✅ Un solo dominio para recordar
- ✅ Certificados SSL únicos
- ✅ Configuración DNS simple
- ✅ Menos overhead de infraestructura

**Desventajas:**
- ❌ Cookies compartidas (requiere paths específicos o nombres únicos)
- ❌ Website y Admin deployados juntos (acoplamiento)
- ❌ CSP más complejo de configurar
- ❌ Si el website falla, admin también podría verse afectado
- ❌ Menor aislamiento de seguridad

**Impacto Técnico:**
- HAProxy: routing por path `/admin/*` → container admin
- Backend API: Mismo origen para website y admin
- Cookies: Deben usar `name` único o `path=/admin`
- Sessions: Compartidas implícitamente

### Alternativa C: Path en WWW (`www.farutech.local/admin`)

**Ventajas:**
- ✅ Similar a Alternativa B
- ✅ Convención común

**Desventajas:**
- ❌ Todas las desventajas de Alternativa B
- ❌ Confusión entre www y dominio raíz
- ❌ Acoplamiento fuerte con website público

## Decisión

**ALTERNATIVA A: Subdominio Independiente (`admin.farutech.local`)**

## Justificación

1. **Seguridad:** El aislamiento de cookies y sesiones es crítico para un panel administrativo. Un subdominio garantiza que las credenciales admin no se filtren al website público vía XSS u otros vectores.

2. **Arquitectura Limpia:** Separa claramente responsabilidades. El equipo puede evolucionar Admin y Website independientemente.

3. **Deployment:** Permite deploys independientes. Una actualización del website no requiere redeploy del admin y viceversa.

4. **Escalabilidad:** Si el admin requiere más recursos (por MiniCRM, búsqueda de oportunidades, etc.), puede escalarse sin tocar el website público.

5. **Tendencia de la Industria:** Herramientas como GitHub (`github.com` vs `gist.github.com`), GitLab (`gitlab.com` vs `admin.gitlab.com`), Shopify (`shopify.com` vs `partners.shopify.com`), usan subdominios para herramientas administrativas.

6. **Documentación Existente:** La documentación actual del proyecto ya referencia `admin.farutech.local` como dominio objetivo.

## Consecuencias

### Positivas
- Mayor seguridad por aislamiento
- Claridad arquitectónica
- Flexibilidad de deployment
- Mejor gestión de errores (fallos aislados)

### Negativas (y mitigaciones)
- **Configuración DNS adicional:** Mitigado con wildcard `*.farutech.local`
- **Certificados múltiples:** Mitigado con certificado wildcard SSL
- **Complejidad de gateway:** Documentado en `infrastructure/gateway/haproxy.cfg`

### Requerimientos Derivados
1. Configurar DNS: `admin.farutech.local` → IP del gateway
2. Certificado SSL wildcard: `*.farutech.local`
3. HAProxy: routing por host para admin
4. Backend API: CORS debe incluir `admin.farutech.local`
5. Cookies: configurar `domain=.farutech.local` solo si se necesita SSO, o `domain=admin.farutech.local` para aislamiento total
6. Migrar páginas `Admin*.tsx` de Website a Admin App

## Referencias

- [OWASP Cookie Security](https://owasp.org/www-community/controls/SecureCookieAttribute)
- [MDN Cookie Domain Attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#domain_attribute)
- TASK-004: Website Public Only (pendiente migración admin pages)

---

**Revisión Programada:** 2024-12-03  
**Próximo ADR Relacionado:** ADR-002 (Database Strategy), ADR-003 (Website/Admin Separation)
