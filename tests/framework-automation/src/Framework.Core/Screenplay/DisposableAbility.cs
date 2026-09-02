using Framework.Core.ScreenPlay.Interfaces;

namespace Framework.Core.Screenplay;

/// <summary>
/// Base class for abilities that require disposal.
/// Use this for abilities that manage resources (e.g., browser connections).
/// </summary>
public abstract class DisposableAbility : IAbility, IAsyncDisposable
{
    /// <inheritdoc/>
    public abstract string DisplayName { get; }
    
    /// <inheritdoc/>
    public abstract ValueTask DisposeAsync();
}
