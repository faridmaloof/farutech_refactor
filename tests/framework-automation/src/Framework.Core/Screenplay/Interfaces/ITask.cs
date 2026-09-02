namespace Framework.Core.ScreenPlay.Interfaces;

/// <summary>
/// Represents a business-level task that an actor can perform.
/// Tasks are composed of one or more interactions.
/// </summary>
public interface ITask : IAction
{
    /// <summary>
    /// Gets the business name of this task (for reporting).
    /// </summary>
    string TaskName { get; }
}
