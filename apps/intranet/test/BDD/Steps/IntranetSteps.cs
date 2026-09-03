using Farutech.Intranet.Tests.ScreenPlay.Web.Interactions;
using Farutech.Intranet.Tests.ScreenPlay.Web.Questions;
using FluentAssertions;
using Framework.Core.BDD;
using Framework.Core.Configuration;
using Framework.Core.ScreenPlay;
using Framework.Core.ScreenPlay.Interfaces;
using Framework.Core.ScreenPlay.Tasks;
using Reqnroll;

namespace Farutech.Intranet.Tests.BDD.Steps;

/// <summary>
/// Step definitions para la intranet corporativa de Farutech.
/// Requieren la app `apps/intranet` levantada en intranet.farutech.local.
/// </summary>
[Binding]
public class IntranetSteps
{
    private readonly ScenarioContext _scenarioContext;

    /// <summary>
    /// Inicializa una nueva instancia de la clase <see cref="IntranetSteps"/>.
    /// </summary>
    /// <param name="scenarioContext">El contexto del escenario.</param>
    public IntranetSteps(ScenarioContext scenarioContext)
    {
        _scenarioContext = scenarioContext;
    }

    private IActor Actor => ScenarioActor.Get(_scenarioContext);

    private string BaseUrl => SettingsManager.Configuration["FaruTech:IntranetBaseUrl"]
        ?? "http://intranet.farutech.local";

    // ================================================================
    // GIVEN
    // ================================================================

    [Given("estoy en la página de login de la intranet")]
    [Given("que estoy en la página de login de la intranet")]
    public async Task GivenLoginPage()
    {
        await Actor.AttemptsToAsync(NavigateToUrl.To($"{BaseUrl}/login", "networkidle"));
    }

    [Given("estoy autenticado en la intranet")]
    [Given("que estoy autenticado en la intranet")]
    public async Task GivenAuthenticated()
    {
        await GivenLoginPage();

        await WhenEnterCredentials();
        await WhenSubmitLogin();
    }

    // ================================================================
    // WHEN
    // ================================================================

    [When(@"ingreso las credenciales de colaborador configuradas")]
    public async Task WhenEnterCredentials()
    {
        var email = SettingsManager.Configuration["FaruTech:Collaborator:Email"] ?? string.Empty;
        var password = SettingsManager.Configuration["FaruTech:Collaborator:Password"] ?? string.Empty;

        await Actor.AttemptsToAsync(
            Enter.TheText(email).Into("input[name='email']"),
            Enter.TheText(password).Into("input[name='password']")
        );
    }

    [When("envío el formulario de login de la intranet")]
    public async Task WhenSubmitLogin()
    {
        await Actor.AttemptsToAsync(Click.On("button[type='submit']"));
    }

    // ================================================================
    // THEN
    // ================================================================

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