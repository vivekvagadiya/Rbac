import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  CircularProgress,
  Link,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPassword } from "../../api/authApi";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      const response = await forgotPassword({ email });
      setSubmitted(true);
      toast.success(response.message || "Password reset link sent!");
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        bgcolor: "#000000",
      }}
    >
      <Paper sx={{ width: "100%", maxWidth: 400, p: 4 }}>
        <Typography variant="h5" mb={2} textAlign="center">
          Forgot Password
        </Typography>

        {!submitted ? (
          <>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Enter your email address and we'll send you a link to reset your
              password.
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                type="submit"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Send Reset Link"}
              </Button>
            </form>
          </>
        ) : (
          <Alert severity="success" sx={{ mb: 2 }}>
            Password reset link has been sent to your email address!
          </Alert>
        )}

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate("/login")}
            sx={{ cursor: "pointer" }}
          >
            Back to Login
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
