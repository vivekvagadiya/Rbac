import { useState, useContext, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const { login, isAuthenticated, loading } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Redirect AFTER auth state updates
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading]);

  const handleSubmit = async () => {
  setBtnLoading(true);
  setError("");

  try {
    const user = await login(form);
    if (user) {
      // ✅ Navigate immediately on success
      navigate(from, { replace: true });
    }
  } catch (err) {
    setError(err?.message || "Login failed");
  } finally {
    setBtnLoading(false);
  }
};

  // ⏳ prevent flicker during init
  if (loading) return null;

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
          Login
        </Typography>

        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          margin="normal"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {error && (
          <Typography color="error" mt={1}>
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleSubmit}
          disabled={btnLoading}
        >
          {btnLoading ? <CircularProgress size={24} /> : "Login"}
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;