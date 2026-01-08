import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0b0b0b",
      paper: "rgba(255, 255, 255, 0)",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255,255,255,0.75)",
    },
  },
  typography: {
    fontFamily: `"Inter", "Helvetica", "Arial", sans-serif`,
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
});

export default theme;
