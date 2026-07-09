from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import SigninProfileSerializer, Step1Serializer, Step2Serializer
from .services import register_step1, register_step2
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


class RegisterStep1View(APIView):
    """POST /api/v1/register/step1/ — create or find user by email."""
    permission_classes = [AllowAny]
    throttle_scope = "registration"

    def post(self, request):
        serializer = Step1Serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = register_step1(**serializer.validated_data)

        status_code = status.HTTP_201_CREATED if result.get("is_new") else status.HTTP_200_OK
        data = {k: v for k, v in result.items()}
        if result.get("has_password"):
            data["message"] = "Account exists. Login to manage your data."

        return Response({"status": "success", "data": data}, status=status_code)


class RegisterStep2View(APIView):
    """POST /api/v1/register/step2/ — create or update registration profile."""
    permission_classes = [AllowAny]
    throttle_scope = "registration"

    def post(self, request):
        serializer = Step2Serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = register_step2(**serializer.validated_data)
        return Response({"status": "success", "data": result}, status=status.HTTP_200_OK)


from decimal import Decimal
from .models import StudentRegistration, Payment
from .registration_utils import generate_student_id, create_id_card, create_invoice, send_confirmation_email

class StudentRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            # Get form fields
            full_name = request.data.get("fullName")
            email = request.data.get("email")
            phone = request.data.get("phone")
            dob = request.data.get("dob")
            gender = request.data.get("gender")
            city = request.data.get("city")
            state = request.data.get("state")
            college_name = request.data.get("collegeName")
            branch = request.data.get("branch")
            current_year = request.data.get("currentYear")
            course_selected = request.data.get("courseSelected")
            batch_type = request.data.get("batchType")
            joining_date = request.data.get("joiningDate")
            
            # Numeric fields
            total_fee = request.data.get("totalFee")
            paid_fee = request.data.get("paidFee")
            balance_fee = request.data.get("balanceFee")
            upi_transaction_id = request.data.get("upiTransactionId")
            student_id = request.data.get("studentId")
            photo = request.FILES.get("photo")
            password = request.data.get("password")
            why_join = request.data.get("whyJoinAlgonex") or ""
            parent_phone = request.data.get("parentPhone")

            # Validate required fields
            if not all([full_name, email, phone, upi_transaction_id, photo, password]):
                return Response(
                    {"error": "Missing required fields (fullName, email, phone, password, upiTransactionId, photo)"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Generate student ID if not provided
            if not student_id:
                student_id = generate_student_id(course_selected, batch_type)

            # Convert fees to Decimal
            try:
                total_fee = Decimal(str(total_fee))
                paid_fee = Decimal(str(paid_fee))
                balance_fee = Decimal(str(balance_fee))
            except Exception:
                return Response(
                    {"error": "Invalid fee values. Must be numeric."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            from django.contrib.auth import get_user_model
            from django.db import transaction
            from .models import Payment

            # Check if this transaction ID was already used
            if Payment.objects.filter(upi_transaction_id=upi_transaction_id).exists():
                return Response(
                    {
                        "error": "This UPI transaction ID / UTR has already been submitted.",
                        "detail": "This UPI transaction ID / UTR has already been submitted."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            User = get_user_model()
            email_normalized = email.strip().lower()

            with transaction.atomic():
                user_exists = User.objects.filter(email=email_normalized).exists()
                if user_exists:
                    user = User.objects.get(email=email_normalized)
                    if not user.has_usable_password():
                        user.set_password(password)
                        user.save()
                else:
                    name_parts = full_name.strip().split(None, 1)
                    first_name = name_parts[0] if name_parts else ""
                    last_name = name_parts[1] if len(name_parts) > 1 else ""

                    username_base = email_normalized.split("@")[0]
                    username = username_base
                    for suffix in [""] + [str(i) for i in range(1, 100)]:
                        candidate = f"{username_base}{suffix}"
                        if not User.objects.filter(username=candidate).exists():
                            username = candidate
                            break

                    user = User.objects.create_user(
                        email=email_normalized,
                        password=password,
                        first_name=first_name,
                        last_name=last_name,
                        phone=phone,
                        username=username,
                        role="student"
                    )

                registration, created = StudentRegistration.objects.update_or_create(
                    user=user,
                    defaults={
                        "student_id": student_id,
                        "parent_phone": parent_phone or "",
                        "dob": dob or "",
                        "gender": gender or "",
                        "city": city or "",
                        "state": state or "",
                        "college_name": college_name or "",
                        "branch": branch or "",
                        "current_year": current_year or "",
                        "course_selected": course_selected or "",
                        "batch_type": batch_type or "",
                        "joining_date": joining_date or "",
                        "total_fee": total_fee,
                        "paid_fee": 0.0,
                        "balance_fee": total_fee,
                        "upi_transaction_id": upi_transaction_id,
                        "photo": photo,
                        "why_join": why_join
                    }
                )

                Payment.objects.create(
                    student_registration=registration,
                    amount=paid_fee,
                    upi_transaction_id=upi_transaction_id,
                    status="pending",
                    remarks="Initial registration payment."
                )

            # Generate ID card
            card_path = create_id_card(
                student_id=student_id,
                name=full_name,
                course=course_selected,
                batch_type=batch_type,
                joining_date=joining_date,
                role="Trainee",
                photo_file=registration.photo
            )

            # Generate Invoice
            registration.refresh_from_db()
            invoice_path = create_invoice(
                student_id=student_id,
                name=full_name,
                course=course_selected,
                batch_type=batch_type,
                joining_date=joining_date,
                total_fee=float(total_fee),
                paid_fee=float(paid_fee),
                balance_fee=float(total_fee - paid_fee),
                transaction_id=upi_transaction_id,
                registration_date=registration.registration_date.isoformat(),
                amount_paid_now=float(paid_fee)
            )

            return Response({
                "success": True,
                "student_id": student_id,
                "card_url": request.build_absolute_uri(f"/media/cards/{student_id}.png"),
                "invoice_url": request.build_absolute_uri(f"/media/invoices/invoice_{student_id}_{upi_transaction_id}.png"),
                "email_sent": False,
                "message": "Registration completed successfully! Awaiting payment approval."
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.exception("Error during student registration pipeline")
            return Response(
                {"error": "Registration pipeline failed", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PaymentSummaryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            registration = request.user.student_registration
        except StudentRegistration.DoesNotExist:
            return Response(
                {"error": "No student registration found for this account."},
                status=status.HTTP_404_NOT_FOUND
            )
            
        payments_qs = registration.payments.all()
        payments_data = []
        for p in payments_qs:
            invoice_url = None
            if p.status == "approved":
                invoice_filename = f"invoice_{registration.student_id}_{p.upi_transaction_id}.png"
                invoice_url = request.build_absolute_uri(f"/media/invoices/{invoice_filename}")
            
            payments_data.append({
                "id": p.id,
                "amount": str(p.amount),
                "upi_transaction_id": p.upi_transaction_id,
                "status": p.status,
                "remarks": p.remarks,
                "payment_date": p.payment_date.isoformat(),
                "invoice_url": invoice_url,
            })
            
        return Response({
            "student_id": registration.student_id,
            "course_selected": registration.course_selected,
            "total_fee": str(registration.total_fee),
            "paid_fee": str(registration.paid_fee),
            "balance_fee": str(registration.balance_fee),
            "status": registration.status,
            "payments": payments_data
        }, status=status.HTTP_200_OK)


class SubmitPaymentView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            registration = request.user.student_registration
        except StudentRegistration.DoesNotExist:
            return Response(
                {"error": "No student registration found for this account."},
                status=status.HTTP_404_NOT_FOUND
            )
            
        amount = request.data.get("amount")
        upi_transaction_id = request.data.get("upiTransactionId") or request.data.get("upi_transaction_id")
        remarks = request.data.get("remarks", "")
        
        if not amount or not upi_transaction_id:
            return Response(
                {"error": "Amount and UPI transaction ID are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            amount_dec = Decimal(str(amount))
            if amount_dec <= 0:
                raise ValueError("Amount must be positive.")
        except Exception:
            return Response(
                {"error": "Invalid amount value. Must be a positive number."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Check for duplicate transaction id
        if Payment.objects.filter(upi_transaction_id=upi_transaction_id).exists():
            return Response(
                {"error": "This UPI transaction ID has already been submitted."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        payment = Payment.objects.create(
            student_registration=registration,
            amount=amount_dec,
            upi_transaction_id=upi_transaction_id,
            status="pending",
            remarks=remarks
        )
        
        return Response({
            "success": True,
            "payment": {
                "id": payment.id,
                "amount": str(payment.amount),
                "upi_transaction_id": payment.upi_transaction_id,
                "status": payment.status,
                "payment_date": payment.payment_date.isoformat()
            },
            "message": "Payment submitted successfully and is pending verification."
        }, status=status.HTTP_201_CREATED)


class NextStudentIdView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        course = request.query_params.get("course")
        batch_type = request.query_params.get("batchType")
        next_id = generate_student_id(course, batch_type)
        return Response({"student_id": next_id}, status=status.HTTP_200_OK)
