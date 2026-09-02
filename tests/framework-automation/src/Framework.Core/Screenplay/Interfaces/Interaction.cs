using Framework.Core.ScreenPlay.Interfaces;

namespace Framework.Core.ScreenPlay.Classes;

/// <summary>
/// Base class for interactions providing common functionality.
/// Interactions represent technical-level atomic actions.
/// </summary>
public abstract class Interaction : IInteraction
{
    /// <inheritdoc/>
    public abstract string Description { get; }
    
    /// <inheritdoc/>
    public abstract Task PerformAsAsync(IActor actor);
}
