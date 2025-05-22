# PowerShell script to build and publish the Vue Form Builder package

# Colors and styling
$Green = [System.ConsoleColor]::Green
$Blue = [System.ConsoleColor]::Blue
$Yellow = [System.ConsoleColor]::Yellow
$Red = [System.ConsoleColor]::Red

# Print header
Write-Host ""
Write-Host "┌──────────────────────────────────────────────┐" -ForegroundColor $Blue
Write-Host "│         Vue Form Builder - Publisher         │" -ForegroundColor $Blue
Write-Host "└──────────────────────────────────────────────┘" -ForegroundColor $Blue
Write-Host ""

# Check if npm is installed
try {
    npm -v | Out-Null
} catch {
    Write-Host "Error: npm is not installed. Please install npm and try again." -ForegroundColor $Red
    exit 1
}

# Get current version
$packageJson = Get-Content -Path ".\package.json" -Raw | ConvertFrom-Json
$currentVersion = $packageJson.version

# Ask for version bump
Write-Host "Current version:" -ForegroundColor $Yellow
Write-Host "$currentVersion" -ForegroundColor $Yellow
Write-Host ""
Write-Host "Select version bump:" -ForegroundColor $Yellow
Write-Host "1) Patch ($currentVersion -> [next patch])"
Write-Host "2) Minor ($currentVersion -> [next minor])"
Write-Host "3) Major ($currentVersion -> [next major])"
Write-Host "4) Custom version"
Write-Host "5) No version change"
Write-Host ""

$versionChoice = Read-Host "Enter choice [1-5]"

# Calculate new version based on choice
switch ($versionChoice) {
    "1" {
        $versionParts = $currentVersion -split "\."
        $newVersion = "{0}.{1}.{2}" -f $versionParts[0], $versionParts[1], ([int]$versionParts[2] + 1)
        $bumpType = "patch"
    }
    "2" {
        $versionParts = $currentVersion -split "\."
        $newVersion = "{0}.{1}.{2}" -f $versionParts[0], ([int]$versionParts[1] + 1), 0
        $bumpType = "minor"
    }
    "3" {
        $versionParts = $currentVersion -split "\."
        $newVersion = "{0}.{1}.{2}" -f ([int]$versionParts[0] + 1), 0, 0
        $bumpType = "major"
    }
    "4" {
        $newVersion = Read-Host "Enter custom version"
        $bumpType = "custom"
    }
    "5" {
        $newVersion = $currentVersion
        $bumpType = "none"
    }
    default {
        Write-Host "Invalid choice. Exiting." -ForegroundColor $Red
        exit 1
    }
}

# Update version in package.json if needed
if ($bumpType -ne "none") {
    Write-Host ""
    Write-Host "Updating version to $newVersion" -ForegroundColor $Yellow
    
    npm version $newVersion --no-git-tag-version | Out-Null
    
    Write-Host "Version updated in package.json" -ForegroundColor $Green
}

# Run tests
Write-Host ""
Write-Host "Running tests..." -ForegroundColor $Yellow

$testResult = $true
try {
    npm run test
    if ($LASTEXITCODE -ne 0) {
        $testResult = $false
    }
} catch {
    $testResult = $false
}

# Check if tests passed
if (-not $testResult) {
    Write-Host ""
    Write-Host "Tests failed. Fix the issues before publishing." -ForegroundColor $Red
    exit 1
}

# Build the package
Write-Host ""
Write-Host "Building package..." -ForegroundColor $Yellow

$buildResult = $true
try {
    npm run build:full
    if ($LASTEXITCODE -ne 0) {
        $buildResult = $false
    }
} catch {
    $buildResult = $false
}

# Check if build was successful
if (-not $buildResult) {
    Write-Host ""
    Write-Host "Build failed. Fix the issues before publishing." -ForegroundColor $Red
    exit 1
}

# Ask for confirmation before publishing
Write-Host ""
Write-Host "Ready to publish version $newVersion" -ForegroundColor $Yellow
$publishChoice = Read-Host "Publish to npm? (y/n)"

if ($publishChoice -eq "y" -or $publishChoice -eq "Y") {
    Write-Host ""
    Write-Host "Publishing to npm..." -ForegroundColor $Yellow
    
    $publishResult = $true
    try {
        npm publish
        if ($LASTEXITCODE -ne 0) {
            $publishResult = $false
        }
    } catch {
        $publishResult = $false
    }
    
    if ($publishResult) {
        Write-Host ""
        Write-Host "Vue Form Builder v$newVersion published successfully!" -ForegroundColor $Green
    } else {
        Write-Host ""
        Write-Host "Publishing failed." -ForegroundColor $Red
        exit 1
    }
} else {
    Write-Host ""
    Write-Host "Publishing cancelled." -ForegroundColor $Yellow
}

Write-Host ""
Write-Host "Done!" -ForegroundColor $Blue
