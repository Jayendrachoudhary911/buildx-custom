import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import LoadingScreen from "./components/LoadingScreen";
import IntroFlow from "./pages/IntroFlow";
import Home from "./pages/Home";
import AppBackground from "./components/AppBackground";
import ContactUs from "./pages/ContactUs";
import EventsPage from "./pages/Events";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  const [booting, setBooting] = useState(true);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setBooting(false);
      const seen =
        localStorage.getItem("buildx_intro_seen") === "true";
      setShowIntro(!seen);
    }, 4800);

    return () => clearTimeout(bootTimer);
  }, []);

  if (booting) {
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
      </Routes>
      <Footer />

      {showIntro && (
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
