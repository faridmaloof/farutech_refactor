using Framework.Core.Tools.Database;

namespace Framework.Core.Tools.Database;

/// <summary>
/// SQL Server database connection.
/// </summary>
/// <remarks>
/// Initializes a new instance of the <see cref="SqlServerConnection"/> class.
/// </remarks>
/// <param name="connectionString">The SQL Server connection string.</param>
public class SqlServerConnection(string connectionString) : DatabaseConnection(connectionString)
{


    /// <inheritdoc/>
    protected override System.Data.IDbConnection CreateConnection()
    {
        return new Microsoft.Data.SqlClient.SqlConnection(ConnectionString);
    }
}
