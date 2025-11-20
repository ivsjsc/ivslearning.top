import asyncio
import time
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Generate a unique email using the current timestamp
        unique_email = f"test_{int(time.time())}@example.com"
        password = "password123"

        # Listen for console errors
        page.on("console", lambda msg: print(f"Console error: {msg.text}") if msg.type == "error" else None)

        try:
            # --- REGISTRATION ---
            print(f"Attempting to register with new user: {unique_email}")
            await page.goto("http://localhost:8000/auth.html")

            # Click link to switch to registration form
            await page.click("#toggle-form")
            await expect(page.locator("#register-form")).to_be_visible()

            # Fill in the registration form
            await page.fill("#register-email", unique_email)
            await page.fill("#register-password", password)
            await page.click("#register-form button[type='submit']")

            # Wait for navigation to the dashboard
            await page.wait_for_url("**/dashboard.html", timeout=10000)
            await expect(page.locator("h1")).to_contain_text("Dashboard")
            print("Registration successful. Dashboard loaded.")

            # --- LOGOUT ---
            # For this test, we assume logout is handled by the app's UI, which might not be present in the test environment.
            # A full test would click a logout button. Here, we'll just navigate away and clear state.
            await page.goto("http://localhost:8000/auth.html")

            # --- LOGIN ---
            print(f"Attempting to log in with new user: {unique_email}")
            await expect(page.locator("#login-form")).to_be_visible()

            # Fill in the login credentials
            await page.fill("#login-email", unique_email)
            await page.fill("#login-password", password)
            await page.click("#login-form button[type='submit']")

            # Wait for navigation back to the dashboard
            await page.wait_for_url("**/dashboard.html", timeout=10000)
            await expect(page.locator("h1")).to_contain_text("Dashboard")
            print("Login successful after registration.")

        except Exception as e:
            print(f"An error occurred: {e}")
            await page.screenshot(path="login_test_error.png")
            print("Screenshot saved to login_test_error.png")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
