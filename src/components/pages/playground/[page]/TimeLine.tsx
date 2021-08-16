import classNames from "classnames";
import React from "react";

import { Emoji, Render } from "~/components/pages/_shared";
import { Title } from "~/components/primitive";
import { useQuery } from "~/hooks";
import TimeLineService from "~/services/timeline";
import { T_TimeLine, T_ReactElement } from "~/types";
import { formatDateWithoutYear } from "~/utils/dates";

function TimeLine(): T_ReactElement {
  const { isLoading, error, data } = useQuery("items", TimeLineService.fetchData);

  return (
    <Render isLoading={isLoading} error={error} data={data}>
      {({ items }: { items: { year: number; items: T_TimeLine[] }[] }) => {
        return (
          <div className="tw-mt-10">
            {items.map((item) => {
              return (
                <section key={item.year}>
                  <Title
                    is="h2"
                    className="tw-text-left sm:tw-text-center tw-my-8 tw-underline"
                    variant={Title.variant.SECONDARY}
                    size={Title.size.LG}
                  >
                    {item.year}
                  </Title>

                  {item.items.map((item, index) => {
                    return (
                      <div
                        key={item.id}
                        className={classNames(
                          "tw-relative sm:tw-w-1/2 tw-border-black dark:tw-border-white tw-px-4 tw-pb-8 last:tw-pb-0 tw-border-l-4",
                          index % 2 === 0
                            ? "sm:tw-border-l-0 sm:tw-border-r-4 sm:tw-text-right sm:tw-ml-1"
                            : "sm:tw-left-2/4",
                        )}
                      >
                        <p className="tw-text-sm">
                          <Emoji>🗓</Emoji> <span>{formatDateWithoutYear(item.startDate)}</span>{" "}
                          {item.endDate && <span>al {formatDateWithoutYear(item.endDate)}</span>}
                        </p>
                        <p className="tw-font-bold tw-text-xl tw-my-2">{item.description}</p>
                        <div>
                          {item.categories.map((category) => {
                            return (
                              <span
                                key={category.id}
                                className="tw-font-bold tw-text-xs tw-px-2 tw-py-1 tw-rounded-md tw-border dfr-border-color-primary dark:dfr-border-color-primary"
                              >
                                {category.value}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </section>
              );
            })}
          </div>
        );
      }}
    </Render>
  );
}

export default TimeLine;
