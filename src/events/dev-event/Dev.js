import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  SwipeableDrawer,
  TextField,
  Divider,
} from "@mui/material";
import { Lock } from "lucide-react";

/* ================= CONFIG ================= */

const EVENT_RELEASE_DATE = new Date("2026-02-05T10:00:00+05:30");

/* ================= GLASS CARD ================= */

const GlassCard = ({ children }) => (
  <Box
    sx={{
      p: 3.5,
      borderRadius: 2,
      background:
        "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(22px)",
      transition: "0.3s ease",
      "&:hover": {
        transform: "translateY(-4px)",
      },
    }}
  >
    {children}
  </Box>
);

/* ================= MAIN PAGE ================= */

export default function BuildXDevEvent() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());

  /* ---------------- COUNTDOWN TIMER ---------------- */

  function getTimeRemaining() {
    const diff = EVENT_RELEASE_DATE - new Date();

    return {
      days: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
      hours: Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
      minutes: Math.max(0, Math.floor((diff / (1000 * 60)) % 60)),
      seconds: Math.max(0, Math.floor((diff / 1000) % 60)),
      expired: diff <= 0,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ bgcolor: "#00000000", color: "#fff", minHeight: "100vh", py: 10, mt: 12 }}>
      <Container maxWidth="lg">

        {/* ---------------- HERO ---------------- */}

        <Box sx={{ textAlign: "center", mb: 10 }}>
          <Typography
            sx={{
              fontSize: { xs: "2.4rem", md: "3.6rem" },
              fontWeight: 900,
              letterSpacing: "-0.03em",
              mb: 2,
            }}
          >
            BuildX CUSTOM — Dev Hackathon
          </Typography>

          <Typography sx={{ opacity: 0.7, maxWidth: 700, mx: "auto" }}>
            A real-world development challenge where teams build scalable
            products using modern tech stacks and production-level constraints.
          </Typography>

          {/* COUNTDOWN */}

          {!timeLeft.expired && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 3,
                mt: 5,
                flexWrap: "wrap",
              }}
            >
              <CountdownBox label="Days" value={timeLeft.days} />
              <CountdownBox label="Hours" value={timeLeft.hours} />
              <CountdownBox label="Minutes" value={timeLeft.minutes} />
              <CountdownBox label="Seconds" value={timeLeft.seconds} />
            </Box>
          )}

          {/* REGISTER BUTTON */}

          <Button
            disabled
            sx={{
              mt: 5,
              px: 5,
              py: 1.8,
              borderRadius: 999,
              bgcolor: "rgba(255,255,255,0.15)",
              color: "#fff",
              fontWeight: 900,
              cursor: "not-allowed",
            }}
          >
            Registration Opens Soon
          </Button>
        </Box>

        {/* ---------------- BLUR LOCK OVERLAY ---------------- */}

        <Box sx={{ position: "relative" }}>

          <Box
            sx={{
              filter: "blur(6px)",
              pointerEvents: "none",
            }}
          >
            <Grid container spacing={3}>
              {["Problem Statements", "Tech Stack Rules", "Judging Criteria"].map(
                (item, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <GlassCard>
                      <Typography fontWeight={800}>{item}</Typography>
                      <Typography sx={{ opacity: 0.7, mt: 1 }}>
                        Will be revealed once the event launches.
                      </Typography>
                    </GlassCard>
                  </Grid>
                )
              )}
            </Grid>
          </Box>

          {/* LOCK OVERLAY */}

          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
              background: "rgba(255, 255, 255, 0.09)",
              borderRadius: 2,
            }}
          >
            <Lock size={48} />
            <Typography
              sx={{
                fontWeight: 900,
                mt: 2,
                fontSize: "1.2rem",
              }}
            >
              Releasing Soon
            </Typography>

            <Typography sx={{ opacity: 0.7, mt: 1 }}>
              Dev Hackathon details unlock on launch day
            </Typography>
          </Box>

        </Box>

      </Container>

      {/* ---------------- REGISTRATION DRAWER ---------------- */}

      <SwipeableDrawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
        PaperProps={{
          sx: {
            height: "75vh",
            borderRadius: "20px 20px 0 0",
            bgcolor: "#0c0c0c",
            backdropFilter: "blur(30px)",
          },
        }}
      >
        <Box sx={{ p: 4 }}>

          <Typography fontWeight={900} fontSize={22} mb={1}>
            Dev Hackathon Registration
          </Typography>

          <Typography sx={{ opacity: 0.6, mb: 4 }}>
            Pre-register now to receive early access notification
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <TextField
            fullWidth
            label="Team Leader Name"
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Email Address"
            sx={{ mb: 3 }}
          />

          <Button
            fullWidth
            sx={{
              py: 2,
              bgcolor: "#6CFF8E",
              color: "#000",
              fontWeight: 900,
              borderRadius: 2,
            }}
          >
            Join Waitlist
          </Button>

        </Box>
      </SwipeableDrawer>

    </Box>
  );
}

/* ================= COUNTDOWN UI ================= */

function CountdownBox({ label, value }) {
  return (
    <Box
      sx={{
        minWidth: 80,
        p: 2,
        borderRadius: 1.4,
        bgcolor: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        textAlign: "center",
      }}
    >
      <Typography fontWeight={900} fontSize={22}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: 12, opacity: 0.7 }}>
        {label}
      </Typography>
    </Box>
  );
}
