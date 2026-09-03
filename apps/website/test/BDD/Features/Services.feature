Feature: Páginas institucionales y de servicios
  Como visitante
  Quiero explorar los servicios y las páginas institucionales de Farutech
  Para conocer las soluciones disponibles

  @web @smoke
  Scenario: Navegar al catálogo de servicios
    Given que estoy en la página de inicio del sitio de Farutech
    When navego a la ruta "/services"
    Then la URL debería contener "/services"
    And el título de la página no debería estar vacío

  @web
  Scenario: Navegar a la página de casos de éxito
    Given que estoy en la página de inicio del sitio de Farutech
    When navego a la ruta "/case-studies"
    Then la URL debería contener "/case-studies"

  @web
  Scenario: Navegar a la página de nosotros
    Given que estoy en la página de inicio del sitio de Farutech
    When navego a la ruta "/about-us"
    Then la URL debería contener "/about-us"

  @web
  Scenario: Navegar a la página de ecosistema
    Given que estoy en la página de inicio del sitio de Farutech
    When navego a la ruta "/ecosistema"
    Then la URL debería contener "/ecosistema"