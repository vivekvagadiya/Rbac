import { useState, useCallback } from "react";
import { Box, Button, Dialog, Typography, CircularProgress } from "@mui/material";
import { deleteProduct } from "../../../api/product.api";
import { toast } from "react-hot-toast";

const ProductDeleteModal = ({
  open,
  onClose,
  product,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

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
      onSuccess?.(); // optional chaining (safe execution)
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete product";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [product, onClose, onSuccess]);

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose} // prevent close while deleting
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
          Delete Product
        </Typography>

        <Typography sx={{ mt: 2 }}>
          Are you sure you want to delete{" "}
          <strong>{product?.name || "this product"}</strong>?
        </Typography>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
          }}
        >
          <Button
            onClick={onClose}
            disabled={loading}
            variant="outlined"
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={16} /> : null
            }
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ProductDeleteModal;