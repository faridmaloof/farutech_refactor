using Framework.Core.ScreenPlay.Interfaces;

namespace Farutech.Intranet.Tests.ScreenPlay.Web.Questions;

/// <summary>
/// Verifies that the current URL contains the expected text.
/// This Question encapsulates URL validation logic.
/// </summary>
public class UrlContainsText : IQuestion<bool>
{
    private readonly string _expectedText;

    /// <summary>
    /// Initializes a new instance of the <see cref="UrlContainsText"/> class.
    /// </summary>
    /// <param name="expectedText">The text that should be in the URL.</param>
    public UrlContainsText(string expectedText)
    {
        _expectedText = expectedText;
    }

    /// <inheritdoc/>
    public string Description => $"URL contains '{_expectedText}'";

    /// <summary>
    /// Creates a new UrlContainsText question.
    /// </summary>
    /// <param name="expectedText">The expected text in the URL.</param>
    /// <returns>A new UrlContainsText question.</returns>
    public static UrlContainsText Text(string expectedText) => new(expectedText);

    /// <inheritdoc/>
    public async Task<bool> AnsweredByAsync(IActor actor)
    {
        var pageUrl = await actor.AsksForAsync(new PageUrl());
        return pageUrl.Contains(_expectedText);
    }
}

/// <summary>
/// Verifies that search results are visible on the page.
/// This Question encapsulates the visibility validation logic.
/// </summary>
public class SearchResultsAreVisible : IQuestion<bool>
{
    /// <inheritdoc/>
    public string Description => "search results are visible";

    /// <summary>
    /// Creates a new SearchResultsAreVisible question.
    /// </summary>
    /// <returns>A new SearchResultsAreVisible question.</returns>
    public static SearchResultsAreVisible OnPage() => new();

    /// <inheritdoc/>
    public async Task<bool> AnsweredByAsync(IActor actor)
    {
        return await actor.AsksForAsync(new SearchResultsVisible());
    }
}

/// <summary>
/// Verifies that the search results count is greater than the expected minimum.
/// This Question encapsulates the count validation logic.
/// </summary>
public class SearchResultsCountIsGreaterThan : IQuestion<bool>
{
    private readonly int _minimumCount;

    /// <summary>
    /// Initializes a new instance of the <see cref="SearchResultsCountIsGreaterThan"/> class.
    /// </summary>
    /// <param name="minimumCount">The minimum expected count.</param>
    public SearchResultsCountIsGreaterThan(int minimumCount)
    {
        _minimumCount = minimumCount;
    }

    /// <inheritdoc/>
    public string Description => $"search results count greater than {_minimumCount}";

    /// <summary>
    /// Creates a new SearchResultsCountIsGreaterThan question.
    /// </summary>
    /// <param name="minimumCount">The minimum expected count.</param>
    /// <returns>A new SearchResultsCountIsGreaterThan question.</returns>
    public static SearchResultsCountIsGreaterThan Minimum(int minimumCount) => new(minimumCount);

    /// <inheritdoc/>
    public async Task<bool> AnsweredByAsync(IActor actor)
    {
        var count = await actor.AsksForAsync(new SearchResultsCount());
        return count > _minimumCount;
    }
}
