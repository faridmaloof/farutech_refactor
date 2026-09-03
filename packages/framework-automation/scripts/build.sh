#!/bin/bash
# Build and Test Script for Enterprise Automation Framework
# Usage: ./build.sh [target] [configuration]

TARGET="${1:-all}"
CONFIGURATION="${2:-Release}"
SOLUTION="src/Framework.Automation.slnx"

set -e

echo_header() {
    echo ""
    echo "============================================================"
    echo "$1"
    echo "============================================================"
}

echo_success() {
    echo "✓ $1"
}

echo_error() {
    echo "✗ $1" >&2
}

dotnet_restore() {
    echo_header "Restoring NuGet packages"
    dotnet restore "$SOLUTION"
    echo_success "Packages restored"
}

dotnet_build() {
    echo_header "Building solution ($CONFIGURATION)"
    dotnet build "$SOLUTION" --configuration "$CONFIGURATION" --no-restore
    echo_success "Build successful"
}

dotnet_test() {
    echo_header "Running tests ($CONFIGURATION)"
    dotnet test "$SOLUTION" \
        --configuration "$CONFIGURATION" \
        --no-build \
        --logger "console;verbosity=detailed"
    echo_success "All tests passed"
}

dotnet_clean() {
    echo_header "Cleaning solution"
    dotnet clean "$SOLUTION" --configuration "$CONFIGURATION"
    
    # Remove bin/obj folders
    find src -type d -name "bin" -exec rm -rf {} + 2>/dev/null || true
    find src -type d -name "obj" -exec rm -rf {} + 2>/dev/null || true
    
    # Remove test results
    rm -rf TestResults test-results evidence 2>/dev/null || true
    
    echo_success "Clean complete"
}

dotnet_pack() {
    echo_header "Creating NuGet packages"
    mkdir -p artifacts/packages
    dotnet pack "$SOLUTION" \
        --configuration "$CONFIGURATION" \
        --output artifacts/packages \
        --no-build
    echo_success "Packages created in artifacts/packages"
}

show_help() {
    cat << EOF
Enterprise Automation Framework - Build Script

Usage: ./build.sh [target] [configuration]

Targets:
  all       - Restore, build, and test (default)
  restore   - Restore NuGet packages only
  build     - Restore and build
  test      - Run tests (requires build)
  clean     - Clean build artifacts
  pack      - Create NuGet packages

Configuration:
  Debug     - Debug configuration
  Release   - Release configuration (default)

Examples:
  ./build.sh                    # Run all targets with Release config
  ./build.sh build              # Build only
  ./build.sh test               # Run tests
  ./build.sh clean              # Clean everything
  ./build.sh pack               # Create NuGet packages

EOF
}

case "$TARGET" in
    clean)
        dotnet_clean
        ;;
    restore)
        dotnet_restore
        ;;
    build)
        dotnet_restore
        dotnet_build
        ;;
    test)
        dotnet_test
        ;;
    pack)
        dotnet_build
        dotnet_pack
        ;;
    all)
        dotnet_clean
        dotnet_restore
        dotnet_build
        dotnet_test
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo_error "Unknown target: $TARGET"
        show_help
        exit 1
        ;;
esac

echo_header "Completed: $TARGET"
exit 0
