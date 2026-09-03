using Framework.Core.ScreenPlay.Interfaces;

namespace Framework.Core.ScreenPlay;

/// <summary>
/// Fluent builder for creating actors with abilities.
/// Makes actor creation more readable and maintainable.
/// </summary>
/// <remarks>
/// Initializes a new instance of the <see cref="ActorBuilder"/> class.
/// </remarks>
/// <param name="name">The actor's name (e.g., "John", "Admin", "Customer").</param>
public class ActorBuilder(string name)
{
    private readonly string _name = name;
    private readonly List<IAbility> _abilities = [];


    /// <summary>
    /// Adds an ability to the actor.
    /// </summary>
    /// <typeparam name="TAbility">The type of ability.</typeparam>
    /// <param name="ability">The ability instance.</param>
    /// <returns>The builder for chaining.</returns>
    public ActorBuilder WithAbility<TAbility>(TAbility ability) where TAbility : IAbility
    {
        _abilities.Add(ability);
        return this;
    }

    /// <summary>
    /// Builds the actor with all registered abilities.
    /// </summary>
    /// <returns>The configured actor.</returns>
    public Actor Build()
    {
        var actor = new Actor(_name);
        foreach (var ability in _abilities) actor.WhoCan(ability);
        return actor;
    }
}
