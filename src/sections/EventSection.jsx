import React, {
  useState,
  useEffect,
  // forwardRef,
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
  // Slide,
  Container,
  // Avatar,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { X, Calendar, MapPin, Globe, Clock, ShieldCheck, HelpCircle, ChevronDown } from "lucide-react";

/* ───────── CONSTANTS ───────── */
// const TRANSITION_EASING_IN = "cubic-bezier(0.16, 1, 0.3, 1)";
// const TRANSITION_EASING_OUT = "cubic-bezier(0.7, 0, 0.84, 0)";

/* ───────── 1. ANIMATED TRANSITION ───────── */
// const Transition = forwardRef(function Transition(props, ref) {
//   return (
//     <Slide
//       direction="up"
//       ref={ref}
//       timeout={{ enter: 600, exit: 400 }}
//       easing={{ enter: TRANSITION_EASING_IN, exit: TRANSITION_EASING_OUT }}
//       {...props}
//     />
//   );
// });

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
  const navigate = useNavigate();

  const now = new Date();

  /* ───────── REGISTRATION WINDOW LOGIC ───────── */

  const registrationOpensAt =
    event.registrationOpensAt ?? event.registrationOpensAt;

  const registrationClosesAt = event.registrationClosesAt;

  let registrationStatus = "OPEN";
  let statusLabel = "REGISTRATIONS OPEN";
  let statusColor = "#6CFF8E";

  if (now < registrationOpensAt) {
    registrationStatus = "UPCOMING";
    statusLabel = `REGISTRATION OPENS ON ${registrationOpensAt.toLocaleDateString(
      "en-US",
      { day: "2-digit", month: "short" }
    )}`;
    statusColor = "#FFD36C";
  } else if (now > registrationClosesAt) {
    registrationStatus = "CLOSED";
    statusLabel = "REGISTRATIONS CLOSED";
    statusColor = "#FF7A7A";
  }

  return (
    <Box
      onClick={() => onViewMore(event)}
      sx={{
        position: "relative",

        /* RESPONSIVE SIZE */
        height: { xs: 460, sm: 420, md: 580 },
        width: "100%",
        maxWidth: { xs: "100%", sm: 430, md: 410 },

        mx: "auto",
        my: { xs: 2, sm: 3 },

        borderRadius: 2,
        overflow: "hidden",

        cursor: "pointer",

        backgroundImage: `url(${event.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",

        transition: "all 0.3s ease",

        "&:hover": {
          transform: { md: "translateY(-6px)" },
          boxShadow: "0 20px 45px rgba(255, 255, 255, 0.17)",
        },
      }}
    >
      {/* ───────── DARK GRADIENT OVERLAY ───────── */}

      <Box
        sx={{
          position: "absolute",
          inset: 0,
            backdropFilter: "blur(0px) saturate(1.8)",

          zIndex: 1,
        }}
      />

      {/* ───────── CONTENT ───────── */}

      <Box
        sx={{
          position: "relative",
          zIndex: 2,

          height: "100%",

          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",

          p: { xs: 2, sm: 2.5, md: 3 },

          color: "#fff",
        }}
      >
        {/* TITLE */}

        <Typography
          fontSize={{ xs: 18, sm: 20, md: 22 }}
          fontWeight={700}
          mb={0.6}
        >
          {event.title}
        </Typography>

        {/* COUNTDOWN */}

        <Box mb={1}>
          <TimeLeft target={event.startDate} />
        </Box>

        {/* STATUS */}

        <Typography
          fontSize={11}
          fontWeight={800}
          mb={1}
          sx={{
            color: statusColor,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {statusLabel}
        </Typography>

        {/* DESCRIPTION */}

        <Typography
          fontSize={{ xs: 13.5, sm: 14 }}
          sx={{
            opacity: 0.9,
            lineHeight: 1.6,

            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {event.short}
        </Typography>

        {/* CTA BUTTONS */}

        <Box mt={2} display="flex" gap={1.2}>
          <Button
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              onViewMore(event);
            }}
            sx={{
              py: 1.1,
              borderRadius: 999,
              fontWeight: 600,
              textTransform: "none",

              border: "1px solid rgba(255,255,255,0.35)",
              color: "#fff",

              backdropFilter: "blur(6px)",

              "&:hover": {
                background: "rgba(255,255,255,0.15)",
              },
            }}
          >
            View More
          </Button>

          {registrationStatus === "OPEN" && (
            <Button
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                navigate("/design-event/register");
              }}
              sx={{
                py: 1.1,
                borderRadius: 999,
                fontWeight: 600,

                bgcolor: "#fff",
                color: "#000",

                "&:hover": {
                  bgcolor: "#e5e7eb",
                },
              }}
            >
              Register
            </Button>
          )}
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
const liveItemRef = useRef(null);
const todayHeaderRef = useRef(null);
const navigate = useNavigate();

// const [collapsedDays, setCollapsedDays] = useState(() => new Set());

useEffect(() => {
  if (liveItemRef.current) {
    liveItemRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  } else if (todayHeaderRef.current) {
    todayHeaderRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}, []);

// const getStageBounds = (items) => {
//   const starts = items.map(i => new Date(i.start).getTime());
//   const ends = items.map(i => new Date(i.end).getTime());
//   return {
//     start: new Date(Math.min(...starts)),
//     end: new Date(Math.max(...ends)),
//   };
// };

// const getGroupBounds = (items) => {
//   const starts = items.map(i => new Date(i.start).getTime());
//   const ends = items.map(i => new Date(i.end).getTime());

//   return {
//     start: new Date(Math.min(...starts)),
//     end: new Date(Math.max(...ends)),
//   };
// };

// const getGroupStatus = (start, end) => {
//   const now = Date.now();
//   if (now < start.getTime()) return "UPCOMING";
//   if (now > end.getTime()) return "COMPLETED";
//   return "LIVE";
// };

// const STATUS_STYLES = {
//   LIVE: {
//     label: "LIVE",
//     bgcolor: "#6CFF8E",
//     color: "#000",
//     pulse: true,
//   },
//   UPCOMING: {
//     label: "UPCOMING",
//     bgcolor: "#E3F2FD",
//     color: "#1565C0",
//   },
//   COMPLETED: {
//     label: "COMPLETED",
//     bgcolor: "#EEEEEE",
//     color: "#616161",
//   },
// };



// const groupedTimeline = useMemo(() => {
//     if (!event?.timeline) return [];

//     // 1. Normalize strings to Date objects
//     const normalized = event.timeline
//       .map((item) => {
//         const startObj = new Date(item.start);
//         const endObj = new Date(item.end);
        
//         if (isNaN(startObj.getTime())) return null;

//         return { 
//           ...item, 
//           startObj, 
//           endObj,
//           // Use start date as the grouping key (YYYY-MM-DD)
//           dateKey: startObj.toISOString().split("T")[0] 
//         };
//       })
//       .filter(Boolean)
//       .sort((a, b) => a.startObj - b.startObj);

//     // 2. Group by dateKey
//     const groups = {};
//     normalized.forEach((item) => {
//       if (!groups[item.dateKey]) groups[item.dateKey] = [];
//       groups[item.dateKey].push(item);
//     });

//     return Object.entries(groups).map(([dateKey, items]) => ({
//       dateKey,
//       dateObj: items[0].startObj,
//       items,
//       // The start of the first item and end of the last item defines the day's range
//       dayStart: items[0].startObj,
//       dayEnd: items[items.length - 1].endObj,
//     }));
//   }, [event]);

  if (!event) return null;

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

{/* ───────── EVENT TIMELINE ───────── */}

<Box sx={{ mt: { xs: 10, md: 14 }, mb: { xs: 8, md: 12 } }}>

  {/* SECTION TITLE */}
  <Typography
    sx={{
      fontWeight: 900,
      fontSize: { xs: "1.8rem", md: "2.4rem" },
      mb: 4,
    }}
  >
    Event Timeline
  </Typography>

  {/* GRID CONTAINER */}
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(2, 1fr)",
      },
      gap: 2,
      maxWidth: 700,
    }}
  >

    {/* REGISTRATION OPENS */}
    <Box
      sx={{
        p: 3.5,
        borderRadius: 2,
        bgcolor: "rgba(255, 255, 255, 0.12)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Typography fontWeight={900} mb={1}>
        Registration Opens
      </Typography>

      <Typography sx={{ fontSize: 15, opacity: 0.85, mb: 1 }}>
        Jan 18, 2026 | 10:00 AM IST
      </Typography>

      <Typography sx={{ fontSize: 14, opacity: 0.7, lineHeight: 1.6 }}>
        Participants can start registering on official web portal. Both individual and team
        registrations are allowed. And pay their respective entry fees.
      </Typography>
    </Box>

    {/* REGISTRATION CLOSES */}
    <Box
      sx={{
        p: 3.5,
        borderRadius: 2,
        bgcolor: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Typography fontWeight={900} mb={1}>
        Registration Closes
      </Typography>

      <Typography sx={{ fontSize: 15, opacity: 0.85, mb: 1 }}>
        Jan 30, 2026 | 11:59 PM IST
      </Typography>

      <Typography sx={{ fontSize: 14, opacity: 0.7, lineHeight: 1.6 }}>
        This is the final deadline to register for the event. No new entries will
        be accepted after this time. Teams are advised to complete payment and
        verification early to avoid last-minute issues.
      </Typography>
    </Box>

    {/* EVENT START */}
    <Box
      sx={{
        p: 3.5,
        borderRadius: 2,
        bgcolor: "rgba(108,255,142,0.12)",
        border: "1px solid rgba(108,255,142,0.35)",
      }}
    >
      <Typography fontWeight={900} mb={1}>
        Event Starts
      </Typography>

      <Typography sx={{ fontSize: 15, opacity: 0.9, mb: 1 }}>
        Sunday, Feb 1, 2026 | 9:30 AM IST
      </Typography>

      <Typography sx={{ fontSize: 14, opacity: 0.75, lineHeight: 1.6 }}>
        The official kickoff session begins. Participants will receive event
        guidelines, judging criteria, problem statements, and access to official
        communication channels. Design activities start immediately after the
        opening ceremony.
      </Typography>
    </Box>

    {/* EVENT END */}
    <Box
      sx={{
        p: 3.5,
        borderRadius: 2,
        bgcolor: "rgba(255,183,77,0.12)",
        border: "1px solid rgba(255,183,77,0.35)",
      }}
    >
      <Typography fontWeight={900} mb={1}>
        Event Ends
      </Typography>

      <Typography sx={{ fontSize: 15, opacity: 0.9, mb: 1 }}>
        Monday, Feb 2, 2026 | 10:00 AM IST
      </Typography>

      <Typography sx={{ fontSize: 14, opacity: 0.75, lineHeight: 1.6 }}>
        Final design submissions close at this time. Judges will begin evaluation
        and shortlisting. Winners and shortlisted teams will be announced shortly
        after the review process is completed.
      </Typography>
    </Box>

  </Box>
</Box>


{/* ───────── WHAT YOU WILL GET ───────── */}

<Box sx={{ mb: { xs: 10, md: 16 }, mt: 3 }}>

      <Typography
        sx={{
          fontSize: "1.6rem",
          fontWeight: 900,
          lineHeight: 1.1,
          mb: 2,
          color: "#ffffff",
        }}
      >
        What You Will Get
      </Typography>

      <Typography
        sx={{
          opacity: 0.7,
          fontSize: 16,
        }}
      >
        Unlock exciting rewards, recognition, and exclusive benefits by
        participating in BuildX.
      </Typography>


  {/* COMMON GRID CONTAINER */}
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(2, 1fr)",
      },
      maxWidth: 700,
      gap: 2,
      mt: 3
    }}
  >

    {/* Prize Pool */}
    <Box
      sx={{
        p: 4,
        borderRadius: 2,
        bgcolor: "#ffffff22",
        color: "#ffffff",
        border: "2px solid #f1f1f147"
      }}
    >
      <Typography fontWeight={900} fontSize={22} mb={1}>
        ₹25K Prize Pool
      </Typography>

      <Typography sx={{ opacity: 0.75 }}>
        Compete for a total prize pool of ₹25,000 and earn exciting rewards
        for outstanding performance.
      </Typography>
    </Box>

    {/* Top 3 Designs */}
    <Box
      sx={{
        p: 4,
        borderRadius: 2,
        bgcolor: "#ffffff22",
        color: "#ffffff",
        border: "2px solid #f1f1f147"
      }}
    >
      <Typography fontWeight={900} fontSize={22} mb={1}>
        Prizes for Top 3 Designs
      </Typography>

      <Typography sx={{ opacity: 0.75 }}>
        Special rewards and recognition will be given to the top three
        winning design teams.
      </Typography>
    </Box>

    {/* Exclusive Swags */}
    <Box
      sx={{
        p: 4,
        borderRadius: 2,
        bgcolor: "#ffffff22",
        color: "#ffffff",
        border: "2px solid #f1f1f147"
      }}
    >
      <Typography fontWeight={900} fontSize={22} mb={1}>
        Exclusive Swags
      </Typography>

      <Typography sx={{ opacity: 0.75 }}>
        Get your hands on exclusive BuildX merchandise, goodies, and
        collectibles made specially for participants.
      </Typography>
    </Box>

    {/* Certificates */}
    <Box
      sx={{
        p: 4,
        borderRadius: 2,
        bgcolor: "#ffffff22",
        color: "#ffffff",
        border: "2px solid #f1f1f147"
      }}
    >
      <Typography fontWeight={900} fontSize={22} mb={1}>
        Certificates
      </Typography>

      <Typography sx={{ opacity: 0.75 }}>
        Receive official participation and achievement certificates to
        strengthen your resume and portfolio.
      </Typography>
    </Box>

    {/* Industry Recognition */}
    <Box
      sx={{
        p: 4,
        borderRadius: 2,
        bgcolor: "#ffffff22",
        color: "#ffffff",
        border: "2px solid #f1f1f147"
      }}
    >
      <Typography fontWeight={900} fontSize={22} mb={1}>
        Industry Recognition
      </Typography>

      <Typography sx={{ opacity: 0.75 }}>
        Get noticed by mentors, judges, and partner organizations during
        the event showcase.
      </Typography>
    </Box>

  </Box>


</Box>



      {/* MENTORS */}
      {/* <Typography sx={{ fontWeight: 800, mt: 10, mb: 5, fontSize: "1.6rem" }}>
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
      </Grid> */}


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
            onClick={() => navigate("/design-event/register")}
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
  const navigate = useNavigate();

const events = useMemo(() => [
    {
      id: "buildx-design",
      title: "BuildX Design",
      phase: "DESIGN",
      startDate: new Date("2026-02-01T10:00:00+05:30"),
      registrationOpensAt: new Date("2026-01-18T10:00:00+05:30"),
      registrationClosesAt: new Date("2026-01-30T23:59:00+05:30"),
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
  /* ───────── REGISTRATION STAGE ───────── */
  {
    stage: "registration",
    dateKey: "2026-01-17",
    dateObj: new Date("2026-01-17T00:00:00+05:30"),
    rangeLabel: "17 Jan 26 → 28 Jan 26",
    items: [
      {
        title: "Registration Window",
        desc: "Participants can register for BuildX Design during this period.",
        timeRange: "17 Jan 26, 12:00 AM IST → 28 Jan 26, 11:59 PM IST",
        platform: "Online",
        start: "2026-01-17T00:00:00+05:30",
        end: "2026-01-28T23:59:59+05:30",
      },
    ],
  },

  /* ───────── EVENT DAY 1 ───────── */
  {
    stage: "event",
    dateKey: "2026-02-01",
    dateObj: new Date("2026-02-01T00:00:00+05:30"),
    rangeLabel: "01 Feb 26, 09:30 AM → 02 Feb 26, 12:00 AM",
    items: [
      {
        title: "BuildX Design Begins",
        desc: "Opening of the Design Phase.",
        timeRange: "09:30 AM IST",
        start: "2026-02-01T09:30:00+05:30",
        end: "2026-02-01T09:30:00+05:30",
      },
      {
        title: "Opening & Orientation",
        desc: "Welcome session, rules briefing, and event orientation.",
        timeRange: "09:30 AM → 10:00 AM",
        start: "2026-02-01T09:30:00+05:30",
        end: "2026-02-01T10:00:00+05:30",
      },
      {
        title: "Problem Statement Reveal",
        desc: "Official problem statements are revealed.",
        timeRange: "10:00 AM",
        start: "2026-02-01T10:00:00+05:30",
        end: "2026-02-01T10:00:00+05:30",
      },
      {
        title: "Phase 1 – Designing",
        desc: "Ideation, structure, and early design iterations.",
        timeRange: "10:30 AM → 07:00 PM",
        start: "2026-02-01T10:30:00+05:30",
        end: "2026-02-01T19:00:00+05:30",
      },
      {
        title: "Presentations",
        desc: "Teams present their designs to mentors and jury.",
        timeRange: "07:00 PM → 08:30 PM",
        start: "2026-02-01T19:00:00+05:30",
        end: "2026-02-01T20:30:00+05:30",
      },
      {
        title: "Quiz Round",
        desc: "Engaging quiz session for participants.",
        timeRange: "09:30 PM → 12:00 AM",
        start: "2026-02-01T21:30:00+05:30",
        end: "2026-02-02T00:00:00+05:30",
      },
    ],
  },

  /* ───────── EVENT DAY 2 ───────── */
  {
    stage: "event",
    dateKey: "2026-02-02",
    dateObj: new Date("2026-02-02T00:00:00+05:30"),
    rangeLabel: "02 Feb 26, 12:00 AM → 10:00 AM",
    items: [
      {
        title: "Phase 2 – Designing",
        desc: "Overnight design and final improvements.",
        timeRange: "12:00 AM → 08:15 AM",
        start: "2026-02-02T00:00:00+05:30",
        end: "2026-02-02T08:15:00+05:30",
      },
      {
        title: "Final Submission Closes",
        desc: "Design submissions are closed.",
        timeRange: "08:15 AM",
        start: "2026-02-02T08:15:00+05:30",
        end: "2026-02-02T08:15:00+05:30",
      },
      {
        title: "Final Design Presentation",
        desc: "Final presentations and evaluation.",
        timeRange: "08:30 AM → 10:00 AM",
        start: "2026-02-02T08:30:00+05:30",
        end: "2026-02-02T10:00:00+05:30",
      },
      {
        title: "Event Ends & Pack-up",
        desc: "Official closing of BuildX Design.",
        timeRange: "10:00 AM",
        start: "2026-02-02T10:00:00+05:30",
        end: "2026-02-02T10:00:00+05:30",
      },
    ],
  },
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
      startDate: new Date("2026-03-01T10:00:00+05:30"),
      registrationOpensAt: new Date("2026-02-10T10:00:00+05:30"),
      registrationClosesAt: new Date("2026-02-16T23:59:00+05:30"),
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
        <Typography variant="h3" textAlign={"center"} fontWeight={800} mb={6}>
          The Events
        </Typography>

        <Grid container spacing={4} mx="auto" maxWidth={1000} px={3} py={1}>
          {events.map((event) => (
            <Grid item xs={12} md={6} mx="auto" key={event.id} sx={{ gap: 2 }}>
              <EventCard event={event} onViewMore={setSelectedEvent} sx={{ mb: 2 }} />
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
