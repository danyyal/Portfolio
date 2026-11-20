import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { ModelDetail } from "../../data/modelDetails";
import LineChart from "./LineChart";
import Heatmap from "./Heatmap";
import CharMaps from "./CharMaps";
import VitalsPanel from "./VitalsPanel";
import ExampleStrip, { hasExample } from "./ExampleStrip";
import "./ModelDialog.css";

export type Sheet = { kicker: string; title: string; detail: ModelDetail };

type Props = {
  sheet: Sheet | null;
  skin: "classic" | "mission";
  onClose: () => void;
};

function ModelDialog({ sheet, skin, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const detail = sheet?.detail;

  useEffect(() => {
    if (!sheet) return;
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, [sheet, onClose]);

  if (!sheet || !detail) return null;

  return createPortal(
    <div
      className="md-root"
      data-skin={skin}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="md-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="md-title"
      >
        <header className="md-head">
          <div>
            <p className="md-task">{sheet.kicker}</p>
            <h2 className="md-title" id="md-title">
              {sheet.title}
            </h2>
          </div>
          <button
            type="button"
            className="md-close"
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        <div className="md-body">
          <p className="md-role">{detail.role}</p>

          <dl className="md-stats">
            {detail.stats.map((stat) => (
              <div key={stat.label}>
                <dd>{stat.value}</dd>
                <dt>{stat.label}</dt>
              </div>
            ))}
          </dl>

          {detail.example && hasExample(detail.example) && (
            <ExampleStrip slug={detail.example} />
          )}

          {detail.chart && <LineChart chart={detail.chart} />}

          {detail.table && (
            <section className="md-section">
              <h3>{detail.table.title}</h3>
              <div className="md-table-wrap">
                <table className="md-table">
                  <thead>
                    <tr>
                      {detail.table.columns.map((column) => (
                        <th key={column} scope="col">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {detail.table.rows.map((row) => (
                      <tr key={row[0]}>
                        {row.map((cell, index) =>
                          index === 0 ? (
                            <th key={index} scope="row">
                              {cell}
                            </th>
                          ) : (
                            <td key={index}>{cell}</td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {detail.table.note && (
                <p className="md-table-note">{detail.table.note}</p>
              )}
            </section>
          )}

          {detail.heatmap && <Heatmap heatmap={detail.heatmap} />}

          {detail.illustration === "char-maps" && <CharMaps />}

          {detail.live === "vitals" && <VitalsPanel />}

          {detail.config?.map((group) => (
            <section className="md-section" key={group.title}>
              <h3>{group.title}</h3>
              <dl className="md-config">
                {group.rows.map((row) => (
                  <div key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}

          <section className="md-section">
            <h3>Decisions and lessons</h3>
            <ul className="md-notes">
              {detail.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default ModelDialog;
