using System.Data;
using Dapper;

namespace Framework.Core.Tools.Database;

/// <summary>
/// Base class for database connections.
/// Provides common database operations using Dapper.
/// </summary>
/// <remarks>
/// Initializes a new instance of the <see cref="DatabaseConnection"/> class.
/// </remarks>
/// <param name="connectionString">The database connection string.</param>
public abstract class DatabaseConnection(string connectionString) : IDisposable
{
    /// <summary>
    /// Gets the connection string.
    /// </summary>
    protected readonly string ConnectionString = connectionString;
    
    /// <summary>
    /// Gets or sets the underlying database connection.
    /// </summary>
    protected IDbConnection? _connection;
    private bool _disposed;


    /// <summary>
    /// Gets or creates the database connection.
    /// </summary>
    /// <returns>The database connection.</returns>
    protected abstract IDbConnection CreateConnection();

    /// <summary>
    /// Gets the database connection (creates if null).
    /// </summary>
    public IDbConnection Connection
    {
        get
        {
            if (_connection == null)
            {
                _connection = CreateConnection();
                if (_connection.State != ConnectionState.Open)
                {
                    _connection.Open();
                }
            }
            return _connection;
        }
    }

    /// <summary>
    /// Executes a query and returns the results.
    /// </summary>
    /// <typeparam name="T">The type of results.</typeparam>
    /// <param name="sql">The SQL query.</param>
    /// <param name="param">The query parameters.</param>
    /// <returns>The query results.</returns>
    public async Task<IEnumerable<T>> QueryAsync<T>(string sql, object? param = null)
    {
        return await Connection.QueryAsync<T>(sql, param);
    }

    /// <summary>
    /// Executes a query and returns a single result.
    /// </summary>
    /// <typeparam name="T">The type of result.</typeparam>
    /// <param name="sql">The SQL query.</param>
    /// <param name="param">The query parameters.</param>
    /// <returns>The query result, or default if not found.</returns>
    public async Task<T?> QueryFirstOrDefaultAsync<T>(string sql, object? param = null)
    {
        return await Connection.QueryFirstOrDefaultAsync<T>(sql, param);
    }

    /// <summary>
    /// Executes a command and returns the number of affected rows.
    /// </summary>
    /// <param name="sql">The SQL command.</param>
    /// <param name="param">The command parameters.</param>
    /// <returns>The number of affected rows.</returns>
    public async Task<int> ExecuteAsync(string sql, object? param = null)
    {
        return await Connection.ExecuteAsync(sql, param);
    }

    /// <summary>
    /// Executes a query within a transaction.
    /// </summary>
    /// <typeparam name="T">The type of results.</typeparam>
    /// <param name="sql">The SQL query.</param>
    /// <param name="param">The query parameters.</param>
    /// <returns>The query results.</returns>
    public async Task<IEnumerable<T>> QueryInTransactionAsync<T>(string sql, object? param = null)
    {
        using var transaction = Connection.BeginTransaction();
        try
        {
            var result = await Connection.QueryAsync<T>(sql, param, transaction);
            transaction.Commit();
            return result;
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }

    /// <summary>
    /// Closes the database connection.
    /// </summary>
    public void Close()
    {
        if (_connection != null)
        {
            if (_connection.State == ConnectionState.Open)
            {
                _connection.Close();
            }
            _connection.Dispose();
            _connection = null;
        }
    }

    /// <inheritdoc/>
    public void Dispose()
    {
        if (_disposed) return;
        Close();
        _disposed = true;
    }
}
