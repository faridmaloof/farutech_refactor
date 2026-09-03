using Farutech.Admin.Tests.ScreenPlay.Web.Interactions;
using Farutech.Admin.Tests.ScreenPlay.Web.Questions;
using FluentAssertions;
using Framework.Core.BDD;
using Framework.Core.Configuration;
using Framework.Core.ScreenPlay;
using Framework.Core.ScreenPlay.Interfaces;
using Framework.Core.ScreenPlay.Tasks;
using Reqnroll;

namespace Farutech.Admin.Tests.BDD.Steps;

/// <summary>
/// Step definitions para el panel de administración de Farutech.
/// Requieren la app `apps/admin` levantada en admin.farutech.local.
/// </summary>
[Binding]
public class AdminSteps
{
    private readonly ScenarioContext _scenarioContext;

    /// <summary>
    /// Inicializa una nueva instancia de la clase <see cref="AdminSteps"/>.
    /// </summary>
    /// <param name="scenarioContext">El contexto del escenario.</param>
    public AdminSteps(ScenarioContext scenarioContext)
    {
        _scenarioContext = scenarioContext;
    }

    private IActor Actor => ScenarioActor.Get(_scenarioContext);

    private string BaseUrl => SettingsManager.Configuration["FaruTech:AdminBaseUrl"]
        ?? "http://admin.farutech.local";

    [Given("estoy en la página de login del panel de administración")]
    [Given("que estoy en la página de login del panel de administración")]
    public async Task GivenLoginPage()
    {
        await Actor.AttemptsToAsync(NavigateToUrl.To($"{BaseUrl}/login", "networkidle"));
    }

    [Given("estoy autenticado en el panel de administración")]
    [Given("que estoy autenticado en el panel de administración")]
    public async Task GivenAuthenticated()
    {
        await GivenLoginPage();

        var email = SettingsManager.Configuration["FaruTech:AdminApi:Email"] ?? string.Empty;
        var password = SettingsManager.Configuration["FaruTech:AdminApi:Password"] ?? string.Empty;

        await Actor.AttemptsToAsync(
            Enter.TheText(email).Into("input[name='email']"),
            Enter.TheText(password).Into("input[name='password']"),
            Click.On("button[type='submit']")
        );
    }

    [When(@"ingreso las credenciales de administrador configuradas")]
    public async Task WhenEnterCredentials()
    {
        var email = SettingsManager.Configuration["FaruTech:AdminApi:Email"] ?? string.Empty;
        var password = SettingsManager.Configuration["FaruTech:AdminApi:Password"] ?? string.Empty;

        await Actor.AttemptsToAsync(
            Enter.TheText(email).Into("input[name='email']"),
            Enter.TheText(password).Into("input[name='password']")
        );
    }

    [When("envío el formulario de login")]
    public async Task WhenSubmitLogin()
    {
        await Actor.AttemptsToAsync(Click.On("button[type='submit']"));
    }

    [Then(@"la URL debería contener ""([^""]+)""")]
    public async Task ThenUrlContains(string text)
    {
        var url = await Actor.AsksForAsync(PageUrl.Value());
        url.Should().Contain(text, $"la URL debería contener '{text}'");
    }

    [Then(@"debería existir un elemento ""([^""]+)"" en la página")]
    public async Task ThenElementExists(string selector)
    {
        var count = await Actor.AsksForAsync(ElementCount.Of(selector));
        count.Should().BeGreaterThan(0, $"debería existir al menos un elemento '{selector}'");
    }
}