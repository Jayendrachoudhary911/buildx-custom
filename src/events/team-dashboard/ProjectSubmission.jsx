import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent
} from "@mui/material";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { useParams } from "react-router-dom";

export default function ProjectSubmission() {

  const { eventregistrationID } = useParams();

  const [allowed, setAllowed] = useState(false);
  const [repoURL, setRepoURL] = useState("");
  const [demoURL, setDemoURL] = useState("");

  useEffect(() => {

    // Admin Toggle Listener
    onSnapshot(doc(db, "eventControls", "main"), (snap) => {
      if (snap.exists()) {
        setAllowed(snap.data().submissionOpen);
      }
    });

  }, []);

  const submit = async () => {

    await updateDoc(
      doc(db, "eventRegistrations", eventregistrationID),
      {
        submission: {
          repoURL,
          demoURL,
          submittedAt: new Date()
        }
      }
    );

    alert("Submission Successful");
  };

  if (!allowed) {
    return (
      <Box p={5}>
        <Typography fontSize={22}>
          🚫 Submissions are currently closed
        </Typography>
      </Box>
    );
  }

  return (

    <Box p={5}>

      <Typography fontSize={24} fontWeight={700}>
        🚀 Project Submission
      </Typography>

      <Card sx={{ mt: 3 }}>
        <CardContent>

          <TextField
            fullWidth
            label="GitHub Repo URL"
            value={repoURL}
            onChange={(e) => setRepoURL(e.target.value)}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Live Demo URL"
            value={demoURL}
            onChange={(e) => setDemoURL(e.target.value)}
            margin="normal"
          />

          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={submit}
          >
            Submit Project
          </Button>

        </CardContent>
      </Card>

    </Box>

  );
}
