namespace Framework.Core.ScreenPlay.Interfaces;

/// <summary>
/// Base interface for all actions that an actor can perform.
/// </summary>
public interface IAction
{
    /// <summary>
    /// Gets the description of what this action does (for reporting).
    /// </summary>
    string Description { get; }

    /// <summary>
    /// Performs this action as the specified actor.
    /// </summary>
    Task PerformAsAsync(IActor actor);
}
