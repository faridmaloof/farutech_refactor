# CI/CD - Admin Deployment

## Scripts de Despliegue

### Pre-requisitos
- Tener acceso SSH al servidor donde está alojado el admin
- El admin se sirve bajo el path `/admin` vía HAProxy

### Pasos de Despliegue

1. **Build local:**
   ```bash
   npm run build
   ```

2. **Subir archivos al servidor:**
   ```bash
   rsync -avz --delete dist/ user@server:/var/www/admin/
   ```

3. **Reiniciar servicio Nginx (si aplica):**
   ```bash
   ssh user@server "sudo systemctl reload nginx"
   ```

## Variables de Entorno para Producción

- `VITE_API_URL`: URL del backend API
- `VITE_BASE_PATH`: `/admin`
