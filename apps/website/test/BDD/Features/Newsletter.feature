Feature: Newsletter del sitio público
  Como visitante
  Quiero suscribirme al newsletter
  Para recibir contenido exclusivo de Farutech

  @web @smoke
  Scenario: Suscripción con un correo válido
    Given que estoy en la página de inicio del sitio de Farutech
    When ingreso el correo "e2e.newsletter@farutech.local" en el campo de newsletter
    And envío el formulario de newsletter
    Then debería aparecer el mensaje de éxito del newsletter

  @web
  Scenario: El campo de newsletter está disponible en la página principal
    Given que estoy en la página de inicio del sitio de Farutech
    Then debería existir un elemento "#newsletter-email" en la página