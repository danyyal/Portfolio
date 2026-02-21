import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

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
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <div
        style={{
          height,
          width: "100%",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid rgba(200, 137, 230, 0.3)",
        }}
      >
        <Viewer
          fileUrl={fileUrl}
          plugins={[defaultLayoutPluginInstance]}
          theme="dark"
        />
      </div>
    </Worker>
  );
}
