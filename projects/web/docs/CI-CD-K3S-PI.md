# FaruTech — CI/CD ligero + despliegue en K3s (Raspberry Pi 4B)

Guía "nivel principiante" para desplegar la web FaruTech en el clúster **K3s**
de la Raspberry Pi (`192.168.1.5`, alias SSH `RBSV01_C`, usuario `sadmin`) y
automatizar el despliegue **en red local** (sin GitHub Actions, sin internet).

> ⚠️ **Ajuste de la estructura del repo:** tu descripción asumía `api/` en la
> raíz y Vite en la raíz. El repositorio ya fue reorganizado como monorepo
> `apps/` + `docker/`. Todo lo que sigue usa la estructura real:

```
farutech/
├── apps/backend/            # API Laravel/Lumen (PHP 8.3)
├── apps/frontend/           # SPA React + Vite (compila a dist/)
├── docker/backend.Dockerfile    # multi-etapa (composer → php-fpm+nginx)
├── docker/frontend.Dockerfile   # multi-etapa (node → nginx)
├── docker/nginx/default.conf    # SPA + proxy /api → backend:80
├── deploy/k3s/                  # manifiestos de Kubernetes (namespace hosting)
├── ci/                          # Gitea + registry + act_runner (CI/CD local)
├── scripts/                     # scripts de deploy/secret/kubeconfig
└── docs/CI-CD-K3S-PI.md         # este documento
```

---

## Arquitectura

```
        TU PC (navegador / git)
              │
              │  farutech-dev, api.farutech-dev  →  192.168.1.5
              │  git.local:3000 (Gitea web)
              ▼
┌────────────────────────────── RASPBERRY PI (192.168.1.5) ─────────────────────┐
│   K3s (apps reales)                 │   Docker del host (herramientas CI/CD)  │
│   ┌─────────────────────────┐       │   ┌───────────────────────────────────┐ │
│   │ namespace hosting       │       │   │ Gitea (repo + Actions)   :3000    │ │
│   │  ingress (traefik)      │       │   │ registry (imágenes)      :5000    │ │
│   │  frontend → backend     │       │   │ act_runner (ejecuta jobs)         │ │
│   │ namespace infra: mysql  │       │   └───────────────────────────────────┘ │
│   └─────────────────────────┘       │                                          │
└──────────────────────────────────────────────────────────────────────────────┘
  • build de imágenes: se hace EN la Pi (ARM64 nativo, sin cross-compile)
  • act_runner monta docker.sock → construye con el daemon del host
  • registry local → K3s (containerd) hace pull (inseguro en LAN)
```

**Flujo CI/CD:** `git push dev → Gitea → act_runner → docker build + push al
registry → kubectl set image → rollout (pods reinician) → verifica`.

`MySQL` está en el namespace `infra` y el backend lo alcanza por el nombre DNS
interno `mysql.infra.svc.cluster.local:3306`.

---

## Parte 1 — Análisis del repositorio (resumen)

Ya quedó hecho arriba, pero lo importante para el despliegue:

- **Backend (apps/backend):** Laravel/Lumen 10, PHP 8.3, usa MySQL. Las rutas se
  registran bajo el prefijo `api` (`/api/blog/...`). Necesita `APP_KEY`, `DB_*`.
- **Frontend (apps/frontend):** React + Vite 8. **No usa variables de entorno**
  para la URL de la API: hace `fetch('/api/...')` relativos. Por eso el nginx del
  frontend proxyea `/api/` → `backend:80` y **no hay que inyectar nada**.
- **Dockerfiles existentes** (los reutilizamos): `docker/backend.Dockerfile`
  instala `pdo, pdo_mysql, mbstring, exif, pcntl, bcmath, gd, zip` y corre
  Nginx+php-fpm bajo Supervisor en un único contenedor; `docker/frontend.Dockerfile`
  compila con Node y publica con Nginx. Son imágenes multi-arch (ARM64 OK).

No hizo falta crear Dockerfiles nuevos: ya están y cumplen los requisitos.

---

## Parte 2 — Manifiestos de Kubernetes (namespace `hosting`)

Todos están en `deploy/k3s/`:

| Archivo                          | Qué crea |
|----------------------------------|----------|
| `namespace.yaml`                 | Namespace `hosting` |
| `backend-configmap.yaml`         | ConfigMap `backend-config` (APP_*, DB_HOST=mysql.infra..., etc.) |
| `backend-deployment.yaml`        | Deployment `backend` (1 replica) + initContainer de migraciones |
| `backend-service.yaml`           | Service interno `backend:80` (sin puerto host) |
| `backend-storage-pvc.yaml`       | PVC para `/var/www/html/storage` (logs/cache) |
| `frontend-deployment.yaml`       | Deployment `frontend` (1 replica, sirve la SPA) |
| `frontend-service.yaml`          | Service interno `frontend:80` |
| `ingress.yaml`                   | Traefik: `farutech-dev`→frontend, `api.farutech-dev`→backend |

Decisiones importantes:

- **El frontend prontea `/api` al backend** mediante `docker/nginx/default.conf`
  (`proxy_pass http://backend:80;`). El nombre `backend` resuelve al Service del
  namespace `hosting`.
- **`api.farutech-dev` enruta directo al Service `backend`** (puerto 80, el Nginx
  interno de Laravel). Como Lumen registra las rutas bajo `/api`, la URL queda
  `http://api.farutech-dev/api/blog/posts`. `http://api.farutech-dev/` devuelve la
  versión de Lumen.
- **Conexión a MySQL en `infra`:** `DB_HOST=mysql.infra.svc.cluster.local` (en el
  ConfigMap) y las credenciales → Secret `backend-secrets` (ver Parte 4).
  Kubernetes **no permite referenciar un Secret de otro namespace** en un Pod, así
  que copiamos las credenciales a `hosting`.
- **Migraciones:** un `initContainer` ejecuta `php artisan migrate --force` antes
  de arrancar el pod (el `rollout` espera a que el init acabe).
- **Persistencia:** `backend-storage-pvc` (StorageClass `local-path` de K3s) monta
  `/var/www/html/storage`. Con `fsGroup: 82` (uid de `www-data`) php-fpm puede
  escribir en el volumen.
## Parte 6 — Aplicar los manifiestos y verificar

En la Pi (o en tu PC con `kubectl` apuntando al clúster):

```bash
cd ~/projects/farutech
./scripts/k8s-deploy.sh
```

O manualmente, paso a paso:

```bash
kubectl create namespace hosting

# Secreto (si no lo creaste en la Parte 4)
./scripts/copy-mysql-secret.sh

kubectl apply -f deploy/k3s/backend-configmap.yaml
kubectl apply -f deploy/k3s/backend-storage-pvc.yaml
kubectl apply -f deploy/k3s/backend-deployment.yaml
kubectl apply -f deploy/k3s/backend-service.yaml
kubectl apply -f deploy/k3s/frontend-deployment.yaml
kubectl apply -f deploy/k3s/frontend-service.yaml
kubectl apply -f deploy/k3s/ingress.yaml
```

> **Si K3s aún no tiene las imágenes** (primer despliegue), constrúyelas una vez
> en la Pi y súbelas al registry (o usa `docker save/load`). Ver Parte 7/8 para
> el registry. Alternativa rápida: construir con el daemon local y cargar con
> `k3s ctr images import`.

### Verificación

```bash
kubectl -n hosting get pods,svc,ingress
kubectl -n hosting rollout status deployment/backend
kubectl -n hosting rollout status deployment/frontend
```

Esperado: `pods` en `Running` (backend con 1/1, frontend con 1/1), `services`
backend y frontend, e `ingress` `farutech-ingress` con ambas reglas.

### Logs útiles si algo falla

```bash
kubectl -n hosting get events --sort-by=.lastTimestamp | tail -30
kubectl -n hosting logs deploy/backend  | tail -40
kubectl -n hosting logs deploy/frontend | tail -20
```

---

## Parte 7 — Selección del sistema CI/CD ligero

Evaluación para **ARM64 con pocos recursos** y **red local**:

| Herramienta     | RAM* | Repo + CI juntos | Webhook local | Comentario |
|-----------------|------|------------------|---------------|------------|
| **Gitea + Gitea Actions** | ~300 MB | ✅ sí | ✅ | 2 en 1 (repo + pipelines), ligera, web sencilla. **Elegida.** |
| Woodpecker CI    | ~200 MB | ❌ (solo CI) | ✅ | Muy ligera, compatible ARM/Docker, pero requiere repo aparte (Gitea/GitHub). Buena 2.ª opción. |
| Drone CI + runner| ~250 MB | ❌ (solo CI) | ✅ | Simple, pero runner nativo y más piezas que configurar. |
| Jenkins (ligero) | ~500 MB+ | ❌ | ✅ | Familiar y potente, pero consume bastante y es excesivo para un dev local. |

> *Aproximaciones de memoria de los contenedores en reposo.*

**Elección recomendada: Gitea + Gitea Actions**, porque en un solo contenedor
obtienes el repositorio Git (donde haremos push de la rama `dev`), el controlador
de CI compatible con workflows estilo GitHub, y un registry de imágenes opcional.
Requisito mínimo y API conocida. Como el push ocurre **dentro de la LAN**, el
webhook/polling funciona sin ningún túnel a internet.

---

## Parte 8 — Montar CI/CD (Gitea + registry + act_runner)

Ya están los archivos en `ci/`. Pasos:

### 8.1 (Primera vez) Preparar el kubeconfig para el runner

El runner corre en un contenedor; el kubeconfig de K3s apunta a `127.0.0.1`, que
dentro del contenedor sería él mismo. Genera una versión por IP:

```bash
sudo bash scripts/prepare-kubeconfig.sh   # crea ci/kubeconfig (server 192.168.1.5)
```

> En producción evita guardar credenciales en el repo; esto es para desarrollo.

### 8.2 Construir la imagen de trabajo de los jobs

```bash
docker build -t farutech-ci:latest -f ci/act-runner/ci-base.Dockerfile .
```

Esta imagen contiene `git`, `docker-cli` y `kubectl`; es la que corre cada job
(`ubuntu-latest`). Debe construir con el socket de Docker montado.

Configura el `runner.yaml` (copia del ejemplo y ajústalo a tu versión):

```bash
cp ci/act-runner/runner.yaml.example ci/act-runner/runner.yaml
act_runner generate-config > ci/act-runner/generated-config.yaml   # comparar esquema
```

Verifica que `runner.yaml` tenga: `container.network: farutech-ci`, las etiquetas
`ubuntu-latest:docker://farutech-ci:latest` y los volúmenes `docker.sock` +
kubeconfig (los comenta el archivo).

### 8.3 Iniciar Gitea, el registry y el runner

```bash
cd ~/projects/farutech
export RUNNER_REGISTRATION_TOKEN=<más abajo>
docker compose -f ci/docker-compose.ci.yml up -d --build
```

- Crea tu cuenta en **http://git.local:3000** (primera visita).
- Crea un repositorio **vacío** (p. ej. `farutech`).
- En **Configuración del repositorio → Actions → Runners → Create new Runner**:
  copia el **token** y úsalo como `RUNNER_REGISTRATION_TOKEN`. También puedes
  crear el runner desde **Admin → Runners** (token global).
- El runner se registrará solo (`act_runner daemon --config /opt/runner/config.yaml`).
- Verifica: `docker compose -f ci/docker-compose.ci.yml logs -f runner`

> Si el esquema de `runner.yaml` no coincide con tu versión, el daemon lo dirá en
> los logs; regenera con `act_runner generate-config` y vuelve a poner los
> valores comentados.

### 8.4 Subir el repo a Gitea y activar el workflow

Con el repo teóricamente ya en la Pi, desde tu PC (o la Pi), añade el remote y
haz push de la rama `dev`:

```bash
# en tu PC, dentro del proyecto
git remote add gitea ssh://git@git.local:2222/<tu-usuario>/farutech.git
# o https: git remote add gitea http://git.local:3000/<tu-usuario>/farutech.git

# crea la rama dev si no existe
git branch dev 2>/dev/null || true
git checkout dev
git push -u gitea dev
```

El workflow `.gitea/workflows/deploy-dev.yml` se registra automáticamente al
subir el repositorio (está commiteado) y se dispara con cada push a `dev`.

### 8.5 Probar el pipeline manualmente

En Gitea, abre **Actions** del repo → verás el run. O fuerza desde el PC:

```bash
git commit --allow-empty -m "trigger ci"
git push gitea dev
```

---
## Parte 9 — Probar el acceso desde el navegador

Con el archivo `hosts` del PC configurado (Parte 5):

- **http://farutech-dev** → SPA/portada del frontend.
- **http://api.farutech-dev/api/blog/posts** → JSON de la API Laravel.
- **http://api.farutech-dev/** → versión de Lumen (texto del framework).

Desde la consola:

```bash
# CLI (trae la portada)
curl -I http://farutech-dev
# API real
curl http://api.farutech-dev/api/blog/posts
```

Si `farutech-dev` carga pero la API da 502, revisa que el frontend proxíe `/api`
al Service `backend` y que la app no haga `fetch` a una URL externa (aquí todo
es `/api`). Si el Ingress da 404, re-comprueba `kubectl -n hosting get ingress`.

---

## Parte 10 — Probar el flujo completo (cambio → push → deploy automático)

El objetivo: **haz un cambio en `dev`, haz push a Gitea y verás el deploy solo**.

1. **Cambia algo visible** en el frontend, p. ej. el título en
   `apps/frontend/index.html` o un texto de `apps/frontend/src/content/`.

2. **Commit y push a `dev`:**

   ```bash
   git add -A
   git commit -m "feature: cambio de prueba para CI/CD"
   git push gitea dev
   # (Si también usas github: git push origin dev)
   ```

3. **Mira el pipeline** en Gitea → *Actions* del repo. Debe aparecer un run
   `Deploy dev (K3s)` con los pasos:
   `Clonar → Build backend → Build frontend → Actualizar K3s → Verificar`.

4. **Mientras corre**, también puedes observarlo desde la Pi:

   ```bash
   kubectl -n hosting rollout status deployment/frontend
   ```

5. **Al terminar, comprueba el reinicio del pod:**

   ```bash
   kubectl -n hosting get pods -o wide
   kubectl -n hosting rollout status deployment/frontend --timeout=300s
   # debe mostrar: deployment "frontend" successfully rolled out
   ```

6. **Recarga el navegador** en `http://farutech-dev` (Ctrl+F5 para saltar caché).
   Deberías ver tu cambio.

> El backend se actualiza igual (paso `kubectl set image deployment/backend`).
> Si cambias la API, refresca `http://api.farutech-dev/api/blog/posts`.

---
## Parte 11 — Comandos exactos (resumen "runbook")

Todo en orden:

```bash
# ---------- EN LA PI (primera vez) ----------
ssh RBSV01_C
sudo usermod -aG docker sadmin && newgrp docker
curl -fsSL https://get.docker.com | sh
sudo nano /etc/hosts            # + 127.0.0.1 registry.local , git.local
sudo tee /etc/docker/daemon.json <<< '{ "insecure-registries": ["registry.local:5000"] }'
sudo systemctl restart docker
sudo tee /etc/rancher/k3s/registries.yaml <<< 'mirrors: {"registry.local:5000": {endpoint: ["http://registry.local:5000"]}}'
sudo systemctl restart k3s

# en tu PC: subir código
rsync -avz --exclude node_modules --exclude vendor --exclude dist \
  --exclude .git --exclude .env ./ RBSV01_C:~/projects/farutech/

# en la PI: secret + manifiestos
cd ~/projects/farutech
./scripts/copy-mysql-secret.sh
./scripts/k8s-deploy.sh

# ---------- CI/CD (en la PI) ----------
sudo bash scripts/prepare-kubeconfig.sh
docker build -t farutech-ci:latest -f ci/act-runner/ci-base.Dockerfile .
cp ci/act-runner/runner.yaml.example ci/act-runner/runner.yaml
export RUNNER_REGISTRATION_TOKEN=<token de Gitea>
docker compose -f ci/docker-compose.ci.yml up -d --build

# ---------- en tu PC: repo + push ----------
git remote add gitea http://git.local:3000/<usuario>/farutech.git
git checkout dev && git push -u gitea dev

# ---------- probar ----------
curl http://farutech-dev && curl http://api.farutech-dev/api/blog/posts
```

---

## Solución de problemas rápido

| Síntoma | Causa probable | Acción |
|---------|----------------|--------|
| Ingress 404/502 | Traefik no ve el Service, o imagen no existe | `kubectl -n hosting get ingress,svc,endpoints` |
| `ImagePullBackOff` | containerd no puede con el registry | Repasa `registries.yaml` + `systemctl restart k3s`; usa `imagePullPolicy: Always` |
| El pod `backend` reinicia | Fallo de migración o MySQL inaccesible | `kubectl -n hosting logs deploy/backend`; prueba `php artisan migrate --force` en el pod |
| Runner no se registra | Token inválido o esquema de `runner.yaml` viejo | Regenera con `act_runner generate-config`; borra el contenedor runner y `up -d` |
| `git push gitea` pide contraseña | Falta clave SSH o usar https | Añade tu clave a Gitea (Settings→SSH) y usa `ssh://git@git.local:2222/...` |
| El navegador no resuelve dominios | Falta entrada en `hosts` del PC | Revisa `hosts` y `ipconfig /flushdns` |
| Los cambios no se ven | Caché del navegador o workflow no disparó | Ctrl+F5; mira Gitea→Actions; re-push con commit `--allow-empty` |

---

## Notas finales y posibles mejoras

- **Registry de Gitea** (alternativa a `registry:2`): Gitea trae su propio
  registry ahorrando un contenedor, pero la ruta debe incluir el org
  (`gitea.local/<owner>/<image>`). Lo dejamos en un `registry:2` aparte por
  simplicidad.
- **`docker save`/`load`** como respaldo: si no quieres registry, tras construir
  puedes `docker save farutech-backend:dev | ssh RBSV01_C 'k3s ctr images import -'`,
  pero el flow con registry es más fiel a producción.
- **Múltiples runners** no hacen falta (1 Pi, 1 runner).
- **Backups:** guarda `gitea_data`, `registry_data` y el PVC con snapshots de
  K3s para no perder código ni imágenes ni la BD.
- **Seguridad:** para producción real usa TLS (cert-manager) y autentica el
  registry; en LAN de desarrollo el plano inseguro es aceptable.

---

## Referencia de archivos entregados

| Archivo | Descripción |
|---------|-------------|
| `deploy/k3s/*.yaml` | Manifiestos K8s del namespace `hosting` |
| `scripts/k8s-deploy.sh` | Aplica manifiestos + verifica rollouts |
| `scripts/copy-mysql-secret.sh` | Copia credenciales MySQL de `infra` → `backend-secrets` |
| `scripts/prepare-kubeconfig.sh` | kubeconfig por IP para el runner |
| `ci/docker-compose.ci.yml` | Gitea + registry + act_runner |
| `ci/act-runner/runner.Dockerfile` | Imagen del agente act_runner |
| `ci/act-runner/ci-base.Dockerfile` | Imagen de trabajo de los jobs (docker+kubectl) |
| `ci/act-runner/runner.yaml.example` | Configuración de labels/volúmenes/red del runner |
| `.gitea/workflows/deploy-dev.yml` | Pipeline: build + push + rolling update en `dev` |
| `docs/CI-CD-K3S-PI.md` | Este documento |