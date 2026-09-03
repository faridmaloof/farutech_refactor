# Farutech — Admin Tests

Automatización de pruebas del **Admin Panel** (React + Vite) mediante el stack
.NET 10 + Reqnroll + ScreenPlay + Playwright, reutilizando `Framework.Core` vía
`ProjectReference` compartido.

## 📁 Estructura

```
apps/admin/test/
├── BDD/Features/{Login, Dashboard}.feature
├── BDD/Steps/AdminSteps.cs
├── BDD/Hooks/GlobalHooks.cs
├── ScreenPlay/Web/{Interactions, Questions}
├── appsettings.json
└── Farutech.Admin.Tests.csproj
```

## 🧪 Ejecutar tests

```bash
cd apps/admin/test
dotnet test --filter "TestCategory=smoke"
dotnet test --filter "TestCategory=web"
```

> ⚠️ `Framework.Core` **NO se copia**: los tests lo refencian desde
> `tests/framework-automation/src/Framework.Core/`.

Relacionado: front del admin en `apps/admin/src/` (Vite dev server en `:5174`).
