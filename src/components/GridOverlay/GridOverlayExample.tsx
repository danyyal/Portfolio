import { useState, type CSSProperties } from "react";
import * as fabric from "fabric";
import { initFabric, GRID_PRESETS } from "fabricjs-grid-overlay";
import { useGridCanvas } from "fabricjs-grid-overlay/react";
import type {
  SnapEvent,
  CellEvent,
  ResizeEvent,
} from "fabricjs-grid-overlay";
import { PDFDocument } from "pdf-lib";

initFabric(fabric);

// --- Style helpers (all inline to avoid Bootstrap/Tailwind conflicts) ---
const btnBase: CSSProperties = {
  padding: "6px 14px",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.15s ease",
  fontFamily: "Inter, system-ui, sans-serif",
  lineHeight: 1.4,
  whiteSpace: "nowrap",
};
const btnDefault: CSSProperties = {
  ...btnBase,
  background: "#fff",
  color: "#374151",
};
const btnActive: CSSProperties = {
  ...btnBase,
  background: "#017e40",
  color: "#fff",
  borderColor: "#017e40",
};
const btnDanger: CSSProperties = {
  ...btnBase,
  background: "#ef4444",
  color: "#fff",
  borderColor: "#ef4444",
};
const btnInfo: CSSProperties = {
  ...btnBase,
  background: "#3b82f6",
  color: "#fff",
  borderColor: "#3b82f6",
};

const labelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  minWidth: 90,
};

const statusBadge = (active: boolean): CSSProperties => ({
  fontSize: 11,
  padding: "2px 8px",
  borderRadius: 10,
  background: active ? "#dcfce7" : "#f3f4f6",
  color: active ? "#166534" : "#6b7280",
  fontWeight: 500,
  display: "inline-block",
  marginTop: 4,
});

const logBadge = (bg: string, color: string): CSSProperties => ({
  fontSize: 11,
  padding: "2px 6px",
  borderRadius: 10,
  background: bg,
  color,
  fontWeight: 600,
  fontFamily: "monospace",
  display: "inline-block",
  wordBreak: "break-all",
});

const rowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 4,
  marginTop: 4,
};

const GridOverlayExample = () => {
  const [snapLog, setSnapLog] = useState("");
  const [cellClickLog, setCellClickLog] = useState("");
  const [cellHoverLog, setCellHoverLog] = useState("");
  const [resizeLog, setResizeLog] = useState("");
  const [shapesVisible, setShapesVisible] = useState(false);

  const gc = useGridCanvas({
    grid: {
      rows: 4,
      columns: 6,
      lineColor: "rgba(1, 126, 64, 0.6)",
      labelColor: "rgba(1, 126, 64, 0.8)",
      showLabels: true,
      labelScheme: "rows-numbers",
      strokeWidth: 2,
      snap: true,
      snapThreshold: 12,
      snapGuides: true,
      snapGuideColor: "rgba(239, 68, 68, 0.7)",
      snapGuideDash: [6, 4],
      snapGuideStrokeWidth: 1,
    },
    containerPadding: 24,
    backgroundColor: "#fafafa",
    onSnap: (event: SnapEvent) => {
      setSnapLog(
        `Cell ${event.cell} | ${event.axis} | (${Math.round(event.position.x)}, ${Math.round(event.position.y)})`,
      );
    },
    onCellClick: (event: CellEvent) => {
      setCellClickLog(
        `Clicked ${event.label} (row=${event.row}, col=${event.col})`,
      );
    },
    onCellHover: (event: CellEvent | null) => {
      setCellHoverLog(event ? event.label : "");
    },
    onResize: (event: ResizeEvent) => {
      const sizes =
        event.type === "row" ? event.rowHeights : event.columnWidths;
      setResizeLog(
        `${event.type} divider ${event.dividerIndex} | [${sizes.map((s) => Math.round(s)).join(", ")}]`,
      );
    },
    onChange: (state) => console.log("Grid modified:", state),
    syncGridOnMove: true,
  });

  // --- Demo shapes ---
  const handleToggleShapes = () => {
    const canvas = gc.getFabricCanvas();
    if (!canvas) return;
    const next = !shapesVisible;
    if (next) {
      const rect = new fabric.Rect({
        left: 50,
        top: 50,
        width: 80,
        height: 50,
        fill: "rgba(59, 130, 246, 0.6)",
        stroke: "#2563eb",
        strokeWidth: 2,
        rx: 4,
        ry: 4,
      });
      const circle = new fabric.Circle({
        left: 250,
        top: 200,
        radius: 30,
        fill: "rgba(168, 85, 247, 0.5)",
        stroke: "#7c3aed",
        strokeWidth: 2,
      });
      const triangle = new fabric.Triangle({
        left: 500,
        top: 100,
        width: 70,
        height: 60,
        fill: "rgba(251, 146, 60, 0.5)",
        stroke: "#ea580c",
        strokeWidth: 2,
      });
      canvas.add(rect, circle, triangle);
    } else {
      const objects = canvas.getObjects();
      const toRemove = objects.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (o: any) =>
          o instanceof fabric.Rect ||
          o instanceof fabric.Circle ||
          o instanceof fabric.Triangle,
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toRemove.forEach((o: any) => canvas.remove(o));
    }
    canvas.requestRenderAll();
    setShapesVisible(next);
  };

  const handleLoadImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async () => {
        await gc.loadImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleToggleRenderers = () => {
    if (!gc.customRenderers) {
      gc.setRenderCell(({ row, col, bounds, fabric: fab }) => {
        if (row === col) {
          const r = Math.min(bounds.width, bounds.height) * 0.15;
          return [
            new fab.Circle({
              left: bounds.left + bounds.width / 2,
              top: bounds.top + bounds.height / 2,
              radius: r,
              fill: "rgba(168, 85, 247, 0.4)",
              stroke: "#7c3aed",
              strokeWidth: 1,
              originX: "center",
              originY: "center",
              selectable: false,
              evented: false,
            }),
          ];
        }
        return [];
      });
    } else {
      gc.setRenderCell(undefined);
    }
  };

  const handleToggleCellColors = () => {
    if (!gc.cellColorsActive) {
      gc.setCellColors({
        A1: "rgba(239, 68, 68, 0.15)",
        A2: "rgba(239, 68, 68, 0.15)",
        A3: "rgba(239, 68, 68, 0.15)",
        B1: "rgba(59, 130, 246, 0.15)",
        B2: "rgba(59, 130, 246, 0.15)",
        B3: "rgba(59, 130, 246, 0.15)",
        C1: "rgba(34, 197, 94, 0.15)",
        C2: "rgba(34, 197, 94, 0.15)",
        C3: "rgba(34, 197, 94, 0.15)",
      });
    } else {
      gc.setCellColors(undefined);
    }
  };

  const handleCycleBorderStyle = () => {
    const order: Array<"full" | "inner" | "none"> = ["full", "inner", "none"];
    const next = order[(order.indexOf(gc.borderStyle) + 1) % order.length];
    gc.setBorderStyle(next);
  };

  const handleHighlightDemo = () => {
    gc.highlightCells([
      { cell: "A1", color: "rgba(239, 68, 68, 0.4)" },
      { cell: "B2", color: "rgba(59, 130, 246, 0.4)" },
      { cell: "C3", color: "rgba(34, 197, 94, 0.4)" },
      { cell: "D4", color: "rgba(168, 85, 247, 0.4)" },
    ]);
  };

  const handleLogState = () => {
    console.log("Grid State:", gc.getGridState());
    console.log("Grid Config:", gc.getGridConfig());
  };

  const handleExportPdf = async () => {
    const gridCanvas = gc.getGridCanvas();
    if (!gridCanvas) return;
    const canvas = gridCanvas.getCanvas();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prevVpt = canvas.viewportTransform
      ? [...canvas.viewportTransform]
      : [1, 0, 0, 1, 0, 0];
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    canvas.renderAll();
    const cw = canvas.getWidth();
    const ch = canvas.getHeight();
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvas.setViewportTransform(prevVpt as any);
    canvas.renderAll();
    const pdfDoc = await PDFDocument.create();
    const imageBytes = await fetch(dataURL).then((res) => res.arrayBuffer());
    const pngImage = await pdfDoc.embedPng(imageBytes);
    const PPI = 72;
    const pw = (cw / 96) * PPI;
    const ph = (ch / 96) * PPI;
    const page = pdfDoc.addPage([pw, ph]);
    page.drawImage(pngImage, { x: 0, y: 0, width: pw, height: ph });
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([new Uint8Array(pdfBytes)], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `grid-overlay-${new Date().toISOString().replace(/[:.]/g, "-")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const handleExportPng = () => {
    const dataUrl = gc.toDataURL("png");
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `grid-canvas-${new Date().toISOString().replace(/[:.]/g, "-")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isHtml = gc.canvasMode === "html-element";

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 75px)",
        fontFamily: "Inter, system-ui, sans-serif",
        position: "relative",
      }}
    >
      {/* Left panel — controls */}
      <div
        style={{
          width: "30%",
          minWidth: 280,
          maxWidth: 380,
          flexShrink: 0,
          overflowY: "auto",
          borderRight: "1px solid #e5e7eb",
          background: "#f9fafb",
          padding: 16,
        }}
      >
        <h2
          style={{
            margin: "0 0 4px",
            fontSize: 18,
            fontWeight: 700,
            color: "#111827",
          }}
        >
          GridCanvas
        </h2>
        <p style={{ color: "#6b7280", marginBottom: 12, fontSize: 13 }}>
          Load a base64 image, draw a grid overlay, and interact with all
          features.
        </p>

        {/* Canvas mode toggle */}
        <div style={{ marginBottom: 12 }}>
          <div style={labelStyle}>Canvas Mode</div>
          <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
            <button
              style={isHtml ? btnActive : btnDefault}
              onClick={() => gc.switchMode("html-element")}
            >
              HTML Element
            </button>
            <button
              style={!isHtml ? btnActive : btnDefault}
              onClick={() => gc.switchMode("fabric-instance")}
            >
              Fabric Instance
            </button>
          </div>
          <span style={{ ...statusBadge(true), fontSize: 10 }}>
            {isHtml
              ? "GridCanvas creates Fabric canvas internally"
              : "You create Fabric canvas, pass it to GridCanvas"}
          </span>
        </div>

        {/* Snap log */}
        {snapLog && (
          <div
            style={{
              padding: "4px 10px",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: 6,
              fontSize: 12,
              color: "#166534",
              marginBottom: 8,
              fontFamily: "monospace",
              wordBreak: "break-all",
            }}
          >
            Snap: {snapLog}
          </div>
        )}

        <div
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          {/* Image */}
          <div>
            <div style={labelStyle}>Image</div>
            <div style={rowStyle}>
              <button style={btnInfo} onClick={handleLoadImage}>
                Load Image
              </button>
              <button
                style={btnDefault}
                onClick={gc.clearImage}
                disabled={!gc.hasImage}
              >
                Clear
              </button>
              {(["contain", "cover", "stretch", "original"] as const).map(
                (fit) => (
                  <button
                    key={fit}
                    style={gc.imageFit === fit ? btnActive : btnDefault}
                    onClick={() => gc.changeImageFit(fit)}
                  >
                    {fit}
                  </button>
                ),
              )}
            </div>
            <span style={statusBadge(gc.hasImage)}>
              {gc.hasImage ? "Image loaded" : "No image"}
            </span>
          </div>

          {/* Grid */}
          <div>
            <div style={labelStyle}>Grid</div>
            <div style={rowStyle}>
              <button
                style={gc.gridVisible ? btnActive : btnDanger}
                onClick={() => gc.toggleGrid(!gc.gridVisible)}
              >
                Grid {gc.gridVisible ? "ON" : "OFF"}
              </button>
              <button style={btnDefault} onClick={gc.addRow}>
                + Row
              </button>
              <button style={btnDefault} onClick={gc.removeRow}>
                - Row
              </button>
              <button style={btnDefault} onClick={gc.addColumn}>
                + Col
              </button>
              <button style={btnDefault} onClick={gc.removeColumn}>
                - Col
              </button>
              <button
                style={
                  gc.borderStyle === "inner"
                    ? btnActive
                    : gc.borderStyle === "none"
                      ? btnDanger
                      : btnDefault
                }
                onClick={handleCycleBorderStyle}
              >
                Border: {gc.borderStyle}
              </button>
              <button
                style={gc.customRenderers ? btnActive : btnDefault}
                onClick={handleToggleRenderers}
              >
                Renderers {gc.customRenderers ? "ON" : "OFF"}
              </button>
              <button
                style={shapesVisible ? btnActive : btnDefault}
                onClick={handleToggleShapes}
              >
                Shapes {shapesVisible ? "ON" : "OFF"}
              </button>
              <button
                style={gc.gridFollowsImage ? btnActive : btnDefault}
                onClick={() =>
                  gc.toggleGridFollowsImage(!gc.gridFollowsImage)
                }
              >
                Follow Image {gc.gridFollowsImage ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* Resize */}
          <div>
            <div style={labelStyle}>Resize</div>
            <div style={rowStyle}>
              <button
                style={gc.resizeEnabled ? btnActive : btnDefault}
                onClick={() => gc.toggleResize(!gc.resizeEnabled)}
              >
                Resize {gc.resizeEnabled ? "ON" : "OFF"}
              </button>
            </div>
            {resizeLog ? (
              <span style={logBadge("#fef3c7", "#92400e")}>{resizeLog}</span>
            ) : (
              <span style={statusBadge(gc.resizeEnabled)}>
                {gc.resizeEnabled ? "Drag dividers" : "Disabled"}
              </span>
            )}
          </div>

          {/* Labels */}
          <div>
            <div style={labelStyle}>Labels</div>
            <div style={rowStyle}>
              <button
                style={gc.showLabels ? btnActive : btnDefault}
                onClick={() => gc.toggleLabels(!gc.showLabels)}
              >
                Labels {gc.showLabels ? "ON" : "OFF"}
              </button>
              <button
                style={gc.omitIO ? btnActive : btnDefault}
                onClick={() => gc.toggleOmitIO(!gc.omitIO)}
              >
                Omit I&O {gc.omitIO ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* Colors */}
          <div>
            <div style={labelStyle}>Colors</div>
            <div style={rowStyle}>
              <button
                style={gc.cellColorsActive ? btnActive : btnDefault}
                onClick={handleToggleCellColors}
              >
                Cell Colors {gc.cellColorsActive ? "ON" : "OFF"}
              </button>
              <button
                style={gc.borderColorActive ? btnDanger : btnDefault}
                onClick={() =>
                  gc.setBorderColor(
                    gc.borderColorActive ? undefined : "#ef4444",
                  )
                }
              >
                Border Color {gc.borderColorActive ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* Snap */}
          <div>
            <div style={labelStyle}>Snap</div>
            <div style={rowStyle}>
              <button
                style={gc.snap ? btnActive : btnDefault}
                onClick={() => gc.toggleSnap(!gc.snap)}
              >
                Snap {gc.snap ? "ON" : "OFF"}
              </button>
              <button
                style={gc.snapGuides ? btnActive : btnDefault}
                onClick={() => gc.toggleSnapGuides(!gc.snapGuides)}
              >
                Guides {gc.snapGuides ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* Layer & zoom */}
          <div>
            <div style={labelStyle}>Layer</div>
            <div style={rowStyle}>
              <button
                style={gc.sendToBack ? btnDanger : btnDefault}
                onClick={() => gc.toggleSendToBack(!gc.sendToBack)}
              >
                Background {gc.sendToBack ? "ON" : "OFF"}
              </button>
              <button
                style={gc.zoomPanAware ? btnInfo : btnDefault}
                onClick={() => gc.toggleZoomPanAware(!gc.zoomPanAware)}
              >
                Zoom-Aware {gc.zoomPanAware ? "ON" : "OFF"}
              </button>
              <button style={btnDefault} onClick={gc.resetZoom}>
                Reset Zoom
              </button>
            </div>
          </div>

          {/* Highlighting */}
          <div>
            <div style={labelStyle}>Highlight</div>
            <div style={rowStyle}>
              <button
                style={gc.highlightsActive ? btnActive : btnDefault}
                onClick={handleHighlightDemo}
              >
                Highlight Cells
              </button>
              <button style={btnDefault} onClick={gc.clearHighlights}>
                Clear
              </button>
            </div>
          </div>

          {/* Cell events */}
          <div>
            <div style={labelStyle}>Cell Events</div>
            <div style={rowStyle}>
              {cellHoverLog && (
                <span style={logBadge("#f0fdf4", "#166534")}>
                  Hover: {cellHoverLog}
                </span>
              )}
              {cellClickLog && (
                <span style={logBadge("#dbeafe", "#1e40af")}>
                  {cellClickLog}
                </span>
              )}
              {!cellHoverLog && !cellClickLog && (
                <span style={statusBadge(false)}>Hover or click cells</span>
              )}
            </div>
          </div>

          {/* Presets */}
          <div>
            <div style={labelStyle}>Presets</div>
            <div style={rowStyle}>
              {GRID_PRESETS.names.map((name) => (
                <button
                  key={name}
                  style={gc.activePreset === name ? btnActive : btnDefault}
                  onClick={() => gc.applyPreset(name)}
                >
                  {name}
                </button>
              ))}
              <button style={btnDanger} onClick={gc.resetPreset}>
                Reset
              </button>
            </div>
          </div>

          {/* Export */}
          <div>
            <div style={labelStyle}>Export</div>
            <div style={rowStyle}>
              <button style={btnInfo} onClick={handleExportPdf}>
                PDF
              </button>
              <button style={btnInfo} onClick={handleExportPng}>
                PNG
              </button>
              <button style={btnDefault} onClick={handleLogState}>
                Log State
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — canvas */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          minHeight: 0,
        }}
      >
        {/* Mode badge */}
        <div
          style={{
            padding: "6px 12px",
            background: isHtml ? "#dbeafe" : "#ede9fe",
            borderBottom: `2px solid ${isHtml ? "#1e40af" : "#5b21b6"}`,
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: isHtml ? "#1e40af" : "#5b21b6",
            }}
          >
            {isHtml ? "Mode: HTML Element" : "Mode: Fabric Instance"}
          </span>
          <span style={{ fontSize: 11, color: "#6b7280" }}>
            {isHtml
              ? "GridCanvas.create({ canvas: HTMLCanvasElement, width, height, grid })"
              : "GridCanvas.create({ canvas: new fabric.Canvas(...), grid })"}
          </span>
        </div>

        {/* Canvas container */}
        <div
          ref={gc.containerRef}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 12,
            background: "#fff",
            overflow: "hidden",
            minHeight: 0,
          }}
        />
      </div>
    </div>
  );
};

export default GridOverlayExample;
