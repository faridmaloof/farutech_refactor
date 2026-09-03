using Framework.Core.ScreenPlay;
using Framework.Core.ScreenPlay.Interfaces;
using Microsoft.Playwright;
using Reqnroll;

namespace Scaffolding.Tests.BDD.Hooks;

/// <summary>
/// Global hooks for test lifecycle management.
/// Handles browser, context, page, and actor setup/teardown.
/// </summary>
/// <remarks>
/// Initializes a new instance of the <see cref="GlobalHooks"/> class.
/// </remarks>
/// <param name="scenarioContext">The scenario context.</param>
[Binding]
public class GlobalHooks(ScenarioContext scenarioContext)
{
    private readonly ScenarioContext _scenarioContext = scenarioContext;
    private IPlaywright? _playwright;
    private IBrowser? _browser;
    private IBrowserContext? _context;
    private IPage? _page;


    /// <summary>
    /// Runs before the entire test run.
    /// </summary>
    [BeforeTestRun]
    public static async Task BeforeTestRunAsync()
    {
        Console.WriteLine("=== Test Run Started ===");
        await System.Threading.Tasks.Task.CompletedTask;
    }

    /// <summary>
    /// Runs after the entire test run.
    /// </summary>
    [AfterTestRun]
    public static async Task AfterTestRunAsync()
    {
        Console.WriteLine("=== Test Run Finished ===");
        await System.Threading.Tasks.Task.CompletedTask;
    }

    /// <summary>
    /// Runs before each scenario.
    /// Sets up Playwright browser, context, page, and actor.
    /// </summary>
    [BeforeScenario]
    public async Task BeforeScenario()
    {
        Console.WriteLine($"[HOOK] BeforeScenario INICIANDO: {_scenarioContext.ScenarioInfo.Title}");
        _scenarioContext["ScenarioStartTime"] = DateTimeOffset.UtcNow;

        // Create Playwright browser
        _playwright = await Playwright.CreateAsync();
        _browser = await _playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
        {
            Headless = true,
            Args = new[] { "--disable-gpu", "--no-sandbox" }
        });
        _context = await _browser.NewContextAsync(new BrowserNewContextOptions
        {
            ViewportSize = new ViewportSize { Width = 1920, Height = 1080 }
        });
        _page = await _context.NewPageAsync();

        // Create actor with BrowseTheWeb ability - DIRECT REGISTER
        var actor = new Actor("Test User");
        var browseTheWeb = new BrowseTheWeb(_page);
        
        // Register ability directly
        actor.WhoCan(browseTheWeb);
        
        Console.WriteLine($"[HOOK] BrowseTheWeb creado: {browseTheWeb.DisplayName}");
        Console.WriteLine($"[HOOK] Actor creado: {actor.Name}, Abilities: {actor.Can<BrowseTheWeb>()}");

        // Register in Reqnroll container for dependency injection
        _scenarioContext.ScenarioContainer.RegisterInstanceAs<Framework.Core.ScreenPlay.Interfaces.IActor>(actor);
        _scenarioContext["Actor"] = actor;
        _scenarioContext["Page"] = _page;
        _scenarioContext["BrowseTheWeb"] = browseTheWeb;
        
        Console.WriteLine($"[HOOK] Actor registrado en contexto");
    }

    /// <summary>
    /// Runs after each scenario.
    /// Cleans up browser resources and reports test status.
    /// </summary>
    [AfterScenario]
    public async Task AfterScenario()
    {
        var startTime = _scenarioContext.TryGetValue("ScenarioStartTime", out var st)
            ? (DateTimeOffset)st : DateTimeOffset.UtcNow;
        var duration = DateTimeOffset.UtcNow - startTime;
        var status = _scenarioContext.TestError == null ? "PASSED" : "FAILED";
        Console.WriteLine($"[SCENARIO] {status}: {_scenarioContext.ScenarioInfo.Title} ({duration.TotalSeconds:F2}s)");

        // Cleanup resources
        if (_context != null) await _context.CloseAsync();
        if (_browser != null) await _browser.CloseAsync();
        _playwright?.Dispose();

        // Dispose actor
        if (_scenarioContext.TryGetValue("Actor", out var actorObj) && actorObj is IActor actor)
        {
            (actor as IDisposable)?.Dispose();
        }
        
        // Dispose BrowseTheWeb ability
        if (_scenarioContext.TryGetValue("BrowseTheWeb", out var browseTheWebObj) && browseTheWebObj is BrowseTheWeb browseTheWeb)
        {
            await browseTheWeb.DisposeAsync();
        }
    }

    /// <summary>
    /// Runs before each step.
    /// Logs the step name.
    /// </summary>
    [BeforeStep]
    public void BeforeStep()
    {
        Console.WriteLine($"  [STEP] {_scenarioContext.StepContext.StepInfo.Text}");
    }

    /// <summary>
    /// Runs after each step.
    /// Logs step failures.
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
