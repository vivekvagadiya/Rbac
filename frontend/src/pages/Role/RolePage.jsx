import { Box, Button } from "@mui/material";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createRole, getRoles, updateRole } from "../../api/role.api";
import { groupPermissions } from "./helper";

import RoleTable from "./components/RoleTable";
import RoleFormModal from "./components/RoleFormModal";
import { getPermissions } from "../../api/permissions.api";

const RolePage = () => {
    const [roles, setRoles] = useState([]);
    const [groupedPermissions, setGroupedPermissions] = useState({});
    const [open, setOpen] = useState(false);
    const [permissions, setPermissions] = useState([])
    const [selectedRole, setSelectedRole] = useState(null);
    console.log('selectedRole', selectedRole);

    const fetchRoles = async () => {
        try {
            const roleRes = await getRoles();
            const permissionRes = await getPermissions();

            const roleData = roleRes?.data || [];
            const permissionData = permissionRes?.data || [];

            setRoles(roleData);

            // ✅ store permissions
            setPermissions(permissionData);

            // ✅ directly use fresh data (NOT state)
            const grouped = groupPermissions(permissionData);
            setGroupedPermissions(grouped);

        } catch {
            toast.error("failed to fetch roles");
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

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                        setSelectedRole(null);
                        setOpen(true);
                    }}
                >
                    Create Role
                </Button>
            </Box>

            <RoleTable
                roles={roles}
                onEdit={(role) => {
                    setSelectedRole(role);
                    setOpen(true);
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
        </Box>
    );
};

export default RolePage;