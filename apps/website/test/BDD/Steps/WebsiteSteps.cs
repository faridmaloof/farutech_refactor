using Farutech.Website.Tests.ScreenPlay.Web.Interactions;
using Farutech.Website.Tests.ScreenPlay.Web.Questions;
using FluentAssertions;
using Framework.Core.BDD;
using Framework.Core.Configuration;
using Framework.Core.ScreenPlay;
using Framework.Core.ScreenPlay.Interfaces;
using Framework.Core.ScreenPlay.Tasks;
using Microsoft.Playwright;
using Reqnroll;

namespace Farutech.Website.Tests.BDD.Steps;

/// <summary>
/// Step definitions para las features del sitio público de Farutech.
/// Delegar en Tasks y Questions de ScreenPlay; sin lógica de negocio en steps.
/// </summary>
[Binding]
public class WebsiteSteps
{
    private readonly ScenarioContext _scenarioContext;

    /// <summary>
    /// Inicializa una nueva instancia de la clase <see cref="WebsiteSteps"/>.
    /// </summary>
    /// <param name="scenarioContext">El contexto del escenario.</param>
    public WebsiteSteps(ScenarioContext scenarioContext)
    {
        _scenarioContext = scenarioContext;
    }

    /// <summary>
    /// Obtiene el actor web del escenario.
    /// </summary>
    private IActor Actor => ScenarioActor.Get(_scenarioContext);

    /// <summary>
    /// URL base del sitio, configurable vía appsettings o variable de entorno.
    /// </summary>
    private string BaseUrl => SettingsManager.Configuration["FaruTech:WebsiteBaseUrl"]
        ?? "http://farutech.local";

    // ================================================================
    // GIVEN
    // ================================================================

    [Given("estoy en la página de inicio del sitio de Farutech")]
    [Given("que estoy en la página de inicio del sitio de Farutech")]
    public async Task GivenHomePage()
    {
        await Actor.AttemptsToAsync(NavigateToUrl.To(BaseUrl, "networkidle"));
    }

    // ================================================================
    // WHEN
    // ================================================================

    [When(@"navego a la ruta ""([^""]+)""")]
    public async Task WhenNavigateTo(string path)
    {
        await Actor.AttemptsToAsync(NavigateToUrl.To($"{BaseUrl}{path}", "networkidle"));
    }

    [When(@"ingreso el correo ""([^""]+)"" en el campo de newsletter")]
    public async Task WhenEnterNewsletterEmail(string email)
    {
        await Actor.AttemptsToAsync(Enter.TheText(email).Into("#newsletter-email"));
    }

    [When("envío el formulario de newsletter")]
    public async Task WhenSubmitNewsletter()
    {
        await Actor.AttemptsToAsync(Click.On("button[type='submit']"));
    }

    // ================================================================
    // THEN
    // ================================================================

    [Then("la URL no debería estar vacía")]
    public async Task ThenUrlNotEmpty()
    {
        var url = await Actor.AsksForAsync(PageUrl.Value());
        url.Should().NotBeNullOrWhiteSpace("la URL de la página debería estar definida");
    }

    [Then(@"la URL debería contener ""([^""]+)""")]
    public async Task ThenUrlContains(string text)
    {
        var url = await Actor.AsksForAsync(PageUrl.Value());
        url.Should().Contain(text, $"la URL debería contener '{text}'");
    }

    [Then("el título de la página no debería estar vacío")]
    public async Task ThenPageTitleNotEmpty()
    {
        var title = await Actor.AsksForAsync(PageTitle.Value());
        title.Should().NotBeNullOrWhiteSpace("el título de la página no debería estar vacío");
    }

    [Then(@"debería existir un elemento ""([^""]+)"" en la página")]
    public async Task ThenElementExists(string selector)
    {
        var count = await Actor.AsksForAsync(ElementCount.Of(selector));
        count.Should().BeGreaterThan(0, $"debería existir al menos un elemento '{selector}'");
    }

    [Then("debería aparecer el mensaje de éxito del newsletter")]
    public async Task ThenNewsletterSuccessMessage()
    {
        var ability = Actor.AbilityTo<BrowseTheWeb>();
        var successMessage = ability.Page.Locator("text=/exitosamente|Gracias por suscribirte/").First;

        await successMessage.WaitForAsync(new LocatorWaitForOptions
        {
            State = WaitForSelectorState.Visible,
            Timeout = 15_000,
        });
    }
}