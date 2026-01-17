// src/components/Footer.jsx
import { Box, Grid, Typography, Stack, IconButton } from "@mui/material";
import {
  Instagram,
  Linkedin,
  Youtube
} from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

const FOOTER_ITEMS = [
  { label: "Home", id: "/" },

  // Design hackathon (creative / UI)
  { label: "Design Event", id: "/design-event" },

  // Development hackathon (coding)
  { label: "Dev Event", id: "/dev-event" },

  // Team management
  { label: "Your Team", id: "/your-team" },

  // Contact / Support
  { label: "Contact Us", id: "/contact-us" },
];

  const handleNavClick = (item) => {
    // ROUTE navigation
    if (item.id.startsWith("/")) {
      navigate(item.id);
      return;
    }

    // SECTION scroll (only works on home)
    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      setTimeout(() => {
        document
          .getElementById(item.id)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document
        .getElementById(item.id)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        px: { xs: 3, md: 10 },
        py: { xs: 8, md: 12 },
        borderRadius: "20px 20px 0 0",

        background:
          "linear-gradient(180deg, rgba(5, 5, 8, 0.33), rgba(0, 0, 0, 0.35))",
        backdropFilter: "blur(58px)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <Box
        sx={{
          position: "absolute",
          top: -120,
          left: "50%",
          transform: "translateX(-50%)",
          width: 420,
          height: 420,
          background: "transparent",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <Grid
        container
        sx={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "row", justifyContent: "space-between" }}
      >
        {/* Brand */}
        <Grid item xs={12} md={4} sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontFamily: "'Six Caps', sans-serif",
              fontSize: 30,
              letterSpacing: "0.22em",
              mb: 2,
            }}
          >
            BUILDX CUSTOM
          </Typography>

          <Typography
            sx={{
              fontSize: 14.5,
              lineHeight: 1.9,
              opacity: 0.65,
              maxWidth: 380,
            }}
          >
            BuildX CUSTOM is a two-phase innovation experience by BunkMates,
            designed to transform ideas into real-world products through
            design thinking and execution.
          </Typography>
        </Grid>

        {/* Sitemap */}
        <Grid item xs={6} md={4}>
          <Typography
            sx={{
              fontWeight: 600,
              mb: 2.5,
              letterSpacing: "0.04em",
              fontSize: 13,
              opacity: 0.85,
            }}
          >
            NAVIGATION
          </Typography>

          <Stack spacing={1.4}>
{FOOTER_ITEMS.map((item, i) => (
  <Typography
    key={item.id}
    tabIndex={0}
    onClick={() => handleNavClick(item)}

    sx={{
      fontSize: 14,
      fontWeight: 500,
      cursor: "pointer",
      opacity: 0.65,
      outline: "none",
      transition: "opacity 0.2s ease",
      zIndex: 10,
      px: 1.5,

      "&:focus-visible": {
        opacity: 1,
      },
    }}
  >
    {item.label}
  </Typography>
))}
          </Stack>
        </Grid>

        {/* Contact */}
        <Grid item xs={6} md={4}>
          <Typography
            sx={{
              fontWeight: 600,
              mb: 2.5,
              letterSpacing: "0.04em",
              fontSize: 13,
              opacity: 0.85,
            }}
          >
            CONNECT
          </Typography>

          <Stack spacing={1.4}>
            <Typography
              onClick={() => navigate("mailto:team.buildxcustom@bunkmates.xyz")}
              sx={{
                fontSize: 14,
                opacity: 0.65,
                cursor: "pointer",
                transition: "opacity 0.2s ease",
                "&:hover": { opacity: 1 },
              }}
            >
              Mail Us
            </Typography>

      <Box display="flex" gap={1.5}>
        {/* Example social icons */}
        <IconButton onClick={() => navigate("https://www.instagram.com/bunkmates.app/")} sx={{ color: "#fff", opacity: 0.7 }}>
          <Instagram size={18} />
        </IconButton>

        <IconButton sx={{ color: "#fff", opacity: 0.7 }}>
          <FaDiscord size={18} />
        </IconButton>

        <IconButton onClick={() => navigate("https://www.linkedin.com/company/bunkmates/")} sx={{ color: "#fff", opacity: 0.7 }}>
          <Linkedin size={18} />
        </IconButton>
        
        <IconButton onClick={() => navigate("https://www.youtube.com/@Team_BunkMates")} sx={{ color: "#fff", opacity: 0.7 }}>
          <Youtube size={18} />
        </IconButton>
      </Box>
          </Stack>
        </Grid>
      </Grid>

      {/* Divider */}
      <Box
        sx={{
          mt: { xs: 6, md: 8 },
          height: 1,
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent)",
        }}
      />

      {/* Bottom row */}
      <Typography
        textAlign="center"
        sx={{
          mt: 4,
          fontSize: 12,
          opacity: 0.45,
          letterSpacing: "0.08em",
        }}
      >
        © {new Date().getFullYear()} BunkMates · All rights reserved
      </Typography>
    </Box>
  );
}
