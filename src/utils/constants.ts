import { Icon } from "~/components/primitive";

export const ENV_VARS = {
  NEXT_PUBLIC_ASSETS_SERVER_URL: process.env["NEXT_PUBLIC_ASSETS_SERVER_URL"] || "",
  NEXT_PUBLIC_CRYPTO_KEY: process.env["NEXT_PUBLIC_CRYPTO_KEY"] || "MY_STUPID_SECRET_KEY",
  NEXT_PUBLIC_WEBSITE_URL: process.env["NEXT_PUBLIC_WEBSITE_URL"] || "",
  NEXT_PUBLIC_ISR_TOKEN: process.env["NEXT_PUBLIC_ISR_TOKEN"] || "",
} as const;

export const PERSONAL_PAGES = [
  // personal
  {
    slug: "contacts",
    title: "contacts",
    componentName: "",
    icon: Icon.icon.USER_CIRCLE,
  },
  {
    slug: "films",
    title: "films",
    componentName: "films/index",
    icon: Icon.icon.FILM,
  },
  {
    slug: "timeline",
    title: "timeline",
    componentName: "timeline/index",
    icon: Icon.icon.PRESENTATION_CHART_LINE,
  },
  {
    slug: "books",
    title: "books",
    componentName: "books/index",
    icon: Icon.icon.BOOK_OPEN,
  },

  // tools
  {
    slug: "timer",
    title: "timer",
    componentName: "",
    icon: Icon.icon.CLOCK,
  },
  {
    slug: "whatsapp",
    title: "whatsapp",
    componentName: "WhatsApp",
    icon: Icon.icon.CHAT,
  },
  {
    slug: "dencrypt",
    title: "dencrypt",
    componentName: "Dencrypt",
    icon: Icon.icon.KEY,
  },
  {
    slug: "isr",
    title: "isr",
    componentName: "ISR",
    icon: Icon.icon.REFRESH,
  },
  {
    slug: "thumbnails",
    title: "thumbnails",
    componentName: "Thumbnails",
    icon: Icon.icon.PHOTOGRAPH,
  },
] as const;
