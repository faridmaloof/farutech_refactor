# Enterprise Automation Framework

[![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![Playwright](https://img.shields.io/badge/Playwright-1.58-2EAD33?logo=playwright)](https://playwright.dev/dotnet/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Framework de automatización empresarial basado en **.NET 10**, **Playwright** y **Screenplay Pattern**.

## 🚀 Quick Start

```bash
# 1. Restaurar
cd src
dotnet restore

# 2. Instalar Playwright
cd Scaffolding.Tests
pwsh bin/Release/net10.0/playwright.ps1 install

# 3. Ejecutar tests
dotnet test
```

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [Quick Start](docs/00_QUICKSTART.md) | Inicio rápido (5 min) |
| [Arquitectura](docs/01_ARCHITECTURE.md) | Arquitectura completa |
| [Guía de Usuario](docs/02_USER_GUIDE.md) | Guía detallada |
| [Mejores Prácticas](docs/03_BEST_PRACTICES.md) | Convenciones y tips |

## 📦 Estructura

```
src/
├── Framework.Core/           # Núcleo reutilizable
│   ├── ScreenPlay/           # Actor, Tasks, Interactions, Questions
│   ├── Configuration/        # Settings con enums
│   ├── Tools/                # Database (8 motores), Allure
│   └── POM/                  # BasePage, PomHelpers
│
└── Scaffolding.Tests/        # Tests de ejemplo
    ├── BDD/                  # Features, Steps, Hooks
    ├── ScreenPlay/           # Web Tasks, Interactions, Questions
    └── POM/                  # Google Page Objects
```

## 🎯 Características

- **ScreenPlay Pattern** - Actor, Abilities, Tasks, Interactions, Questions
- **Multi-Navegador** - Chrome, Edge, Firefox, Safari, IE, Thorium, Brave, Opera
- **8 Motores DB** - SQL Server, Oracle, PostgreSQL, MySQL, MariaDB, MongoDB, Redis
- **Observabilidad** - Prometheus, Grafana, OpenTelemetry
- **Allure Reporting** - Screenshots, video, traces
- **CI/CD Ready** - Tags (@smoke, @web, @api, @regression)

## ⚙️ Configuración

### appsettings.json
```json
{
  "Framework": {
    "Evidence": { "Screenshot": "PreAndPost" },
    "Parallelism": { "MaxWorkers": 4 }
  },
  "Device": { "Browser": "Chrome" },
  "Allure": { "AutoOpenReport": false }
}
```

### Multi-Navegador
```json
{ "Device": { "Browser": "Edge" } }
```

### Observabilidad
```json
{
  "Framework": {
    "Observability": {
      "Mode": "Direct",
      "PrometheusEndpoint": "http://localhost:9090",
      "GrafanaEndpoint": "http://localhost:3000"
    }
  }
}
```

## 🏷️ Ejecución por Tags

```bash
# Por tipo
dotnet test --filter "TestCategory=web"
dotnet test --filter "TestCategory=api"

# Por criticidad
dotnet test --filter "TestCategory=smoke"
dotnet test --filter "TestCategory=regression"

# Combinar
dotnet test --filter "TestCategory=web&TestCategory=smoke"
```

## 📊 Build Status

```bash
dotnet build --configuration Release
# 0 warnings, 0 errors
```

## 🤝 Contribuir

1. Fork
2. Feature branch
3. Tests passing
4. PR

## 📄 License

MIT License - ver [LICENSE](LICENSE)

---

*Construido con ❤️ para automatización empresarial*
