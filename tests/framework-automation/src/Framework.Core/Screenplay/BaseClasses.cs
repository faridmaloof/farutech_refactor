using Framework.Core.ScreenPlay.Interfaces;

namespace Framework.Core.ScreenPlay;

/// <summary>
/// Base class for tasks providing common functionality.
/// Tasks represent business-level actions that an actor can perform.
/// </summary>
public abstract class ScreenTask : ITask
{
    /// <inheritdoc/>
    public virtual string TaskName => GetType().Name;

    /// <inheritdoc/>
    public virtual string Description => $"Perform: {TaskName}";

    /// <inheritdoc/>
    public abstract System.Threading.Tasks.Task PerformAsAsync(IActor actor);
}

/// <summary>
/// Base class for interactions providing common functionality.
/// Interactions are atomic actions like clicking or typing.
/// </summary>
public abstract class ScreenInteraction : IInteraction
{
    /// <inheritdoc/>
    public abstract string Description { get; }
    
    /// <inheritdoc/>
    public abstract System.Threading.Tasks.Task PerformAsAsync(IActor actor);
}

/// <summary>
/// Base class for questions providing common functionality.
/// Questions query the state of the system.
/// </summary>
public abstract class ScreenQuestion<TResult> : IQuestion<TResult>
{
    /// <inheritdoc/>
    public abstract string Description { get; }
    
    /// <inheritdoc/>
    public abstract System.Threading.Tasks.Task<TResult> AnsweredByAsync(IActor actor);
}
