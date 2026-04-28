import { Box, Button } from "@mui/material";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getRoles } from "../../api/role.api";
import { groupPermissions } from "./helper";

import RoleTable from "./components/RoleTable";
import RoleFormModal from "./components/RoleFormModal";

const RolePage = () => {
    const [roles, setRoles] = useState([]);
    const [groupedPermissions, setGroupedPermissions] = useState({});
    const [open, setOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    console.log('groupPermissions', groupedPermissions);


    const fetchRoles = async () => {
        try {
            const res = await getRoles();
            const roleData = res?.data || [];

            setRoles(roleData);

            const allPermissions = roleData.flatMap((r) => r.permissions);
            console.log('allPermissions', allPermissions);


            const uniquePermissions = Array.from(
                new Map(allPermissions.map((p) => [p._id, p])).values()
            );
            console.log('uniquePermissions', uniquePermissions);


            setGroupedPermissions(groupPermissions(uniquePermissions));
        } catch {
            toast.error("failed to fetch roles");
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
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
                    console.log("submit", data);
                    setOpen(false);
                }}
            />
        </Box>
    );
};

export default RolePage;