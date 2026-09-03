# Farutech — Intranet App (tests)

Proyecto de automatización de pruebas de la **Intranet** (colaboradores) usando
el stack .NET 10 + Reqnroll + ScreenPlay, reutilizando `Framework.Core` vía
`ProjectReference`.

## 📁 Estructura

```
apps/intranet/
├── src/                 # Front React+Vite (scaffold)
│   └── src/{App.tsx, pages/LoginPage.tsx, pages/DashboardPage.tsx, ...}
└── test/                # Automatización .NET
    ├── BDD/Features/{Login, Dashboard}.feature
    ├── BDD/Steps/IntranetSteps.cs
    ├── BDD/Hooks/GlobalHooks.cs
    ├── ScreenPlay/Web/{Interactions, Questions}
    ├── appsettings.json
    └── Farutech.Intranet.Tests.csproj
```

## 🧪 Ejecutar tests

```bash
cd apps/intranet/test
dotnet test --filter "TestCategory=web"
```

> ⚠️ `Framework.Core` **NO se copia**: los tests lo refencian desde
> `tests/framework-automation/src/Framework.Core/`.

## 🎨 Front (dev)

```bash
cd apps/intranet/src
npm install
npm run dev   # http://localhost:5175
```
