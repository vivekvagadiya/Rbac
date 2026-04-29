import { Box, Grid, Paper, Typography, Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { getDashboardStats } from "../../../api/dashboard.api";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { toast } from "react-hot-toast";

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      display: "flex",
      alignItems: "center",
      borderRadius: 4,
      border: "1px solid",
      borderColor: "divider",
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0px 10px 20px rgba(0,0,0,0.05)",
      },
    }}
  >
    <Avatar
      sx={{
        bgcolor: `${color}.lighter`,
        color: `${color}.main`,
        width: 56,
        height: 56,
        mr: 2,
      }}
    >
      {icon}
    </Avatar>
    <Box>
      <Typography
        variant="subtitle2"
        sx={{ color: "text.secondary", fontWeight: 600, textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: 1 }}
      >
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </Typography>
    </Box>
  </Paper>
);

const StatCards = () => {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    products: 0,
    revenue: 0,
  });

  const fetchStats = async () => {
    try {
      const response = await getDashboardStats();
      // Fixed the variable name bug here (response vs res)
      setStats(response?.data || {});
    } catch (error) {
      toast.error(error.message || "Failed to fetch stats");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cardConfig = [
    {
      title: "Total Users",
      value: stats.users,
      icon: <PeopleIcon fontSize="medium" />,
      color: "primary", // Uses your theme's primary color
    },
    {
      title: "Total Orders",
      value: stats.orders,
      icon: <ShoppingCartIcon fontSize="medium" />,
      color: "success",
    },
    {
      title: "Inventory",
      value: stats.products,
      icon: <InventoryIcon fontSize="medium" />,
      color: "warning",
    },
    {
      title: "Revenue",
      value: `₹${stats.revenue?.toLocaleString() || 0}`,
      icon: <CurrencyRupeeIcon fontSize="medium" />,
      color: "error",
    },
  ];

  return (
    <Box sx={{ width: "100%", py: 2 }}>
      <Grid container spacing={3}>
        {cardConfig.map((card, index) => (
          <Grid size={{ xs: 12, sm: 4, md: 3 }} key={index}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StatCards;