// src/pages/LoadingScreen.jsx
import { Box, Typography } from "@mui/material";
import {
  Sparkles,
  Layers,
  Sliders,
  CheckCircle,
  Check,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ✅ IMPORT GLOBAL BACKGROUND
import AppBackground from "../components/AppBackground"; // adjust path if needed

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

  /* ───────── STEP PROGRESSION ───────── */
  useEffect(() => {
    if (step === STEPS.length) {
      const t = setTimeout(() => setExiting(true), 500);
      return () => clearTimeout(t);
    }

    const timer = setTimeout(() => {
      setStep((s) => s + 1);
    }, 800);

    return () => clearTimeout(timer);
  }, [step]);

  /* ───────── NAVIGATE AFTER FADE ───────── */
  useEffect(() => {
    if (!exiting) return;
    const t = setTimeout(() => navigate("/"), 700);
    return () => clearTimeout(t);
  }, [exiting, navigate]);

  return (
    <AppBackground>
      <AnimatePresence>
        {!exiting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{
              minHeight: "100vh",
              position: "relative",
            }}
          >
            <Box
              sx={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                position: "relative",
                zIndex: 2, // ✅ keeps content above background layers
              }}
            >
              {/* STEP STACK */}
              <Box width={360}>
                <motion.div
                  animate={{ y: -step * 36 }}
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
                        transition={{ duration: 0.6, ease: EASE }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: { xs: "center", lg: "left" },
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
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            border: "1px solid rgba(255,255,255,0.15)",
                          }}
                        >
                          {isPast ? (
                            <motion.div
                              initial={{ scale: 0.6, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.35, ease: EASE }}
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
    </AppBackground>
  );
}
