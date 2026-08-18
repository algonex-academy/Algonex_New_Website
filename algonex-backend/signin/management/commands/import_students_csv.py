import csv
from decimal import Decimal
from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from signin.models import StudentRegistration, Payment

User = get_user_model()


class Command(BaseCommand):
    help = "Import students and payments from CSV files with automatic user creation"

    def add_arguments(self, parser):
        parser.add_argument("--students", type=str, help="Path to students CSV file")
        parser.add_argument("--payments", type=str, help="Path to payments CSV file")

    def handle(self, *args, **options):
        students_path = options.get("students")
        payments_path = options.get("payments")

        id_map = {}

        if students_path:
            self.stdout.write(f"⏳ Reading students from {students_path}...")
            with open(students_path, mode="r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    reg_id = int(row["id"])
                    student_id = str(row.get("student_id") or "").strip()
                    email = f"student_{student_id.lower()}@algonex.in"
                    first_name = str(
                        row.get("full_name") or row.get("first_name") or row.get("name") or ""
                    ).strip()[:30] or f"Student {student_id}"

                    user, _ = User.objects.get_or_create(
                        email=email,
                        defaults={
                            "username": f"student_{student_id.lower()}",
                            "first_name": first_name,
                            "role": "student",
                            "phone": row.get("parent_phone") or "",
                        }
                    )

                    reg, _ = StudentRegistration.objects.update_or_create(
                        id=reg_id,
                        defaults={
                            "user": user,
                            "student_id": student_id,
                            "parent_phone": row.get("parent_phone") or "",
                            "dob": row.get("dob") or "",
                            "gender": row.get("gender") or "",
                            "street_address": row.get("street_address") or "",
                            "city": row.get("city") or "",
                            "state": row.get("state") or "",
                            "country": row.get("country") or "India",
                            "pincode": row.get("pincode") or "",
                            "college_name": row.get("college_name") or "",
                            "branch": row.get("branch") or "",
                            "degree_level": row.get("degree_level") or "",
                            "graduation_year": int(row["graduation_year"]) if row.get("graduation_year") else None,
                            "current_year": row.get("current_year") or "",
                            "employment_status": row.get("employment_status") or "",
                            "years_of_experience": int(row.get("years_of_experience") or 0),
                            "course_selected": row.get("course_selected") or "",
                            "terms_agreed": row.get("terms_agreed") == "1",
                            "batch_type": row.get("batch_type") or "",
                            "joining_date": row.get("joining_date") or "",
                            "photo": row.get("photo") or "",
                            "status": row.get("status") or "Active",
                            "total_fee": Decimal(row.get("total_fee") or 0),
                            "paid_fee": Decimal(row.get("paid_fee") or 0),
                            "balance_fee": Decimal(row.get("balance_fee") or 0),
                            "upi_transaction_id": row.get("upi_transaction_id") or "",
                            "why_join": row.get("why_join") or "",
                        }
                    )
                    id_map[reg_id] = reg

            self.stdout.write(self.style.SUCCESS(f"✅ Imported {len(id_map)} Student Registrations."))

        if payments_path:
            self.stdout.write(f"⏳ Reading payments from {payments_path}...")
            payments_to_create = []
            with open(payments_path, mode="r", encoding="utf-8") as f:
                pay_reader = csv.DictReader(f)
                for row in pay_reader:
                    pay_id = int(row["id"])
                    reg_id = int(row["student_registration"])
                    reg = id_map.get(reg_id) or StudentRegistration.objects.filter(id=reg_id).first()
                    if not reg:
                        continue
                    payments_to_create.append(
                        Payment(
                            id=pay_id,
                            student_registration=reg,
                            amount=Decimal(row.get("amount") or 0),
                            # bulk_create bypasses Payment.save(), so normalize
                            # empty transaction ids to NULL here to avoid
                            # unique collisions on "".
                            upi_transaction_id=row.get("upi_transaction_id") or None,
                            status=row.get("status") or "approved",
                            remarks=row.get("remarks") or "",
                        )
                    )

            Payment.objects.bulk_create(payments_to_create, ignore_conflicts=True)
            imported_ids = [p.id for p in payments_to_create]
            inserted_count = Payment.objects.filter(id__in=imported_ids).count()
            skipped_count = len(payments_to_create) - inserted_count
            self.stdout.write(self.style.SUCCESS(f"✅ Imported {inserted_count} Payments."))
            if skipped_count > 0:
                self.stdout.write(self.style.WARNING(
                    f"⚠️ WARNING: {skipped_count} payment row(s) were skipped as conflicts "
                    f"(duplicate id or transaction id) and were NOT inserted."
                ))

            # Update fee balances
            for reg in StudentRegistration.objects.all():
                approved_total = sum(p.amount for p in reg.payments.filter(status="approved"))
                reg.paid_fee = approved_total
                reg.balance_fee = max(Decimal(0), reg.total_fee - approved_total)
                reg.save(update_fields=["paid_fee", "balance_fee"])

            self.stdout.write(self.style.SUCCESS("✅ Synced paid & balance fee totals."))

        # Rows were inserted with explicit ids, which does NOT advance Postgres
        # identity sequences — without this, the next admin/API insert gets an
        # already-used id and fails with a duplicate-key IntegrityError.
        call_command("resync_sequences")
