import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Grid,
} from "@mui/material";

/* ───────── CONFETTI ENGINE ───────── */
function ConfettiBurst({ run }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!run) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#6CFF8E", "#ffffff", "#9AFFC3"];
    const particles = Array.from({ length: 140 }).map(() => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      r: Math.random() * 6 + 2,
      c: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -14 - 4,
      g: 0.35,
      life: 100,
    }));

    let frame;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.g;
        p.life--;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.fill();
      });

      if (particles.some((p) => p.life > 0)) {
        frame = requestAnimationFrame(draw);
      }
    };

    draw();
    return () => cancelAnimationFrame(frame);
  }, [run]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 3000,
      }}
    />
  );
}

/* ───────── CONTACT PAGE ───────── */
export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: connect backend / email service
    console.log(form);

    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });

    setTimeout(() => setSubmitted(false), 4500);
  };

  return (
    <Box sx={{ bgcolor: "#00000000", color: "#fff", py: 14 }}>
      {submitted && <ConfettiBurst run={submitted} />}

      {/* SUCCESS OVERLAY */}
      {submitted && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 2500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(20px)",
          }}
        >
          <Box
            sx={{
              p: 6,
              borderRadius: 3,
              textAlign: "center",
              bgcolor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              animation: "pop 0.4s cubic-bezier(.16,1,.3,1)",
              "@keyframes pop": {
                from: { transform: "scale(0.85)", opacity: 0 },
                to: { transform: "scale(1)", opacity: 1 },
              },
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                mx: "auto",
                mb: 3,
                borderRadius: "50%",
                bgcolor: "rgba(108,255,142,0.18)",
                color: "#6CFF8E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                fontWeight: 900,
                boxShadow: "0 0 40px rgba(108,255,142,0.6)",
              }}
            >
              ✓
            </Box>

            <Typography sx={{ fontWeight: 900, fontSize: 22 }}>
              Message Sent!
            </Typography>
            <Typography sx={{ opacity: 0.7, mt: 1 }}>
              We’ll get back to you shortly 🚀
            </Typography>
          </Box>
        </Box>
      )}

      <Container maxWidth="md">
        {/* HEADER */}
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: "3.2rem",
            mb: 2,
            textAlign: "center",
          }}
        >
          Contact Us
        </Typography>

        <Typography
          sx={{
            textAlign: "center",
            opacity: 0.65,
            mb: 8,
            maxWidth: 600,
            mx: "auto",
          }}
        >
          Questions about BuildX, collaborations, or partnerships?  
          Drop us a message — we’d love to talk.
        </Typography>

        {/* FORM */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 5,
            borderRadius: 3,
            bgcolor: "rgba(255,255,255,0.035)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(30px)",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Message"
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                sx={{
                  py: 2,
                  borderRadius: 2,
                  bgcolor: "#fff",
                  color: "#000",
                  fontWeight: 900,
                  fontSize: 16,
                  "&:hover": {
                    bgcolor: "#f0f0f0",
                    transform: "scale(1.02)",
                  },
                }}
              >
                Send Message
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* TEAM */}
        <Box sx={{ mt: 12 }}>
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: "2rem",
              mb: 5,
              textAlign: "center",
            }}
          >
            Talk to the Team
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {[
              {
                name: "Jayendra Choudhary",
                role: "Founder / Product",
                email: "jayendra@bunkmates.in",
              },
              {
                name: "BuildX Support",
                role: "Community & Events",
                email: "support@bunkmates.in",
              },
            ].map((m, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Box
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    bgcolor: "rgba(255,255,255,0.035)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    textAlign: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      mx: "auto",
                      mb: 2,
                      borderRadius: "50%",
                      bgcolor: "rgba(108,255,142,0.15)",
                      color: "#6CFF8E",
                      fontWeight: 900,
                      fontSize: 22,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {m.name[0]}
                  </Box>

                  <Typography sx={{ fontWeight: 800 }}>
                    {m.name}
                  </Typography>
                  <Typography sx={{ opacity: 0.6, mb: 1 }}>
                    {m.role}
                  </Typography>
                  <Typography sx={{ color: "#6CFF8E", fontSize: 14 }}>
                    {m.email}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA */}
        <Box sx={{ mt: 14, textAlign: "center" }}>
          <Typography sx={{ fontWeight: 900, fontSize: "2rem", mb: 2 }}>
            Prefer Instant Chat?
          </Typography>

          <Typography sx={{ opacity: 0.65, mb: 5 }}>
            Reach us directly on WhatsApp or Telegram
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
            <Button
              href="https://wa.me/91XXXXXXXXXX"
              target="_blank"
              sx={{
                px: 5,
                py: 2,
                borderRadius: 999,
                bgcolor: "#25D366",
                color: "#000",
                fontWeight: 900,
              }}
            >
              WhatsApp
            </Button>

            <Button
              href="https://t.me/yourtelegram"
              target="_blank"
              sx={{
                px: 5,
                py: 2,
                borderRadius: 999,
                bgcolor: "#229ED9",
                color: "#fff",
                fontWeight: 900,
              }}
            >
              Telegram
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
