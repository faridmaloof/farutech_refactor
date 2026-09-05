namespace Framework.Core.Configuration;

/// <summary>
/// Observability settings for metrics, tracing, and dashboards.
/// </summary>
public class ObservabilitySettings
{
    /// <summary>
    /// Gets or sets the observability mode.
    /// Default: Console (development mode)
    /// </summary>
    public ObservabilityMode Mode { get; set; } = ObservabilityMode.Console;

    /// <summary>
    /// Gets or sets whether to enable metrics collection.
    /// Default: true
    /// </summary>
    public bool EnableMetrics { get; set; } = true;

    /// <summary>
    /// Gets or sets whether to enable distributed tracing.
    /// Default: false
    /// </summary>
    public bool EnableTracing { get; set; } = false;

    /// <summary>
    /// Gets or sets the Prometheus endpoint URL.
    /// Default: http://localhost:9090
    /// </summary>
    public string PrometheusEndpoint { get; set; } = "http://localhost:9090";

    /// <summary>
    /// Gets or sets the Grafana endpoint URL.
    /// Default: http://localhost:3000
    /// </summary>
    public string GrafanaEndpoint { get; set; } = "http://localhost:3000";

    /// <summary>
    /// Gets or sets the OpenTelemetry OTLP endpoint URL.
    /// Default: http://localhost:4317
    /// </summary>
    public string OtlpEndpoint { get; set; } = "http://localhost:4317";

    /// <summary>
    /// Gets or sets the metrics export interval in seconds.
    /// Default: 60
    /// </summary>
    public int ExportIntervalSeconds { get; set; } = 60;

    /// <summary>
    /// Gets or sets whether to auto-open Grafana dashboards after test run.
    /// Default: false
    /// </summary>
    public bool AutoOpenGrafana { get; set; } = false;
}
