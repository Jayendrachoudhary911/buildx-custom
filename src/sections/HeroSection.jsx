// import { useEffect, useState, memo } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import BuildXLogoAnimated from "../components/BuildXLogo";
// import AnimatedDigit from "../components/AnimatedDigit";
import { useNavigate } from "react-router-dom";

// const TARGET_DATE = new Date("2026-01-17T10:00:00+05:30").getTime();

/** * 1. Optimized Hook: Refined RAF logic to be even lighter.
 * We calculate the object state only once per second.
 */
// function useSmoothCountdown(targetTime) {
//   const [countdown, setCountdown] = useState(() => calculateTime(targetTime));

//   function calculateTime(target) {
//     const diff = target - Date.now();
//     if (diff <= 0) return { live: true };
//     return {
//       live: false,
//       days: Math.floor(diff / 86400000),
//       hours: Math.floor((diff / 3600000) % 24),
//       minutes: Math.floor((diff / 60000) % 60),
//       seconds: Math.floor((diff / 1000) % 60),
//     };
//   }

//   useEffect(() => {
//     let rafId;
//     let prevSec = Math.floor(Date.now() / 1000);

//     const tick = () => {
//       const now = Date.now();
//       const currentSec = Math.floor(now / 1000);

//       if (currentSec !== prevSec) {
//         setCountdown(calculateTime(targetTime));
//         prevSec = currentSec;
//       }
//       rafId = requestAnimationFrame(tick);
//     };

//     rafId = requestAnimationFrame(tick);
//     return () => cancelAnimationFrame(rafId);
//   }, [targetTime]);

//   return countdown;
// }

/** * 2. Memoized Timer Block: Prevents the entire Hero 
 * from recalculating styles every second.
 */
// const TimerBlock = memo(({ label, value }) => (
//   <Box
//     sx={{
//       width: { xs: 75, sm: 110 },
//       py: 2,
//       textAlign: "center",
//       borderRadius: 2,
//       background: "rgba(255,255,255,0.03)",
//       backdropFilter: "blur(10px)", // Adds "cool" glassmorphism
//       border: "1px solid rgba(255,255,255,0.06)",
//       transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//       "&:hover": {
//         transform: "scale(1.05)",
//         background: "rgba(255,255,255,0.06)",
//         borderColor: "rgba(255,255,255,0.2)",
//       },
//     }}
//   >
//     <Typography
//       sx={{
//         fontSize: { xs: 32, sm: 44 },
//         fontWeight: 600,
//         fontVariantNumeric: "tabular-nums",
//       }}
//     >
//       <AnimatedDigit value={String(value).padStart(2, "0")} />
//     </Typography>
//     <Typography
//       sx={{
//         fontSize: { xs: 8, sm: 11 },
//         letterSpacing: "0.2em",
//         opacity: 0.5,
//         mt: 0.5,
//       }}
//     >
//       {label.toUpperCase()}
//     </Typography>
//   </Box>
// ));

export default function HeroSection() {
  const navigate = useNavigate();
  // const c = useSmoothCountdown(TARGET_DATE);

  return (
    <Container maxWidth="lg" sx={{ pt: 8 }}>
      <Box
        textAlign="center"
        py={{ xs: 27, md: 20 }}
        sx={{ position: "relative" }}
      >
        {/* LOGO - Added a soft glow filter */}
        <Box sx={{ mx: "auto", width: { xs: 240, md: 500 }, mb: 2, filter: "drop-shadow(0 0 20px rgba(255,255,255,0.1))" }}>
          <BuildXLogoAnimated />
        </Box>

        <Typography
          sx={{
            fontSize: { xs: 12, sm: 14 },
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            mb: 4,
            background: "linear-gradient(90deg, #fff, rgba(255,255,255,0.4))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Design • Develop • Deliver
        </Typography>

        <Typography
          sx={{
            maxWidth: 600,
            mx: "auto",
            fontSize: { xs: 15, sm: 17 },
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.7)",
            mb: 8,
          }}
        >
          BuildX CUSTOM is a real-world innovation experience where creators turn bold ideas into practical solutions. Collaborate, design, build, and bridge the gap between imagination and execution.
        </Typography>

        {/* COUNTDOWN */}
        {/* <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: { xs: 1.5, sm: 3 },
            mb: 8,
          }}
        >
          {c.live ? (
            <Typography variant="h2" sx={{ fontWeight: 700, letterSpacing: 10 }}>LIVE</Typography>
          ) : (
            ["days", "hours", "minutes", "seconds"].map((unit) => (
              <TimerBlock key={unit} label={unit} value={c[unit]} />
            ))
          )}
        </Box> */}

        {/* CTA - Higher Contrast for "Cool" Factor */}
        <Button
          variant="contained"
          onClick={() => navigate("/problem-statement")}
          sx={{
            px: 6,
            py: 1.8,
            borderRadius: "50px",
            fontSize: 14,
            fontWeight: 700,
            backgroundColor: "#fff",
            color: "#000",
            transition: "all 0.4s ease",
            "&:hover": {
              backgroundColor: "#fff",
              boxShadow: "0 0 30px rgba(255,255,255,0.3)",
              transform: "translateY(-3px)",
            },
          }}
        >
          Problem Statements
        </Button>
      </Box>
    </Container>
  );
}