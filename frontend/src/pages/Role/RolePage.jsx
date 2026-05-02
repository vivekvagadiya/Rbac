import { Box, Button, styled, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createRole, deleteRole, getRoles, updateRole } from "../../api/role.api";
import { groupPermissions } from "./helper";

import RoleTable from "./components/RoleTable";
import RoleFormModal from "./components/RoleFormModal";
import { getPermissions } from "../../api/permissions.api";
import RoleDeleteModal from "./components/RoleDeleteModal";
import usePermission from "../../hooks/permission.hook";

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

const RolePage = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false)
    const [groupedPermissions, setGroupedPermissions] = useState({});
    const [open, setOpen] = useState(false);
    const [permissions, setPermissions] = useState([])
    const [selectedRole, setSelectedRole] = useState(null);
    const [delOpen, setDelOpen] = useState(false);
    const { hasPermission } = usePermission();  

    const fetchRoles = async () => {
        try {
            setLoading(true)
            const roleRes = await getRoles();
            const permissionRes = await getPermissions();

            const roleData = roleRes?.data || [];
            const permissionData = permissionRes?.data || [];

            setRoles(roleData);

            setPermissions(permissionData);

            const grouped = groupPermissions(permissionData);
            setGroupedPermissions(grouped);

        } catch {
            toast.error("failed to fetch roles");
        } finally {
            setLoading(false)
        }
    };


    useEffect(() => {
        fetchRoles();
    }, []);

    const handleRoleSubmit = async (data) => {
        try {
            if (selectedRole) {
                const response = await updateRole(selectedRole._id, data);
                toast.success(response?.message)
                console.log('response', response);

            } else {
                const response = await createRole(data);
                toast.success(response?.message);
            }
            fetchRoles();
        } catch (error) {
            toast.error(error?.message || "failed to submit role")

        }
    }

    const handleDelete = async (id) => {
        try {
            const response = await deleteRole(id);
            fetchRoles();
            toast.success(response?.message)
        } catch (error) {
            toast.error(error?.message || "failed")

        }
    }

    return (
        <Box sx={{ p: 3 }}>
            <Header>
                <Typography variant="h6">Role</Typography>
                {hasPermission('role.create') && (

                    <Button
                        variant="contained"
                        onClick={() => {
                            setSelectedRole(null);
                            setOpen(true);
                        }}
                    >
                        Create Role
                    </Button>
                )}
            </Header>

            <RoleTable
                roles={roles}
                loading={loading}
                onEdit={(role) => {
                    setSelectedRole(role);
                    setOpen(true);
                }}
                onDelete={(role) => {
                    setSelectedRole(role);
                    setDelOpen(true);
                }}
            />

            <RoleFormModal
                open={open}
                onClose={() => setOpen(false)}
                groupedPermissions={groupedPermissions}
                role={selectedRole}
                onSubmit={(data) => {
                    handleRoleSubmit(data)
                    setOpen(false);
                }}
            />
            <RoleDeleteModal
                open={delOpen}
                onClose={() => setDelOpen(false)}
                role={selectedRole}
                onDelete={(id) => {
                    setDelOpen(false);
                    handleDelete(id);
                }}
            />
        </Box>
    );
};

export default RolePage;