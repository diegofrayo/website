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
  // states
  const [isTitleTruncated, setIsTitleTruncated] = React.useState(true);

  // context
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
      className={classNames("dfr-RoutineItem tw-mb-3 tw-border dfr-shadow last:tw-mb-0", {
        "tw-border-gray-200 tw-bg-gray-100": status === ROUTINE_ITEMS_STATUS.NOT_STARTED,
        "tw-border-yellow-200 tw-bg-yellow-100": status === ROUTINE_ITEMS_STATUS.IN_PROGRESS,
        "tw-border-green-200 tw-bg-green-100": status === ROUTINE_ITEMS_STATUS.COMPLETED,
      })}
    >
      <Block
        is="header"
        className={classNames(
          "tw-border-dasshed tw-flex tw-items-center tw-justify-between tw-border-b tw-px-3 tw-py-2",
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
          className={classNames("tw-min-w-0 tw-flex-1", isTitleTruncated && "tw-truncate")}
          onClick={() => {
            setIsTitleTruncated((currentValue) => !currentValue);
          }}
        >
          {title}
        </Title>
        <Text className="tw-ml-3 tw-text-right tw-text-xs tw-font-bold tw-italic">
          {pluralize(Array.isArray(sets) ? sets.length : sets, "repetición", "repeticiones")}
        </Text>
      </Block>
      <Block className="tw-px-3 tw-py-3">
        {highTime && (
          <Block className="tw-flex tw-items-center tw-justify-between">
            <InlineText className="tw-text-sm">Tiempo de acción</InlineText>
            <InlineText className="tw-w-20 tw-rounded-lg tw-bg-red-600 tw-py-1 tw-px-2 tw-text-center tw-text-xs tw-font-bold tw-text-white">
              {highTime}
            </InlineText>
          </Block>
        )}
        {restTime && (
          <React.Fragment>
            <Space size={0.5} />
            <Block className="tw-flex tw-items-center tw-justify-between">
              <InlineText className="tw-text-sm">Tiempo de descanso</InlineText>
              <InlineText className="tw-w-20 tw-rounded-lg tw-bg-blue-600 tw-py-1 tw-px-2 tw-text-center tw-text-xs tw-font-bold tw-text-white">
                {restTime}
              </InlineText>
            </Block>
            <Space size={0.5} />
            <Block className="tw-flex tw-items-center tw-justify-between">
              <InlineText className="tw-text-sm">Tiempo total</InlineText>
              <InlineText className="tw-w-20 tw-rounded-lg tw-bg-green-600 tw-py-1 tw-px-2 tw-text-center tw-text-xs tw-font-bold tw-text-white">
                {secondsToTime(calculateRoutineItemTotalTime(sets, highTime, restTime))}
              </InlineText>
            </Block>
          </React.Fragment>
        )}
        <Space size={1} />
        <Block className="tw-flex tw-items-center tw-justify-between">
          {status === ROUTINE_ITEMS_STATUS.NOT_STARTED && (
            <Button
              variant={Button.variant.SIMPLE}
              onClick={handleStartRoutineItemClick}
            >
              <Icon
                icon={Icon.icon.PLAY}
                size={12}
              />
              <InlineText className="tw-ml-1 tw-align-middle tw-text-xxs">iniciar</InlineText>
            </Button>
          )}

          <Button
            variant={Button.variant.SIMPLE}
            className="tw-ml-auto"
            onClick={handleMarkAsCompletedClick}
          >
            <Icon
              icon={Icon.icon.CHECK}
              size={12}
            />
            <InlineText className="tw-ml-1 tw-align-middle tw-text-xxs">
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