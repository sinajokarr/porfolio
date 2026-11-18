import pytest
from django.core.cache import cache
from django.core.management import call_command


@pytest.fixture(autouse=True)
def _fresh_cache(db, settings):
    call_command("createcachetable", verbosity=0)
    settings.EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
    # The hashed-manifest storage needs collectstatic; tests render admin without it.
    settings.STORAGES = {**settings.STORAGES, "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"}}
    cache.clear()  # throttle counters must not leak between tests


@pytest.fixture
def seeded(db):
    call_command("seed_content", verbosity=0)
