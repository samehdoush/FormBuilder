#!/bin/bash

# Script to build and publish the Vue Form Builder package

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Print header
echo -e "${BLUE}${BOLD}"
echo -e "╔══════════════════════════════════════════════╗"
echo -e "║         Vue Form Builder - Publisher         ║"
echo -e "╚══════════════════════════════════════════════╝${NC}"
echo

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed. Please install npm and try again.${NC}"
    exit 1
fi

# Ask for version bump
echo -e "${YELLOW}Current version:${NC}"
current_version=$(node -e "console.log(require('./package.json').version)")
echo -e "${BOLD}$current_version${NC}"

echo
echo -e "${YELLOW}Select version bump:${NC}"
echo "1) Patch (1.0.0 -> 1.0.1)"
echo "2) Minor (1.0.0 -> 1.1.0)"
echo "3) Major (1.0.0 -> 2.0.0)"
echo "4) Custom version"
echo "5) No version change"
echo
read -p "Enter choice [1-5]: " version_choice

case $version_choice in
    1)
        bump_type="patch"
        new_version=$(node -e "const [major, minor, patch] = '$current_version'.split('.'); console.log(`${major}.${minor}.${parseInt(patch) + 1}`)")
        ;;
    2)
        bump_type="minor"
        new_version=$(node -e "const [major, minor, patch] = '$current_version'.split('.'); console.log(`${major}.${parseInt(minor) + 1}.0`)")
        ;;
    3)
        bump_type="major"
        new_version=$(node -e "const [major, minor, patch] = '$current_version'.split('.'); console.log(`${parseInt(major) + 1}.0.0`)")
        ;;
    4)
        read -p "Enter custom version: " new_version
        bump_type="custom"
        ;;
    5)
        new_version=$current_version
        bump_type="none"
        ;;
    *)
        echo -e "${RED}Invalid choice. Exiting.${NC}"
        exit 1
        ;;
esac

if [ "$bump_type" != "none" ]; then
    echo
    echo -e "${YELLOW}Updating version to ${BOLD}$new_version${NC}"
    
    # Update version in package.json
    npm version $new_version --no-git-tag-version
    
    echo -e "${GREEN}Version updated in package.json${NC}"
fi

# Run tests
echo
echo -e "${YELLOW}Running tests...${NC}"
npm run test

# Check if tests passed
if [ $? -ne 0 ]; then
    echo
    echo -e "${RED}Tests failed. Fix the issues before publishing.${NC}"
    exit 1
fi

# Build the package
echo
echo -e "${YELLOW}Building package...${NC}"
npm run build:full

# Check if build was successful
if [ $? -ne 0 ]; then
    echo
    echo -e "${RED}Build failed. Fix the issues before publishing.${NC}"
    exit 1
fi

# Ask for confirmation before publishing
echo
echo -e "${YELLOW}Ready to publish version ${BOLD}$new_version${NC}"
read -p "Publish to npm? (y/n): " publish_choice

if [ "$publish_choice" == "y" ] || [ "$publish_choice" == "Y" ]; then
    echo
    echo -e "${YELLOW}Publishing to npm...${NC}"
    npm publish
    
    if [ $? -eq 0 ]; then
        echo
        echo -e "${GREEN}${BOLD}Vue Form Builder v$new_version published successfully!${NC}"
    else
        echo
        echo -e "${RED}Publishing failed.${NC}"
        exit 1
    fi
else
    echo
    echo -e "${YELLOW}Publishing cancelled.${NC}"
fi

echo
echo -e "${BLUE}${BOLD}Done!${NC}"
