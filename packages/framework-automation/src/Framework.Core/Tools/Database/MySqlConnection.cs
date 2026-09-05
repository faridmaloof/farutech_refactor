using Framework.Core.Tools.Database;

namespace Framework.Core.Tools.Database;

/// <summary>
/// MySQL database connection.
/// </summary>
/// <remarks>
/// Initializes a new instance of the <see cref="MySqlConnection"/> class.
/// </remarks>
/// <param name="connectionString">The MySQL connection string.</param>
public class MySqlConnection(string connectionString) : DatabaseConnection(connectionString)
{


    /// <inheritdoc/>
    protected override System.Data.IDbConnection CreateConnection()
    {
        return new MySqlConnector.MySqlConnection(ConnectionString);
    }
}
