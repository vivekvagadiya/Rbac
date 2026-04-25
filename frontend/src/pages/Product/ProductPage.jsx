import { Box, Typography, Button, Stack } from "@mui/material";
import { useState } from "react";
import ProductFilters from "./components/ProductFIlters";
import ProductTable from "./components/ProductTable";
import ProductFormModal from "./components/ProductFormModal";

const ProductPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleAdd = () => {
    setEditData(null);
    setOpenModal(true);
  };

  const handleEdit = (row) => {
    setEditData(row);
    setOpenModal(true);
  };

  return (
    <Box sx={{p:3}}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        sx={{mb:2,justifyContent:"space-between"}}
      >
        <Typography variant="h5">Products</Typography>

        <Button variant="contained" onClick={handleAdd}>
          Add Product
        </Button>
      </Stack>

      {/* Filters */}
      <ProductFilters />

      {/* Table */}
      <ProductTable onEdit={handleEdit} />

      {/* Modal */}
      <ProductFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        editData={editData}
      />
    </Box>
  );
};

export default ProductPage;