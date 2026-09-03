Feature: Autenticación del panel de administración
  Como administrador
  Quiero iniciar sesión en el panel de administración
  Para acceder a la gestión de Farutech

  @web @smoke
  Scenario: La página de login se carga correctamente
    Given que estoy en la página de login del panel de administración
    Then la URL debería contener "admin"
    And debería existir un elemento "input[name='email']" en la página
    And debería existir un elemento "input[name='password']" en la página

  @web @smoke
  Scenario: Iniciar sesión con credenciales válidas
    Given que estoy en la página de login del panel de administración
    When ingreso las credenciales de administrador configuradas
    And envío el formulario de login
    Then la URL debería contener "dashboard"