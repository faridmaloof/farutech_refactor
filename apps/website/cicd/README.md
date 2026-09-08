# CI/CD - Website Deployment

## Scripts de Despliegue

### Pre-requisitos
- Tener acceso SSH al servidor Hostinger
- Variables de entorno configuradas en el servidor:
  - `MYSQL_HOST`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`
  - `MONGODB_URI` (si usa Atlas)
  - `REDIS_HOST`, `REDIS_PASSWORD`

### Pasos de Despliegue

1. **Build local:**
   ```bash
   npm run build
   ```

2. **Subir archivos al servidor:**
   ```bash
   rsync -avz --delete dist/ user@hostinger:/public_html/
   ```

3. **Subir backend:**
   ```bash
   rsync -avz --delete src/backend/ user@hostinger:/backend/
   ```

4. **Ejecutar migraciones en el servidor:**
   ```bash
   ssh user@hostinger "cd /backend && php artisan migrate --force"
   ```

5. **Limpiar caché:**
   ```bash
   ssh user@hostinger "cd /backend && php artisan cache:clear && php artisan config:clear"
   ```

## Variables de Entorno para Producción

Ver `.env.production.example` para referencia.
