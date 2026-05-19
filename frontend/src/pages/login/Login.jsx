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
import { Link } from "@mui/material";

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

  // ✅ Redirect AFTER auth state updates
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading]);

  const handleSubmit = async () => {
  setBtnLoading(true);

  try {
    const user = await login(form);
    if (user) {
      // ✅ Navigate immediately on success
      navigate(from, { replace: true });
    }
  } catch (err) {
    // Error is already displayed via toast in AuthContext
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

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleSubmit}
          disabled={btnLoading}
        >
          {btnLoading ? <CircularProgress size={24} /> : "Login"}
        </Button>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate("/forgot-password")}
            sx={{ cursor: "pointer" }}
          >
            Forgot your password?
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;