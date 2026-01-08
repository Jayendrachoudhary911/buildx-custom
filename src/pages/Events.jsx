import { Box, Container, Typography } from "@mui/material";
import EventSection from "../sections/EventSection";

export default function EventsPage() {
  return (
    <Box sx={{ bgcolor: "#00000000", minHeight: "100vh", color: "#fff" }}>
      <Container maxWidth="lg" sx={{ pt: 12, pb: 12 }}>
        <Typography
          variant="h2"
          fontWeight={900}
          mb={6}
          letterSpacing="-0.02em"
        >
          {/* BuildX Events */}
        </Typography>

        {/* FULL EVENTS EXPERIENCE */}
        <EventSection />
      </Container>
    </Box>
  );
}
