using Framework.Core.ScreenPlay.Interfaces;

namespace Farutech.Api.Tests.ScreenPlay.Api.Questions;

/// <summary>
/// Gets the HTTP status code from the last API response.
/// </summary>
public class ResponseStatus : IQuestion<int>
{
    /// <inheritdoc/>
    public string Description => "HTTP status code";

    /// <summary>
    /// Creates a new ResponseStatus question.
    /// </summary>
    /// <returns>A new ResponseStatus question.</returns>
    public static ResponseStatus Value() => new();

    /// <inheritdoc/>
    public Task<int> AnsweredByAsync(IActor actor)
    {
        var status = actor.Remembered<int>("last_response_status");
        return Task.FromResult(status);
    }
}
