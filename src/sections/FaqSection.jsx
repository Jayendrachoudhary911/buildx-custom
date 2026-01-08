// src/sections/FAQSection.jsx
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ChevronDown } from "lucide-react";


export default function FAQSection() {
  return (
<Box maxWidth={1000} mx="auto" px={3} py={10}>
  {/* SECTION TITLE */}
  <Typography
    variant="h5"
    mb={4}
    sx={{
      fontWeight: 600,
      letterSpacing: "-0.02em",
    }}
  >
    FAQs
  </Typography>

  {[
    {
      q: "Who can participate?",
      a: `Anyone interested in design, development, or product thinking can participate.
Students, professionals, and hobbyists are all welcome. The program is designed
to be inclusive and skill-focused rather than experience-dependent.`,
    },
    {
      q: "Do I need prior experience?",
      a: `Prior experience is helpful but not mandatory.
What matters most is your ability to think critically, collaborate effectively,
and approach problems with curiosity and intent.`,
    },
    {
      q: "Is BuildX CUSTOM a hackathon?",
      a: `No. BuildX CUSTOM is a structured, industry-style product experience.
It focuses on clarity, execution quality, and real-world workflows rather than
speed-based or overnight development.`,
    },
  ].map((item, index) => (
    <Accordion
      key={index}
      disableGutters
      elevation={0}
      sx={{
        mb: 2,
        borderRadius: 1,
        backgroundColor: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.08)",
        transition: "all 0.35s ease",

        "&:before": { display: "none" },

        "&.Mui-expanded": {
          backgroundColor: "rgba(255,255,255,0.06)",
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ChevronDown size={20} />}
        sx={{
          px: 3,
          py: 2,
          "& .MuiAccordionSummary-content": {
            margin: 0,
          },
        }}
      >
        <Typography
          fontSize={16}
          fontWeight={600}
          letterSpacing="-0.01em"
        >
          {item.q}
        </Typography>
      </AccordionSummary>

      <AccordionDetails sx={{ px: 3, pb: 3 }}>
        <Typography
          fontSize={14.5}
          lineHeight={1.9}
          opacity={0.85}
        >
          {item.a}
        </Typography>
      </AccordionDetails>
    </Accordion>
  ))}
</Box>
  );
}
