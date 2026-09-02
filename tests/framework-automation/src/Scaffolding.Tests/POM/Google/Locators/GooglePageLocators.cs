namespace Scaffolding.Tests.POM.Google.Locators;

/// <summary>
/// Locators for the Google home page.
/// Contains only selectors - no behavior.
/// This follows the POM (Page Object Model) pattern with separated locators.
/// </summary>
public static class GoogleHomePageLocators
{
    // Search
    public const string SearchInput = "[name='q']";
    public const string SearchButton = "[type='submit']";
    
    // Navigation
    public const string Logo = "[alt='Google']";
    public const string GmailLink = "[href*='mail.google.com']";
    public const string ImagesLink = "[href*='google.com/intl/*/images']";
    
    // Footer
    public const string AboutLink = "[href='/intl/*/about.html']";
    public const string StoreLink = "[href*='store.google.com']";
}

/// <summary>
/// Locators for the Google search results page.
/// Contains only selectors - no behavior.
/// </summary>
public static class GoogleSearchResultsLocators
{
    // Results
    public const string SearchResult = "[id='search'] [role='listitem']";
    public const string SearchResultTitle = "[id='search'] h3";
    public const string SearchResultLink = "[id='search'] a";
    public const string SearchResultSnippet = "[data-sncf]";
    
    // Stats
    public const string ResultStats = "[id='result-stats']";
    
    // Pagination
    public const string NextPageLink = "[id='pnnext']";
    public const string PreviousPageLink = "[id='pnprev']";
}
