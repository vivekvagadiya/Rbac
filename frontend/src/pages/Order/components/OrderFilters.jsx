import { 
  TextField, 
  MenuItem, 
  Stack, 
  InputAdornment, 
  Box, 
  Button, 
  alpha, 
  styled 
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

// --- Styled Components ---

const FilterBar = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.grey[100], 0.5),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(3),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: theme.palette.background.paper,
    "&:hover": {
      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.05)}`,
    },
  },
}));

// --- Constants ---

const statusOptions = [
  { label: "All Status", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

// --- Main Component ---

const OrderFilters = ({ filters, setFilters }) => {
  
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({ search: "", status: "all" });
  };

  return (
    <FilterBar>
      <Stack 
        direction={{ xs: "column", sm: "row" }} 
        spacing={2} 
        alignItems="center"
      >
        {/* 🔍 Search Input */}
        <StyledTextField
          fullWidth
          size="small"
          label="Search Order ID or User"
          placeholder="Try 'ORD-123' or 'John Doe'..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />

        {/* 🚦 Status Dropdown */}
        <StyledTextField
          select
          size="small"
          label="Filter Status"
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          sx={{ minWidth: { xs: "100%", sm: 200 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterListRoundedIcon sx={{ color: "text.disabled", fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
        >
          {statusOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value} sx={{ py: 1 }}>
              {opt.label}
            </MenuItem>
          ))}
        </StyledTextField>

        {/* 🔄 Reset Action */}
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleReset}
          startIcon={<RestartAltRoundedIcon />}
          sx={{ 
            borderRadius: "12px", 
            textTransform: "none", 
            fontWeight: 700,
            px: 3,
            height: "40px",
            borderColor: "divider",
            whiteSpace: "nowrap"
          }}
        >
          Clear
        </Button>
      </Stack>
    </FilterBar>
  );
};

export default OrderFilters;