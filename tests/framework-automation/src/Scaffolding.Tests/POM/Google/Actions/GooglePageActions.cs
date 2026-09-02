using Framework.Core.ScreenPlay;
using Framework.Core.ScreenPlay.Interfaces;
using Microsoft.Playwright;
using Scaffolding.Tests.POM.Google.Locators;
using Scaffolding.Tests.ScreenPlay.Web.Interactions;
using Scaffolding.Tests.ScreenPlay.Web.Questions;

namespace Scaffolding.Tests.POM.Google.Actions;

/// <summary>
/// Actions for the Google home page.
/// Contains only behavior - uses ScreenPlay interactions.
/// This follows the POM (Page Object Model) pattern with separated actions.
/// </summary>
public static class GoogleHomePageActions
{
    /// <summary>
    /// Enters a search term into the search input.
    /// </summary>
    /// <param name="query">The search query.</param>
    /// <returns>A ScreenPlay interaction to enter text.</returns>
    public static Enter EnterSearchTerm(string query) =>
        Enter.TheText(query).Into(GoogleHomePageLocators.SearchInput);
    
    /// <summary>
    /// Clicks the search button.
    /// </summary>
    /// <returns>A ScreenPlay interaction to click.</returns>
    public static Click ClickSearchButton() =>
        Click.On("input[value='Buscar con Google']");
    
    /// <summary>
    /// Performs a complete search action (enter term + press Enter).
    /// </summary>
    /// <param name="query">The search query.</param>
    /// <returns>An array of ScreenPlay interactions.</returns>
    public static IAction[] SearchFor(string query) =>
        [
            EnterSearchTerm(query),
            SubmitSearch()
        ];
    
    /// <summary>
    /// Submits the search by pressing Enter key.
    /// </summary>
    /// <returns>A ScreenPlay task to submit search.</returns>
    public static SubmitSearch SubmitSearch() => new();
}

/// <summary>
/// Task to submit search by pressing Enter.
/// </summary>
public class SubmitSearch : ITask
{
    public string TaskName => "Submit search";
    public string Description => "Submit search by pressing Enter";

    public async Task PerformAsAsync(IActor actor)
    {
        var ability = actor.AbilityTo<BrowseTheWeb>();
        await ability.Page.Locator(GoogleHomePageLocators.SearchInput).PressAsync("Enter");
        await ability.Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
    }
}

/// <summary>
/// Actions for the Google search results page.
/// Contains only behavior - uses ScreenPlay interactions.
/// </summary>
public static class GoogleSearchResultsActions
{
    /// <summary>
    /// Gets the count of search results.
    /// </summary>
    /// <returns>A ScreenPlay question for element count.</returns>
    public static ElementCount GetResultCount() =>
        ElementCount.Of(GoogleSearchResultsLocators.SearchResult);
    
    /// <summary>
    /// Gets the title of the first search result.
    /// </summary>
    /// <returns>A ScreenPlay question for element text.</returns>
    public static ElementText GetFirstResultTitle() =>
        ElementText.Of(GoogleSearchResultsLocators.SearchResultTitle);
}
