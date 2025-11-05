# Contributing to GAM Configuration Manager

First off, thank you for considering contributing to GAM Configuration Manager! It's people like you that make this tool better for everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Process](#development-process)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone git@github.com:your-username/gam-config-manager.git
   cd gam-config-manager
   ```
3. **Set up the development environment** following [SETUP.md](SETUP.md)
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior**
- **Actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, Python version, Node version, etc.)
- **Error logs** or stack traces

**Bug Report Template:**

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., macOS 13.0]
- Python: [e.g., 3.11]
- Node: [e.g., 18.16]
- GAM Version: [e.g., 6.70]

**Additional context**
Any other context about the problem.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** for the enhancement
- **Expected benefits**
- **Possible implementation** (optional)

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `bug` - Something isn't working
- `enhancement` - New feature or request

### Pull Requests

- Fill in the pull request template
- Follow the style guidelines
- Include tests for new features
- Update documentation as needed
- Ensure CI/CD passes

## Development Process

### Backend Development

1. **Set up Python environment:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Run tests:**
   ```bash
   pytest
   ```

3. **Code formatting:**
   ```bash
   black app/
   flake8 app/
   mypy app/
   ```

4. **Run the server:**
   ```bash
   python -m app.main
   ```

### Frontend Development

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Run tests:**
   ```bash
   npm test
   ```

3. **Linting:**
   ```bash
   npm run lint
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

### Database Changes

When making database schema changes:

1. Update models in `backend/app/db/models.py`
2. Create migration scripts (if using Alembic)
3. Test migrations on a local database
4. Document schema changes in pull request

## Style Guidelines

### Python Code Style

- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/)
- Use `black` for code formatting (line length: 100)
- Use type hints for function signatures
- Write docstrings for classes and functions
- Keep functions focused and small

**Example:**

```python
from typing import List, Optional

def analyze_configuration(
    config_data: dict,
    config_type: ConfigType,
    severity_filter: Optional[SeverityLevel] = None
) -> List[SecurityFinding]:
    """
    Analyze configuration for security issues.
    
    Args:
        config_data: Configuration data to analyze
        config_type: Type of configuration
        severity_filter: Optional filter by severity level
        
    Returns:
        List of security findings
    """
    # Implementation
    pass
```

### TypeScript/React Code Style

- Use functional components with hooks
- Use TypeScript for type safety
- Follow React best practices
- Use meaningful variable names
- Keep components small and focused

**Example:**

```typescript
interface ConfigurationCardProps {
  configuration: Configuration
  onSelect: (id: number) => void
}

const ConfigurationCard: React.FC<ConfigurationCardProps> = ({
  configuration,
  onSelect,
}) => {
  // Implementation
}
```

### File Organization

- Keep related code together
- Use meaningful file and directory names
- Follow existing project structure
- One component per file (React)
- Group related utilities

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(security): add password complexity rule

Implement new security rule to check password complexity
requirements including special characters and numbers.

Closes #123
```

```
fix(comparison): handle null values in config diff

Fixed TypeError when comparing configurations with null
values by adding null checks in comparison service.

Fixes #456
```

```
docs(readme): update installation instructions

Updated setup instructions to include PostgreSQL 15
requirement and added troubleshooting section.
```

## Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure all tests pass**
4. **Update CHANGELOG.md** (if applicable)
5. **Fill out the PR template** completely
6. **Request review** from maintainers
7. **Address review feedback**

### Pull Request Template

```markdown
## Description
Describe your changes in detail.

## Related Issue
Link to the issue this PR addresses.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe the tests you ran.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Changes generate no new warnings
```

## Testing Guidelines

### Backend Tests

- Write unit tests for services
- Write integration tests for API endpoints
- Test error cases and edge cases
- Aim for 80%+ code coverage

```python
def test_security_analysis():
    config_data = {"users": [...]}
    service = SecurityService()
    findings = service.analyze_configuration(config_data, ConfigType.USER)
    
    assert len(findings) > 0
    assert findings[0]["severity"] == SeverityLevel.HIGH
```

### Frontend Tests

- Test component rendering
- Test user interactions
- Test API integration
- Use React Testing Library

```typescript
test('renders configuration card', () => {
  const config = { id: 1, name: 'Test Config' }
  render(<ConfigurationCard configuration={config} />)
  
  expect(screen.getByText('Test Config')).toBeInTheDocument()
})
```

## Security Guidelines

### Reporting Security Vulnerabilities

**DO NOT** create public issues for security vulnerabilities. Instead:

1. Email security details to the maintainers
2. Include steps to reproduce
3. Allow time for fix before public disclosure

### Security Best Practices

- Never commit secrets or credentials
- Use environment variables for configuration
- Validate all user inputs
- Use parameterized queries (ORM)
- Keep dependencies updated
- Follow OWASP guidelines

## Documentation

When adding features or making changes:

- Update relevant `.md` files
- Add inline code comments for complex logic
- Update API documentation
- Include examples where helpful
- Keep documentation clear and concise

## Community

- Be respectful and inclusive
- Help others learn
- Share knowledge
- Give constructive feedback
- Celebrate successes

## Questions?

Feel free to:
- Open a discussion on GitHub
- Ask questions in pull requests
- Reach out to maintainers

Thank you for contributing! 🎉
