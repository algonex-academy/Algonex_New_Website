from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("signin", "0011_studentregistration_parent_phone"),
    ]

    operations = [
        migrations.AlterField(
            model_name="payment",
            name="upi_transaction_id",
            field=models.CharField(blank=True, max_length=100, null=True, unique=True),
        ),
    ]
