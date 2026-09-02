# Guía de Contribución

Gracias por tu interés en contribuir a este proyecto. Esta guía establece los lineamientos para mantener la calidad del código y la consistencia del proyecto.

## Código de Conducta

- Sé respetuoso con todos los contribuyentes
- Mantén un tono profesional en comunicaciones
- Acepta críticas constructivas de buena manera
- Prioriza el bienestar del proyecto sobre opiniones personales

## Cómo Contribuir

### 1. Reportar Bugs

Antes de reportar un bug, verifica:
- Que no exista ya un issue reportado
- Que el bug persista en la última versión
- Que puedas proporcionar pasos claros para reproducirlo

Al crear un issue, incluye:
- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado vs. comportamiento actual
- Capturas de pantalla si aplica
- Versión del proyecto
- Navegador/SO (si es relevante)

### 2. Sugerir Mejoras

Las sugerencias son bienvenidas. Al proponer una mejora:
- Explica claramente el problema que resuelve
- Describe la solución propuesta
- Considera alternativas
- Evalúa impacto en performance, seguridad y accesibilidad

### 3. Pull Requests

**Importante:** Antes de enviar un PR:
1. Asegúrate de que todas las fases F0-F9 estén intactas
2. Ejecuta la suite completa de tests
3. Verifica que no haya regresiones

Proceso para PRs:
```bash
# Crea una rama desde main
git checkout -b feature/nueva-funcionalidad

# Realiza tus cambios
# Asegúrate de seguir los estándares de código

# Ejecuta validaciones
npm run typecheck
npm run build
npm run build:seo
npm run validate

# Backend (si aplica)
cd api
composer validate
php artisan test

# Commit con mensajes descriptivos
git commit -m "feat: descripción clara del cambio"

# Push y crea PR
git push origin feature/nueva-funcionalidad
```

### Requisitos para PRs

✅ **Obligatorio:**
- Tests unitarios/integración para nueva funcionalidad
- Actualización de documentación si corresponde
- Passing en CI/CD pipeline
- Code review aprobado
- Sin errores de typecheck
- Sin warnings de ESLint/PHPStan

❌ **No aceptado:**
- Cambios que rompan tests existentes
- Código sin tests (cuando corresponda)
- Violaciones de seguridad
- Regresiones de performance significativas
- Cambios que rompan accesibilidad WCAG 2.2 AA
- Secrets o credenciales en el código

## Estándares de Código

### Frontend (TypeScript/React)

- Usa TypeScript strict mode (sin `any` sin justificación)
- Sigue principios SOLID y DRY
- Componentes pequeños y con responsabilidad única
- Hooks personalizados para lógica reutilizable
- Evita efectos secundarios en componentes
- Usa nombres descriptivos para variables y funciones

```typescript
// ✅ Bien
interface User {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

// ❌ Mal
const data: any = getData();
```

### Backend (PHP/Laravel)

- Sigue arquitectura limpia (Controllers → Services → Repositories)
- Valida siempre server-side (nunca confíes en frontend)
- Usa type hints y return types
- Documenta métodos complejos con PHPDoc
- Sigue PSR-12 coding standards

```php
// ✅ Bien
public function store(StoreLeadRequest $request): JsonResponse
{
    $validated = $request->validated();
    // ...
}

// ❌ Mal
public function store($request)
{
    // sin validación, sin type hints
}
```

### Commits

Usa [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: agrega nuevo componente de formulario
fix: corrige validación de email en ContactForm
docs: actualiza README con instrucciones de deployment
refactor: optimiza queries N+1 en CRM endpoint
test: agrega tests para autorización de roles
chore: actualiza dependencias de seguridad
```

### Testing

- Escribe tests antes o durante el desarrollo (TDD cuando sea posible)
- Prioriza cobertura de:
  - Autenticación y autorización
  - Validaciones críticas
  - Integraciones con API
  - Flujos de usuario importantes
- No escribas tests artificiales solo para cubrir % 

Ejecuta tests antes de cada commit:
```bash
# Frontend
npm test

# Backend
cd api && php artisan test
```

## Revisión de Código

Todos los PRs requieren al menos 1 aprobación.

Los revisores verificarán:
- Funcionalidad correcta
- Seguridad (OWASP Top 10)
- Performance
- Accesibilidad
- Legibilidad y mantenibilidad
- Tests adecuados
- Documentación actualizada

## Deployment

Solo maintainers pueden hacer deploy a producción.

Proceso:
1. Todos los tests deben pasar en CI/CD
2. Code review aprobado
3. Verificar CHANGELOG actualizado
4. Merge a main
5. Deploy automático vía pipeline (o manual según configuración)

## Seguridad

**NUNCA:**
- Commitear secrets, tokens o credenciales
- Exponer información sensible en logs
- Deshabilitar validaciones de seguridad
- Ignorar advertencias de seguridad del pipeline

Si encuentras una vulnerabilidad de seguridad:
1. NO la publiques en issues públicos
2. Envía un email privado a los maintainers
3. Espera confirmación antes de divulgar

## Acccesibilidad

Todos los cambios deben mantener o mejorar el cumplimiento WCAG 2.2 AA:
- Contraste de colores adecuado
- Navegación por teclado completa
- Etiquetas ARIA donde corresponda
- Textos alternativos en imágenes
- Focus visible en elementos interactivos

## Performance

Verifica que los cambios no degraden Core Web Vitals:
- LCP ≤ 2.5s
- INP ≤ 200ms
- CLS ≤ 0.1

Usa Lighthouse para validar antes de enviar PR.

## Preguntas Frecuentes

**¿Puedo enviar un PR pequeño?**
¡Sí! Los PRs pequeños son preferibles. Son más fáciles de revisar y menos propensos a bugs.

**¿Qué hago si mi PR falla en CI/CD?**
Revisa los logs del pipeline, corrige los errores y haz push nuevamente. El pipeline se ejecutará automáticamente.

**¿Cuánto tarda la revisión?**
Generalmente 1-3 días hábiles. Si pasa más tiempo, puedes comentar amablemente preguntando por el estado.

**¿Puedo ayudar con documentación?**
¡Absolutamente! Las mejoras de documentación son muy valoradas y no requieren configuración compleja.

## Recursos

- [Master Plan](docs/features/IMPLEMENTATION-MASTER-PLAN.md)
- [Requerimientos](docs/requerimientos.md)
- [CHANGELOG](CHANGELOG.md)
- [Guía de Deployment](docs/DEPLOYMENT.md)

---

Gracias por contribuir a hacer este proyecto mejor 🚀
