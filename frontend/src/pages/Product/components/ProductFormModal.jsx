import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Divider,
  IconButton,
  CircularProgress,
  Stack,
} from "@mui/material";
import {
  Close as CloseIcon,
  Inventory as InventoryIcon,
  Info as InfoIcon,
  Description as DescriptionIcon
} from "@mui/icons-material";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { productSchema } from "./helper";
import FormInput from "../../../components/form/FormInput";
import FormSelect from "../../../components/form/FormSelect";
import FormSwitch from "../../../components/form/FormSwitch";
import { toast } from 'react-hot-toast'
import { createProduct, updateProduct } from "../../../api/product.api";

const categories = [
  { label: "Electronics", value: "electronics" },
  { label: "Clothing", value: "clothing" },
  { label: "Food", value: "food" },
  { label: "Book", value: "books" },
  { label: "Accessories", value: "accessories" },
];

const defaultValues = {
  name: "",
  price: "",
  category: "",
  stock: "",
  description: "",
  isActive: true,
};

const ProductFormModal = ({ open, onClose, editData, onSuccess }) => {
  const isEdit = useMemo(() => !!editData?._id, [editData]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty, isValid },
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      reset(editData ? { ...defaultValues, ...editData } : defaultValues);
    }
  }, [editData, open, reset]);

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const onSubmit = async (data) => {
    console.log('test', data);
    const payload = {
      name: data.name,
      price: data.price,
      category: data.category,
      stock: data.stock,
      description: data.description,
      isActive: data.isActive,
    }

    try {
      if (isEdit) {
        const response = await updateProduct(editData?._id, payload);
        toast.success(response.message || "test");
        onSuccess?.()
        console.log(response);
      } else {
        const response = await createProduct(data);
        toast.success(response.message || "test");
        onSuccess?.()
        console.log(response);


      }
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 4,
          backgroundImage: 'none', // Prevents gray tint in dark mode
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight={700}>
          {isEdit ? "Edit Product" : "New Product"}
        </Typography>
        <IconButton onClick={handleClose} size="small" sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderBottom: 'none', px: 4, py: 3 }}>
        <Stack spacing={4}>

          {/* SECTION 1: BASIC INFO */}
          <Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }} mb={2}>
              <InfoIcon fontSize="small" color="primary" />
              <Typography variant="overline" fontWeight={700} letterSpacing={1.2}>
                Basic Information
              </Typography>
            </Stack>

            <Grid container spacing={3}>
              <Grid item size={{ xs: 12 }}>
                <FormInput name="name" label="Product Name" control={control} fullWidth />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <FormInput name="price" label="Price" type="number" control={control} fullWidth />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <FormSelect
                  name="category"
                  label="Category"
                  control={control}
                  options={categories}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>

          {/* SECTION 2: INVENTORY */}
          <Box p={2.5} sx={{ borderRadius: 3 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }} mb={2}>
              <InventoryIcon fontSize="small" color="primary" />
              <Typography variant="overline" fontWeight={700} letterSpacing={1.2}>
                Inventory & Status
              </Typography>
            </Stack>

            <Grid container spacing={3} sx={{ alignItems: 'center' }}>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <FormInput name="stock" label="Stock Quantity" type="number" control={control} fullWidth />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <Box sx={{ ml: 1 }}>
                  <FormSwitch name="isActive" label="Available for sale" control={control} />
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* SECTION 3: DESCRIPTION */}
          <Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }} mb={2}>
              <DescriptionIcon fontSize="small" color="primary" />
              <Typography variant="overline" fontWeight={700} letterSpacing={1.2}>
                Description
              </Typography>
            </Stack>
            <FormInput
              name="description"
              label="Tell us about the product..."
              multiline
              rows={3}
              control={control}
              fullWidth
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={handleClose}
          color="inherit"
          variant="text"
          sx={{ fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting || !isValid || !isDirty}
          elevation={0}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1,
            textTransform: 'none',
            fontWeight: 700,
            boxShadow: 'none',
            '&:hover': { boxShadow: '0px 4px 12px rgba(0,0,0,0.1)' }
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : isEdit ? (
            "Save Changes"
          ) : (
            "Create Product"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductFormModal;