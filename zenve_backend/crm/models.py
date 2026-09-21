from django.db import models


# ============================================================
# DOCTOR
# ============================================================

class Doctor(models.Model):
    name = models.CharField(max_length=150)

    specialization = models.CharField(
        max_length=150
    )

    qualification = models.CharField(
        max_length=150,
        blank=True
    )

    phone = models.CharField(
        max_length=30,
        blank=True
    )

    city = models.CharField(
        max_length=100,
        blank=True
    )

    pin = models.CharField(
        max_length=10,
        blank=True
    )

    experience = models.CharField(
        max_length=100,
        blank=True
    )

    active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.name


# ============================================================
# PRE VISIT
# ============================================================

class PreVisit(models.Model):

    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.CASCADE,
        related_name="pre_visits"
    )

    product = models.CharField(
        max_length=200
    )

    campaign = models.CharField(
        max_length=200,
        blank=True
    )

    objective = models.TextField()

    notes = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Pre Visit - {self.doctor.name}"


# ============================================================
# POST VISIT
# ============================================================

class PostVisit(models.Model):

    OUTCOMES = [
        ("Interested", "Interested"),
        ("Prescribed", "Prescribed"),
        ("Needs Follow-up", "Needs Follow-up"),
        ("Not Available", "Not Available"),
        ("Rejected", "Rejected"),
    ]

    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.CASCADE,
        related_name="post_visits"
    )

    product = models.CharField(
        max_length=200
    )

    campaign = models.CharField(
        max_length=200,
        blank=True
    )

    outcome = models.CharField(
        max_length=50,
        choices=OUTCOMES
    )

    next_visit_date = models.DateField(
        null=True,
        blank=True
    )

    prescriptions = models.TextField(
        blank=True
    )

    feedback = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Post Visit - {self.doctor.name}"


# ============================================================
# REPORT
# ============================================================

class Report(models.Model):

    REPORTING_TYPES = [
        ("Field", "Field"),
        ("Online", "Online"),
        ("Phone", "Phone"),
    ]

    SEND_TO = [
        ("Both", "Both"),
        ("Sales Manager", "Sales Manager"),
        ("Regional Manager", "Regional Manager"),
    ]

    # --------------------------------------------------------
    # REPORT -> DOCTOR RELATIONSHIP
    # --------------------------------------------------------

    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.CASCADE,
        related_name="reports",
        null=True,
        blank=True
    )

    # --------------------------------------------------------
    # REPORT DETAILS
    # --------------------------------------------------------

    reporting_type = models.CharField(
        max_length=20,
        choices=REPORTING_TYPES,
        default="Field"
    )

    report_date = models.DateField()

    send_to = models.CharField(
        max_length=30,
        choices=SEND_TO,
        default="Both"
    )

    submitted_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["-submitted_at"]

    def __str__(self):
        doctor_name = (
            self.doctor.name
            if self.doctor
            else "No Doctor"
        )

        return (
            f"Report - "
            f"{doctor_name} - "
            f"{self.report_date}"
        )