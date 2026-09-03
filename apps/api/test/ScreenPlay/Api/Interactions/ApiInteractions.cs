using Framework.Core.ScreenPlay;
using Framework.Core.ScreenPlay.Interfaces;
using RestSharp;

namespace Farutech.Api.Tests.ScreenPlay.Api.Interactions;

/// <summary>
/// Habilidad que otorga al actor la capacidad de llamar APIs usando RestSharp.
/// </summary>
public class CallAnApi : IAbility
{
    private readonly RestClient _client;

    /// <summary>
    /// Inicializa una nueva instancia de la clase <see cref="CallAnApi"/>.
    /// </summary>
    /// <param name="baseUrl">La URL base de la API.</param>
    public CallAnApi(string baseUrl)
    {
        var options = new RestClientOptions(baseUrl)
        {
            ThrowOnAnyError = false,
            Timeout = TimeSpan.FromSeconds(30),
        };
        _client = new RestClient(options);
    }

    /// <inheritdoc/>
    public string DisplayName => "Call an API";

    /// <summary>
    /// Obtiene el cliente REST.
    /// </summary>
    public RestClient Client => _client;
}

/// <summary>
/// Envía una solicitud GET al endpoint especificado.
/// </summary>
public class GetRequest(string endpoint, string? bearerToken = null) : ITask
{
    /// <inheritdoc/>
    public string TaskName => $"GET {endpoint}";

    /// <inheritdoc/>
    public string Description => $"Send GET request to {endpoint}";

    /// <inheritdoc/>
    public async Task PerformAsAsync(IActor actor)
    {
        var request = new RestRequest(endpoint, Method.Get);
        request = RestRequestExtensions.ApplyAuth(request, bearerToken, actor);
        await RestRequestExtensions.ExecuteAsync(actor, request);
    }
}

/// <summary>
/// Envía una solicitud POST con cuerpo JSON al endpoint especificado.
/// </summary>
public class PostJsonRequest(string endpoint, string jsonBody, string? bearerToken = null) : ITask
{
    /// <inheritdoc/>
    public string TaskName => $"POST {endpoint}";

    /// <inheritdoc/>
    public string Description => $"Send POST (JSON) request to {endpoint}";

    /// <inheritdoc/>
    public async Task PerformAsAsync(IActor actor)
    {
        var request = new RestRequest(endpoint, Method.Post);
        request = RestRequestExtensions.ApplyAuth(request, bearerToken, actor);
        request.AddJsonBody(jsonBody);
        await RestRequestExtensions.ExecuteAsync(actor, request);
    }
}

/// <summary>
/// Envía una solicitud PUT con cuerpo JSON al endpoint especificado.
/// </summary>
public class PutJsonRequest(string endpoint, string jsonBody, string? bearerToken = null) : ITask
{
    /// <inheritdoc/>
    public string TaskName => $"PUT {endpoint}";

    /// <inheritdoc/>
    public string Description => $"Send PUT (JSON) request to {endpoint}";

    /// <inheritdoc/>
    public async Task PerformAsAsync(IActor actor)
    {
        var request = new RestRequest(endpoint, Method.Put);
        request = RestRequestExtensions.ApplyAuth(request, bearerToken, actor);
        request.AddJsonBody(jsonBody);
        await RestRequestExtensions.ExecuteAsync(actor, request);
    }
}

/// <summary>
/// Envía una solicitud PATCH con cuerpo JSON al endpoint especificado.
/// </summary>
public class PatchJsonRequest(string endpoint, string jsonBody, string? bearerToken = null) : ITask
{
    /// <inheritdoc/>
    public string TaskName => $"PATCH {endpoint}";

    /// <inheritdoc/>
    public string Description => $"Send PATCH (JSON) request to {endpoint}";

    /// <inheritdoc/>
    public async Task PerformAsAsync(IActor actor)
    {
        var request = new RestRequest(endpoint, Method.Patch);
        request = RestRequestExtensions.ApplyAuth(request, bearerToken, actor);
        request.AddJsonBody(jsonBody);
        await RestRequestExtensions.ExecuteAsync(actor, request);
    }
}

/// <summary>
/// Envía una solicitud DELETE al endpoint especificado.
/// </summary>
public class DeleteRequest(string endpoint, string? bearerToken = null) : ITask
{
    /// <inheritdoc/>
    public string TaskName => $"DELETE {endpoint}";

    /// <inheritdoc/>
    public string Description => $"Send DELETE request to {endpoint}";

    /// <inheritdoc/>
    public async Task PerformAsAsync(IActor actor)
    {
        var request = new RestRequest(endpoint, Method.Delete);
        request = RestRequestExtensions.ApplyAuth(request, bearerToken, actor);
        await RestRequestExtensions.ExecuteAsync(actor, request);
    }
}

/// <summary>
/// Clase interna con helpers compartidos para construir y ejecutar solicitudes.
/// </summary>
internal static class RestRequestExtensions
{
    /// <summary>
    /// Aplica el encabezado de autorización si hay token (parámetro o memoria del actor).
    /// </summary>
    public static RestRequest ApplyAuth(RestRequest request, string? bearerToken, IActor actor)
    {
        var token = bearerToken ?? actor.Remembered<string>("auth_token");
        if (!string.IsNullOrWhiteSpace(token))
        {
            request.AddHeader("Authorization", $"Bearer {token}");
        }

        return request;
    }

    /// <summary>
    /// Ejecuta la solicitud y guarda el estatus y el cuerpo en la memoria del actor.
    /// </summary>
    public static async Task ExecuteAsync(IActor actor, RestRequest request)
    {
        var ability = actor.AbilityTo<CallAnApi>();
        var response = await ability.Client.ExecuteAsync(request);

        actor.Remember("last_response_status", (int)response.StatusCode);
        actor.Remember("last_response_body", response.Content ?? string.Empty);
    }
}