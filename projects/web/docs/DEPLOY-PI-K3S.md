# FaruTech — Despliegue en la Raspberry Pi (K3s)

Guía única y completa. Sirve para un practicante que despliega por primera vez
y para quien ya lo hizo cien veces. Reemplaza a `docs/CI-CD-K3S-PI.md` (que
quedó con secciones faltantes y dominios desactualizados).

> **Regla de oro:** nunca ejecutes `kubectl apply` ni `docker build` a mano
> salvo para depurar. Todo el flujo normal pasa por los scripts de
> `scripts/`. Así CI (Gitea Actions) y tú hacen exactamente lo mismo.

---

## 1. Mapa mental (arquitectura)

```
                  TU PC / celular (navegador)
                         │
     farutech.rbp, www.farutech.rbp, api.farutech.rbp
                         │  (resueltos vía /etc/hosts -> IP de la Pi)
                         ▼
┌───────────────────────────── RASPBERRY PI ─────────────────────────────┐
│                                                                         │
│   K3s (la app REAL vive aquí)          Docker del host (herramientas)  │
│   ┌─────────────────────────────┐      ┌────────────────────────────┐ │
│   │ namespace hosting            │      │ registry:2   (:5000)       │ │
│   │  Ingress (Traefik)           │      │ gitea        (:3000)       │ │
│   │  frontend ── proxy /api ──►  │      │ act_runner (ejecuta CI)    │ │
│   │  backend                     │      └────────────────────────────┘ │
│   │ namespace infra               │                                    │
│   │  mysql (:3306)                │                                    │
│   └─────────────────────────────┘                                      │
└──────────────────────────────────────────────────────────────────────┘
```

- **K3s** corre la aplicación real (`hosting`) y la base de datos (`infra`).
  Trae **Traefik** de fábrica como Ingress — no se instala nada aparte.
- **Docker del host** (fuera de K3s) solo corre las herramientas de CI:
  el registry de imágenes, Gitea (repo + pipelines) y su runner.
- El build de las imágenes se hace **en la propia Pi** (ARM64 nativo, sin
  cross-compile).

---

## 2. Preparación de la Raspberry Pi (una sola vez)

### 2.1 Confirmar que K3s está sano

```bash
kubectl get nodes            # debe verse "Ready"
```

Si no tienes K3s instalado todavía, instálalo con el script oficial:
```bash
curl -sfL https://get.k3s.io | sh -
```

### 2.2 Preparar el host (registry local + hosts + containerd)

```bash
cd ~/projects/farutech      # o donde tengas el repo clonado en la Pi
sudo bash scripts/00-setup-pi-host.sh
```

Esto deja listo `registry.local:5000` como registry de imágenes (Docker +
containerd de K3s) y agrega entradas locales a `/etc/hosts` de la Pi.

### 2.3 Levantar Gitea + registry + runner (CI local)

```bash
sudo bash scripts/prepare-kubeconfig.sh          # kubeconfig por IP para el runner
docker build -t farutech-ci:latest -f ci/act-runner/ci-base.Dockerfile .
cp ci/act-runner/runner.yaml.example ci/act-runner/runner.yaml
export RUNNER_REGISTRATION_TOKEN=<token-que-genera-Gitea>
docker compose -f ci/docker-compose.ci.yml up -d --build
```

1. Entra a `http://git.local:3000`, crea tu cuenta y un repo vacío `farutech`.
2. En **Configuración del repo → Actions → Runners**, genera el token y
   úsalo como `RUNNER_REGISTRATION_TOKEN` arriba (si no lo tenías aún,
   reinicia el contenedor `runner` después de exportarlo).

### 2.4 Configurar tu PC (o cualquier cliente) para resolver los dominios

En el archivo hosts de tu computador — `/etc/hosts` (Linux/Mac) o
`C:\Windows\System32\drivers\etc\hosts` (Windows, como administrador):

```
192.168.1.5   farutech.rbp
192.168.1.5   www.farutech.rbp
192.168.1.5   api.farutech.rbp
```

(Cambia `192.168.1.5` por la IP real de tu Pi si es distinta.)

---

## 3. Despliegue del día a día

### Opción A — Automático (recomendado): push a `dev`

```bash
git push gitea dev
```

Gitea Actions dispara `.gitea/workflows/deploy-dev.yml`, que hace exactamente
lo mismo que el script manual (build → push → deploy), visible en
**Gitea → Actions**.

### Opción B — Manual, un solo comando

Desde la Pi (o tu PC con `kubectl`/`docker` apuntando a la Pi), en la raíz
del repo:

```bash
./scripts/deploy.sh
```

Esto hace, en orden:
1. Verifica/crea la infraestructura de datos (MySQL) si no existe — **no
   toca nada si ya está desplegada**.
2. Construye y publica las imágenes de backend y frontend.
3. Aplica los manifiestos de K8s y espera a que los pods queden listos.

Variables útiles:
```bash
TAG=v1.2.3 ./scripts/deploy.sh    # etiqueta la imagen con una versión
SKIP_BUILD=1 ./scripts/deploy.sh  # solo reaplica manifiestos, sin rebuild
```

### Primer despliegue únicamente: sembrar datos iniciales

Los seeders (`ApplicationTypeSeeder`, `ServiceSeeder`, `BlogCategorySeeder`,
etc.) **no son idempotentes** — corren una sola vez, a mano, después del
primer deploy exitoso:

```bash
kubectl -n hosting exec deploy/backend -- php artisan db:seed --force
```

No lo repitas en despliegues posteriores o duplicarás filas / romperás por
email único.

---

## 4. Verificación

```bash
kubectl -n hosting get pods,svc,ingress
kubectl -n hosting rollout status deployment/backend
kubectl -n hosting rollout status deployment/frontend
```

Desde el navegador o `curl`:

```bash
curl -I http://farutech.rbp/
curl -I http://www.farutech.rbp/
curl http://api.farutech.rbp/api/blog/posts
```

---

## 5. Credenciales generadas automáticamente

La primera vez que se despliega, `scripts/30-deploy-app.sh` genera y
muestra **una sola vez**:

- Contraseña root/app de MySQL (también queda en `.mysql-credentials.generated`
  en la raíz del repo — **cópiala a tu gestor de contraseñas y borra el
  archivo**; no se versiona, está en `.gitignore`).
- Usuario administrador inicial de la app (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).

En despliegues siguientes, si el Secret ya existe, **no se regenera nada**
(para no invalidar sesiones ni resetear contraseñas). Si necesitas rotar
credenciales, bórralas explícitamente:

```bash
kubectl -n hosting delete secret backend-secrets
kubectl -n infra   delete secret mysql-secret
```

y vuelve a correr `./scripts/deploy.sh` (esto sí perderá el acceso con las
credenciales viejas — solo hazlo si sabes lo que implica).

> ✅ Actualizado (2026-08-27): `AdminUserSeeder.php` ya **no** usa contraseñas
> fijas. Ahora genera credenciales aleatorias por corrida, las imprime una sola
> vez en la salida del comando y no persiste texto plano (solo hash bcrypt).
> Esta nota quedó obsoleta tras TASK-001 (R-09).

---

## 6. Añadir más bases de datos en el futuro

`scripts/10-deploy-infra.sh` está pensado para crecer: cada motor nuevo
(Redis, PostgreSQL, etc.) se agrega como su propio Deployment/Service dentro
de `deploy/k3s/infra/`, y una sección equivalente en el script que verifique
si ya existe antes de crear.

---

## 7. Solución de problemas

| Síntoma | Causa probable | Acción |
|---|---|---|
| Ingress 404/502 | Traefik no ve el Service, o la imagen no existe | `kubectl -n hosting get ingress,svc,endpoints` |
| `ImagePullBackOff` | containerd no resuelve `registry.local` | Repite `sudo bash scripts/00-setup-pi-host.sh`; confirma `/etc/hosts` y `registries.yaml` |
| El pod `backend` reinicia en bucle | Falla la migración o MySQL no responde | `kubectl -n hosting logs deploy/backend`; revisa `kubectl -n infra get pods` |
| `www.farutech.rbp` no carga pero `farutech.rbp` sí | Ingress viejo sin la regla explícita de `www` | Verifica que `deploy/k3s/ingress.yaml` tenga el host `www.farutech.rbp` (ver sección 1 del archivo) |
| El navegador no resuelve los dominios | Falta la entrada en el `hosts` de tu PC | Ver sección 2.4; en Windows recuerda `ipconfig /flushdns` |
| Runner de Gitea no se registra | Token inválido o `runner.yaml` desactualizado | Regenera con `act_runner generate-config`, recrea el contenedor `runner` |
| Necesito ver logs de un deploy fallido | — | `kubectl -n hosting get events --sort-by=.lastTimestamp \| tail -30` |

---

## 8. Referencia de archivos

| Archivo | Qué hace |
|---|---|
| `scripts/00-setup-pi-host.sh` | Prepara el host (registry, hosts, containerd). Una sola vez. |
| `scripts/10-deploy-infra.sh` | Verifica/crea MySQL en `infra`. Idempotente. |
| `scripts/20-build-and-push.sh` | Construye y publica imágenes backend/frontend. |
| `scripts/30-deploy-app.sh` | Aplica manifiestos de `hosting`, fija el tag, espera rollout. |
| `scripts/deploy.sh` | Orquesta 10 → 20 → 30. El comando del día a día. |
| `scripts/prepare-kubeconfig.sh` | kubeconfig por IP para el runner de CI. |
| `deploy/k3s/*.yaml` | Manifiestos del namespace `hosting` (app). |
| `deploy/k3s/infra/*.yaml` | Manifiestos del namespace `infra` (bases de datos). |
| `.gitea/workflows/deploy-dev.yml` | Pipeline CI: reusa los mismos scripts 10/20/30. |
| `ci/docker-compose.ci.yml` | Gitea + registry + act_runner (herramientas de CI). |

---

## 9. Pendiente / fuera de alcance de este documento

- **VPS de Hostinger (producción):** hoy el repo trae un camino alternativo
  con `docker-compose.prod.yml` + Nginx Proxy Manager, distinto a K3s. Si se
  quiere paridad real entre la Pi y el VPS (mismo comportamiento, solo
  cambiar dominio/imagen), lo recomendable es instalar K3s también ahí y
  reusar estos mismos manifiestos/scripts — pendiente de confirmar specs
  del VPS antes de migrar esa parte.
