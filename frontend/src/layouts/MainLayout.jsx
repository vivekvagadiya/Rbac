// layouts/MainLayout.jsx

import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  return (
    <Box sx={{ display: "flex",backgroundColor:"#000000",height:"100vh" }}>
      <Box sx={{ width: 240, bgcolor: "#1e293b", color: "#fff" }}>
        <Sidebar/>
      </Box>

      <Box sx={{ flex: 1 }}>
        <Box sx={{ height: 60, borderBottom: "1px solid #ddd" }}>
          <Header/>
        </Box>

        <Box sx={{ p: 0,backgroundColor:"#000000" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;