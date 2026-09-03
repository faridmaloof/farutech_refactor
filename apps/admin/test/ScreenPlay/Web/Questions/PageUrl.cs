using Framework.Core.ScreenPlay;
using Framework.Core.ScreenPlay.Interfaces;

namespace Farutech.Admin.Tests.ScreenPlay.Web.Questions;

/// <summary>
/// Gets the current page URL.
/// This is a ScreenPlay Question that queries system state.
/// </summary>
public class PageUrl : IQuestion<string>
{
    /// <inheritdoc/>
    public string Description => "page URL";

    /// <summary>
    /// Creates a new PageUrl question.
    /// </summary>
    /// <returns>A new PageUrl question.</returns>
    public static PageUrl Value() => new();

    /// <inheritdoc/>
    public async Task<string> AnsweredByAsync(IActor actor)
    {
        var ability = actor.AbilityTo<BrowseTheWeb>();
        return ability.Page.Url;
    }
}
