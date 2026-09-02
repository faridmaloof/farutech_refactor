namespace Framework.Core.POM;

/// <summary>
/// Base class for page locators.
/// All page locator classes should inherit from this.
/// </summary>
public abstract class BasePage
{
    /// <summary>
    /// Gets the page URL.
    /// </summary>
    public abstract string PageUrl { get; }
    
    /// <summary>
    /// Gets the page title.
    /// </summary>
    public abstract string PageTitle { get; }
}
