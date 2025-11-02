import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";
import es from "../locales/es.json";

const LANGUAGE_STORAGE_KEY = "i18next_lng";

const getInitialLanguage = () => {
  if (typeof window === "undefined") return "en";

  const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (saved && (saved === "en" || saved === "es")) {
    return saved;
  }

  const browserLang = navigator.language.split("-")[0];
  return browserLang === "es" ? "es" : "en";
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      es: {
        translation: es,
      },
    },
    lng: getInitialLanguage(),
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on("languageChanged", (lng) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
  }
});

export default i18n;

