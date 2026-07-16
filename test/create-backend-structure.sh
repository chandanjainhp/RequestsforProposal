#!/bin/bash

# =============================================================
# Script: create-backend-structure.sh
# Description: Creates the full backend project directory tree
# Usage:   bash create-backend-structure.sh [BASE_DIR]
#          Defaults to ./backend if no argument is given
# =============================================================

BASE_DIR="${1:-./backend}"

echo "Creating backend project structure at: $BASE_DIR"
echo "------------------------------------------------"

# ── Root-level files ─────────────────────────────────────
ROOT_FILES=(
  "package.json"
  ".env"
  ".env.example"
  ".gitignore"
  "README.md"
  "src/app.js"
  "src/server.js"
)

# ── Config files ─────────────────────────────────────────
CONFIG_FILES=(
  "src/config/env.js"
  "src/config/db.js"
  "src/config/redis.js"
  "src/config/logger.js"
  "src/config/cors.js"
  "src/config/mail.js"
)

# ── Route files ──────────────────────────────────────────
ROUTE_FILES=(
  "src/routes/index.js"
  "src/routes/auth.routes.js"
  "src/routes/user.routes.js"
  "src/routes/rfp.routes.js"
  "src/routes/vendor.routes.js"
  "src/routes/proposal.routes.js"
  "src/routes/dashboard.routes.js"
  "src/routes/notification.routes.js"
  "src/routes/chat.routes.js"
  "src/routes/ai.routes.js"
  "src/routes/upload.routes.js"
)

# ── Controller files ─────────────────────────────────────
CONTROLLER_FILES=(
  "src/controllers/auth.controller.js"
  "src/controllers/user.controller.js"
  "src/controllers/rfp.controller.js"
  "src/controllers/vendor.controller.js"
  "src/controllers/proposal.controller.js"
  "src/controllers/dashboard.controller.js"
  "src/controllers/notification.controller.js"
  "src/controllers/chat.controller.js"
  "src/controllers/ai.controller.js"
  "src/controllers/upload.controller.js"
)

# ── Service files ────────────────────────────────────────
SERVICE_FILES=(
  "src/services/auth.service.js"
  "src/services/user.service.js"
  "src/services/rfp.service.js"
  "src/services/vendor.service.js"
  "src/services/proposal.service.js"
  "src/services/dashboard.service.js"
  "src/services/notification.service.js"
  "src/services/chat.service.js"
  "src/services/ai.service.js"
  "src/services/mail.service.js"
  "src/services/pdf.service.js"
  "src/services/upload.service.js"
  "src/services/token.service.js"
)

# ── Repository files ─────────────────────────────────────
REPO_FILES=(
  "src/repositories/user.repository.js"
  "src/repositories/rfp.repository.js"
  "src/repositories/vendor.repository.js"
  "src/repositories/proposal.repository.js"
  "src/repositories/notification.repository.js"
  "src/repositories/chat.repository.js"
)

# ── Middleware files ─────────────────────────────────────
MIDDLEWARE_FILES=(
  "src/middlewares/auth.middleware.js"
  "src/middlewares/role.middleware.js"
  "src/middlewares/validate.middleware.js"
  "src/middlewares/error.middleware.js"
  "src/middlewares/asyncHandler.js"
  "src/middlewares/rateLimit.middleware.js"
  "src/middlewares/upload.middleware.js"
  "src/middlewares/notFound.middleware.js"
)

# ── Validator files ──────────────────────────────────────
VALIDATOR_FILES=(
  "src/validators/auth.validator.js"
  "src/validators/user.validator.js"
  "src/validators/vendor.validator.js"
  "src/validators/rfp.validator.js"
  "src/validators/proposal.validator.js"
  "src/validators/chat.validator.js"
)

# ── Model files ──────────────────────────────────────────
MODEL_FILES=(
  "src/models/user.model.js"
  "src/models/vendor.model.js"
  "src/models/rfp.model.js"
  "src/models/proposal.model.js"
  "src/models/notification.model.js"
  "src/models/chat.model.js"
)

# ── Utility files ────────────────────────────────────────
UTIL_FILES=(
  "src/utils/ApiError.js"
  "src/utils/ApiResponse.js"
  "src/utils/catchAsync.js"
  "src/utils/jwt.js"
  "src/utils/otp.js"
  "src/utils/bcrypt.js"
  "src/utils/pagination.js"
  "src/utils/constants.js"
  "src/utils/date.js"
  "src/utils/helpers.js"
)

# ── Template files ───────────────────────────────────────
TEMPLATE_FILES=(
  "src/templates/verifyEmail.html"
  "src/templates/forgotPassword.html"
  "src/templates/inviteVendor.html"
  "src/templates/awardLetter.html"
)

# ── Upload directories (empty, but keep them) ────────────
UPLOAD_DIRS=(
  "src/uploads/proposals"
  "src/uploads/rfps"
  "src/uploads/avatars"
)

# ── Prisma files ─────────────────────────────────────────
PRISMA_FILES=(
  "src/prisma/schema.prisma"
  "src/prisma/seed.js"
)

# ── Docs files ───────────────────────────────────────────
DOCS_FILES=(
  "src/docs/swagger.js"
  "src/docs/openapi.yaml"
)

# ── Test directories ─────────────────────────────────────
TEST_DIRS=(
  "src/tests/auth"
  "src/tests/rfp"
  "src/tests/vendor"
  "src/tests/proposal"
  "src/tests/chat"
)

# ── Script files ─────────────────────────────────────────
SCRIPT_FILES=(
  "src/scripts/seed.js"
  "src/scripts/cleanup.js"
)

# ── Combine all files into one array ─────────────────────
ALL_FILES=(
  "${ROOT_FILES[@]}"
  "${CONFIG_FILES[@]}"
  "${ROUTE_FILES[@]}"
  "${CONTROLLER_FILES[@]}"
  "${SERVICE_FILES[@]}"
  "${REPO_FILES[@]}"
  "${MIDDLEWARE_FILES[@]}"
  "${VALIDATOR_FILES[@]}"
  "${MODEL_FILES[@]}"
  "${UTIL_FILES[@]}"
  "${TEMPLATE_FILES[@]}"
  "${PRISMA_FILES[@]}"
  "${DOCS_FILES[@]}"
  "${SCRIPT_FILES[@]}"
)

# ── Helper: count created items ──────────────────────────
DIR_COUNT=0
FILE_COUNT=0

# ── Create directories first ─────────────────────────────
echo ""
echo "Creating directories..."

for dir in "${UPLOAD_DIRS[@]}" "${TEST_DIRS[@]}"; do
  mkdir -p "$BASE_DIR/$dir"
  echo "  created: $BASE_DIR/$dir/"
  ((DIR_COUNT++))
done

# ── Create all files (parent dirs auto-created) ──────────
echo ""
echo "Creating files..."

for file in "${ALL_FILES[@]}"; do
  # Extract the directory portion and create it
  dir_part=$(dirname "$BASE_DIR/$file")
  mkdir -p "$dir_part"

  # Create the file only if it doesn't already exist
  if [ ! -f "$BASE_DIR/$file" ]; then
    touch "$BASE_DIR/$file"
    echo "  created: $BASE_DIR/$file"
    ((FILE_COUNT++))
  else
    echo "  skipped (exists): $BASE_DIR/$file"
    ((FILE_COUNT++))
  fi
done

# ── Keep the migrations directory ────────────────────────
mkdir -p "$BASE_DIR/src/prisma/migrations"
echo "  created: $BASE_DIR/src/prisma/migrations/"
((DIR_COUNT++))

# ── Add .gitkeep to empty directories so git tracks them ─
for dir in "${UPLOAD_DIRS[@]}" "${TEST_DIRS[@]}"; do
  touch "$BASE_DIR/$dir/.gitkeep"
  echo "  created: $BASE_DIR/$dir/.gitkeep"
  ((FILE_COUNT++))
done
touch "$BASE_DIR/src/prisma/migrations/.gitkeep"
echo "  created: $BASE_DIR/src/prisma/migrations/.gitkeep"
((FILE_COUNT++))

# ── Final summary ────────────────────────────────────────
echo ""
echo "================================================"
TOTAL=$((DIR_COUNT + FILE_COUNT))
echo "Done! $DIR_COUNT directories, $FILE_COUNT files created ($TOTAL total)."
echo "================================================"