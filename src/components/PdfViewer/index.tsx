import { SpecialZoomLevel, Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.js?url";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

interface PdfViewerProps {
  fileUrl: string;
  height?: string;
}

export default function PdfViewer({
  fileUrl,
  height = "660px",
}: PdfViewerProps) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <Worker workerUrl={workerUrl}>
      <div
        style={{
          height,
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid var(--glass-border)",
        }}
      >
        <Viewer
          fileUrl={fileUrl}
          plugins={[defaultLayoutPluginInstance]}
          defaultScale={SpecialZoomLevel.PageWidth}
          theme="dark"
        />
      </div>
    </Worker>
  );
}
