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
- External LLM API (OpenAI / Anthropic / Google etc.)
- API key configured via environment variable

### Infrastructure
- Docker
- Docker Compose

---

## 🧠 LLM Integration (Core Feature)

When a user writes a ticket description:

1. Frontend calls:

POST /api/tickets/classify/

2. Backend sends a structured prompt to the LLM.

3. LLM returns:


```json
{
  "suggested_category": "technical",
  "suggested_priority": "high"
}
The frontend pre-fills the category and priority dropdowns.

The user can accept or override before submission.

Implementation Details
API key is passed via environment variable (LLM_API_KEY)

Graceful error handling (ticket submission works even if LLM fails)

Prompt included in backend code

Structured JSON parsing for reliability

🗂️ Database Model
Ticket Model
| Field       | Type          | Constraints                                        |
| ----------- | ------------- | -------------------------------------------------- |
| title       | CharField     | max_length=200, required                           |
| description | TextField     | required                                           |
| category    | CharField     | billing, technical, account, general               |
| priority    | CharField     | low, medium, high, critical                        |
| status      | CharField     | open, in_progress, resolved, closed (default=open) |
| created_at  | DateTimeField | auto-set on creation                               |
All constraints are enforced at the database level.