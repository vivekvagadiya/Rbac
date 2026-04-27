import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    TextField,
    Button,
    Chip,
    Stack,
    MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
// import AddPermissionModal from "./components/AddPermissionModal";

const PageContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
}));

const Header = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
});

const CardWrapper = styled(Card)({
    borderRadius: 12,
    height: "100%", // 🔥 makes all cards equal height
    minWidth: "250px",
    display: "flex",
    flexDirection: "column",
});

const CardInner = styled(CardContent)({
    display: "flex",
    flexDirection: "column",
    height: "100%",
});

const PermissionItem = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(1),
    borderRadius: 8,
    backgroundColor: theme.palette.grey[100],
}));

// ---------------- MOCK DATA ----------------
const modules = [
    {
        title: "User Management",
        permissions: [
            { label: "Create User", type: "create" },
            { label: "View User", type: "read" },
            { label: "Update User", type: "update" },
            { label: "Delete User", type: "delete" },
        ],
    },
    {
        title: "User Management",
        permissions: [
            { label: "Create User", type: "create" },
            { label: "View User", type: "read" },
            { label: "Update User", type: "update" },
            { label: "Delete User", type: "delete" },
        ],
    },
    {
        title: "User Management",
        permissions: [
            { label: "Create User", type: "create" },
            { label: "View User", type: "read" },
            { label: "Update User", type: "update" },
            { label: "Delete User", type: "delete" },
        ],
    },
    {
        title: "User Management",
        permissions: [
            { label: "Create User", type: "create" },
            { label: "View User", type: "read" },
            { label: "Update User", type: "update" },
            { label: "Delete User", type: "delete" },
        ],
    },
    {
        title: "Role Management",
        permissions: [
            { label: "Create Role", type: "create" },
            { label: "View Role", type: "read" },
            { label: "Update Role", type: "update" },
            { label: "Delete Role", type: "delete" },
        ],
    },
    {
        title: "Role Management",
        permissions: [
            { label: "Create Role", type: "create" },
            { label: "View Role", type: "read" },
            { label: "Update Role", type: "update" },
            { label: "Delete Role", type: "delete" },
        ],
    },
    {
        title: "Product Management",
        permissions: [
            { label: "Create Product", type: "create" },
            { label: "View Product", type: "read" },
            { label: "Update Product", type: "update" },
            { label: "Delete Product", type: "delete" },
        ],
    },
];

// ---------------- HELPERS ----------------
const getColor = (type) => {
    switch (type) {
        case "create":
            return "success";
        case "read":
            return "primary";
        case "update":
            return "warning";
        case "delete":
            return "error";
        default:
            return "default";
    }
};

// ---------------- COMPONENT ----------------
const PermissionPage = () => {
    const [open, setOpen] = useState(false);

    return (
        <PageContainer>
            {/* Header */}
            <Header>
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Permissions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage system permissions
                    </Typography>
                </Box>

                <Stack direction="row" spacing={2}>
                    <TextField size="small" placeholder="Search permission..." />

                    <TextField select size="small" label="Module">
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="role">Role</MenuItem>
                    </TextField>

                    <TextField select size="small" label="Action">
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="create">Create</MenuItem>
                        <MenuItem value="read">Read</MenuItem>
                    </TextField>

                    <Button variant="contained" onClick={() => setOpen(true)}>+ Add Permission</Button>
                </Stack>
            </Header>

            {/* Cards */}
            <Grid container spacing={3} width='100%' >
                {modules.map((module, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <CardWrapper>
                            <CardInner>
                                <Typography variant="h6" mb={2}>
                                    {module.title}
                                </Typography>

                                <Stack spacing={2} flexGrow={1}>
                                    {module.permissions.map((perm, i) => (
                                        <PermissionItem key={i}>
                                            <Typography variant="body2">
                                                {perm.label}
                                            </Typography>

                                            <Chip
                                                label={perm.type.toUpperCase()}
                                                color={getColor(perm.type)}
                                                size="small"
                                            />
                                        </PermissionItem>
                                    ))}
                                </Stack>
                            </CardInner>
                        </CardWrapper>
                    </Grid>
                ))}
            </Grid>
            {/* <AddPermissionModal
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={(data) => {
                    console.log("Payload:", data);
                    // 👉 call API here
                }}
            /> */}

        </PageContainer>
    );
};

export default PermissionPage;