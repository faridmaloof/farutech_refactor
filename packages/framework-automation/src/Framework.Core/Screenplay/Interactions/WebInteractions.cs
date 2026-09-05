using Framework.Core.ScreenPlay;
using Framework.Core.ScreenPlay.Interfaces;
using Microsoft.Playwright;

namespace Framework.Core.ScreenPlay.Interactions;

/// <summary>
/// Interaction to click on an element.
/// Reusable across all web automation projects.
/// </summary>
public class ClickElement : ScreenInteraction
{
    private readonly string _selector;

    /// <summary>
    /// Initializes a new instance of the <see cref="ClickElement"/> class.
    /// </summary>
    /// <param name="selector">The element selector.</param>
    public ClickElement(string selector)
    {
        _selector = selector;
    }

    /// <inheritdoc/>
    public override string Description => $"Click on '{_selector}'";

    /// <inheritdoc/>
    public override async System.Threading.Tasks.Task PerformAsAsync(IActor actor)
    {
        var web = actor.AbilityTo<BrowseTheWeb>();
        await web.Page.Locator(_selector).ClickAsync();
    }

    /// <summary>
    /// Fluent factory method.
    /// </summary>
    /// <param name="selector">The element selector.</param>
    /// <returns>A new ClickElement interaction.</returns>
    public static ClickElement On(string selector) => new(selector);
}

/// <summary>
/// Interaction to enter text into an input field.
/// Reusable across all web automation projects.
/// </summary>
public class EnterText : ScreenInteraction
{
    private readonly string _text;
    private readonly string _selector;

    /// <summary>
    /// Initializes a new instance of the <see cref="EnterText"/> class.
    /// </summary>
    /// <param name="text">The text to enter.</param>
    /// <param name="selector">The element selector.</param>
    public EnterText(string text, string selector)
    {
        _text = text;
        _selector = selector;
    }

    /// <inheritdoc/>
    public override string Description => $"Enter '{_text}' into '{_selector}'";

    /// <inheritdoc/>
    public override async System.Threading.Tasks.Task PerformAsAsync(IActor actor)
    {
        var web = actor.AbilityTo<BrowseTheWeb>();
        await web.Page.Locator(_selector).FillAsync(_text);
    }

    /// <summary>
    /// Fluent factory method.
    /// </summary>
    /// <param name="text">The text to enter.</param>
    /// <param name="selector">The element selector.</param>
    /// <returns>A new EnterText interaction.</returns>
    public static EnterText Into(string text, string selector) => new(text, selector);
}
