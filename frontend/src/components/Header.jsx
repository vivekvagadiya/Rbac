import { Box, Typography, IconButton, Avatar, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getHeaderName } from "../utils/constants";

const Header = ({ handleDrawerToggle }) => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location=useLocation();
  const {pathname}=location;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) { 
      console.log(err); 
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate("/profile");
    handleMenuClose();
  };

 

  return (
    <Box
      sx={{
        height: 64,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 3,
        bgcolor: "#0f172a",
        borderBottom: "1px solid #1e293b",
        position: "sticky",
        top: 0,
        zIndex: 1100,
      }}
    >
      {/* Left Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          color="inherit"
          onClick={handleDrawerToggle}
          sx={{ 
            mr: 1, 
            display: { md: "none" }, 
            color: "#94a3b8",
            "&:hover": { color: "#fff", bgcolor: "#1e293b" }
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography 
          variant="subtitle1" 
          fontWeight="600" 
          letterSpacing="-0.01em"
          sx={{ color: "#f8fafc", display: { xs: 'none', sm: 'block' } }}
        >
          {getHeaderName(pathname)}
        </Typography>
      </Box>

      {/* Right Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* User Info - Desktop only */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'flex-end' }}>
          <Typography variant="body2" fontWeight="500" sx={{ color: "#f1f5f9", lineHeight: 1.4 }}>
            {user?.name || "User Name"}
          </Typography>
          <Typography variant="caption" fontWeight="400" sx={{ color: "#64748b", lineHeight: 1.2 }}>
            {user?.role?.name || "Role"}
          </Typography>
        </Box>

        {/* User Avatar Action Button */}
        <IconButton
          onClick={handleMenuOpen}
          disableRipple
          sx={{
            p: 0,
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "scale(1.04)",
            },
          }}
        >
          <Avatar
            src={user?.profilePicture}
            alt={user?.name}
            sx={{ 
              width: 36, 
              height: 36,
              fontSize: "0.95rem",
              fontWeight: "600",
              bgcolor: "#38bdf8", // Premium fallback sky blue color if no image exists
              color: "#0f172a",
              boxShadow: "0 0 0 2px #0f172a, 0 0 0 4px #1e293b",
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </Avatar>
        </IconButton>

        {/* Upgraded Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          disableScrollLock
          PaperProps={{
            elevation: 0,
            sx: {
              mt: 1.5,
              minWidth: 220,
              overflow: 'visible',
              bgcolor: '#1e293b', // Matches modern slate themes perfectly
              border: '1px solid #334155',
              borderRadius: '12px',
              boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.4), 0px 4px 6px -4px rgba(0,0,0,0.4)',
              '& .MuiMenuItem-root': {
                px: 2,
                py: 1.2,
                mx: 1,
                borderRadius: '8px',
                color: '#94a3b8',
                fontSize: '0.875rem',
                transition: 'all 0.15s ease',
                '&:hover': {
                  bgcolor: '#334155',
                  color: '#fff',
                  '& .MuiListItemIcon-root': {
                    color: '#fff',
                  }
                },
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {/* Menu Header Context (Extremely helpful for Mobile views!) */}
          <Box sx={{ px: 2.5, py: 1.5, display: { xs: 'block', md: 'none' } }}>
            <Typography variant="body2" fontWeight="600" sx={{ color: '#f8fafc' }}>
              {user?.name || "User Name"}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              {user?.role?.name || "Role"}
            </Typography>
            <Divider sx={{ borderColor: '#334155', mt: 1.5 }} />
          </Box>

          <MenuItem onClick={handleProfile} sx={{ mt: { xs: 0, md: 1 } }}>
            <ListItemIcon sx={{ color: '#64748b', minWidth: '32px !important' }}>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontWeight: 500 }}>My Profile</ListItemText>
          </MenuItem>
          
          <Divider sx={{ borderColor: '#334155', my: '6px !important' }} />

          <MenuItem 
            onClick={handleLogout}
            sx={{ 
              mb: 1,
              '&:hover': {
                bgcolor: 'rgba(239, 68, 68, 0.1) !important', // Soft crimson hover accent
                color: '#f87171 !important',
                '& .MuiListItemIcon-root': { color: '#f87171 !important' }
              }
            }}
          >
            <ListItemIcon sx={{ color: '#64748b', minWidth: '32px !important' }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontWeight: 500 }}>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Header;