from playwright.sync_api import sync_playwright

def capture_mobile_view():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # iPhone 12 Pro viewport
        page = browser.new_page(viewport={"width": 390, "height": 844}, user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1')

        try:
            # Capture Homepage
            page.goto("http://localhost:8000/index.html", wait_until="networkidle")
            page.screenshot(path="verification/homepage_mobile_before.png", full_page=True)
            print("Captured Homepage")

            # Capture Courses
            page.goto("http://localhost:8000/courses.html", wait_until="networkidle")
            page.screenshot(path="verification/courses_mobile_before.png", full_page=True)
            print("Captured Courses")

            # Capture Menu Open State
            page.goto("http://localhost:8000/index.html", wait_until="networkidle")
            # Try to click menu button if it exists
            if page.locator("#mobile-menu-toggle").is_visible():
                page.click("#mobile-menu-toggle")
                page.wait_for_timeout(500) # Animation
                page.screenshot(path="verification/menu_mobile_before.png")
                print("Captured Menu")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    capture_mobile_view()
