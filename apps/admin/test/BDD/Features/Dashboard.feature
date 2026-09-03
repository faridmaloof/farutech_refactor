Feature: Panel de administración
  Como administrador autenticado
  Quiero ver el dashboard y gestionar los recursos
  Para administrar Farutech

  @web
  Scenario: El dashboard se carga con sus KPIs
    Given que estoy autenticado en el panel de administración
    Then debería existir un elemento "main" en la página

  @web
  Scenario: La navegación de gestión de leads existe
    Given que estoy autenticado en el panel de administración
    Then debería existir un elemento "aside" en la página