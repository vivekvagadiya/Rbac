import { useState, useEffect } from "react";
import { Dialog, Box, Typography, Button, CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import { refundOrder } from "../../../api/orders.api";

const RefundModal = ({ open, onClose, order, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setLoading(false);
    }
  }, [open]);

  const handleRefund = async () => {
    if (!order?._id) return;

    try {
      setLoading(true);

      const res = await refundOrder(order._id);

      toast.success(res?.message || "Order refunded successfully");

      onSuccess?.(); // 🔥 refresh order list
      onClose();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Refund failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    loading ||
    !order ||
    order?.isRefunded ||
    order?.status !== "delivered";

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose} // 🔒 prevent close during request
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundImage: "none",
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} color="error">
          Confirm Refund
        </Typography>

        {!order ? (
          <Typography sx={{ mt: 2 }} color="text.secondary">
            No order selected
          </Typography>
        ) : (
          <>
            <Typography sx={{ mt: 2 }}>
              Are you sure you want to refund this order?
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Typography>
                <strong>Order:</strong> {order._id}
              </Typography>
              <Typography>
                <strong>Amount:</strong> ₹{order.totalAmount}
              </Typography>
              <Typography>
                <strong>Status:</strong>{" "}
                <span style={{ textTransform: "capitalize" }}>
                  {order.status}
                </span>
              </Typography>
              {order.isRefunded && (
                <Typography color="error" sx={{ mt: 1 }}>
                  Already refunded
                </Typography>
              )}
            </Box>
          </>
        )}

        {/* Actions */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
          }}
        >
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleRefund}
            disabled={isDisabled}
            startIcon={
              loading ? <CircularProgress size={16} /> : null
            }
          >
            {loading ? "Processing..." : "Confirm Refund"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default RefundModal;