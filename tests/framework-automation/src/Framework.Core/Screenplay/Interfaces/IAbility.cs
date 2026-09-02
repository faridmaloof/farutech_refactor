namespace Framework.Core.ScreenPlay.Interfaces;

/// <summary>
/// Marker interface for abilities that grant capabilities to an actor.
/// </summary>
public interface IAbility
{
    /// <summary>
    /// Gets the display name of this ability.
    /// </summary>
    string DisplayName { get; }
}
