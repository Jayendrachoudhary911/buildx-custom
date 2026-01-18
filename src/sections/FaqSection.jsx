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
    {
      q: "What is the team size limit?",
      a: `Teams can consist of 2 to 3 members only.
This ensures balanced collaboration while allowing each member to contribute
meaningfully to the project outcome.`,
    },
    {
      q: "Can I participate solo?",
      a: `Solo participation is not allowed.
BuildX CUSTOM emphasizes teamwork, communication, and collaborative problem solving,
which is why team participation is mandatory.`,
    },
    {
      q: "What domains or tracks are available?",
      a: `Participants can choose between Design and Development tracks.
Each track has its own problem statements, evaluation criteria, and mentoring flow
tailored to industry practices.`,
    },
    {
      q: "Will mentorship be provided during the event?",
      a: `Yes. Mentors and coordinators will be available throughout the event.
They will guide teams on technical decisions, design thinking, and presentation strategy.`,
    },
    {
      q: "What tools or technologies are allowed?",
      a: `Participants are free to use any design tools, frameworks, programming languages,
and platforms as long as they comply with event rules and originality requirements.`,
    },
    {
      q: "How will submissions be evaluated?",
      a: `Projects will be evaluated based on innovation, execution quality,
problem understanding, usability, scalability, and presentation clarity.`,
    },
    {
      q: "Will participants receive certificates?",
      a: `Yes. All verified participants will receive digital participation certificates.
Top-performing teams will receive special recognition and winner certificates.`,
    },
    {
      q: "Is there any registration fee?",
      a: `Yes. A nominal registration fee is required to confirm participation.
Payment details will be shared after successful team registration and verification.`,
    },
    {
      q: "What happens after registration?",
      a: `Once registered and verified, teams will receive event passes,
official instructions, and onboarding details via email before the event kickoff.`,
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
