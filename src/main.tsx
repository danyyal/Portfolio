import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "./i18n";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";

// Chakra's global preflight fights Bootstrap and Tailwind resets; the
// components it styles don't need it.
const chakraSystem = createSystem(defaultConfig, { preflight: false });
import { ThemeProvider } from "./context/ThemeContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <ChakraProvider value={chakraSystem}>
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
