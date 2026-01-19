// src/pages/Home.jsx
import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import HeroSection from "../sections/HeroSection";
import AboutSection from "../sections/AboutSection";
import EventsSection from "../sections/EventSection";
import HowItWorksSection from "../sections/HowItWorksTimeline";
import FAQSection from "../sections/FaqSection";
import FinalCTASection from "../sections/FinalCtaSection";

export default function Home() {
  return (
    <>
      <Box
        sx={{
          color: "#fff",
          minHeight: "100vh",
          backdropFilter: { xs : "blur(80px) saturate(1.9)", lg: "none" }
        }}
      >
        <HeroSection />
        <AboutSection />
        <EventsSection />
        <HowItWorksSection />
        <FAQSection />
        <FinalCTASection />
      </Box>
    </>
  );
}
