import * as React from "react";

import { Page, MainLayout } from "~/components";
import { Routes } from "~/utils/constants";

function AboutMePage(): any {
  return (
    <Page>
      <MainLayout
        breadcumb={[
          { text: "Inicio", url: Routes.HOME },
          { text: "Acerca de mi", url: Routes.ABOUT_ME },
        ]}
        title="🙋‍♂️ Acerca de mi"
      >
        <Item emoji="👤">
          Me llamo <strong>Diego Fernando Rayo Zamora</strong>
        </Item>
        <Item emoji="📚">
          Estudié <strong>Ingeniería de Sistemas y Computación</strong> y me costó mucho
          graduarme, por poco no lo logro
        </Item>
        <Item emoji="🏠">
          Nací y vivo en{" "}
          <Link href="https://goo.gl/maps/NGpchAb1PBkR9aQF9">Armenia, Quindío</Link>
        </Item>
        <Item emoji="👨‍💼">
          Trabajo como <strong>Desarrollador de Software</strong> desde hace 5 años
        </Item>
        <Item emoji="🛠️">
          Trabajo principalmente con{" "}
          <strong>JavaScript, React, Next.js, Tailwind CSS, Node.js y GraphQL.</strong> Me
          gusta más trabajar en <strong>Front-end</strong> que en{" "}
          <strong>Back-end</strong>
        </Item>
        <Item emoji="🤓">
          Me gusta mucho trabajar con <strong>React.</strong>{" "}
          <i>[React es como un lego para nerds]</i>
        </Item>
        <Item emoji="👀">
          La <strong>industria</strong> en donde trabajo es <strong>puro humo</strong>. Lo
          más importante es saber <strong>inglés</strong>, no importa si eres horrendo
          trabajando. <i>[Me va mal con el inglés]</i>
        </Item>
        <Item emoji="⚽">
          Me gusta mucho el <strong>fútbol</strong>, mi equipo favorito ahora es{" "}
          <strong>River Plate</strong> y dame siempre <strong>la Libertadores</strong>
        </Item>
        <Item emoji="🎸">
          Me gusta mucho tocar <strong>guitarra</strong> y la música que más toco es{" "}
          <strong>Rock Argentino</strong>, especialmente{" "}
          <Link href="https://open.spotify.com/playlist/31SXdwCzbsC2j0HdAEXMwA?si=oQTNbKgMRRG9eOwhE7xp4Q">
            Spinetta.
          </Link>{" "}
          <i>[Aunque esto no significa que toque bien sus canciones] </i>
        </Item>
        <Item emoji="📸">
          Me gusta <strong>tomar fotos</strong>, dicen que soy bueno en esto, creo que es
          gracias a mi <strong>iPhone</strong>, no a mí
        </Item>
        <Item emoji="😁">
          Algunos otros <strong>hobbies</strong> son 🏞 🏓 🏃‍♂️
        </Item>
        <Item emoji="🎶">
          Mis canciones favoritas en{" "}
          <Link href="https://open.spotify.com/playlist/2iSnWl4KZ7znS5gzBDurYN?si=4mNoMmK6T1alQbXZP-QilQ">
            Spotify
          </Link>{" "}
          | Mi top de canciones más escuchadas en el 2020 en{" "}
          <Link href="https://open.spotify.com/playlist/37i9dQZF1EM1nsROE2cRZE?si=idAiJNb5SL-nVpnDDckW_w">
            Spotify
          </Link>
        </Item>
        <Item emoji="🌍">
          <strong>Viajé</strong> hace unos años por <strong>Suramérica</strong> durante un
          par de meses y creo que ese viaje le aportó muchas cosas buenas a mi vida y por
          otro lado redujo mis ganas de viajar
        </Item>
        <Item emoji="🤷‍♂️">
          Soy demasiado <strong>ordenado</strong> para mi gusto
        </Item>
        <Item emoji="🤔">
          Soy <strong>introvertido</strong>, pero me gusta conocer gente aunque usualmente
          no me gusta conocer gente
        </Item>
      </MainLayout>
    </Page>
  );
}

export default AboutMePage;

// --- Components ---

function Item({ children, emoji }) {
  return (
    <section className="tw-flex tw-flex-no-wrap tw-mb-3">
      {emoji && <span className="tw-text-xl tw-mr-3">{emoji}</span>}
      <p className="tw-flex-1">{children}</p>
    </section>
  );
}

function Link({ children, href }) {
  return (
    <a
      target="_blank"
      rel="noreferrer"
      href={href}
      className="tw-font-bold tw-underline tw-text-blue-700"
    >
      {children}
    </a>
  );
}
