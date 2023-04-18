import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import distance from "jaro-winkler";

import { refs } from "@/__main__/App.jsx";
import router from "@/__main__/router.mjs";
import { JS_FILE_EXTENSION } from "@/app/constants.mjs";
import initOptions from "@/i18n/__init.mjs";
import { devLog, IS_NODE } from "@/util/dev.mjs";
import globals from "@/util/global-whitelist.mjs";
import importBasePath from "@/util/import-base-path.mjs";

const memoizedPercentFormat = {};

let i = i18n.use(initReactI18next).init(
  Object.assign(
    {
      lng: "en",
      fallbackLng: "en",
      resources: {},
      interpolation: {
        escapeValue: false,
        format: (value, format, lng) => {
          switch (format) {
            case "percent": {
              let percentFormatter = memoizedPercentFormat[lng];

              if (!percentFormatter)
                percentFormatter = memoizedPercentFormat[lng] =
                  new Intl.NumberFormat(lng, {
                    style: "percent",
                    maximumFractionDigits: 1,
                  });

              return percentFormatter.format(value);
            }
            case "timestamp": {
              return new Date(Number.parseInt(value, 10)).toLocaleDateString(
                lng,
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              );
            }
            case "number": {
              return value.toLocaleString(lng);
            }
            case "duration": {
              // NOTE: we should actually handle formatting time durations here.
              break;
            }
            default:
              break;
          }

          return value;
        },
      },
    },
    initOptions
  )
);

let defaultLanguage;

if (IS_NODE) {
  i = i.then(() =>
    Promise.all(
      initOptions.languages.map((lng) => {
        return importLanguage(lng).then(({ default: resources }) => {
          addResources(resources);
        });
      })
    )
  );
} else {
  const {
    navigator: { language = "en" },
  } = globals;
  const { languages } = initOptions;

  const shortLang = language.substr(0, 2);

  const matches = languages
    .filter((l) => l.substr(0, 2) === shortLang)
    .map((l) => {
      return {
        language: l,
        distance: distance(language, l),
      };
    })
    .sort((a, b) => b.distance - a.distance);

  if (!matches.length)
    matches.push({
      language: "en",
    });

  const [{ language: matchedLanguage }] = matches;
  let isInitialLanguage = true;

  defaultLanguage = matchedLanguage;

  i = i
    .then(() => importLanguage(matchedLanguage))
    .then(({ default: resources }) => {
      addResources(resources);

      // This will trigger re-render.
      i18n.changeLanguage(matchedLanguage);
      isInitialLanguage = false;

      globals.document.documentElement.lang = matchedLanguage;
      devLog(`language initialized as ${matchedLanguage}`);
    });

  // Handle language change in runtime.
  i18n.on("languageChanged", async (lang) => {
    if (isInitialLanguage) return;
    await Promise.all([
      // The language to switch to, must have its module loaded first.
      i18n.getDataByLanguage(lang)
        ? Promise.resolve()
        : importLanguage(lang).then(({ default: resources }) => {
            addResources(resources);
          }),
      // The main thing we are concerned about is re-fetching static data.
      router.refetchData(),
    ]);
    refs.forceRender();
    globals.document.documentElement.lang = lang;
    devLog(`language changed to ${lang}`);
  });
}

function importLanguage(language) {
  return import(
    `${importBasePath(
      import.meta.url
    )}src/i18n/__resources.${language}${JS_FILE_EXTENSION}`
  );
}

function addResources(resources) {
  for (const language in resources) {
    const namespaces = resources[language];
    for (const namespace in namespaces) {
      const resource = namespaces[namespace];
      i18n.addResources(language, namespace, resource);
    }
  }
}

globals.__BLITZ_DEV__.i18n = i18n;

export { defaultLanguage, i18n };
export default i;
