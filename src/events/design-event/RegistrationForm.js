import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Dialog,
  Stepper,
  Step,
  StepLabel,
  Tooltip, InputAdornment, Autocomplete
} from "@mui/material";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  runTransaction,
} from "firebase/firestore";
import { db } from "../../firebase";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import imageCompression from "browser-image-compression";
import { Calendar, MapPin, Clock, Globe, Instagram, MessageCircle, ExternalLink, CheckCircle, Info,
  Share2,
  Send } from "lucide-react"

/* ---------------- CONFIG ---------------- */

const DRAFT_KEY = "event_registration_draft";

const WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbwu1bxNreP0q4Hu0PIEncKgBCf6gtHOJLzl6P-60-F2QfR06K2Sa2wo4GsbDu0ZZe4d/exec";

const pricingConfig = {
  2: { price: 300, qr: "/assets/images/QR/qr2.png" },
  3: { price: 450, qr: "/assets/images/QR/qr3.png" },
};

const steps = ["Leader Details", "Team Info", "Payment"];
const totalSteps = 3;

/* ---------------- ANIMATIONS ---------------- */

const stepVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

const shakeAnimation = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.35 },
};

const iconStyle = (borderColor) => ({
  width: 44,
  height: 44,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,255,255,0.15))",
  backdropFilter: "blur(8px)",
  border: `1px solid ${borderColor}`,
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  cursor: "pointer",
  color: "inherit",
  textDecoration: "none",
});


/* ---------------- COMPONENT ---------------- */

export default function RegistrationForm() {
  const formTopRef = useRef(null);
  const stepBoxRef = useRef(null);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [formError, setFormError] = useState("");

  const initialState = {
    name: "",
    email: "",
    phone: "",
    teamName: "",
    teamSize: 2,
    members: [{ name: "", email: "" }],
    screenshot: "",
  };

  const [form, setForm] = useState(initialState);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ---------------- DRAFT RESTORE ---------------- */

  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      const parsed = JSON.parse(savedDraft);
      setForm(parsed.form);
      setStep(parsed.step);
    }
  }, []);

  /* ---------------- DRAFT SAVE ---------------- */

  useEffect(() => {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ form, step })
    );
  }, [form, step]);

  /* ---------------- HELPERS ---------------- */

  const getProgressPercent = () =>
    Math.round((step / totalSteps) * 100);

  const validateStep1 = () => {
    if (!form.name.trim()) return "Leader name is required";
    if (!emailRegex.test(form.email))
      return "Enter valid email address";
    if (form.phone.length < 10)
      return "Enter valid mobile number";
    return null;
  };

  const validateStep2 = () => {
    if (!form.teamName.trim())
      return "Team name is required";

    for (let i = 0; i < form.members.length; i++) {
      if (!form.members[i].name.trim())
        return `Member ${i + 2} name required`;

      if (!emailRegex.test(form.members[i].email))
        return `Member ${i + 2} email invalid`;
    }

    return null;
  };

  const validateStep3 = () => {
    if (!form.screenshot)
      return "Payment screenshot required";
    return null;
  };

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleTeamSize = (size) => {
    setForm({
      ...form,
      teamSize: size,
      members: Array.from({ length: size - 1 }, () => ({
        name: "",
        email: "",
      })),
    });
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...form.members];
    updated[index][field] = value;
    setForm({ ...form, members: updated });
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.25,
        maxWidthOrHeight: 900,
        useWebWorker: true,
      });

      const reader = new FileReader();
      reader.onloadend = () =>
        setForm((prev) => ({
          ...prev,
          screenshot: reader.result,
        }));

      reader.readAsDataURL(compressed);
    } catch {
      alert("Image processing failed");
    }
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    const error = validateStep3();
    if (error) {
      setFormError(error);
      stepBoxRef.current?.animate(shakeAnimation);
      return;
    }

    try {
      setLoading(true);

      const emailQuery = query(
        collection(db, "eventRegistrations"),
        where("email", "==", form.email)
      );

      const snapshot = await getDocs(emailQuery);
      if (!snapshot.empty) {
        setFormError("Email already registered");
        return;
      }

      const metaRef = doc(db, "eventMeta", "designEvent");

      await runTransaction(db, async (transaction) => {
        const metaDoc = await transaction.get(metaRef);

        if (!metaDoc.exists()) {
          transaction.set(metaRef, {
            currentRegistrations: 1,
            maxRegistrations: 100,
          });
          return;
        }

        const data = metaDoc.data();

        if (data.currentRegistrations >= data.maxRegistrations) {
          throw new Error("FULL");
        }

        transaction.update(metaRef, {
          currentRegistrations: data.currentRegistrations + 1,
        });
      });

      await addDoc(collection(db, "eventRegistrations"), {
        ...form,
        paymentStatus: "pending",
        pricePaid: pricingConfig[form.teamSize].price,
        createdAt: serverTimestamp(),
      });

      await fetch(WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          teamName: form.teamName,
          teamSize: form.teamSize,
          price: pricingConfig[form.teamSize].price,
          members: form.members,
        }),
      });

      confetti({ particleCount: 150, spread: 70 });
      setSuccessOpen(true);
      localStorage.removeItem(DRAFT_KEY);

      setTimeout(() => {
        setSuccessOpen(false);
        setForm(initialState);
        setStep(1);
      }, 3500);
    } catch {
      setFormError("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const priceInfo = pricingConfig[form.teamSize];

  /* ---------------- UI ---------------- */

  return (
    <Box
      ref={formTopRef}
      maxWidth={520}
      mx="auto"
      p={3}
      sx={{ mt: 12, mb: 12 }}
    >
<Box
  mb={3}
  p={2.5}
  borderRadius={2}
  sx={{
    background:
      "transparent",
    border: "none",
  }}
>

<Typography
  variant="h4"
  fontWeight="bold"
  textAlign="center"
>
BuildX Design Hackathon
</Typography>

<Typography
  variant="body2"
  color="text.secondary"
  textAlign="center"
  mt={1}
>
A 24-hour creative design challenge where teams solve real-world UI/UX
problems and compete for exciting prizes.
</Typography>

{/* EVENT META INFO */}

<Box
  display="flex"
  flexWrap="wrap"
  justifyContent="center"
  gap={1}
  mt={2}
>

<Box display="flex" alignItems="center" gap={0.7} sx={{ px: 1.5, py: 0.5, borderRadius: 3, backgroundColor: "#f1f1f111" }}>
  <Calendar size={16} />
  <Typography fontSize={13}>
    Feb 18 – Feb 30, 2026
  </Typography>
</Box>

<Box display="flex" alignItems="center" gap={0.7} sx={{ px: 1.5, py: 0.5, borderRadius: 3, backgroundColor: "#f1f1f111" }}>
  <Clock size={16} />
  <Typography fontSize={13}>
    24 Hours
  </Typography>
</Box>

<Box display="flex" alignItems="center" gap={0.7} sx={{ px: 1.5, py: 0.5, borderRadius: 3, backgroundColor: "#f1f1f111" }}>
  <MapPin size={16} />
  <Typography fontSize={13}>
    Online Event
  </Typography>
</Box>

</Box>

{/* QUICK LINKS */}

<Box
  display="flex"
  justifyContent="center"
  gap={1.5}
  mt={2}
  flexWrap="wrap"
>

<Button
  size="small"
  variant="outlined"
  endIcon={<ExternalLink size={14} />}
  href="/rules"
  target="_blank"
  sx={{ color: "#fff", borderColor: "#fff" }}
>
Rules
</Button>

<Button
  size="small"
  variant="outlined"
  endIcon={<ExternalLink size={14} />}
  href="/contact-us"
  target="_blank"
  sx={{ color: "#fff", borderColor: "#fff" }}
>
Support Team
</Button>

<Button
  size="small"
  variant="outlined"
  endIcon={<ExternalLink size={14} />}
  href="/design-event"
  target="_blank"
  sx={{ color: "#fff", borderColor: "#fff" }}
>
Event
</Button>

</Box>



<Stepper
  activeStep={step - 1}
  alternativeLabel
  sx={{
    mb: 2,
    mt: 8,

    px: 2,
    py: 2,
    borderRadius: 3,

    background: "transparent",

    boxShadow: "none",

    "& .MuiStepLabel-label": {
      color: "#b6b6b6",
      fontSize: "0.8rem",
    },

    "& .Mui-active .MuiStepLabel-label": {
      color: "#ffffff",
      fontWeight: 600,
    },

    "& .Mui-completed .MuiStepLabel-label": {
      color: "#22c55e",
    },

    "& .MuiStepIcon-root": {
      color: "#ffffff2a",
    },

    "& .Mui-active .MuiStepIcon-root": {
      color: "#fff",
    },

    "& .Mui-completed .MuiStepIcon-root": {
      color: "#22c55e",
    },

    "& .MuiStepConnector-line": {
      borderColor: "#ffffff2a",
      borderTopWidth: 2,
    },

    "& .Mui-active + .MuiStepConnector-root .MuiStepConnector-line": {
      borderColor: "#ffffff",
    },

    "& .Mui-completed + .MuiStepConnector-root .MuiStepConnector-line": {
      borderColor: "#22c55e",
    },
  }}
>

        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

{/* REGISTRATION NOTE */}

{/* <Box mt={2}>
<Typography
  variant="caption"
  color="error"
  textAlign="center"
  display="block"
>
⚡ Limited seats available — registrations close soon!
</Typography>
</Box> */}

</Box>



      {/* Error Banner */}

      {formError && (
        <Box bgcolor="#fdecea" p={1.5} mb={2} borderRadius={1}>
          <Typography color="error">
            ⚠ {formError}
          </Typography>
        </Box>
      )}

<AnimatePresence mode="wait">
  <motion.div
    key={step}
    ref={stepBoxRef}
    variants={stepVariants}
    initial="initial"
    animate="animate"
    exit="exit"
  >

{/* ================= STEP 1 ================= */}

{step === 1 && (
<>
<Typography variant="subtitle1" fontWeight="bold" mb={2}>
Team Leader Information
</Typography>

{/* Leader Name */}

<TextField
  fullWidth
  label="Leader Full Name"
  name="name"
  placeholder="Enter your full name"
  value={form.name}
  onChange={handleChange}
  helperText="Primary contact person for your team"
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        {form.name && <CheckCircle size={18} color="#2e7d32" />}
        <Tooltip
          title={
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              Team leader will receive official updates
            </motion.span>
          }
        >
          <Info size={16} style={{ marginLeft: 8, cursor: "pointer" }} />
        </Tooltip>
      </InputAdornment>
    ),
  }}
/>

{/* Email With Domain Suggestions */}

<Autocomplete
  freeSolo
  options={[
    "gmail.com",
    "outlook.com",
    "yahoo.com",
    "icloud.com",
  ].map(domain =>
    `${form.email.split("@")[0] || ""}@${domain}`
  )}
  onInputChange={(e, value) =>
    setForm({ ...form, email: value })
  }
  renderInput={(params) => (
    <TextField
      {...params}
      fullWidth
      sx={{ mt: 2 }}
      label="Email Address"
      placeholder="example@gmail.com"
      helperText="Used for confirmation and certificates"
      InputProps={{
        ...params.InputProps,
        endAdornment: (
          <>
            {emailRegex.test(form.email) && (
              <CheckCircle size={18} color="#2e7d32" />
            )}
            <Tooltip
              title={
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Please use a valid email
                </motion.span>
              }
            >
              <Info size={16} style={{ marginLeft: 8 }} />
            </Tooltip>
            {params.InputProps.endAdornment}
          </>
        ),
      }}
    />
  )}
/>

{/* Country Code Selector + Phone Auto Format */}

<Box display="flex" gap={1} mt={2}>
<TextField
  select
  value={form.countryCode || "+91"}
  onChange={(e) =>
    setForm({ ...form, countryCode: e.target.value })
  }
  sx={{ width: 150 }}
>
  <MenuItem value="+91">🇮🇳 +91</MenuItem>
  <MenuItem value="+1">🇺🇸 +1</MenuItem>
  <MenuItem value="+44">🇬🇧 +44</MenuItem>
</TextField>

<TextField
  fullWidth
  label="Mobile Number"
  placeholder="98765 43210"
  value={form.phone}
  onChange={(e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(\d{5})(\d{5})/, "$1 $2");
    setForm({ ...form, phone: value });
  }}
  helperText="WhatsApp number preferred"
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        {form.phone.length >= 10 && (
          <CheckCircle size={18} color="#2e7d32" />
        )}
      </InputAdornment>
    ),
  }}
/>
</Box>

<Button
  fullWidth
  sx={{
  mt: 3,
  px: 1,
  py: 1.5,
  borderRadius: 1,
  backgroundColor: "#fff",
  color: "#000",
  boxShadow: "none",
  transition: "all 0.3s ease-in-out",

  "&:hover": {
    backgroundColor: "#000",
    color: "#fff",
    boxShadow: "none",
  },
}}

  variant="contained"
  onClick={() => {
    const error = validateStep1();
    if (error) {
      setFormError(error);
      stepBoxRef.current?.animate(shakeAnimation);
      return;
    }
    setFormError("");
    setStep(2);
    formTopRef.current.scrollIntoView({ behavior: "smooth" });
  }}
>
Continue to Team Details
</Button>

</>
)}

{/* ================= STEP 2 ================= */}

{step === 2 && (
<>
<Typography variant="subtitle1" fontWeight="bold" mb={1}>
Team Information
</Typography>

<TextField
  fullWidth
  label="Team Name"
  name="teamName"
  placeholder="Creative team name"
  value={form.teamName}
  onChange={handleChange}
  helperText="Displayed on leaderboard & certificates"
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        {form.teamName && (
          <CheckCircle size={18} color="#2e7d32" />
        )}
      </InputAdornment>
    ),
  }}
/>


<TextField
  select
  fullWidth
  sx={{ mt: 2 }}
  label="Team Size"
  value={form.teamSize}
  onChange={(e) =>
    handleTeamSize(Number(e.target.value))
  }
>
  <MenuItem value={2}>2 Members — ₹300</MenuItem>
  <MenuItem value={3}>3 Members — ₹450</MenuItem>
</TextField>

{form.members.map((m, i) => (
<Box
  key={i}
  mt={2}
  p={2}
  backgroundColor="#f1f1f111"
  borderRadius={1.5}
>

<Typography variant="caption" fontWeight="bold">
Team Member {i + 2}
</Typography>

<TextField
  fullWidth
  size="small"
  sx={{ mt: 2 }}
  label="Full Name"
  value={m.name}
  onChange={(e) =>
    handleMemberChange(i, "name", e.target.value)
  }
/>

<TextField
  fullWidth
  size="small"
  sx={{ mt: 2 }}
  label="Email Address"
  value={m.email}
  onChange={(e) =>
    handleMemberChange(i, "email", e.target.value)
  }
/>

</Box>
))}

<Box display="flex" gap={2} mt={3}>
<Button fullWidth variant="outlined" onClick={() => setStep(1)}
  sx={{
  mt: 3,
  px: 1,
  py: 1.5,
  borderRadius: 1,
  border: "1px solid #fff",
  color: "#ffffff",
  boxShadow: "none",
  transition: "all 0.3s ease-in-out",

  "&:hover": {
    backgroundColor: "#ffffff1c",
    color: "#fff",
    boxShadow: "none",
  },
}}
>
Back
</Button>

<Button
  fullWidth
  variant="contained"
  onClick={() => {
    const error = validateStep2();
    if (error) {
      setFormError(error);
      stepBoxRef.current?.animate(shakeAnimation);
      return;
    }
    setFormError("");
    setStep(3);
  }}
sx={{
  mt: 3,
  px: 1,
  py: 1.5,
  borderRadius: 1,
  backgroundColor: "#fff",
  color: "#000",
  boxShadow: "none",
  transition: "all 0.3s ease-in-out",

  "&:hover": {
    backgroundColor: "#000",
    color: "#fff",
    boxShadow: "none",
  },
}}
>
Continue to Payment
</Button>
</Box>

</>
)}

{/* ================= STEP 3 ================= */}

{step === 3 && (
<>
<Typography
  variant="subtitle1"
  fontWeight="bold"
  textAlign="center"
  mb={1}
>
Payment Confirmation
</Typography>

{/* PAYMENT SUMMARY CARD */}

<Box
  mt={2}
  p={2}
  borderRadius={1.5}
  sx={{
    background: "#f1f1f111",
    border: "none",
  }}
>

<Typography
  variant="h6"
  textAlign="center"
  mb={1}
>
Total Amount: ₹{priceInfo.price}
</Typography>

<Box display="flex" justifyContent="space-between" mb={1}>
<Typography fontSize={13} color="#d5d5d5">
Receiver Name
</Typography>
<Typography fontSize={13}>
Mohit Sharma
</Typography>
</Box>

<Box display="flex" justifyContent="space-between" mb={1}>
<Typography fontSize={13} color="#d5d5d5">
UPI ID
</Typography>
<Typography fontSize={13}>
mohitsharmahack810@oksbi
</Typography>
</Box>

<Box display="flex" justifyContent="space-between" mb={1}>
<Typography fontSize={13} color="#d5d5d5">
Payment Note
</Typography>
<Typography fontSize={13}>
BuildX - {form.teamName || "Team"}
</Typography>
</Box>

<Box display="flex" justifyContent="space-between">
<Typography fontSize={13} color="#d5d5d5">
Note
</Typography>
<Typography varient="caption" fontSize={13} textAlign={"right"} width={250}>
Make sure that your Transaction ID will be properly visible for faster verification.
</Typography>
</Box>

</Box>

{/* QR CODE */}

<Box mt={2} display="flex" justifyContent="center">
<img
  src={priceInfo.qr}
  width="270"
  alt="QR"
  style={{
    borderRadius: 10,
  }}
/>
</Box>

<Typography
  mt={2}
  fontSize={13}
  color="#d5d5d5"
  textAlign="center"
>
Scan QR using any UPI app (GPay / PhonePe / Paytm)
</Typography>

{/* SCREENSHOT UPLOAD */}

{!form.screenshot && (
<>
<Typography mt={3} fontWeight={500}>
Upload Payment Screenshot
</Typography>

<Box
  mt={1}
  p={2.5}
  borderRadius={2}
  sx={{
    border: "2px dashed rgba(255,255,255,0.2)",
    background: "rgba(15, 23, 42, 0.55)",
    backdropFilter: "blur(6px)",
    cursor: "pointer",
    textAlign: "center",
    transition: "0.25s ease",

    "&:hover": {
      borderColor: "#3b82f6",
      background: "rgba(15, 23, 42, 0.7)",
    },
  }}

  onClick={() =>
    document.getElementById("payment-upload").click()
  }

  onDragOver={(e) => {
    e.preventDefault();
    e.stopPropagation();
  }}

  onDrop={(e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImage({ target: { files: [file] } });
    }
  }}
>

<Typography fontSize={14} color="#e5e7eb">
Click or Drag & Drop Image Here
</Typography>

<Typography fontSize={11} color="#94a3b8" mt={0.5}>
JPEG · PNG · WEBP Supported
</Typography>

</Box>

<input
  id="payment-upload"
  type="file"
  accept="image/jpeg,image/png,image/webp"
  onChange={handleImage}
  style={{ display: "none" }}
/>
</>
)}

{/* ================= PREVIEW MODE ================= */}

{form.screenshot && (
<Box
  mt={4}
  p={2}
  borderRadius={2}
  sx={{
    background: `url(${form.screenshot})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backdropFilter: "blur(8px)",
    border: "none",
    boxShadow: "none",
    height: 730
  }}
>

{/* SUCCESS BADGE */}
<Box
  mb={1}
  display="inline-block"
  px={1.5}
  borderRadius={1.5}
  sx={{
    background: "#f1f1f111",
    border: "none",
    backdropFilter: "blur(30px) brightness(1.8) saturate(1.2)"
  }}
>
<Typography variant="caption" sx={{ color: "#d5d5d5" }}>
Preview
</Typography>
</Box>

<Box
  mb={1}
  ml={1}
  display="inline-flex"
  alignItems="center"
  px={1.5}
  py={0.4}
  borderRadius={20}
  sx={{
    background: "rgba(34, 197, 94, 0.15)",
    border: "none",
    backdropFilter: "blur(30px) brightness(1.8) saturate(1.2)"
  }}
>
<Typography fontSize={12} sx={{ color: "#22c55e" }}>
✔ Screenshot Uploaded
</Typography>
</Box>


{/* ACTION BUTTONS */}

<Box
  display="inline-flex"
  justifyContent="center"
  gap={1.5}
  ml={1}
>

<Button
  size="small"
  variant="contained"
  onClick={() =>
    document.getElementById("payment-upload-replace").click()
  }
  sx={{ backgroundColor: "#fff", boxShadow: "none" }}
>
Replace
</Button>

<Button
  size="small"
  color="error"
  variant="contained"
  onClick={() =>
    setForm({ ...form, screenshot: "" })
  }
  sx={{ backgroundColor: "#d10909", boxShadow: "none" }}
>
Remove
</Button>

</Box>

<input
  id="payment-upload-replace"
  type="file"
  accept="image/jpeg,image/png,image/webp"
  onChange={handleImage}
  style={{ display: "none" }}
/>

</Box>
)}


{/* ACTION BUTTONS */}

<Box display="flex" gap={2} mt={3}>
<Button
  fullWidth
  variant="outlined"
  onClick={() => setStep(2)}
    sx={{
  mt: 3,
  px: 1,
  py: 1.5,
  borderRadius: 1,
  border: "1px solid #fff",
  color: "#ffffff",
  boxShadow: "none",
  transition: "all 0.3s ease-in-out",

  "&:hover": {
    backgroundColor: "#ffffff1c",
    color: "#fff",
    boxShadow: "none",
  },
}}
>
Back
</Button>

<Button
  fullWidth
  disabled={loading}
  variant="contained"
  color="success"
  onClick={handleSubmit}
  sx={{
  mt: 3,
  px: 1,
  py: 1.5,
  borderRadius: 1,
  backgroundColor: "#fff",
  color: "#000",
  boxShadow: "none",
  transition: "all 0.3s ease-in-out",

  "&:hover": {
    backgroundColor: "#000",
    color: "#fff",
    boxShadow: "none",
  },
}}
>
{loading ? "Submitting..." : "Confirm Registration"}
</Button>
</Box>

</>
)}


</motion.div>
</AnimatePresence>

      {/* Success Modal */}

      <Dialog open={successOpen} maxWidth="xs" fullWidth sx={{ backdropFilter: "blur(10px) brightness(1.8) saturate(1)" }} >
        <Box p={4} textAlign="center">
          <Typography variant="h5">🎉 Success!</Typography>
          <Typography mt={2}>
            Registration submitted successfully.
          </Typography>
        </Box>
      </Dialog>
    </Box>
  );
}
