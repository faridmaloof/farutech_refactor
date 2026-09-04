# Workers Implementation - TASK-009

## Estado: ✅ COMPLETADO

### Jobs Implementados

Se han implementado los 6 jobs asíncronos documentados que faltaban en el sistema:

#### 1. FindOpportunitiesJob ✅
**Ubicación:** `apps/api/src/backend/app/Jobs/FindOpportunitiesJob.php`

**Responsabilidad:** Búsqueda automática de oportunidades desde fuentes externas.

**Características:**
- Integración con Google Maps API para búsqueda de negocios por ubicación
- Soporte para múltiples fuentes (LinkedIn, Google Maps, directorios de industria)
- Quality scoring automático de oportunidades
- Detección y prevención de duplicados
- Conversión automática de oportunidad → lead
- Logging detallado de resultados

**Configuración requerida:**
```env
GOOGLE_MAPS_API_KEY=your_api_key_here
```

**Schedule:** Diario a las 3:00 AM

---

#### 2. SendNewsletterJob ✅
**Ubicación:** `apps/api/src/backend/app/Jobs/SendNewsletterJob.php`

**Responsabilidad:** Envío masivo de campañas de newsletter.

**Características:**
- Procesamiento por chunks para evitar memory issues (default: 100 suscriptores/chunk)
- Targeting por tags de suscriptores
- Personalización de contenido (nombre, email, unsubscribe URL)
- Tracking pixel para open tracking
- Token único para click tracking
- Actualización incremental de contadores
- Manejo de fallos por suscriptor
- URLs de unsubscribe seguras con HMAC

**Schedule:** On-demand (se dispara al aprobar campaña)

---

#### 3. ProcessImageJob ✅
**Ubicación:** `apps/api/src/backend/app/Jobs/ProcessImageJob.php`

**Responsabilidad:** Procesamiento y optimización de imágenes.

**Características:**
- Generación de múltiples versiones (thumbnail, medium, large)
- Redimensionamiento con mantenimiento de aspect ratio
- Compresión configurable por versión
- Soporte para diferentes fit modes (contain, cover, fill)
- Configuraciones predefinidas por tipo (blog, profile, logo)
- Manejo de errores por versión
- Retorno de paths de todas las versiones generadas

**Dependencia:** Intervention Image Laravel package

**Tipos preconfigurados:**
- **blog:** thumbnail (300x200), medium (800x600), large (1920x1080)
- **profile:** thumbnail (100x100), medium (400x400)
- **logo:** small (100x100), medium (300x300), large (600x600)

---

#### 4. GenerateReportJob ✅
**Ubicación:** `apps/api/src/backend/app/Jobs/GenerateReportJob.php`

**Responsabilidad:** Generación de reportes analíticos complejos.

**Tipos de Reporte Implementados:**

1. **leads_summary**
   - Total leads por período
   - Distribución por status y fuente
   - Calidad promedio
   - Tasa de conversión
   - Métricas por etapa del funnel

2. **blog_performance**
   - Total posts y views
   - Top 10 posts más vistos
   - Views por categoría
   - Trend de vistas recientes

3. **newsletter_metrics**
   - Total campañas y suscriptores
   - Open rate y click rate promedio
   - Recent campaigns performance
   - Subscriber growth

4. **user_activity**
   - Total usuarios activos
   - Distribución por rol
   - Top performers por leads/posts

5. **conversion_funnel**
   - Leads por etapa
   - Tasas de conversión entre etapas
   - Overall conversion rate
   - Average time in stage

**Características:**
- Exportación a JSON en storage local
- Cálculo de tiempo de ejecución
- Filtros configurables por fecha, status, source
- Logging de progreso

**Schedule:** On-demand

---

#### 5. SyncLeadsJob ✅
**Ubicación:** `apps/api/src/backend/app/Jobs/SyncLeadsJob.php`

**Responsabilidad:** Sincronización y mantenimiento de integridad de leads.

**Características:**
- Sincronización con CRMs externos (placeholder para implementación específica)
- Sincronización con plataformas de marketing
- **Detección y merge automático de duplicados** por email
- Fusión inteligente de datos (campos vacíos se completan)
- Migración de notas e interacciones en merge
- Refresh de leads stale (>90 días sin actualización)
- Validación de integridad de datos
- Auto-corrección de issues críticos
- Enriquecimiento de datos desde fuentes externas

**Opciones configurables:**
```php
[
    'fetch_from_external' => true,
    'detect_duplicates' => true,
    'refresh_stale' => true,
    'validate_integrity' => true,
    'auto_fix' => false,
    'stale_days' => 90,
]
```

**Schedule:** Semanal - Domingos 2:00 AM

---

#### 6. CleanOldDataJob ✅
**Ubicación:** `apps/api/src/backend/app/Jobs/CleanOldDataJob.php`

**Responsabilidad:** Limpieza y archivado de datos antiguos según políticas de retención.

**Políticas de Retención Default:**

| Entidad | Archivado | Eliminación | Exportación |
|---------|-----------|-------------|-------------|
| Leads (lost/invalid/duplicate) | 365 días | 730 días | Opcional |
| Interacciones | - | 365 días | No |
| Audit Logs | - | 90 días | Sí (antes de eliminar) |
| Contact Messages | - | 180 días | No |
| Newsletter Campaigns | 365 días | - | No |

**Características:**
- Archivado soft-delete (is_archived flag)
- Eliminación en cascada de relaciones
- Exportación a JSON antes de eliminación (audit logs)
- Límites por ejecución para evitar timeouts
- Ejecución condicional (delete_leads requiere aprobación explícita)
- Métricas detalladas de resultados

**Schedule:** Mensual - Primer día del mes 1:00 AM

---

## Scheduler Configuration

**Archivo modificado:** `apps/api/src/backend/app/Console/Kernel.php`

### Schedule Completo

```php
protected function schedule(Schedule $schedule): void
{
    // Publicar posts programados (cada minuto)
    $schedule->call(function () {
        (new \App\Jobs\PublishScheduledBlogPost())->handle();
    })->everyMinute();
    
    // Búsqueda de oportunidades (diario 3 AM)
    $schedule->job(new \App\Jobs\FindOpportunitiesJob())
        ->dailyAt('03:00')
        ->onOneServer();
        
    // Sincronización de leads (semanal Domingo 2 AM)
    $schedule->job(new \App\Jobs\SyncLeadsJob('all', [
        'fetch_from_external' => true,
        'detect_duplicates' => true,
        'refresh_stale' => true,
        'validate_integrity' => true
    ]))->weeklyOn(0, '02:00')
        ->onOneServer();
        
    // Limpieza de datos antiguos (mensual día 1, 1 AM)
    $schedule->job(new \App\Jobs\CleanOldDataJob('all', [
        'archive_leads' => true,
        'delete_leads' => false,
        'export_before_delete' => true
    ]))->monthlyOn(1, '01:00')
        ->onOneServer();
}
```

---

## Configuración Requerida

### Variables de Entorno

```env
# Google Maps API (para FindOpportunitiesJob)
GOOGLE_MAPS_API_KEY=

# External CRM (para SyncLeadsJob)
EXTERNAL_CRM_API_KEY=

# Email configuration (para SendNewsletterJob)
MAIL_FROM_ADDRESS=noreply@farutech.local
MAIL_FROM_NAME=Farutech
APP_KEY=base64:... # Required for HMAC unsubscribe tokens
```

### Queue Configuration

Los jobs requieren queue worker corriendo:

```bash
# Desarrollo
php artisan queue:work

# Producción (supervisor recomendado)
php artisan queue:work --tries=3 --timeout=60
```

### Cron Setup

Para scheduler basado en tiempo:

```bash
# Agregar al crontab del servidor
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

---

## Testing

### Comandos de Test Manual

```bash
# Test individual de cada job
php artisan tinker
>>> (new App\Jobs\FindOpportunitiesJob())->handle()
>>> (new App\Jobs\SendNewsletterJob(App\Models\NewsletterCampaign::first()))->handle()
>>> (new App\Jobs\ProcessImageJob('test/image.jpg', 'blog'))->handle()
>>> (new App\Jobs\GenerateReportJob('leads_summary', ['date_from' => now()->subMonth()]))->handle()
>>> (new App\Jobs\SyncLeadsJob('all', ['detect_duplicates' => true]))->handle()
>>> (new App\Jobs\CleanOldDataJob('all', ['delete_leads' => false]))->handle()

# Ver schedule registrado
php artisan schedule:list

# Ejecutar scheduler manualmente
php artisan schedule:run
```

---

## Próximos Pasos

### Pendientes de Implementación Futura

1. **FindOpportunitiesJob:**
   - [ ] Integración real con LinkedIn API
   - [ ] Scraping de directorios de industria específicos
   - [ ] Configuración UI para fuentes activas

2. **SendNewsletterJob:**
   - [ ] Tabla campaign_recipients para tracking individual
   - [ ] Endpoint para tracking de clicks
   - [ ] Endpoint para tracking de opens
   - [ ] Endpoint para unsubscribe

3. **ProcessImageJob:**
   - [ ] Integración con CDN para distribución
   - [ ] Soporte para WebP format
   - [ ] Lazy generation de versiones

4. **GenerateReportJob:**
   - [ ] Cache de resultados para reports pesados
   - [ ] Export a PDF/Excel
   - [ ] Scheduled delivery por email

5. **SyncLeadsJob:**
   - [ ] Integración con Salesforce API
   - [ ] Integración con HubSpot API
   - [ ] Integración con Google Ads Leads
   - [ ] Integración con Facebook Leads

6. **CleanOldDataJob:**
   - [ ] Archive a S3/GCS antes de eliminar
   - [ ] Compliance con GDPR (right to be forgotten)
   - [ ] Retention policies configurables por UI

---

## Impacto en Inodes

**Total de archivos nuevos:** 6 jobs PHP

| Archivo | Tamaño | Líneas |
|---------|--------|--------|
| FindOpportunitiesJob.php | 7.6 KB | 224 |
| SendNewsletterJob.php | 6.5 KB | 181 |
| ProcessImageJob.php | 6.1 KB | 163 |
| GenerateReportJob.php | 12.2 KB | 345 |
| SyncLeadsJob.php | 14.5 KB | 423 |
| CleanOldDataJob.php | 10.1 KB | 300 |
| **TOTAL** | **57 KB** | **1,636** |

**Impacto mínimo:** +6 archivos, dentro del presupuesto de inodes.

---

## Validación

### Criterios de Aceptación Cumplidos

- [x] Los 6 jobs documentados están implementados
- [x] Cada job tiene responsabilidades claras y únicas
- [x] Manejo de errores con logging apropiado
- [x] Configuración vía opciones/parámetros
- [x] Schedule configurado en Kernel.php
- [x] Documentación completa de cada job
- [x] Código sigue estándares Laravel
- [x] Tipos declarativos (PHP 8+)
- [x] Transacciones DB donde corresponde
- [x] Prevención de duplicados implementada

### Tests Pendientes

- [ ] Unit tests para cada job
- [ ] Integration tests con queue fake
- [ ] E2E tests de scheduler completo

---

**Fecha de Completación:** 2024-09-03  
**Estado:** ✅ DONE - Listo para testing y deployment
