// src/pages/IntroFlow.jsx
import { Box, Button, Typography } from "@mui/material";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { introScreens } from "../data/introScreens";
import BuildXLogo from "../components/BuildXLogo";
import BlurText from "../components/BlurText";

const EASE = [0.25, 0.1, 0.25, 1];
const SOFT_EASE = [0.16, 1, 0.3, 1];

export default function IntroFlow({ onComplete }) {
  const [step, setStep] = useState(0);
  const [audioReady, setAudioReady] = useState(false);
  const timerRef = useRef(null);

  const transitionSound = useRef(new Audio("/sounds/transition.mp3"));
  const clickSound = useRef(new Audio("/sounds/click.mp3"));

  const screen = introScreens[step];

  // 🔓 Unlock audio (first interaction)
  const unlockAudio = () => {
    if (audioReady) return;
    setAudioReady(true);
    transitionSound.current.play().catch(() => {});
    transitionSound.current.pause();
  };

  // 🎬 Auto-advance (if duration exists)
  useEffect(() => {
    if (!screen.duration) return;

    timerRef.current = setTimeout(() => {
      setStep((s) => Math.min(s + 1, introScreens.length - 1));
    }, screen.duration);

    return () => clearTimeout(timerRef.current);
  }, [step, screen.duration]);

  // 🔊 Transition sound + haptics
  useEffect(() => {
    if (!audioReady) return;

    transitionSound.current.currentTime = 0;
    transitionSound.current.volume = 0.3;
    transitionSound.current.play().catch(() => {});
    navigator.vibrate?.(12);
  }, [step, audioReady]);

  const next = () => {
    unlockAudio();
    clearTimeout(timerRef.current);

    clickSound.current.currentTime = 0;
    clickSound.current.volume = 0.4;
    clickSound.current.play().catch(() => {});
    navigator.vibrate?.(20);

    if (step === introScreens.length - 1) {
      // ✅ Notify App to close intro
      onComplete?.();
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: SOFT_EASE }}
        onClick={unlockAudio}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2000,
          overflow: "hidden",
          backgroundColor: "#00000000",
          backdropFilter: "blur(130px) brightness(1.35)"
        }}
      >
        {/* 🌄 BACKGROUND */}
        <motion.div
          key={screen.id}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.4, ease: SOFT_EASE }}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${screen.bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* FOREGROUND */}
        <Box
          sx={{
            position: "relative",
            minHeight: "100vh",
            p: { xs: 3, md: 6 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: screen.darkText ? "#111" : "#fff",
          }}
        >
          {/* LOGO */}
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.92, filter: "blur(12px)" }}
            animate={{
              opacity: 1,
              y: screen.type === "hero" ? 90 : 0,
              scale: 1,
              filter: "blur(0px)",
            }}
            transition={{ duration: 1.4, ease: SOFT_EASE }}
            style={{
              display: "flex",
              justifyContent:
                screen.logoVariant === "hero" ? "center" : "flex-start",
            }}
          >
            <BuildXLogo
              variant={screen.logoVariant}
              tone={screen.darkText ? "dark" : "light"}
            />
          </motion.div>

          {/* TEXT */}
          {screen.contentText && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 1.2, ease: EASE }}
              style={{
                display: "flex",
                justifyContent: screen.centerContent ? "center" : "flex-start",
                textAlign: screen.centerContent ? "center" : "left",
              }}
            >
              <Typography
                sx={{
                  maxWidth: screen.centerContent ? 720 : 820,
                  fontSize: 20,
                  lineHeight: 1.7,
                  fontWeight: 400,
                }}
              >
                <BlurText text={String(screen.contentText)} />
              </Typography>
            </motion.div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: screen.type === "hero" ? -80 : 0,
              scale: 1,
            }}
            transition={{ delay: 0.9, duration: 1.3, ease: SOFT_EASE }}
            style={{
              display: "flex",
              justifyContent: screen.centerButton ? "center" : "flex-end",
            }}
          >
            <Button
              onClick={next}
              endIcon={<ArrowRight size={18} />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: 18,
                borderRadius: "999px",
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(12px)",
                color: screen.darkText ? "#111" : "#fff",
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "none",
              }}
            >
              {screen.button}
            </Button>
          </motion.div>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
}
