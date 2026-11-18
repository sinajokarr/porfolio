from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .serializers import InquiryCreateSerializer
from .services import create_inquiry


class InquiryCreateView(APIView):
    """Public, create-only. Reading inquiries happens in Django Admin (staff login)."""

    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "inquiries"

    @extend_schema(
        request=InquiryCreateSerializer,
        responses={201: inline_serializer("InquiryReceived", {
            "status": serializers.CharField(), "reference_id": serializers.CharField(allow_null=True)})},
    )
    def post(self, request):
        serializer = InquiryCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = dict(serializer.validated_data)
        if data.pop("website", ""):  # honeypot filled: answer like a success, store nothing
            return Response({"status": "received", "reference_id": None}, status=status.HTTP_201_CREATED)
        inquiry = create_inquiry(data)
        return Response({"status": "received", "reference_id": inquiry.reference_id}, status=status.HTTP_201_CREATED)
