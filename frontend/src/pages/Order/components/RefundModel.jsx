import { Dialog, Box, Typography, Button } from "@mui/material";

const RefundModal = ({ open, onClose, order }) => {
  if (!order) return null;

  const handleRefund = () => {
    console.log("Refund order →", order._id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} color="error">
          Confirm Refund
        </Typography>

        <Typography sx={{ mt: 2 }}>
          Are you sure you want to refund this order?
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography><strong>Order:</strong> {order._id}</Typography>
          <Typography><strong>Amount:</strong> ₹{order.totalAmount}</Typography>
        </Box>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
          }}
        >
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleRefund}>
            Confirm Refund
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default RefundModal;