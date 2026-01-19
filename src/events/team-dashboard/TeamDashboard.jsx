import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Card,
  CardContent,
  Snackbar,
  Chip
} from "@mui/material";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";

export default function TeamDashboard() {

  const { eventregistrationID } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [resources, setResources] = useState(null);
  const [announcement, setAnnouncement] = useState(null);

  const [controls, setControls] = useState({
    submissionOpen: false,
    leaderboardVisible: false,
    passDistributionEnabled: false
  });

  const [countdown, setCountdown] = useState("");
  const [toast, setToast] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    validateSessionAndLoad();
    listenAnnouncement();
    loadResources();
    listenControls();
  }, [eventregistrationID]);

  // ---------------- AUTH + TEAM ----------------

  const validateSessionAndLoad = async () => {

    try {

      const rawSession = localStorage.getItem("teamSession");

      if (!rawSession) {
        navigate("/team-login");
        return;
      }

      const session = JSON.parse(rawSession);

      if (session.id !== eventregistrationID) {
        navigate(`/team-dashboard/${session.id}`);
        return;
      }

      const ref = doc(db, "eventRegistrations", eventregistrationID);

      onSnapshot(ref, (snap) => {

        if (!snap.exists()) {
          navigate("/team-login");
          return;
        }

        const data = snap.data();

        if (data.email !== session.email) {
          navigate("/team-login");
          return;
        }

        setTeam(data);
        setLoading(false);

      });

    } catch (err) {
      console.error(err);
      navigate("/team-login");
    }
  };

  // ---------------- EVENT CONTROLS ----------------

  const listenControls = () => {

    const ref = doc(db, "eventControls", "main");

    onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setControls(snap.data());
      }
    });

  };

  // ---------------- ANNOUNCEMENT + TIMER ----------------

  const listenAnnouncement = () => {

    const ref = doc(db, "announcements", "latest");

    onSnapshot(ref, (snap) => {

      if (snap.exists()) {

        const data = snap.data();
        setAnnouncement(data);

        if (data.eventEndTime) {
          startCountdown(data.eventEndTime.toDate());
        }

      }

    });
  };

  const startCountdown = (endTime) => {

    setInterval(() => {

      const now = new Date();
      const diff = endTime - now;

      if (diff <= 0) {
        setCountdown("Submission Closed");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff / (1000 * 60)) % 60);

      setCountdown(`${hours}h ${mins}m remaining`);

    }, 60000);
  };

  // ---------------- RESOURCES ----------------

  const loadResources = async () => {

    const ref = doc(db, "eventResources", "main");
    const snap = await getDoc(ref);

    if (snap.exists()) {
      setResources(snap.data());
    }
  };

  // ---------------- LOGOUT ----------------

  const logout = () => {
    localStorage.removeItem("teamSession");
    navigate("/team-login");
  };

  if (loading) {
    return (
      <Box p={5}>
        <Typography>Loading Dashboard...</Typography>
      </Box>
    );
  }

  // ---------------- UI ----------------

  return (
    <Box p={5}>

      {/* HEADER */}

      <Box display="flex" justifyContent="space-between">
        <Typography fontSize={24} fontWeight={700}>
          Team Dashboard
        </Typography>

        <Button variant="outlined" onClick={logout}>
          Logout
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* TIMER */}

      {countdown && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography fontWeight={600}>⏳ Event Timer</Typography>
            <Typography fontSize={20} mt={1}>
              {countdown}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* ANNOUNCEMENT */}

      {announcement && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography fontWeight={600}>📢 Announcement</Typography>
            <Typography mt={1}>{announcement.message}</Typography>
          </CardContent>
        </Card>
      )}

      {/* TEAM INFO */}

      <Card sx={{ mb: 3 }}>
        <CardContent>

          <Typography fontWeight={600}>Team Info</Typography>

          <Typography mt={1}>
            Team: <b>{team.teamName}</b>
          </Typography>

          <Typography>
            Email: <b>{team.email}</b>
          </Typography>

          <Box mt={1} display="flex" gap={1} flexWrap="wrap">

            <Chip
              label={team.paymentStatus ? "Team Verified" : "Payment Pending"}
              color={team.paymentStatus ? "success" : "warning"}
            />

          </Box>

        </CardContent>
      </Card>

      {/* QUICK ACTIONS */}

      <Card sx={{ mb: 3 }}>
        <CardContent>

          <Typography fontWeight={600}>🚀 Quick Actions</Typography>

          <Box mt={2} display="grid" gap={1}>

            <Button
              variant="outlined"
              onClick={() =>
                navigate(`/team-settings/${eventregistrationID}`)
              }
            >
              ⚙ Project Settings
            </Button>

            <Button
              variant="contained"
              disabled={!controls.submissionOpen}
              onClick={() =>
                navigate(`/submission/${eventregistrationID}`)
              }
            >
              📤 Submit Project
            </Button>

            <Button
              variant="outlined"
              disabled={!controls.passDistributionEnabled}
              onClick={() =>
                navigate(`/team-pass/${eventregistrationID}`)
              }
            >
              🎫 View Event Pass
            </Button>

            <Button
              variant="outlined"
              disabled={!controls.leaderboardVisible}
              onClick={() => navigate("/leaderboard")}
            >
              🏆 View Leaderboard
            </Button>

          </Box>

        </CardContent>
      </Card>

      {/* MEMBERS */}

      {team.members && (
        <Card sx={{ mb: 3 }}>
          <CardContent>

            <Typography fontWeight={600}>👥 Team Members</Typography>

            {team.members.map((m, i) => (
              <Typography key={i}>
                {m.name} — {m.email}
              </Typography>
            ))}

          </CardContent>
        </Card>
      )}

      {/* SCORE */}

      {team.score !== undefined && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography fontWeight={600}>🏆 Score</Typography>
            <Typography fontSize={28} fontWeight={700}>
              {team.score} / 100
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* RESOURCES */}

      {resources && (
        <Card>
          <CardContent>

            <Typography fontWeight={600}>Resources</Typography>

            <Box mt={2} display="grid" gap={1}>

              <Button
                href={resources.rulebookURL}
                target="_blank"
                variant="outlined"
              >
                📄 Rulebook
              </Button>

              <Button
                href={resources.starterKitURL}
                target="_blank"
                variant="outlined"
              >
                🚀 Starter Kit
              </Button>

              <Button
                href={resources.discordLink}
                target="_blank"
                variant="contained"
              >
                💬 Discord Support
              </Button>

            </Box>

          </CardContent>
        </Card>
      )}

      {/* TOAST */}

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast("")}
        message={toast}
      />

    </Box>
  );
}
