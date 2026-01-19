import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent
} from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useParams } from "react-router-dom";

export default function TeamPass() {

  const { eventregistrationID } = useParams();
  const [pass, setPass] = useState(null);

  useEffect(() => {

    const load = async () => {

      const snap = await getDoc(
        doc(db, "eventRegistrations", eventregistrationID)
      );

      if (snap.exists()) {
        setPass(snap.data().entryPass);
      }

    };

    load();

  }, []);

  if (!pass) {
    return (
      <Box p={5}>
        <Typography>
          Entry pass not issued yet 🚧
        </Typography>
      </Box>
    );
  }

  return (

    <Box p={5}>

      <Typography fontSize={24} fontWeight={700}>
        🎫 Your Event Pass
      </Typography>

      <Card sx={{ mt: 3 }}>
        <CardContent>

          <Typography>
            Pass ID: <b>{pass.passId}</b>
          </Typography>

          <Box mt={2}>
            <img
              src={pass.qrURL}
              alt="QR Code"
              width="200"
            />
          </Box>

        </CardContent>
      </Card>

    </Box>

  );
}
