import {
    Box,
    CircularProgress,
    IconButton,
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Avatar,
    Typography,
    alpha,
    Stack,
    Tooltip,
} from "@mui/material";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import DeleteIcon from "@mui/icons-material/Delete";
import usePermission from "../../../hooks/permission.hook";

// --- Styled Components ---

const RootContainer = styled(Paper)(({ theme }) => ({
    borderRadius: "16px",
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
}));

const HeaderCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 700,
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.grey[50],
    padding: theme.spacing(2),
}));

const ActionButton = styled(IconButton)(({ theme, color }) => ({
    backgroundColor: alpha(color === "error" ? theme.palette.error.main : theme.palette.primary.main, 0.05),
    margin: theme.spacing(0, 0.5),
    "&:hover": {
        backgroundColor: alpha(color === "error" ? theme.palette.error.main : theme.palette.primary.main, 0.15),
    },
}));

const StatusBadge = styled(Box, {
    shouldForwardProp: (prop) => prop !== "statusType",
})(({ theme, statusType }) => {
    const variants = {
        active: {
            bg: theme.palette.success.main,
            color: theme.palette.success.dark,
        },
        blocked: {
            bg: theme.palette.error.main,
            color: theme.palette.error.dark,
        },
        deleted: {
            bg: theme.palette.grey[500],
            color: theme.palette.grey[800],
        },
    };

    const selected = variants[statusType];

    return {
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 12px",
        borderRadius: "8px",
        fontSize: "0.75rem",
        fontWeight: 700,
        textTransform: "capitalize",
        backgroundColor: alpha(selected.bg, 0.1),
        color: selected.color,
        border: `1px solid ${alpha(selected.bg, 0.2)}`,
    };
});

// --- Main Component ---

const UserTable = ({
    loading,
    users = [],
    page,
    handleChangePage,
    rowsPerPage,
    handleChangeRowsPerPage,
    total,
    handleEdit,
    handleDelete,
}) => {
    const { hasPermission } = usePermission()
    return (
        <Box sx={{ width: "100%" }}>
            <RootContainer elevation={0}>
                <TableContainer>
                    <Table sx={{ minWidth: 700 }}>
                        <TableHead>
                            <TableRow>
                                <HeaderCell>User Info</HeaderCell>
                                <HeaderCell>Role</HeaderCell>
                                <HeaderCell>Status</HeaderCell>
                                <HeaderCell align="center">Actions</HeaderCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                                        <CircularProgress size={32} thickness={5} />
                                    </TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                                        <Typography color="text.secondary" variant="body2">
                                            No users found in the system.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow
                                        key={user._id}
                                        hover={!user.isDeleted}
                                        sx={(theme) => ({
                                            transition: "all 0.2s ease",

                                            ...(user.isBlocked && {
                                                backgroundColor: alpha(theme.palette.error.main, 0.04),

                                                "&:hover": {
                                                    backgroundColor: alpha(theme.palette.error.main, 0.08),
                                                },

                                                borderLeft: `4px solid ${theme.palette.error.main}`,
                                            }),

                                            ...(user.isDeleted && {
                                                backgroundColor: theme.palette.grey[100],
                                                opacity: 0.6,

                                                "& td": {
                                                    color: theme.palette.text.disabled,
                                                },

                                                "&:hover": {
                                                    backgroundColor: theme.palette.grey[100],
                                                },

                                                borderLeft: `4px solid ${theme.palette.grey[500]}`,
                                            }),
                                        })}
                                    >                                        {/* User Info Column (Avatar + Name/Email) */}
                                        <TableCell>
                                            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                                                <Avatar
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        fontSize: "1rem",
                                                        fontWeight: 700,
                                                        bgcolor: alpha("#6366f1", 0.1),
                                                        color: "#6366f1",
                                                    }}
                                                >
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Box>
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={700}
                                                        sx={{
                                                            textDecoration: user.isDeleted ? "line-through" : "none",
                                                        }}
                                                    >
                                                        {user.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{
                                                            textDecoration: user.isDeleted ? "line-through" : "none",
                                                        }}>
                                                        {user.email}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>

                                        {/* Role Column */}
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={500} color="text.primary">
                                                {user.role?.name || "Member"}
                                            </Typography>
                                        </TableCell>

                                        {/* Status Column */}
                                        <TableCell>
                                            <StatusBadge
                                                statusType={
                                                    user.isDeleted
                                                        ? "deleted"
                                                        : user.isBlocked
                                                            ? "blocked"
                                                            : "active"
                                                }
                                            >
                                                {user.isDeleted
                                                    ? "Deleted"
                                                    : user.isBlocked
                                                        ? "Blocked"
                                                        : "Active"}
                                            </StatusBadge>
                                        </TableCell>

                                        {/* Actions Column */}
                                        <TableCell align="center">
                                            <Stack direction="row" sx={{ justifyContent: "center" }}>
                                                <Tooltip title="Edit User">
                                                    <ActionButton size="small" onClick={() => handleEdit(user)} disabled={!hasPermission("user.update") || user.isDeleted}>
                                                        <EditDocumentIcon fontSize="inherit" />
                                                    </ActionButton>
                                                </Tooltip>

                                                <Tooltip title="Delete User">
                                                    <ActionButton size="small" color="error" onClick={() => handleDelete(user)} disabled={!hasPermission("user.delete") || user.isDeleted}>
                                                        <DeleteIcon fontSize="inherit" />
                                                    </ActionButton>
                                                </Tooltip>
                                            </Stack>
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
                    sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}` }}
                />
            </RootContainer>
        </Box>
    );
};

export default UserTable;