// src/components/EventCard.jsx
import { Box, Typography } from "@mui/material";
import { useEventCountdown } from "../hooks/useCountdown";

export default function EventCard({ event }) {
  const countdown = useEventCountdown(event.startDate);
  const registrationsOpen = new Date() < event.registrationClosesAt;

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: 340, sm: 360, md: 380 },
        borderRadius: 4,
        overflow: "hidden",
        // Keep the image as the card background
        backgroundImage: `url(${event.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        cursor: "pointer",
        boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
        transform: "translateZ(0)", // avoids backdrop-filter flattening issues
        transition: "transform 0.35s ease, box-shadow 0.35s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.65)",
        },
        "&:hover .hoverLayer": {
          opacity: 1,
        },
      }}
    >
      {/* Base gradient overlay for readability */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.88) 80%)",
          pointerEvents: "none",
        }}
      />

      {/* Always-visible content */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          p: { xs: 3, sm: 4 },
          zIndex: 2,
          color: "#fff",
        }}
      >
        <Typography
          fontSize={{ xs: 18, sm: 20 }}
          fontWeight={600}
          mb={0.5}
          sx={{ letterSpacing: "-0.01em" }}
        >
          {event.title}
        </Typography>

        {!countdown.ended && (
          <Typography fontSize={13} opacity={0.8} mb={1}>
            {countdown.days}d {countdown.hours}h {countdown.minutes}m{" "}
            {countdown.seconds}s
          </Typography>
        )}

        <Typography
          fontSize={12}
          fontWeight={600}
          mb={1}
          sx={{
            color: registrationsOpen ? "#6CFF8E" : "#FF7A7A",
            letterSpacing: "0.16em",
          }}
        >
          {registrationsOpen
            ? "REGISTRATIONS OPEN"
            : "REGISTRATIONS CLOSED"}
        </Typography>

        <Typography
          fontSize={14}
          opacity={0.9}
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {event.short}
        </Typography>
      </Box>

      {/* Hover layer: blur + full description */}
      <Box
        className="hoverLayer"
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          p: { xs: 3, sm: 4 },
          color: "#fff",
          opacity: 0,
          transition: "opacity 0.35s ease",
          // Progressive blur over background image
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.96))",
        }}
      >
        <Typography
          fontSize={{ xs: 20, sm: 22 }}
          fontWeight={600}
          mb={2}
          sx={{ letterSpacing: "-0.01em" }}
        >
          {event.title}
        </Typography>

        <Typography
          fontSize={14.5}
          lineHeight={1.8}
          opacity={0.9}
          whiteSpace="pre-line"
        >
          {event.full}
        </Typography>
      </Box>
    </Box>
  );
}
