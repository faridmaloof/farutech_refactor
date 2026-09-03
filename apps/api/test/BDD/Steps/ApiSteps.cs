using Farutech.Api.Tests.ScreenPlay.Api.Interactions;
using Farutech.Api.Tests.ScreenPlay.Api.Questions;
using FluentAssertions;
using Framework.Core.BDD;
using Framework.Core.Configuration;
using Framework.Core.ScreenPlay;
using Framework.Core.ScreenPlay.Interfaces;
using Framework.Core.Tools.Database;
using Reqnroll;

namespace Farutech.Api.Tests.BDD.Steps;

/// <summary>
/// Step definitions para las features de la API de Farutech.
/// Todos los steps delegan en Tasks y Questions de ScreenPlay.
/// </summary>
[Binding]
public class ApiSteps
{
    private readonly ScenarioContext _scenarioContext;

    /// <summary>
    /// Inicializa una nueva instancia de la clase <see cref="ApiSteps"/>.
    /// </summary>
    /// <param name="scenarioContext">El contexto del escenario.</param>
    public ApiSteps(ScenarioContext scenarioContext)
    {
        _scenarioContext = scenarioContext;
    }

    /// <summary>
    /// Obtiene el actor de API del contexto del escenario.
    /// </summary>
    private IActor Actor => ScenarioActor.GetOrCreate(
        _scenarioContext,
        "ApiActor",
        () =>
        {
            var baseUrl = SettingsManager.Configuration["FaruTech:ApiBaseUrl"]
                ?? throw new InvalidOperationException("FaruTech:ApiBaseUrl no está configurada en appsettings.json");

            var actor = new Actor("API Client");
            actor.WhoCan(new CallAnApi(baseUrl));
            return actor;
        });

    // ================================================================
    // GIVEN
    // ================================================================

    [Given("la API de Farutech está disponible")]
    [Given("que la API de Farutech está disponible")]
    public void GivenApiIsAvailable()
    {
        Actor.Should().NotBeNull();
    }

    [Given("que inicio sesión con las credenciales de administrador configuradas")]
    public Task GivenAdminSession()
    {
        return WhenAdminLogin();
    }

    // ================================================================
    // WHEN
    // ================================================================

    [When("inicio sesión con las credenciales de administrador configuradas")]
    public async Task WhenAdminLogin()
    {
        var email = SettingsManager.Configuration["FaruTech:AdminApi:Email"] ?? string.Empty;
        var password = SettingsManager.Configuration["FaruTech:AdminApi:Password"] ?? string.Empty;
        await LoginAsync(email, password);
    }

    [When(@"inicio sesión con el correo ""([^""]+)"" y la contraseña ""([^""]+)""")]
    public async Task WhenLoginWithCredentials(string email, string password)
    {
        await LoginAsync(email, password);
    }

    [When(@"solicito el endpoint ""([^""]+)"" usando el método ""([^""]+)"" sin token")]
    public Task WhenRequestWithoutToken(string endpoint, string method)
    {
        return RequestAsync(endpoint, method, useToken: false);
    }

    [When(@"solicito el endpoint ""([^""]+)"" usando el método ""([^""]+)"" con el token de sesión")]
    public Task WhenRequestWithToken(string endpoint, string method)
    {
        return RequestAsync(endpoint, method, useToken: true);
    }

    [When(@"actualizo el usuario ""([^""]+)"" con nombre ""([^""]+)""")]
    public Task WhenUpdateUser(string id, string name)
    {
        var json = $@"{{""name"":""{name}""}}";
        return Actor.AttemptsToAsync(new PutJsonRequest($"/users/{id}", json, Actor.Remembered<string>("auth_token")));
    }

    [When("envío un mensaje de contacto válido")]
    public Task WhenSendValidContact()
    {
        var email = $"contacto.{Guid.NewGuid():N}@farutech.local";
        return SendContactAsync(email);
    }

    [When(@"envío un mensaje de contacto con el correo inválido ""([^""]+)""")]
    public Task WhenSendInvalidContact(string email)
    {
        return SendContactAsync(email);
    }

    [When(@"me suscribo al newsletter con el correo ""([^""]+)""")]
    public Task WhenSubscribe(string email)
    {
        var json = $@"{{""email"":""{email}""}}";
        return Actor.AttemptsToAsync(new PostJsonRequest("/newsletter", json));
    }

    [When("me suscribo al newsletter con un correo aleatorio")]
    public Task WhenSubscribeRandom()
    {
        var email = $"suscripcion.{Guid.NewGuid():N}@farutech.local";
        Actor.Remember("last_subscribed_email", email);
        var json = $@"{{""email"":""{email}""}}";
        return Actor.AttemptsToAsync(new PostJsonRequest("/newsletter", json));
    }

    // ================================================================
    // THEN
    // ================================================================

    [Then(@"la respuesta debería tener el estatus (\d+)")]
    public async Task ThenResponseStatus(int expectedStatus)
    {
        var actualStatus = await Actor.AsksForAsync(ResponseStatus.Value());
        actualStatus.Should().Be(expectedStatus, $"se esperaba el estatus HTTP {expectedStatus}");
    }

    [Then("la respuesta no debería tener un estatus de error")]
    public async Task ThenResponseNotError()
    {
        var actualStatus = await Actor.AsksForAsync(ResponseStatus.Value());
        actualStatus.Should().BeLessThan(500, "la respuesta no debería ser un error 5xx");
    }

    [Then("la respuesta debería ser JSON válida")]
    public async Task ThenResponseIsValidJson()
    {
        var isValid = await Actor.AsksForAsync(ResponseBodyIsValidJson.Value());
        isValid.Should().BeTrue("el cuerpo de la respuesta debería ser JSON válido");
    }

    [Then("la respuesta debería contener un token de autorización")]
    public async Task ThenResponseContainsToken()
    {
        var token = await Actor.AsksForAsync(ResponseToken.Value());
        token.Should().NotBeNullOrWhiteSpace("la respuesta de login debería incluir un token");
    }

    [Then(@"la respuesta debería contener el campo ""([^""]+)""")]
    public async Task ThenResponseContainsField(string field)
    {
        var hasField = await Actor.AsksForAsync(ResponseBodyContainsField.Value(field));
        hasField.Should().BeTrue($"la respuesta debería contener el campo '{field}'");
    }

    [Then("el suscriptor debería existir en la base de datos")]
    public async Task ThenSubscriberExistsInDatabase()
    {
        var email = Actor.Remembered<string>("last_subscribed_email");
        email.Should().NotBeNullOrWhiteSpace("se debería haber registrado el correo suscrito");

        var connectionString = SettingsManager.Configuration["FaruTech:Postgres:ConnectionString"]
            ?? throw new InvalidOperationException("FaruTech:Postgres:ConnectionString no está configurada");

        using var db = new PostgreSqlConnection(connectionString);
        var count = await db.QueryFirstOrDefaultAsync<long>(
            "SELECT COUNT(1) FROM newsletter_subscribers WHERE email = @Email",
            new { Email = email });

        count.Should().BeGreaterThan(0, $"el suscriptor {email} debería existir en newsletter_subscribers");
    }

    // ================================================================
    // HELPERS
    // ================================================================

    private async Task LoginAsync(string email, string password)
    {
        var json = $@"{{""email"":""{email}"",""password"":""{password}""}}";
        await Actor.AttemptsToAsync(new PostJsonRequest("/login", json));

        var token = await Actor.AsksForAsync(ResponseToken.Value());
        if (!string.IsNullOrWhiteSpace(token))
        {
            Actor.Remember("auth_token", token);
        }
    }

    private Task RequestAsync(string endpoint, string method, bool useToken)
    {
        var token = useToken ? Actor.Remembered<string>("auth_token") : null;

        return method.ToUpperInvariant() switch
        {
            "GET" => Actor.AttemptsToAsync(new GetRequest(endpoint, token)),
            "POST" => Actor.AttemptsToAsync(new PostJsonRequest(endpoint, "{}", token)),
            "PUT" => Actor.AttemptsToAsync(new PutJsonRequest(endpoint, "{}", token)),
            "PATCH" => Actor.AttemptsToAsync(new PatchJsonRequest(endpoint, "{}", token)),
            "DELETE" => Actor.AttemptsToAsync(new DeleteRequest(endpoint, token)),
            _ => throw new NotSupportedException($"Método HTTP no soportado: {method}")
        };
    }

    private Task SendContactAsync(string email)
    {
        var json = $@"{{
            ""name"":""Juan Prueba"",
            ""email"":""{email}"",
            ""phone"":""+573001234567"",
            ""company"":""Empresa Test"",
            ""service_interest"":""software-development"",
            ""message"":""Este es un mensaje de prueba con la longitud suficiente para superar la validación."",
            ""privacy_accepted"":true
        }}";

        return Actor.AttemptsToAsync(new PostJsonRequest("/contact", json));
    }
}