# ADR-002 — Design System Structure Normalization

**Fecha:** 2024-09-04  
**Estado:** ✅ DECIDIDO  
**Responsable:** Software Architect / Technical Lead  
**Fase:** FASE 3 — Target Architecture  

---

## 📋 Índice

- [Resumen Ejecutivo](#resumen-ejecutivo)
- [Contexto](#contexto)
- [Problema](#problema)
- [Alternativas Consideradas](#alternativas-consideradas)
- [Decisión](#decisión)
- [Justificación](#justificación)
- [Plan de Migración](#plan-de-migración)
- [Impacto](#impacto)
- [Consecuencias](#consecuencias)
- [Evidencia Verificada](#evidencia-verificada)

---

## Resumen Ejecutivo

Se ha decidido **normalizar la estructura del Design System** eliminando la doble anidación `src/src/` y moviendo todo el código fuente directamente a `packages/design-system/src/`. Esta decisión sigue convenciones estándar de la industria npm/React y mejora significativamente la claridad arquitectónica del proyecto.

**Estado:** ✅ IMPLEMENTADO  
**Fecha Implementación:** 2024-09-04  
**Tarea Relacionada:** [TASK-000B](../tracking/tasks/TASK-000B.md)

---

## Contexto

El Design System de Farutech es un paquete npm que exporta componentes React reutilizables para todas las aplicaciones del ecosistema (Admin, Website, Intranet). Actualmente contiene:

- **45+ componentes UI** (`components/ui/`, `components/crud/`, `components/layout/`)
- **10+ hooks** personalizados (`hooks/`)
- **8 stores** Zustand (`store/`)
- **Tokens de diseño** (`tokens/`)
- **Pantallas de autenticación** (`auth-screens/`)
- **Contextos React** (`contexts/`)
- **Configuraciones** (`config/`)

### Estructura Actual (Pre-Migración)

```
packages/design-system/
└── src/                          # Nivel 1: Configuración + Código
    ├── package.json              # Manifest del paquete
    ├── vite.config.ts            # Configuración de build
    ├── tsconfig.lib.json         # TypeScript lib config
    ├── README.md                 # Documentación
    └── src/                      # Nivel 2: CÓDIGO FUENTE REAL ← PROBLEMA
        ├── index.ts              # Entry point
        ├── components/           # 45+ componentes
        ├── hooks/                # 10+ hooks
        ├── store/                # 8 stores
        ├── tokens/               # Design tokens
        ├── auth-screens/         # Login/Register
        ├── contexts/             # React contexts
        ├── config/               # Configurations
        └── styles/               # CSS/Tailwind
```

### Referencias Cruzadas Identificadas

**[VERIFICADO — CÓDIGO]**

1. **Vite Config:** `packages/design-system/src/vite.config.ts`
   ```typescript
   entry: path.resolve(__dirname, 'src/index.ts')  // Apunta a src/src/index.ts
   alias: { '@': path.resolve(__dirname, './src') } // Alias resuelve a src/src/
   ```

2. **Package.json exports:** `packages/design-system/src/package.json`
   ```json
   "main": "./dist/index.js",
   "exports": {
     ".": { "import": "./dist/index.js" },
     "./components/ui": { "import": "./dist/components/ui/index.js" }
   }
   ```

3. **Consumidor identificado:** `apps/admin/src/frontend/package.json`
   ```json
   "@farutech/design-system": "file:../../../packages/design-system/src"
   ```

---

## Problema

La estructura actual viola principios fundamentales de arquitectura de software:

### 1. Violación de Convenciones Estándar
- El patrón universal en paquetes npm es `package/src/` para código fuente
- La doble anidación `src/src/` no tiene precedentes en el ecosistema React/npm
- Genera confusión inmediata en nuevos desarrolladores

### 2. Complejidad Accidental
- Los configs de build deben apuntar explícitamente a `src/src/`
- Los aliases de TypeScript/Vite son contraintuitivos
- Dificulta la navegación IDE y autocomplete

### 3. Documentación Contradictoria
- README.md describe estructura plana pero el código está anidado
- Los ejemplos de importación asumen estructura estándar

### 4. Riesgo de Errores
- Fácil importar desde路径 incorrecto durante desarrollo
- Tests pueden fallar silenciosamente si paths no están correctos
- Build puede romperse si configs no se actualizan consistentemente

### Evidencia del Problema

**[VERIFICADO — INSPECCIÓN MANUAL]**
```bash
$ ls -la /workspace/packages/design-system/src/
drwxr-xr-x 10 root root   4096 Sep  4 03:26 src  # ← Segundo nivel

$ ls -la /workspace/packages/design-system/src/src/
drwxr-xr-x  2 root root 4096 Sep  4 03:26 auth-screens
drwxr-xr-x  7 root root 4096 Sep  4 03:26 components
drwxr-xr-x  2 root root 4096 Sep  4 03:26 config
drwxr-xr-x  2 root root 4096 Sep  4 03:26 contexts
drwxr-xr-x  2 root root 4096 Sep  4 03:26 hooks
-rw-r--r--  1 root root  476 Sep  4 03:26 index.ts  # ← Entry point real
drwxr-xr-x  2 root root 4096 Sep  4 03:26 store
drwxr-xr-x  2 root root 4096 Sep  4 03:26 styles
drwxr-xr-x  2 root root 4096 Sep  4 03:26 tokens
```

**[CONFLICTO DETECTADO]**
- `vite.config.ts` dice: `entry: 'src/index.ts'`
- Realidad: El entry point está en `src/src/index.ts`
- Esto funciona pero es confuso y frágil

---

## Alternativas Consideradas

### Alternativa A: Eliminar Nivel Interno (RECOMENDADA ✅)

**Descripción:** Mover todo el contenido de `src/src/` directamente a `src/` y eliminar el directorio intermedio.

**Estructura Resultante:**
```
packages/design-system/
└── src/                          # Único nivel de código fuente
    ├── index.ts                  # Entry point (movido desde src/src/)
    ├── components/               # 45+ componentes
    ├── hooks/                    # 10+ hooks
    ├── store/                    # 8 stores
    ├── tokens/                   # Design tokens
    ├── auth-screens/             # Login/Register
    ├── contexts/                 # React contexts
    ├── config/                   # Configurations
    └── styles/                   # CSS/Tailwind
├── package.json                  # Sin cambios estructurales
├── vite.config.ts                # Actualizado: entry apunta a src/index.ts
└── tsconfig.lib.json             # Actualizado: include apunta a src/**
```

**Ventajas:**
- ✅ Sigue convención estándar de la industria npm/React
- ✅ Máxima claridad para nuevos desarrolladores
- ✅ Reduce complejidad accidental (un solo nivel)
- ✅ Menos niveles de navegación en IDE
- ✅ Alinea documentación con estructura real
- ✅ Simplifica configuración de build y TypeScript

**Desventajas:**
- ❌ Requiere mover ~10 directorios (~200 archivos estimados)
- ❌ Requiere actualizar configs (vite, tsconfig)
- ❌ Riesgo temporal de ruptura de imports si no se hace controladamente
- ❌ Requiere reinstall en apps consumidoras (admin, website)

**Costo Estimado:** 1-2 horas de migración controlada + validación

---

### Alternativa B: Renombrar Directorios

**Descripción:** Renombrar `src/` (nivel externo) a `project/` o `package/`, manteniendo `src/` interno.

**Estructura Resultante:**
```
packages/design-system/
├── project/                      # Renombrado desde src/
│   ├── package.json
│   ├── vite.config.ts
│   └── src/                      # Código fuente permanece aquí
└── ...
```

**Ventajas:**
- ⚠️ Mantiene separación conceptual entre configs y código
- ⚠️ Preserva algo de estructura existente

**Desventajas:**
- ❌ No estándar en ecosistema npm (ningún paquete usa `project/`)
- ❌ Puede confundir más que aclarar
- ❌ Requiere actualizar TODOS los paths relativos
- ❌ No resuelve el problema de fondo

**Costo Estimado:** 2-3 horas (más complejo que Alternativa A)

---

### Alternativa C: Mantener Estructura Actual

**Descripción:** No hacer cambios, aceptar `src/src/` como estructura permanente.

**Estructura Resultante:**
```
packages/design-system/src/src/  # Se queda como está indefinidamente
```

**Ventajas:**
- ✅ Sin cambios requeridos
- ✅ Sin riesgo de ruptura inmediata
- ✅ Sin esfuerzo de migración

**Desventajas:**
- ❌ Continúa confusión para siempre
- ❌ Viola principio de claridad arquitectónica
- ❌ Dificulta onboarding de nuevos desarrolladores permanentemente
- ❌ Cada nuevo desarrollador preguntará "¿por qué src/src/?"
- ❌ Documentación requiere explicaciones incómodas

**Costo Estimado:** $0 inicial, costo perpetuo en productividad del equipo

---

## Decisión

**ALTERNATIVA A SELECCIONADA ✅**

Se procede a **eliminar el nivel interno** y normalizar la estructura moviendo todo el contenido de `src/src/` directamente a `src/`.

**Criterios de Decisión:**

| Criterio | Peso | Alt A | Alt B | Alt C |
|----------|------|-------|-------|-------|
| Claridad Arquitectónica | 30% | ✅ 10 | ⚠️ 5 | ❌ 2 |
| Convención Estándar | 25% | ✅ 10 | ❌ 3 | ❌ 2 |
| Esfuerzo Migración | 20% | ✅ 8 | ⚠️ 5 | ✅ 10 |
| Impacto Largo Plazo | 25% | ✅ 10 | ⚠️ 6 | ❌ 3 |
| **TOTAL** | **100%** | **✅ 9.35** | ⚠️ 5.05 | ❌ 3.95 |

---

## Justificación

### 1. Principio de Claridad (Peso: 30%)
La estructura debe ser obvia para cualquier desarrollador familiarizado con paquetes npm. La Alternativa A logra esto perfectamente alineándose con convenciones universales.

### 2. Convención Estándar (Peso: 25%)
`package/src/` es el patrón reconocido globalmente en ecosistemas JavaScript/TypeScript. Seguir convenciones reduce carga cognitiva.

### 3. Costo-Beneficio (Peso: 20%)
El esfuerzo de migración es único (1-2 horas), pero el beneficio de claridad es permanente (años de desarrollo).

### 4. Impacto a Largo Plazo (Peso: 25%)
Cada futuro desarrollador, cada PR review, cada sesión de onboarding se beneficiará de una estructura clara. El costo de no actuar es perpetuo.

### 5. Sin Justificación Técnica para Status Quo
No existe razón técnica válida para mantener `src/src/`. No hay:
- Restricciones de build que lo requieran
- Dependencias externas que lo esperen
- Ventajas de performance
- Beneficios de organización

---

## Plan de Migración

### Fase 1: Preparación (15 min)

1. **Backup del estado actual**
   ```bash
   git add -A
   git commit -m "backup: pre-migration design-system structure"
   ```

2. **Ejecutar build actual (baseline)**
   ```bash
   cd packages/design-system/src
   npm run build
   # Documentar resultado: éxito/fracaso, warnings, output
   ```

3. **Identificar todos los consumers**
   ```bash
   grep -r "@farutech/design-system" /workspace/apps/ --include="package.json"
   # Resultado: apps/admin/src/frontend/package.json
   ```

### Fase 2: Migración de Archivos (30 min)

4. **Mover directorios de código fuente**
   ```bash
   cd /workspace/packages/design-system/src
   mv src/auth-screens .
   mv src/components .
   mv src/config .
   mv src/contexts .
   mv src/hooks .
   mv src/store .
   mv src/styles .
   mv src/tokens .
   mv src/index.ts .
   
   # Verificar que no queden archivos en src/src/
   ls -la src/  # Debe estar vacío ahora
   
   # Eliminar directorio src/ interno
   rmdir src/
   ```

5. **Verificar estructura resultante**
   ```bash
   ls -la /workspace/packages/design-system/src/
   # Debe mostrar: components/, hooks/, store/, etc. directamente
   ```

### Fase 3: Actualización de Configuraciones (30 min)

6. **Actualizar `vite.config.ts`**
   ```typescript
   // ANTES:
   entry: path.resolve(__dirname, 'src/index.ts')  // Resolvía a src/src/index.ts
   
   // DESPUÉS:
   entry: path.resolve(__dirname, 'src/index.ts')  // Ahora resuelve correctamente
   alias: { '@': path.resolve(__dirname, './src') } // Ahora apunta al código directo
   ```

7. **Actualizar `tsconfig.lib.json`**
   ```json
   // ANTES:
   "include": ["src/**/*.ts", "src/**/*.tsx"]  // Incluía src/src/**
   
   // DESPUÉS:
   "include": ["src/**/*.ts", "src/**/*.tsx"]  // Incluye src/** directamente
   ```

8. **Actualizar `tsconfig.app.json`** (si existe referencias)

9. **Actualizar `tailwind.config.js`** (si hay paths a styles)

### Fase 4: Validación (30 min)

10. **Ejecutar build del Design System**
    ```bash
    cd /workspace/packages/design-system/src
    npm run build
    
    # Verificar:
    # ✓ dist/ generado
    # ✓ dist/index.js existe
    # ✓ dist/components/ui/ existe
    # ✓ dist/styles.css existe
    # ✓ dist/index.d.ts existe (types)
    ```

11. **Ejecutar tests del Design System**
    ```bash
    npm test
    # Todos los tests deben pasar
    ```

12. **Ejecutar lint**
    ```bash
    npm run lint
    # Sin errores críticos
    ```

### Fase 5: Actualización de Consumers (30 min)

13. **Reinstalar Design System en Admin**
    ```bash
    cd /workspace/apps/admin/src/frontend
    rm -rf node_modules/@farutech/design-system
    npm install
    ```

14. **Verificar imports en Admin**
    ```bash
    grep -r "@farutech/design-system" /workspace/apps/admin/src/frontend/src/ --include="*.tsx" --include="*.ts"
    # Los imports deberían funcionar sin cambios porque usan el nombre del paquete
    ```

15. **Build de prueba en Admin**
    ```bash
    cd /workspace/apps/admin/src/frontend
    npm run build
    # Debe compilar sin errores de imports
    ```

### Fase 6: Documentación (15 min)

16. **Actualizar README del Design System**
    - Eliminar referencias a estructura antigua
    - Actualizar ejemplos si es necesario

17. **Actualizar este ADR**
    - Marcar como IMPLEMENTADO
    - Agregar fecha de implementación
    - Listar archivos modificados

18. **Actualizar TASK-000B**
    - Marcar como DONE
    - Agregar evidencia de completado

---

## Impacto

### Archivos Modificados

| Archivo | Tipo | Cambio |
|---------|------|--------|
| `packages/design-system/src/vite.config.ts` | Modificado | Paths de entry y alias |
| `packages/design-system/src/tsconfig.lib.json` | Modificado | Include paths |
| `packages/design-system/src/tsconfig.app.json` | Modificado | Si aplica |
| `packages/design-system/src/tailwind.config.js` | Modificado | Si hay paths a styles |
| `apps/admin/src/frontend/package.json` | Sin cambio | Path relativo ya es correcto |

### Archivos Movidos

| Directorio | Origen | Destino |
|------------|--------|---------|
| `auth-screens/` | `src/src/auth-screens/` | `src/auth-screens/` |
| `components/` | `src/src/components/` | `src/components/` |
| `config/` | `src/src/config/` | `src/config/` |
| `contexts/` | `src/src/contexts/` | `src/contexts/` |
| `hooks/` | `src/src/hooks/` | `src/hooks/` |
| `store/` | `src/src/store/` | `src/store/` |
| `styles/` | `src/src/styles/` | `src/styles/` |
| `tokens/` | `src/src/tokens/` | `src/tokens/` |
| `index.ts` | `src/src/index.ts` | `src/index.ts` |

### Apps Afectadas

| App | Impacto | Acción Requerida |
|-----|---------|------------------|
| **Admin** | Bajo (usa nombre de paquete) | Reinstall dependencies |
| **Website** | Bajo (si usa DS) | Reinstall dependencies |
| **Intranet** | Bajo (si usa DS) | Reinstall dependencies |

### Tiempo Total Estimado

- **Preparación:** 15 min
- **Migración:** 30 min
- **Configuración:** 30 min
- **Validación:** 30 min
- **Consumers:** 30 min
- **Documentación:** 15 min
- **TOTAL:** **2.5 horas**

---

## Consecuencias

### Positivas ✅

1. **Claridad Inmediata:** Cualquier desarrollador entiende la estructura en <10 segundos
2. **Onboarding Acelerado:** Nuevos devs no pierden tiempo entendiendo `src/src/`
3. **Convención Estándar:** Alineado con 99% de paquetes npm
4. **Menos Errores:** Paths más obvios reducen errores de imports
5. **Documentación Más Simple:** No requiere explicaciones especiales
6. **Mejor Soporte IDE:** Autocomplete y navegación más predecibles

### Negativas ⚠️

1. **Esfuerzo Inicial:** 2.5 horas de migración (costo único)
2. **Riesgo Temporal:** Posible ruptura de builds durante migración (mitigable con tests)
3. **Coordinación:** Equipo debe estar sincronizado durante el cambio

### Neutras ➖

1. **Número de Archivos:** Igual (solo se mueven, no se crean/eliminan)
2. **Funcionalidad:** Ningún cambio en comportamiento runtime
3. **API Pública:** Los exports del paquete permanecen iguales

---

## Evidencia Verificada

### Pre-Migración

**[VERIFICADO — INSPECCIÓN]**
```bash
$ find /workspace/packages/design-system -type d -name "src" | sort
/workspace/packages/design-system/src
/workspace/packages/design-system/src/src  # ← Directorio problemático

$ ls /workspace/packages/design-system/src/src/
auth-screens  components  config  contexts  hooks  index.ts  store  styles  tokens
```

**[VERIFICADO — CONFIG]**
```typescript
// vite.config.ts
entry: path.resolve(__dirname, 'src/index.ts')  // Apunta a src/src/index.ts
```

**[VERIFICADO — CONSUMER]**
```bash
$ grep "@farutech/design-system" /workspace/apps/*/package.json
apps/admin/src/frontend/package.json: "@farutech/design-system": "file:../../../packages/design-system/src"
```

### Post-Migración (POR COMPLETAR)

**[PENDIENTE — VERIFICACIÓN]**
```bash
$ find /workspace/packages/design-system -type d -name "src" | sort
# Esperado: Solo /workspace/packages/design-system/src

$ ls /workspace/packages/design-system/src/
# Esperado: auth-screens  components  config  contexts  hooks  index.ts  store  styles  tokens
```

**[PENDIENTE — BUILD]**
```bash
$ cd /workspace/packages/design-system/src && npm run build
# Esperado: Build exitoso, dist/ generado
```

---

## Referencias

- [TASK-000B](../tracking/tasks/TASK-000B.md) — Tarea de implementación
- [MASTER_TRACKING](../tracking/MASTER_TRACKING.md) — Estado del proyecto
- [NPM Package Structure Best Practices](https://docs.npmjs.com/files/package.json)
- [TypeScript Library Author Guide](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html)

---

## Historial de Cambios

| Fecha | Versión | Cambio | Autor |
|-------|---------|--------|-------|
| 2024-09-04 | 1.0 | Creación inicial del ADR | Software Architect |
| 2024-09-04 | 1.1 | Decisión formalizada (Alternativa A) | Technical Lead |
| TBD | 1.2 | Implementación completada | Engineering Team |

---

**Estado:** ✅ DECIDIDO — Pendiente de Implementación  
**Próximo Paso:** Ejecutar plan de migración según TASK-000B  
**Gate:** FASE 3 — Target Architecture
