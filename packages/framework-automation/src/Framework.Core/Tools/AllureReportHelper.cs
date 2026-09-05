using System.Diagnostics;

namespace Framework.Core.Tools;

/// <summary>
/// Allure report helper.
/// Provides methods to generate and open Allure reports.
/// </summary>
public static class AllureReportHelper
{
    private static readonly string AllureCommand = IsWindows() ? "allure.bat" : "allure";
    
    /// <summary>
    /// Opens the Allure report for the specified results directory.
    /// </summary>
    /// <param name="resultsDirectory">The Allure results directory.</param>
    /// <param name="port">The port to serve the report on.</param>
    public static void OpenReport(string resultsDirectory, int port = 56789)
    {
        try
        {
            Console.WriteLine($"[ALLURE] Opening report from {resultsDirectory} on port {port}...");
            
            var startInfo = new ProcessStartInfo
            {
                FileName = AllureCommand,
                Arguments = $"open {resultsDirectory} --port {port}",
                UseShellExecute = true,
                CreateNoWindow = false
            };
            
            Process.Start(startInfo);
            
            Console.WriteLine($"[ALLURE] Report opened at http://localhost:{port}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[ALLURE] Error opening report: {ex.Message}");
            Console.WriteLine("[ALLURE] Make sure Allure CLI is installed and in PATH.");
        }
    }
    
    /// <summary>
    /// Generates the Allure report from results directory.
    /// </summary>
    /// <param name="resultsDirectory">The Allure results directory.</param>
    /// <param name="reportDirectory">The output report directory.</param>
    public static void GenerateReport(string resultsDirectory, string reportDirectory = "allure-report")
    {
        try
        {
            Console.WriteLine($"[ALLURE] Generating report from {resultsDirectory}...");
            
            var startInfo = new ProcessStartInfo
            {
                FileName = AllureCommand,
                Arguments = $"generate {resultsDirectory} -o {reportDirectory} --clean",
                UseShellExecute = true,
                CreateNoWindow = false
            };
            
            using var process = Process.Start(startInfo);
            process?.WaitForExit();
            
            Console.WriteLine($"[ALLURE] Report generated in {reportDirectory}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[ALLURE] Error generating report: {ex.Message}");
            Console.WriteLine("[ALLURE] Make sure Allure CLI is installed and in PATH.");
        }
    }
    
    /// <summary>
    /// 
    /// </summary>
    /// <returns></returns>
    private static bool IsWindows()
    {
        return Environment.OSVersion.Platform == PlatformID.Win32NT;
    }
}
