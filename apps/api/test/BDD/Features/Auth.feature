Feature: Autenticación de la API Farutech
  Como cliente API
  Quiero poder autenticarme con Sanctum
  Para proteger y consumir los recursos de administración

  @api @auth @smoke
  Scenario: Inicio de sesión exitoso con credenciales de administrador
    Given que la API de Farutech está disponible
    When inicio sesión con las credenciales de administrador configuradas
    Then la respuesta debería tener el estatus 200
    And la respuesta debería ser JSON válida
    And la respuesta debería contener un token de autorización

  @api @auth
  Scenario: Inicio de sesión fallido con credenciales inválidas
    Given que la API de Farutech está disponible
    When inicio sesión con el correo "noexiste@farutech.com" y la contraseña "ClaveIncorrecta2024#"
    Then la respuesta debería tener el estatus 401

  @api @auth @smoke
  Scenario: El endpoint del usuario actual requiere autenticación
    Given que la API de Farutech está disponible
    When solicito el endpoint "/user" usando el método "GET" sin token
    Then la respuesta debería tener el estatus 401

  @api @auth
  Scenario: Consultar el usuario autenticado con token válido
    Given que la API de Farutech está disponible
    And que inicio sesión con las credenciales de administrador configuradas
    When solicito el endpoint "/user" usando el método "GET" con el token de sesión
    Then la respuesta debería tener el estatus 200
    And la respuesta debería contener el campo "id"

  @api @auth
  Scenario: Cerrar sesión revoca el token
    Given que la API de Farutech está disponible
    And que inicio sesión con las credenciales de administrador configuradas
    When solicito el endpoint "/logout" usando el método "POST" con el token de sesión
    Then la respuesta debería tener el estatus 200
    When solicito el endpoint "/user" usando el método "GET" con el token de sesión
    Then la respuesta debería tener el estatus 401