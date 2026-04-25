import { Box, Button, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = ({ handleDrawerToggle }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) { console.log(err); }
  };

  return (
    <Box
      sx={{
        height: 64,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 2,
        bgcolor: "#0f172a",
        borderBottom: "1px solid #1e293b",
        position: "sticky",
        top: 0,
        zIndex: 1100,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* Toggle only shows on mobile */}
        <IconButton
          color="inherit"
          onClick={handleDrawerToggle}
          sx={{ mr: 1, display: { md: "none" }, color: "#fff" }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" fontWeight="500" sx={{ color: "#fff", display: { xs: 'none', sm: 'block' } }}>
          Dashboard
        </Typography>
      </Box>

      <Button
        size="small"
        variant="outlined"
        color="error"
        onClick={handleLogout}
        sx={{ borderRadius: "6px", textTransform: "none" }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Header;