/** Entry client — monta la SPA con BrowserRouter. */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { detectRouteLang } from "./i18n";
import { AuthProvider } from "./hooks/useAuth";
import "./styles/global.css";

// El idioma inicial coincide con el prerender/SSR según la URL de entrada,
// así el primer render del cliente y el HTML estático no discrepan.
const initialLang = detectRouteLang(window.location.pathname);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App initialLang={initialLang} />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
