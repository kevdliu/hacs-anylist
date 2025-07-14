#!/bin/bash
# Script to test the development setup locally

set -e

echo "Testing Home Assistant AnyList Integration Development Setup"
echo "=========================================================="

# Test 1: Check YAML files are valid
echo "1. Validating YAML files..."
python -c "import yaml; yaml.safe_load(open('.github/workflows/ci.yml')); yaml.safe_load(open('.github/workflows/format.yml')); print('✓ YAML files are valid')"

# Test 2: Check Python files compile
echo "2. Checking Python syntax..."
python -c "import py_compile; import os; [py_compile.compile(os.path.join(root, f), doraise=True) for root, dirs, files in os.walk('custom_components') for f in files if f.endswith('.py')]; print('✓ All Python files compile successfully')"

# Test 3: Check manifest.json is valid
echo "3. Validating manifest.json..."
python -c "import json; data=json.load(open('custom_components/anylist/manifest.json')); assert 'domain' in data; assert 'name' in data; assert 'version' in data; print('✓ Manifest.json is valid')"

# Test 4: Check development dependencies
echo "4. Checking development dependencies..."
if command -v black &> /dev/null && command -v isort &> /dev/null && command -v flake8 &> /dev/null; then
    echo "✓ Development tools available"
else
    echo "⚠ Some development tools not installed. Run: pip install -r requirements-dev.txt"
fi

# Test 5: Check basic formatting (non-destructive)
echo "5. Testing code quality tools..."
if command -v black &> /dev/null; then
    if black --check custom_components/ 2>/dev/null; then
        echo "✓ Code is properly formatted with black"
    else
        echo "ℹ Code needs formatting with black (run: black custom_components/)"
    fi
fi

if command -v isort &> /dev/null; then
    if isort --check-only custom_components/ 2>/dev/null; then
        echo "✓ Imports are properly sorted with isort"
    else
        echo "ℹ Imports need sorting with isort (run: isort custom_components/)"
    fi
fi

if command -v flake8 &> /dev/null; then
    critical_errors=$(flake8 custom_components/ --count --select=E9,F63,F7,F82 2>/dev/null | tail -1 || echo "0")
    if [ "$critical_errors" = "0" ]; then
        echo "✓ No critical syntax errors found with flake8"
    else
        echo "⚠ Found $critical_errors critical syntax errors"
    fi
fi

echo ""
echo "Development setup validation complete!"
echo ""
echo "To run the CI checks locally:"
echo "  pip install -r requirements-dev.txt"
echo "  black custom_components/"
echo "  isort custom_components/"
echo "  flake8 custom_components/"
echo "  mypy custom_components/ --ignore-missing-imports"
echo "  pytest tests/ -v"