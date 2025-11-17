# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from django.core.mail import send_mail
# from .serializers import EventRegistrationSerializer
# from django.conf import settings


# class RegisterEventView(APIView):
#     def post(self, request):
#         serializer = EventRegistrationSerializer(data=request.data)

#         if serializer.is_valid():
#             registration = serializer.save()

#             # Send confirmation email
#             try:
#                 send_mail(
#                     subject="Event Registration Successful",
#                     message=f"Hi {registration.name},\n\nYour registration for the event is successful.\n\nThank you!",
#                     from_email=settings.DEFAULT_FROM_EMAIL,
#                     recipient_list=[registration.email],
#                     fail_silently=False,
#                 )
#             except Exception as e:
#                 # Optional: log the error or include in response
#                 print("Email sending failed:", e)

#             return Response({"message": "Registration Successful. Check Your Email."}, 
#                             status=status.HTTP_201_CREATED)

#         return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from .serializers import EventRegistrationSerializer
import traceback
import logging

# Optional: Configure logger (Render logs everything printed)
logger = logging.getLogger(__name__)

class RegisterEventView(APIView):
    def post(self, request):
        serializer = EventRegistrationSerializer(data=request.data)

        if serializer.is_valid():
            registration = serializer.save()

            # Send confirmation email
            try:
                send_mail(
                    subject="Event Registration Successful",
                    message=f"Hi {registration.name},\n\nYour registration for the event is successful.\n\nThank you!",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[registration.email],
                    fail_silently=False,
                )
                logger.info(f"Email sent successfully to {registration.email}")
                print(f"Email sent successfully to {registration.email}")

            except Exception as e:
                # Log the error to Render logs
                logger.error(f"Email sending failed: {e}")
                print(f"Email sending failed: {e}")
                traceback.print_exc()  # Prints full traceback in Render logs

            return Response(
                {"message": "Registration Successful. Check Your Email."}, 
                status=status.HTTP_201_CREATED
            )

        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
