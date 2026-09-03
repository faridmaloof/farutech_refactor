#!/usr/bin/env pwsh
# Build and Test Script for Enterprise Automation Framework
# Usage: .\build.ps1 [-Target <build|test|clean|all>] [-Configuration <Debug|Release>]

param(
    [ValidateSet('build', 'test', 'clean', 'all', 'restore', 'pack')]
    [string]$Target = 'all',
    
    [ValidateSet('Debug', 'Release')]
    [string]$Configuration = 'Release',
    
    [switch]$SkipTests,
    
    [string]$Solution = 'src/Framework.Automation.slnx'
)

$ErrorActionPreference = 'Stop'

function Write-Header {
    param([string]$Text)
    Write-Host "`n$('=' * 60)" -ForegroundColor Cyan
    Write-Host $Text -ForegroundColor Cyan
    Write-Host $('=' * 60) -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Text)
    Write-Host "✓ $Text" -ForegroundColor Green
}

function Write-Error-Message {
    param([string]$Text)
    Write-Host "✗ $Text" -ForegroundColor Red
}

function Invoke-DotNetRestore {
    Write-Header "Restoring NuGet packages"
    dotnet restore $Solution
    if ($LASTEXITCODE -ne 0) {
        throw "Restore failed"
    }
    Write-Success "Packages restored"
}

function Invoke-DotNetBuild {
    Write-Header "Building solution ($Configuration)"
    dotnet build $Solution --configuration $Configuration --no-restore
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed"
    }
    Write-Success "Build successful"
}

function Invoke-DotNetTest {
    param([switch]$SkipCoverage)
    
    Write-Header "Running tests ($Configuration)"
    
    $testArgs = @(
        'test', $Solution
        '--configuration', $Configuration
        '--no-build'
        '--logger', 'console;verbosity=detailed'
    )
    
    if ($SkipCoverage) {
        $testArgs += '--collect:"XPlat Code Coverage"'
    }
    
    dotnet @testArgs
    
    if ($LASTEXITCODE -ne 0) {
        throw "Tests failed"
    }
    Write-Success "All tests passed"
}

function Invoke-DotNetClean {
    Write-Header "Cleaning solution"
    
    # Clean using dotnet
    dotnet clean $Solution --configuration $Configuration
    
    # Remove bin/obj folders
    Get-ChildItem -Path "src" -Recurse -Directory -Include "bin","obj" | 
        Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
    
    # Remove test results
    Get-ChildItem -Path "." -Recurse -Directory -Include "TestResults","test-results","evidence" | 
        Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
    
    Write-Success "Clean complete"
}

function Invoke-DotNetPack {
    Write-Header "Creating NuGet packages"
    
    $packArgs = @(
        'pack', $Solution
        '--configuration', $Configuration
        '--output', 'artifacts/packages'
        '--no-build'
    )
    
    New-Item -ItemType Directory -Path 'artifacts/packages' -Force | Out-Null
    
    dotnet @packArgs
    
    if ($LASTEXITCODE -ne 0) {
        throw "Packaging failed"
    }
    
    Write-Success "Packages created in artifacts/packages"
}

function Install-PlaywrightBrowsers {
    Write-Header "Installing Playwright browsers"
    
    $uiTestProject = 'src/Automation.UI.Tests'
    
    if (Test-Path "$uiTestProject/playwright.ps1") {
        & pwsh -File "$uiTestProject/playwright.ps1" install
        Write-Success "Playwright browsers installed"
    }
    else {
        Write-Warning "Playwright CLI not found. Run: dotnet build first"
    }
}

function Show-Help {
    Write-Host @"
Enterprise Automation Framework - Build Script

Usage: .\build.ps1 [-Target <target>] [-Configuration <config>]

Targets:
  all       - Restore, build, and test (default)
  restore   - Restore NuGet packages only
  build     - Restore and build
  test      - Run tests (requires build)
  clean     - Clean build artifacts
  pack      - Create NuGet packages

Configuration:
  Debug     - Debug configuration (default)
  Release   - Release configuration

Examples:
  .\build.ps1                          # Run all targets with Release config
  .\build.ps1 -Target build            # Build only
  .\build.ps1 -Target test -SkipTests  # Run tests without coverage
  .\build.ps1 -Target clean            # Clean everything
  .\build.ps1 -Target pack             # Create NuGet packages

"@ -ForegroundColor Yellow
}

# Main execution
try {
    switch ($Target) {
        'clean' {
            Invoke-DotNetClean
        }
        'restore' {
            Invoke-DotNetRestore
        }
        'build' {
            Invoke-DotNetRestore
            Invoke-DotNetBuild
        }
        'test' {
            if (-not $SkipTests) {
                Invoke-DotNetTest
            }
        }
        'pack' {
            Invoke-DotNetBuild
            Invoke-DotNetPack
        }
        'all' {
            Invoke-DotNetClean
            Invoke-DotNetRestore
            Invoke-DotNetBuild
            if (-not $SkipTests) {
                Invoke-DotNetTest
            }
        }
    }
    
    Write-Header "Completed: $Target"
    exit 0
}
catch {
    Write-Error-Message $_.Exception.Message
    exit 1
}
