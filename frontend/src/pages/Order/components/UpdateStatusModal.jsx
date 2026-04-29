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
  Chip,
  Stack,
  alpha,
  styled,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { updateOrderStatus } from "../../../api/orders.api";
import { toast } from "react-hot-toast";

// --- Styled Components ---

const StatusCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== "active" && prop !== "statusColor",
})(({ theme, active, statusColor }) => ({
  padding: theme.spacing(2),
  borderRadius: "12px",
  border: "2px solid",
  borderColor: active ? theme.palette[statusColor].main : theme.palette.divider,
  backgroundColor: active ? alpha(theme.palette[statusColor].main, 0.05) : "transparent",
  cursor: "pointer",
  transition: "all 0.2s ease",
  flex: 1,
  minWidth: "120px",
  textAlign: "center",
  "&:hover": {
    borderColor: active ? theme.palette[statusColor].main : theme.palette.grey[400],
    transform: "translateY(-2px)",
  },
}));

const allowedTransitions = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

const statusColors = {
  pending: "grey",
  confirmed: "info",
  shipped: "warning",
  delivered: "success",
  cancelled: "error",
};

const UpdateStatusModal = ({ open, onClose, order, onSuccess }) => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order && open) setStatus(order.status);
  }, [order, open]);

  const transitions = allowedTransitions[order?.status] || [];

  const handleUpdate = async () => {
    if (!order || status === order.status) return;

    try {
      setLoading(true);
      const res = await updateOrderStatus(order._id, status);
      toast.success(res?.message || "Order updated successfully");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
    >
      <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Update Order Status</DialogTitle>
      
      <DialogContent>
        {!order ? (
          <Typography color="text.secondary">No order selected.</Typography>
        ) : (
          <Box sx={{ mt: 1 }}>
            <Stack 
              direction="row" 
              spacing={2} 
              sx={{ 
                p: 1, 
                bgcolor: 'grey.50', 
                borderRadius: 3, 
                mb: 3,
                border: '1px dashed',
                borderColor: 'grey.300',
                justifyContent:'center',
                alignItems:'center'
              }}
            >
              <Box textAlign="center" >
                <Typography variant="caption" fontWeight={700} color="text.secondary" display="block">CURRENT</Typography>
                <Chip label={order.status.toUpperCase()} size="small" color={statusColors[order.status]} sx={{ fontWeight: 700 }} />
              </Box>
              
              <ArrowForwardRoundedIcon sx={{ color: 'text.disabled' }} />

              <Box textAlign="center" >
                <Typography variant="caption" fontWeight={700} color="primary" display="block">PROPOSED</Typography>
                <Chip 
                  label={status.toUpperCase()} 
                  size="small" 
                  variant={status === order.status ? "outlined" : "filled"}
                  color={statusColors[status]} 
                  sx={{ fontWeight: 700 }} 
                />
              </Box>
            </Stack>

            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, px: 0.5 }}>
              Select Next Phase:
            </Typography>

            {transitions.length === 0 ? (
              <Stack direction="row" spacing={1} sx={{ alignItems:'center',color: 'error.main', p: 2, bgcolor: alpha('#ef5350', 0.05), borderRadius: 2 }}>
                <ErrorOutlineRoundedIcon fontSize="small" />
                <Typography variant="body2" fontWeight={600}>
                  This order is in a final state and cannot be changed.
                </Typography>
              </Stack>
            ) : (
              <Stack direction="row" spacing={2}>
                {transitions.map((s) => (
                  <StatusCard 
                    key={s} 
                    active={status === s} 
                    statusColor={statusColors[s]} 
                    onClick={() => setStatus(s)}
                  >
                    <Typography 
                      variant="body2" 
                      fontWeight={700} 
                      sx={{ textTransform: 'capitalize', color: status === s ? `${statusColors[s]}.main` : 'text.primary' }}
                    >
                      {s}
                    </Typography>
                  </StatusCard>
                ))}
              </Stack>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'none' }}
        >
          Keep Current
        </Button>
        <Button
          variant="contained"
          onClick={handleUpdate}
          disabled={loading || !order || status === order.status || transitions.length === 0}
          sx={{
            borderRadius: 2.5,
            px: 4,
            textTransform: "none",
            fontWeight: 800,
            boxShadow: status !== order?.status ? "0 4px 12px rgba(99, 102, 241, 0.4)" : "none"
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Confirm Change"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateStatusModal;