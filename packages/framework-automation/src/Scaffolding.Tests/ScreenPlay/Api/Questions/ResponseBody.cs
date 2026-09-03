using Framework.Core.ScreenPlay.Interfaces;

namespace Scaffolding.Tests.ScreenPlay.Api.Questions;

/// <summary>
/// Gets the response body from the last API response.
/// </summary>
public class ResponseBody : IQuestion<string>
{
    /// <inheritdoc/>
    public string Description => "response body";

    /// <summary>
    /// Creates a new ResponseBody question.
    /// </summary>
    /// <returns>A new ResponseBody question.</returns>
    public static ResponseBody Value() => new();

    /// <inheritdoc/>
    public Task<string> AnsweredByAsync(IActor actor)
    {
        var body = actor.Remembered<string>("last_response_body") ?? string.Empty;
        return Task.FromResult(body);
    }
}
