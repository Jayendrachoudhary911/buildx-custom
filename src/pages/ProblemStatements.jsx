import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Container,
  Divider,
  Drawer,
  TextField,
  Button,
  Alert,
  IconButton,
} from "@mui/material";

import { db } from "../firebase";

import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [isProblemOnline, setIsProblemOnline] =
    useState(false);
  const [isSubmissionOnline, setIsSubmissionOnline] =
    useState(false);
  const [loading, setLoading] = useState(true);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedProblem, setSelectedProblem] =
    useState(null);

  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    teamName: "",
    leaderName: "",
    email: "",
    submissionLink: "",
    description: "",
  });

  // 🔧 Helper → Convert comma string → list
  const renderList = (text) => {
    if (!text) return null;

    const items = text
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    return (
      <Box component="ul" sx={{ pl: 2, mt: 1 }}>
        {items.map((item, index) => (
          <Typography
            component="li"
            key={index}
            color="text.secondary"
            sx={{ mb: 0.5 }}
          >
            {item}
          </Typography>
        ))}
      </Box>
    );
  };

  // 🔴 Problem Status
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "eventMeta", "problemStatus"),
      (snap) => {
        setIsProblemOnline(
          snap.exists() ? snap.data().isOnline : false
        );
      }
    );

    return () => unsub();
  }, []);

  // 🟠 Submission Status
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "eventMeta", "submissionStatus"),
      (snap) => {
        setIsSubmissionOnline(
          snap.exists() ? snap.data().isOnline : false
        );
      }
    );

    return () => unsub();
  }, []);

  // 🟢 Problems
  useEffect(() => {
    if (!isProblemOnline) {
      setProblems([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "problems"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProblems(list);
      setLoading(false);
    });

    return () => unsub();
  }, [isProblemOnline]);

  const handleOpenDrawer = (problem) => {
    setSelectedProblem(problem);
    setOpenDrawer(true);
    setSuccess(false);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setSelectedProblem(null);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!isSubmissionOnline) return;

    await addDoc(collection(db, "submissions"), {
      problemId: selectedProblem.id,
      problemTitle: selectedProblem.title,
      ...form,
      createdAt: serverTimestamp(),
    });

    setSuccess(true);

    setForm({
      teamName: "",
      leaderName: "",
      email: "",
      submissionLink: "",
      description: "",
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isProblemOnline) {
    return (
<Container
  maxWidth="md"
  sx={{
    minHeight: "70vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mt: 10,
  }}
>
  <Box
    sx={{
      textAlign: "center",
      px: 6,
      py: 6,

      borderRadius: 5,

      background:
        "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",

      backdropFilter: "blur(14px)",

      border:
        "0px solid rgba(255,255,255,0.08)",

      boxShadow:
        "none",

      maxWidth: "50vw",
      width: "100%",
    }}
  >
    {/* Lock Icon */}
    <Box
      sx={{
        fontSize: 48,
        mb: 2,
        filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.6))",
      }}
    >
      🔒
    </Box>

    {/* Title */}
    <Typography
      variant="h4"
      fontWeight={900}
      sx={{
        background:
          "linear-gradient(90deg, #ffffff, #ffdd9e)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        letterSpacing: "-0.02em",
      }}
    >
      Problem Statements Locked
    </Typography>

    {/* Status Badge */}
    <Box
      sx={{
        mt: 2,
        display: "inline-block",
        px: 2,
        py: 0.5,
        borderRadius: 2,
        fontSize: 12,
        fontWeight: 600,

        backgroundColor:
          "#f1f1f111",

        color: "#ffffff",

        boxShadow:
          "0 6px 18px rgba(255, 162, 0, 0)",
      }}
    >
      Problem Statements are Not Live Yet
    </Box>

    {/* Description */}
    <Typography
      mt={3}
      color="rgba(255,255,255,0.65)"
      lineHeight={1.7}
    >
      Problem statements will be revealed once the
      hackathon officially begins. Stay tuned and get
      ready to design innovative solutions.
    </Typography>

    {/* Hint Footer */}
    <Typography
      mt={3}
      fontSize={12}
      color="rgba(255,255,255,0.35)"
    >
      You’ll be notified when challenges go live.
    </Typography>
  </Box>
</Container>

    );
  }

  return (
    <>
      {/* Problems List */}
<Container
  maxWidth="lg"
  sx={{
    py: 8,
    position: "relative",
    mt: 8,
  }}
>
  {/* Header */}
  <Box mb={6}>
    <Typography
      variant="h3"
      fontWeight={900}
      sx={{
        background:
          "linear-gradient(90deg, #ffffff, #ffdd9e)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        letterSpacing: "-0.02em",
      }}
    >
      Design Hackathon Problems
    </Typography>

    <Typography
      color="text.secondary"
      mt={1}
      maxWidth={520}
    >
      Explore challenge briefs, uncover twists, and
      craft innovative design solutions.
    </Typography>
  </Box>

  {/* Problems Grid */}
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "1fr 1fr",
        lg: "1fr 1fr",
      },
      gap: 3,
    }}
  >
    {problems.map((problem) => (
      <Card
        key={problem.id}
        onClick={() => handleOpenDrawer(problem)}
        sx={{
          position: "relative",
          cursor: "pointer",

          // Glass surface
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",

          backdropFilter: "blur(12px)",
          boxShadow: "none",

          border:
            "1px solid rgba(255,255,255,0.08)",

          borderRadius: 2,

          p: 0.5,

          transition: "all 0.35s ease",

          // Hover effects
          "&:hover": {
            transform: "translateY(-6px) scale(1.01)",

            boxShadow:
              "0 20px 60px rgba(255, 255, 255, 0.19), 0 0 0 1px rgba(255, 255, 255, 0.08)",

            border:
              "1px solid rgba(180,180,255,0.35)",
          },
        }}
      >
        <CardContent
          sx={{
            p: 3,
          }}
        >
          {/* Title */}
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{
              lineHeight: 1.3,
            }}
          >
            {problem.title}
          </Typography>

          {/* Twist Badge */}
          {problem.twist && (
            <Box
              sx={{
                mt: 1.5,
                display: "inline-block",
                px: 1.5,
                py: 0.7,
                borderRadius: 0.5,
                fontSize: 12,
                fontWeight: 600,

                background:
                  "linear-gradient(90deg, #df9204a3, #dbb2667b)",

                color: "#fff",
                boxShadow:
                  "0 4px 14px rgba(255, 223, 97, 0)",
              }}
            >
              ✦ {problem.twist}
            </Box>
          )}

          <Divider
            sx={{
              my: 2.5,
              borderColor:
                "rgba(255,255,255,0.08)",
            }}
          />

          {/* Statement Preview */}
          <Typography
            sx={{
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.75)",

              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {problem.problemStatement}
          </Typography>

          {/* Footer Hint */}
          <Typography
            mt={3}
            fontSize={12}
            color="rgba(255,255,255,0.4)"
          >
            Click to view full brief →
          </Typography>
        </CardContent>
      </Card>
    ))}
  </Box>
</Container>


      {/* Drawer */}
<Drawer
  anchor="right"
  open={openDrawer}
  onClose={handleCloseDrawer}

  // Backdrop Blur
  BackdropProps={{
    sx: {
      backgroundColor: "rgba(0,0,0,0.45)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
    },
  }}

  PaperProps={{
    sx: {
      width: { xs: "100vw", md: "100vw" },

      background:
        "linear-gradient(180deg,#0f0f0f 0%,#121212 100%)",

      color: "#fff",

      display: "flex",
      flexDirection: "column",

      overflow: "hidden",
    },
  }}
>
  {/* Header */}
  <Box
    sx={{
      position: "sticky",
      top: 0,
      zIndex: 10,

      px: 3,
      py: 2,

      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",

      background:
        "linear-gradient(180deg, rgba(18,18,18,0.95) 0%, rgba(18,18,18,0.7) 100%)",

      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
    }}
  >
    {/* Title Section */}
    <Box>
      <Typography fontWeight={800} fontSize={18}>
        Problem Details
      </Typography>

      <Typography fontSize={12} color="gray">
        View problem brief & submit solution
      </Typography>
    </Box>

    {/* Close Button */}
    <IconButton
      onClick={handleCloseDrawer}
      aria-label="Close drawer"
      sx={{
        color: "#fff",

        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",

        backdropFilter: "blur(10px)",

        transition: "all 0.25s ease",

        "&:hover": {
          background: "rgba(255,255,255,0.12)",
          transform: "scale(1.05)",
          boxShadow:
            "0 0 12px rgba(255,255,255,0.15)",
        },
      }}
    >
      <Box
  component="span"
  sx={{
    fontSize: 20,
    fontWeight: 700,
    lineHeight: 1,
  }}
>
  ✕
</Box>

    </IconButton>
  </Box>

  {/* Split Layout */}
  {selectedProblem && (
    <Box
      sx={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "1fr 1.2fr",
        },
        overflow: "hidden",
      }}
    >

      {/* LEFT — Submission Panel */}
      <Box
        sx={{
          p: 4,
          borderRight:
            "1px solid rgba(255,255,255,0.08)",
          overflowY: "auto",

          background:
            "linear-gradient(180deg,#0c0c0c,#101010)",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          mb={2}
        >
          Submission Form
        </Typography>

        {!isSubmissionOnline && (
          <Alert severity="warning">
            Submissions are closed 🔒
          </Alert>
        )}

        {success && (
          <Alert severity="success">
            Submission Successful 🚀
          </Alert>
        )}

        {isSubmissionOnline && (
          <Stack spacing={2} mt={2}>
            <TextField
              label="Team Name"
              name="teamName"
              value={form.teamName}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Leader Name"
              name="leaderName"
              value={form.leaderName}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Submission Link"
              name="submissionLink"
              value={form.submissionLink}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />

            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
            >
              Submit Solution
            </Button>
          </Stack>
        )}
      </Box>

      {/* RIGHT — Problem Details */}
 <Box
    sx={{
      flex: 1,
      overflowY: "auto",
      px: 3,
      py: 3,

      "&::-webkit-scrollbar": {
        width: 6,
      },
      "&::-webkit-scrollbar-thumb": {
        background: "rgba(255,255,255,0.15)",
        borderRadius: 10,
      },
    }}
  >
        <Typography
          variant="h4"
          fontWeight={800}
        >
          {selectedProblem.title}
        </Typography>

        <Typography
          color="primary"
          mt={1}
        >
          Twist: {selectedProblem.twist}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography lineHeight={1.9}>
          {selectedProblem.problemStatement}
        </Typography>

        {/* Mode Scope */}
        {selectedProblem.modeScope && (
          <Box mt={3}>
            <Typography fontWeight={700}>
              Mode Scope
            </Typography>
            {renderList(
              selectedProblem.modeScope
            )}
          </Box>
        )}

        {/* Key Features */}
        {selectedProblem.keyFeatures && (
          <Box mt={3}>
            <Typography fontWeight={700}>
              Key Features
            </Typography>
            {renderList(
              selectedProblem.keyFeatures
            )}
          </Box>
        )}

        {/* Design Challenges */}
        {selectedProblem.designChallenges && (
          <Box mt={3}>
            <Typography fontWeight={700}>
              Design Challenges
            </Typography>
            {renderList(
              selectedProblem.designChallenges
            )}
          </Box>
        )}

        {/* Data Inputs */}
        {selectedProblem.dataInputs && (
          <Box mt={3}>
            <Typography fontWeight={700}>
              Data Inputs
            </Typography>
            {renderList(
              selectedProblem.dataInputs
            )}
          </Box>
        )}
      </Box>
    </Box>
  )}
</Drawer>

    </>
  );
}
