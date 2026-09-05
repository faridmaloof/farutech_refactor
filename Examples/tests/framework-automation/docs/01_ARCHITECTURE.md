# Enterprise Automation Framework - Arquitectura

**Versión:** 1.0  
**Fecha:** 2026-03-14  
**Estado:** ✅ **PRODUCCIÓN**

---

## 📋 ÍNDICE

1. [Visión General](#visión-general)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Framework.Core](#frameworkcore)
4. [Scaffolding.Tests](#scaffoldingtests)
5. [ScreenPlay Pattern](#screenplay-pattern)
6. [Page Object Model](#page-object-model)
7. [BDD con Reqnroll](#bdd-con-reqnroll)
8. [Configuración](#configuración)
9. [Base de Datos](#base-de-datos)
10. [Allure Reporting](#allure-reporting)

---

## VISIÓN GENERAL

Enterprise Automation Framework es un framework de automatización empresarial basado en:

- **.NET 10** - Runtime moderno
- **Playwright** - Browser automation
- **ScreenPlay Pattern** - Patrón de automatización mantenible
- **BDD (Reqnroll)** - Especificaciones ejecutables
- **Allure** - Reportes profesionales

### Principios de Diseño

1. **Mantenibilidad** - Código fácil de entender y modificar
2. **Reutilización** - Máximo aprovechamiento de código existente
3. **Extensibilidad** - Fácil agregar nuevas capacidades
4. **Claridad** - Estructura obvia y predecible
5. **Performance** - Ejecución rápida y eficiente

---

## ESTRUCTURA DEL PROYECTO

```
src/
├── Framework.Core/              # Núcleo del framework (REUTILIZABLE)
│   ├── ScreenPlay/              # Actor, Tasks, Interactions, Questions
│   ├── POM/                     # BasePage, PomHelpers
│   ├── Tools/                   # Database, AllureReportHelper
│   ├── Exceptions/              # Excepciones base
│   └── Configuration/           # Settings (ISettings, AllureSettings)
│
└── Scaffolding.Tests/           # Tests específicos (PERSONALIZABLE)
    ├── BDD/                     # Features, Steps, Hooks
    ├── ScreenPlay/              # Tasks, Interactions, Questions específicas
    └── POM/                     # Locators, Actions específicos
```

### Reglas de Oro

1. **Framework.Core** - Solo código REUTILIZABLE y ESTÁNDAR
2. **Scaffolding.Tests** - Código ESPECÍFICO de tu proyecto
3. **Nunca modificar Core** directamente - Extender desde Scaffolding
4. **Una clase por archivo** - Fácil de encontrar y mantener

---

## FRAMEWORK.CORE

### ScreenPlay/

Contiene las interfaces y clases base del ScreenPlay Pattern:

```
ScreenPlay/
├── IActor.cs                    # Contrato del Actor
├── IAbility.cs                  # Contrato de Habilidades
├── IAction.cs                   # Contrato de Acciones
├── ITask.cs                     # Contrato de Tareas
├── IInteraction.cs              # Contrato de Interacciones
├── IQuestion.cs                 # Contrato de Preguntas
├── Actor.cs                     # Implementación del Actor
├── ActorBuilder.cs              # Builder para crear Actores
├── DisposableAbility.cs         # Base para habilidades con recursos
├── Task.cs                      # Base para Tareas
├── Interaction.cs               # Base para Interacciones
├── Question.cs                  # Base para Preguntas
└── BrowseTheWeb.cs              # Habilidad estándar para Playwright
```

### POM/

Helpers estándar para Page Object Model:

```csharp
// BasePage.cs - Base para todas las páginas
public abstract class BasePage
{
    public abstract string PageUrl { get; }
    public abstract string PageTitle { get; }
}

// PomHelpers.cs - Helpers comunes
public static class PomHelpers
{
    public static Task WaitForElementVisibleAsync(ILocator locator, int timeoutMs = 30000);
    public static Task ClickWithRetryAsync(ILocator locator, int maxRetries = 3);
    public static Task EnterTextAsync(ILocator locator, string text);
}
```

### Tools/

Utilidades comunes:

```
Tools/
├── Database/                    # 8 motores de base de datos
│   ├── DatabaseConnection.cs    # Base abstracta
│   ├── SqlServerConnection.cs
│   ├── PostgreSqlConnection.cs
│   ├── MySqlConnection.cs
│   ├── OracleConnection.cs
│   ├── MariaDbConnection.cs
│   ├── MongoDbConnection.cs     # NoSQL
│   └── RedisConnection.cs       # NoSQL
└── AllureReportHelper.cs        # Generar y abrir reportes
```

### Configuration/

Configuración tipada:

```csharp
// AllureSettings.cs
public class AllureSettings
{
    public string ResultsDirectory { get; set; } = "allure-results";
    public string ProjectName { get; set; } = "Enterprise Automation Framework";
    public bool AutoOpenReport { get; set; } = false;  // No abrir automáticamente
    public int ReportPort { get; set; } = 56789;
}
```

---

## SCAFFOLDING.TESTS

### BDD/

Tests en formato Gherkin:

```
BDD/
├── Features/                    # Archivos .feature
│   └── GoogleSearch.feature
├── Steps/                       # Implementación de steps
│   └── GoogleSearchSteps.cs
└── Hooks/                       # Hooks de ciclo de vida
    └── GlobalHooks.cs
```

### ScreenPlay/

Implementaciones específicas de Web:

```
ScreenPlay/Web/
├── Tasks/                       # Tareas de negocio
│   └── NavigateTo.cs
├── Interactions/                # Interacciones técnicas
│   └── ClickAndEnter.cs
└── Questions/                   # Consultas de estado
    └── PageQuestions.cs
```

### POM/

Page Objects específicos:

```
POM/Google/
├── Locators/                    # Solo selectores
│   └── GooglePageLocators.cs
└── Actions/                     # Solo comportamiento
    └── GooglePageActions.cs
```

---

## SCREENPLAY PATTERN

### ¿Qué es ScreenPlay?

ScreenPlay Pattern es un patrón de automatización que modela:

- **Actor** - Quién ejecuta las acciones
- **Ability** - Qué puede hacer el actor
- **Task** - Tareas de negocio que realiza
- **Interaction** - Interacciones técnicas
- **Question** - Consultas sobre el estado

### Ejemplo de Uso

```csharp
// Crear actor con habilidad
var actor = new ActorBuilder("Test User")
    .WithAbility(BrowseTheWeb.With(page))
    .Build();

// Ejecutar tarea
await actor.AttemptsToAsync(
    new NavigateTo("https://google.com"),
    Enter.TheText("search").Into("[name='q']"),
    Click.On("[type='submit']")
);

// Consultar estado
var title = await actor.AsksForAsync(PageTitle.Value());
title.Should().Contain("Google");
```

### Jerarquía de Elementos

```
Actor (quien ejecuta)
├── Ability (lo que puede hacer)
│   └── BrowseTheWeb
├── Task (tarea de negocio)
│   └── NavigateTo
├── Interaction (acción técnica)
│   ├── Click
│   └── Enter
└── Question (consulta)
    ├── PageTitle
    └── ElementCount
```

---

## PAGE OBJECT MODEL

### Estructura Recomendada

```csharp
// 1. Locators (solo selectores)
public static class LoginPageLocators
{
    public const string UsernameInput = "[name='username']";
    public const string PasswordInput = "[name='password']";
    public const string SubmitButton = "[type='submit']";
}

// 2. Actions (solo comportamiento)
public static class LoginPageActions
{
    public static Enter EnterUsername(string username) =>
        Enter.TheText(username).Into(LoginPageLocators.UsernameInput);
    
    public static Click ClickSubmit() =>
        Click.On(LoginPageLocators.SubmitButton);
}

// 3. Tasks (composición de acciones)
public class LoginToApp : Task
{
    private readonly string _username;
    private readonly string _password;
    
    public override async Task PerformAsAsync(IActor actor)
    {
        await actor.AttemptsToAsync(
            LoginPageActions.EnterUsername(_username),
            LoginPageActions.EnterPassword(_password),
            LoginPageActions.ClickSubmit()
        );
    }
}
```

### Reglas POM

1. **Locators** - SOLO selectores, NUNCA comportamiento
2. **Actions** - SOLO comportamiento, NUNCA selectores directos
3. **Tasks** - Composición de Actions para tareas de negocio

---

## BDD CON REQNROLL

### Feature File

```gherkin
@web @smoke
Feature: Google Search
  As a user
  I want to search for concepts
  So that I can find information

  Scenario: Successful search
    Given the actor is on the Google home page
    When they search for ".NET"
    Then the page title should contain ".NET"
```

### Steps

```csharp
[Binding]
public class GoogleSearchSteps
{
    private readonly IActor _actor;
    
    public GoogleSearchSteps(IActor actor) => _actor = actor;
    
    [Given("the actor is on the Google home page")]
    public async Task GivenOnGooglePage()
    {
        await _actor.AttemptsToAsync(new NavigateTo("https://google.com"));
    }
    
    [When("they search for {string}")]
    public async Task WhenSearch(string query)
    {
        await _actor.AttemptsToAsync(
            Enter.TheText(query).Into("[name='q']"),
            Click.On("[type='submit']")
        );
    }
    
    [Then("the page title should contain {string}")]
    public async Task ThenTitleContains(string expected)
    {
        var title = await _actor.AsksForAsync(PageTitle.Value());
        title.Should().Contain(expected);
    }
}
```

### Hooks

```csharp
[Binding]
public class GlobalHooks
{
    [BeforeScenario("web")]
    public async Task BeforeWebScenario()
    {
        // Setup browser, context, page, actor
    }
    
    [AfterScenario]
    public async Task AfterScenario()
    {
        // Cleanup resources
    }
}
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
    "ProjectName": "My Tests",
    "AutoOpenReport": false,
    "ReportPort": 56789
  }
}
```

### Configuración por Entorno

```
appsettings.json                 # Base
appsettings.Development.json     # Desarrollo (headless: false)
appsettings.Staging.json         # Staging
appsettings.Production.json      # Producción (headless: true)
```

---

## BASE DE DATOS

### Conexión SQL Server

```csharp
using Framework.Core.Tools.Database;

var db = new SqlServerConnection(connectionString);
var users = await db.QueryAsync<User>("SELECT * FROM Users");
var user = await db.QueryFirstOrDefaultAsync<User>(
    "SELECT * FROM Users WHERE Id = @Id", 
    new { Id = 123 }
);
```

### Conexión MongoDB

```csharp
using Framework.Core.Tools.Database;

var mongo = new MongoDbConnection(connectionString, "mydb");
var users = await mongo.FindAsync<User>("users");
await mongo.InsertOneAsync("users", newUser);
```

---

## ALLURE REPORTING

### Configuración

```json
{
  "Allure": {
    "ResultsDirectory": "allure-results",
    "AutoOpenReport": false,
    "ReportPort": 56789
  }
}
```

### Abrir Reporte Manualmente

```csharp
using Framework.Core.Tools;

// Después de ejecutar tests
AllureReportHelper.OpenReport("allure-results");
```

### Generar Reporte

```csharp
// Generar reporte estático
AllureReportHelper.GenerateReport("allure-results", "allure-report");
```

---

## MEJORES PRÁCTICAS

### ✅ HACER

1. Usar ScreenPlay Pattern para todas las automatizaciones
2. Separar Locators de Actions en POM
3. Una clase por archivo
4. Namespaces consistentes
5. Tests independientes entre sí
6. Usar tags para organizar tests (@smoke, @regression)

### ❌ NO HACER

1. Modificar Framework.Core directamente
2. Mezclar selectores con comportamiento
3. Múltiples clases en un archivo
4. Tests que dependen de otros tests
5. Hardcoded values (usar configuración)
6. Selectores frágiles (usar data-testid)

---

## SOPORTE

- **Documentación**: `/docs/` folder
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

---

*Enterprise Automation Framework - Documentación de Arquitectura*
