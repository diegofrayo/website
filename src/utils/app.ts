import { ENV_VARS } from "./constants";

export function isDevelopmentEnvironment(): boolean {
  return (
    (isBrowser() ? window.location.href : ENV_VARS.NEXT_PUBLIC_WEBSITE_URL).includes(
      "vercel.app",
    ) === false
  );
}

export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function isServer(): boolean {
  return !isBrowser();
}

export function reportError(error: unknown): void {
  console.error(error);
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;

  return "Unknown error";
}
