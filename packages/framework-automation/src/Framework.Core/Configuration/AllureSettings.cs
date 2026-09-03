namespace Framework.Core.Configuration;

/// <summary>
/// Allure reporting configuration.
/// </summary>
public class AllureSettings
{
    /// <summary>
    /// Gets or sets the Allure results directory.
    /// Default: allure-results
    /// </summary>
    public string ResultsDirectory { get; set; } = "allure-results";
    
    /// <summary>
    /// Gets or sets the project name.
    /// Default: Enterprise Automation Framework
    /// </summary>
    public string ProjectName { get; set; } = "Enterprise Automation Framework";
    
    /// <summary>
    /// Gets or sets whether to auto-open the Allure report after test execution.
    /// Default: false
    /// </summary>
    public bool AutoOpenReport { get; set; } = false;
    
    /// <summary>
    /// Gets or sets the Allure report port.
    /// Default: 56789
    /// </summary>
    public int ReportPort { get; set; } = 56789;
    
    /// <summary>
    /// Gets or sets the Allure CLI path (if not in PATH).
    /// </summary>
    public string? AllureCliPath { get; set; }
}
