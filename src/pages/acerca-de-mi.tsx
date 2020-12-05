import * as React from "react";

import { Page, MainLayout, Link } from "~/components";
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
        <Item emoji="👤">
          Me llamo <strong>Diego Fernando Rayo Zamora</strong>
        </Item>
        <Item emoji="🏠">
          Nací y vivo en{" "}
          <Link href="https://goo.gl/maps/NGpchAb1PBkR9aQF9">Armenia, Quindío</Link>
        </Item>
        <Item emoji="🤔">
          Soy <strong>introvertido</strong>, pero me gusta conocer gente aunque usualmente
          no me gusta conocer gente
        </Item>
        <Item emoji="🤷‍♂️">
          Soy demasiado <strong>ordenado</strong> para mi gusto
        </Item>
        <Item emoji="🌝">
          La <strong>red social</strong> que más me gusta es{" "}
          <Link href="https://twitter.com/diegofrayo">Twitter,</Link> las demás las uso
          muy poco
        </Item>
        <Item emoji="🌍">
          <strong>Viajé</strong> hace unos años por <strong>Suramérica</strong> durante un
          par de meses y creo que ese viaje le aportó muchas cosas buenas a mi vida y por
          otro lado redujo mis ganas de viajar
        </Item>
        <Item emoji="🎶">
          Mis canciones favoritas en{" "}
          <Link href="https://open.spotify.com/playlist/2iSnWl4KZ7znS5gzBDurYN?si=4mNoMmK6T1alQbXZP-QilQ">
            Spotify.
          </Link>{" "}
          Mi top de canciones más escuchadas en el 2020 según{" "}
          <Link href="https://open.spotify.com/playlist/37i9dQZF1EM1nsROE2cRZE?si=idAiJNb5SL-nVpnDDckW_w">
            Spotify
          </Link>
        </Item>
        <Item emoji="⚽">
          Me gusta mucho el <strong>fútbol</strong>, mi equipo favorito ahora es{" "}
          <strong>River Plate</strong> y dame siempre <strong>la Libertadores</strong>
        </Item>
        <Item emoji="🎸">
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
        </Item>
        <Item emoji="📸">
          Me gusta <strong>tomar fotos</strong>, dicen que soy bueno en esto, creo que es
          gracias a mi <strong>iPhone</strong>, no a mí
        </Item>
        <Item emoji="😁">
          Algunos otros <strong>hobbies:</strong> 👨‍🍳 🏓 🏃‍♂️
        </Item>
        <Item emoji="📚">
          Estudié <strong>Ingeniería de Sistemas y Computación</strong>, me costó mucho
          graduarme, por poco no lo logro
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
        <Item emoji="😐">
          Constantemente tengo el <strong>síndrome del impostor</strong> y siento que no
          se nada.{" "}
          <i>
            [En mi actual trabajo fui <strong>Desarrollador Senior</strong> y ahora soy{" "}
            <strong>Tech Lead</strong> y no se como lo logré]
          </i>
        </Item>
        <Item emoji="😴">
          Hay algo que se llama <strong>Scrum,</strong> esto realmente si que es puro humo
          y muy sobrevalorado.{" "}
          <i>
            [Fui <strong>Scrum Master</strong>, ya se me venció la certificación entonces
            todo lo que sabía automaticámente se me olvidó]
          </i>
        </Item>
        <Item emoji="🤡">
          Al entrar <strong>feed</strong> de{" "}
          <Link href="https://www.linkedin.com/in/diegofrayo">LinkedIn</Link> se me nubla
          la vista por tanto humo
        </Item>
      </MainLayout>
    </Page>
  );
}

export default AboutMePage;

// --- Components ---

function Item({ children, emoji }): any {
  return (
    <section className="tw-flex tw-flex-no-wrap tw-mb-3">
      <span className="tw-text-xl tw-mr-3">{emoji}</span>
      <p className="tw-flex-1">{children}</p>
    </section>
  );
}
