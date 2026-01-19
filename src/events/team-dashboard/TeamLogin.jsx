import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function TeamLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const q = query(
        collection(db, "eventRegistrations"),
        where("email", "==", email),
        where("loginPassword", "==", password)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError("Invalid credentials");
        setLoading(false);
        return;
      }

      const teamDoc = snapshot.docs[0];

      localStorage.setItem(
        "teamSession",
        JSON.stringify({
          id: teamDoc.id,
          email,
        })
      );

      navigate(`/team-dashboard/${teamDoc.id}`);

    } catch (err) {
      console.error(err);
      setError("Login failed");
    }

    setLoading(false);
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box width={360}>
        <Typography fontSize={24} fontWeight={700} mb={3}>
          Team Login
        </Typography>

        <TextField
          fullWidth
          label="Registered Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <Typography color="error" mt={1}>
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Box>
    </Box>
  );
}
