import { Box, Button, MenuItem, TextField } from "@mui/material"
import { USER_ROLES } from "../../../utils/constants"


const UserFilter = ({ filters, setFilters, roles }) => {
    const getRoleOptions = roles?.map((item) => ({ label: item.name, value: item?._id })) || []
    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    mb: 2,
                }}
            >
                {/* 🔍 Search */}
                <TextField
                    size="small"
                    placeholder="Search name or email"
                    value={filters.search}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            search: e.target.value,
                        }))
                    }
                />

                {/* 🎭 Role */}
                <TextField
                    select
                    size="small"
                    label="Role"
                    value={filters.role}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            role: e.target.value,
                        }))
                    }
                    sx={{ minWidth: 150 }}
                >
                    <MenuItem value="all">All</MenuItem>
                    {getRoleOptions.map((option) => (
                        <MenuItem key={option.value} value={option.label}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                {/* 📌 Status */}
                <TextField
                    select
                    size="small"
                    label="Status"
                    value={filters.status}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            status: e.target.value,
                        }))
                    }
                    sx={{ minWidth: 150 }}
                >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="blocked">Blocked</MenuItem>
                    <MenuItem value="deleted">Deleted</MenuItem>
                </TextField>

                {/* 🔄 Reset */}
                <Button
                    variant="outlined"
                    onClick={() =>
                        setFilters({
                            search: "",
                            role: "all",
                            status: "all",
                        })
                    }
                >
                    Reset
                </Button>
            </Box>
        </>
    )
}

export default UserFilter;