import { useState } from "react";
import GitHubCalendar from "react-github-calendar";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";

type YearOption = number | "last";

function Github() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<YearOption>(currentYear);

  const options: { value: YearOption; label: string }[] = [
    { value: currentYear - 1, label: t("about.previousYear") },
    { value: "last", label: t("about.lastYear") },
    { value: currentYear, label: t("about.currentYear") },
  ];

  return (
    <>
      <h1 className="project-heading" style={{ paddingBottom: "20px" }}>
        {t("about.daysI")} <strong className="purple">{t("about.code")}</strong>
      </h1>

      <div className="year-btn-group" role="group" aria-label="Select year">
        {options.map((option) => (
          <button
            key={String(option.value)}
            type="button"
            className={`year-btn ${selectedYear === option.value ? "active" : ""}`}
            onClick={() => setSelectedYear(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="calendar-wrap">
        <GitHubCalendar
          username="danyyal"
          blockSize={14}
          blockMargin={5}
          fontSize={12}
          year={selectedYear}
          colorScheme={theme}
        />
      </div>
    </>
  );
}

export default Github;
