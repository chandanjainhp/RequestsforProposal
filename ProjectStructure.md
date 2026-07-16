# 6. Project Structure

## 6.1 Overview

BidSense follows a modular, layered architecture designed for long-term maintainability and scalability.

The codebase is divided into two independent applications:

* Frontend (React)
* Backend (Express)

Each application can be developed, tested, deployed, and scaled independently.

---

# 6.2 Repository Structure

```text
BidSense/
│
├── frontend/
├── backend/
├── docs/
├── docker/
├── scripts/
├── .github/
├── LICENSE
├── README.md
└── docker-compose.yml
```

---

# 6.3 Frontend Structure

```text
frontend/
│
├── public/
├── src/
│
├── assets/
├── components/
├── layouts/
├── pages/
├── routes/
├── hooks/
├── context/
├── services/
├── api/
├── utils/
├── schemas/
├── constants/
├── store/
├── styles/
├── types/
└── main.jsx
```

---

## Frontend Folder Responsibilities

### assets/

Stores:

* Images
* Icons
* Fonts
* Static files

---

### components/

Reusable UI components.

Examples:

* Button
* Modal
* Card
* Table
* Input
* Sidebar
* Navbar

---

### layouts/

Application layouts.

Examples:

* Dashboard Layout
* Authentication Layout
* Public Layout

---

### pages/

Application pages.

Examples:

* Dashboard
* Vendors
* RFPs
* Proposals
* Chat
* Settings

---

### api/

Axios configuration.

Responsibilities:

* API client
* Interceptors
* Authentication headers

---

### services/

Business API wrappers.

Example:

```text
auth.service.js

vendor.service.js

proposal.service.js
```

---

### schemas/

Frontend Zod validation.

---

### hooks/

Custom React Hooks.

Examples:

* useAuth()
* useDebounce()
* usePagination()

---

### context/

Global Context Providers.

Examples:

* Theme
* Authentication
* Notifications

---

### store/

Client-side global state.

---

# 6.4 Backend Structure

```text
backend/
│
├── src/
│
├── config/
├── db/
├── routes/
├── controllers/
├── services/
├── repositories/
├── providers/
├── middlewares/
├── validators/
├── ai/
├── prompts/
├── templates/
├── uploads/
├── utils/
├── docs/
└── server.js
```

---

# 6.5 Backend Layer Responsibilities

## config/

Centralized application configuration.

Contains:

* Environment
* Database
* Redis
* Logger
* AI configuration
* Mail configuration

---

## db/

Database layer.

Contains:

* Drizzle configuration
* Database schema
* Relations
* Migrations
* Seed scripts

---

## routes/

Express route definitions.

Responsibilities:

* API endpoints
* Route grouping
* Middleware assignment

---

## controllers/

HTTP layer.

Responsibilities:

* Read request
* Call services
* Return responses

Controllers must not contain business logic.

---

## services/

Business logic.

Responsibilities:

* Procurement logic
* Authentication
* AI orchestration
* Payments
* Notifications

Services coordinate repositories and providers.

---

## repositories/

Database abstraction.

Responsibilities:

* Drizzle queries
* Transactions
* CRUD operations

Repositories never contain business rules.

---

## providers/

External integrations.

Examples:

* Gemini
* Sarvam AI
* Razorpay
* Cloudinary
* Nodemailer

Providers isolate third-party SDKs from business logic.

---

## middlewares/

Reusable Express middleware.

Examples:

* Authentication
* Authorization
* Validation
* Error handling
* Rate limiting
* Request logging

---

## validators/

Request validation using Zod.

Responsibilities:

* Body validation
* Query validation
* Parameter validation

---

## ai/

AI infrastructure.

Contains:

* RAG
* Embeddings
* Retrieval
* Prompt Builder
* Document Parser
* Chunking
* Memory
* AI pipelines

---

## prompts/

Version-controlled prompt templates.

Organized by domain:

* RFP
* Proposal
* Vendor
* Chat
* Compliance

---

## templates/

Email templates.

Examples:

* OTP
* Invoice
* Payment Success
* Invitation

---

## uploads/

Temporary local file storage.

Folders:

* avatars/
* proposals/
* rfps/
* invoices/
* temp/

---

## utils/

Reusable helper functions.

Examples:

* JWT
* Password hashing
* Pagination
* Date formatting
* Constants

---

## docs/

API documentation.

Contains:

* Swagger
* OpenAPI Specification

---

# 6.6 Layer Communication

Every request follows the same flow.

```text
Client

↓

Routes

↓

Middleware

↓

Controller

↓

Service

↓

Repository

↓

Drizzle ORM

↓

PostgreSQL
```

External systems are accessed through providers.

```text
Service

↓

Provider

↓

Gemini

Sarvam

Razorpay

Cloudinary

SMTP
```

---

# 6.7 AI Architecture

```text
User

↓

AI Controller

↓

AI Service

↓

RAG Pipeline

↓

Retriever

↓

Qdrant

↓

Prompt Builder

↓

Gemini

↓

Response
```

---

# 6.8 Payment Architecture

```text
Client

↓

Payment Controller

↓

Payment Service

↓

Razorpay Provider

↓

Webhook

↓

Repository

↓

Database
```

---

# 6.9 File Processing Pipeline

```text
Upload

↓

Validation

↓

Storage

↓

Parser

↓

Chunking

↓

Embeddings

↓

Qdrant

↓

Metadata

↓

PostgreSQL
```

---

# 6.10 Design Principles

The project structure follows these principles:

* Modular architecture
* Feature isolation
* Single Responsibility Principle
* Clean Architecture
* Repository Pattern
* Service Layer Pattern
* Provider Pattern
* Dependency inversion
* Low coupling
* High cohesion

---

# 6.11 Summary

The BidSense project structure separates application concerns into independent layers with clearly defined responsibilities. Controllers manage HTTP interactions, services implement business rules, repositories encapsulate database access through Drizzle ORM, and providers isolate external services such as AI models, payment gateways, email, and storage. This organization enables easier testing, maintenance, and future expansion while keeping the codebase consistent and scalable.
a