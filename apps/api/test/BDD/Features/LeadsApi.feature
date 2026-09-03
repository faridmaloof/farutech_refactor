Feature: MiniCRM de leads
  Como administrador
  Quiero consultar los leads y sus métricas
  Para hacer seguimiento a las oportunidades de negocio

  @api @leads @smoke
  Scenario: Listar leads requiere autenticación
    Given que la API de Farutech está disponible
    When solicito el endpoint "/admin/leads" usando el método "GET" sin token
    Then la respuesta debería tener el estatus 401

  @api @leads
  Scenario: Listar leads con token de administrador
    Given que la API de Farutech está disponible
    And que inicio sesión con las credenciales de administrador configuradas
    When solicito el endpoint "/admin/leads" usando el método "GET" con el token de sesión
    Then la respuesta debería tener el estatus 200
    And la respuesta debería ser JSON válida

  @api @leads
  Scenario: Estadísticas de leads con token de administrador
    Given que la API de Farutech está disponible
    And que inicio sesión con las credenciales de administrador configuradas
    When solicito el endpoint "/admin/leads/stats" usando el método "GET" con el token de sesión
    Then la respuesta debería tener el estatus 200

  @api @leads
  Scenario: Ver un lead específico con token
    Given que la API de Farutech está disponible
    And que inicio sesión con las credenciales de administrador configuradas
    When solicito el endpoint "/admin/leads/1" usando el método "GET" con el token de sesión
    Then la respuesta no debería tener un estatus de error