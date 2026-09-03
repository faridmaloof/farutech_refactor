Feature: Página de inicio del sitio público de Farutech
  Como visitante
  Quiero que la página de inicio cargue correctamente
  Para conocer la empresa y sus servicios

  @web @smoke
  Scenario: La página de inicio se carga correctamente
    Given que estoy en la página de inicio del sitio de Farutech
    Then la URL no debería estar vacía
    And el título de la página no debería estar vacío
    And debería existir un elemento "header" en la página
    And debería existir un elemento "footer" en la página

  @web @smoke
  Scenario: La página principal incluye su estructura principal
    Given que estoy en la página de inicio del sitio de Farutech
    Then debería existir un elemento "main" en la página