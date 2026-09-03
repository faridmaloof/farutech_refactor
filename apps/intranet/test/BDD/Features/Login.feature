Feature: Autenticación de la intranet corporativa
  Como colaborador
  Quiero iniciar sesión en la intranet
  Para acceder a la información corporativa de Farutech

  @web @smoke
  Scenario: La página de login de la intranet se carga correctamente
    Given que estoy en la página de login de la intranet
    Then la URL debería contener "login"
    And debería existir un elemento "input[name='email']" en la página
    And debería existir un elemento "input[name='password']" en la página

  @web @smoke
  Scenario: Iniciar sesión con credenciales válidas
    Given que estoy en la página de login de la intranet
    When ingreso las credenciales de colaborador configuradas
    And envío el formulario de login de la intranet
    Then la URL debería contener "dashboard"