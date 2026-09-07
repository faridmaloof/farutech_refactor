Feature: Configuración del panel y KPIs del dashboard
  Como administrador
  Quiero consultar la configuración global y las métricas del dashboard
  Para controlar las políticas y medir el desempeño del sistema

  @api @settings @smoke
  Scenario: Consultar la política pública de registro
    Given que la API de Farutech está disponible
    When solicito el endpoint "/settings/public" usando el método "GET" sin token
    Then la respuesta debería tener el estatus 200
    And la respuesta debería ser JSON válida

  @api @settings
  Scenario: La configuración de administración requiere autenticación
    Given que la API de Farutech está disponible
    When solicito el endpoint "/admin/settings" usando el método "GET" sin token
    Then la respuesta debería tener el estatus 401

  @api @settings
  Scenario: Consultar la configuración completa con token
    Given que la API de Farutech está disponible
    And que inicio sesión con las credenciales de administrador configuradas
    When solicito el endpoint "/admin/settings" usando el método "GET" con el token de sesión
    Then la respuesta debería tener el estatus 200
    And la respuesta debería contener el campo "data"

  @api @dashboard @smoke
  Scenario: Los KPIs del dashboard requieren autenticación
    Given que la API de Farutech está disponible
    When solicito el endpoint "/admin/dashboard/stats" usando el método "GET" sin token
    Then la respuesta debería tener el estatus 401

  @api @dashboard
  Scenario: Los KPIs del dashboard con token de administrador
    Given que la API de Farutech está disponible
    And que inicio sesión con las credenciales de administrador configuradas
    When solicito el endpoint "/admin/dashboard/stats" usando el método "GET" con el token de sesión
    Then la respuesta debería tener el estatus 200
    And la respuesta debería contener el campo "totalLeads"