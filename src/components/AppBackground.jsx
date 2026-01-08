import { Box } from "@mui/material";
import bg from "../assets/intro-wallps/main.png";

export default function AppBackground({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",

        /* 🌄 BACKGROUND IMAGE */
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",

        /* 🌫 OVERLAY FOR READABILITY */
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.85))",
          zIndex: 0,
        },

        /* 🌾 GRAIN */
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "repeating-radial-gradient(circle, rgba(255,255,255,0.03) 0 1px, transparent 1px 3px)",
          mixBlendMode: "overlay",
          pointerEvents: "none",
          zIndex: 0,
        },
      }}
    >
      {/* CONTENT LAYER */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {children}
      </Box>
    </Box>
  );
}
