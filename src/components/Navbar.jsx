// src/components/Navbar.jsx
import {
  Box,
  Typography,
  Button,
  // Drawer,
  IconButton,
  Avatar,
  SwipeableDrawer,
} from "@mui/material";
import { Menu, X, Youtube } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Palette,
  Code2,
  Users,
  Mail,
  Instagram,
  Linkedin,
} from "lucide-react";
import { FaDiscord } from "react-icons/fa";


const NAV_ITEMS = [
  { label: "Home", id: "/", icon: Home },

  // Design hackathon (creative / UI)
  { label: "Design Event", id: "/design-event", icon: Palette },

  // Development hackathon (coding)
  { label: "Dev Event", id: "/dev-event", icon: Code2 },

  // Team management
  // { label: "Your Team", id: "/your-team", icon: Users },

  // Contact / Support
  { label: "Contact Us", id: "/contact-us", icon: Mail },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [active, setActive] = useState("about");
  const [scrolled, setScrolled] = useState(false);

  const navRef = useRef(null);
  const indicatorRef = useRef(null);
  const itemRefs = useRef({});
  const hoverOffset = useRef(0);

  const navigate = useNavigate();
  const location = useLocation();

  /* ───────── Unified Navigation Handler ───────── */

  const handleNavClick = (item) => {
    // Close drawer FIRST (prevents visual lag)
    setDrawerOpen(false);

    // Route navigation
    if (item.id.startsWith("/")) {
      navigate(item.id);
      return;
    }

    // Section scroll handling
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document
          .getElementById(item.id)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      document
        .getElementById(item.id)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  /* ───────── Scroll Styling ───────── */

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ───────── Active Indicator ───────── */

  useLayoutEffect(() => {
    const el = itemRefs.current[active];
    const indicator = indicatorRef.current;
    if (!el || !indicator) return;

    const rect = el.getBoundingClientRect();
    const parent = navRef.current.getBoundingClientRect();

    indicator.style.width = `${rect.width}px`;
    indicator.style.transform = `translateX(${rect.left - parent.left}px)`;
  }, [active]);

  /* ───────── Keyboard Navigation ───────── */

  const onKeyDown = (e, index) => {
    if (e.key === "ArrowRight") {
      itemRefs.current[NAV_ITEMS[(index + 1) % NAV_ITEMS.length].id]?.focus();
    }

    if (e.key === "ArrowLeft") {
      itemRefs.current[
        NAV_ITEMS[(index - 1 + NAV_ITEMS.length) % NAV_ITEMS.length].id
      ]?.focus();
    }

    if (e.key === "Enter") {
      handleNavClick(NAV_ITEMS[index]);
    }
  };

  /* ───────── External Social Redirect ───────── */

  const handleExternalLink = (url) => {
    setDrawerOpen(false);
    window.open(url, "_blank", "noopener,noreferrer");
  };
  
  return (
    <>
      {/* ───────── NAVBAR ───────── */}
<Box
  ref={navRef}
  sx={{
    // Change to fixed to ensure it stays pinned relative to the viewport
    position: "fixed", 
    top: 10,
    left: 0,
    right: 0,
    zIndex: 1300,
    borderRadius: 6,
    mx: "auto",
    width: { xs: "calc(100% - 25px)", md: "calc(100% - 78px)", lg: "calc(100% - 256px)" },

    // Remove the translateY transform logic
    transform: "none", 
    transition: "background 0.4s ease, backdrop-filter 0.4s ease, border 0.4s ease, padding 0.4s ease",

    // Dynamic padding: Nav "shrinks" slightly when scrolling for a premium feel
    px: { xs: 2.5, md: 2 },
    py: scrolled ? 1.2 : 2.2, 

    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    // Glassmorphism effect
    backdropFilter: scrolled ? "blur(20px) saturate(1.8)" : "none",
    WebkitBackdropFilter: scrolled ? "blur(20px) saturate(1.8)" : "none",

    background: scrolled
      ? "rgba(0, 0, 0, 0.31)" // Solidify slightly on scroll
      : "transparent",

    borderBottom: scrolled
      ? "0px solid rgba(255, 255, 255, 0)"
      : "0px solid rgba(255, 255, 255, 0)",
  }}
>
        {/* LOGO */}
<Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "10px", height: "10px" }}>
    <Avatar
      src="/assets/logos/logo.svg"
      variant="square"
      sx={{ width: 98, height: 35, backgroundColor: scrolled ? "transparent" : "#f1f1f129", px: 0.8, py: 0.5, borderRadius: 0.4 }}
    />
</Box>


        {/* DESKTOP NAV */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            position: "relative",
            gap: 3.5,
          }}
        >
{NAV_ITEMS.map((item, i) => (
  <Typography
    key={item.id}
    tabIndex={0}
    onClick={() => handleNavClick(item)}
    onKeyDown={(e) => onKeyDown(e, i)}

    onMouseMove={(e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const parent = navRef.current.getBoundingClientRect();

      const mouseX = e.clientX - rect.left;
      const center = rect.width / 1;

      hoverOffset.current = (mouseX - center) * 0.1;

      indicatorRef.current.style.width = `${rect.width}px`;
      indicatorRef.current.style.transform = `translateX(${
        rect.left - parent.left + hoverOffset.current
      }px)`;
    }}

    onMouseLeave={() => {
      hoverOffset.current = 0;
      setActive((prev) => prev); // snap back to active
    }}

    sx={{
      fontSize: 14,
      fontWeight: 500,
      cursor: "pointer",
      opacity: active === item.id ? 1 : 0.65,
      outline: "none",
      transition: "opacity 0.2s ease",
      zIndex: 10,
      px: 1.5,

      "&:focus-visible": {
        opacity: 1,
      },
    }}
  >
    {item.label}
  </Typography>
))}

        </Box>
<Box
  ref={indicatorRef}
  sx={{
    position: "absolute",
    bottom: scrolled ? 9 : 18,
    left: 0,
    height: 35,
    borderRadius: 4,
    background: "#ffffff10",
      zIndex: 9,

    transition:
      "transform 0.35s cubic-bezier(.22,1,.36,1), width 0.35s ease",
    willChange: "transform, width",
  }}
/>
        {/* CTA + MOBILE */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            onClick={() => navigate("/events")}
            sx={{
              px: 3,
              py: 0.8,
              borderRadius: 999,
              textTransform: "none",
              color: scrolled ? "#000" : "#fff",
              background: scrolled ? "#fff" : "rgba(255,255,255,0.14)",
              backdropFilter: "blur(12px)",
              "&:hover": {
                background: "#fff",
                color: "#000",
              },
            }}
          >
            Register Now
          </Button>

          <IconButton
            sx={{ display: { md: "none" } }}
            onClick={() => setDrawerOpen(true)}
          >
            <Menu />
          </IconButton>
        </Box>
      </Box>

      {/* ───────── MOBILE DRAWER ───────── */}
<SwipeableDrawer
  anchor="bottom"
  open={drawerOpen}
  onClose={() => setDrawerOpen(false)}
  onOpen={() => setDrawerOpen(true)}

  // BACKDROP BLUR + SHADOW LAYER
  ModalProps={{
    BackdropProps: {
      sx: {
        backgroundColor: "rgba(0, 0, 0, 0)",
        backdropFilter: "blur(12px) saturate(140%)",
        WebkitBackdropFilter: "blur(12px) saturate(140%)",
        transition: "all 0.35s ease",
      },
    },
  }}

  PaperProps={{
    sx: {
      width: { xs: "92%", sm: 380 },
      height: "80vh",

      background:
        "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.05))",

      backdropFilter: "blur(26px)",
      WebkitBackdropFilter: "blur(26px)",

      boxShadow:
        "none",

      mx: "auto",
      my: 2,

      borderRadius: 1,

      border: "1px solid rgba(255,255,255,0.12)",
    },
  }}
>


  <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>

    {/* ───────── HEADER / PROFILE AREA ───────── */}
    <Box
      sx={{
        px: 3,
        py: 2.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
    {/* ───────── DIVIDER ───────── */}
      <Box display="flex" alignItems="center" gap={1.5}>
        <Box>
          <Typography fontWeight={800} fontSize={18} sx={{ color: "#ffffff99" }}>
            BuildX CUSTOM
          </Typography>
        </Box>
      </Box>

      {/* Close Button */}
      <IconButton
        onClick={() => setDrawerOpen(false)}
        sx={{
          bgcolor: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(10px)",
          transition: "all 0.25s ease",
          "&:hover": {
            bgcolor: "rgba(255,255,255,0.15)",
            transform: "rotate(90deg)",
          },
        }}
      >
        <X size={20} />
      </IconButton>
    </Box>

    {/* ───────── NAVIGATION SECTION ───────── */}
    <Box sx={{ px: 3, py: 3, flex: 1 }}>

      <Typography
        sx={{
          fontSize: 11,
          letterSpacing: "0.3em",
          opacity: 0.45,
          mb: 2,
          fontWeight: 700,
        }}
      >
        NAVIGATION
      </Typography>

      <Box display="flex" flexDirection="column" gap={1}>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <Box
              key={item.id}
              tabIndex={0}
              onClick={() => handleNavClick(item)}
              sx={{
                px: 2.5,
                py: 1.8,
                borderRadius: 1,
                cursor: "pointer",

                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",

                fontSize: 15,
                fontWeight: 700,

                color: active === item.id ? "#fff" : "rgba(255,255,255,0.6)",

                background: "rgba(255, 255, 255, 0.03)",

                border:
                  active === item.id
                    ? "1px solid rgba(108,255,142,0.4)"
                    : "1px solid transparent",

                transition: "all 0.25s ease",

                "&:hover": {
                  background: "rgba(255,255,255,0.08)",
                  transform: "translateX(-6px)",
                },

                "&:focus-visible": {
                  outline: "2px solid rgba(108,255,142,0.6)",
                  outlineOffset: 2,
                },
              }}
            >
              {/* LEFT ICON + LABEL */}
              <Box display="flex" alignItems="center" gap={1.5}>
                <Icon size={18} />

                {item.label}
              </Box>

              {/* ACTIVE INDICATOR */}
              {active === item.id && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "#6cff8e",
                    boxShadow: "0 0 10px rgba(108,255,142,0.8)",
                  }}
                />
              )}
            </Box>
          );
        })}

      </Box>
    </Box>  

    {/* ───────── SOCIAL LINKS ───────── */}
    <Box
      sx={{
        px: 3,
        pb: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          opacity: 0.5,
          letterSpacing: "0.2em",
          fontWeight: 700,
        }}
      >
        FOLLOW BUNKMATES
      </Typography>

      <Box display="flex" gap={1.5}>
        {/* Example social icons */}
        <IconButton onClick={() => navigate("https://www.instagram.com/bunkmates.app/")} sx={{ color: "#fff", opacity: 0.7 }}>
          <Instagram size={18} />
        </IconButton>

        <IconButton onClick={() => navigate("https://www.linkedin.com/company/bunkmates/")} sx={{ color: "#fff", opacity: 0.7 }}>
          <Linkedin size={18} />
        </IconButton>
        
        <IconButton onClick={() => navigate("https://www.youtube.com/@Team_BunkMates")} sx={{ color: "#fff", opacity: 0.7 }}>
          <Youtube size={18} />
        </IconButton>
      </Box>
    </Box>

  </Box>
</SwipeableDrawer>

    </>
  );
}
