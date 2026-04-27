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
} from "@mui/material";
import OrderStatusChip from "./OrderStatusChip";

const OrderViewModal = ({ open, onClose, order }) => {
  if (!order) return null;
  console.log('order',order);
  

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Order Details
        </Typography>

        {/* Order Info */}
        <Box sx={{ mt: 2 }}>
          <Typography><strong>Order ID:</strong> {order._id}</Typography>
          <Typography><strong>User:</strong> {order.user?.name}</Typography>
          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <strong>Status:</strong> <OrderStatusChip status={order.status} />
          </Typography>
          <Typography><strong>Date:</strong> {order.createdAt}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Products Table */}
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
                <TableCell>{item.product?.name || "Product"}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>₹{item.price}</TableCell>
                <TableCell>₹{item.quantity * item.price}</TableCell>
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

        {/* Actions */}
        <Box sx={{ mt: 2, textAlign: "right" }}>
          <Button onClick={onClose}>Close</Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default OrderViewModal;