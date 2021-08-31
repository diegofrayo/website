import React, { useState, Fragment, useEffect, useRef, useCallback } from "react";
import ReactDiffViewer from "react-diff-viewer";

import { Button, Space, Title } from "~/components/primitive";
import { Emoji } from "~/components/pages/_shared";
import { useDidMount } from "~/hooks";
import { T_ReactElement } from "~/types";
import { downloadComponentAsImage } from "~/utils/browser";

function Texts(): T_ReactElement {
  const {
    // states
    baseText,
    setBaseText,
    newText,
    setNewText,

    // refs
    correctionsContainerRef,
  } = useController();

  return (
    <div>
      <div className="sm:tw-flex sm:tw-flex-nowrap">
        <div className="tw-w-full sm:tw-w-1/2">
          <TextArea title="Diego" text={baseText} setText={setBaseText} />
        </div>
        <hr className="tw-h-px tw-my-6 sm:tw-w-px sm:tw-inline-block sm:tw-mx-2 tw-border-0" />
        <div className="tw-w-full sm:tw-w-1/2">
          <TextArea title="Evan" text={newText} setText={setNewText} />
        </div>
      </div>

      <Space size={6} variant={Space.variant.DASHED} />

      <section>
        <Title is="h2" className="tw-mb-4">
          Corrections
        </Title>
        <div className="tw-border-4 tw-border-black dark:tw-border-white tw-p-2">
          {!baseText && !newText ? (
            <p>
              <Emoji>🤷‍♂️</Emoji> <span>Nothing to compare...</span>
            </p>
          ) : (
            <Fragment>
              <div ref={correctionsContainerRef}>
                <ReactDiffViewer
                  oldValue={baseText}
                  newValue={newText}
                  showDiffOnly={false}
                  splitView={false}
                  styles={{
                    variables: {
                      light: {
                        diffViewerBackground: "white",
                        diffViewerColor: "black",
                      },
                    },
                  }}
                />
              </div>
              <Button
                className="tw-font-bold tw-mt-2 tw-mx-auto tw-block"
                onClick={() => {
                  downloadComponentAsImage(correctionsContainerRef.current, "diff");
                }}
              >
                <Emoji className="tw-mr-1">⬇️</Emoji>download as image
              </Button>
            </Fragment>
          )}
        </div>
      </section>
    </div>
  );
}

export default Texts;

// --- Controller ---

function useController() {
  const [baseText, setBaseText] = useState("");
  const [newText, setNewText] = useState("");
  const correctionsContainerRef = useRef<HTMLDivElement | null>(null);

  return {
    // states
    baseText,
    setBaseText,
    newText,
    setNewText,

    // refs
    correctionsContainerRef,
  };
}

// --- Components ---

function TextArea({ title, text, setText }) {
  const [isEditable, setIsEditable] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const saveOnLocalStorage = useCallback(() => {
    window.localStorage.setItem(`TEXT_${title}`.toUpperCase(), text);
  }, [text, title]);
  const interval = useRef<NodeJS.Timeout | null>(null);

  useDidMount(() => {
    setText(window.localStorage.getItem(`TEXT_${title}`.toUpperCase()) || text);

    return () => {
      window.onbeforeunload = null;
    };
  });

  useEffect(() => {
    if (!isEditable || !textareaRef.current) {
      if (interval.current) {
        clearInterval(interval.current);
      }

      window.onbeforeunload = null;
      return;
    }

    textareaRef.current.focus();
    textareaRef.current.select();
    window.onbeforeunload = () => "";
  }, [isEditable, interval]);

  useEffect(() => {
    if (!isEditable || interval.current) return;

    interval.current = setInterval(() => {
      saveOnLocalStorage();
    }, 5000);
  }, [text, isEditable, title, setText, saveOnLocalStorage, interval]);

  function onTextareaChange(e) {
    setText(e.currentTarget.value);
  }

  function onSaveHandler() {
    setIsEditable(false);
    saveOnLocalStorage();
  }

  return (
    <section className="tw-flex tw-flex-col tw-h-72">
      <Title is="h2" className="tw-mb-4">
        {title}
      </Title>

      <div className="tw-flex-1 tw-overflow-auto">
        {isEditable ? (
          <Fragment>
            <textarea
              value={text}
              className="tw-h-52 tw-block tw-w-full tw-p-4 tw-resize-none tw-border dfr-border-color-primary dark:dfr-border-color-primary"
              onChange={onTextareaChange}
              ref={textareaRef}
              autoFocus
            />
            <div className="tw-text-right tw-mt-1">
              <Button
                className="tw-mr-2"
                onClick={() => {
                  const closeEditableMode = confirm("Are you sure?");

                  if (closeEditableMode) {
                    setIsEditable(false);
                  }
                }}
              >
                cancel
              </Button>
              <Button className="tw-font-bold" onClick={onSaveHandler}>
                save
              </Button>
            </div>
          </Fragment>
        ) : (
          <pre
            className="tw-h-full tw-cursor-pointer tw-whitespace-pre-line tw-break-words"
            onClick={() => {
              setIsEditable(true);
            }}
          >
            {text || "Click to start to write..."}
          </pre>
        )}
      </div>
    </section>
  );
}
