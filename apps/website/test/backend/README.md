# Farutech.Api.Tests

Proyecto de **automatización de pruebas para la API de Farutech** basado en el
[Enterprise Automation Framework](../../../tests/framework-automation/README.md)
(.NET 10 + Reqnroll + ScreenPlay + RestSharp + Playwright).

> ⚠️ El proyecto **NO copia** `Framework.Core`: lo referencia vía
> `ProjectReference` al repositorio compartido en `tests/framework-automation`.
> Esto ahorra inodos y mantiene una única fuente del framework.

## 📁 Estructura

```
apps/api/test/
├── BDD/
│   ├── Features/       # Features Gherkin (es-CO)
│   ├── Steps/          # Step definitions (ApiSteps.cs)
│   └── Hooks/          # Ciclo de vida @api (GlobalHooks.cs)
├── ScreenPlay/Api/
│   ├── Interactions/   # CallAnApi, Get/Post/Put/Patch/Delete (JSON + Bearer)
│   └── Questions/      # ResponseStatus, ResponseBody*, ResponseToken
├── appsettings.json    # Config base (FaruTech:ApiBaseUrl, credenciales)
├── appsettings.Production.json
└── Farutech.Api.Tests.csproj   # Apunta a Framework.Core compartido
```

## 🚀 Ejecución

```bash
# Desde apps/api/test
dotnet restore
dotnet test

# Solo smoke
dotnet test --filter "TestCategory=smoke"

# Solo API
dotnet test --filter "TestCategory=api"
```

## ⚙️ Configuración

Las credenciales de administrador **NUNCA van hardcodeadas**. Se resuelven así:

1. Variables de entorno: `FaruTech__AdminApi__Email`, `FaruTech__AdminApi__Password`
2. `appsettings.json` → sección `FaruTech.AdminApi`

Las URLs de entorno:

```bash
$env:FaruTech__ApiBaseUrl = "http://api.farutech.local"
$env:FaruTech__AdminApi__Email = "admin@ejemplo.com"
$env:FaruTech__AdminApi__Password = "ClaveSegura..."
$env:FaruTech__Postgres__ConnectionString = "Host=127.0.0.1;Database=farutech;Username=farutech;Password=..."
```

## 📋 Cobertura

| Feature | Componente | Escenarios |
|---------|------------|------------|
| `Auth.feature` | Login/logout Sanctum, /user | 5 |
| `UsersApi.feature` | CRUD /users | 4 |
| `BlogApi.feature` | Blog público + admin | 4 |
| `ContactNewsletterApi.feature` | /contact, /newsletter (+ integración BD) | 5 |
| `SettingsApi.feature` | /settings/public, /admin/settings, dashboard | 5 |
| `LeadsApi.feature` | /admin/leads, /admin/leads/stats | 4 |

**Total: 27 escenarios** (smoke: 8, integración: 1).

## 📌 Notas

- Los escenarios `@integration` requieren la infraestructura levantada
  (`docker compose up -d` en `infrastructure/`) y PostgreSQL accesible.
- Los escenarios `@api` requieren el backend corriendo en `http://api.farutech.local`
  y un usuario administrador (ver `app/Console/Commands/CreateAdminUser.php`).