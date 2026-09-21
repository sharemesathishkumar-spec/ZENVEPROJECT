from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    Doctor,
    PreVisit,
    PostVisit,
    Report,
)

from .serializers import (
    DoctorSerializer,
    PreVisitSerializer,
    PostVisitSerializer,
    ReportSerializer,
)


# ============================================================
# DOCTORS
# ============================================================

class DoctorViewSet(viewsets.ModelViewSet):

    queryset = (
        Doctor.objects
        .prefetch_related(
            "pre_visits",
            "post_visits",
            "reports",
        )
        .order_by("id")
    )

    serializer_class = DoctorSerializer


# ============================================================
# PRE VISITS
# ============================================================

class PreVisitViewSet(viewsets.ModelViewSet):

    queryset = (
        PreVisit.objects
        .select_related("doctor")
        .all()
    )

    serializer_class = PreVisitSerializer


# ============================================================
# POST VISITS
# ============================================================

class PostVisitViewSet(viewsets.ModelViewSet):

    queryset = (
        PostVisit.objects
        .select_related("doctor")
        .all()
    )

    serializer_class = PostVisitSerializer


# ============================================================
# REPORTS
# ============================================================

class ReportViewSet(viewsets.ModelViewSet):

    queryset = (
        Report.objects
        .select_related("doctor")
        .all()
    )

    serializer_class = ReportSerializer


# ============================================================
# CREATE PRE VISIT
# ============================================================

class PreVisitCreateView(APIView):

    def post(self, request):

        data = request.data.copy()

        doctor_id = (
            data.get("doctor_id")
            or data.get("doctor")
        )

        if not doctor_id:
            return Response(
                {
                    "detail": "doctor_id is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            doctor = Doctor.objects.get(
                id=doctor_id,
                active=True,
            )

        except Doctor.DoesNotExist:
            return Response(
                {
                    "detail": "Doctor not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        data["doctor"] = doctor.id

        serializer = PreVisitSerializer(
            data=data
        )

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        visit = serializer.save()

        return Response(
            PreVisitSerializer(visit).data,
            status=status.HTTP_201_CREATED,
        )


# ============================================================
# CREATE POST VISIT
# ============================================================

class PostVisitCreateView(APIView):

    def post(self, request):

        data = request.data.copy()

        doctor_id = (
            data.get("doctor_id")
            or data.get("doctor")
        )

        if not doctor_id:
            return Response(
                {
                    "detail": "doctor_id is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            doctor = Doctor.objects.get(
                id=doctor_id,
                active=True,
            )

        except Doctor.DoesNotExist:
            return Response(
                {
                    "detail": "Doctor not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        data["doctor"] = doctor.id

        serializer = PostVisitSerializer(
            data=data
        )

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        visit = serializer.save()

        return Response(
            PostVisitSerializer(visit).data,
            status=status.HTTP_201_CREATED,
        )


# ============================================================
# CREATE REPORT
# ============================================================

class ReportCreateView(APIView):

    def post(self, request):

        data = request.data.copy()

        doctor_id = (
            data.get("doctor_id")
            or data.get("doctor")
        )

        # ----------------------------------------------------
        # DOCTOR REQUIRED
        # ----------------------------------------------------

        if not doctor_id:
            return Response(
                {
                    "detail": "doctor_id is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ----------------------------------------------------
        # CHECK DOCTOR
        # ----------------------------------------------------

        try:
            doctor = Doctor.objects.get(
                id=doctor_id,
                active=True,
            )

        except Doctor.DoesNotExist:
            return Response(
                {
                    "detail": "Doctor not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # ----------------------------------------------------
        # ATTACH DOCTOR
        # ----------------------------------------------------

        data["doctor"] = doctor.id

        # ----------------------------------------------------
        # CREATE REPORT
        # ----------------------------------------------------

        serializer = ReportSerializer(
            data=data
        )

        if not serializer.is_valid():

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        report = serializer.save()

        return Response(
            ReportSerializer(report).data,
            status=status.HTTP_201_CREATED,
        )