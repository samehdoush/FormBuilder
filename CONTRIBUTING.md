# Contributing to Vue Form Builder

Thank you for considering contributing to the Vue Form Builder project! This document outlines the guidelines and processes for contributing.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Pull Request Process](#pull-request-process)
5. [Coding Standards](#coding-standards)
6. [Testing](#testing)
7. [Documentation](#documentation)

## Code of Conduct

Please be respectful and considerate of others when contributing to this project. We aim to create a welcoming and inclusive environment for everyone.

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Fork the repository on GitHub
2. Clone your fork locally
   ```bash
   git clone https://github.com/YOUR_USERNAME/vue-form-builder.git
   cd vue-form-builder
   ```
3. Install dependencies
   ```bash
   npm install
   ```
4. Set up the development environment
   ```bash
   npm run dev
   ```

## Development Workflow

1. Create a new branch from `main` for your feature or bug fix
   ```bash
   git checkout -b feature/your-feature-name
   ```
   or
   ```bash
   git checkout -b fix/issue-description
   ```

2. Make your changes and test them thoroughly

3. Commit your changes with a clear commit message
   ```bash
   git commit -m "Add feature: description of the feature"
   ```

4. Push your branch to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

5. Create a Pull Request against the `main` branch of the original repository

## Pull Request Process

1. Ensure your code passes all tests and linting rules
2. Update documentation to reflect any changes
3. Add a clear description of the changes and the problem they solve
4. Request a review from a maintainer
5. Address any feedback or requested changes
6. Once approved, your PR will be merged

## Coding Standards

- Follow the Vue.js style guide: https://vuejs.org/style-guide/
- Use 2 spaces for indentation
- Use single quotes for strings
- Add comments for complex logic
- Write descriptive variable and function names

## Testing

All new features should include appropriate tests:

- Unit tests for utility functions and components
- Integration tests for component interactions

Run tests with:
```bash
npm run test
```

## Documentation

- Update README.md with new features or changed behavior
- Add JSDoc comments to functions and components
- Keep the DOCUMENTATION.md file up to date
- Include examples when appropriate

## Component Guidelines

When adding new form components or enhancing existing ones, please follow these guidelines:

1. **Consistency**: Ensure your component matches the style and behavior of existing components
2. **Accessibility**: Make sure your component is accessible (proper ARIA attributes, keyboard navigation)
3. **Validation**: Support form validation rules
4. **Internationalization**: Support i18n if applicable
5. **Responsive Design**: Ensure components work on all screen sizes

## Questions?

If you have any questions or need help, please open an issue or reach out to the maintainers directly.
