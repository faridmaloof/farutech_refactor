# Enterprise Automation Framework - Mejores Prácticas

**Versión:** 1.0  
**Fecha:** 2026-03-14  
**Estado:** ✅ **PRODUCCIÓN**

---

## 📋 ÍNDICE

1. [ScreenPlay Pattern](#screenplay-pattern)
2. [Page Object Model](#page-object-model)
3. [BDD](#bdd)
4. [Configuración](#configuración)
5. [Tests](#tests)
6. [Mantenimiento](#mantenimiento)
7. [Performance](#performance)

---

## SCREENPLAY PATTERN

### ✅ HACER

**Usar nombres descriptivos:**
```csharp
// ✅ BIEN
public class LoginToApplication : Task { }
public class SearchForProduct : Task { }

// ❌ MAL
public class DoLogin : Task { }
public class ClickButton : Task { }
```

**Componer Tasks de Interactions:**
```csharp
// ✅ BIEN
public class LoginToApp : Task
{
    public override async Task PerformAsAsync(IActor actor)
    {
        await actor.AttemptsToAsync(
            Enter.TheText(username).Into("#user"),
            Enter.TheText(password).Into("#pass"),
            Click.On("#submit")
        );
    }
}

// ❌ MAL - Lógica de negocio en Steps
[When("login")]
public async Task WhenLogin()
{
    await _actor.AttemptsToAsync(
        Enter.TheText("user").Into("#user"),  // ❌ Esto debería ser Task
        Enter.TheText("pass").Into("#pass"),
        Click.On("#submit")
    );
}
```

**Usar Questions para assertions:**
```csharp
// ✅ BIEN
var title = await _actor.AsksForAsync(PageTitle.Value());
title.Should().Contain("Google");

// ❌ MAL
var page = _actor.AbilityTo<BrowseTheWeb>().Page;
var title = await page.TitleAsync();
title.Should().Contain("Google");
```

### ❌ NO HACER

1. **No mezclar Tasks con Steps**
2. **No poner lógica de negocio en Steps**
3. **No acceder directamente al Page desde Steps**
4. **No crear Tasks demasiado grandes**

---

## PAGE OBJECT MODEL

### ✅ HACER

**Separar Locators de Actions:**
```csharp
// ✅ BIEN - Locators
public static class LoginPageLocators
{
    public const string UsernameInput = "[name='username']";
    public const string PasswordInput = "[name='password']";
}

// ✅ BIEN - Actions
public static class LoginPageActions
{
    public static Enter EnterUsername(string username) =>
        Enter.TheText(username).Into(LoginPageLocators.UsernameInput);
}
```

**Usar data-testid:**
```csharp
// ✅ BIEN - Estable
public const string SubmitButton = "[data-testid='submit-button']";

// ❌ MAL - Frágil
public const string SubmitButton = "button:nth-child(3) > div > span";
```

**Heredar de BasePage:**
```csharp
// ✅ BIEN
public class LoginPage : BasePage
{
    public override string PageUrl => "/login";
    public override string PageTitle => "Login - My App";
}
```

### ❌ NO HACER

1. **No mezclar selectores con comportamiento**
2. **No usar XPath complejos**
3. **No usar índices (nth-child)**
4. **No hardcodear URLs en tests**

---

## BDD

### ✅ HACER

**Escenarios pequeños y focales:**
```gherkin
# ✅ BIEN - Un solo comportamiento
Scenario: User can login with valid credentials
  Given the user is on the login page
  When they login with valid credentials
  Then they should see the home page

# ❌ MAL - Múltiples comportamientos
Scenario: Login and search and logout
  Given the user logs in
  When they search for a product
  And they add it to cart
  And they checkout
  Then they should see confirmation
  And they should logout
```

**Usar tags apropiados:**
```gherkin
# ✅ BIEN
@web @smoke @login
Scenario: Valid login

@web @regression @search
Scenario: Search products

@api @smoke @users
Scenario: Create user
```

**Mantener steps reutilizables:**
```csharp
// ✅ BIEN - Genérico
[When("they search for {string}")]
public async Task WhenSearch(string query) { }

// ❌ MAL - Muy específico
[When("they search for products with {string}")]
public async Task WhenSearchProducts(string query) { }
```

### ❌ NO HACER

1. **No crear escenarios gigantes**
2. **No usar steps demasiado específicos**
3. **No hardcodear datos en Gherkin**
4. **No mezclar UI y API en mismo escenario**

---

## CONFIGURACIÓN

### ✅ HACER

**Usar variables de entorno en CI:**
```json
{
  "Framework": {
    "Environment": "${ENVIRONMENT}",
    "Headless": "${HEADLESS}"
  }
}
```

**Crear configs por entorno:**
```
appsettings.json                 # Base
appsettings.Development.json     # Local
appsettings.Staging.json         # QA
appsettings.Production.json      # Prod
```

**Validar configuración:**
```csharp
public class FrameworkSettingsValidator
{
    public FrameworkSettingsValidator()
    {
        RuleFor(x => x.Environment).NotEmpty();
        RuleFor(x => x.Timeouts.GlobalTimeoutSeconds).GreaterThan(0);
    }
}
```

### ❌ NO HACER

1. **No commitear secrets**
2. **No hardcodear URLs**
3. **No usar appsettings.Local.json en repo**
4. **No mezclar configs de entornos**

---

## TESTS

### ✅ HACER

**Tests independientes:**
```csharp
// ✅ BIEN - Cada test es independiente
[Scenario]
public async Task Test1()
{
    // Setup propio
    // Test
    // Cleanup
}

[Scenario]
public async Task Test2()
{
    // Setup propio (no depende de Test1)
    // Test
    // Cleanup
}
```

**Usar builders para datos:**
```csharp
// ✅ BIEN
var user = UserBuilder.Valid()
    .WithUsername("test")
    .WithEmail("test@example.com")
    .Build();

// ❌ MAL
var user = new User
{
    Username = "test",
    Email = "test@example.com",
    Password = "pass123",
    FirstName = "John",
    LastName = "Doe"
};
```

**Limpiar después de cada test:**
```csharp
[AfterScenario]
public async Task AfterScenario()
{
    // Cerrar browser
    // Limpiar datos
    // Resetear estado
}
```

### ❌ NO HACER

1. **No depender del orden de tests**
2. **No compartir estado entre tests**
3. **No hardcodear datos de test**
4. **No olvidar cleanup**

---

## MANTENIMIENTO

### ✅ HACER

**Actualizar selectores centralmente:**
```csharp
// ✅ BIEN - Un solo lugar
public static class LoginPageLocators
{
    public const string UsernameInput = "[name='username']";
}

// Usar en todos lados
Enter.TheText("user").Into(LoginPageLocators.UsernameInput);
```

**Documentar cambios:**
```csharp
/// <summary>
/// Login page locators.
/// Updated: 2026-03-14 - Changed selector due to UI update
/// </summary>
public static class LoginPageLocators { }
```

**Usar nombres consistentes:**
```csharp
// ✅ BIEN - Convención consistente
public class LoginToApplication : Task { }
public class SearchForProduct : Task { }
public class LogoutFromApplication : Task { }

// ❌ MAL - Mezcla de convenciones
public class DoLogin : Task { }
public class ProductSearch : Task { }
public class Logout : Task { }
```

### ❌ NO HACER

1. **No modificar Framework.Core**
2. **No copiar y pegar código**
3. **No ignorar warnings del build**
4. **No commitear sin hacer build**

---

## PERFORMANCE

### ✅ HACER

**Usar headless en CI:**
```json
{
  "Framework": {
    "Headless": true
  }
}
```

**Configurar paralelismo:**
```json
{
  "Parallelism": {
    "MaxWorkers": 4
  }
}
```

**Usar waits explícitos:**
```csharp
// ✅ BIEN - Wait explícito
await PomHelpers.WaitForElementVisibleAsync(locator);
await locator.ClickAsync();

// ❌ MAL - Thread.Sleep
Thread.Sleep(5000);
await locator.ClickAsync();
```

**Optimizar screenshots:**
```json
{
  "Evidence": {
    "Screenshot": "OnFailure",  // ✅ En CI
    "Video": "OnFailure"
  }
}
```

### ❌ NO HACER

1. **No usar Thread.Sleep**
2. **No capturar screenshots siempre en CI**
3. **No ejecutar en headed en CI**
4. **No olvidar configurar workers**

---

## CHECKLIST DE REVISIÓN

### Antes de Commit

- [ ] Build exitoso (`dotnet build`)
- [ ] Tests pasando (`dotnet test`)
- [ ] Sin warnings
- [ ] Código formateado
- [ ] Comments en inglés o español (consistente)

### Antes de Merge

- [ ] Code review aprobado
- [ ] Tests de integración pasando
- [ ] Documentación actualizada
- [ ] No romper tests existentes

### Después de Merge

- [ ] Verificar CI pipeline
- [ ] Verificar reportes
- [ ] Monitorear flakiness

---

## SOPORTE

- **Documentación**: `/docs/` folder
- **Arquitectura**: `01_ARCHITECTURE.md`
- **User Guide**: `02_USER_GUIDE.md`
- **Issues**: GitHub Issues

---

*Enterprise Automation Framework - Mejores Prácticas*
