using Framework.Core.Tools.Database;

namespace Framework.Core.Tools.Database;

/// <summary>
/// Oracle database connection.
/// </summary>
/// <remarks>
/// Initializes a new instance of the <see cref="OracleConnection"/> class.
/// </remarks>
/// <param name="connectionString">The Oracle connection string.</param>
public class OracleConnection(string connectionString) : DatabaseConnection(connectionString)
{


    /// <inheritdoc/>
    protected override System.Data.IDbConnection CreateConnection()
    {
        return new Oracle.ManagedDataAccess.Client.OracleConnection(ConnectionString);
    }
}
