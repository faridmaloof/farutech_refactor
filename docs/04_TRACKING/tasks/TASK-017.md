# TASK-017 — Reestructuración de Infraestructura y Apps Independientes

**Fase:** FASE 14 — Corrección de Deuda Técnica (Auditoría 2026-09)

**Estado:** ⬜ BACKLOG

**Prioridad:** 🟡 HIGH

**Responsable:** DevOps Engineer

**Fecha Creación:** 2026-09-05

**Implementa:** Reestructuración de la infraestructura Docker para separar los servicios compartidos de infraestructura de los servicios específicos de cada aplicación.

---

## 🎯 Objetivo

Reorganizar la infraestructura Docker del proyecto para establecer una separación clara entre:

* **Infraestructura compartida**, administrada desde `infrastructure/docker-compose.yml`.
* **Aplicaciones independientes**, cada una con su propio `docker-compose.yml`.

La infraestructura compartida deberá concentrar los servicios de base de datos, herramientas de administración, networking y servicios auxiliares, incluyendo MySQL, MongoDB, PostgreSQL, Redis, MailHog, pgAdmin, mongo-express, phpMyAdmin y HAProxy.

Cada aplicación deberá poder levantarse, configurarse y evolucionar de manera independiente, conectándose a los servicios de infraestructura mediante una red Docker compartida (`app-network`) o mediante variables de entorno configurables.

La estructura resultante deberá permitir distinguir claramente entre el entorno **local**, donde las aplicaciones consumen los servicios definidos en `infrastructure/`, y el entorno **producción**, donde las aplicaciones podrán apuntar a servicios externos, incluyendo infraestructura de Hostinger u otros proveedores.

---

## 📋 Evidencia de Auditoría

Actualmente la infraestructura y las aplicaciones mantienen un acoplamiento que dificulta levantar y administrar cada componente de forma independiente.

La reorganización requerida establece la siguiente distribución:

```yaml
# infrastructure/docker-compose.yml

services:
  mysql: ...
  mongodb: ...
  postgres: ...
  redis: ...
  mailhog: ...
  pgadmin: ...
  mongo-express: ...
  phpmyadmin: ...
  haproxy: ...

networks:
  app-network:
    name: app-network
```

La infraestructura será responsable exclusivamente de los servicios compartidos.

Por su parte, Website deberá disponer de su propia composición:

```yaml
# apps/website/docker-compose.yml

services:
  website-frontend: ...
  website-backend: ...
  website-workers: ...

networks:
  app-network:
    external: true
```

Admin deberá disponer igualmente de su propia composición:

```yaml
# apps/admin/docker-compose.yml

services:
  admin-frontend: ...

networks:
  app-network:
    external: true
```

La configuración de cada aplicación deberá permitir cambiar los endpoints de infraestructura mediante variables de entorno, evitando dependencias rígidas con nombres de servicios o hosts específicos.

---

## 📂 Pasos de Ejecución

1. Revisar la estructura actual de `infrastructure/`, `apps/website/` y `apps/admin/`, identificando qué contenedores pertenecen a infraestructura compartida y cuáles son específicos de cada aplicación.

2. Reestructurar `infrastructure/docker-compose.yml` para concentrar los servicios compartidos:

   * MySQL
   * MongoDB
   * PostgreSQL
   * Redis
   * MailHog
   * pgAdmin
   * mongo-express
   * phpMyAdmin
   * HAProxy

3. Configurar `app-network` como red Docker compartida para permitir la comunicación entre infraestructura y aplicaciones.

4. Garantizar que los servicios de infraestructura puedan considerarse opcionales según las necesidades del entorno, evitando que una aplicación dependa obligatoriamente de servicios que no utiliza.

5. Crear `apps/website/docker-compose.yml` con los servicios específicos de Website:

   * `website-frontend`
   * `website-backend`
   * `website-workers`

6. Configurar Website para conectarse a `app-network` como red externa o mediante variables de entorno configurables como:

   * `DB_HOST`
   * `DB_PORT`
   * `DB_DATABASE`
   * `DB_USERNAME`
   * `DB_PASSWORD`
   * `MONGO_HOST`
   * `MONGO_PORT`
   * `REDIS_HOST`
   * `REDIS_PORT`
   * y cualquier otra variable requerida por los servicios de la aplicación.

7. Crear `apps/admin/docker-compose.yml` con el servicio específico:

   * `admin-frontend`

8. Configurar Admin para utilizar la misma estrategia de conexión a infraestructura mediante `app-network` y/o variables de entorno.

9. Revisar los `.env.example` de Website y Admin para garantizar que los endpoints de infraestructura no estén hardcodeados y puedan cambiarse fácilmente entre:

   * **Local:** servicios Docker de `infrastructure/`.
   * **Producción:** servicios externos / Hostinger.

10. Reorganizar `apps/website/` para establecer como estructura mínima:

```text
apps/website/
├── src/
│   ├── frontend/
│   ├── backend/
│   └── workers/
├── test/
│   ├── e2e/
│   ├── api/
│   └── integration/
├── cicd/
│   └── ...
├── docker-compose.yml
└── ...
```

11. Crear la estructura básica de `test/` y `cicd/`, dejando preparados los espacios para pruebas E2E, API, integración y scripts de despliegue hacia Hostinger.

12. Revisar las referencias existentes a nombres de servicios, redes, hosts y puertos para evitar que la separación de los `docker-compose.yml` rompa las aplicaciones.

13. Actualizar el `README.md` principal con instrucciones claras para:

* Levantar únicamente la infraestructura.
* Levantar Website.
* Levantar Admin.
* Levantar infraestructura + Website.
* Levantar infraestructura + Admin.
* Configurar las variables de entorno para local.
* Configurar las variables necesarias para producción.

14. Validar que infraestructura y aplicaciones puedan iniciarse de forma independiente y que las aplicaciones puedan conectarse correctamente a los servicios compartidos.

---

## ✅ Criterios de Aceptación

* [ ] `infrastructure/docker-compose.yml` incluye los servicios compartidos:

  * MySQL
  * MongoDB
  * PostgreSQL
  * Redis
  * MailHog
  * pgAdmin
  * mongo-express
  * phpMyAdmin
  * HAProxy

* [ ] Todos los servicios de infraestructura utilizan `app-network`.

* [ ] `apps/website/docker-compose.yml` define:

  * `website-frontend`
  * `website-backend`
  * `website-workers`

* [ ] Website se conecta a la infraestructura mediante la red externa `app-network` y/o variables de entorno configurables.

* [ ] `apps/admin/docker-compose.yml` define:

  * `admin-frontend`

* [ ] Admin utiliza la misma estrategia de conexión a infraestructura mediante `app-network` y/o variables de entorno.

* [ ] Las aplicaciones no dependen de valores hardcodeados para hosts, puertos o endpoints de infraestructura.

* [ ] Las variables de entorno permiten cambiar fácilmente entre configuración **local** y **producción**.

* [ ] `apps/website/` contiene las carpetas:

  * `src/frontend/`
  * `src/backend/`
  * `src/workers/`
  * `test/e2e/`
  * `test/api/`
  * `test/integration/`
  * `cicd/`

* [ ] La carpeta `cicd/` contiene una estructura básica preparada para scripts de despliegue a Hostinger.

* [ ] El `README.md` explica cómo levantar infraestructura y aplicaciones por separado.

* [ ] Es posible levantar `infrastructure/` sin necesidad de levantar Website o Admin.

* [ ] Es posible levantar Website utilizando la infraestructura compartida.

* [ ] Es posible levantar Admin utilizando la infraestructura compartida.

* [ ] La reestructuración no elimina ni modifica innecesariamente los servicios de infraestructura existentes.

---

## ⚠️ Riesgos

| Riesgo                                                                                                   | Mitigación                                                                                                              |
| -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Las aplicaciones dependen actualmente de nombres de servicios definidos en un único `docker-compose.yml` | Auditar referencias a hosts, nombres de contenedores, redes y puertos antes de separar las composiciones                |
| Las aplicaciones no pueden resolver servicios de infraestructura                                         | Utilizar `app-network` como red externa compartida y validar resolución DNS entre contenedores                          |
| Variables de entorno hardcodeadas para ambientes locales                                                 | Centralizar endpoints configurables mediante `.env` y `.env.example`                                                    |
| Separar los Compose rompe dependencias existentes                                                        | Ejecutar pruebas de levantamiento y conectividad después de la reorganización                                           |
| Confusión entre servicios compartidos y servicios propios de cada aplicación                             | Mantener una responsabilidad clara: `infrastructure/` para servicios compartidos y `apps/*/` para servicios específicos |
| Configuración local y producción divergen                                                                | Definir explícitamente variables para ambos escenarios y documentarlas en `README.md`                                   |
| Scripts de CI/CD quedan acoplados a la estructura anterior                                               | Revisar y actualizar los scripts existentes dentro de `cicd/` después de la reorganización                              |

---

## 📆 Historial de Cambios

| Fecha      | Estado  | Cambio                                                                                    | Responsable    |
| ---------- | ------- | ----------------------------------------------------------------------------------------- | -------------- |
| 2026-09-05 | BACKLOG | Creación tras hallazgo de auditoría                                                       | Technical Lead |
| 2026-09-07 | BACKLOG | Redefinición de alcance: reestructuración de infraestructura y separación de aplicaciones | Technical Lead |
