from django.conf import settings

LANGUAGE_CODES = [code for code, _ in settings.LANGUAGES]


def request_language(request):
    """`?lang=tr` wins, then Accept-Language, then English."""
    lang = (request.query_params.get("lang") or "").lower()
    if lang in LANGUAGE_CODES:
        return lang
    for part in request.headers.get("Accept-Language", "").split(","):
        code = part.split(";")[0].strip()[:2].lower()
        if code in LANGUAGE_CODES:
            return code
    return "en"


def pick_translation(translations, lang):
    """Prefetched translations -> the requested language, falling back to English."""
    by_lang = {t.language: t for t in translations}
    return by_lang.get(lang) or by_lang.get("en")


def lines(text):
    return [line.strip() for line in (text or "").splitlines() if line.strip()]
