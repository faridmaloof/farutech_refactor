using Framework.Core.ScreenPlay;
using Framework.Core.ScreenPlay.Interfaces;
using RestSharp;

namespace Scaffolding.Tests.ScreenPlay.Api.Interactions;

/// <summary>
/// Ability that grants an actor the capability to call APIs using RestSharp.
/// </summary>
public class CallAnApi : IAbility
{
    private readonly RestClient _client;

    /// <summary>
    /// Initializes a new instance of the <see cref="CallAnApi"/> class.
    /// </summary>
    /// <param name="baseUrl">The base URL of the API.</param>
    public CallAnApi(string baseUrl)
    {
        var options = new RestClientOptions(baseUrl)
        {
            ThrowOnAnyError = false,
            Timeout = TimeSpan.FromSeconds(30)
        };
        _client = new RestClient(options);
    }

    /// <inheritdoc/>
    public string DisplayName => "Call an API";

    /// <summary>
    /// Gets the REST client.
    /// </summary>
    public RestClient Client => _client;
}

/// <summary>
/// Sends a GET request to the specified endpoint.
/// </summary>
/// <remarks>
/// Initializes a new instance of the <see cref="GetRequest"/> class.
/// </remarks>
/// <param name="endpoint">The API endpoint.</param>
public class GetRequest(string endpoint) : ITask
{
    private readonly string _endpoint = endpoint;


    /// <inheritdoc/>
    public string TaskName => $"GET {_endpoint}";
    public string Description => $"Send GET request to {_endpoint}";

    /// <inheritdoc/>
    public async Task PerformAsAsync(IActor actor)
    {
        var ability = actor.AbilityTo<CallAnApi>();
        var request = new RestRequest(_endpoint);
        var response = await ability.Client.ExecuteAsync(request);
        
        // Store response in actor's memory
        actor.Remember("last_response_status", (int)response.StatusCode);
        actor.Remember("last_response_body", response.Content);
    }
}
