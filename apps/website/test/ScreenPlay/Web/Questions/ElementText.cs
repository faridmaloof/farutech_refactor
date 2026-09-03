using Framework.Core.ScreenPlay;
using Framework.Core.ScreenPlay.Interfaces;

namespace Farutech.Website.Tests.ScreenPlay.Web.Questions;

/// <summary>
/// Gets the text content of an element.
/// This is a ScreenPlay Question that queries system state.
/// </summary>
public class ElementText : IQuestion<string>
{
    private readonly string _selector;

    /// <summary>
    /// Initializes a new instance of the <see cref="ElementText"/> class.
    /// </summary>
    /// <param name="selector">The element selector.</param>
    private ElementText(string selector) => _selector = selector;

    /// <inheritdoc/>
    public string Description => $"text of '{_selector}'";

    /// <summary>
    /// Creates a new ElementText question for the specified selector.
    /// </summary>
    /// <param name="selector">The element selector.</param>
    /// <returns>A new ElementText question.</returns>
    public static ElementText Of(string selector) => new(selector);

    /// <inheritdoc/>
    public async Task<string> AnsweredByAsync(IActor actor)
    {
        var ability = actor.AbilityTo<BrowseTheWeb>();
        return await ability.Page.Locator(_selector).TextContentAsync() ?? string.Empty;
    }
}
