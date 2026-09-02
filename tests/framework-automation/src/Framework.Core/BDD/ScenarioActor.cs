using Framework.Core.ScreenPlay.Interfaces;
using Reqnroll;

namespace Framework.Core.BDD;

/// <summary>
/// Helper for accessing Actor from Reqnroll ScenarioContext.
/// Provides type-safe actor retrieval for step definitions.
/// </summary>
public static class ScenarioActor
{
    private static IActor? _cachedActor;

    /// <summary>
    /// Gets the actor from the scenario context.
    /// Throws if actor is not initialized (BeforeScenario hook must run first).
    /// </summary>
    /// <param name="scenarioContext">The Reqnroll scenario context.</param>
    /// <returns>The initialized actor.</returns>
    /// <exception cref="InvalidOperationException">Thrown when actor is not initialized.</exception>
    public static IActor Get(ScenarioContext scenarioContext)
    {
        if (_cachedActor == null)
        {
            if (!scenarioContext.TryGetValue("Actor", out var actorFromContext))
            {
                throw new InvalidOperationException("Actor not initialized. BeforeScenario hook must run first.");
            }
            _cachedActor = (IActor)actorFromContext;
        }
        return _cachedActor;
    }

    /// <summary>
    /// Gets an API actor from the scenario context.
    /// Creates if not exists.
    /// </summary>
    /// <param name="scenarioContext">The Reqnroll scenario context.</param>
    /// <param name="actorKey">The key to store/retrieve the actor.</param>
    /// <param name="actorFactory">Factory to create the actor if not exists.</param>
    /// <returns>The initialized actor.</returns>
    public static IActor GetOrCreate(ScenarioContext scenarioContext, string actorKey, Func<IActor> actorFactory)
    {
        if (!scenarioContext.TryGetValue(actorKey, out var actorFromContext))
        {
            var actor = actorFactory();
            scenarioContext[actorKey] = actor;
            return actor;
        }
        return (IActor)actorFromContext;
    }

    /// <summary>
    /// Clears the cached actor (for cleanup).
    /// </summary>
    public static void Clear()
    {
        _cachedActor = null;
    }
}
