export const ENV_VARS = {
  NEXT_PUBLIC_ASSETS_SERVER_URL: process.env["NEXT_PUBLIC_ASSETS_SERVER_URL"] || "",
  NEXT_PUBLIC_CRYPTO_KEY: process.env["NEXT_PUBLIC_CRYPTO_KEY"] || "",
  NEXT_PUBLIC_WEBSITE_URL: process.env["NEXT_PUBLIC_WEBSITE_URL"] || "",
  NEXT_PUBLIC_ISR_TOKEN: process.env["NEXT_PUBLIC_ISR_TOKEN"] || "",
} as const;

export const PERSONAL_PAGES = [
  // personal
  {
    slug: "contacts",
    title: "contacts",
    componentName: "",
    icon: "USER_CIRCLE",
  },
  {
    slug: "films",
    title: "films",
    componentName: "Films",
    icon: "FILM",
  },
  {
    slug: "songs",
    title: "songs",
    componentName: "Songs",
    icon: "MUSIC_NOTE",
  },
  {
    slug: "timeline",
    title: "timeline",
    componentName: "timeline",
    icon: "PRESENTATION_CHART_LINE",
  },
  {
    slug: "books",
    title: "books",
    componentName: "Books",
    icon: "BOOK_OPEN",
  },

  // tools
  {
    slug: "timer",
    title: "timer",
    componentName: "",
    icon: "CLOCK",
  },
  {
    slug: "whatsapp",
    title: "whatsapp",
    componentName: "WhatsApp",
    icon: "CHAT",
  },
  {
    slug: "dencrypt",
    title: "dencrypt",
    componentName: "Dencrypt",
    icon: "KEY",
  },
  {
    slug: "isr",
    title: "isr",
    componentName: "ISR",
    icon: "REFRESH",
  },
  {
    slug: "chords-creator",
    title: "chords",
    componentName: "ChordsCreator",
    icon: "MUSIC_NOTE",
  },
  {
    slug: "thumbnails",
    title: "thumbnails",
    componentName: "Thumbnails",
    icon: "PHOTOGRAPH",
  },
  {
    slug: "styles",
    title: "styles",
    componentName: "Styles",
    icon: "COLOR_SWATCH",
  },
] as const;
