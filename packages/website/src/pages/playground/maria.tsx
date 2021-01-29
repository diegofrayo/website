import React, { useState, Fragment } from "react";

import { Page } from "~/components/layout";
import { UL, Link } from "~/components/primitive";
import { Emoji } from "~/components/shared";
import { useDidMount } from "~/hooks";
import twcss from "~/lib/twcss";

function MariaPage(): any {
  const [section, setSection] = useState("");

  useDidMount(() => {
    document.title = "María App";
  });

  return (
    <Page config={{ noRobots: true }}>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
      <main className="dfr-max-w-base tw-mx-auto tw-w-full md:tw-shadow-md tw-h-full">
        <header className="tw-bg-blue-100 tw-py-3 tw-px-4">
          <h1 className="tw-text-3xl tw-text-blue-900">💃 Bienvenida a María App</h1>
        </header>

        <section className="tw-py-8 tw-px-4">
          {section ? (
            <Fragment>
              <div
                className="tw-mb-8 tw-font-bold tw-cursor-pointer"
                onClick={() => setSection("")}
              >
                <Emoji className="tw-mr-2">⬅️</Emoji>
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
              <h2 className="tw-mb-4 tw-text-xl tw-text-center">Elije una opción 🙋‍♀️</h2>

              <div className="tw-flex tw-flex-wrap tw-justify-evenly">
                <MenuItem
                  onClick={() => {
                    setSection("WHATSAPP");
                  }}
                >
                  <img
                    src="/static/pages/playground/maria/whatsapp.svg"
                    className="tw-mx-auto tw-mb-2"
                    alt="WhatsApp icon"
                  />
                  <p className="tw-font-bold tw-text-lg">Enviar mensaje a un amigo</p>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setSection("YOUTUBE");
                  }}
                >
                  <img
                    src="/static/pages/playground/maria/youtube.svg"
                    className="tw-mx-auto tw-mb-2"
                    alt="YouTube icon"
                  />
                  <p className="tw-font-bold tw-text-lg">
                    Escuchar música favorita en YouTube
                  </p>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setSection("BIBLE");
                  }}
                >
                  <Emoji className="tw-text-5xl">📖</Emoji>
                  <p className="tw-font-bold tw-text-lg">Versículo del día</p>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    alert("Diego te quiere mucho");
                  }}
                >
                  <Emoji className="tw-text-5xl">⚡</Emoji>
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

const MenuItem = twcss.div`tw-cursor-pointer tw-m-2 tw-h-64 tw-w-64 tw-text-center tw-border tw-rounded-md tw-flex tw-items-center tw-justify-center tw-flex-col tw-p-4`;

function YouTube() {
  const PLAYLISTS = [
    {
      name: "Baria belos bangeles",
      url: "https://www.youtube.com/playlist?list=PLggewE8gQHKqhV48ggHU3GqItQ_fQaRUf",
    },
    {
      name: "Bailablinchi 🕺💃",
      url: "https://www.youtube.com/playlist?list=PLggewE8gQHKpgBFZgMOAoKX9vBByk5wRb",
    },
    {
      name: "Romantics 💛",
      url: "https://www.youtube.com/playlist?list=PLggewE8gQHKogTIFnxtQVzKjd5jz_xEKC",
    },
    {
      name: "MARIA DE LOS",
      url: "https://www.youtube.com/playlist?list=PLggewE8gQHKqhJ4pJpksMGHBGNO_W1OCt",
    },
  ];

  return (
    <div>
      <h2 className="tw-mb-3 tw-text-3xl">
        🎶 Estas son tus listas ¿Que quieres escuchar?
      </h2>
      <UL>
        {PLAYLISTS.map((playlist, index) => {
          return (
            <li key={`Playlist-${index}`}>
              <Link href={playlist.url}>{playlist.name}</Link>
            </li>
          );
        })}
      </UL>
    </div>
  );
}

function Bible() {
  const [content, setContent] = useState("Cargando...");

  useDidMount(() => {
    (window as any).$.ajax({
      url:
        "https://dailyverses.net/get/verse?language=nvi&isdirect=1&url=" +
        "diegofrayo.vercel.app",
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
