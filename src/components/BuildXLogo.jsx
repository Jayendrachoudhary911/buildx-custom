// src/components/BuildXLogo.jsx
import { motion } from "framer-motion";
import { useTheme, useMediaQuery } from "@mui/material";

export default function BuildXLogo({
  variant = "hero",
  tone = "light",
}) {
  const theme = useTheme();

  // Responsive breakpoints
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMd = useMediaQuery(theme.breakpoints.between("md", "lg"));

  const isHero = variant === "hero";
  const isDark = tone === "dark";

  // Dynamic width based on screen + variant
  const width = isHero
    ? isXs
      ? 260
      : isSm
      ? 340
      : isMd
      ? 420
      : 520
    : isXs
    ? 140
    : isSm
    ? 160
    : 200;

  return (
    <motion.div
      layoutId="buildx-logo"
      transition={{
        type: "spring",
        stiffness: 70,
        damping: 18,
      }}
      style={{
        width,
        maxWidth: "90vw",
      }}
    >
      <svg
        viewBox="0 0 610 260"
        width="100%"
        height="auto"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* BUNKMATES */}
        <text
          x="364"
          y="75"
          fill={isDark ? "#1a1a1a" : "#f3cfa8"}
          fontSize="32"
          letterSpacing="5"
          fontFamily="'Inter', sans-serif"
          fontWeight="300"
          style={{
            opacity: isHero ? 1 : 0.85,
          }}
        >
          BUNKMATES
        </text>

        {/* BUILDX */}
        <text
          x="0"
          y="250"
          fill={isDark ? "#111" : "#f5f5f5"}
          fontSize="240"
          fontFamily="'Six Caps', sans-serif"
        >
          B
        </text>

        <text
          x="60"
          y="250"
          fill={isDark ? "#111" : "#f5f5f5"}
          fontSize="200"
          fontFamily="'Six Caps', sans-serif"
        >
          UILD
        </text>

        <text
          x="230"
          y="250"
          fill={isDark ? "#111" : "#f5f5f5"}
          fontSize="240"
          fontFamily="'Six Caps', sans-serif"
        >
          X
        </text>

        {/* CUSTOM */}
        <text
          x="300"
          y="250"
          fill={isDark ? "#111" : "#f5f5f5"}
          fontSize="240"
          fontFamily="'Six Caps', sans-serif"
        >
          C
        </text>

        <text
          x="360"
          y="250"
          fill={isDark ? "#111" : "#f5f5f5"}
          fontSize="200"
          fontFamily="'Six Caps', sans-serif"
        >
          USTOM
        </text>
      </svg>
    </motion.div>
  );
}
