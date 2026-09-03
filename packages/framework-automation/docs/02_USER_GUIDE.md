# Enterprise Automation Framework - Guía de Usuario

**Versión:** 1.0  
**Fecha:** 2026-03-14  
**Estado:** ✅ **PRODUCCIÓN**

---

## 📋 ÍNDICE

1. [Primeros Pasos](#primeros-pasos)
2. [Instalación](#instalación)
3. [Ejecutar Tests](#ejecutar-tests)
4. [Crear Nuevos Tests](#crear-nuevos-tests)
5. [Configuración](#configuración)
6. [Reportes](#reportes)
7. [Solución de Problemas](#solución-de-problemas)

---

## PRIMEROS PASOS

### Requisitos Previos

- ✅ .NET 10 SDK
- ✅ Visual Studio 2022 / Rider / VS Code
- ✅ Git (opcional)

### NO se requiere

- ❌ Node.js (Playwright para .NET es nativo)
- ❌ npm / npx

---

## INSTALACIÓN

### 1. Clonar/Descargar

```bash
cd d:\framework-automation\src
```

### 2. Restaurar Paquetes

```bash
dotnet restore Framework.Automation.sln
```

### 3. Instalar Playwright

```bash
cd Scaffolding.Tests
pwsh bin/Release/net10.0/playwright.ps1 install
```

### 4. Verificar Instalación

```bash
dotnet build --configuration Release
```

Debe mostrar:
```
Compilación correcta.
0 Errores
```

---

## EJECUTAR TESTS

### Todos los Tests

```bash
cd d:\framework-automation\src
dotnet test
```

### Tests Específicos

```bash
# Solo tests web
dotnet test --filter "TestCategory=web"

# Solo tests API
dotnet test --filter "TestCategory=api"

# Solo smoke tests
dotnet test --filter "TestCategory=smoke"

# Por nombre
dotnet test --filter "FullyQualifiedName~GoogleSearch"
```

### Con Tags Múltiples

```bash
# Web + smoke
dotnet test --filter "TestCategory=web&TestCategory=smoke"

# Excluir flaky
dotnet test --filter "TestCategory!=flaky"
```

### En Paralelo

```bash
# Release configuration (paralelo por defecto)
dotnet test --configuration Release
```

---

## CREAR NUEVOS TESTS

### Paso 1: Crear Feature File

`BDD/Features/MyFeature.feature`:

```gherkin
@web @smoke
Feature: Mi Funcionalidad
  Como usuario
  Quiero hacer algo
  Para obtener un resultado

  Scenario: Mi escenario
    Given estoy en la página
    When hago algo
    Then veo un resultado
```

### Paso 2: Crear Locators

`POM/MyApp/Locators/MyPageLocators.cs`:

```csharp
namespace Scaffolding.Tests.POM.MyApp.Locators;

public static class MyPageLocators
{
    public const string UsernameInput = "[name='username']";
    public const string PasswordInput = "[name='password']";
    public const string SubmitButton = "[type='submit']";
}
```

### Paso 3: Crear Actions

`POM/MyApp/Actions/MyPageActions.cs`:

```csharp
using Scaffolding.Tests.ScreenPlay.Web.Interactions;

namespace Scaffolding.Tests.POM.MyApp.Actions;

public static class MyPageActions
{
    public static Enter EnterUsername(string username) =>
        Enter.TheText(username).Into(MyPageLocators.UsernameInput);
    
    public static Click ClickSubmit() =>
        Click.On(MyPageLocators.SubmitButton);
}
```

### Paso 4: Crear Steps

`BDD/Steps/MyFeatureSteps.cs`:

```csharp
using Framework.Core.ScreenPlay;

namespace Scaffolding.Tests.BDD.Steps;

[Binding]
public class MyFeatureSteps
{
    private readonly IActor _actor;
    
    public MyFeatureSteps(IActor actor) => _actor = actor;

    [Given("estoy en la página")]
    public async Task GivenOnPage()
    {
        await _actor.AttemptsToAsync(
            new NavigateTo("https://example.com")
        );
    }
}
```

### Paso 5: Ejecutar

```bash
dotnet test --filter "FullyQualifiedName~MyFeature"
```

---

## CONFIGURACIÓN

### appsettings.json

```json
{
  "Framework": {
    "Environment": "Development",
    "Headless": true,
    "Timeouts": {
      "GlobalTimeoutSeconds": 30
    },
    "Evidence": {
      "Screenshot": "PreAndPost",
      "Video": "OnFailure"
    }
  },
  "Device": {
    "Browser": "Chromium",
    "Viewport": [1920, 1080]
  },
  "Allure": {
    "ResultsDirectory": "allure-results",
    "AutoOpenReport": false,
    "ReportPort": 56789
  }
}
```

### Configuración por Entorno

**Desarrollo** (`appsettings.Development.json`):
```json
{
  "Framework": {
    "Headless": false,
    "Evidence": {
      "Screenshot": "Always",
      "Video": "Always"
    }
  }
}
```

**Producción** (`appsettings.Production.json`):
```json
{
  "Framework": {
    "Headless": true,
    "Evidence": {
      "Screenshot": "OnFailure",
      "Video": "OnFailure"
    },
    "Parallelism": {
      "MaxWorkers": 8
    }
  }
}
```

---

## REPORTES

### Allure Report

#### 1. Ejecutar Tests

```bash
dotnet test
```

#### 2. Abrir Reporte

```bash
# Opción A: Automático (si AutoOpenReport: true)
# Se abre automáticamente al finalizar

# Opción B: Manual
cd Scaffolding.Tests
pwsh bin/Release/net10.0/playwright.ps1 show-report allure-results
```

#### 3. Generar Reporte Estático

```bash
allure generate allure-results --clean -o allure-report
allure open allure-report
```

### Evidencias

Las evidencias se guardan en:

```
evidence/
├── screenshots/
├── videos/
└── traces/
```

---

## SOLUCIÓN DE PROBLEMAS

### Error: "No se encuentra Playwright"

**Solución:**
```bash
cd Scaffolding.Tests
pwsh bin/Release/net10.0/playwright.ps1 install
```

### Error: "Tests no se ejecutan"

**Verificar:**
1. Build exitoso: `dotnet build`
2. Tests descubiertos: `dotnet test --list-tests`
3. Tags correctos: `dotnet test --filter "TestCategory=web"`

### Error: "Element not found"

**Solución:**
1. Verificar selector en Locators
2. Aumentar timeout: `PomHelpers.WaitForElementVisibleAsync(locator, 60000)`
3. Usar retry: `PomHelpers.ClickWithRetryAsync(locator)`

### Error: "Flaky tests"

**Solución:**
1. Agregar tag `@flaky`
2. Configurar reintentos en configuración
3. Usar `PomHelpers.ClickWithRetryAsync()`

### Error: "Allure no se abre"

**Solución:**
```bash
# Instalar Allure CLI
choco install allure

# O usar Playwright
pwsh bin/Release/net10.0/playwright.ps1 show-report allure-results
```

---

## PREGUNTAS FRECUENTES

### ¿Puedo usar este framework para múltiples aplicaciones?

**Sí.** Cada aplicación tiene su carpeta en `POM/`:

```
POM/
├── Application1/
├── Application2/
└── Application3/
```

### ¿Cómo agrego una nueva base de datos?

1. Heredar de `DatabaseConnection`
2. Implementar `CreateConnection()`
3. Usar en tus tests

```csharp
public class MyDbConnection : DatabaseConnection
{
    protected override IDbConnection CreateConnection()
    {
        return new MyDbConnection(ConnectionString);
    }
}
```

### ¿Cómo configuro proxies?

En `appsettings.json`:

```json
{
  "Device": {
    "Proxy": {
      "Server": "http://proxy.company.com:8080",
      "Username": "user",
      "Password": "pass"
    }
  }
}
```

### ¿Cómo ejecuto en CI/CD?

```yaml
# Azure DevOps
- task: DotNetCoreCLI@2
  displayName: 'Run Tests'
  inputs:
    command: 'test'
    arguments: '--configuration Release --logger "trx"'
```

---

## SOPORTE

- **Documentación**: `/docs/` folder
- **Arquitectura**: `01_ARCHITECTURE.md`
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

---

*Enterprise Automation Framework - Guía de Usuario*
