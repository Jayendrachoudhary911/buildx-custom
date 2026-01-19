import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent
} from "@mui/material";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useParams } from "react-router-dom";

export default function TeamSettings() {

  const { eventregistrationID } = useParams();

  const [tagline, setTagline] = useState("");
  const [logoURL, setLogoURL] = useState("");

  useEffect(() => {

    const load = async () => {
      const snap = await getDoc(
        doc(db, "eventRegistrations", eventregistrationID)
      );

      if (snap.exists()) {
        setTagline(snap.data().projectTagline || "");
        setLogoURL(snap.data().teamLogoURL || "");
      }
    };

    load();

  }, []);

  const save = async () => {

    await updateDoc(
      doc(db, "eventRegistrations", eventregistrationID),
      {
        projectTagline: tagline,
        teamLogoURL: logoURL
      }
    );

    alert("Settings Saved");
  };

  return (

    <Box p={5}>

      <Typography fontSize={24} fontWeight={700}>
        ⚙ Team Settings
      </Typography>

      <Card sx={{ mt: 3 }}>
        <CardContent>

          <TextField
            fullWidth
            label="Team Logo URL"
            value={logoURL}
            onChange={(e) => setLogoURL(e.target.value)}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Project Tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            margin="normal"
          />

          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={save}
          >
            Save Changes
          </Button>

        </CardContent>
      </Card>

    </Box>

  );
}
