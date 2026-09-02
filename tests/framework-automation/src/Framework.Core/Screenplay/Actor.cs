using System.Collections.Concurrent;
using Framework.Core.Exceptions;
using Framework.Core.ScreenPlay.Interfaces;

namespace Framework.Core.ScreenPlay;

/// <summary>
/// Represents an actor in the ScreenPlay Pattern.
/// The actor is the central entity that performs tasks and asks questions.
/// </summary>
/// <remarks>
/// Initializes a new instance of the <see cref="Actor"/> class.
/// </remarks>
/// <param name="name">The actor's name (e.g., "John", "Admin User", "Customer").</param>
public class Actor(string name) : IActor, IDisposable
{
    private readonly string _name = name ?? throw new ArgumentNullException(nameof(name));
    private readonly Guid _correlationId = Guid.NewGuid();
    private readonly ConcurrentDictionary<Type, IAbility> _abilities = new();
    private readonly ConcurrentDictionary<string, object?> _memory = new();
    private bool _disposed;


    /// <inheritdoc/>
    public string Name => _name;

    /// <inheritdoc/>
    public Guid CorrelationId => _correlationId;

    /// <inheritdoc/>
    public void WhoCan<TAbility>(TAbility ability) where TAbility : IAbility
    {
        ThrowIfDisposed();
        if (ability == null) throw new ArgumentNullException(nameof(ability));
        _abilities.AddOrUpdate(typeof(TAbility), ability, (_, _) => ability);
    }

    /// <inheritdoc/>
    public TAbility AbilityTo<TAbility>() where TAbility : IAbility
    {
        ThrowIfDisposed();
        if (_abilities.TryGetValue(typeof(TAbility), out var ability))
        {
            return (TAbility)ability;
        }
        throw new AbilityNotFoundException(typeof(TAbility).Name, _name);
    }

    /// <inheritdoc/>
    public bool Can<TAbility>() where TAbility : IAbility
    {
        ThrowIfDisposed();
        return _abilities.ContainsKey(typeof(TAbility));
    }

    /// <inheritdoc/>
    public Task AttemptsToAsync(params IAction[] actions)
    {
        ThrowIfDisposed();
        if (actions == null || actions.Length == 0) return System.Threading.Tasks.Task.CompletedTask;
        
        async Task RunActionsAsync()
        {
            foreach (var action in actions) await action.PerformAsAsync(this);
        }
        
        return RunActionsAsync();
    }

    /// <inheritdoc/>
    public async Task<TResult> AsksForAsync<TResult>(IQuestion<TResult> question)
    {
        ThrowIfDisposed();
        if (question == null) throw new ArgumentNullException(nameof(question));
        return await question.AnsweredByAsync(this);
    }

    /// <inheritdoc/>
    public void Remember(string key, object? value)
    {
        ThrowIfDisposed();
        _memory.AddOrUpdate(key, value, (_, _) => value);
    }

    /// <inheritdoc/>
    public T? Remembered<T>(string key)
    {
        ThrowIfDisposed();
        return _memory.TryGetValue(key, out var value) ? (T?)value : default;
    }

    /// <inheritdoc/>
    public bool HasRemembered(string key)
    {
        ThrowIfDisposed();
        return _memory.ContainsKey(key);
    }

    private void ThrowIfDisposed()
    {
        if (_disposed) throw new ObjectDisposedException(nameof(Actor));
    }

    /// <inheritdoc/>
    public void Dispose()
    {
        if (_disposed) return;
        _disposed = true;
        foreach (var ability in _abilities.Values)
        {
            if (ability is IDisposable d) d.Dispose();
        }
        _abilities.Clear();
        _memory.Clear();
    }
}
