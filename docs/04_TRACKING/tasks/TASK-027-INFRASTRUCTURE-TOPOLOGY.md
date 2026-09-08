# TASK-027 — Reconciliación de infraestructura y topología de despliegue

**Estado:** TODO  
**Prioridad:** HIGH  
**Owner:** Technical Lead → Developer / Infrastructure owner / Security / QA  
**Related:** ADR-008

## Motivo

La antigua TASK-017 proponía una aplicación Admin independiente y un despliegue separado. Esa topología contradice ADR-008. Esta tarea reemplaza esa parte del diseño sin borrar la evidencia histórica.

## Objetivo

Definir y validar una infraestructura coherente con el Website Ecosystem actual, manteniendo `/admin` dentro del mismo Website y evitando acoplamientos innecesarios.

## Alcance

- Auditar `infrastructure/`, Docker, gateway, CI/CD y scripts.
- Identificar servicios realmente compartidos y servicios propios del Website.
- Eliminar únicamente servicios obsoletos después de comprobar dependencias.
- Garantizar que `/admin` sea servido por el artefacto del Website.
- Evitar `admin` como servicio de producción independiente salvo ADR posterior.
- Validar redes, variables de entorno, health checks y configuración local/producción.
- Mantener separación clara entre Website Ecosystem y futura Platform.

## Criterios de aceptación

- [ ] No existe servicio de producción independiente para `apps/admin`.
- [ ] Gateway y hosting sirven `/admin` desde Website.
- [ ] Las configuraciones no contienen endpoints sensibles hardcodeados.
- [ ] `.env.example` documenta las variables necesarias sin secretos.
- [ ] Docker Compose/configuración es reproducible.
- [ ] Health checks relevantes funcionan.
- [ ] Build/config validation no produce errores ni warnings relevantes.
- [ ] Tests de conectividad y E2E aplicables pasan.
- [ ] Security review no deja bloqueadores.
- [ ] Documentación refleja la topología real.

## Relación histórica

`TASK-017.md` se conserva como evidencia del diseño anterior y no debe utilizarse como instrucción vigente donde contradiga ADR-008.
