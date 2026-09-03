using Framework.Core.ScreenPlay;
using Framework.Core.ScreenPlay.Interfaces;

namespace Scaffolding.Tests.ScreenPlay.Web.Questions;

/// <summary>
/// Gets the count of elements matching a selector.
/// This is a ScreenPlay Question that queries system state.
/// </summary>
public class ElementCount : IQuestion<int>
{
    private readonly string _selector;

    /// <summary>
    /// Initializes a new instance of the <see cref="ElementCount"/> class.
    /// </summary>
    /// <param name="selector">The element selector.</param>
    private ElementCount(string selector) => _selector = selector;

    /// <inheritdoc/>
    public string Description => $"count of '{_selector}'";

    /// <summary>
    /// Creates a new ElementCount question for the specified selector.
    /// </summary>
    /// <param name="selector">The element selector.</param>
    /// <returns>A new ElementCount question.</returns>
    public static ElementCount Of(string selector) => new(selector);

    /// <inheritdoc/>
    public async Task<int> AnsweredByAsync(IActor actor)
    {
        var ability = actor.AbilityTo<BrowseTheWeb>();
        return await ability.Page.Locator(_selector).CountAsync();
    }
}
