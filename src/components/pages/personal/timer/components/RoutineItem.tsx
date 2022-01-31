import * as React from "react";
import classNames from "classnames";

import { Block, Button, Icon, InlineText, Space, Text, Title } from "~/components/primitive";
import type { T_ReactElement } from "~/types";
import { pluralize } from "~/utils/misc";

import { ROUTINE_ITEMS_STATUS } from "../constants";
import { TimerPageContext } from "../context";
import type { T_RoutineItem } from "../types";

export default function RoutineItem({
  id,
  status,
  title,
  sets = 1,
  highTime,
  restTime,
}: T_RoutineItem): T_ReactElement {
  const {
    // states
    currentRoutine,

    // utils
    setRoutineItemAsStarted,
    calculateRoutineItemTotalTime,
    secondsToTime,
    markRoutineItemAsCompleted,
  } = React.useContext(TimerPageContext);

  // handlers
  function handleMarkAsCompletedClick() {
    markRoutineItemAsCompleted(currentRoutine, id, status, "SEARCH_FOR_NEXT_ROUTINE_ITEM");
  }

  function handleStartRoutineItemClick() {
    setRoutineItemAsStarted(currentRoutine, id);
  }

  return (
    <Block
      is="article"
      className={classNames("dfr-RoutineItem dfr-shadow tw-mb-3 tw-border last:tw-mb-0", {
        "tw-bg-gray-100 tw-border-gray-200": status === ROUTINE_ITEMS_STATUS.NOT_STARTED,
        "tw-bg-yellow-100 tw-border-yellow-200": status === ROUTINE_ITEMS_STATUS.IN_PROGRESS,
        "tw-bg-green-100 tw-border-green-200": status === ROUTINE_ITEMS_STATUS.COMPLETED,
      })}
    >
      <Block
        is="header"
        className={classNames(
          "tw-flex tw-justify-between tw-items-center tw-px-3 tw-py-2 tw-border-b tw-border-dasshed",
          {
            "tw-border-gray-200": status === ROUTINE_ITEMS_STATUS.NOT_STARTED,
            "tw-border-yellow-200": status === ROUTINE_ITEMS_STATUS.IN_PROGRESS,
            "tw-border-green-200": status === ROUTINE_ITEMS_STATUS.COMPLETED,
          },
        )}
      >
        <Title
          is="h1"
          variant={Title.variant.SECONDARY}
          size={Title.size.SM}
          className="tw-truncate tw-flex-1 tw-min-w-0"
        >
          {title}
        </Title>
        <Text className="tw-font-bold tw-italic tw-ml-3 tw-text-xs tw-text-right">
          {pluralize(sets, "repetición", "repeticiones")}
        </Text>
      </Block>
      <Block className="tw-px-3 tw-py-3">
        <Block className="tw-flex tw-justify-between tw-items-center">
          <InlineText className="tw-text-sm">Tiempo de ejecución</InlineText>
          <InlineText className="tw-text-white tw-py-1 tw-px-2 tw-rounded-lg tw-text-xs tw-font-bold tw-w-20 tw-text-center tw-bg-red-600">
            {highTime}
          </InlineText>
        </Block>
        {restTime && (
          <React.Fragment>
            <Space size={0.5} />
            <Block className="tw-flex tw-justify-between tw-items-center">
              <InlineText className="tw-text-sm">Tiempo de descanso</InlineText>
              <InlineText className="tw-text-white tw-py-1 tw-px-2 tw-rounded-lg tw-text-xs tw-font-bold tw-w-20 tw-text-center tw-bg-blue-600">
                {restTime}
              </InlineText>
            </Block>
            <Space size={0.5} />
            <Block className="tw-flex tw-justify-between tw-items-center">
              <InlineText className="tw-text-sm">Tiempo total</InlineText>
              <InlineText className="tw-text-white tw-py-1 tw-px-2 tw-rounded-lg tw-text-xs tw-font-bold tw-w-20 tw-text-center tw-bg-green-600">
                {secondsToTime(calculateRoutineItemTotalTime(sets, highTime, restTime))}
              </InlineText>
            </Block>
          </React.Fragment>
        )}
        <Space size={1} />
        <Block className="tw-flex tw-items-center tw-justify-between">
          {status === ROUTINE_ITEMS_STATUS.NOT_STARTED && (
            <Button variant={Button.variant.SIMPLE} onClick={handleStartRoutineItemClick}>
              <Icon icon={Icon.icon.PLAY} size={12} />
              <InlineText className="tw-ml-1 tw-text-xxs tw-align-middle">iniciar</InlineText>
            </Button>
          )}

          <Button
            variant={Button.variant.SIMPLE}
            className="tw-ml-auto"
            onClick={handleMarkAsCompletedClick}
          >
            <Icon icon={Icon.icon.CHECK} size={12} />
            <InlineText className="tw-ml-1 tw-text-xxs tw-align-middle">
              marcar como{" "}
              {status === ROUTINE_ITEMS_STATUS.COMPLETED
                ? ROUTINE_ITEMS_STATUS.NOT_STARTED
                : ROUTINE_ITEMS_STATUS.COMPLETED}
            </InlineText>
          </Button>
        </Block>
      </Block>
    </Block>
  );
}
