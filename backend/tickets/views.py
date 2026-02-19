from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Avg
from django.db.models.functions import TruncDate
from django.conf import settings
from .models import Ticket
from .serializers import TicketSerializer

import os
import json
from groq import Groq




# List + Create Tickets
class TicketListCreateView(generics.ListCreateAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    filterset_fields = ["category", "priority", "status"]
    search_fields = ["title", "description"]


# Update Ticket
class TicketUpdateView(generics.UpdateAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer


# Stats Endpoint (DB-level aggregation)
class TicketStatsView(APIView):
    def get(self, request):

        total = Ticket.objects.count()
        open_count = Ticket.objects.filter(status="open").count()

        avg_per_day = (
            Ticket.objects
            .annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(count=Count("id"))
            .aggregate(avg=Avg("count"))
        )["avg"] or 0

        priority_breakdown = dict(
            Ticket.objects.values("priority")
            .annotate(count=Count("id"))
            .values_list("priority", "count")
        )

        category_breakdown = dict(
            Ticket.objects.values("category")
            .annotate(count=Count("id"))
            .values_list("category", "count")
        )

        return Response({
            "total_tickets": total,
            "open_tickets": open_count,
            "avg_tickets_per_day": round(avg_per_day, 2),
            "priority_breakdown": priority_breakdown,
            "category_breakdown": category_breakdown,
        })


# Classify Endpoint (LLM placeholder for now)

class TicketClassifyView(APIView):
    def post(self, request):
        description = request.data.get("description")

        if not description:
            return Response(
                {"error": "Description is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            client = Groq(api_key=os.getenv("GROQ_API_KEY"))

            prompt = f"""
You are a support ticket classification assistant.

Allowed categories:
billing, technical, account, general

Allowed priorities:
low, medium, high, critical

Return ONLY valid JSON.
Do not include explanation.
Example:
{{"category": "billing", "priority": "high"}}

Ticket description:
{description}
"""

            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",   # ✅ updated working Groq model
                messages=[
                    {"role": "user", "content": prompt}
                ],
                temperature=0
            )

            content = response.choices[0].message.content.strip()

            # Extract JSON safely
            start = content.find("{")
            end = content.rfind("}") + 1
            json_string = content[start:end]

            result = json.loads(json_string)

            return Response({
                "suggested_category": result.get("category"),
                "suggested_priority": result.get("priority"),
            })

        except Exception as e:
            return Response({"error": str(e)}, status=500)
