using Framework.Core.BDD;
using Framework.Core.Configuration;
using Framework.Core.ScreenPlay;
using Framework.Core.ScreenPlay.Interfaces;
using Microsoft.Playwright;
using Reqnroll;

namespace Farutech.Intranet.Tests.BDD.Hooks;

/// <summary>
/// Hooks globales del ciclo de vida de los tests web de Farutech Website.
/// Configura el browser (Playwright) y el actor con BrowseTheWeb para escenarios @web.
/// </summary>
/// <remarks>
/// Inicializa una nueva instancia de la clase <see cref="GlobalHooks"/>.
/// </remarks>
/// <param name="scenarioContext">El contexto del escenario.</param>
[Binding]
public class GlobalHooks(ScenarioContext scenarioContext)
{
    private readonly ScenarioContext _scenarioContext = scenarioContext;
    private IPlaywright? _playwright;
    private IBrowser? _browser;
    private IBrowserContext? _context;
    private IPage? _page;

    /// <summary>
    /// Loguea el inicio de la corrida.
    /// </summary>
    [BeforeTestRun]
    public static void BeforeTestRun()
    {
        Console.WriteLine("=== Farutech Intranet Tests — Run Started ===");
    }

    /// <summary>
    /// Loguea el fin de la corrida.
    /// </summary>
    [AfterTestRun]
    public static void AfterTestRun()
    {
        Console.WriteLine("=== Farutech Intranet Tests — Run Finished ===");
    }

    /// <summary>
    /// Corre antes de cada escenario @web. Configura browser, contexto, página y actor.
    /// </summary>
    [BeforeScenario("web")]
    public async Task BeforeWebScenario()
    {
        Console.WriteLine($"[HOOK] BeforeScenario (web): {_scenarioContext.ScenarioInfo.Title}");
        _scenarioContext["ScenarioStartTime"] = DateTimeOffset.UtcNow;

        var headless = SettingsManager.FrameworkSettings.Headless;

        _playwright = await Playwright.CreateAsync();
        _browser = await _playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
        {
            Headless = headless,
            Args = new[] { "--disable-gpu", "--no-sandbox" }
        });

        _context = await _browser.NewContextAsync(new BrowserNewContextOptions
        {
            ViewportSize = new ViewportSize { Width = 1920, Height = 1080 }
        });
        _page = await _context.NewPageAsync();

        var actor = new Actor("Test User");
        var browseTheWeb = new BrowseTheWeb(_page);
        actor.WhoCan(browseTheWeb);

        _scenarioContext.ScenarioContainer.RegisterInstanceAs<IActor>(actor);
        _scenarioContext["Actor"] = actor;
        _scenarioContext["Page"] = _page;
        _scenarioContext["BrowseTheWeb"] = browseTheWeb;
    }

    /// <summary>
    /// Corre después de cada escenario @web. Limpia recursos del browser.
    /// </summary>
    [AfterScenario("web")]
    public async Task AfterWebScenario()
    {
        var startTime = _scenarioContext.TryGetValue("ScenarioStartTime", out var st)
            ? (DateTimeOffset)st : DateTimeOffset.UtcNow;
        var duration = DateTimeOffset.UtcNow - startTime;
        var status = _scenarioContext.TestError == null ? "PASSED" : "FAILED";
        Console.WriteLine($"[SCENARIO] {status}: {_scenarioContext.ScenarioInfo.Title} ({duration.TotalSeconds:F2}s)");

        if (_context != null) await _context.CloseAsync();
        if (_browser != null) await _browser.CloseAsync();
        _playwright?.Dispose();

        if (_scenarioContext.TryGetValue("Actor", out var actorObj) && actorObj is IActor actor)
        {
            (actor as IDisposable)?.Dispose();
        }

        if (_scenarioContext.TryGetValue("BrowseTheWeb", out var browseTheWebObj) && browseTheWebObj is BrowseTheWeb browseTheWeb)
        {
            await browseTheWeb.DisposeAsync();
        }

        ScenarioActor.Clear();
    }

    /// <summary>
    /// Loguea cada paso antes de ejecutarse.
    /// </summary>
    [BeforeStep]
    public void BeforeStep()
    {
        Console.WriteLine($"  [STEP] {_scenarioContext.StepContext.StepInfo.Text}");
    }

    /// <summary>
    /// Loguea fallos de pasos.
    /// </summary>
    [AfterStep]
    public void AfterStep()
    {
        if (_scenarioContext.TestError != null)
        {
            Console.WriteLine($"  [STEP] FAILED: {_scenarioContext.TestError.Message}");
        }
    }
}