# TASK-402 — ADR: Gitea vs GitHub Actions para CI/CD

**Estado:** DECIDIDO (2026-08-30) — **GitHub Actions con runner self-hosted en Pi 4B**.

## Contexto

El plan original (`DEPLOY-PI-K3S.md`) asumía Gitea como servidor Git + CI/CD local.
Desde entonces:
1. Los 7 repos Farutech ya viven en `github.com/Farutech` (TASK-101).
2. No hay restricción técnica que impida usar Actions (los repos están en GitHub).
3. El hardware Dev (Pi 4B + Pi 2B) ya existe y corre K3s (TASK-401).

## Comparación

| Factor | Gitea (local) | GitHub Actions (self-hosted) |
|--------|---------------|------------------------------|
| **Infra a mantener** | Servidor Gitea + runner CI propio | Solo runner (Actions corre en GitHub) |
| **Latencia push→build** | Baja (red local, 1-5ms) | Baja (runner local, 1-5ms) |
| **Visibilidad** | Solo LAN (sin internet) | Secretos en GitHub (pero repos privados) |
| **Mantenimiento** | Actualizar Gitea + CI config + backups 0 | Mantener solo el runner (`actions/runner`) |
| **Integración PR** | Manual (webhooks custom) | Nativa (checks en PR, status, merge gates) |
| **Costos** | Hosting + storage | Incluido en GitHub Free (2000 min/mes para privados; self-hosted ilimitado) |
| **Secrets** | Propios (sin dependencia externa) | GitHub Secrets + OIDC |
| **Marketplace/Actions** | No compatible | 20k+ acciones preconstruidas |

## Decisión

**GitHub Actions con runner self-hosted en Pi 4B.** Razones:

1. **Cero infra nueva** — no hay que montar ni mantener Gitea.
2. **Integración nativa** — PR checks, status badges, merge gates sin webhooks extra.
3. **Ecosistema** — 20k+ acciones del marketplace (deploy K3s, docker build, slack, etc.).
4. **Self-hosted ilimitado** — sin límite de minutos para repos privados.
5. **Único punto a mantener** — el runner (`gh runner --replace`).

## Runner setup

```bash
# En Pi 4B (dentro del clúster o como servicio systemd):
mkdir ~/actions-runner && cd ~/actions-runner
curl -o actions-runner-linux-arm64.tar.gz -L \
  https://github.com/actions/runner/releases/latest/download/actions-runner-linux-arm64.tar.gz
tar xzf actions-runner-linux-arm64.tar.gz
./config.sh --url https://github.com/Farutech --token <REG_TOKEN>
./run.sh
# → systemd: sudo ./svc.sh install && sudo ./svc.sh start
```

## Implementación post-decisión

- Cada repo tendrá `.github/workflows/` con workflows mínimos de build + test.
- Runner se instala en el control-plane Pi 4B (mismo nodo que K3s).
- Workflows despliegan a K3s vía `kubectl` usando el kubeconfig del runner.
- Secretos: `GH_TOKEN` + `KUBECONFIG` como GitHub Secrets del org o repo.

## Riesgos mitigados

- **Runner compromise**: el runner solo tiene acceso a los repos que autoriza la org.
  Workflows no privilegiados corren en contenedores efímeros (aislamiento por job).
- **Disponibilidad**: si el runner cae, el CI queda bloqueado. Mitigación:
  monitor con `healthcheck` y restart automático del servicio systemd.
- **Segregación**: los secrets del runner se rotan periódicamente vía GitHub UI.