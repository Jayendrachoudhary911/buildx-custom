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
import DesignRegistrationSolo from "./events/design-event/RegistrationSolo";
import DevEventPage from "./events/dev-event/Dev";
import TeamDashboard from "./events/team-dashboard/TeamDashboard";
import TeamLogin from "./events/team-dashboard/TeamLogin";
import TeamPass from "./events/team-dashboard/TeamPass";
import TeamSettings from "./events/team-dashboard/TeamSettings";
import Leaderboard from "./events/team-dashboard/Leaderboard";
import ProjectSubmission from "./events/team-dashboard/ProjectSubmission";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {

  const location = useLocation();

  const [booting, setBooting] = useState(true);
  const [showIntro, setShowIntro] = useState(false);

  /* ───────── ROUTE CHECKS ───────── */

  const hideLayoutRoutes = [
    "/team-login"
  ];

  const isTeamDashboardRoute = location.pathname.startsWith("/team-dashboard");

  const shouldHideLayout =
    hideLayoutRoutes.includes(location.pathname) ||
    isTeamDashboardRoute;

  /* ───────── BOOT ONLY ON HOME ───────── */

  useEffect(() => {

    if (location.pathname === "/") {

      const bootTimer = setTimeout(() => {

        setBooting(false);

        const seen =
          localStorage.getItem("buildx_intro_seen") === "true";

        setShowIntro(!seen);

      }, 4800);

      return () => clearTimeout(bootTimer);

    } else {

      setBooting(false);

    }

  }, [location.pathname]);

  /* ───────── LOADING SCREEN ───────── */

  if (booting && location.pathname === "/") {
    return <LoadingScreen />;
  }

  return (
    <AppBackground>

      {/* NAVBAR (HIDDEN ON TEAM ROUTES) */}

      {!shouldHideLayout && <Navbar />}

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />

        <Route path="/events" element={<EventsPage />} />
        <Route path="/contact-us" element={<ContactUs />} />

        <Route path="/design-event" element={<DesignEventPage />} />
        <Route path="/design-event/a/solo-participant/registration" element={<DesignRegistrationSolo />} />

        <Route path="/dev-event" element={<DevEventPage />} />

        {/* TEAM FLOW */}

        <Route path="/team-login" element={<TeamLogin />} />
        <Route path="/team-dashboard/:eventregistrationID" element={<TeamDashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/team-settings/:eventregistrationID" element={<TeamSettings />} />
        <Route path="/team-pass/:eventregistrationID" element={<TeamPass />} />
        <Route path="/submission/:eventregistrationID" element={<ProjectSubmission />} />

      </Routes>

      {/* FOOTER (HIDDEN ON TEAM ROUTES) */}

      {!shouldHideLayout && <Footer />}

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
