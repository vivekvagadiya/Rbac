import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  CircularProgress,
  Stack,
  alpha,
  styled,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { refundOrder } from "../../../api/orders.api";
import { toast } from "react-hot-toast";

// --- Styled Components ---

const AmountHighlight = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.error.main, 0.05),
  border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
  borderRadius: "12px",
  padding: theme.spacing(2),
  textAlign: "center",
  marginTop: theme.spacing(2),
}));

const RefundModal = ({ open, onClose, order, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) setLoading(false);
  }, [open]);

  const handleRefund = async () => {
    if (!order?._id) return;
    try {
      setLoading(true);
      const res = await refundOrder(order._id);
      toast.success(res?.message || "Refund processed successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Refund failed");
    } finally {
      setLoading(false);
    }
  };

  const isEligible = order?.status === "delivered" && !order?.isRefunded;

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pt: 3 }}>
        <WarningAmberRoundedIcon color="error" />
        <Typography variant="h6" fontWeight={800}>
          Confirm Refund
        </Typography>
      </DialogTitle>

      <DialogContent>
        {!order ? (
          <Typography color="text.secondary">No order data found.</Typography>
        ) : (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              You are about to initiate a refund for the following transaction. This action will credit the amount back to the customer's original payment method.
            </Typography>

            <Stack spacing={1} sx={{ px: 1 }}>
              <Stack direction="row" sx={{justifyContent:"space-between"}}>
                <Typography variant="caption" fontWeight={700} color="text.disabled">ORDER ID</Typography>
                <Typography variant="caption" fontWeight={700} sx={{ fontFamily: 'monospace' }}>
                  #{order._id?.substring(order._id.length - 8).toUpperCase()}
                </Typography>
              </Stack>
              
              <Stack direction="row" sx={{justifyContent:"space-between"}}>
                <Typography variant="caption" fontWeight={700} color="text.disabled">PAYMENT STATUS</Typography>
                <Typography variant="caption" fontWeight={700} color="success.main">PAID</Typography>
              </Stack>
            </Stack>

            <AmountHighlight>
              <Typography variant="caption" fontWeight={800} color="error.main" sx={{ letterSpacing: 1 }}>
                TOTAL REFUND AMOUNT
              </Typography>
              <Typography variant="h4" fontWeight={900} color="error.dark">
                ₹{order.totalAmount?.toLocaleString()}
              </Typography>
            </AmountHighlight>

            {!isEligible && (
              <Box sx={{ mt: 2, p: 1.5, bgcolor: alpha('#ff9800', 0.1), borderRadius: 2, border: '1px solid', borderColor: alpha('#ff9800', 0.2) }}>
                <Typography variant="caption" color="warning.dark" fontWeight={700} sx={{ display: 'block' }}>
                  {order?.isRefunded 
                    ? "• This order has already been refunded." 
                    : "• Refunds can only be processed for 'Delivered' orders."}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={onClose} 
          disabled={loading} 
          variant="text" 
          sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'none' }}
        >
          No, Go Back
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleRefund}
          disabled={loading || !order || !isEligible}
          sx={{
            borderRadius: 2.5,
            px: 3,
            py: 1,
            textTransform: "none",
            fontWeight: 800,
            boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
            '&:hover': {
                boxShadow: '0 6px 16px rgba(211, 47, 47, 0.4)',
            }
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Confirm & Process"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RefundModal;