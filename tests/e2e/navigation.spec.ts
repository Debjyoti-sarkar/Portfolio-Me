import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/** Scan once hydrated, with animations off so half-faded text isn't misreported. */
async function axe(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.getByRole("button", { name: /switch to (dark|light) theme/i })).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  return results.violations.flatMap((v) => v.nodes.map((n) => `${v.id}: ${n.target.join(" ")}`));
}

test.describe("public site", () => {
  test("home page renders key sections and has no a11y violations", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Debjyoti Sarkar");
    for (const id of ["about", "projects", "skills", "experience", "notes", "contact"]) {
      await expect(page.locator(`section#${id}`)).toBeAttached();
    }
    await expect(page.getByRole("link", { name: /résumé/i }).first()).toHaveAttribute("href", "/resume.pdf");

    expect(await axe(page)).toEqual([]);
  });

  test("skip link moves focus to main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await skip.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });

  test("projects can be filtered and opened as case studies", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const cards = page.locator("main article");
    const total = await cards.count();
    expect(total).toBeGreaterThan(3);

    // Social-impact work leads the list.
    await expect(cards.first()).toContainText("Social impact");

    await page.getByRole("group", { name: "Filter by category" }).getByRole("button", { name: /IoT/ }).click();
    await expect(cards).not.toHaveCount(total);
    for (const card of await cards.all()) await expect(card).toContainText(/IoT/i);

    await page.getByRole("button", { name: /^All/ }).click();
    await expect(cards).toHaveCount(total);

    await page.getByRole("link", { name: "HearMe", exact: true }).click();
    await expect(page).toHaveURL(/\/projects\/hearme$/);
    await expect(page.getByRole("heading", { level: 1, name: "HearMe" })).toBeVisible();
    for (const h of ["Overview", "The problem", "My role", "Architecture"]) {
      await expect(page.getByRole("heading", { level: 2, name: h })).toBeVisible();
    }
    expect(await axe(page)).toEqual([]);
  });

  test("unknown routes return a 404 page", async ({ page }) => {
    const res = await page.goto("/definitely-not-a-page");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: /doesn.t exist/i })).toBeVisible();
    // Unlisted slugs: the first hit may stream a 200 shell (Partial Prerendering),
    // but it must render the not-found UI with noindex, and subsequent hits are 404.
    await page.goto("/projects/not-a-real-project");
    await expect(page.getByRole("heading", { name: /doesn.t exist/i })).toBeVisible();
    const robots = await page
      .locator('meta[name="robots"]')
      .evaluateAll((els) => els.map((e) => e.getAttribute("content")));
    expect(robots.length).toBeGreaterThan(0);
    expect(robots.every((c) => c?.includes("noindex"))).toBe(true);
    const again = await page.goto("/projects/not-a-real-project");
    expect(again?.status()).toBe(404);
  });

  test("SEO endpoints and metadata are present", async ({ page, request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBe(true);
    expect(await sitemap.text()).toContain("/projects/hearme");
    expect((await request.get("/robots.txt")).ok()).toBe(true);
    expect((await request.get("/opengraph-image")).headers()["content-type"]).toContain("image/png");

    await page.goto("/projects/hearme");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/projects\/hearme$/);
    await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute("content", /opengraph-image/);
    await page.goto("/");
    const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(JSON.parse(ld ?? "{}")["@type"]).toBe("Person");
  });

  test("security headers are set", async ({ request }) => {
    const res = await request.get("/");
    const h = res.headers();
    expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["strict-transport-security"]).toContain("max-age=");
    expect(h["x-powered-by"]).toBeUndefined();
  });
});

test.describe("interactions", () => {
  test("theme toggle switches between light and dark", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/);
    await page.getByRole("button", { name: /switch to dark theme/i }).click();
    await expect(html).toHaveClass(/dark/);
    await page.reload();
    await expect(html).toHaveClass(/dark/);
  });

  test("system dark preference is respected", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("command palette opens with Ctrl+K and navigates", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard shortcut is a desktop feature");
    await page.goto("/");
    // Wait for hydration: the shortcut listener is attached client-side.
    await expect(page.getByRole("button", { name: /switch to (dark|light) theme/i })).toBeVisible();
    await page.keyboard.press("Control+k");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await page.keyboard.type("hearme");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/projects\/hearme$/);
  });

  test("mobile menu opens, navigates and closes", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile only");
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await toggle.click();
    const nav = page.getByRole("navigation", { name: "Mobile" });
    await expect(nav).toBeVisible();
    await nav.getByRole("link", { name: "Projects" }).click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(nav).toBeHidden();
  });

  test("no horizontal overflow at common widths", async ({ page }) => {
    for (const width of [360, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of ["/", "/projects", "/projects/hearme"]) {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `${path} @ ${width}px`).toBeLessThanOrEqual(0);
      }
    }
  });
});
