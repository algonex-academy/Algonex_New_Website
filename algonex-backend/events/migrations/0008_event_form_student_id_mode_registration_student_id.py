from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0007_event_form_branch_mode_event_form_college_mode_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='form_student_id_mode',
            field=models.CharField(choices=[('required', 'Required (Mandatory)'), ('optional', 'Optional (Non-Mandatory)'), ('hidden', 'Hidden (Do Not Show)')], default='hidden', max_length=15, verbose_name='Student ID / Algonex ID Field'),
        ),
        migrations.AddField(
            model_name='registration',
            name='student_id',
            field=models.CharField(blank=True, max_length=50, verbose_name='Student ID / Algonex ID'),
        ),
    ]
