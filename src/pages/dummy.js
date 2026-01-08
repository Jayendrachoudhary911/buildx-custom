// src/pages/Home.jsx
import {
   Box,
   Typography, 
   Grid, 
   Paper, 
   Button, 
   Toolbar, 
   IconButton, 
   AppBar, 
   Slide,
   Accordion,
   AccordionSummary,
   AccordionDetails,
} from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimatedDigit from "../components/AnimatedDigit";
import BuildXLogoAnimated from "../components/BuildXLogo";
import { X } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { useEffect, useState, forwardRef } from "react";
import Dialog from "@mui/material/Dialog";
import HowItWorksTimeline from "../sections/HowItWorksTimeline";

const Transition = forwardRef(function Transition(props, ref) {
  return (
    <Slide 
        direction="up" 
        ref={ref} 
        timeout={{ enter: 500, exit: 380 }} 
        easing={{ 
            enter: "cubic-bezier(0.16, 1, 0.3, 1)", 
            exit: "cubic-bezier(0.7, 0, 0.84, 0)", 
        }} 
        {...props} 
    />
  );
});

const TARGET_DATE = new Date("2026-01-17T10:00:00+05:30");

function useCountdown(target) {
  const [diff, setDiff] = useState(target - new Date());

  useEffect(() => {
    const t = setInterval(() => {
      setDiff(target - new Date());
    }, 1000);
    return () => clearInterval(t);
  }, [target]);

  if (diff <= 0) return { live: true };

  return {
    live: false,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function useEventCountdown(target) {
  const [diff, setDiff] = useState(target - new Date());

  useEffect(() => {
    const t = setInterval(() => {
      setDiff(target - new Date());
    }, 1000);
    return () => clearInterval(t);
  }, [target]);

  if (diff <= 0) return { ended: true };

  return {
    ended: false,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function EventCard({ event, onViewMore }) {
  const countdown = useEventCountdown(event.startDate);
  const registrationsOpen = new Date() < event.registrationClosesAt;

  return (
<Box
  sx={{
    position: "relative",
    height: { xs: 450, md: 580 },
    width: { xs: 360, lg: 440 },
    borderRadius: 2,
    overflow: "hidden",
    cursor: "pointer",

    backgroundImage: `url(${event.image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",

    transition:
      "transform 0.45s cubic-bezier(.2,.8,.2,1), box-shadow 0.45s ease",

    "&:hover": {
      transform: "translateY(-10px) scale(1.01)",
      boxShadow:
        "0 28px 70px rgba(0,0,0,0.65), inset 0 0 0 1px rgba(255,255,255,0.06)",
    },

    "&:hover .blurLayer": {
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
    },

    "&:hover .content": {
      transform: "translateY(-56px)",
    },

    "&:hover .title": {
      transform: "translateY(-8px)",
      opacity: 1,
    },

    "&:hover .meta": {
      transform: "translateY(-4px)",
      opacity: 0.95,
    },

    "&:hover .description": {
      transform: "translateY(-2px)",
      opacity: 0.95,
    },

    "&:hover .viewMore": {
      opacity: 1,
      transform: "translateY(0)",
    },
  }}
>
  {/* ───────── PROGRESSIVE BLUR ───────── */}
  <Box
    className="blurLayer"
    sx={{
      position: "absolute",
      inset: 0,
      zIndex: 1,

      backdropFilter: "blur(0px)",
      WebkitBackdropFilter: "blur(0px)",

    //   maskImage:
    //     "linear-gradient(to bottom, transparent 0%, transparent 0%, transparent 0%, transparent 0%, black 100%)",
    //   WebkitMaskImage:
    //     "linear-gradient(to bottom, transparent 0%, transparent 0%, transparent 0%, transparent 0%, black 100%)",

      transition: "backdrop-filter 0.45s ease",
      pointerEvents: "none",
    }}
  />

  {/* ───────── CONTENT ───────── */}
  <Box
    className="content"
    sx={{
      position: "absolute",
      bottom: -60,
      zIndex: 2,
      p: 3.2,
      color: "#fff",
      width: "100%",

      transform: "translateY(0)",
      transition: "transform 0.45s cubic-bezier(.2,.8,.2,1)",
    }}
  >
    {/* TITLE */}
    <Typography
      className="title"
      fontSize={32}
      fontWeight={600}
      letterSpacing="-0.01em"
      mb={0.6}
      sx={{
        opacity: 0,
        transform: "translateY(11px)",
        transition: "all 0.35s ease 180ms",
      }}
    >
      {event.title}
    </Typography>

    {/* COUNTDOWN */}
    {!countdown.ended && (
      <Typography
        className="meta"
        fontSize={13}
        mb={0.6}
        sx={{
          opacity: 0.8,
          fontVariantNumeric: "tabular-nums",
          transform: "translateY(0)",
          transition: "all 0.35s ease 40ms",
        }}
      >
        {countdown.days}d {countdown.hours}h {countdown.minutes}m{" "}
        {countdown.seconds}s
      </Typography>
    )}

    {/* STATUS */}
    <Typography
      className="meta"
      fontSize={11}
      fontWeight={700}
      mb={1}
      sx={{
        color: registrationsOpen ? "#6CFF8E" : "#FF7A7A",
        letterSpacing: "0.12em",
        opacity: 0.85,
        transform: "translateY(0)",
        transition: "all 0.35s ease 80ms",
      }}
    >
      {registrationsOpen ? "REGISTRATIONS OPEN" : "REGISTRATIONS CLOSED"}
    </Typography>

    {/* DESCRIPTION */}
    <Typography
      className="description"
      fontSize={14}
      sx={{
        opacity: 0.85,
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",

        transform: "translateY(0)",
        transition: "all 0.35s ease 120ms",
      }}
    >
      {event.short}
    </Typography>

    {/* ───────── VIEW MORE CTA ───────── */}
    <Box
      className="viewMore"
      sx={{
        mt: 3,
        display: "flex",
        justifyContent: "center",
        gap: 2,

        opacity: 0,
        transform: "translateY(1px)",
        transition: "all 0.35s ease 180ms",
      }}
    >
      <Button
        fullWidth
        onClick={(e) => {
          e.stopPropagation();
          onViewMore(event);
        }}
        sx={{
          px: 4.5,
          py: 1.3,
          borderRadius: 999,
          fontWeight: 600,
          textTransform: "none",

          color: "#fff",
          background: "rgba(255, 255, 255, 0)",
          border: "1.5px solid rgba(255,255,255,0.3)",
          backdropFilter: "blur(14px)",

          boxShadow: "none",
          transition: "all 0.25s ease",

          "&:hover": {
            background: "#fff",
            color: "#000",
            transform: "scale(1.05)",
          },
        }}
      >
        View More
      </Button>

      <Button
        fullWidth
        onClick={(e) => {
          e.stopPropagation();
          onViewMore(event);
        }}
        sx={{
          px: 4.5,
          py: 1.3,
          borderRadius: 999,
          fontWeight: 600,
          textTransform: "none",

          color: "#000000ff",
          background: "rgba(255, 255, 255, 1)",
          backdropFilter: "blur(14px)",

          boxShadow: "none",
          transition: "all 0.25s ease",

          "&:hover": {
            background: "#000000ff",
            color: "#ffffffff",
            transform: "scale(1.05)",
          },
        }}
      >
        Register
      </Button>
    </Box>
  </Box>
</Box>
  );
}


function EventDetailsDialog({ open, event, onClose }) {
  const cta = event ? getCTAState(event) : null;

const countdown = useEventCountdown(
    event?.startDate ?? new Date(0) // safe fallback
  );
  const registrationsOpen =
    event && new Date() < event.registrationClosesAt;

  // ✅ Early return AFTER hooks
  if (!event) return null;

  return (
<Dialog
  fullScreen
  open={open}
  onClose={onClose}
  TransitionComponent={Transition}
  sx={{
    /* Backdrop (behind dialog) */
    "& .MuiBackdrop-root": {
      backgroundColor: "rgba(255, 255, 255, 0.04)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
    },

    /* Dialog root */
    "& .MuiDialog-paper": {
      backgroundColor: "rgba(255, 255, 255, 0.04)",
      backdropFilter: "blur(22px) saturate(1.2)",
      WebkitBackdropFilter: "blur(22px) saturate(1.2)",

      backgroundImage:
        "radial-gradient(1200px 600px at 50% -20%, rgba(255,255,255,0.06), transparent 60%)",

      boxShadow:
        "0 40px 120px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.06)",

      borderRadius: 0,
    },
  }}
>


<Box
  sx={{
    color: "#fff",
    backdropFilter: "blur(20px)",
    backgroundColor: "rgba(0, 0, 0, 0.02)",

    animation: open
      ? "contentEnter 0.55s cubic-bezier(.2,.8,.2,1) both"
      : "none",

    "@keyframes contentEnter": {
      from: {
        opacity: 0,
        transform: "translateY(18px)",
      },
      to: {
        opacity: 1,
        transform: "translateY(0)",
      },
    },
  }}
>


      {/* TOP BAR */}
      <IconButton
        onClick={onClose}
        sx={{ position: "fixed", top: 20, right: 20, zIndex: 10 }}
      >
        <X color="#fff" />
      </IconButton>

      {/* CONTENT */}
      <Box>

<Box
  sx={{
    height: { xs: 220, md: 380 },
    backgroundImage: `url(${event.image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    border: "2px solid rgba(255, 255, 255, 0.13)",
    mt: { xs: 8, md: 10 },
    mb: { xs: 3, md: 10 },
    mx: { xs: 2, md: 10 },
    borderRadius: { xs: 1.4, md: 2 },

    transform: open ? "scale(1)" : "scale(1.04)",
    opacity: open ? 1 : 0,
    transition:
      "transform 0.8s cubic-bezier(.2,.8,.2,1), opacity 0.6s ease",
  }}
/>

      {/* CONTENT */}
      <Box maxWidth={1000} px={{ xs: 4, md: 10 }} py={6}>
        <Typography variant="h4" fontWeight={700} mb={2}>
          {event.title}
        </Typography>

        <Typography opacity={0.7} mb={4}>
          {event.mode} • {event.location}
        </Typography>

        {/* CTA */}
        <Button
          disabled={cta.disabled}
          sx={{
            mb: 6,
            px: 4,
            py: 1.4,
            borderRadius: 999,
            background: cta.disabled ? "#444" : "#fff",
            color: cta.disabled ? "#aaa" : "#000",
          }}
        >
          {cta.label}
        </Button>

        {/* DESCRIPTION */}
        <Typography lineHeight={1.9} opacity={0.9} mb={6}>
          {event.full}
        </Typography>

        {/* TIMELINE */}
        <Typography variant="h5" mb={2}>
          Schedule
        </Typography>

        {event.timeline.map((t, i) => (
          <Box key={i} mb={2}>
            <Typography fontWeight={600}>
              {t.day} — {t.title}
            </Typography>
            <Typography opacity={0.7}>{t.desc}</Typography>
          </Box>
        ))}

        {/* MENTORS */}
        <Typography variant="h5" mt={6} mb={2}>
          Mentors
        </Typography>

        {event.mentors.map((m, i) => (
          <Typography key={i} opacity={0.8}>
            {m.name} — {m.role}
          </Typography>
        ))}

        {/* JURY */}
        <Typography variant="h5" mt={6} mb={2}>
          Jury
        </Typography>

        {event.jury.map((j, i) => (
          <Typography key={i} opacity={0.8}>
            {j.name} — {j.role}
          </Typography>
        ))}

        {/* FAQ */}
        <Typography variant="h5" mt={6} mb={2}>
          FAQs
        </Typography>

        {event.faq.map((f, i) => (
          <Box key={i} mb={2}>
            <Typography fontWeight={600}>{f.q}</Typography>
            <Typography opacity={0.7}>{f.a}</Typography>
          </Box>
        ))}
      </Box>
      </Box>
      </Box>
    </Dialog>
  );
}

function getCTAState(event) {
  const now = new Date();

  if (now > event.registrationClosesAt) {
    return { label: "Registrations Closed", disabled: true };
  }

  if (event.phase === "DEVELOPMENT") {
    return { label: "Shortlisted Only", disabled: true };
  }

  return { label: "Apply Now", disabled: false };
}


export default function Home() {
  const c = useCountdown(TARGET_DATE);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);


const events = [
  {
    id: "buildx-design",
    title: "BuildX CUSTOM — Design",
    phase: "DESIGN",
    mode: "Online",
    location: "Remote",

    startDate: new Date("2026-01-10T10:00:00+05:30"),
    endDate: new Date("2026-01-12T18:00:00+05:30"),
    registrationClosesAt: new Date("2026-01-08T23:59:00+05:30"),

    image: "/assets/event-posters/design.png",

short: `Understand real problems before writing code.
Explore user needs, constraints, and real-world context.
Design solutions that are clear, practical, and build-ready.`,

full: `The Design phase is dedicated to understanding problems deeply before jumping into execution. 
Instead of writing code, teams focus on identifying real-world challenges, analyzing user behavior, 
and defining clear problem statements that reflect real product needs.

Participants research target users, map user journeys, and explore multiple solution directions 
through structured design thinking. The goal is not visual perfection, but clarity — why a problem 
exists, who it affects, and how it should be solved in a realistic product environment.

This phase emphasizes logic, usability, communication, and decision-making. Teams that succeed 
are those who can clearly explain their thinking, justify their design choices, and create solutions 
that are practical, scalable, and ready to be built in the next phase.`,

    timeline: [
      { day: "Day 1", title: "Problem Discovery", desc: "Research & ideation" },
      { day: "Day 2", title: "UX & Flows", desc: "Personas and wireframes" },
      { day: "Day 3", title: "Final Submission", desc: "Design review" },
    ],

    mentors: [
      { name: "Aditi Sharma", role: "Senior UX Designer, Google" },
      { name: "Rohit Mehta", role: "Product Lead, Swiggy" },
    ],

    jury: [
      { name: "Neha Jain", role: "Design Director" },
    ],

    faq: [
      {
        q: "Do I need design experience?",
        a: "No. Beginners are welcome if they understand problem solving.",
      },
      {
        q: "Is coding required?",
        a: "No coding is required in the Design phase.",
      },
    ],
  },

  {
    id: "buildx-dev",
    title: "BuildX CUSTOM — Dev",
    phase: "DEVELOPMENT",
    mode: "Offline",
    location: "On-site",

    startDate: new Date("2026-01-17T10:00:00+05:30"),
    endDate: new Date("2026-01-19T18:00:00+05:30"),
    registrationClosesAt: new Date("2026-01-14T23:59:00+05:30"),

    image: "/assets/event-posters/dev.png",

short: `Turn designs into real, working products.
Build features under real-world time and technical constraints.
Focus on execution, quality, and collaboration.`,

full: `The Development phase is an intensive, hands-on build experience where ideas are transformed into working products. 
Teams take their approved designs and implement them as functional prototypes, focusing on core features rather than 
theoretical solutions.

Participants work under real-world constraints such as limited time, scope, and resources. This phase mirrors how 
products are built in actual companies — prioritizing architecture, clean code, and problem-solving over rushed 
or incomplete implementations.

Success in this phase depends on execution quality, collaboration, and technical decision-making. Teams are evaluated 
on how well their product works, how thoughtfully it is built, and how effectively the solution aligns with the 
original problem statement.`,

    timeline: [
      { day: "Day 1", title: "Architecture", desc: "Setup & planning" },
      { day: "Day 2", title: "Build Sprint", desc: "Core development" },
      { day: "Day 3", title: "Demo Day", desc: "Presentation & judging" },
    ],

    mentors: [
      { name: "Kunal Verma", role: "Senior Engineer, Microsoft" },
    ],

    jury: [
      { name: "Arjun Rao", role: "CTO, StartupX" },
    ],

    faq: [
      {
        q: "Who can attend Dev phase?",
        a: "Only shortlisted teams from Design phase.",
      },
    ],
  },
];


  return (
    <>
          <Navbar />

    <Box
        sx={{
            color: "#fff",
            minHeight: "100vh",
            backgroundColor: "transparent",
            backdropFilter: "saturate(1.9) brightness(1.95) blur(30px)",
        }}
    >


      {/* ───────── HERO ───────── */}
<Box
  textAlign="center"
  py={{ xs: 10, md: 14 }}
  pt={{ xs: 28, md: 32 }}
  px={2}
  sx={{
    position: "relative",
    overflow: "hidden",
  }}
>
  {/* LOGO */}
  <Box
    sx={{
      position: "relative",
      mx: "auto",
      width: { xs: 260, sm: 360, md: 500 },
      mb: 1,
    }}
  >
    <BuildXLogoAnimated />
  </Box>

  {/* TAGLINE */}
  <Typography
    sx={{
      fontSize: { xs: 14, sm: 16 },
      letterSpacing: "0.35em",
      textTransform: "uppercase",
      opacity: 0.75,
      mb: 3,
    }}
  >
    Design • Develop • Deliver
  </Typography>

  {/* DESCRIPTION */}
  <Typography
    sx={{
      maxWidth: 760,
      mx: "auto",
      fontSize: { xs: 15, sm: 16 },
      lineHeight: 1.9,
      opacity: 0.65,
    }}
  >
    BuildX CUSTOM is a real-world inspired innovation experience by BunkMates,
    built to bridge the gap between ideas and execution. Participate, collaborate,
    and build products the way modern companies do.
  </Typography>

  {/* COUNTDOWN */}
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      gap: { xs: 2.5, sm: 4 },
      mt: 7,
      mb: 6,
      flexWrap: "wrap",
    }}
  >
    {c.live ? (
      <Typography
        sx={{
          fontSize: { xs: 42, sm: 56 },
          letterSpacing: "0.25em",
          fontWeight: 500,
        }}
      >
        LIVE
      </Typography>
    ) : (
    <Box
      sx={{
        display: "flex",
        gap: { xs: 2, sm: 3 },
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {["days", "hours", "minutes", "seconds"].map((k, idx) => (
        <Box
          key={k}
          sx={{
            width: { xs: 81, sm: 126 },
            px: 1,
            py: 2.5,
            textAlign: "center",
            borderRadius: 1.2,
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(255,255,255,0))",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.07)",
            boxShadow:
              "none",
            transition: "transform 0.25s ease, box-shadow 0.25s ease",
            "&:hover": {
              boxShadow:
                "none",
            },
          }}
        >
          {/* DIGITS */}
          <Typography
            sx={{
              fontSize: { xs: 36, sm: 48 },
              fontWeight: 500,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.02em",
            }}
          >
            <AnimatedDigit value={String(c[k]).padStart(2, "0")} />
          </Typography>

          {/* LABEL */}
          <Typography
            sx={{
              fontSize: { xs: 9, sm: 13 },
              letterSpacing: "0.25em",
              mt: 1.2,
              opacity: 0.65,
            }}
          >
            {k.toUpperCase()}
          </Typography>
        </Box>
      ))}
    </Box>
    )}
  </Box>

  {/* CTA */}
  <Button
    sx={{
      px: 5,
      py: 1.4,
      borderRadius: 4,
      fontSize: 15,
      fontWeight: 600,
      textTransform: "none",
      color: "#ffffff",
      background: "rgba(255,255,255,0.12)",
      backdropFilter: "blur(14px)",
      boxShadow: "none",
      transition: "all 0.3s ease-in-out",
      "&:hover": {
        background: "rgba(0, 0, 0, 1)",
        borderRadius: 0.8,
      },
    }}
  >
    Notify Me
  </Button>
</Box>


      {/* ───────── ABOUT ───────── */}
      <Box maxWidth={1000} mx="auto" px={3} py={10}>
        <Typography variant="h5" mb={3}>
          About BuildX CUSTOM
        </Typography>

        <Typography opacity={0.75} lineHeight={1.9}>
          BuildX CUSTOM is a two-phase product innovation experience designed to
          reflect how modern digital products are built in the real world.
          Instead of rushing directly into coding, participants move through a
          structured process — understanding problems first, then executing
          solutions with clarity and purpose.
          <br /><br />
          Unlike traditional hackathons, BuildX CUSTOM separates design thinking
          from development execution. This allows teams to focus deeply on each
          stage, producing thoughtful designs and reliable, scalable
          implementations.
        </Typography>
      </Box>

      {/* ───────── EVENTS ───────── */}
<Grid container spacing={4} mx="auto" maxWidth={1000} px={3} py={10}>
    <Typography
      variant="h5"
      mb={5}
        sx={{ fontWeight: 600, letterSpacing: "-0.02em", width: "100%", textAlign: "left" }}
    >
      The Events
    </Typography>
  {events.map((event, i) => (
    <Grid item xs={12} md={6} mx="auto" key={i}>
      <EventCard
        event={event}
        onViewMore={(event) => {
          setSelectedEvent(event);
          setDialogOpen(true);
        }}
      />
    </Grid>
  ))}
</Grid>


      {/* ───────── HOW IT WORKS ───────── */}
<Box maxWidth={1000} mx="auto" px={{ xs: 2.5, md: 3 }} py={{ xs: 8, md: 10 }}>
  {/* SECTION TITLE */}
<HowItWorksTimeline />
</Box>


      {/* ───────── FAQs ───────── */}
<Box maxWidth={1000} mx="auto" px={3} py={10}>
  {/* SECTION TITLE */}
  <Typography
    variant="h5"
    mb={4}
    sx={{
      fontWeight: 600,
      letterSpacing: "-0.02em",
    }}
  >
    FAQs
  </Typography>

  {[
    {
      q: "Who can participate?",
      a: `Anyone interested in design, development, or product thinking can participate.
Students, professionals, and hobbyists are all welcome. The program is designed
to be inclusive and skill-focused rather than experience-dependent.`,
    },
    {
      q: "Do I need prior experience?",
      a: `Prior experience is helpful but not mandatory.
What matters most is your ability to think critically, collaborate effectively,
and approach problems with curiosity and intent.`,
    },
    {
      q: "Is BuildX CUSTOM a hackathon?",
      a: `No. BuildX CUSTOM is a structured, industry-style product experience.
It focuses on clarity, execution quality, and real-world workflows rather than
speed-based or overnight development.`,
    },
  ].map((item, index) => (
    <Accordion
      key={index}
      disableGutters
      elevation={0}
      sx={{
        mb: 2,
        borderRadius: 1,
        backgroundColor: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.08)",
        transition: "all 0.35s ease",

        "&:before": { display: "none" },

        "&.Mui-expanded": {
          backgroundColor: "rgba(255,255,255,0.06)",
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ChevronDown size={20} />}
        sx={{
          px: 3,
          py: 2,
          "& .MuiAccordionSummary-content": {
            margin: 0,
          },
        }}
      >
        <Typography
          fontSize={16}
          fontWeight={600}
          letterSpacing="-0.01em"
        >
          {item.q}
        </Typography>
      </AccordionSummary>

      <AccordionDetails sx={{ px: 3, pb: 3 }}>
        <Typography
          fontSize={14.5}
          lineHeight={1.9}
          opacity={0.85}
        >
          {item.a}
        </Typography>
      </AccordionDetails>
    </Accordion>
  ))}
</Box>

      {/* ───────── FINAL CTA ───────── */}
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

<EventDetailsDialog
  open={dialogOpen}
  event={selectedEvent}
  onClose={() => {
    setDialogOpen(false);
    setSelectedEvent(null);
  }}
/>


      <Footer />
    </Box>
    </>
  );
}
