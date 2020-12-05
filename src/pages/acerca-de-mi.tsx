import * as React from "react";

import { Page, MainLayout, Link, TextWithEmoji } from "~/components";
import { Routes } from "~/utils/constants";

function AboutMePage(): any {
  return (
    <Page>
      <MainLayout
        breadcumb={[
          { text: "Inicio", url: Routes.HOME },
          { text: "Acerca de mí", url: Routes.ABOUT_ME },
        ]}
        title="🙋‍♂️ Acerca de mí"
      >
        <TextWithEmoji emoji="👤">
          Me llamo <strong>Diego Fernando Rayo Zamora</strong>
        </TextWithEmoji>
        <TextWithEmoji emoji="🏠">
          Nací y vivo en{" "}
          <Link href="https://goo.gl/maps/NGpchAb1PBkR9aQF9">Armenia, Quindío</Link>
        </TextWithEmoji>
        <TextWithEmoji emoji="📚">
          Estudié <strong>Ingeniería de Sistemas y Computación</strong>, me costó mucho
          graduarme, por poco no lo logro
        </TextWithEmoji>
        <TextWithEmoji emoji="🤔">
          Soy <strong>introvertido</strong>, pero me gusta conocer gente aunque usualmente
          no me gusta conocer gente
        </TextWithEmoji>
        <TextWithEmoji emoji="🤷‍♂️">
          Soy demasiado <strong>ordenado</strong> para mi gusto
        </TextWithEmoji>
        <TextWithEmoji emoji="🌝">
          La <strong>red social</strong> que más me gusta es{" "}
          <Link href="https://twitter.com/diegofrayo">Twitter,</Link> las demás las uso
          muy poco
        </TextWithEmoji>
        <TextWithEmoji emoji="🌍">
          <strong>Viajé</strong> hace unos años por <strong>Suramérica</strong> durante un
          par de meses y creo que ese viaje le aportó muchas cosas buenas a mi vida y por
          otro lado redujo mis ganas de viajar
        </TextWithEmoji>
        <TextWithEmoji emoji="🎶">
          Mis canciones favoritas en{" "}
          <Link href="https://open.spotify.com/playlist/2iSnWl4KZ7znS5gzBDurYN?si=4mNoMmK6T1alQbXZP-QilQ">
            Spotify.
          </Link>{" "}
          Mi top de canciones más escuchadas en el 2020 según{" "}
          <Link href="https://open.spotify.com/playlist/37i9dQZF1EM1nsROE2cRZE?si=idAiJNb5SL-nVpnDDckW_w">
            Spotify
          </Link>
        </TextWithEmoji>
        <TextWithEmoji emoji="🎬">
          Mi serie favorita es{" "}
          <Link href="https://www.netflix.com/title/70301870">Vikings</Link>
        </TextWithEmoji>
        <TextWithEmoji emoji="⚽">
          Me gusta mucho el <strong>fútbol</strong>, mi equipo favorito ahora es{" "}
          <strong>River Plate</strong> y dame siempre <strong>la Libertadores</strong>
        </TextWithEmoji>
        <TextWithEmoji emoji="🎸">
          Me gusta mucho tocar <strong>guitarra</strong> y la música que más toco es{" "}
          <strong>Rock Argentino</strong>, especialmente{" "}
          <Link href="https://open.spotify.com/playlist/31SXdwCzbsC2j0HdAEXMwA?si=oQTNbKgMRRG9eOwhE7xp4Q">
            Spinetta
          </Link>{" "}
          <i>[Aunque esto no significa que toque bien sus canciones].</i> Esta es la{" "}
          <Link href="https://open.spotify.com/track/0BY5HwsqIojR8HBmOtr8Qd?si=6u90Qb25TXu0VTgAmqXJdw">
            canción
          </Link>{" "}
          que mejor me sale en <strong>guitarra</strong>
        </TextWithEmoji>
        <TextWithEmoji emoji="📸">
          Me gusta <strong>tomar fotos</strong>, dicen que soy bueno en esto, creo que es
          gracias a mi <strong>iPhone</strong>, no a mí
        </TextWithEmoji>
        <TextWithEmoji emoji="😁">
          Tengo más <strong>hobbies</strong> como 👨‍🍳 🏓 🏃‍♂️
        </TextWithEmoji>
        <TextWithEmoji emoji="👨‍💼">
          Algunos{" "}
          <Link href={Routes.BLOG("pensamientos-sobre-mi-profesion")}>pensamientos</Link>{" "}
          sobre mi <strong>profesión</strong>
        </TextWithEmoji>
      </MainLayout>
    </Page>
  );
}

export default AboutMePage;
