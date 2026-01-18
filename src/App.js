import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import LoadingScreen from "./components/LoadingScreen";
import IntroFlow from "./pages/IntroFlow";
import Home from "./pages/Home";
import AppBackground from "./components/AppBackground";
import ContactUs from "./pages/ContactUs";
import EventsPage from "./pages/Events";
import DesignEventPage from "./events/design-event/Design";
import DesignRegistrationForm from "./events/design-event/RegistrationForm";
import DevEventPage from "./events/dev-event/Dev";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  const location = useLocation();

  const [booting, setBooting] = useState(true);
  const [showIntro, setShowIntro] = useState(false);

  /* ───────── BOOT ONLY ON HOME ROUTE ───────── */

  useEffect(() => {
    // Only trigger loading when landing on home
    if (location.pathname === "/") {
      const bootTimer = setTimeout(() => {
        setBooting(false);

        const seen =
          localStorage.getItem("buildx_intro_seen") === "true";

        setShowIntro(!seen);
      }, 4800);

      return () => clearTimeout(bootTimer);
    } else {
      // Skip loading for all other routes
      setBooting(false);
    }
  }, [location.pathname]);

  /* ───────── SHOW LOADING ONLY FOR HOME ───────── */

  if (booting && location.pathname === "/") {
    return <LoadingScreen />;
  }

  return (
    <AppBackground>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/design-event" element={<DesignEventPage />} />
        <Route path="/design-event/register" element={<DesignRegistrationForm />} />
        <Route path="/dev-event" element={<DevEventPage />} />
      </Routes>

      <Footer />

      {/* INTRO FLOW ONLY ON HOME */}

      {showIntro && location.pathname === "/" && (
        <IntroFlow
          onComplete={() => {
            localStorage.setItem("buildx_intro_seen", "true");
            setShowIntro(false);
          }}
        />
      )}
    </AppBackground>
  );
}
