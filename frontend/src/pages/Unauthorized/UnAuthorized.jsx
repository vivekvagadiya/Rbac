import { Box, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "#020617",
        color: "#e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          maxWidth: 500,
        }}
      >
        {/* Title */}
        <Typography
          variant="h2"
          fontWeight="bold"
          color="#38bdf8"
          sx={{ mb: 1 }}
        >
          403
        </Typography>

        {/* Subtitle */}
        <Typography variant="h5" fontWeight="600" sx={{ mb: 2 }}>
          Access Denied
        </Typography>

        {/* Description */}
        <Typography
          variant="body1"
          sx={{ color: "#94a3b8", mb: 4 }}
        >
          You don’t have permission to access this page.
          <br />
          Please contact your administrator if you believe this is a mistake.
        </Typography>

        {/* Actions */}
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{
              borderColor: "#38bdf8",
              color: "#38bdf8",
              "&:hover": {
                borderColor: "#0ea5e9",
                backgroundColor: "rgba(56,189,248,0.1)",
              },
            }}
          >
            Go Back
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              bgcolor: "#38bdf8",
              color: "#020617",
              "&:hover": {
                bgcolor: "#0ea5e9",
              },
            }}
          >
            Go to Dashboard
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Unauthorized;