using Microsoft.Playwright;
using Framework.Core.Screenplay;

namespace Framework.Core.ScreenPlay;

/// <summary>
/// Ability that grants an actor the capability to browse the web using Playwright.
/// This is a standard ability available to all projects.
/// </summary>
/// <remarks>
/// Initializes a new instance of the <see cref="BrowseTheWeb"/> class.
/// </remarks>
/// <param name="page">The Playwright page.</param>
public class BrowseTheWeb(IPage page) : DisposableAbility
{
    private bool _disposed;


    /// <inheritdoc/>
    public override string DisplayName => "Browse the Web";

    /// <summary>
    /// Gets the Playwright page.
    /// </summary>
    public IPage Page { get; } = page ?? throw new ArgumentNullException(nameof(page));

    /// <summary>
    /// Creates a new instance of <see cref="BrowseTheWeb"/> with the specified page.
    /// </summary>
    /// <param name="page">The Playwright page.</param>
    /// <returns>A new BrowseTheWeb ability.</returns>
    public static BrowseTheWeb With(IPage page) => new(page);

    /// <inheritdoc/>
    public override async ValueTask DisposeAsync()
    {
        if (_disposed) return;

        _disposed = true;

        try
        {
            if (Page.Context != null)
            {
                await Page.Context.CloseAsync();
            }
        }
        catch
        {
            // Ignore disposal errors
        }
    }
}
