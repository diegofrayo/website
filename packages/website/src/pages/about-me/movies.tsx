import React from "react";
import classNames from "classnames";

import { Page, MainLayout } from "~/components/layout";
import { Icon, Image, Link, Title } from "~/components/primitive";
import { Render } from "~/components/pages/_shared";
import { useQuery } from "~/hooks";
import MoviesService from "~/services/movies";
import { T_Movie, T_ReactElement, T_SiteTexts } from "~/types";
import { getSiteTexts } from "~/utils/internationalization";
import { ROUTES } from "~/utils/routing";

const SiteTexts: T_SiteTexts = getSiteTexts({ layout: true });
const PAGE_NAME = "🎬 movies";

function MoviesPage(): T_ReactElement {
  return (
    <Page config={{ title: PAGE_NAME, noRobots: true }}>
      <MainLayout
        breadcumb={[
          {
            text: SiteTexts.layout.current_locale.breadcumb.home,
            url: ROUTES.HOME,
          },
          {
            text: SiteTexts.layout.current_locale.breadcumb.about_me,
            url: ROUTES.ABOUT_ME,
          },
          {
            text: PAGE_NAME,
          },
        ]}
        title={PAGE_NAME}
        showGoToTopButton
      >
        <Content />
      </MainLayout>
    </Page>
  );
}

export default MoviesPage;

// --- Components ---

function Content(): T_ReactElement {
  const { isLoading, error, data } = useController();

  return (
    <Render isLoading={isLoading} error={error} data={data}>
      {(movies: T_Movie[]) => {
        return (
          <div className="tw-flex tw-justify-center sm:tw-justify-between tw-flex-wrap">
            {movies.map(({ id, source, title, type, calification }, index) => {
              return (
                <Link
                  key={id}
                  href={
                    source === "Netflix"
                      ? `https://www.netflix.com/title/${id}`
                      : source === "YouTube"
                      ? `https://www.youtube.com/watch?v=${id}`
                      : `https://www.imdb.com/title/${id}`
                  }
                  variant={Link.variant.UNSTYLED}
                  className={classNames(
                    "movie tw-relative tw-w-48 tw-h-64 tw-mb-6 tw-mx-2 sm:tw-mx-0 tw-shadow-lg hover:tw-shadow-2xl tw-transform tw-duration-300 hover:tw--translate-y-1 hover:tw-translate-x-1 hover:tw-rotate-0 hover:tw-opacity-75",
                    index % 2 === 0 ? "sm:tw-rotate-2" : "sm:tw--rotate-2",
                  )}
                >
                  <article
                    className="tw-flex tw-h-full tw-w-full"
                    style={{
                      backgroundImage: `url("/static/pages/playground/movies/${id}.jpg")`,
                      backgroundSize: "100% 100%",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <span className="tw-absolute tw--top-2 tw--right-2 tw-bg-black dark:tw-bg-white tw-rounded-full tw-shadow-md tw-p-1 tw-w-8 tw-h-8">
                      <Icon
                        icon={
                          calification === 5
                            ? Icon.icon.STAR
                            : calification === 4
                            ? Icon.icon.HEART
                            : Icon.icon.CHECK
                        }
                        size={24}
                      />
                    </span>

                    <div className="movie__details tw-flex tw-self-end tw-flex-nowrap tw-justify-between tw-w-full tw-items-end tw-p-2">
                      {source === "imdb" ? (
                        <Image
                          src="/static/images/misc/imdb.png"
                          className="tw-w-6 tw-h-6 tw-rounded-full"
                          alt="imdb icon"
                        />
                      ) : (
                        <Icon
                          icon={source === "Netflix" ? Icon.icon.NETFLIX : Icon.icon.YOUTUBE}
                          size={24}
                          wrapperClassName="tw-flex-shrink-0"
                        />
                      )}

                      <div className="tw-flex-1 tw-text-right tw-ml-4">
                        <Title
                          is="h1"
                          variant={Title.variant.UNSTYLED}
                          className="tw-leading-tight tw-mb-2 tw-text-black tw-uppercase tw-break-normal"
                        >
                          {title}
                        </Title>
                        <p className="tw-text-sm tw-font-bold tw-leading-none tw-text-gray-700 tw-lowercase tw-italic">
                          {type}
                        </p>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}

            <style jsx>{`
              .movie__details {
                background-color: rgba(255, 255, 255, 0.7);
              }
            `}</style>
          </div>
        );
      }}
    </Render>
  );
}

// --- Controller ---

function useController() {
  const { isLoading, error, data } = useQuery("movies", MoviesService.fetchMovies);

  return { isLoading, error, data };
}
