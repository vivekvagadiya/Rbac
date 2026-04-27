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
import { createUser, getAllUsers, updateUser } from "../../api/user.api";
import DeleteIcon from "@mui/icons-material/Delete";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import UserFormModal from "./components/UserFormModal";
import UserTable from "./components/UserTable";
import UserFilter from "./components/UserFilter";
import { useDebounce } from "../../hooks/debounce.hook";


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



// ================== Component ==================

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({
        search: "",
        role: "",
        status: "",
    });
    const debouncedSearch = useDebounce(filters.search, 500);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);

            const params = {
                ...(debouncedSearch && { search: debouncedSearch }),
                ...(filters.role && { role: filters.role }),
                ...(filters.status && { status: filters.status }),
                page: page + 1,
                limit: rowsPerPage,
            };

            const res = await getAllUsers(params);

            setUsers(res?.data || []);
            setTotal(res?.meta?.total || 0);
        } catch (err) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, filters.role, filters.status, page, rowsPerPage]);
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
                await updateUser(selectedUser._id, payload);
                toast.success("User updated");
            } else {
                const response=await createUser(payload);
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

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };


    return (<>
        <PageContainer sx={{ p: 2 }}>
            {/* Header */}
            <Header>
                <Typography variant="h6" fontWeight={600}>
                    User Management
                </Typography>

                <Button variant="contained" onClick={handleCreate}>
                    Create User
                </Button>   
            </Header>

            <UserFilter filters={filters} setFilters={(val)=>{setFilters(val);setPage(0)}} />

            {/* Table */}
            <UserTable
                loading={loading}
                users={users}
                page={page}
                handleEdit={handleEdit}
                rowsPerPage={rowsPerPage}
                total={total}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage} />

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