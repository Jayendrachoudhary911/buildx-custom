// src/components/BlurText.jsx
import { motion } from "framer-motion";

const HIGHLIGHT_WORDS = ["design", "dev", "execution"];

export default function BlurText({ text }) {
  if (typeof text !== "string" || !text.trim()) return null;

  const words = text.split(" ");

  return (
    <>
      {words.map((word, i) => {
        const cleanWord = word.replace(/[.,—]/g, "");
        const isHighlight = HIGHLIGHT_WORDS.includes(
          cleanWord.toLowerCase()
        );

        return (
          <motion.span
            key={`${word}-${i}`}
            initial={{ opacity: 0, filter: "blur(10px)", y: 6 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{
              delay: i * 0.045,
              duration: 0.6,
              ease: "easeInOut",
            }}
            style={{
              display: "inline-block",
              marginRight: "6px",
              whiteSpace: "pre",
              fontWeight: isHighlight ? 600 : 400,
              letterSpacing: isHighlight ? "0.5px" : "normal",
              color: isHighlight ? "rgba(255,255,255,0.95)" : "inherit",
              textShadow: isHighlight
                ? "0 0 12px rgba(255,255,255,0.15)"
                : "none",
            }}
          >
            {word}
          </motion.span>
        );
      })}
    </>
  );
}
