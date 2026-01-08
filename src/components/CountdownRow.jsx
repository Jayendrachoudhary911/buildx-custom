import { Box, Typography } from "@mui/material";

export default function CountdownRow({ c }) {
  if (!c) return null;

  return (
    <Box sx={{ display: "flex", gap: 1.5 }}>
      {["days", "hours", "minutes", "seconds"].map((k) => (
        <Box
          key={k}
          sx={{
            minWidth: 52,
            px: 1,
            py: 0.8,
            borderRadius: 2,
            textAlign: "center",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(6px)",
          }}
        >
          <Typography fontSize={18} fontWeight={600}>
            {String(c[k] ?? 0).padStart(2, "0")}
          </Typography>
          <Typography fontSize={9} opacity={0.7}>
            {k.toUpperCase()}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
