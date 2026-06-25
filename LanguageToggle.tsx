import { useLanguageStore } from "@/store/languageStore";

export function LanguageToggle({ collapsed = false }: { collapsed?: boolean }) {
  const { language, setLanguage } = useLanguageStore();

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "ta" : "en")}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-green-100 hover:bg-green-800 text-sm font-medium w-full"
      title={language === "en" ? "Switch to Tamil" : "Switch to English"}
    >
      <span className="text-base">{language === "en" ? "🇮🇳" : "🇬🇧"}</span>
      {!collapsed && (
        <span className="font-semibold">
          {language === "en" ? "தமிழ்" : "English"}
        </span>
      )}
    </button>
  );
}
