using Framework.Core.ScreenPlay;
using Framework.Core.ScreenPlay.Interfaces;

namespace Farutech.Website.Tests.ScreenPlay.Web.Questions;

/// <summary>
/// Gets the current page title.
/// This is a ScreenPlay Question that queries system state.
/// </summary>
public class PageTitle : IQuestion<string>
{
    /// <inheritdoc/>
    public string Description => "page title";

    /// <summary>
    /// Creates a new PageTitle question.
    /// </summary>
    /// <returns>A new PageTitle question.</returns>
    public static PageTitle Value() => new();

    /// <inheritdoc/>
    public async Task<string> AnsweredByAsync(IActor actor)
    {
        var ability = actor.AbilityTo<BrowseTheWeb>();
        return await ability.Page.TitleAsync();
    }
}
