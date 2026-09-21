from django.contrib import admin
from .models import Doctor, PreVisit, PostVisit, Report

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "specialization", "phone", "city", "active")
    search_fields = ("name", "specialization", "phone", "city")
    list_filter = ("specialization", "city", "active")

@admin.register(PreVisit)
class PreVisitAdmin(admin.ModelAdmin):
    list_display = ("id", "doctor", "product", "campaign", "created_at")

@admin.register(PostVisit)
class PostVisitAdmin(admin.ModelAdmin):
    list_display = ("id", "doctor", "product", "outcome", "next_visit_date", "created_at")
    list_filter = ("outcome",)

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ("id", "reporting_type", "report_date", "send_to", "submitted_at")
