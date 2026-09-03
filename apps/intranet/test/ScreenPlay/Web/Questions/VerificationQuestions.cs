using FluentAssertions;
using Framework.Core.ScreenPlay.Interfaces;

namespace Farutech.Intranet.Tests.ScreenPlay.Web.Questions;

/// <summary>
/// Verifies that the current URL contains the expected text.
/// This Question performs the assertion internally and throws if validation fails.
/// </summary>
public class VerifyUrlContainsText : IQuestion<Task>
{
    private readonly string _expectedText;
    private readonly string _becauseMessage;

    /// <summary>
    /// Initializes a new instance of the <see cref="VerifyUrlContainsText"/> class.
    /// </summary>
    /// <param name="expectedText">The text that should be in the URL.</param>
    /// <param name="becauseMessage">The message to show if validation fails.</param>
    public VerifyUrlContainsText(string expectedText, string becauseMessage)
    {
        _expectedText = expectedText;
        _becauseMessage = becauseMessage;
    }

    /// <inheritdoc/>
    public string Description => $"verify URL contains '{_expectedText}'";

    /// <summary>
    /// Creates a new VerifyUrlContainsText question.
    /// </summary>
    /// <param name="expectedText">The expected text in the URL.</param>
    /// <param name="because">The reason message.</param>
    /// <returns>A new VerifyUrlContainsText question.</returns>
    public static VerifyUrlContainsText Text(string expectedText, string because = "") => new(expectedText, because);

    /// <inheritdoc/>
    public async Task<Task> AnsweredByAsync(IActor actor)
    {
        var pageUrl = await actor.AsksForAsync(new PageUrl());
        pageUrl.Should().Contain(_expectedText, _becauseMessage);
        return Task.CompletedTask;
    }
}

/// <summary>
/// Verifies that search results are visible on the page.
/// This Question performs the assertion internally and throws if validation fails.
/// </summary>
public class VerifySearchResultsVisible : IQuestion<Task>
{
    private readonly string _becauseMessage;

    /// <summary>
    /// Initializes a new instance of the <see cref="VerifySearchResultsVisible"/> class.
    /// </summary>
    /// <param name="becauseMessage">The message to show if validation fails.</param>
    public VerifySearchResultsVisible(string becauseMessage)
    {
        _becauseMessage = becauseMessage;
    }

    /// <inheritdoc/>
    public string Description => "verify search results are visible";

    /// <summary>
    /// Creates a new VerifySearchResultsVisible question.
    /// </summary>
    /// <param name="because">The reason message.</param>
    /// <returns>A new VerifySearchResultsVisible question.</returns>
    public static VerifySearchResultsVisible OnPage(string because = "") => new(because);

    /// <inheritdoc/>
    public async Task<Task> AnsweredByAsync(IActor actor)
    {
        var hasResults = await actor.AsksForAsync(new SearchResultsVisible());
        hasResults.Should().BeTrue(_becauseMessage);
        return Task.CompletedTask;
    }
}

/// <summary>
/// Verifies that the search results count is greater than the expected minimum.
/// This Question performs the assertion internally and throws if validation fails.
/// </summary>
public class VerifySearchResultsCountGreaterThan : IQuestion<Task>
{
    private readonly int _minimumCount;
    private readonly string _becauseMessage;

    /// <summary>
    /// Initializes a new instance of the <see cref="VerifySearchResultsCountGreaterThan"/> class.
    /// </summary>
    /// <param name="minimumCount">The minimum expected count.</param>
    /// <param name="becauseMessage">The message to show if validation fails.</param>
    public VerifySearchResultsCountGreaterThan(int minimumCount, string becauseMessage)
    {
        _minimumCount = minimumCount;
        _becauseMessage = becauseMessage;
    }

    /// <inheritdoc/>
    public string Description => $"verify search results count greater than {_minimumCount}";

    /// <summary>
    /// Creates a new VerifySearchResultsCountGreaterThan question.
    /// </summary>
    /// <param name="minimumCount">The minimum expected count.</param>
    /// <param name="because">The reason message.</param>
    /// <returns>A new VerifySearchResultsCountGreaterThan question.</returns>
    public static VerifySearchResultsCountGreaterThan Minimum(int minimumCount, string because = "") => new(minimumCount, because);

    /// <inheritdoc/>
    public async Task<Task> AnsweredByAsync(IActor actor)
    {
        var count = await actor.AsksForAsync(new SearchResultsCount());
        count.Should().BeGreaterThan(_minimumCount, _becauseMessage);
        return Task.CompletedTask;
    }
}
