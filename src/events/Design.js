import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import { ChevronDown } from "lucide-react";

/* ---------------- COMMON CARD ---------------- */

const GlassCard = ({ children }) => (
  <Box
    sx={{
      p: 3.5,
      height: "100%",
      borderRadius: 2,
      background:
        "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
      border: "1px solid rgba(255,255,255,0.12)",
      backdropFilter: "blur(22px) saturate(130%)",
      transition: "0.3s ease",
      "&:hover": {
        transform: "translateY(-4px)",
      },
    }}
  >
    {children}
  </Box>
);

/* ---------------- PAGE ---------------- */

export default function BuildXDesignEvent() {
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
            BuildX CUSTOM — Design Hackathon
          </Typography>

          <Typography sx={{ opacity: 0.7, maxWidth: 700, mx: "auto" }}>
            A high-impact UI/UX design competition focused on solving real-world
            problems using creativity, user-centric thinking, and innovation.
          </Typography>

          <Button
            sx={{
              mt: 4,
              px: 5,
              py: 1.8,
              borderRadius: 999,
              bgcolor: "#ffffff",
              color: "#000",
              fontWeight: 900,
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                bgcolor: "#000000",
                color:"rgb(255, 255, 255)",
              },
            }}
          >
            Register on Unstop
          </Button>
        </Box>

        {/* ---------------- ABOUT ---------------- */}

        <SectionTitle title="About The Event" />

        <Typography sx={{ opacity: 0.75, maxWidth: 900, mb: 8 }}>
          BuildX CUSTOM Design Hackathon is a design-first competition where
          participants compete individually or in teams to craft impactful UI
          solutions. You’ll receive a real problem statement, ideate solutions,
          design interfaces, and submit your work for evaluation by industry
          experts.
        </Typography>

        {/* ---------------- TIMELINE ---------------- */}

        <SectionTitle title="Event Timeline" />

        <Grid container spacing={3} mb={10}>
          {[
            ["Registration Opens", "Jan 18, 2026 — 10:00 AM IST"],
            ["Registration Closes", "Jan 28, 2026 — 11:59 PM IST"],
            ["Event Starts", "Feb 1, 2026 — 9:30 AM IST"],
            ["Event Ends", "Feb 2, 2026 — 10:00 AM IST"],
          ].map((t, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <GlassCard>
                <Typography fontWeight={800}>{t[0]}</Typography>
                <Typography sx={{ opacity: 0.7, mt: 0.5 }}>{t[1]}</Typography>
              </GlassCard>
            </Grid>
          ))}
        </Grid>

        {/* ---------------- HOW IT WORKS ---------------- */}

        <SectionTitle title="How It Works" />

        <Grid container spacing={3} mb={10}>
          {[
            {
              step: "Register",
              desc: "Register individually or as a team via Unstop. Payment link will be shared after registration.",
            },
            {
              step: "Team Verification",
              desc: "After fee payment, verified teams receive entry passes on email.",
            },
            {
              step: "Event Starts",
              desc: "Official kickoff with rules and briefing.",
            },
            {
              step: "Problem Statement Release",
              desc: "Design challenge is revealed to participants.",
            },
            {
              step: "Design Phase",
              desc: "Create UI/UX solutions and submit designs.",
            },
          ].map((s, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <GlassCard>
                <Typography fontWeight={900} mb={1}>
                  {s.step}
                </Typography>
                <Typography sx={{ opacity: 0.7 }}>
                  {s.desc}
                </Typography>
              </GlassCard>
            </Grid>
          ))}
        </Grid>

        {/* ---------------- WHAT YOU GET ---------------- */}

        <SectionTitle title="What You Get" />

        <Grid container spacing={3} mb={10}>
          {[
            ["₹25K Prize Pool", "Win from a total prize pool of ₹25,000."],
            ["Top 3 Prizes", "Special awards for the top three teams."],
            ["Exclusive Swags", "Official BuildX merchandise and goodies."],
            ["Certificates", "Participation and achievement certificates."],
          ].map((b, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <GlassCard>
                <Typography fontWeight={900}>{b[0]}</Typography>
                <Typography sx={{ opacity: 0.7, mt: 1 }}>{b[1]}</Typography>
              </GlassCard>
            </Grid>
          ))}
        </Grid>

        {/* ---------------- FAQ ---------------- */}

        <SectionTitle title="Frequently Asked Questions" />

        {[
          {
            q: "Can I participate solo?",
            a: "Yes, you can register individually or as part of a team.",
          },
          {
            q: "What tools are allowed?",
            a: "Figma, Adobe XD, Sketch and any UI design tools are allowed.",
          },
          {
            q: "Is this an online event?",
            a: "The design phase is conducted online.",
          },
          {
            q: "Will certificates be provided?",
            a: "Yes, all participants will receive certificates.",
          },
        ].map((f, i) => (
          <Accordion
            key={i}
            disableGutters
            sx={{
              bgcolor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              mb: 1,
            }}
          >
            <AccordionSummary
              expandIcon={<ChevronDown color="#fff" size={18} />}
            >
              <Typography fontWeight={700}>{f.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ opacity: 0.7 }}>{f.a}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}

      </Container>
    </Box>
  );
}

/* ---------------- SECTION TITLE ---------------- */

function SectionTitle({ title }) {
  return (
    <>
      <Typography
        sx={{
          fontWeight: 900,
          fontSize: "1.8rem",
          mb: 2,
        }}
      >
        {title}
      </Typography>
      <Divider
        sx={{
          mb: 5,
          width: 80,
          borderColor: "#ffffffa0",
          borderWidth: 2,
        }}
      />
    </>
  );
}
