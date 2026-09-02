namespace Framework.Core.Configuration;

/// <summary>
/// Browser type enumeration with full support for all major browsers.
/// </summary>
public enum BrowserType
{
    /// <summary>
    /// Chromium browser (open-source base for Chrome, Edge, etc.).
    /// </summary>
    Chromium = 0,

    /// <summary>
    /// Google Chrome browser.
    /// </summary>
    Chrome = 1,

    /// <summary>
    /// Microsoft Edge browser (Chromium-based).
    /// </summary>
    Edge = 2,

    /// <summary>
    /// Mozilla Firefox browser.
    /// </summary>
    Firefox = 3,

    /// <summary>
    /// Apple Safari browser (WebKit).
    /// </summary>
    Safari = 4,

    /// <summary>
    /// Internet Explorer (legacy, via Edge IE mode).
    /// </summary>
    InternetExplorer = 5,

    /// <summary>
    /// WebKit browser (open-source base for Safari).
    /// </summary>
    WebKit = 6,

    /// <summary>
    /// Thorium browser (optimized Chromium fork).
    /// </summary>
    Thorium = 7,

    /// <summary>
    /// Brave browser (Chromium-based with privacy features).
    /// </summary>
    Brave = 8,

    /// <summary>
    /// Opera browser (Chromium-based).
    /// </summary>
    Opera = 9
}

/// <summary>
/// Screenshot capture mode enumeration.
/// </summary>
public enum ScreenshotMode
{
    /// <summary>
    /// No screenshots.
    /// </summary>
    Disabled = 0,

    /// <summary>
    /// Capture only on failure.
    /// </summary>
    OnFailure = 1,

    /// <summary>
    /// Capture before each step.
    /// </summary>
    PreStep = 2,

    /// <summary>
    /// Capture after each step.
    /// </summary>
    PostStep = 3,

    /// <summary>
    /// Capture before and after each step.
    /// </summary>
    PreAndPost = 4,

    /// <summary>
    /// Always capture (Pre + Post + OnFailure).
    /// </summary>
    Always = 5
}

/// <summary>
/// Video recording mode enumeration.
/// </summary>
public enum VideoMode
{
    /// <summary>
    /// No video recording.
    /// </summary>
    Disabled = 0,

    /// <summary>
    /// Record only on failure.
    /// </summary>
    OnFailure = 1,

    /// <summary>
    /// Always record video.
    /// </summary>
    Always = 2
}

/// <summary>
/// Observability mode for metrics and tracing.
/// </summary>
public enum ObservabilityMode
{
    /// <summary>
    /// Observability disabled.
    /// </summary>
    Disabled = 0,

    /// <summary>
    /// Direct export to Prometheus/OpenTelemetry.
    /// </summary>
    Direct = 1,

    /// <summary>
    /// Queue-based export (aggregated events).
    /// </summary>
    Queue = 2,

    /// <summary>
    /// Console output (development mode).
    /// </summary>
    Console = 3
}
