import { Box, Button, Typography } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2,
        borderBottom: "1px solid #ddd",
      }}
    >
      <Typography fontWeight="bold">Admin Panel</Typography>

      <Button
        size="small"
        variant="contained"
        color="error"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Header;