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
import { useNavigate } from "react-router-dom";
import { Trophy, Award, Gift, Star, HelpCircle } from "lucide-react"; 

import { styled } from "@mui/material";
import { motion } from "framer-motion";
/* ---------------- COMMON CARD ---------------- */

const GlassCard = ({ children }) => (
  <Box
    sx={{
      // Responsive Padding: 2 (16px) on mobile, 3.5 (28px) on large screens
      p: { xs: 2, md: 3.5 },
      height: "100%",
      width: { xs: 290, lg: 210 },
      
      // Responsive Border Radius
      borderRadius: 1.5,
      
      // Visual Style
      background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
      border: "1px solid rgba(255,255,255,0.12)",
      backdropFilter: "blur(22px) saturate(130%)",
      transition: "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      
      // Layout logic
      display: "flex",
      flexDirection: "column",

      "&:hover": {
        // Only lift on devices that support hover (prevents sticky hover on mobile)
        "@media (hover: hover)": {
          transform: "translateY(-6px)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
          borderColor: "rgba(255,255,255,0.25)",
        },
      },
    }}
  >
    {children}
  </Box>
);


const GlassCard1 = styled(motion.div)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  borderRadius: "20px",
  width: "100%", // Default to full width of container
  [theme.breakpoints.up('xs')]: {
    maxWidth: "100%", // Large on mobile/small screens
    margin: "0 auto",   // Center it if it's smaller than the screen
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: "210px", // Smaller/Compact on large screens
  },
  border: "1px solid rgba(255, 255, 255, 0.1)",
  padding: theme.spacing(4),
  height: "100%",
  position: "relative",
  overflow: "hidden",
  transition: "all 0.1s ease-in-out",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.08)",
    borderColor: "rgba(255, 255, 255, 0.3)",
    boxShadow: "0 20px 40px rgba(255, 255, 255, 0.13)",
  },
}));


const PrizeCard = styled(motion.div)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.03)",
  backdropFilter: "blur(10px)",
  
  width: "100%", // Default to full width of container
  [theme.breakpoints.up('xs')]: {
    maxWidth: "100%", // Large on mobile/small screens
    margin: "0 auto",   // Center it if it's smaller than the screen
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: "260px", // Smaller/Compact on large screens
  },
  borderRadius: "24px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  height: "100%",
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.07)",
  }
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: "50px",
  height: "50px",
  borderRadius: "12px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  background: "linear-gradient(135deg, #ffd9004d 0%, #ffa2003e 100%)", // Gold gradient
  color: "#000",
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.03)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px !important", // Force rounded corners
  border: "1px solid rgba(255, 255, 255, 0.08)",
  marginBottom: theme.spacing(1.5),
  boxShadow: "none",
  transition: "all 0.3s ease-in-out",
  "&:before": {
    display: "none", // Removes default MUI line
  },
  "&:hover": {
    background: "rgba(255, 255, 255, 0.06)",
  },
  "&.Mui-expanded": {
    background: "rgba(255, 255, 255, 0.05)",
  },
}));

const StyledSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: theme.spacing(1, 3),
  "& .MuiAccordionSummary-content": {
    alignItems: "center",
    gap: theme.spacing(2),
  },
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(180deg)",
    color: "#2979FF", // Changes icon color when open
  },
}));

/* ---------------- PAGE ---------------- */

export default function BuildXDesignEvent() {
  const navigate = useNavigate();
  return (
    <Box sx={{ bgcolor: "#00000000", color: "#fff", minHeight: "100vh", py: 10, mt: 12 }}>
      <Container maxWidth="lg">

        {/* ---------------- HERO ---------------- */}

        <Box sx={{ textAlign: "center", mb: 10, py: 28, }}>
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
          onClick={() => navigate("/design-event/register")}
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
            Register Now
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
            ["Registration Closes", "Jan 30, 2026 — 11:59 PM IST"],
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
      desc: "Register individually or as a team. And pay their respective entry fees.",
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
      <GlassCard1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.1 }}
        whileHover={{ y: -10 }} // Lifts up on hover
      >
        {/* Step Numbering Decoration */}
        <Typography
          sx={{
            position: "absolute",
            top: 10,
            right: 20,
            fontSize: "3rem",
            fontWeight: 900,
            opacity: 0.05, // Subtle background number
            color: "#fff",
            userSelect: "none"
          }}
        >
          {String(i + 1).padStart(2, '0')}
        </Typography>

        <Box sx={{ position: "relative", zIndex: 1 }}>
          {/* <Typography 
            variant="overline" 
            sx={{ color: "primary.main", fontWeight: 'bold', letterSpacing: 2 }}
          >
            Step {i + 1}
          </Typography>
           */}
          <Typography 
            variant="h6" 
            fontWeight={900} 
            mb={1.5} 
            sx={{ color: "#fff", letterSpacing: -0.5 }}
          >
            {s.step}
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: "rgba(255,255,255,0.7)", 
              lineHeight: 1.7,
              fontSize: "0.95rem" 
            }}
          >
            {s.desc}
          </Typography>
        </Box>
      </GlassCard1>
    </Grid>
  ))}
</Grid>

        {/* ---------------- WHAT YOU GET ---------------- */}

        <SectionTitle title="What You Get" />

<Grid container spacing={4} mb={10}>
  {[
    {
      title: "₹25K Prize Pool",
      desc: "Win from a total prize pool of ₹25,000.",
      icon: <Trophy size={28} />,
      color: "linear-gradient(135deg, #ffd90032 0%, #ffa20030 100%)" // Gold
    },
    {
      title: "Top 3 Prizes",
      desc: "Special awards for the top three teams.",
      icon: <Award size={28} />,
      color: "linear-gradient(135deg, #C0C0C030 0%, #90909030 100%)" // Silver
    },
    {
      title: "Exclusive Swags",
      desc: "Official BuildX merchandise and goodies.",
      icon: <Gift size={28} />,
      color: "linear-gradient(135deg, #2978ff28 0%, #00B0FF30 100%)" // Blue
    },
    {
      title: "Certificates",
      desc: "Participation and achievement certificates.",
      icon: <Star size={28} sx={{ color: "#fff" }} />,
      color: "linear-gradient(135deg, #00C85330 0%, #B2FF5930 100%)" // Green
    },
  ].map((b, i) => (
    <Grid item xs={12} sm={6} key={i}>
      <PrizeCard
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.1, duration: 0.5 }}
      >
        <IconWrapper sx={{ background: b.color, color: "#fff" }}>
          {b.icon}
        </IconWrapper>

        <Typography 
          variant="h6" 
          fontWeight={900} 
          sx={{ color: "#fff", letterSpacing: -0.5 }}
        >
          {b.title}
        </Typography>

        <Typography 
          variant="body2" 
          sx={{ 
            opacity: 0.6, 
            mt: 1, 
            lineHeight: 1.6,
            fontSize: "1rem" 
          }}
        >
          {b.desc}
        </Typography>
      </PrizeCard>
    </Grid>
  ))}
</Grid>

        {/* ---------------- FAQ ---------------- */}

        <SectionTitle title="Frequently Asked Questions" />

<Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
  {[
    {
      q: "Can I participate solo?",
      a: "Yes, you can register individually or as part of a team of up to 3 members.",
    },
    {
      q: "What tools are allowed?",
      a: "Participants are free to use Figma, Adobe XD, Sketch, or any other UI/UX design tools of their choice.",
    },
    {
      q: "Is this an online event?",
      a: "The entire design phase and initial submissions are conducted online. Finale details will be shared via email.",
    },
    {
      q: "Will certificates be provided?",
      a: "Absolutely! All registered participants who submit a valid entry will receive an e-certificate of participation.",
    },
  ].map((f, i) => (
    <StyledAccordion key={i} disableGutters>
      <StyledSummary
        expandIcon={<ChevronDown size={20} color="rgba(255,255,255,0.7)" />}
      >
        {/* Added a subtle help icon for visual balance */}
        <HelpCircle size={18} color="#2979FF" style={{ opacity: 0.8 }} />
        
        <Typography 
          fontWeight={600} 
          sx={{ 
            fontSize: "1.05rem", 
            letterSpacing: "-0.01em",
            color: "rgba(255,255,255,0.95)" 
          }}
        >
          {f.q}
        </Typography>
      </StyledSummary>
      
      <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
        <Typography 
          sx={{ 
            opacity: 0.7, 
            lineHeight: 1.6, 
            fontSize: "0.95rem",
            borderLeft: "2px solid rgba(41, 121, 255, 0.3)",
            pl: 2,
            ml: 1
          }}
        >
          {f.a}
        </Typography>
      </AccordionDetails>
    </StyledAccordion>
  ))}
</Box>

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
