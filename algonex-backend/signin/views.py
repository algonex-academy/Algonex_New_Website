from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import SigninProfileSerializer
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import logging

logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class SigninFormView(APIView):
    def post(self, request):
        try:
            serializer = SigninProfileSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'Sign-in data saved successfully'}, status=status.HTTP_201_CREATED)
            else:
                logger.warning("Validation failed: %s", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error("Unexpected error: %s", str(e))
            return Response({'error': 'Internal server error', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
