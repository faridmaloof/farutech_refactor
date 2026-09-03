# Farutech — Intranet Tests

Proyecto de automatización de pruebas de la **Intranet** (colaboradores) basado en el
[Enterprise Automation Framework](../../../tests/framework-automation/README.md)
(.NET 10 + Reqnroll + ScreenPlay + Playwright).

> ⚠️ El proyecto **NO copia** `Framework.Core`: lo referencia vía
> `ProjectReference` al repositorio compartido en `tests/framework-automation`.
> Esto ahorra inodos y mantiene una única fuente del framework.

## 📁 Estructura

```
apps/intranet/test/
├── BDD/
│   ├── Features/       # Features Gherkin (es-CO)
│   ├── Steps/          # Step definitions (IntranetSteps.cs)
│   └── Hooks/          # Ciclo de vida (GlobalHooks.cs)
├── ScreenPlay/Web/
│   ├── Interactions/
│   └── Questions/
├── appsettings.json
├── appsettings.Production.json
└── Farutech.Intranet.Tests.csproj   # Apunta a Framework.Core compartido
```

## 🚀 Ejecución

```bash
cd apps/intranet/test
dotnet restore
dotnet test

# Solo smoke
dotnet test --filter "TestCategory=smoke"
# Solo Intranet
dotnet test --filter "TestCategory=web"
```

## ⚙️ Configuración

- `FaruTech:AppBaseUrl` → base de la intranet (`apps/intranet/src`).
- `FaruTech:ApiBaseUrl` → `http://api.farutech.local` (Sanctum).
- Credentials de colaborador: resolver vía variables de entorno
  `FaruTech__Intranet__Email` / `FaruTech__Intranet__Password` o `appsettings.json`.

> El front consumidor está en `apps/intranet/src/` (React+Vite, `:5175`).
