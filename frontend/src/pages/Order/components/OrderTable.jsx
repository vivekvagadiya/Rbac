import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  Tooltip,
  TablePagination,
  CircularProgress,
  Box,
  Typography,
  TableContainer,
  alpha,
  styled,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ReplyIcon from "@mui/icons-material/Reply";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

import OrderStatusChip from "./OrderStatusChip";
import usePermission from "../../../hooks/permission.hook";

// --- Styled Components ---

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "1px",
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.grey[50],
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const ActionContainer = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  backgroundColor: alpha(theme.palette.grey[200], 0.4),
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(0.5),
  gap: theme.spacing(0.5),
}));

const OrderTable = ({
  orders = [],
  loading,
  openView,
  openStatus,
  openRefund,
  page,
  handleChangePage,
  rowsPerPage,
  handleChangeRowsPerPage,
  total,
}) => {
  const { hasPermission } = usePermission()
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden"
      }}
    >
      <TableContainer sx={{ minHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <StyledHeaderCell>Order Details</StyledHeaderCell>
              <StyledHeaderCell>Customer</StyledHeaderCell>
              <StyledHeaderCell>Quantity</StyledHeaderCell>
              <StyledHeaderCell>Total Amount</StyledHeaderCell>
              <StyledHeaderCell>Status</StyledHeaderCell>
              <StyledHeaderCell>Purchase Date</StyledHeaderCell>
              <StyledHeaderCell align="center">Operations</StyledHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              /* 🔄 Loading State */
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 12 }}>
                  <CircularProgress size={30} />
                  <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                    Loading transactions...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              /* 📭 Empty State */
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 12 }}>
                  <ShoppingBagOutlinedIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
                  <Typography variant="h6" fontWeight={700} color="text.secondary">
                    No orders found
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    Transactions will appear here once customers start buying.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const isDelivered = order.status === "delivered";
                const isCancelled = order.status === "cancelled";

                return (
                  <TableRow key={order._id} hover transition="0.2s">
                    {/* Order ID with Tooltip for long strings */}
                    <TableCell>
                      <Tooltip title={order._id} arrow>
                        <Typography variant="body2" fontWeight={700} sx={{ cursor: 'help' }}>
                          {order?._id}
                        </Typography>
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {order.user?.name || "Guest User"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.user?.email || ""}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">{order.productsCount} items</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" fontWeight={800} color="primary.main">
                        ₹{order.totalAmount?.toLocaleString()}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <OrderStatusChip status={order.status} />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <ActionContainer>
                        {/* View */}
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => openView(order)}>
                            <VisibilityIcon fontSize="small" color="success" />
                          </IconButton>
                        </Tooltip>

                        {/* Update Status */}
                        <Tooltip title={isDelivered || isCancelled ? "Status Locked" : "Edit Status"}>
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => openStatus(order)}
                              disabled={isDelivered || isCancelled || !hasPermission("order.update")}
                              color="primary"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>

                        {/* Refund */}
                        <Tooltip title={order.isRefunded ? "Already Refunded" : "Process Refund"}>
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => openRefund(order)}
                              disabled={!isDelivered || order.isRefunded ||!hasPermission("order.update")}
                            >
                              <ReplyIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </ActionContainer>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        sx={{ borderTop: "1px solid", borderColor: "divider" }}
      />
    </Paper>
  );
};

export default OrderTable;