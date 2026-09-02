using Microsoft.Playwright;

namespace Framework.Core.POM;

/// <summary>
/// Helper methods for POM operations.
/// Provides common wait and interaction utilities.
/// </summary>
public static class PomHelpers
{
    /// <summary>
    /// Waits for an element to be visible with custom timeout.
    /// </summary>
    /// <param name="locator">The element locator.</param>
    /// <param name="timeoutMs">Timeout in milliseconds (default: 30000).</param>
    public static async Task WaitForElementVisibleAsync(ILocator locator, int timeoutMs = 30000)
    {
        await locator.WaitForAsync(new LocatorWaitForOptions
        {
            State = WaitForSelectorState.Visible,
            Timeout = timeoutMs
        });
    }

    /// <summary>
    /// Waits for an element to be hidden with custom timeout.
    /// </summary>
    /// <param name="locator">The element locator.</param>
    /// <param name="timeoutMs">Timeout in milliseconds (default: 30000).</param>
    public static async Task WaitForElementHiddenAsync(ILocator locator, int timeoutMs = 30000)
    {
        await locator.WaitForAsync(new LocatorWaitForOptions
        {
            State = WaitForSelectorState.Hidden,
            Timeout = timeoutMs
        });
    }

    /// <summary>
    /// Clicks an element with retry logic.
    /// </summary>
    /// <param name="locator">The element locator.</param>
    /// <param name="maxRetries">Maximum retry attempts (default: 3).</param>
    public static async Task ClickWithRetryAsync(ILocator locator, int maxRetries = 3)
    {
        for (int i = 0; i < maxRetries; i++)
        {
            try
            {
                await locator.ClickAsync();
                return;
            }
            catch when (i < maxRetries - 1)
            {
                await Task.Delay(1000 * (i + 1));
            }
        }
    }

    /// <summary>
    /// Enters text with clear and wait.
    /// </summary>
    /// <param name="locator">The element locator.</param>
    /// <param name="text">The text to enter.</param>
    public static async Task EnterTextAsync(ILocator locator, string text)
    {
        await locator.ClearAsync();
        await locator.FillAsync(text);
    }
}
