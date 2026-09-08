using Framework.Core.ScreenPlay.Interfaces;

namespace Farutech.Api.Tests.ScreenPlay.Api.Questions;

/// <summary>
/// Verifies that the API response body is valid JSON.
/// This Question asserts that the body is not empty and starts with { or [.
/// </summary>
public class ResponseBodyIsValidJson : IQuestion<bool>
{
    /// <inheritdoc/>
    public string Description => "response body is valid JSON";

    /// <summary>
    /// Creates a new ResponseBodyIsValidJson question.
    /// </summary>
    /// <returns>A new ResponseBodyIsValidJson question.</returns>
    public static ResponseBodyIsValidJson Value() => new();

    /// <inheritdoc/>
    public async Task<bool> AnsweredByAsync(IActor actor)
    {
        var body = await new ResponseBody().AnsweredByAsync(actor);
        return !string.IsNullOrEmpty(body) && (body.TrimStart().StartsWith("{") || body.TrimStart().StartsWith("["));
    }
}

/// <summary>
/// Verifies that the API response body contains a specific field.
/// This Question asserts that the field exists in the JSON.
/// </summary>
public class ResponseBodyContainsField : IQuestion<bool>
{
    private readonly string _fieldName;

    /// <summary>
    /// Initializes a new instance of the <see cref="ResponseBodyContainsField"/> class.
    /// </summary>
    /// <param name="fieldName">The field name to search for.</param>
    private ResponseBodyContainsField(string fieldName)
    {
        _fieldName = fieldName;
    }

    /// <inheritdoc/>
    public string Description => $"response body contains '{_fieldName}'";

    /// <summary>
    /// Creates a new ResponseBodyContainsField question.
    /// </summary>
    /// <param name="fieldName">The field name to search for.</param>
    /// <returns>A new ResponseBodyContainsField question.</returns>
    public static ResponseBodyContainsField Value(string fieldName) => new(fieldName);

    /// <inheritdoc/>
    public async Task<bool> AnsweredByAsync(IActor actor)
    {
        var body = await new ResponseBody().AnsweredByAsync(actor);
        return !string.IsNullOrEmpty(body) && body.Contains($"\"{_fieldName}\"");
    }
}
