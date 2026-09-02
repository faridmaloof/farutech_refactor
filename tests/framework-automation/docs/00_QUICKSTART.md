# 🚀 Inicio Ultra-Rápido (5 Minutos)

**Para:** Principiantes absolutos  
**Tiempo:** 5 minutos  
**Resultado:** Primer test ejecutado

---

## ¿Qué es este Framework?

Es una herramienta para **automatizar tests** de aplicaciones web usando:
- **.NET 10** (lenguaje C#)
- **Playwright** (controla browsers como Chrome, Edge, Firefox)
- **ScreenPlay Pattern** (forma organizada de escribir tests)

**No necesitas:**
- ❌ Node.js
- ❌ npm
- ❌ Experiencia previa en automatización

**Sí necesitas:**
- ✅ .NET 10 SDK (gratis)
- ✅ Un editor de código (Visual Studio, VS Code, Rider)
- ✅ 5 minutos de tiempo

---

## PASO 1: Instalar (2 minutos)

### 1.1 Descargar el Código

```bash
# Opción A: Git
git clone <url-del-repo>
cd framework-automation\src

# Opción B: Descargar ZIP
# Descarga, extrae y abre la carpeta src
```

### 1.2 Restaurar Paquetes

```bash
dotnet restore
```

**¿Qué hace?** Descarga las librerías necesarias (.NET lo hace automático)

---

## PASO 2: Instalar Playwright (1 minuto)

```bash
cd Scaffolding.Tests
pwsh bin/Release/net10.0/playwright.ps1 install
```

**¿Qué hace?** Descarga los browsers (Chrome, Firefox, etc.)

**Nota:** Solo se hace la primera vez

---

## PASO 3: Ejecutar Primer Test (2 minutos)

```bash
# Regresa a src
cd ..

# Ejecuta TODOS los tests
dotnet test
```

**Verás algo como:**
```
  Passed GoogleSearch.Successful search validates the page title [1s]
  Passed!  - Failed: 0, Passed: 1, Skipped: 0, Total: 1
```

¡**FELICIDADES**! Acabas de ejecutar tu primer test automatizado 🎉

---

## ¿Qué Acaba de Pasar?

1. El framework abrió un browser (Chrome)
2. Navegó a Google
3. Buscó "Automatización .NET"
4. Verificó que el título contenga el texto esperado
5. Cerró el browser
6. Reportó el resultado

**Todo esto en ~1 segundo** ⚡

---

## SIGUIENTES PASOS

### Ahora que funcionó, ¿qué sigue?

**Opción A: Entender cómo funciona**
- 👉 Lee [02_USER_GUIDE.md](02_USER_GUIDE.md)

**Opción B: Crear tu primer test**
- 👉 Lee [02_USER_GUIDE.md - Crear Tests](02_USER_GUIDE.md#crear-nuevos-tests)

**Opción C: Ver la arquitectura**
- 👉 Lee [01_ARCHITECTURE.md](01_ARCHITECTURE.md)

---

## 🆘 PROBLEMAS COMUNES (FAQ)

### ❌ Error: "dotnet no se reconoce"

**Solución:** Instala .NET 10 SDK
- 👉 https://dotnet.microsoft.com/download

### ❌ Error: "playwright.ps1 no se encuentra"

**Solución:** Primero haz `dotnet build`
```bash
dotnet build
pwsh bin/Release/net10.0/playwright.ps1 install
```

### ❌ Error: "Tests fallaron"

**Posibles causas:**
- Sin internet (Google no carga)
- Browser bloqueado por firewall
- Versión de .NET incorrecta

**Solución rápida:**
```bash
# Limpia y reconstruye
dotnet clean
dotnet restore
dotnet build
dotnet test
```

---

## 📚 GLOSARIO RÁPIDO

| Término | Significado |
|---------|-------------|
| **Test** | Prueba automatizada |
| **Feature** | Funcionalidad (ej: Login, Búsqueda) |
| **Step** | Paso individual (ej: "Dado que...") |
| **Tag** | Etiqueta (ej: `@smoke`, `@web`) |
| **Build** | Compilar el código |
| **Restore** | Descargar dependencias |

---

## ¿Necesitas Más Ayuda?

- **Documentación Completa:** [docs/README.md](README.md)
- **Guía de Usuario:** [02_USER_GUIDE.md](02_USER_GUIDE.md)
- **Mejores Prácticas:** [03_BEST_PRACTICES.md](03_BEST_PRACTICES.md)

---

*¡Bienvenido al mundo de la automatización de tests!* 🚀

*Enterprise Automation Framework - Inicio Ultra-Rápido*
