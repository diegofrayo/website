import React from "react";
import ReactDiffViewer from "react-diff-viewer";

import { Button, Input, Space, Title, Block, Text, InlineText } from "~/components/primitive";
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
    <Block>
      <Block className="sm:tw-flex sm:tw-flex-nowrap">
        <Block className="tw-w-full sm:tw-w-1/2">
          <TextArea title="Diego" text={baseText} setText={setBaseText} id="textarea-diego" />
        </Block>
        <hr className="tw-h-px tw-my-6 sm:tw-w-px sm:tw-inline-block sm:tw-mx-2 tw-border-0" />
        <Block className="tw-w-full sm:tw-w-1/2">
          <TextArea title="Evan" text={newText} setText={setNewText} id="textarea-evan" />
        </Block>
      </Block>

      <Space size={6} variant={Space.variant.DASHED} />

      <Block is="section">
        <Title is="h2" className="tw-mb-4">
          Corrections
        </Title>
        <Block className="tw-border-4 tw-border-black dark:tw-border-white tw-p-2">
          {!baseText && !newText ? (
            <Text>
              <Emoji>🤷‍♂️</Emoji> <InlineText>Nothing to compare...</InlineText>
            </Text>
          ) : (
            <React.Fragment>
              <Block ref={correctionsContainerRef}>
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
              </Block>
              <Button
                className="tw-font-bold tw-mt-2 tw-mx-auto tw-block"
                onClick={() => {
                  downloadComponentAsImage(correctionsContainerRef.current, "diff");
                }}
              >
                <Emoji className="tw-mr-1">⬇️</Emoji>download as image
              </Button>
            </React.Fragment>
          )}
        </Block>
      </Block>
    </Block>
  );
}

export default Texts;

// --- Controller ---

function useController() {
  const [baseText, setBaseText] = React.useState("");
  const [newText, setNewText] = React.useState("");
  const correctionsContainerRef = React.useRef<HTMLDivElement | null>(null);

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

function TextArea({ title, text, setText, id }) {
  const [isEditable, setIsEditable] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const saveOnLocalStorage = React.useCallback(() => {
    window.localStorage.setItem(`DFR_TEXT_${title}`.toUpperCase(), text);
  }, [text, title]);
  const interval = React.useRef<NodeJS.Timeout | null>(null);

  useDidMount(() => {
    setText(window.localStorage.getItem(`DFR_TEXT_${title}`.toUpperCase()) || text);

    return () => {
      window.onbeforeunload = null;
    };
  });

  React.useEffect(() => {
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

  React.useEffect(() => {
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
    <Block is="section" className="tw-flex tw-flex-col tw-h-72">
      <Title is="h2" className="tw-mb-4">
        {title}
      </Title>

      <Block className="tw-flex-1 tw-overflow-auto">
        {isEditable ? (
          <React.Fragment>
            <Input
              is="textarea"
              id={id}
              value={text}
              className="tw-h-52"
              onChange={onTextareaChange}
              ref={textareaRef}
              autoFocus
            />
            <Block className="tw-text-right tw-mt-1">
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
            </Block>
          </React.Fragment>
        ) : (
          <Block className="tw-flex tw-flex-nowrap tw-h-52">
            {text && (
              <Block className="tw-w-8 tw-pt-0.5">
                {text.split("\n").map((_, index) => {
                  return <Text key={`p-numberline-${index}`}>{index + 1}</Text>;
                })}
              </Block>
            )}
            <pre
              className="tw-flex-1 tw-h-full tw-cursor-pointer tw-whitespace-pre-line tw-break-words"
              onClick={() => {
                setIsEditable(true);
              }}
            >
              {text || "Click to start to write..."}
            </pre>
          </Block>
        )}
      </Block>
    </Block>
  );
}
