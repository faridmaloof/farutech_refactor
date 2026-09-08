using Framework.Core.Configuration;
using Framework.Core.ScreenPlay;
using Framework.Core.ScreenPlay.Interfaces;
using Farutech.Api.Tests.ScreenPlay.Api.Interactions;
using Framework.Core.BDD;
using Reqnroll;

namespace Farutech.Api.Tests.BDD.Hooks;

/// <summary>
/// Hooks globales del ciclo de vida de los tests de API Farutech.
/// Crea un actor con la habilidad CallAnApi para cada escenario @api.
/// </summary>
/// <remarks>
/// Inicializa una nueva instancia de la clase <see cref="GlobalHooks"/>.
/// </remarks>
/// <param name="scenarioContext">El contexto del escenario.</param>
[Binding]
public class GlobalHooks(ScenarioContext scenarioContext)
{
    private readonly ScenarioContext _scenarioContext = scenarioContext;

    /// <summary>
    /// Corre antes de cada escenario etiquetado como @api.
    /// Configura el actor de API sin necesidad de navegador.
    /// </summary>
    [BeforeScenario("api")]
    public void BeforeApiScenario()
    {
        Console.WriteLine($"[HOOK] BeforeScenario (api): {_scenarioContext.ScenarioInfo.Title}");

        var baseUrl = SettingsManager.Configuration["FaruTech:ApiBaseUrl"]
            ?? throw new InvalidOperationException("FaruTech:ApiBaseUrl no está configurada en appsettings.json");

        var actor = new Actor("API Client");
        actor.WhoCan(new CallAnApi(baseUrl));

        _scenarioContext["Actor"] = actor;
        _scenarioContext["ApiActor"] = actor;
        _scenarioContext.ScenarioContainer.RegisterInstanceAs<IActor>(actor);
    }

    /// <summary>
    /// Corre después de cada escenario @api.
    /// Limpia el actor y el cache del ScenarioActor.
    /// </summary>
    [AfterScenario("api")]
    public void AfterApiScenario()
    {
        var status = _scenarioContext.TestError == null ? "PASSED" : "FAILED";
        Console.WriteLine($"[SCENARIO] {status}: {_scenarioContext.ScenarioInfo.Title}");

        if (_scenarioContext.TryGetValue("ApiActor", out var actorObj) && actorObj is IDisposable disposable)
        {
            disposable.Dispose();
        }

        ScenarioActor.Clear();
    }

    /// <summary>
    /// Corre antes de cada paso para loguear su texto.
    /// </summary>
    [BeforeStep]
    public void BeforeStep()
    {
        Console.WriteLine($"  [STEP] {_scenarioContext.StepContext.StepInfo.Text}");
    }

    /// <summary>
    /// Corre después de cada paso para loguear fallos.
    /// </summary>
    [AfterStep]
    public void AfterStep()
    {
        if (_scenarioContext.TestError != null)
        {
            Console.WriteLine($"  [STEP] FAILED: {_scenarioContext.TestError.Message}");
        }
    }

    /// <summary>
    /// Loguea el inicio de la corrida.
    /// </summary>
    [BeforeTestRun]
    public static void BeforeTestRun()
    {
        Console.WriteLine("=== Farutech API Tests — Run Started ===");
    }

    /// <summary>
    /// Loguea el fin de la corrida.
    /// </summary>
    [AfterTestRun]
    public static void AfterTestRun()
    {
        Console.WriteLine("=== Farutech API Tests — Run Finished ===");
    }
}