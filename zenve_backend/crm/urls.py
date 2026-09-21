from django.urls import include, path

from rest_framework.routers import DefaultRouter

from .views import (
    DoctorViewSet,
    PreVisitViewSet,
    PostVisitViewSet,
    ReportViewSet,
    PreVisitCreateView,
    PostVisitCreateView,
    ReportCreateView,
)


# ============================================================
# API ROUTER
# ============================================================

router = DefaultRouter()

router.register(
    "doctors",
    DoctorViewSet,
    basename="doctor"
)

router.register(
    "pre-visits",
    PreVisitViewSet,
    basename="pre-visit"
)

router.register(
    "post-visits",
    PostVisitViewSet,
    basename="post-visit"
)

router.register(
    "reports",
    ReportViewSet,
    basename="report"
)


# ============================================================
# URL PATTERNS
# ============================================================

urlpatterns = [

    # --------------------------------------------------------
    # REST API ROUTES
    # --------------------------------------------------------

    path(
        "",
        include(router.urls)
    ),

    # --------------------------------------------------------
    # PRE VISIT CREATION
    # --------------------------------------------------------

    path(
        "visits/pre/",
        PreVisitCreateView.as_view(),
        name="create-pre-visit",
    ),

    # --------------------------------------------------------
    # POST VISIT CREATION
    # --------------------------------------------------------

    path(
        "visits/post/",
        PostVisitCreateView.as_view(),
        name="create-post-visit",
    ),

    # --------------------------------------------------------
    # REPORT CREATION
    # --------------------------------------------------------

    path(
        "visits/report/",
        ReportCreateView.as_view(),
        name="create-report",
    ),
]