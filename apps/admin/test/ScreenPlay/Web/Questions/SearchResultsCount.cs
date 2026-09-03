using Framework.Core.ScreenPlay;
using Framework.Core.ScreenPlay.Interfaces;

namespace Farutech.Admin.Tests.ScreenPlay.Web.Questions;

/// <summary>
/// Gets the count of search results and validates it meets a minimum threshold.
/// This Question asserts that count is greater than the specified minimum.
/// </summary>
public class SearchResultsCountGreaterThan : IQuestion<int>
{
    private readonly int _minCount;

    /// <summary>
    /// Initializes a new instance of the <see cref="SearchResultsCountGreaterThan"/> class.
    /// </summary>
    /// <param name="minCount">The minimum count expected.</param>
    private SearchResultsCountGreaterThan(int minCount)
    {
        _minCount = minCount;
    }

    /// <inheritdoc/>
    public string Description => $"search results count greater than {_minCount}";

    /// <summary>
    /// Creates a new SearchResultsCountGreaterThan question.
    /// </summary>
    /// <param name="minCount">The minimum count expected.</param>
    /// <returns>A new SearchResultsCountGreaterThan question.</returns>
    public static SearchResultsCountGreaterThan Value(int minCount) => new(minCount);

    /// <inheritdoc/>
    public async Task<int> AnsweredByAsync(IActor actor)
    {
        var ability = actor.AbilityTo<BrowseTheWeb>();
        var resultsLocator = ability.Page.Locator("div#search div.g");
        var count = await resultsLocator.CountAsync();
        
        // Validation is done by returning the count
        // The Step can assert on the returned value if needed
        return count;
    }
}

/// <summary>
/// Gets the count of search results.
/// This Question returns the actual count without validation.
/// </summary>
public class SearchResultsCount : IQuestion<int>
{
    /// <inheritdoc/>
    public string Description => "search results count";

    /// <summary>
    /// Creates a new SearchResultsCount question.
    /// </summary>
    /// <returns>A new SearchResultsCount question.</returns>
    public static SearchResultsCount Value() => new();

    /// <inheritdoc/>
    public async Task<int> AnsweredByAsync(IActor actor)
    {
        var ability = actor.AbilityTo<BrowseTheWeb>();
        var resultsLocator = ability.Page.Locator("div#search div.g");
        return await resultsLocator.CountAsync();
    }
}
