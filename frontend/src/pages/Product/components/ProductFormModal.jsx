import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  IconButton,
  CircularProgress,
  Stack,
  styled,
  alpha,
} from "@mui/material";
import {
  Close as CloseIcon,
  Inventory as InventoryIcon,
  Info as InfoIcon,
  Description as DescriptionIcon,
  AddShoppingCartRounded as AddIcon,
  EditNoteRounded as EditIcon
} from "@mui/icons-material";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { productSchema } from "./helper";
import FormInput from "../../../components/form/FormInput";
import FormSelect from "../../../components/form/FormSelect";
import FormSwitch from "../../../components/form/FormSwitch";
import { toast } from 'react-hot-toast';
import { createProduct, updateProduct } from "../../../api/product.api";

// --- Styled Components ---

const SectionHeader = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  spacing: 1,
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& .MuiSvgIcon-root': {
    fontSize: '1.2rem',
    color: theme.palette.primary.main,
  },
  '& .MuiTypography-root': {
    fontSize: '0.7rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: theme.palette.text.secondary,
  }
}));

const HighlightBox = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.03),
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  border: `1px inset ${alpha(theme.palette.primary.main, 0.05)}`,
}));

// --- Constants ---

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
    try {
      const response = isEdit
        ? await updateProduct(editData?._id, data)
        : await createProduct(data);

      toast.success(response.message || `Product ${isEdit ? 'updated' : 'created'} successfully`);
      onSuccess?.();
      handleClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 5, backgroundImage: 'none' },
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Box sx={{
            bgcolor: alpha('#6366f1', 0.1),
            color: '#6366f1',
            p: 1,
            borderRadius: 2,
            display: 'flex'
          }}>
            {isEdit ? <EditIcon /> : <AddIcon />}
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={800}>
              {isEdit ? "Update Product" : "Create Product"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isEdit ? "Modify existing inventory details" : "Add a new item to your store catalogue"}
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={handleClose} size="small" sx={{ bgcolor: 'grey.100' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 4, py: 3, mt: 2 }}>
        <Stack spacing={4}>
          {/* SECTION 1: BASIC INFO */}
          <Box>
            <SectionHeader direction="row" spacing={1}>
              <InfoIcon />
              <Typography>General Information</Typography>
            </SectionHeader>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <FormInput name="name" label="Product Name" control={control} fullWidth />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormInput name="price" label="Price (INR)" type="number" control={control} fullWidth />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormSelect name="category" label="Category" control={control} options={categories} fullWidth />
              </Grid>
            </Grid>
          </Box>

          {/* SECTION 2: INVENTORY (Highlighted) */}
          <HighlightBox>
            <SectionHeader direction="row" spacing={1}>
              <InventoryIcon />
              <Typography>Inventory & Availability</Typography>
            </SectionHeader>
            <Grid container spacing={3} alignItems="center">
              <Grid size={{xs:12,sm:6}}>
                <FormInput name="stock" label="Stock Quantity" type="number" control={control} fullWidth />
              </Grid>
              <Grid size={{xs:12,sm:6}}>
                <Box sx={{
                  bgcolor: 'background.paper',
                  p: 1,
                  borderRadius: 2,
                  border: '1px solid #000',
                  borderColor: 'divider',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <FormSwitch name="isActive" label="Live for Sale" control={control} />
                </Box>
              </Grid>
            </Grid>
          </HighlightBox>

          {/* SECTION 3: DESCRIPTION */}
          <Box>
            <SectionHeader direction="row" spacing={1}>
              <DescriptionIcon />
              <Typography>Product Description</Typography>
            </SectionHeader>
            <FormInput
              name="description"
              label="Detailed description of the product features..."
              multiline
              rows={3}
              control={control}
              fullWidth
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 4, pt: 1 }}>
        <Button
          onClick={handleClose}
          color="inherit"
          sx={{ fontWeight: 700, textTransform: 'none', px: 3 }}
        >
          Discard
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting || !isValid || !isDirty}
          disableElevation
          sx={{
            borderRadius: 3,
            px: 5,
            py: 1.2,
            textTransform: 'none',
            fontWeight: 800,
            fontSize: '0.95rem',
            boxShadow: '0 10px 20px -10px rgba(99, 102, 241, 0.5)',
          }}
        >
          {isSubmitting ? <CircularProgress size={20} color="inherit" /> : isEdit ? "Save Changes" : "Publish Product"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductFormModal;