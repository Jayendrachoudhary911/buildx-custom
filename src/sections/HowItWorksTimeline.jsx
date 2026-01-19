import { Box, Typography, Chip } from "@mui/material";
import {
  UserPlus,
  Users,
  PlayCircle,
  FileText,
  PenTool,
  Code2,
  ClipboardCheck,
  Presentation,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";

/* ───────── Steps Data ───────── */

const designSteps = [
  {
    step: "01",
    title: "Registration",
    desc: "Register individually or as a team on our web portal. And pay their respective entry fees.",
    icon: UserPlus,
  },
  {
    step: "02",
    title: "Team Verification",
    desc: "After successful fee payment, verified teams will receive official entry passes directly on their registered email.",
    icon: Users,
  },
  {
    step: "03",
    title: "Event Starts",
    desc: "Kickoff session with rules and orientation.",
    icon: PlayCircle,
  },
  {
    step: "04",
    title: "Problem Statement Release",
    desc: "Official problem statements are revealed to participants.",
    icon: FileText,
  },
  {
    step: "05",
    title: "Enjoy Designing",
    desc: "Start designing innovative UI/UX solutions.",
    icon: PenTool,
  },
];

const devSteps = [
  {
    step: "01",
    title: "BuildX CUSTOM",
    desc: "BuildX CUSTOM",
    icon: UserPlus,
  },
  {
    step: "02",
    title: "BuildX CUSTOM",
    desc: "Build real it in BuildX CUSTOM",
    icon: Code2,
  },
  {
    step: "03",
    title: "BuildX CUSTOM",
    desc: "optimization.",
    icon: ClipboardCheck,
  },
  {
    step: "04",
    title: "BuildX CUSTOM",
    desc: "BuildX CUSTOM",
    icon: Presentation,
  },
];

/* ───────── Animations ───────── */

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 18,
    },
  },
};

/* ───────── Step Card ───────── */

function StepCard({ item, accent }) {
  const Icon = item.icon;

  return (
    <motion.div variants={cardVariants}>
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          height: "100%",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
          transition: "0.25s ease",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 18px 40px rgba(250, 250, 250, 0.1)",
          },
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography
            sx={{
              fontSize: 12,
              letterSpacing: "0.25em",
              opacity: 0.6,
            }}
          >
            STEP {item.step}
          </Typography>

          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#000",
              boxShadow: "0 0 18px rgba(255,255,255,0.35)",
            }}
          >
            <Icon size={18} strokeWidth={2.2} />
          </Box>
        </Box>

        <Typography fontWeight={600} mb={1}>
          {item.title}
        </Typography>

        <Typography
          sx={{
            fontSize: 14.5,
            lineHeight: 1.7,
            opacity: 0.8,
          }}
        >
          {item.desc}
        </Typography>
      </Box>
    </motion.div>
  );
}

/* ───────── MAIN SECTION ───────── */

export default function HowItWorksCards() {
  return (
    <Box maxWidth={1200} mx="auto" px={{ xs: 2, md: 3 }} py={{ xs: 8, md: 14 }}>
      {/* Title */}
      <Typography
        variant="h4"
        textAlign="center"
        mb={8}
        sx={{ fontWeight: 600 }}
      >
        How It Works — BuildX CUSTOMS
      </Typography>

      {/* ============ DESIGN HACKATHON ============ */}

      <Box mb={7}>
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <Typography variant="h5" fontWeight={600}>
            Design Hackathon
          </Typography>

          <Chip
            label="ONLINE"
            size="small"
            sx={{
              bgcolor: "rgba(255, 185, 120, 0.15)",
              color: "#ffc89b",
              fontWeight: 600,
            }}
          />
        </Box>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(5, 1fr)",
              },
              gap: 2,
            }}
          >
            {designSteps.map((item, i) => (
              <StepCard
                key={i}
                item={item}
                accent="linear-gradient(135deg, #ffffff, #ffffff)"
              />
            ))}
          </Box>
        </motion.div>
      </Box>

      {/* ============ DEV HACKATHON (LOCKED) ============ */}

      <Box position="relative">
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <Typography variant="h5" fontWeight={600}>
            Development Hackathon
          </Typography>

          <Chip
            label="OFFLINE"
            size="small"
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              fontWeight: 600,
            }}
          />
        </Box>

        {/* Content (Blurred) */}
        {/* <Box
          sx={{
            filter: "blur(26px) brightness(0.9)",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: 3,
              }}
            >
              {devSteps.map((item, i) => (
                <StepCard
                  key={i}
                  item={item}
                  accent="linear-gradient(135deg, #ff9800, #ff5722)"
                />
              ))}
            </Box>
          </motion.div>
        </Box> */}

        {/* Lock Overlay */}
        <Box
          component={motion.div}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          sx={{
            position: "relative",
            inset: 0,
            p: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            borderRadius: 3,
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.09))",
            backdropFilter: "blur(42px)",
            border: "1px dashed #ffffff5f"
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, #ffffffaa, #ffffffbd)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#000",
              boxShadow: "0 0 40px rgba(255, 255, 255, 0.49)",
            }}
          >
            <Lock size={28} />
          </Box>

          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            Releasing Soon
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              opacity: 0.75,
              textAlign: "center",
              maxWidth: 300,
            }}
          >
            Development Hackathon details will be unlocked after Design Phase.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
