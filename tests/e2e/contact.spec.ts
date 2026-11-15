import { expect, test } from "@playwright/test";

test.describe("contact form", () => {
  test("shows inline validation errors", async ({ page }) => {
    await page.goto("/#contact");
    const form = page.locator("section#contact form");
    await form.getByRole("button", { name: /send message/i }).click();
    await expect(form.getByText("Please enter your name.")).toBeVisible();
    await expect(form.getByText("Please enter a valid email address.")).toBeVisible();
    await expect(form.getByLabel("Name")).toHaveAttribute("aria-invalid", "true");
  });

  test("submits a valid message through the Edge Function", async ({ page }) => {
    await page.goto("/#contact");
    const form = page.locator("section#contact form");
    await form.getByLabel("Name").fill("Playwright Test");
    await form.getByLabel("Email").fill(`e2e+${Date.now()}@example.com`);
    await form.getByLabel("Message").fill("Hello from the end-to-end test suite!");
    // The server rejects submissions faster than a human (3s) as spam.
    await page.waitForTimeout(3200);
    await form.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByText("Message sent — thank you!")).toBeVisible({ timeout: 15_000 });
  });
});
