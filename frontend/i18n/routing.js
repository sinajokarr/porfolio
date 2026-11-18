import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "tr", "fa", "ru"],
  defaultLocale: "en",
});

export const RTL_LOCALES = ["fa"];
export const dirOf = (locale) => (RTL_LOCALES.includes(locale) ? "rtl" : "ltr");
