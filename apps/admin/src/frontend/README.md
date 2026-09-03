# Farutech — Admin Panel (tests)

Proyecto de automatización de pruebas del **Admin Panel** (React + Vite) usando
el stack .NET 10 + Reqnroll + ScreenPlay, reutilizando `Framework.Core` vía
`ProjectReference` compartido.

## 📁 Estructura

```
apps/admin/
├── src/                 # Front React+Vite (scaffold; depende de @farutech/design-system)
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── pages/{LoginPage, DashboardPage}.tsx
│       └── styles/index.css
└── test/                # Automatización .NET
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
dotnet restore
# Requiere el Admin corriendo (http://admin.farutech.local) y la API (http://api.farutech.local)
dotnet test --filter "TestCategory=smoke"
# Interfaz web (Playwright)
dotnet test --filter "TestCategory=web"
```

> ⚠️ `Framework.Core` **NO se copia**: los tests lo referencian desde
> `tests/framework-automation/src/Framework.Core/`.

## 🎨 Front (dev)

```bash
cd apps/admin/src
npm install
npm run dev   # http://localhost:5174
```
