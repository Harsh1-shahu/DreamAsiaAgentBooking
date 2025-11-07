import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { BookingProvider } from "./context/BookingContext.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/Booking">   {/* ⬅️ important */}
      <ThemeProvider>
        <AppWrapper>
          <BookingProvider>
            <App />
          </BookingProvider>
        </AppWrapper>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
