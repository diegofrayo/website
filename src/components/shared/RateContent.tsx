import * as React from "react";
import classNames from "classnames";
import { toast } from "react-toastify";

import { Button, Block, Text, Space } from "~/components/primitive";
import { useDidMount } from "~/hooks";
import { useTranslation } from "~/i18n";
import AnalyticsService from "~/services/analytics";
import type { T_ReactElement } from "~/types";

import Emoji from "./Emoji";

function RateContent(): T_ReactElement {
  const { t } = useTranslation();
  const [questionAnswer, setQuestionAnswer] = React.useState("");

  const LOCAL_STORAGE_KEY = "DFR_CONTENT_RATED";
  const isQuestionAnswered = questionAnswer !== "";

  useDidMount(() => {
    initLocalStorageData();
    setQuestionAnswer(readLocalStorageData()[window.location.pathname] || "");
  });

  function initLocalStorageData() {
    const storedData = window.localStorage.getItem(LOCAL_STORAGE_KEY);

    if (!storedData) {
      window.localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ [window.location.pathname]: "" }),
      );
    }
  }

  function writeDataOnLocalStorage(data) {
    window.localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        ...readLocalStorageData(),
        ...data,
      }),
    );
  }

  function readLocalStorageData() {
    return JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY) as string);
  }

  function trackEvent(answer) {
    return function () {
      setQuestionAnswer(answer);

      AnalyticsService.trackEvent("RATE_CONTENT", {
        answer: answer,
        page: window.location.pathname,
      });

      toast.success(t("common:useful_question_thanks"), {
        position: toast.POSITION.BOTTOM_CENTER,
        toastId: "useful-question",
      });

      writeDataOnLocalStorage({ [window.location.pathname]: answer });
    };
  }

  return (
    <Block className="tw-text-center">
      <Text className="tw-text-sm tw-font-bold">{t("common:useful_question")}</Text>
      <Block
        className={classNames(
          "tw-mt-4 tw-text-center tw-text-xl",
          isQuestionAnswered && "tw-opacity-50",
        )}
      >
        <Button
          variant={Button.variant.SIMPLE}
          className={classNames(questionAnswer === "YES" && "tw-font-bold")}
          disabled={isQuestionAnswered}
          onClick={trackEvent("YES")}
        >
          <Emoji>👍</Emoji>
          <Text>{t("common:useful_question_yes")}</Text>
        </Button>
        <Space size={3} orientation="v" />
        <Button
          variant={Button.variant.SIMPLE}
          className={classNames(questionAnswer === "NO" && "tw-font-bold")}
          disabled={isQuestionAnswered}
          onClick={trackEvent("NO")}
        >
          <Emoji>👎</Emoji>
          <Text>{t("common:useful_question_no")}</Text>
        </Button>
      </Block>
    </Block>
  );
}

export default RateContent;
