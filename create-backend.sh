#!/bin/bash

# Create root directory structure
mkdir -p server
cd server

# Create root files
touch package.json package-lock.json drizzle.config.js Dockerfile docker-compose.yml .dockerignore .gitignore .env .env.example README.md

# Create src directory and all subdirectories
mkdir -p src/{config,db/{schema,migrations},routes,controllers,services,repositories,middlewares,validators,providers/{ai,payment,storage,mail},prompts/{chat,rfp,proposal,vendor},templates,uploads/{avatars,proposals,rfps,invoices,temp},utils,docs}

# Create src files
touch src/app.js src/server.js

# Create config files
touch src/config/{env,db,redis,logger,cors,mail,swagger,ai}.js

# Create db files
touch src/db/{index,relations,seed}.js

# Create schema files
touch src/db/schema/{index,users,organizations,roles,permissions,refreshTokens,otp,vendors,vendorCategories,rfps,rfpSections,proposal,proposalFiles,proposalScores,chats,chatMessages,notifications,activities,payments,subscriptions,invoices,transactions,plans,files,auditLogs}.schema.js

# Create route files
touch src/routes/{index,auth,user,organization,vendor,rfp,proposal,dashboard,notification,chat,ai,payment,upload,health}.routes.js

# Create controller files
touch src/controllers/{auth,user,organization,vendor,rfp,proposal,dashboard,notification,chat,ai,payment,upload,health}.controller.js

# Create service files
touch src/services/{auth,user,organization,vendor,rfp,proposal,dashboard,notification,chat,ai,payment,upload,storage,mail,pdf,otp,token}.service.js

# Create repository files
touch src/repositories/{auth,user,organization,vendor,rfp,proposal,dashboard,notification,chat,payment,upload,otp,token}.repository.js

# Create middleware files
touch src/middlewares/{auth,role,permission,validate,asyncHandler,upload,rateLimiter,requestLogger,error,notFound}.middleware.js

# Create validator files
touch src/validators/{auth,user,organization,vendor,rfp,proposal,chat,payment,upload}.validator.js

# Create provider files
touch src/providers/ai/{gemini,sarvam,provider.factory,index}.provider.js
touch src/providers/payment/{razorpay,webhook,index}.provider.js
touch src/providers/storage/{local,cloudinary,s3,index}.provider.js
touch src/providers/mail/{nodemailer,index}.provider.js

# Create prompt files
touch src/prompts/chat/assistant.prompt.js
touch src/prompts/rfp/{generate,improve,review,summarize}.prompt.js
touch src/prompts/proposal/{analyze,compare,score,recommendation}.prompt.js
touch src/prompts/vendor/recommendation.prompt.js

# Create template files
touch src/templates/{verifyEmail,forgotPassword,paymentSuccess,paymentFailed,invoice,inviteVendor,proposalReceived,awardLetter}.html

# Create utils files
touch src/utils/{ApiError,ApiResponse,bcrypt,constants,date,enums,helpers,jwt,otp,pagination,permissions,response}.js

# Create docs files
touch src/docs/{swagger,openapi}.js

# Create test directories and files
mkdir -p tests/{auth,organization,vendor,rfp,proposal,payment,ai,chat,integration}
touch tests/auth/.gitkeep tests/organization/.gitkeep tests/vendor/.gitkeep tests/rfp/.gitkeep tests/proposal/.gitkeep tests/payment/.gitkeep tests/ai/.gitkeep tests/chat/.gitkeep tests/integration/.gitkeep

# Create scripts directory and files
mkdir -p scripts
touch scripts/{seed,cleanup,migrate,create-admin}.js

echo "Backend directory structure created successfully!"
echo "Total directories: $(find . -type d | wc -l)"
echo "Total files: $(find . -type f | wc -l)"
