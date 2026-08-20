## Summary

Rendering the feature component directly (`[slug].page.tsx`) with RTL is the right call, not spinning up the full Next.js app. `src/pages/blog/[slug].ts` is just a thin re-export plus `getStaticProps`/`getStaticPaths` — those are build-time data-fetching functions, not part of the render tree. Your Playwright e2e suite already covers the full-stack path (real server, real routing, real build). An RTL integration test's job is different: verify the component renders correctly _given_ props, fast and in-process. I replicated the `getStaticProps` data-loading step (read the JSON, compile the MDX) manually in the test rather than invoking Next's lifecycle, which is exactly the pattern the task described.

## What I built (first test case)

- `tests/integration/tests/blog-post.test.tsx` — renders `BlogPostPage` with real data read from `sitios-para-visitar-en-el-quindio.json`, mocks a Pages-Router `NextRouter` context, and asserts the "Send a comment via e-mail" link's exact `mailto:` href.
- `tests/integration/global-setup.ts` — pre-compiles the post's MDX content once, in plain Node (before jsdom is installed). This was required because `mdx-bundler`'s `esbuild` dependency crashes if invoked from inside the jsdom-patched environment (its `TextEncoder`/`Uint8Array` realm differs from Node's) — I hit and fixed that.
- `tests/integration/support/render-with-router.tsx` — a `renderWithRouter` helper providing a mock `NextRouter` via `RouterContext.Provider`, needed because `Header` calls `useRouter()`.
- `vitest.integration.config.ts` — loads `.env` (env vars like `NEXT_PUBLIC_WEBSITE_URL` are required at import time by `src/constants/env.ts`) and pins jsdom's origin to `https://website.local` so the computed `mailto:` body matches your expected value exactly.

## Mocking AnalyticsService

Approach: `AnalyticsService` is a singleton instance, and `trackClickEvent(name, data)` just returns a closure that calls `this.trackEvent(name, data)` — looked up dynamically at click time (thanks to `auto-bind`). So the reliable way to verify it fires is `vi.spyOn(AnalyticsService, "trackEvent")` set up before the click (order relative to render doesn't matter, since the lookup happens when the click handler actually runs) — spying on `trackClickEvent` wouldn't work here because that's called during render, before you'd get a chance to attach the spy.

Changes:

- `tests/integration/tests/blog-post.test.tsx` — extended the same test: spies on `AnalyticsService.trackEvent`, clicks the link with `userEvent.click`, then asserts it was called with `("BLOG|SEND_EMAIL", { post: post.details.title })`.
- `tests/integration/setup.ts` — added `vi.restoreAllMocks()` to the shared `afterEach`, so spies from any test don't leak into the next one.

Didn't need to mock the implementation — `trackEvent` internally checks `!window.rybbit` first and short-circuits before touching anything jsdom can't provide, so the spy can just record the call and let it run through.
