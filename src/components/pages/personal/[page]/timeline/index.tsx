import * as React from "react";
import classNames from "classnames";

import { Button, Space, Title, Block, Text, InlineText } from "~/components/primitive";
import { Emoji, Render, Timeline } from "~/components/shared";
import { useQuery } from "~/hooks";
import TimelineService from "./service";
import type { T_ReactElement } from "~/types";

import type { T_Timeline } from "./types";

function TimelinePage(): T_ReactElement {
  const {
    // states
    selectedCategory,

    // handlers
    handleSelectFilter,

    // vars
    isLoading,
    error,
    data,
  } = useController();

  return (
    <Render
      isLoading={isLoading}
      error={error}
      data={data}
    >
      {({ categories, items }: T_Timeline) => {
        return (
          <React.Fragment>
            <Block is="section">
              <Title
                is="h3"
                size={Title.size.MD}
                variant={Title.variant.SECONDARY}
                className="tw-mb-4"
              >
                Categorías [{categories.length}]
              </Title>
              <Block className="tw-justify-betweden tw-flex tw-flex-wrap">
                {categories.map((category) => {
                  return (
                    <Button
                      key={category.id}
                      variant={Button.variant.SIMPLE}
                      className={classNames(
                        "tw-my-1 tw-mr-2 tw-inline-block tw-truncate tw-rounded-md tw-py-1 tw-px-3 tw-text-left tw-text-sm tw-font-bold",
                        category.id === selectedCategory
                          ? "tw-bg-yellow-400 dark:tw-bg-yellow-600"
                          : "dfr-bg-color-primary dark:dfr-bg-color-primary",
                      )}
                      onClick={handleSelectFilter(category.id)}
                    >
                      <Emoji>{category.emoji}</Emoji> {category.value}
                    </Button>
                  );
                })}
              </Block>
            </Block>
            <Space size={6} />

            <Timeline
              timeline={items}
              TimelineItem={TimelineItem}
            />
          </React.Fragment>
        );
      }}
    </Render>
  );
}

export default TimelinePage;

// --- Controller ---

function useController(): {
  isLoading: boolean;
  error: unknown;
  data?: T_Timeline;
  selectedCategory: string;
  handleSelectFilter: (filter: string) => () => void;
  formatDate: any;
} {
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const { isLoading, error, data } = useQuery("items", TimelineService.fetchData);

  function handleSelectFilter(category) {
    return () => {
      setSelectedCategory(category === selectedCategory ? "" : category);
    };
  }

  function formatDate(startDate, endDate) {
    const MONTHS = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];

    const startDateItems = startDate.split("/");
    const startDateDay = itemAsNumber(startDateItems[2]);
    let output = `${startDateDay ? startDateDay + " de " : ""}${
      MONTHS[Number(startDateItems[1]) - 1]
    }`;

    if (endDate && startDate !== endDate) {
      const endDateItems = endDate.split("/");
      const haveStartAndEndDateDifferentYear = startDateItems[0] !== endDateItems[0];

      output += `${haveStartAndEndDateDifferentYear ? " del " + startDateItems[0] : ""} al ${Number(
        endDateItems[2],
      )} de ${MONTHS[Number(endDateItems[1]) - 1]}${
        haveStartAndEndDateDifferentYear ? " del " + endDateItems[0] : ""
      }`;
    }

    return output;
  }

  function itemAsNumber(item: string): number {
    const itemAsNumber = Number(item);

    if (!Number.isInteger(itemAsNumber)) return 0;

    return itemAsNumber;
  }

  return {
    // states
    selectedCategory,

    // handlers
    handleSelectFilter,
    formatDate,

    // vars
    isLoading,
    error,
    data: data
      ? {
          categories: data.categories,
          items: data.items.map((item) => {
            return {
              ...item,
              title: item.year.toString(),
              items: selectedCategory
                ? item.items.filter((item) => {
                    return (
                      item.categories.find((category) => category.id === selectedCategory) !==
                      undefined
                    );
                  })
                : item.items,
            };
          }),
        }
      : undefined,
  };
}

// --- Components ---

function TimelineItem({ data }) {
  const {
    // handlers
    formatDate,
  } = useController();

  return (
    <Block>
      <Text className="tw-text-sm">
        <Emoji className="tw-mr-2">🗓</Emoji>
        <InlineText>{formatDate(data.startDate, data.endDate)}</InlineText>
      </Text>
      <Text className="tw-my-2 tw-text-xl tw-font-bold">{data.description}</Text>
      <Block>
        {data.categories.map((category) => {
          return (
            <InlineText
              key={category.id}
              className="tw-rounded-md tw-border tw-px-2 tw-py-1 tw-text-xs tw-font-bold dfr-border-color-primary dark:dfr-border-color-primary"
            >
              {category.value}
            </InlineText>
          );
        })}
      </Block>
    </Block>
  );
}
