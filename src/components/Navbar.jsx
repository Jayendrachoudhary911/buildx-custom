// src/components/Navbar.jsx
import {
  Box,
  Typography,
  Button,
  Drawer,
  IconButton,
  Avatar,
  SwipeableDrawer,
} from "@mui/material";
import { Menu, X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Home", id: "/" },
  { label: "Events", id: "/events" },
  { label: "Your Team", id: "/your-team" },
  { label: "Contact Us", id: "/contact-us" },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [active, setActive] = useState("about");
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const lastScroll = useRef(0);
  const navRef = useRef(null);
  const indicatorRef = useRef(null);
  const itemRefs = useRef({});
  const hoverOffset = useRef(0);

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (item) => {
    // ROUTE navigation
    if (item.id.startsWith("/")) {
      navigate(item.id);
      return;
    }

    // SECTION scroll (only works on home)
    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      setTimeout(() => {
        document
          .getElementById(item.id)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document
        .getElementById(item.id)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useLayoutEffect(() => {
  const el = itemRefs.current[active];
  const indicator = indicatorRef.current;
  if (!el || !indicator) return;

  const rect = el.getBoundingClientRect();
  const parent = navRef.current.getBoundingClientRect();

  indicator.style.width = `${rect.width}px`;
  indicator.style.transform = `translateX(${rect.left - parent.left}px)`;
}, [active]);


/* ───────── Scroll behavior ───────── */
useEffect(() => {
  const onScroll = () => {
    const current = window.scrollY;
    
    // We only care if the user has scrolled past a threshold (e.g., 20px)
    // to toggle the background styling.
    setScrolled(current > 20);
    
    // REMOVED: setHidden logic that slides the nav up/down
    lastScroll.current = current;
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, []);

  /* ───────── Active section observer ───────── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.6 }
    );

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  /* ───────── Sliding underline ───────── */
  useLayoutEffect(() => {
    const el = itemRefs.current[active];
    const indicator = indicatorRef.current;
    if (!el || !indicator) return;

    const rect = el.getBoundingClientRect();
    const parent = navRef.current.getBoundingClientRect();

    indicator.style.width = `${rect.width}px`;
    indicator.style.transform = `translateX(${rect.left - parent.left}px)`;
  }, [active]);

  /* ───────── Keyboard navigation ───────── */
  const onKeyDown = (e, index) => {
    if (e.key === "ArrowRight") {
      itemRefs.current[NAV_ITEMS[(index + 1) % NAV_ITEMS.length].id]?.focus();
    }
    if (e.key === "ArrowLeft") {
      itemRefs.current[
        NAV_ITEMS[(index - 1 + NAV_ITEMS.length) % NAV_ITEMS.length].id
      ]?.focus();
    }
    if (e.key === "Enter") scrollTo(NAV_ITEMS[index].id);
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setDrawerOpen(false);
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
            Notify Me
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
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: "100%",
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05))",
            backdropFilter: "blur(20px)",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
            <Typography fontSize={22}>BUILDX</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <X />
            </IconButton>
          </Box>

          {NAV_ITEMS.map((item) => (
            <Typography
              key={item.id}
              tabIndex={0}
              onClick={() => scrollTo(item.id)}
              sx={{
                py: 1.6,
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                opacity: active === item.id ? 1 : 0.6,
              }}
            >
              {item.label}
            </Typography>
          ))}
        </Box>
      </SwipeableDrawer>
    </>
  );
}
