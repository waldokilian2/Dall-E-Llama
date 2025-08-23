import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css"; // Only import globals.css
import { ThemeProvider } from "next-themes";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" attribute="class">
    <App />
  </ThemeProvider>
);