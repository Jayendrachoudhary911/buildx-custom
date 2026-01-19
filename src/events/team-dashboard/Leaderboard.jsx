import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider
} from "@mui/material";
import { collection, onSnapshot, query, orderBy, doc } from "firebase/firestore";
import { db } from "../../firebase";

export default function Leaderboard() {

  const [teams, setTeams] = useState([]);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {

    // Control Flag
    onSnapshot(doc(db, "eventControls", "main"), (snap) => {
      if (snap.exists()) {
        setEnabled(snap.data().leaderboardVisible);
      }
    });

    // Live Scores
    const q = query(
      collection(db, "eventRegistrations"),
      orderBy("score", "desc")
    );

    onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTeams(data);
    });

  }, []);

  if (!enabled) {
    return (
      <Box p={5}>
        <Typography fontSize={22} fontWeight={700}>
          Leaderboard will be revealed soon 🚀
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={5}>

      <Typography fontSize={28} fontWeight={700}>
        🏆 Live Leaderboard
      </Typography>

      <Divider sx={{ my: 3 }} />

      {teams.map((team, index) => (

        <Card key={team.id} sx={{ mb: 2 }}>
          <CardContent>

            <Box display="flex" justifyContent="space-between">

              <Typography fontWeight={700}>
                #{index + 1} — {team.teamName}
              </Typography>

              <Typography fontWeight={700}>
                {team.score || 0} pts
              </Typography>

            </Box>

            <Typography fontSize={14} color="text.secondary">
              {team.projectTagline}
            </Typography>

          </CardContent>
        </Card>

      ))}

    </Box>
  );
}
