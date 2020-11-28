import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <title>diegofrayo - Software Developer</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main>
        <h1>
          Hola, soy <strong>Diego Rayo</strong> 👋
        </h1>

        <p>
          Este es mi sitio web, acabo de migrarlo a Next.js y Vercel, todavía no
          se que voy a poner aquí, tengo planeado escribir sobre varios temas,
          especialmente JavaScript y React, de a poco lo iré construyendo
        </p>

        <p style={{ fontSize: 50, textAlign: "center" }}>👨‍💻</p>
      </main>
    </div>
  );
}
