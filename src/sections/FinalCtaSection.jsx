// src/sections/FinalCTASection.jsx
import { Box, Typography, Button } from "@mui/material";

export default function FinalCTASection() {
  return (
    <Box
      sx={{
        position: "relative",
        py: { xs: 10, md: 14 },
        px: 2,
        textAlign: "center",
        overflow: "hidden",

        background:
          "transparent",
      }}
    >

      {/* CTA Card */}
      <Box
        sx={{
          position: "relative",
          maxWidth: 720,
          mx: "auto",

          backdropFilter: "blur(18px)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: 2,

          px: { xs: 3, md: 6 },
          py: { xs: 5, md: 6 },

          boxShadow:
            "none",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: 18, md: 22 },
            fontWeight: 600,
            letterSpacing: "-0.01em",
            mb: 2,
          }}
        >
          Ready to design with purpose and build with precision?
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: 14.5, md: 15 },
            opacity: 0.7,
            lineHeight: 1.7,
            mb: 4,
          }}
        >
          Join BuildX CUSTOM and experience how real products are imagined,
          designed, and built.
        </Typography>

        <Button
          variant="contained"
          size="large"
          sx={{
            px: 4,
            py: 1.4,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",

            background:
              "linear-gradient(135deg, #ffffff21, #e5e7eb)",
            color: "#000",

            borderRadius: 99,
            boxShadow:
              "0",

            transition: "all 0.25s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow:
                "0 18px 40px rgba(255,255,255,0.45)",
              background:
                "linear-gradient(135deg, #e5e7eb, #ffffff21)",
            },
          }}
        >
          REGISTER NOW
        </Button>
      </Box>
    </Box>
  );
}
