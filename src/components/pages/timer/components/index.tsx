import * as React from "react";

import { Block, Button, Collapsible, Icon, InlineText } from "~/components/primitive";
import type { T_ReactElement } from "~/types";
import { ROUTES } from "~/utils/routing";

import type { T_RoutineStats, T_Routine } from "../types";

export { default as Timer } from "./Timer";
export { default as RoutineItem } from "./RoutineItem";

export function GoToHomeLink(): T_ReactElement {
  return (
    <Block className="tw-bg-black tw-text-white tw-p-1 tw-text-csenter tw-text-sm tw-font-bold tw-absolute tw-top-0 tw-w-full tw-h-8">
      <Button
        variant={Button.variant.SIMPLE}
        onClick={() => {
          if (window.confirm("¿Está seguro de que quiere ir al inicio?")) {
            window.location.href = ROUTES.HOME;
          }
        }}
      >
        <Icon icon={Icon.icon.CHEVRON_LEFT} color="tw-text-white" />
        <InlineText className="tw-align-middle tw-font-bold"> Volver al inicio</InlineText>
      </Button>
    </Block>
  );
}

export function Stats({
  title = "Estadísticas",
  data,
  startTime,
  endTime,
  uploadRoutineHandler,
  deleteRoutineHandler,
}: {
  title?: string;
  data: T_RoutineStats;
  startTime: T_Routine["startTime"];
  endTime?: T_Routine["endTime"];
  uploadRoutineHandler?: any;
  deleteRoutineHandler?: any;
}): T_ReactElement {
  return (
    <Collapsible title={title} className="tw-px-1 tw-pt-2">
      <Block className="dfr-border-color-primary tw-border tw-border-b-0 tw-text-sm">
        <Stats.Item label="total ejercicios" value={data.totalExercises} />
        <Stats.Item label="total tiempo" value={data.totalTime} />
        <Stats.Item label="% completado" value={data.completedPercent} />
        <Stats.Item label="total ejercicios completados" value={data.totalCompletedExercises} />
        <Stats.Item label="tiempo completado" value={data.completedTime} />
        <Stats.Item label="hora de inicio" value={`${new Date(startTime).toLocaleTimeString()}`} />
        <Stats.Item
          label="hora de finalización"
          value={endTime ? `${new Date(endTime).toLocaleTimeString()}` : ""}
        />
        <Stats.Item label="duración final" value={data.finalRoutineDuration} />
      </Block>

      {deleteRoutineHandler && uploadRoutineHandler ? (
        <Block className="tw-flex tw-items-center tw-justify-between tw-mt-2">
          <Button variant={Button.variant.DEFAULT} onClick={uploadRoutineHandler}>
            Guardar en la nube
          </Button>

          <Button
            variant={Button.variant.SIMPLE}
            className="tw-underline tw-font-bold"
            onClick={deleteRoutineHandler}
          >
            <Icon icon={Icon.icon.X} color="dfr-text-colorful-secondary-100" />
          </Button>
        </Block>
      ) : null}
    </Collapsible>
  );
}

Stats.Item = function StatsItem({ label, value }) {
  if (!value) return null;

  return (
    <Block className="tw-flex tw-justify-between">
      <InlineText
        className="dfr-border-color-primary tw-border-b tw-w-2/4 tw-py-1 tw-px-2"
        is="strong"
      >
        {label}:
      </InlineText>
      <InlineText className="dfr-border-color-primary tw-border-b tw-w-2/4 tw-py-1 tw-px-2 tw-border-l tw-flex tw-items-center tw-justify-end">
        {value}
      </InlineText>
    </Block>
  );
};
