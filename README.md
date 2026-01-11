# RFP Management & BidSense Platform

A modern full-stack AI-powered Request for Proposal (RFP) management system with intelligent proposal comparison and scoring. Streamline procurement workflows with automated RFP creation, vendor management, proposal analysis, and data-driven decision making using BidSense technology.

![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![React](https://img.shields.io/badge/React-19.2+-blue)
![Express.js](https://img.shields.io/badge/Express.js-4.22+-yellow)
![MongoDB](https://img.shields.io/badge/MongoDB-7.8+-green)
![Gemini AI](https://img.shields.io/badge/AI-Gemini%202.0-orange)
![Vite](https://img.shields.io/badge/Build-Vite-645DFF)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Project Architecture](#project-architecture)
4. [Tech Stack](#tech-stack)
5. [Project Setup](#project-setup)
6. [API Documentation](#api-documentation)
7. [Project Structure](#project-structure)
8. [Configuration](#configuration)
9. [Key Workflows](#key-workflows)
10. [Error Handling](#error-handling)
11. [Security Features](#security-features)

---

## 🎯 Overview
<a name="overview"></a>

The RFP Management & BidSense Platform is designed to revolutionize procurement workflows. It enables organizations to:

- **Create & Manage RFPs**: Build comprehensive RFPs with structured line items, specifications, delivery terms, and budget constraints
- **Vendor Management**: Maintain vendor databases, track performance, and manage vendor communications
- **Intelligent Proposal Analysis**: Automatically parse vendor proposals using Google Gemini AI
- **Smart Comparison**: Compare multiple proposals using AI-powered scoring across price, delivery, warranty, and completeness dimensions
- **Real-time Collaboration**: Chat interface for internal discussions and decision-making
- **Admin Dashboard**: Monitor user activity, manage system settings, and access analytics

---

## ✨ Key Features

### User Management & Authentication
- **Email-based Sign-up & Login** with OTP verification
- **Role-based Access Control** (User and Admin roles)
- **Secure JWT Token** management with refresh tokens
- **User Profile Management** with company information

### RFP Management
- **Draft & Send RFPs** with detailed specifications
- **Email Integration** - Vendors receive RFPs via email with unique reply tokens
- **RFP Tracking** - Monitor RFP status (draft, sent, active, pending_responses, closed)
- **History & Archives** - Access past RFPs and responses

### Vendor Management
- **Vendor Database** - Add and manage vendor information
- **Vendor Selection** - Choose vendors for each RFP
- **Vendor Search & Filtering** - Quickly find vendors by name or company
- **Bulk Vendor Operations** - Manage multiple vendors at once

### BidSense - Intelligent Proposal Comparison
- **Automated Proposal Parsing** - AI extracts structured data from vendor responses
- **Multi-dimensional Scoring**:
  - **Price**: Cost competitiveness (0-100 points)
  - **Delivery**: Timeline feasibility (0-100 points)
  - **Warranty**: Coverage adequacy (0-100 points)
  - **Completeness**: Response quality (0-100 points)
- **Configurable Weights**: Adjust scoring weights based on business priorities
- **Visual Comparison Charts**: Recharts-powered visualization for easy decision-making
- **Score History**: Track scoring changes over time

### Email Communication
- **Inbound Email Handling** - Automatically receive and parse vendor responses
- **Email Templates** - Professional RFP templates with auto-filled details
- **Gmail Integration** - Send RFPs directly from Gmail accounts
- **Email Logging** - Complete audit trail of all communications

### Collaboration & Chat
- **Internal Chat** - Team discussions about RFPs and proposals
- **Proposal Discussion** - Comment and discuss specific proposals
- **Real-time Updates** - Live notifications for new messages and responses

### Admin Features
- **User Management** - View and manage all platform users
- **System Settings** - Configure scoring weights, email templates, and system parameters
- **Activity Monitoring** - Track user actions and API usage
- **Rate Limiting** - Built-in DDoS protection

---

## 🏗️ Project Architecture
<a name="project-architecture"></a>

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                      │
│  ├─ Pages (Dashboard, RFP Editor, Proposal Comparison, Chat)   │
│  ├─ Components (Reusable UI components with Tailwind CSS)       │
│  ├─ State Management (Zustand stores)                           │
│  └─ API Client (Axios with custom configuration)                │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ HTTP/REST
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                Backend (Node.js + Express)                       │
│  ├─ Routes (Auth, RFP, Vendor, Comparison, Email Inbound)       │
│  ├─ Controllers (Business logic layer)                          │
│  ├─ Models (MongoDB schemas)                                     │
│  ├─ Middlewares (Auth, Validation, Error Handling)              │
│  ├─ Adapters (Email, AI Scoring, Storage)                       │
│  └─ Utilities (Logger, Token Manager, Error Handler)            │
└──────────────────────┬──────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
    MongoDB        Google         Nodemailer
     (Data)     Gemini AI        (Email)
                (Scoring)
```

### Data Flow

1. **RFP Creation**: User creates RFP → Stored in MongoDB → Email sent to vendors
2. **Proposal Reception**: Vendor email → Parsed by Nodemailer → Stored in database
3. **AI Analysis**: Proposal text → Sent to Gemini AI → Scoring algorithm → Results stored
4. **Comparison**: Multiple proposals → Weighted scoring → Visual comparison displayed
5. **Collaboration**: Users discuss via chat → Messages stored → Real-time updates

---

## 🛠️ Tech Stack
<a name="tech-stack"></a>

### Frontend Stack
| Technology | Purpose |
|-----------|---------|
| **React 19.2** | UI library with modern hooks |
| **Vite 7.2** | Lightning-fast build tool (Rolldown-based) |
| **React Router 7.11** | Client-side routing |
| **Zustand 5.0** | Lightweight state management |
| **Tailwind CSS 4.1** | Utility-first CSS framework |
| **PostCSS 8.5** | CSS processing and Tailwind support |
| **Axios 1.13** | HTTP client for API calls |
| **Recharts 3.6** | React charting library for comparisons |
| **Lucide React 0.555** | Modern icon library |

### Backend Stack
| Technology | Purpose |
|-----------|---------|
| **Node.js 18+** | JavaScript runtime |
| **Express.js 4.22** | Web framework |
| **MongoDB 7.8** | NoSQL database |
| **Mongoose 7.8** | MongoDB ODM |
| **Google Generative AI 0.24** | Gemini AI API integration |
| **Nodemailer 7.0** | Email sending service |
| **JWT (jsonwebtoken 9.0)** | Token-based authentication |
| **bcryptjs 3.0** | Password hashing |
| **Express Validator 7.3** | Request validation |
| **Joi 18.0** | Schema validation |
| **Helmet 4.x** | Security headers |
| **CORS 2.8** | Cross-origin handling |
| **Winston 3.19** | Logging framework |
| **BullMQ 4.18** | Job queue (background processing) |

---

## 🚀 Project Setup
<a name="project-setup"></a>

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: v7.8+ (local or MongoDB Atlas)
- **Git**: v2.0+
- **API Keys Required**:
  - Google Gemini API Key (for AI proposal analysis)
  - Gmail App Password (optional, for email functionality)

### Installation Steps

#### 1. Clone Repository & Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd RequestsforProposal

# Install backend dependencies
cd server
npm install

# Install frontend dependencies  
cd ../client
npm install
```

#### 2. Backend Configuration

Create a `.env` file in the `server/` directory with the following variables:

```env
# === Database Configuration ===
MONGODB_URI=mongodb://localhost:27017/rfp_prototype
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/rfp_prototype

# === Server Configuration ===
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug

# === JWT Configuration ===
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
REFRESH_TOKEN_EXPIRE=30d

# === CORS Configuration ===
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173

# === AI/LLM Configuration (Google Gemini) ===
GEMINI_API_KEY=your-google-gemini-api-key
GEMINI_ENDPOINT=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
GEMINI_MODEL=gemini-2.0-flash

# === Email Service Configuration (Gmail) ===
EMAIL_SERVICE=gmail
SENDER_EMAIL=your-email@gmail.com
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-gmail-app-password
EMAIL_INBOUND_SECRET=your-webhook-secret-key

# === Proposal Scoring Weights (must sum to 1.0) ===
SCORE_WEIGHTS_PRICE=0.5
SCORE_WEIGHTS_DELIVERY=0.2
SCORE_WEIGHTS_WARRANTY=0.1
SCORE_WEIGHTS_COMPLETENESS=0.2

# === File Upload Configuration ===
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760  # 10MB

# === Redis Configuration (optional, for job queues) ===
REDIS_URL=redis://127.0.0.1:6379

# === Email Webhook Configuration ===
WEBHOOK_URL=https://your-domain.com/api/email/inbound
```

#### 3. Frontend Configuration

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:3000
```

#### 4. Get API Keys

##### Google Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key to your `.env` file

##### Gmail App Password (for Email Sending)
1. Enable 2-Factor Authentication on your Gmail account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Select "Mail" and "Windows Computer" (or your device)
4. Google generates a 16-character password
5. Copy this password to `GMAIL_APP_PASSWORD` in `.env`

#### 5. Setup MongoDB

**Option A: Local MongoDB**
```bash
# On Windows, start MongoDB service
mongod

# Or if installed via Homebrew (macOS):
brew services start mongodb-community
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/rfp_prototype`
4. Use this as `MONGODB_URI` in `.env`

#### 6. Run the Application

**Terminal 1 - Backend Server**
```bash
cd server
npm run dev
# Server starts at http://localhost:3000
```

**Terminal 2 - Frontend Development Server**
```bash
cd client
npm run dev
# Frontend starts at http://localhost:5173
```

**Access the Application**
- Open browser to [http://localhost:5173](http://localhost:5173)
- Sign up with an email address
- Verify OTP (check terminal or logs for test mode)
- Start creating RFPs!

---

## 📁 Project Structure
<a name="project-structure"></a>

### Frontend Structure (`client/src/`)

```
src/
├── pages/                          # Route components
│   ├── HomePage.jsx                # Public landing page
│   ├── DashboardPage.jsx           # Main dashboard
│   ├── RfpEditorPage.jsx           # RFP creation & editing
│   ├── SendRfpPage.jsx             # Send RFP to vendors
│   ├── HistoryPage.jsx             # RFP history & archives
│   ├── VendorPage.jsx              # Vendor management
│   ├── ComparePage.jsx             # Proposal comparison
│   ├── ChatPage.jsx                # Team chat
│   ├── ProposalInboxPage.jsx       # Incoming proposals
│   ├── SettingsPage.jsx            # User settings
│   ├── AdminUsersPage.jsx          # Admin: manage users
│   ├── AdminSettingsPage.jsx       # Admin: system settings
│   ├── LoginPage.jsx               # Authentication
│   ├── SignupPage.jsx              # Registration
│   ├── VerifyOTPPage.jsx           # OTP verification
│   └── Error*.jsx                  # Error pages (403, 404, 500)
│
├── components/                     # Reusable components
│   ├── Header.jsx                  # Navigation header
│   ├── Sidebar.jsx                 # Side navigation
│   ├── Button.jsx                  # Custom button
│   ├── BidSenseStepper.jsx         # RFP wizard
│   ├── BidSensePreviewExpanded.jsx # Proposal preview
│   ├── ScoreChart.jsx              # Scoring visualization
│   ├── ProposalCard.jsx            # Proposal display
│   ├── VendorSelector.jsx          # Vendor picker
│   ├── ChatBubble.jsx              # Chat messages
│   ├── ChatInput.jsx               # Chat input
│   ├── ConfirmDialog.jsx           # Confirmation modal
│   ├── Toast.jsx                   # Notifications
│   ├── ToastContainer.jsx          # Toast container
│   ├── ErrorBoundary.jsx           # Error catching
│   ├── NetworkStatus.jsx           # Connection indicator
│   ├── SaveStatusIndicator.jsx     # Save status
│   └── ...other components
│
├── layout/                         # Layout wrappers
│   ├── MainLayout.jsx              # Main app layout
│   ├── PublicLayout.jsx            # Public pages layout
│   ├── ProtectedLayout.jsx         # Protected routes layout
│   ├── AuthLayout.jsx              # Auth pages layout
│   └── Header.jsx, Sidebar.jsx     # Common layout components
│
├── api/                            # API client
│   ├── apiClient.js                # Axios instance
│   ├── axiosConfig.js              # Axios configuration
│   ├── authAPI.js                  # Auth endpoints
│   ├── bidsense.js                 # BidSense endpoints
│   ├── compare.js                  # Comparison endpoints
│   ├── vendors.js                  # Vendor endpoints
│   └── ...other API modules
│
├── store/                          # Zustand state management
│   ├── authStore.js                # Auth state
│   ├── bidsenseStore.js            # RFP/BidSense state
│   ├── notificationStore.js        # Toast/notification state
│   └── syncStore.js                # Sync state
│
├── hooks/                          # Custom React hooks
│   ├── useAuth.js                  # Authentication hook
│   └── useApi.js                   # API call hook
│
├── routes/                         # Routing
│   └── routeConfig.jsx             # Route definitions
│
├── constants/                      # Application constants
│   └── routes.js                   # Route paths
│
├── styles/                         # Global styles
│   ├── brand.css                   # Brand colors & theming
│   ├── App.css                     # App styles
│   └── index.css                   # Global styles
│
└── utils/                          # Utility functions
    ├── errorHandler.js             # Error handling
    ├── tokenStorage.js             # Token management
    └── ...other utilities
```

### Backend Structure (`server/src/`)

```
src/
├── app.js                          # Express app setup
├── config.js                       # Configuration
├── constants.js                    # Constants
├── firsttypeindex.js               # Type definitions
│
├── controllers/                    # Business logic
│   ├── auth.Controller.js          # Auth endpoints
│   ├── rfp.controller.js           # Single RFP operations
│   ├── rfps.controller.js          # Multiple RFP operations
│   ├── bidsense.Controller.js      # BidSense logic
│   ├── comparison.controller.js    # Proposal comparison
│   ├── vendor.controller.js        # Vendor management
│   ├── user.Controller.js          # User management
│   ├── email.controller.js         # Email operations
│   └── health.controller.js        # Health check
│
├── models/                         # MongoDB schemas
│   ├── User.js                     # User schema
│   ├── Rfp.js                      # RFP schema
│   ├── Proposal.js                 # Proposal schema
│   ├── Vendor.js                   # Vendor schema
│   ├── ComparisonScore.js          # Scoring schema
│   ├── OTP.js                      # OTP schema
│   ├── EmailLog.js                 # Email tracking
│   └── Attachment.js               # File attachments
│
├── routes/                         # API routes
│   ├── authRoutes.js               # /api/auth
│   ├── rfp.router.js               # /api/rfp (single)
│   ├── rfps.router.js              # /api/rfps (multiple)
│   ├── bidsenseRoutes.js           # /api/bidsense
│   ├── comparison.router.js        # /api/compare
│   ├── vendor.router.js            # /api/vendors
│   ├── emailInbound.js             # /api/email/inbound
│   └── health.router.js            # /api/health
│
├── middlewares/                    # Express middlewares
│   ├── auth.middle.js              # JWT authentication
│   ├── authMiddleware.js           # Auth checking
│   ├── errorHandler.js             # Error handling
│   ├── multer.middleware.js        # File upload
│   ├── validate.js                 # Request validation
│   └── validateRequest.js          # Request validation
│
├── adapters/                       # External service adapters
│   ├── aiScorer.js                 # AI scoring interface
│   ├── geminiScorer.js             # Google Gemini implementation
│   ├── emailAdapter.js             # Email service interface
│   ├── llmAdapter.js               # LLM interface
│   └── storageAdapter.js           # File storage interface
│
├── db/                             # Database
│   └── index.js                    # MongoDB connection
│
├── email/                          # Email utilities
│   ├── email.config.js             # Email configuration
│   ├── emails.js                   # Email sending logic
│   ├── emailTemplates.js           # Email templates
│   └── test-email.js               # Email testing
│
├── errors/                         # Error classes
│   ├── AppError.js                 # Base error
│   ├── ValidationError.js          # Validation errors
│   ├── AuthenticationError.js      # Auth errors
│   ├── AuthorizationError.js       # Authorization errors
│   ├── NotFoundError.js            # 404 errors
│   ├── ConflictError.js            # Conflict errors
│   ├── RateLimitError.js           # Rate limit errors
│   ├── InternalServerError.js      # 500 errors
│   ├── errorCodes.js               # Error code constants
│   └── index.js                    # Error exports
│
├── validation/                     # Request validation
│   ├── schemas.js                  # Joi schemas
│   ├── customRules.js              # Custom validation rules
│   └── index.js                    # Validation exports
│
├── utils/                          # Utility functions
│   ├── logger.js                   # Winston logger
│   ├── tokenUtils.js               # JWT utilities
│   ├── ApiResponse.js              # API response formatting
│   ├── ApiError.js                 # API error handling
│   ├── asyncHandler.js             # Async error wrapper
│   ├── validator.js                # Validation utilities
│   ├── passwordValidator.js        # Password validation
│   ├── otpGenerator.js             # OTP generation
│   ├── emailTemplates.js           # Email template helpers
│   ├── fileValidation.js           # File validation
│   ├── sanitizers.js               # Input sanitization
│   └── ...other utilities
│
└── queues/                         # Background job queues
    └── parseQueue.js               # BullMQ job queue
```

---

## ⚙️ Configuration
<a name="configuration"></a>

### Environment Variables Explanation

#### Server Configuration
- `PORT`: Server listening port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)
- `LOG_LEVEL`: Logging verbosity (debug/info/warn/error)

#### Database
- `MONGODB_URI`: MongoDB connection string

#### Authentication
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRE`: JWT token expiration time
- `REFRESH_TOKEN_EXPIRE`: Refresh token expiration

#### AI/Scoring
- `GEMINI_API_KEY`: Google Gemini API key for proposal parsing
- `SCORE_WEIGHTS_*`: Weights for scoring algorithm

#### Email
- `GMAIL_APP_PASSWORD`: 16-char password from Google
- `EMAIL_INBOUND_SECRET`: Secret for email webhook validation

### Scoring Algorithm

The BidSense scoring system evaluates proposals across four dimensions:

```
Total Score = (Price × Weight) + (Delivery × Weight) + (Warranty × Weight) + (Completeness × Weight)
```

**Default Weights** (configurable via admin panel):
- Price: 50% - Cost competitiveness
- Delivery: 20% - Timeline feasibility  
- Warranty: 10% - Coverage adequacy
- Completeness: 20% - Response quality

Each dimension is scored 0-100 based on AI analysis of vendor responses.
3. **Configure `.env`**:
   ```env
   EMAIL_SERVICE=gmail
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
   ```

#### Receiving Emails (Inbound Processing)

The system supports multiple email matching methods:

1. **Reply Token**: Vendors reply to `rfp+{token}@yourdomain.com`
2. **Explicit RFP ID**: Include `rfp_id` in the webhook payload
3. **Vendor Email Match**: System matches vendor email to sent RFPs
4. **Subject Match**: AI analyzes subject line for RFP keywords
5. **AI Match**: Gemini AI matches email content to open RFPs
6. **Fallback**: Matches to most recent active RFP

Configure an email webhook (e.g., SendGrid, Mailgun) to POST to:
```
POST /api/emails/inbound
```

### How to Run Everything Locally

```bash
# Terminal 1: Start MongoDB (if local)
mongod

# Terminal 2: Start Redis (optional, for queues)
redis-server

# Terminal 3: Start Backend Server
cd server
npm run dev
# Server runs on http://localhost:3000

# Terminal 4: Start Frontend Dev Server
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

### Seed Data / Initial Scripts

```bash
# Check database status
cd server
node scripts/database-status.js

# Clean database (remove all data)
node scripts/complete-database-cleanup.js

# Run migrations
npm run migrate
```

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI Framework |
| Vite | 7.2.5 (rolldown) | Build Tool |
| Zustand | 5.0.9 | State Management |
| React Router DOM | 7.10.0 | Client-side Routing |
| Tailwind CSS | 4.1.17 | Styling |
| Lucide React | 0.555.0 | Icons |
| Recharts | 3.5.1 | Data Visualization |
| Axios | 1.13.2 | HTTP Client |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime |
| Express | 4.18.2 | Web Framework |
| Mongoose | 7.5.0 | MongoDB ODM |
| BullMQ | 4.10.0 | Job Queues |
| Nodemailer | 7.0.11 | Email Sending |
| Multer | 1.4.5 | File Upload |
| UUID | 13.0.0 | ID Generation |

### Database
| Technology | Purpose |
|------------|---------|
| MongoDB | Primary Database |
| Redis | Queue Storage (optional) |

### AI Provider
| Technology | Model | Purpose |
|------------|-------|---------|
| Google Gemini | gemini-2.0-flash | RFP Parsing, Proposal Parsing, Email Matching, Proposal Scoring |

### Email Solution
| Provider | Purpose |
|----------|---------|
| Gmail (Nodemailer) | Outbound email sending |
| Webhook Integration | Inbound email processing (SendGrid/Mailgun compatible) |

---

## � API Documentation
<a name="api-documentation"></a>
```
http://localhost:3000/api
```

### RFP Endpoints

#### Parse RFP Text
```http
POST /api/rfp/parse
```

**Request Body:**
```json
{
  "message": "We need 10 managed switches and 5 routers for our office. Budget is $15,000. Need delivery within 2 weeks."
}
```

**Success Response (200):**
```json
{
  "ok": true,
  "parsed_rfp": {
    "title": "Office Network Equipment",
    "summary": "Request for managed switches and routers",
    "budget": 15000,
    "currency": "USD",
    "delivery_days": 14,
    "line_items": [
      { "name": "managed switches", "quantity": 10 },
      { "name": "routers", "quantity": 5 }
    ]
  },
  "parse_confidence": 0.85,
  "warnings": []
}
```

**Error Response (400):**
```json
{
  "ok": false,
  "error": "message is required and must be a non-empty string"
}
```

---

#### Save RFP
```http
POST /api/rfps
```

**Request Body:**
```json
{
  "parsed_rfp": {
    "title": "Office Network Equipment",
    "budget": 15000,
    "currency": "USD",
    "delivery_days": 14,
    "line_items": [...]
  },
  "raw_text": "Original message text..."
}
```

**Success Response (201):**
```json
{
  "ok": true,
  "_id": "507f1f77bcf86cd799439011",
  "rfp_id": "507f1f77bcf86cd799439011",
  "reply_to_token": "abc123def456",
  "status": "draft"
}
```

---

#### List RFPs
```http
GET /api/rfps?status=draft&limit=10&skip=0
```

**Success Response (200):**
```json
{
  "ok": true,
  "count": 5,
  "rfps": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Office Network Equipment",
      "status": "draft",
      "budget": 15000,
      "created_at": "2025-12-06T10:00:00Z"
    }
  ]
}
```

---

#### Get Single RFP
```http
GET /api/rfps/:id
```

**Success Response (200):**
```json
{
  "ok": true,
  "rfp": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Office Network Equipment",
    "budget": 15000,
    "line_items": [...],
    "status": "draft"
  }
}
```

**Error Response (404):**
```json
{
  "ok": false,
  "error": "RFP not found"
}
```

---

#### Update RFP
```http
PUT /api/rfps/:id
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "budget": 20000,
  "status": "sent"
}
```

---

#### Send RFP to Vendors
```http
POST /api/rfps/:id/send
```

**Request Body:**
```json
{
  "vendor_ids": ["vendor_id_1", "vendor_id_2"],
  "message": "Optional custom message"
}
```

**Success Response (200):**
```json
{
  "ok": true,
  "sent_count": 2,
  "results": [
    { "vendor_id": "...", "status": "sent" },
    { "vendor_id": "...", "status": "sent" }
  ]
}
```

---

### Vendor Endpoints

#### List Vendors
```http
GET /api/vendors?active=true
```

**Query Parameters:**
- `active`: `true` (default) | `false` | `all`

**Success Response (200):**
```json
{
  "ok": true,
  "count": 10,
  "vendors": [
    {
      "_id": "...",
      "name": "Acme Corp",
      "contact_email": "sales@acme.com",
      "contact_person": "John Doe",
      "rating": 4.5,
      "active": true
    }
  ]
}
```

---

#### Create Vendor
```http
POST /api/vendors
```

**Request Body:**
```json
{
  "name": "Acme Corp",
  "contact_email": "sales@acme.com",
  "contact_person": "John Doe",
  "phone": "+1-555-0123",
  "address": "123 Main St",
  "notes": "Preferred vendor for IT equipment"
}
```

**Error Response (409):**
```json
{
  "ok": false,
  "message": "Vendor with email sales@acme.com already exists"
}
```

---

#### Update Vendor
```http
PUT /api/vendors/:id
```

#### Delete Vendor
```http
DELETE /api/vendors/:id
```

---

### Email Inbound Endpoint

#### Process Vendor Email Response
```http
POST /api/emails/inbound
```

**Request Body:**
```json
{
  "from": "vendor@company.com",
  "subject": "RE: RFP for Office Equipment",
  "body": "We are pleased to submit our proposal...\n\nTotal Price: $12,500\nDelivery: 10 days\nWarranty: 24 months",
  "rfp_id": "507f1f77bcf86cd799439011",
  "attachments": [
    {
      "filename": "proposal.pdf",
      "content_type": "application/pdf",
      "content": "base64-encoded-content..."
    }
  ]
}
```

**Success Response (200):**
```json
{
  "ok": true,
  "proposal_id": "...",
  "rfp_id": "...",
  "mapping_method": "ai-match",
  "parsed_proposal": {
    "vendor_name": "Company Inc",
    "total_price": 12500,
    "currency": "USD",
    "delivery_days": 10,
    "warranty_months": 24
  },
  "score": {
    "final_score": 78,
    "breakdown": {
      "price": 85,
      "delivery": 70,
      "warranty": 80,
      "completeness": 75
    }
  }
}
```

---

### Comparison Endpoint

#### Compare Proposals for RFP
```http
GET /api/rfps/:id/compare
```

**Success Response (200):**
```json
{
  "ok": true,
  "rfp_id": "...",
  "rfp_title": "Office Network Equipment",
  "rfp_budget": 15000,
  "proposals": [
    {
      "proposal_id": "...",
      "vendor_name": "Acme Corp",
      "total_price": 12500,
      "delivery_days": 10,
      "warranty_months": 24,
      "final_score": 85,
      "score_breakdown": {
        "price_score": 90,
        "delivery_score": 80,
        "warranty_score": 85,
        "completeness_score": 75
      },
      "reasoning": "Best price-to-value ratio..."
    }
  ],
  "recommendation": {
    "vendor_name": "Acme Corp",
    "reasoning": "Highest overall score with competitive pricing"
  }
}
```

---

### Health Check Endpoints

```http
GET /api/health/extended    # Full system health
GET /api/health/ready       # Readiness probe
GET /api/health/live        # Liveness probe
```

---

## 🎯 Decisions & Assumptions

### Key Design Decisions

#### 1. Data Models

**RFP Model:**
- Stores parsed RFP data with line items as embedded documents
- Uses `reply_to_token` for email tracking (12-char UUID)
- Tracks `sent_to_vendors` array for matching inbound responses
- Status workflow: `draft` → `sent` → `active` → `closed`

**Proposal Model:**
- Links to RFP via `rfp_id` (nullable for unmatched proposals)
- Stores both raw email and parsed JSON
- `mapping_method` enum tracks how proposal was matched to RFP
- `unmapped` flag for proposals that couldn't be linked

**Vendor Model:**
- Simple contact management with email uniqueness
- `active` flag for soft delete
- `rating` (0-5) for vendor quality tracking

#### 2. AI Integration Flow

```
User Input → Gemini AI Parse → Validation → Store RFP
                    ↓
Vendor Email → Multiple Match Methods → Gemini AI Parse → Score → Store Proposal
```

#### 3. Email Matching Strategy (Priority Order)

1. **Explicit RFP ID** - Most reliable when provided
2. **Reply Token** - Standard reply-to pattern
3. **Vendor Email Match** - Match by sender to sent RFPs
4. **Subject Match** - Keywords in subject line
5. **AI Match** - Gemini analyzes content vs open RFPs
6. **Fallback** - Most recent active RFP

#### 4. Scoring Algorithm

Weighted scoring system (configurable via `.env`):
- **Price Score (50%)**: Lower price relative to budget = higher score
- **Delivery Score (20%)**: Faster delivery = higher score
- **Warranty Score (10%)**: Longer warranty = higher score
- **Completeness Score (20%)**: All fields present = higher score

#### 5. State Management (Frontend)

- **Zustand** for global state with localStorage persistence
- Separate stores for: RFPs, Vendors, Notifications
- Optimistic UI updates with error rollback

### Assumptions Made

#### Email Processing
- Inbound emails arrive via webhook (SendGrid/Mailgun format)
- Attachments are base64 encoded
- PDF/image attachments processed via Gemini Vision API
- One proposal per email (no batched responses)

#### RFP Format
- Natural language input (not structured forms)
- Currency symbols detected: $, ₹, €, £
- Time expressions: "within X days/weeks/months"
- Indian number system supported: lakhs, crores

#### Vendor Responses
- Vendors respond with pricing, delivery, warranty info
- May include attachments with detailed quotes
- Email subject may reference original RFP title

#### System Limitations
- No real-time updates (polling-based)
- Single-tenant architecture (no multi-org support)
- English language only for AI parsing
- Maximum 16KB JSON payload per request

---

## 🤖 AI Tools Usage

### Tools Used During Development

| Tool | Primary Use |
|------|-------------|
| **GitHub Copilot** | Code completion, boilerplate generation |
| **Claude (Anthropic)** | Architecture decisions, debugging complex issues, code review |
| **Cursor IDE** | AI-assisted editing, multi-file refactoring |

### What AI Helped With

#### 1. **Boilerplate & Setup**
- Express server scaffolding
- Mongoose schema definitions
- React component structure
- Tailwind CSS configurations

#### 2. **Complex Logic**
- Email matching algorithm (6-method cascade)
- AI prompt engineering for RFP/Proposal parsing
- Scoring algorithm implementation
- Currency detection (INR lakhs/crores support)

#### 3. **Debugging**
- ES Modules compatibility issues
- MongoDB connection handling
- CORS configuration
- Email authentication setup

#### 4. **Design Decisions**
- State management architecture (Zustand vs Redux)
- API response format standardization
- Error handling patterns
- Database schema normalization

#### 5. **Code Quality**
- TypeScript-style JSDoc comments
- Consistent error response format
- API documentation generation
- Code refactoring suggestions

#### 6. **UI/UX Improvements**
- Styled confirmation dialogs (replacing browser defaults)
- Star rating display logic
- Form validation feedback
- Loading state handling

### AI Prompt Examples Used

**For RFP Parsing:**
```
"You are an expert RFP parser. Extract structured data including 
line_items, budget, delivery timeline, and warranty requirements..."
```

**For Email Matching:**
```
"Match this vendor email to the correct RFP from this list. 
Consider subject keywords, product mentions, and pricing context..."
```

**For Proposal Scoring:**
```
"Evaluate this proposal against the RFP requirements. 
Score on price, delivery, warranty, and completeness (0-100)..."
```

---

## 📁 Project Structure

```
RequestsforProposal/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── layout/            # Layout components
│   │   ├── pages/             # Page components
│   │   ├── store/             # Zustand stores
│   │   └── App.jsx            # Main app component
│   └── package.json
│
├── server/                    # Express Backend
│   ├── src/
│   │   ├── adapters/          # AI & Email adapters
│   │   ├── controllers/       # Route handlers
│   │   ├── db/                # Database connection
│   │   ├── email/             # Email configuration
│   │   ├── middlewares/       # Express middlewares
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API routes
│   │   └── utils/             # Utility functions
│   ├── scripts/               # Database scripts
│   └── package.json
│
└── README.md                  # This file
```

---

## � Support & Contact

For issues, questions, or suggestions:
1. Check existing [GitHub Issues](https://github.com/your-repo/issues)
2. Create a new issue with detailed description
3. Contact development team at support@rfpbidsense.com

---

## 📚 Additional Resources

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Nodemailer Documentation](https://nodemailer.com/)
- [JWT.io](https://jwt.io/)

---

## 📄 License

MIT License - See LICENSE file for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 🙏 Acknowledgments

- Google for Gemini AI capabilities
- Express.js and Node.js communities
- React community and hooks innovations
- MongoDB for flexible database schema

---

**Last Updated**: January 7, 2026  
**Version**: 1.0.0  
**Status**: Active Development

**Built with ❤️ by the RFP BidSense Team**
