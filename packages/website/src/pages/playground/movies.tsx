import React from "react";

import { Page, MainLayout } from "~/components/layout";
import { Icon, Link, Title } from "~/components/primitive";
import { Render } from "~/components/pages/_shared";
import { useQuery } from "~/hooks";
import MoviesService from "~/services/movies";
import { T_Movie, T_ReactElement, T_SiteTexts } from "~/types";
import { getSiteTexts } from "~/utils/internationalization";
import { ROUTES } from "~/utils/routing";

const SiteTexts: T_SiteTexts = getSiteTexts({ layout: true });
const PAGE_NAME = "movies";

function MoviesPage(): T_ReactElement {
  const { isLoading, error, data } = useController();

  return (
    <Page config={{ title: PAGE_NAME, noRobots: true }}>
      <MainLayout
        breadcumb={[
          {
            text: SiteTexts.layout.current_locale.breadcumb.home,
            url: ROUTES.HOME,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb.playground,
            url: ROUTES.PLAYGROUND,
          },
          {
            text: PAGE_NAME,
          },
        ]}
        title={PAGE_NAME}
      >
        <Render isLoading={isLoading} error={error} data={data}>
          {(movies: T_Movie[]) => {
            return (
              <div className="tw-flex tw-justify-center sm:tw-justify-between tw-flex-wrap">
                {movies.map(({ id, source, title, type, calification }) => {
                  return (
                    <Link
                      key={id}
                      href={
                        source === "Netflix"
                          ? `https://www.netflix.com/co/title/${id}`
                          : `https://www.youtube.com/watch?v=${id}`
                      }
                      variant={Link.variant.UNSTYLED}
                      className="movie tw-relative tw-w-48 tw-h-64 tw-mb-4 tw-borderd dfr-border-color-primary dark:dfr-border-color-primary tw-mx-2 sm:tw-mx-0 tw-rounded-bl-md tw-rounded-tr-md tw-overflow-hidden"
                    >
                      <article
                        className="tw-flex tw-h-full tw-w-full"
                        style={{
                          backgroundImage: `url(/static/pages/movies/${id}.jpg)`,
                          backgroundSize: "100%",
                        }}
                      >
                        <span className="tw-absolute tw-top-1 tw-right-1">
                          {calification === 5 ? (
                            <Icon icon={Icon.icon.STAR} size={32} />
                          ) : calification === 4 ? (
                            <Icon icon={Icon.icon.HEART} size={24} />
                          ) : (
                            <Icon icon={Icon.icon.CHECK} size={16} />
                          )}
                        </span>

                        <div className="movie__details tw-flex tw-self-end tw-flex-nowrap tw-justify-between tw-w-full tw-items-end tw-p-2">
                          <Icon
                            icon={source === "Netflix" ? Icon.icon.NETFLIX : Icon.icon.YOUTUBE}
                            size={24}
                          />
                          <div className="tw-flex-1 tw-text-right tw-ml-4">
                            <Title
                              is="h1"
                              variant={Title.variant.UNSTYLED}
                              className="tw-leading-tight tw-mb-2 tw-text-black"
                            >
                              {title}
                            </Title>
                            <p className="tw-text-sm tw-font-bold tw-leading-none tw-text-gray-700">
                              {type}
                            </p>
                          </div>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            );
          }}
        </Render>
      </MainLayout>

      <style jsx>{`
        .movie__details {
          background-color: rgba(255, 255, 255, 0.7);
        }
      `}</style>
    </Page>
  );
}

export default MoviesPage;

// --- Controller ---

function useController() {
  const { isLoading, error, data } = useQuery("movies", MoviesService.fetchMovies);

  return { isLoading, error, data };
}
