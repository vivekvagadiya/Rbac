import { TextField, MenuItem } from "@mui/material";
import { FiltersContainer } from "../styles";

const statusOptions = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const OrderFilters = ({ filters, setFilters }) => {
  return (
    <FiltersContainer>
      <TextField
        size="small"
        label="Search Order / User"
        value={filters.search}
        onChange={(e) =>
          setFilters({ ...filters, search: e.target.value })
        }
      />

      <TextField
        size="small"
        select
        label="Status"
        value={filters.status}
        onChange={(e) =>
          setFilters({ ...filters, status: e.target.value })
        }
        sx={{ minWidth: 180 }}
      >
        {statusOptions.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>
    </FiltersContainer>
  );
};

export default OrderFilters;