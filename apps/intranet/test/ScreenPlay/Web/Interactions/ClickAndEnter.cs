using Framework.Core.ScreenPlay.Interfaces;
using Framework.Core.ScreenPlay;
using Microsoft.Playwright;

namespace Farutech.Intranet.Tests.ScreenPlay.Web.Interactions;

/// <summary>
/// Click on an element.
/// This is a ScreenPlay Interaction that represents a technical atomic action.
/// </summary>
public class Click : Framework.Core.ScreenPlay.Classes.Interaction
{
    private readonly string _selector;

    /// <summary>
    /// Initializes a new instance of the <see cref="Click"/> class.
    /// </summary>
    /// <param name="selector">The element selector.</param>
    private Click(string selector) => _selector = selector;


    /// <inheritdoc/>
    public override string Description => $"Click on '{_selector}'";

    /// <summary>
    /// Creates a new Click interaction for the specified selector.
    /// </summary>
    /// <param name="selector">The element selector.</param>
    /// <returns>A new Click interaction.</returns>
    public static Click On(string selector) => new(selector);

    /// <inheritdoc/>
    public override async Task PerformAsAsync(IActor actor)
    {
        var ability = actor.AbilityTo<BrowseTheWeb>();
        await ability.Page.Locator(_selector).ClickAsync();
    }
}

/// <summary>
/// Enter text into an input field.
/// This is a ScreenPlay Interaction that represents a technical atomic action.
/// </summary>
public class Enter : Framework.Core.ScreenPlay.Classes.Interaction
{
    private readonly string _text;
    private string _selector = string.Empty;

    /// <summary>
    /// Initializes a new instance of the <see cref="Enter"/> class.
    /// </summary>
    /// <param name="text">The text to enter.</param>
    private Enter(string text) => _text = text;

    /// <inheritdoc/>
    public override string Description => $"Enter '{_text}' into '{_selector}'";

    /// <summary>
    /// Creates a new Enter interaction with the specified text.
    /// </summary>
    /// <param name="text">The text to enter.</param>
    /// <returns>A new Enter interaction builder.</returns>
    public static Enter TheText(string text) => new(text);

    /// <summary>
    /// Specifies the selector for the input field.
    /// </summary>
    /// <param name="selector">The element selector.</param>
    /// <returns>This Enter interaction for chaining.</returns>
    public Enter Into(string selector)
    {
        _selector = selector;
        return this;
    }

    /// <inheritdoc/>
    public override async Task PerformAsAsync(IActor actor)
    {
        var ability = actor.AbilityTo<BrowseTheWeb>();
        await ability.Page.Locator(_selector).FillAsync(_text);
    }
}
