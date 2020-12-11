import * as React from "react";

import { Page } from "~/components";
import { useDidMount } from "~/hooks";

function TextPage(): any {
  useDidMount(() => {
    const upper = document.querySelectorAll("textarea.upper")[0];
    const lower = document.querySelectorAll("textarea.lower")[0];
    const capitalize = document.querySelectorAll("textarea.capitalize")[0];
    const capOF = document.querySelectorAll("textarea.cap-of")[0];

    const onchange = event => {
      const text = event.currentTarget.value.toLowerCase();
      upper.innerHTML = text;
      lower.innerHTML = text;
      capitalize.innerHTML = text;
      capOF.innerHTML = text[0].toUpperCase() + text.substring(1);
    };

    document.getElementById("textarea").focus();
    document.getElementById("textarea").addEventListener("input", onchange);
  });

  return (
    <Page metadata={{ title: "Text transform tool", noRobots: true }}>
      <section id="container">
        <span id="textarea-label" className="upper">
          type your text
        </span>
        <textarea id="textarea"></textarea>
        <span className="upper">
          uppercase
          <button
            type="button"
            className="button"
            data-target="upper"
            data-clipboard-target=".upper"
          >
            copy
          </button>
        </span>
        <textarea readOnly className="upper"></textarea>

        <span className="lower">
          lowercase
          <button
            type="button"
            className="button"
            data-target="lower"
            data-clipboard-target=".lower"
          >
            copy
          </button>
        </span>
        <textarea readOnly className="lower"></textarea>

        <span className="capitalize">
          capitalize
          <button
            type="button"
            className="button"
            data-target="capitalize"
            data-clipboard-target=".capitalize"
          >
            copy
          </button>
        </span>
        <textarea readOnly className="capitalize"></textarea>

        <span>
          Capitalize only first word
          <button
            type="button"
            className="button"
            data-target="cap-of"
            data-clipboard-target=".cap-of"
          >
            copy
          </button>
        </span>
        <textarea readOnly className="cap-of"></textarea>
      </section>

      <style jsx>
        {`
          * {
            box-sizing: border-box;
            cursor: default;
            font-size: 1em;
          }

          body {
            background-color: #efefef;
            font-size: 18px;
            margin: 0;
            padding: 10px;
          }

          textarea {
            background-color: white;
            border: 1px solid #d8d8d8;
            display: block;
            margin-bottom: 50px;
            margin: 0 0 20px 0;
            min-height: 50px;
            padding: 10px;
            resize: none;
            width: 100%;
          }

          textarea:last-child {
            margin-bottom: 0;
          }

          span {
            display: block;
            font-weight: bold;
            margin-bottom: 5px;
          }

          button {
            background-color: transparent;
            cursor: pointer;
            font-size: 0.6em;
            font-weight: 100;
            margin-left: 5px;
            padding-bottom: 4px;
            position: relative;
            top: -1px;
            vertical-align: middle;
          }

          #container {
            background-color: #ffffff;
            border: 5px solid #424242;
            margin: 0 auto;
            max-width: 700px;
            padding: 10px;
            width: 100%;
          }

          #textarea-label {
            background-color: #424242;
            color: white;
            font-size: 1em;
            margin: 0;
            padding: 10px;
            text-align: center;
          }

          #textarea {
            display: block;
            height: 100px;
            margin-bottom: 50px;
            resize: none;
            width: 100%;
          }

          .upper {
            text-transform: uppercase;
          }

          .lower {
            text-transform: lowercase;
          }

          .capitalize {
            text-transform: capitalize;
          }
        `}
      </style>
    </Page>
  );
}

export default TextPage;
