namespace Framework.Core.Exceptions;

/// <summary>
/// Base exception for all framework exceptions.
/// </summary>
public class FrameworkException : Exception
{
    /// <summary>
    /// Initializes a new instance of the <see cref="FrameworkException"/> class.
    /// </summary>
    public FrameworkException() : base() { }

    /// <summary>
    /// Initializes a new instance of the <see cref="FrameworkException"/> class with a specified error message.
    /// </summary>
    /// <param name="message">The message that describes the error.</param>
    public FrameworkException(string message) : base(message) { }

    /// <summary>
    /// Initializes a new instance of the <see cref="FrameworkException"/> class with a specified error message and a reference to the inner exception.
    /// </summary>
    /// <param name="message">The message that describes the error.</param>
    /// <param name="innerException">The exception that is the cause of the current exception.</param>
    public FrameworkException(string message, Exception innerException) : base(message, innerException) { }
}
