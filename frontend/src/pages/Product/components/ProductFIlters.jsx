import { Stack, TextField, MenuItem } from "@mui/material";

const ProductFilters = ({ filter, setFilter }) => {
    return (
        <Stack direction="row" spacing={2} mt={2}>
            <TextField placeholder="mobile" label="Search products" size="small" value={filter.search} onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))} />

            <TextField select label="Category" size="small" sx={{ minWidth: 150 }} value={filter.category} onChange={(e) => setFilter((prev) => ({ ...prev, category: e.target.value }))}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Clothing">Clothing</MenuItem>
            </TextField>

            <TextField select label="Status" size="small" sx={{ minWidth: 150 }}
                value={filter.status} onChange={(e) => setFilter((prev) => ({ ...prev, status: e.target.value }))}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
        </Stack>
    );
};

export default ProductFilters;