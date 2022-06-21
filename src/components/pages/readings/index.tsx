import * as React from "react";
import classNames from "classnames";

import { Page, MainLayout } from "~/components/layout";
import { Block, InlineText, Link, List, Text } from "~/components/primitive";
import { Emoji } from "~/components/shared";
import { withAuthenticationRequired } from "~/hocs";
import { sortBy } from "~/utils/objects-and-arrays";
import { generateSlug } from "~/utils/strings";
import type { T_Object, T_ReactElement } from "~/types";

type T_ReadingsProps = {
  readings: T_Object<T_Reading[]>;
};

function Readings({ readings }: T_ReadingsProps): T_ReactElement {
  // vars
  const PAGE_TITLE = "Readings";
  const { parsedReadings, categoriesColors } = parseReadings();

  // utils
  function parseReadings(): {
    parsedReadings: T_ReadingWithCategory[];
    categoriesColors: T_Object<string>;
  } {
    const COLORS = [
      "tw-bg-blue-500",
      "tw-bg-orange-500",
      "tw-bg-pink-500",
      "tw-bg-red-500",
      "tw-bg-teal-500",
      "tw-bg-violet-500",
      "tw-bg-yellow-500",
      "tw-bg-rose-500",
    ];

    if (COLORS.length < Object.keys(readings).length) {
      throw new Error("Please add more colors for the new categories");
    }

    return {
      parsedReadings: Object.entries(readings)
        .reduce((result: T_ReadingWithCategory[], [readingCategory, readingItems]) => {
          return result.concat(
            readingItems.map((reading: T_Reading): T_ReadingWithCategory => {
              return {
                ...reading,
                category: readingCategory,
              };
            }),
          );
        }, [])
        .sort(
          sortBy([
            { param: "starred", order: "desc" },
            { param: "date", order: "desc" },
            { param: "title", order: "asc" },
          ]),
        ),
      categoriesColors: Object.keys(readings).reduce((result, category, index) => {
        return {
          ...result,
          [category]: COLORS[index],
        };
      }, {}),
    };
  }

  // render
  return (
    <Page
      config={{
        title: PAGE_TITLE,
        disableSEO: true,
      }}
    >
      <MainLayout title={PAGE_TITLE}>
        <List variant={List.variant.DEFAULT}>
          {parsedReadings.map((reading) => {
            return (
              <List.Item
                key={generateSlug(reading.title)}
                className={classNames("tw-p-1 tw-pt-0", reading.starred && "tw-bg-yellow-100")}
              >
                <Link
                  variant={Link.variant.PRIMARY}
                  href={reading.url}
                  isExternalLink
                >
                  {reading.title}
                </Link>
                <Text className="tw-text-xs tw-font-bold tw-italic">
                  {new URL(reading.url).host}
                </Text>
                <Block>
                  <DoneMark done={reading.done} />
                  <InlineText
                    className={classNames(
                      "tw-inline-block tw-rounded-md tw-px-2 tw-py-0.5 tw-text-xs tw-font-bold dfr-text-color-light-strong",
                      categoriesColors[reading.category],
                    )}
                  >
                    {generateSlug(reading.category)}
                  </InlineText>
                  <InlineText className="tw-mx-1">|</InlineText>
                  <InlineText className="tw-inline-block tw-rounded-md tw-bg-gray-500 tw-px-2 tw-py-0.5 tw-text-xs tw-font-bold dfr-text-color-light-strong">
                    {reading.date}
                  </InlineText>
                </Block>
              </List.Item>
            );
          })}
        </List>
      </MainLayout>
    </Page>
  );
}

export default Readings;

// --- Components ---

const DoneMark = withAuthenticationRequired(function DoneMark({
  done,
}: Pick<T_Reading, "done">): T_ReactElement {
  return (
    <React.Fragment>
      <Emoji className="tw-text-xs">{done ? "✅" : "❌"}</Emoji>
      <InlineText className="tw-mx-1">|</InlineText>
    </React.Fragment>
  );
});

// --- Types ---

type T_Reading = {
  url: string;
  title: string;
  date: string;
  done: boolean;
  starred: boolean;
};

type T_ReadingWithCategory = T_Reading & { category: string };
