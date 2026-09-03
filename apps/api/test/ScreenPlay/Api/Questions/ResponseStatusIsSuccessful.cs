using Framework.Core.ScreenPlay.Interfaces;

namespace Farutech.Api.Tests.ScreenPlay.Api.Questions;

/// <summary>
/// Verifies that the API response status code indicates success (2xx).
/// This Question asserts that the status is successful.
/// </summary>
public class ResponseStatusIsSuccessful : IQuestion<bool>
{
    /// <inheritdoc/>
    public string Description => "response status is successful (2xx)";

    /// <summary>
    /// Creates a new ResponseStatusIsSuccessful question.
    /// </summary>
    /// <returns>A new ResponseStatusIsSuccessful question.</returns>
    public static ResponseStatusIsSuccessful Value() => new();

    /// <inheritdoc/>
    public async Task<bool> AnsweredByAsync(IActor actor)
    {
        var status = await new ResponseStatus().AnsweredByAsync(actor);
        return status >= 200 && status < 300;
    }
}
