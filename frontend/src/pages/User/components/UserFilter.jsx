import { Box, Button, MenuItem, TextField } from "@mui/material"
import { USER_ROLES } from "../../../utils/constants"


const UserFilter = ({ filters, setFilters }) => {

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
                    <MenuItem value="">All</MenuItem>
                    {Object.entries(USER_ROLES).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                            {value}
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
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="blocked">Blocked</MenuItem>
                </TextField>

                {/* 🔄 Reset */}
                <Button
                    variant="outlined"
                    onClick={() =>
                        setFilters({
                            search: "",
                            role: "",
                            status: "",
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