// src/sections/AboutSection.jsx
import { Box, Typography } from "@mui/material";

export default function AboutSection() {
  return (
      <Box maxWidth={1000} mx="auto" px={3} py={10}>
        <Typography variant="h5" mb={3}>
          About BuildX CUSTOM
        </Typography>

        <Typography opacity={0.75} lineHeight={1.9}>
          BuildX CUSTOM is a two-phase product innovation experience designed to
          reflect how modern digital products are built in the real world.
          Instead of rushing directly into coding, participants move through a
          structured process — understanding problems first, then executing
          solutions with clarity and purpose.
          <br /><br />
          Unlike traditional hackathons, BuildX CUSTOM separates design thinking
          from development execution. This allows teams to focus deeply on each
          stage, producing thoughtful designs and reliable, scalable
          implementations.
        </Typography>
      </Box>
  );
}
