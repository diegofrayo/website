import * as React from "react";

import { Page } from "~/components";
import { useDidMount } from "~/hooks";

function BariaPage(): any {
  useDidMount(() => {
    document.title = "Baría - Feliz cumpleaños";
  });

  return (
    <Page metadata={{ noRobots: true }}>
      <section className="twc-max-w-base tw-mx-auto tw-w-full tw-h-full md:tw-h-screen tw-py-8 tw-px-4 tw-overflow-auto md:tw-flex md:tw-flex-no-wrap md:tw-items-center">
        <img
          src="/projects/baria/imagen.jpg"
          className="tw-max-h-full tw-w-full tw-flex-shrink-0 tw-rounded-tl-lg tw-rounded-br-lg tw-max-w-sm tw-mx-auto md:tw-mr-4"
          onClick={() => {
            const audio: any = document.getElementById("myAudio");
            audio.play();
          }}
        />
        <div className="tw-relative tw-py-4 md:tw-flex-1 md:tw-h-full md:tw-flex md:tw-flex-col md:tw-justify-center">
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
          <p className="tw-text-xs tw-text-right tw-text-gray-500 md:tw-w-4/5 md:tw-ml-auto tw-mt-10">
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
            @apply tw-bg-gray-800;
            height: 100%;
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
