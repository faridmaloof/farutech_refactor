using MongoDB.Driver;
using MongoDB.Bson;

namespace Framework.Core.Tools.Database;

/// <summary>
/// MongoDB NoSQL database connection.
/// </summary>
public class MongoDbConnection : IDisposable
{
    private readonly IMongoClient _client;
    private readonly IMongoDatabase _database;
    private bool _disposed;

    /// <summary>
    /// Initializes a new instance of the <see cref="MongoDbConnection"/> class.
    /// </summary>
    /// <param name="connectionString">The MongoDB connection string.</param>
    /// <param name="databaseName">The database name.</param>
    public MongoDbConnection(string connectionString, string databaseName)
    {
        _client = new MongoClient(connectionString);
        _database = _client.GetDatabase(databaseName);
    }

    /// <summary>
    /// Gets a collection from the database.
    /// </summary>
    /// <typeparam name="TDocument">The document type.</typeparam>
    /// <param name="collectionName">The collection name.</param>
    /// <returns>The MongoDB collection.</returns>
    public IMongoCollection<TDocument> GetCollection<TDocument>(string collectionName)
    {
        return _database.GetCollection<TDocument>(collectionName);
    }

    /// <summary>
    /// Inserts a document into a collection.
    /// </summary>
    /// <typeparam name="TDocument">The document type.</typeparam>
    /// <param name="collectionName">The collection name.</param>
    /// <param name="document">The document to insert.</param>
    /// <returns>The insert result.</returns>
    public async Task<InsertOneResult> InsertOneAsync<TDocument>(string collectionName, TDocument document)
    {
        var collection = GetCollection<TDocument>(collectionName);
        await collection.InsertOneAsync(document);
        return new InsertOneResult { IsAcknowledged = true };
    }

    /// <summary>
    /// Finds documents in a collection.
    /// </summary>
    /// <typeparam name="TDocument">The document type.</typeparam>
    /// <param name="collectionName">The collection name.</param>
    /// <param name="filter">The filter to apply.</param>
    /// <returns>The matching documents.</returns>
    public async Task<List<TDocument>> FindAsync<TDocument>(string collectionName, FilterDefinition<TDocument>? filter = null)
    {
        var collection = GetCollection<TDocument>(collectionName);
        filter ??= Builders<TDocument>.Filter.Empty;
        return await collection.Find(filter).ToListAsync();
    }

    /// <summary>
    /// Finds a single document in a collection.
    /// </summary>
    /// <typeparam name="TDocument">The document type.</typeparam>
    /// <param name="collectionName">The collection name.</param>
    /// <param name="filter">The filter to apply.</param>
    /// <returns>The matching document, or null if not found.</returns>
    public async Task<TDocument?> FindOneAsync<TDocument>(string collectionName, FilterDefinition<TDocument> filter)
    {
        var collection = GetCollection<TDocument>(collectionName);
        return await collection.Find(filter).FirstOrDefaultAsync();
    }

    /// <summary>
    /// Updates documents in a collection.
    /// </summary>
    /// <typeparam name="TDocument">The document type.</typeparam>
    /// <param name="collectionName">The collection name.</param>
    /// <param name="filter">The filter to apply.</param>
    /// <param name="update">The update to apply.</param>
    /// <returns>The update result.</returns>
    public async Task<UpdateResult> UpdateOneAsync<TDocument>(string collectionName, FilterDefinition<TDocument> filter, UpdateDefinition<TDocument> update)
    {
        var collection = GetCollection<TDocument>(collectionName);
        return await collection.UpdateOneAsync(filter, update);
    }

    /// <summary>
    /// Deletes documents from a collection.
    /// </summary>
    /// <typeparam name="TDocument">The document type.</typeparam>
    /// <param name="collectionName">The collection name.</param>
    /// <param name="filter">The filter to apply.</param>
    /// <returns>The delete result.</returns>
    public async Task<DeleteResult> DeleteOneAsync<TDocument>(string collectionName, FilterDefinition<TDocument> filter)
    {
        var collection = GetCollection<TDocument>(collectionName);
        return await collection.DeleteOneAsync(filter);
    }

    /// <inheritdoc/>
    public void Dispose()
    {
        if (_disposed) return;
        _disposed = true;
    }
}

/// <summary>
/// MongoDB insert result.
/// </summary>
public class InsertOneResult
{
    /// <summary>
    /// Gets or sets whether the operation was acknowledged.
    /// </summary>
    public bool IsAcknowledged { get; set; }
}
