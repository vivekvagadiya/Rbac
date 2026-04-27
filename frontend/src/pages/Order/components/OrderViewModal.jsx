import {
  Dialog,
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
} from "@mui/material";
import OrderStatusChip from "./OrderStatusChip";
import { getOrderById } from "../../../api/orders.api";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const OrderViewModal = ({ open, onClose, orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchOrderDetails = async () => {
    if (!orderId) return; // ✅ safe check INSIDE function

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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Order Details
        </Typography>

        {/* 🔄 Loading */}
        {loading ? (
          <Box sx={{ textAlign: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : !order ? (
          <Typography sx={{ mt: 2 }} color="text.secondary">
            No data found
          </Typography>
        ) : (
          <>
            {/* Order Info */}
            <Box sx={{ mt: 2 }}>
              <Typography>
                <strong>Order ID:</strong> {order._id}
              </Typography>
              <Typography>
                <strong>User:</strong> {order.user?.name}
              </Typography>
              <Typography sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <strong>Status:</strong>
                <OrderStatusChip status={order.status} />
              </Typography>
              <Typography>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Products */}
            <Typography fontWeight={600} sx={{ mb: 1 }}>
              Products
            </Typography>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Subtotal</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {order.products?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.product?.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>₹{item.price}</TableCell>
                    <TableCell>
                      ₹{item.quantity * item.price}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Divider sx={{ my: 2 }} />

            {/* Summary */}
            <Box sx={{ textAlign: "right" }}>
              <Typography fontWeight={600}>
                Total: ₹{order.totalAmount}
              </Typography>
            </Box>
          </>
        )}

        {/* Actions */}
        <Box sx={{ mt: 2, textAlign: "right" }}>
          <Button onClick={onClose}>Close</Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default OrderViewModal;