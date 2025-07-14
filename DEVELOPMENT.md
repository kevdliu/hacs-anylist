# Development Setup

This document outlines the development setup for the anylist Home Assistant integration.

## GitHub Actions Workflows

The repository includes several GitHub Actions workflows:

### CI Workflow (`.github/workflows/ci.yml`)
Runs on every push and pull request to main branch:
- **Linting**: Checks code formatting with `black`, import sorting with `isort`, and linting with `flake8`
- **Type checking**: Runs `mypy` for static type analysis
- **Testing**: Runs tests with `pytest` on Python 3.11 and 3.12
- **Validation**: Uses `hassfest` to validate the Home Assistant integration

### Format Workflow (`.github/workflows/format.yml`)
Can be manually triggered to automatically format code:
- Formats code with `black`
- Sorts imports with `isort`
- Commits changes back to the repository

## Local Development

### Quick validation:
```bash
# Run the validation script to check setup
./scripts/test-setup.sh
```

### Install development dependencies:
```bash
pip install -r requirements-dev.txt
```

### Run linting and formatting locally:
```bash
# Check formatting
black --check custom_components/
isort --check-only custom_components/

# Format code
black custom_components/
isort custom_components/

# Run linting
flake8 custom_components/

# Run type checking
mypy custom_components/ --ignore-missing-imports
```

### Run tests:
```bash
pytest tests/ -v
```

### Use pre-commit hooks (optional):
```bash
pip install pre-commit
pre-commit install
```

## Configuration Files

- `pyproject.toml`: Configuration for black, isort, mypy, and pytest
- `.flake8`: Configuration for flake8 linting
- `requirements-dev.txt`: Development dependencies

## Code Quality Standards

This project follows Home Assistant's code quality standards:
- Code formatting with `black`
- Import sorting with `isort`
- Linting with `flake8`
- Type checking with `mypy`
- Testing with `pytest`