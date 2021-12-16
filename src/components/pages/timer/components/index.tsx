import * as React from "react";
import classNames from "classnames";

import {
  Block,
  Button,
  Collapsible,
  Icon,
  InlineText,
  Link,
  Space,
  Text,
  Title,
} from "~/components/primitive";
import type { T_ReactElement } from "~/types";
import { ROUTES } from "~/utils/routing";
import { setScrollPosition } from "~/utils/browser";

import { ROUTINE_ITEMS_STATUS } from "../constants";
// import { TimerPageContext } from "../context";
import type { T_RoutineStats, T_Routine, T_RoutineItem } from "../types";

export { default as Timer } from "./timer";

export function GoToHomeLink(): T_ReactElement {
  return (
    <Block className="tw-bg-black tw-text-white tw-p-1 tw-text-csenter tw-text-sm tw-font-bold">
      <Link variant={Link.variant.SIMPLE} href={ROUTES.HOME}>
        <Icon icon={Icon.icon.CHEVRON_LEFT} color="tw-text-white" />
        <InlineText className="tw-align-middle"> Volver al inicio</InlineText>
      </Link>
    </Block>
  );
}

export function Stats({
  data,
  startTime,
}: {
  data: T_RoutineStats;
  startTime: T_Routine["startTime"];
}): T_ReactElement {
  return (
    <Collapsible title="Estadísticas" className="tw-border tw-rounded-md tw-px-3 tw-pt-2 tw-pb-3">
      <Block className="tw-text-sm">
        <Block className="tw-flex tw-justify-between">
          <InlineText is="strong">total ejercicios:</InlineText>
          <InlineText>{data.totalExercises}</InlineText>
        </Block>
        <Block className="tw-flex tw-justify-between">
          <InlineText is="strong">% completado:</InlineText>
          <InlineText>{data.completedPercent}</InlineText>
        </Block>
        <Block className="tw-flex tw-justify-between">
          <InlineText is="strong">tiempo completado:</InlineText>
          <InlineText>{data.completedTime}</InlineText>
        </Block>
        <Block className="tw-flex tw-justify-between">
          <InlineText is="strong">tiempo total:</InlineText>
          <InlineText>{data.totalTime}</InlineText>
        </Block>
        <Block className="tw-flex tw-justify-between">
          <InlineText is="strong">hora de inicio:</InlineText>
          <InlineText>{startTime}</InlineText>
        </Block>
      </Block>
    </Collapsible>
  );
}

export function RoutineItem({
  // id,
  status,
  title,
  sets = 1,
  highTime,
  restTime,
}: T_RoutineItem): T_ReactElement {
  // const { setRoutineItemAsStarted, updateRoutineItemStatus } = React.useContext(TimerPageContext);

  // handlers
  function handleMarkAsCompletedClick() {
    if (status === ROUTINE_ITEMS_STATUS.IN_PROGRESS) {
      setScrollPosition(0);
    }

    // updateRoutineItemStatus(
    //   id,
    //   status === ROUTINE_ITEMS_STATUS.COMPLETED
    //     ? ROUTINE_ITEMS_STATUS.NOT_STARTED
    //     : ROUTINE_ITEMS_STATUS.COMPLETED,
    // );
  }

  function handleStartClick() {
    // setRoutineItemAsStarted(id);
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
        <Title is="h1" variant={Title.variant.SECONDARY} size={Title.size.MD}>
          {title}
        </Title>
        <Text className="tw-text-xs tw-font-bold tw-italic">{`${sets} ${
          sets === 1 ? "repetición" : "repeticiones"
        }`}</Text>
      </Block>
      <Block className="tw-px-3 tw-py-3">
        <Block className="tw-flex tw-justify-between tw-items-center">
          <InlineText className="tw-text-sm">Tiempo de ejecución</InlineText>
          <InlineText className="tw-bg-red-600 tw-text-white tw-py-1 tw-px-2 tw-rounded-lg tw-text-xs tw-font-bold tw-w-14 tw-text-center">
            {highTime}
          </InlineText>
        </Block>
        {restTime && (
          <React.Fragment>
            <Space size={0.5} />
            <Block className="tw-flex tw-justify-between tw-items-center">
              <InlineText className="tw-text-sm">Tiempo de descanso</InlineText>
              <InlineText className="tw-bg-green-600 tw-text-white tw-py-1 tw-px-2 tw-rounded-lg tw-text-xs tw-font-bold tw-w-14 tw-text-center">
                {restTime}
              </InlineText>
            </Block>
          </React.Fragment>
        )}
        <Space size={1} />
        <Block className="tw-flex tw-items-center tw-justify-between">
          {status === ROUTINE_ITEMS_STATUS.NOT_STARTED && (
            <Button variant={Button.variant.SIMPLE} onClick={handleStartClick}>
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
