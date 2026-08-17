from django.apps import apps
from django.core.management.base import BaseCommand
from django.core.management.color import no_style
from django.db import connection


class Command(BaseCommand):
    help = (
        "Resynchronize PostgreSQL primary-key sequences with the actual max(id) of "
        "every table. Required after any import that inserts rows with explicit ids "
        "(import_students_csv, admin CSV imports), otherwise new inserts fail with "
        "duplicate-key IntegrityError."
    )

    def handle(self, *args, **options):
        if connection.vendor != "postgresql":
            self.stdout.write(self.style.WARNING(
                f"Database vendor is '{connection.vendor}', not postgresql — nothing to do."
            ))
            return

        models = [m for m in apps.get_models() if m._meta.managed]
        statements = connection.ops.sequence_reset_sql(no_style(), models)
        if not statements:
            self.stdout.write("No sequences to reset.")
            return

        with connection.cursor() as cursor:
            for sql in statements:
                cursor.execute(sql)

        self.stdout.write(self.style.SUCCESS(
            f"Resynced sequences for {len(models)} models ({len(statements)} statements)."
        ))
