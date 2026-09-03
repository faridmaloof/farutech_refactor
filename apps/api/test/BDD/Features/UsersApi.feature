Feature: Gestión de usuarios de la API
  Como administrador
  Quiero gestionar usuarios a través de la API
  Para administrar el acceso al panel de Farutech

  @api @users @smoke
  Scenario: Listar usuarios requiere autenticación
    Given que la API de Farutech está disponible
    When solicito el endpoint "/users" usando el método "GET" sin token
    Then la respuesta debería tener el estatus 401

  @api @users
  Scenario: Listar usuarios con token de administrador
    Given que la API de Farutech está disponible
    And que inicio sesión con las credenciales de administrador configuradas
    When solicito el endpoint "/users" usando el método "GET" con el token de sesión
    Then la respuesta debería tener el estatus 200
    And la respuesta debería ser JSON válida

  @api @users
  Scenario: Ver un usuario específico con token
    Given que la API de Farutech está disponible
    And que inicio sesión con las credenciales de administrador configuradas
    When solicito el endpoint "/users/1" usando el método "GET" con el token de sesión
    Then la respuesta debería tener el estatus 200
    And la respuesta debería contener el campo "id"

  @api @users
  Scenario: Actualizar un usuario con token
    Given que la API de Farutech está disponible
    And que inicio sesión con las credenciales de administrador configuradas
    When actualizo el usuario "1" con nombre "Usuario Editado"
    Then la respuesta debería tener el estatus 200