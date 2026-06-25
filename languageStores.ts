import { create } from "zustand";

type Language = "en" | "ta";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: (localStorage.getItem("agrivet_lang") as Language) || "en",
  setLanguage: (language) => {
    localStorage.setItem("agrivet_lang", language);
    set({ language });
  },
}));
