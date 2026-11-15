import { expect, test } from "@playwright/test";

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

test.describe("admin", () => {
  test("redirects anonymous visitors to the login page", async ({ page }) => {
    await page.goto("/admin/projects");
    await expect(page).toHaveURL(/\/admin\/login$/);
    await expect(page.getByRole("heading", { name: "Admin sign in" })).toBeVisible();
  });

  test("rejects wrong credentials", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill("nobody@example.com");
    await page.getByLabel("Password").fill("wrong-password-123");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.locator("form").getByRole("alert")).toHaveText("Invalid email or password.");
  });

  test("admin can sign in, see the dashboard and messages", async ({ page }) => {
    test.skip(!email || !password, "ADMIN_EMAIL / ADMIN_PASSWORD not set");
    // Multi-page flow; every admin page renders at request time.
    test.setTimeout(90_000);
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill(email!);
    await page.getByLabel("Password").fill(password!);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
    await expect(page.getByText(/Content to fill in/)).toBeVisible();

    const adminNav = page.getByRole("navigation", { name: "Admin" });
    await adminNav.getByRole("link", { name: "Projects", exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/projects$/);
    await expect(page.getByRole("link", { name: "HearMe", exact: true })).toBeVisible();

    await adminNav.getByRole("link", { name: "Messages", exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/messages$/, { timeout: 20_000 });
    await expect(page.getByRole("heading", { name: "Messages" })).toBeVisible();

    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/admin\/login$/);
  });
});
