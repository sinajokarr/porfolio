import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <section className="container-x flex min-h-[80svh] flex-col items-start justify-center pt-32">
      <p className="font-mono text-sm text-accent" dir="ltr">404</p>
      <h1 className="display mt-4 text-[clamp(2.4rem,5vw,4rem)]">{t("title")}</h1>
      <p className="mt-4 text-mist">{t("text")}</p>
      <Link href="/" className="btn btn-light mt-10">{t("home")}</Link>
    </section>
  );
}
