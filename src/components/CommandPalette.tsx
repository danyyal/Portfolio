import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineFundProjectionScreen,
  AiFillGithub,
  AiOutlineExperiment,
} from "react-icons/ai";
import { CgFileDocument } from "react-icons/cg";
import { SlSpeech } from "react-icons/sl";
import { FaLinkedinIn } from "react-icons/fa";
import {
  HiOutlineMail,
  HiOutlineMoon,
  HiOutlineSearch,
  HiOutlineDownload,
} from "react-icons/hi";
import { useTheme } from "../context/ThemeContext";
import { useMode } from "../context/ModeContext";
import { IoRocketOutline } from "react-icons/io5";
import { otherRoutes } from "../routes";
import pdf from "../Assets/Resume.pdf";

import { OPEN_PALETTE_EVENT } from "./paletteEvent";

type Command = {
  id: string;
  label: string;
  section: string;
  icon: React.ReactNode;
  run: () => void;
};

function CommandPalette() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();
  const { setMode } = useMode();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const commands = useMemo<Command[]>(() => {
    const go = (to: string) => () => {
      navigate(to);
      close();
    };
    const pages: Command[] = [
      {
        id: "home",
        label: t("nav.home"),
        section: t("footer.pages"),
        icon: <AiOutlineHome />,
        run: go("/"),
      },
      {
        id: "about",
        label: t("nav.about"),
        section: t("footer.pages"),
        icon: <AiOutlineUser />,
        run: go("/about"),
      },
      {
        id: "projects",
        label: t("nav.projects"),
        section: t("footer.pages"),
        icon: <AiOutlineFundProjectionScreen />,
        run: go("/project"),
      },
      {
        id: "resume",
        label: t("nav.resume"),
        section: t("footer.pages"),
        icon: <CgFileDocument />,
        run: go("/resume"),
      },
      {
        id: "testimonial",
        label: t("nav.testimonial"),
        section: t("footer.pages"),
        icon: <SlSpeech />,
        run: go("/testimonial"),
      },
    ];
    const playground: Command[] = otherRoutes.map((route) => ({
      id: route.link,
      label: route.text,
      section: t("footer.playground"),
      icon: <AiOutlineExperiment />,
      run: go(route.link),
    }));
    const actions: Command[] = [
      {
        id: "mission",
        label: t("mode.toMission"),
        section: t("palette.actions"),
        icon: <IoRocketOutline />,
        run: () => {
          setMode("mission");
          navigate("/");
          close();
        },
      },
      {
        id: "theme",
        label: t("palette.toggleTheme"),
        section: t("palette.actions"),
        icon: <HiOutlineMoon />,
        run: () => {
          toggleTheme();
          close();
        },
      },
      {
        id: "email",
        label: t("home.copyEmail"),
        section: t("palette.actions"),
        icon: <HiOutlineMail />,
        run: () => {
          navigator.clipboard
            ?.writeText("danyyal.ali.31@gmail.com")
            .catch(() => {});
          close();
        },
      },
      {
        id: "cv",
        label: "Download CV",
        section: t("palette.actions"),
        icon: <HiOutlineDownload />,
        run: () => {
          const a = document.createElement("a");
          a.href = pdf;
          a.download = "Danyyal Ali Yar - Resume.pdf";
          a.click();
          close();
        },
      },
      {
        id: "github",
        label: "GitHub",
        section: t("palette.actions"),
        icon: <AiFillGithub />,
        run: () => {
          window.open("https://github.com/danyyal", "_blank");
          close();
        },
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        section: t("palette.actions"),
        icon: <FaLinkedinIn />,
        run: () => {
          window.open(
            "https://www.linkedin.com/in/sheikh-danyyal-ali-08b768193/",
            "_blank",
          );
          close();
        },
      },
    ];
    return [...pages, ...playground, ...actions];
  }, [t, navigate, toggleTheme, setMode, close]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((command) =>
      command.label.toLowerCase().includes(q),
    );
  }, [commands, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") close();
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpenEvent);
    };
  }, [close]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!open) return null;

  let lastSection = "";

  return (
    <div className="palette-overlay" onClick={close} role="presentation">
      <div
        className="palette-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="palette-input-row">
          <HiOutlineSearch />
          <input
            ref={inputRef}
            className="palette-input"
            placeholder={t("palette.placeholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter") {
                filtered[activeIndex]?.run();
              }
            }}
          />
          <kbd className="palette-kbd">esc</kbd>
        </div>
        <div className="palette-list" role="listbox">
          {filtered.length === 0 && (
            <div className="palette-empty">
              {t("palette.noResults")} “{query}”
            </div>
          )}
          {filtered.map((command, index) => {
            const showSection = command.section !== lastSection;
            lastSection = command.section;
            return (
              <div key={command.id}>
                {showSection && (
                  <div className="palette-section">{command.section}</div>
                )}
                <button
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  className={`palette-item ${index === activeIndex ? "active" : ""}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => command.run()}
                >
                  <span className="palette-item-icon">{command.icon}</span>
                  {command.label}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
