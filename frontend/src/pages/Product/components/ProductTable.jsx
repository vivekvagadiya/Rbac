import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Chip,
  Paper,
  TablePagination,
  TableContainer,
  Typography,
  Box,
  CircularProgress,
  styled,
  alpha,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import usePermission from "../../../hooks/permission.hook";

// --- Styled Components ---

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "0.85rem",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.grey[50],
}));

const ActionButton = styled(IconButton)(({ theme, color }) => ({
  backgroundColor: alpha(color === "error" ? theme.palette.error.main : theme.palette.primary.main, 0.05),
  marginLeft: theme.spacing(1),
  "&:hover": {
    backgroundColor: alpha(color === "error" ? theme.palette.error.main : theme.palette.primary.main, 0.15),
  },
}));

// --- Main Component ---

const ProductTable = ({
  onEdit,
  onDelete,
  products = [],
  page,
  handleChangePage,
  rowsPerPage,
  handleChangeRowsPerPage,
  total,
  loading = false,
}) => {
  const isEmpty = !loading && products.length === 0;
  const {hasPermission}=usePermission();

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        mt: 2, 
        borderRadius: 3, 
        border: "1px solid", 
        borderColor: "divider",
        overflow: "hidden" 
      }}
    >
      <TableContainer sx={{ minHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell>Product Details</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell>Price</StyledTableCell>
              <StyledTableCell>Inventory</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {/* 🔄 Loading State */}
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                  <CircularProgress size={32} thickness={5} />
                  <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", fontWeight: 500 }}>
                    Fetching inventory...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : isEmpty ? (
              /* ❌ No Data State */
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                  <Inventory2OutlinedIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
                  <Typography variant="subtitle1" fontWeight={700} color="text.secondary">
                    No products found
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    Try adjusting your filters or add a new product.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              /* ✅ Data Rows */
              products.map((row) => (
                <TableRow key={row._id} hover sx={{ transition: "0.2s" }}>
                  <TableCell>
                    <Typography variant="body2" fontWeight={700} color="text.primary">
                      {row.name || "Unnamed Product"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip 
                      label={row.category || "General"} 
                      size="small" 
                      variant="outlined"
                      sx={{ borderRadius: 1.5, fontWeight: 500, bgcolor: "grey.50" }} 
                    />
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" fontWeight={600} color="primary.main">
                      ₹{row.price?.toLocaleString() || 0}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2" fontWeight={700}>
                        {row.stock ?? 0}
                      </Typography>
                      {row.stock < 10 && (
                        <Chip 
                          label="Low Stock" 
                          size="small" 
                          color="warning" 
                          variant="soft" // If using MUI Lab or custom palette, otherwise "filled"
                          sx={{ fontSize: "10px", height: 20 }} 
                        />
                      )}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={row.isActive ? "Active" : "Inactive"}
                      color={row.isActive ? "success" : "default"}
                      size="small"
                      sx={{ 
                        fontWeight: 700, 
                        borderRadius: 1,
                        // bgcolor: row.isActive ? alpha("#2e7d32", 0.1) : alpha("#9e9e9e", 0.1)
                      }}
                    />
                  </TableCell>

                  <TableCell align="right" sx={{display:"flex"}}>
                    <Tooltip title="Edit Product">
                      <ActionButton size="small" onClick={() => onEdit(row)} disabled={!hasPermission("product.update")}>
                        <EditIcon fontSize="inherit" />
                      </ActionButton>
                    </Tooltip>
                    <Tooltip title="Delete Product">
                      <ActionButton size="small" color="error" onClick={() => onDelete(row)} disabled={!hasPermission("product.delete")}>
                        <DeleteIcon fontSize="inherit" />
                      </ActionButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        sx={{ borderTop: "1px solid", borderColor: "divider" }}
      />
    </Paper>
  );
};

export default ProductTable;