Feature: Blog de la API Farutech
  Como visitante
  Quiero consultar los posts y categorías publicadas
  Para leer el contenido del blog

  @api @blog @smoke
  Scenario: Listar posts publicados
    Given que la API de Farutech está disponible
    When solicito el endpoint "/blog/posts" usando el método "GET" sin token
    Then la respuesta debería tener el estatus 200
    And la respuesta debería ser JSON válida

  @api @blog
  Scenario: Listar categorías del blog
    Given que la API de Farutech está disponible
    When solicito el endpoint "/blog/categories" usando el método "GET" sin token
    Then la respuesta debería tener el estatus 200

  @api @blog
  Scenario: Las rutas de administración del blog requieren autenticación
    Given que la API de Farutech está disponible
    When solicito el endpoint "/admin/blog" usando el método "GET" sin token
    Then la respuesta debería tener el estatus 401

  @api @blog
  Scenario: Gestión de posts del blog con token de administrador
    Given que la API de Farutech está disponible
    And que inicio sesión con las credenciales de administrador configuradas
    When solicito el endpoint "/admin/blog" usando el método "GET" con el token de sesión
    Then la respuesta debería tener el estatus 200
    And la respuesta debería ser JSON válida