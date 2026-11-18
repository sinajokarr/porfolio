"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CircleCheck, LoaderCircle, TriangleAlert } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "@/i18n/navigation";
import { track } from "@/lib/analytics";
import { BUDGETS, CONTACT_METHODS, inquirySchema, SERVICES } from "@/lib/inquiry";

// /services/<slug> or ?service=<slug> → form choice
const FROM_SLUG = {
  "website-development": "website", "full-stack-development": "fullstack", "performance-marketing": "google_ads",
  "conversion-tracking": "tracking", "analytics-gtm": "tracking", "landing-pages": "landing_page",
  "technical-seo-performance": "website", "ecommerce-development": "website", "api-integrations": "fullstack",
};
const ERROR_KEY = {
  full_name: "nameMin", email: "email", phone: "phone", requested_service: "service",
  project_description: "descriptionMin", preferred_contact_method: "contactMethod", privacy_consent: "consent",
};

function Field({ id, label, optional, error, children, className = "" }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm text-white/80">
        {label} {optional && <span className="text-white/40">({optional})</span>}
      </label>
      {children}
      {error && <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-[#f5b4b4]">{error}</p>}
    </div>
  );
}

export default function InquiryForm() {
  const t = useTranslations("form");
  const tErr = useTranslations("form.errors");
  const locale = useLocale();
  const schema = useMemo(() => inquirySchema((k) => tErr(k)), [tErr]);
  const [state, setState] = useState({ status: "idle" }); // idle | sending | success | error

  const { register, handleSubmit, setValue, setError, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: "", email: "", phone: "", company: "", requested_service: "", budget_range: "",
      project_description: "", preferred_contact_method: "email", privacy_consent: false, website: "",
    },
  });

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("service");
    if (slug && FROM_SLUG[slug]) setValue("requested_service", FROM_SLUG[slug]);
  }, [setValue]);

  async function onSubmit(data) {
    setState({ status: "sending" });
    try {
      const res = await fetch("/backend/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      if (res.status === 201) {
        const body = await res.json();
        track("contact_form_submit", { service: data.requested_service });
        setState({ status: "success", ref: body.reference_id });
        reset();
        return;
      }
      if (res.status === 400) {
        const body = await res.json();
        Object.keys(body).forEach((f) => ERROR_KEY[f] && setError(f, { message: tErr(ERROR_KEY[f]) }));
      }
      setState({ status: "error", message: res.status === 429 ? t("rateLimited") : t("errorText") });
    } catch {
      setState({ status: "error", message: t("errorText") });
    }
  }

  if (state.status === "success") {
    return (
      <div className="card-dark p-8 md:p-10" role="status">
        <CircleCheck className="size-10 text-accent" aria-hidden="true" />
        <h3 className="mt-6 text-2xl font-medium">{t("successTitle")}</h3>
        <p className="mt-3 text-white/70">
          {state.ref ? t.rich("successText", { ref: () => <strong className="font-mono text-white" dir="ltr">{state.ref}</strong> }) : null}
        </p>
        <button type="button" className="btn btn-ghost mt-8" onClick={() => setState({ status: "idle" })}>{t("another")}</button>
      </div>
    );
  }

  const aria = (name) => ({ "aria-invalid": errors[name] ? "true" : "false", "aria-describedby": errors[name] ? `f-${name}-error` : undefined });
  const method = watch("preferred_contact_method");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="card-dark p-6 md:p-10" aria-labelledby="form-title">
      <h3 id="form-title" className="text-xl font-medium">{t("title")}</h3>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field id="f-full_name" label={t("fullName")} error={errors.full_name?.message}>
          <input id="f-full_name" className="field" autoComplete="name" {...register("full_name")} {...aria("full_name")} />
        </Field>
        <Field id="f-email" label={t("email")} error={errors.email?.message}>
          <input id="f-email" type="email" dir="ltr" className="field text-start" autoComplete="email" {...register("email")} {...aria("email")} />
        </Field>
        <Field id="f-phone" label={t("phone")} optional={method === "email" ? t("optional") : null} error={errors.phone?.message}>
          <input id="f-phone" type="tel" dir="ltr" className="field text-start" autoComplete="tel" placeholder="+90 …" {...register("phone")} {...aria("phone")} />
        </Field>
        <Field id="f-company" label={t("company")} optional={t("optional")} error={errors.company?.message}>
          <input id="f-company" className="field" autoComplete="organization" {...register("company")} {...aria("company")} />
        </Field>
        <Field id="f-requested_service" label={t("service")} error={errors.requested_service?.message}>
          <select id="f-requested_service" className="field" {...register("requested_service")} {...aria("requested_service")}>
            <option value="" disabled>{t("servicePlaceholder")}</option>
            {SERVICES.map((s) => <option key={s} value={s}>{t(`services.${s}`)}</option>)}
          </select>
        </Field>
        <Field id="f-budget_range" label={t("budget")} optional={t("optional")}>
          <select id="f-budget_range" className="field" {...register("budget_range")}>
            <option value="">{t("budgetPlaceholder")}</option>
            {BUDGETS.map((b) => <option key={b} value={b}>{t(`budgets.${b}`)}</option>)}
          </select>
        </Field>
        <Field id="f-project_description" label={t("description")} error={errors.project_description?.message} className="sm:col-span-2">
          <textarea id="f-project_description" rows={5} className="field resize-y" placeholder={t("descriptionPlaceholder")} {...register("project_description")} {...aria("project_description")} />
        </Field>
        <fieldset className="sm:col-span-2">
          <legend className="mb-3 text-sm text-white/80">{t("contactMethod")}</legend>
          <div className="flex flex-wrap gap-2">
            {CONTACT_METHODS.map((m) => (
              <label key={m} className="cursor-pointer">
                <input type="radio" value={m} className="peer sr-only" {...register("preferred_contact_method")} />
                <span className="chip !px-4 !py-2 !text-sm transition-colors peer-checked:!border-accent peer-checked:bg-accent/10 peer-checked:!text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-accent">
                  {t(`methods.${m}`)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        {/* Honeypot: invisible to people, tempting to bots. */}
        <div aria-hidden="true" className="absolute -start-[9999px] h-0 overflow-hidden">
          <label htmlFor="f-website">Website</label>
          <input id="f-website" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>
        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-white/70">
            <input type="checkbox" className="mt-1 size-4 shrink-0 accent-[#aaa9f5]" {...register("privacy_consent")} {...aria("privacy_consent")} />
            <span>
              {t("consent")} <Link href="/privacy" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">{t("privacyLink")}</Link>.
            </span>
          </label>
          {errors.privacy_consent && <p id="f-privacy_consent-error" role="alert" className="mt-2 text-sm text-[#f5b4b4]">{errors.privacy_consent.message}</p>}
        </div>
      </div>

      {state.status === "error" && (
        <div role="alert" className="mt-6 flex gap-3 rounded-2xl border border-[#f5b4b4]/30 bg-[#f5b4b4]/[0.06] p-4 text-sm text-white/85">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-[#f5b4b4]" aria-hidden="true" />
          <span><strong className="block text-white">{t("errorTitle")}</strong>{state.message}</span>
        </div>
      )}

      <button type="submit" className="btn btn-light mt-8 w-full sm:w-auto" disabled={state.status === "sending"}>
        {state.status === "sending" ? <><LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> {t("sending")}</> : <>{t("submit")} <ArrowRight className="arrow size-4" aria-hidden="true" /></>}
      </button>
    </form>
  );
}
