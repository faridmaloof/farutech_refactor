namespace Framework.Core.ScreenPlay.Interfaces;

/// <summary>
/// Represents an actor in the ScreenPlay Pattern who can perform tasks and answer questions.
/// </summary>
public interface IActor
{
    /// <summary>
    /// Gets the actor's name.
    /// </summary>
    string Name { get; }
    
    /// <summary>
    /// Gets the actor's unique correlation ID for tracing.
    /// </summary>
    Guid CorrelationId { get; }
    
    /// <summary>
    /// Registers an ability that the actor can use.
    /// </summary>
    void WhoCan<TAbility>(TAbility ability) where TAbility : IAbility;
    
    /// <summary>
    /// Retrieves an ability that the actor possesses.
    /// </summary>
    TAbility AbilityTo<TAbility>() where TAbility : IAbility;
    
    /// <summary>
    /// Checks if the actor has a specific ability.
    /// </summary>
    bool Can<TAbility>() where TAbility : IAbility;

    /// <summary>
    /// Attempts to perform one or more tasks or interactions.
    /// </summary>
    Task AttemptsToAsync(params IAction[] actions);

    /// <summary>
    /// Asks a question to get information about the system state.
    /// </summary>
    Task<TResult> AsksForAsync<TResult>(IQuestion<TResult> question);
    
    /// <summary>
    /// Stores a value in the actor's memory.
    /// </summary>
    void Remember(string key, object? value);
    
    /// <summary>
    /// Retrieves a value from the actor's memory.
    /// </summary>
    T? Remembered<T>(string key);
    
    /// <summary>
    /// Checks if a value is stored in the actor's memory.
    /// </summary>
    bool HasRemembered(string key);
}
