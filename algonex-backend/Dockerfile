FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies.
# postgresql-client is pinned to major version 16 (via the PGDG repo) to match
# the postgres:16 server — a newer pg_dump writes settings the server rejects
# on restore (e.g. pg17's transaction_timeout).
# fonts-dejavu-core provides /usr/share/fonts/truetype/dejavu/DejaVuSans*.ttf,
# which signin/registration_utils.py loads for ID cards and invoices — the
# slim base image ships no fonts, so PIL falls back to an illegible bitmap font.
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev ca-certificates curl gnupg postgresql-common fonts-dejavu-core && \
    /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh -y && \
    apt-get install -y --no-install-recommends postgresql-client-16 && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy project
COPY . .

# Collect static files
RUN DJANGO_SETTINGS_MODULE=config.settings.production \
    DJANGO_SECRET_KEY=build-time-secret \
    python manage.py collectstatic --noinput 2>/dev/null || true

# Run as root user to ensure we have write permissions to mounted docker volumes
# RUN adduser --disabled-password --no-create-home appuser && \
#     chown -R appuser:appuser /app
# USER appuser

EXPOSE 8000

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "1", "--timeout", "120"]
