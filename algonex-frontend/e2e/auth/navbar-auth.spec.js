import { test, expect } from "@playwright/test";
import { registerUser, logoutUser, clearAuth } from "../helpers/auth.helper.js";

test.describe("Navbar Authentication States", () => {
  test("unauthenticated: Sign In and Sign Up buttons shown", async ({ page }) => {
    await clearAuth(page);
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign Up" })).toBeVisible();
  });

  test("authenticated: avatar dropdown shown", async ({ page }) => {
    await registerUser(page, { prefix: "auth_nav", firstName: "NavUser" });
    // After register, already on "/" and logged in
    await expect(page.locator(".ant-avatar").first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("NavUser")).toBeVisible({ timeout: 5000 });
  });

  test("dropdown: Profile link → /profile", async ({ page }) => {
    await registerUser(page, { prefix: "auth_nav_prof" });
    await page.goto("/");

    // Open dropdown
    await page.locator(".ant-dropdown-trigger").first().click();
    await page.getByText("Profile").click();
    await page.waitForURL(/profile/);
  });

  test("dropdown: My Courses link → /my-courses", async ({ page }) => {
    await registerUser(page, { prefix: "auth_nav_courses" });
    await page.goto("/");

    await page.locator(".ant-dropdown-trigger").first().click();
    await page.getByText("My Courses").click();
    await page.waitForURL(/my-courses/);
  });

  test("dropdown: My Events link → /my-events", async ({ page }) => {
    await registerUser(page, { prefix: "auth_nav_events" });
    await page.goto("/");

    await page.locator(".ant-dropdown-trigger").first().click();
    await page.getByText("My Events").click();
    await page.waitForURL(/my-events/);
  });

  test("dropdown: My Applications link → /my-applications", async ({ page }) => {
    await registerUser(page, { prefix: "auth_nav_apps" });
    await page.goto("/");

    await page.locator(".ant-dropdown-trigger").first().click();
    await page.getByText("My Applications").click();
    await page.waitForURL(/my-applications/);
  });

  test("dropdown: Logout clears session", async ({ page }) => {
    await registerUser(page, { prefix: "auth_nav_logout" });
    await page.goto("/");

    await page.locator(".ant-dropdown-trigger").first().click();
    await page.getByText("Logout").click();

    // Should show Sign In button again
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible({ timeout: 5000 });

    // Verify tokens cleared
    const tokens = await page.evaluate(() => ({
      access: localStorage.getItem("access_token"),
      refresh: localStorage.getItem("refresh_token"),
    }));
    expect(tokens.access).toBeNull();
  });

  test("after logout, protected routes redirect", async ({ page }) => {
    await registerUser(page, { prefix: "auth_nav_logprot" });
    await logoutUser(page);

    await page.goto("/profile");
    await page.waitForURL(/signin/, { timeout: 5000 });
  });

  test("mobile: drawer shows auth links when logged in", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await registerUser(page, { prefix: "auth_nav_mobile" });
    await page.goto("/");

    // Open hamburger drawer
    await page.locator(".mobile-nav-trigger button").click();
    await expect(page.locator(".ant-drawer")).toBeVisible();

    await expect(page.getByText("Profile")).toBeVisible();
    await expect(page.getByText("My Courses")).toBeVisible();
    await expect(page.getByText("My Events")).toBeVisible();
    await expect(page.getByText("My Applications")).toBeVisible();
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
  });

  test("mobile: logout from drawer", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await registerUser(page, { prefix: "auth_nav_moblout" });

    await page.locator(".mobile-nav-trigger button").click();
    await expect(page.locator(".ant-drawer")).toBeVisible();

    await page.getByRole("button", { name: "Logout" }).click();

    // After logout, drawer closes and we should see Sign In
    await expect(page.locator(".ant-drawer-open")).not.toBeVisible({ timeout: 10000 });
  });
});
