using Framework.Core.ScreenPlay;
using Framework.Core.ScreenPlay.Interfaces;
using Microsoft.Playwright;

namespace Framework.Core.ScreenPlay.Questions;

/// <summary>
/// Gets the current page URL.
/// Reusable across all web automation projects.
/// </summary>
public class GetPageUrl : ScreenQuestion<string>
{
    /// <inheritdoc/>
    public override string Description => "page URL";

    /// <summary>
    /// Creates a new GetPageUrl question.
    /// </summary>
    /// <returns>A new GetPageUrl question.</returns>
    public static GetPageUrl Value() => new();

    /// <inheritdoc/>
    public override async System.Threading.Tasks.Task<string> AnsweredByAsync(IActor actor)
    {
        var web = actor.AbilityTo<BrowseTheWeb>();
        return web.Page.Url;
    }
}

/// <summary>
/// Checks if an element is visible.
/// Reusable across all web automation projects.
/// </summary>
public class IsElementVisible : ScreenQuestion<bool>
{
    private readonly string _selector;

    /// <summary>
    /// Initializes a new instance of the <see cref="IsElementVisible"/> class.
    /// </summary>
    /// <param name="selector">The element selector.</param>
    public IsElementVisible(string selector)
    {
        _selector = selector;
    }

    /// <inheritdoc/>
    public override string Description => $"element '{_selector}' is visible";

    /// <summary>
    /// Creates a new IsElementVisible question.
    /// </summary>
    /// <param name="selector">The element selector.</param>
    /// <returns>A new IsElementVisible question.</returns>
    public static IsElementVisible Element(string selector) => new(selector);

    /// <inheritdoc/>
    public override async System.Threading.Tasks.Task<bool> AnsweredByAsync(IActor actor)
    {
        var web = actor.AbilityTo<BrowseTheWeb>();
        return await web.Page.Locator(_selector).IsVisibleAsync();
    }
}

/// <summary>
/// Gets the count of elements matching a selector.
/// Reusable across all web automation projects.
/// </summary>
public class GetElementCount : ScreenQuestion<int>
{
    private readonly string _selector;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetElementCount"/> class.
    /// </summary>
    /// <param name="selector">The element selector.</param>
    public GetElementCount(string selector)
    {
        _selector = selector;
    }

    /// <inheritdoc/>
    public override string Description => $"count of '{_selector}'";

    /// <summary>
    /// Creates a new GetElementCount question.
    /// </summary>
    /// <param name="selector">The element selector.</param>
    /// <returns>A new GetElementCount question.</returns>
    public static GetElementCount Of(string selector) => new(selector);

    /// <inheritdoc/>
    public override async System.Threading.Tasks.Task<int> AnsweredByAsync(IActor actor)
    {
        var web = actor.AbilityTo<BrowseTheWeb>();
        return await web.Page.Locator(_selector).CountAsync();
    }
}
