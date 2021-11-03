import React, { Fragment } from "react";
import classNames from "classnames";

import { Block } from "~/components/primitive";
import { T_ReactElement } from "~/types";
import { betweenUntil, getRandomItem } from "~/utils/misc";

type T_Lyric = {
  id: string;
  text: string;
  songId: string;
};

function SongsPage(): T_ReactElement {
  /*
  const SONGS = {
    "juguetes-perdidos": {
      title: "Juguetes Perdidos",
      artist: "",
      album: "",
      year: "",
      url: "",
    },
    "toco-y-me-voy": {
      title: "Toco y me voy",
      artist: "",
      album: "",
      year: "",
      url: "",
    },
    "desarma-y-sangra": {
      title: "Desarma y sangra",
      artist: "",
      album: "",
      year: "",
      url: "",
    },
  };
  */

  const CONNECTORS = [","];

  const LYRICS: T_Lyric[] = [
    {
      id: "1",
      text: "banderas en tu corazón, yo quiero verlas, ondeando luzca el sol o no",
      songId: "juguetes-perdidos",
    },
    {
      id: "2",
      text: "sin ese diablo que mea en todas partes y en nigún lado hace espuma",
      songId: "juguetes-perdidos",
    },
    {
      id: "3",
      text: "cuando la noche es más oscura, se viene el día en tu corazón",
      songId: "juguetes-perdidos",
    },
    {
      id: "4",
      text: "implacable rock and roll y un par de sienes ardientes que son todo el tesoro",
      songId: "juguetes-perdidos",
    },
    {
      id: "5",
      text: "cuanto más alto trepa el monito, así es la vida, el culo más se le ve",
      songId: "juguetes-perdidos",
    },
    {
      id: "6",
      text: "toda la vida es un baile y te pueden bailar, aunque no quieras, lo verás",
      songId: "toco-y-me-voy",
    },
    {
      id: "7",
      text: "la gente se esconde o apenas existe, se olvida del hombre, se olvida de Dios",
      songId: "desarma-y-sangra",
    },
    {
      id: "8",
      text: "pensando en el alma que piensa y por pensar no es alma, desarma y sangra",
      songId: "desarma-y-sangra",
    },
    // { id: "", text: "", songId: "" },
  ];

  function randomizeArray(array): T_Lyric[] {
    const indexedPositions = {};
    const result = {};

    array.forEach((_, index) => {
      const randomIndex = betweenUntil(0, array.length - 1, Object.values(indexedPositions));

      if (!result[randomIndex]) {
        result[randomIndex] = array[index];
        indexedPositions[randomIndex] = randomIndex;
      }
    });

    return Object.values(result);
  }

  function getItemStyles(): string {
    const SIZES = ["tw-text-xs", "tw-text-base", "tw-text-2xl"];
    const WEIGHT = ["tw-font-bold", "tw-font-thin", "tw-font-normal"];
    const BORDER = ["tw-border-dotted", "tw-border-dashed", ""];

    return [getRandomItem(SIZES), getRandomItem(WEIGHT), getRandomItem(BORDER)].join(" ");
  }

  return (
    <Block>
      {randomizeArray(LYRICS).map((lyric, index) => {
        const isLastIndex = index === LYRICS.length - 1;
        const connector = getRandomItem(CONNECTORS);

        return (
          <Fragment key={lyric.id}>
            <span
              className={classNames(
                "dfr-border-strong dark:dfr-border-strong tw-border-b tw-mr-2 tw-leading-relaxed",
                getItemStyles(),
              )}
            >
              {lyric.text}
            </span>
            {!isLastIndex && (
              <span className={classNames("dfr-text-colorful-primary tw-mr-2 tw-leading-relaxed")}>
                {connector}
              </span>
            )}
          </Fragment>
        );
      })}
    </Block>
  );
}

export default SongsPage;
