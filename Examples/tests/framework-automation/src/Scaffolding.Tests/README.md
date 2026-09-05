# Scaffolding.Tests - Enterprise Automation Framework

Este proyecto es una **plantilla completa y profesional** para crear tests de automatización usando el Enterprise Automation Framework.

## 📁 Estructura por Patrones

```
Scaffolding.Tests/
├── 📂 BDD/                          # Patrón BDD (Gherkin + Steps)
│   ├── Features/                    # Feature files (.feature)
│   ├── Steps/                       # Step definitions
│   └── Hooks/                       # Before/After hooks
│
├── 📂 ScreenPlay/                   # Patrón ScreenPlay
│   ├── Web/                         # Web interactions & questions
│   ├── Api/                         # API interactions & questions
│   └── Mobile/                      # Mobile interactions (futuro)
│
└── 📂 POM/                          # Patrón Page Object Model
    ├── Google/                      # Por aplicación/página
    │   ├── Locators/                # Solo selectores
    │   └── Actions/                 # Solo comportamiento
    ├── Application2/
    └── Application3/
```

## 🎯 Patrones Implementados

### 1. BDD (Behavior-Driven Development)
- **Features**: Escenarios en Gherkin
- **Steps**: Implementación de steps
- **Hooks**: Lifecycle management

### 2. ScreenPlay Pattern
- **Actor**: Entidad que realiza acciones
- **Tasks**: Acciones de negocio (componibles)
- **Interactions**: Acciones técnicas (atómicas)
- **Questions**: Consultas de estado

### 3. POM (Page Object Model) Segmentado
- **Locators**: Solo selectores (fáciles de mantener)
- **Actions**: Solo comportamiento (reutilizable)

## 🚀 Quick Start

### 1. Restaurar
```bash
cd d:\framework-automation\src
dotnet restore
```

### 2. Instalar Playwright
```bash
cd Scaffolding.Tests
pwsh bin/Debug/net10.0/playwright.ps1 install
```

### 3. Ejecutar Tests
```bash
# Todos los tests
dotnet test

# Solo tests web
dotnet test --filter "TestCategory=web"

# Solo smoke tests
dotnet test --filter "TestCategory=smoke"
```

## 📝 Crear Nuevos Tests

### 1. Crear Feature File (BDD)

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

### 2. Crear Locators (POM)

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

### 3. Crear Actions (POM)

`POM/MyApp/Actions/MyPageActions.cs`:
```csharp
using Scaffolding.Tests.ScreenPlay.Web;

namespace Scaffolding.Tests.POM.MyApp.Actions;

public static class MyPageActions
{
    public static Enter EnterUsername(string username) =>
        Enter.TheText(username).Into(MyPageLocators.UsernameInput);
    
    public static Click ClickSubmit() =>
        Click.On(MyPageLocators.SubmitButton);
}
```

### 4. Crear Steps (BDD)

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
    public async Task GivenEstoyEnLaPagina()
    {
        await _actor.AttemptsToAsync(
            new NavigateTo("https://example.com")
        );
    }
}
```

## 🏷️ Tags para CI/CD

### Por Tipo
- `@web` - Tests de UI Web
- `@api` - Tests de API
- `@mobile` - Tests de Mobile

### Por Criticidad
- `@smoke` - Critical path (< 5 min)
- `@regression` - Suite completa
- `@sanity` - Sanity check

### Por Aplicación
- `@app1` - Application 1
- `@app2` - Application 2
- `@app3` - Application 3

## 📖 Recursos

- [Framework README](../../README.md)
- [Architecture](../../docs/ARCHITECTURE_2_PROJECTS.md)
