from rest_framework import serializers

from .models import (
    Doctor,
    PreVisit,
    PostVisit,
    Report,
)


# ============================================================
# DOCTOR
# ============================================================

class DoctorSerializer(serializers.ModelSerializer):
    """
    Serializer used by:

        GET /api/doctors/

    Extra fields are provided for the React doctor table.
    """

    sno = serializers.IntegerField(
        source="id",
        read_only=True
    )

    initial = serializers.SerializerMethodField(
        method_name="get_doctor_initial"
    )

    reported = serializers.SerializerMethodField(
        method_name="get_doctor_reported"
    )

    discussed = serializers.SerializerMethodField(
        method_name="get_doctor_discussed"
    )

    product = serializers.SerializerMethodField(
        method_name="get_doctor_product"
    )

    class Meta:
        model = Doctor

        fields = [
            "id",
            "sno",
            "name",
            "specialization",
            "qualification",
            "phone",
            "city",
            "pin",
            "experience",
            "active",
            "initial",
            "product",
            "reported",
            "discussed",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "sno",
            "initial",
            "product",
            "reported",
            "discussed",
            "created_at",
            "updated_at",
        ]

    # ========================================================
    # DOCTOR INITIAL
    # ========================================================

    def get_doctor_initial(self, obj):
        if not obj.name:
            return "D"

        return obj.name.strip()[0].upper()

    # ========================================================
    # REPORTED STATUS
    # ========================================================

    def get_doctor_reported(self, obj):
        """
        A doctor is considered reported when at least
        one Report exists for that doctor.
        """

        return Report.objects.filter(
            doctor=obj
        ).exists()

    # ========================================================
    # DISCUSSED STATUS
    # ========================================================

    def get_doctor_discussed(self, obj):
        """
        A doctor is considered discussed when either
        a PreVisit or PostVisit exists.
        """

        return (
            PreVisit.objects.filter(
                doctor=obj
            ).exists()
            or
            PostVisit.objects.filter(
                doctor=obj
            ).exists()
        )

    # ========================================================
    # PRODUCT
    # ========================================================

    def get_doctor_product(self, obj):
        """
        Show the most recent PostVisit product.

        If there is no PostVisit, show the most recent
        PreVisit product.

        If there are no visits, return an empty string.
        """

        post_visit = (
            PostVisit.objects
            .filter(doctor=obj)
            .order_by("-created_at")
            .first()
        )

        if post_visit:
            return post_visit.product

        pre_visit = (
            PreVisit.objects
            .filter(doctor=obj)
            .order_by("-created_at")
            .first()
        )

        if pre_visit:
            return pre_visit.product

        return ""


# ============================================================
# PRE VISIT
# ============================================================

class PreVisitSerializer(serializers.ModelSerializer):

    class Meta:
        model = PreVisit
        fields = "__all__"


# ============================================================
# POST VISIT
# ============================================================

class PostVisitSerializer(serializers.ModelSerializer):

    class Meta:
        model = PostVisit
        fields = "__all__"


# ============================================================
# REPORT
# ============================================================

class ReportSerializer(serializers.ModelSerializer):

    class Meta:
        model = Report

        # Includes the doctor ForeignKey.
        # Django REST Framework will accept doctor_id
        # when creating a Report.
        fields = "__all__"