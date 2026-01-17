import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Grid,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { Mail, Phone, MessageCircle } from "lucide-react";

import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/* ================= CONFIG ================= */

// Ensure this URL is from your LATEST "New Deployment" in Apps Script
const APPSCRIPT_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwdmbZTBsopysMrsOhlZmFadfalpXL8ePY5cbK8loCvvrZ9yP1fc2r47iaVdLFtEVCYXA/exec";

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

const CommonGridCard = ({ children }) => {
  return (
    <Box
      sx={{
        position: "relative",
        p: 4,
        height: "100%",
        borderRadius: 2,
        width: { xs: "90vw", md: 250 },

        background:
          "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",

        border: "1px solid rgba(255,255,255,0.12)",

        backdropFilter: "blur(22px) saturate(130%)",

        boxShadow: "none",

        textAlign: "center",

        transition: "all 0.35s cubic-bezier(.16,1,.3,1)",

        "&:hover": {
          transform: "translateY(-1px) scale(1.02)",
          boxShadow: "none",
        },
      }}
    >
      {children}
    </Box>
  );
};


/* ================= CONTACT PAGE ================= */

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ---------- SUBMIT HANDLER ---------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        name: form.name,
        email: form.email,
        message: form.message,
        createdAt: new Date().toISOString(),
      };

      /* 1️⃣ SAVE TO FIRESTORE */
      await addDoc(collection(db, "contactSubmissions"), {
        ...payload,
        createdAt: serverTimestamp(),
      });

      /* 2️⃣ SEND TO GOOGLE SHEETS + EMAIL (APPS SCRIPT) */
      // Using mode: 'no-cors' and text/plain to bypass CORS browser restrictions
      await fetch(APPSCRIPT_ENDPOINT, {
        method: "POST",
        mode: "no-cors", 
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(payload),
      });

      /* SUCCESS HANDLING */
      // In 'no-cors' mode, we won't get a readable JSON response, 
      // so we assume success if the fetch doesn't throw an error.
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });

      setTimeout(() => setSubmitted(false), 4500);
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Submission failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- TEAM DATA ---------- */

  const team = [
    {
      name: "Jayendra Choudhary",
      role: "Founder / Organizer",
      email: "jayendrachoudhary911@gmail.com",
      phone: "+91 7689919139",
      whatsapp: "7689919139",
    },
    {
      name: "Mohit Sharma",
      role: "Founder / Organizer",
      email: "mohitsharmahack810@gmail.com",
      phone: "+91 8109618103",
      whatsapp: "8109618103",
    },
    {
      name: "Raunak Bansal",
      role: "Lead Organizer",
      email: "raunakbansal000@gmail.com",
      phone: "+91 8239577135",
      whatsapp: "8239577135",
    },
    {
      name: "Naman Soni",
      role: "Lead Organizer",
      email: "soninamanp@gmail.com",
      phone: "+91 9664464843",
      whatsapp: "9664464843",
    },
  ];

  return (
    <Box sx={{ bgcolor: "transparent", color: "#fff", py: 14 }}>
      {submitted && <ConfettiBurst run={submitted} />}

      <Container maxWidth="lg">
        {/* HEADER */}
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: { xs: "2.6rem", md: "3.4rem" },
            mb: 2,
            textAlign: "center",
          }}
        >
          Contact BuildX
        </Typography>

        <Typography
          sx={{
            textAlign: "center",
            opacity: 0.65,
            mb: 8,
            maxWidth: 620,
            mx: "auto",
          }}
        >
          Messages submitted here are securely stored and forwarded to our
          support team. You will also receive a confirmation email.
        </Typography>

        {/* FORM */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: { xs: 3.5, md: 5 },
            borderRadius: 2,
            bgcolor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(28px)",
            boxShadow: "none",
            width: { xs: "90vw", md: "50vw" },
            mx: "auto"
          }}
        >
          <Grid container spacing={3}>
            <Box
              sx={{ 
                display: "flex",
                width: "100vw",
                gap: 2
              }}
            >
              <TextField
                fullWidth
                label="Your Name"
                variant="outlined"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
                InputLabelProps={{ style: { color: "#fff" } }}
                sx={{ "& .MuiOutlinedInput-root": { color: "#fff", "& fieldset": { borderColor: "rgba(255,255,255,0.2)" } } }}
              />

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
                InputLabelProps={{ style: { color: "#fff" } }}
                sx={{ "& .MuiOutlinedInput-root": { color: "#fff", "& fieldset": { borderColor: "rgba(255,255,255,0.2)" } } }}
              />
            </Box>

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
                InputLabelProps={{ style: { color: "#fff" } }}
                sx={{ "& .MuiOutlinedInput-root": { color: "#fff", "& fieldset": { borderColor: "rgba(255,255,255,0.2)" } } }}
              />
              
              <Button
                type="submit"
                fullWidth
                disabled={loading}
                sx={{
                  py: 2.1,
                  borderRadius: 2,
                  bgcolor: "#ffffff",
                  color: "#000000",
                  fontWeight: 900,
                  fontSize: 16,
                  "&:hover": {
                    bgcolor: "#000000", 
                    color: "#ffffff",
                    transform: "scale(1.03)",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "rgba(255, 255, 255, 0.3)",
                  }
                }}
              >
                {loading ? (
                  <CircularProgress size={22} sx={{ color: "#000" }} />
                ) : (
                  "Send Message"
                )}
              </Button>
            </Grid>
        </Box>  

        {/* TEAM CONTACT CARDS */}
<Box sx={{ mt: 14 }}>

  {/* SECTION HEADER */}
  <Typography
    sx={{
      fontWeight: 900,
      fontSize: { xs: "1.8rem", md: "2.2rem" },
      mb: 7,
      textAlign: "center",
      letterSpacing: "-0.02em",
      background:
        "linear-gradient(90deg, #ffffff, #d8d8d8)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
  >
    Talk to the BuildX Team
  </Typography>

  <Grid container spacing={2} justifyContent="center">
    {team.map((m, i) => (
<Grid item xs={12} sm={6} md={4} key={i}>
  <CommonGridCard>

    {/* AVATAR */}
    <Box
      sx={{
        width: 72,
        height: 72,
        mx: "auto",
        mb: 2,
        borderRadius: "50%",
        bgcolor: "rgba(108,255,142,0.18)",
        color: "#6CFF8E",
        fontWeight: 900,
        fontSize: 26,
        display: { xs: "none", md: "flex" },
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {m.name[0]}
    </Box>

    {/* NAME */}
    <Typography fontWeight={800}>
      {m.name}
    </Typography>

    {/* ROLE */}
    <Typography sx={{ opacity: 0.6, mb: 2 }}>
      {m.role}
    </Typography>

    {/* ACTION BUTTONS */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Tooltip title="Email">
        <IconButton href={`mailto:${m.email}`} sx={{ color: "#fff" }}>
          <Mail size={18} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Call">
        <IconButton href={`tel:${m.phone}`} sx={{ color: "#fff" }}>
          <Phone size={18} />
        </IconButton>
      </Tooltip>

      <Tooltip title="WhatsApp">
        <IconButton
          href={`https://wa.me/${m.whatsapp}?text=Hi%20BuildX%20CUSTOM%20Team%20%F0%9F%91%8B%0AI%E2%80%99m%20reaching%20out%20regarding%20BuildX%20CUSTOM%20events%20and%20participation.%0ACould%20you%20please%20guide%20me%20further%3F%0AThanks%21`}
          target="_blank"
          sx={{ color: "#fff" }}
        >
          <MessageCircle size={18} />
        </IconButton>
      </Tooltip>
    </Box>

  </CommonGridCard>
</Grid>

    ))}
  </Grid>
</Box>

      </Container>
    </Box>
  );
}