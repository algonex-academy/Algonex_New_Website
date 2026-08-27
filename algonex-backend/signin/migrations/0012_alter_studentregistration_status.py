from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('signin', '0011_studentregistration_parent_phone'),
    ]

    operations = [
        migrations.AlterField(
            model_name='studentregistration',
            name='status',
            field=models.CharField(default='Pending', max_length=20),
        ),
    ]
