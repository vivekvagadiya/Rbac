import { Box, CircularProgress, IconButton, Paper, styled, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material"
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import DeleteIcon from "@mui/icons-material/Delete";

const StyledTableContainer = styled(TableContainer)({
    borderRadius: "12px",
    width: "100%",
    overflowX: "auto", // ✅ horizontal scroll
});

const StyledTableHead = styled(TableHead)({
    backgroundColor: "#f8fafc",
});

const StyledTableCellHead = styled(TableCell)({
    fontWeight: 600,
    fontSize: "14px",
    color: "#475569",
});

const StyledTableRow = styled(TableRow)({
    "&:hover": {
        backgroundColor: "#f1f5f9",
    },
});

const StatusText = styled("span")(({ status }) => ({
    color: status === "active" ? "#16a34a" : "#dc2626",
    fontWeight: 500,
}));


const UserTable = ({
    loading,
    users,
    page,
    handleChangePage,
    rowsPerPage,
    handleChangeRowsPerPage,
    total, }) => {
    return (<>
        <Box sx={{ width: "100%", overflowX: "auto" }}>
            <StyledTableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <StyledTableHead>
                        <TableRow>
                            <StyledTableCellHead>Name</StyledTableCellHead>
                            <StyledTableCellHead>Email</StyledTableCellHead>
                            <StyledTableCellHead>Role</StyledTableCellHead>
                            <StyledTableCellHead>Status</StyledTableCellHead>
                            <StyledTableCellHead align="center">
                                Actions
                            </StyledTableCellHead>
                        </TableRow>
                    </StyledTableHead>

                    <TableBody>
                        {/* Loading */}
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <CircularProgress size={24} />
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            // Empty State
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No users found
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((item) => (
                                <StyledTableRow key={item._id}>
                                    <TableCell>{item?.name}</TableCell>
                                    <TableCell>{item?.email}</TableCell>
                                    <TableCell>{item?.role?.name || "-"}</TableCell>

                                    <TableCell>
                                        <StatusText status={item?.isBlocked ? "blocked" : "active"}>
                                            {item?.isBlocked ? "Blocked" : "Active"}
                                        </StatusText>
                                    </TableCell>

                                    <TableCell align="center">
                                        <IconButton size="small" onClick={() => handleEdit(item)}>
                                            <EditDocumentIcon fontSize="small" />
                                        </IconButton>

                                        <IconButton size="small" color="error">
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </StyledTableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </StyledTableContainer>
            <TablePagination
                component="div"
                count={total || 0}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />
        </Box>
    </>)
}
export default UserTable