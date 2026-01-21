import { useEffect, useState, useRef } from "react";
import {
  Box, Typography, Button, Divider, Card, Snackbar,
  Avatar, Grid, Paper, List, ListItem, ListItemText,
  Skeleton, useMediaQuery, useTheme, TextField, Dialog, DialogTitle, DialogContent,
  Chip, Drawer, BottomNavigation, BottomNavigationAction, IconButton, Menu, MenuItem
} from "@mui/material";

import {
  Ticket, LogOut, Download, Settings,
  ImagePlus, Clock, Users, LayoutDashboard, FolderOpen , FileText, Share2, MoreVertical 
} from "lucide-react";

import {
  doc, getDocs, onSnapshot, collection, updateDoc,
  addDoc, query, orderBy
} from "firebase/firestore";

import { db } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

import Cropper from "react-easy-crop";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const BRAND = {
  primary: "#6366F1",
  accent: "#22D3EE"
};

export default function TeamDashboard() {

  const { eventregistrationID } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [team, setTeam] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [resources, setResources] = useState([]);
  const [messages, setMessages] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  const [openSettings, setOpenSettings] = useState(false);
  const [toast, setToast] = useState(false);
  const [chatInput, setChatInput] = useState("");

  const passRef = useRef();
  const chatEndRef = useRef();

  const [menuAnchor, setMenuAnchor] = useState(null);

  const openMenu = (e) => setMenuAnchor(e.currentTarget);
  const closeMenu = () => setMenuAnchor(null);


  // -------- IMAGE CROP --------

  const [cropDrawer, setCropDrawer] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [cropType, setCropType] = useState("logo");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState(null);

  const [showFullDesc, setShowFullDesc] = useState(false);

const description = team?.description || "—";
const maxChars = 250;
const isLong = description.length > maxChars;


  const [settingsForm, setSettingsForm] = useState({
    teamName: "",
    description: "",
    logoURL: "",
    bannerURL: ""
  });

  const isLeader = team?.leaderId === localStorage.getItem("uid");

    const shareDashboard = async () => {

    const url = window.location.href;

    const shareData = {
      title: `${team.teamName} — Dashboard`,
      text: `Join our team dashboard for ${team.eventName}`,
      url
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        setToast("Dashboard link copied to clipboard");
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  // ---------------- LOADERS ----------------

  useEffect(() => {
    loadTeam();
    loadTimeline();
    loadResources();
    loadChat();
    loadAnnouncements();
  }, [eventregistrationID]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadTeam = () => {
    const ref = doc(db, "eventRegistrations", eventregistrationID);

    onSnapshot(ref, snap => {
      if (!snap.exists()) return navigate("/team-login");

      const data = snap.data();
      setTeam(data);

      setSettingsForm({
        teamName: data.teamName || "",
        description: data.description || "",
        logoURL: data.logoURL || "",
        bannerURL: data.bannerURL || ""
      });

      setLoading(false);
    });
  };

  const loadTimeline = async () => {
    const snap = await getDocs(collection(db, "eventTimeline"));
    setTimeline(snap.docs.map(d => d.data()).sort((a, b) => a.order - b.order));
  };

  const loadResources = async () => {
    const snap = await getDocs(collection(db, "eventResources"));
    setResources(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const loadChat = () => {
    const q = query(
      collection(db, "eventChats", eventregistrationID, "messages"),
      orderBy("createdAt", "asc")
    );

    onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => d.data()));
    });
  };

  const logout = () => {
    localStorage.removeItem("teamSession");
    navigate("/team-login");
  };

  // ---------------- SETTINGS SAVE ----------------

  const saveSettings = async () => {
    await updateDoc(doc(db, "eventRegistrations", eventregistrationID), settingsForm);
    setToast(true);
    setOpenSettings(false);
  };

  // ---------------- CHAT SEND ----------------

  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    await addDoc(
      collection(db, "eventChats", eventregistrationID, "messages"),
      {
        text: chatInput,
        sender: team.teamName,
        uid: localStorage.getItem("uid"),
        createdAt: new Date()
      }
    );

    setChatInput("");
  };

  // ---------------- IMAGE CROP ----------------

  const loadAnnouncements = () => {

  const q = query(
    collection(db, "announcements"),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, snap => {
    const data = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setAnnouncements(data);
  });
};


  const onSelectImage = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setCropType(type);
      setCropDrawer(true);
    };

    reader.readAsDataURL(file);
  };

  const onCropComplete = (_, pixels) => {
    setCroppedPixels(pixels);
  };

  const generateCroppedImage = async () => {

    const image = new Image();
    image.src = imageSrc;
    await new Promise(r => image.onload = r);

    const canvas = document.createElement("canvas");
    canvas.width = croppedPixels.width;
    canvas.height = croppedPixels.height;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      croppedPixels.x,
      croppedPixels.y,
      croppedPixels.width,
      croppedPixels.height,
      0,
      0,
      croppedPixels.width,
      croppedPixels.height
    );

    const dataURI = canvas.toDataURL("image/jpeg", 0.85);
    const key = cropType === "logo" ? "logoURL" : "bannerURL";

    await updateDoc(doc(db, "eventRegistrations", eventregistrationID), {
      [key]: dataURI
    });

    setCropDrawer(false);
  };

  // ---------------- PASS EXPORT ----------------

  const printPass = async () => {

    const canvas = await html2canvas(passRef.current, { scale: 2 });
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(data, "PNG", 10, 10, 190, 120);
    pdf.save(`${team.teamCode}-pass.pdf`);
  };

  // ---------------- CERTIFICATE ----------------

  const downloadCertificate = () => {

    const pdf = new jsPDF("landscape", "px", "a4");

    pdf.setFontSize(28);
    pdf.text("Certificate of Participation", 420, 120, null, null, "center");
    pdf.setFontSize(18);
    pdf.text(team.teamName, 420, 190, null, null, "center");
    pdf.setFontSize(14);
    pdf.text(team.eventName, 420, 240, null, null, "center");

    pdf.save(`${team.teamName}-certificate.pdf`);
  };

  if (loading) return <Skeleton height={400} />;

  // ---------------- UI ----------------

  return (
    <Box bgcolor="#02061700" minHeight="100vh" pb={isMobile ? 13 : 5} pt={1}>

      {/* HERO */}



      <Box sx={{
        m: 3,
        mb: 0,
        px: 3,
        height: 160,
        background: `url(${team.bannerURL})`,
        backgroundSize: "cover",
        display: "flex",
        alignItems: "center",
        borderRadius: 1,
      }}>

</Box>

<Box sx={{
    m: 3,
    mb: 7,
    px: 0,
    display: "flex",
    alignItems: "center",
}}>
            <Avatar src={team.logoURL} sx={{ width: 80, height: 80, mr: 2 }} />

<Box flexGrow={1}>
  <Typography color="white" variant="h6" fontWeight={900}>
    {team.teamName}
      <Chip
        size="small"
        label="Verified"
        color="success"
        sx={{ ml: 1 }}
      />
  </Typography>

  <Typography variant="caption" color="#d9d9d9">{team.eventName}</Typography>
</Box>

{!isMobile && (
  <>
    <Button
      onClick={shareDashboard}
      startIcon={<Share2 />}
      sx={{ mr: 1, color: "white", borderColor: BRAND.accent }}
      variant="outlined"
    >
      Share
    </Button>

      <Button
        onClick={() => setOpenSettings(true)}
        startIcon={<Settings />}
        sx={{ mr: 1 }}
      >
        Settings
      </Button>

    <Button onClick={logout} variant="contained">
      Logout
    </Button>
  </>
)}

{/* MOBILE THREE DOT MENU */}

{isMobile && (
  <>
    <IconButton onClick={openMenu}>
      <MoreVertical color="white" />
    </IconButton>

    <Menu
      anchorEl={menuAnchor}
      open={Boolean(menuAnchor)}
      onClose={closeMenu}
      PaperProps={{
        sx: {
          bgcolor: "#00000000",
          color: "white",
          borderRadius: 1,
          boxShadow: "none",
          backdropFilter: "blur(20px) saturate(1.8) brightness(1.5)",
          p: 1
        }
      }}
    >

      <MenuItem
        onClick={() => {
          closeMenu();
          shareDashboard();
        }}
      >
        <Share2 size={18} style={{ marginRight: 8 }} />
        Share Dashboard
      </MenuItem>

        <MenuItem
          onClick={() => {
            closeMenu();
            setOpenSettings(true);
          }}
        >
          <Settings size={18} style={{ marginRight: 8 }} />
          Settings
        </MenuItem>

      <MenuItem
        onClick={() => {
          closeMenu();
          logout();
        }}
      >
        <LogOut size={18} style={{ marginRight: 8 }} />
        Logout
      </MenuItem>

    </Menu>
  </>
)}
</Box>

      {/* DESKTOP TABS */}

      {!isMobile && (
        <Box px={4} mt={-3} sx={{ boxShadow: "none" }}>
          <Paper sx={{ display: "flex", gap: 1, p: 1, boxShadow: "none", backgroundColor: "#f1f1f110", backdropFilter: "blur(30px)", borderRadius: 4 }}>
            {["Overview", "Teams", "Resources", "Timeline", "Pass"].map((t, i) => (
              <Button
                key={i}
                fullWidth
                onClick={() => setTabValue(i)}
                sx={{
                  bgcolor: tabValue === i ? "#ffffffd1" : "transparent",
                  color: tabValue === i ? "#000" : "#f1f1f1c2",
                  borderRadius: 4
                }}
              >
                {t}
              </Button>
            ))}
          </Paper>
        </Box>
      )}

      {/* CONTENT */}

      <Box px={3} sx={{ boxShadow: "none" }}>

        <AnimatePresence>

          {/* OVERVIEW */}

          {tabValue === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

              <Card sx={{ p: 3, mt: 2, boxShadow: "none" }}>
                <Typography fontWeight={800} mb={2}>Team Details</Typography>

<Box display="flex" flexDirection="column" gap={2}>

  {/* PAYMENT STATUS ROW */}

  <Box
    display="flex"
    alignItems="center"
    justifyContent="space-between"
  >

    <Typography
      variant="caption"
      color="#ffffff"
      fontWeight={600}
    >
      Payment Status
    </Typography>

    <Chip
      label={team.paymentStatus}
      size="small"
      sx={{
        bgcolor:
          team.paymentStatus === "Verified"
            ? "rgba(34,197,94,0.15)"
            : "rgba(234,179,8,0.15)",
        color:
          team.paymentStatus === "Verified"
            ? "#22C55E"
            : "#EAB308",
        fontWeight: 700,
        borderRadius: 1.5
      }}
    />

  </Box>

  {/* DESCRIPTION BLOCK */}

  <Box
    borderRadius={2}
  >

    <Typography
      variant="caption"
      color="#ffffff"
      fontWeight={600}
      display="block"
      mb={0.5}
    >
      Team Description
    </Typography>

<Typography
  color="#d9d9d9"
  lineHeight={1.6}
  fontSize={14}
  variant="caption"
>
  {showFullDesc || !isLong
    ? description
    : `${description.slice(0, maxChars)}...`}
</Typography>

{isLong && (
  <Button
    onClick={() => setShowFullDesc(!showFullDesc)}
    size="small"
    sx={{
      mt: 0.5,
      px: 0,
      textTransform: "none",
      color: BRAND.accent,
      fontWeight: 600
    }}
  >
    {showFullDesc ? "View Less" : "View More"}
  </Button>
)}

  </Box>

</Box>

              </Card>

              <Card sx={{ p: 3, mt: 2, boxShadow: "none" }}>

  <Typography fontWeight={800} mb={2}>
    📢 Announcements
  </Typography>

  {announcements.length === 0 ? (

    <Typography color="text.secondary" fontSize={14}>
      No announcements yet.
    </Typography>

  ) : (

    <List>

      {announcements.map((a) => (

        <ListItem
          key={a.id}
          alignItems="flex-start"
          sx={{
            px: 0,
            borderBottom: "1px solid rgba(255,255,255,0.08)"
          }}
        >

          <ListItemText
            primary={
              <Typography fontWeight={700}>
                {a.title}
              </Typography>
            }
            secondary={
              <>
                <Typography fontSize={13} mt={0.5}>
                  {a.body}
                </Typography>

                {a.createdAt && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    mt={0.5}
                  >
                    {new Date(a.createdAt.seconds * 1000).toLocaleString()}
                  </Typography>
                )}
              </>
            }
          />

        </ListItem>

      ))}

    </List>

  )}

</Card>


              <Card sx={{ p: 3, mt: 2, boxShadow: "none" }}>
                <Typography fontWeight={800}>Event Details</Typography>
                <Divider sx={{ my: 2 }} />

<Box display="flex" flexDirection="column" gap={2}>

  {/* MODE */}

  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
  >
    <Typography variant="caption" color="#ffffff" fontWeight={600}>
      Event Mode
    </Typography>

    <Chip
      size="small"
      label={team?.eventMode || "Online"}
      sx={{
        bgcolor: "rgba(97, 100, 255, 0.15)",
        color: "rgb(157, 158, 255)",
        fontWeight: 700
      }}
    />
  </Box>

  {/* START DATE */}

  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
  >
    <Typography variant="caption" color="#ffffff" fontWeight={600}>
      Start Date
    </Typography>

    <Typography color="white" fontWeight={600}>
      {team?.eventStart || "01 Feb, 2026"}
    </Typography>
  </Box>

  {/* END DATE */}

  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
  >
    <Typography variant="caption" color="#ffffff" fontWeight={600}>
      End Date
    </Typography>

    <Typography color="white" fontWeight={600}>
      {team?.eventEnd || "02 Feb, 2026"}
    </Typography>
  </Box>

  {/* EVENT DESCRIPTION */}

  <Box>

    <Typography
      variant="caption"
      color="#ffffff"
      fontWeight={600}
      mb={0.5}
      display="block"
    >
      Event Description
    </Typography>

<Typography
  color="#d9d9d9"
  fontSize={14}
  lineHeight={1.6}
>
  BuildX Custom is a national-level innovation hackathon where teams compete to design and develop real-world digital solutions. Participants collaborate, ideate, prototype, and present their projects to industry mentors and judges within a limited time frame.
</Typography>

  </Box>

</Box>
              </Card>

            </motion.div>
          )}

          {/* TEAMS */}

          {tabValue === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

              <Card sx={{ p: 3, mt: 2, boxShadow: "none" }}>
                <Typography fontWeight={800} mb={2}>
                  Team Members ({team.members?.length || 0})
                </Typography>

                <List>
                  {team.members?.map((m, i) => (
                    <ListItem key={i}>
                      <Avatar sx={{ mr: 2 }}>{m.name?.[0]}</Avatar>
                      <ListItemText primary={m.name} secondary={m.email} />

                      {m.uid === team.leaderId && (
                        <Chip size="small" label="Leader" color="success" />
                      )}
                    </ListItem>
                  ))}
                </List>
              </Card>

            </motion.div>
          )}


          {/* RESOURCES */}

          {tabValue === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

              <Grid container spacing={2} mt={1}>
                {resources.map(res => (
                  <Grid item xs={12} md={6} key={res.id}>
                    <Card sx={{ p: 2, boxShadow: "none" }}>
                      <Typography fontWeight={700}>{res.title}</Typography>
                      <Typography variant="body2">{res.description}</Typography>

                      <Button
                        fullWidth
                        sx={{ mt: 1 }}
                        href={res.url}
                        target="_blank"
                        variant="outlined"
                      >
                        Open Resource
                      </Button>
                    </Card>
                  </Grid>
                ))}
              </Grid>

            </motion.div>
          )}

          {/* TIMELINE */}

          {tabValue === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

              <Card sx={{ p: 3, mt: 2, boxShadow: "none" }}>
                <Typography fontWeight={800} mb={2}>Event Timeline</Typography>

                <List>
                  {timeline.map((t, i) => (
                    <ListItem key={i}>
                      <Clock size={18} style={{ marginRight: 12 }} />
                      <ListItemText primary={t.title} secondary={t.description} />
                      <Chip label={t.status} />
                    </ListItem>
                  ))}
                </List>

              </Card>

            </motion.div>
          )}

          {/* PASS */}

          {tabValue === 4 && (
            <Box display="flex" justifyContent="center" mt={3} boxShadow={"none"}>

              <Paper ref={passRef} sx={{ width: 420, boxShadow: "none" }}>

                {team.bannerURL && (
                  <Box component="img" src={team.bannerURL}
                    sx={{ width: "100%", height: 120, objectFit: "cover" }}
                  />
                )}

                <Box p={3}>

                  <Typography fontWeight={900}>{team.teamName}</Typography>
                  <Typography variant="caption">{team.teamCode}</Typography>

                  <Box my={2} display="flex" justifyContent="center">
                    <QRCodeSVG value={team.discordLink} size={100} />
                  </Box>

                  <Button fullWidth onClick={printPass} startIcon={<Download />} variant="contained">
                    Export Pass PDF
                  </Button>

                  <Button fullWidth sx={{ mt: 1 }} onClick={downloadCertificate} variant="outlined">
                    Download Certificate
                  </Button>

                </Box>

              </Paper>

            </Box>
          )}

        </AnimatePresence>

      </Box>

      {/* MOBILE BOTTOM NAV */}

      {isMobile && (
<Paper
  elevation={10}
  sx={{
    position: "fixed",
    bottom: 10,
    left: 10,
    right: 10,
    zIndex: 1300,
    borderRadius: 1.5,
    overflow: "hidden",
    backdropFilter: "blur(14px) saturate(1) brightness(1.3)",
    background: "#f1f1f111",
    boxShadow: "none"
  }}
>

  <BottomNavigation
    value={tabValue}
    onChange={(e, v) => setTabValue(v)}
    showLabels
    sx={{
      height: 68,
      background: "transparent",
      p: 1,
    }}
  >

    {[
      { label: "Home", icon: <LayoutDashboard size={22} /> },
      { label: "Team", icon: <Users size={22} /> },
      { label: "Resources", icon: <FolderOpen size={22} /> },
      { label: "Timeline", icon: <Clock size={22} /> },
      { label: "Pass", icon: <Ticket size={22} /> }
    ].map((item, index) => (

      <BottomNavigationAction
        key={index}
        label={item.label}
        icon={item.icon}
        sx={{
          minWidth: 0,
          color: "#cecece",
          transition: "all .25s ease",
          borderRadius: 1,

          "&.Mui-selected": {
            color: "#000000",
            backgroundColor: "#eeeeee9a",
          },

          "& .MuiBottomNavigationAction-label": {
            fontSize: 11,
            fontWeight: 600,
            marginTop: "4px",
            transition: "all .25s ease"
          }
        }}
      />

    ))}

  </BottomNavigation>

</Paper>

      )}

      {/* SETTINGS DIALOG */}

      <Dialog open={openSettings} onClose={() => setOpenSettings(false)} fullWidth maxWidth="sm">

        <DialogTitle>Team Settings</DialogTitle>

        <DialogContent>

          {/* LOGO PREVIEW */}

          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Avatar src={settingsForm.logoURL} sx={{ width: 80, height: 80 }} />

            <Button component="label" startIcon={<ImagePlus />}>
              Change Logo
              <input hidden type="file" accept="image/*" onChange={e => onSelectImage(e, "logo")} />
            </Button>
          </Box>

          {/* BANNER PREVIEW */}

          {settingsForm.bannerURL && (
            <Box
              component="img"
              src={settingsForm.bannerURL}
              sx={{
                width: "100%",
                height: 160,
                objectFit: "cover",
                borderRadius: 2,
                mb: 2
              }}
            />
          )}

          <Button component="label" startIcon={<ImagePlus />} sx={{ mb: 2 }}>
            Change Banner
            <input hidden type="file" accept="image/*" onChange={e => onSelectImage(e, "banner")} />
          </Button>

          <TextField
            fullWidth
            label="Team Name"
            value={settingsForm.teamName}
            onChange={e => setSettingsForm({ ...settingsForm, teamName: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Team Description"
            value={settingsForm.description}
            onChange={e => setSettingsForm({ ...settingsForm, description: e.target.value })}
            sx={{ mb: 2 }}
          />

          <Button fullWidth onClick={saveSettings} variant="contained">
            Save Changes
          </Button>

        </DialogContent>

      </Dialog>

      {/* CROP DRAWER */}

      <Drawer anchor="bottom" open={cropDrawer} onClose={() => setCropDrawer(false)}>

        <Box height={420} position="relative">

          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={cropType === "logo" ? 1 : 16 / 9}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />

        </Box>

        <Button fullWidth onClick={generateCroppedImage}>
          Save Cropped Image
        </Button>

      </Drawer>

      <Snackbar
        open={toast}
        autoHideDuration={2500}
        message="Team Updated Successfully"
        onClose={() => setToast(false)}
      />

    </Box>
  );
}
