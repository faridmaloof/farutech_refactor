using Framework.Core.ScreenPlay.Interfaces;

namespace Farutech.Api.Tests.ScreenPlay.Api.Questions;

/// <summary>
/// Verifies that the API response body is a JSON array.
/// This Question asserts that the body starts with '['.
/// </summary>
public class ResponseBodyIsArray : IQuestion<bool>
{
    /// <inheritdoc/>
    public string Description => "response body is a JSON array";

    /// <summary>
    /// Creates a new ResponseBodyIsArray question.
    /// </summary>
    /// <returns>A new ResponseBodyIsArray question.</returns>
    public static ResponseBodyIsArray Value() => new();

    /// <inheritdoc/>
    public async Task<bool> AnsweredByAsync(IActor actor)
    {
        var body = await new ResponseBody().AnsweredByAsync(actor);
        return !string.IsNullOrEmpty(body) && body.TrimStart().StartsWith("[");
    }
}

/// <summary>
/// Verifies that the API response body is a JSON object.
/// This Question asserts that the body starts with '{'.
/// </summary>
public class ResponseBodyIsObject : IQuestion<bool>
{
    /// <inheritdoc/>
    public string Description => "response body is a JSON object";

    /// <summary>
    /// Creates a new ResponseBodyIsObject question.
    /// </summary>
    /// <returns>A new ResponseBodyIsObject question.</returns>
    public static ResponseBodyIsObject Value() => new();

    /// <inheritdoc/>
    public async Task<bool> AnsweredByAsync(IActor actor)
    {
        var body = await new ResponseBody().AnsweredByAsync(actor);
        return !string.IsNullOrEmpty(body) && body.TrimStart().StartsWith("{");
    }
}
