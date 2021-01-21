import React from "react";

export function HSTMain() {
  return (
    <main role="main" className="root tw-bg-white dark:tw-bg-gray-400 tw-border">
      <header className="tw-bg-gray-200 dark:tw-bg-gray-600 tw-text-center tw-p-2">
        <h1>header</h1>
        <nav>
          <ul>
            <li className="tw-inline-block tw-mr-1">
              <a href="/page-1">Page 1</a>
            </li>
            <li className="tw-inline-block tw-mr-1">
              <a href="/page-2">Page 2</a>
            </li>
            <li className="tw-inline-block tw-mr-1">
              <a href="/page-3">Page 3</a>
            </li>
          </ul>
        </nav>
      </header>
      <div className="tw-flex tw-p-3">
        <aside className="tw-w-2/5 tw-pr-2">
          <h2>Aside</h2>
          <section className="tw-border tw-p-2">
            <h2>News</h2>
            <div>content...</div>
          </section>
          <hr className="tw-my-3 tw-border-0" />
          <section className="tw-border tw-p-2">
            <h2>Links</h2>
            <div>content...</div>
          </section>
        </aside>
        <section className="tw-w-3/5 tw-pl-2">
          <h2>Main content</h2>
          <article className="tw-border tw-p-2">
            <header>
              <h1>article header</h1>
            </header>
            <div>
              <p>article content</p>
            </div>
            <footer className="tw-mt-4 tw-text-sm tw-bg-black tw-p-1 tw-text-center tw-text-white">
              article footer
            </footer>
          </article>
          <hr className="tw-my-3 tw-border-0" />
          <article className="tw-border tw-p-2">
            <header>
              <h1>article header</h1>
            </header>
            <div>
              <p>article content</p>
            </div>
            <footer className="tw-mt-4 tw-text-sm tw-bg-black tw-p-1 tw-text-center tw-text-white">
              article footer
            </footer>
          </article>
        </section>
      </div>
      <footer className="tw-bg-black tw-p-2 tw-text-white tw-text-center tw-mt-6">
        footer
      </footer>

      <style jsx>
        {`
          .root {
            min-width: 500px;
          }
        `}
      </style>
    </main>
  );
}
