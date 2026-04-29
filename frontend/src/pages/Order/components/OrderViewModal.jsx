import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Divider,
  CircularProgress,
  Grid,
  IconButton,
  alpha,
  styled,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import OrderStatusChip from "./OrderStatusChip";
import { getOrderById } from "../../../api/orders.api";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

// --- Styled Components ---

const InfoLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  fontWeight: 700,
  textTransform: "uppercase",
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));

const SummaryRow = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(1, 0),
}));

const OrderViewModal = ({ open, onClose, orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchOrderDetails = async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const response = await getOrderById(orderId);
      setOrder(response?.data);
    } catch (error) {
      toast.error(error?.message || "Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && orderId) {
      fetchOrderDetails();
    }
  }, [open, orderId]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1} sx={{alignItems:"center"}}>
          <ReceiptLongIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>Order Invoice</Typography>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
            <CircularProgress size={32} />
            <Typography variant="caption" sx={{ mt: 2, color: 'text.secondary' }}>Loading details...</Typography>
          </Box>
        ) : !order ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">No order data available.</Typography>
          </Box>
        ) : (
          <Box>
            {/* Top Meta Info */}
            <Box sx={{ p: 3, bgcolor: alpha('#f4f6f8', 0.5) }}>
              <Grid container spacing={3}>
                <Grid size={{xs:6}}>
                  <InfoLabel>Customer Name</InfoLabel>
                  <Typography variant="body2" fontWeight={600}>
                    {order.user?.name || "Guest Customer"}
                  </Typography>
                </Grid>
                <Grid size={{xs:6}}>
                  <InfoLabel>Order Date</InfoLabel>
                  <Typography variant="body2" fontWeight={600}>
                    {new Date(order.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </Typography>
                </Grid>
                <Grid size={{xs:6}}>
                  <InfoLabel>Order ID</InfoLabel>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>
                    #{order._id?.toUpperCase()}
                  </Typography>
                </Grid>
                <Grid size={{xs:6}}>
                  <InfoLabel>Current Status</InfoLabel>
                  <OrderStatusChip status={order.status} />
                </Grid>
              </Grid>
            </Box>

            {/* Items Table */}
            <Box sx={{ p: 3 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
                Line Items
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Item</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Qty</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Unit Price</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.products?.map((item, index) => (
                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>{item.product?.name || "Unknown Product"}</TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">₹{item.price?.toLocaleString()}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        ₹{(item.quantity * item.price)?.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            <Divider />

            {/* Total Summary */}
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Box sx={{ width: '100%', maxWidth: 200 }}>
                <SummaryRow>
                  <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                  <Typography variant="body2">₹{order.totalAmount?.toLocaleString()}</Typography>
                </SummaryRow>
                <SummaryRow>
                  <Typography variant="body2" color="text.secondary">Tax (0%)</Typography>
                  <Typography variant="body2">₹0</Typography>
                </SummaryRow>
                <Divider sx={{ my: 1 }} />
                <SummaryRow>
                  <Typography fontWeight={800} color="primary.main">Grand Total</Typography>
                  <Typography fontWeight={800} color="primary.main" variant="h6">
                    ₹{order.totalAmount?.toLocaleString()}
                  </Typography>
                </SummaryRow>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button 
          fullWidth 
          variant="outlined" 
          onClick={onClose}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
        >
          Close Invoice
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderViewModal;