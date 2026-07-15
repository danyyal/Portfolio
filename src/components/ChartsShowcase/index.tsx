import { useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import Particle from "../Particle";
import { useTheme } from "../../context/ThemeContext";
import "./charts.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
);

/* Categorical slots validated with the palette validator (CVD, lightness,
   contrast) per mode — assigned in fixed order, never cycled. */
const SLOTS = {
  dark: ["#0284c7", "#ec4899", "#8b5cf6", "#d97706"],
  light: ["#0284c7", "#be185d", "#6d28d9", "#b45309"],
};

const MONTHS = [
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
];
const FRONTEND_COMMITS = [42, 55, 48, 62, 38, 71, 66, 80, 74, 90, 85, 96];
const BACKEND_COMMITS = [30, 34, 45, 40, 28, 52, 58, 49, 63, 60, 72, 78];

const TECH_HOURS = {
  labels: ["React", "Node.js", "TypeScript", "Three.js", "AEM", "Python"],
  hours: [640, 480, 590, 210, 320, 150],
};

const PROJECT_MIX = {
  labels: ["SaaS platforms", "E-commerce", "3D / Creative", "Tooling"],
  values: [46, 24, 18, 12],
};

const STATS = [
  { value: "6+", label: "Years experience" },
  { value: "25+", label: "Projects shipped" },
  { value: "40+", label: "Technologies used" },
  { value: "12", label: "Happy clients" },
];

const DataTable = ({
  caption,
  head,
  rows,
}: {
  caption: string;
  head: string[];
  rows: (string | number)[][];
}) => (
  <details className="chart-table-toggle">
    <summary>View data as table</summary>
    <table className="chart-data-table">
      <caption className="visually-hidden">{caption}</caption>
      <thead>
        <tr>
          {head.map((h) => (
            <th key={h}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </details>
);

function ChartsShowcase() {
  const { theme } = useTheme();

  const { slots, ink, inkMuted, grid, surface } = useMemo(() => {
    const dark = theme === "dark";
    return {
      slots: SLOTS[theme],
      ink: dark ? "#eaf2ff" : "#0f1e35",
      inkMuted: dark ? "#8fa0c0" : "#5f7495",
      grid: dark ? "rgba(148, 199, 255, 0.08)" : "rgba(2, 62, 138, 0.08)",
      surface: dark ? "#081226" : "#ffffff",
    };
  }, [theme]);

  const baseScales = {
    x: {
      grid: { display: false },
      ticks: { color: inkMuted, font: { family: "Inter" } },
      border: { color: grid },
    },
    y: {
      grid: { color: grid },
      ticks: { color: inkMuted, font: { family: "Inter" } },
      border: { display: false },
    },
  };

  const tooltipStyle = {
    backgroundColor: theme === "dark" ? "#0d1b33" : "#ffffff",
    titleColor: ink,
    bodyColor: inkMuted,
    borderColor: grid,
    borderWidth: 1,
    padding: 10,
    cornerRadius: 8,
    boxPadding: 4,
  };

  const legendStyle = {
    labels: {
      color: ink,
      usePointStyle: true,
      pointStyleWidth: 10,
      boxHeight: 8,
      font: { family: "Inter", size: 12 },
    },
  };

  const lineData = {
    labels: MONTHS,
    datasets: [
      {
        label: "Frontend",
        data: FRONTEND_COMMITS,
        borderColor: slots[0],
        backgroundColor: slots[0],
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 2,
        pointHoverBorderColor: surface,
        tension: 0.35,
      },
      {
        label: "Backend",
        data: BACKEND_COMMITS,
        borderColor: slots[1],
        backgroundColor: slots[1],
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 2,
        pointHoverBorderColor: surface,
        tension: 0.35,
      },
    ],
  };

  const barData = {
    labels: TECH_HOURS.labels,
    datasets: [
      {
        label: "Hours",
        data: TECH_HOURS.hours,
        backgroundColor: slots[0],
        borderRadius: { topLeft: 4, topRight: 4 },
        borderSkipped: "bottom" as const,
        barPercentage: 0.55,
        categoryPercentage: 0.8,
      },
    ],
  };

  const doughnutData = {
    labels: PROJECT_MIX.labels,
    datasets: [
      {
        data: PROJECT_MIX.values,
        backgroundColor: slots,
        borderColor: surface,
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container style={{ maxWidth: 1080 }}>
        <div className="section-header" style={{ marginBottom: "2rem" }}>
          <h1 className="project-heading">
            <span className="section-title">Chart.js</span>{" "}
            <strong className="purple-glow">Data Studio</strong>
          </h1>
          <p className="section-subtitle">
            Theme-aware charts with colorblind-validated palettes, built with
            Chart.js 4 + react-chartjs-2. Toggle the site theme — every chart
            re-inks itself.
          </p>
        </div>

        <Row className="g-3 mb-4">
          {STATS.map((stat) => (
            <Col xs={6} md={3} key={stat.label}>
              <div className="stat-tile">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </Col>
          ))}
        </Row>

        <Row className="g-4">
          <Col lg={7}>
            <div className="chart-card">
              <h3 className="chart-title">Commits per month</h3>
              <p className="chart-subtitle">Last 12 months, by area</p>
              <div className="chart-canvas" style={{ height: 300 }}>
                <Line
                  data={lineData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: "index", intersect: false },
                    plugins: {
                      legend: { position: "top", align: "end", ...legendStyle },
                      tooltip: tooltipStyle,
                    },
                    scales: baseScales,
                  }}
                />
              </div>
              <DataTable
                caption="Commits per month by area"
                head={["Month", "Frontend", "Backend"]}
                rows={MONTHS.map((m, i) => [
                  m,
                  FRONTEND_COMMITS[i],
                  BACKEND_COMMITS[i],
                ])}
              />
            </div>
          </Col>

          <Col lg={5}>
            <div className="chart-card">
              <h3 className="chart-title">Project mix</h3>
              <p className="chart-subtitle">Share of delivered work</p>
              <div className="chart-canvas" style={{ height: 300 }}>
                <Doughnut
                  data={doughnutData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "62%",
                    plugins: {
                      legend: { position: "bottom", ...legendStyle },
                      tooltip: tooltipStyle,
                    },
                  }}
                />
              </div>
              <DataTable
                caption="Share of delivered work by project type"
                head={["Type", "Share %"]}
                rows={PROJECT_MIX.labels.map((l, i) => [
                  l,
                  PROJECT_MIX.values[i],
                ])}
              />
            </div>
          </Col>

          <Col xs={12}>
            <div className="chart-card">
              <h3 className="chart-title">Hours per technology</h3>
              <p className="chart-subtitle">This year, tracked time</p>
              <div className="chart-canvas" style={{ height: 280 }}>
                <Bar
                  data={barData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: tooltipStyle,
                    },
                    scales: baseScales,
                  }}
                />
              </div>
              <DataTable
                caption="Tracked hours per technology this year"
                head={["Technology", "Hours"]}
                rows={TECH_HOURS.labels.map((l, i) => [
                  l,
                  TECH_HOURS.hours[i],
                ])}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default ChartsShowcase;
