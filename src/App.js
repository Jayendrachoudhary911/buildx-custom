import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import LoadingScreen from "./components/LoadingScreen";
import IntroFlow from "./pages/IntroFlow";
import Home from "./pages/Home";
import AppBackground from "./components/AppBackground";

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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>

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
