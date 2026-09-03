using Framework.Core.ScreenPlay;
using Framework.Core.ScreenPlay.Interfaces;

namespace Farutech.Website.Tests.ScreenPlay.Web.Questions;

/// <summary>
/// Verifies that search results are visible on the page.
/// This Question asserts that results exist and returns true/false.
/// </summary>
public class SearchResultsVisible : IQuestion<bool>
{
    /// <inheritdoc/>
    public string Description => "search results are visible";

    /// <summary>
    /// Creates a new SearchResultsVisible question.
    /// </summary>
    /// <returns>A new SearchResultsVisible question.</returns>
    public static SearchResultsVisible Value() => new();

    /// <inheritdoc/>
    public async Task<bool> AnsweredByAsync(IActor actor)
    {
        var ability = actor.AbilityTo<BrowseTheWeb>();
        var resultsLocator = ability.Page.Locator("div#search div.g");
        var count = await resultsLocator.CountAsync();
        return count > 0;
    }
}
