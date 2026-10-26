/**
 * react-i18next bootstrap for ESP-Lab.
 *
 * English is bundled synchronously and is the fallback language. Norwegian,
 * Polish and Ukrainian are loaded on demand. Locale bundles may be partial:
 * untranslated keys automatically fall back to English.
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enCommon from "./locales/en/common.json";
import enCommon2 from "./locales/en/common2.json";
import enReleases from "./locales/en/releases.json";
import enDocs from "./locales/en/docs.json";
import enDocs2 from "./locales/en/docs2.json";
import enSeo from "./locales/en/seo.json";
import enSeo2 from "./locales/en/seo2.json";
import enSeo3 from "./locales/en/seo3.json";
import enSeo4 from "./locales/en/seo4.json";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "./config";

function deepMerge(
  base: Record<string, unknown>,
  extra: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(extra)) {
    const previous = out[key];
    if (
      previous &&
      value &&
      typeof previous === "object" &&
      typeof value === "object" &&
      !Array.isArray(previous) &&
      !Array.isArray(value)
    ) {
      out[key] = deepMerge(
        previous as Record<string, unknown>,
        value as Record<string, unknown>,
      );
    } else {
      out[key] = value;
    }
  }
  return out;
}

const NAMESPACES = ["common"] as const;
type Namespace = (typeof NAMESPACES)[number];

const SUPPORTED_LANGS = LOCALES as readonly string[];

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: {
          ...deepMerge(deepMerge(enCommon, enCommon2), enReleases),
          seo: {
            ...enSeo.seo,
            ...enSeo2.seo,
            ...enSeo3.seo,
            ...enSeo4.seo,
          },
          docs: { ...enDocs.docs, ...enDocs2.docs },
        },
      },
    },
    lng: DEFAULT_LOCALE,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: SUPPORTED_LANGS,
    lowerCaseLng: true,
    ns: NAMESPACES,
    defaultNS: "common",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    detection: {
      order: ["path", "cookie", "navigator"],
      lookupCookie: "velxio_locale",
      caches: [],
    },
  });

async function optionalLocaleFile(
  loader: () => Promise<unknown>,
): Promise<Record<string, unknown>> {
  try {
    const module = (await loader()) as { default?: Record<string, unknown> } & Record<string, unknown>;
    return module.default ?? module;
  } catch {
    return {};
  }
}

/**
 * Lazy-load a locale bundle. Only common.json is expected for a minimal
 * ESP-Lab translation; the other upstream Velxio resource files are optional.
 */
export async function loadLocale(locale: Locale): Promise<void> {
  if (locale === DEFAULT_LOCALE) return;
  if (i18n.hasResourceBundle(locale, "common")) return;

  const [common, common2, releases, docs1, docs2, seo1, seo2, seo3, seo4] = await Promise.all([
    optionalLocaleFile(() => import(`./locales/${locale}/common.json`)),
    optionalLocaleFile(() => import(`./locales/${locale}/common2.json`)),
    optionalLocaleFile(() => import(`./locales/${locale}/releases.json`)),
    optionalLocaleFile(() => import(`./locales/${locale}/docs.json`)),
    optionalLocaleFile(() => import(`./locales/${locale}/docs2.json`)),
    optionalLocaleFile(() => import(`./locales/${locale}/seo.json`)),
    optionalLocaleFile(() => import(`./locales/${locale}/seo2.json`)),
    optionalLocaleFile(() => import(`./locales/${locale}/seo3.json`)),
    optionalLocaleFile(() => import(`./locales/${locale}/seo4.json`)),
  ]);

  const docs1Body = (docs1.docs as Record<string, unknown> | undefined) ?? {};
  const docs2Body = (docs2.docs as Record<string, unknown> | undefined) ?? {};
  const seoBody = {
    ...((seo1.seo as Record<string, unknown> | undefined) ?? {}),
    ...((seo2.seo as Record<string, unknown> | undefined) ?? {}),
    ...((seo3.seo as Record<string, unknown> | undefined) ?? {}),
    ...((seo4.seo as Record<string, unknown> | undefined) ?? {}),
  };

  const merged = {
    ...deepMerge(deepMerge(common, common2), releases),
    seo: seoBody,
    docs: { ...docs1Body, ...docs2Body },
  };

  i18n.addResourceBundle(locale, "common", merged, true, true);
}

export { i18n };
export type { Locale, Namespace };
