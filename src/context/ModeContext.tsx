import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type SiteMode = "classic" | "mission";

interface ModeContextType {
  mode: SiteMode;
  setMode: (mode: SiteMode) => void;
  toggleMode: () => void;
}

const STORAGE_KEY = "site-mode";

// Falls back to classic so components render without a provider (tests).
const ModeContext = createContext<ModeContextType>({
  mode: "classic",
  setMode: () => {},
  toggleMode: () => {},
});

function readInitialMode(): SiteMode {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("mode");
    if (fromUrl === "mission" || fromUrl === "classic") return fromUrl;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "mission" || stored === "classic") return stored;
  } catch {
    // storage blocked: classic
  }
  return "classic";
}

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<SiteMode>(readInitialMode);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // storage blocked: mode lasts for this visit only
    }
  }, [mode]);

  const setMode = useCallback((next: SiteMode) => setModeState(next), []);
  const toggleMode = useCallback(
    () => setModeState((prev) => (prev === "classic" ? "mission" : "classic")),
    [],
  );

  return (
    <ModeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  return useContext(ModeContext);
}
