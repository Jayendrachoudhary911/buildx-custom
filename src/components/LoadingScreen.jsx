// src/pages/LoadingScreen.jsx
import { Box, Typography } from "@mui/material";
import {
  Sparkles,
  Layers,
  Sliders,
  CheckCircle,
  Check
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.25, 0.1, 0.25, 1];

const STEPS = [
  { label: "Initializing experience", icon: Sparkles },
  { label: "Loading environments", icon: Layers },
  { label: "Preparing interface", icon: Sliders },
  { label: "Almost ready", icon: CheckCircle },
];

export default function LoadingScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);

  // Step progression
  useEffect(() => {
    if (step === STEPS.length) {
      setTimeout(() => setExiting(true), 500);
      return;
    }

    const timer = setTimeout(() => {
      setStep((s) => s + 1);
    }, 800);

    return () => clearTimeout(timer);
  }, [step]);

  // Navigate AFTER fade-out
  useEffect(() => {
    if (!exiting) return;
    const t = setTimeout(() => 700);
    return () => clearTimeout(t);
  }, [exiting, navigate]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ minHeight: "100vh" }}
        >
          <Box
            sx={{
              minHeight: "100vh",
              display: "grid",
              placeItems: "center",
              bgcolor: "transparent",
            }}
          >
            {/* STEP STACK — NO HIDING */}
            <Box width={360}>
              <motion.div
                animate={{ y: -step * 36 }} // subtle movement, not scroll-off
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 20,
                  mass: 0.9,
                }}
              >
                {STEPS.map((s, i) => {
                  const Icon = s.icon;
                  const isActive = i === step;
                  const isPast = i < step;

                  return (
                    <motion.div
                      key={s.label}
                      animate={{
                        opacity: isActive ? 1 : isPast ? 0.75 : 0.6,
                        scale: isActive ? 1 : 0.96,
                        filter: isActive ? "blur(0px)" : "blur(3px)",
                      }}
                      transition={{
                        duration: 0.6,
                        ease: EASE,
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        marginBottom: 18,
                      }}
                    >
                      {/* ICON */}
<Box
  sx={{
    width: 38,
    height: 38,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    bgcolor: isActive
      ? "rgba(255,255,255,0.18)"
      : "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
  }}
>
  {isPast ? (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.35,
        ease: EASE,
      }}
    >
      <Check size={18} />
    </motion.div>
  ) : (
    <Icon size={18} />
  )}
</Box>


                      {/* LABEL */}
                      <Typography
                        sx={{
                          fontSize: 15,
                          fontWeight: isActive ? 600 : 400,
                          color: isActive
                            ? "text.primary"
                            : "text.secondary",
                        }}
                      >
                        {s.label}
                      </Typography>
                    </motion.div>
                  );
                })}
              </motion.div>
            </Box>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
