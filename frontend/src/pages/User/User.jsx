import {
    Box,
    Typography,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { getAllUsers } from "../../api/user.api";
import DeleteIcon from "@mui/icons-material/Delete";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import UserFormModal from "./components/UserFormModal";


const PageContainer = styled(Box)(({ theme }) => ({
    padding: "6px",

    [theme.breakpoints.down("sm")]: {
        padding: "4px",
    },
}));

const Header = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",

    [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "10px",
    },
}));

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

// ================== Component ==================

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [submitLoading, setSubmitLoading] = useState(false);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);

            const res = await getAllUsers();
            setUsers(res?.users || res || []);
        } catch (err) {
            const message =
                err?.response?.data?.message || err?.message || "Failed to fetch users";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);


    const handleCreate = () => {
        setSelectedUser(null);
        setOpenModal(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setOpenModal(true);
    };

    const handleSubmit = async (payload) => {
        try {
            setSubmitLoading(true);

            if (selectedUser) {
                // update API
                // await updateUser(selectedUser._id, payload);
                toast.success("User updated");
            } else {
                // create API
                // await createUser(payload);
                toast.success("User created");
            }

            setOpenModal(false);
            fetchUsers();
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setSubmitLoading(false);
        }
    };


    return (<>
        <PageContainer>
            {/* Header */}
            <Header>
                <Typography variant="h6" fontWeight={600}>
                    User Management
                </Typography>

                <Button variant="contained" onClick={handleCreate}>
                    Create User
                </Button>
            </Header>

            {/* Table */}
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
            </Box>
        </PageContainer>
        <UserFormModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            onSubmit={handleSubmit}
            roles={roles}
            loading={submitLoading}
            initialData={selectedUser}
        />
    </>
    );
};

export default UserPage;