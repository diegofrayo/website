---
name: integration-test-steps
description: Refactors integration test files (tests/integration/tests/*.test.tsx) so each `it()` body reads as a numbered sequence of steps instead of inline implementation details. Use this skill when writing a new integration test, or when asked to refactor/clean up an existing one. Triggers on requests like "refactor this test", "extract helper functions from this test", "make this test read as steps", "clean up this test file", or any task that involves restructuring a Vitest + React Testing Library integration test for readability. Apply these guidelines proactively — don't wait to be asked.
---

# Integration Test Steps

The goal is that reading an `it()` body top-to-bottom reads like a short narrative — arrange, then a numbered list of steps — with query/assertion/interaction details hidden behind well-named helper functions. Nobody should need to read a helper's implementation to understand what a test does; the name should be enough.

## Test Body Shape

```ts
it("does something", async () => {
	// arrange: setup that doesn't need its own step number
	navigateTo(`/blog/${SLUG}`);
	renderWithRouter(<Page data={getPageData(SLUG)} />, { pathname: Routes.X });
	const trackEventSpy = spyAnalyticsService();
	const $link = getSomeLink();

	// step 1: check that the href value is right
	assertSomething($link);

	// step 2: click the link and check the analytics event is tracked
	await clickLinkAndAssertAnalyticsEvent($link, trackEventSpy);
});
```

- **Arrange lines stay inline, uncommented.** Navigating, rendering the page, setting up spies/mocks, and querying the elements the test will act on are all "given" state — they don't get a `// step N` comment or get extracted into a step helper. They may still call shared setup helpers (see Shared vs. Local Helpers below).
- **Every distinct behavioral step gets a `// step N: description` comment**, numbered from 1, directly above the line(s) that perform it. A step is usually one call, but can be a couple of tightly related lines (e.g., a click immediately followed by the assertion it causes).
- Comments are `// step 1: <description>`, `// step 2: <description>`, ... — lowercase, no trailing punctuation. The description is a brief, plain-English statement of what the step verifies or does (e.g. `check that the href value is right`, `click the link and check the analytics event is tracked`) — it should read naturally next to the helper call below it, not just repeat the function name.

## Helper Naming

Each helper name should read as an action or a claim, using one of these prefixes:

- **`get*`** — queries and returns a DOM element (or list). Wraps `screen.getByRole`, `within(...).getByText`, etc. Example: `getSendCommentLink()`, `getProjectModal()`.
- **`assert*`** — runs one or more `expect(...)` calls, returns nothing. Example: `assertMailtoHref($link)`, `assertNoProjectModalIsOpen()`.
- **`click*And*`** — performs a `userEvent` interaction and immediately asserts its direct effect, when the click and its expected result are one conceptual step. Example: `clickLinkAndAssertAnalyticsEvent($link, trackEventSpy)`. If the interaction and its assertion are two separate steps in the narrative, split them into a plain interaction (inline `await userEvent.click(...)`) and a separate `assert*` helper instead of forcing them into one function.
- **`mock*`** — stubs a browser API and returns the spy, so it can be asserted on later. Example: `mockClipboardWriteText()`.
- **`navigateTo` / `render*`** — page-level setup. Example: `navigateTo(url)`, `renderPortfolioPage()`.

Never name a helper after the test case number or generically (`step1`, `doTest1Thing`, `helper1`). The name must describe _what_ it does, not _which test_ it belongs to.

## File Layout

```
import ... // libraries first, then app imports, then support imports

describe("PageName", () => {
	it("test case 1", async () => { ... });
	it("test case 2", async () => { ... });
});

// --- test 1 helpers ---

function getX() { ... }
function assertY() { ... }

// --- test 2 helpers ---

function getZ() { ... }
function assertW() { ... }
```

- All `it()` blocks stay together inside the top `describe`, so the file opens with the pure narrative — no helper code between test cases.
- Helpers live below the `describe` block, grouped under `// --- test N helpers ---` section comments (lowercase, matching the existing dashed-comment style used elsewhere in this codebase, e.g. `src/api/**` `// --- TYPES ---` sections). Order sections in the same order the tests appear.
- A helper used by only one test goes under that test's section, even if a near-identical one exists under another test's section — don't force premature sharing across tests in the same file.

## Shared vs. Local Helpers

- If a helper is generic enough to be reused by _other test files_ (not just other tests in the same file) — e.g. rendering a page with router context, faking fixture data, spying on a shared service, mocking a browser API like `navigator.clipboard` — put it in `tests/integration/support/test-utils.ts` and import it, instead of redefining it locally.
- If a helper only makes sense for one page/component's tests (querying that page's specific DOM, asserting on that page's specific copy), keep it local at the bottom of that test file.
- `tests/integration/support/render-with-router.tsx` already holds the router-mocking helper — follow that file's pattern (one focused export per concern) when adding to `test-utils.ts`.

## Shared Types

If the same derived/union type shows up more than once across a test file (e.g. `(typeof LIST_A)[number] | (typeof LIST_B)[number]`), export a named type from the source module the lists come from (e.g. `export type Project = ...` next to `PROFESSIONAL_PROJECTS`/`SIDE_PROJECTS`) and import that type, rather than repeating the inline derivation at every usage site.

## Worked Example

Before:

```ts
it("copies the current URL to the clipboard...", async () => {
	window.history.pushState({}, "", `/blog/${SLUG}`);
	const trackEventSpy = vi.spyOn(AnalyticsService, "trackEvent");
	const writeTextSpy = vi.fn().mockResolvedValue(undefined);
	Object.defineProperty(navigator, "clipboard", {
		value: { writeText: writeTextSpy },
		configurable: true,
	});
	renderWithRouter(<BlogPostPage data={getBlogPostData(SLUG)} />, { pathname: `${Routes.BLOG}/${SLUG}` });
	const button = screen.getAllByRole("button", { name: "Copy URL" }).find((el) => el.tagName === "BUTTON") as HTMLElement;
	await userEvent.click(button);
	expect(writeTextSpy).toHaveBeenCalledWith(window.location.href);
	expect(trackEventSpy).toHaveBeenCalledWith("BLOG|COPY_URL", { post: post.details.title });
	expect(await screen.findByText("copied!")).toBeInTheDocument();
});
```

After:

```ts
it("copies the current URL to the clipboard...", async () => {
	navigateTo(`/blog/${SLUG}`);
	renderWithRouter(<BlogPostPage data={getBlogPostData(SLUG)} />, { pathname: `${Routes.BLOG}/${SLUG}` });
	const trackEventSpy = spyAnalyticsService();
	const writeTextSpy = mockClipboardWriteText();
	const $button = getCopyUrlButton();

	// step 1: click the button and check the URL is copied to the clipboard and the analytics event is tracked
	await clickButtonAndAssertClipboardWrite($button, writeTextSpy);
	assertCopyUrlAnalyticsEvent(trackEventSpy);

	// step 2: check the "copied!" popover is shown
	await assertCopiedPopoverIsShown();
});
```

`navigateTo` and `spyAnalyticsService` and `mockClipboardWriteText` moved to `test-utils.ts` because they're generic; `getCopyUrlButton`, `clickButtonAndAssertClipboardWrite`, `assertCopyUrlAnalyticsEvent`, `assertCopiedPopoverIsShown` stay local under `// --- test 2 helpers ---` because they're specific to this page's markup and copy.
