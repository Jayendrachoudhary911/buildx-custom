import { Box, Typography } from "@mui/material";
import {
  UserPlus,
  PenTool,
  ClipboardCheck,
  Code2,
  Presentation,
} from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    id: "register",
    step: "01",
    title: "Register",
    desc: "Register individually or with your team to participate.",
    icon: UserPlus,
  },
  {
    id: "design",
    step: "02",
    title: "Design Phase (Online)",
    desc: "Research problems, define users, and design practical solutions.",
    icon: PenTool,
  },
  {
    id: "review",
    step: "03",
    title: "Review & Shortlisting",
    desc: "Designs are evaluated and shortlisted for the next phase.",
    icon: ClipboardCheck,
  },
  {
    id: "development",
    step: "04",
    title: "Development Phase (Offline)",
    desc: "Build working prototypes under real-world constraints.",
    icon: Code2,
  },
  {
    id: "present",
    step: "05",
    title: "Present & Iterate",
    desc: "Demo your product, receive feedback, and refine.",
    icon: Presentation,
  },
];

/* ───────── Motion Variants ───────── */
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    filter: "blur(8px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 18,
    },
  },
};

const dotVariants = {
  hidden: { scale: 0.6, opacity: 0.4 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 300 },
  },
};

/* ───────── Timeline Step ───────── */
function TimelineStep({ item, index }) {
  const Icon = item.icon;
  const isLeft = index % 2 === 0;

  return (
    <motion.div variants={itemVariants}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 80px 1fr",
          },
          alignItems: "center",
          mb: { xs: 6, md: 12 },
        }}
      >
        {/* CONTENT */}
        <Box
          sx={{
            gridColumn: { md: isLeft ? 1 : 3 },
            textAlign: { md: isLeft ? "right" : "left" },

            backdropFilter: "blur(0px)",
            background:
              "none",
            border: "none",
            borderRadius: 4,

            pl: { xs: 6, md: 0 },
            pr: { xs: 1, md: 0 },
            py: { xs: 3, md: 0 },
            mx: { xs: "auto", md: 0 },
            maxWidth: { xs: 520, md: "unset" },

            boxShadow: "none",
          }}
          component={motion.div}
        >
          <Typography
            sx={{
              fontSize: 11,
              letterSpacing: "0.3em",
              opacity: 0.6,
              mb: 0.8,
            }}
          >
            STEP {item.step}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 16, md: 18 },
              fontWeight: 600,
              mb: 1,
            }}
          >
            {item.title}
          </Typography>

          <Typography
            sx={{
              fontSize: 14.5,
              lineHeight: 1.75,
              opacity: 0.78,
            }}
          >
            {item.desc}
          </Typography>
        </Box>

        {/* CENTER DOT (desktop only) */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            position: "absolute",
            left: "48.2%",
            gridColumn: 2,
          }}
        >
          <motion.div variants={dotVariants}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#fff",
                boxShadow:
                  "0 0 0 8px rgba(255,255,255,0.15), 0 0 20px rgba(255,255,255,0.6)",
              }}
            />
          </motion.div>
        </Box>

        {/* MOBILE ICON */}
<Box
    sx={{
        display: { xs: "flex", md: "none" },
        position: "absolute",
        left: -12,
    }}
>
    <Box
      sx={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        boxShadow:
          "0 0 0 8px rgba(255,255,255,0.15), 0 0 20px rgba(255,255,255,0.6)",

        color: "#000", // icon color
      }}
    >
      <Icon size={14} strokeWidth={2.2} />
    </Box>
</Box>
      </Box>
    </motion.div>
  );
}

/* ───────── Timeline Container ───────── */
export default function HowItWorksTimeline() {
  return (
    <Box
      maxWidth={1100}
      mx="auto"
      px={{ xs: 2, md: 3 }}
      py={{ xs: 8, md: 14 }}
      position="relative"
    >
      <Typography
        variant="h4"
        mb={{ xs: 6, md: 10 }}
        sx={{
          fontWeight: 600,
          letterSpacing: "-0.02em",
          textAlign: "center",
        }}
      >
        How It Works
      </Typography>

      <Box sx={{ position: "relative", pl: 2 }}>
        {/* CENTER LINE (desktop only) */}
        <Box
          sx={{
            display: "block",
            position: "absolute",
            left: { xs: 18, lg: "50%" },
            top: 0,
            bottom: 0,
            width: 2,
            transform: "translateX(-50%)",
            background: "rgba(255,255,255,0.12)",
          }}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {steps.map((item, index) => (
            <TimelineStep key={item.id} item={item} index={index} />
          ))}
        </motion.div>
      </Box>
    </Box>
  );
}
