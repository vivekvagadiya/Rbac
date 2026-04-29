import {
  Box,
  Typography,
  Stack,
  LinearProgress,
  Paper,
  Chip,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getOrderStatusSummary } from "../../../api/orders.api";

const statusColors = {
  pending: "#ed6c02", // warning
  confirmed: "#0288d1", // info
  shipped: "#9c27b0", // secondary
  delivered: "#2e7d32", // success
  cancelled: "#d32f2f", // error
};

const OrderStatusChart = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    // Handling potential undefined/null data
    getOrderStatusSummary().then((res) => setData(res?.data || {}));
  }, []);

  const total = Object.values(data).reduce((a, b) => a + b, 0);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        mt: 3,
        border: "1px solid",
        borderColor: "divider"
      }}
    >
      {/* Header Section */}
      <Stack direction="row" sx={{justifyContent:"space-between",alignItems:'center'}} mb={3}>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Order Status
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time fulfillment tracking
          </Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="h5" fontWeight={800} color="primary.main">
            {total}
          </Typography>
          <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 700, opacity: 0.6 }}>
            Total Orders
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Stack spacing={3}>
        {Object.entries(data).map(([status, count]) => {
          const percentage = total ? (count / total) * 100 : 0;
          const color = statusColors[status] || "#757575";

          return (
            <Box key={status} sx={{ group: "row" }}>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }} mb={1}>
                <Stack direction="row" spacing={2} sx={{alignItems:"center"}}>
                  {/* Small Dot Indicator */}
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: color }} />
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ textTransform: "capitalize", color: "text.primary" }}
                  >
                    {status}
                  </Typography>
                </Stack>

                <Typography variant="body2" fontWeight={700}>
                  {count} <Box component="span" sx={{ color: "text.secondary", fontWeight: 400, ml: 0.5 }}>
                    ({percentage.toFixed(0)}%)
                  </Box>
                </Typography>
              </Stack>

              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: "grey.100", // Background track color
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 5,
                    backgroundColor: color, // Dynamic status color
                  },
                }}
              />
            </Box>
          );
        })}
      </Stack>

      {/* Empty State */}
      {total === 0 && (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 4, textAlign: "center" }}>
          <Typography color="text.secondary" variant="body2">
            No order data available for this period.
          </Typography>
        </Stack>
      )}
    </Paper>
  );
};

export default OrderStatusChart;