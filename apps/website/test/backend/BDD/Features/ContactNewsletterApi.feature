Feature: Contacto y newsletter públicos
  Como visitante del sitio web
  Quiero poder enviar mensajes de contacto y suscribirme al newsletter
  Para comunicarme con Farutech

  @api @contact @smoke
  Scenario: Enviar un mensaje de contacto válido
    Given que la API de Farutech está disponible
    When envío un mensaje de contacto válido
    Then la respuesta debería tener el estatus 201
    And la respuesta debería contener el campo "lead_id"

  @api @contact
  Scenario: Enviar un mensaje de contacto con datos inválidos
    Given que la API de Farutech está disponible
    When envío un mensaje de contacto con el correo inválido "correo-invalido"
    Then la respuesta debería tener el estatus 422

  @api @newsletter @smoke
  Scenario: Suscribirse al newsletter con un correo nuevo
    Given que la API de Farutech está disponible
    When me suscribo al newsletter con el correo "suscripcion.test@farutech.local"
    Then la respuesta debería tener el estatus 200
    And la respuesta debería contener el campo "success"

  @api @newsletter
  Scenario: Suscribirse con un correo inválido
    Given que la API de Farutech está disponible
    When me suscribo al newsletter con el correo "correo-invalido"
    Then la respuesta debería tener el estatus 422

  @api @newsletter @integration
  Scenario: La suscripción persiste en la base de datos PostgreSQL
    Given que la API de Farutech está disponible
    When me suscribo al newsletter con un correo aleatorio
    Then el suscriptor debería existir en la base de datos