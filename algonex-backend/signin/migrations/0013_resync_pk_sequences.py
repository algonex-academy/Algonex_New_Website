from django.core.management.color import no_style
from django.db import migrations


def resync_sequences(apps, schema_editor):
    """Repair Postgres identity sequences left behind max(id) by explicit-id
    imports (import_students_csv / admin CSV imports). Without this, inserts
    without an id collide with imported rows (duplicate-key IntegrityError on
    e.g. signin_payment_pkey). Runs via `migrate` on deploy so no manual SSH
    step is needed. No-op on SQLite (dev/tests)."""
    connection = schema_editor.connection
    if connection.vendor != "postgresql":
        return
    models = list(apps.get_models())
    statements = connection.ops.sequence_reset_sql(no_style(), models)
    with connection.cursor() as cursor:
        for sql in statements:
            cursor.execute(sql)


class Migration(migrations.Migration):

    dependencies = [
        ("signin", "0012_alter_payment_upi_transaction_id"),
    ]

    operations = [
        migrations.RunPython(resync_sequences, migrations.RunPython.noop),
    ]
