using Framework.Core.Tools.Database;

namespace Framework.Core.Tools.Database;

/// <summary>
/// MariaDB database connection.
/// </summary>
/// <remarks>
/// Initializes a new instance of the <see cref="MariaDbConnection"/> class.
/// </remarks>
/// <param name="connectionString">The MariaDB connection string.</param>
public class MariaDbConnection(string connectionString) : DatabaseConnection(connectionString)
{


    /// <inheritdoc/>
    protected override System.Data.IDbConnection CreateConnection()
    {
        return new MySqlConnector.MySqlConnection(ConnectionString);
    }
}
