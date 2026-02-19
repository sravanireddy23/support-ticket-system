# 🚀 Support Ticket System

A full‑stack Support Ticket System built with Django, React, PostgreSQL, and LLM integration.

This project was developed as a Tech Intern assessment to demonstrate backend architecture, frontend development, database aggregation, AI integration, and Dockerized deployment.

---

## 📌 Project Overview

The Support Ticket System allows users to:

- Submit support tickets
- Automatically classify tickets using an LLM
- Override AI-generated suggestions
- Filter and search tickets
- View real-time aggregated statistics
- Run the entire stack using Docker with a single command

---

## 🏗️ Tech Stack

### Backend
- Django
- Django REST Framework
- PostgreSQL
- Django ORM Aggregations

### Frontend
- React (Vite)
- Fetch API

### AI Integration
- External LLM API (OpenAI / Anthropic / Google etc.)
- API key configured via environment variable

### Infrastructure
- Docker
- Docker Compose

---

# 🧠 LLM Integration (Core Feature)

When a user enters a ticket description:

1. The frontend calls:
POST /api/tickets/classify/


2. The backend sends the description to an LLM with a structured prompt.

3. The LLM responds with:
```json
{
  "suggested_category": "technical",
  "suggested_priority": "high"
}
The frontend pre-fills the category and priority dropdowns.

The user can accept or override the suggestions before submitting.

✔ Implementation Details
API key is configurable via environment variable

LLM failures are handled gracefully

Ticket submission works even if classification fails

Structured JSON parsing ensures reliable output

Prompt design included in backend code

🗂️ Database Model
Ticket Model
Field	Type	Constraints
title	CharField	max_length=200, required
description	TextField	required
category	CharField	billing, technical, account, general
priority	CharField	low, medium, high, critical
status	CharField	open, in_progress, resolved, closed (default=open)
created_at	DateTimeField	auto-set on creation
All constraints are enforced at the database level.

🔌 API Endpoints
1️⃣ Create Ticket
POST /api/tickets/
Returns 201 Created

2️⃣ List Tickets
GET /api/tickets/
Supports filtering:

?category=
?priority=
?status=
?search=
Filters can be combined.

3️⃣ Update Ticket
PATCH /api/tickets/{id}/
Used to:

Change ticket status

Override category

Override priority

4️⃣ Ticket Statistics
GET /api/tickets/stats/
Example response:

{
  "total_tickets": 124,
  "open_tickets": 67,
  "avg_tickets_per_day": 8.3,
  "priority_breakdown": {
    "low": 30,
    "medium": 52,
    "high": 31,
    "critical": 11
  },
  "category_breakdown": {
    "billing": 28,
    "technical": 55,
    "account": 22,
    "general": 19
  }
}
✅ Important
Implemented using Django ORM aggregate() and annotate()

No Python-level loops

Database-level aggregation (key evaluation criterion)

💻 Frontend Features
✅ Submit Ticket
Title input (required, max 200 characters)

Description textarea (required)

Auto-filled category & priority via LLM

Editable dropdowns

Loading state during classification

Form resets on success

No full page reload

✅ Ticket List
Displays tickets newest first

Truncated description preview

Filter by category, priority, and status

Search by title and description

Update ticket status inline

✅ Stats Dashboard
Total tickets

Open tickets

Average tickets per day

Category breakdown

Priority breakdown

Auto-refresh after ticket submission

🐳 Docker Setup
The entire application runs with a single command:

docker-compose up --build
Services Included
PostgreSQL Database

Django Backend (auto-runs migrations on startup)

React Frontend

🔐 Environment Variables
Add your LLM API key inside docker-compose.yml:

environment:
  - LLM_API_KEY=your_api_key_here
⚠️ The API key is not hardcoded in the repository.

▶️ Local Setup Instructions
1️⃣ Clone the repository
git clone https://github.com/your-username/support-ticket-system.git
cd support-ticket-system
2️⃣ Add your LLM API key
Edit docker-compose.yml and insert:

LLM_API_KEY=your_api_key_here
3️⃣ Run the project
docker-compose up --build
🌐 Application URLs
Frontend:

http://localhost:3000
Backend API:

http://localhost:8000/api/
📊 Evaluation Highlights
✔ Clean REST API design
✔ Proper database-level aggregation
✔ Functional LLM-powered classification
✔ Dockerized full-stack architecture
✔ Error handling for AI failures
✔ Filtering and search capabilities
✔ Production-style project structure

👩‍💻 Author
Sravani Reddy



---

This version is:

- Clean
- Professional
- Structured
- Recruiter-friendly
- GitHub polished
- Assessment-aligned

If you want, I can now give you a **slightly more impressive "production-grade" version** that stand
