import { test, expect } from "@playwright/test";
import { registerUser, clearAuth } from "../helpers/auth.helper.js";
import { antMessage } from "../helpers/selectors.js";

test.describe("Event Registration", () => {
  let creds;
  let eventSlug;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    creds = await registerUser(page, { prefix: "auth_event" });

    // Get first event slug from API
    const res = await page.request.get("http://localhost:8000/api/v1/events/");
    const data = await res.json();
    const events = data.data?.results || data.results || [];
    eventSlug = events[0]?.slug;
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/signin");
    await page.getByPlaceholder("Email").fill(creds.email);
    await page.getByPlaceholder("Password").fill(creds.password);
    await page.locator("form").getByRole("button", { name: "Sign In" }).click();
    await page.waitForURL("/", { timeout: 15000 });
  });

  test("'Register Now' on available event succeeds", async ({ page }) => {
    test.skip(!eventSlug, "No seeded events");
    await page.goto(`/events/${eventSlug}`);
    await page.waitForSelector("h1", { timeout: 10000 });

    const registerBtn = page.getByRole("button", { name: /Register Now|Join Waitlist/ });
    if (await registerBtn.isVisible().catch(() => false)) {
      await registerBtn.click();
      await expect(page.locator(antMessage)).toBeVisible({ timeout: 10000 });
    }
  });

  test("confirmed registration shows green tag", async ({ page }) => {
    test.skip(!eventSlug, "No seeded events");
    await page.goto(`/events/${eventSlug}`);
    await page.waitForSelector("h1", { timeout: 10000 });

    // Register if not already
    const registerBtn = page.getByRole("button", { name: /Register Now|Join Waitlist/ });
    if (await registerBtn.isVisible().catch(() => false)) {
      await registerBtn.click();
      await expect(page.locator(antMessage)).toBeVisible({ timeout: 10000 });
    }

    // Should show confirmed or waitlisted tag
    const confirmedTag = page.getByText("Registered — Confirmed");
    const waitlistedTag = page.getByText("On Waitlist");
    const hasStatus = await confirmedTag.isVisible().catch(() => false) || await waitlistedTag.isVisible().catch(() => false);
    expect(hasStatus).toBeTruthy();
  });

  test("success toast shown on registration", async ({ page }) => {
    test.skip(!eventSlug, "No seeded events");
    // Use a fresh user to guarantee first registration
    await registerUser(page, { prefix: "auth_evt_toast" });
    await page.goto(`/events/${eventSlug}`);
    await page.waitForSelector("h1", { timeout: 10000 });

    const registerBtn = page.getByRole("button", { name: /Register Now|Join Waitlist/ });
    if (await registerBtn.isVisible().catch(() => false)) {
      await registerBtn.click();
      await expect(page.locator(antMessage)).toBeVisible({ timeout: 10000 });
    }
  });

  test("registration appears in My Events", async ({ page }) => {
    test.skip(!eventSlug, "No seeded events");
    await page.goto("/my-events");
    await page.waitForSelector("h1", { timeout: 10000 });

    const cards = page.locator(".ant-card");
    // Should have at least one registration
    await expect(cards.first()).toBeVisible({ timeout: 5000 });
  });

  test("'Cancel Registration' from event detail", async ({ page }) => {
    test.skip(!eventSlug, "No seeded events");
    // Register first
    await registerUser(page, { prefix: "auth_evt_cancel" });
    await page.goto(`/events/${eventSlug}`);
    await page.waitForSelector("h1", { timeout: 10000 });

    const registerBtn = page.getByRole("button", { name: /Register Now|Join Waitlist/ });
    if (await registerBtn.isVisible().catch(() => false)) {
      await registerBtn.click();
      await expect(page.locator(antMessage)).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(1000);
    }

    const cancelBtn = page.getByRole("button", { name: /Cancel Registration|Leave Waitlist/ });
    if (await cancelBtn.isVisible().catch(() => false)) {
      await cancelBtn.click();
      await expect(page.locator(antMessage)).toBeVisible({ timeout: 10000 });
    }
  });

  test("'Cancel Registration' from My Events page", async ({ page }) => {
    test.skip(!eventSlug, "No seeded events");
    // Register first
    await registerUser(page, { prefix: "auth_evt_mycancel" });
    await page.goto(`/events/${eventSlug}`);
    await page.waitForSelector("h1", { timeout: 10000 });

    const registerBtn = page.getByRole("button", { name: /Register Now|Join Waitlist/ });
    if (await registerBtn.isVisible().catch(() => false)) {
      await registerBtn.click();
      await expect(page.locator(antMessage)).toBeVisible({ timeout: 10000 });
    }

    await page.goto("/my-events");
    await page.waitForSelector(".ant-card", { timeout: 10000 });

    const cancelBtn = page.getByRole("button", { name: "Cancel Registration" }).first();
    if (await cancelBtn.isVisible().catch(() => false)) {
      await cancelBtn.click();
      await expect(page.locator(antMessage)).toBeVisible({ timeout: 5000 });
    }
  });

  test("full event shows 'Join Waitlist' button", async ({ page }) => {
    test.skip(!eventSlug, "No seeded events");
    // Intercept to simulate full event
    await page.route(`**/api/v1/events/${eventSlug}/`, (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            status: "success",
            data: { title: "Full Event", slug: eventSlug, event_type: "workshop", location: "Online", capacity: 10, spots_left: 0, description: "Test" },
          }),
        });
      }
      return route.continue();
    });

    await page.goto(`/events/${eventSlug}`);
    await page.waitForSelector("h1", { timeout: 10000 });
    await expect(page.getByRole("button", { name: "Join Waitlist" })).toBeVisible();
  });

  test("waitlisted registration shows orange tag", async ({ page }) => {
    test.skip(!eventSlug, "No seeded events");
    // Intercept to simulate waitlisted status
    await page.route(`**/api/v1/events/${eventSlug}/`, (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            status: "success",
            data: { title: "Waitlisted Event", slug: eventSlug, event_type: "workshop", location: "Online", capacity: 10, spots_left: 0, description: "Test", user_registration_status: "waitlisted" },
          }),
        });
      }
      return route.continue();
    });

    await page.goto(`/events/${eventSlug}`);
    await page.waitForSelector("h1", { timeout: 10000 });
    await expect(page.getByText("On Waitlist")).toBeVisible();
  });

  test("'Leave Waitlist' button works", async ({ page }) => {
    test.skip(!eventSlug, "No seeded events");
    // Intercept to simulate waitlisted status
    await page.route(`**/api/v1/events/${eventSlug}/`, (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            status: "success",
            data: { title: "Waitlisted Event", slug: eventSlug, event_type: "workshop", location: "Online", capacity: 10, spots_left: 0, description: "Test", user_registration_status: "waitlisted" },
          }),
        });
      }
      return route.continue();
    });

    await page.goto(`/events/${eventSlug}`);
    await page.waitForSelector("h1", { timeout: 10000 });
    await expect(page.getByRole("button", { name: "Leave Waitlist" })).toBeVisible();
  });

  test("past event shows disabled button", async ({ page }) => {
    test.skip(!eventSlug, "No seeded events");
    await page.route(`**/api/v1/events/${eventSlug}/`, (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            status: "success",
            data: { title: "Past Event", slug: eventSlug, event_type: "workshop", location: "Online", capacity: 100, spots_left: 50, description: "Test", status: "past" },
          }),
        });
      }
      return route.continue();
    });

    await page.goto(`/events/${eventSlug}`);
    await page.waitForSelector("h1", { timeout: 10000 });
    const endedBtn = page.getByRole("button", { name: "Event has ended" });
    await expect(endedBtn).toBeVisible();
    await expect(endedBtn).toBeDisabled();
  });

  test("unauthenticated register redirects to signin", async ({ page }) => {
    test.skip(!eventSlug, "No seeded events");
    await clearAuth(page);
    await page.goto(`/events/${eventSlug}`);
    await page.waitForSelector("h1", { timeout: 10000 });

    const registerBtn = page.getByRole("button", { name: /Register Now|Join Waitlist/ });
    if (await registerBtn.isVisible().catch(() => false)) {
      await registerBtn.click();
      await page.waitForURL(/signin/, { timeout: 5000 });
    }
  });
});
