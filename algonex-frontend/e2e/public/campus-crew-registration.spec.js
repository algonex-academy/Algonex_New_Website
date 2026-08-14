import { test, expect } from "@playwright/test";

test.describe("Campus Crew Registration Experience", () => {
  test("selection page renders with approved brand copy and options", async ({ page }) => {
    await page.goto("/campus-crew/register");

    await expect(page.getByText("ALGONEX CAMPUS CREW")).toBeVisible();
    await expect(page.getByText("Building India's Industry-to-Campus Innovation Network")).toBeVisible();
    await expect(page.getByText("Learn. Build. Innovate. Connect. Lead.")).toBeVisible();

    await expect(page.getByRole("heading", { name: "I'm a Student" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "I Represent a College" })).toBeVisible();
  });

  test("student registration flow succeeds and displays reference ID", async ({ page }) => {
    await page.goto("/campus-crew/register/student");

    await expect(page.getByRole("heading", { name: "Join Algonex Campus Crew" })).toBeVisible();

    // Fill form
    await page.fill('input[name="full_name"]', "Aarav Gupta");
    await page.fill('input[name="email"]', "aarav.gupta@example.com");
    await page.fill('input[name="phone"]', "+919876543219");
    await page.fill('input[name="college_name"]', "RV College of Engineering");
    await page.fill('input[name="department"]', "Computer Science");
    await page.selectOption('select[name="year_of_study"]', "3rd Year");
    await page.selectOption('select[name="student_primary_interest"]', "AI");
    await page.check('input[name="privacy_acknowledged"]');

    await page.click('button[type="submit"]');

    // Success screen check
    await expect(page.getByRole("heading", { name: "You're in!" })).toBeVisible();
    await expect(page.getByText("ACC-S-")).toBeVisible();
  });

  test("college inquiry flow succeeds and displays reference ID", async ({ page }) => {
    await page.goto("/campus-crew/register/college");

    await expect(page.getByRole("heading", { name: "Bring Algonex Campus Crew to Your Campus" })).toBeVisible();

    // Fill form
    await page.fill('input[name="institution_name"]', "PES University");
    await page.fill('input[name="full_name"]', "Prof. Ramesh Kumar");
    await page.fill('input[name="designation"]', "Placement Director");
    await page.fill('input[name="official_email"]', "ramesh@pes.edu");
    await page.fill('input[name="phone"]', "+919876543220");
    await page.fill('input[name="city"]', "Bengaluru");
    await page.selectOption('select[name="college_primary_interest"]', "Campus Crew chapter");
    await page.check('input[name="authority_confirmed"]');
    await page.check('input[name="privacy_acknowledged"]');

    await page.click('button[type="submit"]');

    // Success screen check
    await expect(page.getByRole("heading", { name: "Request received" })).toBeVisible();
    await expect(page.getByText("ACC-C-")).toBeVisible();
  });
});
