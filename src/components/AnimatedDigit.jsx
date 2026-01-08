// src/components/AnimatedDigit.jsx
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1]; // soft, cinematic easing

export default function AnimatedDigit({ value }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={value}
        initial={{
          y: 28,
          opacity: 0,
          filter: "blur(10px)",
        }}
        animate={{
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
        }}
        exit={{
          y: -28,
          opacity: 0,
          filter: "blur(10px)",
        }}
        transition={{
          duration: 0.55,
          ease: EASE,
        }}
        style={{
          display: "inline-block",
          minWidth: "1.6ch",
          textAlign: "center",

          /* Typography */
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "0.02em",

          /* Visual polish */
          willChange: "transform, opacity, filter",
        }}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}
