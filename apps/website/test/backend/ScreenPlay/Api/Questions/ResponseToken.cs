using System.Text.Json;
using Framework.Core.ScreenPlay.Interfaces;

namespace Farutech.Api.Tests.ScreenPlay.Api.Questions;

/// <summary>
/// Obtiene el token de autorización del cuerpo de la última respuesta JSON
/// (campo "token", como lo emite POST /login de Sanctum).
/// </summary>
public class ResponseToken : IQuestion<string>
{
    /// <inheritdoc/>
    public string Description => "auth token from response body";

    /// <summary>
    /// Crea una nueva pregunta ResponseToken.
    /// </summary>
    /// <returns>Una nueva pregunta ResponseToken.</returns>
    public static ResponseToken Value() => new();

    /// <inheritdoc/>
    public async Task<string> AnsweredByAsync(IActor actor)
    {
        var body = await new ResponseBody().AnsweredByAsync(actor);
        if (string.IsNullOrWhiteSpace(body))
        {
            return string.Empty;
        }

        try
        {
            using var document = JsonDocument.Parse(body);
            if (document.RootElement.TryGetProperty("token", out var tokenElement))
            {
                return tokenElement.GetString() ?? string.Empty;
            }
        }
        catch (JsonException)
        {
            return string.Empty;
        }

        return string.Empty;
    }
}