import { useState, useCallback } from "react";
import {
  Box,
  Button,
  Dialog,
  Typography,
  CircularProgress,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { 
  Close as CloseIcon, 
  DeleteForever as DeleteIcon, 
  WarningAmberRounded as WarningIcon 
} from "@mui/icons-material";
import { deleteProduct } from "../../../api/product.api";
import { toast } from "react-hot-toast";

const ProductDeleteModal = ({ open, onClose, product, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  
  // Checks if the screen is mobile-sized (sm = 600px)
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDelete = useCallback(async () => {
    if (!product?._id) {
      toast.error("Invalid product data");
      return;
    }

    try {
      setLoading(true);
      const res = await deleteProduct(product._id);
      toast.success(res?.message || "Product deleted successfully");
      onClose();
      onSuccess?.();
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to delete product";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [product, onClose, onSuccess]);

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="xs" // Smaller width for better desktop appearance
      // fullScreen={isMobile} // Full screen on mobile for a "Native App" feel
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 4,
          padding: 1,
          backgroundImage: "none",
        },
      }}
    >
      {/* Header with Close Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton onClick={onClose} disabled={loading} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ px: 4, pb: 4, textAlign: "center" }}>
        {/* Warning Icon Graphic */}
        <Box
          sx={{
            display: "inline-flex",
            // p: 1,
            borderRadius: "50%",
            bgcolor: "error.lighter", // Ensure your palette has 'lighter' or use 'rgba(211, 47, 47, 0.1)'
            color: "error.main",
            mb: 2,
          }}
        >
          <WarningIcon sx={{ fontSize: 40 }} />
        </Box>

        <Typography variant="h5" fontWeight={700} gutterBottom>
          Delete Product?
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          You are about to delete <strong>{product?.name || "this item"}</strong>. 
          This action is permanent and cannot be undone.
        </Typography>

        {/* Responsive Button Stack */}
        <Stack 
          direction={isMobile ? "column-reverse" : "row"} 
          spacing={2} 
          sx={{justifyContent:"center"}}
        >
          <Button
            fullWidth
            onClick={onClose}
            disabled={loading}
            variant="text"
            sx={{ color: "text.secondary", fontWeight: 600 }}
          >
            Cancel, keep it
          </Button>

          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={loading}
            disableElevation
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <DeleteIcon />}
            sx={{ 
              py: isMobile ? 1.5 : 1, 
              fontWeight: 700,
              borderRadius: 2 
            }}
          >
            {loading ? "Deleting..." : "Confirm Delete"}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default ProductDeleteModal;