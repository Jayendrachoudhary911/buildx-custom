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
        backgroundColor: `
            radial-gradient(circle at 30% 50%, rgba(131, 87, 43, 0.74) 0%, transparent 60%),
            radial-gradient(circle at 80% 80%, rgba(79, 38, 8, 0.2) 0%, transparent 50%),
            linear-gradient(180deg, rgba(183, 151, 122, 0.66) 0%, rgba(255, 235, 220, 0.18) 100%)
          `,

        /* 🌫 OVERLAY FOR READABILITY */
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.4))",
          backdropFilter: "saturate(1.9) brightness(1.95) blur(30px)",
          zIndex: 0,
        },

        /* 🌾 GRAIN */
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
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
