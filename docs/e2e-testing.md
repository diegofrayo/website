Playwright is already sitting in your `package.json` (via `playwright` and `@vitest/browser-playwright`, pulled in for Storybook's browser-mode testing), so there's no fresh tooling to introduce — that alone tips the scale.

## 1. Playwright over Cypress

For a Next.js app specifically, Playwright fits better beyond just being already installed:

- Runs Chromium/Firefox/WebKit from one config — Cypress is Chromium-family-first, WebKit support is weaker.
- Faster startup and parallelization, better CI story (no separate Electron runner process).
- `page.on('pageerror')`, `page.on('console')`, and `page.on('response')` give you exactly the low-level hooks you need for "did this page render cleanly" — Cypress makes this awkward since it runs your test code inside the browser context alongside the app.
- Since it's already a dependency, you skip the "which tool to add" conversation with lint-staged/CI config entirely.

## 2. Assertion strategy — skip snapshots and screenshots, listen for errors instead

For "just verify no rendering errors," DOM snapshots and screenshot diffing are the wrong tool, even though they're the first things that come to mind:

- **HTML/DOM snapshot testing**: brittle for content-heavy pages (blog posts, resume). Any copy edit breaks the test with zero relation to an actual bug — you'd be updating snapshots constantly instead of getting signal.
- **Screenshot diffing**: same problem plus font-rendering/animation/image-loading flakiness across CI vs. local. It answers "did anything visually change" (regression testing), not "did the page crash" (your actual goal). Worth adding later as a separate concern, not as your primary assertion.

What actually detects rendering errors, per page:

```ts
test("renders /resume without errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("response", (res) => {
    if (res.url() === page.url() && res.status() >= 400) {
      errors.push(`HTTP ${res.status()} on ${res.url()}`);
    }
  });

  await page.goto("/resume");
  await expect(page.locator("#__next")).not.toBeEmpty(); // caught a silent mount failure

  expect(errors).toEqual([]);
});
```
