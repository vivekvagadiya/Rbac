import { useState, useEffect } from "react";
import {
  Dialog,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { updateOrderStatus } from "../../../api/orders.api";
import { toast } from "react-hot-toast";

const allowedTransitions = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

const UpdateStatusModal = ({ open, onClose, order, onSuccess }) => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize status
  useEffect(() => {
    if (order && open) {
      setStatus(order.status);
    }
  }, [order, open]);

  // Reset state on close
  useEffect(() => {
    if (!open) {
      setStatus("");
      setLoading(false);
    }
  }, [open]);

  const transitions = allowedTransitions[order?.status] || [];

  const handleUpdate = async () => {
    if (!order) return;

    // No change case
    if (status === order.status) {
      onClose();
      return;
    }

    try {
      setLoading(true);

      const res = await updateOrderStatus(order._id, status);

      toast.success(res?.message || "Order status updated");

      onSuccess?.(); // refresh table
      onClose();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update order status";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundImage: "none",
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Update Order Status
        </Typography>

        {!order ? (
          <Typography sx={{ mt: 2 }} color="text.secondary">
            No order selected
          </Typography>
        ) : (
          <>
            {/* Order Info */}
            <Typography sx={{ mt: 2 }}>
              Order: <strong>{order._id}</strong>
            </Typography>

            <Typography sx={{ mt: 1 }}>
              Current Status:{" "}
              <strong style={{ textTransform: "capitalize" }}>
                {order.status}
              </strong>
            </Typography>

            {/* No transitions */}
            {transitions.length === 0 ? (
              <Typography sx={{ mt: 2 }} color="text.secondary">
                No further status updates allowed.
              </Typography>
            ) : (
              <TextField
                select
                fullWidth
                label="New Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                sx={{ mt: 2 }}
              >
                {transitions.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            )}
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
            onClick={handleUpdate}
            disabled={
              loading ||
              !order ||
              status === order?.status ||
              transitions.length === 0
            }
            startIcon={
              loading ? <CircularProgress size={16} /> : null
            }
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default UpdateStatusModal;