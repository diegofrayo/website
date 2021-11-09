import * as React from "react";

import { T_ReactElement } from "~/types";

export function Main(): T_ReactElement {
  return (
    <main role="main" className="tw-bg-white dark:tw-bg-gray-400" style={{ minWidth: 500 }}>
      <header className="dfr-bg-secondary dark:tw-bg-gray-600 tw-text-center tw-p-2">
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
      <footer className="tw-bg-black tw-p-2 tw-text-white tw-text-center tw-mt-6">footer</footer>
    </main>
  );
}

export function Texts(): T_ReactElement {
  return (
    <section>
      <h2>text elements</h2>

      <div>
        <p>
          Simple text and <b>Bold text</b> and <strong>Important text</strong> and{" "}
          <i>Italic text</i> <em>Emphasized text</em> and <mark>Marked text</mark> and{" "}
          <small>Smaller text</small> and <del>Deleted text</del> and <ins>Inserted text</ins> and{" "}
          <sub>Subscript text</sub> and <sup>Superscript text</sup>.
        </p>

        <br />

        <p>
          This is a time (<time>21:00</time>) element.
        </p>

        <br />

        <address>Address element: Street, City, State, Country.</address>

        <br />

        <p>
          longlonglonglong
          <wbr />
          ThisIsUnbreakable
          <wbr />
          longlonglonglong
        </p>
      </div>
    </section>
  );
}

export function Measure(): T_ReactElement {
  return (
    <div>
      <p>Donuts eaten:</p>
      <progress value="60" max="100" />

      <p>
        Karma points:{" "}
        <meter optimum={30} high={80} max="100" value="85">
          85%
        </meter>
      </p>
      <p>
        Gas in Tanker:{" "}
        <meter low={20} max="100" value="11">
          11%
        </meter>
      </p>
      <p>
        Animals Petted:{" "}
        <meter low={10} high={60} min="0" max="50" value="43" title="Animals">
          Petting
        </meter>
      </p>
      <p>
        Satisfaction:{" "}
        <meter max="100" optimum={100} value="100">
          100%
        </meter>
      </p>
    </div>
  );
}
