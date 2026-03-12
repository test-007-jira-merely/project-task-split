#!/bin/bash

# Verification script for monorepo structure
echo "==================================="
echo "Verifying Monorepo Structure"
echo "==================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (missing)"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        return 0
    else
        echo -e "${RED}✗${NC} $1/ (missing)"
        return 1
    fi
}

echo "Root Configuration:"
check_file "package.json"
check_file "tsconfig.json"
check_file "docker-compose.yml"
check_file "README.md"
check_file "SETUP.md"
check_file "QUICK_START.md"
check_file ".gitignore"

echo ""
echo "Shared Package:"
check_dir "packages/shared"
check_file "packages/shared/package.json"
check_file "packages/shared/tsconfig.json"
check_file "packages/shared/src/types.ts"
check_file "packages/shared/src/index.ts"

echo ""
echo "Backend Package:"
check_dir "packages/backend"
check_file "packages/backend/package.json"
check_file "packages/backend/tsconfig.json"
check_file "packages/backend/nest-cli.json"
check_file "packages/backend/jest.config.js"
check_file "packages/backend/.env.example"
check_file "packages/backend/README.md"

echo ""
echo "Backend - Prisma:"
check_file "packages/backend/prisma/schema.prisma"
check_file "packages/backend/prisma/seed.ts"

echo ""
echo "Backend - Domain Layer:"
check_file "packages/backend/src/domain/entities/dish.entity.ts"
check_file "packages/backend/src/domain/services/matching-algorithm.service.ts"
check_file "packages/backend/src/domain/services/substitution-matrix.service.ts"

echo ""
echo "Backend - Application Layer:"
check_file "packages/backend/src/application/dto/random-dish.dto.ts"
check_file "packages/backend/src/application/dto/ingredient-match.dto.ts"

echo ""
echo "Backend - Infrastructure Layer:"
check_file "packages/backend/src/infrastructure/database/prisma.service.ts"
check_file "packages/backend/src/infrastructure/repositories/dish.repository.ts"
check_file "packages/backend/src/infrastructure/logging/logger.service.ts"

echo ""
echo "Backend - API Layer:"
check_file "packages/backend/src/api/controllers/dishes.controller.ts"
check_file "packages/backend/src/api/controllers/health.controller.ts"
check_file "packages/backend/src/api/middleware/logging.middleware.ts"
check_file "packages/backend/src/api/filters/http-exception.filter.ts"

echo ""
echo "Backend - Core:"
check_file "packages/backend/src/main.ts"
check_file "packages/backend/src/app.module.ts"

echo ""
echo "Backend - Tests:"
check_file "packages/backend/test/unit/matching-algorithm.service.spec.ts"

echo ""
echo "==================================="
echo "Structure Verification Complete!"
echo "==================================="
echo ""
echo "Next steps:"
echo "  1. npm install"
echo "  2. docker-compose up -d"
echo "  3. cd packages/backend && npx prisma migrate dev"
echo "  4. npx prisma db seed"
echo "  5. npm run dev:backend"
