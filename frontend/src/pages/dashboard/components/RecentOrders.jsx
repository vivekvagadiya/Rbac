import { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Typography,
  Box,
  TableContainer,
  styled,
  alpha,
} from "@mui/material";
import { getOrders } from "../../../api/orders.api";
import toast from "react-hot-toast";

// --- Styled Components ---

const DashboardPaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "none",
  overflow: "hidden",
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.grey[100], 0.6),
  color: theme.palette.text.secondary,
  fontSize: "0.75rem",
  fontWeight: 700,
  textTransform: "uppercase",
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const OrderID = styled(Typography)(({ theme }) => ({
  fontFamily: "'JetBrains Mono', 'Roboto Mono', monospace",
  fontSize: "0.85rem",
  fontWeight: 600,
  color: theme.palette.primary.dark,
}));

const StatusChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "statusType",
})(({ theme, statusType }) => {
  const colors = {
    pending: theme.palette.warning,
    confirmed: theme.palette.info,
    shipped: theme.palette.secondary,
    delivered: theme.palette.success,
    cancelled: theme.palette.error,
  };

  const statusColor = colors[statusType] || theme.palette.grey;

  return {
    height: 24,
    fontSize: "0.7rem",
    fontWeight: 700,
    borderRadius: theme.spacing(0.5),
    backgroundColor: alpha(statusColor.main, 0.1),
    color: statusColor.dark,
    border: `1px solid ${alpha(statusColor.main, 0.2)}`,
    textTransform: "uppercase",
  };
});

// --- Main Component ---

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await getOrders({ page: 1, limit: 5 });
      setOrders(response?.data || []);
    } catch (error) {
      toast.error(error?.message || "Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <DashboardPaper>
      <Box sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "1.1rem" }}>
          Recent Orders
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <StyledHeaderCell>ID</StyledHeaderCell>
              <StyledHeaderCell>Status</StyledHeaderCell>
              <StyledHeaderCell align="right">Amount</StyledHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order._id} hover>
                  <TableCell>
                    <OrderID>#{order._id.slice(-6).toUpperCase()}</OrderID>
                  </TableCell>
                  <TableCell>
                    <StatusChip
                      label={order.status}
                      statusType={order.status}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
                      ₹{order.totalAmount?.toLocaleString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">No orders found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardPaper>
  );
};

export default RecentOrders;