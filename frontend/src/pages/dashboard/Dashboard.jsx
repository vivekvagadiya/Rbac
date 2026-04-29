import { Box, Grid, Typography } from "@mui/material";
import OrderStatusChart from "./components/OrderStatusChart";
import ActivityLogs from "./components/ActivityLogs";
import StatCards from "./components/StatusCards";
import RecentOrders from "./components/RecentOrders";

const Dashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Dashboard
      </Typography>

      {/* Cards */}
      <StatCards />

      {/* Charts */}
      <OrderStatusChart />

      {/* Bottom Section */}
      <Grid container spacing={2} sx={{mt:1}}>
        <Grid size={{xs:12,sm:8}}>
          <RecentOrders />
        </Grid>
        <Grid size={{xs:12,sm:4}}>
          {/* <ActivityLogs /> */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;