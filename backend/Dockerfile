# Build context: repository root (needs ../content for seed_content).
FROM python:3.13-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app/backend
COPY backend/requirements ./requirements
RUN pip install --no-cache-dir -r requirements/base.txt
COPY backend/ ./
COPY content/ /app/content/
RUN DJANGO_DEBUG=true python manage.py collectstatic --noinput
RUN useradd --create-home app && mkdir -p /app/backend/media && chown -R app /app/backend/media
USER app
EXPOSE 8000
CMD ["sh", "-c", "python manage.py migrate --noinput && python manage.py createcachetable && python manage.py seed_content && gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 30 --access-logfile -"]
