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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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

    return (
        <Paper sx={{ mt: 2 }}>
            <TableContainer sx={{ minHeight: 400 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {/* 🔄 Loading */}
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Box py={5}>
                                        <CircularProgress />
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}

                        {/* ❌ No Data */}
                        {isEmpty && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography variant="body2" color="text.secondary">
                                        No products found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}

                        {/* ✅ Data */}
                        {!loading &&
                            products.map((row) => (
                                <TableRow key={row._id} hover>
                                    <TableCell>{row.name || "-"}</TableCell>
                                    <TableCell>{row.category || "-"}</TableCell>
                                    <TableCell>
                                        ₹{row.price?.toLocaleString?.() || 0}
                                    </TableCell>
                                    <TableCell>{row.stock ?? 0}</TableCell>

                                    <TableCell>
                                        <Chip
                                            label={row.isActive ? "Active" : "Inactive"}
                                            color={row.isActive ? "success" : "error"}
                                            size="small"
                                        />
                                    </TableCell>

                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            onClick={() => onEdit(row)}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>

                                        <IconButton size="small" onClick={() => onDelete(row)}>
                                            <DeleteIcon color="error" fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 📄 Pagination */}
            <TablePagination
                component="div"
                count={total || 0}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />
        </Paper>
    );
};

export default ProductTable;