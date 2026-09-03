using FluentAssertions;
using Framework.Core.ScreenPlay.Interfaces;
using Framework.Core.ScreenPlay.Questions;

namespace Framework.Core.ScreenPlay.Questions;

/// <summary>
/// Verifies that a value contains the expected text.
/// This Question performs the assertion internally and throws if validation fails.
/// Reusable across all projects.
/// </summary>
public class VerifyContainsText : IQuestion<System.Threading.Tasks.Task>
{
    private readonly string _expectedText;
    private readonly string _becauseMessage;

    /// <summary>
    /// Initializes a new instance of the <see cref="VerifyContainsText"/> class.
    /// </summary>
    /// <param name="expectedText">The expected text.</param>
    /// <param name="becauseMessage">The message to show if validation fails.</param>
    public VerifyContainsText(string expectedText, string becauseMessage)
    {
        _expectedText = expectedText;
        _becauseMessage = becauseMessage;
    }

    /// <inheritdoc/>
    public string Description => $"verify contains '{_expectedText}'";

    /// <summary>
    /// Creates a new VerifyContainsText question.
    /// </summary>
    /// <param name="expectedText">The expected text.</param>
    /// <param name="because">The reason message.</param>
    /// <returns>A new VerifyContainsText question.</returns>
    public static VerifyContainsText Text(string expectedText, string because = "") => new(expectedText, because);

    /// <inheritdoc/>
    public async System.Threading.Tasks.Task<System.Threading.Tasks.Task> AnsweredByAsync(IActor actor)
    {
        var value = await actor.AsksForAsync(new GetPageUrl());
        value.Should().Contain(_expectedText, _becauseMessage);
        return System.Threading.Tasks.Task.CompletedTask;
    }
}

/// <summary>
/// Verifies that a boolean condition is true.
/// This Question performs the assertion internally and throws if validation fails.
/// Reusable across all projects.
/// </summary>
public class VerifyTrue : IQuestion<System.Threading.Tasks.Task>
{
    private readonly System.Func<System.Threading.Tasks.Task<bool>> _condition;
    private readonly string _becauseMessage;

    /// <summary>
    /// Initializes a new instance of the <see cref="VerifyTrue"/> class.
    /// </summary>
    /// <param name="condition">The condition to verify.</param>
    /// <param name="becauseMessage">The message to show if validation fails.</param>
    public VerifyTrue(System.Func<System.Threading.Tasks.Task<bool>> condition, string becauseMessage)
    {
        _condition = condition;
        _becauseMessage = becauseMessage;
    }

    /// <inheritdoc/>
    public string Description => "verify condition is true";

    /// <summary>
    /// Creates a new VerifyTrue question.
    /// </summary>
    /// <param name="condition">The condition to verify.</param>
    /// <param name="because">The reason message.</param>
    /// <returns>A new VerifyTrue question.</returns>
    public static VerifyTrue That(System.Func<System.Threading.Tasks.Task<bool>> condition, string because = "") => new(condition, because);

    /// <inheritdoc/>
    public async System.Threading.Tasks.Task<System.Threading.Tasks.Task> AnsweredByAsync(IActor actor)
    {
        var result = await _condition();
        result.Should().BeTrue(_becauseMessage);
        return System.Threading.Tasks.Task.CompletedTask;
    }
}

/// <summary>
/// Verifies that a numeric value is greater than the expected minimum.
/// This Question performs the assertion internally and throws if validation fails.
/// Reusable across all projects.
/// </summary>
public class VerifyGreaterThan : IQuestion<System.Threading.Tasks.Task>
{
    private readonly System.Func<System.Threading.Tasks.Task<int>> _getValue;
    private readonly int _minimumValue;
    private readonly string _becauseMessage;

    /// <summary>
    /// Initializes a new instance of the <see cref="VerifyGreaterThan"/> class.
    /// </summary>
    /// <param name="getValue">The function to get the value.</param>
    /// <param name="minimumValue">The minimum expected value.</param>
    /// <param name="becauseMessage">The message to show if validation fails.</param>
    public VerifyGreaterThan(System.Func<System.Threading.Tasks.Task<int>> getValue, int minimumValue, string becauseMessage)
    {
        _getValue = getValue;
        _minimumValue = minimumValue;
        _becauseMessage = becauseMessage;
    }

    /// <inheritdoc/>
    public string Description => $"verify value greater than {_minimumValue}";

    /// <summary>
    /// Creates a new VerifyGreaterThan question.
    /// </summary>
    /// <param name="getValue">The function to get the value.</param>
    /// <param name="minimumValue">The minimum expected value.</param>
    /// <param name="because">The reason message.</param>
    /// <returns>A new VerifyGreaterThan question.</returns>
    public static VerifyGreaterThan Value(System.Func<System.Threading.Tasks.Task<int>> getValue, int minimumValue, string because = "") => new(getValue, minimumValue, because);

    /// <inheritdoc/>
    public async System.Threading.Tasks.Task<System.Threading.Tasks.Task> AnsweredByAsync(IActor actor)
    {
        var value = await _getValue();
        value.Should().BeGreaterThan(_minimumValue, _becauseMessage);
        return System.Threading.Tasks.Task.CompletedTask;
    }
}
