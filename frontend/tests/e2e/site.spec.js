// Run against a started site: `npm run build && npm start` (+ Django for the form test).
import { expect, test } from "@playwright/test";

test("root redirects to a locale", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/(en|tr|fa|ru)$/);
});

for (const [locale, dir, heading] of [
  ["en", "ltr", "I Build Digital Products."],
  ["tr", "ltr", "Dijital Ürünler Geliştiriyorum."],
  ["fa", "rtl", "محصولات دیجیتال می‌سازم."],
  ["ru", "ltr", "Создаю цифровые продукты."],
]) {
  test(`${locale}: lang/dir and hero`, async ({ page }) => {
    await page.goto(`/${locale}`);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.locator("html")).toHaveAttribute("dir", dir);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(heading);
  });
}

test("language switcher keeps the current page", async ({ page, isMobile }) => {
  test.skip(isMobile, "switcher is identical on mobile");
  await page.goto("/en/projects/nexusticket");
  await page.getByRole("button", { name: /Language/ }).click();
  await page.getByRole("option", { name: "فارسی" }).click();
  await expect(page).toHaveURL(/\/fa\/projects\/nexusticket$/);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
});

test("service and project routes render in every locale", async ({ page }) => {
  for (const path of ["/services/website-development", "/projects/sinshop", "/about", "/contact", "/privacy"]) {
    for (const l of ["en", "tr", "fa", "ru"]) {
      const res = await page.goto(`/${l}${path}`);
      expect(res.status(), `${l}${path}`).toBe(200);
    }
  }
  expect((await page.goto("/en/projects/does-not-exist")).status()).toBe(404);
});

test("contact links are real", async ({ page }) => {
  await page.goto("/en/contact");
  await expect(page.locator('a[href="https://wa.me/905427130132"]').first()).toBeVisible();
  await expect(page.locator('a[href="mailto:cnajokar11@yahoo.com"]').first()).toBeAttached();
  await expect(page.locator('a[href="tel:+905427130132"]').first()).toBeAttached();
  await expect(page.locator('a[href="https://www.linkedin.com/in/sinajokar/"]').first()).toBeAttached();
  await expect(page.locator('a[href="https://github.com/sinajokarr"]').first()).toBeAttached();
});

test("inquiry form validates in the visitor's language", async ({ page }) => {
  await page.goto("/tr/contact");
  await page.getByRole("button", { name: "Talebi gönder" }).click();
  await expect(page.getByText("Lütfen geçerli bir e-posta adresi girin.")).toBeVisible();
  await expect(page.getByText("Devam etmek için lütfen gizlilik politikasını kabul edin.")).toBeVisible();
});

test("inquiry reaches Django and returns a reference", async ({ page }) => {
  await page.goto("/en/contact");
  await page.getByLabel("Full name").fill("E2E Test");
  await page.getByLabel("Email").fill("e2e@example.com");
  await page.getByLabel("Requested service").selectOption("website");
  await page.getByLabel("Project description").fill("End-to-end test inquiry, please ignore.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send inquiry" }).click();
  await expect(page.getByText(/SJ-[A-Z0-9]{8}/)).toBeVisible();
});

test("reduced motion shows content without animation", async ({ browser }) => {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  await page.goto("/en");
  await expect(page.locator("html")).not.toHaveClass(/motion/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.close();
});

test("no horizontal overflow", async ({ page }) => {
  for (const l of ["en", "fa", "ru"]) {
    await page.goto(`/${l}`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, l).toBeLessThanOrEqual(0);
  }
});

test("homepage follows the visitor journey", async ({ page }) => {
  await page.goto("/en");
  const ids = await page.locator("main section[id]").evaluateAll((els) => els.map((e) => e.id));
  expect(ids).toEqual(["services", "work", "stack", "process", "about", "contact"]);
  await page.getByRole("link", { name: "Explore My Services" }).click();
  await expect(page).toHaveURL(/#services$/);
});

test("growth lab lives on the performance marketing page", async ({ page }) => {
  await page.goto("/en/services/performance-marketing");
  await expect(page.locator("#growth-lab")).toBeVisible();
  await expect(page.getByText("Illustrative estimates")).toBeVisible();
});
