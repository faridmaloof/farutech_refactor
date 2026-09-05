using Framework.Core.Tools.Database;

namespace Framework.Core.Tools.Database;

/// <summary>
/// PostgreSQL database connection.
/// </summary>
/// <remarks>
/// Initializes a new instance of the <see cref="PostgreSqlConnection"/> class.
/// </remarks>
/// <param name="connectionString">The PostgreSQL connection string.</param>
public class PostgreSqlConnection(string connectionString) : DatabaseConnection(connectionString)
{


    /// <inheritdoc/>
    protected override System.Data.IDbConnection CreateConnection()
    {
        return new Npgsql.NpgsqlConnection(ConnectionString);
    }
}
