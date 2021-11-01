import classNames from "classnames";
import React from "react";

import { Blockquote } from "~/components/primitive";
import { T_ReactElement } from "~/types";
import { between } from "~/utils/misc";

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

  const LYRICS = [
    {
      id: "1",
      text: "Banderas en tu corazón, Yo quiero verlas, Ondeando luzca el sol o no",
      songId: "juguetes-perdidos",
    },
    {
      id: "2",
      text: "Sin ese diablo que mea en todas partes y en nigún lado hace espuma",
      songId: "juguetes-perdidos",
    },
    {
      id: "3",
      text: "Cuando la noche es más oscura, se viene el día en tu corazón",
      songId: "juguetes-perdidos",
    },
    {
      id: "4",
      text: "Implacable rock and roll y un par de sienes ardientes que son todo el tesoro",
      songId: "juguetes-perdidos",
    },
    {
      id: "5",
      text: "Cuanto más alto trepa el monito, así es la vida, el culo más se le ve",
      songId: "juguetes-perdidos",
    },
    {
      id: "6",
      text: "Toda la vida es un baile y te pueden bailar, aunque no quieras, lo verás",
      songId: "toco-y-me-voy",
    },
    {
      id: "7",
      text: "La gente se esconde o apenas existe, se olvida del hombre, se olvida de Dios",
      songId: "desarma-y-sangra",
    },
    {
      id: "8",
      text: "Pensando en el alma que piensa y por pensar no es alma, desarma y sangra",
      songId: "desarma-y-sangra",
    },
    // { id: "", text: "", songId: "" },
    // { id: "", text: "", songId: "" },
    // { id: "", text: "", songId: "" },
  ];

  function getItemStyles(): string {
    const SIZES = ["tw-text-xs", "tw-text-base", "tw-text-2xl"];
    const WEIGHT = ["tw-font-bold", "tw-font-thin", "tw-font-normal"];
    const BORDER = ["tw-border-dotted", "tw-border-dashed", ""];

    return [
      SIZES[between(0, SIZES.length - 1)],
      WEIGHT[between(0, WEIGHT.length - 1)],
      BORDER[between(0, BORDER.length - 1)],
    ].join(" ");
  }

  return (
    <Blockquote variant={Blockquote.variant.STYLED}>
      {LYRICS.map((lyric) => {
        return (
          <span
            key={lyric.id}
            className={classNames(
              "dfr-border-strong dark:dfr-border-strong tw-border-b tw-mr-2 tw-leading-relaxed",
              getItemStyles(),
            )}
          >
            {lyric.text}
          </span>
        );
      })}
    </Blockquote>
  );
}

export default SongsPage;
