import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ProblemDetail() {
  const { problemId } = useParams();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const ref = doc(db, "problems", problemId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setProblem(snap.data());
        } else {
          console.log("Problem not found");
        }
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    fetchProblem();
  }, [problemId]);

  if (loading)
    return <Typography>Loading...</Typography>;

  if (!problem)
    return (
      <Typography>
        Problem not found or invalid ID
      </Typography>
    );

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h4" fontWeight={800}>
            {problem.title}
          </Typography>

          <Typography mt={2}>
            {problem.problemStatement}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
