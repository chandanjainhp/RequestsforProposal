# RFP Management System

A full-stack AI-powered Request for Proposal (RFP) management system that streamlines the procurement process - from creating RFPs, sending them to vendors, receiving proposals via email, parsing responses with AI, and comparing vendor proposals with intelligent scoring.

![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![React](https://img.shields.io/badge/React-19-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-7.5-green)
![Gemini AI](https://img.shields.io/badge/AI-Gemini%202.0-orange)

---

## 📋 Table of Contents

1. [Project Setup](#project-setup)
2. [Tech Stack](#tech-stack)
3. [API Documentation](#api-documentation)
4. [Decisions & Assumptions](#decisions--assumptions)
5. [AI Tools Usage](#ai-tools-usage)

---

## 🚀 Project Setup
<a name="project-setup"></a>

### Prerequisites

- **Node.js**: v18.0.0 or higher (tested on v24.11.1)
- **MongoDB**: v6.0+ (local or Atlas cloud)
- **Redis**: v7.0+ (optional, for background job queues)
- **API Keys**:
  - Google Gemini API Key (for AI parsing/scoring)
  - Gmail App Password (for email sending - optional)

### Install Steps

#### 1. Clone & Install Dependencies

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

Create a `.env` file in the `server/` directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/rfp_prototype
REDIS_URL=redis://127.0.0.1:6379

# App Configuration
UPLOAD_DIR=./uploads
EMAIL_INBOUND_SECRET=your-secret-key
LOG_LEVEL=debug

# AI/LLM Configuration (Google Gemini)
GEMINI_API_KEY=your-gemini-api-key
GEMINI_ENDPOINT=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
GEMINI_MODEL=gemini-2.0-flash

# Email Service Configuration
EMAIL_SERVICE=gmail
SENDER_EMAIL=your-email@gmail.com
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password

# Scoring Weights (must sum to 1.0)
SCORE_WEIGHTS_PRICE=0.5
SCORE_WEIGHTS_DELIVERY=0.2
SCORE_WEIGHTS_WARRANTY=0.1
SCORE_WEIGHTS_COMPLETENESS=0.2
```

#### 3. Frontend Configuration

Create a `.env` file in the `client/` directory (optional):

```env
VITE_API_URL=http://localhost:3000
```

### How to Configure Email Sending/Receiving

#### Sending Emails (Gmail)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and your device
   - Copy the 16-character password
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

## 📚 API Documentation

### Base URL
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

**Built with ❤️ using AI-assisted development**
