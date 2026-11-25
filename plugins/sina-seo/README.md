# Sina SEO — سینا سئو

SEO manager agent for any website or business in 5 languages: Persian (fa), Russian (ru),
German (de), English (en), Turkish (tr). It audits, researches keywords per language, plans,
executes (content, meta, schema, hreflang, code fixes) and reports — by orchestrating
specialist skills and agents.

## Install (any project, any computer)

```
/plugin marketplace add sinajokarr/porfolio
/plugin install sina-seo@sina-jokar
/plugin marketplace add AgriciDaniel/claude-seo
/plugin install claude-seo@agricidaniel-claude-seo
/seo setup
```

## Use

```
/sina-seo https://example.com
/sina-seo https://example.com plan fa,ru,tr
سینا سئو: سایت کلینیک دندانپزشکی در استانبول، فارسی و روسی و انگلیسی
```

Work is saved in `seo/<site>/` inside the project you run it from, so the next call continues
where the last one stopped.

## Contents
- Skills: `sina-seo` (manager), `copywriting`, `copy-editing`, `content-strategy`
  (the last three from [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills), MIT)
- Agents: `sina-seo-researcher` (keywords per language), `sina-seo-linguist` (native writer & QA)
- Companion plugin: [claude-seo](https://github.com/AgriciDaniel/claude-seo) (audits & SEO specialists)
