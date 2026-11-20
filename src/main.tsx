import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "./i18n";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { ModeProvider } from "./context/ModeContext";
import { startVitals } from "./components/ModelDetail/VitalsPanel";

startVitals();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ModeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ModeProvider>
    </ThemeProvider>
  </StrictMode>,
);
