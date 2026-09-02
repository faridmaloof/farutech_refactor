namespace Framework.Core.Exceptions;

/// <summary>
/// Exception thrown when an actor doesn't have a required ability.
/// </summary>
/// <remarks>
/// Initializes a new instance of the <see cref="AbilityNotFoundException"/> class.
/// </remarks>
/// <param name="abilityName">The name of the missing ability.</param>
/// <param name="actorName">The name of the actor.</param>
public class AbilityNotFoundException(string abilityName, string actorName) : FrameworkException($"Actor '{actorName}' does not have the ability '{abilityName}'")
{
    /// <summary>
    /// Gets the name of the missing ability.
    /// </summary>
    public string AbilityName { get; } = abilityName;

    /// <summary>
    /// Gets the name of the actor.
    /// </summary>
    public string ActorName { get; } = actorName;
}
