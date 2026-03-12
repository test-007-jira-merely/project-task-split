#!/bin/bash

echo "🔍 Verifying Meal Discovery Platform Setup..."
echo ""

# Check directory structure
echo "📁 Checking directory structure..."
[ -d "packages/shared" ] && echo "✅ packages/shared exists" || echo "❌ packages/shared missing"
[ -d "apps/backend" ] && echo "✅ apps/backend exists" || echo "❌ apps/backend missing"
[ -d "apps/frontend" ] && echo "✅ apps/frontend exists" || echo "❌ apps/frontend missing"
echo ""

# Check key files
echo "📄 Checking key files..."
[ -f "pnpm-workspace.yaml" ] && echo "✅ pnpm-workspace.yaml exists" || echo "❌ pnpm-workspace.yaml missing"
[ -f "package.json" ] && echo "✅ Root package.json exists" || echo "❌ Root package.json missing"
[ -f "apps/backend/prisma/schema.prisma" ] && echo "✅ Prisma schema exists" || echo "❌ Prisma schema missing"
[ -f "apps/backend/prisma/seed.ts" ] && echo "✅ Seed file exists" || echo "❌ Seed file missing"
[ -f "apps/backend/src/main.ts" ] && echo "✅ Backend main.ts exists" || echo "❌ Backend main.ts missing"
[ -f "apps/backend/src/app.module.ts" ] && echo "✅ App module exists" || echo "❌ App module missing"
echo ""

# Check modules
echo "🧩 Checking backend modules..."
[ -f "apps/backend/src/modules/dish/dish.module.ts" ] && echo "✅ DishModule exists" || echo "❌ DishModule missing"
[ -f "apps/backend/src/modules/matching/matching.module.ts" ] && echo "✅ MatchingModule exists" || echo "❌ MatchingModule missing"
[ -f "apps/backend/src/modules/user-activity/user-activity.module.ts" ] && echo "✅ UserActivityModule exists" || echo "❌ UserActivityModule missing"
[ -f "apps/backend/src/modules/health/health.module.ts" ] && echo "✅ HealthModule exists" || echo "❌ HealthModule missing"
echo ""

# Count files
echo "📊 File statistics..."
TS_FILES=$(find . -name "*.ts" -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/.contracts-beezi/*" | wc -l)
echo "   TypeScript files: $TS_FILES"

MODULES=$(find apps/backend/src/modules -name "*.module.ts" | wc -l)
echo "   Backend modules: $MODULES"

CONTROLLERS=$(find apps/backend/src/modules -name "*.controller.ts" | wc -l)
echo "   Controllers: $CONTROLLERS"

SERVICES=$(find apps/backend/src/modules -name "*.service.ts" | wc -l)
echo "   Services: $SERVICES"

echo ""
echo "✅ Setup verification complete!"
echo ""
echo "Next steps:"
echo "1. Run 'pnpm install' to install dependencies"
echo "2. Run 'cd apps/backend && pnpm prisma:generate' to generate Prisma client"
echo "3. Configure DATABASE_URL in apps/backend/.env"
echo "4. Run 'pnpm db:migrate' to create database schema"
echo "5. Run 'pnpm db:seed' to populate with recipes"
echo "6. Run 'pnpm dev:backend' to start the server"
