from django.conf import settings
from django.db import models
from common.mixins import TimestampMixin





class StudentRegistration(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="student_registration",
        null=True, blank=True
    )
    student_id = models.CharField(max_length=50, unique=True, blank=True, null=True)
    
    # Personal details
    dob = models.CharField(max_length=20, blank=True)
    gender = models.CharField(max_length=20, blank=True)
    
    # Address details
    street_address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, default="India")
    pincode = models.CharField(max_length=10, blank=True)
    
    # Education details
    college_name = models.CharField(max_length=255, blank=True)
    branch = models.CharField(max_length=150, blank=True)
    degree_level = models.CharField(max_length=50, blank=True)
    graduation_year = models.PositiveIntegerField(null=True, blank=True)
    current_year = models.CharField(max_length=50, blank=True)
    
    # Employment details
    employment_status = models.CharField(max_length=50, blank=True)
    years_of_experience = models.PositiveIntegerField(default=0)
    
    # Registration / course specifics
    course_selected = models.CharField(max_length=150, blank=True)
    course = models.ForeignKey(
        "courses.Course",
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="student_registrations"
    )
    terms_agreed = models.BooleanField(default=False)
    batch_type = models.CharField(max_length=50, blank=True)
    joining_date = models.CharField(max_length=20, blank=True)
    
    # System meta & photo
    photo = models.ImageField(upload_to="registration_photos/", blank=True, null=True)
    registration_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default="Active")
    
    # Fees summary
    total_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    paid_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    balance_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    
    # initial transaction
    upi_transaction_id = models.CharField(max_length=100, blank=True)
    why_join = models.TextField(blank=True, help_text="Why do you want to join Algonex?")

    class Meta:
        ordering = ["-registration_date"]

    def __str__(self):
        return f"{self.user.email} ({self.student_id or 'No ID'}) - {self.course_selected}"

    @property
    def full_name(self):
        return f"{self.user.first_name} {self.user.last_name}".strip() or self.user.email

    @property
    def email(self):
        return self.user.email

    @property
    def phone(self):
        return self.user.phone

    def save(self, *args, **kwargs):
        if not self.student_id:
            from .registration_utils import generate_student_id
            self.student_id = generate_student_id(self.course_selected, self.batch_type)
        super().save(*args, **kwargs)


class Payment(TimestampMixin, models.Model):
    PAYMENT_STATUS = [
        ("pending", "Pending Verification"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    student_registration = models.ForeignKey(
        StudentRegistration,
        on_delete=models.CASCADE,
        related_name="payments"
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    upi_transaction_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default="pending")
    remarks = models.TextField(blank=True)
    payment_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-payment_date"]

    def __str__(self):
        return f"{self.student_registration.student_id or 'No ID'} - ₹{self.amount} ({self.status})"

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        old_status = None
        if not is_new:
            old_status = Payment.objects.get(pk=self.pk).status

        super().save(*args, **kwargs)

        if is_new or old_status != self.status:
            reg = self.student_registration
            approved_total = reg.payments.filter(status="approved").aggregate(
                total=models.Sum("amount")
            )["total"] or 0

            reg.paid_fee = approved_total
            reg.balance_fee = max(0, reg.total_fee - reg.paid_fee)
            reg.save(update_fields=["paid_fee", "balance_fee"])

            if self.status == "approved" and old_status == "pending":
                try:
                    from .registration_utils import create_invoice, send_confirmation_email, send_payment_receipt_email
                    from django.conf import settings
                    
                    # Generate or update the invoice with new payment values
                    invoice_path = create_invoice(
                        student_id=reg.student_id,
                        name=reg.full_name,
                        course=reg.course_selected,
                        batch_type=reg.batch_type,
                        joining_date=str(reg.joining_date),
                        total_fee=float(reg.total_fee),
                        paid_fee=float(reg.paid_fee),
                        balance_fee=float(reg.balance_fee),
                        transaction_id=self.upi_transaction_id,
                        registration_date=reg.registration_date.isoformat(),
                        amount_paid_now=float(self.amount)
                    )
                    
                    # Determine if this is the initial registration payment or a subsequent payment
                    first_payment = reg.payments.order_by("payment_date").first()
                    is_initial = (first_payment.id == self.id) if first_payment else True
                    
                    if is_initial:
                        card_path = f"{settings.MEDIA_ROOT}/cards/{reg.student_id}.png"
                        send_confirmation_email(
                            to_email=reg.user.email,
                            student_name=reg.full_name,
                            student_id=reg.student_id,
                            course=reg.course_selected,
                            batch_type=reg.batch_type,
                            joining_date=reg.joining_date,
                            card_path=card_path,
                            password=None,
                            invoice_path=invoice_path
                        )
                    else:
                        send_payment_receipt_email(
                            to_email=reg.user.email,
                            student_name=reg.full_name,
                            student_id=reg.student_id,
                            course=reg.course_selected,
                            payment_amount=float(self.amount),
                            transaction_id=self.upi_transaction_id,
                            invoice_path=invoice_path
                        )
                except Exception as e:
                    import logging
                    logging.getLogger(__name__).error(f"Failed to generate invoice or send email on approval: {e}")
