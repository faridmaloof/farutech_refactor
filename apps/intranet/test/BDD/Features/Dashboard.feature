Feature: Dashboard de la intranet
  Como colaborador autenticado
  Quiero ver el dashboard corporativo
  Para consultar anuncios y directorio

  @web
  Scenario: El dashboard de la intranet se carga después de autenticarse
    Given que estoy autenticado en la intranet
    Then debería existir un elemento "main" en la página