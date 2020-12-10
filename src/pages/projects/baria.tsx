import * as React from "react";

import { Page } from "~/components";
import { useDidMount } from "~/hooks";

function BariaPage(): any {
  useDidMount(() => {
    document.title = "Baría - Feliz cumpleaños";
  });

  return (
    <Page metadata={{ noRobots: true }}>
      <section className="tw-bg-gray-800 tw-w-full tw-h-screen tw-p-4 tw-relative tw-overflow-auto sm:tw-flex sm:tw-flex-no-wrap sm:tw-items-center">
        <img
          src="/projects/baria/imagen.jpg"
          className="tw-max-h-full tw-max-w-full tw-flex-shrink-0 tw-mr-4 tw-rounded-tl-lg tw-rounded-br-lg"
          onClick={() => {
            const audio: any = document.getElementById("myAudio");
            audio.play();
          }}
        />
        <div className="tw-flex-1 tw-h-full tw-relative tw-flex tw-flex-col tw-justify-center">
          <h1 className="tw-text-gray-100 tw-text-2xl tw-text-right">
            🎂 Feliz cumpleaños <strong>Baría!!!</strong>
          </h1>
          <h2 className="tw-text-gray-300 tw-text-xl tw-text-center tw-my-4">
            Te quiero mucho!!! ♥️
          </h2>
          <p className="tw-text-gray-500 tw-text-justify">
            He vivido cosas muy lindas contigo, ojalá podamos seguir conociendonos y
            disfrutando por mucho tiempo más!!! 😘
          </p>
          <p className="tw-absolute tw-bottom-0 tw-right-0 tw-m-4 tw-text-xs tw-w-4/5 tw-text-right tw-text-gray-500">
            espero que ya entiendas un poquito mas que hago en mi trabajo y que te animes
            a aprender a programar 😄
          </p>
        </div>

        <audio id="myAudio">
          <source src="/projects/baria/sound.mp3" type="audio/mpeg" />
        </audio>

        <style jsx>{`
          :global(body),
          :global(html),
          :global(#__next) {
            height: 100vh;
            overflow: hidden;
            width: 100%;
          }

          img {
            border-top-width: 4px;
            border-top-color: red;
            border-right-width: 3px;
            border-right-color: purple;
            border-bottom-width: 2px;
            border-bottom-color: pink;
            border-left-width: 1px;
            border-left-color: orange;
          }
        `}</style>
      </section>
    </Page>
  );
}

export default BariaPage;
