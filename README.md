# 🚀 Support Ticket System
**Tech Intern Assessment Submission**

A full-stack Support Ticket System built using **Django, React, PostgreSQL, and LLM integration**.  
This project demonstrates backend architecture, AI integration, database aggregation, and Dockerized deployment.

---

## 📌 Assessment Objective

Build a Support Ticket System from scratch where:

- Users can submit support tickets
- Tickets are automatically categorized and prioritized using an LLM
- Users can override AI suggestions
- Tickets can be filtered and searched
- Aggregated statistics are displayed
- The entire system runs using Docker

---

## 🏗️ Tech Stack

### Backend
- Django
- Django REST Framework
- PostgreSQL
- Django ORM (`aggregate()` & `annotate()`)

### Frontend
- React (Vite)
- Fetch API

### AI Integration
- External LLM API (OpenAI / Anthropic / Google, etc.)
- API key configured via environment variable

### Infrastructure
- Docker
- Docker Compose

---

## 🧠 LLM Integration (Core Feature)

When a user writes a ticket description:

1. Frontend calls:

```
POST /api/tickets/classify/
```

2. Backend sends a structured prompt to the LLM.

3. LLM returns:

```json
{
  "suggested_category": "technical",
  "suggested_priority": "high"
}
```

The frontend pre-fills the category and priority dropdowns.

The user can accept or override before submission.

### Implementation Details

- API key is passed via environment variable (`LLM_API_KEY`)
- Graceful error handling (ticket submission works even if LLM fails)
- Prompt included in backend code
- Structured JSON parsing for reliability

---

## 🗂️ Database Model

### Ticket Model

| Field       | Type           | Constraints |
|------------|---------------|------------|
| title      | CharField     | max_length=200, required |
| description| TextField     | required |
| category   | CharField     | billing, technical, account, general |
| priority   | CharField     | low, medium, high, critical |
| status     | CharField     | open, in_progress, resolved, closed (default=open) |
| created_at | DateTimeField | auto-set on creation |

All constraints are enforced at the database level.

---

## 🔌 API Endpoints

### Create Ticket
```
POST /api/tickets/
```
Returns `201 Created`

### List Tickets
```
GET /api/tickets/
```

Supports filters:

```
?category=
?priority=
?status=
?search=
```

Filters can be combined.

### Update Ticket
```
PATCH /api/tickets/{id}/
```

Allows:
- Changing ticket status
- Overriding category
- Overriding priority

### Ticket Statistics
```
GET /api/tickets/stats/
```

Example Response:

```json
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
```

**Important:**
- Implemented using Django ORM `aggregate()` and `annotate()`
- No Python-level loops
- Uses database-level aggregation

---

## 💻 Frontend Features

### Submit Ticket
- Title input (required, max 200 characters)
- Description textarea (required)
- Auto-filled category & priority via LLM
- Editable dropdowns
- Loading state during classification
- Form clears on success
- No full page reload

### Ticket List
- Displays tickets newest first
- Truncated description preview
- Filter by category, priority, and status
- Search by title and description
- Update ticket status inline

### Stats Dashboard
- Total tickets
- Open tickets
- Average tickets per day
- Category breakdown
- Priority breakdown
- Auto-refresh after ticket submission

---

## 🐳 Docker Setup

Run the entire application using:

```bash
docker-compose up --build
```

### Services
- PostgreSQL database
- Django backend (auto-runs migrations on startup)
- React frontend

---

## 🔐 Environment Variables

Add your LLM API key inside `docker-compose.yml`:

```yaml
environment:
  - LLM_API_KEY=your_api_key_here
```

The API key is not hardcoded in the repository.

---

## ▶️ How to Run

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/support-ticket-system.git
cd support-ticket-system
```

### 2️⃣ Add your LLM API key

Edit `docker-compose.yml` and add:

```
LLM_API_KEY=your_api_key_here
```

### 3️⃣ Start the application

```bash
docker-compose up --build
```

---

## 🌐 Application URLs

Frontend:
```
http://localhost:3000
```

Backend API:
```
http://localhost:8000/api/
```

---

## 📊 Key Highlights

- Clean REST API design
- Proper database-level aggregation
- AI-powered classification
- Fully Dockerized architecture
- Error handling for LLM failures
- Search and filtering support
- Assessment-compliant implementation

---

## 👩‍💻 Author

**Sravani Reddy Gavinolla**
