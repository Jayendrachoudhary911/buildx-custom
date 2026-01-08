import React, {
  useState,
  useEffect,
  forwardRef,
  memo,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  Dialog,
  Slide,
  Container,
  Avatar,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { X, Calendar, MapPin, Globe, Clock, ShieldCheck, HelpCircle, ChevronDown } from "lucide-react";

/* ───────── CONSTANTS ───────── */
const TRANSITION_EASING_IN = "cubic-bezier(0.16, 1, 0.3, 1)";
const TRANSITION_EASING_OUT = "cubic-bezier(0.7, 0, 0.84, 0)";

/* ───────── 1. ANIMATED TRANSITION ───────── */
const Transition = forwardRef(function Transition(props, ref) {
  return (
    <Slide
      direction="up"
      ref={ref}
      timeout={{ enter: 600, exit: 400 }}
      easing={{ enter: TRANSITION_EASING_IN, exit: TRANSITION_EASING_OUT }}
      {...props}
    />
  );
});

/* ───────── 2. ISOLATED COUNTDOWN (OPTIMIZED) ───────── */
const TimeLeft = memo(({ target }) => {
  const [diff, setDiff] = useState(() =>
    Math.max(0, target.getTime() - Date.now())
  );

  useEffect(() => {
    if (diff <= 0) return;

    const id = setInterval(() => {
      const next = target.getTime() - Date.now();
      setDiff(next > 0 ? next : 0);
    }, 1000);

    return () => clearInterval(id);
  }, [target, diff]);

  const time = useMemo(() => {
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff / 3600000) % 24);
    const m = Math.floor((diff / 60000) % 60);
    const s = Math.floor((diff / 1000) % 60);
    return { d, h, m, s };
  }, [diff]);

  if (diff <= 0) return null;

  return (
    <Box
      className="meta"
      sx={{
        display: "flex",
        gap: 1.5,
        fontVariantNumeric: "tabular-nums",
        opacity: 0.9,          // ✅ visible
        transform: "none",    // ✅ no animation dependency
        "& span": {
          display: "inline-flex",
          alignItems: "baseline",
          gap: "2px",
          fontSize: 13,
          fontWeight: 600,
        },
        "& b": {
          fontSize: 10,
          fontWeight: 700,
          opacity: 0.5,
          textTransform: "uppercase",
        },
      }}
    >
      <span>{time.d}<b>d</b></span>
      <span>{time.h}<b>h</b></span>
      <span>{time.m}<b>m</b></span>
      <Box
        component="span"
        sx={{
          color: "#6CFF8E",
          textShadow: "0 0 10px rgba(108,255,142,.3)",
        }}
      >
        {time.s}<b>s</b>
      </Box>
    </Box>
  );
});


/* ───────── 3. EVENT CARD (SMOOTH PARALLAX) ───────── */
const EventCard = memo(function EventCard({ event, onViewMore }) {
  const cardRef = useRef(null);
  const frame = useRef(null);
  const registrationsOpen = new Date() < event.registrationClosesAt;

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;

    if (frame.current) cancelAnimationFrame(frame.current);

    frame.current = requestAnimationFrame(() => {
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      cardRef.current.style.setProperty("--x", x.toFixed(3));
      cardRef.current.style.setProperty("--y", y.toFixed(3));
    });
  }, []);

  const resetTilt = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty("--x", 0);
    cardRef.current.style.setProperty("--y", 0);
  }, []);

  return (
<Box
  ref={cardRef}
  onMouseMove={handleMouseMove}
  onMouseLeave={resetTilt}
  onClick={() => onViewMore(event)}
  sx={{
    position: "relative",
    height: { xs: 480, md: 560 },
    width: { xs: "80vw", md: 380 },
    borderRadius: 3,
    mx: 0,
    mb: 3,
    cursor: "pointer",
    backgroundColor: "transparent",
    transform:
      "perspective(1000px) rotateX(calc(var(--y) * -8deg)) rotateY(calc(var(--x) * 8deg))",
    transition: "transform 0.2s ease-out, box-shadow 0.4s ease",
    willChange: "transform",

    "&:hover": {
      boxShadow: "0 40px 100px rgba(0,0,0,0.7)",

      "& .event-bg": {
        transform:
          "scale(1.12) translate(calc(var(--x) * -15px), calc(var(--y) * -15px))",
      },

      /* 🔥 ONLY TITLE + VIEW MORE ON HOVER */
      "& .title, & .viewMore": {
        opacity: 1,
        transform: "translateY(0)",
      },
    },

    /* 📱 Mobile / no-hover fallback */
    "@media (hover: none)": {
      "& .title, & .viewMore": {
        opacity: 1,
        transform: "none",
      },
    },
  }}
>


<Box
  className="event-bg"
  sx={{
    position: "absolute",
    inset: -20,
    backgroundImage: `url(${event.image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: 3,
    transition: "transform 0.15s ease-out",
    overflow: "hidden",
    opacity: 0.8,

    /* Base dark fade */
    "&::after": {
      content: '""',
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0,0,0,0) 35%, transparent 70%)",
      zIndex: 1,
    },

    /* Progressive blur layer */
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      backdropFilter: { xs: "blur(20px)", lg: "blur(0px)" },
      WebkitBackdropFilter: { xs: "blur(20px)", lg: "blur(0px)" },

      zIndex: 2,
      pointerEvents: "none",
    },
  }}
/>


<Box
  className="content"
  sx={{
    position: "absolute",
    bottom: { xs: 0, lg: -60 },
    zIndex: 2,
    p: { xs: 1, lg: 3.2 },
    color: "#fff",
    width: "100%",
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
    transform: "translateY(12px)",
    transition: "all 0.35s cubic-bezier(.16,1,.3,1)",
  }}
>
  {event.title}
</Typography>

    {/* STATUS */}
<Box
  className="meta"
  sx={{
    display: "flex",
    gap: 1.5,
    mb: 1.5,

    /* ✅ ALWAYS VISIBLE */
    opacity: 0.85,
    transform: "none",

    fontVariantNumeric: "tabular-nums",
    "& span": {
      display: "inline-flex",
      alignItems: "baseline",
      gap: "2px",
      fontSize: 13,
      fontWeight: 600,
    },
    "& b": {
      fontSize: 10,
      fontWeight: 700,
      opacity: 0.5,
      textTransform: "uppercase",
    },
  }}
>

  <TimeLeft target={event.startDate} />
</Box>

<Typography
  fontSize={11}
  fontWeight={700}
  mb={1}
  sx={{
    color: registrationsOpen ? "#6CFF8E" : "#FF7A7A",
    letterSpacing: "0.12em",
    opacity: 0.85,
  }}
>
  {registrationsOpen ? "REGISTRATIONS OPEN" : "REGISTRATIONS CLOSED"}
</Typography>

<Typography
  className="description"
  fontSize={14}
  sx={{
    opacity: 0.85,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
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
    transform: "translateY(12px)",
    transition: "all 0.35s cubic-bezier(.16,1,.3,1)",
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
});

const IconLabel = ({ icon: Icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
    <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: "rgba(255, 255, 255, 0.1)", display: "flex" }}>
      <Icon size={18} color="#ffffffff" />
    </Box>
    <Box>
      <Typography variant="caption" sx={{ display: "block", opacity: 0.5, textTransform: "uppercase", fontWeight: 700, letterSpacing: 1 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>{value}</Typography>
    </Box>
  </Box>
);

/* ───────── 4. EVENT DETAILS DIALOG ───────── */
function EventDetailsDialog({ open, event, onClose, Transition }) {
  const [expanded, setExpanded] = useState(false);

  // ✅ EARLY EXIT FIRST
  if (!event) return null;

  // ✅ SAFE AFTER THIS POINT
  const today = new Date();

  const timelineDates = event.timeline
    .map((i) => new Date(i.date))
    .filter((d) => !isNaN(d));

  const timelineStart = Math.min(...timelineDates);
  const timelineEnd = Math.max(...timelineDates);

  const progress =
    timelineEnd > timelineStart
      ? Math.min(
          1,
          Math.max(
            0,
            (today.getTime() - timelineStart) /
              (timelineEnd - timelineStart)
          )
        )
      : 0;

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      PaperProps={{ sx: { bgcolor: "#00000000", color: "#fff", backgroundImage: "none", backdropFilter: "blur(30px) brightness(1.85)" } }}
    >
      <Box sx={{ position: "relative", bgcolor: "#05050500", minHeight: "100vh", p: { xs: 1, lg: 0 } }}>
        
        {/* HEADER / CLOSE BUTTON */}
        <Box sx={{
          position: "fixed", top: 0, right: 0, width: "100%", zIndex: 10, p: 3,
          display: "flex", justifyContent: "flex-end",
          background: "transparent"
        }}>
          <IconButton 
            onClick={onClose} 
            sx={{ 
              bgcolor: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.15)", transform: "rotate(90deg)" },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
          >
            <X color="white" />
          </IconButton>
        </Box>

<Container
  maxWidth="lg"
  sx={{
    pt: { xs: 10, md: 16 },
    pb: { xs: 12, md: 18 },
  }}
>

    <Box>
    <Typography
        variant="overline"
        sx={{
          color: "#ffffffff",
          letterSpacing: 6,
          fontWeight: 900,
          mb: 1,
          display: "inline-block",
          textShadow: "0 0 12px rgba(108,255,142,0.35)",
        }}
      >
        BUILDX {event.phase} PHASE
      </Typography>

      {/* TITLE */}
      <Typography
        sx={{
          fontWeight: 900,
          mb: 5,
          fontSize: { xs: "2.6rem", md: "4.8rem" },
          lineHeight: 0.95,
          letterSpacing: "-0.03em",
        }}
      >
        {event.title}
      </Typography>

      {/* HERO IMAGE */}
      <Box
        sx={{
          width: "100%",
          height: { xs: 260, md: 460 },
          borderRadius: 2.5,
          overflow: "hidden",
          mb: 9,
          position: "relative",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "none",
        }}
      >
        <img
          src={event.image}
          alt={event.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>
    </Box>
  <Grid
    container
    spacing={{ xs: 6, md: 10 }}
    sx={{
      flexDirection: { xs: "column-reverse", lg: "row" },
    }}
  >

    {/* ───────── LEFT COLUMN: STORY ───────── */}
    <Grid item xs={12} md={7.5}>
    
      {/* ABOUT */}
      <Typography sx={{ fontWeight: 800, mb: 3, fontSize: "1.6rem" }}>
        About the Event
      </Typography>

    <Box
      sx={{
        position: "relative",
        maxWidth: 720,
        mb: 4,
      }}
    >
      <Typography
        sx={{
          fontSize: 18,
          lineHeight: 1.85,
          opacity: 0.75,
          display: "-webkit-box",
          WebkitLineClamp: expanded ? "unset" : 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          transition: "all 0.3s ease",
        }}
      >
        {event.full}
      </Typography>

      {/* READ MORE / LESS */}
      <Button
        onClick={() => setExpanded((v) => !v)}
        sx={{
          mt: 1.5,
          px: 0,
          minWidth: "unset",
          textTransform: "none",
          fontWeight: 700,
          color: "#ffffffff",
          alignSelf: "flex-start",
          "&:hover": {
            bgcolor: "transparent",
            textDecoration: "underline",
          },
        }}
      >
        {expanded ? "Show less ↑" : "Read more →"}
      </Button>
    </Box>

      {/* TIMELINE */}
      <Typography sx={{ fontWeight: 800, mb: 5, fontSize: "1.6rem" }}>
        The Road Ahead
      </Typography>

        <Box
          sx={{
            display: "block",
            position: "relative",
            left: 32,
            top: 0,
            bottom: 0,
            width: { xs: 320, lg: 440 },
          }}
        >

{/* BASE LINE */}
<Box
  sx={{
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
    transform: "translateX(-50%)",
    background: "rgba(255,255,255,0.15)",
  }}
/>

{/* PROGRESS LINE */}
<Box
  sx={{
    position: "absolute",
    left: 0,
    top: 0,
    width: 2,
    height: `${progress * 100}%`,
    transform: "translateX(-50%)",
    background: "linear-gradient(to top, #ffffff, rgba(255, 255, 255, 0.2))",
    boxShadow: "0 0 20px rgba(255, 255, 255, 0.6)",
    transition: "height 1.2s cubic-bezier(.16,1,.3,1)",
  }}
/>


{event.timeline.map((item, idx) => {
  const dateObj = item.date
    ? new Date(
        item.date.includes("T")
          ? item.date
          : `${item.date}T00:00:00+05:30`
      )
    : null;

const isToday =
  dateObj &&
  dateObj.toDateString() === today.toDateString();

  return (
    <Box
      key={idx}
      sx={{
        display: "grid",
        alignItems: "center",
        mb: 6,
        position: "relative",
      }}
    >
      {/* CONTENT */}
      <Box
        sx={{
          pl: 6,
          pr: 1,
          py: 3,
          maxWidth: 520,
        }}
      >
        <Typography
          sx={{
            fontSize: 11,
            letterSpacing: "0.3em",
            opacity: 0.6,
            mb: 0.8,
          }}
        >
          {item.day}
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: 16, md: 18 },
            fontWeight: 600,
            mb: 1,
          }}
        >
          {item.title}
        </Typography>

        <Typography
          sx={{
            fontSize: 14.5,
            lineHeight: 1.75,
            opacity: 0.78,
          }}
        >
          {item.desc}
        </Typography>
      </Box>

      {/* DATE DOT */}
      <Box
        sx={{
          position: "absolute",
          left: -22,
        }}
      >
<Box
  sx={{
    width: 46,
    height: 56,
    borderRadius: 0.6,
    background: isToday ? "#ffffffff" : "#d4d4d4ff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "2px",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxShadow: isToday
      ? "0 0 0 10px rgba(255, 255, 255, 1), 0 0 30px rgba(255, 255, 255, 0.9)"
      : "0 0 0 8px rgba(255, 255, 255, 0), 0 0 20px rgba(255,255,255,0)",

    animation: isToday
      ? "pulse 2s ease-in-out infinite"
      : "none",

    "@keyframes pulse": {
      "0%": {
        boxShadow:
          "0 0 0 0 rgba(255, 255, 255, 0.6)",
      },
      "70%": {
        boxShadow:
          "0 0 0 16px rgba(108,255,142,0)",
      },
      "100%": {
        boxShadow:
          "0 0 0 0 rgba(108,255,142,0)",
      },
    },
  }}
>

          {dateObj && (
            <>
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: "#000000ff",
                  lineHeight: 1,
                }}
              >
                {dateObj.toLocaleDateString("en-US", { day: "2-digit" })}
              </Typography>

              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  opacity: 0.75,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#272727ff",
                }}
              >
                {dateObj.toLocaleDateString("en-US", { month: "short" })}
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
})}

</Box>


      {/* MENTORS */}
      <Typography sx={{ fontWeight: 800, mt: 10, mb: 5, fontSize: "1.6rem" }}>
        Guided by Experts
      </Typography>

      <Grid container spacing={3}>
        {[...event.mentors, ...event.jury].map((person, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <Box
              sx={{
                p: 3.5,
                borderRadius: 2,
                bgcolor: "rgba(255,255,255,0.035)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                gap: 2.5,
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: "rgba(255,255,255,0.12)",
                  fontSize: 22,
                  fontWeight: 800,
                }}
              >
                {person.name[0]}
              </Avatar>

              <Box>
                <Typography sx={{ fontWeight: 800 }}>
                  {person.name}
                </Typography>
                <Typography sx={{ opacity: 0.55, fontWeight: 600 }}>
                  {person.role}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>


          {/* ───────── FAQ (LAST) ───────── */}
    <Box
      sx={{
        mt: 6,
        p: 0,
        borderRadius: 2.5,
        maxWidth: 720,
        border: "none",
        bgcolor: "rgba(255,255,255,0)",
      }}
    >
      <Typography
        sx={{
          fontWeight: 800,
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <HelpCircle size={20} color="#ffffffff" /> Frequently Asked Questions
      </Typography>

      {event.faq.slice(0, 5).map((q, i) => (
        <Accordion
          key={i}
          disableGutters
          elevation={0}
          sx={{
            bgcolor: "rgba(255,255,255,0.04)",
            px: 2,
            borderRadius: 0.6,
            mb: 1,
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary
            expandIcon={<ChevronDown size={18} color="#e4e4e4ff" />}
          >
            <Typography sx={{ fontWeight: 700 }}>{q.q}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ opacity: 0.6 }}>{q.a}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
    </Grid>

    {/* ───────── RIGHT COLUMN: GLASS PANEL ───────── */}
    <Grid item xs={12} md={4.5}>
      <Box sx={{ position: "sticky", top: 60 }}>
        
        {/* LOGISTICS CARD */}
        <Box
          sx={{
            p: 4.5,
            borderRadius: 2.5,
            width: { xs: "100%", lg: 350 },
            bgcolor: "rgba(255,255,255,0.035)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(50px)",
            boxShadow: "none",
          }}
        >
          <Typography
            sx={{
              mb: 5,
              fontWeight: 900,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              fontSize: "1.4rem",
            }}
          >
            <ShieldCheck color="#ffffffff" /> Logistics
          </Typography>

          <IconLabel icon={Calendar} label="Date" value={event.startDate.toLocaleDateString()} />
          <IconLabel icon={Clock} label="Time" value="10:00 AM onwards" />
          <IconLabel icon={MapPin} label="Location" value={event.location} />
          <IconLabel icon={Globe} label="Mode" value={event.mode} />

          <Divider sx={{ my: 5, borderColor: "rgba(255,255,255,0.1)" }} />

          <Typography
            sx={{
              fontWeight: 900,
              color: "#ffffffff",
              mb: 4,
            }}
          >
            Open until {event.registrationClosesAt.toLocaleDateString()}
          </Typography>

          <Button
            fullWidth
            sx={{
              py: 2.6,
              borderRadius: 1.3,
              bgcolor: "#fff",
              color: "#000",
              fontWeight: 900,
              fontSize: 16,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.03)",
                bgcolor: "#f0f0f0",
              },
            }}
          >
            Apply for BuildX
          </Button>
        </Box>
      </Box>
    </Grid>

  </Grid>
</Container>

      </Box>
    </Dialog>
  );
}

/* ───────── 5. MAIN SECTION ───────── */
export default function EventSection() {
  const [selectedEvent, setSelectedEvent] = useState(null);

const events = useMemo(() => [
    {
      id: "buildx-design",
      title: "BuildX Design",
      phase: "DESIGN",
      startDate: new Date("2026-01-10T10:00:00+05:30"),
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
      location: "Virtual / Remote",
      mode: "Online",
      timeline: [
        { day: "Day 1", title: "Empathy", desc: "Understanding user pain points.", date: "2026-01-04T00:00:00+05:30" },
        { day: "Day 2", title: "Ideation", desc: "Brainstorming solutions.", date: "2026-01-09T00:00:00+05:30" }
      ],
      mentors: [{ name: "Alex Rivera", role: "UX Director" }],
      jury: [{ name: "Sarah Chen", role: "Product Lead" }],
      faq: [
  {
    q: "Do I need to know Figma to participate?",
    a: "Basic familiarity with Figma or any design tool is helpful, but not mandatory. You can use tools you are comfortable with, including paper sketches or other wireframing tools."
  },
  {
    q: "Is this event only for designers?",
    a: "No. The Design phase is open to anyone interested in problem-solving, UX thinking, or product design — including developers, product enthusiasts, and beginners."
  },
  {
    q: "Can I participate solo or do I need a team?",
    a: "You can participate individually or as part of a team. Team collaboration is encouraged, but solo participants are equally welcome."
  },
  {
    q: "What exactly will we be judged on?",
    a: "Teams are evaluated on problem understanding, clarity of solution, user-centric thinking, feasibility, and how well the design addresses real-world constraints."
  },
  {
    q: "Do we need to submit high-fidelity UI designs?",
    a: "No. High-fidelity visuals are not required. Clear wireframes, user flows, and logical explanations matter more than visual polish."
  },
  {
    q: "Will there be mentorship during the event?",
    a: "Yes. Experienced mentors will be available during the event to guide you, review your approach, and help refine your ideas."
  },
  {
    q: "Is prior UX or product design experience required?",
    a: "Not at all. The event is designed to be beginner-friendly while still challenging experienced participants."
  },
  {
    q: "What should we submit at the end of the Design phase?",
    a: "You will submit a problem statement, user research insights, solution explanation, and supporting design artifacts such as wireframes or flow diagrams."
  },
  {
    q: "Will this design be used in the Development phase?",
    a: "Yes. Selected designs will move forward into the BuildX Development phase, where they will be transformed into working products."
  },
  {
    q: "Can I use AI tools during the Design phase?",
    a: "Yes, AI tools may be used for research, ideation, or inspiration. However, the core thinking and final decisions must be your own."
  }
]

    },
    {
      id: "buildx-dev",
      title: "BuildX Dev",
      phase: "DEV",
      startDate: new Date("2026-01-17T10:00:00+05:30"),
      registrationClosesAt: new Date("2026-01-15T23:59:00+05:30"),
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
      location: "Tech Park, Bangalore",
      mode: "In-person",
      timeline: [
        { day: "Day 1", title: "Architecture", desc: "Setting up the tech stack.", date: "2026-01-17T00:00:00+05:30" },
        { day: "Day 2", title: "Build", desc: "Hardcore coding sprint.", date: "2026-01-17T00:00:00+05:30" }
      ],
      mentors: [{ name: "James Watt", role: "Fullstack Engineer" }],
      jury: [{ name: "Emily Blunt", role: "CTO, StartupX" }],
      faq: [
  {
    q: "Can I use AI tools during the Development phase?",
    a: "Yes. AI tools can be used for productivity tasks such as debugging, documentation, or boilerplate generation. However, the core logic, architecture decisions, and final implementation must be your own."
  },
  {
    q: "Is this event beginner-friendly?",
    a: "Yes, but basic programming knowledge is expected. The event is designed to challenge beginners while still pushing experienced developers to build production-quality solutions."
  },
  {
    q: "Do we need to build a fully finished product?",
    a: "No. You are expected to build a functional prototype that demonstrates the core idea, key features, and technical feasibility of your solution."
  },
  {
    q: "What tech stack are we allowed to use?",
    a: "You are free to use any programming language, framework, or tool that best fits your solution. There are no restrictions on the tech stack."
  },
  {
    q: "How will projects be evaluated?",
    a: "Projects are judged based on functionality, problem-solving approach, code quality, architecture, scalability, and how well the solution aligns with the original design."
  },
  {
    q: "Can I work alone or do I need a team?",
    a: "You may participate either solo or as part of a team. Teams are encouraged, but individual participants are equally welcome."
  },
  {
    q: "Is UI/UX more important than backend logic?",
    a: "Both matter. A clean UI improves usability, but strong backend logic, data handling, and system design carry significant weight in evaluation."
  },
  {
    q: "Can we use open-source libraries or APIs?",
    a: "Yes. Open-source libraries and third-party APIs are allowed, as long as you clearly understand and integrate them responsibly into your project."
  },
  {
    q: "Will mentors be available during the build?",
    a: "Yes. Mentors will be available throughout the event to help with technical guidance, architecture decisions, and problem-solving."
  },
  {
    q: "What happens after the Development phase?",
    a: "Top-performing teams may receive recognition, feedback from experts, and opportunities to further refine or showcase their projects."
  }
]

    }
  ], []);
  
  return (
    <Box sx={{ bgcolor: "#00000000", color: "#fff", py: 10 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" fontWeight={800} mb={6}>
          The Events
        </Typography>

        <Grid container spacing={4} mx="auto" maxWidth={1000} px={3} py={1}>
          {events.map((event) => (
            <Grid item xs={12} md={6} mx="auto" key={event.id}>
              <EventCard event={event} onViewMore={setSelectedEvent} />
            </Grid>
          ))}
        </Grid>

        <EventDetailsDialog
          open={Boolean(selectedEvent)}
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      </Container>
    </Box>
  );
}
