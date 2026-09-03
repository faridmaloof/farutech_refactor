namespace Framework.Core.ScreenPlay.Interfaces;

/// <summary>
/// Represents a question about the system state that returns a result.
/// </summary>
public interface IQuestion<TResult>
{
    /// <summary>
    /// Gets the description of this question (for reporting).
    /// </summary>
    string Description { get; }

    /// <summary>
    /// Answers this question using the specified actor.
    /// </summary>
    Task<TResult> AnsweredByAsync(IActor actor);
}
