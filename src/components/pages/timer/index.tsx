import * as React from "react";
import classNames from "classnames";
import { useTheme } from "next-themes";

import { Page } from "~/components/layout";
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
import { useDidMount } from "~/hooks";
import type { T_ReactElement } from "~/types";
import { ROUTES } from "~/utils/routing";

function TimerPage(): T_ReactElement {
  const {
    // vars
    ROUTINE,

    // utils
    getStats,
  } = useController();

  return (
    <Page
      config={{
        title: "Timer",
        disableSEO: true,
      }}
    >
      <Block className="dfr-shadow tw-max-w-sm tw-mx-auto">
        <Block className="tw-bg-black tw-text-white tw-p-1 tw-text-csenter tw-text-sm tw-font-bold">
          <Link variant={Link.variant.SIMPLE} href={ROUTES.HOME}>
            <Icon icon={Icon.icon.CHEVRON_LEFT} color="tw-text-white" />
            <InlineText className="tw-align-middle"> Volver al inicio</InlineText>
          </Link>
        </Block>
        <Block
          is="section"
          className="tw-h-56 tw-flex-col tw-bg-red-600 tw-text-white"
          display="tw-flex"
          align="CENTER"
        >
          <Text className="tw-text-8xl tw-mb-4">12:00</Text>
          <Title is="h2" variant={Title.variant.UNSTYLED} size={Title.size.LG}>
            Calentamiento
          </Title>
        </Block>

        <Block className="tw-p-2">
          <Stats data={getStats(ROUTINE)} />
          <Space size={1} />
          {ROUTINE.items.map((item) => {
            return <ExerciseItem key={item.id} {...item} />;
          })}
        </Block>
      </Block>
    </Page>
  );
}

export default TimerPage;

// --- Controller ---

function useController() {
  const { setTheme } = useTheme();

  useDidMount(() => {
    setTheme("light");
  });

  const ROUTINE: T_Routine = {
    rest_time_between_items: "01:00",
    start_time: "",
    end_time: "",
    items: [
      {
        id: "calentamiento",
        title: "Calentamiento",
        high_time: "12:00",
        sets: 1,
        stats: {
          status: "completado",
        },
      },
      {
        id: "pelota",
        title: "Pelota",
        high_time: "02:00",
        sets: 3,
        rest_time: "00:45",
        stats: {
          status: "completado",
        },
      },
      {
        id: "abdominales",
        title: "Abdominales",
        high_time: "00:50",
        sets: 5,
        rest_time: "00:30",
        stats: {
          status: "completado",
        },
      },
      {
        id: "lumbares",
        title: "Lumbares",
        high_time: "00:50",
        sets: 2,
        rest_time: "00:30",
        stats: {
          status: "completado",
        },
      },
      {
        id: "flexiones",
        title: "Flexiones",
        high_time: "00:50",
        sets: 2,
        rest_time: "00:30",
        stats: {
          status: "completado",
        },
      },
      {
        id: "sentadillas",
        title: "Sentadillas",
        high_time: "00:50",
        sets: 2,
        rest_time: "00:30",
        stats: {
          status: "completado",
        },
      },
      {
        id: "fortalecimiento-1",
        title: "Fortalecimiento 1",
        high_time: "01:10",
        sets: 3,
        rest_time: "00:30",
        stats: {
          status: "completado",
        },
      },
      {
        id: "fortalecimiento-2",
        title: "Fortalecimiento 2",
        high_time: "00:35",
        sets: 3,
        rest_time: "00:35",
        stats: {
          status: "completado",
        },
      },
      {
        id: "fondos",
        title: "Fondos",
        high_time: "01:00",
        sets: 3,
        rest_time: "00:30",
        stats: {
          status: "completado",
        },
      },
      {
        id: "pecho",
        title: "Pecho",
        high_time: "02:00",
        sets: 3,
        rest_time: "01:00",
        stats: {
          status: "completado",
        },
      },
      {
        id: "brazo",
        title: "Brazo",
        high_time: "02:00",
        sets: 3,
        rest_time: "01:00",
        stats: {
          status: "en progreso",
        },
      },
      {
        id: "5",
        title: "Yoga",
        high_time: "15:00",
        sets: 1,
        stats: {
          status: "sin iniciar",
        },
      },
    ],
  };

  function getStats(routine: T_Routine) {
    const totalExercises = Object.keys(routine.items).length;
    const completedExercises = routine.items.filter((item) => {
      return item.stats.status === "completado";
    });

    return {
      totalExercises,
      completedPercent: `${Math.round((completedExercises.length / totalExercises) * 100)}%`,
      completedTime: secondsToTime(
        completedExercises
          .map((item) => {
            return (
              timeToSeconds(item.high_time) * item.sets +
              timeToSeconds(item.rest_time) * (item.sets - 1)
            );
          })
          .reduce((result, curr) => result + curr, 0) +
          timeToSeconds(routine.rest_time_between_items) * (completedExercises.length - 1),
      ),
      totalTime: secondsToTime(
        routine.items
          .map((item) => {
            return (
              timeToSeconds(item.high_time) * item.sets +
              timeToSeconds(item.rest_time) * (item.sets - 1)
            );
          })
          .reduce((result, curr) => result + curr, 0) +
          timeToSeconds(routine.rest_time_between_items) * (totalExercises - 1),
      ),
    };
  }

  function timeToSeconds(time) {
    if (!time || time.split(":").length === 0) return 0;

    const [hours, minutes, seconds] = time.split(":").map(Number);

    if (minutes === undefined && seconds === undefined) {
      return hours;
    }

    if (seconds === undefined) {
      return hours * 60 + minutes;
    }

    return hours * 60 * 60 + minutes * 60 + seconds + seconds;
  }

  function secondsToTime(seconds) {
    if (seconds < 60) {
      return `${fillNumber(seconds)}`;
    }

    if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${fillNumber(minutes)}:${fillNumber(seconds % 60)}`;
    }

    const hours = Math.floor(seconds / (60 * 60));
    const minutes = seconds / 60 - 60 * hours;
    const lastSeconds = Math.round((minutes - Math.floor(minutes)) * 60);

    return `${fillNumber(hours)}:${fillNumber(Math.floor(minutes))}:${fillNumber(lastSeconds)}`;
  }

  function fillNumber(number) {
    return `${number < 10 ? "0" : ""}${number}`;
  }

  return {
    // vars
    ROUTINE,

    // utils
    getStats,
  };
}

// --- Components ---

function Stats({
  data,
}: {
  data: {
    totalExercises: number;
    completedPercent: string;
    completedTime: string;
    totalTime: string;
  };
}) {
  return (
    <Collapsible title="Estadísticas" className="tw-border tw-rounded-md tw-px-3 tw-pt-2 tw-pb-3">
      <Block is="section" className="">
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
        </Block>
      </Block>
    </Collapsible>
  );
}

function ExerciseItem({ stats, title, sets = 1, high_time, rest_time }: T_RoutineItem) {
  return (
    <Block
      is="article"
      className={classNames("dfr-ExerciseItem dfr-shadow tw-mb-3 tw-border last:tw-mb-0", {
        "tw-bg-gray-100 tw-border-gray-200": stats.status === "sin iniciar",
        "tw-bg-yellow-100 tw-border-yellow-200": stats.status === "en progreso",
        "tw-bg-green-100 tw-border-green-200": stats.status === "completado",
      })}
    >
      <Block
        is="header"
        className={classNames(
          "tw-flex tw-justify-between tw-items-center tw-px-3 tw-py-2 tw-border-b tw-border-dasshed",
          {
            "tw-border-gray-200": stats.status === "sin iniciar",
            "tw-border-yellow-200": stats.status === "en progreso",
            "tw-border-green-200": stats.status === "completado",
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
            {high_time}
          </InlineText>
        </Block>
        {rest_time && (
          <React.Fragment>
            <Space size={0.5} />
            <Block className="tw-flex tw-justify-between tw-items-center">
              <InlineText className="tw-text-sm">Tiempo de descanso</InlineText>
              <InlineText className="tw-bg-green-600 tw-text-white tw-py-1 tw-px-2 tw-rounded-lg tw-text-xs tw-font-bold tw-w-14 tw-text-center">
                {rest_time}
              </InlineText>
            </Block>
          </React.Fragment>
        )}
        <Space size={1} />
        <Block className="tw-flex tw-items-center tw-justify-between">
          <Button onClick={() => alert("TODO")}>
            <Icon icon={Icon.icon.PLAY} size={12} />
            <InlineText className="tw-ml-1 tw-text-xxs">iniciar</InlineText>
          </Button>

          <Button onClick={() => alert("TODO")}>
            <Icon icon={Icon.icon.CHECK} size={12} />
            <InlineText className="tw-ml-1 tw-text-xxs">marcar como completado</InlineText>
          </Button>
        </Block>
      </Block>
    </Block>
  );
}

// --- Types ---

type T_Routine = {
  start_time: string;
  end_time: string;
  rest_time_between_items: string;
  items: T_RoutineItem[];
};

type T_RoutineItem = {
  id: string;
  title: string;
  high_time: string;
  sets: number;
  rest_time?: string;
  stats: {
    status: string;
  };
};
