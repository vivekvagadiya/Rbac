import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import usePermission from "../hooks/permission.hook";

const menuItems = [
  {
    label: "Dashboard",
    path: "/",
    module: null,
  },
  // {
  //   label: "Permission",
  //   path: "/permission",
  //   module: "permission",
  // },
  {
    label: "Roles",
    path: "/roles",
    module: "role"
  },
  {
    label: "Users",
    path: "/users",
    module: "user",
  },
  {
    label: "Products",
    path: "/products",
    module: "product",
  },
  {
    label: "Orders",
    path: "/orders",
    module: "order",
  },

];

const Sidebar = ({ drawerWidth, mobileOpen, handleDrawerToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasModuleAccess } = usePermission();

  const filterMenu = menuItems.filter((item) => {
    if (!item.module) return true;
    return hasModuleAccess(item.module)
  })

  const drawerContent = (
    <Box sx={{ height: "100%", bgcolor: "#0f172a", color: "#fff" }}>
      <Box sx={{ p: 2.5, borderBottom: "1px solid #1e293b" }}>
        <Typography variant="h6" fontWeight="bold" color="#38bdf8">
          Admin Panel
        </Typography>
      </Box>

      <List sx={{ px: 1, mt: 1 }}>
        {filterMenu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              onClick={() => {
                navigate(item.path);
                if (mobileOpen) handleDrawerToggle();
              }}
              sx={{
                borderRadius: "8px",
                mb: 1,
                color: isActive ? "#38bdf8" : "#cbd5e1",
                bgcolor: isActive ? "rgba(56, 189, 248, 0.1)" : "transparent",
                "&:hover": { bgcolor: "rgba(255, 255, 255, 0.05)" },
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  sx: {
                    fontWeight: isActive ? 700 : 400,
                  },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box component="nav">
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth, borderRight: "none" },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid #1e293b"
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;