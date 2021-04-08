import React, { useState, Fragment } from "react";

import { Page } from "~/components/layout";
import { Icon, Link } from "~/components/primitive";
import { Emoji } from "~/components/pages/_shared";
import { useDidMount } from "~/hooks";
import twcss from "~/lib/twcss";
import { setScrollPosition } from "~/utils/browser";

function MariaPage(): any {
  const [section, setSection] = useState("");

  useDidMount(() => {
    document.title = "María App";
  });

  return (
    <Page config={{ noRobots: true }}>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js" />
      <main className="dfr-max-w-base tw-mx-auto tw-w-full md:tw-shadow-md tw-h-full">
        <header className="tw-bg-blue-100 tw-py-3 tw-px-4">
          <h1 className="tw-text-xl sm:tw-text-3xl tw-text-blue-900">
            <Emoji className="tw-mr-2">💃</Emoji> <span>Bienvenida a María App</span>
          </h1>
        </header>

        <section className="tw-py-8 tw-px-4">
          {section ? (
            <Fragment>
              <div
                className="tw-mb-8 tw-font-bold tw-cursor-pointer"
                onClick={() => setSection("")}
              >
                <Emoji className="tw-mr-3">⬅️</Emoji>
                <span>Volver atrás</span>
              </div>
              <div>
                {section === "WHATSAPP" ? (
                  <Fragment>En progreso...</Fragment>
                ) : section === "YOUTUBE" ? (
                  <YouTube />
                ) : section === "BIBLE" ? (
                  <Bible />
                ) : null}
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <h2 className="tw-mb-6 tw-text-xl tw-text-center">Elije una opción 🙋‍♀️</h2>

              <div className="tw-flex tw-flex-wrap tw-justify-evenly">
                <MenuItem
                  onClick={() => {
                    window.open(
                      "https://api.whatsapp.com/send?phone=573113728898&text=Hola Diego ⚡",
                    );
                  }}
                >
                  <Icon icon={Icon.icon.WHATSAPP} wrapperClassName="tw-mx-auto tw-mb-2" />
                  <p className="tw-font-bold tw-text-lg tw-text-center tw-mt-2">
                    Enviar mensaje a un amigo
                  </p>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setSection("YOUTUBE");
                    setScrollPosition(0);
                  }}
                >
                  <Icon icon={Icon.icon.YOUTUBE} wrapperClassName="tw-mx-auto tw-mb-2" />
                  <p className="tw-font-bold tw-text-lg tw-text-center tw-mt-2">
                    Escuchar música favorita en YouTube
                  </p>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setSection("BIBLE");
                    setScrollPosition(0);
                  }}
                >
                  <Emoji className="tw-text-5xl">📖</Emoji>
                  <p className="tw-font-bold tw-text-lg tw-text-center tw-mt-2">
                    Versículo del día
                  </p>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    alert("Diego te quiere mucho");
                  }}
                >
                  <Emoji className="tw-text-5xl tw-text-center">⚡</Emoji>
                </MenuItem>
              </div>
            </Fragment>
          )}
        </section>
      </main>
    </Page>
  );
}

export default MariaPage;

// --- Components ---

const MenuItem = twcss.div`tw-cursor-pointer tw-m-2 tw-h-64 tw-w-64 tw-border tw-rounded-md tw-flex tw-items-center tw-justify-center tw-flex-col tw-p-4 tw-max-w-full`;

function YouTube() {
  const PLAYLISTS = [
    {
      name: "🙏☀️",
      url: "https://www.youtube.com/playlist?list=PLggewE8gQHKqhV48ggHU3GqItQ_fQaRUf",
    },
    {
      name: "🕺💃",
      url: "https://www.youtube.com/playlist?list=PLggewE8gQHKpgBFZgMOAoKX9vBByk5wRb",
    },
    {
      name: "💛🎼",
      url: "https://www.youtube.com/playlist?list=PLggewE8gQHKogTIFnxtQVzKjd5jz_xEKC",
    },
    {
      name: "😌💖🙋",
      url: "https://www.youtube.com/playlist?list=PLggewE8gQHKqhJ4pJpksMGHBGNO_W1OCt",
    },
  ];

  return (
    <section>
      <h2 className="tw-mb-4 tw-text-3xl">🎶 ¿Que quieres escuchar?</h2>

      <div className="tw-flex tw-flex-wrap tw-justify-evenly">
        {PLAYLISTS.map((playlist, index) => {
          return (
            <Link key={`Playlist-${index}`} href={playlist.url} variant={Link.variant.UNSTYLED}>
              <MenuItem>
                <Emoji className="tw-text-5xl">{playlist.name}</Emoji>
              </MenuItem>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function Bible() {
  const [content, setContent] = useState("Cargando...");

  useDidMount(() => {
    (window as any).$.ajax({
      url:
        "https://dailyverses.net/get/verse?language=nvi&isdirect=1&url=" + "diegofrayo.vercel.app",
      dataType: "JSONP",
      success: function (json) {
        setContent(json.html);
      },
    });
  });

  return (
    <div className="root">
      <div
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />

      <style jsx>{`
        .root :global(a) {
          @apply dfr-text-color-links;
          @apply tw-mt-2;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
