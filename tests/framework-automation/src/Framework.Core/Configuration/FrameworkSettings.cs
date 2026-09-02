namespace Framework.Core.Configuration;

/// <summary>
/// Timeout settings.
/// </summary>
public class TimeoutSettings
{
    /// <summary>
    /// Gets or sets the global timeout in seconds.
    /// Default: 30
    /// </summary>
    public int GlobalTimeoutSeconds { get; set; } = 30;

    /// <summary>
    /// Gets or sets the navigation timeout in seconds.
    /// Default: 30
    /// </summary>
    public int NavigationTimeoutSeconds { get; set; } = 30;

    /// <summary>
    /// Gets or sets the action timeout in seconds.
    /// Default: 10
    /// </summary>
    public int ActionTimeoutSeconds { get; set; } = 10;
}

/// <summary>
/// Evidence collection settings.
/// </summary>
public class EvidenceSettings : IEvidenceSettings
{
    /// <summary>
    /// Gets or sets the screenshot capture mode.
    /// Default: PreAndPost
    /// </summary>
    public ScreenshotMode Screenshot { get; set; } = ScreenshotMode.PreAndPost;

    /// <summary>
    /// Gets or sets the video recording mode.
    /// Default: OnFailure
    /// </summary>
    public VideoMode Video { get; set; } = VideoMode.OnFailure;

    /// <summary>
    /// Gets or sets whether to enable trace recording.
    /// Default: true
    /// </summary>
    public bool Trace { get; set; } = true;

    /// <summary>
    /// Gets or sets the evidence storage path.
    /// Default: ./evidence
    /// </summary>
    public string StoragePath { get; set; } = "./evidence";
}

/// <summary>
/// Parallelism settings.
/// </summary>
public class ParallelismSettings
{
    /// <summary>
    /// Gets or sets the maximum number of parallel workers.
    /// Default: 4
    /// </summary>
    public int MaxWorkers { get; set; } = 4;

    /// <summary>
    /// Gets or sets whether to enable sharding for CI.
    /// Default: false
    /// </summary>
    public bool EnableSharding { get; set; } = false;
}

/// <summary>
/// Device/browser settings.
/// </summary>
public class DeviceSettings : IDeviceSettings
{
    /// <summary>
    /// Gets or sets the browser type.
    /// Default: Chromium
    /// </summary>
    public BrowserType Browser { get; set; } = BrowserType.Chromium;

    /// <summary>
    /// Gets or sets whether to run in headless mode.
    /// Default: true
    /// </summary>
    public bool Headless { get; set; } = true;

    /// <summary>
    /// Gets or sets the viewport width.
    /// Default: 1920
    /// </summary>
    public int ViewportWidth { get; set; } = 1920;

    /// <summary>
    /// Gets or sets the viewport height.
    /// Default: 1080
    /// </summary>
    public int ViewportHeight { get; set; } = 1080;

    /// <summary>
    /// Gets the viewport as an array.
    /// </summary>
    public int[] Viewport => new[] { ViewportWidth, ViewportHeight };
}

/// <summary>
/// Main framework settings.
/// </summary>
public class FrameworkSettings : IFrameworkSettings
{
    /// <summary>
    /// Gets or sets the environment name.
    /// Default: Development
    /// </summary>
    public string Environment { get; set; } = "Development";

    /// <summary>
    /// Gets or sets the culture.
    /// Default: en-US
    /// </summary>
    public string Culture { get; set; } = "en-US";

    /// <summary>
    /// Gets or sets whether to run in headless mode.
    /// Default: true
    /// </summary>
    public bool Headless { get; set; } = true;

    /// <summary>
    /// Gets or sets the timeout settings.
    /// </summary>
    public TimeoutSettings Timeouts { get; set; } = new();

    /// <summary>
    /// Gets or sets the evidence settings.
    /// </summary>
    public EvidenceSettings Evidence { get; set; } = new();

    /// <summary>
    /// Gets or sets the parallelism settings.
    /// </summary>
    public ParallelismSettings Parallelism { get; set; } = new();

    /// <summary>
    /// Gets or sets the observability settings.
    /// </summary>
    public ObservabilitySettings Observability { get; set; } = new();
}
