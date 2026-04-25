import { Stack, TextField, MenuItem } from "@mui/material";

const ProductFilters = () => {
  return (
    <Stack direction="row" spacing={2} mt={2}>
      <TextField label="Search" size="small" />

      <TextField select label="Category" size="small" sx={{ minWidth: 150 }}>
        <MenuItem value="">All</MenuItem>
        <MenuItem value="Electronics">Electronics</MenuItem>
        <MenuItem value="Clothing">Clothing</MenuItem>
      </TextField>

      <TextField select label="Status" size="small" sx={{ minWidth: 150 }}>
        <MenuItem value="">All</MenuItem>
        <MenuItem value="active">Active</MenuItem>
        <MenuItem value="inactive">Inactive</MenuItem>
      </TextField>
    </Stack>
  );
};

export default ProductFilters;