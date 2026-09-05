using StackExchange.Redis;

namespace Framework.Core.Tools.Database;

/// <summary>
/// Redis NoSQL database connection.
/// </summary>
public class RedisConnection : IDisposable
{
    private readonly IDatabase _database;
    private readonly ConnectionMultiplexer _connection;
    private bool _disposed;

    /// <summary>
    /// Initializes a new instance of the <see cref="RedisConnection"/> class.
    /// </summary>
    /// <param name="connectionString">The Redis connection string.</param>
    public RedisConnection(string connectionString)
    {
        _connection = ConnectionMultiplexer.Connect(connectionString);
        _database = _connection.GetDatabase();
    }

    /// <summary>
    /// Gets a string value from Redis.
    /// </summary>
    /// <param name="key">The key.</param>
    /// <returns>The value, or null if not found.</returns>
    public async Task<string?> GetStringAsync(string key)
    {
        var value = await _database.StringGetAsync(key);
        return value.HasValue ? value.ToString() : null;
    }

    /// <summary>
    /// Sets a string value in Redis.
    /// </summary>
    /// <param name="key">The key.</param>
    /// <param name="value">The value.</param>
    /// <param name="expiry">Optional expiry time.</param>
    /// <returns>True if the value was set.</returns>
    public async Task<bool> SetStringAsync(string key, string value, TimeSpan? expiry = null)
    {
        return await _database.StringSetAsync(key, value, expiry);
    }

    /// <summary>
    /// Gets a hash field from Redis.
    /// </summary>
    /// <param name="key">The hash key.</param>
    /// <param name="field">The field name.</param>
    /// <returns>The field value, or null if not found.</returns>
    public async Task<string?> GetHashFieldAsync(string key, string field)
    {
        var value = await _database.HashGetAsync(key, field);
        return value.HasValue ? value.ToString() : null;
    }

    /// <summary>
    /// Sets a hash field in Redis.
    /// </summary>
    /// <param name="key">The hash key.</param>
    /// <param name="field">The field name.</param>
    /// <param name="value">The field value.</param>
    /// <returns>True if the field was set.</returns>
    public async Task<bool> SetHashFieldAsync(string key, string field, string value)
    {
        return await _database.HashSetAsync(key, field, value);
    }

    /// <summary>
    /// Deletes a key from Redis.
    /// </summary>
    /// <param name="key">The key to delete.</param>
    /// <returns>True if the key was deleted.</returns>
    public async Task<bool> DeleteAsync(string key)
    {
        return await _database.KeyDeleteAsync(key);
    }

    /// <inheritdoc/>
    public void Dispose()
    {
        if (_disposed) return;
        _connection.Dispose();
        _disposed = true;
    }
}
