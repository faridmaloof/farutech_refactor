using Microsoft.Extensions.Configuration;

namespace Framework.Core.Configuration;

/// <summary>
/// Manages framework configuration loading.
/// </summary>
public static class SettingsManager
{
    private static IConfigurationRoot? _configuration;
    private static FrameworkSettings? _frameworkSettings;
    private static DeviceSettings? _deviceSettings;
    private static AllureSettings? _allureSettings;

    /// <summary>
    /// Gets the configuration root.
    /// </summary>
    public static IConfigurationRoot Configuration
    {
        get
        {
            if (_configuration == null)
            {
                var builder = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                    .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development"}.json", optional: true, reloadOnChange: true)
                    .AddEnvironmentVariables();

                _configuration = builder.Build();
            }
            return _configuration;
        }
    }

    /// <summary>
    /// Gets the framework settings.
    /// </summary>
    public static FrameworkSettings FrameworkSettings
    {
        get
        {
            if (_frameworkSettings == null)
            {
                _frameworkSettings = Configuration.GetSection("Framework").Get<FrameworkSettings>() ?? new FrameworkSettings();
            }
            return _frameworkSettings;
        }
    }

    /// <summary>
    /// Gets the device settings.
    /// </summary>
    public static DeviceSettings DeviceSettings
    {
        get
        {
            if (_deviceSettings == null)
            {
                _deviceSettings = Configuration.GetSection("Device").Get<DeviceSettings>() ?? new DeviceSettings();
            }
            return _deviceSettings;
        }
    }

    /// <summary>
    /// Gets the Allure settings.
    /// </summary>
    public static AllureSettings AllureSettings
    {
        get
        {
            if (_allureSettings == null)
            {
                _allureSettings = Configuration.GetSection("Allure").Get<AllureSettings>() ?? new AllureSettings();
            }
            return _allureSettings;
        }
    }

    /// <summary>
    /// Loads configuration from the specified path.
    /// </summary>
    /// <param name="basePath">The base path for configuration files.</param>
    public static void LoadFrom(string basePath)
    {
        var builder = new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
            .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development"}.json", optional: true, reloadOnChange: true)
            .AddEnvironmentVariables();

        _configuration = builder.Build();
        _frameworkSettings = null;
        _deviceSettings = null;
        _allureSettings = null;
    }
}
