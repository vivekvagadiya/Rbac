// src/components/Sidebar.jsx

import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", path: "/" },
  { label: "Users", path: "/users" },
  { label: "Products", path: "/products" },
  { label: "Orders", path: "/orders" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        bgcolor: "#0f172a",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo / Title */}
      <Box sx={{ p: 2, borderBottom: "1px solid #1e293b" }}>
        <Typography variant="h6" fontWeight="bold">
          Admin Panel
        </Typography>
      </Box>

      {/* Menu */}
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                color: isActive ? "#38bdf8" : "#cbd5f5",
                bgcolor: isActive ? "#1e293b" : "transparent",
                "&:hover": {
                  bgcolor: "#1e293b",
                },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;