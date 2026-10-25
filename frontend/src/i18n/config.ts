/**
 * ESP-Lab locale registry.
 *
 * V1 deliberately exposes the four languages used in the classroom setup:
 * English, Norwegian, Polish and Ukrainian. English remains the fallback so
 * partially translated screens still render meaningful text.
 */

export const LOCALES = [
  "en",
  "no",
  "pl",
  "uk",
] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const NON_DEFAULT_LOCALES = LOCALES.filter(
  (l): l is Exclude<Locale, "en"> => l !== DEFAULT_LOCALE
);

export type LocaleMeta = {
  /** BCP-47 tag used in `<html lang>` and `hreflang`. */
  htmlLang: string;
  /** Native-language label shown in the language switcher. */
  nativeName: string;
  /** Open Graph locale code. */
  ogLocale: string;
  /** Writing direction. */
  dir: "ltr" | "rtl";
};

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: { htmlLang: "en", nativeName: "English", ogLocale: "en_US", dir: "ltr" },
  no: { htmlLang: "no", nativeName: "Norsk", ogLocale: "no_NO", dir: "ltr" },
  pl: { htmlLang: "pl", nativeName: "Polski", ogLocale: "pl_PL", dir: "ltr" },
  uk: { htmlLang: "uk", nativeName: "Українська", ogLocale: "uk_UA", dir: "ltr" },
};

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && (LOCALES as readonly string[]).includes(value)
  );
}
