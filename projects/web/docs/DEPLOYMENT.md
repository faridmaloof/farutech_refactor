# Guía de Deployment - Producción

Esta guía describe el proceso completo para desplegar el proyecto en producción siguiendo las mejores prácticas de seguridad, performance y operaciones.

## Prerrequisitos

- Acceso al servidor/infraestructura de producción
- Variables de entorno configuradas (ver `.env.example`)
- Base de datos configurada con backups automáticos
- Dominio apuntando al servidor
- Certificado SSL instalado
- Node.js 18+ y PHP 8.2+ instalados en el servidor
- Composer y npm instalados
- Git configurado

## Arquitectura de Despliegue

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   CDN       │────▶│  Frontend    │────▶│   Backend   │
│ (Assets)    │     │  (Vite SSR)  │     │   (Laravel) │
└─────────────┘     └──────────────┘     └─────────────┘
                          │                    │
                          │                    ▼
                          │            ┌─────────────┐
                          │            │  Database   │
                          │            │  (MySQL/PG) │
                          │            └─────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │  Redis Cache │
                   └──────────────┘
```

## Paso 1: Preparación del Entorno

### 1.1 Clonar Repositorio

```bash
cd /var/www
git clone git@github.com:tu-organizacion/tu-proyecto.git
cd tu-proyecto
```

### 1.2 Configurar Variables de Entorno

**NUNCA** uses `.env` de desarrollo en producción.

```bash
cp .env.example .env
nano .env
```

Variables críticas a configurar:

```ini
# App
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tudominio.com

# Database
DB_HOST=localhost
DB_DATABASE=nombre_db
DB_USERNAME=usuario_seguro
DB_PASSWORD=contraseña_fuerte_generada

# Security
APP_KEY=base64:key_generada_con_php_artisan_key_generate
JWT_SECRET=secreto_fuerte_aleatorio

# Services
MAIL_HOST=smtp.proveedor.com
MAIL_PORT=587
MAIL_USERNAME=noreply@tudominio.com
MAIL_PASSWORD=app_password

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60

# Monitoring
LOG_CHANNEL=errorlog
LOG_LEVEL=error
```

### 1.3 Permisos de Archivos

```bash
# Frontend
chown -R www-data:www-data /var/www/tu-proyecto/dist
chmod -R 755 /var/www/tu-proyecto/dist

# Backend
chown -R www-data:www-data /var/www/tu-proyecto/api/storage
chown -R www-data:www-data /var/www/tu-proyecto/api/bootstrap/cache
chmod -R 775 /var/www/tu-proyecto/api/storage
chmod -R 775 /var/www/tu-proyecto/api/bootstrap/cache
```

## Paso 2: Backend (Laravel)

### 2.1 Instalar Dependencias

```bash
cd api
composer install --optimize-autoloader --no-dev
```

### 2.2 Generar Keys

```bash
php artisan key:generate
php artisan jwt:secret
```

### 2.3 Migraciones de Base de Datos

**Importante:** Realizar backup antes de migrar.

```bash
# Backup
mysqldump -u usuario -p nombre_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Ejecutar migraciones
php artisan migrate --force

# Seeders (solo si es primera vez o requiere actualización)
php artisan db:seed --class=ProductionSeeder
```

### 2.4 Optimizaciones

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

### 2.5 Health Check

Verifica que el backend esté respondiendo:

```bash
curl -f https://tudominio.com/api/health
# Debe retornar: {"status":"ok","timestamp":"..."}
```

## Paso 3: Frontend (Vite + React)

### 3.1 Instalar Dependencias

```bash
cd /var/www/tu-proyecto
npm ci --production
```

### 3.2 Build de Producción

```bash
# Build principal
npm run build

# Build SEO (prerenderizado)
npm run build:seo

# Validar build
npm run validate
```

### 3.3 Verificar Assets

Asegúrate de que `/dist` contenga:
- `index.html` (para cada ruta prerenderizada)
- `assets/` con JS y CSS versionados
- `sitemap.xml`
- `robots.txt`

## Paso 4: Configuración del Servidor Web

### Nginx (Recomendado)

Usa la configuración de ejemplo incluida:

```bash
sudo cp nginx.conf.example /etc/nginx/sites-available/tudominio.com
sudo ln -s /etc/nginx/sites-available/tudominio.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Configuración clave en `nginx.conf.example`:

```nginx
server {
    listen 443 ssl http2;
    server_name tudominio.com;

    # SSL
    ssl_certificate /etc/letsencrypt/live/tudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tudominio.com/privkey.pem;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Content-Security-Policy "default-src 'self'; ..." always;
    
    # Frontend (Vite SSR)
    root /var/www/tu-proyecto/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Cache estático
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|webp|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Redirect HTTP → HTTPS
server {
    listen 80;
    server_name tudominio.com;
    return 301 https://$server_name$request_uri;
}
```

### Apache (Alternativo)

```bash
sudo a2enmod ssl headers rewrite
sudo systemctl restart apache2
```

## Paso 5: SSL/TLS

### LetsEncrypt (Recomendado)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tudominio.com -d www.tudominio.com
```

Renovación automática (ya configurada por defecto):
```bash
certbot renew --dry-run
```

## Paso 6: Monitoreo y Observabilidad

### 6.1 Logs

Configura rotación de logs:

```bash
sudo nano /etc/logrotate.d/tu-proyecto
```

```
/var/www/tu-proyecto/api/storage/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0664 www-data www-data
}
```

### 6.2 Health Checks

Endpoints disponibles:
- `/api/health` - Estado general
- `/api/ready` - Ready para tráfico (DB conectada, etc.)

Configura monitoreo externo (UptimeRobot, Pingdom, etc.) para verificar estos endpoints cada 5 minutos.

### 6.3 Alertas

Configura alertas para:
- Caída del servicio (health check falla)
- Errores 5xx > 1% de requests
- LCP > 3s
- Tasa de conversión anormalmente baja

## Paso 7: Backups

### Estrategia de Backups

**Base de Datos:**
```bash
# Script diario (cron)
0 2 * * * mysqldump -u usuario -p'password' nombre_db | gzip > /backups/db_$(date +\%Y\%m\%d_\%H\%M\%S).sql.gz

# Mantener últimos 30 días
find /backups -name "db_*.sql.gz" -mtime +30 -delete
```

**Archivos:**
```bash
# Backup de uploads y assets críticos
tar -czf /backups/files_$(date +\%Y\%m\%d).tar.gz /var/www/tu-proyecto/api/storage/app/public
```

### Prueba de Restore

**Mensualmente**, prueba restaurar backups en staging:

```bash
gunzip < backup_20240101.sql.gz | mysql -u usuario -p nombre_db_staging
```

## Paso 8: Rollback Plan

### Escenario: Deploy Fallido

**Frontend:**
```bash
cd /var/www/tu-proyecto
git revert HEAD
npm run build
npm run build:seo
# Reiniciar servicios si es necesario
```

**Backend:**
```bash
cd /var/www/tu-proyecto/api
git revert HEAD
composer install --optimize-autoloader --no-dev
php artisan migrate:rollback --step=1  # Si hay migraciones problemáticas
php artisan config:cache
php artisan route:cache
```

**Base de Datos:**
```bash
# Restaurar desde backup más reciente
gunzip < backup_20240101.sql.gz | mysql -u usuario -p nombre_db
```

### Regla de Oro

> **NUNCA** hagas deploy en viernes o antes de festivos.
> **SIEMPRE** ten un plan de rollback probado antes de deploy.

## Paso 9: Post-Deploy Checklist

### Verificaciones Inmediatas

- [ ] Health check responde (`/api/health`)
- [ ] Homepage carga correctamente
- [ ] Cambio de idioma funciona (ES/EN)
- [ ] Formulario de contacto envía emails
- [ ] Newsletter suscripción funciona
- [ ] Login administrativo funciona
- [ ] Panel de admin accesible solo con credenciales
- [ ] SSL certificado válido
- [ ] Redirección HTTP→HTTPS activa
- [ ] Sitemap.xml accesible
- [ ] Robots.txt correcto
- [ ] Velocidad de carga aceptable (Lighthouse >90)

### Monitoreo Primeras 24h

- Revisar logs de errores cada 4h
- Monitorear métricas de performance (LCP, INP, CLS)
- Verificar tasa de conversión (leads, newsletter)
- Revisar alerts de monitoreo

## Paso 10: CI/CD Pipeline (Opcional pero Recomendado)

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
      
      - name: Install & Test
        run: |
          npm ci
          npm run typecheck
          npm run build
          npm run build:seo
          cd api && composer install --no-dev
          php artisan test
      
      - name: Deploy via SSH
        uses: easingthemes/ssh-deploy@v3
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_KEY }}
          REMOTE_HOST: ${{ secrets.PROD_HOST }}
          REMOTE_USER: ${{ secrets.PROD_USER }}
          SOURCE: "."
          TARGET: "/var/www/tu-proyecto"
      
      - name: Run Migrations
        run: |
          ssh ${{ secrets.PROD_USER }}@${{ secrets.PROD_HOST }} "
            cd /var/www/tu-proyecto/api &&
            php artisan migrate --force &&
            php artisan config:cache &&
            php artisan route:cache
          "
      
      - name: Notify Success
        run: echo "Deploy exitoso!"
```

## Troubleshooting

### Error: Migration Failed

```bash
# Ver último migration fallido
php artisan migrate:status

# Rollback específico
php artisan migrate:rollback --step=1

# Corregir migration y re-ejecutar
php artisan migrate
```

### Error: 500 Internal Server Error

```bash
# Revisar logs
tail -f /var/www/tu-proyecto/api/storage/logs/laravel.log

# Limpiar cache
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

### Error: Frontend No Carga

```bash
# Verificar build
ls -la dist/

# Re-build
npm run build

# Verificar permisos
chown -R www-data:www-data dist/
```

### Error: SSL Certificate Invalid

```bash
# Verificar certificado
sudo certbot certificates

# Renovar si es necesario
sudo certbot renew --force-renewal
```

## Recursos Adicionales

- [Laravel Deployment Documentation](https://laravel.com/docs/deployment)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)
- [OWASP Deployment Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Deployment_Cheat_Sheet.html)

---

**Nota Final:** Esta guía asume una arquitectura estándar. Adapta según tu infraestructura específica (AWS, GCP, Azure, VPS, etc.).
