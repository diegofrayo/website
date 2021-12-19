import * as React from "react";

import { Block, Button, Collapsible, Icon, InlineText, Space } from "~/components/primitive";
import type { T_ReactElement } from "~/types";

import type { T_RoutineStats, T_Routine } from "../types";
import { TimerPageContext } from "../context";

function Stats({
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
  // states
  const [elapsedTime, setElapsedTime] = React.useState("");

  // context
  const { secondsToTime } = React.useContext(TimerPageContext);

  // vars
  const isRenderedFromTimerScreen =
    deleteRoutineHandler === undefined && uploadRoutineHandler === undefined;

  return (
    <Collapsible
      title={title}
      className="tw-px-1 tw-pt-2"
      onShowContentHandler={() => {
        setElapsedTime(secondsToTime((new Date().getTime() - startTime.ms) / 1000));
      }}
      onHideContentHandler={() => {
        setElapsedTime("");
      }}
    >
      <Block className="tw-text-sm">
        <Block className="dfr-border-color-primary tw-border tw-border-b-0">
          <Stats.Item label="# ejercicios" value={data.totalExercises} />
          <Stats.Item label="tiempo rutina total" value={data.totalTime} />
        </Block>
        <Space size={1} />

        <Block className="dfr-border-color-primary tw-border tw-border-b-0">
          <Stats.Item label="# ejercicios completados" value={data.totalCompletedExercises} />
          <Stats.Item label="tiempo rutina completado" value={data.completedTime} />
          <Stats.Item label="% rutina completada" value={data.completedPercent} />
        </Block>
        <Space size={1} />

        <Block className="dfr-border-color-primary tw-border tw-border-b-0">
          <Stats.Item label="hora inicio rutina" value={startTime.formatted} />
          <Stats.Item label="hora fin rutina" value={endTime?.formatted || ""} />
          <Stats.Item label="duración final rutina" value={data.finalRoutineDuration} />
        </Block>

        {isRenderedFromTimerScreen && (
          <React.Fragment>
            <Space size={1} />
            <Block className="dfr-border-color-primary tw-border tw-border-b-0">
              <Stats.Item label="tiempo transcurrido" value={elapsedTime} />
            </Block>
          </React.Fragment>
        )}
      </Block>

      {!isRenderedFromTimerScreen ? (
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

Stats.Item = function StatsItem({ label, value }: { label: string; value: string | number }) {
  if (value === "") return null;

  return (
    <Block className="tw-flex tw-justify-between">
      <InlineText
        className="dfr-border-color-primary tw-border-b tw-w-2/4 tw-py-1 tw-px-2"
        is="strong"
      >
        {label}
      </InlineText>
      <InlineText className="dfr-border-color-primary tw-border-b tw-w-2/4 tw-py-1 tw-px-2 tw-border-l tw-flex tw-items-center tw-justify-end">
        {value}
      </InlineText>
    </Block>
  );
};

export default Stats;
