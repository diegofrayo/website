import React, { useState } from "react";

import { List, Space } from "~/components/primitive";

function Lab() {
  const [page, setPage] = useState("home");
  const [showMenu, setShowMenu] = useState(true);

  return (
    <div className="tw-border-4 tw-border-yellow-900 tw-border-double tw-pb-6 tw-bg-white">
      <nav className="tw-bg-yellow-900 tw-p-3">
        <div className="tw-flex tw-justify-between tw-flex-no-wrap">
          <h1 className="tw-text-3xl tw-text-yellow-100 tw-mr-4">Logo</h1>
          <button className="tw-inline-block md:tw-hidden" onClick={() => setShowMenu(c => !c)}>
            <span className="tw-block tw-my-1 tw-w-6 tw-bg-white tw-h-0.5" />
            <span className="tw-block tw-my-1 tw-w-6 tw-bg-white tw-h-0.5" />
            <span className="tw-block tw-my-1 tw-w-6 tw-bg-white tw-h-0.5" />
          </button>
        </div>
        {showMenu && (
          <ul className="tw-block md:tw-flex tw-mt-4 tw-justify-between">
            <li
              className="tw-block md:tw-inline-block tw-cursor-pointer tw-font-bold tw-text-yellow-400 tw-mr-6"
              onClick={() => {
                setShowMenu(false);
                setPage("home");
              }}
            >
              Inicio
            </li>
            <li
              className="tw-block md:tw-inline-block tw-cursor-pointer tw-font-bold tw-text-yellow-400 tw-mr-6"
              onClick={() => {
                setShowMenu(false);
                setPage("who-us");
              }}
            >
              Quienes somos
            </li>
            <li
              className="tw-block md:tw-inline-block tw-cursor-pointer tw-font-bold tw-text-yellow-400 tw-mr-6"
              onClick={() => {
                setShowMenu(false);
                setPage("how-to-recycle");
              }}
            >
              Como reciclar
            </li>
            <li
              className="tw-block md:tw-inline-block tw-cursor-pointer tw-font-bold tw-text-yellow-400 md:tw-text-right"
              onClick={() => {
                setShowMenu(false);
                setPage("directory");
              }}
            >
              Directorio
            </li>
          </ul>
        )}
      </nav>
      <div>
        <div className="tw-text-right tw-px-2 tw-my-4">
          <button onClick={() => setPage("my-profile")}>
            <span className="tw-rounded-full tw-inline-flex tw-items-center tw-justify-center tw-bg-gray-700 tw-h-6 tw-w-6 tw-text-white tw-mr-2">
              A
            </span>
            <span>Mi perfil</span>
          </button>
        </div>
        {page === "home" ? (
          <Home />
        ) : page === "directory" ? (
          <Directory />
        ) : page === "how-to-recycle" ? (
          <HowToRecycle />
        ) : page === "who-us" ? (
          <WhoUs />
        ) : page === "my-profile" ? (
          <MyProfile />
        ) : null}
      </div>
    </div>
  );
}

export default Lab;

// --- Components ---

function Home() {
  return <p>Inicio</p>;
}

function WhoUs() {
  return <p>Quienes somos?</p>;
}

function Directory() {
  return <p>Directorio</p>;
}

function MyProfile() {
  return <p>Mi perfil</p>;
}

function HowToRecycle() {
  return (
    <article className="tw-max-w-sm tw-mx-auto tw-border tw-px-6 tw-py-6">
      <h1 className="tw-text-center tw-text-2xl">Titulo</h1>
      <span className="tw-bg-gray-300 tw-text-white tw-flex  tw-items-center tw-justify-center tw-w-64 tw-h-64 tw-mx-auto tw-my-10 tw-max-w-full">
        Imagen
      </span>
      <div>
        <div>
          <h2 className="tw-text-xl tw-mb-3">Usos</h2>
          <List>
            <li>Uso 1</li>
            <li>Uso 2</li>
            <li>Uso 3</li>
            <li>Uso 4</li>
          </List>
        </div>
        <Space size={4} />
        <div>
          <h2 className="tw-text-xl tw-mb-3">Fuentes</h2>
          <List>
            <li>Fuente 1</li>
            <li>Fuente 2</li>
            <li>Fuente 3</li>
            <li>Fuente 4</li>
          </List>
        </div>
      </div>
    </article>
  );
}
