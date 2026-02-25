#!/bin/bash

# Verification script for Meal Discovery Platform
# Runs all tests, checks coverage, and builds for production

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================="
echo "  Meal Platform Verification Script"
echo "========================================="
echo ""

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
        exit 1
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${GREEN}ℹ${NC} $1"
}

# Check if we're in the project root
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Must run from project root directory${NC}"
    exit 1
fi

# Step 1: Install dependencies
echo "Step 1: Checking dependencies..."
if [ ! -d "node_modules" ]; then
    print_warning "Dependencies not installed. Installing..."
    npm install
fi
print_status $? "Dependencies installed"

# Step 2: Run backend tests
echo ""
echo "Step 2: Running backend tests..."
cd packages/backend
npm test -- --coverage --passWithNoTests 2>&1 | tee /tmp/backend-test.log
BACKEND_TEST_EXIT=$?
cd ../..

if [ $BACKEND_TEST_EXIT -eq 0 ]; then
    print_status 0 "Backend tests passed"

    # Check coverage
    if grep -q "All files" packages/backend/coverage/lcov-report/index.html 2>/dev/null; then
        print_info "Backend test coverage report generated"
    fi
else
    print_status 1 "Backend tests failed"
fi

# Step 3: Run frontend tests
echo ""
echo "Step 3: Running frontend tests..."
cd packages/frontend
npm test -- --run --coverage 2>&1 | tee /tmp/frontend-test.log
FRONTEND_TEST_EXIT=$?
cd ../..

if [ $FRONTEND_TEST_EXIT -eq 0 ]; then
    print_status 0 "Frontend tests passed"
else
    print_warning "Frontend tests failed or not all tests implemented yet"
fi

# Step 4: Build backend
echo ""
echo "Step 4: Building backend for production..."
cd packages/backend
npm run build > /tmp/backend-build.log 2>&1
BACKEND_BUILD_EXIT=$?
cd ../..

if [ $BACKEND_BUILD_EXIT -eq 0 ] && [ -d "packages/backend/dist" ]; then
    print_status 0 "Backend built successfully"
else
    print_status 1 "Backend build failed"
fi

# Step 5: Build frontend
echo ""
echo "Step 5: Building frontend for production..."
cd packages/frontend
npm run build > /tmp/frontend-build.log 2>&1
FRONTEND_BUILD_EXIT=$?
cd ../..

if [ $FRONTEND_BUILD_EXIT -eq 0 ] && [ -d "packages/frontend/dist" ]; then
    print_status 0 "Frontend built successfully"
else
    print_status 1 "Frontend build failed"
fi

# Step 6: Check for TypeScript errors
echo ""
echo "Step 6: Checking TypeScript compilation..."
cd packages/backend
npx tsc --noEmit > /tmp/backend-tsc.log 2>&1
BACKEND_TSC_EXIT=$?
cd ../..

if [ $BACKEND_TSC_EXIT -eq 0 ]; then
    print_status 0 "Backend TypeScript compilation successful"
else
    print_warning "Backend TypeScript has type errors (check /tmp/backend-tsc.log)"
fi

cd packages/frontend
npx tsc --noEmit > /tmp/frontend-tsc.log 2>&1
FRONTEND_TSC_EXIT=$?
cd ../..

if [ $FRONTEND_TSC_EXIT -eq 0 ]; then
    print_status 0 "Frontend TypeScript compilation successful"
else
    print_warning "Frontend TypeScript has type errors (check /tmp/frontend-tsc.log)"
fi

# Summary
echo ""
echo "========================================="
echo "  Verification Summary"
echo "========================================="
echo ""

TOTAL_STEPS=5
PASSED_STEPS=0

[ $BACKEND_TEST_EXIT -eq 0 ] && PASSED_STEPS=$((PASSED_STEPS + 1))
[ $FRONTEND_TEST_EXIT -eq 0 ] && PASSED_STEPS=$((PASSED_STEPS + 1))
[ $BACKEND_BUILD_EXIT -eq 0 ] && PASSED_STEPS=$((PASSED_STEPS + 1))
[ $FRONTEND_BUILD_EXIT -eq 0 ] && PASSED_STEPS=$((PASSED_STEPS + 1))
[ $BACKEND_TSC_EXIT -eq 0 ] && [ $FRONTEND_TSC_EXIT -eq 0 ] && PASSED_STEPS=$((PASSED_STEPS + 1))

echo "Passed: $PASSED_STEPS/$TOTAL_STEPS steps"
echo ""

if [ $PASSED_STEPS -eq $TOTAL_STEPS ]; then
    echo -e "${GREEN}✓ All verification checks passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Review test coverage reports:"
    echo "     - Backend: packages/backend/coverage/lcov-report/index.html"
    echo "     - Frontend: packages/frontend/coverage/index.html"
    echo "  2. Deploy to production (see DEPLOYMENT.md)"
    echo ""
    exit 0
else
    echo -e "${YELLOW}⚠ Some verification checks failed or need attention${NC}"
    echo ""
    echo "Check log files for details:"
    echo "  - Backend tests: /tmp/backend-test.log"
    echo "  - Frontend tests: /tmp/frontend-test.log"
    echo "  - Backend build: /tmp/backend-build.log"
    echo "  - Frontend build: /tmp/frontend-build.log"
    echo "  - Backend TypeScript: /tmp/backend-tsc.log"
    echo "  - Frontend TypeScript: /tmp/frontend-tsc.log"
    echo ""
    exit 1
fi
