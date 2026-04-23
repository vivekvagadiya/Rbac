// layouts/MainLayout.jsx

import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ width: 240, bgcolor: "#1e293b", color: "#fff" }}>
        Sidebar
      </Box>

      <Box sx={{ flex: 1 }}>
        <Box sx={{ height: 60, borderBottom: "1px solid #ddd" }}>
          Header
        </Box>

        <Box sx={{ p: 2 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;