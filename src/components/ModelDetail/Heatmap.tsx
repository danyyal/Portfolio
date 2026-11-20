import type { ModelHeatmap } from "../../data/modelDetails";

/* A small matrix: one hue, pale to strong, with the value printed in every
   cell so colour is never the only way to read it. */
function Heatmap({ heatmap }: { heatmap: ModelHeatmap }) {
  const range = (values: number[]) => {
    const low = Math.min(...values);
    const high = Math.max(...values);
    return { low, high };
  };
  const whole = range(heatmap.values.flat());
  // rows on different scales are each shaded against their own range
  const perRow = heatmap.scale === "row";
  const scale = (value: number, rowIndex: number) => {
    const { low, high } = perRow ? range(heatmap.values[rowIndex]) : whole;
    return high === low ? 1 : (value - low) / (high - low);
  };
  const show = (value: number) =>
    `${value.toFixed(heatmap.digits)}${heatmap.suffix ?? ""}`;
  const { low, high } = whole;

  return (
    <section className="md-section">
      <h3>{heatmap.title}</h3>
      <div className="md-table-wrap">
        <table className={`md-heat ${heatmap.compact ? "is-compact" : ""}`}>
          <thead>
            <tr>
              <td />
              {heatmap.columns.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatmap.rows.map((row, rowIndex) => (
              <tr key={row}>
                <th scope="row">{row}</th>
                {heatmap.values[rowIndex].map((value, columnIndex) => {
                  const t = scale(value, rowIndex);
                  return (
                    <td key={columnIndex}>
                      <span
                        className={`md-heat-cell ${t > 0.55 ? "is-strong" : ""}`}
                        style={{ ["--t" as string]: 0.1 + t * 0.9 }}
                        title={`${row}, ${heatmap.columns[columnIndex]}: ${show(value)}`}
                      >
                        {show(value)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md-heat-scale" aria-hidden="true">
        <span>{perRow ? "lowest in row" : show(low)}</span>
        <i />
        <span>{perRow ? "highest in row" : show(high)}</span>
      </div>
      {heatmap.note && <p className="md-table-note">{heatmap.note}</p>}
    </section>
  );
}

export default Heatmap;
