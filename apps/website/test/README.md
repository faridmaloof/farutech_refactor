# Farutech — Website Tests

Automatización de pruebas del **Website público** (React + Vite) mediante el
stack .NET 10 + Reqnroll + ScreenPlay + Playwright, reutilizando `Framework.Core`
vía `ProjectReference` compartido.

## 📁 Estructura

```
apps/website/test/
├── BDD/Features/{Home, Services, Newsletter}.feature
├── BDD/Steps/WebsiteSteps.cs
├── BDD/Hooks/GlobalHooks.cs
├── ScreenPlay/Web/{Interactions, Questions}
├── appsettings.json
├── appsettings.Production.json
└── Farutech.Website.Tests.csproj
```

## 🧪 Ejecutar tests

```bash
cd apps/website/test
dotnet test
# Solo smoke
dotnet test --filter "TestCategory=smoke"
```

> ⚠️ `Framework.Core` **NO se copia**: los tests lo refencian desde
> `tests/framework-automation/src/Framework.Core/`.

Relacionado: front del website en `apps/website/src/` (Vite dev servers en `:3000`).
